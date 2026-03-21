// ════════════════════════════════════════════════
// tampos.js · Work Kit · Hélder Melo
// Catálogo Anigraco — Tampos & Pedra
// ════════════════════════════════════════════════

// ── Fornecedor ────────────────────────────────────
export const ANIGRACO = {
  nome: 'ANIGRACO',
  cod:  '207849',
};

// ── Transporte ────────────────────────────────────
export const TRANSPORTE = [
  { label: 'Viseu',   c1: 19000, pvp: 300  },
  { label: '> 30 km', c1: 30000, pvp: 480  },
  { label: '> 50 km', c1: 45000, pvp: 720  },
];

// ── Acabamentos por material ──────────────────────
const ACB_GRANITO = [
  { id: 'rodatampo',  nome: 'Rodatampo',             unid: 'ml', c1: 1160,  pvp: 21  },
  { id: 'cortebruto', nome: 'Corte Bruto',            unid: 'un', c1: 1260,  pvp: 23  },
  { id: 'rebaixo',    nome: 'Rebaixo à Face',          unid: 'un', c1: 4410,  pvp: 80  },
  { id: 'polido',     nome: 'Transformação Polido',    unid: 'un', c1: 3500,  pvp: 56  },
  { id: 'furo',       nome: 'Furo',                   unid: 'un', c1: 950,   pvp: 17  },
  { id: 'esquadria',  nome: 'Corte ½ Esquadria',       unid: 'un', c1: 2310,  pvp: 47  },
];
const ACB_SILESTONE = [
  { id: 'rodatampo',  nome: 'Rodatampo',             unid: 'ml', c1: 1320,  pvp: 24  },
  { id: 'cortebruto', nome: 'Corte Bruto',            unid: 'un', c1: 1260,  pvp: 23  },
  { id: 'rebaixo',    nome: 'Rebaixo à Face',          unid: 'un', c1: 4410,  pvp: 80  },
  { id: 'polido',     nome: 'Transformação Polido',    unid: 'un', c1: 35,    pvp: 56  },
  { id: 'furo',       nome: 'Furo',                   unid: 'un', c1: 950,   pvp: 17  },
  { id: 'esquadria',  nome: 'Corte ½ Esquadria',       unid: 'un', c1: 2310,  pvp: 47  },
  { id: 'silicone',   nome: 'Silicone',               unid: 'un', c1: 10,    pvp: 18  },
];
const ACB_COMPAC = [
  { id: 'rodatampo',  nome: 'Rodatampo',             unid: 'ml', c1: 1320,  pvp: 24  },
  { id: 'cortebruto', nome: 'Corte Bruto',            unid: 'un', c1: 1260,  pvp: 26  },
  { id: 'rebaixo',    nome: 'Rebaixo à Face',          unid: 'un', c1: 4410,  pvp: 90  },
  { id: 'polido',     nome: 'Transformação Polido',    unid: 'un', c1: 35,    pvp: 56  },
  { id: 'furo',       nome: 'Furo',                   unid: 'un', c1: 950,   pvp: 19  },
  { id: 'esquadria',  nome: 'Corte ½ Esquadria',       unid: 'un', c1: 2310,  pvp: 47  },
  { id: 'silicone',   nome: 'Silicone',               unid: 'un', c1: 10,    pvp: 18  },
];
const ACB_DEKTON = [
  { id: 'rodatampo',  nome: 'Rodatampo',             unid: 'ml', c1: 3200,  pvp: 59  },
  { id: 'cortebruto', nome: 'Corte Bruto',            unid: 'un', c1: 3200,  pvp: 66  },
  { id: 'rebaixo',    nome: 'Rebaixo à Face',          unid: 'un', c1: 5670,  pvp: 116 },
  { id: 'polido',     nome: 'Transformação Polido',    unid: 'un', c1: 5000,  pvp: 90  },
  { id: 'furo',       nome: 'Furo',                   unid: 'un', c1: 1260,  pvp: 26  },
  { id: 'esquadria',  nome: 'Corte ½ Esquadria',       unid: 'un', c1: 2840,  pvp: 58  },
  { id: 'silicone',   nome: 'Silicone',               unid: 'un', c1: 10,    pvp: 18  },
];

