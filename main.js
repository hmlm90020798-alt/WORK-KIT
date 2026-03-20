// ════════════════════════════════════════════════
// main.js · Work Kit · Hélder Melo
// ════════════════════════════════════════════════

import { tampoInit, switchTampoTab, TAMPOS_DB, ANIGRACO, TRANSPORTE } from './tampos.js';
import { initializeApp }                                from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, getDocs,
         collection, deleteDoc }                        from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword,
         signOut, onAuthStateChanged }                  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ── Firebase config (mesmo projecto que Projetos LM) ─────────────
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

// ── Collections ───────────────────────────────────────────────────
const COL_BIB = collection(_db, 'wk_biblioteca');
const COL_CHK = collection(_db, 'wk_checklists');

// ════════════════════════════════════════════════
// BASE DE DADOS — MAPA DE MATERIAIS
// ════════════════════════════════════════════════
const MAPA_DADOS = {
  essenciais: [
    { grupo:'Fixações', cor:'#C4612A', artigos:[
      { ref:'82231846', nome:'250 Parafusos Standers PO PZ Cromado 3.5×30', notas:'', url:'https://www.leroymerlin.pt/pesquisa/82231846' },
      { ref:'82231844', nome:'300 Parafusos Standers PO PZ Cromado 3.5×16', notas:'', url:'https://www.leroymerlin.pt/pesquisa/82231844' },
      { ref:'19945982', nome:'10 Buchas Duopower 10×50mm com Parafuso', notas:'', url:'https://www.leroymerlin.pt/pesquisa/19945982' },
      { ref:'15872003', nome:'Batente Adesivo 10×3mm 25 Unidades', notas:'', url:'https://www.leroymerlin.pt/pesquisa/15872003' },
      { ref:'956630',   nome:'Calha de Suspensão Recortável Aço Hettich 200×2.8×6cm', notas:'', url:'https://www.leroymerlin.pt/pesquisa/956630' },
      { ref:'13619774', nome:'Esquadro de Grande Ângulo 100×40×40mm', notas:'', url:'https://www.leroymerlin.pt/pesquisa/13619774' },
      { ref:'82347327', nome:'20 Esquadros Angulares Aço Reforçado 30×30×15×2mm', notas:'', url:'https://www.leroymerlin.pt/pesquisa/82347327' },
    ]},
    { grupo:'Dobradiças', cor:'#2A5A9A', artigos:[
      { ref:'80129468', nome:'Dobradiça Cozinha Standers 110º c/ Amortecedor 2un', notas:'', url:'https://www.leroymerlin.pt/pesquisa/80129468' },
      { ref:'80129470', nome:'Dobradiça Standers 110º Vitrines c/ Amortecedor 2un', notas:'', url:'https://www.leroymerlin.pt/pesquisa/80129470' },
      { ref:'80129469', nome:'Dobradiça Standers Invisível 165º c/ Amortecedor 2un', notas:'', url:'https://www.leroymerlin.pt/pesquisa/80129469' },
    ]},
    { grupo:'Acabamentos', cor:'#6B4FC4', artigos:[
      { ref:'956665',   nome:'Tapa Parafusos Furações de Portas Branco Tokyo', notas:'', url:'https://www.leroymerlin.pt/pesquisa/956665' },
      { ref:'956671',   nome:'Tapa Parafusos Furações de Portas Preto Tokyo', notas:'', url:'https://www.leroymerlin.pt/pesquisa/956671' },
      { ref:'947981',   nome:'Tapa Furos 120 Unidades Cinza', notas:'', url:'https://www.leroymerlin.pt/pesquisa/947981' },
      { ref:'917079',   nome:'Rodapé Móvel Cozinha Delinia ID 100×13cm Branco', notas:'', url:'https://www.leroymerlin.pt/pesquisa/917079' },
    ]},
    { grupo:'Selantes', cor:'#3A7A44', artigos:[
      { ref:'16679355', nome:'Silicone Branco Stop Mofo Express Ceys', notas:'', url:'https://www.leroymerlin.pt/pesquisa/16679355' },
      { ref:'16353246', nome:'Silicone Coz/WC 280ml Transparente Stop Mofo Ceys', notas:'', url:'https://www.leroymerlin.pt/pesquisa/16353246' },
      { ref:'82551890', nome:'Silicone Universal Acético 280ml Preto Soudal', notas:'', url:'https://www.leroymerlin.pt/pesquisa/82551890' },
      { ref:'14871185', nome:'Cola e Veda 290ml Transparente T-Rex Cristal', notas:'', url:'https://www.leroymerlin.pt/pesquisa/14871185' },
    ]},
    { grupo:'Tubagens', cor:'#8B6914', artigos:[
      { ref:'88561208', nome:'Tubo Extensível c/ Válvula Roscada 32×40mm 1¼', notas:'', url:'https://www.leroymerlin.pt/pesquisa/88561208' },
      { ref:'84299215', nome:'Tubo Extensível Alumínio Flex D120 C35 a 200cm', notas:'', url:'https://www.leroymerlin.pt/pesquisa/84299215' },
    ]},
  ],
};

