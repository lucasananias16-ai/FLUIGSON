'use strict';
// Servidor SOAP simulado com a foto do Fluig DEV da ODS (26/11/2026).
// Serve só para validar o teste E2E sem acesso ao Fluig: responde ECMDatasetService.getDataset
// e reproduz a lógica do dts_consultUsuariosPosicoes (junção Usuário x Posição com Alçada
// por código da posição + subcategoria, filtro de C. Custo por LIKE e limite por moeda).
//
//   node tests/e2e/mock/servidor-mock.js            → sobe em http://127.0.0.1:8089

const http = require('node:http');
const path = require('node:path');
const { _internal } = require('../fluig-soap');
const { children, unesc, esc } = _internal;

const snap = require(path.join(__dirname, 'snapshot-dev-2026-11-26.json'));
const num = (s) => Number(String(s || '0').replace(/\./g, '').replace(',', '.')) || 0;

function consultUsuariosPosicoes(c) {
  const tipo = (c.TIPO_LIMITE || 'PROC').toUpperCase();
  const moeda = c.MOEDA || '1';
  const campo = 'txt_limit' + (tipo === 'INV' ? 'Inv' : 'Proc') + (moeda === '2' ? 'Usd' : 'Brl');
  const rows = [];
  for (const u of snap.dsUserPosicao) {
    // MySQL com collation case-insensitive na junção da subcategoria
    for (const a of snap.dsConfigAlcadPosic) {
      if (a.txt_codPosicao !== u.txt_codPosicao) continue;
      if (String(a.txt_subCategoria).toLowerCase() !== String(u.usrPos_subCat).toLowerCase()) continue;
      if (c.COD_CCUSTO && !String(u.txt_codCCusto).includes(c.COD_CCUSTO)) continue;
      if (c.NIVEL && a.txt_sequenceLvl !== c.NIVEL) continue;
      const lim = /ilimitado|unlimited/i.test(a[campo]) ? 1e15 : num(a[campo]);
      const valor = c.VALOR_LIMITE ?? c.VALOR_TOTAL;
      if (valor !== undefined && lim < Number(String(valor).replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'))) continue;
      rows.push({ ...u, [campo]: a[campo], txt_sequenceLvl: a.txt_sequenceLvl });
    }
  }
  return rows;
}

function dataset(name, c) {
  switch (name) {
    case 'dts_getPedidoCompra_JYNX':
      return snap[name].filter((r) => !c.C7_NUM || r.C7_NUM === c.C7_NUM);
    case 'dts_getPedidosCompra_JYNX':
      return snap[name][c.C7_NUM] || [];
    case 'dts_getPedidoVenda_JYNX':
    case 'dsUserPosicao':
    case 'dsConfigAlcadPosic':
      return snap[name];
    case 'dts_consultUsuariosPosicoes':
      return consultUsuariosPosicoes(c);
    default:
      return null;
  }
}

function resposta(rows) {
  const cols = rows.length ? Object.keys(rows[0]) : [];
  const body =
    cols.map((k) => '<columns>' + esc(k) + '</columns>').join('') +
    rows.map((r) => '<values>' + cols.map((k) =>
      // Igual ao Fluig real: nulo vem como elemento vazio com xsi:nil.
      r[k] === null || r[k] === undefined
        ? '<value xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/>'
        : '<value xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">' + esc(r[k]) + '</value>'
    ).join('') + '</values>').join('');
  return (
    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>' +
    '<ns1:getDatasetResponse xmlns:ns1="http://ws.dataservice.ecm.technology.totvs.com/"><dataset>' +
    body + '</dataset></ns1:getDatasetResponse></soap:Body></soap:Envelope>'
  );
}

function fault(msg) {
  return '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><soap:Fault><faultcode>soap:Server</faultcode><faultstring>' + esc(msg) + '</faultstring></soap:Fault></soap:Body></soap:Envelope>';
}

function criarServidor() {
  return http.createServer((req, res) => {
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      res.setHeader('Content-Type', 'text/xml; charset=utf-8');
      if (!req.url.endsWith('/webdesk/ECMDatasetService')) return res.end(fault('mock: serviço não simulado ' + req.url));
      const name = unesc(children(body, 'name')[0] || '');
      const c = {};
      for (const item of children(children(body, 'constraints')[0] || '', 'item')) {
        c[unesc(children(item, 'fieldName')[0])] = unesc(children(item, 'initialValue')[0] || '');
      }
      const rows = dataset(name, c);
      res.end(rows === null ? fault('mock: dataset não simulado ' + name) : resposta(rows));
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 8089);
  criarServidor().listen(port, '127.0.0.1', () => console.log('mock Fluig em http://127.0.0.1:' + port));
}

module.exports = { criarServidor };
