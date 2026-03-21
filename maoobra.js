// ════════════════════════════════════════════════
// maoobra.js · Work Kit · Hélder Melo
// Mão de Obra — dados, render, orçamento
// Extraído de main.js para módulo independente
// ════════════════════════════════════════════════

import { doc, setDoc, getDoc }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── Firebase injectado via window._wkDb (main.js) ────────────────
function getDb() { return window._wkDb || null; }

// ── Referência ao estado global (injectado pelo main.js) ─────────
function getST() { return window._wkST; }
function fmt(v) {
  const n = parseFloat(v);
  return isNaN(n) ? '—' : n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
function toast(msg) { window.wkToast?.(msg); }
function wkConfirm(msg, cb) { window.wkConfirm?.(msg, cb) ?? (confirm(msg) && cb()); }

// ════════════════════════════════════════════════
// CÓDIGOS GLOBAIS OBRIGATÓRIOS
// ════════════════════════════════════════════════
export const MO_GLOBAIS = [
  { cod: '49014163', nome: 'Pedido de Produto para Instalação', pvp: 0,  nota: '⚠️ OBRIGATÓRIO em todos os pedidos com instalação' },
  { cod: '49013101', nome: 'Deslocação Instalações',            pvp: 30, nota: '⚠️ Adicionar sempre que aplicável' },
  { cod: '49013106', nome: 'Deslocação Manutenção e Reparação', pvp: 30, nota: '⚠️ Para pedidos de manutenção' },
  { cod: '49013102', nome: 'Km Extra Instalações',              pvp: 1,  nota: '💡 1€/km após os 30km (só ida)' },
  { cod: '49013394', nome: 'Km Extra Orçamento',                pvp: 1,  nota: '💡 1€/km após os 30km (só ida)' },
  { cod: '49013103', nome: 'Km Extra Manutenções',              pvp: 1,  nota: '💡 1€/km após os 30km (só ida)' },
];

// ════════════════════════════════════════════════
// BASE DE DADOS — MÃO DE OBRA
// Fonte: Excel LM 2026 — todas as secções
// ════════════════════════════════════════════════
export const MO_SECCOES = {

  // ══════════════════════════════════════════════
  // 08 — COZINHAS E ROUPEIROS
  // ══════════════════════════════════════════════
  'Cozinhas e Roupeiros': [
    {
      cat: 'Remodelação de Cozinha', icon: '🔧', cor: '#8B4513',
      servicos: [
        { cod:'49010617', nome:'Remoção ECO Cozinha (mín. 3ml)',                  pvp:43,    unid:'un', nota:'',                                               inclui:'Desmontagem e remoção de cozinha antiga ao metro linear com entrega a ponto de reciclagem.',                                                                                exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49010618', nome:'Desinstalação Simples Cozinha (ml)',               pvp:25,    unid:'un', nota:'',                                               inclui:'Desinstalação de todos os móveis e equipamentos da cozinha.',                                                                                                                exclui:'Remoção dos móveis e equipamentos de casa do cliente.\nTratamento dos resíduos em ponto de reciclagem adequado.', condicoes:'' },
        { cod:'49010619', nome:'Orçamento Remodelação Cozinhas',                   pvp:30,    unid:'un', nota:'💡 Descontado no orçamento final',                inclui:'Revisão detalhada das medidas existentes na cozinha.\nLevantamento de planta da cozinha.\nPreenchimento e desenho da planta da cozinha para equipa técnica de loja executar o projeto.',                                                                    exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49013434', nome:'Verificação de Medidas Cozinhas',                  pvp:20,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Levantamento de medidas para execução de projeto em simulador nas lojas Leroy Merlin.',                                                                                   exclui:'Deslocação até 30km entre a loja e local de retificação de medidas (acresce 30€).', condicoes:'' },
        { cod:'49014059', nome:'Ativação IVA Taxa Reduzida — Remodelação',         pvp:0.01,  unid:'un', nota:'⚠️ Aplicar em obras de remodelação',             inclui:'Tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                                                                exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49012770', nome:'Trabalho Complementar Remodelação Cozinha',        pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49011142', nome:'Trabalho Complementar Impermeabilização Interior', pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
    {
      cat: 'Mobiliário de Cozinha', icon: '🪑', cor: '#C4612A',
      servicos: [
        { cod:'49010601', nome:'Instalação Módulos Cozinha (mín. 1ml)',            pvp:59,    unid:'ml', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Montagem e instalação de todos os móveis/módulos de portas ao metro linear.\nInstalação dos rodapés.\nInstalação e afinação das portas e puxadores.\nInstalação das prateleiras.\nInstalação de até 4 eletrodomésticos LM integrados no projeto de cozinhas.',  exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTrabalhos de canalização, eletricidade ou construção civil adicionais.\nDeslocação até 30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010611', nome:'Instalação Extraível de Coluna ou de Canto',       pvp:39,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Montagem e instalação de extraíveis de coluna ou de canto.\nAfinamento de rolamentos.\nTeste de funcionamento.',                                                             exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.\nDeslocação até 30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010610', nome:'Instalação Extraível Standard',                    pvp:20,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Montagem e instalação de extraíveis simples.\nAfinamento de rolamentos.\nTeste de funcionamento.',                                                                            exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.\nDeslocação até 30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010609', nome:'Instalação Gaveta / Gaveta Interior / Gavetão',    pvp:5,     unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Montagem e instalação de gaveta, gaveta interior ou gavetão.\nAfinamento de rolamentos.\nTeste de funcionamento.',                                                            exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.\nDeslocação até 30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010612', nome:'Adaptação de Módulos de Cozinha',                  pvp:40,    unid:'un', nota:'',                                               inclui:'Modificação estrutural para, por exemplo, encaixar o móvel no espaço disponível ou para encastrar eletrodoméstico.',                                                   exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49010613', nome:'Cortes Simples',                                   pvp:5,     unid:'un', nota:'',                                               inclui:'Medição precisa do local para o corte.\nUtilização de ferramentas adequadas para o corte preciso.\nCorte controlado de forma a preservar a integridade estrutural do móvel, por exemplo para instalação de lava-loiça ou torneira.',                        exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49010660', nome:'Instalação Acessório Cozinha',                     pvp:20,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Montagem e fixação de acessórios de cozinha.',                                                                                                                               exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.\nDeslocação até 30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010648', nome:'Visita Orçamento — Mobiliário de Cozinha',         pvp:30,    unid:'un', nota:'💡 Descontado no orçamento final',                inclui:'Orçamentação de materiais e trabalhos necessários para a correta instalação.\nDeslocação até 30km entre a loja e local de instalação.',                                    exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.\nRecolha e transporte do equipamento removido para ponto de reciclagem.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010649', nome:'Trabalho Complementar — Mobiliário de Cozinha',    pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
    {
      cat: 'Tampos', icon: '🪨', cor: '#2A7A74',
      servicos: [
        { cod:'49010602', nome:'Instalação Tampo Madeira Maciça',                  pvp:90,    unid:'un', nota:'⚠️ Inclui 2ª deslocação pós-tratamento',         inclui:'Instalação de uma unidade de tampo de madeira maciça.\nTratamento e envernizamento dos tampos de madeira maciça (inclui 2ª deslocação pós-tratamento).\nAplicação de vedante com silicone para isolamento.',                                                       exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.\nRecolha e transporte do equipamento removido para ponto de reciclagem.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010603', nome:'Instalação Tampo Laminado',                        pvp:60,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação de uma unidade de tampo laminado.\nAplicação de vedante com silicone para isolamento.',                                                                           exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.\nRecolha e transporte do equipamento removido para ponto de reciclagem.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49013081', nome:'Orçamento Tampo de Cozinha',                       pvp:30,    unid:'un', nota:'💡 Descontado no orçamento final',                inclui:'Orçamentação de materiais e trabalhos necessários para a correta instalação.\nDeslocação até 30km entre a loja e local de instalação.',                                    exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49013082', nome:'Trabalho Complementar Tampo de Cozinha',           pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
    {
      cat: 'Lava-Louça', icon: '🚰', cor: '#2A5A9A',
      servicos: [
        { cod:'49010607', nome:'Instalação Lava-Loiça',                            pvp:40,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação de lava-loiça e sifão/tubagem de evacuação de água.\nIsolamento e vedação de lava-loiça.',                                                                      exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.\nRecolha e transporte do equipamento removido para ponto de reciclagem.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010608', nome:'Instalação Torneira de Cozinha',                   pvp:20,    unid:'un', nota:'⚠️ Cliente deve fechar a água',                  inclui:'Instalação/fixação de torneira de bancada ou parede.\nLigação de bichas de água.\nNecessário o fecho da água na habitação por parte do cliente.',                          exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTrabalhos de canalização, eletricidade ou construção civil adicionais.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010615', nome:'Remoção Torneira / Lava-Loiça',                    pvp:20,    unid:'un', nota:'',                                               inclui:'Desinstalação da torneira ou lava-loiça existente.',                                                                                                                        exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
    {
      cat: 'Eletrodomésticos', icon: '⚡', cor: '#8B6914',
      servicos: [
        { cod:'49010604', nome:'Instalação Eletrodoméstico Elétrico',              pvp:30,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação e ligação elétrica de eletrodoméstico elétrico (forno, microondas, frigorifico, maq. lavar loiça, etc.).',                                                     exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTrabalhos de eletricidade.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010605', nome:'Instalação Placa de Indução / Vitrocerâmica',      pvp:45,    unid:'un', nota:'⚠️ Circuito dedicado obrigatório',               inclui:'Instalação e ligação elétrica de placa de indução ou vitrocerâmica.\nVedação com silicone.',                                                                               exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nCircuito elétrico dedicado.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010606', nome:'Instalação Exaustor de Ilha',                      pvp:60,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação e fixação de exaustor de ilha.\nLigação elétrica.',                                                                                                               exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTrabalhos de construção civil.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49015268', nome:'Circuito 32A — Placa Indução / Forno',             pvp:120,   unid:'un', nota:'⚠️ Obrigatório para placas de indução',          inclui:'Instalação de circuito elétrico dedicado 32A para placa de indução ou forno.',                                                                                             exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
    {
      cat: 'Roupeiros', icon: '👔', cor: '#6B4FC4',
      servicos: [
        { cod:'49010620', nome:'Instalação Roupeiro Embutido (ml)',                pvp:45,    unid:'ml', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Montagem e instalação de roupeiro embutido ao metro linear.',                                                                                                                exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010621', nome:'Instalação Roupeiro de Portas de Correr',          pvp:55,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Montagem e instalação de roupeiro com portas de correr.\nInstalação e afinação das portas.',                                                                               exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49010650', nome:'Visita Orçamento — Roupeiros',                     pvp:30,    unid:'un', nota:'💡 Descontado no orçamento final',                inclui:'Orçamentação de materiais e trabalhos necessários.\nDeslocação até 30km entre a loja e local de instalação.',                                                              exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49010651', nome:'Trabalho Complementar — Roupeiros',                pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador.',                                                                                                           exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
  ],

  // ══════════════════════════════════════════════
  // SANITÁRIOS
  // ══════════════════════════════════════════════
  'Sanitários': [
    {
      cat: 'Casa de Banho', icon: '🚿', cor: '#2A6B7A',
      servicos: [
        { cod:'49010630', nome:'Remoção Banheira',                                 pvp:50,    unid:'un', nota:'',                                               inclui:'Desinstalação e remoção de banheira existente.',                                                                                                                            exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49010631', nome:'Instalação Banheira',                              pvp:80,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação de banheira.\nLigação de água e evacuação.',                                                                                                                  exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTrabalhos de construção civil.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49010632', nome:'Instalação Base de Duche',                         pvp:60,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação de base de duche e sifão.\nLigação de água e evacuação.',                                                                                                    exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49010633', nome:'Instalação Coluna de Duche',                       pvp:40,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação de coluna ou painel de duche.\nLigações de água.',                                                                                                            exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49010634', nome:'Instalação Sanita / Bidé',                         pvp:50,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação de sanita ou bidé.\nLigações de água e evacuação.',                                                                                                           exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49010635', nome:'Instalação Lavatório',                             pvp:40,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação de lavatório e sifão.\nLigações de água.',                                                                                                                    exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49010636', nome:'Instalação Torneira WC',                           pvp:20,    unid:'un', nota:'⚠️ Cliente deve fechar a água',                  inclui:'Instalação de torneira de WC.\nLigação de bichas.',                                                                                                                      exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49010637', nome:'Instalação Móvel WC com Lavatório',               pvp:60,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação de móvel de WC com lavatório integrado.',                                                                                                                     exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49010652', nome:'Visita Orçamento — Sanitários',                    pvp:30,    unid:'un', nota:'💡 Descontado no orçamento final',                inclui:'Orçamentação de materiais e trabalhos.',                                                                                                                                    exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49010653', nome:'Trabalho Complementar — Sanitários',               pvp:1,     unid:'un', nota:'',                                               inclui:'Trabalho complementar descrito pelo instalador.',                                                                                                                           exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
  ],

  // ══════════════════════════════════════════════
  // CARPINTARIA E CAIXILHARIA
  // ══════════════════════════════════════════════
  'Carpintaria e Caixilharia': [
    {
      cat: 'Portas e Janelas', icon: '🚪', cor: '#7A5A3A',
      servicos: [
        { cod:'49011100', nome:'Instalação Porta Interior',                        pvp:60,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação de porta interior com batente e ferragens.',                                                                                                                      exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49011101', nome:'Instalação Porta de Correr',                       pvp:70,    unid:'un', nota:'⚠️ Deslocação >30km acresce 30€',                inclui:'Instalação e afinação de porta de correr.',                                                                                                                                 exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49011102', nome:'Remoção Porta Existente',                          pvp:25,    unid:'un', nota:'',                                               inclui:'Desinstalação e remoção de porta existente.',                                                                                                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49011103', nome:'Trabalho Complementar — Carpintaria',              pvp:1,     unid:'un', nota:'',                                               inclui:'Trabalho complementar descrito pelo instalador.',                                                                                                                           exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
  ],

  // ══════════════════════════════════════════════
  // CERÂMICA
  // ══════════════════════════════════════════════
  'Cerâmica': [
    {
      cat: 'Pavimentos e Revestimentos', icon: '⬛', cor: '#5A5A6A',
      servicos: [
        { cod:'49011120', nome:'Assentamento Cerâmica Pavimento (m²)',             pvp:15.99, unid:'m²', nota:'⚠️ Mínimo 5m²',                                 inclui:'Assentamento de pavimento cerâmico.\nFejntas.',                                                                                                                          exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49011121', nome:'Assentamento Cerâmica Parede (m²)',                pvp:17.99, unid:'m²', nota:'⚠️ Mínimo 5m²',                                 inclui:'Assentamento de revestimento cerâmico em parede.\nFejntas.',                                                                                                             exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49011122', nome:'Remoção Cerâmica Existente (m²)',                  pvp:8.99,  unid:'m²', nota:'',                                               inclui:'Remoção de cerâmica existente em pavimento ou parede.',                                                                                                                     exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49011123', nome:'Orçamento para Cerâmica',                          pvp:30,    unid:'un', nota:'💡 Descontado no orçamento final',                inclui:'Orçamentação de materiais e trabalhos.\nDeslocação até 30km.',                                                                                                              exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49011124', nome:'Trabalho Complementar — Cerâmica',                 pvp:1,     unid:'un', nota:'',                                               inclui:'Trabalho complementar descrito pelo instalador.',                                                                                                                           exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
    {
      cat: 'Blocos de Vidro', icon: '🪟', cor: '#4A8A8A',
      servicos: [
        { cod:'49011145', nome:'Instalação de Bloco de Vidro (€/m²)',               pvp:21.99, unid:'m²', nota:'⚠️ Mínimo aplicável',                           inclui:'Colocação das fileiras de Bloco de vidro com aplicação de argamassa.\nFinalização das Juntas.',                                                                      exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nPreparação do local existente.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49011146', nome:'Orçamento para Instalação Bloco de Vidro',          pvp:30,    unid:'un', nota:'💡 Descontado no orçamento final',                inclui:'Orçamentação de materiais e trabalhos necessários para a correta instalação.\nDeslocação até 30km entre a loja e local de instalação.',                                    exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49011147', nome:'Trabalho Complementar Bloco de Vidro',              pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
    {
      cat: 'Pladur / Parede Divisória', icon: '🧱', cor: '#7A7A5A',
      servicos: [
        { cod:'49011178', nome:'Instalação Pladur (€/m²)',                          pvp:17.99, unid:'m²', nota:'⚠️ Mínimo 5m²',                                 inclui:'Criação de estrutura e fixação ao local.\nInstalação de Pladur à estrutura.\nInstalação mínima de 5m².',                                                             exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nPreparação do local existente.\nDeslocação >30km entre a loja e local de instalação (acresce 30€).', condicoes:'' },
        { cod:'49011179', nome:'Orçamento para Instalação Pladur',                  pvp:30,    unid:'un', nota:'💡 Descontado no orçamento final',                inclui:'Orçamentação de materiais e trabalhos necessários para a correta instalação.\nDeslocação até 30km entre a loja e local de instalação.',                                    exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49011180', nome:'Trabalho Complementar Pladur',                      pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
  ],

  // ══════════════════════════════════════════════
  // MATERIAIS DE CONSTRUÇÃO
  // ══════════════════════════════════════════════
  'Materiais de Construção': [
    {
      cat: 'Pintura Interior', icon: '🎨', cor: '#6A7A8A',
      servicos: [
        { cod:'49011160', nome:'Pintura Interior de Compartimento (m²)',            pvp:5.99,  unid:'m²', nota:'⚠️ Mínimo 20m²',                                 inclui:'Preparação ligeira da superfície.\nAplicação de 2 demãos de tinta interior.',                                                                                        exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49011161', nome:'Aplicação de Primário / Isolante',                  pvp:3.99,  unid:'m²', nota:'',                                               inclui:'Aplicação de primário ou tinta isolante.',                                                                                                                               exclui:'O produto a instalar.\nDeslocação >30km (acresce 30€).', condicoes:'' },
        { cod:'49011162', nome:'Trabalho Complementar — Pintura',                   pvp:1,     unid:'un', nota:'',                                               inclui:'Trabalho complementar descrito pelo instalador.',                                                                                                                           exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
  ],

  // ══════════════════════════════════════════════
  // 04 — REMODELAÇÃO GERAL
  // ══════════════════════════════════════════════
  'Remodelação Geral': [
    {
      cat: 'Remodelação Interior', icon: '🏗', cor: '#6A5A4A',
      servicos: [
        { cod:'49012645', nome:'Orçamento para Remodelação Interior Apartamento',   pvp:30,    unid:'un', nota:'💡 Descontado no orçamento final',                inclui:'Orçamentação de materiais e trabalhos necessários para a correta remodelação de interior apartamento que não envolve trabalhos em altura superiores a 3m.\nDeslocação até 30km entre a loja e local de instalação.', exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.\nNão inclui trabalhos de instalação de equipamentos de gás ou qualquer outros serviços que impliquem certificação obrigatória como AC, painéis fotovoltaicos, etc.', condicoes:'' },
        { cod:'49014433', nome:'Orçamento para Remodelação Interior Moradia',       pvp:30,    unid:'un', nota:'💡 Descontado no orçamento final',                inclui:'Orçamentação de materiais e trabalhos necessários para a correta remodelação de interior moradia que não envolve trabalhos em altura superiores a 3m.\nDeslocação até 30km entre a loja e local de instalação.', exclui:'O produto a instalar.\nProdutos essenciais para a instalação.\nTodo ou qualquer trabalho não mencionado nos serviços incluídos.\nNão inclui trabalhos de instalação de equipamentos de gás ou qualquer outros serviços que impliquem certificação obrigatória como AC, painéis fotovoltaicos, etc.', condicoes:'' },
        { cod:'49014059', nome:'Ativação IVA Taxa Reduzida — Remodelação',          pvp:0.01,  unid:'un', nota:'⚠️ Aplicar em obras de remodelação',             inclui:'Tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                                                                exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
    {
      cat: 'Trabalhos Complementares Remodelação', icon: '🔧', cor: '#7A6A5A',
      servicos: [
        { cod:'49013628', nome:'TC Remodelação Geral — Materiais de Construção',    pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49013629', nome:'TC Remodelação Geral — Carpintaria',                pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49013630', nome:'TC Remodelação Geral — Pavimento',                  pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49013631', nome:'TC Remodelação Geral — Cerâmica',                   pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49013633', nome:'TC Remodelação Geral — Casas de Banho',             pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49013635', nome:'TC Remodelação Geral — Cozinhas',                   pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49014102', nome:'TC Remodelação Geral — Pintura Interior',           pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49013638', nome:'TC Remodelação Geral — Iluminação',                 pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49014060', nome:'TC Remodelação Geral — Outros Trabalhos',           pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
        { cod:'49014061', nome:'TC Tratamento de Entulho e Limpeza de Obra',        pvp:1,     unid:'un', nota:'',                                               inclui:'O trabalho complementar inclui tarefas descritas pelo instalador que não estão incluídas no serviço padrão de instalação.',                                               exclui:'Todo ou qualquer trabalho não mencionado nos serviços incluídos.', condicoes:'' },
      ],
    },
  ],

};

export const MO_SECCAO_ORDEM = [
  'Cozinhas e Roupeiros',
  'Sanitários',
  'Carpintaria e Caixilharia',
  'Cerâmica',
  'Materiais de Construção',
  'Remodelação Geral',
];

// ════════════════════════════════════════════════
// PERSISTÊNCIA — FIREBASE
// Guarda/carrega orçamento MO no Firestore
// ════════════════════════════════════════════════
const MO_DOC_ID = 'wk_mo_orcamento';

export async function moCarregarOrcamento() {
  const db = getDb();
  if (!db) return;
  try {
    const snap = await getDoc(doc(db, 'wk_estado', MO_DOC_ID));
    if (snap.exists()) {
      const ST = getST();
      ST.moOrc = snap.data().orc || [];
      moAtualizarBadge();
    }
  } catch (e) { console.warn('MO: erro ao carregar orçamento', e); }
}

async function moGuardarOrcamento() {
  const db = getDb();
  if (!db) return;
  const ST = getST();
  try {
    await setDoc(doc(db, 'wk_estado', MO_DOC_ID), {
      orc: ST.moOrc,
      ts: Date.now(),
    });
  } catch (e) { console.warn('MO: erro ao guardar orçamento', e); }
}

// ════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════
function getMoDados() {
  const ST = getST();
  return MO_SECCOES[ST.moSeccao] || MO_SECCOES['Cozinhas e Roupeiros'];
}

function moAtualizarBadge() {
  const ST = getST();
  const badge = document.getElementById('badge-mo');
  if (badge) {
    badge.textContent = ST.moOrc.length;
    badge.style.display = ST.moOrc.length ? 'inline-block' : 'none';
  }
}

// ════════════════════════════════════════════════
// RENDER PRINCIPAL
// ════════════════════════════════════════════════
const ddStyle = `padding:8px 28px 8px 12px;border-radius:9px;background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.1);color:var(--t2);font-family:var(--sans);font-size:12px;
  cursor:pointer;outline:none;appearance:none;-webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,.25)'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 10px center;transition:border-color .15s;`;

export function moRender() {
  const ST = getST();
  const cats  = document.getElementById('mo-cats');
  const lista = document.getElementById('mo-lista');
  if (!cats || !lista) return;

  const existingSelect = document.getElementById('mo-seccao-select');
  const seccaoChanged  = existingSelect && existingSelect.value !== ST.moSeccao;

  if (!existingSelect || seccaoChanged) {
    cats.innerHTML = `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px">
        <select id="mo-seccao-select" onchange="window.moSelectSeccao(this.value)"
          style="${ddStyle}min-width:190px;border-color:rgba(196,97,42,.35)">
          ${MO_SECCAO_ORDEM.map(s => `<option value="${s}" ${ST.moSeccao===s?'selected':''}>${s}</option>`).join('')}
        </select>
        <select id="mo-cat-select" onchange="window.moSelectCat(this.value)"
          style="${ddStyle}min-width:180px">
          ${getMoDados().map(c => `<option value="${c.cat}" ${ST.moCat===c.cat?'selected':''}>${c.icon} ${c.cat} (${c.servicos.length})</option>`).join('')}
        </select>
        <div class="search-wrap" style="flex:1;min-width:160px;position:relative">
          <span class="search-icon">⌕</span>
          <input type="text" id="mo-pesquisa-input" class="search-input"
            placeholder="Pesquisar serviço ou código…"
            oninput="window.moPesquisar(this.value)"
            style="padding-right:28px">
          <button onclick="window.moClearPesquisa()"
            style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;
            color:var(--t4);font-size:15px;cursor:pointer;padding:2px 4px">×</button>
        </div>
      </div>`;
  } else {
    const selS = document.getElementById('mo-seccao-select');
    const selC = document.getElementById('mo-cat-select');
    if (selS) selS.value = ST.moSeccao;
    if (selC) {
      selC.innerHTML = getMoDados().map(c => `<option value="${c.cat}" ${ST.moCat===c.cat?'selected':''}>${c.icon} ${c.cat} (${c.servicos.length})</option>`).join('');
      selC.value = ST.moCat;
    }
  }

  moRenderLista();
}

function moRenderLista() {
  const ST = getST();
  const lista = document.getElementById('mo-lista'); if (!lista) return;
  const pesq  = (ST.moPesquisa || '').toLowerCase().trim();
  let servicos;

  if (pesq) {
    servicos = [];
    getMoDados().forEach(c => {
      c.servicos.forEach(s => {
        if (s.nome.toLowerCase().includes(pesq) || s.cod.includes(pesq)
          || (s.inclui||'').toLowerCase().includes(pesq)) {
          servicos.push({ ...s, _cat: c.cat, _cor: c.cor });
        }
      });
    });
  } else {
    const catData = getMoDados().find(c => c.cat === ST.moCat);
    servicos = (catData?.servicos || []).map(s => ({ ...s, _cat: catData?.cat, _cor: catData?.cor }));
  }

  lista.innerHTML = servicos.map(s => {
    const noOrc    = ST.moOrc.some(x => x.cod === s.cod);
    const temDetalhe = !!(s.inclui || s.exclui || s.condicoes);
    return `
      <div class="mo-item ${noOrc ? 'mo-item-selected' : ''}">
        <div style="display:flex;flex-direction:column;gap:3px;min-width:80px;flex-shrink:0">
          <span class="mo-item-cod">${s.cod}</span>
          <button class="mo-item-add"
            style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.1);color:rgba(255,255,255,.5);padding:2px 7px;font-size:9px"
            onclick="event.stopPropagation();window.copiarTexto('${s.cod}',this)">⎘ Copiar</button>
        </div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span class="mo-item-nome">${s.nome}${pesq&&s._cat?` <span style="font-size:9px;color:var(--t4);font-weight:400">· ${s._cat}</span>`:''}</span>
            ${temDetalhe ? `
            <button onclick="window.moToggleDetalhe('${s.cod}')" id="mo-det-btn-${s.cod}"
              style="padding:2px 7px;border-radius:5px;font-size:9px;font-weight:700;cursor:pointer;transition:all .15s;
              background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:var(--t4)">ℹ︎</button>` : ''}
          </div>
          ${s.nota ? `<div class="mo-item-warn">${s.nota}</div>` : ''}
          <div id="mo-det-${s.cod}" style="display:none;margin-top:7px;padding:9px 11px;
            background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:7px">
            ${s.inclui ? `<div style="margin-bottom:${s.exclui||s.condicoes?'8px':'0'}">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(150,220,150,.5);margin-bottom:4px">✓ Inclui</div>
              ${s.inclui.split('\n').map(l => `<div style="font-size:10px;color:var(--t2);line-height:1.7">· ${l.trim()}</div>`).join('')}
            </div>` : ''}
            ${s.exclui ? `<div style="${s.inclui?'border-top:1px solid rgba(255,255,255,.05);padding-top:8px;':''}margin-bottom:${s.condicoes?'8px':'0'}">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,120,100,.4);margin-bottom:4px">✕ Exclui</div>
              ${s.exclui.split('\n').map(l => `<div style="font-size:10px;color:rgba(255,200,190,.55);line-height:1.7">· ${l.trim()}</div>`).join('')}
            </div>` : ''}
            ${s.condicoes ? `<div style="border-top:1px solid rgba(255,255,255,.05);padding-top:8px">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,190,152,.4);margin-bottom:4px">⚠️ Condições</div>
              ${s.condicoes.split('\n').map(l => `<div style="font-size:10px;color:rgba(255,190,152,.65);line-height:1.7">· ${l.trim()}</div>`).join('')}
            </div>` : ''}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
          <span class="mo-item-pvp">${s.pvp > 0 ? fmt(s.pvp) : '<span style="font-size:9px;color:var(--t4)">ver nota</span>'}</span>
          <span style="font-size:9px;color:var(--t4)">${s.unid}</span>
          <button class="mo-item-add ${noOrc ? 'mo-item-add-active' : ''}"
            onclick="window.moToggleOrc('${s.cod}')">
            ${noOrc ? '✓ No Orc.' : '+ Orçamento'}
          </button>
        </div>
      </div>`;
  }).join('') || `<div style="text-align:center;padding:40px;color:var(--t4);font-size:12px">Nenhum serviço encontrado</div>`;
}

function moRenderPainel() {
  const ST  = getST();
  const ct  = document.getElementById('mo-painel-body'); if (!ct) return;
  if (!ST.moOrc.length) {
    ct.innerHTML = `<div style="text-align:center;padding:30px;color:rgba(255,255,255,.5);font-size:12px">Sem serviços no orçamento</div>`;
    return;
  }
  const total = ST.moOrc.reduce((s, a) => s + (a.pvp > 0 ? a.pvp * (a.qty || 1) : 0), 0);

  ct.innerHTML = `
    ${ST.moOrc.map((s, i) => `
      <div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.08)">
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:5px">
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
              <span style="font-size:11px;color:rgba(255,255,255,.85);font-weight:500">${s.nome}</span>
              ${(s.inclui||s.exclui||s.condicoes) ? `
              <button onclick="window.moOrcToggleDetalhe(${i})" id="mo-orc-det-btn-${i}"
                style="padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;cursor:pointer;transition:all .15s;
                background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:var(--t4)">ℹ︎</button>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:5px;margin-top:2px">
              <button onclick="window.copiarTexto('${s.cod}',this)"
                style="font-family:var(--mono);font-size:9px;color:var(--t4);background:rgba(196,97,42,.08);
                border:1px solid rgba(196,97,42,.18);border-radius:4px;padding:1px 7px;cursor:pointer;transition:all .15s">
                ${s.cod} ⎘
              </button>
              <span style="font-size:9px;color:var(--t4)">· ${s._cat}</span>
            </div>
          </div>
          <button onclick="window.moToggleOrc('${s.cod}')"
            style="width:22px;height:22px;border-radius:50%;background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.2);
            color:rgba(255,150,140,.5);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0">×</button>
        </div>
        <div id="mo-orc-det-${i}" style="display:none;margin-bottom:6px;padding:8px 10px;
          background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:7px">
          ${s.inclui ? `<div style="margin-bottom:6px"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(150,220,150,.5);margin-bottom:4px">✓ Inclui</div>${s.inclui.split('\n').map(l=>`<div style="font-size:10px;color:var(--t2);line-height:1.7">· ${l.trim()}</div>`).join('')}</div>` : ''}
          ${s.exclui ? `<div style="${s.inclui?'border-top:1px solid rgba(255,255,255,.05);padding-top:6px;':''}margin-bottom:${s.condicoes?'6px':'0'}"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,120,100,.4);margin-bottom:4px">✕ Exclui</div>${s.exclui.split('\n').map(l=>`<div style="font-size:10px;color:rgba(255,200,190,.55);line-height:1.7">· ${l.trim()}</div>`).join('')}</div>` : ''}
          ${s.condicoes ? `<div style="border-top:1px solid rgba(255,255,255,.05);padding-top:6px"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,190,152,.4);margin-bottom:4px">⚠️ Condições</div>${s.condicoes.split('\n').map(l=>`<div style="font-size:10px;color:rgba(255,190,152,.65);line-height:1.7">· ${l.trim()}</div>`).join('')}</div>` : ''}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px">
          <div style="display:flex;align-items:center;gap:6px">
            <button onclick="window.moQty(${i},-1)"
              style="width:22px;height:22px;border-radius:5px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
              color:var(--t2);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
            <input type="number" min="1" step="1" value="${s.qty || 1}"
              onchange="window.moQtyDirecto(${i}, this.value)"
              oninput="window.moQtyDirecto(${i}, this.value)"
              style="width:44px;padding:3px 6px;border-radius:5px;background:rgba(255,255,255,.06);
              border:1px solid rgba(255,255,255,.1);font-family:var(--mono);font-size:13px;font-weight:700;
              color:var(--t1);text-align:center;outline:none;
              -moz-appearance:textfield;-webkit-appearance:none;appearance:textfield"
              onfocus="this.style.borderColor='rgba(196,97,42,.4)'"
              onblur="this.style.borderColor='rgba(255,255,255,.1)'">
            <button onclick="window.moQty(${i},+1)"
              style="width:22px;height:22px;border-radius:5px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
              color:var(--t2);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
            <span style="font-size:10px;color:var(--t4)">× ${s.pvp > 0 ? fmt(s.pvp) : 'A definir'}</span>
          </div>
          <span style="font-family:var(--mono);font-size:14px;font-weight:700;color:#fff">
            ${s.pvp > 0 ? fmt(s.pvp * (s.qty || 1)) : '—'}
          </span>
        </div>
      </div>`).join('')}
    <div style="margin-top:14px;padding:12px 0;border-top:1px solid rgba(255,255,255,.2);display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,190,152,.5)">Total Mão de Obra</div>
        <div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:1px">${ST.moOrc.length} serviço${ST.moOrc.length !== 1 ? 's' : ''}</div>
      </div>
      <span style="font-family:var(--mono);font-size:20px;font-weight:700;color:var(--peach)" class="mo-total-val">${fmt(total)}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px">
      <button class="btn-sec" style="width:100%" onclick="window.moCopiarOrcamento()">📋 Copiar Orçamento completo</button>
      <button class="btn-sec" style="width:100%" onclick="window.moCopiarSoCodigos()">⎘ Copiar Códigos + Quantidades</button>
      <button style="width:100%;padding:7px;border-radius:8px;background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.2);
        color:rgba(255,150,140,.5);font-family:var(--sans);font-size:11px;font-weight:600;cursor:pointer"
        onclick="window.moLimpar()">× Limpar orçamento</button>
    </div>`;
}

// ════════════════════════════════════════════════
// WINDOW API — funções chamadas pelo HTML
// ════════════════════════════════════════════════
window.moRender = moRender;

window.moPesquisar = function(v) {
  getST().moPesquisa = v;
  moRenderLista();
};

window.moClearPesquisa = function() {
  getST().moPesquisa = '';
  const inp = document.getElementById('mo-pesquisa-input');
  if (inp) { inp.value = ''; inp.focus(); }
  moRenderLista();
};

window.moSelectSeccao = function(seccao) {
  const ST  = getST();
  ST.moSeccao  = seccao;
  ST.moCat     = MO_SECCOES[seccao]?.[0]?.cat || '';
  ST.moPesquisa = '';
  const inp = document.getElementById('mo-pesquisa-input');
  if (inp) inp.value = '';
  moRender();
};

window.moSelectCat = function(cat) {
  getST().moCat     = cat;
  getST().moPesquisa = '';
  const inp = document.getElementById('mo-pesquisa-input');
  if (inp) inp.value = '';
  moRenderLista();
};

window.moToggleDetalhe = function(cod) {
  const painel = document.getElementById('mo-det-' + cod);
  const btn    = document.getElementById('mo-det-btn-' + cod);
  if (!painel) return;
  const aberto = painel.style.display !== 'none';
  painel.style.display = aberto ? 'none' : 'block';
  if (btn) {
    btn.textContent        = aberto ? 'ℹ︎' : 'ℹ︎ fechar';
    btn.style.background   = aberto ? 'rgba(255,255,255,.05)' : 'rgba(196,97,42,.15)';
    btn.style.borderColor  = aberto ? 'rgba(255,255,255,.1)'  : 'rgba(196,97,42,.3)';
    btn.style.color        = aberto ? 'var(--t4)'             : 'rgba(255,190,152,.8)';
  }
};

window.moToggleOrc = function(cod) {
  const ST  = getST();
  const idx = ST.moOrc.findIndex(x => x.cod === cod);
  if (idx >= 0) {
    ST.moOrc.splice(idx, 1);
    toast('× Removido do orçamento');
  } else {
    let servico = null;
    for (const sec of Object.values(MO_SECCOES)) {
      for (const c of sec) {
        const s = c.servicos.find(x => x.cod === cod);
        if (s) { servico = { ...s, _cat: c.cat, _cor: c.cor, qty: 1, nota: '' }; break; }
      }
      if (servico) break;
    }
    if (servico) { ST.moOrc.push(servico); toast('✓ Adicionado ao orçamento'); }
  }
  moAtualizarBadge();
  moRenderLista();
  moRenderPainel();
  moGuardarOrcamento(); // ← persistir automaticamente
};

window.moTogglePainel = function() {
  const p = document.getElementById('mo-painel'); if (!p) return;
  const aberto = p.style.display !== 'none';
  p.style.display = aberto ? 'none' : 'flex';
  if (!aberto) moRenderPainel();
};

window.moQty = function(idx, delta) {
  const ST = getST();
  if (!ST.moOrc[idx]) return;
  ST.moOrc[idx].qty = Math.max(1, (ST.moOrc[idx].qty || 1) + delta);
  moRenderPainel();
  moGuardarOrcamento();
};

window.moQtyDirecto = function(idx, val) {
  const ST = getST();
  if (!ST.moOrc[idx]) return;
  const n = parseInt(val);
  if (isNaN(n) || n < 1) return;
  ST.moOrc[idx].qty = n;
  const totalSpan = document.querySelector('#mo-painel-body .mo-total-val');
  const total = ST.moOrc.reduce((s, a) => s + (a.pvp > 0 ? a.pvp * (a.qty || 1) : 0), 0);
  if (totalSpan) totalSpan.textContent = fmt(total);
  moGuardarOrcamento();
};

window.moOrcToggleDetalhe = function(idx) {
  const painel = document.getElementById('mo-orc-det-' + idx);
  const btn    = document.getElementById('mo-orc-det-btn-' + idx);
  if (!painel) return;
  const aberto = painel.style.display !== 'none';
  painel.style.display = aberto ? 'none' : 'block';
  if (btn) {
    btn.textContent        = aberto ? 'ℹ︎' : 'ℹ︎ fechar';
    btn.style.background   = aberto ? 'rgba(255,255,255,.05)' : 'rgba(196,97,42,.15)';
    btn.style.borderColor  = aberto ? 'rgba(255,255,255,.1)'  : 'rgba(196,97,42,.3)';
    btn.style.color        = aberto ? 'var(--t4)'             : 'rgba(255,190,152,.8)';
  }
};

window.moAtualizarNota = function(idx, nota) {
  const ST = getST();
  if (ST.moOrc[idx]) ST.moOrc[idx].nota = nota;
};

window.moLimpar = function() {
  const ST = getST();
  if (!ST.moOrc.length) return;
  window.wkConfirm('Limpar todo o orçamento de mão de obra?', () => {
    ST.moOrc = [];
    moAtualizarBadge();
    moRenderLista();
    moRenderPainel();
    moGuardarOrcamento();
    toast('✓ Orçamento limpo');
  });
};

window.moCopiarOrcamento = function() {
  const ST = getST();
  if (!ST.moOrc.length) { toast('⚠️ Orçamento vazio'); return; }
  const total  = ST.moOrc.reduce((s, a) => s + (a.pvp > 0 ? a.pvp * (a.qty || 1) : 0), 0);
  const linhas = [
    'ORÇAMENTO — MÃO DE OBRA',
    '─'.repeat(70),
    `${'CÓDIGO'.padEnd(12)}${'QTY'.padEnd(6)}${'UNID'.padEnd(6)}${'P. UNIT'.padEnd(12)}${'TOTAL'.padEnd(12)}DESCRIÇÃO`,
    '─'.repeat(70),
  ];
  ST.moOrc.forEach(s => {
    const qty   = s.qty || 1;
    const punit = s.pvp > 0 ? fmt(s.pvp) : 'A definir';
    const ptot  = s.pvp > 0 ? fmt(s.pvp * qty) : '—';
    linhas.push(`${s.cod.padEnd(12)}${String(qty).padEnd(6)}${s.unid.padEnd(6)}${punit.padEnd(12)}${ptot.padEnd(12)}${s.nome}`);
  });
  linhas.push('─'.repeat(70));
  linhas.push(`${''.padEnd(36)}${'TOTAL MÃO DE OBRA:'.padEnd(12)} ${fmt(total)}`);
  navigator.clipboard.writeText(linhas.join('\n')).then(() => toast('✓ Orçamento copiado — pronto para o programa LM'));
};

window.moCopiarSoCodigos = function() {
  const ST = getST();
  if (!ST.moOrc.length) { toast('⚠️ Orçamento vazio'); return; }
  const linhas = ST.moOrc.map(s => `${s.cod}\t${s.qty || 1}`);
  navigator.clipboard.writeText(linhas.join('\n')).then(() => toast('✓ Códigos + quantidades copiados'));
};

// Exportar getters úteis para outros módulos (ex: proposta consolidada)
export function getMoOrc()      { return getST().moOrc; }
export function getMoSeccoes()  { return MO_SECCOES; }