// ════════════════════════════════════════════════
// BASE DE DADOS — ELETRODOMÉSTICOS
// ════════════════════════════════════════════════
const ELETRO_DADOS = [
  { tipo:'Placa', icon:'🔥', cor:'#C4612A', artigos:[
    { ref:'93603006', nome:'Placa Indução 4 zonas 60cm preto TEKA IDY 641Y BK', marca:'TEKA', preco:289, caract:'4 zonas · Touch MonoSlider · Detetor recipiente', notas:'', url:'https://www.leroymerlin.pt/pesquisa/93603006' },
    { ref:'93418142', nome:'Placa Indução 4 zonas 7kW 59×52cm preto CATA IB 6324', marca:'CATA', preco:225, caract:'4 zonas · 7kW · Booster · Conectividade exaustor', notas:'', url:'https://www.leroymerlin.pt/pesquisa/93418142' },
    { ref:'95573263', nome:'Placa Indução 4 zonas 7200W AEG TN64IA0BIB', marca:'AEG', preco:399, caract:'4 zonas PowerBoost · Hob2Hood · Função Pausa · Sem moldura', notas:'★ Melhor escolha', url:'https://www.leroymerlin.pt/pesquisa/95573263' },
    { ref:'90215362', nome:'Placa Indução 4 zonas 60cm Haier HAISJ64MC', marca:'HAIER', preco:389, caract:'4 zonas · Vidro Facetado · WiFi + Bluetooth', notas:'', url:'https://www.leroymerlin.pt/pesquisa/90215362' },
  ]},
  { tipo:'Forno', icon:'🍳', cor:'#8B4513', artigos:[
    { ref:'93470587', nome:'Forno Multifunções 71L 60cm Bosch HBA514S3', marca:'BOSCH', preco:379, caract:'71L · 7 modos · Limpeza aqualítica · A+', notas:'', url:'https://www.leroymerlin.pt/pesquisa/93470587' },
    { ref:'84780952', nome:'Forno Pirolítico 71L 60cm TEKA HCB 6535P', marca:'TEKA', preco:399, caract:'Pirólise + Hydroclean AUTO · 8 funções · Guia telescópica', notas:'★ Melhor escolha', url:'https://www.leroymerlin.pt/pesquisa/84780952' },
    { ref:'95568582', nome:'Forno Multifunções 72L Pirolítico AEG OU5PB40SM', marca:'AEG', preco:450, caract:'72L · Pirólise · A++ · Inox Infinity', notas:'', url:'https://www.leroymerlin.pt/pesquisa/95568582' },
  ]},
  { tipo:'Exaustor', icon:'💨', cor:'#2A5A9A', artigos:[
    { ref:'82051805', nome:'Exaustor Oculto 49.2cm 820m³/h inox CATA GH45X', marca:'CATA', preco:170, caract:'Motor 240W · 4 níveis + turbo · LED · Touch', notas:'★ Melhor escolha', url:'https://www.leroymerlin.pt/pesquisa/82051805' },
    { ref:'82401306', nome:'Exaustor Oculto 54cm 660m³/h inox AEG DGE5661HM', marca:'AEG', preco:330, caract:'4 velocidades · 700m³/h · LED', notas:'', url:'https://www.leroymerlin.pt/pesquisa/82401306' },
    { ref:'96393346', nome:'Exaustor Parede 1027m³/h 90cm CATA BETA PRO 9000 X', marca:'CATA', preco:319, caract:'3 níveis · 1027m³/h · Motor A1000 · LED · Classe A', notas:'', url:'https://www.leroymerlin.pt/pesquisa/96393346' },
  ]},
  { tipo:'Máquina Loiça', icon:'🍽', cor:'#3A7A44', artigos:[
    { ref:'96188516', nome:'Máquina Loiça Encastrar 13 conjuntos TEKA DFI 46720', marca:'TEKA', preco:399, caract:'13 conjuntos · SmartSensor · Meia carga · AquaStop', notas:'', url:'https://www.leroymerlin.pt/pesquisa/96188516' },
    { ref:'91306627', nome:'Máquina Loiça Encastrar 16 conjuntos Haier XI 6B0S3FSB', marca:'HAIER', preco:699, caract:'16 conjuntos · Motor BLDC · WiFi · Abertura Auto · 40dB', notas:'★ Motor BLDC', url:'https://www.leroymerlin.pt/pesquisa/91306627' },
  ]},
  { tipo:'Microondas', icon:'📡', cor:'#6B4FC4', artigos:[
    { ref:'91200482', nome:'Micro-ondas Encastrar 60cm 20L Electrolux KMSD203MMX', marca:'ELECTROLUX', preco:259, caract:'20L · 700W · 1000W grill · Prato 24.5cm · Inox', notas:'', url:'https://www.leroymerlin.pt/pesquisa/91200482' },
    { ref:'94544983', nome:'Micro-ondas TEKA MSEG 620 BK 20L integração total', marca:'TEKA', preco:229, caract:'Integração total · Grill 1000W · Interior inox', notas:'', url:'https://www.leroymerlin.pt/pesquisa/94544983' },
  ]},
  { tipo:'Frigorífico', icon:'❄️', cor:'#2A7A9A', artigos:[
    { ref:'91201602', nome:'Frigorífico Combinado Encastrar 177cm Electrolux KND5FE18S', marca:'ELECTROLUX', preco:799, caract:'177cm · Low Frost · Compressor inverter · LED · Classe E', notas:'', url:'https://www.leroymerlin.pt/pesquisa/91201602' },
    { ref:'97267020', nome:'Frigorífico Combinado Encastrar 177cm Haier HBQW5518E', marca:'HAIER', preco:809, caract:'177cm · No Frost · LED · Classe E', notas:'', url:'https://www.leroymerlin.pt/pesquisa/97267020' },
  ]},
  { tipo:'Máquina Roupa', icon:'👕', cor:'#7A3A9A', artigos:[
    { ref:'97267322', nome:'Máquina Lavar Roupa Encastrar 9kg Haier BHA6S69M6DB9J', marca:'HAIER', preco:689, caract:'9kg · 1600RPM · Classe A-30% · 16 programas c/ Vapor', notas:'', url:'https://www.leroymerlin.pt/pesquisa/97267322' },
  ]},
];

const ELETRO_ESTRELAS = ['Placa','Forno','Exaustor','Máquina Loiça'];

