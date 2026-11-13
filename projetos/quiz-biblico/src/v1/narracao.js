'use strict';
/**
 * Vídeo 1 — gera a narração com a voz escolhida.
 *
 * Uso: GOOGLE_APPLICATION_CREDENTIALS=<chave.json> node src/v1/narracao.js [ids...] [--refazer] [--nova-tomada]
 *
 * Sem ids, gera o que ainda não existe. `--refazer` monta de novo os ids
 * pedidos (ou tudo) a partir das tomadas já gravadas em _rascunho/narracao;
 * `--nova-tomada` pede uma gravação nova ao serviço. Cada fala é gravada em
 * v1-arca-de-noe/narracao/<id>.wav e os tempos vão para narracao.json, que a
 * animação usa para sincronizar.
 *
 * A voz é generativa: cada gravação nova sai um pouco diferente. Por isso os
 * áudios aprovados ficam guardados no repositório.
 *
 * De cada fala são gravadas três tomadas; fica a que passa na conferência
 * (duração, pausas) e, entre essas, a de animação mais próxima da amostra
 * aprovada.
 *
 * Nas perguntas, a frase inteira é gerada de uma vez (para a entonação ficar
 * natural) e depois cortada nas pausas: pergunta, opção 1, opção 2 e opção 3.
 * Entre as partes entra um silêncio fixo, que é o tempo de cada card virar.
 */
const fs = require('fs');
const path = require('path');
const A = require('../audio');
const { synth } = require('../tts');
const roteiro = require('./roteiro');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'v1-arca-de-noe', 'narracao');
const TAKES = path.join(ROOT, '_rascunho', 'narracao');
const MANIFEST = path.join(OUT, 'narracao.json');
const SR = 24000; // taxa nativa da voz
const PAUSA_PERGUNTA = 0.9; // depois da pergunta, antes da primeira opção
const PAUSA_OPCAO = 1.0; // entre uma opção e outra
const TENTATIVAS = 3;
const ESTILO = roteiro.voz.estilo || 'neutra';

/**
 * Texto que vai para a voz. As palavras são as do roteiro; no estilo
 * "animada" só a pontuação ganha ênfase, e a voz responde ficando mais
 * empolgada (medido: cerca de 1 semitom mais aguda, com mais variação).
 */
function textoParaVoz(fala) {
  if (fala.vozTexto) return fala.vozTexto; // texto de voz escrito à mão para esta fala
  if (ESTILO !== 'animada') return fala.texto;
  return fala.texto
    .replace(/\.\.\./g, '\u2026') // preserva as reticências, que marcam as pausas
    .replace(/!/g, '!!')
    .replace(/\.(\s|$)/g, '!$1')
    .replace(/\?/g, fala.tipo === 'pergunta' ? '?!' : '?')
    .replace(/\u2026/g, '...');
}

// Altura da voz na amostra aprovada (F). Entre as tomadas boas, fica a mais
// próxima dela, para a animação ser a mesma do começo ao fim do vídeo.
const ALTURA_ALVO = 248;

/** Distância, em semitons, entre a altura da voz da tomada e o alvo. */
function distanciaDoAlvo(wav) {
  const p = A.pitchStats(wav.data, wav.rate);
  return p.mediana ? Math.abs(12 * Math.log2(p.mediana / ALTURA_ALVO)) : 99;
}

function falas() {
  const lista = [{ id: 'v1_abertura', texto: roteiro.abertura, tipo: 'fala' }];
  for (const n of Object.keys(roteiro.perguntas)) {
    lista.push({ id: `v1_p${n}_pergunta`, texto: roteiro.perguntas[n].pergunta, tipo: 'pergunta' });
    lista.push({ id: `v1_p${n}_resposta`, texto: roteiro.perguntas[n].resposta, tipo: 'fala', vozTexto: roteiro.perguntas[n].respostaVoz });
  }
  lista.push({ id: 'v1_encerramento', texto: roteiro.encerramento, tipo: 'fala' });
  return lista;
}

/** Ajusta o volume: mesma intensidade de fala em todos os áudios, sem estourar. */
function nivelar(data, rate) {
  const env = A.envelope(data, rate, 0.02).values;
  const loud = Array.from(env).filter((v) => v > 0.02);
  const rms = Math.sqrt(loud.reduce((a, v) => a + v * v, 0) / Math.max(1, loud.length));
  const gain = Math.min(0.126 / rms, 0.9 / A.peak(data)); // alvo: -18 dB RMS, pico até -1 dB
  return data.map((v) => v * gain);
}

