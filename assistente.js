// ════════════════════════════════════════════════
// assistente.js · Work Kit · Hélder Melo
// Assistente técnico de cozinhas com IA real
// Base de conhecimento extraída de 6 orçamentos reais
// ════════════════════════════════════════════════

import { MATERIAIS_DB } from './materiais.js';

const GROQ_KEY   = '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';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';

// ════════════════════════════════════════════════
// CONHECIMENTO BASE
// ════════════════════════════════════════════════
const BASE_SEMPRE = [
  { ref:'82231846', nome:'250 Parafusos 3.5×30mm SPAX',              familia:'Fixação',     quando:'Fixação de módulos entre si e à parede' },
  { ref:'82231844', nome:'300 Parafusos 3.5×16mm SPAX',              familia:'Fixação',     quando:'Painéis traseiros e fundos de módulos' },
  { ref:'15765806', nome:'Fita Alumínio 50mm×10m Sanitop',           familia:'Selagem',     quando:'Selagem de juntas e remates' },
  { ref:'86904474', nome:'Fita Pintor Multisup Dexter 50m×48mm',     familia:'Consumíveis', quando:'Protecção de superfícies durante instalação' },
  { ref:'16353246', nome:'Silicone Coz&WC Ceys Express 280ml Tr',    familia:'Selagem',     quando:'Junta tampo-parede — transparente' },
  { ref:'81995522', nome:'Rolo Protecção Gaveta/Móv 150×50 Delinia', familia:'Ferragens',   quando:'Forro interior de gavetas e prateleiras' },
  { ref:'15872003', nome:'Batente Adesivo 10×3mm 25un',              familia:'Ferragens',   quando:'Amortecimento de portas — obrigatório em todas' },
];
const BASE_EXAUSTOR   = [{ ref:'84299215', nome:'Tubo Flexível Alu D120 C35 200cm',       familia:'Tubagens',   quando:'Ligação exaustor à saída de ar' }];
const BASE_LAVALOCA   = [{ ref:'84407520', nome:'Tubo Ext RM 1½-40/50mm Branco',          familia:'Tubagens',   quando:'Extensão do sifão à saída de esgoto' }];
const BASE_FORNO      = [
  { ref:'956902',   nome:'Kit Suporte para Forno Branco',        familia:'Ferragens', quando:'Suporte obrigatório em todo o forno encastre' },
  { ref:'15293075', nome:'Grelha Ventilação Forno Inox 60×12.5', familia:'Ferragens', quando:'Ventilação obrigatória no módulo de forno' },
];
const COND_SUPERIORES = [
  { ref:'19945982', nome:'10 Buchas D10×50mm Duopower',              familia:'Fixação',   quando:'Fixação dos módulos superiores à parede' },
  { ref:'956630',  nome:'Guia Montagem Módulos Superiores 2000mm',   familia:'Ferragens', quando:'Suspensão de módulos superiores à parede' },
  { ref:'956663',  nome:'Sistema Push Open p/Porta Branco',          familia:'Ferragens', quando:'Abertura sem puxador — apenas nos superiores' },
  { ref:'87978117',nome:'Fita LED Cutflexi 1000lm 5m Inspiro',      familia:'Iluminação',quando:'Iluminação sob módulos superiores' },
];
const COND_VITRINE    = [{ ref:'80129470', nome:'Dobradiças 110° c/ Amort p/ Vitrine', familia:'Ferragens', quando:'Portas de vidro' }];
const REGUAS = {
  60: { ref:'16353603', nome:'Régua 600mm p/Forno 560',        familia:'Ferragens', quando:'Reforço módulo 60cm — placa ou lava-louça' },
  80: { ref:'81934117', nome:'Régua Ref Móv 800 Forno 760mm',  familia:'Ferragens', quando:'Reforço módulo 80cm — placa ou lava-louça' },
  90: { ref:'16353631', nome:'Régua 900-860mm p/Móv 90',       familia:'Ferragens', quando:'Reforço módulo 90cm — placa ou lava-louça' },
};

// Refs que SÓ aparecem com superiores — filtrar sempre que semSup=true
const REFS_SUPERIORES = new Set(['19945982','956630','956663','87978117']);

