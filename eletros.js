// ════════════════════════════════════════════════
// eletros.js · Work Kit · Hélder Melo
// v2 — Filtro marca · Editar/eliminar · Detalhes
//      Outros editável · Sem duplicado · Botões OK
// ════════════════════════════════════════════════

import { doc, setDoc, deleteDoc, getDocs, collection }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

function getDb() { return window._wkDb || null; }

// ════════════════════════════════════════════════
// BASE DE DADOS
// ════════════════════════════════════════════════
export const ELETRO_DB = [
  {
    tipo: 'Placa', icon: '🔥', cor: '#C4612A', essencial: true,
    artigos: [
      { ref:'93418142', nome:'Indução 4 zonas 7kW 59×52cm',       marca:'CATA',       preco:225, caract:'4 zonas · 7kW · Booster · Conectividade exaustor',            detalhes:'Ligação direta ao exaustor CATA. Timer integrado. Nível de potência 1-9. Função boost em todas as zonas. Encastre: 560×490mm.' },
      { ref:'93603006', nome:'Indução 4 zonas 60cm MonoSlider',    marca:'TEKA',       preco:289, caract:'4 zonas · Touch MonoSlider · Detetor recipiente',             detalhes:'Controlo deslizante único para todas as zonas. Sensor recipiente — desliga auto. Bloqueio de segurança. Encastre: 560×490mm.' },
      { ref:'90215362', nome:'Indução 4 zonas 60cm WiFi BT',       marca:'HAIER',      preco:389, caract:'4 zonas · Vidro Facetado · WiFi + Bluetooth',                detalhes:'Controlo via app. Design vidro facetado premium. Zona flexível. 9 níveis de potência. Compatível com assistente de voz.' },
      { ref:'95573263', nome:'Indução 4 zonas 7200W Sem Moldura',  marca:'AEG',        preco:399, caract:'4 zonas PowerBoost · Hob2Hood · Função Pausa · Sem moldura', detalhes:'Hob2Hood: comunica automaticamente com exaustor AEG. PowerBoost em todas as zonas. Design flush sem moldura. ★ Melhor escolha.' },
      { ref:'97012345', nome:'Vitrocerâmica 4 zonas 60cm',          marca:'TEKA',       preco:129, caract:'4 zonas · 6200W · 9 níveis · Temporizador',                  detalhes:'4 zonas radiantes. Potência total 6200W. Indicador de calor residual. Temporizador por zona. Boa opção de entrada de gama.' },
      { ref:'97012346', nome:'Gás 4 queimadores 60cm Inox',         marca:'CATA',       preco:159, caract:'4 queimadores · 7700W · 1 dupla chama · Inox',               detalhes:'1 queimador dupla chama (3000W). Tampa de vidro incluída. Grelhas em ferro fundido. Ignição automática. Válvulas de segurança.' },
    ],
  },
  {
    tipo: 'Forno', icon: '🍳', cor: '#8B4513', essencial: true,
    artigos: [
      { ref:'93470587', nome:'Multifunções 71L Aqualítica A+',      marca:'BOSCH',      preco:379, caract:'71L · 7 modos · Limpeza aqualítica · A+',                   detalhes:'71L. 7 funções de cozedura. Limpeza AquaClean com 300ml de água. Grelha telescópica incluída. LED. Classe A+.' },
      { ref:'84780952', nome:'Pirolítico 71L Hydroclean AUTO',       marca:'TEKA',       preco:399, caract:'Pirólise + Hydroclean AUTO · 8 funções · Guia telescópica',  detalhes:'Dupla limpeza: Pirólise (480°C) + Hydroclean AUTO. 8 funções incluindo convecção. Guia telescópica. Porta triplo vidro. ★ Melhor escolha.' },
      { ref:'95568582', nome:'Pirolítico 72L A++ Inox Infinity',     marca:'AEG',        preco:450, caract:'72L · Pirólise · A++ · Inox Infinity',                       detalhes:'72L. Pirólise 480°C. Classe A++. Design Infinity sem moldura. SteamBake. Porta fria. 9 funções de cozedura.' },
      { ref:'97012347', nome:'Multifunções 65L Classe A',            marca:'ELECTROLUX', preco:299, caract:'65L · 8 funções · Limpeza vapor · Classe A',                 detalhes:'65L. 8 modos de cozedura. Limpeza a vapor. LED. Programas automáticos. Boa relação qualidade-preço.' },
      { ref:'97012348', nome:'Vapor + Pirólise 70L WiFi',            marca:'HAIER',      preco:499, caract:'70L · Cozedura a vapor · Pirólise · WiFi',                   detalhes:'Cozedura a vapor integrada. Pirólise. Controlo via app. 10 modos automáticos. Sonda de temperatura incluída.' },
    ],
  },
  {
    tipo: 'Exaustor', icon: '💨', cor: '#2A5A9A', essencial: true,
    artigos: [
      { ref:'82051805', nome:'Oculto 49cm 820m³/h Touch',           marca:'CATA',       preco:170, caract:'Motor 240W · 4 níveis + turbo · LED · Touch',               detalhes:'Oculto sob móvel. 820m³/h. Motor 240W. LED. Touch. 4 vel + turbo. ★ Melhor escolha — melhor preço/performance.' },
      { ref:'82401306', nome:'Oculto 54cm 700m³/h 4 vel.',          marca:'AEG',        preco:330, caract:'4 velocidades · 700m³/h · LED',                             detalhes:'Design integrado premium. 700m³/h. 4 velocidades. LED. Filtros de alumínio laváveis. Compatível Hob2Hood com placas AEG.' },
      { ref:'96393346', nome:'Parede 90cm 1027m³/h Classe A',       marca:'CATA',       preco:319, caract:'3 níveis · 1027m³/h · Motor A1000 · LED · Classe A',        detalhes:'Exaustor de parede 90cm. Motor A1000 — alta eficiência. 1027m³/h. Classe A. LED perimetral. Filtros anti-gordura em alumínio.' },
      { ref:'97012349', nome:'Ilha 90cm 600m³/h Inox',              marca:'TEKA',       preco:549, caract:'600m³/h · LED · Touch · 3 velocidades + boost',             detalhes:'Para instalação em ilha. 90cm. Inox escovado. 600m³/h. Touch. LED. 3 vel + boost. Inclui tubo. Instalação a 4 pontos.' },
      { ref:'97012350', nome:'Integrado 60cm 720m³/h WiFi',         marca:'BOSCH',      preco:289, caract:'720m³/h · Integrado total · Home Connect WiFi',             detalhes:'Integração total — escondido no armário superior. 720m³/h. WiFi Home Connect. AutoAir: regula automaticamente a velocidade.' },
    ],
  },
  {
    tipo: 'Máquina Loiça', icon: '🍽', cor: '#3A7A44', essencial: true,
    artigos: [
      { ref:'96188516', nome:'13 conjuntos SmartSensor AquaStop',   marca:'TEKA',       preco:399, caract:'13 conjuntos · SmartSensor · Meia carga · AquaStop',        detalhes:'13 conjuntos. 60cm. Sensor sujidade. AquaStop anti-inundação. Meia carga. 5 programas. Classe E.' },
      { ref:'91306627', nome:'16 conjuntos BLDC WiFi Abertura Auto', marca:'HAIER',      preco:699, caract:'16 conjuntos · Motor BLDC · WiFi · Abertura Auto · 40dB',   detalhes:'16 conjuntos. Motor BLDC silencioso (40dB). Abertura automática no fim do ciclo. WiFi. 3 cestos. Classe A. ★ Motor BLDC.' },
      { ref:'97012351', nome:'14 conjuntos A++ 44dB PerfectDry',    marca:'BOSCH',      preco:549, caract:'14 conjuntos · A++ · 44dB · PerfectDry',                    detalhes:'14 conjuntos. Classe A++. 44dB ultra-silencioso. PerfectDry com zeólitos. 6 programas. EcoSilence Drive.' },
      { ref:'97012352', nome:'13 conjuntos 45cm SatelliteClean',    marca:'ELECTROLUX', preco:449, caract:'13 conjuntos · 45cm · 9 programas · SatelliteClean',        detalhes:'45cm — para espaços reduzidos. 13 conjuntos. SatelliteClean: braço rotativo 360°. 9 programas. Classe E.' },
    ],
  },
  {
    tipo: 'Microondas', icon: '📡', cor: '#6B4FC4', essencial: false,
    artigos: [
      { ref:'94544983', nome:'20L Integração Total Grill 1000W',    marca:'TEKA',       preco:229, caract:'Integração total · Grill 1000W · Interior inox',            detalhes:'Integração total sob forno. 20L. 700W microondas + 1000W grill. Interior inox. 5 níveis de potência. Porta push-push.' },
      { ref:'91200482', nome:'20L 700W Grill Prato 24.5cm',         marca:'ELECTROLUX', preco:259, caract:'20L · 700W · 1000W grill · Prato 24.5cm · Inox',           detalhes:'20L. 700W. Grill 1000W. Prato 24.5cm. Interior inox. 8 programas automáticos. Encastrar 60cm. Porta reversível.' },
      { ref:'97012353', nome:'25L 900W Grill + Convecção',          marca:'HAIER',      preco:299, caract:'25L · 900W · Grill + Convecção · Encastrar total',          detalhes:'25L. 900W. Grill + convecção. Encastrar total. Sensor humidade automático. 10 programas. Ideal combo com forno.' },
    ],
  },
  {
    tipo: 'Frigorífico', icon: '❄️', cor: '#2A7A9A', essencial: false,
    artigos: [
      { ref:'91201602', nome:'177cm Low Frost Inverter Classe E',   marca:'ELECTROLUX', preco:799, caract:'177cm · Low Frost · Compressor inverter · LED · Classe E',  detalhes:'177cm. 256L + 88L. Low Frost. Compressor inverter silencioso. FreshSense — sensor temperatura. Classe E.' },
      { ref:'97267020', nome:'177cm No Frost LED Classe E',         marca:'HAIER',      preco:809, caract:'177cm · No Frost · LED · Classe E',                         detalhes:'177cm. No Frost total. LED. MyZone — gaveta temperatura ajustável. Dobradiças amortecidas. Porta reversível. Classe E.' },
      { ref:'97012354', nome:'193cm No Frost WiFi VitaFresh',       marca:'BOSCH',      preco:999, caract:'193cm · No Frost · WiFi · VitaFresh · Classe C',            detalhes:'193cm. No Frost. WiFi Home Connect. VitaFresh. SuperCooling/Freezing automático. Classe C.' },
      { ref:'97012355', nome:'122cm 1 porta Slim Encastrar',        marca:'AEG',        preco:599, caract:'122cm · Slim Touch · LED · Classe D',                       detalhes:'122cm. 1 porta. Ideal sob bancada ou coluna. Slim Touch. LED. GreenZone — gaveta 0°C. Classe D.' },
    ],
  },
  {
    tipo: 'Máquina Roupa', icon: '👕', cor: '#7A3A9A', essencial: false,
    artigos: [
      { ref:'97267322', nome:'9kg 1600RPM 16 prog. Vapor',          marca:'HAIER',      preco:689, caract:'9kg · 1600RPM · Classe A-30% · 16 programas c/ Vapor',     detalhes:'9kg. 1600RPM. Classe A-30%. 16 programas. Vapor. Motor direto. Higienização 60°. Anti-alérgico. Encastrar total.' },
      { ref:'97012356', nome:'8kg 1400RPM ActiveCare Classe A',     marca:'ELECTROLUX', preco:599, caract:'8kg · 1400RPM · ActiveCare · Classe A · UltraMix',          detalhes:'8kg. 1400RPM. Classe A. UltraMix. ActiveCare — cuida das fibras. Vapor a pedido. 14 programas.' },
      { ref:'97012357', nome:'8kg 1200RPM EcoSilence Drive',        marca:'BOSCH',      preco:649, caract:'8kg · 1200RPM · EcoSilence Drive · SpeedPerfect',           detalhes:'8kg. 1200RPM. EcoSilence Drive. SpeedPerfect: 65% mais rápido. AntiVibration. 15 programas.' },
    ],
  },
  {
    tipo: 'Secadora', icon: '🌀', cor: '#9A5A2A', essencial: false,
    artigos: [
      { ref:'97012358', nome:'8kg Bomba Calor A+ SelfCleaning',     marca:'BOSCH',      preco:549, caract:'8kg · Bomba de calor · Classe A+ · SelfCleaning',           detalhes:'8kg. Bomba de calor. Classe A+. SelfCleaning automático. AutoDry — sensor humidade. 15 programas.' },
      { ref:'97012359', nome:'8kg Condensação Classe B',            marca:'HAIER',      preco:399, caract:'8kg · Condensação · Classe B · 12 programas',               detalhes:'8kg. Condensação. Classe B. 12 programas. Painel táctil. LED. Programa de engomar.' },
    ],
  },
  {
    tipo: 'Outros', icon: '🔌', cor: '#6B6B8A', essencial: false, _custom: true,
    artigos: [
      { ref:'97020001', nome:'Máquina de Café Encastrar 15 bar',    marca:'BOSCH',      preco:899, caract:'15 bar · Moedor integrado · Leite automático · WiFi',       detalhes:'Totalmente encastrada. 15 bar. Moedor cerâmico integrado. Sistema leite automático. WiFi Home Connect. Ecrã TFT a cores.' },
      { ref:'97020002', nome:'Frigorífico de Vinho 30 garrafas',    marca:'HAIER',      preco:599, caract:'30 garrafas · 2 zonas · LED · Anti-vibração',               detalhes:'30 garrafas. 2 zonas temperatura independentes (5-22°C). LED. Anti-vibração. Porta vidro duplo. Encastrar 60cm.' },
      { ref:'97020003', nome:'Arca Congeladora 86L Encastrar',      marca:'ELECTROLUX', preco:449, caract:'86L · No Frost · Classe E · 4 gavetas',                     detalhes:'86L. No Frost. 4 gavetas extraíveis. Classe E. SuperFreeze automático. LED. Alarme porta aberta.' },
      { ref:'97020004', nome:'Forno Vapor 45cm Encastrar',          marca:'AEG',        preco:699, caract:'45cm · 6 modos vapor · Pirólise leve · Classe A',           detalhes:'45cm. Forno vapor encastrar. 6 modos. Pirólise leve. SteamBoost. Ideal cozinha saudável. Classe A.' },
    ],
  },
];

