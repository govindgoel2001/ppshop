export type Variant = {
  sp: string;
  ds: string;
  pr: number;
  oos?: boolean;
};

export type Faq = { q: string; a: string };

export type Citation = {
  year: string;
  title: string;
  journal: string;
  url: string;
};

export type Janoshik = {
  purity: string;
  quantity: string;
  taskNumber: string;
  verifyUrl: string;
  image: string;
  date: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  oos?: boolean;
  variants: Variant[];
  image: string;
  desc: string;
  tagline: string;
  dose: string;
  mw: string;
  seq: string;
  cat: string;
  janoshik?: Janoshik;
  faqs: Faq[];
  citations: Citation[];
};

const commonFaqs: Faq[] = [
  { q: 'How is this shipped?', a: 'All compounds ship cold-chain in an insulated pack with ice gel. Express courier, typically 2–4 days pan-India.' },
  { q: 'What is the storage protocol?', a: 'Store lyophilised powder at −20°C. After reconstituting with bacteriostatic water, store at 2–8°C and use within 28 days.' },
  { q: 'Is a Certificate of Analysis included?', a: 'Yes. A QR-linked COA showing HPLC purity trace, mass spec, and LAL endotoxin result from an ISO 17025-accredited lab ships with every vial.' },
  { q: 'What assays are run on each batch?', a: 'Reverse-phase C18 HPLC for purity and area%, ESI-MS for molecular weight confirmation, and LAL endotoxin screening.' },
  { q: 'Is this for human use?', a: 'No. All products are sold strictly for in-vitro laboratory research. Not intended for human or animal administration.' },
];