// ── Base de dados completa ────────────────────────
export const TAMPOS_DB = {
  Granito: {
    cor: '#7A7070', acabamentos: ACB_GRANITO,
    espessuras: ['2cm', '3cm'],
    artigos: [
      { nome: 'Verde Lavrador',   c1: { '2cm': 27022, '3cm': 29444 }, pvp: { '2cm': 475, '3cm': 517 } },
      { nome: 'Negro Zimbabwe',   c1: { '2cm': 26656, '3cm': 29912 }, pvp: { '2cm': 468, '3cm': 526 } },
      { nome: 'Azul Lavrador',    c1: { '2cm': 24132, '3cm': 30889 }, pvp: { '2cm': 424, '3cm': 543 } },
      { nome: 'Shivakashy',       c1: { '2cm': 21599, '3cm': 28679 }, pvp: { '2cm': 380, '3cm': 504 } },
      { nome: 'Patas de Gato',    c1: { '2cm': 19261, '3cm': 25041 }, pvp: { '2cm': 338, '3cm': 440 } },
      { nome: 'Negro Angola',     c1: { '2cm': 16218, '3cm': 19975 }, pvp: { '2cm': 285, '3cm': 351 } },
      { nome: 'Negro Impala',     c1: { '2cm': 14476, '3cm': 20579 }, pvp: { '2cm': 254, '3cm': 362 } },
      { nome: 'Amarelo Figueira', c1: { '2cm': 11407, '3cm': 12365 }, pvp: { '2cm': 200, '3cm': 217 } },
      { nome: 'Amarelo Macieira', c1: { '2cm': 10651, '3cm': 11713 }, pvp: { '2cm': 187, '3cm': 206 } },
      { nome: 'Amarelo Vimieiro', c1: { '2cm': 12551, '3cm': 13613 }, pvp: { '2cm': 221, '3cm': 239 } },
      { nome: 'Branco Coral',     c1: { '2cm': 10651, '3cm': 11713 }, pvp: { '2cm': 187, '3cm': 206 } },
      { nome: 'Cinza Évora',      c1: { '2cm': 14551, '3cm': 15613 }, pvp: { '2cm': 256, '3cm': 274 } },
      { nome: 'Pedras Salgadas',  c1: { '2cm': 12551, '3cm': 13613 }, pvp: { '2cm': 221, '3cm': 239 } },
      { nome: 'Cinza Penalva',    c1: { '2cm': 8874,  '3cm': 10999 }, pvp: { '2cm': 156, '3cm': 193 } },
      { nome: 'Cinza Antas',      c1: { '2cm': 8874,  '3cm': 10999 }, pvp: { '2cm': 156, '3cm': 193 } },
      { nome: 'Cinza Pinhel',     c1: { '2cm': 8874,  '3cm': 10617 }, pvp: { '2cm': 156, '3cm': 187 } },
      { nome: 'Rosa Porrinho',    c1: { '2cm': 8874,  '3cm': 10141 }, pvp: { '2cm': 156, '3cm': 178 } },
      { nome: 'Rosa Monção',      c1: { '2cm': 8874,  '3cm': 10141 }, pvp: { '2cm': 156, '3cm': 178 } },
      { nome: 'Negro Galáxia',    c1: { '2cm': null,  '3cm': null  }, pvp: { '2cm': null,'3cm': null }, consulta: true },
    ],
  },
  Silestone: {
    cor: '#4A5A9A', acabamentos: ACB_SILESTONE,
    espessuras: ['2cm', '1.2cm'],
    grupos: ['P', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'XM'],
    artigos: [
      { grupo: 'P',  nome: 'Linen Cream',       c1: { '2cm': 20272, '1.2cm': 17872 }, pvp: { '2cm': 356, '1.2cm': 314 } },
      { grupo: 'P',  nome: 'Motion Grey',        c1: { '2cm': 20272, '1.2cm': 17872 }, pvp: { '2cm': 356, '1.2cm': 314 } },
      { grupo: 'P',  nome: 'Miami White',        c1: { '2cm': 20272, '1.2cm': 17872 }, pvp: { '2cm': 356, '1.2cm': 314 } },
      { grupo: 'P',  nome: 'Lime Delight',       c1: { '2cm': 20272, '1.2cm': 17872 }, pvp: { '2cm': 356, '1.2cm': 314 } },
      { grupo: 'P',  nome: 'Persian White',      c1: { '2cm': 20272, '1.2cm': 17872 }, pvp: { '2cm': 356, '1.2cm': 314 } },
      { grupo: 'P',  nome: 'Siberian',           c1: { '2cm': 20272, '1.2cm': 17872 }, pvp: { '2cm': 356, '1.2cm': 314 } },
      { grupo: 'P',  nome: 'Lagoon',             c1: { '2cm': 20272, '1.2cm': 17872 }, pvp: { '2cm': 356, '1.2cm': 314 } },
      { grupo: 'P',  nome: 'Concrete Pulse',     c1: { '2cm': 20272, '1.2cm': 17872 }, pvp: { '2cm': 356, '1.2cm': 314 } },
      { grupo: 'P',  nome: 'Coral Clay',         c1: { '2cm': 20272, '1.2cm': 17872 }, pvp: { '2cm': 356, '1.2cm': 314 } },
      { grupo: 'P',  nome: 'Negro Tebas',        c1: { '2cm': 20272, '1.2cm': 17872 }, pvp: { '2cm': 356, '1.2cm': 314 } },
      { grupo: 'G1', nome: 'Blanco Maple 14',    c1: { '2cm': 23064, '1.2cm': null  }, pvp: { '2cm': 405, '1.2cm': null } },
      { grupo: 'G1', nome: 'Blanco Norte 14',    c1: { '2cm': 23064, '1.2cm': null  }, pvp: { '2cm': 405, '1.2cm': null } },
      { grupo: 'G1', nome: 'Linen Cream G1',     c1: { '2cm': 23064, '1.2cm': null  }, pvp: { '2cm': 405, '1.2cm': null } },
      { grupo: 'G1', nome: 'White Storm 14',     c1: { '2cm': 23064, '1.2cm': null  }, pvp: { '2cm': 405, '1.2cm': null } },
      { grupo: 'G1', nome: 'Motion Grey G1',     c1: { '2cm': 23064, '1.2cm': null  }, pvp: { '2cm': 405, '1.2cm': null } },
      { grupo: 'G1', nome: 'Rougui',             c1: { '2cm': 23064, '1.2cm': null  }, pvp: { '2cm': 405, '1.2cm': null } },
      { grupo: 'G1', nome: 'Gris Expo',          c1: { '2cm': 23064, '1.2cm': null  }, pvp: { '2cm': 405, '1.2cm': null } },
      { grupo: 'G1', nome: 'Marengo',            c1: { '2cm': 23064, '1.2cm': null  }, pvp: { '2cm': 405, '1.2cm': null } },
      { grupo: 'G2', nome: 'Miami White 17',     c1: { '2cm': 26784, '1.2cm': null  }, pvp: { '2cm': 471, '1.2cm': null } },
      { grupo: 'G2', nome: 'Lime Delight G2',    c1: { '2cm': 26784, '1.2cm': null  }, pvp: { '2cm': 471, '1.2cm': null } },
      { grupo: 'G2', nome: 'Persian White G2',   c1: { '2cm': 26784, '1.2cm': null  }, pvp: { '2cm': 471, '1.2cm': null } },
      { grupo: 'G2', nome: 'Siberian G2',        c1: { '2cm': 26784, '1.2cm': null  }, pvp: { '2cm': 471, '1.2cm': null } },
      { grupo: 'G2', nome: 'Lagoon G2',          c1: { '2cm': 26784, '1.2cm': null  }, pvp: { '2cm': 471, '1.2cm': null } },
      { grupo: 'G2', nome: 'Concrete Pulse G2',  c1: { '2cm': 26784, '1.2cm': null  }, pvp: { '2cm': 471, '1.2cm': null } },
      { grupo: 'G2', nome: 'Coral Clay Colour',  c1: { '2cm': 26784, '1.2cm': null  }, pvp: { '2cm': 471, '1.2cm': null } },
      { grupo: 'G2', nome: 'Brass Relish',       c1: { '2cm': 26784, '1.2cm': null  }, pvp: { '2cm': 471, '1.2cm': null } },
      { grupo: 'G2', nome: 'Cinder Craze',       c1: { '2cm': 26784, '1.2cm': null  }, pvp: { '2cm': 471, '1.2cm': null } },
      { grupo: 'G2', nome: 'Night Tebas',        c1: { '2cm': 26784, '1.2cm': null  }, pvp: { '2cm': 471, '1.2cm': null } },
      { grupo: 'G3', nome: 'Miami Vena',         c1: { '2cm': 29672, '1.2cm': null  }, pvp: { '2cm': 521, '1.2cm': null } },
      { grupo: 'G3', nome: 'Bronze Rivers',      c1: { '2cm': 29672, '1.2cm': null  }, pvp: { '2cm': 521, '1.2cm': null } },
      { grupo: 'G3', nome: 'Snowy Ibiza',        c1: { '2cm': 29672, '1.2cm': null  }, pvp: { '2cm': 521, '1.2cm': null } },
      { grupo: 'G3', nome: 'Desert Silver',      c1: { '2cm': 29672, '1.2cm': null  }, pvp: { '2cm': 521, '1.2cm': null } },
      { grupo: 'G3', nome: 'Et. Marfil',         c1: { '2cm': 29672, '1.2cm': null  }, pvp: { '2cm': 521, '1.2cm': null } },
      { grupo: 'G3', nome: 'Charcoal Soapstone', c1: { '2cm': 29672, '1.2cm': null  }, pvp: { '2cm': 521, '1.2cm': null } },
      { grupo: 'G3', nome: 'Calacatta Tova',     c1: { '2cm': 29672, '1.2cm': null  }, pvp: { '2cm': 521, '1.2cm': null } },
      { grupo: 'G4', nome: 'Blanco Zeus',        c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G4', nome: 'XM Nolita 23',       c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G4', nome: 'Et. Statuario',      c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G4', nome: 'XM Raw A',           c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G4', nome: 'Pearl Jasmine',      c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G4', nome: 'XM Poblenou',        c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G4', nome: 'XM Ffrom 01',        c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G4', nome: 'XM Raw G',           c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G4', nome: 'XM Ffrom 02',        c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G4', nome: 'XM Ffrom 03',        c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G4', nome: 'XM Raw D',           c1: { '2cm': 40600, '1.2cm': null  }, pvp: { '2cm': 713, '1.2cm': null } },
      { grupo: 'G5', nome: 'Et. Marquina',       c1: { '2cm': 46808, '1.2cm': null  }, pvp: { '2cm': 822, '1.2cm': null } },
      { grupo: 'G6', nome: 'Et Calacatta Gold',  c1: { '2cm': 54272, '1.2cm': null  }, pvp: { '2cm': 954, '1.2cm': null } },
      { grupo: 'G6', nome: 'Ethereal Noctis',    c1: { '2cm': 54272, '1.2cm': null  }, pvp: { '2cm': 954, '1.2cm': null } },
      { grupo: 'G6', nome: 'Ethereal Glow',      c1: { '2cm': 54272, '1.2cm': null  }, pvp: { '2cm': 954, '1.2cm': null } },
      { grupo: 'XM', nome: 'XM Blanc Élisée',    c1: { '2cm': 63912, '1.2cm': null  }, pvp: { '2cm': 1123,'1.2cm': null } },
      { grupo: 'XM', nome: 'XM Rivière Rose',    c1: { '2cm': 63912, '1.2cm': null  }, pvp: { '2cm': 1123,'1.2cm': null } },
      { grupo: 'XM', nome: 'Versailles Ivory',   c1: { '2cm': 63912, '1.2cm': null  }, pvp: { '2cm': 1123,'1.2cm': null } },
      { grupo: 'XM', nome: 'Eclectic Pearl',     c1: { '2cm': 63912, '1.2cm': null  }, pvp: { '2cm': 1123,'1.2cm': null } },
      { grupo: 'XM', nome: 'Victorian Silver',   c1: { '2cm': 63912, '1.2cm': null  }, pvp: { '2cm': 1123,'1.2cm': null } },
      { grupo: 'XM', nome: 'XM Jardín Esmeralda',c1: { '2cm': 63912, '1.2cm': null  }, pvp: { '2cm': 1123,'1.2cm': null } },
      { grupo: 'XM', nome: 'XM Parisien Bleu',   c1: { '2cm': 63912, '1.2cm': null  }, pvp: { '2cm': 1123,'1.2cm': null } },
      { grupo: 'XM', nome: 'Romantic Ash',       c1: { '2cm': 63912, '1.2cm': null  }, pvp: { '2cm': 1123,'1.2cm': null } },
    ],
  },
  Compac: {
    cor: '#4A7A6A', acabamentos: ACB_COMPAC,
    espessuras: ['2cm'],
    artigos: [
      { grupo: 'G1', nome: 'Glaciar',    c1: { '2cm': 20856 }, pvp: { '2cm': 366 } },
      { grupo: 'G1', nome: 'Luna',       c1: { '2cm': 20856 }, pvp: { '2cm': 366 } },
      { grupo: 'G1', nome: 'Alaska',     c1: { '2cm': 20856 }, pvp: { '2cm': 366 } },
      { grupo: 'G1', nome: 'Arena',      c1: { '2cm': 20856 }, pvp: { '2cm': 366 } },
      { grupo: 'G1', nome: 'Ceniza',     c1: { '2cm': 20856 }, pvp: { '2cm': 366 } },
      { grupo: 'G1', nome: 'Plomo',      c1: { '2cm': 20856 }, pvp: { '2cm': 366 } },
      { grupo: 'G1', nome: 'Nocturno',   c1: { '2cm': 20856 }, pvp: { '2cm': 366 } },
      { grupo: 'G2', nome: 'Snow',       c1: { '2cm': 24512 }, pvp: { '2cm': 431 } },
      { grupo: 'G2', nome: 'Moon',       c1: { '2cm': 24512 }, pvp: { '2cm': 431 } },
      { grupo: 'G2', nome: 'Smoke Grey', c1: { '2cm': 24512 }, pvp: { '2cm': 431 } },
    ],
  },
  Dekton: {
    cor: '#2A2A3A', acabamentos: ACB_DEKTON,
    espessuras: ['2cm', '1.2cm'],
    artigos: [
      { grupo: 'P',  nome: 'Keena',         c1: { '2cm': 26584, '1.2cm': 21952 }, pvp: { '2cm': 467, '1.2cm': 386 } },
      { grupo: 'P',  nome: 'Marina',        c1: { '2cm': 26584, '1.2cm': 21952 }, pvp: { '2cm': 467, '1.2cm': 386 } },
      { grupo: 'P',  nome: 'Thala',         c1: { '2cm': 26584, '1.2cm': 21952 }, pvp: { '2cm': 467, '1.2cm': 386 } },
      { grupo: 'P',  nome: 'Evok',          c1: { '2cm': 26584, '1.2cm': 21952 }, pvp: { '2cm': 467, '1.2cm': 386 } },
      { grupo: 'P',  nome: 'Nacre',         c1: { '2cm': 26584, '1.2cm': 21952 }, pvp: { '2cm': 467, '1.2cm': 386 } },
      { grupo: 'P',  nome: 'Argentium',     c1: { '2cm': 26584, '1.2cm': 21952 }, pvp: { '2cm': 467, '1.2cm': 386 } },
      { grupo: 'P',  nome: 'Kelya',         c1: { '2cm': 26584, '1.2cm': 21952 }, pvp: { '2cm': 467, '1.2cm': 386 } },
      { grupo: 'P',  nome: 'Entzo',         c1: { '2cm': 28928, '1.2cm': 23832 }, pvp: { '2cm': 508, '1.2cm': 419 } },
      { grupo: 'G0', nome: 'Kairos 22 KC',  c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Monné KC',      c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Lunar 22 KC',   c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Aeris KC',      c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Danae KC',      c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Dunna KC',      c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Kovik',         c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Keon',          c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Trilium',       c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Eter',          c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Keena G0',      c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Thala G0',      c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G0', nome: 'Evok G0',       c1: { '2cm': 30320, '1.2cm': 25792 }, pvp: { '2cm': 533, '1.2cm': 453 } },
      { grupo: 'G1', nome: 'Halo KC',       c1: { '2cm': 44112, '1.2cm': 37912 }, pvp: { '2cm': 775, '1.2cm': 666 } },
      { grupo: 'G1', nome: 'Nacre KC',      c1: { '2cm': 44112, '1.2cm': 37912 }, pvp: { '2cm': 775, '1.2cm': 666 } },
      { grupo: 'G1', nome: 'Sirius25',      c1: { '2cm': 44112, '1.2cm': 37912 }, pvp: { '2cm': 775, '1.2cm': 666 } },
      { grupo: 'G1', nome: 'Kreta',         c1: { '2cm': 44112, '1.2cm': 37912 }, pvp: { '2cm': 775, '1.2cm': 666 } },
      { grupo: 'G1', nome: 'Kira',          c1: { '2cm': 44112, '1.2cm': 37912 }, pvp: { '2cm': 775, '1.2cm': 666 } },
      { grupo: 'G1', nome: 'Bromo',         c1: { '2cm': 44112, '1.2cm': 37912 }, pvp: { '2cm': 775, '1.2cm': 666 } },
      { grupo: 'G2', nome: 'Aura 22 KC',    c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Zenith KC',     c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Polar KC',      c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Marina KC',     c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Sandik KC',     c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Albarium 22 KC',c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Argentium KC',  c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Nebbia KC',     c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Trevi KC',      c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Marmorio KC',   c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Sabbia KC',     c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Ava KC',        c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Avorio KC',     c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Adia KC',       c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Umber',         c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Nebu KC',       c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Grigio KC',     c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Soke',          c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Ceppo KC',      c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Grafite',       c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Laos',          c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Kelya G2',      c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Domoos 25',     c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Kedar',         c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G2', nome: 'Zira',          c1: { '2cm': 52048, '1.2cm': 44304 }, pvp: { '2cm': 915, '1.2cm': 778 } },
      { grupo: 'G3', nome: 'Uyuni KC',      c1: { '2cm': 60272, '1.2cm': 48218 }, pvp: { '2cm': 1324,'1.2cm': 847  } },
      { grupo: 'G3', nome: 'Neural KC',     c1: { '2cm': 60272, '1.2cm': 48218 }, pvp: { '2cm': 1324,'1.2cm': 847  } },
      { grupo: 'G3', nome: 'Rem KC',        c1: { '2cm': 60272, '1.2cm': 48218 }, pvp: { '2cm': 1324,'1.2cm': 847  } },
      { grupo: 'G3', nome: 'Nara',          c1: { '2cm': 60272, '1.2cm': 48218 }, pvp: { '2cm': 1324,'1.2cm': 847  } },
      { grupo: 'G3', nome: 'Natura 22 KC',  c1: { '2cm': 60272, '1.2cm': 48218 }, pvp: { '2cm': 1324,'1.2cm': 847  } },
      { grupo: 'G3', nome: 'Vigil KC',      c1: { '2cm': 60272, '1.2cm': 48218 }, pvp: { '2cm': 1324,'1.2cm': 847  } },
    ],
  },
};