export const ELETRO_ESSENCIAIS = ELETRO_DB.filter(t => t.essencial).map(t => t.tipo);

// ════════════════════════════════════════════════
// ESTADO
// ════════════════════════════════════════════════
const ES = {
  tab:           'catalogo',
  tipoFiltro:    '',
  marcaFiltro:   '',
  pesquisa:      '',
  ordenacao:     'nome',
  orc:           [],
  detalheAberto: null,
};

let _overrides = {};

// ════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════
function fmt(v) {
  const n = parseFloat(v);
  return isNaN(n) ? '—' : n.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' €';
}
function toast(msg) { window.wkToast?.(msg); }
function copiar(txt, el) {
  navigator.clipboard.writeText(String(txt)).then(() => {
    toast('✓ Copiado: ' + txt);
    if (el) { const o = el.textContent; el.textContent = '✓'; setTimeout(() => el.textContent = o, 1400); }
  });
}
function artigoResolvido(a) {
  return _overrides[a.ref] ? { ...a, ..._overrides[a.ref] } : a;
}
function todasAsMarcas() {
  const s = new Set();
  ELETRO_DB.forEach(t => t.artigos.forEach(a => { if (a.marca) s.add(a.marca); }));
  return [...s].sort();
}
function getCorTipo(tipo)  { return ELETRO_DB.find(t => t.tipo === tipo)?.cor  || '#888'; }
function getIconTipo(tipo) { return ELETRO_DB.find(t => t.tipo === tipo)?.icon || '⚡'; }