const ALERTAS_CTX = [
  { r:/silestone|dekton|granito|pedra natural|mármore/i, nivel:'critico',
    txt:'Tampo em pedra/silestone/dekton — transporte e montagem são serviços externos. Orçamentar à parte.' },
  { r:/exaustor.*(ocult|integrad|embutil)/i, nivel:'atencao',
    txt:'Exaustor oculto — exige módulo específico com saída de ar traseira. Confirmar no projeto 3D.' },
  { r:/placa.*(gas|gás)/i, nivel:'atencao',
    txt:'Placa a gás — verificar ligação de gás no local.' },
  { r:/ilha/i, nivel:'atencao',
    txt:'Ilha central — confirmar saída de ar do exaustor (manga no tecto ou exaustor de ilha).' },
];

// ════════════════════════════════════════════════
// ESTADO
// ════════════════════════════════════════════════
const AS = { loading:false, historico:[], resultados:[], orcRefs:new Set() };

// ════════════════════════════════════════════════
// CONTEXTO LOCAL
// ════════════════════════════════════════════════
function ctx(txt) {
  const t = txt.toLowerCase();
  const semSup = /sem superior|sem moveis sup|sem móveis sup|só inferior|so inferior|apenas inferior/.test(t);
  return {
    semSup,
    comSup:     !semSup && /superior|de cima/.test(t),
    exaustor:   /exaustor/.test(t),
    lavaLouca:  /lava.?lou[çc]a|lavalou/.test(t),
    forno:      /forno/.test(t),
    vitrine:    /vitrine|vidro/.test(t),
    r60:        /\b60\b/.test(t) && /placa|lava/.test(t),
    r80:        /\b80\b/.test(t) && /placa|lava/.test(t),
    r90:        /\b90\b/.test(t) && /placa|lava/.test(t),
  };
}

function listaLocal(c) {
  const out = [], refs = new Set();
  const add = (lista, grupo) => lista.forEach(a => {
    if (!refs.has(a.ref)) { out.push({...a,fonte:'catalogo',grupo}); refs.add(a.ref); }
  });
  add(BASE_SEMPRE,    'base');
  if (c.exaustor)  add(BASE_EXAUSTOR,   'base');
  if (c.lavaLouca) add(BASE_LAVALOCA,   'base');
  if (c.forno)     add(BASE_FORNO,      'base');
  if (c.comSup)    add(COND_SUPERIORES, 'condicional');
  if (c.vitrine)   add(COND_VITRINE,    'condicional');
  [60,80,90].forEach(n => {
    if (c[`r${n}`] && !refs.has(REGUAS[n].ref))
      { out.push({...REGUAS[n],fonte:'catalogo',grupo:'condicional'}); refs.add(REGUAS[n].ref); }
  });
  return { out, refs };
}

function filtrar(artigos, c) {
  return artigos.filter(a => !(c.semSup && REFS_SUPERIORES.has(a.ref)));
}

// ════════════════════════════════════════════════
// PROMPT
// ════════════════════════════════════════════════
function promptPDF() {
  const cat = MATERIAIS_DB.filter(a=>a.ref&&a.nome).map(a=>a.ref+'|'+a.nome+'|'+a.familia+'|'+a.preco+'EUR').join('\n');
  return 'Es o assistente tecnico da Leroy Merlin Viseu. Recebes uma lista de materiais em linguagem comum (lista de tecnicos de instalacao) e tens de encontrar os artigos correspondentes no catalogo LM.\n\nCATALOGO LM:\n'+cat+'\n\nINSTRUCOES:\n1. Para cada item da lista, encontra o artigo mais proximo no catalogo\n2. Se encontrares -> ref LM, nome, preco, qty da lista original\n3. Se nao encontrares -> fonte pesquisar\n4. Ignora servicos de instalacao (codigos 490xxxxx)\n5. Inclui as quantidades indicadas na lista\n\nRESPOSTA - JSON puro sem texto antes/depois:\n{"artigos":[{"ref":"...","nome":"...","familia":"...","preco":0,"qty":1,"fonte":"catalogo","grupo":"base"}],"nao_encontrados":["item sem correspondencia no catalogo"],"resumo":"..."}';
}