// ════════════════════════════════════════════════
// ESTADO DO MÓDULO
// ════════════════════════════════════════════════
let TS = {
  tab:           'catalogo',    // 'catalogo' | 'calculadora' | 'comparador'
  material:      'Silestone',
  grupoFiltro:   '',
  pesquisa:      '',
  // Calculadora
  calc: {
    material:    'Silestone',
    artigo:      null,          // artigo seleccionado
    espessura:   '2cm',
    espRev:      '1.2cm',       // espessura do revestimento
    pecas:       [],            // [{id, comp, larg}]
    revestimento:[],            // [{id, comp, larg}]
    acabamentos: {},            // {rodatampo: 0, cortebruto: 0, ...}
    transporte:  null,          // índice do TRANSPORTE
  },
  // Comparador
  comp: {
    lado: {
      A: { material: 'Silestone', artigo: null, espessura: '2cm' },
      B: { material: 'Dekton',    artigo: null, espessura: '2cm' },
    },
    pecas:       [],
    revestimento:[],
    acabamentos: {},
    transporte:  null,
  },
};

// ════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════
function fmtC1(c1cents) {
  if (!c1cents) return '—';
  return (c1cents / 100).toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' €';
}
function fmtPVP(pvp) {
  if (!pvp) return '—';
  return pvp.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' €';
}
function fmtM2(m2) {
  return m2.toFixed(4) + ' m²';
}
function gerarIdPeca() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
function copiar(txt, btn) {
  navigator.clipboard.writeText(txt).then(() => {
    window.wkToast('✓ Copiado: ' + txt);
    if (btn) { const o = btn.textContent; btn.textContent = '✓'; setTimeout(() => btn.textContent = o, 1400); }
  });
}

