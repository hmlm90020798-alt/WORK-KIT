// ════════════════════════════════════════════════
// assistente.js · Work Kit · Hélder Melo
// Assistente técnico de cozinhas com IA real
// Base de conhecimento extraída de orçamentos reais
// ════════════════════════════════════════════════

import { MATERIAIS_DB } from './materiais.js';

// ════════════════════════════════════════════════
// CONFIG API
// ════════════════════════════════════════════════
const GROQ_KEY   = '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';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';

// ════════════════════════════════════════════════
// CONHECIMENTO BASE — extraído de 6 orçamentos reais
// ════════════════════════════════════════════════

const LISTA_BASE_COZINHA = [
  { ref:'82231846', nome:'250 Parafusos 3.5×30mm SPAX',           familia:'Fixação e Estrutura',    quando:'Fixação de módulos entre si e à parede' },
  { ref:'82231844', nome:'300 Parafusos 3.5×16mm SPAX',           familia:'Fixação e Estrutura',    quando:'Painéis traseiros e fundos de módulos' },
  { ref:'19945982', nome:'10 Buchas D10×50mm Duopower',           familia:'Fixação e Estrutura',    quando:'Fixação à parede — universal em qualquer suporte' },
  { ref:'15765806', nome:'Fita Alumínio 50mm×10m Sanitop',        familia:'Vedação e Selagem',      quando:'Selagem de juntas e remates' },
  { ref:'86904474', nome:'Fita Pintor Multisup Dexter 50m×48mm',  familia:'Ferramentas e Consumíveis', quando:'Protecção de superfícies durante instalação' },
  { ref:'16353246', nome:'Silicone Coz&WC Ceys Express 280ml Tr', familia:'Vedação e Selagem',      quando:'Junta tampo-parede — transparente quando visível' },
  { ref:'81995522', nome:'Rolo Protecção Gaveta/Móv 150×50 Delinia', familia:'Ferragens e Acessórios', quando:'Forro interior de gavetas e prateleiras' },
  { ref:'87978117', nome:'Fita LED Cutflexi 1000lm 5m Inspiro',   familia:'Iluminação',             quando:'Iluminação sob módulos superiores' },
  { ref:'15872003', nome:'Batente Adesivo 10×3mm 25un',           familia:'Ferragens e Acessórios', quando:'Amortecimento de portas — obrigatório em todas' },
  { ref:'84299215', nome:'Tubo Flexível Alu D120 C35 200cm',      familia:'Fixação e Estrutura',    quando:'Ligação exaustor à saída de ar — com qualquer exaustor' },
  { ref:'84407520', nome:'Tubo Ext RM 1½-40/50mm Branco',         familia:'Lava-Louça e Torneiras', quando:'Extensão do sifão à saída de esgoto na parede' },
  { ref:'956902',   nome:'Kit Suporte para Forno Branco',         familia:'Ferragens e Acessórios', quando:'Suporte obrigatório em todo o forno encastre' },
  { ref:'15293075', nome:'Grelha Ventilação Forno Inox 60×12.5',  familia:'Ferragens e Acessórios', quando:'Ventilação obrigatória no módulo de forno' },
];

const CONDICIONAIS = {
  superiores: [
    { ref:'956630', nome:'Guia Montagem Módulos Superiores 2000mm', familia:'Ferragens e Acessórios', quando:'Suspensão de módulos superiores à parede' },
    { ref:'956663', nome:'Sistema Push Open p/Porta Branco',        familia:'Ferragens e Acessórios', quando:'Abertura sem puxador — apenas nos superiores' },
  ],
  regua_60: [
    { ref:'16353603', nome:'Régua 600mm p/Forno 560',              familia:'Ferragens e Acessórios', quando:'Reforço de módulo 60cm — placa ou lava-louça' },
  ],
  regua_80: [
    { ref:'81934117', nome:'Régua Ref Móv 800 Forno 760mm',        familia:'Ferragens e Acessórios', quando:'Reforço de módulo 80cm — placa ou lava-louça' },
  ],
  regua_90: [
    { ref:'16353631', nome:'Régua 900-860mm p/Móv 90',             familia:'Ferragens e Acessórios', quando:'Reforço de módulo 90cm — placa ou lava-louça' },
  ],
  vitrine: [
    { ref:'80129470', nome:'Dobradiças 110° c/ Amort p/ Vitrine',  familia:'Ferragens e Acessórios', quando:'Portas de vidro — dobradiça específica para vitrine' },
  ],
};

