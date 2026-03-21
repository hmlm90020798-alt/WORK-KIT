// ════════════════════════════════════════════════
// main.js · Work Kit · Hélder Melo
// v3 — maoobra.js extraído · Firebase robusto
//      Histórico clientes persistente · Orçamentos
//      persistentes · wkConfirm modal nativo
// ════════════════════════════════════════════════

import { tampoInit, switchTampoTab, TAMPOS_DB, ANIGRACO, TRANSPORTE } from './tampos.js';
import { eletroInit, switchEletroTab, ELETRO_DB, ELETRO_ESSENCIAIS  } from './eletros.js';
import { moRender, moCarregarOrcamento, MO_SECCOES, MO_SECCAO_ORDEM  } from './maoobra.js';
import { matInit, matCarregar }                                         from './materiais.js';
import { initializeApp }                                 from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, getDocs,
         collection, deleteDoc }                         from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword,
         signOut, onAuthStateChanged }                   from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ── Firebase config ───────────────────────────────────────────────
const _cfg = {
  apiKey:            'AIzaSyALyrpFSGx4evXtOYCfRIvWc_jTjByz0R8',
  authDomain:        'hm-projetos-lm.firebaseapp.com',
  projectId:         'hm-projetos-lm',
  storageBucket:     'hm-projetos-lm.firebasestorage.app',
  messagingSenderId: '772658359928',
  appId:             '1:772658359928:web:98332ec006329f380ec78d',
};
const _app  = initializeApp(_cfg);
const _db   = getFirestore(_app);
const _auth = getAuth(_app);

// ── Injectar _db e _ST globalmente ANTES de qualquer módulo os usar
// (resolve a race condition do window._wkDb)
window._wkDb = _db;

// ── Collections ───────────────────────────────────────────────────
const COL_BIB = collection(_db, 'wk_biblioteca');
const COL_CHK = collection(_db, 'wk_checklists');

// ════════════════════════════════════════════════
// BASE DE DADOS — MAPA DE MATERIAIS ESSENCIAIS
// ════════════════════════════════════════════════
const MAPA_DADOS = {
  essenciais: [
    { grupo:'Fixações', cor:'#C4612A', artigos:[
      { ref:'82231846', nome:'250 Parafusos Standers PO PZ Cromado 3.5×30', notas:'', url:'https://www.leroymerlin.pt/pesquisa/82231846' },
      { ref:'82231844', nome:'300 Parafusos Standers PO PZ Cromado 3.5×16', notas:'', url:'https://www.leroymerlin.pt/pesquisa/82231844' },
      { ref:'19945982', nome:'10 Buchas Duopower 10×50mm com Parafuso',     notas:'', url:'https://www.leroymerlin.pt/pesquisa/19945982' },
      { ref:'15872003', nome:'Batente Adesivo 10×3mm 25 Unidades',          notas:'', url:'https://www.leroymerlin.pt/pesquisa/15872003' },
      { ref:'956630',   nome:'Calha de Suspensão Recortável Aço Hettich 200×2.8×6cm', notas:'', url:'https://www.leroymerlin.pt/pesquisa/956630' },
      { ref:'13619774', nome:'Esquadro de Grande Ângulo 100×40×40mm',       notas:'', url:'https://www.leroymerlin.pt/pesquisa/13619774' },
      { ref:'82347327', nome:'20 Esquadros Angulares Aço Reforçado 30×30×15×2mm', notas:'', url:'https://www.leroymerlin.pt/pesquisa/82347327' },
    ]},
    { grupo:'Dobradiças', cor:'#2A5A9A', artigos:[
      { ref:'80129468', nome:'Dobradiça Cozinha Standers 110º c/ Amortecedor 2un',       notas:'', url:'https://www.leroymerlin.pt/pesquisa/80129468' },
      { ref:'80129470', nome:'Dobradiça Standers 110º Vitrines c/ Amortecedor 2un',      notas:'', url:'https://www.leroymerlin.pt/pesquisa/80129470' },
      { ref:'80129469', nome:'Dobradiça Standers Invisível 165º c/ Amortecedor 2un',     notas:'', url:'https://www.leroymerlin.pt/pesquisa/80129469' },
    ]},
    { grupo:'Acabamentos', cor:'#6B4FC4', artigos:[
      { ref:'956665',   nome:'Tapa Parafusos Furações de Portas Branco Tokyo', notas:'', url:'https://www.leroymerlin.pt/pesquisa/956665' },
      { ref:'956671',   nome:'Tapa Parafusos Furações de Portas Preto Tokyo',  notas:'', url:'https://www.leroymerlin.pt/pesquisa/956671' },
      { ref:'947981',   nome:'Tapa Furos 120 Unidades Cinza',                  notas:'', url:'https://www.leroymerlin.pt/pesquisa/947981' },
      { ref:'917079',   nome:'Rodapé Móvel Cozinha Delinia ID 100×13cm Branco',notas:'', url:'https://www.leroymerlin.pt/pesquisa/917079' },
    ]},
    { grupo:'Selantes', cor:'#3A7A44', artigos:[
      { ref:'16679355', nome:'Silicone Branco Stop Mofo Express Ceys',          notas:'', url:'https://www.leroymerlin.pt/pesquisa/16679355' },
      { ref:'16353246', nome:'Silicone Coz/WC 280ml Transparente Stop Mofo Ceys',notas:'', url:'https://www.leroymerlin.pt/pesquisa/16353246' },
      { ref:'82551890', nome:'Silicone Universal Acético 280ml Preto Soudal',   notas:'', url:'https://www.leroymerlin.pt/pesquisa/82551890' },
      { ref:'14871185', nome:'Cola e Veda 290ml Transparente T-Rex Cristal',    notas:'', url:'https://www.leroymerlin.pt/pesquisa/14871185' },
    ]},
    { grupo:'Tubagens', cor:'#8B6914', artigos:[
      { ref:'88561208', nome:'Tubo Extensível c/ Válvula Roscada 32×40mm 1¼',     notas:'', url:'https://www.leroymerlin.pt/pesquisa/88561208' },
      { ref:'84299215', nome:'Tubo Extensível Alumínio Flex D120 C35 a 200cm',    notas:'', url:'https://www.leroymerlin.pt/pesquisa/84299215' },
    ]},
  ],
};

