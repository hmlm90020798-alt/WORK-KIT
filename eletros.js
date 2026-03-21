// ════════════════════════════════════════════════
// eletros.js · Work Kit · Hélder Melo
// Catálogo de Eletrodomésticos — à semelhança de tampos.js
// ════════════════════════════════════════════════

import { doc, setDoc, getDocs, collection }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

function getDb() { return window._wkDb || null; }

// ════════════════════════════════════════════════
// BASE DE DADOS — CATÁLOGO COMPLETO
// ════════════════════════════════════════════════
export const ELETRO_DB = [
  {
    tipo: 'Placa', icon: '🔥', cor: '#C4612A',
    essencial: true,
    artigos: [
      { ref: '93418142', nome: 'Indução 4 zonas 7kW 59×52cm Preto',    marca: 'CATA',       preco: 225, caract: '4 zonas · 7kW · Booster · Conectividade exaustor',            nota: '' },
      { ref: '93603006', nome: 'Indução 4 zonas 60cm Preto MonoSlider', marca: 'TEKA',       preco: 289, caract: '4 zonas · Touch MonoSlider · Detetor recipiente',             nota: '' },
      { ref: '90215362', nome: 'Indução 4 zonas 60cm Vidro Facetado',   marca: 'HAIER',      preco: 389, caract: '4 zonas · Vidro Facetado · WiFi + Bluetooth',                nota: '' },
      { ref: '95573263', nome: 'Indução 4 zonas 7200W Sem Moldura',     marca: 'AEG',        preco: 399, caract: '4 zonas PowerBoost · Hob2Hood · Função Pausa · Sem moldura', nota: '★ Melhor escolha' },
      { ref: '97012345', nome: 'Vitrocerâmica 4 zonas 60cm Preto',      marca: 'TEKA',       preco: 129, caract: '4 zonas · 6200W · 9 níveis · Temporizador',                  nota: '' },
      { ref: '97012346', nome: 'Gás 4 queimadores 60cm Inox',           marca: 'CATA',       preco: 159, caract: '4 queimadores · 7700W · 1 dupla chama · Inox',               nota: '' },
    ],
  },
  {
    tipo: 'Forno', icon: '🍳', cor: '#8B4513',
    essencial: true,
    artigos: [
      { ref: '93470587', nome: 'Multifunções 71L Limpeza Aqualítica',   marca: 'BOSCH',      preco: 379, caract: '71L · 7 modos · Limpeza aqualítica · A+',                   nota: '' },
      { ref: '84780952', nome: 'Pirolítico 71L + Hydroclean AUTO',      marca: 'TEKA',       preco: 399, caract: 'Pirólise + Hydroclean AUTO · 8 funções · Guia telescópica',  nota: '★ Melhor escolha' },
      { ref: '95568582', nome: 'Pirolítico 72L A++ Inox Infinity',      marca: 'AEG',        preco: 450, caract: '72L · Pirólise · A++ · Inox Infinity',                       nota: '' },
      { ref: '97012347', nome: 'Multifunções 65L Classe A',             marca: 'ELECTROLUX', preco: 299, caract: '65L · 8 funções · Limpeza vapor · Classe A',                 nota: '' },
      { ref: '97012348', nome: 'Vapor + Pirólise 70L',                  marca: 'HAIER',      preco: 499, caract: '70L · Cozedura a vapor · Pirólise · WiFi',                   nota: '' },
    ],
  },
  {
    tipo: 'Exaustor', icon: '💨', cor: '#2A5A9A',
    essencial: true,
    artigos: [
      { ref: '82051805', nome: 'Oculto 49cm 820m³/h Inox Touch',        marca: 'CATA',       preco: 170, caract: 'Motor 240W · 4 níveis + turbo · LED · Touch',               nota: '★ Melhor escolha' },
      { ref: '82401306', nome: 'Oculto 54cm 660m³/h 4 velocidades',     marca: 'AEG',        preco: 330, caract: '4 velocidades · 700m³/h · LED',                             nota: '' },
      { ref: '96393346', nome: 'Parede 90cm 1027m³/h Motor A1000',      marca: 'CATA',       preco: 319, caract: '3 níveis · 1027m³/h · Motor A1000 · LED · Classe A',        nota: '' },
      { ref: '97012349', nome: 'Ilha 90cm 600m³/h Inox',                marca: 'TEKA',       preco: 549, caract: '600m³/h · LED · Touch · 3 velocidades + boost',             nota: '' },
      { ref: '97012350', nome: 'Integrado 60cm 720m³/h',                marca: 'BOSCH',      preco: 289, caract: '720m³/h · Integrado total · Home Connect WiFi',             nota: '' },
    ],
  },
  {
    tipo: 'Máquina Loiça', icon: '🍽', cor: '#3A7A44',
    essencial: true,
    artigos: [
      { ref: '96188516', nome: '13 conjuntos SmartSensor AquaStop',     marca: 'TEKA',       preco: 399, caract: '13 conjuntos · SmartSensor · Meia carga · AquaStop',        nota: '' },
      { ref: '91306627', nome: '16 conjuntos Motor BLDC WiFi Auto',     marca: 'HAIER',      preco: 699, caract: '16 conjuntos · Motor BLDC · WiFi · Abertura Auto · 40dB',   nota: '★ Motor BLDC' },
      { ref: '97012351', nome: '14 conjuntos 60cm A++ Silencioso',      marca: 'BOSCH',      preco: 549, caract: '14 conjuntos · A++ · 44dB · PerfectDry',                    nota: '' },
      { ref: '97012352', nome: '13 conjuntos 45cm Compacta',            marca: 'ELECTROLUX', preco: 449, caract: '13 conjuntos · 45cm · 9 programas · SatelliteClean',        nota: '' },
    ],
  },
  {
    tipo: 'Microondas', icon: '📡', cor: '#6B4FC4',
    essencial: false,
    artigos: [
      { ref: '94544983', nome: '20L Integração Total Grill 1000W',      marca: 'TEKA',       preco: 229, caract: 'Integração total · Grill 1000W · Interior inox',            nota: '' },
      { ref: '91200482', nome: '20L 700W Grill 1000W Prato 24.5cm',     marca: 'ELECTROLUX', preco: 259, caract: '20L · 700W · 1000W grill · Prato 24.5cm · Inox',           nota: '' },
      { ref: '97012353', nome: '25L 900W Grill + Convenção',            marca: 'HAIER',      preco: 299, caract: '25L · 900W · Grill + Convecção · Encastrar total',          nota: '' },
    ],
  },
  {
    tipo: 'Frigorífico', icon: '❄️', cor: '#2A7A9A',
    essencial: false,
    artigos: [
      { ref: '91201602', nome: '177cm Low Frost Inverter Classe E',     marca: 'ELECTROLUX', preco: 799, caract: '177cm · Low Frost · Compressor inverter · LED · Classe E',  nota: '' },
      { ref: '97267020', nome: '177cm No Frost LED Classe E',           marca: 'HAIER',      preco: 809, caract: '177cm · No Frost · LED · Classe E',                         nota: '' },
      { ref: '97012354', nome: '193cm No Frost WiFi VitaFresh',         marca: 'BOSCH',      preco: 999, caract: '193cm · No Frost · WiFi · VitaFresh · Classe C',            nota: '' },
      { ref: '97012355', nome: 'Frigorífico 1 porta 122cm Encastrar',   marca: 'AEG',        preco: 599, caract: '122cm · Slim Touch · LED · Classe D',                       nota: '' },
    ],
  },
  {
    tipo: 'Máquina Roupa', icon: '👕', cor: '#7A3A9A',
    essencial: false,
    artigos: [
      { ref: '97267322', nome: '9kg 1600RPM 16 programas c/ Vapor',     marca: 'HAIER',      preco: 689, caract: '9kg · 1600RPM · Classe A-30% · 16 programas c/ Vapor',     nota: '' },
      { ref: '97012356', nome: '8kg 1400RPM ActiveCare Classe A',       marca: 'ELECTROLUX', preco: 599, caract: '8kg · 1400RPM · ActiveCare · Classe A · UltraMix',          nota: '' },
      { ref: '97012357', nome: '8kg 1200RPM EcoSilence Drive',          marca: 'BOSCH',      preco: 649, caract: '8kg · 1200RPM · EcoSilence Drive · SpeedPerfect',           nota: '' },
    ],
  },
  {
    tipo: 'Secadora', icon: '🌀', cor: '#9A5A2A',
    essencial: false,
    artigos: [
      { ref: '97012358', nome: '8kg Bomba Calor Classe A+',             marca: 'BOSCH',      preco: 549, caract: '8kg · Bomba de calor · Classe A+ · SelfCleaning',           nota: '' },
      { ref: '97012359', nome: '8kg Condensação Classe B',              marca: 'HAIER',      preco: 399, caract: '8kg · Condensação · Classe B · 12 programas',               nota: '' },
    ],
  },
  {
    tipo: 'Lava-Loiça', icon: '🚰', cor: '#4A7A6A',
    essencial: false,
    artigos: [
      { ref: '97012360', nome: 'Inox 1 cuba 60×50cm Escovado',         marca: 'DEANTE',      preco: 129, caract: '60×50cm · 1 cuba · Inox escovado · Sifão incluso',         nota: '' },
      { ref: '97012361', nome: 'Granito 1 cuba 56×50cm Antracite',     marca: 'SCHOCK',      preco: 249, caract: '56×50cm · Granito fundido · Antracite · Reversível',        nota: '' },
      { ref: '97012362', nome: 'Inox 1.5 cubas 80×50cm',               marca: 'FRANKE',      preco: 189, caract: '80×50cm · 1.5 cubas · Inox polido · Escorredor',           nota: '' },
    ],
  },
];