const ALERTAS_CONTEXTO = [
  { trigger: /silestone|dekton|granito|pedra natural|mármore/i,
    nivel: 'critico',
    texto: '⚠️ Tampo em pedra natural/silestone/dekton — transporte e montagem são serviços externos. Orçamentar à parte com prazo próprio.' },
  { trigger: /lava.?lou[çc]a.*(pret|escur|antraçit|black|cor)/i,
    nivel: 'atencao',
    texto: '⚡ Lava-louça de cor — verificar compatibilidade com o tampo e se o recorte está previsto no serviço de tampo.' },
  { trigger: /exaustor.*(ocult|integrad|embutil)/i,
    nivel: 'atencao',
    texto: '⚡ Exaustor oculto — exige módulo específico com saída de ar traseira. Verificar se está no projeto 3D.' },
  { trigger: /placa.*(gas|g[aá]s)/i,
    nivel: 'atencao',
    texto: '⚡ Placa a gás — verificar ligação de gás no local e se há ramal existente.' },
  { trigger: /ilha/i,
    nivel: 'atencao',
    texto: '⚡ Ilha central — confirmar saída de ar do exaustor (requer manga no tecto ou exaustor de ilha dedicado).' },
];

// ════════════════════════════════════════════════
// ESTADO DO MÓDULO
// ════════════════════════════════════════════════
const AS = {
  loading:     false,
  historico:   [], // [{role, content}]
  resultados:  [], // artigos gerados [{ref, nome, familia, fonte, alerta?}]
  orcItemRefs: new Set(), // refs já no orçamento de materiais
};

// ════════════════════════════════════════════════
// PROMPT DO SISTEMA
// ════════════════════════════════════════════════
function buildSystemPrompt() {
  const catalogoResumido = MATERIAIS_DB
    .filter(a => a.ref && a.nome)
    .map(a => `${a.ref}|${a.nome}|${a.familia}|${a.preco}€`)
    .join('\n');

  return `És o assistente técnico do Hélder, vendedor especialista em cozinhas na Leroy Merlin Viseu.

O teu único objetivo é ajudar o Hélder a construir a lista de materiais necessários para um projeto de cozinha, de forma rápida e sem esquecer nada.

━━━ COMO FUNCIONA ━━━

O Hélder descreve o projeto em linguagem natural. Podes receber:
- Tipo de projeto: "cozinha", "cozinha com ilha", etc.
- Dimensões: "12ml", "8 metros lineares"
- Elementos: "superiores e inferiores", "só inferiores", "com coluna"
- Tampo: "silestone miami white 2cm", "dekton", "laminado"
- Eletros: "forno encastre AEG", "placa indução", "exaustor oculto"
- Lava-louça: "lava-louça loft inox", "1 cuba preta"
- Sistema de abertura: "clic", "push open", "puxadores oslo 96mm"
- Keywords de produto: "barra reforço 80", "régua 60", "oslo"

━━━ REGRAS ━━━

1. NUNCA inventar referências. Usa sempre as do catálogo fornecido.
2. Se não encontrares no catálogo → indica como "pesquisar em leroymerlin.pt"
3. Não fazer perguntas desnecessárias — trabalha com o que tens
4. A única pergunta útil: "módulo da placa/lava-louça tem quantos cm?" quando não for indicado
5. Dobradiças, cestos deslizantes e sistema elevatório NÃO incluir — vêm do software 3D

━━━ CATÁLOGO LOCAL ━━━
${catalogoResumido}

━━━ FORMATO DE RESPOSTA — OBRIGATÓRIO ━━━

Responde SEMPRE em JSON válido com esta estrutura exata:

{
  "artigos": [
    {
      "ref": "82231846",
      "nome": "250 Parafusos 3.5×30mm SPAX",
      "familia": "Fixação e Estrutura",
      "preco": 5.59,
      "fonte": "catalogo",
      "grupo": "base"
    }
  ],
  "alertas": [
    {
      "nivel": "critico",
      "texto": "Tampo em Silestone — transporte e montagem são serviços externos."
    }
  ],
  "em_falta": ["Largura do módulo da placa — 60, 80 ou 90cm?"],
  "resumo": "Cozinha 12ml com superiores e inferiores, tampo Silestone, forno encastre."
}

Valores possíveis para "grupo": "base" | "condicional" | "lookup"
Valores possíveis para "fonte": "catalogo" | "pesquisar"
Valores possíveis para "nivel" de alerta: "critico" | "atencao"

Se o input for uma keyword de produto (ex: "oslo", "barra reforço 80", "clic"):
- Pesquisa no catálogo e devolve só esse artigo com grupo "lookup"
- Se não encontrar no catálogo, devolve fonte "pesquisar"

Não incluir texto fora do JSON. Resposta deve ser JSON puro e parseável.`;
}

