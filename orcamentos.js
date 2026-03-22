// ════════════════════════════════════════════════
// orcamentos.js · Work Kit · Hélder Melo
// ════════════════════════════════════════════════

import { doc, setDoc, getDocs, deleteDoc, collection }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const ORC_COL = 'wk_orcamentos';
const db = () => window._wkDb;
const OS = { lista: [], ok: false };

// ── Firebase ──────────────────────────────────
async function carregar() {
  if (!db()) return;
  try {
    const snap = await getDocs(collection(db(), ORC_COL));
    OS.lista = [];
    snap.forEach(d => OS.lista.push({ id: d.id, ...d.data() }));
    OS.lista.sort((a, b) => (b.ts||0) - (a.ts||0));
    OS.ok = true;
  } catch(e) { console.warn('Orc carregar:', e); }
}

async function salvar(o) {
  if (!db()) return;
  try { await setDoc(doc(db(), ORC_COL, o.id), o); }
  catch(e) { window.wkToast?.('Erro ao guardar'); }
}

async function apagar(id) {
  if (!db()) return;
  try { await deleteDoc(doc(db(), ORC_COL, id)); }
  catch(e) { window.wkToast?.('Erro ao apagar'); }
}

// ── Init ──────────────────────────────────────
export async function orcInit() {
  injectCSS();
  if (!OS.ok) await carregar();
  orcRender();
}