// Tipos essenciais (para alerta em falta)
export const ELETRO_ESSENCIAIS = ELETRO_DB.filter(t => t.essencial).map(t => t.tipo);

// ════════════════════════════════════════════════
// ESTADO
// ════════════════════════════════════════════════
const ES = {
  tab:        'catalogo',   // 'catalogo' | 'orcamento'
  tipoFiltro: '',
  pesquisa:   '',
  ordenacao:  'nome',       // 'nome' | 'pvp_asc' | 'pvp_desc' | 'marca'
  orc:        [],           // { ref, nome, marca, preco, _tipo, qty, nota }
};

// ════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════
function fmt(v) {
  const n = parseFloat(v);
  return isNaN(n) ? '—' : n.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' €';
}

function copiar(txt, el) {
  navigator.clipboard.writeText(String(txt)).then(() => {
    window.wkToast?.('✓ Copiado: ' + txt);
    if (el) { const o = el.textContent; el.textContent = '✓ Copiado'; setTimeout(() => el.textContent = o, 1400); }
  });
}

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
export function eletroInit() {
  renderEletroHeader();
  renderEletroTabs();
  switchEletroTab(ES.tab);
}

function renderEletroHeader() {
  const ct = document.getElementById('eletro-header');
  if (!ct) return;
  ct.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:20px">
      <div>
        <div class="page-titulo">Eletrodomésticos</div>
        <div class="page-sub">Catálogo · Orçamento com referências LM · Alerta de essenciais</div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <!-- Badge orçamento -->
        <button onclick="window.switchEletroTab('orcamento')"
          id="btn-eletro-orc-hdr"
          style="position:relative;display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:9px;
          background:rgba(196,97,42,.1);border:1px solid rgba(196,97,42,.25);
          color:rgba(255,190,152,.7);font-family:var(--sans);font-size:11px;font-weight:700;cursor:pointer;transition:all .15s">
          ⚡ Orçamento
          <span id="eletro-badge-count" style="display:none;background:rgba(196,97,42,.25);border-radius:99px;padding:1px 7px;font-family:var(--mono);font-size:10px"></span>
        </button>
        <!-- Tabs -->
        <div style="display:flex;gap:4px">
          ${['catalogo','orcamento'].map(t => `
            <button onclick="window.switchEletroTab('${t}')" id="eletro-tab-${t}"
              class="btn-sec ${ES.tab === t ? 'active' : ''}">
              ${{ catalogo:'📋 Catálogo', orcamento:'📋 Orçamento' }[t]}
            </button>`).join('')}
        </div>
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
    const btn = document.getElementById('eletro-tab-' + t);
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
  const ct = document.getElementById('eletro-ct-catalogo');
  if (!ct) return;

  const tipos = ELETRO_DB.map(t => t.tipo);

  ct.innerHTML = `
    <!-- Chips de tipo -->
    <div class="filter-chips" style="margin-bottom:12px">
      <button class="chip ${!ES.tipoFiltro ? 'active' : ''}"
              onclick="window.eletroFiltrarTipo('')">⚡ Todos <span style="opacity:.4">${ELETRO_DB.reduce((s,t)=>s+t.artigos.length,0)}</span></button>
      ${ELETRO_DB.map(t => `
        <button class="chip ${ES.tipoFiltro === t.tipo ? 'active' : ''}"
                onclick="window.eletroFiltrarTipo('${t.tipo}')">
          ${t.icon} ${t.tipo} ${t.essencial ? '⭐' : ''}
          <span style="opacity:.4">${t.artigos.length}</span>
        </button>`).join('')}
    </div>

    <!-- Pesquisa + ordenação -->
    <div class="search-bar">
      <div class="search-wrap" style="position:relative">
        <span class="search-icon">⌕</span>
        <input type="text" id="eletro-pesq-input" class="search-input"
          placeholder="Pesquisar nome, marca, ref LM…"
          value="${ES.pesquisa}"
          oninput="window.eletroPesquisar(this.value)"
          style="padding-right:30px">
        <button onclick="window.eletroClearPesq()"
          style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;
          color:${ES.pesquisa ? 'var(--t2)' : 'var(--t4)'};font-size:15px;cursor:pointer;line-height:1;padding:2px 5px">×</button>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4)">Ordenar:</span>
        ${[
          { label:'A → Z',     val:'nome'      },
          { label:'Preço ↑',   val:'pvp_asc'  },
          { label:'Preço ↓',   val:'pvp_desc' },
          { label:'Marca',     val:'marca'    },
        ].map(o => `
          <button class="chip ${ES.ordenacao === o.val ? 'active' : ''}"
            onclick="window.eletroOrdenar('${o.val}')">${o.label}</button>`).join('')}
      </div>
    </div>

    <!-- Info bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="bib-info" style="margin:0" id="eletro-info-bar"></div>
      <span style="font-size:10px;color:var(--t4)">⭐ = Essencial para cozinha completa</span>
    </div>

    <!-- Grid de cards -->
    <div class="cards-grid" id="eletro-grid-cards"></div>`;

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
    tipo.artigos.forEach(a => artigos.push({ ...a, _tipo: tipo.tipo, _cor: tipo.cor, _icon: tipo.icon, _essencial: tipo.essencial }));
  });

  if (pesq) artigos = artigos.filter(a =>
    a.nome.toLowerCase().includes(pesq) ||
    (a.marca || '').toLowerCase().includes(pesq) ||
    (a.ref || '').includes(pesq) ||
    (a.caract || '').toLowerCase().includes(pesq)
  );

  // Ordenação
  artigos.sort((a, b) => {
    if (ES.ordenacao === 'pvp_asc')  return (a.preco || 9999) - (b.preco || 9999);
    if (ES.ordenacao === 'pvp_desc') return (b.preco || 0)    - (a.preco || 0);
    if (ES.ordenacao === 'marca')    return (a.marca || '').localeCompare(b.marca || '', 'pt');
    return a.nome.localeCompare(b.nome, 'pt');
  });

  if (info) {
    const orLabel = { nome:'A→Z', pvp_asc:'preço ↑', pvp_desc:'preço ↓', marca:'marca' }[ES.ordenacao];
    info.textContent = `${artigos.length} artigo${artigos.length!==1?'s':''} · ${ES.tipoFiltro || 'todos os tipos'} · ${orLabel}`;
  }

  if (!artigos.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">⚡</div><div class="empty-titulo">Sem resultados</div><div class="empty-sub">Tenta outra pesquisa ou limpa os filtros</div></div>`;
    return;
  }

  grid.innerHTML = artigos.map(a => renderCardEletro(a)).join('');
}