/** Examina uma tomada e devolve os problemas encontrados (lista vazia = boa). */
function avaliar(fala, wav) {
  const { data, rate } = wav;
  const dur = data.length / rate;
  const n = fala.texto.length;
  const problemas = [];
  if (dur < n / 24 || dur > n / 8) problemas.push(`duração estranha (${dur.toFixed(1)} s para ${n} caracteres)`);
  if (fala.tipo === 'pergunta') {
    const partes = A.splitParts(data, rate, 4);
    if (partes.length !== 4) return { problemas: problemas.concat(`achei ${partes.length} partes em vez de 4`), partes };
    const pausas = partes.slice(1).map((p, i) => p.start - partes[i].end);
    if (Math.min(...pausas) < 0.15) problemas.push(`pausa curta entre as opções (${Math.min(...pausas).toFixed(2)} s)`);
    partes.slice(1).forEach((p, i) => {
      const d = p.end - p.start;
      if (d < 0.25 || d > 2.6) problemas.push(`opção ${i + 1} com ${d.toFixed(2)} s`);
    });
    return { problemas, partes };
  }
  const segs = A.speechSegments(data, rate, { minPause: 0.06, pad: 0 }).filter((s) => s.end - s.start >= 0.05);
  const maior = segs.slice(1).reduce((m, s, i) => Math.max(m, s.start - segs[i].end), 0);
  if (maior > 1.3) problemas.push(`silêncio de ${maior.toFixed(1)} s no meio da fala`);
  return { problemas, partes: null };
}

/** Monta o áudio final de uma fala e devolve os tempos dela. */
function montar(fala, wav, partes) {
  const { data, rate } = wav;
  const total = data.length / rate;
  let final;
  let marcas = null;
  if (fala.tipo === 'pergunta') {
    const seq = [];
    marcas = [];
    let t = 0;
    partes.forEach((p, i) => {
      const trecho = A.fadeEdges(A.slice(data, rate, Math.max(0, p.start - 0.04), Math.min(total, p.end + 0.04)), rate);
      marcas.push({ ini: +t.toFixed(3), fim: +(t + trecho.length / rate).toFixed(3) });
      seq.push(trecho);
      t += trecho.length / rate;
      if (i < partes.length - 1) {
        const pausa = i === 0 ? PAUSA_PERGUNTA : PAUSA_OPCAO;
        seq.push(A.silence(pausa, rate));
        t += pausa;
      }
    });
    final = A.concat(seq);
  } else {
    final = A.fadeEdges(A.trim(data, rate), rate);
  }
  final = nivelar(final, rate);
  A.writeWav(path.join(OUT, `${fala.id}.wav`), final, rate);
  const info = { texto: fala.texto, dur: +(final.length / rate).toFixed(3) };
  if (marcas) info.partes = marcas; // [pergunta, opção 1, opção 2, opção 3]
  return info;
}

(async () => {
  const args = process.argv.slice(2);
  const novaTomada = args.includes('--nova-tomada');
  const refazer = args.includes('--refazer') || novaTomada;
  const ids = args.filter((a) => !a.startsWith('--'));
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(TAKES, { recursive: true });
  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : { voz: roteiro.voz, falas: {} };
  manifest.voz = roteiro.voz;

  for (const fala of falas()) {
    if (ids.length && !ids.includes(fala.id)) continue;
    const pronto = fs.existsSync(path.join(OUT, `${fala.id}.wav`)) && manifest.falas[fala.id] && manifest.falas[fala.id].estilo === ESTILO;
    if (pronto && !refazer) continue;

    // Uma tomada que você já ouviu e aprovou tem prioridade: <id>_<estilo>_aprovada.wav
    const aprovada = path.join(TAKES, `${fala.id}_${ESTILO}_aprovada.wav`);
    const candidatas = [];
    if (fs.existsSync(aprovada) && !novaTomada) {
      const wav = A.readWav(aprovada);
      candidatas.push({ k: 'aprovada', wav, av: avaliar(fala, wav), nota: 0 });
    } else {
      for (let k = 1; k <= TENTATIVAS; k++) {
        const arq = path.join(TAKES, `${fala.id}_${ESTILO}_t${k}.wav`);
        if (novaTomada || !fs.existsSync(arq)) {
          await synth({ voice: roteiro.voz.nome, text: textoParaVoz(fala), rate: roteiro.voz.velocidade, sampleRate: SR, out: arq });
        }
        const wav = A.readWav(arq);
        candidatas.push({ k, wav, av: avaliar(fala, wav), nota: distanciaDoAlvo(wav) });
      }
    }
    // a melhor tomada é a que tem menos problemas e, no empate, a mais próxima do nível aprovado
    candidatas.sort((a, b) => a.av.problemas.length - b.av.problemas.length || a.nota - b.nota);
    const melhor = candidatas[0];
    const utilizavel = fala.tipo !== 'pergunta' || (melhor.av.partes && melhor.av.partes.length === 4);
    if (!utilizavel) {
      console.log(`FALHOU ${fala.id}: ${melhor.av.problemas.join('; ')}`);
      continue;
    }
    manifest.falas[fala.id] = Object.assign(montar(fala, melhor.wav, melhor.av.partes), { estilo: ESTILO });
    const aviso = melhor.av.problemas.length ? `  ATENÇÃO: ${melhor.av.problemas.join('; ')}` : '';
    const p = A.pitchStats(melhor.wav.data, melhor.wav.rate);
    console.log(`${fala.id.padEnd(18)} tomada ${String(melhor.k).padEnd(8)} ${manifest.falas[fala.id].dur.toFixed(2).padStart(5)} s  voz ${p.mediana.toFixed(0)} Hz${aviso}`);
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  const total = Object.values(manifest.falas).reduce((a, f) => a + f.dur, 0);
  console.log(`${Object.keys(manifest.falas).length} falas, ${total.toFixed(1)} s de narração`);
})().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