// ════════════════════════════════════════════════
// INIT PRINCIPAL
// ════════════════════════════════════════════════
export function tampoInit() {
  renderTampoHeader();
  renderTampoTabs();
  switchTampoTab(TS.tab);
}

function renderTampoHeader() {
  const ct = document.getElementById('tampo-header');
  if (!ct) return;
  ct.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:20px">
      <div>
        <div class="page-titulo">Tampos & Pedra</div>
        <div class="page-sub">Catálogo Anigraco · Calculadora · Comparador</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <!-- Badge Anigraco -->
        <div style="display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:6px 12px">
          <span style="font-size:10px;color:var(--t4);font-weight:700;text-transform:uppercase;letter-spacing:.1em">Fornecedor</span>
          <span style="color:var(--t2);font-weight:600;font-size:12px">ANIGRACO</span>
          <button onclick="copiar('207849',this)"
            style="font-family:var(--mono);font-size:11px;font-weight:700;padding:2px 8px;border-radius:5px;background:rgba(196,97,42,.12);border:1px solid rgba(196,97,42,.25);color:rgba(255,190,152,.7);cursor:pointer;transition:all .15s"
            title="Copiar código LM">207849</button>
        </div>
        <!-- Tabs -->
        <div style="display:flex;gap:4px">
          ${['catalogo','calculadora','comparador'].map(t => `
            <button onclick="window.switchTampoTab('${t}')" id="tampo-tab-${t}"
              class="btn-sec ${TS.tab === t ? 'active' : ''}">
              ${{ catalogo:'📋 Catálogo', calculadora:'🧮 Calculadora', comparador:'⚖️ Comparar' }[t]}
            </button>`).join('')}
        </div>
      </div>
    </div>`;
  window.copiar = copiar;
}

function renderTampoTabs() {
  // Garante que os contentores existem
  ['catalogo','calculadora','comparador'].forEach(t => {
    let el = document.getElementById('tampo-ct-' + t);
    if (!el) {
      el = document.createElement('div');
      el.id = 'tampo-ct-' + t;
      el.style.display = 'none';
      document.getElementById('tampo-body')?.appendChild(el);
    }
  });
}

export function switchTampoTab(tab) {
  TS.tab = tab;
  ['catalogo','calculadora','comparador'].forEach(t => {
    const el = document.getElementById('tampo-ct-' + t);
    if (el) el.style.display = t === tab ? '' : 'none';
    const btn = document.getElementById('tampo-tab-' + t);
    if (btn) { btn.classList.toggle('active', t === tab); }
  });
  if (tab === 'catalogo')    renderCatalogo();
  if (tab === 'calculadora') renderCalculadora();
  if (tab === 'comparador')  renderComparador();
}

// ════════════════════════════════════════════════
// CATÁLOGO
// ════════════════════════════════════════════════
function renderCatalogo() {
  const ct = document.getElementById('tampo-ct-catalogo'); if (!ct) return;

  const materiais = Object.keys(TAMPOS_DB);
  const mat = TAMPOS_DB[TS.material];
  const grupos = mat.grupos || [];
  const pesq = TS.pesquisa.toLowerCase().trim();

  let artigos = mat.artigos.filter(a => {
    const matchGrupo = !TS.grupoFiltro || a.grupo === TS.grupoFiltro;
    const matchPesq  = !pesq || a.nome.toLowerCase().includes(pesq);
    return matchGrupo && matchPesq;
  });

  ct.innerHTML = `
    <!-- Filtro de material -->
    <div class="filter-chips" style="margin-bottom:12px">
      ${materiais.map(m => `
        <button class="chip ${TS.material === m ? 'active' : ''}"
                onclick="window.tampoSelectMaterial('${m}')">
          ${m} <span style="opacity:.5">${TAMPOS_DB[m].artigos.length}</span>
        </button>`).join('')}
    </div>

    <!-- Pesquisa + filtro grupo -->
    <div class="search-bar">
      <div class="search-wrap">
        <span class="search-icon">⌕</span>
        <input type="text" class="search-input" placeholder="Pesquisar cor ou referência…"
          value="${TS.pesquisa}"
          oninput="window.tampoPesquisar(this.value)">
      </div>
      ${grupos.length ? `
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          <button class="chip ${!TS.grupoFiltro ? 'active' : ''}"
                  onclick="window.tampoFiltroGrupo('')">Todos</button>
          ${grupos.map(g => `
            <button class="chip ${TS.grupoFiltro === g ? 'active' : ''}"
                    onclick="window.tampoFiltroGrupo('${g}')">${g}</button>`).join('')}
        </div>` : ''}
    </div>

    <!-- Info -->
    <div class="bib-info">${artigos.length} artigo${artigos.length !== 1 ? 's' : ''} · ${TS.material} · C1 em cêntimos ÷ 100</div>

    <!-- Grid de cards -->
    <div class="cards-grid">
      ${artigos.map(a => renderCardTampo(a, mat)).join('')}
    </div>`;
}

function renderCardTampo(a, mat) {
  const esp = mat.espessuras[0]; // espessura default
  const c1  = a.c1?.[esp];
  const pvp = a.pvp?.[esp];
  const consulta = a.consulta;

  const espBtns = mat.espessuras.map(e => `
    <button onclick="window.tampoVerC1('${a.nome}','${e}',this)"
      style="padding:2px 7px;border-radius:4px;font-size:9px;font-weight:700;cursor:pointer;transition:all .15s;
      background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--t4)">
      ${e}
    </button>`).join('');

  return `
    <div class="tampo-card" style="display:flex;flex-direction:column;gap:8px">
      <!-- Topo: grupo + espessuras -->
      <div style="display:flex;align-items:center;justify-content:space-between">
        ${a.grupo ? `<span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4)">${a.grupo}</span>` : '<span></span>'}
        <div style="display:flex;gap:3px">${espBtns}</div>
      </div>

      <!-- Nome -->
      <div style="font-size:14px;font-weight:600;color:var(--t1);line-height:1.2">${a.nome}</div>

      <!-- Preços -->
      ${consulta ? `
        <div style="font-size:12px;color:rgba(196,97,42,.7);font-style:italic">Sob consulta</div>
      ` : `
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px">
          <!-- C1 clicável -->
          <button data-c1btn data-val="${c1}" onclick="window.copiar('${c1}',this)"
            style="display:flex;flex-direction:column;align-items:flex-start;background:rgba(196,97,42,.08);border:1px solid rgba(196,97,42,.2);border-radius:7px;padding:5px 9px;cursor:pointer;transition:all .15s;min-width:0"
            title="Clica para copiar C1">
            <span style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(196,97,42,.6)">C1 ⎘</span>
            <span data-c1val style="font-family:var(--mono);font-size:13px;font-weight:700;color:rgba(255,190,152,.8)">${fmtC1(c1)}</span>
          </button>
          <!-- PVP -->
          <div style="text-align:right">
            <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4)">PVP / m²</div>
            <div data-pvpval style="font-family:var(--mono);font-size:15px;font-weight:600;color:var(--t1)">${fmtPVP(pvp)}</div>
          </div>
        </div>
      `}

      <!-- Acções -->
      <div style="display:flex;gap:5px;margin-top:2px">
        <button onclick="window.tampoAbrirCalc('${a.nome}','${TS.material}')"
          style="flex:1;padding:6px 8px;border-radius:7px;background:rgba(196,97,42,.1);border:1px solid rgba(196,97,42,.2);color:rgba(255,190,152,.7);font-size:10px;font-weight:700;cursor:pointer;transition:all .15s">
          🧮 Calcular
        </button>
        <button onclick="window.tampoAbrirComp('${a.nome}','${TS.material}')"
          style="flex:1;padding:6px 8px;border-radius:7px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:var(--t3);font-size:10px;font-weight:700;cursor:pointer;transition:all .15s">
          ⚖️ Comparar
        </button>
      </div>
    </div>`;
}

window.tampoSelectMaterial = function(m) { TS.material = m; TS.grupoFiltro = ''; renderCatalogo(); };
window.tampoFiltroGrupo    = function(g) { TS.grupoFiltro = g; renderCatalogo(); };
window.tampoPesquisar      = function(v) { TS.pesquisa = v; renderCatalogo(); };

window.tampoVerC1 = function(nome, esp, btn) {
  const mat = TAMPOS_DB[TS.material];
  const a = mat.artigos.find(x => x.nome === nome);
  if (!a) return;
  const card = btn.closest('.tampo-card');
  if (card) {
    // Actualizar C1 — valor e onclick
    const c1btn = card.querySelector('[data-c1btn]');
    if (c1btn && a.c1[esp]) {
      c1btn.querySelector('[data-c1val]').textContent = fmtC1(a.c1[esp]);
      c1btn.setAttribute('data-val', a.c1[esp]);
      c1btn.onclick = () => copiar(String(a.c1[esp]), c1btn);
    }
    // Actualizar PVP — correcção do bug
    const pvpVal = card.querySelector('[data-pvpval]');
    if (pvpVal) pvpVal.textContent = fmtPVP(a.pvp[esp] || null);
  }
  // Highlight botão espessura activa
  btn.parentElement.querySelectorAll('button').forEach(b => {
    b.style.background = 'rgba(255,255,255,.06)';
    b.style.color = 'var(--t4)';
    b.style.borderColor = 'rgba(255,255,255,.1)';
  });
  btn.style.background = 'rgba(196,97,42,.15)';
  btn.style.color = 'rgba(255,190,152,.8)';
  btn.style.borderColor = 'rgba(196,97,42,.3)';
};

window.tampoAbrirCalc = function(nome, material) {
  const mat = TAMPOS_DB[material];
  const artigo = mat.artigos.find(a => a.nome === nome);
  TS.calc.material  = material;
  TS.calc.artigo    = artigo;
  TS.calc.espessura = mat.espessuras[0];
  if (!TS.calc.pecas.length) {
    TS.calc.pecas = [{ id: gerarIdPeca(), comp: '', larg: '0.65' }];
  }
  TS.calc.acabamentos = {};
  switchTampoTab('calculadora');
};

window.tampoAbrirComp = function(nome, material) {
  const mat = TAMPOS_DB[material];
  const artigo = mat.artigos.find(a => a.nome === nome);
  TS.comp.lado.A.material = material;
  TS.comp.lado.A.artigo   = artigo;
  TS.comp.lado.A.espessura = mat.espessuras[0];
  if (!TS.comp.pecas.length) {
    TS.comp.pecas = [{ id: gerarIdPeca(), comp: '', larg: '0.65' }];
  }
  switchTampoTab('comparador');
};

// ════════════════════════════════════════════════
// CALCULADORA
// ════════════════════════════════════════════════
function renderCalculadora() {
  const ct = document.getElementById('tampo-ct-calculadora'); if (!ct) return;

  const materiais = Object.keys(TAMPOS_DB);
  const mat   = TAMPOS_DB[TS.calc.material];
  const acbs  = mat.acabamentos;
  const artigo = TS.calc.artigo;
  const esp   = TS.calc.espessura;

  ct.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 340px;gap:16px;align-items:start">

      <!-- COLUNA ESQUERDA — inputs -->
      <div style="display:flex;flex-direction:column;gap:14px">

        <!-- Selecção de material e artigo -->
        <div class="glass-card" style="padding:16px">
          <div class="tampo-calc-label">Material</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
            ${materiais.map(m => `
              <button onclick="window.calcSelectMaterial('${m}')"
                class="chip ${TS.calc.material === m ? 'active' : ''}">${m}</button>`).join('')}
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <select id="calc-artigo" onchange="window.calcSelectArtigo(this.value)"
              style="flex:1;min-width:180px;padding:8px 10px;background:#1C1C1F;border:1px solid var(--glass-brd);border-radius:8px;font-family:var(--sans);font-size:12px;color:var(--t1)">
              <option value="">— Seleccionar artigo —</option>
              ${mat.artigos.filter(a => !a.consulta).map(a =>
                `<option value="${a.nome}" ${artigo?.nome === a.nome ? 'selected' : ''}>${a.grupo ? '['+a.grupo+'] ' : ''}${a.nome}</option>`
              ).join('')}
            </select>
            <div style="display:flex;gap:4px">
              ${mat.espessuras.map(e => `
                <button onclick="window.calcSelectEsp('${e}')"
                  class="btn-sec ${TS.calc.espessura === e ? 'active' : ''}" style="padding:6px 12px;font-size:11px">
                  ${e}
                </button>`).join('')}
            </div>
          </div>
          ${artigo ? `
            <div style="display:flex;align-items:center;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.07)">
              <div style="flex:1;font-size:13px;font-weight:600;color:var(--t1)">${artigo.nome}</div>
              <button onclick="window.copiar('${artigo.c1[esp]}',this)"
                style="padding:4px 10px;border-radius:6px;background:rgba(196,97,42,.1);border:1px solid rgba(196,97,42,.25);color:rgba(255,190,152,.7);font-family:var(--mono);font-size:11px;font-weight:700;cursor:pointer"
                title="Copiar C1 base">
                C1: ${fmtC1(artigo.c1[esp])} ⎘
              </button>
              <div style="font-family:var(--mono);font-size:13px;color:var(--t2)">
                PVP: ${fmtPVP(artigo.pvp[esp])}/m²
              </div>
            </div>` : ''}
        </div>

        <!-- Peças de tampo -->
        ${renderSecaoPecas('calc', 'pecas', '🪨 Tampo — Peças')}

        <!-- Revestimento -->
        <!-- Revestimento com espessura -->
      <div class="glass-card" style="padding:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div class="tampo-calc-label">🧱 Revestimento — Peças</div>
          <div style="display:flex;gap:4px;align-items:center">
            <span style="font-size:9px;color:var(--t4);margin-right:2px">Espessura:</span>
            ${(TAMPOS_DB[TS.calc.material].espessuras).map(e => `
              <button onclick="window.calcSelectEspRev('${e}')"
                class="btn-sec ${(TS.calc.espRev||TS.calc.espessura) === e ? 'active' : ''}"
                style="padding:4px 9px;font-size:10px">${e}</button>`).join('')}
          </div>
        </div>
        ${renderSecaoPecasInner('calc', 'revestimento')}
      </div>

        <!-- Acabamentos -->
        <div class="glass-card" style="padding:16px">
          <div class="tampo-calc-label" style="margin-bottom:12px">⚙️ Acabamentos</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${acbs.map(acb => `
              <div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:8px">
                <div style="flex:1;font-size:12px;color:var(--t2)">${acb.nome}</div>
                <button onclick="window.copiar('${acb.c1}',this)" title="Copiar C1"
                  style="font-family:var(--mono);font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(196,97,42,.08);border:1px solid rgba(196,97,42,.18);color:rgba(255,190,152,.6);cursor:pointer;white-space:nowrap">
                  C1:${fmtC1(acb.c1)} ⎘
                </button>
                <div style="font-family:var(--mono);font-size:10px;color:var(--t4);white-space:nowrap">PVP:${fmtPVP(acb.pvp)}/${acb.unid}</div>
                <input type="number" min="0" step="${acb.unid === 'ml' ? '0.1' : '1'}"
                  value="${TS.calc.acabamentos[acb.id] || ''}"
                  placeholder="0"
                  oninput="window.calcAcabamento('${acb.id}',this.value)"
                  style="width:64px;padding:5px 8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;font-family:var(--mono);font-size:12px;color:var(--t1);text-align:center">
                <span style="font-size:10px;color:var(--t4);width:20px">${acb.unid}</span>
              </div>`).join('')}
          </div>
        </div>

        <!-- Transporte -->
        <div class="glass-card" style="padding:16px">
          <div class="tampo-calc-label" style="margin-bottom:10px">🚚 Transporte e Montagem</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button onclick="window.calcTransporte(null)"
              class="chip ${TS.calc.transporte === null ? 'active' : ''}">Sem transporte</button>
            ${TRANSPORTE.map((t, i) => `
              <button onclick="window.calcTransporte(${i})"
                class="chip ${TS.calc.transporte === i ? 'active' : ''}">
                ${t.label} — ${fmtPVP(t.pvp)}
              </button>`).join('')}
          </div>
        </div>

      </div>

      <!-- COLUNA DIREITA — resumo -->
      ${renderResumoCalc()}
    </div>`;
}