function renderCardEletro(a) {
  const noOrc  = ES.orc.some(x => x.ref === a.ref);
  const isMelhor = (a.nota || '').includes('★');

  return `
    <div class="tampo-card" style="display:flex;flex-direction:column;gap:8px;${noOrc ? 'border-color:rgba(58,122,68,.4);' : ''}">

      <!-- Topo: tipo + estrela -->
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
          padding:2px 8px;border-radius:99px;background:${a._cor}18;border:1px solid ${a._cor}33;color:${a._cor}">
          ${a._icon} ${a._tipo}${a._essencial ? ' ⭐' : ''}
        </span>
        ${isMelhor ? `<span style="font-size:9px;font-weight:700;color:rgba(255,190,152,.5);letter-spacing:.06em">★ Melhor escolha</span>` : '<span></span>'}
      </div>

      <!-- Nome + marca -->
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--t1);line-height:1.3">${a.nome}</div>
        <div style="font-size:10px;color:var(--t4);margin-top:1px;font-weight:600;letter-spacing:.06em">${a.marca || ''}</div>
      </div>

      <!-- Características -->
      ${a.caract ? `<div style="font-size:10px;color:var(--t3);line-height:1.5;border-top:1px solid rgba(255,255,255,.05);padding-top:6px">${a.caract}</div>` : ''}

      <!-- Ref + preço -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:6px;border-top:1px solid rgba(255,255,255,.06)">
        <div style="display:flex;align-items:center;gap:5px">
          <span style="font-family:var(--mono);font-size:10px;color:var(--t4)">Ref ${a.ref}</span>
          <button onclick="window.eletrosCopiarRef('${a.ref}',this)"
            style="padding:2px 6px;border-radius:4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
            color:var(--t4);font-size:9px;cursor:pointer;transition:all .15s">⎘</button>
          <a href="https://www.leroymerlin.pt/pesquisa/${a.ref}" target="_blank"
            style="padding:2px 6px;border-radius:4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
            color:var(--t4);font-size:9px;text-decoration:none;transition:all .15s">↗</a>
        </div>
        <span style="font-family:var(--mono);font-size:15px;font-weight:700;color:var(--t1)">${fmt(a.preco)}</span>
      </div>

      <!-- Botão adicionar -->
      <button onclick="window.eletroToggleOrc('${a.ref}')"
        style="width:100%;padding:8px;border-radius:8px;font-family:var(--sans);font-size:11px;font-weight:700;cursor:pointer;transition:all .18s;
        ${noOrc
          ? 'background:rgba(58,122,68,.25);border:1px solid rgba(58,122,68,.4);color:rgba(150,220,150,.8)'
          : 'background:rgba(196,97,42,.1);border:1px solid rgba(196,97,42,.25);color:rgba(255,190,152,.7)'}">
        ${noOrc ? '✓ No Orçamento' : '+ Adicionar ao Orçamento'}
      </button>

    </div>`;
}

