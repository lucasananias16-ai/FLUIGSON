'use strict';
/**
 * Gerador de narração, compartilhado pelos vídeos.
 *
 * Cada fala é gravada em <outDir>/<id>.wav e os tempos vão para
 * <outDir>/narracao.json, que a animação usa para sincronizar.
 *
 * A voz é generativa: cada gravação nova sai um pouco diferente. Por isso os
 * áudios aprovados ficam guardados no repositório.
 *
 * De cada fala são gravadas três tomadas; fica a que passa na conferência
 * (duração, pausas) e, entre essas, a de animação mais próxima da amostra
 * aprovada.
 *
 * Falas com `partes` (uma pergunta com as opções, uma contagem) são geradas
 * de uma vez, para a entonação ficar natural, e depois cortadas nas pausas.
 * Entre as partes entra o silêncio pedido em `pausas`: é o tempo de cada card
 * virar ou de cada pedrinha acender.
 *
 * Falas com vários idiomas ou vozes (o vídeo de inglês) trazem `segmentos`:
 * [{ voz: 'pt' | 'en' | 'leao'..., texto }]. Cada segmento é gravado com a voz
 * de `voz.vozes[chave]`, nivelado e emendado nos outros, e a fala segue o
 * caminho normal (conferência, partes, nível).
 *
 * Opções de linha de comando (em `args`): ids de falas, `--refazer` (monta de
 * novo a partir das tomadas guardadas) e `--nova-tomada` (pede gravações novas).
 */
const fs = require('fs');
const path = require('path');
const A = require('./audio');
const { synth } = require('./tts');

const SR = 24000; // taxa nativa da voz
const TENTATIVAS = 3;

// Altura da voz na amostra aprovada (F). Entre as tomadas boas, fica a mais
// próxima dela, para a animação ser a mesma do começo ao fim do vídeo.
const ALTURA_ALVO = 248;

/**
 * Texto que vai para a voz. As palavras são as do roteiro; no estilo
 * "animada" só a pontuação ganha ênfase, e a voz responde ficando mais
 * empolgada (medido: cerca de 1 semitom mais aguda, com mais variação).
 */
function textoParaVoz(fala, estilo) {
  if (fala.vozTexto) return fala.vozTexto; // texto de voz escrito à mão para esta fala
  if (estilo !== 'animada') return fala.texto;
  return fala.texto
    .replace(/\.\.\./g, '…') // preserva as reticências, que marcam as pausas
    .replace(/!/g, '!!')
    .replace(/\.(\s|$)/g, '!$1')
    .replace(/\?/g, fala.tipo === 'pergunta' ? '?!' : '?')
    .replace(/…/g, '...');
}

/** Distância, em semitons, entre a altura da voz da tomada e o alvo. */
function distanciaDoAlvo(wav, fala = {}) {
  if (fala.semAlvo) return 0; // fala de outra voz (um bicho): a altura da Tuti não vale
  const p = A.pitchStats(wav.data, wav.rate);
  return p.mediana ? Math.abs(12 * Math.log2(p.mediana / ALTURA_ALVO)) : 99;
}

/** Ajusta o volume: mesma intensidade de fala em todos os áudios, sem estourar. */
function nivelar(data, rate) {
  const env = A.envelope(data, rate, 0.02).values;
  const loud = Array.from(env).filter((v) => v > 0.02);
  const rms = Math.sqrt(loud.reduce((a, v) => a + v * v, 0) / Math.max(1, loud.length));
  const gain = Math.min(0.126 / rms, 0.9 / A.peak(data)); // alvo: -18 dB RMS, pico até -1 dB
  return data.map((v) => v * gain);
}

/**
 * Grava uma tomada feita de segmentos, cada um com a sua voz. A pausa entre
 * dois segmentos é curta no meio de uma frase e mais longa depois de ponto,
 * exclamação ou interrogação, para as partes de uma pergunta ficarem separadas.
 */
async function gravarSegmentos(fala, voz, estilo, arq) {
  const pecas = [];
  for (let i = 0; i < fala.segmentos.length; i++) {
    const seg = fala.segmentos[i];
    const v = voz.vozes[seg.voz];
    const tmp = arq.replace(/\.wav$/, `.s${i}.wav`);
    const texto = v.ruidoso ? seg.texto : textoParaVoz({ texto: seg.texto, tipo: fala.tipo }, estilo);
    await synth({ voice: v.nome, lang: v.lang, text: texto, rate: v.velocidade, sampleRate: SR, out: tmp });
    const w = A.readWav(tmp);
    pecas.push(nivelar(A.fadeEdges(A.trim(w.data, w.rate, 0.03), w.rate), w.rate));
    if (i < fala.segmentos.length - 1) pecas.push(A.silence(/[.!?…]\s*$/.test(seg.texto) ? 0.6 : 0.09, SR));
  }
  A.writeWav(arq, A.concat(pecas), SR);
}

