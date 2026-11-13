'use strict';
/**
 * Narração com o Google Cloud Text-to-Speech.
 *
 * A autenticação usa a chave de conta de serviço apontada pela variável
 * GOOGLE_APPLICATION_CREDENTIALS. O arquivo da chave fica fora do repositório
 * e o conteúdo dele nunca é impresso nem gravado em outro lugar.
 */
const fs = require('fs');
const crypto = require('crypto');

const b64url = (b) => Buffer.from(b).toString('base64url');
let cached = null;

async function accessToken() {
  if (cached && cached.exp > Date.now() + 60000) return cached.token;
  const file = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!file) throw new Error('Defina GOOGLE_APPLICATION_CREDENTIALS com o caminho da chave da conta de serviço.');
  const key = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (key.type !== 'service_account') throw new Error('O arquivo indicado não é uma chave de conta de serviço.');
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: key.private_key_id }));
  const claim = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: key.token_uri,
      iat: now,
      exp: now + 3600,
    })
  );
  const sig = crypto.createSign('RSA-SHA256').update(`${head}.${claim}`).sign(key.private_key);
  const res = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${head}.${claim}.${b64url(sig)}`,
    }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Falha na autenticação (${res.status}): ${j.error_description || j.error || 'erro desconhecido'}`);
  cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return cached.token;
}

async function api(path, body) {
  const token = await accessToken();
  const res = await fetch(`https://texttospeech.googleapis.com/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Text-to-Speech respondeu ${res.status}: ${(j.error && j.error.message) || 'sem detalhe'}`);
  return j;
}

/** Vozes disponíveis para um idioma. */
const listVoices = (lang = 'pt-BR') => api(`v1/voices?languageCode=${lang}`).then((r) => r.voices || []);

/**
 * Gera um áudio WAV mono (48 kHz, ou o valor de `sampleRate`) e grava em `out`.
 * Passe `text` (texto simples) ou `ssml`. `rate` é a velocidade (1 = normal).
 */
async function synth({ text, ssml, voice, lang = 'pt-BR', rate, pitch, out, sampleRate = 48000 }) {
  const audioConfig = { audioEncoding: 'LINEAR16', sampleRateHertz: sampleRate };
  if (rate !== undefined) audioConfig.speakingRate = rate;
  if (pitch !== undefined) audioConfig.pitch = pitch;
  const r = await api('v1/text:synthesize', {
    input: ssml ? { ssml } : { text },
    voice: { languageCode: lang, name: voice },
    audioConfig,
  });
  fs.writeFileSync(out, Buffer.from(r.audioContent, 'base64'));
  return out;
}

module.exports = { listVoices, synth };

if (require.main === module) {
  // node src/tts.js  → lista as vozes em pt-BR
  listVoices()
    .then((vs) => {
      for (const v of vs.sort((a, b) => a.name.localeCompare(b.name))) console.log(v.name, v.ssmlGender, v.naturalSampleRateHertz);
      console.log(`${vs.length} vozes`);
    })
    .catch((e) => {
      console.error(e.message);
      process.exit(1);
    });
}