// ════════════════════════════════════════════════
// BASE DE DADOS — TEMPLATES DO ASSISTENTE
// ════════════════════════════════════════════════
const ASS_TEMPLATES = {
  cozinha: {
    titulo: 'Cozinha',
    keywords: ['cozinha','kitchen','móveis de cozinha','armários de cozinha'],
    secoes: [
      { titulo: '🪑 Mobiliário', items: [
        { nome: 'Instalação cozinha até 5m', cod: '49010602', tipo: 'maoobra', obrigatorio: true },
        { nome: 'Metro linear adicional (>5m)', cod: '49010603', tipo: 'maoobra', obrigatorio: false },
        { nome: 'Pedido produto p/ instalação (OBRIGATÓRIO)', cod: '49014163', tipo: 'codigo', obrigatorio: true },
      ]},
      { titulo: '🪨 Tampo', items: [
        { nome: 'Instalação tampo de cozinha', cod: '49010600', tipo: 'maoobra', obrigatorio: true },
        { nome: 'Silicone branco stop mofo', ref: '16679355', tipo: 'material', obrigatorio: true },
        { nome: 'Silicone transparente coz/WC', ref: '16353246', tipo: 'material', obrigatorio: true },
      ]},
      { titulo: '🚰 Lava-Loiça', items: [
        { nome: 'Instalação lava-loiça', cod: '49010607', tipo: 'maoobra', obrigatorio: false },
        { nome: 'Instalação torneira', cod: '49010608', tipo: 'maoobra', obrigatorio: false },
        { nome: 'Tubo extensível 32×40mm', ref: '88561208', tipo: 'material', obrigatorio: false },
      ]},
      { titulo: '⚡ Eletrodomésticos', items: [
        { nome: 'Instalação eletrodoméstico elétrico', cod: '49010604', tipo: 'maoobra', obrigatorio: false },
        { nome: 'Circuito 32A — Placa indução/forno', cod: '49015268', tipo: 'maoobra', obrigatorio: false },
        { nome: 'Exaustor de ilha (se aplicável)', cod: '49010606', tipo: 'maoobra', obrigatorio: false },
      ]},
      { titulo: '🔧 Materiais Essenciais', items: [
        { nome: 'Parafusos Standers 3.5×30 (250un)', ref: '82231846', tipo: 'material', obrigatorio: true },
        { nome: 'Parafusos Standers 3.5×16 (300un)', ref: '82231844', tipo: 'material', obrigatorio: true },
        { nome: 'Dobradiças Standers 110º c/ amortecedor', ref: '80129468', tipo: 'material', obrigatorio: true },
        { nome: 'Batentes adesivos 25un', ref: '15872003', tipo: 'material', obrigatorio: true },
        { nome: 'Tapa parafusos branco', ref: '956665', tipo: 'material', obrigatorio: false },
        { nome: 'Rodapé Delinia 100×13cm branco', ref: '917079', tipo: 'material', obrigatorio: false },
      ]},
    ],
    checklist_cliente: [
      'Medidas exactas da planta (largura × profundidade × altura)',
      'Localização e diâmetro da saída de água',
      'Localização do quadro eléctrico e circuitos disponíveis',
      'Tipo de piso (nível para nivelamento dos móveis)',
      'Janelas e portas que condicionam o layout',
      'Tipo de exaustor pretendido (ilha, parede, oculto)',
      'Eletrodomésticos existentes a manter ou substituir',
      'Preferência de tampo (material, cor, espessura)',
      'Data prevista de obra / entrega de chaves',
      'Referência PC do projeto',
    ],
  },
  casadebanho: {
    titulo: 'Casa de Banho',
    keywords: ['casa de banho','wc','banheiro','banho','duche','banheira'],
    secoes: [
      { titulo: '🚿 Instalação Sanitária', items: [
        { nome: 'Remoção banheira (se aplicável)', cod: '49010630', tipo: 'maoobra', obrigatorio: false },
        { nome: 'Instalação base duche / resguardo', cod: '49010632', tipo: 'maoobra', obrigatorio: false },
        { nome: 'Pedido produto p/ instalação (OBRIGATÓRIO)', cod: '49014163', tipo: 'codigo', obrigatorio: true },
      ]},
      { titulo: '🔧 Materiais Essenciais', items: [
        { nome: 'Silicone branco stop mofo', ref: '16679355', tipo: 'material', obrigatorio: true },
        { nome: 'Silicone transparente', ref: '16353246', tipo: 'material', obrigatorio: true },
        { nome: 'Cola e veda T-Rex Cristal', ref: '14871185', tipo: 'material', obrigatorio: true },
      ]},
      { titulo: '⚡ Eletricidade', items: [
        { nome: 'Circuito 16A (se necessário)', cod: '49015265', tipo: 'maoobra', obrigatorio: false },
      ]},
    ],
    checklist_cliente: [
      'Medidas exactas da casa de banho',
      'Estado das canalizações (nova ou substituição)',
      'Localização da saída de esgotos (pavimento ou parede)',
      'Tipo de revestimento pretendido (cerâmica, porcelânico)',
      'Sanitários a manter ou substituir',
      'Necessidade de aquecimento (toalheiro eléctrico, radiador)',
      'Data de início de obra',
      'Referência PC do projeto',
    ],
  },
  roupeiro: {
    titulo: 'Roupeiro',
    keywords: ['roupeiro','armário','closet','wardrobe'],
    secoes: [
      { titulo: '🚪 Instalação', items: [
        { nome: 'Instalação roupeiro a medida', cod: '49011254', tipo: 'maoobra', obrigatorio: true },
        { nome: 'Instalação roupeiro kit', cod: '49013125', tipo: 'maoobra', obrigatorio: false },
        { nome: 'Pedido produto p/ instalação (OBRIGATÓRIO)', cod: '49014163', tipo: 'codigo', obrigatorio: true },
      ]},
      { titulo: '🔧 Materiais', items: [
        { nome: 'Parafusos Standers 3.5×30', ref: '82231846', tipo: 'material', obrigatorio: true },
        { nome: 'Buchas 10mm c/ parafuso', ref: '16010610', tipo: 'material', obrigatorio: true },
        { nome: 'Esquadros angulares reforçados', ref: '82347327', tipo: 'material', obrigatorio: false },
      ]},
    ],
    checklist_cliente: [
      'Medidas exactas do espaço (largura × profundidade × altura)',
      'Tipo de parede (tijolo, betão, gesso cartonado)',
      'Portas pretendidas (dobradiça, correr, lacada)',
      'Organização interior (gavetas, prateleiras, sapateiro)',
      'Referência PC do projeto',
    ],
  },
};