// ── Render lista ──────────────────────────────
export function orcRender() {
  const hdr = document.getElementById('orc-header');
  const bdy = document.getElementById('orc-body');
  if (!hdr || !bdy) return;

  hdr.innerHTML = `
    <div class="page-header page-header-flex">
      <div>
        <div class="page-titulo">Orcamentos</div>
        <div class="page-sub">Cria, regista e exporta orcamentos de projecto</div>
      </div>
      <button class="btn-pri" onclick="window.orcNovo()">+ Novo Orcamento</button>
    </div>`;

  if (!OS.lista.length) {
    bdy.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--t4)">
      <div style="font-size:36px;opacity:.25;margin-bottom:12px">📋</div>
      <div style="font-family:var(--serif);font-size:16px;color:var(--t3);margin-bottom:6px">Sem orcamentos</div>
      <div style="font-size:12px">Cria o primeiro orcamento</div>
    </div>`;
    return;
  }

  bdy.innerHTML = `<div class="orc-grid">${OS.lista.map(card).join('')}</div>`;
}

function total(o) {
  let t = 0;
  ['linhas_mobiliario','linhas_eletros','linhas_maoobra','linhas_materiais'].forEach(k => {
    (o[k]||[]).forEach(l => t += parseFloat(l.preco)||0);
  });
  t += parseFloat(o.tampo_preco)||0;
  return t;
}

function fmt(v) {
  return (v||0).toLocaleString('pt-PT',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' EUR';
}

const COR_ESTADO = {
  rascunho:'rgba(139,105,20,.12);border:1px solid rgba(139,105,20,.28);color:rgba(255,210,100,.8)',
  enviado: 'rgba(42,90,154,.12);border:1px solid rgba(42,90,154,.28);color:rgba(120,170,255,.8)',
  aceite:  'rgba(40,120,60,.12);border:1px solid rgba(40,120,60,.28);color:rgba(100,210,120,.8)',
  perdido: 'rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.25);color:rgba(255,140,130,.7)',
};
const LABEL_ESTADO = { rascunho:'Rascunho', enviado:'Enviado', aceite:'Aceite', perdido:'Perdido' };

function card(o) {
  const t = total(o);
  const e = o.estado||'rascunho';
  const cor = COR_ESTADO[e]||COR_ESTADO.rascunho;
  return `<div class="orc-card" onclick="window.orcDetalhe('${o.id}')">
    <div class="orc-card-topo">
      <span class="orc-card-num">${o.num?'No '+o.num:'—'}</span>
      <span class="orc-estado" style="background:${cor}">${LABEL_ESTADO[e]}</span>
    </div>
    <div class="orc-card-cliente">${o.cliente||'Cliente'}</div>
    <div class="orc-card-data">${o.data?new Date(o.data).toLocaleDateString('pt-PT'):'—'}</div>
    ${o.notas?`<div class="orc-card-notas">${o.notas.substring(0,55)}${o.notas.length>55?'...':''}</div>`:''}
    <div class="orc-card-total">${fmt(t*1.23)}</div>
    <div class="orc-card-acoes" onclick="event.stopPropagation()">
      <button class="bib-card-btn" onclick="window.orcEditar('${o.id}')" title="Editar">✎</button>
      <button class="bib-card-btn" onclick="window.orcExportar('${o.id}')" title="Copiar">⎘</button>
      <button class="bib-card-btn bib-card-btn-del" onclick="window.wkConfirm('Apagar?',()=>window._orcApagar('${o.id}'))">×</button>
    </div>
  </div>`;
}

// ── Modal ─────────────────────────────────────
function modal(o) {
  document.getElementById('orc-modal')?.remove();
  const v = (k,fb='') => o[k]!==undefined?o[k]:fb;
  const l0 = k => (o[k]||[{}])[0]||{};

  const sec = (titulo,key,linha) => `<div style="display:flex;flex-direction:column;gap:5px">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4)">${titulo}</div>
    <div style="display:flex;gap:8px">
      <input class="f-input" style="flex:2" id="of-${key}-desc" placeholder="Descricao" value="${(linha.desc||'').replace(/"/g,'&quot;')}">
      <input class="f-input" style="flex:0 0 110px" id="of-${key}-preco" type="number" placeholder="EUR s/IVA" step="0.01" value="${linha.preco||''}">
    </div>
  </div>`;

  const el = document.createElement('div');
  el.id = 'orc-modal';
  el.className = 'overlay-modal active';
  el.innerHTML = `<div class="modal-box" style="max-width:640px;width:95vw;max-height:90vh;overflow-y:auto">
    <div class="modal-header">
      <div class="modal-titulo">${o.id?'Editar Orcamento':'Novo Orcamento'}</div>
      <button class="modal-close" onclick="document.getElementById('orc-modal').remove()">x</button>
    </div>
    <div class="modal-body">
      <div class="form-grid-2">
        <div class="form-campo"><label class="form-label">No Orcamento</label>
          <input id="of-num" class="f-input" placeholder="Ex: 207455" value="${v('num')}"></div>
        <div class="form-campo"><label class="form-label">Data</label>
          <input id="of-data" class="f-input" type="date" value="${v('data',new Date().toISOString().slice(0,10))}"></div>
        <div class="form-campo full"><label class="form-label">Cliente *</label>
          <input id="of-cliente" class="f-input" placeholder="Nome do cliente" value="${v('cliente')}"></div>
        <div class="form-campo full"><label class="form-label">Notas</label>
          <textarea id="of-notas" class="f-textarea" rows="2" placeholder="Ex: Cozinha Tokyo Branco 12ml...">${v('notas')}</textarea></div>
        <div class="form-campo"><label class="form-label">Estado</label>
          <select id="of-estado" class="f-select">
            ${['rascunho','enviado','aceite','perdido'].map(s=>`<option value="${s}" ${v('estado','rascunho')===s?'selected':''}>${LABEL_ESTADO[s]}</option>`).join('')}
          </select></div>
        <div class="form-campo"><label class="form-label">Ref. PC Winner</label>
          <input id="of-pc" class="f-input" placeholder="Referencia 3D" value="${v('pc')}"></div>
      </div>
      <div style="margin-top:16px;display:flex;flex-direction:column;gap:10px">
        ${sec('Mobiliario (KC)','mob',l0('linhas_mobiliario'))}
        ${sec('Tampo','tam',{desc:v('tampo_desc'),preco:v('tampo_preco')})}
        ${sec('Eletrodomesticos','ele',l0('linhas_eletros'))}
        ${sec('Mao de Obra','mo',l0('linhas_maoobra'))}
        ${sec('Materiais','mat',l0('linhas_materiais'))}
        <div style="padding:12px 14px;border-radius:10px;background:rgba(196,97,42,.08);border:1px solid rgba(196,97,42,.15);display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:12px;font-weight:700;color:var(--t2)">Total c/ IVA 23%</span>
          <span id="of-total" style="font-family:var(--mono);font-size:17px;font-weight:800;color:rgba(255,190,152,.95)">—</span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-cancelar" onclick="document.getElementById('orc-modal').remove()">Cancelar</button>
      <button class="btn-guardar" onclick="window._orcGuardar('${o.id||''}')">Guardar</button>
    </div>
  </div>`;
  document.body.appendChild(el);

  ['mob','tam','ele','mo','mat'].forEach(k => {
    document.getElementById('of-'+k+'-preco')?.addEventListener('input', calcModalTotal);
  });
  calcModalTotal();
}

function calcModalTotal() {
  const t = ['mob','tam','ele','mo','mat'].reduce((s,k)=>s+(parseFloat(document.getElementById('of-'+k+'-preco')?.value)||0),0);
  const el = document.getElementById('of-total');
  if (el) el.textContent = t>0 ? fmt(t*1.23) : '—';
}

// ── Guardar ───────────────────────────────────
window._orcGuardar = async function(editId) {
  const g = id => (document.getElementById(id)?.value||'').trim();
  const n = id => parseFloat(document.getElementById(id)?.value)||0;
  if (!g('of-cliente')) { window.wkToast?.('Nome do cliente obrigatorio'); return; }

  const id = editId || (Date.now().toString(36)+Math.random().toString(36).slice(2,5));
  const o = {
    id, ts:Date.now(),
    num:g('of-num'), data:g('of-data'), cliente:g('of-cliente'),
    notas:g('of-notas'), estado:g('of-estado')||'rascunho', pc:g('of-pc'),
    tampo_desc:g('of-tam-desc'), tampo_preco:n('of-tam-preco'),
    linhas_mobiliario: g('of-mob-desc')||n('of-mob-preco')?[{desc:g('of-mob-desc'),preco:n('of-mob-preco')}]:[],
    linhas_eletros:    g('of-ele-desc')||n('of-ele-preco')?[{desc:g('of-ele-desc'),preco:n('of-ele-preco')}]:[],
    linhas_maoobra:    g('of-mo-desc') ||n('of-mo-preco') ?[{desc:g('of-mo-desc'), preco:n('of-mo-preco')} ]:[],
    linhas_materiais:  g('of-mat-desc')||n('of-mat-preco')?[{desc:g('of-mat-desc'),preco:n('of-mat-preco')}]:[],
  };
  const idx = OS.lista.findIndex(x=>x.id===id);
  if (idx>=0) OS.lista[idx]=o; else OS.lista.unshift(o);
  await salvar(o);
  document.getElementById('orc-modal')?.remove();
  orcRender();
  window.wkToast?.('Orcamento guardado');
};

// ── Apagar ────────────────────────────────────
window._orcApagar = async function(id) {
  await apagar(id);
  OS.lista = OS.lista.filter(x=>x.id!==id);
  orcRender();
  window.wkToast?.('Orcamento apagado');
};

// ── Detalhe ───────────────────────────────────
function detalhe(o) {
  document.getElementById('orc-det')?.remove();
  const t = total(o);
  const secH = (tit,linhas) => {
    if (!linhas?.length) return '';
    return `<div style="margin-bottom:13px"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4);margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,.06)">${tit}</div>
    ${linhas.map(l=>`<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px;color:var(--t2);border-bottom:1px solid rgba(255,255,255,.04)"><span>${l.desc||l.nome||'—'}</span><span style="font-family:var(--mono);color:var(--t3)">${fmt(l.preco||0)}</span></div>`).join('')}</div>`;
  };
  const el = document.createElement('div');
  el.id = 'orc-det';
  el.className = 'overlay-modal active';
  el.innerHTML = `<div class="modal-box" style="max-width:560px;width:95vw;max-height:90vh;overflow-y:auto">
    <div class="modal-header">
      <div>
        <div class="modal-titulo">${o.num?'Orcamento No '+o.num:'Orcamento'}</div>
        <div style="font-size:11px;color:var(--t4);margin-top:2px">${o.cliente||''} · ${o.data?new Date(o.data).toLocaleDateString('pt-PT'):''}</div>
      </div>
      <button class="modal-close" onclick="document.getElementById('orc-det').remove()">x</button>
    </div>
    <div class="modal-body">
      ${o.notas?`<div style="font-size:12px;color:var(--t3);padding:10px 14px;border-radius:9px;background:rgba(255,255,255,.04);margin-bottom:14px;line-height:1.6">${o.notas}</div>`:''}
      ${secH('Mobiliario',o.linhas_mobiliario)}
      ${(o.tampo_desc||o.tampo_preco)?`<div style="margin-bottom:13px"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4);margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,.06)">Tampo</div><div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px;color:var(--t2)"><span>${o.tampo_desc||'Tampo'}</span><span style="font-family:var(--mono);color:var(--t3)">${fmt(o.tampo_preco||0)}</span></div></div>`:''}
      ${secH('Eletrodomesticos',o.linhas_eletros)}
      ${secH('Mao de Obra',o.linhas_maoobra)}
      ${secH('Materiais',o.linhas_materiais)}
      <div style="border-top:1px solid rgba(255,255,255,.08);padding-top:13px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t3);margin-bottom:5px"><span>Total s/ IVA</span><span style="font-family:var(--mono)">${fmt(t)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t3);margin-bottom:9px"><span>IVA 23%</span><span style="font-family:var(--mono)">${fmt(t*0.23)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;color:rgba(255,190,152,.95)"><span>Total c/ IVA</span><span style="font-family:var(--mono)">${fmt(t*1.23)}</span></div>
      </div>
      ${o.pc?`<div style="margin-top:11px;font-size:10px;color:var(--t4)">Ref. PC Winner: ${o.pc}</div>`:''}
    </div>
    <div class="modal-footer">
      <button class="btn-cancelar" onclick="document.getElementById('orc-det').remove()">Fechar</button>
      <button class="btn-sec" onclick="window.orcEditar('${o.id}');document.getElementById('orc-det').remove()">✎ Editar</button>
      <button class="btn-guardar" onclick="window.orcExportar('${o.id}')">⎘ Copiar</button>
    </div>
  </div>`;
  document.body.appendChild(el);
}

// ── Exportar ──────────────────────────────────
function exportar(o) {
  const t = total(o);
  const s = (tit,linhas) => {
    if(!linhas?.length) return '';
    return `\n${tit}:\n`+linhas.map(l=>`  ${l.desc||l.nome||''} — ${fmt(l.preco||0)}`).join('\n');
  };
  const txt = [
    `ORCAMENTO ${o.num?'No '+o.num:''}`,
    `Cliente: ${o.cliente||''}`,
    `Data: ${o.data?new Date(o.data).toLocaleDateString('pt-PT'):''}`,
    o.notas?'\n'+o.notas:'',
    '\n'+'—'.repeat(36),
    s('Mobiliario',o.linhas_mobiliario),
    (o.tampo_desc||o.tampo_preco)?`\nTampo:\n  ${o.tampo_desc||''} — ${fmt(o.tampo_preco||0)}`:'',
    s('Eletrodomesticos',o.linhas_eletros),
    s('Mao de Obra',o.linhas_maoobra),
    s('Materiais',o.linhas_materiais),
    '\n'+'—'.repeat(36),
    `Total s/ IVA:  ${fmt(t)}`,
    `IVA 23%:       ${fmt(t*0.23)}`,
    `TOTAL c/ IVA:  ${fmt(t*1.23)}`,
    o.pc?`\nRef. PC: ${o.pc}`:'',
  ].filter(Boolean).join('\n').replace(/\n{3,}/g,'\n\n').trim();
  navigator.clipboard.writeText(txt).then(()=>window.wkToast?.('Resumo copiado'));
}

// ── CSS ───────────────────────────────────────
function injectCSS() {
  if (document.getElementById('orc-css')) return;
  const st = document.createElement('style');
  st.id = 'orc-css';
  st.textContent = `.orc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:13px;padding:4px 0}.orc-card{background:var(--glass-bg);border:1px solid var(--glass-brd);border-radius:13px;padding:15px;cursor:pointer;transition:all .17s;display:flex;flex-direction:column;gap:6px}.orc-card:hover{border-color:var(--glass-brd2);transform:translateY(-2px)}.orc-card-topo{display:flex;align-items:center;justify-content:space-between}.orc-card-num{font-family:var(--mono);font-size:10px;font-weight:700;color:rgba(196,97,42,.75)}.orc-estado{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;padding:2px 8px;border-radius:99px}.orc-card-cliente{font-family:var(--serif);font-size:14px;font-weight:700;color:var(--t1)}.orc-card-data{font-size:10px;color:var(--t4)}.orc-card-notas{font-size:11px;color:var(--t3);line-height:1.4}.orc-card-total{font-family:var(--mono);font-size:16px;font-weight:800;color:rgba(255,190,152,.9);margin-top:3px}.orc-card-acoes{display:flex;gap:5px;justify-content:flex-end;margin-top:3px}`;
  document.head.appendChild(st);
}

// ── API pública ───────────────────────────────
window.orcNovo     = () => modal({});
window.orcEditar   = id => { const o=OS.lista.find(x=>x.id===id); if(o) modal(o); };
window.orcDetalhe  = id => { const o=OS.lista.find(x=>x.id===id); if(o) detalhe(o); };
window.orcExportar = id => { const o=OS.lista.find(x=>x.id===id); if(o) exportar(o); };