function prompt() {
  // Só artigos relevantes para cozinhas — excluir pladur, tetos, cantoneiras, etc.
  const FAMILIAS_COZINHA = ['Fixação e Estrutura','Ferragens e Acessórios','Vedação e Selagem','Iluminação','Lava-Louça e Torneiras','Material PRO','Acabamentos e Renovação'];
  const cat = MATERIAIS_DB
    .filter(a => a.ref && a.nome && FAMILIAS_COZINHA.includes(a.familia))
    .map(a => `${a.ref}|${a.nome}|${a.preco}€`).join('\n');
  return `És o assistente técnico do Hélder, vendedor de cozinhas na Leroy Merlin Viseu.
Devolve a lista de materiais necessários para o projeto descrito.

REGRAS:
1. NUNCA inventar referências — usa APENAS refs do catálogo abaixo
2. Se um artigo não existe no catálogo → devolve fonte "pesquisar", não inventes refs
3. Dobradiças, cestos, sistema elevatório → NÃO incluir (vêm do software 3D)
4. SEM superiores → NÃO incluir 19945982, 956630, 956663, 87978117
5. COM superiores → incluir 19945982, 956630, 956663 como "condicional"
6. Réguas apenas se indicada a largura do módulo da placa/lava-louça
7. Só incluir artigos directamente relacionados com cozinhas — NÃO incluir materiais de construção, pladur, massas, perfis de tecto ou similares

CATÁLOGO:
${cat}

RESPOSTA — JSON puro, sem texto antes/depois:
{"artigos":[{"ref":"...","nome":"...","familia":"...","preco":0,"fonte":"catalogo","grupo":"base|condicional|lookup"}],"alertas":[{"nivel":"critico|atencao","texto":"..."}],"em_falta":["..."],"resumo":"..."}`;
}