/**
 * Quando cada segmento de uma tomada começa e termina na fala final (sem as
 * partes). Lê de novo os pedaços gravados, na mesma conta de `gravarSegmentos`,
 * e desconta o silêncio que `montar` corta do começo.
 */
function marcarSegmentos(fala, arq, wav) {
  const marcas = [];
  let t = 0;
  fala.segmentos.forEach((seg, i) => {
    const tmp = arq.replace(/\.wav$/, `.s${i}.wav`);
    if (!fs.existsSync(tmp)) return;
    const w = A.readWav(tmp);
    const dur = A.trim(w.data, w.rate, 0.03).length / w.rate;
    marcas.push({ voz: seg.voz, texto: seg.texto, ini: t, fim: t + dur });
    t += dur + (/[.!?…]\s*$/.test(seg.texto) ? 0.6 : 0.09);
  });
  if (marcas.length !== fala.segmentos.length) return null;
  const segs = A.speechSegments(wav.data, wav.rate, { minPause: 0.06, pad: 0 }).filter((x) => x.end - x.start >= 0.05);
  const corte = segs.length ? Math.max(0, segs[0].start - 0.04) : 0;
  return marcas.map((m) => ({ voz: m.voz, texto: m.texto, ini: +Math.max(0, m.ini - corte).toFixed(3), fim: +Math.max(0, m.fim - corte).toFixed(3) }));
}

/** Examina uma tomada e devolve os problemas encontrados (lista vazia = boa). */
function avaliar(fala, wav) {
  const { data, rate } = wav;
  const dur = data.length / rate;
  const n = fala.texto.length;
  const problemas = [];
  if (dur < n / 24 || dur > n / 8) problemas.push(`duração estranha (${dur.toFixed(1)} s para ${n} caracteres)`);
  if (fala.partes) {
    const partes = A.splitParts(data, rate, fala.partes);
    if (partes.length !== fala.partes) return { problemas: problemas.concat(`achei ${partes.length} partes em vez de ${fala.partes}`), partes };
    const pausas = partes.slice(1).map((p, i) => p.start - partes[i].end);
    if (Math.min(...pausas) < 0.15) problemas.push(`pausa curta entre as partes (${Math.min(...pausas).toFixed(2)} s)`);
    const minParte = fala.minParte === undefined ? 0.25 : fala.minParte;
    partes.slice(1).forEach((p, i) => {
      const d = p.end - p.start;
      if (d < minParte || d > 2.6) problemas.push(`parte ${i + 2} com ${d.toFixed(2)} s`);
    });
    return { problemas, partes };
  }
  const segs = A.speechSegments(data, rate, { minPause: 0.06, pad: 0 }).filter((s) => s.end - s.start >= 0.05);
  const maior = segs.slice(1).reduce((m, s, i) => Math.max(m, s.start - segs[i].end), 0);
  if (maior > 1.3) problemas.push(`silêncio de ${maior.toFixed(1)} s no meio da fala`);
  return { problemas, partes: null };
}

/** Monta o áudio final de uma fala e devolve os tempos dela. */
function montar(fala, wav, partes, outDir, arq) {
  const { data, rate } = wav;
  const total = data.length / rate;
  let final;
  let marcas = null;
  if (fala.partes) {
    const seq = [];
    marcas = [];
    let t = 0;
    partes.forEach((p, i) => {
      const trecho = A.fadeEdges(A.slice(data, rate, Math.max(0, p.start - 0.04), Math.min(total, p.end + 0.04)), rate);
      marcas.push({ ini: +t.toFixed(3), fim: +(t + trecho.length / rate).toFixed(3) });
      seq.push(trecho);
      t += trecho.length / rate;
      if (i < partes.length - 1) {
        const pausa = fala.pausas[i];
        seq.push(A.silence(pausa, rate));
        t += pausa;
      }
    });
    final = A.concat(seq);
  } else {
    final = A.fadeEdges(A.trim(data, rate), rate);
  }
  final = nivelar(final, rate);
  A.writeWav(path.join(outDir, `${fala.id}.wav`), final, rate);
  const info = { texto: fala.texto, dur: +(final.length / rate).toFixed(3) };
  if (marcas) info.partes = marcas;
  else if (fala.segmentos && arq) {
    const segs = marcarSegmentos(fala, arq, wav);
    if (segs) info.segmentos = segs; // para a animação saber quando cada palavra em inglês é dita
  }
  return info;
}

