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
      { ref:'93603006', nome:'Placa Indução 4 zonas 60cm preto TEKA IDY 641Y BK',                  marca:'TEKA',  preco:289, url:'https://www.leroymerlin.pt/pesquisa/93603006',
        caract:'4 zonas · Touch MonoSlider · Sensor recipiente · Bloqueio segurança · Detetor recipiente',
        detalhes:'Modelo sem aro exterior. Vidro cerâmico 4mm. Painel Touch Control MonoSlider com sensores acústicos e bloqueio de segurança. Sistema de otimização de recipiente. Função Power. Programação do tempo de cozinhado até 99 minutos. Desligar automático de segurança.' },
      { ref:'93418142', nome:'Placa Indução 4 zonas 7kW 59×52cm preto CATA IB 6324 E2 BK',         marca:'CATA',  preco:225, url:'https://www.leroymerlin.pt/pesquisa/93418142',
        caract:'4 zonas · 7kW · Booster 4 zonas · 9 níveis potência · Conectividade exaustor',
        detalhes:'Placa indução encastre 4 zonas. Conectividade com exaustor compatível. Controlo táctil. Booster nas 4 zonas. 9 níveis de potência. Potência máx. 7kW.' },
      { ref:'95573263', nome:'Placa Indução 4 zonas 7200W 58×51cm preto AEG TN64IA0BIB',            marca:'AEG',   preco:399, url:'https://www.leroymerlin.pt/pesquisa/95573263',
        caract:'4 zonas PowerBoost · Hob2Hood · Função Pausa · Sem moldura · 7200W',
        detalhes:'★ A Melhor Escolha. Série 5000 Fast & Powerful, 60cm. 4 zonas: 21cm, 2×18cm e 14,5cm. Controlos 0-14 com PowerBoost e temporizador individual. Função Pausa. Hob2Hood® liga placa ao exaustor automaticamente. Design sem moldura.' },
      { ref:'90215362', nome:'Placa Indução 4 zonas 60cm preto Haier HAISJ64MC',                    marca:'HAIER', preco:389, url:'https://www.leroymerlin.pt/pesquisa/90215362',
        caract:'4 zonas · Vidro Facetado · Booster · Multi Slider · 9 níveis · WiFi + Bluetooth',
        detalhes:'Placa indução 60cm. 4 zonas. Vidro facetado. Booster. Multi Slider. 9 níveis de potência. Timer. Função Pausa. WiFi + Bluetooth, App hOn.' },
      { ref:'91927008', nome:'Placa Indução 4 zonas 6600W 59×52cm preto Candy CTP644MCBB/1',        marca:'CANDY', preco:369, url:'https://www.leroymerlin.pt/pesquisa/91927008',
        caract:'4 zonas · 6600W · Booster · Zona extensível · Segurança infantil',
        detalhes:'Placa indução encastrar 4 zonas. Potência total 6600W. Cor preta, vidro. Booster, zona extensível, segurança infantil e proteção contra sobreaquecimento.' },
    ],
  },
  {
    tipo: 'Forno', icon: '🍳', cor: '#8B4513', essencial: true,
    artigos: [
      { ref:'93470587', nome:'Forno Multifunções 71L 59×55cm preto Bosch HBA514S3',                 marca:'BOSCH', preco:379, url:'https://www.leroymerlin.pt/pesquisa/93470587',
        caract:'71L · 7 modos · Limpeza aqualítica · A+ · Calha telescópica',
        detalhes:'SER4, Forno multifunções 60cm. Painel inox, porta vidro preto. 71 litros, A+. Comandos rotativos com visor LED. 7 modos de aquecimento. Limpeza aqualítica manual. Calha telescópica 1 nível. Porta com 3 vidros CoolTouch.' },
      { ref:'95568582', nome:'Forno Multifunções Pirolítico 72L 59×56cm cinza AEG OU5PB40SM',       marca:'AEG',   preco:450, url:'https://www.leroymerlin.pt/pesquisa/95568582',
        caract:'72L · Pirólise · 9+45 programas · Display LED · A++ · Inox Infinity',
        detalhes:'Série 5000 SurroundCook. 72L, 60cm. Limpeza pirolítica. 9 prog + 45 auto prog. Display LED EXPlore. Botões escamoteáveis inox. 4 vidros, A++. Inox Infinity.' },
      { ref:'91664974', nome:'Forno Multifunções 63,5×65,5cm cinza TEKA HCB 6434',                  marca:'TEKA',  preco:285, url:'https://www.leroymerlin.pt/pesquisa/91664974',
        caract:'8 funções · Hydroclean PRO · Touch Control · Porta duplo vidro · A+',
        detalhes:'Forno TEKA multifunções. 8 funções de cozinhado com limpeza Hydroclean PRO®. Touch Control com programação início/fim cozinhado. Bloqueio segurança crianças. Porta duplo vidro. Classificação energética A+.' },
      { ref:'84780952', nome:'Forno Pirolítico 71L 59×56cm cinza TEKA HCB 6535P',                   marca:'TEKA',  preco:399, url:'https://www.leroymerlin.pt/pesquisa/84780952',
        caract:'71L · Pirólise + Hydroclean PRO · 8 funções · Guia telescópica · 5 alturas',
        detalhes:'★ A Melhor Escolha. DualClean: pirólise automática (3 níveis) + Hydroclean PRO automático. Touch Control. SurroundTemp 8 funções. 1 guia telescópica Plus Extension. 5 alturas. Porta triplo vidro.' },
      { ref:'95554459', nome:'Forno Multifunções 72L 59×56cm cinza AEG OU5AB21FSM',                 marca:'AEG',   preco:383, url:'https://www.leroymerlin.pt/pesquisa/95554459',
        caract:'72L · Aqua Clean · 9 programas · Display LED · A+ · SurroundCook',
        detalhes:'Série 5000 SurroundCook. 72L, 60cm. Aqua Clean. 9 programas. Display LED. Botões escamoteáveis inox. Calha 1 nível. 2 vidros, A+. Inox Infinity.' },
    ],
  },
  {
    tipo: 'Exaustor', icon: '💨', cor: '#2A5A9A', essencial: true,
    artigos: [
      { ref:'82051805', nome:'Exaustor Oculto 49×25cm 820m³/h inox CATA GH45X',                     marca:'CATA',  preco:170, url:'https://www.leroymerlin.pt/pesquisa/82051805',
        caract:'820m³/h · Motor BT2 240W · 4 vel + turbo · LED · Touch · Filtros metálicos',
        detalhes:'★ A Melhor Escolha. Exaustor embutido inox. Motor BT2 240W. 4 níveis + intenso. Potência máx. 790m³/h. Controlo touch. Temporizador desconexão automática. Filtros metálicos com indicador saturação. 49,2×28×25,3cm.' },
      { ref:'82401306', nome:'Exaustor Oculto inox 54cm 660m³/h AEG DGE5661HM',                     marca:'AEG',   preco:330, url:'https://www.leroymerlin.pt/pesquisa/82401306',
        caract:'660m³/h · 4 velocidades · LED · Filtragem eficaz · Design moderno',
        detalhes:'Exaustor AEG oculto inox. Motor alta potência, fluxo até 700m³/h. 4 velocidades. Sistema filtragem LED. Fácil instalação e limpeza.' },
      { ref:'89287950', nome:'Exaustor de Parede CATA VH 600 GBK preto',                            marca:'CATA',  preco:259, url:'https://www.leroymerlin.pt/pesquisa/89287950',
        caract:'578m³/h · 65dB · Preto',
        detalhes:'Caudal máximo em evacuação 578m³/h (norma EN-61591). Nível de som na velocidade máxima: 65dB.' },
      { ref:'96393346', nome:'Exaustor de Parede 1027m³/h 90×54cm CATA BETA PRO 9000 X',            marca:'CATA',  preco:319, url:'https://www.leroymerlin.pt/pesquisa/96393346',
        caract:'1027m³/h · Motor A1000 · LED · 3 vel + Turbo · Classe A · Filtros laváveis',
        detalhes:'3 níveis extração + Turbo. Máx 1027m³/h, mín 419m³/h. 64-76dB(A). Motor A1000 extra silencioso. 380W. LED alta eficiência. Filtros laváveis MLL. Inox. Tubo descarga 150mm. Classe A.' },
      { ref:'89287951', nome:'Exaustor de Parede CATA VH 900 GBK preto 650m³/h',                    marca:'CATA',  preco:289, url:'https://www.leroymerlin.pt/pesquisa/89287951',
        caract:'650m³/h · Preto · 90cm',
        detalhes:'Potência de sucção 650m³/h. Garante boa capacidade de extração de fumos e odores.' },
    ],
  },
  {
    tipo: 'Máquina Loiça', icon: '🍽', cor: '#3A7A44', essencial: true,
    artigos: [
      { ref:'96188516', nome:'Máquina Lavar Louça Encastrar 13 conjuntos TEKA DFI 46720',           marca:'TEKA',  preco:399, url:'https://www.leroymerlin.pt/pesquisa/96188516',
        caract:'13 conjuntos · SmartSensor · Meia carga · Aquastop · 6 programas',
        detalhes:'Integração total. Touch Control com display digital LED. 13 conjuntos. 6 programas: Rápido, Normal, Eco, 1h, Intensivo. 4 temperaturas (45-60°C). Meia carga. Aquasafe + Aquastop. SmartSensor. Programação diferida 1-24h. Cesto superior ajustável.' },
      { ref:'82908060', nome:'Máquina Lavar Louça Encastrar 12 conjuntos 60cm branco AEG FSB32610Z', marca:'AEG',   preco:589, url:'https://www.leroymerlin.pt/pesquisa/82908060',
        caract:'12 conjuntos · Eficácia lavagem A · Eficácia secagem A · 10L/ciclo',
        detalhes:'Eficácia de lavagem e secagem: ambas classificadas A. Consumo de água: 10 litros por ciclo (programa eco). 59,6×55×81,8cm, branco.' },
      { ref:'86281430', nome:'Máquina Lavar Louça Encastre 60cm 14 talheres AEG FSK64907Z',         marca:'AEG',   preco:939, url:'https://www.leroymerlin.pt/pesquisa/86281430',
        caract:'14 talheres · Alta capacidade',
        detalhes:'Capacidade generosa para 14 talheres. Ideal para famílias maiores ou quem lava muita louça.' },
      { ref:'91306627', nome:'Máquina Lavar Louça Encastrar 16 conjuntos 60cm Haier XI 6B0S3FSB',   marca:'HAIER', preco:699, url:'https://www.leroymerlin.pt/pesquisa/91306627',
        caract:'16 conjuntos · Motor BLDC · WiFi + BT · 3º cesto · 40dBA · Abertura automática',
        detalhes:'Display 6 dígitos. 10 programas. Motor BLDC. Início diferido 1-23h. Power Wash. Luz interior + no chão. Abertura automática da porta. 40dBA. Classe ruído B. App hOn. Cesto inferior rebatível. Cesto superior Easy-click. 3º cesto. Sensor sujidade. Aquastop. ★ Motor BLDC.' },
    ],
  },
  {
    tipo: 'Microondas', icon: '📡', cor: '#6B4FC4', essencial: false,
    artigos: [
      { ref:'91200482', nome:'Micro-ondas Encastrar 60cm Electrolux KMSD203MMX inox',               marca:'ELECTROLUX', preco:259, url:'https://www.leroymerlin.pt/pesquisa/91200482',
        caract:'20L · 700W micro-ondas · 1000W grill · Controlos mecânicos · Placa 24,5cm',
        detalhes:'20L. Grill 700W (grill 1000W). Controlos mecânicos. Semi-integrado. Placa 24,5cm. Aço inoxidável anti-dedadas.' },
      { ref:'92921589', nome:'Micro-ondas Encastrar 20L 59×40cm preto Haier H38FMWID2S7',           marca:'HAIER', preco:339, url:'https://www.leroymerlin.pt/pesquisa/92921589',
        caract:'20L · Touch open · Cavidade inox · Grill · Prato 315mm · Funções diretas',
        detalhes:'20L. Touch open. Cavidade inox. Prato giratório 315mm. Grill ou combinação micro-ondas + grill. Funções diretas: batata, carne, peixe, pasta, pizza, bebidas, pipocas.' },
      { ref:'17819781', nome:'Micro-ondas com Grill Encastre 60×33cm cinza CATA MC 20 IX',          marca:'CATA',  preco:219, url:'https://www.leroymerlin.pt/pesquisa/17819781',
        caract:'Micro-ondas + Grill · Encastre · Cinza',
        detalhes:'Micro-ondas com grill de encastre. 60×33×39cm. Cinza.' },
      { ref:'94544983', nome:'Micro-ondas TEKA MSEG 620 BK SS',                                     marca:'TEKA',  preco:229, url:'https://www.leroymerlin.pt/pesquisa/94544983',
        caract:'20L · 800W · 5 níveis · Grill 1000W · Prato 24,5cm · Integração total',
        detalhes:'Integração total. Grill de resistência 1000W. 5 níveis de potência, 800W saída. 20 litros. Prato giratório Ø24,5mm. Temporizador 0-95 min. Descongelação por tempo. Interior inox.' },
    ],
  },
  {
    tipo: 'Frigorífico', icon: '❄️', cor: '#2A7A9A', essencial: false,
    artigos: [
      { ref:'91201602', nome:'Frigorífico Combinado Encastrar Low Frost 177cm Electrolux KND5FE18S', marca:'ELECTROLUX', preco:799, url:'https://www.leroymerlin.pt/pesquisa/91201602',
        caract:'177cm · Low Frost · LED · 2 gavetas · Compressor inverter · Classe E',
        detalhes:'Combinado de encastre Série 500 ColdSense. 177cm × 54,6cm. LED interior. 2 gavetas. Compressor inverter. Luzes LED. Instalação rápida. Classe E. Calhas deslizantes.' },
      { ref:'97267020', nome:'Combinado Encastrar Haier HBQW5518E',                                 marca:'HAIER', preco:809, url:'https://www.leroymerlin.pt/pesquisa/97267020',
        caract:'177cm · No Frost · LED · Classe E · 2 portas · 54×55cm',
        detalhes:'Encastrável 2 portas. No Frost. Luz LED. Classe E. Branco. 540×550×1772mm.' },
    ],
  },
  {
    tipo: 'Máquina Roupa', icon: '👕', cor: '#7A3A9A', essencial: false,
    artigos: [
      { ref:'97267322', nome:'Máquina Lavar Roupa Encastre Haier BHA6S69M6DB9J-S-A',               marca:'HAIER', preco:689, url:'https://www.leroymerlin.pt/pesquisa/97267322',
        caract:'9kg · 1600 RPM · Classe A-30% · Vapor · 16 programas · Encastre',
        detalhes:'Carregamento frontal. Encastre. 9kg. 1600 RPM. Classe A-30%. Branco. 16 programas com Vapor.' },
    ],
  },
  {
    tipo: 'Outros', icon: '🔌', cor: '#6B6B8A', essencial: false, _custom: true,
    artigos: [
      { ref:'', nome:'Máquina de café encastrar', marca:'', preco:0, caract:'', detalhes:'' },
      { ref:'', nome:'Frigorífico de vinho encastrar', marca:'', preco:0, caract:'', detalhes:'' },
      { ref:'', nome:'Arca congeladora encastrar', marca:'', preco:0, caract:'', detalhes:'' },
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
    snap.forEach(d => {
      const data = d.data();
      _overrides[d.id] = data;

      // Se o override tem mudança de tipo, mover artigo no DB em memória
      if (data.tipo) {
        // Encontrar onde o artigo está actualmente
        let artigoEncontrado = null, tipoActual = null;
        ELETRO_DB.forEach(t => {
          const a = t.artigos.find(a => a.ref === d.id);
          if (a) { artigoEncontrado = a; tipoActual = t.tipo; }
        });

        if (artigoEncontrado && tipoActual !== data.tipo) {
          // Mover para o tipo correcto
          const tOrig = ELETRO_DB.find(t => t.tipo === tipoActual);
          if (tOrig) tOrig.artigos = tOrig.artigos.filter(a => a.ref !== d.id);
          const tNovo = ELETRO_DB.find(t => t.tipo === data.tipo);
          if (tNovo && !tNovo.artigos.find(a => a.ref === d.id)) {
            tNovo.artigos.push({ ...artigoEncontrado });
          }
        }
      }
    });
  } catch(e) { console.warn('eletros: overrides', e); }
}
async function guardarOverride(ref, dados) {
  _overrides[ref] = dados;
  // Actualizar também o artigo em memória no ELETRO_DB para reflectir imediatamente
  ELETRO_DB.forEach(t => {
    const a = t.artigos.find(a => a.ref === ref);
    if (a) Object.assign(a, {
      nome:     dados.nome     ?? a.nome,
      marca:    dados.marca    ?? a.marca,
      preco:    dados.preco    ?? a.preco,
      url:      dados.url      ?? a.url,
      caract:   dados.caract   ?? a.caract,
      detalhes: dados.detalhes ?? a.detalhes,
    });
  });
  const db = getDb(); if (!db) return;
  try { await setDoc(doc(db, 'wk_eletros_overrides', ref), dados); } catch(e) { console.warn('eletros: guardar override', e); }
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
  const temUrl     = !!(a.url);

  return `
    <div class="tampo-card" style="display:flex;flex-direction:column;gap:8px;position:relative;
      ${noOrc    ?'border-color:rgba(58,122,68,.4);background:rgba(58,122,68,.04);':''}
      ${detAberto?'border-color:rgba(196,97,42,.45);':''}">

      <!-- Link ↗ no canto superior direito — sempre visível se existir URL -->
      ${temUrl ? `
        <a href="${a.url}" target="_blank" rel="noopener"
          style="position:absolute;top:10px;right:10px;z-index:2;
          width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;
          background:rgba(196,97,42,.12);border:1px solid rgba(196,97,42,.25);
          color:rgba(255,190,152,.7);font-size:12px;text-decoration:none;
          transition:all .15s;line-height:1" title="Ver em leroymerlin.pt">↗</a>` : ''}

      <!-- Topo: tipo badge (com margem direita se tiver link) -->
      <div style="display:flex;align-items:center;justify-content:space-between;${temUrl?'padding-right:32px':''}">
        <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
          padding:2px 8px;border-radius:99px;background:${a._cor}18;border:1px solid ${a._cor}33;color:${a._cor}">
          ${a._icon} ${a._tipo}${a._essencial?' ⭐':''}
        </span>
        ${isMelhor?`<span style="font-size:9px;font-weight:700;color:rgba(255,190,152,.5)">★ Melhor escolha</span>`:''}
      </div>

      <!-- Nome + marca -->
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--t1);line-height:1.3">${a.nome}</div>
        <div style="font-size:10px;color:var(--t4);margin-top:1px;font-weight:700;letter-spacing:.06em">${a.marca||''}</div>
      </div>

      <!-- Características -->
      ${a.caract?`<div style="font-size:10px;color:var(--t3);line-height:1.5;border-top:1px solid rgba(255,255,255,.05);padding-top:6px">${a.caract}</div>`:''}

      <!-- Ref + preço -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding-top:6px;border-top:1px solid rgba(255,255,255,.06)">
        <div style="display:flex;align-items:center;gap:4px">
          <span style="font-family:var(--mono);font-size:10px;color:var(--t4)">Ref ${a.ref}</span>
          <button onclick="window.eletrosCopiarRef('${a.ref}',this)"
            style="padding:2px 5px;border-radius:4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:var(--t4);font-size:9px;cursor:pointer">⎘</button>
        </div>
        <span style="font-family:var(--mono);font-size:15px;font-weight:700;color:var(--t1)">${fmt(a.preco)}</span>
      </div>

      <!-- Botões: ℹ︎ · ✏️ · + Orçamento -->
      <div style="display:flex;gap:5px;margin-top:2px">
        <button onclick="window.eletroToggleDetalhe('${a.ref}')"
          title="Ver detalhes"
          style="padding:6px 9px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;
          ${detAberto
            ?'background:rgba(196,97,42,.2);border:1px solid rgba(196,97,42,.4);color:rgba(255,190,152,.9)'
            :'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:var(--t3)'}">
          ℹ︎
        </button>
        <button onclick="window.eletroEditarArtigo('${a.ref}')"
          title="Editar artigo"
          style="padding:6px 9px;border-radius:7px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
          color:var(--t4);font-size:11px;cursor:pointer;transition:all .15s">✏️</button>
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
      <div style="display:flex;gap:6px">
        <button onclick="window.eletrosCopiarRef('${artigo.ref}',this)"
          style="flex:1;padding:7px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
          color:var(--t3);font-family:var(--sans);font-size:11px;cursor:pointer">
          ⎘ Copiar Ref ${artigo.ref}
        </button>
        ${artigo.url ? `
        <a href="${artigo.url}" target="_blank" rel="noopener"
          style="padding:7px 12px;border-radius:8px;background:rgba(196,97,42,.1);border:1px solid rgba(196,97,42,.2);
          color:rgba(255,190,152,.7);font-family:var(--sans);font-size:11px;text-decoration:none;display:flex;align-items:center;gap:4px">
          ↗ Ver LM
        </a>` : ''}
      </div>
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
            <label class="form-label">Link LM (URL)</label>
            <input id="em-url" class="f-input" value="${(artigo.url||'').replace(/"/g,'&quot;')}" placeholder="https://www.leroymerlin.pt/…" type="url">
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
        <button class="btn-guardar" onclick="window.eletroGuardarArtigo('${artigo.ref||''}','${artigo._tipo||''}',${isNovo})">Guardar</button>
      </div>
    </div>`;
  document.body.appendChild(m);
  setTimeout(() => document.getElementById('em-nome')?.focus(), 80);
}

window.eletroGuardarArtigo = async function(refOriginal, tipoOriginal, isNovo) {
  const nome     = document.getElementById('em-nome')?.value.trim();
  const refInp   = document.getElementById('em-ref')?.value.trim();
  const ref      = isNovo ? refInp : refOriginal;
  const tipoNovo = document.getElementById('em-tipo')?.value;
  const marca    = document.getElementById('em-marca')?.value.trim();
  const preco    = parseFloat(document.getElementById('em-preco')?.value) || 0;
  const url      = document.getElementById('em-url')?.value.trim();
  const caract   = document.getElementById('em-caract')?.value.trim();
  const detalhes = document.getElementById('em-detalhes')?.value.trim();

  if (!nome) { toast('⚠️ Nome obrigatório'); return; }
  if (!ref)  { toast('⚠️ Referência LM obrigatória'); return; }

  if (isNovo) {
    // Novo artigo — adicionar ao tipo seleccionado
    const t = ELETRO_DB.find(t => t.tipo === tipoNovo) || ELETRO_DB.find(t => t.tipo === 'Outros');
    if (t) t.artigos.push({ ref, nome, marca, preco, url, caract, detalhes, nota:'' });
  } else {
    // Editar existente — se o tipo mudou, mover o artigo entre tipos
    if (tipoNovo !== tipoOriginal) {
      // Remover do tipo original
      const tOrig = ELETRO_DB.find(t => t.tipo === tipoOriginal);
      if (tOrig) tOrig.artigos = tOrig.artigos.filter(a => a.ref !== ref);
      // Adicionar ao novo tipo
      const tNovo = ELETRO_DB.find(t => t.tipo === tipoNovo) || ELETRO_DB.find(t => t.tipo === 'Outros');
      if (tNovo) tNovo.artigos.push({ ref, nome, marca, preco, url, caract, detalhes, nota:'' });
    } else {
      // Mesmo tipo — actualizar in-place
      const t = ELETRO_DB.find(t => t.tipo === tipoNovo);
      if (t) {
        const a = t.artigos.find(a => a.ref === ref);
        if (a) Object.assign(a, { nome, marca, preco, url, caract, detalhes });
      }
    }
    // Actualizar no orçamento se estiver lá
    const noOrc = ES.orc.find(x => x.ref === ref);
    if (noOrc) Object.assign(noOrc, { nome, marca, preco, url, _tipo: tipoNovo });
  }

  // Persistir override com tipo incluído
  await guardarOverride(ref, { nome, marca, preco, url, caract, detalhes, tipo: tipoNovo });
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
      :`
        <!-- Lista de itens -->
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
          ${ES.orc.map((a,i) => {
            const corTipo = getCorTipo(a._tipo);
            const iconTipo = getIconTipo(a._tipo);
            const temDetalhes = !!(a.caract || a.detalhes || a.url);
            return `
            <div style="background:var(--glass-bg);backdrop-filter:blur(16px);border:1px solid var(--glass-brd);
              border-radius:12px;overflow:hidden">

              <!-- Linha principal -->
              <div style="padding:12px 16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
                <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:2px 8px;
                  border-radius:99px;flex-shrink:0;background:${corTipo}18;border:1px solid ${corTipo}33;color:${corTipo}">
                  ${iconTipo} ${a._tipo}
                </span>
                <div style="flex:1;min-width:120px">
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                    <span style="font-size:12px;font-weight:600;color:var(--t1)">${a.nome}</span>
                    ${temDetalhes ? `
                    <button onclick="window.eletrosOrcToggleDetalhe(${i})"
                      id="orc-det-btn-${i}"
                      style="padding:2px 7px;border-radius:5px;font-family:var(--sans);font-size:9px;font-weight:700;
                      cursor:pointer;transition:all .15s;background:rgba(255,255,255,.05);
                      border:1px solid rgba(255,255,255,.1);color:var(--t4)">
                      ℹ︎ ver
                    </button>` : ''}
                  </div>
                  <div style="display:flex;align-items:center;gap:5px;margin-top:2px;flex-wrap:wrap">
                    <span style="font-size:9px;font-weight:700;color:var(--t4);font-family:var(--mono)">${a.marca||''}</span>
                    <span style="font-family:var(--mono);font-size:10px;color:var(--t4)">· Ref: ${a.ref}</span>
                    <button onclick="window.eletrosCopiarRef('${a.ref}',this)"
                      style="padding:1px 5px;border-radius:3px;background:rgba(255,255,255,.05);
                      border:1px solid rgba(255,255,255,.08);color:var(--t4);font-size:9px;cursor:pointer">⎘</button>
                    ${a.url?`<a href="${a.url}" target="_blank" rel="noopener"
                      style="padding:1px 6px;border-radius:3px;background:rgba(196,97,42,.08);
                      border:1px solid rgba(196,97,42,.2);color:rgba(255,190,152,.6);font-size:9px;text-decoration:none">↗ LM</a>`:''}
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
              </div>

              <!-- Painel de detalhes expansível (oculto por defeito) -->
              ${temDetalhes ? `
              <div id="orc-det-${i}" style="display:none;padding:12px 16px;border-top:1px solid rgba(255,255,255,.06);
                background:rgba(255,255,255,.02)">
                ${a.caract ? `
                  <div style="margin-bottom:10px">
                    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
                      color:rgba(196,97,42,.5);margin-bottom:6px">Características</div>
                    <div style="display:flex;flex-direction:column;gap:3px">
                      ${a.caract.split('·').map(c=>`
                        <div style="font-size:11px;color:var(--t2);line-height:1.6">· ${c.trim()}</div>`).join('')}
                    </div>
                  </div>` : ''}
                ${a.detalhes ? `
                  <div style="margin-bottom:10px">
                    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
                      color:var(--t4);margin-bottom:6px">Detalhes</div>
                    <div style="font-size:11px;color:var(--t3);line-height:1.7">${a.detalhes}</div>
                  </div>` : ''}
                ${a.url ? `
                  <a href="${a.url}" target="_blank" rel="noopener"
                    style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:7px;
                    background:rgba(196,97,42,.1);border:1px solid rgba(196,97,42,.2);
                    color:rgba(255,190,152,.7);font-family:var(--sans);font-size:11px;font-weight:600;text-decoration:none">
                    ↗ Ver produto em leroymerlin.pt
                  </a>` : ''}
              </div>` : ''}

            </div>`;
          }).join('')}
        </div>

        <!-- Total -->
        <div style="background:rgba(196,97,42,.07);border:1px solid rgba(196,97,42,.2);border-radius:14px;
          padding:16px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,190,152,.5)">Total Eletrodomésticos</div>
            <div style="font-size:11px;color:var(--t4);margin-top:2px">${ES.orc.length} artigo${ES.orc.length!==1?'s':''} · ${ES.orc.reduce((s,a)=>s+(a.qty||1),0)} un</div>
          </div>
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--peach)">${fmt(total)}</div>
        </div>
      `
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

window.eletrosOrcToggleDetalhe = function(idx) {
  const painel = document.getElementById('orc-det-' + idx);
  const btn    = document.getElementById('orc-det-btn-' + idx);
  if (!painel) return;
  const aberto = painel.style.display !== 'none';
  painel.style.display = aberto ? 'none' : 'block';
  if (btn) {
    btn.textContent = aberto ? 'ℹ︎ ver' : 'ℹ︎ fechar';
    btn.style.background    = aberto ? 'rgba(255,255,255,.05)' : 'rgba(196,97,42,.15)';
    btn.style.borderColor   = aberto ? 'rgba(255,255,255,.1)'  : 'rgba(196,97,42,.3)';
    btn.style.color         = aberto ? 'var(--t4)'             : 'rgba(255,190,152,.8)';
  }
};
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