// ════════════════════════════════════════════════
// ORÇAMENTO
// ════════════════════════════════════════════════
function renderOrcamento() {
  const ct = document.getElementById('eletro-ct-orcamento');
  if (!ct) return;

  // Alertas de essenciais
  const tiposNoOrc = new Set(ES.orc.map(a => a._tipo));
  const emFalta = ELETRO_ESSENCIAIS.filter(t => !tiposNoOrc.has(t));

  const total = ES.orc.reduce((s, a) => s + (a.preco || 0) * (a.qty || 1), 0);

  ct.innerHTML = `
    <!-- Alerta de essenciais -->
    ${emFalta.length
      ? `<div class="ass-alerta" style="margin-bottom:14px">
          <strong>⭐ Essenciais em falta:</strong> ${emFalta.join(' · ')}
         </div>`
      : `<div style="background:rgba(58,122,68,.12);border:1px solid rgba(58,122,68,.3);border-radius:10px;
          padding:10px 14px;font-size:11px;color:rgba(150,220,150,.8);margin-bottom:14px">
          ✅ Todos os essenciais incluídos no orçamento
         </div>`
    }

    <!-- Header do orçamento -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div class="page-titulo" style="font-size:18px">Orçamento Eletros</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button onclick="window.eletrosCopiarOrcamento()"
          style="padding:7px 14px;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);
          color:var(--t2);font-family:var(--sans);font-size:11px;font-weight:700;cursor:pointer;transition:all .15s">
          📋 Copiar Orçamento
        </button>
        <button onclick="window.eletrosLimpar()"
          style="padding:7px 14px;border-radius:8px;background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.2);
          color:rgba(255,150,140,.6);font-family:var(--sans);font-size:11px;font-weight:600;cursor:pointer;transition:all .15s">
          × Limpar
        </button>
      </div>
    </div>

    ${!ES.orc.length
      ? `<div class="empty-state"><div class="empty-icon">⚡</div>
          <div class="empty-titulo">Orçamento vazio</div>
          <div class="empty-sub">Vai ao Catálogo e adiciona eletros</div>
          <button onclick="window.switchEletroTab('catalogo')"
            style="margin-top:14px;padding:8px 18px;border-radius:8px;background:rgba(196,97,42,.12);border:1px solid rgba(196,97,42,.25);
            color:rgba(255,190,152,.7);font-family:var(--sans);font-size:11px;font-weight:700;cursor:pointer">
            → Ver Catálogo
          </button>
        </div>`
      : `
      <!-- Tabela de itens -->
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
        ${ES.orc.map((a, i) => `
          <div style="background:var(--glass-bg);backdrop-filter:blur(16px);border:1px solid var(--glass-brd);
            border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">

            <!-- Tipo badge -->
            <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;
              padding:2px 8px;border-radius:99px;flex-shrink:0;
              background:${getCorTipo(a._tipo)}18;border:1px solid ${getCorTipo(a._tipo)}33;color:${getCorTipo(a._tipo)}">
              ${getIconTipo(a._tipo)} ${a._tipo}
            </span>

            <!-- Info -->
            <div style="flex:1;min-width:140px">
              <div style="font-size:12px;font-weight:600;color:var(--t1)">${a.nome}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-top:3px;flex-wrap:wrap">
                <span style="font-size:9px;font-weight:700;color:var(--t4);font-family:var(--mono)">${a.marca}</span>
                <span style="width:1px;height:10px;background:rgba(255,255,255,.08)"></span>
                <span style="font-family:var(--mono);font-size:10px;color:var(--t4)">Ref: ${a.ref}</span>
                <button onclick="window.eletrosCopiarRef('${a.ref}',this)"
                  style="padding:1px 5px;border-radius:3px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
                  color:var(--t4);font-size:9px;cursor:pointer">⎘</button>
              </div>
              <!-- Nota do item -->
              <input type="text" placeholder="Nota opcional…" value="${a.nota || ''}"
                onchange="window.eletrosAtualizarNota(${i}, this.value)"
                style="margin-top:6px;width:100%;padding:4px 8px;border-radius:5px;background:rgba(255,255,255,.03);
                border:1px solid rgba(255,255,255,.07);font-family:var(--sans);font-size:10px;color:var(--t2);outline:none;
                transition:border-color .15s"
                onfocus="this.style.borderColor='rgba(196,97,42,.3)'"
                onblur="this.style.borderColor='rgba(255,255,255,.07)'">
            </div>

            <!-- Quantidade -->
            <div style="display:flex;align-items:center;gap:5px;flex-shrink:0">
              <button onclick="window.eletrosQty(${i},-1)"
                style="width:26px;height:26px;border-radius:6px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
                color:var(--t2);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
              <span style="font-family:var(--mono);font-size:14px;font-weight:700;color:var(--t1);min-width:20px;text-align:center">${a.qty || 1}</span>
              <button onclick="window.eletrosQty(${i},+1)"
                style="width:26px;height:26px;border-radius:6px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
                color:var(--t2);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
            </div>

            <!-- Preço unitário + total -->
            <div style="text-align:right;flex-shrink:0;min-width:90px">
              <div style="font-size:9px;color:var(--t4);text-transform:uppercase;letter-spacing:.08em">${fmt(a.preco)} / un</div>
              <div style="font-family:var(--mono);font-size:16px;font-weight:700;color:var(--t1)">${fmt(a.preco * (a.qty || 1))}</div>
            </div>

            <!-- Remover -->
            <button onclick="window.eletroToggleOrc('${a.ref}')"
              style="width:28px;height:28px;border-radius:50%;background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.2);
              color:rgba(255,150,140,.5);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s">
              ×
            </button>
          </div>`).join('')}
      </div>

      <!-- Total -->
      <div style="background:rgba(196,97,42,.07);border:1px solid rgba(196,97,42,.2);border-radius:14px;padding:16px 20px;
        display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,190,152,.5)">Total Eletrodomésticos</div>
          <div style="font-size:11px;color:var(--t4);margin-top:2px">${ES.orc.length} artigo${ES.orc.length!==1?'s':''} · ${ES.orc.reduce((s,a)=>s+(a.qty||1),0)} unidade${ES.orc.reduce((s,a)=>s+(a.qty||1),0)!==1?'s':''}</div>
        </div>
        <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--peach)">${fmt(total)}</div>
      </div>

      <!-- Botões de acção -->
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button onclick="window.eletrosCopiarOrcamento()"
          style="flex:1;min-width:180px;padding:11px;border-radius:10px;background:rgba(196,97,42,.15);
          border:1px solid rgba(196,97,42,.3);color:rgba(255,190,152,.8);font-family:var(--sans);
          font-size:12px;font-weight:700;cursor:pointer;transition:all .15s">
          📋 Copiar Orçamento c/ Referências
        </button>
        <button onclick="window.eletrosCopiarSoRefs()"
          style="flex:1;min-width:160px;padding:11px;border-radius:10px;background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.12);color:var(--t2);font-family:var(--sans);
          font-size:12px;font-weight:600;cursor:pointer;transition:all .15s">
          ⎘ Só Referências LM
        </button>
      </div>`
    }`;
}