// ════════════════════════════════════════════════
// FIREBASE
// ════════════════════════════════════════════════
async function carregarOverrides() {
  const db = getDb(); if (!db) return;
  try {
    const snap = await getDocs(collection(db, 'wk_eletros_overrides'));
    snap.forEach(d => { _overrides[d.id] = d.data(); });
  } catch(e) { console.warn('eletros: overrides', e); }
}
async function guardarOverride(ref, dados) {
  _overrides[ref] = dados;
  const db = getDb(); if (!db) return;
  try { await setDoc(doc(db, 'wk_eletros_overrides', ref), dados); } catch(e) {}
}
async function apagarOverrideDb(ref) {
  delete _overrides[ref];
  const db = getDb(); if (!db) return;
  try { await deleteDoc(doc(db, 'wk_eletros_overrides', ref)); } catch(e) {}
}

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
export async function eletroInit() {
  await carregarOverrides();
  renderEletroHeader();
  renderEletroTabs();
  switchEletroTab(ES.tab);
}

function renderEletroHeader() {
  const ct = document.getElementById('eletro-header'); if (!ct) return;
  ct.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px">
      <div>
        <div class="page-titulo">Eletrodomésticos</div>
        <div class="page-sub">Catálogo · Filtro por marca · Orçamento com referências LM</div>
      </div>
      <div style="display:flex;gap:5px">
        <button onclick="window.switchEletroTab('catalogo')" id="eletro-tab-btn-catalogo"
          class="btn-sec ${ES.tab==='catalogo'?'active':''}">📋 Catálogo</button>
        <button onclick="window.switchEletroTab('orcamento')" id="eletro-tab-btn-orcamento"
          class="btn-sec ${ES.tab==='orcamento'?'active':''}">
          🧾 Orçamento
          <span id="eletro-badge-count" style="display:${ES.orc.length?'inline-block':'none'};
            background:rgba(196,97,42,.25);border-radius:99px;padding:1px 7px;
            font-family:var(--mono);font-size:10px;margin-left:4px">${ES.orc.length||''}</span>
        </button>
      </div>
    </div>`;
}

function renderEletroTabs() {
  ['catalogo','orcamento'].forEach(t => {
    let el = document.getElementById('eletro-ct-' + t);
    if (!el) {
      el = document.createElement('div');
      el.id = 'eletro-ct-' + t;
      el.style.display = 'none';
      document.getElementById('eletro-body')?.appendChild(el);
    }
  });
}

export function switchEletroTab(tab) {
  ES.tab = tab;
  ['catalogo','orcamento'].forEach(t => {
    const el  = document.getElementById('eletro-ct-' + t);
    const btn = document.getElementById('eletro-tab-btn-' + t);
    if (el)  el.style.display  = t === tab ? '' : 'none';
    if (btn) btn.classList.toggle('active', t === tab);
  });
  if (tab === 'catalogo')  renderCatalogo();
  if (tab === 'orcamento') renderOrcamento();
  atualizarBadge();
}
window.switchEletroTab = switchEletroTab;

// ════════════════════════════════════════════════
// CATÁLOGO
// ════════════════════════════════════════════════
function renderCatalogo() {
  const ct = document.getElementById('eletro-ct-catalogo'); if (!ct) return;

  const ddStyle = `padding:8px 12px;border-radius:9px;background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.1);color:var(--t2);font-family:var(--sans);
    font-size:12px;font-weight:500;cursor:pointer;outline:none;transition:border-color .15s;
    appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,.25)'/%3E%3C/svg%3E");
    background-repeat:no-repeat;background-position:right 10px center;padding-right:28px;`;

  ct.innerHTML = `
    <!-- Linha de filtros: Tipo · Marca · Ordenar · Pesquisa -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:16px">

      <!-- Tipo -->
      <select id="eletro-sel-tipo" onchange="window.eletroFiltrarTipo(this.value)"
        style="${ddStyle}min-width:140px;border-color:${ES.tipoFiltro?'rgba(196,97,42,.4)':'rgba(255,255,255,.1)'}">
        <option value="">⚡ Todos os tipos</option>
        ${ELETRO_DB.map(t=>`<option value="${t.tipo}" ${ES.tipoFiltro===t.tipo?'selected':''}>
          ${t.icon} ${t.tipo}${t.essencial?' ⭐':''}
        </option>`).join('')}
      </select>

      <!-- Marca -->
      <select id="eletro-sel-marca" onchange="window.eletroFiltrarMarca(this.value)"
        style="${ddStyle}min-width:120px;border-color:${ES.marcaFiltro?'rgba(196,97,42,.4)':'rgba(255,255,255,.1)'}">
        <option value="">Todas as marcas</option>
        ${todasAsMarcas().map(m=>`<option value="${m}" ${ES.marcaFiltro===m?'selected':''}>${m}</option>`).join('')}
      </select>

      <!-- Ordenar -->
      <select id="eletro-sel-ord" onchange="window.eletroOrdenar(this.value)"
        style="${ddStyle}min-width:110px">
        <option value="nome"     ${ES.ordenacao==='nome'    ?'selected':''}>A → Z</option>
        <option value="pvp_asc"  ${ES.ordenacao==='pvp_asc' ?'selected':''}>Preço ↑</option>
        <option value="pvp_desc" ${ES.ordenacao==='pvp_desc'?'selected':''}>Preço ↓</option>
        <option value="marca"    ${ES.ordenacao==='marca'   ?'selected':''}>Marca</option>
      </select>

      <!-- Pesquisa -->
      <div class="search-wrap" style="position:relative;flex:1;min-width:160px">
        <span class="search-icon">⌕</span>
        <input type="text" id="eletro-pesq-input" class="search-input"
          placeholder="Pesquisar nome, ref LM…"
          value="${ES.pesquisa}" oninput="window.eletroPesquisar(this.value)" style="padding-right:28px">
        <button onclick="window.eletroClearPesq()"
          style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;
          color:${ES.pesquisa?'var(--t2)':'var(--t4)'};font-size:15px;cursor:pointer;padding:2px 4px">×</button>
      </div>
    </div>

    <!-- Info + novo artigo -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <div class="bib-info" style="margin:0" id="eletro-info-bar"></div>
      <button onclick="window.eletroNovoArtigo()"
        style="padding:5px 12px;border-radius:7px;background:rgba(58,122,68,.1);border:1px solid rgba(58,122,68,.2);
        color:rgba(150,220,150,.7);font-family:var(--sans);font-size:11px;font-weight:700;cursor:pointer">
        + Novo artigo
      </button>
    </div>

    <!-- Grid -->
    <div class="cards-grid" id="eletro-grid-cards"></div>

    <!-- Painel lateral de detalhe -->
    <div id="eletro-det-painel" style="display:none;position:fixed;top:54px;right:0;bottom:0;width:320px;
      background:rgba(18,18,22,.97);backdrop-filter:blur(32px) saturate(180%);
      border-left:1px solid rgba(255,255,255,.08);box-shadow:-4px 0 32px rgba(0,0,0,.5);
      z-index:400;overflow-y:auto;flex-direction:column">
      <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
        <div style="font-family:var(--serif);font-size:15px;color:var(--t1);line-height:1.3;flex:1;margin-right:10px" id="eletro-det-titulo">—</div>
        <button onclick="window.eletroFecharDetalhe()"
          style="width:26px;height:26px;border-radius:50%;background:var(--glass-bg);border:1px solid var(--glass-brd);
          color:var(--t3);cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;flex-shrink:0">×</button>
      </div>
      <div style="padding:18px 20px;flex:1" id="eletro-det-body"></div>
    </div>`;

  renderCatalogoGrid();
}

function renderCatalogoGrid() {
  const grid = document.getElementById('eletro-grid-cards');
  const info = document.getElementById('eletro-info-bar');
  if (!grid) return;

  const pesq = ES.pesquisa.toLowerCase().trim();
  let artigos = [];

  ELETRO_DB.forEach(tipo => {
    if (ES.tipoFiltro && tipo.tipo !== ES.tipoFiltro) return;
    tipo.artigos.forEach(a => {
      const ar = artigoResolvido(a);
      if (ES.marcaFiltro && ar.marca !== ES.marcaFiltro) return;
      if (pesq && !ar.nome.toLowerCase().includes(pesq)
               && !(ar.marca||'').toLowerCase().includes(pesq)
               && !(ar.ref||'').includes(pesq)
               && !(ar.caract||'').toLowerCase().includes(pesq)) return;
      artigos.push({ ...ar, _tipo: tipo.tipo, _cor: tipo.cor, _icon: tipo.icon, _essencial: tipo.essencial });
    });
  });

  artigos.sort((a,b) => {
    if (ES.ordenacao==='pvp_asc')  return (a.preco||9999)-(b.preco||9999);
    if (ES.ordenacao==='pvp_desc') return (b.preco||0)-(a.preco||0);
    if (ES.ordenacao==='marca')    return (a.marca||'').localeCompare(b.marca||'','pt');
    return a.nome.localeCompare(b.nome,'pt');
  });

  const orLabel = {nome:'A→Z',pvp_asc:'preço ↑',pvp_desc:'preço ↓',marca:'marca'}[ES.ordenacao];
  if (info) info.textContent = `${artigos.length} artigo${artigos.length!==1?'s':''} · ${ES.tipoFiltro||'todos os tipos'}${ES.marcaFiltro?' · '+ES.marcaFiltro:''} · ${orLabel}`;

  if (!artigos.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">⚡</div><div class="empty-titulo">Sem resultados</div>
      <div class="empty-sub">Ajusta os filtros ou a pesquisa</div></div>`;
    return;
  }

  grid.innerHTML = artigos.map(a => renderCardEletro(a)).join('');
}

