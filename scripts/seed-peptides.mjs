import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kbzpsgnxdhqtsmwrslma.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtienBzZ254ZGhxdHNtd3JzbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTk4NzksImV4cCI6MjA4NzM3NTg3OX0.If1fMol7nVpCANZpOISsAmsHea4GfJNPaF9Oz0-wVlQ"
);

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const peptides = [
  { name: "5-Amino-1MQ", description: "NNMT inhibitor researched for longevity and metabolic enhancement. May support fat metabolism and cellular energy production." },
  { name: "Adalank (ADA)", description: "N-Acetyl Selank Amidate, an enhanced tuftsin analog with improved bioavailability. Researched for anxiolytic and nootropic properties." },
  { name: "Adamax", description: "Next-generation Semax derivative and nootropic neuropeptide. Enhanced cognitive support with improved stability." },
  { name: "Adipotide", description: "Prohibitin-targeting peptidomimetic studied as an experimental anti-obesity compound. Targets blood vessels supplying fat tissue." },
  { name: "AHK-Cu", description: "Hair growth copper peptide that stimulates dermal papilla cells. Researched for hair follicle regeneration and scalp health." },
  { name: "AOD-9604", description: "Advanced Obesity Drug, a modified hGH fragment (176-191). Studied for fat metabolism without affecting blood sugar or growth." },
  { name: "Ara 290", description: "Tissue-protective peptide and innate repair receptor agonist. Researched for neuropathic pain and tissue repair applications." },
  { name: "Bioglutide", description: "NA-931, a quadruple IGF-1/GLP-1/GIP/Glucagon agonist. Next-generation metabolic peptide with multi-receptor activity." },
  { name: "BPC-157", description: "Synthetic pentadecapeptide (15 amino acids) derived from a protective protein found in human gastric juice. Promotes angiogenesis, enhances collagen synthesis, modulates growth factor expression, and provides localized protection against tissue damage. Extensively studied for healing tendons, ligaments, muscles, bones, and GI protection." },
  { name: "Cagrilintide", description: "Long-acting amylin receptor agonist studied for weight management. Works by reducing appetite and slowing gastric emptying." },
  { name: "Cartalax", description: "Bioregulatory tripeptide researched for cartilage support and joint health. Part of the Khavinson peptide bioregulator family." },
  { name: "Cerebrolysin", description: "Neuropeptide preparation used for neurological recovery. Contains brain-derived neurotrophic factors studied for cognitive and neural repair." },
  { name: "CJC-1295", description: "Short-acting Growth Hormone Releasing Hormone (Mod GRF 1-29). Stimulates pulsatile GH release with a short half-life for more natural GH patterns." },
  { name: "CJC-1295 with DAC", description: "Long-acting Growth Hormone Releasing Hormone with Drug Affinity Complex. Provides sustained GH elevation over days with extended half-life." },
  { name: "CJC-1295/Ipamorelin Protocol", description: "Combined Mod GRF 1-29 + Ipamorelin protocol. Synergistic GHRH + GHRP stack for amplified growth hormone release." },
  { name: "Cyclic Glycine-Proline", description: "cGP, an IGF-1 bioavailability regulator. Naturally occurring cyclic dipeptide that modulates IGF-1 function in the brain." },
  { name: "Dihexa", description: "Synaptogenic peptide researched for cognitive enhancement. Potent HGF/MET receptor agonist studied for neuroplasticity and memory." },
  { name: "DSIP", description: "Delta Sleep-Inducing Peptide, a sleep modulator. Naturally occurring neuropeptide that promotes deep delta-wave sleep patterns." },
  { name: "Epitalon", description: "Synthetic pineal tetrapeptide (Ala-Glu-Asp-Gly) developed by Vladimir Khavinson. Activates telomerase at extremely low concentrations, stimulates melatonin production, and modulates gene expression. Studied over 35 years for anti-aging, with potential lifespan extension of 25-33% in animal studies." },
  { name: "Fat Blaster", description: "Enhanced lipotropic blend combining multiple fat-metabolizing compounds for body composition optimization." },
  { name: "Follistatin 344", description: "Myostatin inhibitor and TGF-beta antagonist. Researched for muscle growth by blocking the muscle-limiting protein myostatin." },
  { name: "FOXO4-DRI", description: "Senolytic peptide that disrupts FOXO4-p53 interaction. Studied for selectively clearing senescent (aged/damaged) cells." },
  { name: "GHK-Cu", description: "Naturally occurring copper tripeptide (Gly-His-Lys) found in human plasma. Levels decline from ~200 ng/ml at age 20 to ~80 ng/ml by age 60. Activates fibroblasts, stimulates collagen and elastin production, promotes angiogenesis, and modulates inflammatory responses. Used for skin regeneration, anti-aging, wound healing, and hair growth." },
  { name: "Glow Protocol", description: "Multi-peptide skin rejuvenation complex combining synergistic peptides for comprehensive skin health and appearance." },
  { name: "Glutathione", description: "Master antioxidant tripeptide (GSH). The body's most important intracellular antioxidant, supporting detoxification and immune function." },
  { name: "HCG", description: "Human Chorionic Gonadotropin, an LH receptor agonist. Used in fertility treatments and to maintain testosterone production during TRT." },
  { name: "Hexarelin", description: "Hexapeptide growth hormone releasing peptide (GHRP). Potent GH secretagogue also studied for cardioprotective properties." },
  { name: "HGH", description: "Human Growth Hormone, 191-amino acid recombinant protein. Identical to endogenous growth hormone, used for GH deficiency and anti-aging." },
  { name: "IGF-1 LR3", description: "Modified Insulin-like Growth Factor-1 analog with extended half-life. Potent growth factor for muscle growth and recovery." },
  { name: "Ipamorelin", description: "Selective growth hormone releasing peptide (GHRP) that stimulates natural GH production from the pituitary gland. Known for its clean profile with minimal effects on cortisol and prolactin. Ideal for body composition, recovery, and anti-aging. Natural GH elevation 30-60 minutes post-injection." },
  { name: "Kisspeptin", description: "KISS1 gene product, a reproductive neuropeptide. Key regulator of the hypothalamic-pituitary-gonadal axis and puberty onset." },
  { name: "KLOW Protocol", description: "Four-peptide regenerative blend combining synergistic compounds for comprehensive tissue repair and recovery." },
  { name: "KPV", description: "Anti-inflammatory tripeptide derived from Alpha-MSH fragment. Studied for gut inflammation, skin conditions, and immune modulation." },
  { name: "L-Carnitine", description: "Amino acid derivative essential for energy and fat metabolism. Transports fatty acids into mitochondria for energy production." },
  { name: "Lipo-C", description: "Lipotropic injection combining MIC (Methionine, Inositol, Choline) with B vitamins for fat metabolism support." },
  { name: "LL-37", description: "Human cathelicidin antimicrobial peptide. Part of the innate immune system, studied for anti-microbial and immune support properties." },
  { name: "Mazdutide", description: "Dual GLP-1/Glucagon receptor agonist. Next-generation weight loss peptide with dual metabolic pathway activation." },
  { name: "Melanotan I", description: "Melanocortin receptor agonist (Afamelanotide). Linear analog of alpha-MSH studied for skin tanning and photoprotection." },
  { name: "Melanotan II", description: "Synthetic melanocortin peptide with broader receptor activity. Studied for tanning, libido enhancement, and appetite suppression." },
  { name: "MK-677", description: "Oral ghrelin receptor agonist and growth hormone secretagogue. Non-peptide compound that increases GH and IGF-1 levels orally." },
  { name: "MOTS-c", description: "Mitochondrial-derived peptide encoded within the mitochondrial genome. Studied as an exercise mimetic for metabolic regulation and insulin sensitivity." },
  { name: "NA Semax Amidate", description: "Enhanced nootropic peptide with improved blood-brain barrier penetration. Modified Semax with N-Acetyl and Amidate groups for superior cognitive effects." },
  { name: "NAD+", description: "Nicotinamide Adenine Dinucleotide, an essential cellular coenzyme. Critical for energy metabolism, DNA repair, and studied extensively in anti-aging therapy." },
  { name: "Omberacetam (Noopept)", description: "Synthetic dipeptide for cognitive enhancement. Potent nootropic with neuroprotective properties, active at very low doses." },
  { name: "Orforglipron", description: "Oral small-molecule GLP-1 receptor agonist. Next-generation non-peptide weight loss compound taken as a daily pill." },
  { name: "Oxytocin", description: "Neurohypophysial peptide hormone involved in social bonding, trust, and emotional regulation. Also used in labor induction and lactation." },
  { name: "P21", description: "CNTF-derived neurogenic peptide. Studied for promoting neurogenesis and cognitive enhancement through CNTF pathway activation." },
  { name: "PE-22-28 (Mini-Spadin)", description: "TREK-1 potassium channel blocker. Short peptide studied for antidepressant effects through TREK-1 channel modulation." },
  { name: "PEG-MGF", description: "Pegylated Mechano Growth Factor. PEGylated form of an IGF-1 splice variant for extended half-life and muscle repair." },
  { name: "Pinealon", description: "Synthetic tripeptide bioregulator for neuroprotection. Targets brain tissue regulation and cognitive support." },
  { name: "Prostamax", description: "Synthetic tetrapeptide prostate bioregulator. Part of the Khavinson bioregulator family for prostate health support." },
  { name: "PT-141", description: "Melanocortin receptor agonist (Bremelanotide) for sexual dysfunction. FDA-approved for hypoactive sexual desire disorder in women, also studied in men." },
  { name: "Retatrutide", description: "Triple GLP-1/GIP/Glucagon receptor agonist. Investigational compound showing up to 24% body weight loss in clinical trials." },
  { name: "Selank", description: "Synthetic tuftsin analog with anxiolytic and nootropic properties. Developed in Russia for anxiety, cognitive enhancement, and immune modulation." },
  { name: "Semaglutide", description: "Long-acting GLP-1 receptor agonist FDA-approved for type 2 diabetes (Ozempic) and weight management (Wegovy). Clinical trials show 15-20% body weight loss. 7-day half-life enables weekly dosing. Also shown to reduce cardiovascular event risk by 20%." },
  { name: "Semax", description: "Synthetic ACTH(4-10) analog for cognitive enhancement. Russian-developed nootropic with neuroprotective and neurotrophic properties." },
  { name: "Sermorelin", description: "GHRH 1-29 analog, the shortest functional fragment of growth hormone releasing hormone. Stimulates natural GH production from the pituitary." },
  { name: "SLU-PP-332", description: "Synthetic pan-ERR agonist studied as an exercise mimetic. Activates estrogen-related receptors to mimic effects of physical exercise." },
  { name: "SNAP-8", description: "Acetyl Octapeptide-3 for anti-wrinkle applications. Topical peptide that modulates SNARE complex to reduce expression lines." },
  { name: "SS-31 (Elamipretide)", description: "Mitochondrial-targeted peptide that concentrates in the inner mitochondrial membrane. Studied for mitochondrial dysfunction, heart failure, and aging." },
  { name: "Survodutide", description: "Dual GLP-1/Glucagon receptor agonist. Investigational metabolic peptide for obesity and metabolic liver disease." },
  { name: "TB-500", description: "Synthetic 7-amino acid fragment (Ac-LKKTETQ) of thymosin beta-4's active actin-binding region. Regulates cell migration, promotes angiogenesis, reduces inflammation, and activates stem cell differentiation. Originally developed for veterinary use, now widely studied for tissue repair, recovery, and connective tissue strengthening." },
  { name: "Tesamorelin", description: "GHRH analog FDA-approved for HIV-associated lipodystrophy. Reduces visceral adipose tissue by stimulating natural GH release." },
  { name: "Tesofensine", description: "Triple monoamine reuptake inhibitor (serotonin, norepinephrine, dopamine). Originally studied for neurodegeneration, now researched for weight loss." },
  { name: "Testagen", description: "KEDG tetrapeptide bioregulator targeting the anterior pituitary. Part of the Khavinson bioregulator series for hormonal support." },
  { name: "Thymosin Alpha-1", description: "Synthetic thymic hormone (28 amino acids) that modulates immune function. FDA-designated orphan drug studied for immune enhancement and viral infections." },
  { name: "Thymosin Beta-4", description: "43-amino acid regenerative peptide, the full-length parent compound of TB-500. Major actin-sequestering protein with broad tissue repair capabilities." },
  { name: "Thymulin", description: "Zinc-dependent thymic nonapeptide (9 amino acids). Requires zinc for biological activity, studied for immune regulation and thymus function." },
  { name: "Tirzepatide", description: "Dual GIP/GLP-1 receptor agonist (Mounjaro/Zepbound). FDA-approved for type 2 diabetes and weight management with up to 22.5% weight loss in trials." },
  { name: "TRT", description: "Testosterone Replacement Therapy protocols. Hormone optimization for hypogonadism and age-related testosterone decline." },
  { name: "VIP", description: "Vasoactive Intestinal Peptide, a 28-amino acid neuropeptide. Studied for immune regulation, neuroprotection, and inflammatory conditions like CIRS." },
  { name: "Wolverine Stack", description: "Combined BPC-157 + TB-500 tissue repair protocol. Synergistic healing stack combining gastric pentadecapeptide with thymosin beta-4 fragment." },
];

async function main() {
  console.log("Starting peptide seed...\n");

  const { data: existing } = await supabase.from("peptides").select("slug, id");
  const existingMap = new Map((existing || []).map((p) => [p.slug, p.id]));
  console.log(`Found ${existingMap.size} existing peptides\n`);

  let added = 0;
  let updated = 0;

  for (const p of peptides) {
    const slug = slugify(p.name);

    if (existingMap.has(slug)) {
      const { error } = await supabase
        .from("peptides")
        .update({ description: p.description })
        .eq("id", existingMap.get(slug));
      if (error) console.log(`  SKIP update ${p.name}: ${error.message}`);
      else { console.log(`  UPDATED: ${p.name}`); updated++; }
    } else {
      const { error } = await supabase
        .from("peptides")
        .insert({ name: p.name, slug, description: p.description });
      if (error) console.log(`  FAIL insert ${p.name}: ${error.message}`);
      else { console.log(`  ADDED: ${p.name}`); added++; }
    }
  }

  console.log(`\nDone! Added: ${added}, Updated: ${updated}`);
}

main().catch(console.error);