function renderSecaoPecas(ctx, campo, titulo) {
  const state = TS[ctx];
  const pecas = state[campo];
  let totalM2 = 0;
  pecas.forEach(p => {
    const c = parseFloat(p.comp) || 0;
    const l = parseFloat(p.larg) || 0;
    if (c > 0 && l > 0) totalM2 += c * l;
  });

  return `
    <div class="glass-card" style="padding:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div class="tampo-calc-label">${titulo}</div>
        <div style="font-family:var(--mono);font-size:12px;font-weight:700;color:rgba(255,190,152,.7)">
          Total: ${totalM2.toFixed(4)} m²
        </div>
      </div>

      <!-- Cabeçalho -->
      <div style="display:grid;grid-template-columns:1fr 1fr 80px 28px;gap:6px;margin-bottom:6px;padding:0 4px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4)">Comp (m)</div>
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4)">Larg (m)</div>
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4);text-align:right">m²</div>
        <div></div>
      </div>

      <!-- Linhas de peças -->
      <div id="${ctx}-${campo}-linhas">
        ${pecas.map((p, i) => renderLinhaPeca(ctx, campo, p, i)).join('')}
      </div>

      <button onclick="window.calcAddPeca('${ctx}','${campo}')"
        style="width:100%;margin-top:8px;padding:7px;border-radius:7px;background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.12);color:var(--t4);font-size:11px;font-weight:600;cursor:pointer;transition:all .15s">
        + Adicionar peça
      </button>
    </div>`;
}