function renderCardEletro(a) {
  const noOrc      = ES.orc.some(x => x.ref === a.ref);
  const isMelhor   = (a.detalhes||'').includes('★');
  const detAberto  = ES.detalheAberto === a.ref;

  return `
    <div class="tampo-card" style="display:flex;flex-direction:column;gap:8px;
      ${noOrc    ?'border-color:rgba(58,122,68,.4);background:rgba(58,122,68,.04);':''}
      ${detAberto?'border-color:rgba(196,97,42,.45);':''}">

      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
          padding:2px 8px;border-radius:99px;background:${a._cor}18;border:1px solid ${a._cor}33;color:${a._cor}">
          ${a._icon} ${a._tipo}${a._essencial?' ⭐':''}
        </span>
        ${isMelhor?`<span style="font-size:9px;font-weight:700;color:rgba(255,190,152,.5)">★ Melhor escolha</span>`:'<span></span>'}
      </div>

      <div>
        <div style="font-size:13px;font-weight:600;color:var(--t1);line-height:1.3">${a.nome}</div>
        <div style="font-size:10px;color:var(--t4);margin-top:1px;font-weight:700;letter-spacing:.06em">${a.marca||''}</div>
      </div>

      ${a.caract?`<div style="font-size:10px;color:var(--t3);line-height:1.5;border-top:1px solid rgba(255,255,255,.05);padding-top:6px">${a.caract}</div>`:''}

      <div style="display:flex;align-items:center;justify-content:space-between;padding-top:6px;border-top:1px solid rgba(255,255,255,.06)">
        <div style="display:flex;align-items:center;gap:4px">
          <span style="font-family:var(--mono);font-size:10px;color:var(--t4)">Ref ${a.ref}</span>
          <button onclick="window.eletrosCopiarRef('${a.ref}',this)"
            style="padding:2px 5px;border-radius:4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:var(--t4);font-size:9px;cursor:pointer">⎘</button>
          <a href="https://www.leroymerlin.pt/pesquisa/${a.ref}" target="_blank"
            style="padding:2px 5px;border-radius:4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:var(--t4);font-size:9px;text-decoration:none">↗</a>
        </div>
        <span style="font-family:var(--mono);font-size:15px;font-weight:700;color:var(--t1)">${fmt(a.preco)}</span>
      </div>

      <!-- Botões: ℹ Detalhes · ✏️ Editar · + Orçamento -->
      <div style="display:flex;gap:5px;margin-top:2px">
        <button onclick="window.eletroToggleDetalhe('${a.ref}')"
          style="padding:6px 9px;border-radius:7px;font-size:10px;font-weight:700;cursor:pointer;transition:all .15s;
          ${detAberto
            ?'background:rgba(196,97,42,.2);border:1px solid rgba(196,97,42,.4);color:rgba(255,190,152,.9)'
            :'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:var(--t3)'}">
          ℹ︎
        </button>
        <button onclick="window.eletroEditarArtigo('${a.ref}')"
          style="padding:6px 9px;border-radius:7px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
          color:var(--t4);font-size:11px;cursor:pointer;transition:all .15s" title="Editar">✏️</button>
        <button onclick="window.eletroToggleOrc('${a.ref}')"
          style="flex:1;padding:6px 8px;border-radius:7px;font-family:var(--sans);font-size:10px;font-weight:700;cursor:pointer;transition:all .18s;
          ${noOrc
            ?'background:rgba(58,122,68,.25);border:1px solid rgba(58,122,68,.4);color:rgba(150,220,150,.85)'
            :'background:rgba(196,97,42,.1);border:1px solid rgba(196,97,42,.25);color:rgba(255,190,152,.7)'}">
          ${noOrc?'✓ No Orçamento':'+ Orçamento'}
        </button>
      </div>
    </div>`;
}