// ════════════════════════════════════════════════
// AÇÕES — CATÁLOGO
// ════════════════════════════════════════════════
window.eletroFiltrarTipo = function(tipo) {
  ES.tipoFiltro = tipo;
  renderCatalogoGrid();
  // Atualizar chips
  const ct = document.getElementById('eletro-ct-catalogo');
  if (ct) ct.querySelectorAll('.chip').forEach(btn => {
    const txt = btn.textContent.trim().replace(/⭐/g,'').trim();
    const all  = !tipo && (txt.startsWith('⚡') || txt.startsWith('Todos'));
    const match = tipo && txt.includes(tipo);
    btn.classList.toggle('active', !!(all || match));
  });
};

window.eletroPesquisar = function(v) {
  ES.pesquisa = v;
  renderCatalogoGrid();
};

window.eletroClearPesq = function() {
  ES.pesquisa = '';
  const inp = document.getElementById('eletro-pesq-input');
  if (inp) inp.value = '';
  renderCatalogoGrid();
};

window.eletroOrdenar = function(ord) {
  ES.ordenacao = ord;
  renderCatalogoGrid();
};

window.eletrosCopiarRef = function(ref, btn) {
  copiar(ref, btn);
};

// ════════════════════════════════════════════════
// AÇÕES — ORÇAMENTO
// ════════════════════════════════════════════════
window.eletroToggleOrc = function(ref) {
  const idx = ES.orc.findIndex(x => x.ref === ref);
  if (idx >= 0) {
    ES.orc.splice(idx, 1);
    window.wkToast?.('× Removido do orçamento');
  } else {
    let artigo = null;
    ELETRO_DB.forEach(t => {
      const a = t.artigos.find(x => x.ref === ref);
      if (a) artigo = { ...a, _tipo: t.tipo, qty: 1, nota: '' };
    });
    if (artigo) {
      ES.orc.push(artigo);
      window.wkToast?.('✓ Adicionado ao orçamento');
    }
  }
  atualizarBadge();
  // Re-render da vista activa
  if (ES.tab === 'catalogo')  renderCatalogoGrid();
  if (ES.tab === 'orcamento') renderOrcamento();
};

