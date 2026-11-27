'use strict';
// Cliente SOAP mínimo para o Fluig (sem dependências; Node 18+ por causa do fetch).
// Usa os webservices padrão: ECMDatasetService e ECMWorkflowEngineService.

const NS_DATASET = 'http://ws.dataservice.ecm.technology.totvs.com/';
const NS_WORKFLOW = 'http://ws.workflow.ecm.technology.totvs.com/';

function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function unesc(v) {
  return v
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function envelope(ns, op, inner) {
  return (
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="' + ns + '">' +
    '<soapenv:Body><ws:' + op + '>' + inner + '</ws:' + op + '></soapenv:Body></soapenv:Envelope>'
  );
}

// Lê todos os <tag>...</tag> de nível imediato dentro de um trecho XML (sem namespace).
function children(xml, tag) {
  // Atributos com quantificador preguiçoso: assim <value xsi:nil="true"/> fecha no próprio "/>"
  // em vez de engolir o elemento seguinte.
  const re = new RegExp('<(?:\\w+:)?' + tag + '(?:\\s[^>]*?)?(?:/>|>([\\s\\S]*?)</(?:\\w+:)?' + tag + '>)', 'g');
  const out = [];
  let m;
  while ((m = re.exec(xml))) out.push(m[1] === undefined ? '' : m[1]);
  return out;
}

class FluigSoap {
  constructor({ url, username, password, companyId = 1 }) {
    if (!url || !username || !password) {
      throw new Error('Defina FLUIG_URL, FLUIG_USER e FLUIG_PASS (veja o README).');
    }
    this.url = url.replace(/\/+$/, '').replace(/\/portal.*$/, '');
    this.username = username;
    this.password = password;
    this.companyId = companyId;
  }

  async call(service, ns, op, inner) {
    const res = await fetch(this.url + '/webdesk/' + service, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml; charset=utf-8', SOAPAction: '' },
      body: envelope(ns, op, inner),
    });
    const text = await res.text();
    const fault = children(text, 'faultstring')[0];
    if (fault !== undefined) throw new Error(service + '.' + op + ': ' + unesc(fault));
    if (!res.ok) throw new Error(service + '.' + op + ': HTTP ' + res.status);
    return text;
  }

  auth() {
    return (
      '<companyId>' + this.companyId + '</companyId>' +
      '<username>' + esc(this.username) + '</username>' +
      '<password>' + esc(this.password) + '</password>'
    );
  }

  // constraints: [{ field, value, final?, type? = 'MUST', like? = false }]
  async getDataset(name, constraints = [], fields = []) {
    const c = constraints
      .map(
        (k) =>
          '<item><contraintType>' + (k.type || 'MUST') + '</contraintType>' +
          '<fieldName>' + esc(k.field) + '</fieldName>' +
          '<finalValue>' + esc(k.final ?? k.value) + '</finalValue>' +
          '<initialValue>' + esc(k.value) + '</initialValue>' +
          '<likeSearch>' + (k.like ? 'true' : 'false') + '</likeSearch></item>'
      )
      .join('');
    const f = fields.map((x) => '<item>' + esc(x) + '</item>').join('');
    const xml = await this.call(
      'ECMDatasetService',
      NS_DATASET,
      'getDataset',
      this.auth() + '<name>' + esc(name) + '</name><fields>' + f + '</fields><constraints>' + c + '</constraints><order/>'
    );
    // O Fluig real devolve <getDatasetResponse><dataset>…; aceita também <return>.
    const ret = children(xml, 'dataset')[0] ?? children(xml, 'return')[0] ?? '';
    const columns = children(ret, 'columns').map(unesc);
    return children(ret, 'values').map((row) => {
      const vals = children(row, 'value').map(unesc);
      const obj = {};
      columns.forEach((col, i) => (obj[col] = vals[i] ?? null));
      return obj;
    });
  }

  // cardData: { campo: valor }. Devolve o número da solicitação criada.
  async startProcess({ processId, choosedState = 0, colleagueIds = [], comments = '', userId, completeTask = true, cardData = {}, managerMode = false }) {
    const ids = colleagueIds.map((x) => '<item>' + esc(x) + '</item>').join('');
    const card = Object.entries(cardData)
      .map(([k, v]) => '<item><item>' + esc(k) + '</item><item>' + esc(v) + '</item></item>')
      .join('');
    const xml = await this.call(
      'ECMWorkflowEngineService',
      NS_WORKFLOW,
      'startProcess',
      '<username>' + esc(this.username) + '</username><password>' + esc(this.password) + '</password>' +
        '<companyId>' + this.companyId + '</companyId><processId>' + esc(processId) + '</processId>' +
        '<choosedState>' + choosedState + '</choosedState><colleagueIds>' + ids + '</colleagueIds>' +
        '<comments>' + esc(comments) + '</comments><userId>' + esc(userId || this.username) + '</userId>' +
        '<completeTask>' + completeTask + '</completeTask><attachments/><cardData>' + card + '</cardData>' +
        '<appointment/><managerMode>' + managerMode + '</managerMode>'
    );
    // Resposta: lista de pares chave/valor (String[][]); a chave iProcess traz o número.
    // String[][] vem como <item><item>chave</item><item>valor</item></item> (itens aninhados).
    const pairs = [];
    const rePar = /<item>\s*<item>([^<]*)<\/item>\s*<item>([^<]*)<\/item>\s*<\/item>/g;
    let mp;
    while ((mp = rePar.exec(xml))) pairs.push([unesc(mp[1]), unesc(mp[2])]);
    const err = pairs.find((p) => /^ERROR/i.test(String(p[0]).trim()));
    if (err) throw new Error('startProcess: ' + err[1]);
    const ip = pairs.find((p) => p[0] === 'iProcess');
    if (!ip) throw new Error('startProcess: resposta sem iProcess');
    return Number(ip[1]);
  }

  cred() {
    return '<username>' + esc(this.username) + '</username><password>' + esc(this.password) + '</password>' +
      '<companyId>' + this.companyId + '</companyId>';
  }

  pares(xml) {
    const pairs = [];
    const rePar = /<item>\s*<item>([^<]*)<\/item>\s*<item>([^<]*)<\/item>\s*<\/item>/g;
    let mp;
    while ((mp = rePar.exec(xml))) pairs.push([unesc(mp[1]), unesc(mp[2])]);
    return pairs;
  }

  // Atividades ativas da solicitação (sequências numéricas).
  async getAllActiveStates(processInstanceId, userId) {
    const xml = await this.call('ECMWorkflowEngineService', NS_WORKFLOW, 'getAllActiveStates',
      this.cred() + '<userId>' + esc(userId || this.username) + '</userId><processInstanceId>' + processInstanceId + '</processInstanceId>');
    return children(children(xml, 'result')[0] || xml, 'item').map((v) => Number(unesc(v))).filter((n) => !isNaN(n));
  }

  async getActualThread(processInstanceId, stateSequence) {
    const xml = await this.call('ECMWorkflowEngineService', NS_WORKFLOW, 'getActualThread',
      this.cred() + '<processInstanceId>' + processInstanceId + '</processInstanceId><stateSequence>' + stateSequence + '</stateSequence>');
    return Number(unesc(children(xml, 'result')[0] || '0')) || 0;
  }

  // Assume uma tarefa de pool (grupo/papel) para o usuário.
  async takeProcessTask(processInstanceId, threadSequence = 0, userId) {
    return this.call('ECMWorkflowEngineService', NS_WORKFLOW, 'takeProcessTask',
      this.cred() + '<userId>' + esc(userId || this.username) + '</userId><processInstanceId>' + processInstanceId +
      '</processInstanceId><threadSequence>' + threadSequence + '</threadSequence>');
  }

  // Movimenta a solicitação. Devolve os pares chave/valor da resposta; lança erro se vier ERROR.
  async saveAndSendTask({ processInstanceId, choosedState, colleagueIds = [], comments = '', userId, completeTask = true, cardData = {}, managerMode = false, threadSequence = 0 }) {
    const ids = colleagueIds.map((x) => '<item>' + esc(x) + '</item>').join('');
    const card = Object.entries(cardData)
      .map(([k, v]) => '<item><item>' + esc(k) + '</item><item>' + esc(v) + '</item></item>')
      .join('');
    const xml = await this.call('ECMWorkflowEngineService', NS_WORKFLOW, 'saveAndSendTask',
      this.cred() + '<processInstanceId>' + processInstanceId + '</processInstanceId><choosedState>' + choosedState +
      '</choosedState><colleagueIds>' + ids + '</colleagueIds><comments>' + esc(comments) + '</comments><userId>' +
      esc(userId || this.username) + '</userId><completeTask>' + completeTask + '</completeTask><attachments/><cardData>' +
      card + '</cardData><appointment/><managerMode>' + managerMode + '</managerMode><threadSequence>' + threadSequence + '</threadSequence>');
    const pairs = this.pares(xml);
    const err = pairs.find((p) => /^ERROR/i.test(String(p[0]).trim()));
    if (err) throw new Error('saveAndSendTask: ' + err[1]);
    return pairs;
  }

  async cancelInstance(processInstanceId, cancelText = 'Cancelado pelo teste E2E') {
    return this.call(
      'ECMWorkflowEngineService',
      NS_WORKFLOW,
      'cancelInstance',
      '<username>' + esc(this.username) + '</username><password>' + esc(this.password) + '</password>' +
        '<companyId>' + this.companyId + '</companyId><processInstanceId>' + processInstanceId + '</processInstanceId>' +
        '<userId>' + esc(this.username) + '</userId><cancelText>' + esc(cancelText) + '</cancelText>'
    );
  }
}

module.exports = { FluigSoap, _internal: { children, unesc, esc } };