// ════════════════════════════════════════════════
// PAINEL DETALHE LATERAL
// ════════════════════════════════════════════════
window.eletroToggleDetalhe = function(ref) {
  if (ES.detalheAberto === ref) { window.eletroFecharDetalhe(); return; }
  ES.detalheAberto = ref;

  let artigo = null;
  ELETRO_DB.forEach(t => { const a = t.artigos.find(x => x.ref === ref); if (a) artigo = artigoResolvido(a); });
  if (!artigo) return;

  const painel = document.getElementById('eletro-det-painel');
  const titulo = document.getElementById('eletro-det-titulo');
  const body   = document.getElementById('eletro-det-body');
  if (!painel||!titulo||!body) return;

  titulo.textContent = artigo.nome;
  const noOrc = ES.orc.some(x => x.ref === ref);

  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:99px;
        background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:var(--t3)">${artigo.marca||''}</span>
      <span style="font-family:var(--mono);font-size:10px;color:var(--t4)">Ref ${artigo.ref}</span>
      <span style="font-family:var(--mono);font-size:15px;font-weight:700;color:var(--t1);margin-left:auto">${fmt(artigo.preco)}</span>
    </div>

    ${artigo.caract?`
    <div style="background:rgba(196,97,42,.06);border:1px solid rgba(196,97,42,.15);border-radius:10px;padding:10px 14px;margin-bottom:14px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(196,97,42,.5);margin-bottom:7px">Características</div>
      ${artigo.caract.split('·').map(c=>`<div style="font-size:11px;color:var(--t2);line-height:1.8;padding:1px 0">· ${c.trim()}</div>`).join('')}
    </div>`:''}

    ${artigo.detalhes?`
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 14px;margin-bottom:16px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4);margin-bottom:8px">Detalhes</div>
      <div style="font-size:12px;color:var(--t2);line-height:1.8">${artigo.detalhes}</div>
    </div>`:''}

    <div style="display:flex;flex-direction:column;gap:6px">
      <button onclick="window.eletroToggleOrc('${ref}')"
        style="padding:9px;border-radius:8px;font-family:var(--sans);font-size:11px;font-weight:700;cursor:pointer;
        background:rgba(196,97,42,.12);border:1px solid rgba(196,97,42,.25);color:rgba(255,190,152,.8)">
        ${noOrc?'× Remover do Orçamento':'+ Adicionar ao Orçamento'}
      </button>
      <button onclick="window.eletrosCopiarRef('${artigo.ref}',this)"
        style="padding:7px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
        color:var(--t3);font-family:var(--sans);font-size:11px;cursor:pointer">
        ⎘ Copiar Ref ${artigo.ref}
      </button>
    </div>`;

  painel.style.display = 'flex';
  painel.style.flexDirection = 'column';
  renderCatalogoGrid();
};

window.eletroFecharDetalhe = function() {
  ES.detalheAberto = null;
  const p = document.getElementById('eletro-det-painel');
  if (p) p.style.display = 'none';
  renderCatalogoGrid();
};

// ════════════════════════════════════════════════
// EDITAR / NOVO ARTIGO — MODAL
// ════════════════════════════════════════════════
window.eletroEditarArtigo = function(ref) {
  let artigo = null, tipoNome = '';
  ELETRO_DB.forEach(t => { const a = t.artigos.find(x => x.ref === ref); if (a) { artigo = artigoResolvido(a); tipoNome = t.tipo; } });
  if (!artigo) return;
  abrirModalEletro({ ...artigo, _tipo: tipoNome }, false);
};

window.eletroNovoArtigo = function() {
  abrirModalEletro({ ref:'', nome:'', marca:'', preco:'', caract:'', detalhes:'', _tipo:'Outros' }, true);
};

function abrirModalEletro(artigo, isNovo) {
  document.getElementById('eletro-modal-edit')?.remove();
  const tipos = ELETRO_DB.map(t => t.tipo);
  const m = document.createElement('div');
  m.id = 'eletro-modal-edit';
  m.className = 'overlay-modal open';
  m.innerHTML = `
    <div class="modal-box" style="max-width:520px">
      <div class="modal-header">
        <div class="modal-titulo">${isNovo?'Novo Artigo':'Editar Artigo'}</div>
        <button class="modal-close" onclick="document.getElementById('eletro-modal-edit').remove()">×</button>
      </div>
      <div class="modal-body">
        <div class="form-grid-2">
          <div class="form-campo full">
            <label class="form-label">Nome / Descrição *</label>
            <input id="em-nome" class="f-input" value="${(artigo.nome||'').replace(/"/g,'&quot;')}" placeholder="Ex: Indução 4 zonas 60cm">
          </div>
          <div class="form-campo">
            <label class="form-label">Tipo</label>
            <select id="em-tipo" class="f-select">
              ${tipos.map(t=>`<option value="${t}" ${artigo._tipo===t?'selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-campo">
            <label class="form-label">Marca</label>
            <input id="em-marca" class="f-input" value="${(artigo.marca||'').replace(/"/g,'&quot;')}" placeholder="TEKA, BOSCH…">
          </div>
          <div class="form-campo">
            <label class="form-label">Referência LM *</label>
            <input id="em-ref" class="f-input" value="${artigo.ref||''}" placeholder="Ex: 93418142" ${!isNovo?'readonly style="opacity:.5;cursor:not-allowed"':''}>
          </div>
          <div class="form-campo">
            <label class="form-label">Preço PVP (€)</label>
            <input id="em-preco" type="number" class="f-input" value="${artigo.preco||''}" placeholder="0.00" step="0.01" min="0">
          </div>
          <div class="form-campo full">
            <label class="form-label">Características (separar por ·)</label>
            <input id="em-caract" class="f-input" value="${(artigo.caract||'').replace(/"/g,'&quot;')}" placeholder="Ex: 4 zonas · 7kW · Booster">
          </div>
          <div class="form-campo full">
            <label class="form-label">Detalhes técnicos</label>
            <textarea id="em-detalhes" class="f-textarea" rows="3" placeholder="Info adicional, notas de instalação…">${artigo.detalhes||''}</textarea>
          </div>
        </div>
        ${!isNovo?`
        <div style="margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:10px">
          <button onclick="window.eletroApagarArtigo('${artigo.ref}')"
            style="padding:7px 14px;border-radius:8px;background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.25);
            color:rgba(255,150,140,.7);font-family:var(--sans);font-size:11px;font-weight:600;cursor:pointer">
            🗑 Eliminar artigo
          </button>
          <span style="font-size:10px;color:var(--t4)">Remove permanentemente do catálogo</span>
        </div>`:''}
      </div>
      <div class="modal-footer">
        <button class="btn-cancelar" onclick="document.getElementById('eletro-modal-edit').remove()">Cancelar</button>
        <button class="btn-guardar" onclick="window.eletroGuardarArtigo('${artigo.ref||''}',${isNovo})">Guardar</button>
      </div>
    </div>`;
  document.body.appendChild(m);
  setTimeout(() => document.getElementById('em-nome')?.focus(), 80);
}

window.eletroGuardarArtigo = async function(refOriginal, isNovo) {
  const nome    = document.getElementById('em-nome')?.value.trim();
  const refInp  = document.getElementById('em-ref')?.value.trim();
  const ref     = isNovo ? refInp : refOriginal;
  const tipo    = document.getElementById('em-tipo')?.value;
  const marca   = document.getElementById('em-marca')?.value.trim();
  const preco   = parseFloat(document.getElementById('em-preco')?.value) || 0;
  const caract  = document.getElementById('em-caract')?.value.trim();
  const detalhes= document.getElementById('em-detalhes')?.value.trim();

  if (!nome) { toast('⚠️ Nome obrigatório'); return; }
  if (!ref)  { toast('⚠️ Referência LM obrigatória'); return; }

  if (isNovo) {
    const t = ELETRO_DB.find(t => t.tipo === tipo) || ELETRO_DB.find(t => t.tipo === 'Outros');
    if (t) t.artigos.push({ ref, nome, marca, preco, caract, detalhes, nota:'' });
  }

  await guardarOverride(ref, { nome, marca, preco, caract, detalhes });
  document.getElementById('eletro-modal-edit')?.remove();
  renderCatalogoGrid();
  toast(isNovo ? '✓ Artigo adicionado' : '✓ Artigo actualizado');
};

window.eletroApagarArtigo = async function(ref) {
  if (!confirm('Eliminar este artigo do catálogo?\nEsta acção não pode ser desfeita.')) return;
  ELETRO_DB.forEach(t => { t.artigos = t.artigos.filter(a => a.ref !== ref); });
  ES.orc = ES.orc.filter(x => x.ref !== ref);
  await apagarOverrideDb(ref);
  document.getElementById('eletro-modal-edit')?.remove();
  if (ES.detalheAberto === ref) window.eletroFecharDetalhe();
  atualizarBadge();
  renderCatalogoGrid();
  toast('✓ Artigo eliminado');
};

// ════════════════════════════════════════════════
// ORÇAMENTO
// ════════════════════════════════════════════════
function renderOrcamento() {
  const ct = document.getElementById('eletro-ct-orcamento'); if (!ct) return;

  const tiposNoOrc = new Set(ES.orc.map(a => a._tipo));
  const emFalta    = ELETRO_ESSENCIAIS.filter(t => !tiposNoOrc.has(t));
  const total      = ES.orc.reduce((s,a) => s + (a.preco||0) * (a.qty||1), 0);

  ct.innerHTML = `
    ${emFalta.length
      ?`<div class="ass-alerta" style="margin-bottom:14px">⭐ <strong>Essenciais em falta:</strong> ${emFalta.join(' · ')}</div>`
      :`<div style="background:rgba(58,122,68,.1);border:1px solid rgba(58,122,68,.25);border-radius:10px;
          padding:10px 14px;font-size:11px;color:rgba(150,220,150,.8);margin-bottom:14px">
          ✅ Todos os essenciais incluídos
         </div>`}

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="page-titulo" style="font-size:18px">Orçamento Eletros</div>
      ${ES.orc.length?`
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button onclick="window.eletrosCopiarOrcamento()"
          style="padding:7px 13px;border-radius:8px;background:rgba(196,97,42,.12);border:1px solid rgba(196,97,42,.25);
          color:rgba(255,190,152,.8);font-family:var(--sans);font-size:11px;font-weight:700;cursor:pointer">
          📋 Copiar c/ Refs
        </button>
        <button onclick="window.eletrosCopiarSoRefs()"
          style="padding:7px 13px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
          color:var(--t2);font-family:var(--sans);font-size:11px;font-weight:600;cursor:pointer">
          ⎘ Só Refs LM
        </button>
        <button onclick="window.eletrosLimpar()"
          style="padding:7px 13px;border-radius:8px;background:rgba(192,57,43,.08);border:1px solid rgba(192,57,43,.2);
          color:rgba(255,150,140,.6);font-family:var(--sans);font-size:11px;font-weight:600;cursor:pointer">
          × Limpar
        </button>
      </div>`:''}
    </div>

    ${!ES.orc.length
      ?`<div class="empty-state">
          <div class="empty-icon">⚡</div>
          <div class="empty-titulo">Orçamento vazio</div>
          <div class="empty-sub">Vai ao Catálogo e adiciona eletros</div>
          <button onclick="window.switchEletroTab('catalogo')"
            style="margin-top:14px;padding:8px 18px;border-radius:8px;background:rgba(196,97,42,.12);
            border:1px solid rgba(196,97,42,.25);color:rgba(255,190,152,.7);font-family:var(--sans);
            font-size:11px;font-weight:700;cursor:pointer">→ Ver Catálogo</button>
         </div>`
      :`<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
          ${ES.orc.map((a,i)=>`
            <div style="background:var(--glass-bg);backdrop-filter:blur(16px);border:1px solid var(--glass-brd);
              border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:2px 8px;
                border-radius:99px;flex-shrink:0;background:${getCorTipo(a._tipo)}18;
                border:1px solid ${getCorTipo(a._tipo)}33;color:${getCorTipo(a._tipo)}">
                ${getIconTipo(a._tipo)} ${a._tipo}
              </span>
              <div style="flex:1;min-width:130px">
                <div style="font-size:12px;font-weight:600;color:var(--t1)">${a.nome}</div>
                <div style="display:flex;align-items:center;gap:5px;margin-top:2px;flex-wrap:wrap">
                  <span style="font-size:9px;font-weight:700;color:var(--t4);font-family:var(--mono)">${a.marca||''}</span>
                  <span style="font-family:var(--mono);font-size:10px;color:var(--t4)">· Ref: ${a.ref}</span>
                  <button onclick="window.eletrosCopiarRef('${a.ref}',this)"
                    style="padding:1px 5px;border-radius:3px;background:rgba(255,255,255,.05);
                    border:1px solid rgba(255,255,255,.08);color:var(--t4);font-size:9px;cursor:pointer">⎘</button>
                </div>
                <input type="text" placeholder="Nota…" value="${a.nota||''}"
                  onchange="window.eletrosAtualizarNota(${i},this.value)"
                  style="margin-top:6px;width:100%;padding:4px 8px;border-radius:5px;
                  background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
                  font-family:var(--sans);font-size:10px;color:var(--t2);outline:none"
                  onfocus="this.style.borderColor='rgba(196,97,42,.3)'"
                  onblur="this.style.borderColor='rgba(255,255,255,.07)'">
              </div>
              <div style="display:flex;align-items:center;gap:5px;flex-shrink:0">
                <button onclick="window.eletrosQty(${i},-1)"
                  style="width:26px;height:26px;border-radius:6px;background:rgba(255,255,255,.07);
                  border:1px solid rgba(255,255,255,.1);color:var(--t2);font-size:14px;cursor:pointer;
                  display:flex;align-items:center;justify-content:center">−</button>
                <span style="font-family:var(--mono);font-size:14px;font-weight:700;color:var(--t1);min-width:20px;text-align:center">${a.qty||1}</span>
                <button onclick="window.eletrosQty(${i},+1)"
                  style="width:26px;height:26px;border-radius:6px;background:rgba(255,255,255,.07);
                  border:1px solid rgba(255,255,255,.1);color:var(--t2);font-size:14px;cursor:pointer;
                  display:flex;align-items:center;justify-content:center">+</button>
              </div>
              <div style="text-align:right;flex-shrink:0;min-width:80px">
                <div style="font-size:9px;color:var(--t4)">${fmt(a.preco)} / un</div>
                <div style="font-family:var(--mono);font-size:16px;font-weight:700;color:var(--t1)">${fmt((a.preco||0)*(a.qty||1))}</div>
              </div>
              <button onclick="window.eletroToggleOrc('${a.ref}')"
                style="width:28px;height:28px;border-radius:50%;background:rgba(192,57,43,.1);
                border:1px solid rgba(192,57,43,.2);color:rgba(255,150,140,.5);font-size:14px;cursor:pointer;
                display:flex;align-items:center;justify-content:center;flex-shrink:0">×</button>
            </div>`).join('')}
        </div>

        <div style="background:rgba(196,97,42,.07);border:1px solid rgba(196,97,42,.2);border-radius:14px;
          padding:16px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,190,152,.5)">Total Eletrodomésticos</div>
            <div style="font-size:11px;color:var(--t4);margin-top:2px">${ES.orc.length} artigo${ES.orc.length!==1?'s':''} · ${ES.orc.reduce((s,a)=>s+(a.qty||1),0)} un</div>
          </div>
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--peach)">${fmt(total)}</div>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button onclick="window.eletrosCopiarOrcamento()"
            style="flex:1;min-width:180px;padding:11px;border-radius:10px;background:rgba(196,97,42,.15);
            border:1px solid rgba(196,97,42,.3);color:rgba(255,190,152,.85);font-family:var(--sans);
            font-size:12px;font-weight:700;cursor:pointer">
            📋 Copiar Orçamento c/ Referências
          </button>
          <button onclick="window.eletrosCopiarSoRefs()"
            style="flex:1;min-width:150px;padding:11px;border-radius:10px;background:rgba(255,255,255,.06);
            border:1px solid rgba(255,255,255,.12);color:var(--t2);font-family:var(--sans);
            font-size:12px;font-weight:600;cursor:pointer">
            ⎘ Só Referências LM
          </button>
        </div>`
    }`;
}