// ════════════════════════════════════════════════
// RENDER PRINCIPAL
// ════════════════════════════════════════════════
export function assistenteInit() {
  const ct = document.getElementById('tab-assistente');
  if (!ct) return;
  ct.innerHTML = `
<style>
.aswrap{display:grid;grid-template-columns:330px 1fr;height:calc(100vh - 64px);overflow:hidden}
.asesq{display:flex;flex-direction:column;border-right:1px solid rgba(255,255,255,.07);overflow-y:auto}
.asdir{overflow-y:auto;background:rgba(0,0,0,.12)}
.astopo{padding:22px 22px 14px;border-bottom:1px solid rgba(255,255,255,.06)}
.astit{font-family:var(--serif);font-size:21px;font-weight:700;color:var(--t1);letter-spacing:-.02em}
.assub{font-size:11px;color:var(--t4);margin-top:2px}
.asinput{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,.06)}
.astxt{width:100%;min-height:90px;padding:11px 13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:10px;color:var(--t1);font-family:var(--sans);font-size:13px;line-height:1.6;resize:none;outline:none;box-sizing:border-box;transition:border-color .15s}
.astxt:focus{border-color:rgba(196,97,42,.4)}
.astxt::placeholder{color:var(--t4)}
.asinput-ft{display:flex;align-items:center;justify-content:space-between;margin-top:9px}
.ashint{font-size:10px;color:var(--t4)}
.asbtn{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;background:linear-gradient(135deg,rgba(196,97,42,.28),rgba(140,55,10,.18));border:1px solid rgba(196,97,42,.4);color:rgba(255,190,152,.95);font-family:var(--sans);font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.asbtn:hover{background:linear-gradient(135deg,rgba(196,97,42,.42),rgba(140,55,10,.28));transform:translateY(-1px)}
.asbtn:disabled{opacity:.35;cursor:not-allowed;transform:none}
.asbtn-arr{transition:transform .15s}
.asbtn:not(:disabled):hover .asbtn-arr{transform:translateX(3px)}
.asex{padding:13px 18px;border-bottom:1px solid rgba(255,255,255,.06)}
.asex-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--t4);margin-bottom:8px}
.aschips{display:flex;flex-wrap:wrap;gap:5px}
.aschip{padding:4px 11px;border-radius:99px;font-size:10px;font-weight:500;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:var(--t3);cursor:pointer;transition:all .15s;white-space:nowrap}
.aschip:hover{background:rgba(196,97,42,.12);border-color:rgba(196,97,42,.28);color:rgba(255,190,152,.85)}
.ashist{padding:13px 18px;flex:1}
.ashist-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--t4);margin-bottom:7px}
.ashist-item{display:block;width:100%;text-align:left;padding:7px 10px;border-radius:7px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);color:var(--t4);font-family:var(--sans);font-size:11px;cursor:pointer;margin-bottom:4px;transition:all .15s}
.ashist-item:hover{background:rgba(255,255,255,.06);color:var(--t2)}
.asempty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;gap:11px;color:var(--t4);padding:40px}
.asempty-ico{font-size:38px;opacity:.25}
.asempty-tit{font-family:var(--serif);font-size:17px;color:var(--t3);font-weight:600}
.asempty-txt{font-size:12px;line-height:1.8;max-width:240px}
.asload{display:flex;gap:7px;justify-content:center;padding:60px 0}
.asdot{width:9px;height:9px;border-radius:50%;background:rgba(196,97,42,.5);animation:asDot 1.2s ease-in-out infinite}
.asdot:nth-child(2){animation-delay:.2s}.asdot:nth-child(3){animation-delay:.4s}
@keyframes asDot{0%,80%,100%{transform:scale(.6);opacity:.3}40%{transform:scale(1.15);opacity:1}}
.asres{padding:22px}
.asres-topo{margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.07)}
.asres-resumo{font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:6px}
.asres-count{font-family:var(--mono);font-size:10px;color:var(--t4)}
.asalertas{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.asalerta{display:flex;align-items:flex-start;gap:9px;padding:9px 13px;border-radius:10px;font-size:11px;line-height:1.6;font-weight:500}
.asalerta-critico{background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.22);color:rgba(255,160,140,.9)}
.asalerta-atencao{background:rgba(196,97,42,.07);border:1px solid rgba(196,97,42,.18);color:rgba(255,190,152,.8)}
.asfalta{padding:9px 13px;border-radius:10px;margin-bottom:14px;background:rgba(139,105,20,.07);border:1px solid rgba(139,105,20,.18)}
.asfalta-tit{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,220,120,.45);margin-bottom:5px}
.asfalta-item{font-size:11px;color:rgba(255,220,120,.6);line-height:1.8}
.asfalta-item::before{content:"· "}
.asgrupo{margin-bottom:20px}
.asgrupo-hdr{display:flex;align-items:center;gap:7px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--t4);margin-bottom:9px;padding-bottom:7px;border-bottom:1px solid rgba(255,255,255,.06)}
.asgrupo-n{padding:2px 7px;border-radius:99px;font-size:9px;background:rgba(255,255,255,.06);color:var(--t4)}
.asart{display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);margin-bottom:5px;transition:all .15s}
.asart:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1)}
.asart-info{flex:1;min-width:0}
.asart-nome{font-size:12px;font-weight:600;color:var(--t1);line-height:1.3;margin-bottom:5px}
.asart-tags{display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.asart-ref{font-family:var(--mono);font-size:10px;color:rgba(196,97,42,.9);font-weight:700;padding:1px 6px;border-radius:4px;background:rgba(196,97,42,.1);cursor:pointer;transition:background .1s}
.asart-ref:hover{background:rgba(196,97,42,.2)}
.asart-fam{font-size:9px;color:var(--t4);padding:1px 7px;border-radius:99px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07)}
.asart-preco{font-family:var(--mono);font-size:10px;color:var(--t3);margin-left:auto}
.asart-quando{font-size:10px;color:var(--t4);font-style:italic;margin-top:3px;line-height:1.5}
.asart-pesq{background:rgba(42,90,154,.05);border-color:rgba(42,90,154,.13)}
.aslink{font-size:11px;color:rgba(120,170,255,.7);text-decoration:none;padding:4px 11px;border-radius:6px;background:rgba(42,90,154,.1);border:1px solid rgba(42,90,154,.16);white-space:nowrap;transition:all .15s}
.aslink:hover{background:rgba(42,90,154,.18)}
.asadd{width:30px;height:30px;flex-shrink:0;border-radius:8px;background:rgba(196,97,42,.1);border:1px solid rgba(196,97,42,.2);color:rgba(255,190,152,.7);font-size:18px;font-weight:700;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center}
.asadd:hover{background:rgba(196,97,42,.22);transform:scale(1.06)}
.asadd.ok{background:rgba(40,120,60,.14);border-color:rgba(40,120,60,.28);color:rgba(100,220,120,.8);font-size:14px}
.asacoes{display:flex;gap:7px;margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07)}
.asacao{flex:1;padding:9px 13px;border-radius:9px;font-family:var(--sans);font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;background:rgba(196,97,42,.11);border:1px solid rgba(196,97,42,.23);color:rgba(255,190,152,.85)}
.asacao:hover{background:rgba(196,97,42,.2)}
.asacao-sec{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.09);color:var(--t3)}
.asacao-sec:hover{background:rgba(255,255,255,.08)}
.aserro{padding:20px;text-align:center;color:rgba(255,140,130,.6);font-size:12px;line-height:1.7}
.aspdf-wrap{margin-top:8px;display:flex;align-items:center;gap:8px}
.aspdf-btn{display:flex;align-items:center;gap:7px;padding:6px 12px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);color:var(--t3);font-family:var(--sans);font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap}
.aspdf-btn:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:var(--t2)}
.aspdf-status{font-size:10px;color:var(--t4);font-style:italic}
.aspdf-status.ok{color:rgba(100,200,120,.7);font-style:normal}
.aspdf-status.err{color:rgba(255,140,130,.6);font-style:normal}
@media(max-width:768px){.aswrap{grid-template-columns:1fr;height:auto}.asdir{min-height:400px}}
</style>
<div class="aswrap">
  <div class="asesq">
    <div class="astopo">
      <div class="astit">Assistente</div>
      <div class="assub">Descreve o projeto — recebe a lista de materiais</div>
    </div>
    <div class="asinput">
      <textarea id="ass-input" class="astxt" rows="5"
        placeholder="Ex: cozinha com superiores e inferiores, tampo silestone, forno encastre, lava-louça inox"
        onkeydown="if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){window.assEnviar();event.preventDefault()}"></textarea>
      <div class="asinput-ft">
        <span class="ashint">Ctrl+Enter para enviar</span>
        <button class="asbtn" id="ass-btn" onclick="window.assEnviar()">
          <span id="ass-btn-txt">Gerar Lista</span><span class="asbtn-arr">→</span>
        </button>
      </div>
      <div class="aspdf-wrap">
        <label class="aspdf-btn">Ler PDF de instalacao<input type="file" id="ass-pdf-input" accept=".pdf" style="display:none" onchange="window.assLerPDF(this)"></label>
        <span id="aspdf-status" class="aspdf-status"></span>
      </div>
    </div>
    <div class="asex">
      <div class="asex-lbl">Exemplos rápidos</div>
      <div class="aschips">
        <button class="aschip" onclick="window.assChip(this)">cozinha superiores e inferiores</button>
        <button class="aschip" onclick="window.assChip(this)">cozinha só inferiores</button>
        <button class="aschip" onclick="window.assChip(this)">forno encastre módulo 60</button>
        <button class="aschip" onclick="window.assChip(this)">push open</button>
        <button class="aschip" onclick="window.assChip(this)">régua 80</button>
        <button class="aschip" onclick="window.assChip(this)">tampo silestone</button>
        <button class="aschip" onclick="window.assChip(this)">exaustor oculto</button>
        <button class="aschip" onclick="window.assChip(this)">lava-louça preta 1 cuba</button>
      </div>
    </div>
    <div class="ashist" id="ass-hist" style="display:none">
      <div class="ashist-lbl">Pesquisas anteriores</div>
      <div id="ass-hist-lista"></div>
    </div>
  </div>
  <div class="asdir" id="ass-dir">
    <div class="asempty" id="ass-empty">
      <div class="asempty-ico">🔍</div>
      <div class="asempty-tit">Lista de materiais</div>
      <div class="asempty-txt">Descreve o projeto e a lista aparece aqui, pronta para adicionar ao orçamento.</div>
    </div>
    <div id="ass-resultado" style="display:none"></div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════
// ENVIAR
// ════════════════════════════════════════════════
async function enviar(texto) {
  if (AS.loading || !texto.trim()) return;
  AS.loading = true;
  setBtnLoad(true);

  const c = ctx(texto);
  const { out: artLocal, refs: refsLocal } = listaLocal(c);

  document.getElementById('ass-empty').style.display = 'none';
  const res = document.getElementById('ass-resultado');
  res.style.display = '';
  res.innerHTML = `<div class="asload"><div class="asdot"></div><div class="asdot"></div><div class="asdot"></div></div>`;

  AS.historico.push({ role:'user', content:texto });
  renderHist();

  try {
    const r = await fetch(GROQ_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`},
      body:JSON.stringify({
        model:GROQ_MODEL, max_tokens:1200, temperature:0.15,
        messages:[{role:'system',content:prompt()},...AS.historico],
      }),
    });
    const data = await r.json();
    const raw  = data.choices?.[0]?.message?.content || '';
    AS.historico.push({role:'assistant',content:raw});

    let parsed;
    try {
      // Tentar parse directo
      let clean = raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
      // Se não começa com { procurar o primeiro {
      if (!clean.startsWith('{')) {
        const idx = clean.indexOf('{');
        if (idx >= 0) clean = clean.slice(idx);
      }
      // Garantir que termina no último }
      const last = clean.lastIndexOf('}');
      if (last >= 0) clean = clean.slice(0, last + 1);
      parsed = JSON.parse(clean);
    } catch(err) {
      console.error('Parse erro:', err, '\nRaw:', raw.substring(0, 300));
      throw new Error('Resposta inválida da IA');
    }

    // Filtrar e fazer merge
    const artIA = filtrar(parsed.artigos||[], c);
    const merged = [...artLocal];
    const mRefs  = new Set(refsLocal);
    artIA.forEach(a => { if(a.ref && !mRefs.has(a.ref)){merged.push(a);mRefs.add(a.ref);} });

    // Alertas
    const alertas = [...(parsed.alertas||[])];
    ALERTAS_CTX.forEach(al => {
      if(al.r.test(texto) && !alertas.some(a=>a.texto===al.txt))
        alertas.push({nivel:al.nivel,texto:al.txt});
    });

    AS.resultados = merged;
    renderRes({artigos:merged, alertas, em_falta:parsed.em_falta||[], resumo:parsed.resumo||texto});
  } catch(e) {
    res.innerHTML=`<div class="asres"><div class="aserro">⚠️ Erro ao contactar o Assistente.<br><span style="font-size:10px;opacity:.5">${e.message}</span></div></div>`;
  } finally {
    AS.loading=false; setBtnLoad(false);
    const inp=document.getElementById('ass-input');
    if(inp){inp.value='';inp.focus();}
  }
}