// ════════════════════════════════════════════════
// RENDER PRINCIPAL
// ════════════════════════════════════════════════
export function assistenteInit() {
  renderAssistente();
}

function renderAssistente() {
  const ct = document.getElementById('tab-assistente');
  if (!ct) return;

  ct.innerHTML = `
    <div class="ass-layout">

      <!-- ── Coluna esquerda: input ── -->
      <div class="ass-col-input">
        <div class="ass-header">
          <div class="page-titulo">Assistente</div>
          <div class="page-sub">Descreve o projeto — recebe a lista de materiais</div>
        </div>

        <!-- Input principal -->
        <div class="ass-input-wrap">
          <textarea id="ass-input" class="ass-textarea"
            placeholder="Ex: cozinha com superiores e inferiores, tampo silestone, forno encastre, lava-louça 1 cuba inox"
            rows="4"
            onkeydown="if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){window.assEnviar();event.preventDefault()}"></textarea>

          <div class="ass-input-footer">
            <span class="ass-hint">Ctrl+Enter para enviar</span>
            <button class="ass-btn-enviar" id="ass-btn" onclick="window.assEnviar()">
              <span id="ass-btn-txt">Gerar Lista</span>
              <span class="ass-btn-icon">→</span>
            </button>
          </div>
        </div>

        <!-- Exemplos rápidos -->
        <div class="ass-exemplos-wrap">
          <div class="ass-exemplos-label">Exemplos rápidos</div>
          <div class="ass-exemplos">
            <button class="ass-exemplo" onclick="window.assExemplo(this)">cozinha superiores e inferiores</button>
            <button class="ass-exemplo" onclick="window.assExemplo(this)">cozinha só inferiores</button>
            <button class="ass-exemplo" onclick="window.assExemplo(this)">forno encastre módulo 60</button>
            <button class="ass-exemplo" onclick="window.assExemplo(this)">push open</button>
            <button class="ass-exemplo" onclick="window.assExemplo(this)">régua 80</button>
            <button class="ass-exemplo" onclick="window.assExemplo(this)">puxadores oslo 96mm</button>
            <button class="ass-exemplo" onclick="window.assExemplo(this)">tampo silestone</button>
            <button class="ass-exemplo" onclick="window.assExemplo(this)">lava-louça preta 1 cuba</button>
          </div>
        </div>

        <!-- Histórico da conversa -->
        <div id="ass-historico" class="ass-historico"></div>
      </div>

      <!-- ── Coluna direita: resultados ── -->
      <div class="ass-col-result" id="ass-col-result">
        <div class="ass-result-empty" id="ass-empty">
          <div class="ass-empty-icon">🔍</div>
          <div class="ass-empty-titulo">Lista de materiais</div>
          <div class="ass-empty-sub">Descreve o projeto e a lista aparece aqui,<br>pronta para adicionar ao orçamento.</div>
        </div>
        <div id="ass-resultado" style="display:none">
          <div id="ass-res-header" class="ass-res-header"></div>
          <div id="ass-alertas" class="ass-alertas-wrap"></div>
          <div id="ass-em-falta" class="ass-em-falta-wrap"></div>
          <div id="ass-artigos" class="ass-artigos-wrap"></div>
          <div id="ass-acoes" class="ass-acoes"></div>
        </div>
      </div>

    </div>`;
}