// ════════════════════════════════════════════════
// AÇÕES — FILTROS / PESQUISA
// ════════════════════════════════════════════════
window.eletroFiltrarTipo  = function(tipo)  { ES.tipoFiltro  = tipo;  renderCatalogoGrid(); };
window.eletroFiltrarMarca = function(marca) { ES.marcaFiltro = marca; renderCatalogoGrid(); };
window.eletroPesquisar    = function(v)     { ES.pesquisa    = v;     renderCatalogoGrid(); };
window.eletroOrdenar      = function(ord)   { ES.ordenacao   = ord;   renderCatalogoGrid(); };
window.eletroClearPesq    = function() {
  ES.pesquisa = '';
  const inp = document.getElementById('eletro-pesq-input');
  if (inp) inp.value = '';
  renderCatalogoGrid();
};

// ════════════════════════════════════════════════
// AÇÕES — ORÇAMENTO
// ════════════════════════════════════════════════
window.eletroToggleOrc = function(ref) {
  const idx = ES.orc.findIndex(x => x.ref === ref);
  if (idx >= 0) {
    ES.orc.splice(idx, 1);
    toast('× Removido do orçamento');
  } else {
    let artigo = null;
    ELETRO_DB.forEach(t => {
      const a = t.artigos.find(x => x.ref === ref);
      if (a) artigo = { ...artigoResolvido(a), _tipo: t.tipo, qty: 1, nota: '' };
    });
    if (artigo) { ES.orc.push(artigo); toast('✓ Adicionado ao orçamento'); }
  }
  atualizarBadge();
  if (ES.tab === 'catalogo')  renderCatalogoGrid();
  if (ES.tab === 'orcamento') renderOrcamento();
  // Actualizar painel detalhe se aberto neste ref
  if (ES.detalheAberto === ref) window.eletroToggleDetalhe(ref);
};