function renderRes({artigos,alertas,em_falta,resumo}) {
  const base = artigos.filter(a=>a.grupo==='base');
  const cond = artigos.filter(a=>a.grupo==='condicional');
  const look = artigos.filter(a=>a.grupo==='lookup');
  const pesq = artigos.filter(a=>a.fonte==='pesquisar');
  let h = `<div class="asres">
    <div class="asres-topo">
      <div class="asres-resumo">${resumo}</div>
      <div class="asres-count">${artigos.length} artigo${artigos.length!==1?'s':''}</div>
    </div>`;
  if(alertas.length){
    h+=`<div class="asalertas">`;
    alertas.forEach(a=>{h+=`<div class="asalerta asalerta-${a.nivel}"><span>${a.nivel==='critico'?'🚨':'⚡'}</span><span>${a.texto}</span></div>`;});
    h+=`</div>`;
  }
  if(em_falta?.length){
    h+=`<div class="asfalta"><div class="asfalta-tit">Por definir</div>${em_falta.map(f=>`<div class="asfalta-item">${f}</div>`).join('')}</div>`;
  }
  if(look.length) h+=rGrupo('🔍 Resultado da pesquisa',look);
  if(base.length) h+=rGrupo('📋 Lista Base',base);
  if(cond.length) h+=rGrupo('⚙️ Adicionado pelo projeto',cond);
  if(pesq.length) h+=rGrupo('🌐 Pesquisar em leroymerlin.pt',pesq,true);
  if(artigos.length){
    h+=`<div class="asacoes">
      <button class="asacao" onclick="window.assAdicionarTodos()">+ Adicionar todos ao Orçamento</button>
      <button class="asacao asacao-sec" onclick="window.assCopiarRefs()">⎘ Copiar Referências</button>
    </div>`;
  }
  h+=`</div>`;
  document.getElementById('ass-resultado').innerHTML=h;
}