function renderLinhaPeca(ctx, campo, p, idx) {
  const c = parseFloat(p.comp) || 0;
  const l = parseFloat(p.larg) || 0;
  const m2 = c > 0 && l > 0 ? (c * l).toFixed(4) : '—';
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr 80px 28px;gap:6px;margin-bottom:5px" id="peca-${p.id}">
      <input type="number" min="0" step="0.01" value="${p.comp}"
        placeholder="ex: 3.65"
        oninput="window.calcUpdatePeca('${ctx}','${campo}','${p.id}','comp',this.value)"
        style="padding:7px 9px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:7px;font-family:var(--mono);font-size:12px;color:var(--t1)">
      <input type="number" min="0" step="0.01" value="${p.larg}"
        placeholder="0.65"
        oninput="window.calcUpdatePeca('${ctx}','${campo}','${p.id}','larg',this.value)"
        style="padding:7px 9px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:7px;font-family:var(--mono);font-size:12px;color:var(--t1)">
      <div style="padding:7px 4px;font-family:var(--mono);font-size:12px;color:rgba(255,190,152,.7);text-align:right;align-self:center">${m2}</div>
      <button onclick="window.calcRemPeca('${ctx}','${campo}','${p.id}')"
        style="width:26px;height:26px;border-radius:6px;background:rgba(192,57,43,.2);border:1px solid rgba(192,57,43,.3);color:#ffb3a0;font-size:13px;cursor:pointer;align-self:center">×</button>
    </div>`;
}

function calcTotalM2(pecas) {
  return pecas.reduce((s, p) => {
    const c = parseFloat(p.comp) || 0;
    const l = parseFloat(p.larg) || 0;
    return s + (c > 0 && l > 0 ? c * l : 0);
  }, 0);
}

function renderResumoCalc() {
  const artigo  = TS.calc.artigo;
  const esp     = TS.calc.espessura;
  const mat     = TAMPOS_DB[TS.calc.material];
  const acbs    = mat.acabamentos;

  const m2Tampo = calcTotalM2(TS.calc.pecas);
  const m2Rev   = calcTotalM2(TS.calc.revestimento);
  const pvpTampo= artigo ? (artigo.pvp[esp] || 0) * m2Tampo : 0;
  const pvpRev  = artigo ? (artigo.pvp[esp] || 0) * m2Rev   : 0;

  let pvpAcb = 0;
  let linhasAcb = '';
  acbs.forEach(acb => {
    const qty = parseFloat(TS.calc.acabamentos[acb.id]) || 0;
    if (qty > 0) {
      const val = acb.pvp * qty;
      pvpAcb += val;
      linhasAcb += `
        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px">
          <span style="color:var(--t3)">${acb.nome} ×${qty}</span>
          <span style="font-family:var(--mono);color:var(--t2)">${fmtPVP(val)}</span>
        </div>`;
    }
  });

  const transp = TS.calc.transporte !== null ? TRANSPORTE[TS.calc.transporte] : null;
  const pvpTransp = transp ? transp.pvp : 0;
  const pvpTotal  = pvpTampo + pvpRev + pvpAcb + pvpTransp;

  return `
    <div style="position:sticky;top:74px">
      <div class="glass-card" style="padding:18px;display:flex;flex-direction:column;gap:12px">
        <!-- Cabeçalho resumo -->
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:var(--t4)">
          Resumo
        </div>

        ${artigo ? `
          <!-- Artigo seleccionado + C1 base -->
          <div style="padding:10px;background:rgba(196,97,42,.07);border:1px solid rgba(196,97,42,.18);border-radius:10px">
            <div style="font-size:11px;color:var(--t3);margin-bottom:4px">Artigo seleccionado</div>
            <div style="font-size:13px;font-weight:600;color:var(--t1);margin-bottom:8px">${artigo.nome} · ${esp}</div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:10px;color:var(--t4)">C1 base (para copiar)</span>
              <button onclick="window.copiar('${artigo.c1[esp]}',this)"
                style="font-family:var(--mono);font-size:13px;font-weight:700;padding:4px 10px;border-radius:6px;background:rgba(196,97,42,.15);border:1px solid rgba(196,97,42,.3);color:rgba(255,190,152,.85);cursor:pointer;transition:all .15s">
                ${fmtC1(artigo.c1[esp])} ⎘
              </button>
            </div>
          </div>
        ` : `
          <div style="font-size:12px;color:var(--t4);text-align:center;padding:20px 0">
            Selecciona um artigo para ver o resumo
          </div>`}

        <!-- Linhas de detalhe PVP -->
        ${artigo && (m2Tampo > 0 || m2Rev > 0) ? `
          <div style="border-top:1px solid rgba(255,255,255,.07);padding-top:10px;display:flex;flex-direction:column;gap:3px">
            ${m2Tampo > 0 ? `
              <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px">
                <span style="color:var(--t3)">Tampo ${m2Tampo.toFixed(4)}m²</span>
                <span style="font-family:var(--mono);color:var(--t2)">${fmtPVP(pvpTampo)}</span>
              </div>` : ''}
            ${m2Rev > 0 ? `
              <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px">
                <span style="color:var(--t3)">Revestimento ${m2Rev.toFixed(4)}m²</span>
                <span style="font-family:var(--mono);color:var(--t2)">${fmtPVP(pvpRev)}</span>
              </div>` : ''}
            ${linhasAcb}
            ${transp ? `
              <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px">
                <span style="color:var(--t3)">Transporte ${transp.label}</span>
                <span style="font-family:var(--mono);color:var(--t2)">${fmtPVP(pvpTransp)}</span>
              </div>` : ''}
          </div>

          <!-- Total PVP -->
          <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 14px">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4);margin-bottom:6px">
              Total PVP (cliente)
            </div>
            <div style="font-family:var(--serif);font-size:26px;color:var(--t1)">
              ${fmtPVP(pvpTotal)}
            </div>
          </div>
        ` : ''}

        <!-- Limpar -->
        ${artigo ? `
          <button onclick="window.calcParaComparador()"
            style="width:100%;padding:8px;border-radius:7px;background:rgba(42,107,122,.1);border:1px solid rgba(42,107,122,.25);color:rgba(150,220,230,.7);font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;margin-bottom:6px">
            ⚖️ Comparar com outro tampo →
          </button>
          <button onclick="window.calcLimpar()"
            style="width:100%;padding:7px;border-radius:7px;background:transparent;border:1px solid rgba(255,255,255,.08);color:var(--t4);font-size:11px;cursor:pointer;transition:all .15s">
            ↺ Limpar cálculo
          </button>` : ''}
      </div>
    </div>`;
}

// Funções de estado da calculadora
window.calcSelectMaterial = function(m) {
  TS.calc.material  = m;
  TS.calc.artigo    = null;
  TS.calc.espessura = TAMPOS_DB[m].espessuras[0];
  renderCalculadora();
};
window.calcSelectArtigo = function(nome) {
  const mat = TAMPOS_DB[TS.calc.material];
  TS.calc.artigo = mat.artigos.find(a => a.nome === nome) || null;
  renderCalculadora();
};
window.calcSelectEsp = function(esp) {
  TS.calc.espessura = esp;
  renderCalculadora();
};
window.calcAddPeca = function(ctx, campo) {
  TS[ctx][campo].push({ id: gerarIdPeca(), comp: '', larg: '0.65' });
  renderCalculadora();
  if (ctx === 'comp') renderComparador();
};
window.calcRemPeca = function(ctx, campo, id) {
  TS[ctx][campo] = TS[ctx][campo].filter(p => p.id !== id);
  renderCalculadora();
  if (ctx === 'comp') renderComparador();
};
window.calcUpdatePeca = function(ctx, campo, id, key, val) {
  const p = TS[ctx][campo].find(x => x.id === id);
  if (p) p[key] = val;
  // Actualizar apenas o m² da linha sem re-render total
  const linha = document.getElementById('peca-' + id);
  if (linha) {
    const c = parseFloat(TS[ctx][campo].find(x => x.id === id)?.comp) || 0;
    const l = parseFloat(TS[ctx][campo].find(x => x.id === id)?.larg) || 0;
    const m2el = linha.children[2];
    if (m2el) m2el.textContent = c > 0 && l > 0 ? (c * l).toFixed(4) : '—';
  }
  // Actualizar totais no resumo
  if (ctx === 'calc') updateResumoCalc();
  if (ctx === 'comp') updateResumoComp();
};
window.calcAcabamento = function(id, val) {
  TS.calc.acabamentos[id] = parseFloat(val) || 0;
  updateResumoCalc();
};
window.calcTransporte = function(idx) {
  TS.calc.transporte = idx;
  renderCalculadora();
};
window.calcLimpar = function() {
  TS.calc.pecas = [{ id: gerarIdPeca(), comp: '', larg: '0.65' }];
  TS.calc.revestimento = [];
  TS.calc.acabamentos  = {};
  TS.calc.transporte   = null;
  renderCalculadora();
};

function updateResumoCalc() {
  const res = document.querySelector('#tampo-ct-calculadora [style*="sticky"]');
  if (res) {
    const mat = TAMPOS_DB[TS.calc.material];
    const esp = TS.calc.espessura;
    const artigo = TS.calc.artigo;
    const m2Tampo = calcTotalM2(TS.calc.pecas);
    const m2Rev   = calcTotalM2(TS.calc.revestimento);
    const pvpTampo = artigo ? (artigo.pvp[esp] || 0) * m2Tampo : 0;
    const pvpRev   = artigo ? (artigo.pvp[esp] || 0) * m2Rev   : 0;
    let pvpAcb = 0;
    mat.acabamentos.forEach(acb => {
      const qty = parseFloat(TS.calc.acabamentos[acb.id]) || 0;
      pvpAcb += acb.pvp * qty;
    });
    const transp   = TS.calc.transporte !== null ? TRANSPORTE[TS.calc.transporte] : null;
    const pvpTotal = pvpTampo + pvpRev + pvpAcb + (transp ? transp.pvp : 0);
    const totalEl  = res.querySelector('[style*="font-serif"]');
    if (totalEl) totalEl.textContent = fmtPVP(pvpTotal);
  }
}

// ════════════════════════════════════════════════
// COMPARADOR
// ════════════════════════════════════════════════
function renderComparador() {
  const ct = document.getElementById('tampo-ct-comparador'); if (!ct) return;

  const materiais = Object.keys(TAMPOS_DB);
  const lados = ['A', 'B'];

  ct.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px">

      <!-- Selecção de artigos A e B -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${lados.map(l => {
          const s   = TS.comp.lado[l];
          const mat = TAMPOS_DB[s.material];
          return `
            <div class="glass-card" style="padding:14px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
                <span style="width:22px;height:22px;border-radius:50%;background:${l==='A' ? 'rgba(196,97,42,.3)' : 'rgba(42,107,122,.3)'};border:1px solid ${l==='A' ? 'rgba(196,97,42,.5)' : 'rgba(42,107,122,.5)'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${l==='A' ? 'rgba(255,190,152,.8)' : 'rgba(150,220,230,.8)'}">${l}</span>
                <div class="tampo-calc-label" style="flex:1">Tampo ${l}</div>
                ${TS.comp.lado[l].artigo ? `
                  <button onclick="window.compLimparLado('${l}')" title="Limpar este lado"
                    style="padding:3px 8px;border-radius:5px;background:rgba(192,57,43,.15);border:1px solid rgba(192,57,43,.25);color:#ffb3a0;font-size:10px;cursor:pointer">
                    ✕ Limpar
                  </button>` : ''}
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
                ${materiais.map(m => `
                  <button onclick="window.compSelectMaterial('${l}','${m}')"
                    class="chip ${s.material === m ? 'active' : ''}" style="font-size:10px;padding:3px 8px">${m}</button>`).join('')}
              </div>
              <select onchange="window.compSelectArtigo('${l}',this.value)"
                style="width:100%;padding:8px 10px;background:#1C1C1F;border:1px solid var(--glass-brd);border-radius:8px;font-family:var(--sans);font-size:12px;color:var(--t1);margin-bottom:8px">
                <option value="">— Seleccionar —</option>
                ${mat.artigos.filter(a => !a.consulta).map(a =>
                  `<option value="${a.nome}" ${s.artigo?.nome === a.nome ? 'selected' : ''}>${a.grupo ? '['+a.grupo+'] ' : ''}${a.nome}</option>`
                ).join('')}
              </select>
              <div style="display:flex;gap:4px">
                ${mat.espessuras.map(e => `
                  <button onclick="window.compSelectEsp('${l}','${e}')"
                    class="btn-sec ${s.espessura === e ? 'active' : ''}" style="padding:5px 10px;font-size:10px">${e}</button>`).join('')}
              </div>
              ${s.artigo ? `
                <div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.07)">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <button onclick="window.copiar('${s.artigo.c1[s.espessura]}',this)"
                      style="font-family:var(--mono);font-size:11px;padding:3px 8px;border-radius:5px;background:rgba(196,97,42,.1);border:1px solid rgba(196,97,42,.2);color:rgba(255,190,152,.7);cursor:pointer">
                      C1: ${fmtC1(s.artigo.c1[s.espessura])} ⎘
                    </button>
                    <span style="font-family:var(--mono);font-size:12px;color:var(--t2)">${fmtPVP(s.artigo.pvp[s.espessura])}/m²</span>
                  </div>
                </div>` : ''}
            </div>`;
        }).join('')}
      </div>

      <!-- Peças partilhadas -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          ${renderSecaoPecas('comp', 'pecas', '🪨 Tampo — Peças (partilhadas)')}
        </div>
        <div>
          ${renderSecaoPecas('comp', 'revestimento', '🧱 Revestimento (partilhado)')}
        </div>
      </div>

      <!-- Transporte -->
      <div class="glass-card" style="padding:14px">
        <div class="tampo-calc-label" style="margin-bottom:8px">🚚 Transporte (partilhado)</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button onclick="window.compTransporte(null)" class="chip ${TS.comp.transporte === null ? 'active' : ''}">Sem transporte</button>
          ${TRANSPORTE.map((t, i) => `
            <button onclick="window.compTransporte(${i})"
              class="chip ${TS.comp.transporte === i ? 'active' : ''}">
              ${t.label} — ${fmtPVP(t.pvp)}
            </button>`).join('')}
        </div>
      </div>

      <!-- RESULTADO COMPARATIVO -->
      ${renderResultadoComp()}
    </div>`;
}