window.eletrosQty = function(idx, delta) {
  if (!ES.orc[idx]) return;
  ES.orc[idx].qty = Math.max(1, (ES.orc[idx].qty||1) + delta);
  renderOrcamento();
};

window.eletrosAtualizarNota  = function(idx, nota) { if (ES.orc[idx]) ES.orc[idx].nota = nota; };
window.eletrosCopiarRef      = function(ref, btn)  { copiar(ref, btn); };

window.eletrosLimpar = function() {
  if (!ES.orc.length) return;
  if (confirm('Limpar todo o orçamento de eletros?')) {
    ES.orc = [];
    atualizarBadge();
    renderOrcamento();
    toast('✓ Orçamento limpo');
  }
};

window.eletrosCopiarOrcamento = function() {
  if (!ES.orc.length) { toast('⚠️ Orçamento vazio'); return; }
  const linhas = ['ORÇAMENTO — ELETRODOMÉSTICOS', '═'.repeat(52), ''];
  ES.orc.forEach(a => {
    linhas.push(`${a._tipo.toUpperCase()}`);
    linhas.push(`  ${a.nome}`);
    linhas.push(`  Marca: ${a.marca||'—'}   Ref LM: ${a.ref}`);
    linhas.push(`  Qty: ${a.qty||1} × ${fmt(a.preco)} = ${fmt((a.preco||0)*(a.qty||1))}`);
    if (a.nota) linhas.push(`  Nota: ${a.nota}`);
    linhas.push('');
  });
  const total = ES.orc.reduce((s,a)=>s+(a.preco||0)*(a.qty||1),0);
  linhas.push('─'.repeat(52));
  linhas.push(`TOTAL ELETROS: ${fmt(total)}`);
  linhas.push('─'.repeat(52));
  navigator.clipboard.writeText(linhas.join('\n')).then(() => toast('✓ Orçamento copiado com referências'));
};

window.eletrosCopiarSoRefs = function() {
  if (!ES.orc.length) { toast('⚠️ Orçamento vazio'); return; }
  const linhas = ['REFERÊNCIAS LM — ELETRODOMÉSTICOS', '─'.repeat(40)];
  ES.orc.forEach(a => linhas.push(`${a.ref}  ×${a.qty||1}  ${a.nome}`));
  navigator.clipboard.writeText(linhas.join('\n')).then(() => toast('✓ Referências copiadas'));
};

// ════════════════════════════════════════════════
// BADGE
// ════════════════════════════════════════════════
function atualizarBadge() {
  const badge = document.getElementById('eletro-badge-count');
  if (badge) {
    badge.textContent = ES.orc.length || '';
    badge.style.display = ES.orc.length ? 'inline-block' : 'none';
  }
}