// ════════════════════════════════════════════════
// BASE DE DADOS — MÃO DE OBRA
// ════════════════════════════════════════════════
const MO_DADOS = [
  { cat:'Mobiliário', icon:'🪑', cor:'#C4612A', servicos:[
    { cod:'49010601', nome:'Instalação Móvel de Cozinha', pvp:15, unid:'un', desc:'Montagem e nivelação de cada módulo de cozinha.', nota:'' },
    { cod:'49010602', nome:'Instalação Cozinha Completa até 5m', pvp:350, unid:'un', desc:'Montagem completa de cozinha até 5 metros lineares.', nota:'⚠️ Inclui nivelação e fixação' },
    { cod:'49010603', nome:'Metro Linear adicional (>5m)', pvp:70, unid:'ml', desc:'Por cada metro linear adicional acima dos 5m.', nota:'' },
    { cod:'49010611', nome:'Remoção de Cozinha Existente', pvp:150, unid:'un', desc:'Desmontagem e remoção da cozinha existente.', nota:'⚠️ Não inclui transporte de resíduos' },
  ]},
  { cat:'Tampos', icon:'🪨', cor:'#2A7A74', servicos:[
    { cod:'49010600', nome:'Instalação Tampo de Cozinha', pvp:80, unid:'un', desc:'Instalação de tampo, incluindo cortes e acabamentos.', nota:'' },
    { cod:'49013108', nome:'Orçamento Tampo', pvp:50, unid:'un', desc:'Visita para orçamentação de tampo.', nota:'💡 Valor descontado se aceitar' },
  ]},
  { cat:'Lava-Loiça', icon:'🚰', cor:'#2A5A9A', servicos:[
    { cod:'49010607', nome:'Instalação Lava-Loiça', pvp:40, unid:'un', desc:'Instalação e vedação de lava-loiça e sifão.', nota:'' },
    { cod:'49010608', nome:'Instalação Torneira de Cozinha', pvp:20, unid:'un', desc:'Instalação/fixação de torneira e ligação de bichas.', nota:'⚠️ Cliente fecha água' },
    { cod:'49010615', nome:'Remoção Torneira / Lava-Loiça', pvp:20, unid:'un', desc:'Desinstalação do equipamento existente.', nota:'' },
  ]},
  { cat:'Eletrodomésticos', icon:'⚡', cor:'#6B4FC4', servicos:[
    { cod:'49010604', nome:'Instalação Eletrodoméstico Elétrico', pvp:49, unid:'un', desc:'Instalação e ligação elétrica até 1,5m da caixa.', nota:'⚠️ Circuito dedicado para indução/forno' },
    { cod:'49010634', nome:'Troca Placa Gás por Elétrica', pvp:120, unid:'un', desc:'Remoção placa gás + tamponamento + instalação elétrica.', nota:'' },
    { cod:'49010606', nome:'Instalação Exaustor de Ilha', pvp:99, unid:'un', desc:'Fixação de exaustor em ilha com tubo e ligação elétrica.', nota:'' },
    { cod:'49010614', nome:'Remoção Eletrodoméstico Elétrico', pvp:25, unid:'un', desc:'Desinstalação do eletrodoméstico existente.', nota:'' },
  ]},
  { cat:'Roupeiro', icon:'🚪', cor:'#2A5A9A', servicos:[
    { cod:'49011254', nome:'Instalação Roupeiro a Medida', pvp:59, unid:'ml', desc:'Montagem ao metro linear com fixação a parede.', nota:'⚠️ Não inclui remate' },
    { cod:'49013125', nome:'Instalação Roupeiro em Kit', pvp:49, unid:'ml', desc:'Montagem kit com gavetas, portas e acessórios.', nota:'' },
    { cod:'49011262', nome:'Instalação Roupeiro (módulo)', pvp:25, unid:'un', desc:'Montagem de módulo com portas de dobradiça.', nota:'' },
  ]},
  { cat:'Circuitos', icon:'🔌', cor:'#6B4FC4', servicos:[
    { cod:'49015265', nome:'Circuito Elétrico 16A até 25m', pvp:299, unid:'un', desc:'Para equipamentos até 3kW.', nota:'💡 Placas vitrocerâmicas' },
    { cod:'49015268', nome:'Circuito Elétrico 32A até 25m', pvp:369, unid:'un', desc:'Para placas de indução e fornos elétricos até 7kW.', nota:'💡 Não inclui tomada 32A' },
  ]},
  { cat:'Visitas', icon:'📋', cor:'#8B6914', servicos:[
    { cod:'49010648', nome:'Visita de Orçamento — Mobiliário', pvp:30, unid:'un', desc:'Deslocação até 30km + levantamento + orçamento.', nota:'💡 Descontado no orçamento final' },
    { cod:'49013434', nome:'Verificação de Medidas Cozinhas', pvp:20, unid:'un', desc:'Levantamento para projecto no simulador LM.', nota:'' },
  ]},
];

// ════════════════════════════════════════════════
// BASE DE DADOS — TAMPOS
// ════════════════════════════════════════════════
const TAMPOS_DADOS = [
  // SILESTONE
  { id:'b100', cat:'Silestone', grupo:'P0', nome:'Linen Cream',     fornecedor:'ANIGRACO', c1:202.72, pvp:356, unit:'m²' },
  { id:'b101', cat:'Silestone', grupo:'P0', nome:'Motion Grey',     fornecedor:'ANIGRACO', c1:202.72, pvp:356, unit:'m²' },
  { id:'b102', cat:'Silestone', grupo:'P0', nome:'Miami White',     fornecedor:'ANIGRACO', c1:202.72, pvp:356, unit:'m²' },
  { id:'b103', cat:'Silestone', grupo:'P0', nome:'Negro Tebas',     fornecedor:'ANIGRACO', c1:202.72, pvp:356, unit:'m²' },
  { id:'b110', cat:'Silestone', grupo:'G1', nome:'Blanco Maple 14', fornecedor:'ANIGRACO', c1:230.64, pvp:405, unit:'m²' },
  { id:'b111', cat:'Silestone', grupo:'G1', nome:'White Storm 14',  fornecedor:'ANIGRACO', c1:230.64, pvp:405, unit:'m²' },
  { id:'b118', cat:'Silestone', grupo:'G2', nome:'Miami White 17',  fornecedor:'ANIGRACO', c1:267.84, pvp:471, unit:'m²' },
  { id:'b119', cat:'Silestone', grupo:'G2', nome:'Persian White',   fornecedor:'ANIGRACO', c1:267.84, pvp:471, unit:'m²' },
  { id:'b128', cat:'Silestone', grupo:'G3', nome:'Miami Vena',      fornecedor:'ANIGRACO', c1:296.72, pvp:521, unit:'m²' },
  { id:'b134', cat:'Silestone', grupo:'G4', nome:'Blanco Zeus',     fornecedor:'ANIGRACO', c1:406.00, pvp:713, unit:'m²' },
  { id:'b147', cat:'Silestone', grupo:'G6', nome:'Et Calacatta Gold',fornecedor:'ANIGRACO', c1:542.72, pvp:954, unit:'m²' },
  // DEKTON
  { id:'c001', cat:'Dekton', grupo:'Entry', nome:'Kira',    fornecedor:'COSENTINO', c1:260, pvp:480, unit:'m²' },
  { id:'c002', cat:'Dekton', grupo:'Entry', nome:'Zenith',  fornecedor:'COSENTINO', c1:260, pvp:480, unit:'m²' },
  { id:'c003', cat:'Dekton', grupo:'Mid',   nome:'Sirius',  fornecedor:'COSENTINO', c1:310, pvp:580, unit:'m²' },
  { id:'c004', cat:'Dekton', grupo:'Mid',   nome:'Portium', fornecedor:'COSENTINO', c1:310, pvp:580, unit:'m²' },
  // GRANITO
  { id:'d001', cat:'Granito', grupo:'Nacional', nome:'Cinza Mondariz', fornecedor:'LOCAL', c1:120, pvp:220, unit:'m²' },
  { id:'d002', cat:'Granito', grupo:'Nacional', nome:'Rosa Porriño',   fornecedor:'LOCAL', c1:130, pvp:240, unit:'m²' },
  { id:'d003', cat:'Granito', grupo:'Importado',nome:'Preto Absoluto', fornecedor:'LOCAL', c1:180, pvp:320, unit:'m²' },
  // COMPAC
  { id:'e001', cat:'Compac', grupo:'Standard', nome:'Absolute White', fornecedor:'COMPAC', c1:190, pvp:350, unit:'m²' },
  { id:'e002', cat:'Compac', grupo:'Standard', nome:'Iconic White',   fornecedor:'COMPAC', c1:190, pvp:350, unit:'m²' },
  // LAMINADO
  { id:'f001', cat:'Laminado', grupo:'Standard', nome:'Branco Brilho 4100×600mm',  fornecedor:'LM', c1:45, pvp:89, unit:'un' },
  { id:'f002', cat:'Laminado', grupo:'Standard', nome:'Cinza Antracite 4100×600mm',fornecedor:'LM', c1:45, pvp:89, unit:'un' },
  { id:'f003', cat:'Laminado', grupo:'Premium',  nome:'Marmoreado Branco 4100×600mm',fornecedor:'LM', c1:65, pvp:119, unit:'un' },
];

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
        { nome: 'Remoção banheira (se aplicável)', cod: '49010611', tipo: 'maoobra', obrigatorio: false },
        { nome: 'Instalação base duche / resguardo', cod: '49010604', tipo: 'maoobra', obrigatorio: false },
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
// ════════════════════════════════════════════════
let ST = {
  tab: 'assistente',
  // Biblioteca
  bibItems: [],        // carregados do Firebase
  bibCatFiltro: 'todos',
  bibEditId: null,
  // Checklists
  chkListas: [],       // carregadas do Firebase
  // Eletros orçamento
  eletroOrc: [],
  eletroFiltro: '',
  // MO orçamento
  moOrc: [],
  moCat: 'Mobiliário',
  // Tampos
  tampoCat: '',
  tampoTab: 'catalogo',
  // Cliente
  cliRespostas: {},
  cliFase: 1,
  cliHist: [],
  cliHistAberto: false,
};

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
  window.wkToast = toast;
  const t = document.getElementById('wk-toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), dur);
}

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
  // Inicializar módulos ao activar tab
  if (tabId === 'biblioteca') bibRender();
  if (tabId === 'checklists') chkRender();
  if (tabId === 'tampos') {
    tampoInit();
  }
  if (tabId === 'eletros') eletroRender();
  if (tabId === 'maoobra') moRender();
  if (tabId === 'cliente') cliRender();
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
// FIREBASE — BIBLIOTECA
// ════════════════════════════════════════════════
async function bibCarregar() {
  try {
    const snap = await getDocs(COL_BIB);
    ST.bibItems = [];
    snap.forEach(d => ST.bibItems.push({ id: d.id, ...d.data() }));
    ST.bibItems.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  } catch (e) { console.error('Erro ao carregar biblioteca:', e); }
}