// ════════════════════════════════════════════════
// ENVIAR — lógica principal
// ════════════════════════════════════════════════
async function enviar(texto) {
  if (AS.loading) return;
  if (!texto.trim()) { window.wkToast?.('⚠️ Escreve algo primeiro'); return; }

  AS.loading = true;
  setBtnLoading(true);

  // Mostrar mensagem do utilizador no histórico
  AS.historico.push({ role: 'user', content: texto });
  renderHistorico();

  // Esconder empty, mostrar resultado com loading
  document.getElementById('ass-empty').style.display = 'none';
  document.getElementById('ass-resultado').style.display = '';
  document.getElementById('ass-res-header').innerHTML = '';
  document.getElementById('ass-alertas').innerHTML = '';
  document.getElementById('ass-em-falta').innerHTML = '';
  document.getElementById('ass-artigos').innerHTML = `
    <div class="ass-loading">
      <div class="ass-loading-dot"></div>
      <div class="ass-loading-dot"></div>
      <div class="ass-loading-dot"></div>
    </div>`;
  document.getElementById('ass-acoes').innerHTML = '';

  // Aplicar lógica local primeiro para contexto
  const contexto = analisarContextoLocal(texto);

  try {
    // Groq API — formato OpenAI compatível
    const messages = [
      { role: 'system', content: buildSystemPrompt() },
      ...AS.historico,
    ];

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        max_tokens:  1000,
        temperature: 0.2,
        messages,
      }),
    });

    const data = await response.json();
    const raw  = data.choices?.[0]?.message?.content || '';

    // Parse JSON da resposta
    let parsed;
    try {
      const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      throw new Error('Resposta não é JSON válido: ' + raw.substring(0, 100));
    }

    // Adicionar artigos locais que a IA pode ter esquecido (contexto local)
    parsed = enriquecerComContextoLocal(parsed, contexto);

    // Guardar na conversa
    AS.historico.push({ role: 'assistant', content: raw });
    AS.resultados = parsed.artigos || [];

    // Render resultado
    renderResultado(parsed);

  } catch (e) {
    console.error('Assistente erro:', e);
    document.getElementById('ass-artigos').innerHTML = `
      <div class="ass-erro">
        ⚠️ Erro ao contactar o Assistente.<br>
        <span style="font-size:10px;opacity:.6">${e.message}</span>
      </div>`;
  } finally {
    AS.loading = false;
    setBtnLoading(false);
    // Limpar input
    const inp = document.getElementById('ass-input');
    if (inp) { inp.value = ''; inp.focus(); }
  }
}

// ════════════════════════════════════════════════
// ANÁLISE LOCAL — contexto antes de chamar a API
// ════════════════════════════════════════════════
function analisarContextoLocal(txt) {
  const t = txt.toLowerCase();
  return {
    temSuperiores: /superior|cima|alto|de cima/.test(t) && !/sem superior|só inferior|apenas inferior/.test(t),
    sóInferiores:  /só inferior|sem superior|apenas inferior/.test(t),
    modulo60:      /\b60\b/.test(t),
    modulo80:      /\b80\b/.test(t),
    modulo90:      /\b90\b/.test(t),
    temVitrine:    /vitrine|vidro/.test(t),
    temSilestone:  /silestone|dekton|granito|pedra natural|mármore/.test(t),
    temExaustor:   /exaustor/.test(t),
    temLavaLouca:  /lava.?lou[çc]a|lavalou[çc]a/.test(t),
    temForno:      /forno/.test(t),
  };
}

function enriquecerComContextoLocal(parsed, ctx) {
  const refs_existentes = new Set((parsed.artigos || []).map(a => a.ref));

  const adicionar = (artigos) => {
    artigos.forEach(a => {
      if (!refs_existentes.has(a.ref)) {
        parsed.artigos.push({ ...a, fonte: 'catalogo', grupo: 'condicional' });
        refs_existentes.add(a.ref);
      }
    });
  };

  // Garantir lista base completa
  LISTA_BASE_COZINHA.forEach(a => {
    if (!refs_existentes.has(a.ref)) {
      // Só adicionar tubo flexível se mencionou exaustor, tubo ext se mencionou lava-louça
      if (a.ref === '84299215' && !ctx.temExaustor) return;
      if (a.ref === '84407520' && !ctx.temLavaLouca) return;
      if (a.ref === '956902'   && !ctx.temForno) return;
      if (a.ref === '15293075' && !ctx.temForno) return;
      parsed.artigos.unshift({ ...a, fonte: 'catalogo', grupo: 'base' });
      refs_existentes.add(a.ref);
    }
  });

  // Condicionais locais
  if (ctx.temSuperiores && !ctx.sóInferiores) adicionar(CONDICIONAIS.superiores);
  if (ctx.modulo60) adicionar(CONDICIONAIS.regua_60);
  if (ctx.modulo80) adicionar(CONDICIONAIS.regua_80);
  if (ctx.modulo90) adicionar(CONDICIONAIS.regua_90);
  if (ctx.temVitrine) adicionar(CONDICIONAIS.vitrine);

  // Alertas locais
  if (!parsed.alertas) parsed.alertas = [];
  const txt_original = AS.historico.slice(-2)[0]?.content || '';
  ALERTAS_CONTEXTO.forEach(alerta => {
    if (alerta.trigger.test(txt_original)) {
      const jaExiste = parsed.alertas.some(a => a.texto === alerta.texto);
      if (!jaExiste) parsed.alertas.push({ nivel: alerta.nivel, texto: alerta.texto });
    }
  });

  return parsed;
}

