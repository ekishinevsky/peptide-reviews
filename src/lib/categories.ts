export interface Category {
  name: string;
  slug: string;
  icon: string;
  peptideSlugs: string[];
}

export const categories: Category[] = [
  {
    name: "Healing & Recovery",
    slug: "healing",
    icon: "🩹",
    peptideSlugs: [
      "bpc-157", "tb-500", "thymosin-beta-4", "wolverine-stack",
      "klow-protocol", "ara-290", "ss-31-elamipretide",
    ],
  },
  {
    name: "Weight Loss",
    slug: "weight-loss",
    icon: "⚖️",
    peptideSlugs: [
      "semaglutide", "tirzepatide", "aod-9604", "retatrutide",
      "cagrilintide", "tesofensine", "mazdutide", "survodutide",
      "orforglipron", "bioglutide", "fat-blaster", "lipo-c",
      "l-carnitine", "5-amino-1mq", "adipotide",
    ],
  },
  {
    name: "Growth Hormone",
    slug: "growth-hormone",
    icon: "📈",
    peptideSlugs: [
      "ipamorelin", "cjc-1295", "cjc-1295-with-dac",
      "cjc-1295-ipamorelin-protocol", "sermorelin", "mk-677",
      "hexarelin", "hgh", "tesamorelin", "igf-1-lr3", "peg-mgf",
    ],
  },
  {
    name: "Cognitive",
    slug: "cognitive",
    icon: "🧠",
    peptideSlugs: [
      "semax", "selank", "dihexa", "dsip",
      "omberacetam-noopept", "na-semax-amidate", "adamax",
      "adalank-ada", "p21", "pe-22-28-mini-spadin",
      "cerebrolysin", "pinealon",
    ],
  },
  {
    name: "Anti-Aging",
    slug: "anti-aging",
    icon: "✨",
    peptideSlugs: [
      "epitalon", "ghk-cu", "nad", "foxo4-dri",
      "mots-c", "glutathione", "cyclic-glycine-proline",
      "epitalon",
    ],
  },
  {
    name: "Skin & Beauty",
    slug: "skin-beauty",
    icon: "💎",
    peptideSlugs: [
      "ghk-cu", "ahk-cu", "snap-8", "glow-protocol",
      "melanotan-i", "melanotan-ii",
    ],
  },
  {
    name: "Immune Support",
    slug: "immune",
    icon: "🛡️",
    peptideSlugs: [
      "thymosin-alpha-1", "ll-37", "kpv", "thymulin", "vip",
      "thymosin-beta-4",
    ],
  },
  {
    name: "Hormones & Sexual Health",
    slug: "hormones",
    icon: "⚡",
    peptideSlugs: [
      "pt-141", "kisspeptin", "hcg", "oxytocin", "trt", "testagen",
    ],
  },
  {
    name: "Muscle & Performance",
    slug: "muscle",
    icon: "💪",
    peptideSlugs: [
      "follistatin-344", "slu-pp-332", "igf-1-lr3", "peg-mgf",
      "mk-677", "hgh",
    ],
  },
  {
    name: "Bioregulators",
    slug: "bioregulators",
    icon: "🧬",
    peptideSlugs: [
      "cartalax", "prostamax", "pinealon", "testagen", "epitalon",
    ],
  },
];

export function getCategoriesForPeptide(peptideSlug: string): Category[] {
  return categories.filter((c) => c.peptideSlugs.includes(peptideSlug));
}