async function bibSalvar(item) {
  try {
    await setDoc(doc(_db, 'wk_biblioteca', item.id), item);
  } catch (e) { console.error('Erro ao guardar:', e); toast('⚠️ Erro ao guardar'); }
}

async function bibApagar(id) {
  try {
    await deleteDoc(doc(_db, 'wk_biblioteca', id));
    ST.bibItems = ST.bibItems.filter(i => i.id !== id);
    bibRender();
    toast('✓ Item apagado');
  } catch (e) { toast('⚠️ Erro ao apagar'); }
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
  // Render chips de categoria
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
      (i.ref || '').toLowerCase().includes(pesquisa) ||
      (i.notas || '').toLowerCase().includes(pesquisa) ||
      (i.tags || '').toLowerCase().includes(pesquisa);
    return matchCat && matchPes;
  });

  const info = document.getElementById('bib-info');
  if (info) info.textContent = `${filtrados.length} item${filtrados.length !== 1 ? 's' : ''}`;

  const grid = document.getElementById('bib-grid');
  if (!grid) return;

  if (!filtrados.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">📚</div>
      <div class="empty-titulo">Biblioteca vazia</div>
      <div class="empty-sub">Adiciona materiais, códigos e processos com o botão "+ Novo Item"</div>
    </div>`;
    return;
  }

  grid.innerHTML = filtrados.map(item => {
    const catInfo = BIB_CATS.find(c => c.id === item.cat) || BIB_CATS[0];
    const tags = (item.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    return `
      <div class="bib-card">
        <div class="bib-card-top">
          <div class="bib-card-nome">${item.nome || '—'}</div>
          <span class="bib-card-cat">${catInfo.icon} ${catInfo.nome}</span>
        </div>
        ${item.ref ? `<div class="bib-card-ref">Ref: ${item.ref}
          <button class="bib-card-btn" style="margin-left:4px" onclick="window.copiarTexto('${item.ref}',this)">⎘</button>
          ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener" class="bib-card-btn" style="text-decoration:none">↗ Ver</a>` : ''}
        </div>` : ''}
        ${item.notas ? `<div class="bib-card-notas">${item.notas}</div>` : ''}
        ${tags.length ? `<div class="bib-card-tags">${tags.map(t => `<span class="bib-tag">${t}</span>`).join('')}</div>` : ''}
        <div class="bib-card-footer">
          <span class="bib-card-preco">${item.preco > 0 ? fmt(item.preco) + ' / ' + (item.unidade || 'un') : ''}</span>
          <button class="bib-card-btn" onclick="window.bibEditar('${item.id}')">✏️</button>
          <button class="bib-card-btn" style="color:#ffb3a0" onclick="window.bibApagarConfirm('${item.id}')">🗑</button>
        </div>
      </div>`;
  }).join('');
}

window.bibFiltrarCat = function(cat) {
  ST.bibCatFiltro = cat;
  bibRender();
};

