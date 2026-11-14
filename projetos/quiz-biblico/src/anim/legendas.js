'use strict';
/**
 * Legendas em pt-BR (.srt), tiradas do texto aprovado da locução e dos tempos
 * reais da narração dentro do vídeo.
 */
const path = require('path');
const { temposDasFrases, emFrases } = require('./fala');

const MAX_LINHA = 40;

const hms = (t) => {
  const ms = Math.round(t * 1000);
  const p = (v, n = 2) => String(v).padStart(n, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

/** Quebra em duas linhas, perto do meio, quando a frase é comprida. */
function quebrar(texto) {
  if (texto.length <= MAX_LINHA) return texto;
  const meio = texto.length / 2;
  let melhor = -1;
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] === ' ' && (melhor < 0 || Math.abs(i - meio) < Math.abs(melhor - meio))) melhor = i;
  }
  return melhor < 0 ? texto : `${texto.slice(0, melhor)}\n${texto.slice(melhor + 1)}`;
}

/**
 * Monta as legendas a partir das cenas (cada uma com `t0` e `falas`) e do
 * manifesto da narração. Devolve o texto do arquivo .srt. `tempos` é a
 * função que localiza cada frase dentro de uma fala corrida.
 */
function gerarSrt(cenas, manifest, narrDir, { tempos: temposDe = temposDasFrases } = {}) {
  const cues = [];
  for (const cena of cenas) {
    for (const fl of cena.falas || []) {
      const info = manifest[fl.id];
      const base = cena.t0 + fl.t;
      if (info.partes) {
        // fala cortada em partes (pergunta e opções, contagem): uma legenda por
        // parte, nos tempos exatos. As últimas frases são as opções; o que vem
        // antes delas fica junto na primeira legenda.
        const frases = emFrases(info.texto);
        const sobra = frases.length - info.partes.length;
        const textos = [frases.slice(0, sobra + 1).join(' ')].concat(frases.slice(sobra + 1));
        info.partes.forEach((p, i) => cues.push({ ini: base + p.ini, fim: base + p.fim, texto: textos[i] }));
      } else if (info.segmentos) {
        // fala com vozes diferentes (o vídeo de inglês): uma legenda por trecho de voz; trechos
        // curtos (uma palavra em inglês, "Very good!") se juntam ao seguinte
        const segs = info.segmentos.map((x) => ({ ini: base + x.ini, fim: base + x.fim, texto: x.texto.replace(/,$/, '') }));
        for (let i = 0; i < segs.length; i++) {
          const cue = Object.assign({}, segs[i]);
          while (i + 1 < segs.length && (cue.fim - cue.ini < 1.0 || cue.texto.length < 14) && segs[i + 1].ini - cue.fim < 1.0 && cue.texto.length + segs[i + 1].texto.length < 70) {
            i++;
            cue.fim = segs[i].fim;
            cue.texto += ` ${segs[i].texto}`;
          }
          cues.push(cue);
        }
      } else {
        // fala corrida: uma legenda por frase, juntando as muito curtas com a seguinte
        const frases = emFrases(info.texto);
        const tempos = temposDe(path.join(narrDir, `${fl.id}.wav`), frases);
        let atual = null;
        frases.forEach((fr, i) => {
          if (atual && (atual.fim - atual.ini < 1.1 || (atual.texto.length + fr.length < MAX_LINHA && tempos[i].fim - atual.ini < 4))) {
            atual.texto += ` ${fr}`;
            atual.fim = base + tempos[i].fim;
          } else {
            atual = { ini: base + tempos[i].ini, fim: base + tempos[i].fim, texto: fr };
            cues.push(atual);
          }
        });
      }
    }
  }
  cues.sort((a, b) => a.ini - b.ini);
  // cada legenda fica na tela pelo menos 1,2 s e nunca encosta na seguinte
  cues.forEach((c, i) => {
    const prox = i < cues.length - 1 ? cues[i + 1].ini - 0.08 : Infinity;
    c.fim = Math.min(Math.max(c.fim + 0.25, c.ini + 1.2), prox);
  });
  return cues.map((c, i) => `${i + 1}\n${hms(c.ini)} --> ${hms(c.fim)}\n${quebrar(c.texto)}\n`).join('\n');
}

module.exports = { gerarSrt };