function rGrupo(titulo,arts,isPesq=false){
  return `<div class="asgrupo">
    <div class="asgrupo-hdr">${titulo}<span class="asgrupo-n">${arts.length}</span></div>
    ${arts.map(a=>rArt(a,isPesq)).join('')}
  </div>`;
}

function rArt(a,isPesq=false){
  if(isPesq) return `<div class="asart asart-pesq">
    <div class="asart-info"><div class="asart-nome">${a.nome}</div></div>
    <a href="https://www.leroymerlin.pt/pesquisa/${encodeURIComponent(a.nome)}" target="_blank" rel="noopener" class="aslink">Pesquisar ↗</a>
  </div>`;
  const ok=AS.orcRefs.has(a.ref);
  return `<div class="asart" data-ref="${a.ref}">
    <div class="asart-info">
      <div class="asart-nome">${a.nome}</div>
      <div class="asart-tags">
        <span class="asart-ref" onclick="window.copiarTexto('${a.ref}',this)" title="Copiar">${a.ref}</span>
        ${a.familia?`<span class="asart-fam">${a.familia}</span>`:''}
        ${a.preco?`<span class="asart-preco">${Number(a.preco).toLocaleString('pt-PT',{minimumFractionDigits:2})} €</span>`:''}
      </div>
      ${a.quando?`<div class="asart-quando">${a.quando}</div>`:''}
    </div>
    <button class="asadd ${ok?'ok':''}"
      onclick="window.assToggleOrc('${a.ref}','${(a.nome||'').replace(/'/g,"\\'")}','${a.familia||''}',${a.preco||0})"
      title="${ok?'Remover':'Adicionar'} do orçamento">${ok?'✓':'+'}</button>
  </div>`;
}

