// ════════════════════════════════════════════════
// orcamentos.js · Work Kit · Hélder Melo
// Criação, registo e exportação de orçamentos
// ════════════════════════════════════════════════

const ORC_COL = 'wk_orcamentos';

// Estado local
const OS = {
  lista:      [],   // todos os orçamentos
  editId:     null, // id em edição
  detalheId:  null, // id no painel de detalhe
};

// ════════════════════════════════════════════════
// FIREBASE
// ════════════════════════════════════════════════
async function orcCarregar() {
  try {
    const db = window._wkDb;
    if (!db) return;
    const { getDocs, collection } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const snap = await getDocs(collection(db, ORC_COL));
    OS.lista = [];
    snap.forEach(d => OS.lista.push({ id: d.id, ...d.data() }));
    OS.lista.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  } catch (e) { console.warn('Orçamentos: erro ao carregar', e); }
}

async function orcSalvar(orc) {
  try {
    const db = window._wkDb;
    if (!db) return;
    const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    await setDoc(doc(db, ORC_COL, orc.id), orc);
  } catch (e) { window.wkToast?.('⚠️ Erro ao guardar orçamento'); console.error(e); }
}

async function orcApagar(id) {
  try {
    const db = window._wkDb;
    if (!db) return;
    const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    await deleteDoc(doc(db, ORC_COL, id));
    OS.lista = OS.lista.filter(o => o.id !== id);
    orcRender();
    window.wkToast?.('✓ Orçamento apagado');
  } catch (e) { window.wkToast?.('⚠️ Erro ao apagar'); }
}