function renderResultadoComp() {
  const lados = ['A', 'B'];
  const m2Tampo = calcTotalM2(TS.comp.pecas);
  const m2Rev   = calcTotalM2(TS.comp.revestimento);
  const transp  = TS.comp.transporte !== null ? TRANSPORTE[TS.comp.transporte] : null;
  const pvpTransp = transp ? transp.pvp : 0;

  const totais = lados.map(l => {
    const s   = TS.comp.lado[l];
    const mat = TAMPOS_DB[s.material];
    if (!s.artigo) return null;
    const esp = s.espessura;
    const pvpM2 = s.artigo.pvp[esp] || 0;
    const pvpTampo = pvpM2 * m2Tampo;
    const pvpRev   = pvpM2 * m2Rev;
    let pvpAcb = 0;
    mat.acabamentos.forEach(acb => {
      const qty = parseFloat(TS.comp.acabamentos[acb.id]) || 0;
      pvpAcb += acb.pvp * qty;
    });
    return pvpTampo + pvpRev + pvpAcb + pvpTransp;
  });

  if (!totais[0] && !totais[1]) {
    return `<div style="text-align:center;padding:24px;color:var(--t4);font-size:12px">Selecciona dois artigos para ver a comparação</div>`;
  }

  const diff    = totais[0] !== null && totais[1] !== null ? Math.abs(totais[0] - totais[1]) : null;
  const maisCaroL = diff !== null ? (totais[0] > totais[1] ? 'A' : 'B') : null;

  return `
    <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center">
      ${lados.map((l, i) => {
        const s = TS.comp.lado[l];
        const total = totais[i];
        const cor = l === 'A' ? 'rgba(196,97,42,.3)' : 'rgba(42,107,122,.3)';
        const corT = l === 'A' ? 'rgba(255,190,152,.9)' : 'rgba(150,220,230,.9)';
        const maiorBg = maisCaroL === l ? 'rgba(192,57,43,.1)' : 'rgba(58,122,68,.1)';
        const maiorBrd= maisCaroL === l ? 'rgba(192,57,43,.25)' : 'rgba(58,122,68,.25)';
        return `
          <div style="background:${maiorBg};border:1.5px solid ${maiorBrd};border-radius:14px;padding:16px;text-align:center">
            <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:8px">
              <span style="width:20px;height:20px;border-radius:50%;background:${cor};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${corT}">${l}</span>
              <span style="font-size:12px;font-weight:600;color:var(--t1)">${s.artigo ? s.artigo.nome : '—'}</span>
            </div>
            ${s.artigo ? `
              <div style="font-family:var(--serif);font-size:28px;color:var(--t1);margin-bottom:4px">
                ${total !== null ? fmtPVP(total) : '—'}
              </div>
              <div style="font-size:10px;color:var(--t4)">${s.material} · ${s.espessura}</div>
              ${maisCaroL === l ?
                `<div style="margin-top:8px;font-size:10px;font-weight:700;color:#ff8a80">▲ Mais caro</div>` :
                `<div style="margin-top:8px;font-size:10px;font-weight:700;color:rgba(150,220,150,.8)">▼ Mais económico</div>`}
            ` : '<div style="font-size:12px;color:var(--t4)">Sem artigo</div>'}
          </div>`;
      }).join('')}

      <!-- Delta central -->
      <div style="text-align:center">
        ${diff !== null ? `
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4);margin-bottom:6px">Diferença</div>
          <div style="font-family:var(--mono);font-size:20px;font-weight:700;color:rgba(255,190,152,.8)">
            ${fmtPVP(diff)}
          </div>
          <div style="font-size:10px;color:var(--t4);margin-top:4px">
            +${((diff / Math.min(...totais.filter(t => t !== null))) * 100).toFixed(1)}%
          </div>
        ` : '<div style="font-size:22px;color:var(--t4)">vs</div>'}
      </div>
    </div>`;
}