// ════════════════════════════════════════════════
// RENDER RESULTADO
// ════════════════════════════════════════════════
function renderResultado(parsed) {
  const { artigos = [], alertas = [], em_falta = [], resumo = '' } = parsed;

  // Header
  document.getElementById('ass-res-header').innerHTML = `
    <div class="ass-res-resumo">${resumo}</div>
    <div class="ass-res-count">${artigos.length} artigo${artigos.length !== 1 ? 's' : ''}</div>`;

  // Alertas
  const alertasEl = document.getElementById('ass-alertas');
  alertasEl.innerHTML = alertas.map(a => `
    <div class="ass-alerta ass-alerta-${a.nivel}">
      ${a.nivel === 'critico' ? '🚨' : '⚡'} ${a.texto}
    </div>`).join('');

  // Em falta
  const emFaltaEl = document.getElementById('ass-em-falta');
  if (em_falta.length) {
    emFaltaEl.innerHTML = `
      <div class="ass-em-falta">
        <div class="ass-em-falta-titulo">Por definir</div>
        ${em_falta.map(f => `<div class="ass-em-falta-item">· ${f}</div>`).join('')}
      </div>`;
  } else {
    emFaltaEl.innerHTML = '';
  }

  // Artigos agrupados
  const base       = artigos.filter(a => a.grupo === 'base');
  const cond       = artigos.filter(a => a.grupo === 'condicional');
  const lookup     = artigos.filter(a => a.grupo === 'lookup');
  const pesquisar  = artigos.filter(a => a.fonte === 'pesquisar');

  let html = '';

  if (lookup.length) {
    html += renderGrupoArtigos('🔍 Resultado da pesquisa', lookup);
  }
  if (base.length) {
    html += renderGrupoArtigos('📋 Lista Base', base);
  }
  if (cond.length) {
    html += renderGrupoArtigos('⚙️ Adicionado pelo projeto', cond);
  }
  if (pesquisar.length) {
    html += renderGrupoArtigos('🌐 Pesquisar em leroymerlin.pt', pesquisar, true);
  }

  document.getElementById('ass-artigos').innerHTML = html || '<div class="ass-vazio">Nenhum artigo encontrado</div>';

  // Acções
  document.getElementById('ass-acoes').innerHTML = artigos.length ? `
    <div class="ass-acoes-wrap">
      <button class="ass-acao-btn" onclick="window.assAdicionarTodos()">
        + Adicionar todos ao Orçamento
      </button>
      <button class="ass-acao-btn ass-acao-sec" onclick="window.assCopiarRefs()">
        ⎘ Copiar Referências
      </button>
    </div>` : '';
}

function renderGrupoArtigos(titulo, artigos, isPesquisar = false) {
  return `
    <div class="ass-grupo">
      <div class="ass-grupo-titulo">${titulo}</div>
      ${artigos.map(a => renderCardArtigo(a, isPesquisar)).join('')}
    </div>`;
}

function renderCardArtigo(a, isPesquisar = false) {
  const noOrc = window._wkST?.matOrc?.some?.(x => x.ref === a.ref)
    || document.querySelector?.(`[data-ref="${a.ref}"]`);

  if (isPesquisar) {
    return `
      <div class="ass-artigo ass-artigo-pesquisar">
        <div class="ass-artigo-nome">${a.nome}</div>
        <a href="https://www.leroymerlin.pt/pesquisa/${encodeURIComponent(a.nome)}"
           target="_blank" rel="noopener" class="ass-artigo-link">
          Pesquisar ↗
        </a>
      </div>`;
  }

  return `
    <div class="ass-artigo" data-ref="${a.ref}">
      <div class="ass-artigo-info">
        <div class="ass-artigo-nome">${a.nome}</div>
        <div class="ass-artigo-meta">
          <span class="ass-artigo-ref" onclick="window.copiarTexto('${a.ref}',this)" title="Copiar referência">
            ${a.ref}
          </span>
          ${a.familia ? `<span class="ass-artigo-familia">${a.familia}</span>` : ''}
          ${a.preco ? `<span class="ass-artigo-preco">${Number(a.preco).toLocaleString('pt-PT',{minimumFractionDigits:2,maximumFractionDigits:2})} €</span>` : ''}
        </div>
        ${a.quando ? `<div class="ass-artigo-quando">${a.quando}</div>` : ''}
      </div>
      <button class="ass-artigo-btn ${AS.orcItemRefs.has(a.ref) ? 'ass-artigo-btn-ok' : ''}"
        onclick="window.assToggleOrc('${a.ref}','${a.nome.replace(/'/g,"\\'")}','${a.familia||''}',${a.preco||0})"
        title="${AS.orcItemRefs.has(a.ref) ? 'Remover do orçamento' : 'Adicionar ao orçamento'}">
        ${AS.orcItemRefs.has(a.ref) ? '✓' : '+'}
      </button>
    </div>`;
}