// ════════════════════════════════════════════════
// RENDER PRINCIPAL
// ════════════════════════════════════════════════
export function orcRender() {
  const hdr = document.getElementById('orc-header');
  const bdy = document.getElementById('orc-body');
  if (!hdr || !bdy) return;

  hdr.innerHTML = `
    <div class="page-header page-header-flex">
      <div>
        <div class="page-titulo">Orçamentos</div>
        <div class="page-sub">Regista, acompanha e exporta todos os orçamentos de projecto</div>
      </div>
      <button class="btn-pri" onclick="window.orcAbrirNovo()">+ Novo Orçamento</button>
    </div>`;

  if (!OS.lista.length) {
    bdy.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:var(--t4)">
        <div style="font-size:36px;margin-bottom:12px;opacity:.3">📋</div>
        <div style="font-family:var(--serif);font-size:16px;color:var(--t3);margin-bottom:6px">Sem orçamentos ainda</div>
        <div style="font-size:12px">Cria o primeiro orçamento ou regista um existente do Winner</div>
      </div>`;
    return;
  }

  bdy.innerHTML = `
    <div class="orc-grid">
      ${OS.lista.map(o => orcCard(o)).join('')}
    </div>`;
}

function orcCard(o) {
  const total   = calcTotal(o);
  const estado  = o.estado || 'rascunho';
  const cores   = { rascunho:'rgba(139,105,20,.15)', enviado:'rgba(42,90,154,.15)', aceite:'rgba(40,120,60,.15)', perdido:'rgba(192,57,43,.12)' };
  const bordas  = { rascunho:'rgba(139,105,20,.3)',  enviado:'rgba(42,90,154,.3)',  aceite:'rgba(40,120,60,.3)',  perdido:'rgba(192,57,43,.25)' };
  const textos  = { rascunho:'rgba(255,220,120,.8)', enviado:'rgba(120,170,255,.8)',aceite:'rgba(100,220,120,.8)',perdido:'rgba(255,140,130,.7)' };
  const labels  = { rascunho:'Rascunho', enviado:'Enviado', aceite:'Aceite', perdido:'Perdido' };

  return `
    <div class="orc-card" onclick="window.orcAbrirDetalhe('${o.id}')">
      <div class="orc-card-topo">
        <div class="orc-card-num">${o.num || '—'}</div>
        <span class="orc-estado" style="background:${cores[estado]};border:1px solid ${bordas[estado]};color:${textos[estado]}">${labels[estado]}</span>
      </div>
      <div class="orc-card-cliente">${o.cliente || 'Cliente'}</div>
      <div class="orc-card-data">${o.data || '—'}</div>
      <div class="orc-card-total">${fmt(total)}</div>
      <div class="orc-card-acoes" onclick="event.stopPropagation()">
        <button class="bib-card-btn" onclick="window.orcEditar('${o.id}')" title="Editar">✎</button>
        <button class="bib-card-btn" onclick="window.orcExportar('${o.id}')" title="Exportar">⎘</button>
        <button class="bib-card-btn bib-card-btn-del" onclick="window.wkConfirm('Apagar orçamento?',()=>orcApagar('${o.id}'))" title="Apagar">×</button>
      </div>
    </div>`;
}

function calcTotal(o) {
  let t = 0;
  (o.linhas_mobiliario  || []).forEach(l => t += (l.qty||1)*(l.preco||0));
  (o.linhas_maoobra     || []).forEach(l => t += (l.qty||1)*(l.preco||0));
  (o.linhas_eletros     || []).forEach(l => t += (l.qty||1)*(l.preco||0));
  if (o.tampo_preco)   t += parseFloat(o.tampo_preco)||0;
  return t;
}

function fmt(v) {
  return isNaN(v) ? '—' : v.toLocaleString('pt-PT', { minimumFractionDigits:2, maximumFractionDigits:2 }) + ' €';
}

// ════════════════════════════════════════════════
// MODAL — NOVO / EDITAR
// ════════════════════════════════════════════════
export function orcAbrirNovo() {
  OS.editId = null;
  renderModal({});
}

export function orcEditar(id) {
  const o = OS.lista.find(x => x.id === id);
  if (!o) return;
  OS.editId = id;
  renderModal(o);
}

function renderModal(o) {
  // Remover modal anterior se existir
  document.getElementById('orc-modal')?.remove();

  const estados = ['rascunho','enviado','aceite','perdido'];
  const m = document.createElement('div');
  m.id = 'orc-modal';
  m.className = 'overlay-modal active';
  m.innerHTML = `
    <div class="modal-box" style="max-width:680px;width:95vw;max-height:90vh;overflow-y:auto">
      <div class="modal-header">
        <div class="modal-titulo">${OS.editId ? 'Editar Orçamento' : 'Novo Orçamento'}</div>
        <button class="modal-close" onclick="document.getElementById('orc-modal').remove()">×</button>
      </div>
      <div class="modal-body">

        <!-- Info básica -->
        <div class="form-grid-2">
          <div class="form-campo">
            <label class="form-label">Nº Orçamento</label>
            <input id="of-num" class="f-input" placeholder="Ex: 207455" value="${o.num||''}">
          </div>
          <div class="form-campo">
            <label class="form-label">Data</label>
            <input id="of-data" type="date" class="f-input" value="${o.data||new Date().toISOString().slice(0,10)}">
          </div>
          <div class="form-campo full">
            <label class="form-label">Cliente</label>
            <input id="of-cliente" class="f-input" placeholder="Nome do cliente" value="${o.cliente||''}">
          </div>
          <div class="form-campo full">
            <label class="form-label">Descrição / Notas</label>
            <textarea id="of-notas" class="f-textarea" rows="2" placeholder="Ex: Cozinha Tokyo Branco, 12ml, tampo Dekton...">${o.notas||''}</textarea>
          </div>
          <div class="form-campo">
            <label class="form-label">Estado</label>
            <select id="of-estado" class="f-select">
              ${estados.map(e=>`<option value="${e}" ${(o.estado||'rascunho')===e?'selected':''}>${e.charAt(0).toUpperCase()+e.slice(1)}</option>`).join('')}
            </select>
          </div>
          <div class="form-campo">
            <label class="form-label">Referência PC (Winner)</label>
            <input id="of-pc" class="f-input" placeholder="Ref. do projeto 3D" value="${o.pc||''}">
          </div>
        </div>

        <!-- Secções de valor -->
        <div style="margin-top:18px;display:flex;flex-direction:column;gap:10px">

          <div class="orc-sec">
            <div class="orc-sec-titulo">Mobiliário (cozinha Winner)</div>
            <div class="orc-sec-row">
              <input class="f-input" style="flex:2" id="of-mob-desc" placeholder="Descrição (ex: Cozinha Tokyo Branco 12ml)">
              <input class="f-input" style="flex:1;max-width:100px" id="of-mob-preco" type="number" placeholder="€" step="0.01" value="${(o.linhas_mobiliario||[{}])[0]?.preco||''}">
            </div>
          </div>

          <div class="orc-sec">
            <div class="orc-sec-titulo">Tampo</div>
            <div class="orc-sec-row">
              <input class="f-input" style="flex:2" id="of-tam-desc" placeholder="Ex: Dekton Nacre 2cm, 4.2m²" value="${o.tampo_desc||''}">
              <input class="f-input" style="flex:1;max-width:100px" id="of-tam-preco" type="number" placeholder="€" step="0.01" value="${o.tampo_preco||''}">
            </div>
          </div>

          <div class="orc-sec">
            <div class="orc-sec-titulo">Eletrodomésticos</div>
            <div class="orc-sec-row">
              <input class="f-input" style="flex:2" id="of-ele-desc" placeholder="Ex: Forno AEG + Placa Indução + Exaustor">
              <input class="f-input" style="flex:1;max-width:100px" id="of-ele-preco" type="number" placeholder="€" step="0.01" value="${(o.linhas_eletros||[{}])[0]?.preco||''}">
            </div>
          </div>

          <div class="orc-sec">
            <div class="orc-sec-titulo">Mão de Obra</div>
            <div class="orc-sec-row">
              <input class="f-input" style="flex:2" id="of-mo-desc" placeholder="Ex: Instalação 11ml + lava-louça + eletros">
              <input class="f-input" style="flex:1;max-width:100px" id="of-mo-preco" type="number" placeholder="€" step="0.01" value="${(o.linhas_maoobra||[{}])[0]?.preco||''}">
            </div>
          </div>

          <div class="orc-sec">
            <div class="orc-sec-titulo">Materiais</div>
            <div class="orc-sec-row">
              <input class="f-input" style="flex:2" id="of-mat-desc" placeholder="Ex: Parafusos, silicone, buchas, fita LED...">
              <input class="f-input" style="flex:1;max-width:100px" id="of-mat-preco" type="number" placeholder="€" step="0.01" value="${(o.linhas_materiais||[{}])[0]?.preco||''}">
            </div>
          </div>

          <!-- Total calculado -->
          <div id="of-total-wrap" style="padding:12px 14px;border-radius:10px;background:rgba(196,97,42,.08);border:1px solid rgba(196,97,42,.15);display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:12px;font-weight:700;color:var(--t2)">Total c/ IVA (23%)</span>
            <span id="of-total" style="font-family:var(--mono);font-size:18px;font-weight:800;color:rgba(255,190,152,.9)">—</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancelar" onclick="document.getElementById('orc-modal').remove()">Cancelar</button>
        <button class="btn-guardar" onclick="window.orcGuardar()">Guardar</button>
      </div>
    </div>`;
  document.body.appendChild(m);

  // Preencher desc das linhas se existir
  if (o.linhas_mobiliario?.[0]?.desc) document.getElementById('of-mob-desc').value = o.linhas_mobiliario[0].desc;
  if (o.linhas_eletros?.[0]?.desc)    document.getElementById('of-ele-desc').value = o.linhas_eletros[0].desc;
  if (o.linhas_maoobra?.[0]?.desc)    document.getElementById('of-mo-desc').value  = o.linhas_maoobra[0].desc;
  if (o.linhas_materiais?.[0]?.desc)  document.getElementById('of-mat-desc').value = o.linhas_materiais[0].desc;

  // Calcular total ao vivo
  ['of-mob-preco','of-tam-preco','of-ele-preco','of-mo-preco','of-mat-preco'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', atualizarTotal);
  });
  atualizarTotal();

  // CSS extra para secções
  if (!document.getElementById('orc-modal-css')) {
    const st = document.createElement('style');
    st.id = 'orc-modal-css';
    st.textContent = `.orc-sec{display:flex;flex-direction:column;gap:6px}.orc-sec-titulo{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4)}.orc-sec-row{display:flex;gap:8px;align-items:center}`;
    document.head.appendChild(st);
  }
}

function atualizarTotal() {
  const vals = ['of-mob-preco','of-tam-preco','of-ele-preco','of-mo-preco','of-mat-preco']
    .map(id => parseFloat(document.getElementById(id)?.value)||0);
  const semIVA = vals.reduce((a,b)=>a+b,0);
  const comIVA = semIVA * 1.23;
  const el = document.getElementById('of-total');
  if (el) el.textContent = comIVA > 0 ? comIVA.toLocaleString('pt-PT',{minimumFractionDigits:2,maximumFractionDigits:2})+' €' : '—';
}

// ════════════════════════════════════════════════
// GUARDAR
// ════════════════════════════════════════════════
export function orcGuardar() {
  const g = id => document.getElementById(id)?.value?.trim()||'';
  const n = id => parseFloat(document.getElementById(id)?.value)||0;

  const id  = OS.editId || (Date.now().toString(36)+Math.random().toString(36).slice(2,6));
  const orc = {
    id,
    num:     g('of-num'),
    data:    g('of-data'),
    cliente: g('of-cliente'),
    notas:   g('of-notas'),
    estado:  g('of-estado')||'rascunho',
    pc:      g('of-pc'),
    tampo_desc:  g('of-tam-desc'),
    tampo_preco: n('of-tam-preco'),
    linhas_mobiliario: g('of-mob-desc')||n('of-mob-preco') ? [{ desc:g('of-mob-desc'), preco:n('of-mob-preco'), qty:1 }] : [],
    linhas_eletros:    g('of-ele-desc')||n('of-ele-preco') ? [{ desc:g('of-ele-desc'), preco:n('of-ele-preco'), qty:1 }] : [],
    linhas_maoobra:    g('of-mo-desc') ||n('of-mo-preco')  ? [{ desc:g('of-mo-desc'),  preco:n('of-mo-preco'),  qty:1 }] : [],
    linhas_materiais:  g('of-mat-desc')||n('of-mat-preco') ? [{ desc:g('of-mat-desc'), preco:n('of-mat-preco'), qty:1 }] : [],
    ts: Date.now(),
  };

  if (!orc.cliente) { window.wkToast?.('⚠️ Nome do cliente obrigatório'); return; }

  if (OS.editId) {
    const idx = OS.lista.findIndex(x => x.id === id);
    if (idx >= 0) OS.lista[idx] = orc; else OS.lista.unshift(orc);
  } else {
    OS.lista.unshift(orc);
  }

  orcSalvar(orc);
  document.getElementById('orc-modal')?.remove();
  orcRender();
  window.wkToast?.('✓ Orçamento guardado');
}

// ════════════════════════════════════════════════
// DETALHE
// ════════════════════════════════════════════════
export function orcAbrirDetalhe(id) {
  const o = OS.lista.find(x => x.id === id);
  if (!o) return;

  document.getElementById('orc-modal-det')?.remove();

  const total    = calcTotal(o);
  const semIVA   = total;
  const comIVA   = total * 1.23;

  const linhaHtml = (titulo, linhas) => {
    if (!linhas?.length) return '';
    return `<div class="orc-det-sec">
      <div class="orc-det-sec-titulo">${titulo}</div>
      ${linhas.map(l=>`<div class="orc-det-linha">
        <span style="flex:1">${l.desc||l.nome||'—'}</span>
        <span style="font-family:var(--mono);font-size:12px;color:var(--t3)">${fmt((l.qty||1)*(l.preco||0))}</span>
      </div>`).join('')}
    </div>`;
  };

  const m = document.createElement('div');
  m.id = 'orc-modal-det';
  m.className = 'overlay-modal active';
  m.innerHTML = `
    <div class="modal-box" style="max-width:620px;width:95vw;max-height:90vh;overflow-y:auto">
      <div class="modal-header">
        <div>
          <div class="modal-titulo">Orçamento ${o.num||''}</div>
          <div style="font-size:11px;color:var(--t4);margin-top:2px">${o.cliente||''} · ${o.data||''}</div>
        </div>
        <button class="modal-close" onclick="document.getElementById('orc-modal-det').remove()">×</button>
      </div>
      <div class="modal-body" id="orc-det-corpo">
        ${o.notas ? `<div style="font-size:12px;color:var(--t3);padding:10px 14px;border-radius:9px;background:rgba(255,255,255,.04);margin-bottom:16px;line-height:1.6">${o.notas}</div>` : ''}
        ${linhaHtml('Mobiliário', o.linhas_mobiliario)}
        ${o.tampo_desc||o.tampo_preco ? `<div class="orc-det-sec"><div class="orc-det-sec-titulo">Tampo</div><div class="orc-det-linha"><span style="flex:1">${o.tampo_desc||'Tampo'}</span><span style="font-family:var(--mono);font-size:12px;color:var(--t3)">${fmt(o.tampo_preco||0)}</span></div></div>` : ''}
        ${linhaHtml('Eletrodomésticos', o.linhas_eletros)}
        ${linhaHtml('Mão de Obra', o.linhas_maoobra)}
        ${linhaHtml('Materiais', o.linhas_materiais)}
        <div style="margin-top:16px;border-top:1px solid rgba(255,255,255,.08);padding-top:14px">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t3);margin-bottom:6px">
            <span>Total s/ IVA</span><span style="font-family:var(--mono)">${fmt(semIVA)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t3);margin-bottom:10px">
            <span>IVA 23%</span><span style="font-family:var(--mono)">${fmt(semIVA*0.23)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;color:rgba(255,190,152,.95)">
            <span>Total c/ IVA</span><span style="font-family:var(--mono)">${fmt(comIVA)}</span>
          </div>
        </div>
        ${o.pc ? `<div style="margin-top:12px;font-size:10px;color:var(--t4)">Ref. PC Winner: ${o.pc}</div>` : ''}
      </div>
      <div class="modal-footer" style="gap:8px">
        <button class="btn-cancelar" onclick="document.getElementById('orc-modal-det').remove()">Fechar</button>
        <button class="btn-sec" onclick="window.orcEditar('${o.id}');document.getElementById('orc-modal-det').remove()">✎ Editar</button>
        <button class="btn-guardar" onclick="window.orcExportar('${o.id}')">⎘ Copiar Resumo</button>
      </div>
    </div>`;
  document.body.appendChild(m);

  // CSS detalhe
  if (!document.getElementById('orc-det-css')) {
    const st = document.createElement('style');
    st.id = 'orc-det-css';
    st.textContent = `.orc-det-sec{margin-bottom:14px}.orc-det-sec-titulo{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4);margin-bottom:7px;padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,.06)}.orc-det-linha{display:flex;align-items:flex-start;gap:12px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:12px;color:var(--t2)}`;
    document.head.appendChild(st);
  }
}

// ════════════════════════════════════════════════
// EXPORTAR — copiar resumo de texto
// ════════════════════════════════════════════════
export function orcExportar(id) {
  const o = OS.lista.find(x => x.id === id);
  if (!o) return;

  const total  = calcTotal(o);
  const comIVA = total * 1.23;

  const linha = (label, linhas) => {
    if (!linhas?.length) return '';
    return `\n${label}:\n` + linhas.map(l=>`  ${l.desc||l.nome||''} — ${fmt((l.qty||1)*(l.preco||0))}`).join('\n');
  };

  const txt = `ORÇAMENTO ${o.num||''}