export const PRODUCTS: Product[] = [
  {
    id: 2,
    slug: 'tirzepatide',
    name: 'Tirzepatide',
    category: 'Weight Loss',
    variants: [
      { sp: '10mg per vial', ds: '10mg', pr: 2000 },
      { sp: '20mg per vial', ds: '20mg', pr: 4000 },
    ],
    image: 'tirzepatide.png',
    desc: 'First-in-class dual GIP/GLP-1 receptor agonist. The dual mechanism produces synergistic metabolic effects exceeding mono-agonists, with significant research interest in glycemic control, weight management, and lipid profiles.',
    tagline: 'Dual-pathway metabolic research. Both incretins, one scaffold.',
    dose: '2.5 - 15mg weekly, subcutaneous',
    mw: '4813.45 g/mol',
    seq: 'GIP/GLP-1 dual agonist (39 AA)',
    cat: 'Metabolic',
    janoshik: {
      purity: '99.505%',
      quantity: '21.65 mg',
      taskNumber: '85117',
      verifyUrl: 'https://verify.janoshik.com/tests/85117-T20_G8LQUXM7GQ6I',
      image: '/img/testing/tirz20-hplc.png',
      date: '2025-10-29',
    },
    faqs: commonFaqs,
    citations: [
      { year: '2023', title: 'Tirzepatide Once Weekly for the Treatment of Obesity — SURMOUNT-1', journal: 'NEJM · doi:10.1056/NEJMoa2206038', url: 'https://doi.org/10.1056/NEJMoa2206038' },
      { year: '2021', title: 'Tirzepatide versus Semaglutide Once Weekly — SURPASS-2', journal: 'NEJM · doi:10.1056/NEJMoa2107519', url: 'https://doi.org/10.1056/NEJMoa2107519' },
    ],
  },
  {
    id: 3,
    slug: 'retatrutide',
    name: 'Retatrutide',
    category: 'Weight Loss',
    variants: [
      { sp: '10mg per vial', ds: '10mg', pr: 3199 },
      { sp: '20mg per vial', ds: '20mg', pr: 6400, oos: true },
    ],
    image: 'retatrutide.png',
    desc: 'Novel triple agonist targeting GLP-1, GIP, and glucagon receptors simultaneously. The glucagon component adds thermogenic and lipolytic effects, representing a potential advancement over dual agonists.',
    tagline: 'Triple agonism. Unprecedented metabolic research leverage.',
    dose: '1 - 12mg weekly, subcutaneous',
    mw: '~4400 g/mol',
    seq: 'Triple agonist (39 AA)',
    cat: 'Weight Loss',
    janoshik: {
      purity: '99.790%',
      quantity: '10.13 mg',
      taskNumber: '157018',
      verifyUrl: 'https://verify.janoshik.com/tests/157018-Retatrutide_10_mg_2ZIADHSD6LRS',
      image: '/img/testing/reta10-hplc.png',
      date: '2025-10-29',
    },
    faqs: commonFaqs,
    citations: [
      { year: 'Dec 2025', title: 'TRIUMPH-4 Phase 3 — Retatrutide delivered average 26.2% weight loss at 96 weeks', journal: 'Lilly Investor Relations · TRIUMPH-4', url: 'https://investor.lilly.com/news-releases/news-release-details/lillys-triple-agonist-retatrutide-delivered-weight-loss-average' },
      { year: 'Oct 2025', title: 'TRIUMPH Programme Rationale and Trial Design', journal: 'PubMed · PMID 41090431', url: 'https://pubmed.ncbi.nlm.nih.gov/41090431/' },
      { year: 'Aug 2025', title: 'Body Composition Substudy of Retatrutide Phase 2', journal: 'PubMed · PMID 40609566', url: 'https://pubmed.ncbi.nlm.nih.gov/40609566/' },
      { year: 'Jul 2025', title: 'Retatrutide in Obesity: Systematic Review and Meta-Analysis', journal: 'PubMed · PMID 40728138', url: 'https://pubmed.ncbi.nlm.nih.gov/40728138/' },
      { year: '2024', title: 'Structural Insights into Triple Agonism of Retatrutide', journal: 'Cell Research · doi:10.1038/s41421-024-00700-0', url: 'https://doi.org/10.1038/s41421-024-00700-0' },
      { year: '2023', title: 'Retatrutide Phase 2 Dose-Finding — NEJM', journal: 'New England Journal of Medicine · doi:10.1056/NEJMoa2301972', url: 'https://doi.org/10.1056/NEJMoa2301972' },
    ],
  },
  {
    id: 4,
    slug: 'bpc-157',
    name: 'BPC-157',
    category: 'Healing & Recovery',
    variants: [{ sp: '10mg per vial', ds: '10mg', pr: 1990 }],
    image: 'bpc-157.png',
    desc: 'A 15-amino-acid peptide derived from human gastric juice. Extensively studied for accelerated healing of tendons, ligaments, muscle, and bone. Promotes angiogenesis and modulates nitric oxide pathways.',
    tagline: 'Tissue repair from within. Site-specific healing cascade.',
    dose: '200 - 500mcg 1-2x daily, subcutaneous',
    mw: '1419.53 g/mol',
    seq: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
    cat: 'Healing & Recovery',
    janoshik: {
      purity: '99.765%',
      quantity: '11.72 mg',
      taskNumber: '105627',
      verifyUrl: 'https://verify.janoshik.com/tests/105627-BPC10_1KWNMRQ5BUSC',
      image: '/img/testing/bpc10-hplc.png',
      date: '2026-02-09',
    },
    faqs: commonFaqs,
    citations: [
      { year: '2023', title: 'BPC-157 and Tendon Healing — Systematic Review', journal: 'Curr Pharm Des · PMID 36173050', url: 'https://pubmed.ncbi.nlm.nih.gov/36173050/' },
      { year: '2021', title: 'Body Protection Compound-157: Candidate Medication for Wound Healing', journal: 'Front Pharmacol · PMC7837306', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7837306/' },
    ],
  },
  {
    id: 5,
    slug: 'tb-500',
    name: 'TB-500',
    category: 'Healing & Recovery',
    oos: true,
    variants: [{ sp: '10mg per vial', ds: '10mg', pr: 3400 }],
    image: 'tb-500.png',
    desc: 'A 43-amino-acid peptide central to tissue repair and regeneration. Sequesters actin monomers, promotes cell migration, and has demonstrated effects on cardiac tissue repair and inflammation reduction.',
    tagline: 'Systemic tissue regeneration. Actin sequestration at scale.',
    dose: '2 - 5mg 2x weekly (loading), subcutaneous',
    mw: '4963.50 g/mol',
    seq: 'Thymosin Beta-4 (43 AA)',
    cat: 'Healing & Recovery',
    faqs: commonFaqs,
    citations: [
      { year: '2022', title: 'Thymosin Beta-4 and Tissue Repair: An Updated Overview', journal: 'Curr Pharm Des · PMID 35236248', url: 'https://pubmed.ncbi.nlm.nih.gov/35236248/' },
    ],
  },
  {
    id: 6,
    slug: 'bpc-tb-combo',
    name: 'BPC+TB Combo',
    category: 'Healing & Recovery',
    oos: true,
    variants: [{ sp: 'BPC-157 5mg + TB-500 5mg', ds: '10mg', pr: 3200 }],
    image: 'bpc157tb500.png',
    desc: 'Pre-blended stack of BPC-157 and TB-500. Combines BPC-157\'s site-specific healing with TB-500\'s systemic actin-sequestering and anti-inflammatory effects for comprehensive tissue regeneration research.',
    tagline: 'Site-specific meets systemic. The complete healing stack.',
    dose: 'Per protocol, subcutaneous',
    mw: 'Blend',
    seq: 'BPC-157 + TB-500',
    cat: 'Healing & Recovery',
    faqs: commonFaqs,
    citations: [],
  },
  {
    id: 8,
    slug: 'ghk-cu',
    name: 'GHK-Cu',
    category: 'Skin & Anti-Aging',
    variants: [{ sp: '50mg per vial', ds: '50mg', pr: 1500 }],
    image: 'ghk-cu.png',
    desc: 'A naturally occurring tripeptide-copper complex. Over 4,000 genes modulated by GHK-Cu have been identified, with effects including collagen synthesis, antioxidant enzyme upregulation, and dermal fibroblast promotion.',
    tagline: '4,000 genes. One copper-peptide.',
    dose: '1 - 2mg daily, subcutaneous',
    mw: '340.38 g/mol',
    seq: 'Gly-His-Lys:Cu(2+)',
    cat: 'Skin & Anti-Aging',
    // COA pending — batch test report not yet available for this lot.
    faqs: commonFaqs,
    citations: [
      { year: '2023', title: 'GHK-Cu in Skin Regeneration and Wound Healing', journal: 'Cosmetics · doi:10.3390/cosmetics10020051', url: 'https://doi.org/10.3390/cosmetics10020051' },
    ],
  },
  {
    id: 7,
    slug: 'tesamorelin',
    name: 'Tesamorelin',
    category: 'GH',
    variants: [{ sp: '10mg per vial', ds: '10mg', pr: 2999 }],
    image: 'tesamorelin.jpg',
    desc: 'A stabilised 44-amino-acid analogue of growth hormone-releasing hormone (GHRH) — and the only GH-axis secretagogue with FDA approval (as Egrifta, for HIV-associated lipodystrophy). Rather than supplying GH directly, it stimulates the pituitary to release the body\'s own GH in a natural pulsatile pattern. Randomised trials show selective reduction of visceral adipose tissue and liver fat alongside raised IGF-1.',
    tagline: 'The only FDA-approved GHRH analogue. Endogenous GH, visceral-fat selective.',
    dose: '1 - 2mg daily, subcutaneous',
    mw: '5135.9 g/mol',
    seq: 'GHRH(1-44) analogue · 44 AA (trans-3-hexenoyl-Tyr¹)',
    cat: 'GH',
    janoshik: {
      // Displayed as site-standard "99%+" — replace with the exact HPLC % from
      // report 153787 when you have it (the verify link below is the source of truth).
      purity: '99%+',
      quantity: 'Mass, purity & endotoxin tested',
      taskNumber: '153787',
      verifyUrl: 'https://janoshik.com/tests/153787-TESA10_FZ52MTSTUB5J',
      // Endotoxin (LAL) report: https://janoshik.com/tests/153788-TESA10_1HDFDF14VSD9
      image: '/img/testing/tesa-hplc.png',
      date: '', // add the report date from the COA when available
    },
    faqs: [
      { q: 'How is tesamorelin different from growth hormone (GH)?', a: 'Tesamorelin does not supply GH directly. It is a GHRH analogue that stimulates the pituitary to release the body\'s own GH in a natural pulsatile rhythm, raising IGF-1 while preserving physiological feedback. Research use only.' },
      { q: 'What does the research literature show for tesamorelin?', a: 'In randomised controlled trials of HIV-associated abdominal fat accumulation, daily tesamorelin selectively reduced visceral adipose tissue (~15.2% in the pivotal NEJM 2007 trial vs a rise on placebo) and reduced liver fat (JAMA 2014), while increasing IGF-1. It is the only GHRH analogue with FDA approval (Egrifta).' },
      ...commonFaqs,
    ],
    citations: [
      { year: '2007', title: 'Metabolic Effects of a Growth Hormone–Releasing Factor in Patients with HIV', journal: 'NEJM · PMID 18057338', url: 'https://pubmed.ncbi.nlm.nih.gov/18057338/' },
      { year: '2014', title: 'Effect of Tesamorelin on Visceral Fat and Liver Fat in HIV-Infected Patients with Abdominal Fat Accumulation', journal: 'JAMA · doi:10.1001/jama.2014.8334', url: 'https://doi.org/10.1001/jama.2014.8334' },
      { year: '2019', title: 'Tesamorelin Decreases Muscle Fat and Increases Muscle Area in Adults with HIV', journal: 'J Clin Endocrinol Metab · PMC6766405', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6766405/' },
      { year: '2011', title: 'Growth Hormone and Tesamorelin in the Management of HIV-Associated Lipodystrophy', journal: 'Review · PMC3218714', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3218714/' },
    ],
  },
  {
    id: 12,
    slug: 'cjc-ipa-combo',
    name: 'CJC+IPA Combo',
    category: 'GH',
    oos: true,
    variants: [{ sp: 'CJC-1295 5mg + Ipamorelin 5mg', ds: '10mg', pr: 3750 }],
    image: 'cjc_1295.png',
    desc: 'Pre-blended combination of CJC-1295 (no DAC) and Ipamorelin. Synergistic GH release through simultaneous GHRH and ghrelin receptor activation, producing amplified pulsatile GH output.',
    tagline: 'GHRH + ghrelin axis. Amplified, synchronised GH pulse.',
    dose: '100 - 300mcg combined, 1-3x daily, subcutaneous',
    mw: 'Blend',
    seq: 'CJC-1295 + Ipamorelin',
    cat: 'GH',
    faqs: commonFaqs,
    citations: [],
  },
  {
    id: 13,
    slug: 'klow-blend',
    name: 'KLOW Blend',
    category: 'Healing & Recovery',
    variants: [{ sp: 'BPC-157 10mg + TB-500 10mg + KPV 10mg + GHK-Cu 50mg', ds: '80mg', pr: 3990 }],
    image: 'klow.png',
    desc: 'Advanced recovery and skin blend combining TB-500, BPC-157, GHK-Cu, and KPV. Pairs systemic tissue repair with localised healing, anti-inflammatory action via KPV, and copper-peptide skin regeneration for a comprehensive research protocol.',
    tagline: 'Four-peptide synergy. The most comprehensive repair stack.',
    dose: 'Per component protocol, subcutaneous',
    mw: 'Blend',
    seq: 'TB-500 + BPC-157 + GHK-Cu + KPV',
    cat: 'Healing & Recovery',
    janoshik: {
      purity: 'Verified blend',
      quantity: '80 mg total',
      taskNumber: '77797',
      verifyUrl: 'https://janoshik.com/tests/77797-Klow80_9ZMQ85JEK4PW',
      image: '/img/testing/glow70-hplc.png',
      date: '2025-09-01',
    },
    faqs: commonFaqs,
    citations: [],
  },
  {
    id: 14,
    slug: 'bac-water',
    name: 'BAC Water',
    category: 'Supplies',
    variants: [{ sp: '10ml per vial', ds: '10ml', pr: 799 }],
    image: 'bac-water.png',
    desc: 'Bacteriostatic water (0.9% benzyl alcohol) in a sterile 10ml vial. The standard reconstitution medium for research compounds — preservative allows multi-draw use over 28 days without contamination risk.',
    tagline: 'The essential reconstitution medium. Preserves integrity across multi-draw protocols.',
    dose: 'N/A - reconstitution supply',
    mw: 'N/A',
    seq: 'N/A',
    cat: 'Supplies',
    janoshik: {
      purity: 'N/A',
      quantity: 'Benzyl Alcohol: 9.33 mg/ml',
      taskNumber: '108612',
      verifyUrl: 'https://verify.janoshik.com/tests/108612-Bacteriostatic_Water_3ml_T4XMD1ZUBTYK',
      image: '/img/testing/bac-water-hplc.png',
      date: '2026-02-16',
    },
    faqs: [
      { q: 'How should I store this?', a: 'Store at 2–8°C. Keep in original sealed vial until use. Once opened, use within 28 days.' },
      { q: 'Can I use this for all compounds?', a: 'Yes. Bacteriostatic water (0.9% benzyl alcohol) is the standard reconstitution medium for all lyophilised research compounds in our catalogue.' },
      { q: 'How much do I need per vial?', a: 'Typically 1–2 mL per vial, depending on your target concentration.' },
    ],
    citations: [],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getRelatedProducts(current: Product, count = 3): Product[] {
  const sameCategory = PRODUCTS.filter(p => p.id !== current.id && p.category === current.category);
  const others = PRODUCTS.filter(p => p.id !== current.id && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}

export function mono(name: string): string {
  return name.replace(/[-\s+()]/g, '').substring(0, 3).toUpperCase();
}

export function fmt(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}
