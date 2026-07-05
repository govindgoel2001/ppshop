// Certificate of Analysis links for every compound currently in stock.
// Source: Janoshik third-party lab (verify.janoshik.com / janoshik.com).

export type CoaTest = { label: string; url: string };

export type CoaEntry = {
  name: string;
  code: string;
  inStock: boolean;
  tests: CoaTest[];
  note?: string;
};

export const COA_ENTRIES: CoaEntry[] = [
  {
    name: 'Retatrutide',
    code: 'RT10',
    inStock: true,
    tests: [
      { label: 'Mass / Purity (HPLC)', url: 'https://verify.janoshik.com/tests/157018-Retatrutide_10_mg_2ZIADHSD6LRS' },
    ],
  },
  {
    name: 'Tesamorelin',
    code: 'TESA10',
    inStock: true,
    tests: [
      { label: 'Mass / Purity (HPLC)', url: 'https://janoshik.com/tests/153787-TESA10_FZ52MTSTUB5J' },
      { label: 'Endotoxin (LAL)', url: 'https://janoshik.com/tests/153788-TESA10_1HDFDF14VSD9' },
      { label: '3-Party COA (LS Testing)', url: 'https://janoshik.com/tests/98686-Tessa_H6AQGINN3FM8' },
    ],
  },
  {
    name: 'Semax',
    code: 'SX10',
    inStock: true,
    tests: [
      { label: 'Mass / Purity (HPLC)', url: 'https://janoshik.com/tests/123504-SX10_6NDZF381YENX' },
    ],
  },
  {
    name: 'BPC-157',
    code: 'BPC10',
    inStock: true,
    tests: [
      { label: 'Mass / Purity (HPLC)', url: 'https://janoshik.com/tests/105627-BPC10_1KWNMRQ5BUSC' },
    ],
  },
  {
    name: 'Tirzepatide',
    code: 'T20',
    inStock: true,
    tests: [
      { label: 'Mass / Purity (HPLC)', url: 'https://janoshik.com/tests/85117-T20_G8LQUXM7GQ6I' },
    ],
  },
  {
    name: 'KLOW Blend',
    code: 'KLOW80',
    inStock: true,
    tests: [
      { label: 'Mass / Purity (HPLC)', url: 'https://janoshik.com/tests/77797-Klow80_9ZMQ85JEK4PW' },
    ],
  },
  {
    name: 'Bacteriostatic Water',
    code: 'BAC',
    inStock: true,
    tests: [
      { label: 'Composition (Benzyl Alcohol)', url: 'https://verify.janoshik.com/tests/108612-Bacteriostatic_Water_3ml_T4XMD1ZUBTYK' },
    ],
  },
  {
    name: 'GHK-Cu',
    code: 'GHKCU50',
    inStock: true,
    tests: [],
    note: 'Batch test report pending — request the current lot COA via WhatsApp.',
  },
];