Cliente: ${o.cliente||''}
Data: ${o.data||''}
${o.notas ? '\n'+o.notas : ''}
${'─'.repeat(40)}
${linha('Mobiliário', o.linhas_mobiliario)}
${o.tampo_preco ? `\nTampo:\n  ${o.tampo_desc||'Tampo'} — ${fmt(o.tampo_preco)}` : ''}
${linha('Eletrodomésticos', o.linhas_eletros)}
${linha('Mão de Obra', o.linhas_maoobra)}
${linha('Materiais', o.linhas_materiais)}
${'─'.repeat(40)}
Total s/ IVA: ${fmt(total)}
IVA 23%:      ${fmt(total*0.23)}
TOTAL c/ IVA: ${fmt(comIVA)}
${o.pc ? '\nRef. PC Winner: '+o.pc : ''}`.replace(/\n{3,}/g,'\n\n').trim();

  navigator.clipboard.writeText(txt)
    .then(() => window.wkToast?.('✓ Resumo copiado para a área de transferência'));
}

// ════════════════════════════════════════════════
// CSS
// ════════════════════════════════════════════════
function injectCSS() {
  if (document.getElementById('orc-css')) return;
  const st = document.createElement('style');
  st.id = 'orc-css';
  st.textContent = `
.orc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;padding:4px 0}
.orc-card{background:var(--glass-bg);border:1px solid var(--glass-brd);border-radius:14px;padding:16px;cursor:pointer;transition:all .18s;display:flex;flex-direction:column;gap:8px}
.orc-card:hover{border-color:var(--glass-brd2);background:rgba(255,255,255,.06);transform:translateY(-2px)}
.orc-card-topo{display:flex;align-items:center;justify-content:space-between}
.orc-card-num{font-family:var(--mono);font-size:11px;font-weight:700;color:rgba(196,97,42,.8)}
.orc-estado{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:2px 9px;border-radius:99px}
.orc-card-cliente{font-size:14px;font-weight:700;color:var(--t1);font-family:var(--serif)}
.orc-card-data{font-size:10px;color:var(--t4)}
.orc-card-total{font-family:var(--mono);font-size:18px;font-weight:800;color:rgba(255,190,152,.9);margin-top:4px}
.orc-card-acoes{display:flex;gap:5px;justify-content:flex-end;margin-top:4px}`;
  document.head.appendChild(st);
}

// ════════════════════════════════════════════════
// API PÚBLICA
// ════════════════════════════════════════════════
window.orcAbrirNovo   = orcAbrirNovo;
window.orcEditar      = orcEditar;
window.orcGuardar     = orcGuardar;
window.orcExportar    = orcExportar;
window.orcAbrirDetalhe = orcAbrirDetalhe;

// Init — chamado pelo main.js
export async function orcInit() {
  injectCSS();
  await orcCarregar();
  orcRender();
}