window.eletrosQty = function(idx, delta) {
  if (!ES.orc[idx]) return;
  ES.orc[idx].qty = Math.max(1, (ES.orc[idx].qty || 1) + delta);
  renderOrcamento();
};

window.eletrosAtualizarNota = function(idx, nota) {
  if (ES.orc[idx]) ES.orc[idx].nota = nota;
};

window.eletrosLimpar = function() {
  if (!ES.orc.length) return;
  if (confirm('Limpar todo o orçamento?')) {
    ES.orc = [];
    atualizarBadge();
    renderOrcamento();
    window.wkToast?.('✓ Orçamento limpo');
  }
};

window.eletrosCopiarOrcamento = function() {
  if (!ES.orc.length) { window.wkToast?.('⚠️ Orçamento vazio'); return; }

  const linhas = ['ORÇAMENTO — ELETRODOMÉSTICOS', '═'.repeat(52), ''];
  ES.orc.forEach(a => {
    linhas.push(`${a._tipo.toUpperCase()}`);
    linhas.push(`  ${a.nome}`);
    linhas.push(`  Marca: ${a.marca}   Ref LM: ${a.ref}`);
    linhas.push(`  Qty: ${a.qty || 1} × ${fmt(a.preco)} = ${fmt((a.preco || 0) * (a.qty || 1))}`);
    if (a.nota) linhas.push(`  Nota: ${a.nota}`);
    linhas.push('');
  });
  const total = ES.orc.reduce((s, a) => s + (a.preco || 0) * (a.qty || 1), 0);
  linhas.push('─'.repeat(52));
  linhas.push(`TOTAL ELETROS: ${fmt(total)}`);
  linhas.push('─'.repeat(52));

  navigator.clipboard.writeText(linhas.join('\n')).then(() => window.wkToast?.('✓ Orçamento copiado com referências'));
};

window.eletrosCopiarSoRefs = function() {
  if (!ES.orc.length) { window.wkToast?.('⚠️ Orçamento vazio'); return; }

  const linhas = ['REFERÊNCIAS LM — ELETRODOMÉSTICOS', '─'.repeat(40)];
  ES.orc.forEach(a => {
    linhas.push(`${a.ref}  ×${a.qty || 1}  ${a.nome}`);
  });
  navigator.clipboard.writeText(linhas.join('\n')).then(() => window.wkToast?.('✓ Referências copiadas'));
};

// ════════════════════════════════════════════════
// HELPERS INTERNOS
// ════════════════════════════════════════════════
function atualizarBadge() {
  const badge = document.getElementById('eletro-badge-count');
  if (badge) {
    badge.textContent = ES.orc.length;
    badge.style.display = ES.orc.length ? 'inline-block' : 'none';
  }
}

function getCorTipo(tipo) {
  return ELETRO_DB.find(t => t.tipo === tipo)?.cor || '#888';
}

function getIconTipo(tipo) {
  return ELETRO_DB.find(t => t.tipo === tipo)?.icon || '⚡';
}