function renderHistorico() {
  const el = document.getElementById('ass-historico');
  if (!el) return;
  // Mostrar só as mensagens do utilizador, não do assistente (o output é o painel de resultados)
  const msgs = AS.historico.filter(m => m.role === 'user');
  if (msgs.length <= 1) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="ass-hist-titulo">Pesquisas anteriores</div>
    ${msgs.slice(0, -1).reverse().slice(0, 5).map(m => `
      <button class="ass-hist-item" onclick="window.assRepetir('${m.content.replace(/'/g,"\\'")}')">
        ${m.content.substring(0, 60)}${m.content.length > 60 ? '…' : ''}
      </button>`).join('')}`;
}

function setBtnLoading(loading) {
  const btn = document.getElementById('ass-btn');
  const txt = document.getElementById('ass-btn-txt');
  if (!btn || !txt) return;
  btn.disabled = loading;
  txt.textContent = loading ? 'A gerar…' : 'Gerar Lista';
}

// ════════════════════════════════════════════════
// WINDOW API
// ════════════════════════════════════════════════
window.assistenteInit = assistenteInit;

window.assEnviar = function() {
  const inp = document.getElementById('ass-input');
  if (inp) enviar(inp.value);
};

window.assExemplo = function(btn) {
  const inp = document.getElementById('ass-input');
  if (inp) {
    inp.value = btn.textContent.trim();
    inp.focus();
    // Auto-enviar em exemplos simples (keywords)
    const simples = /^(push open|régua \d+|puxadores|clic|barra reforço)/.test(inp.value.toLowerCase());
    if (simples) window.assEnviar();
  }
};

window.assRepetir = function(texto) {
  const inp = document.getElementById('ass-input');
  if (inp) { inp.value = texto; inp.focus(); }
};

window.assToggleOrc = function(ref, nome, familia, preco) {
  if (AS.orcItemRefs.has(ref)) {
    AS.orcItemRefs.delete(ref);
    // Remover do orçamento de materiais se existir
    if (window._wkST?.matOrc) {
      window._wkST.matOrc = window._wkST.matOrc.filter(x => x.ref !== ref);
    }
    window.wkToast?.('× Removido do orçamento');
  } else {
    AS.orcItemRefs.add(ref);
    // Adicionar ao orçamento de materiais
    if (!window._wkST) window._wkST = {};
    if (!window._wkST.matOrc) window._wkST.matOrc = [];
    if (!window._wkST.matOrc.some(x => x.ref === ref)) {
      window._wkST.matOrc.push({ ref, nome, familia, preco, unid:'un', qty:1 });
    }
    window.wkToast?.('✓ Adicionado ao orçamento');
  }
  // Re-render só o botão
  const btn = document.querySelector(`.ass-artigo[data-ref="${ref}"] .ass-artigo-btn`);
  if (btn) {
    btn.textContent = AS.orcItemRefs.has(ref) ? '✓' : '+';
    btn.classList.toggle('ass-artigo-btn-ok', AS.orcItemRefs.has(ref));
  }
  window.matAtualizarBadge?.();
};

window.assAdicionarTodos = function() {
  let count = 0;
  AS.resultados.forEach(a => {
    if (a.fonte !== 'pesquisar' && !AS.orcItemRefs.has(a.ref)) {
      window.assToggleOrc(a.ref, a.nome, a.familia, a.preco);
      count++;
    }
  });
  if (count) window.wkToast?.(`✓ ${count} artigos adicionados ao orçamento`);
};

window.assCopiarRefs = function() {
  const linhas = AS.resultados
    .filter(a => a.fonte !== 'pesquisar')
    .map(a => `${a.ref}\t${a.nome}`);
  if (!linhas.length) { window.wkToast?.('⚠️ Sem artigos para copiar'); return; }
  navigator.clipboard.writeText(linhas.join('\n'))
    .then(() => window.wkToast?.('✓ Referências copiadas'));
};