window.bibAbrirNovo = function() {
  ST.bibEditId = null;
  ['bib-f-nome','bib-f-ref','bib-f-preco','bib-f-tags','bib-f-url','bib-f-notas'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('bib-f-cat').value = 'material';
  document.getElementById('bib-f-unidade').value = 'un';
  document.getElementById('modal-bib-titulo').textContent = 'Novo Item';
  document.getElementById('modal-bib').classList.add('open');
  setTimeout(() => document.getElementById('bib-f-nome')?.focus(), 100);
};

window.bibEditar = function(id) {
  const item = ST.bibItems.find(i => i.id === id);
  if (!item) return;
  ST.bibEditId = id;
  document.getElementById('bib-f-nome').value    = item.nome || '';
  document.getElementById('bib-f-cat').value     = item.cat || 'material';
  document.getElementById('bib-f-ref').value     = item.ref || '';
  document.getElementById('bib-f-preco').value   = item.preco || '';
  document.getElementById('bib-f-unidade').value = item.unidade || 'un';
  document.getElementById('bib-f-tags').value    = item.tags || '';
  document.getElementById('bib-f-url').value     = item.url || '';
  document.getElementById('bib-f-notas').value   = item.notas || '';
  document.getElementById('modal-bib-titulo').textContent = 'Editar Item';
  document.getElementById('modal-bib').classList.add('open');
};

window.bibFecharModal = function() {
  document.getElementById('modal-bib').classList.remove('open');
};

window.bibGuardar = async function() {
  const nome = document.getElementById('bib-f-nome').value.trim();
  if (!nome) { toast('⚠️ Preenche o nome'); return; }
  const item = {
    id:       ST.bibEditId || gerarId(),
    nome,
    cat:      document.getElementById('bib-f-cat').value,
    ref:      document.getElementById('bib-f-ref').value.trim(),
    preco:    parseFloat(document.getElementById('bib-f-preco').value) || 0,
    unidade:  document.getElementById('bib-f-unidade').value,
    tags:     document.getElementById('bib-f-tags').value.trim(),
    url:      document.getElementById('bib-f-url').value.trim(),
    notas:    document.getElementById('bib-f-notas').value.trim(),
    ts:       Date.now(),
  };
  await bibSalvar(item);
  const idx = ST.bibItems.findIndex(i => i.id === item.id);
  if (idx >= 0) ST.bibItems[idx] = item; else ST.bibItems.unshift(item);
  bibFecharModal();
  bibRender();
  toast('✓ Item guardado na biblioteca');
};

window.bibApagarConfirm = function(id) {
  const item = ST.bibItems.find(i => i.id === id);
  if (!item) return;
  if (confirm(`Apagar "${item.nome}"?`)) bibApagar(id);
};

// ════════════════════════════════════════════════
// FIREBASE — CHECKLISTS
// ════════════════════════════════════════════════
async function chkCarregar() {
  try {
    const snap = await getDocs(COL_CHK);
    ST.chkListas = [];
    snap.forEach(d => ST.chkListas.push({ id: d.id, ...d.data() }));
  } catch (e) { console.error(e); }
}

async function chkSalvar(lista) {
  try { await setDoc(doc(_db, 'wk_checklists', lista.id), lista); }
  catch (e) { toast('⚠️ Erro ao guardar checklist'); }
}

function chkRender() {
  const ct = document.getElementById('chk-content'); if (!ct) return;

  // Checklists built-in por tipo de obra + custom
  const predefinidas = [
    { id:'chk-cozinha',    icon:'🍳', nome:'Cozinha — Visita Inicial',
      itens: ASS_TEMPLATES.cozinha.checklist_cliente.map((t, i) => ({ id: i, texto: t, checked: false })) },
    { id:'chk-wc',         icon:'🚿', nome:'Casa de Banho — Visita Inicial',
      itens: ASS_TEMPLATES.casadebanho.checklist_cliente.map((t, i) => ({ id: i, texto: t, checked: false })) },
    { id:'chk-roupeiro',   icon:'🚪', nome:'Roupeiro — Visita Inicial',
      itens: ASS_TEMPLATES.roupeiro.checklist_cliente.map((t, i) => ({ id: i, texto: t, checked: false })) },
    { id:'chk-entrega',    icon:'🚚', nome:'Entrega de Materiais — Verificação',
      itens: [
        { id:0, texto:'Verificar referências da encomenda', checked:false },
        { id:1, texto:'Confirmar quantidades vs guia de remessa', checked:false },
        { id:2, texto:'Inspecionar embalagens (danos visíveis)', checked:false },
        { id:3, texto:'Confirmar local de descarga com cliente', checked:false },
        { id:4, texto:'Registar ocorrências antes de assinar', checked:false },
        { id:5, texto:'Fotografar materiais no local', checked:false },
      ]},
    { id:'chk-instalacao', icon:'🔨', nome:'Instalação — Pré-obra',
      itens: [
        { id:0, texto:'Confirmar pedido 49014163 submetido', checked:false },
        { id:1, texto:'Verificar todos os materiais no local', checked:false },
        { id:2, texto:'Confirmar data e hora com instalador', checked:false },
        { id:3, texto:'Cliente informado do horário', checked:false },
        { id:4, texto:'Acesso à habitação confirmado', checked:false },
        { id:5, texto:'Circuito eléctrico disponível (se necessário)', checked:false },
        { id:6, texto:'Água fechada (se necessário)', checked:false },
      ]},
  ];

  // Combinar predefinidas com custom do Firebase
  const todas = [...predefinidas, ...ST.chkListas.filter(l => !predefinidas.find(p => p.id === l.id))];

  ct.innerHTML = `
    <div class="chk-grid">
      ${todas.map(lista => {
        const total = lista.itens.length;
        const feitos = lista.itens.filter(i => i.checked).length;
        const pct = total > 0 ? Math.round((feitos / total) * 100) : 0;
        return `
          <div class="chk-card">
            <div class="chk-card-header" onclick="window.chkToggle('${lista.id}')">
              <span class="chk-card-icon">${lista.icon || '✅'}</span>
              <span class="chk-card-nome">${lista.nome}</span>
              <span class="chk-card-prog">${feitos}/${total}</span>
            </div>
            <div class="chk-prog-bar"><div class="chk-prog-fill" style="width:${pct}%"></div></div>
            <div class="chk-itens" id="chk-itens-${lista.id}">
              ${lista.itens.map(item => `
                <div class="chk-item ${item.checked ? 'checked' : ''}"
                     onclick="window.chkToggleItem('${lista.id}',${item.id})">
                  <div class="chk-item-check">${item.checked ? '✓' : ''}</div>
                  <span class="chk-item-texto">${item.texto}</span>
                </div>`).join('')}
              <div style="display:flex;gap:6px;padding:6px 8px 2px">
                <button class="bib-card-btn" onclick="event.stopPropagation();window.chkReset('${lista.id}')">↺ Reiniciar</button>
              </div>
            </div>
          </div>`;
      }).join('')}
      <!-- Card para nova checklist -->
      <div class="chk-card" style="cursor:pointer;border-style:dashed;opacity:.7" onclick="window.chkAbrirNovo()">
        <div class="chk-card-header">
          <span class="chk-card-icon">➕</span>
          <span class="chk-card-nome">Nova Checklist</span>
        </div>
        <div style="padding:12px;font-size:11px;color:rgba(255,255,255,.5);text-align:center">Cria uma checklist personalizada</div>
      </div>
    </div>`;

  // Guardar estado das predefinidas no localStorage
  predefinidas.forEach(l => {
    const saved = localStorage.getItem('wk_chk_' + l.id);
    if (saved) {
      try {
        const checks = JSON.parse(saved);
        l.itens.forEach(item => { item.checked = checks[item.id] || false; });
      } catch(_) {}
    }
  });
}

window.chkToggle = function(listaId) {
  const el = document.getElementById('chk-itens-' + listaId);
  if (el) el.style.display = el.style.display === 'none' ? '' : 'none';
};

window.chkToggleItem = function(listaId, itemId) {
  // Para predefinidas, usar localStorage
  const saved = localStorage.getItem('wk_chk_' + listaId);
  let checks = {};
  try { checks = JSON.parse(saved || '{}'); } catch(_) {}
  checks[itemId] = !checks[itemId];
  localStorage.setItem('wk_chk_' + listaId, JSON.stringify(checks));
  chkRender();
  // Reaplicar estados guardados
  const predefinidas = document.querySelectorAll('[id^="chk-itens-"]');
  predefinidas.forEach(el => {
    const lid = el.id.replace('chk-itens-','');
    const s = localStorage.getItem('wk_chk_' + lid);
    if (s) {
      try {
        const c = JSON.parse(s);
        el.querySelectorAll('.chk-item').forEach((item, idx) => {
          if (c[idx]) { item.classList.add('checked'); item.querySelector('.chk-item-check').textContent = '✓'; }
        });
      } catch(_) {}
    }
  });
};

window.chkReset = function(listaId) {
  if (confirm('Reiniciar checklist?')) {
    localStorage.removeItem('wk_chk_' + listaId);
    chkRender();
    toast('✓ Checklist reiniciada');
  }
};

window.chkAbrirNovo = function() {
  const nome = prompt('Nome da nova checklist:');
  if (!nome) return;
  const lista = { id: gerarId(), icon: '📋', nome, itens: [] };
  ST.chkListas.push(lista);
  chkSalvar(lista);
  chkRender();
};

// ════════════════════════════════════════════════
// TAMPOS — delegado para tampos.js
// ════════════════════════════════════════════════
// Funções expostas via window.* em tampos.js

// ════════════════════════════════════════════════
// ELETRODOMÉSTICOS
// ════════════════════════════════════════════════
window.eletroRender = function() {
  // Chips de tipo
  const chips = document.getElementById('eletro-chips');
  if (chips) {
    chips.innerHTML = [{ tipo:'Todos', icon:'⚡', cor:'' }, ...ELETRO_DADOS.map(t => ({ tipo:t.tipo, icon:t.icon, cor:t.cor }))]
      .map(t => {
        const isEstrela = ELETRO_ESTRELAS.includes(t.tipo);
        const ativo = ST.eletroFiltro === t.tipo || (ST.eletroFiltro === '' && t.tipo === 'Todos');
        return `<button class="chip ${ativo ? 'active' : ''}" onclick="window.eletroFiltrar('${t.tipo === 'Todos' ? '' : t.tipo}')">
          ${t.icon} ${t.tipo}${isEstrela ? ' ⭐' : ''}
        </button>`;
      }).join('');
  }

  const pesquisa = (document.getElementById('eletro-pesquisa')?.value || '').toLowerCase().trim();
  let artigos = [];
  ELETRO_DADOS.forEach(tipo => {
    if (ST.eletroFiltro && tipo.tipo !== ST.eletroFiltro) return;
    tipo.artigos.forEach(a => artigos.push({ ...a, _tipo: tipo.tipo, _cor: tipo.cor, _icon: tipo.icon }));
  });

  if (pesquisa) artigos = artigos.filter(a =>
    a.nome.toLowerCase().includes(pesquisa) ||
    (a.marca || '').toLowerCase().includes(pesquisa) ||
    (a.ref || '').toLowerCase().includes(pesquisa)
  );

  const grid = document.getElementById('eletro-grid'); if (!grid) return;
  if (!artigos.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">⚡</div><div class="empty-titulo">Sem resultados</div></div>`;
    return;
  }

  grid.innerHTML = artigos.map(a => {
    const noOrc = ST.eletroOrc.some(x => x.ref === a.ref);
    return `
      <div class="eletro-card">
        ${a.notas?.includes('★') ? `<span class="eletro-estrela">⭐</span>` : ''}
        <div class="eletro-card-top">
          <div class="eletro-card-nome">${a.nome}</div>
          <span class="eletro-card-marca">${a.marca || ''}</span>
        </div>
        <div class="eletro-card-ref">Ref: ${a.ref}
          <button class="bib-card-btn" style="margin-left:4px" onclick="window.copiarTexto('${a.ref}',this)">⎘</button>
          ${a.url ? `<a href="${a.url}" target="_blank" class="bib-card-btn" style="text-decoration:none">↗</a>` : ''}
        </div>
        ${a.caract ? `<div class="eletro-card-caract">${a.caract}</div>` : ''}
        <div class="eletro-card-footer">
          <span class="eletro-card-preco">${fmt(a.preco)}</span>
          <div class="eletro-card-btns">
            <button class="eletro-card-btn add ${noOrc ? 'active' : ''}"
                    onclick="window.eletroToggleOrc('${a.ref}')">
              ${noOrc ? '✓ Adicionado' : '+ Orçamento'}
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
};

window.eletroFiltrar = function(tipo) {
  ST.eletroFiltro = tipo;
  eletroRender();
};

window.eletroToggleOrc = function(ref) {
  const idx = ST.eletroOrc.findIndex(x => x.ref === ref);
  if (idx >= 0) {
    ST.eletroOrc.splice(idx, 1);
  } else {
    let artigo = null;
    ELETRO_DADOS.forEach(t => { const a = t.artigos.find(x => x.ref === ref); if (a) artigo = { ...a, _tipo: t.tipo }; });
    if (artigo) ST.eletroOrc.push({ ...artigo, qty: 1 });
  }
  eletroRender();
  eletroRenderPainel();
  const badge = document.getElementById('badge-eletro');
  if (badge) { badge.textContent = ST.eletroOrc.length; badge.style.display = ST.eletroOrc.length ? 'inline-block' : 'none'; }
};

window.eletroTogglePainel = function() {
  const p = document.getElementById('eletro-painel');
  if (!p) return;
  const aberto = p.style.display !== 'none';
  p.style.display = aberto ? 'none' : 'flex';
  if (!aberto) eletroRenderPainel();
};

function eletroRenderPainel() {
  const ct = document.getElementById('eletro-painel-body'); if (!ct) return;
  if (!ST.eletroOrc.length) {
    ct.innerHTML = `<div style="text-align:center;padding:30px;color:rgba(255,255,255,.5);font-size:12px">Sem eletros no orçamento</div>`;
    return;
  }
  const total = ST.eletroOrc.reduce((s, a) => s + (a.preco || 0) * (a.qty || 1), 0);

  // Alertas de essenciais em falta
  const tiposNoOrc = new Set(ST.eletroOrc.map(a => a._tipo));
  const emFalta = ELETRO_ESTRELAS.filter(t => !tiposNoOrc.has(t));

  ct.innerHTML = `
    ${emFalta.length ? `<div class="ass-alerta" style="margin-bottom:12px">
      <strong>⭐ Essenciais em falta:</strong> ${emFalta.join(', ')}
    </div>` : `<div style="background:rgba(58,122,68,.2);border:1px solid rgba(58,122,68,.4);border-radius:8px;padding:8px 12px;font-size:11px;color:#c8f0c8;margin-bottom:12px">✅ Todos os essenciais incluídos</div>`}
    ${ST.eletroOrc.map(a => `
      <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.1)">
        <div style="flex:1;font-size:12px;color:rgba(255,255,255,.85)">${a.nome}</div>
        <div style="font-family:var(--mono);font-size:12px;font-weight:700;color:#fff">${fmt(a.preco)}</div>
        <button class="bib-card-btn" onclick="window.eletroToggleOrc('${a.ref}')">×</button>
      </div>`).join('')}
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.2);display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:11px;color:rgba(255,255,255,.6)">Total Eletros</span>
      <span style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--peach-light)">${fmt(total)}</span>
    </div>
    <button class="btn-sec" style="width:100%;margin-top:10px" onclick="window.copiarTexto('Total Eletros: ${fmt(total)}', this)">📋 Copiar total</button>`;
}

// ════════════════════════════════════════════════
// MÃO DE OBRA
// ════════════════════════════════════════════════
window.moRender = function() {
  // Cats bar
  const cats = document.getElementById('mo-cats'); if (!cats) return;
  cats.innerHTML = MO_DADOS.map(c => `
    <button class="mo-cat-btn ${ST.moCat === c.cat ? 'active' : ''}"
            onclick="window.moSelectCat('${c.cat}')">
      ${c.icon} ${c.cat}
      <span style="font-size:10px;opacity:.6">${c.servicos.length}</span>
    </button>`).join('');

  // Lista de serviços
  const lista = document.getElementById('mo-lista'); if (!lista) return;
  const catData = MO_DADOS.find(c => c.cat === ST.moCat);
  if (!catData) return;

  lista.innerHTML = catData.servicos.map(s => {
    const noOrc = ST.moOrc.some(x => x.cod === s.cod);
    return `
      <div class="mo-item">
        <span class="mo-item-cod">${s.cod}
          <button class="mo-item-add" style="margin-left:4px;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);color:rgba(255,255,255,.7)"
                  onclick="event.stopPropagation();window.copiarTexto('${s.cod}',this)">⎘</button>
        </span>
        <div style="flex:1;min-width:0">
          <div class="mo-item-nome">${s.nome}</div>
          ${s.nota ? `<div class="mo-item-warn">${s.nota}</div>` : ''}
          <div style="font-size:10px;color:rgba(255,255,255,.5);margin-top:2px">${s.desc}</div>
        </div>
        <span class="mo-item-pvp">${s.pvp > 0 ? fmt(s.pvp) : 'A definir'}</span>
        <span class="mo-item-unid">${s.unid !== 'livre' ? '/ ' + s.unid : ''}</span>
        <button class="mo-item-add ${noOrc ? '' : ''}"
                onclick="window.moToggleOrc('${s.cod}')">
          ${noOrc ? '✓' : '+'}
        </button>
      </div>`;
  }).join('');
};

window.moSelectCat = function(cat) {
  ST.moCat = cat;
  moRender();
};

window.moToggleOrc = function(cod) {
  const idx = ST.moOrc.findIndex(x => x.cod === cod);
  if (idx >= 0) {
    ST.moOrc.splice(idx, 1);
  } else {
    let servico = null;
    MO_DADOS.forEach(c => { const s = c.servicos.find(x => x.cod === cod); if (s) servico = { ...s, _cat: c.cat, qty: 1 }; });
    if (servico) ST.moOrc.push(servico);
  }
  moRender();
  moRenderPainel();
  const badge = document.getElementById('badge-mo');
  if (badge) { badge.textContent = ST.moOrc.length; badge.style.display = ST.moOrc.length ? 'inline-block' : 'none'; }
};

window.moTogglePainel = function() {
  const p = document.getElementById('mo-painel'); if (!p) return;
  const aberto = p.style.display !== 'none';
  p.style.display = aberto ? 'none' : 'flex';
  if (!aberto) moRenderPainel();
};

function moRenderPainel() {
  const ct = document.getElementById('mo-painel-body'); if (!ct) return;
  if (!ST.moOrc.length) {
    ct.innerHTML = `<div style="text-align:center;padding:30px;color:rgba(255,255,255,.5);font-size:12px">Sem serviços no orçamento</div>`;
    return;
  }
  const total = ST.moOrc.reduce((s, a) => s + (a.pvp > 0 ? a.pvp * (a.qty || 1) : 0), 0);

  ct.innerHTML = `
    ${ST.moOrc.map(s => `
      <div style="display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.1)">
        <div style="flex:1">
          <div style="font-size:11px;color:rgba(255,255,255,.85)">${s.nome}</div>
          <div style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.4)">${s.cod}</div>
        </div>
        <div style="font-family:var(--mono);font-size:12px;font-weight:700;color:#fff;white-space:nowrap">${s.pvp > 0 ? fmt(s.pvp) : 'A definir'}</div>
        <button class="bib-card-btn" onclick="window.moToggleOrc('${s.cod}')">×</button>
      </div>`).join('')}
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.2);display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:11px;color:rgba(255,255,255,.6)">Total Mão de Obra</span>
      <span style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--peach-light)">${fmt(total)}</span>
    </div>
    <button class="btn-sec" style="width:100%;margin-top:10px" onclick="window.moCopiarOrcamento()">📋 Copiar orçamento</button>`;
}

window.moCopiarOrcamento = function() {
  let txt = 'ORÇAMENTO — MÃO DE OBRA\n' + '─'.repeat(40) + '\n';
  ST.moOrc.forEach(s => {
    txt += `${s.cod}  ${s.nome}  ${s.pvp > 0 ? fmt(s.pvp) : 'A definir'}\n`;
  });
  const total = ST.moOrc.reduce((s, a) => s + (a.pvp > 0 ? a.pvp : 0), 0);
  txt += '─'.repeat(40) + '\nTOTAL: ' + fmt(total);
  navigator.clipboard.writeText(txt).then(() => toast('✓ Orçamento copiado'));
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

  // Detectar tipo de projeto
  let template = null;
  for (const [key, tmpl] of Object.entries(ASS_TEMPLATES)) {
    if (tmpl.keywords.some(k => input.includes(k))) {
      template = tmpl; break;
    }
  }

  const res = document.getElementById('ass-resultado');
  const tituloEl = document.getElementById('ass-res-titulo');
  const bodyEl   = document.getElementById('ass-res-body');

  if (!template) {
    // Resposta genérica
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

  // Verificar flags especiais no texto
  const temInstalacao = input.includes('instalação') || input.includes('instalacao') || input.includes('montar') || input.includes('montagem');
  const temEletros    = input.includes('eletro') || input.includes('placa') || input.includes('forno') || input.includes('exaustor');
  const temTampo      = input.includes('tampo') || input.includes('silestone') || input.includes('pedra') || input.includes('granito');

  let html = '';

  // Secções de materiais e mão de obra
  template.secoes.forEach(sec => {
    const itens = sec.items.filter(item => {
      if (item.obrigatorio) return true;
      if (sec.titulo.includes('Eletro') && !temEletros) return false;
      if (sec.titulo.includes('Tampo') && !temTampo) return false;
      if (sec.titulo.includes('Lava') && !temInstalacao) return false;
      if (sec.titulo.includes('Mão de Obra') && !temInstalacao) return false;
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

  // Checklist de cliente
  html += `<div class="ass-secao">
    <div class="ass-secao-titulo">✅ Checklist de Cliente</div>
    ${template.checklist_cliente.map((item, i) => `
      <div class="ass-item"><span>□</span><span>${item}</span></div>`).join('')}
  </div>`;

  bodyEl.innerHTML = html;
};

window.assGerTemplate = function(tipo) {
  const input = document.getElementById('ass-input');
  if (input) input.value = tipo;
  assGerar();
};

window.assCopiar = function() {
  const body = document.getElementById('ass-res-body');
  if (!body) return;
  const texto = body.innerText;
  navigator.clipboard.writeText(texto).then(() => toast('✓ Lista copiada'));
};

window.assExportarProjeto = function() {
  // Abrir app de Projetos LM numa nova tab
  const url = 'https://hmlm90020798-alt.github.io/projetos-lm/';
  window.open(url, '_blank');
  toast('→ A abrir Projetos LM');
};

// ════════════════════════════════════════════════
// QUALIFICAÇÃO DE CLIENTE
// ════════════════════════════════════════════════
window.cliRender = function() {
  const ct = document.getElementById('cli-main'); if (!ct) return;

  if (ST.cliFase === 3) { cliRenderResultado(); return; }

  const perguntas = CLI_PERGUNTAS.filter(p => p.momento === ST.cliFase);
  const respondidas = perguntas.filter(p => ST.cliRespostas[p.id] !== undefined).length;
  const podeAvancar = respondidas === perguntas.length;
  const totalRespondidas = Object.keys(ST.cliRespostas).length;
  const progresso = Math.round((totalRespondidas / CLI_PERGUNTAS.length) * 100);

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
      color:${podeAvancar ? 'var(--peach-pale)' : 'rgba(255,255,255,.3)'};">
      ${ST.cliFase === 1 ? '→ Avançar para Momento 2' : '✓ Ver Resultado'}
    </button>`;
};