/**
 * Gera (ou monta de novo) as falas pedidas.
 * @param {object} cfg
 *  - falas: [{ id, texto, tipo: 'fala' | 'pergunta', partes?, pausas?, minParte?, vozTexto? }]
 *  - voz: { nome, velocidade, estilo }
 *  - outDir: pasta dos áudios finais; takesDir: pasta das tomadas
 *  - args: opções de linha de comando
 *  - semServico: se true, nunca chama o serviço de voz (falha se faltar tomada)
 */
async function narrar({ falas, voz, outDir, takesDir, args = [], semServico = false }) {
  const estilo = voz.estilo || 'neutra';
  const novaTomada = args.includes('--nova-tomada');
  const refazer = args.includes('--refazer') || novaTomada;
  const ids = args.filter((a) => !a.startsWith('--'));
  const manifestFile = path.join(outDir, 'narracao.json');
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(takesDir, { recursive: true });
  const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : { voz, falas: {} };
  manifest.voz = voz;

  for (const fala of falas) {
    if (ids.length && !ids.includes(fala.id)) continue;
    const pronto = fs.existsSync(path.join(outDir, `${fala.id}.wav`)) && manifest.falas[fala.id] && manifest.falas[fala.id].estilo === estilo;
    if (pronto && !refazer) continue;

    // Uma tomada que você já ouviu e aprovou tem prioridade: <id>_<estilo>_aprovada.wav
    const aprovada = path.join(takesDir, `${fala.id}_${estilo}_aprovada.wav`);
    const candidatas = [];
    if (fs.existsSync(aprovada) && !novaTomada) {
      const wav = A.readWav(aprovada);
      candidatas.push({ k: 'aprovada', wav, av: avaliar(fala, wav), nota: 0, arq: aprovada });
    } else {
      for (let k = 1; k <= TENTATIVAS; k++) {
        const arq = path.join(takesDir, `${fala.id}_${estilo}_t${k}.wav`);
        if (novaTomada || !fs.existsSync(arq)) {
          if (semServico) throw new Error(`falta a tomada ${path.basename(arq)}`);
          if (fala.segmentos) await gravarSegmentos(fala, voz, estilo, arq);
          else await synth({ voice: voz.nome, text: textoParaVoz(fala, estilo), rate: voz.velocidade, sampleRate: SR, out: arq });
        }
        const wav = A.readWav(arq);
        candidatas.push({ k, wav, av: avaliar(fala, wav), nota: distanciaDoAlvo(wav, fala), arq });
      }
    }
    // a melhor tomada é a que tem menos problemas e, no empate, a mais próxima do nível aprovado
    candidatas.sort((a, b) => a.av.problemas.length - b.av.problemas.length || a.nota - b.nota);
    const melhor = candidatas[0];
    const utilizavel = !fala.partes || (melhor.av.partes && melhor.av.partes.length === fala.partes);
    if (!utilizavel) {
      console.log(`FALHOU ${fala.id}: ${melhor.av.problemas.join('; ')}`);
      continue;
    }
    manifest.falas[fala.id] = Object.assign(montar(fala, melhor.wav, melhor.av.partes, outDir, melhor.arq), { estilo });
    const aviso = melhor.av.problemas.length ? `  ATENÇÃO: ${melhor.av.problemas.join('; ')}` : '';
    const p = A.pitchStats(melhor.wav.data, melhor.wav.rate);
    console.log(`${fala.id.padEnd(18)} tomada ${String(melhor.k).padEnd(8)} ${manifest.falas[fala.id].dur.toFixed(2).padStart(5)} s  voz ${p.mediana.toFixed(0)} Hz${aviso}`);
  }
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  const total = Object.values(manifest.falas).reduce((a, f) => a + f.dur, 0);
  console.log(`${Object.keys(manifest.falas).length} falas, ${total.toFixed(1)} s de narração`);
  return manifest;
}

module.exports = { narrar, textoParaVoz };