function renderHist(){
  const bl=document.getElementById('ass-hist');
  const li=document.getElementById('ass-hist-lista');
  if(!bl||!li)return;
  const msgs=AS.historico.filter(m=>m.role==='user');
  if(msgs.length<=1){bl.style.display='none';return;}
  bl.style.display='';
  li.innerHTML=msgs.slice(0,-1).reverse().slice(0,5).map(m=>
    `<button class="ashist-item" onclick="window.assRepetir('${m.content.replace(/'/g,"\\'")}')">
      ${m.content.substring(0,60)}${m.content.length>60?'…':''}
    </button>`).join('');
}

function setBtnLoad(on){
  const b=document.getElementById('ass-btn'),t=document.getElementById('ass-btn-txt');
  if(!b||!t)return;b.disabled=on;t.textContent=on?'A gerar…':'Gerar Lista';
}

// ════════════════════════════════════════════════
// API PÚBLICA
// ════════════════════════════════════════════════
window.assistenteInit=assistenteInit;
window.assEnviar=()=>{const i=document.getElementById('ass-input');if(i)enviar(i.value);};
window.assChip=btn=>{const i=document.getElementById('ass-input');if(i){i.value=btn.textContent.trim();i.focus();}};
window.assRepetir=t=>{const i=document.getElementById('ass-input');if(i){i.value=t;i.focus();}};

window.assToggleOrc=function(ref,nome,familia,preco){
  if(AS.orcRefs.has(ref)){
    AS.orcRefs.delete(ref);
    if(window._wkST?.matOrc)window._wkST.matOrc=window._wkST.matOrc.filter(x=>x.ref!==ref);
    window.wkToast?.('× Removido do orçamento');
  }else{
    AS.orcRefs.add(ref);
    if(!window._wkST)window._wkST={};
    if(!window._wkST.matOrc)window._wkST.matOrc=[];
    if(!window._wkST.matOrc.some(x=>x.ref===ref))
      window._wkST.matOrc.push({ref,nome,familia,preco,unid:'un',qty:1});
    window.wkToast?.('✓ Adicionado ao orçamento');
  }
  const btn=document.querySelector(`.asart[data-ref="${ref}"] .asadd`);
  if(btn){btn.textContent=AS.orcRefs.has(ref)?'✓':'+';btn.classList.toggle('ok',AS.orcRefs.has(ref));}
  window.matAtualizarBadge?.();
};