window.cliResponder = function(id, pts, idx) {
  ST.cliRespostas[id]          = pts;
  ST.cliRespostas[id + '_idx'] = idx;
  cliRender();
};

window.cliAvancar = function() {
  const perguntas = CLI_PERGUNTAS.filter(p => p.momento === ST.cliFase);
  const podeAvancar = perguntas.every(p => ST.cliRespostas[p.id] !== undefined);
  if (!podeAvancar) return;
  ST.cliFase = ST.cliFase === 1 ? 2 : 3;
  cliRender();
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
  cliRender();
};

window.cliGuardar = function(perfil, pct, cor) {
  const nome = document.getElementById('cli-nome')?.value?.trim() || 'Cliente';
  ST.cliHist.unshift({
    id: Date.now(), data: new Date().toLocaleDateString('pt-PT'),
    hora: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    nome, perfil, pct, cor,
  });
  toast('✓ Avaliação guardada');
  if (ST.cliHistAberto) cliRenderHistorico();
};

window.cliHistorico = function() {
  ST.cliHistAberto = !ST.cliHistAberto;
  const p = document.getElementById('cli-hist-painel');
  if (!p) return;
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
    <div style="padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.15);font-size:12px;font-weight:700;color:rgba(255,255,255,.7)">
      📊 Histórico — ${ST.cliHist.length} avaliações
    </div>
    ${ST.cliHist.map(e => `
      <div style="padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.1)">
        <div style="font-size:10px;color:rgba(255,255,255,.4);font-family:var(--mono)">${e.data} · ${e.hora}</div>
        <div style="font-size:12px;font-weight:600;color:rgba(255,255,255,.85);margin:3px 0">${e.nome}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:4px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${e.pct}%;background:${e.cor};border-radius:99px"></div>
          </div>
          <span style="font-family:var(--mono);font-size:12px;font-weight:700;color:${e.cor}">${e.pct}%</span>
        </div>
        <div style="font-size:11px;color:${e.cor};margin-top:3px">${e.perfil}</div>
      </div>`).join('')}`;
}

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
(async function init() {
  // Loading overlay
  const ov = document.createElement('div');
  ov.id = 'loading-overlay';
  ov.innerHTML = `
    <div style="width:36px;height:36px;border:3px solid rgba(255,190,152,.2);border-top-color:var(--peach-dark);border-radius:50%;animation:spin .8s linear infinite"></div>
    <div style="font-family:var(--sans);font-size:11px;font-weight:600;color:rgba(122,46,10,.7);letter-spacing:2px;text-transform:uppercase">Work Kit</div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
  document.body.appendChild(ov);

  onAuthStateChanged(_auth, async user => {
    if (user) {
      // Carregar dados do Firebase
      await Promise.all([bibCarregar(), chkCarregar()]);
      setView('app');
      // Activar tab inicial
      document.querySelector('[data-tab="assistente"]')?.classList.add('active');
      ov.remove();
    } else {
      ov.remove();
      setView('login');
    }
  });
})();
