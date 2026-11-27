// Executa o dts_getColabProtheus_JYNX_test fora do Fluig com resposta simulada do Protheus.
// Uso: node test/simular_dts_getColabProtheus.js dts_getColabProtheus_JYNX_test.js [usuario]
const fs = require('fs'), vm = require('vm');
const linhas = ['HEADER',
  '000117;ludmila.oliveira;Ludmila Oliveira;l.oliveira@odsenergysolutions.com;Fiscal;Analista Fiscal;2;000099;F.01;FISCAL;0123;ANALISTA CONTABIL;;',
  '000161;licyara.pompeu;Licyara Pompeu;l.pompeu@odsenergysolutions.com;Fiscal;Analista Fiscal;2;;;;;;;',
  '000201;semdepto;Sem Depto;sd@ods.com;;;2;;;;;;;',
  '000200;fulano;Fulano Bloqueado;fulano@ods.com;TI;Analista;1;000300;T.01;TI;0456;ANALISTA TI;F;'];
const rows = [], cols = [];
let sql = '';
const ctx = {
  log: { info: (m) => console.log('log:', m), warn: (m) => console.log('warn:', m), error: (m) => console.log('error:', m) },
  getValue: (k) => (k === 'WKUser' ? (process.argv[3] || 'admin') : null),
  DatasetBuilder: { newDataset: () => ({ addColumn: (c) => cols.push(c), addRow: (r) => rows.push(r) }) },
  DatasetFactory: { getDataset: () => ({ getValue: () => 'x' }) },
  ServiceManager: { getService: () => ({
    instantiate: () => ({ getINTERFACEMFXSOAP: () => ({}), setCUSER() {}, setCPASSW() {}, setCKEY() {} }),
    getBasicAuthenticatedClient: () => ({ execqry: (l, c, q, w, o) => { sql = q + ' ' + w + ' ' + o; return { getSTRING: () => ({ toArray: () => linhas }) }; } }),
  }) },
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[2], 'utf8'), ctx);
ctx.createDataset(null, null, null);
console.log('colunas:', cols.length, cols.join(','));
rows.forEach((r) => { const o = Object.fromEntries(cols.map((c, i) => [c, r[i]])); console.log(JSON.stringify({ NOME: o.NOME, MATRICULA: o.MATRICULA, DEPARTAMENTO_COD: o.DEPARTAMENTO_COD, DEPARTAMENTO_DESC: o.DEPARTAMENTO_DESC, FUNCAO_DESC: o.FUNCAO_DESC, SITUACAO_DESC: o.SITUACAO_DESC, BLOQUEADO: o.BLOQUEADO, ORIGEM: o.ORIGEM_MATRICULA })); });
console.log('linhas:', rows.length, '| SQL tem OUTER APPLY:', /OUTER APPLY/.test(sql), '| filtra demitido:', /RA_SITFOLH <> 'D'/.test(sql));