// ════════════════════════════════════════════════
// QUALIFICAÇÃO DE CLIENTE
// ════════════════════════════════════════════════
const CLI_PERGUNTAS = [
  { id:'intencao', momento:1, label:'Qual é a intenção real da visita?', opcoes:[
    { txt:'Vem com projeto concreto — obra em curso ou data definida', pts:3 },
    { txt:'Está a planear e quer perceber o que é possível', pts:2 },
    { txt:'Quer ter uma ideia de valores antes de decidir', pts:1 },
    { txt:'Veio "dar uma vista de olhos", sem intenção clara', pts:0 },
  ]},
  { id:'destino', momento:1, label:'Para que se destina o projeto?', opcoes:[
    { txt:'Habitação própria — casa onde vai viver', pts:3 },
    { txt:'Investimento — para arrendar ou vender', pts:2 },
    { txt:'Espaço secundário — anexo, escritório, férias', pts:1 },
    { txt:'Não deixou claro', pts:0 },
  ]},
  { id:'prazo', momento:1, label:'Qual é o prazo de decisão?', opcoes:[
    { txt:'Tem data limite — obra, entrega de casa, etc.', pts:3 },
    { txt:'Quer decidir em breve mas sem pressão', pts:2 },
    { txt:'"Quando tiver tudo mais definido"', pts:1 },
    { txt:'Sem prazo, sem compromisso', pts:0 },
  ]},
  { id:'ideias', momento:1, label:'O cliente já tem ideias ou referências?', opcoes:[
    { txt:'Não tem nada definido, está aberto a sugestões', pts:3 },
    { txt:'Tem algumas ideias mas é flexível', pts:2 },
    { txt:'Já fez pesquisa — sites, concorrência', pts:1 },
    { txt:'Tem projeto definido, quer só orçamento', pts:0 },
  ]},
  { id:'preco', momento:2, label:'Como reage à amplitude de preços?', opcoes:[
    { txt:'Mostra interesse nas opções intermédias e premium', pts:3 },
    { txt:'Fica nas intermédias mas não rejeita as premium', pts:2 },
    { txt:'Vai claramente para as opções mais económicas', pts:1 },
    { txt:'Evita comprometer-se com qualquer opção', pts:0 },
  ]},
  { id:'decisor', momento:2, label:'Quem decide — e como é a dinâmica?', opcoes:[
    { txt:'Decide sozinho, está presente e focado', pts:3 },
    { txt:'Casal presente e alinhados entre si', pts:2 },
    { txt:'Casal presente mas com visões diferentes', pts:1 },
    { txt:'O decisor não está presente', pts:0 },
  ]},
  { id:'valor', momento:2, label:'Como corre a apresentação do valor final?', opcoes:[
    { txt:'Tranquilo — estava dentro do esperado', pts:3 },
    { txt:'Hesitante mas mantém o interesse', pts:2 },
    { txt:'Surpresa mas quer continuar a conversa', pts:1 },
    { txt:'Recua, fecha ou desaparece', pts:0 },
  ]},
  { id:'passo', momento:2, label:'Qual é o próximo passo natural?', opcoes:[
    { txt:'Fechar ou marcar data de decisão', pts:3 },
    { txt:'Visita à obra ou segunda reunião', pts:2 },
    { txt:'Enviar proposta e aguardar contacto', pts:1 },
    { txt:'Cliente leva a informação e "dá notícias"', pts:0 },
  ]},
];

// ════════════════════════════════════════════════
// ESTADO GLOBAL
// Exposto via window._wkST para módulos externos
// ════════════════════════════════════════════════
let ST = {
  tab: 'assistente',
  // Biblioteca
  bibItems: [],
  bibCatFiltro: 'todos',
  bibEditId: null,
  bibEditTs: null,  // timestamp original do item em edição (não alterar ao gravar)
  // Checklists
  chkListas: [],
  // MO
  moOrc: [],
  moSeccao: 'Cozinhas e Roupeiros',
  moCat: 'Remodelação de Cozinha',
  moPesquisa: '',
  // Tampos
  tampoCat: '',
  tampoTab: 'catalogo',
  // Cliente
  cliRespostas: {},
  cliFase: 1,
  cliHist: [],
  cliHistAberto: false,
};
// Injectar ST globalmente para os módulos externos (maoobra, tampos, eletros)
window._wkST = ST;

