// ════════════════════════════════════════════════
// main.js · Work Kit · Hélder Melo
// ════════════════════════════════════════════════

import { tampoInit, switchTampoTab, tampoCarregarCalc }   from './tampos.js';
import { eletroInit, switchEletroTab, eletroCarregarOrcamento } from './eletros.js';
import { moRender, moCarregarOrcamento }                  from './maoobra.js';
import { matInit, matCarregar }                           from './materiais.js';
import { initializeApp }                                 from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore }                                   from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
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
window._wkDb  = _db;
window._wkApp = _app; // necessário para o proxy seguro da Cloud Function


// ════════════════════════════════════════════════
// ESTADO GLOBAL
// Exposto via window._wkST para módulos externos
// ════════════════════════════════════════════════
let ST = {
  tab: 'tampos',
  // MO
  moOrc: [],
  moSeccao: 'Cozinhas e Roupeiros',
  moCat: 'Remodelação de Cozinha',
  moPesquisa: '',
  // Tampos
  tampoCat: '',
  tampoTab: 'catalogo',
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
  if (tabId === 'tampos')    tampoInit();
  if (tabId === 'eletros') {
    if (!document.getElementById('eletro-header')?.innerHTML) eletroInit();
    else switchEletroTab('catalogo');
  }
  if (tabId === 'maoobra')   moRender();
  if (tabId === 'materiais') matInit();
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
      // Forçar refresh do token para garantir que o Firestore o reconhece
      await user.getIdToken(true);
      // Carregar dados essenciais
      await Promise.all([
        moCarregarOrcamento(),
        matCarregar(),
        eletroCarregarOrcamento(),
        tampoCarregarCalc(),
      ]);
      setView('app');
      document.querySelector('[data-tab="tampos"]')?.classList.add('active');
      tampoInit();
      ov.remove();
    } else {
      ov.remove();
      setView('login');
    }
  });
})();