window.assAdicionarTodos=function(){
  let n=0;
  AS.resultados.forEach(a=>{
    if(a.fonte!=='pesquisar'&&!AS.orcRefs.has(a.ref)){window.assToggleOrc(a.ref,a.nome,a.familia,a.preco);n++;}
  });
  if(n)window.wkToast?.(`✓ ${n} artigos adicionados ao orçamento`);
};

window.assLerPDF=async function(input){
  const file=input.files[0];
  if(!file)return;
  const status=document.getElementById('aspdf-status');
  status.textContent='A ler PDF...';
  status.className='aspdf-status';
  try{
    // Carregar pdf.js se necessario
    if(!window.pdfjsLib){
      await new Promise((res,rej)=>{
        const s=document.createElement('script');
        s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        s.onload=res; s.onerror=rej;
        document.head.appendChild(s);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    // Ler ficheiro
    const buf=await file.arrayBuffer();
    const pdf=await window.pdfjsLib.getDocument({data:buf}).promise;
    let txt='';
    for(let i=1;i<=pdf.numPages;i++){
      const pg=await pdf.getPage(i);
      const ct=await pg.getTextContent();
      txt+=ct.items.map(x=>x.str).join(' ')+'\n';
    }
    // Filtrar secao de materiais
    const m=txt.match(/Material a Adquirir[\s\S]{0,6000}?(?=Notas Finais|Total Ili|$)/i);
    const textoMat=(m?m[0]:txt).substring(0,3000);

    status.textContent='A identificar materiais...';
    AS.loading=true; setBtnLoad(true);
    document.getElementById('ass-empty').style.display='none';
    const res=document.getElementById('ass-resultado');
    res.style.display='';
    res.innerHTML='<div class="asload"><div class="asdot"></div><div class="asdot"></div><div class="asdot"></div></div>';

    const resp=await fetch(GROQ_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ_KEY},
      body:JSON.stringify({
        model:GROQ_MODEL, max_tokens:4000, temperature:0.1,
        messages:[
          {role:'system',content:promptPDF()},
          {role:'user',content:'Lista de materiais do PDF:\n\n'+textoMat},
        ],
      }),
    });
    const data=await resp.json();
    const raw=data.choices?.[0]?.message?.content||'';
    let parsed;
    try{
      let clean=raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
      if(!clean.startsWith('{'))clean=clean.slice(clean.indexOf('{'));
      // Tentar parse directo
      try{ parsed=JSON.parse(clean); }
      catch{
        // JSON cortado — tentar fechar manualmente
        const lastBrace=clean.lastIndexOf('}');
        if(lastBrace>=0){
          let attempt=clean.slice(0,lastBrace+1);
          // Fechar arrays e objecto se necessario
          const opens=(attempt.match(/\[/g)||[]).length-(attempt.match(/\]/g)||[]).length;
          const objs=(attempt.match(/\{/g)||[]).length-(attempt.match(/\}/g)||[]).length;
          attempt+=']'.repeat(Math.max(0,opens))+'}'.repeat(Math.max(0,objs));
          parsed=JSON.parse(attempt);
        } else { throw new Error('sem JSON'); }
      }
    }catch(e){throw new Error('Resposta invalida da IA: '+e.message);}

    AS.resultados=parsed.artigos||[];
    const naoEnc=parsed.nao_encontrados||[];
    renderRes({
      artigos:parsed.artigos||[],
      alertas:naoEnc.length?[{nivel:'atencao',texto:'Sem correspondencia: '+naoEnc.join(', ')}]:[],
      em_falta:[],
      resumo:parsed.resumo||('PDF: '+file.name),
    });
    status.textContent='PDF lido com sucesso';
    status.className='aspdf-status ok';
    input.value='';
  }catch(e){
    status.textContent='Erro: '+e.message;
    status.className='aspdf-status err';
    console.error('PDF erro:',e);
  }finally{
    AS.loading=false; setBtnLoad(false);
  }
};

window.assCopiarRefs=function(){
  const ls=AS.resultados.filter(a=>a.fonte!=='pesquisar').map(a=>`${a.ref}\t${a.nome}`);
  if(!ls.length)return;
  navigator.clipboard.writeText(ls.join('\n')).then(()=>window.wkToast?.('✓ Referências copiadas'));
};
