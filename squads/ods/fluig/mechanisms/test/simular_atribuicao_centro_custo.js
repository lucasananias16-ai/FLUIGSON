// Executa o mecanismo fora do Fluig com dados simulados.
// Uso: node test/simular_atribuicao_centro_custo.js atribuicao_centro_custo_test.js
const fs = require('fs'), vm = require('vm');
const arquivo = process.argv[2];

function rodar(nome, { etapa = 12, card, aprovadores, usuarios }) {
  const ds = (rows) => ({ rowsCount: rows.length, getValue: (i, c) => rows[i][c] });
  const consultas = [];
  const ctx = {
    log: { info() {}, warn: (m) => console.log('   warn:', m), error: (m) => console.log('   error:', m) },
    java: { util: { ArrayList: class extends Array { add(x) { this.push(x); } contains(x) { return this.includes(x); } isEmpty() { return this.length === 0; } toString() { return this.join(','); } } } },
    ConstraintType: { MUST: 'MUST' },
    hAPI: { getCardValue: (c) => card[c] },
    DatasetFactory: {
      createConstraint: (f, v) => ({ f, v }),
      getDataset: (id, fields, cons) => {
        const c = Object.fromEntries((cons || []).map((k) => [k.f, k.v]));
        consultas.push(id + ' ' + JSON.stringify(c));
        if (id === 'dts_consultUsuariosPosicoes') return ds(aprovadores.filter((a) => c.ATIVO !== 'Sim' || a.ativo === 'Sim'));
        if (id === 'colleague') return ds(usuarios.filter((u) => u.mail === c.mail && u.active === 'true').map((u) => ({ 'colleaguePK.colleagueId': u.id })));
      },
    },
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(arquivo, 'utf8'), ctx);
  try {
    const r = ctx.resolve({ chosenState: { processStatePK: { sequence: etapa } } }, null);
    console.log('✔ ' + nome + ' → ' + JSON.stringify([...r]));
  } catch (e) {
    console.log('✖ ' + nome + ' → ERRO: ' + e);
  }
  return consultas;
}

const card = { hd_codCCusto: 'FLU1G', txt_valTotalPc: '30000', txt_dadosPc_moeda: '2' };
const usuarios = [
  { id: '000086', mail: 'e.fragoso@odsenergysolutions.com', active: 'true' },
  { id: '000161', mail: 'l.pompeu@odsenergysolutions.com', active: 'true' },
];
rodar('PRIO TIGRIS hoje (sem aprovador)', { card, aprovadores: [], usuarios });
rodar('aprovador ativo encontrado', { card, aprovadores: [{ usrPos_email: 'e.fragoso@odsenergysolutions.com', ativo: 'Sim' }], usuarios });
rodar('aprovador só inativo (Ativo = Não)', { card, aprovadores: [{ usrPos_email: 'e.fragoso@odsenergysolutions.com', ativo: 'Não' }], usuarios });
rodar('e-mail sem usuário Fluig', { card, aprovadores: [{ usrPos_email: 'x@ods.com', ativo: 'Sim' }], usuarios });
rodar('moeda inválida (valor padrão do HTML)', { card: { ...card, txt_dadosPc_moeda: 'Package Estrutura Metálica' }, aprovadores: [], usuarios });
rodar('atividade que não é aprovação', { etapa: 32, card, aprovadores: [], usuarios });
const q = rodar('nível 3 (atividade 20)', { etapa: 20, card, aprovadores: [{ usrPos_email: 'l.pompeu@odsenergysolutions.com', ativo: 'Sim' }], usuarios });
console.log('   consulta:', q[0]);