// Funções de estado do comparador
window.compSelectMaterial = function(l, m) {
  TS.comp.lado[l].material  = m;
  TS.comp.lado[l].artigo    = null;
  TS.comp.lado[l].espessura = TAMPOS_DB[m].espessuras[0];
  renderComparador();
};
window.compSelectArtigo = function(l, nome) {
  const mat = TAMPOS_DB[TS.comp.lado[l].material];
  TS.comp.lado[l].artigo = mat.artigos.find(a => a.nome === nome) || null;
  renderComparador();
};
window.compSelectEsp = function(l, esp) {
  TS.comp.lado[l].espessura = esp;
  renderComparador();
};
window.compTransporte = function(idx) {
  TS.comp.transporte = idx;
  renderComparador();
};
function updateResumoComp() { renderComparador(); }

// Expor init
window.switchTampoTab = switchTampoTab;
window.tampoInit      = tampoInit;

// ── Funções adicionais ────────────────────────────────────────────

// renderSecaoPecasInner — versão sem card wrapper (para uso dentro de card próprio)
function renderSecaoPecasInner(ctx, campo) {
  const state = TS[ctx];
  const pecas = state[campo];
  let totalM2 = 0;
  pecas.forEach(p => {
    const c = parseFloat(p.comp) || 0;
    const l = parseFloat(p.larg) || 0;
    if (c > 0 && l > 0) totalM2 += c * l;
  });
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div></div>
      <div style="font-family:var(--mono);font-size:12px;font-weight:700;color:rgba(255,190,152,.7)">
        Total: ${totalM2.toFixed(4)} m²
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 80px 28px;gap:6px;margin-bottom:6px;padding:0 4px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4)">Comp (m)</div>
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4)">Larg (m)</div>
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4);text-align:right">m²</div>
      <div></div>
    </div>
    <div id="${ctx}-${campo}-linhas">
      ${pecas.map((p, i) => renderLinhaPeca(ctx, campo, p, i)).join('')}
    </div>
    <button onclick="window.calcAddPeca('${ctx}','${campo}')"
      style="width:100%;margin-top:8px;padding:7px;border-radius:7px;background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.12);color:var(--t4);font-size:11px;font-weight:600;cursor:pointer">
      + Adicionar peça
    </button>`;
}

// Espessura do revestimento
window.calcSelectEspRev = function(esp) {
  TS.calc.espRev = esp;
  renderCalculadora();
};

// Transferir calc → comparador (aproveitando todas as medidas)
window.calcParaComparador = function() {
  // Copiar peças e acabamentos para o comparador
  TS.comp.pecas        = TS.calc.pecas.map(p => ({...p}));
  TS.comp.revestimento = TS.calc.revestimento.map(p => ({...p}));
  TS.comp.acabamentos  = {...TS.calc.acabamentos};
  TS.comp.transporte   = TS.calc.transporte;
  // Lado A = artigo actual da calculadora
  TS.comp.lado.A.material  = TS.calc.material;
  TS.comp.lado.A.artigo    = TS.calc.artigo;
  TS.comp.lado.A.espessura = TS.calc.espessura;
  // Lado B — material diferente, sem artigo (para o utilizador escolher)
  const outroMat = Object.keys(TAMPOS_DB).find(m => m !== TS.calc.material) || 'Dekton';
  TS.comp.lado.B.material  = outroMat;
  TS.comp.lado.B.artigo    = null;
  TS.comp.lado.B.espessura = TAMPOS_DB[outroMat].espessuras[0];
  switchTampoTab('comparador');
};

// Limpar um lado do comparador
window.compLimparLado = function(l) {
  TS.comp.lado[l].artigo = null;
  renderComparador();
};