// ════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════
function fmt(v) {
  const n = parseFloat(v);
  return isNaN(n) ? '—' : n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function toast(msg, dur = 2800) {
  const t = document.getElementById('wk-toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), dur);
}
// Expor toast para módulos externos
window.wkToast = toast;

/**
 * wkConfirm — substitui confirm() nativo por modal interno.
 * @param {string} msg   — mensagem a apresentar
 * @param {function} cb  — callback se o utilizador confirmar
 */
window.wkConfirm = function(msg, cb) {
  const overlay = document.getElementById('modal-confirm');
  const msgEl   = document.getElementById('modal-confirm-msg');
  const btnOk   = document.getElementById('modal-confirm-ok');
  const btnCan  = document.getElementById('modal-confirm-cancel');
  if (!overlay) { if (confirm(msg)) cb(); return; } // fallback
  msgEl.textContent = msg;
  overlay.classList.add('active');
  const close = () => overlay.classList.remove('active');
  btnOk.onclick  = () => { close(); cb(); };
  btnCan.onclick = close;
};

window.copiarTexto = function(txt, btnEl) {
  navigator.clipboard.writeText(txt).then(() => {
    toast('✓ Copiado: ' + txt);
    if (btnEl) { const o = btnEl.textContent; btnEl.textContent = '✓'; setTimeout(() => btnEl.textContent = o, 1500); }
  }).catch(() => { toast('Erro ao copiar'); });
};

function setView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-' + id);
  if (el) el.classList.add('active');
}

// ════════════════════════════════════════════════
// NAVEGAÇÃO
// ════════════════════════════════════════════════
window.switchTab = function(tabId, btnEl) {
  ST.tab = tabId;
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  const tab = document.getElementById('tab-' + tabId);
  if (tab) tab.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
  if (tabId === 'biblioteca') bibRender();
  if (tabId === 'checklists') chkRender();
  if (tabId === 'tampos')   tampoInit();
  if (tabId === 'eletros') {
    if (!document.getElementById('eletro-header')?.innerHTML) eletroInit();
    else switchEletroTab('catalogo');
  }
  if (tabId === 'maoobra')    moRender();
  if (tabId === 'materiais')  matInit();
  if (tabId === 'cliente')    cliRender();
};

// ════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════
window.doLogin = async function() {
  const email = document.getElementById('login-email')?.value?.trim();
  const pass  = document.getElementById('login-pass')?.value;
  const errEl = document.getElementById('login-error');
  const btn   = document.querySelector('.login-btn');
  if (!email || !pass) return;
  if (btn) { btn.disabled = true; btn.textContent = 'A entrar…'; }
  if (errEl) errEl.style.display = 'none';
  try {
    await signInWithEmailAndPassword(_auth, email, pass);
  } catch (_) {
    if (errEl) { errEl.textContent = 'Credenciais incorrectas.'; errEl.style.display = 'block'; }
    if (btn) { btn.disabled = false; btn.textContent = 'Entrar'; }
  }
};

window.doLogout = async function() {
  await signOut(_auth);
  setView('login');
};

// ════════════════════════════════════════════════
// FIREBASE — DIAGNÓSTICO DE ERROS
// ════════════════════════════════════════════════
function fbErroMsg(e) {
  const code = e?.code || '';
  if (code === 'permission-denied')
    return '🔒 Sem permissão — as regras do Firestore expiraram.\nVê as instruções no painel de sincronização.';
  if (code === 'unauthenticated')
    return '🔐 Sessão expirada — faz logout e login novamente.';
  if (code.includes('unavailable') || code.includes('network'))
    return '📡 Sem ligação à internet.';
  return `⚠️ Erro Firebase: ${code || e?.message || 'desconhecido'}`;
}

function mostrarErroDB(e) {
  const msg = fbErroMsg(e);
  console.error('[Firebase]', e);
  // Mostrar aviso persistente no sync indicator
  const sync = document.getElementById('app-sync');
  if (sync) {
    sync.textContent = '⚠️ Sem sincronização';
    sync.style.color = '#ff8a80';
    sync.title = msg;
    sync.style.cursor = 'pointer';
    sync.onclick = () => alert(msg);
  }
  toast(msg.split('\n')[0]);
}

// ════════════════════════════════════════════════
// FIREBASE — BIBLIOTECA
// ════════════════════════════════════════════════
async function bibCarregar() {
  try {
    const snap = await getDocs(COL_BIB);
    ST.bibItems = [];
    snap.forEach(d => ST.bibItems.push({ id: d.id, ...d.data() }));
    ST.bibItems.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    // Marcar sync como OK
    const sync = document.getElementById('app-sync');
    if (sync) { sync.textContent = ''; sync.style.color = ''; sync.onclick = null; }
  } catch (e) { mostrarErroDB(e); }
}

async function bibSalvar(item) {
  try {
    await setDoc(doc(_db, 'wk_biblioteca', item.id), item);
  } catch (e) { mostrarErroDB(e); throw e; }
}

async function bibApagar(id) {
  try {
    await deleteDoc(doc(_db, 'wk_biblioteca', id));
    ST.bibItems = ST.bibItems.filter(i => i.id !== id);
    bibRender();
    toast('✓ Item apagado');
  } catch (e) { mostrarErroDB(e); }
}

// ── RENDER BIBLIOTECA ────────────────────────────────────────────
const BIB_CATS = [
  { id: 'todos',      icon: '🗂',  nome: 'Todos' },
  { id: 'material',   icon: '📦', nome: 'Materiais' },
  { id: 'codigo',     icon: '🔢', nome: 'Códigos' },
  { id: 'processo',   icon: '⚙️', nome: 'Processos' },
  { id: 'ideia',      icon: '💡', nome: 'Ideias' },
  { id: 'fornecedor', icon: '🏢', nome: 'Fornecedores' },
  { id: 'nota',       icon: '📝', nome: 'Notas' },
];

function bibRender() {
  const chips = document.getElementById('bib-cats');
  if (chips) {
    chips.innerHTML = BIB_CATS.map(c => `
      <button class="chip ${ST.bibCatFiltro === c.id ? 'active' : ''}"
              onclick="window.bibFiltrarCat('${c.id}')">
        ${c.icon} ${c.nome}
        ${c.id !== 'todos' ? `<span style="opacity:.6">${ST.bibItems.filter(i => i.cat === c.id).length}</span>` : ''}
      </button>`).join('');
  }

  const pesquisa = (document.getElementById('bib-pesquisa')?.value || '').toLowerCase().trim();
  const filtrados = ST.bibItems.filter(i => {
    const matchCat = ST.bibCatFiltro === 'todos' || i.cat === ST.bibCatFiltro;
    const matchPes = !pesquisa ||
      (i.nome || '').toLowerCase().includes(pesquisa) ||
      (i.ref  || '').toLowerCase().includes(pesquisa) ||
      (i.notas|| '').toLowerCase().includes(pesquisa) ||
      (i.tags || '').toLowerCase().includes(pesquisa);
    return matchCat && matchPes;
  });

  const info = document.getElementById('bib-info');
  if (info) info.textContent = `${filtrados.length} item${filtrados.length !== 1 ? 's' : ''}`;

  const CAT_ICONS = { material:'📦', codigo:'🔢', processo:'⚙️', ideia:'💡', fornecedor:'🏢', nota:'📝' };
  const grid = document.getElementById('bib-grid');
  if (!grid) return;

  if (!filtrados.length) {
    grid.innerHTML = `<div class="bib-empty">
      <div style="font-size:28px;margin-bottom:8px">📭</div>
      <div style="font-size:13px;color:var(--t3)">Sem itens${ST.bibCatFiltro !== 'todos' ? ' nesta categoria' : ''}</div>
    </div>`;
    return;
  }

  grid.innerHTML = filtrados.map(item => `
    <div class="bib-card">
      <div class="bib-card-top">
        <span class="bib-card-icon">${CAT_ICONS[item.cat] || '📋'}</span>
        <div class="bib-card-acoes">
          ${item.url ? `<a href="${encodeURI(item.url)}" target="_blank" class="bib-card-btn" title="Abrir link">↗</a>` : ''}
          <button class="bib-card-btn" onclick="window.bibEditar('${item.id}')" title="Editar">✎</button>
          <button class="bib-card-btn bib-card-btn-del" onclick="window.bibConfirmarApagar('${item.id}')" title="Apagar">×</button>
        </div>
      </div>
      <div class="bib-card-nome">${item.nome || '—'}</div>
      ${item.ref ? `<div class="bib-card-ref" onclick="window.copiarTexto('${item.ref}',this)">${item.ref} ⎘</div>` : ''}
      ${item.preco ? `<div class="bib-card-preco">${fmt(item.preco)} <span style="opacity:.5">${item.unidade || 'un'}</span></div>` : ''}
      ${item.notas ? `<div class="bib-card-notas">${item.notas}</div>` : ''}
      ${item.tags ? `<div class="bib-card-tags">${item.tags.split(',').map(t => `<span class="bib-tag">${t.trim()}</span>`).join('')}</div>` : ''}
    </div>`).join('');
}

window.bibRender = bibRender; // expor para o oninput da pesquisa no HTML

window.bibFiltrarCat = function(cat) { ST.bibCatFiltro = cat; bibRender(); };

window.bibAbrirNovo = function() {
  ST.bibEditId = null;
  document.getElementById('modal-bib-titulo').textContent = 'Novo Item';
  ['bib-f-nome','bib-f-ref','bib-f-preco','bib-f-tags','bib-f-url','bib-f-notas'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('modal-bib').classList.add('open');
};

window.bibEditar = function(id) {
  const item = ST.bibItems.find(i => i.id === id); if (!item) return;
  ST.bibEditId = id;
  // Guardar ts original para não alterar a posição na lista ao editar
  ST.bibEditTs = item.ts || Date.now();
  const modal = document.getElementById('modal-bib'); if (!modal) return;
  document.getElementById('modal-bib-titulo').textContent = 'Editar Item';
  document.getElementById('bib-f-nome').value    = item.nome    || '';
  document.getElementById('bib-f-cat').value     = item.cat     || 'material';
  document.getElementById('bib-f-ref').value     = item.ref     || '';
  document.getElementById('bib-f-preco').value   = item.preco   || '';
  document.getElementById('bib-f-unidade').value = item.unidade || 'un';
  document.getElementById('bib-f-tags').value    = item.tags    || '';
  document.getElementById('bib-f-url').value     = item.url     || '';
  document.getElementById('bib-f-notas').value   = item.notas   || '';
  modal.classList.add('open');
};

window.bibFecharModal = function() {
  document.getElementById('modal-bib').classList.remove('open');
  ST.bibEditId = null;
  ST.bibEditTs = null;
};

window.bibGuardar = async function() {
  const nome = document.getElementById('bib-f-nome')?.value?.trim();
  if (!nome) { toast('⚠️ Nome obrigatório'); return; }

  const isEdit = !!ST.bibEditId;
  const id     = ST.bibEditId || gerarId();

  const item = {
    id, nome,
    cat:     document.getElementById('bib-f-cat')?.value          || 'material',
    ref:     document.getElementById('bib-f-ref')?.value?.trim()   || '',
    preco:   parseFloat(document.getElementById('bib-f-preco')?.value) || 0,
    unidade: document.getElementById('bib-f-unidade')?.value       || 'un',
    tags:    document.getElementById('bib-f-tags')?.value?.trim()  || '',
    url:     document.getElementById('bib-f-url')?.value?.trim()   || '',
    notas:   document.getElementById('bib-f-notas')?.value?.trim() || '',
    // Em edição: manter o ts original para não alterar ordem na lista
    // Em criação: usar timestamp actual (aparece no topo)
    ts: isEdit ? (ST.bibEditTs || Date.now()) : Date.now(),
  };

  // Actualizar array local
  if (isEdit) {
    const idx = ST.bibItems.findIndex(i => i.id === id);
    if (idx >= 0) ST.bibItems[idx] = item;
    else ST.bibItems.unshift(item); // fallback
  } else {
    ST.bibItems.unshift(item);
  }

  // Fechar modal e re-render imediatamente (UX rápido)
  window.bibFecharModal();
  bibRender();

  // Persistir no Firebase via bibSalvar (lança erro se falhar)
  try {
    await bibSalvar(item);
    toast(isEdit ? '✓ Item actualizado' : '✓ Item criado');
  } catch (e) {
    // mostrarErroDB já foi chamado dentro de bibSalvar
    // Reverter mudança local para consistência
    if (isEdit) {
      const idx = ST.bibItems.findIndex(i => i.id === item.id);
      if (idx >= 0) ST.bibItems[idx] = { ...item }; // mantém local mas avisa
    }
  }
};

window.bibConfirmarApagar = function(id) {
  window.wkConfirm('Apagar este item da biblioteca?', () => bibApagar(id));
};

// ════════════════════════════════════════════════
// FIREBASE — CHECKLISTS
// ════════════════════════════════════════════════
async function chkCarregar() {
  try {
    const snap = await getDocs(COL_CHK);
    ST.chkListas = [];
    snap.forEach(d => ST.chkListas.push({ id: d.id, ...d.data() }));
  } catch (e) { mostrarErroDB(e); }
}

async function chkSalvar(lista) {
  try { await setDoc(doc(_db, 'wk_checklists', lista.id), lista); }
  catch (e) { mostrarErroDB(e); }
}

const CHK_PREDEFINIDAS = [
  { id:'chk_cozinha', icon:'🍳', nome:'Cozinha Completa', itens:[
    'Verificação de medidas / planta actualizada',
    'Pedido produto instalação (49014163)',
    'Deslocação instalações (49013101)',
    'Instalação módulos ao ml (49010601)',
    'Instalação tampo (49010602 ou 49010603)',
    'Instalação lava-loiça (49010607)',
    'Instalação torneira (49010608)',
    'Instalação placa / forno / exaustor',
    'Parafusos Standers 3.5×30 (82231846)',
    'Parafusos Standers 3.5×16 (82231844)',
    'Dobradiças Standers 110º (80129468)',
    'Silicone branco stop mofo (16679355)',
    'Rodapé Delinia (917079)',
    'Tapa-furos / tapa-parafusos',
    'Referência PC do projeto gerada',
    'Data de entrega confirmada com cliente',
  ]},
  { id:'chk_wc', icon:'🚿', nome:'Casa de Banho Remodelação', itens:[
    'Verificação de medidas e localização esgotos',
    'Pedido produto instalação (49014163)',
    'Remoção banheira se necessário (49010630)',
    'Instalação base duche (49010632)',
    'Instalação coluna duche (49010633)',
    'Instalação sanita (49010634)',
    'Instalação lavatório + torneira',
    'Silicone branco stop mofo (16679355)',
    'Cola e veda T-Rex Cristal (14871185)',
    'Cerâmica pavimento + parede seleccionada',
    'Referência PC do projeto gerada',
  ]},
  { id:'chk_roupeiro', icon:'👔', nome:'Roupeiro Embutido', itens:[
    'Medidas exactas (L × P × A)',
    'Tipo de parede confirmado',
    'Pedido produto instalação (49014163)',
    'Instalação ao ml ou tipo de portas definido',
    'Parafusos + buchas (82231846 / 19945982)',
    'Puxadores seleccionados',
    'Referência PC do projeto gerada',
  ]},
];

function chkRender() {
  const ct = document.getElementById('chk-content'); if (!ct) return;

  let html = '';

  // Checklists predefinidas
  html += `<div class="page-titulo" style="font-size:14px;margin-bottom:12px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;font-family:var(--sans)">Predefinidas</div>`;
  html += CHK_PREDEFINIDAS.map(lista => {
    const saved = (() => { try { return JSON.parse(localStorage.getItem('wk_chk_' + lista.id) || '{}'); } catch(_){ return {}; } })();
    const total   = lista.itens.length;
    const feitos  = Object.values(saved).filter(Boolean).length;
    return `
      <div class="chk-lista">
        <div class="chk-lista-header" onclick="window.chkToggle('${lista.id}')">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:18px">${lista.icon}</span>
            <div>
              <div class="chk-lista-nome">${lista.nome}</div>
              <div class="chk-progress-label">${feitos}/${total} completo${feitos === total && total > 0 ? ' ✓' : ''}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="chk-progress-bar"><div class="chk-progress-fill" style="width:${total > 0 ? Math.round(feitos/total*100) : 0}%"></div></div>
            <button class="btn-sec" style="font-size:10px;padding:4px 8px" onclick="event.stopPropagation();window.chkReset('${lista.id}')">↺ Reset</button>
          </div>
        </div>
        <div id="chk-itens-${lista.id}" class="chk-itens" style="display:none">
          ${lista.itens.map((item, idx) => `
            <div class="chk-item ${saved[idx] ? 'checked' : ''}" onclick="window.chkToggleItem('${lista.id}',${idx})">
              <span class="chk-item-check">${saved[idx] ? '✓' : '○'}</span>
              <span>${item}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');

  // Checklists personalizadas
  if (ST.chkListas.length) {
    html += `<div class="page-titulo" style="font-size:14px;margin:20px 0 12px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;font-family:var(--sans)">Personalizadas</div>`;
    html += ST.chkListas.map(lista => {
      const total  = (lista.itens || []).length;
      const feitos = (lista.itens || []).filter(i => i.feito).length;
      return `
        <div class="chk-lista">
          <div class="chk-lista-header" onclick="window.chkToggle('custom_${lista.id}')">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:18px">${lista.icon || '📋'}</span>
              <div>
                <div class="chk-lista-nome">${lista.nome}</div>
                <div class="chk-progress-label">${feitos}/${total} completo${feitos === total && total > 0 ? ' ✓' : ''}</div>
              </div>
            </div>
            <div style="display:flex;gap:6px;align-items:center">
              <button class="btn-sec" style="font-size:10px;padding:4px 8px"
                onclick="event.stopPropagation();window.chkAdicionarItem('${lista.id}')">+ Item</button>
              <button class="bib-card-btn bib-card-btn-del"
                onclick="event.stopPropagation();window.chkApagarLista('${lista.id}')">×</button>
            </div>
          </div>
          <div id="chk-itens-custom_${lista.id}" class="chk-itens" style="display:none">
            ${(lista.itens||[]).map((item, idx) => `
              <div class="chk-item ${item.feito ? 'checked' : ''}"
                onclick="window.chkToggleCustomItem('${lista.id}',${idx})">
                <span class="chk-item-check">${item.feito ? '✓' : '○'}</span>
                <span>${item.texto}</span>
              </div>`).join('')}
            ${!total ? `<div style="padding:12px;color:var(--t4);font-size:12px;text-align:center">Sem itens — adiciona o primeiro</div>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  ct.innerHTML = html;
}

window.chkToggle = function(listaId) {
  const el = document.getElementById('chk-itens-' + listaId);
  if (el) el.style.display = el.style.display === 'none' ? '' : 'none';
};

window.chkToggleItem = function(listaId, itemId) {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('wk_chk_' + listaId) || '{}'); } catch(_){ return {}; } })();
  saved[itemId] = !saved[itemId];
  localStorage.setItem('wk_chk_' + listaId, JSON.stringify(saved));
  chkRender();
};

window.chkReset = function(listaId) {
  window.wkConfirm('Reiniciar checklist?', () => {
    localStorage.removeItem('wk_chk_' + listaId);
    chkRender();
    toast('✓ Checklist reiniciada');
  });
};

window.chkAbrirNovo = function() {
  const nome = prompt('Nome da nova checklist:');
  if (!nome) return;
  const lista = { id: gerarId(), icon: '📋', nome, itens: [] };
  ST.chkListas.push(lista);
  chkSalvar(lista);
  chkRender();
};

window.chkAdicionarItem = function(listaId) {
  const texto = prompt('Texto do novo item:');
  if (!texto) return;
  const lista = ST.chkListas.find(l => l.id === listaId); if (!lista) return;
  lista.itens = lista.itens || [];
  lista.itens.push({ texto, feito: false });
  chkSalvar(lista);
  chkRender();
};

window.chkToggleCustomItem = function(listaId, idx) {
  const lista = ST.chkListas.find(l => l.id === listaId); if (!lista) return;
  lista.itens[idx].feito = !lista.itens[idx].feito;
  chkSalvar(lista);
  chkRender();
};

window.chkApagarLista = function(listaId) {
  window.wkConfirm('Apagar esta checklist?', async () => {
    ST.chkListas = ST.chkListas.filter(l => l.id !== listaId);
    try { await deleteDoc(doc(_db, 'wk_checklists', listaId)); } catch(_) {}
    chkRender();
    toast('✓ Checklist apagada');
  });
};

// ════════════════════════════════════════════════
// ASSISTENTE DE PROJETO
// ════════════════════════════════════════════════
window.assExemplo = function(el) {
  const input = document.getElementById('ass-input');
  const texto = el.textContent.replace(/^[🍳🚿🚪🔨]\s*/, '').trim();
  if (input) { input.value = texto; input.focus(); }
};

window.assGerar = function() {
  const input = document.getElementById('ass-input')?.value?.toLowerCase().trim();
  if (!input) { toast('⚠️ Descreve o projeto primeiro'); return; }

  // Limitar input para evitar gastos excessivos de tokens
  if (input.length > 500) { toast('⚠️ Descrição demasiado longa (máx. 500 caracteres)'); return; }

  let template = null;
  for (const [, tmpl] of Object.entries(ASS_TEMPLATES)) {
    if (tmpl.keywords.some(k => input.includes(k))) { template = tmpl; break; }
  }

  const res     = document.getElementById('ass-resultado');
  const tituloEl = document.getElementById('ass-res-titulo');
  const bodyEl   = document.getElementById('ass-res-body');

  if (!template) {
    res.style.display = '';
    tituloEl.textContent = 'Projeto Identificado';
    bodyEl.innerHTML = `
      <div class="ass-alerta">Não foi possível identificar automaticamente o tipo de projeto. Usa os templates abaixo ou descreve com mais detalhe.</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
        ${Object.values(ASS_TEMPLATES).map(t => `
          <button class="btn-sec" onclick="window.assGerTemplate('${t.titulo.toLowerCase()}')">
            ${t.titulo} — Ver checklist e materiais
          </button>`).join('')}
      </div>`;
    return;
  }

  res.style.display = '';
  tituloEl.textContent = `${template.titulo} — Lista Completa`;

  const temInstalacao = /instala[çc]|montar|montagem/.test(input);
  const temEletros    = /eletro|placa|forno|exaustor/.test(input);
  const temTampo      = /tampo|silestone|pedra|granito/.test(input);

  let html = '';
  template.secoes.forEach(sec => {
    const itens = sec.items.filter(item => {
      if (item.obrigatorio) return true;
      if (sec.titulo.includes('Eletro') && !temEletros)     return false;
      if (sec.titulo.includes('Tampo')  && !temTampo)       return false;
      if (sec.titulo.includes('Lava')   && !temInstalacao)  return false;
      return true;
    });
    if (!itens.length) return;
    html += `<div class="ass-secao">
      <div class="ass-secao-titulo">${sec.titulo}</div>
      ${itens.map(item => `
        <div class="ass-item">
          <span>${item.obrigatorio ? '⚠️' : '·'}</span>
          <span style="flex:1">${item.nome}</span>
          ${(item.cod || item.ref) ? `<span class="ass-item-ref" onclick="window.copiarTexto('${item.cod || item.ref}',this)">${item.cod || item.ref}</span>` : ''}
        </div>`).join('')}
    </div>`;
  });

  html += `<div class="ass-secao">
    <div class="ass-secao-titulo">✅ Checklist de Cliente</div>
    ${template.checklist_cliente.map(item => `<div class="ass-item"><span>□</span><span>${item}</span></div>`).join('')}
  </div>`;

  bodyEl.innerHTML = html;
};

window.assGerTemplate = function(tipo) {
  const input = document.getElementById('ass-input');
  if (input) input.value = tipo;
  window.assGerar();
};

window.assCopiar = function() {
  const body = document.getElementById('ass-res-body'); if (!body) return;
  navigator.clipboard.writeText(body.innerText).then(() => toast('✓ Lista copiada'));
};

window.assExportarProjeto = function() {
  window.open('https://hmlm90020798-alt.github.io/projetos-lm/', '_blank');
  toast('→ A abrir Projetos LM');
};

// ════════════════════════════════════════════════
// QUALIFICAÇÃO DE CLIENTE
// ════════════════════════════════════════════════

// ── Firebase: persistência do histórico ──────────────────────────
const CLI_DOC_ID = 'wk_cli_historico';

async function cliCarregarHist() {
  try {
    const snap = await getDoc(doc(_db, 'wk_estado', CLI_DOC_ID));
    if (snap.exists()) ST.cliHist = snap.data().hist || [];
  } catch (e) { mostrarErroDB(e); }
}

async function cliGuardarHist() {
  try {
    await setDoc(doc(_db, 'wk_estado', CLI_DOC_ID), { hist: ST.cliHist, ts: Date.now() });
  } catch (e) { mostrarErroDB(e); }
}

window.cliRender = function() {
  const ct = document.getElementById('cli-main'); if (!ct) return;
  if (ST.cliFase === 3) { cliRenderResultado(); return; }

  const perguntas       = CLI_PERGUNTAS.filter(p => p.momento === ST.cliFase);
  const respondidas     = perguntas.filter(p => ST.cliRespostas[p.id] !== undefined).length;
  const podeAvancar     = respondidas === perguntas.length;
  const totalRespondidas = Object.keys(ST.cliRespostas).filter(k => !k.endsWith('_idx')).length;
  const progresso       = Math.round((totalRespondidas / CLI_PERGUNTAS.length) * 100);

  ct.innerHTML = `
    <div style="margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.08em">
          ${ST.cliFase === 1 ? '🕐 Momento 1 — Início da conversa' : '🕑 Momento 2 — Após apresentação'}
        </div>
        <div style="font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.55)">${totalRespondidas}/${CLI_PERGUNTAS.length}</div>
      </div>
      <div style="height:5px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${progresso}%;background:var(--peach-dark);border-radius:99px;transition:width .3s"></div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;max-width:680px">
      ${perguntas.map(p => `
        <div class="cli-pergunta ${ST.cliRespostas[p.id] !== undefined ? 'respondida' : ''}">
          <div class="cli-pergunta-label">${p.label}${ST.cliRespostas[p.id] !== undefined ? ' <span style="color:var(--peach-dark)">✓</span>' : ''}</div>
          <div class="cli-opcoes">
            ${p.opcoes.map((o, idx) => `
              <button class="cli-opcao ${ST.cliRespostas[p.id + '_idx'] === idx ? 'selected' : ''}"
                      onclick="window.cliResponder('${p.id}',${o.pts},${idx})">
                ${o.txt}
              </button>`).join('')}
          </div>
        </div>`).join('')}
    </div>
    ${ST.cliFase === 1 ? `<div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:12px 16px;margin-top:16px;max-width:680px;font-size:11px;color:rgba(255,255,255,.55);line-height:1.7">
      💡 <strong style="color:rgba(255,255,255,.7)">Momento 2</strong> — Responde após apresentares o projeto e o valor ao cliente.
    </div>` : ''}
    <button onclick="window.cliAvancar()" ${podeAvancar ? '' : 'disabled'}
      style="margin-top:16px;max-width:680px;width:100%;padding:12px;border-radius:10px;font-family:var(--sans);font-size:13px;font-weight:700;cursor:${podeAvancar ? 'pointer' : 'not-allowed'};transition:all .2s;
      background:${podeAvancar ? 'rgba(122,46,10,.8)' : 'rgba(255,255,255,.08)'};
      border:1px solid ${podeAvancar ? 'rgba(255,190,152,.3)' : 'rgba(255,255,255,.15)'};
      color:${podeAvancar ? 'rgba(255,190,152,.9)' : 'rgba(255,255,255,.3)'};">
      ${ST.cliFase === 1 ? '→ Avançar para Momento 2' : '✓ Ver Resultado'}
    </button>`;
};

window.cliResponder = function(id, pts, idx) {
  ST.cliRespostas[id]          = pts;
  ST.cliRespostas[id + '_idx'] = idx;
  window.cliRender();
};

window.cliAvancar = function() {
  const perguntas   = CLI_PERGUNTAS.filter(p => p.momento === ST.cliFase);
  const podeAvancar = perguntas.every(p => ST.cliRespostas[p.id] !== undefined);
  if (!podeAvancar) return;
  ST.cliFase = ST.cliFase === 1 ? 2 : 3;
  window.cliRender();
};

function cliRenderResultado() {
  const ct = document.getElementById('cli-main'); if (!ct) return;
  const total = CLI_PERGUNTAS.reduce((s, p) => s + (ST.cliRespostas[p.id] || 0), 0);
  const max   = CLI_PERGUNTAS.length * 3;
  const pct   = Math.round((total / max) * 100);

  let perfil, cor, emoji, desc, acoes;
  if (pct >= 75)      { perfil='Cliente Real';       cor='#3A7A44'; emoji='🟢'; desc='Alta probabilidade de conversão. Investe tempo neste cliente.'; acoes=['Marcar data de entrega do projeto','Apresentar upgrade (tampo, eletros)','Propor visita à obra']; }
  else if (pct >= 50) { perfil='Cliente Incerto';    cor='#B8922A'; emoji='🟡'; desc='Interesse real mas com reservas. Qualifica antes de avançar.';   acoes=['Perceber quem falta decidir','Ancorar valor com referência de mercado','Propor próximo passo concreto']; }
  else if (pct >= 30) { perfil='Cliente em Dúvida';  cor='#C4612A'; emoji='🟠'; desc='Sinais mistos. Gere o tempo investido com critério.';            acoes=['Enviar proposta resumida','Definir prazo de resposta','Manter contacto com moderação']; }
  else                { perfil='Cliente Explorador'; cor='#DC2626'; emoji='🔴'; desc='Baixa probabilidade. Está a recolher informação.';               acoes=['Entregar info geral','Não investir mais sem sinal','Deixar porta aberta']; }

  ct.innerHTML = `
    <div style="max-width:660px">
      <div style="background:${cor}20;border:2px solid ${cor}44;border-radius:16px;padding:24px;margin-bottom:20px;text-align:center">
        <div style="font-size:42px;margin-bottom:10px">${emoji}</div>
        <div style="font-family:var(--serif);font-size:22px;font-weight:700;color:${cor};margin-bottom:6px">${perfil}</div>
        <div style="font-family:var(--mono);font-size:28px;font-weight:800;color:${cor};margin-bottom:10px">${pct}%</div>
        <div style="font-size:12px;color:rgba(255,255,255,.7);line-height:1.7">${desc}</div>
      </div>
      <div style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:16px;margin-bottom:16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.5);margin-bottom:12px">Próximos Passos</div>
        ${acoes.map((a, i) => `
          <div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:${i < acoes.length-1 ? '1px solid rgba(255,255,255,.1)' : 'none'}">
            <div style="width:20px;height:20px;border-radius:50%;background:${cor}30;color:${cor};font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
            <div style="font-size:12px;color:rgba(255,255,255,.8)">${a}</div>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="window.cliGuardar('${perfil}',${pct},'${cor}')"
          style="flex:1;padding:11px;border-radius:10px;background:${cor};border:none;color:#fff;font-family:var(--sans);font-size:12px;font-weight:700;cursor:pointer">
          💾 Guardar no Histórico
        </button>
        <button onclick="window.cliNovo()"
          style="flex:1;padding:11px;border-radius:10px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);color:rgba(255,255,255,.8);font-family:var(--sans);font-size:12px;font-weight:600;cursor:pointer">
          + Nova Avaliação
        </button>
      </div>
    </div>`;
}

window.cliNovo = function() {
  ST.cliRespostas = {};
  ST.cliFase = 1;
  window.cliRender();
};

window.cliGuardar = function(perfil, pct, cor) {
  const nome = document.getElementById('cli-nome')?.value?.trim() || 'Cliente';
  ST.cliHist.unshift({
    id:    Date.now(),
    data:  new Date().toLocaleDateString('pt-PT'),
    hora:  new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    nome, perfil, pct, cor,
  });
  cliGuardarHist(); // ← persistir no Firebase
  toast('✓ Avaliação guardada');
  if (ST.cliHistAberto) cliRenderHistorico();
};

window.cliHistorico = function() {
  ST.cliHistAberto = !ST.cliHistAberto;
  const p = document.getElementById('cli-hist-painel'); if (!p) return;
  if (ST.cliHistAberto) { p.classList.add('aberto'); cliRenderHistorico(); }
  else { p.classList.remove('aberto'); p.innerHTML = ''; }
};

function cliRenderHistorico() {
  const ct = document.getElementById('cli-hist-painel'); if (!ct) return;
  if (!ST.cliHist.length) {
    ct.innerHTML = `<div style="padding:24px;text-align:center;color:rgba(255,255,255,.4);font-size:12px">Sem avaliações guardadas</div>`;
    return;
  }
  ct.innerHTML = `
    <div style="padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.15);display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:12px;font-weight:700;color:rgba(255,255,255,.7)">📊 Histórico — ${ST.cliHist.length} avaliações</span>
      <button onclick="window.cliApagarHistorico()" style="font-size:10px;padding:3px 8px;border-radius:5px;background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.2);color:rgba(255,150,140,.5);cursor:pointer">× Limpar</button>
    </div>
    ${ST.cliHist.map((e, i) => `
      <div style="padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.1)">
        <div style="font-size:10px;color:rgba(255,255,255,.4);font-family:var(--mono)">${e.data} · ${e.hora}</div>
        <div style="font-size:12px;font-weight:600;color:rgba(255,255,255,.85);margin:3px 0">${e.nome}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:4px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${e.pct}%;background:${e.cor};border-radius:99px"></div>
          </div>
          <span style="font-family:var(--mono);font-size:12px;font-weight:700;color:${e.cor}">${e.pct}%</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:3px">
          <span style="font-size:11px;color:${e.cor}">${e.perfil}</span>
          <button onclick="window.cliApagarEntrada(${i})"
            style="font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(192,57,43,.08);border:1px solid rgba(192,57,43,.15);color:rgba(255,150,140,.4);cursor:pointer">×</button>
        </div>
      </div>`).join('')}`;
}

window.cliApagarEntrada = function(idx) {
  ST.cliHist.splice(idx, 1);
  cliGuardarHist();
  cliRenderHistorico();
  toast('✓ Entrada removida');
};

window.cliApagarHistorico = function() {
  window.wkConfirm('Limpar todo o histórico de avaliações?', () => {
    ST.cliHist = [];
    cliGuardarHist();
    cliRenderHistorico();
    toast('✓ Histórico limpo');
  });
};

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
(async function init() {
  const ov = document.createElement('div');
  ov.id = 'loading-overlay';
  ov.innerHTML = `
    <div style="width:36px;height:36px;border:3px solid rgba(255,190,152,.2);border-top-color:var(--peach-dark);border-radius:50%;animation:spin .8s linear infinite"></div>
    <div style="font-family:var(--sans);font-size:11px;font-weight:600;color:rgba(122,46,10,.7);letter-spacing:2px;text-transform:uppercase">Work Kit</div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
  document.body.appendChild(ov);

  onAuthStateChanged(_auth, async user => {
    if (user) {
      // Carregar todos os dados em paralelo (biblioteca, checklists, histórico clientes, orçamento MO)
      await Promise.all([
        bibCarregar(),
        chkCarregar(),
        cliCarregarHist(),
        moCarregarOrcamento(),
        matCarregar(),
      ]);
      setView('app');
      document.querySelector('[data-tab="assistente"]')?.classList.add('active');
      ov.remove();
    } else {
      ov.remove();
      setView('login');
    }
  });
})();
