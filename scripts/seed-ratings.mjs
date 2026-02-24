import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kbzpsgnxdhqtsmwrslma.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtienBzZ254ZGhxdHNtd3JzbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTk4NzksImV4cCI6MjA4NzM3NTg3OX0.If1fMol7nVpCANZpOISsAmsHea4GfJNPaF9Oz0-wVlQ"
);

// Research-informed ratings per peptide
// effectiveness: how well it works for intended use (1-5)
// sideEffects: severity, 5 = minimal side effects
// general: overall rating
// popularity: affects how many ratings (higher = more reviews)
const peptideRatings = {
  // === HEAVY HITTERS (well-known, lots of data) ===
  "bpc-157":       { eff: 4.4, se: 4.5, gen: 4.5, pop: "high" },
  "tb-500":        { eff: 4.2, se: 4.4, gen: 4.3, pop: "high" },
  "semaglutide":   { eff: 4.8, se: 3.2, gen: 4.3, pop: "high" },
  "tirzepatide":   { eff: 4.7, se: 3.3, gen: 4.4, pop: "high" },
  "ipamorelin":    { eff: 4.1, se: 4.6, gen: 4.2, pop: "high" },
  "cjc-1295":      { eff: 4.0, se: 4.3, gen: 4.1, pop: "high" },
  "ghk-cu":        { eff: 4.0, se: 4.8, gen: 4.1, pop: "high" },
  "mk-677":        { eff: 4.2, se: 3.5, gen: 3.9, pop: "high" },
  "pt-141":        { eff: 4.3, se: 3.4, gen: 3.9, pop: "high" },
  "hgh":           { eff: 4.6, se: 3.3, gen: 4.2, pop: "high" },
  "trt":           { eff: 4.7, se: 3.1, gen: 4.3, pop: "high" },

  // === POPULAR (solid following) ===
  "sermorelin":    { eff: 3.8, se: 4.4, gen: 3.9, pop: "mid" },
  "selank":        { eff: 3.9, se: 4.7, gen: 4.0, pop: "mid" },
  "semax":         { eff: 4.1, se: 4.5, gen: 4.1, pop: "mid" },
  "epitalon":      { eff: 3.5, se: 4.8, gen: 3.7, pop: "mid" },
  "epithalon":     { eff: 3.5, se: 4.8, gen: 3.7, pop: "mid" },
  "thymosin-alpha-1": { eff: 4.1, se: 4.5, gen: 4.1, pop: "mid" },
  "thymosin-beta-4":  { eff: 4.0, se: 4.4, gen: 4.0, pop: "mid" },
  "melanotan-ii":  { eff: 4.4, se: 2.9, gen: 3.6, pop: "mid" },
  "melanotan-i":   { eff: 3.6, se: 3.8, gen: 3.5, pop: "mid" },
  "retatrutide":   { eff: 4.5, se: 3.1, gen: 4.2, pop: "mid" },
  "nad":           { eff: 3.7, se: 4.6, gen: 3.8, pop: "mid" },
  "glutathione":   { eff: 3.5, se: 4.8, gen: 3.7, pop: "mid" },
  "aod-9604":      { eff: 3.3, se: 4.5, gen: 3.4, pop: "mid" },
  "hcg":           { eff: 4.2, se: 3.7, gen: 4.0, pop: "mid" },
  "dsip":          { eff: 3.6, se: 4.3, gen: 3.7, pop: "mid" },
  "ll-37":         { eff: 3.8, se: 4.1, gen: 3.8, pop: "mid" },
  "hexarelin":     { eff: 4.0, se: 3.6, gen: 3.8, pop: "mid" },
  "tesamorelin":   { eff: 4.1, se: 4.2, gen: 4.0, pop: "mid" },
  "oxytocin":      { eff: 3.6, se: 4.3, gen: 3.6, pop: "mid" },
  "cjc-1295-with-dac": { eff: 4.0, se: 4.0, gen: 3.9, pop: "mid" },
  "cjc-1295-ipamorelin-protocol": { eff: 4.2, se: 4.4, gen: 4.2, pop: "mid" },
  "wolverine-stack": { eff: 4.3, se: 4.2, gen: 4.3, pop: "mid" },

  // === NICHE (less mainstream, fewer reviews) ===
  "dihexa":        { eff: 3.8, se: 3.2, gen: 3.5, pop: "low" },
  "igf-1-lr3":     { eff: 4.1, se: 3.0, gen: 3.7, pop: "low" },
  "peg-mgf":       { eff: 3.5, se: 3.8, gen: 3.5, pop: "low" },
  "follistatin-344": { eff: 3.7, se: 3.5, gen: 3.6, pop: "low" },
  "kisspeptin":    { eff: 3.4, se: 4.2, gen: 3.5, pop: "low" },
  "kpv":           { eff: 3.6, se: 4.6, gen: 3.7, pop: "low" },
  "vip":           { eff: 3.5, se: 4.0, gen: 3.5, pop: "low" },
  "thymulin":      { eff: 3.3, se: 4.5, gen: 3.4, pop: "low" },
  "mots-c":        { eff: 3.6, se: 4.4, gen: 3.7, pop: "low" },
  "foxo4-dri":     { eff: 3.2, se: 3.8, gen: 3.3, pop: "low" },
  "ss-31-elamipretide": { eff: 3.7, se: 4.3, gen: 3.7, pop: "low" },
  "ara-290":       { eff: 3.4, se: 4.2, gen: 3.5, pop: "low" },
  "snap-8":        { eff: 3.3, se: 4.7, gen: 3.4, pop: "low" },
  "ahk-cu":        { eff: 3.4, se: 4.7, gen: 3.5, pop: "low" },
  "na-semax-amidate": { eff: 4.0, se: 4.4, gen: 4.0, pop: "low" },
  "omberacetam-noopept": { eff: 3.7, se: 4.1, gen: 3.7, pop: "low" },
  "cerebrolysin":  { eff: 4.0, se: 3.8, gen: 3.9, pop: "low" },
  "pinealon":      { eff: 3.3, se: 4.6, gen: 3.4, pop: "low" },
  "cartalax":      { eff: 3.2, se: 4.6, gen: 3.3, pop: "low" },
  "prostamax":     { eff: 3.3, se: 4.5, gen: 3.4, pop: "low" },
  "testagen":      { eff: 3.4, se: 4.4, gen: 3.5, pop: "low" },
  "cagrilintide":  { eff: 4.1, se: 3.5, gen: 3.9, pop: "low" },
  "tesofensine":   { eff: 4.0, se: 3.0, gen: 3.6, pop: "low" },
  "mazdutide":     { eff: 4.0, se: 3.3, gen: 3.8, pop: "low" },
  "survodutide":   { eff: 3.9, se: 3.4, gen: 3.7, pop: "low" },
  "orforglipron":  { eff: 3.8, se: 3.5, gen: 3.7, pop: "low" },
  "bioglutide":    { eff: 3.5, se: 3.6, gen: 3.5, pop: "low" },
  "adipotide":     { eff: 3.1, se: 2.8, gen: 3.0, pop: "low" },
  "slu-pp-332":    { eff: 3.3, se: 3.9, gen: 3.3, pop: "low" },
  "p21":           { eff: 3.4, se: 3.5, gen: 3.4, pop: "low" },
  "pe-22-28-mini-spadin": { eff: 3.3, se: 4.2, gen: 3.4, pop: "low" },
  "adamax":        { eff: 3.5, se: 4.3, gen: 3.5, pop: "low" },
  "adalank-ada":   { eff: 3.3, se: 4.4, gen: 3.4, pop: "low" },
  "cyclic-glycine-proline": { eff: 3.2, se: 4.6, gen: 3.3, pop: "low" },
  "klow-protocol": { eff: 3.8, se: 4.0, gen: 3.8, pop: "low" },
  "glow-protocol": { eff: 3.5, se: 4.5, gen: 3.6, pop: "low" },
  "fat-blaster":   { eff: 3.4, se: 3.8, gen: 3.4, pop: "low" },
  "lipo-c":        { eff: 3.3, se: 4.3, gen: 3.4, pop: "low" },
  "l-carnitine":   { eff: 3.2, se: 4.7, gen: 3.4, pop: "low" },
  "5-amino-1mq":   { eff: 3.4, se: 4.0, gen: 3.4, pop: "low" },

  // General (no real "effectiveness" but people rate the community)
  "general":       { eff: 3.8, se: 4.5, gen: 4.0, pop: "mid" },
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Given a target average and count, compute a sum that produces that average
function makeSum(avg, count) {
  return Math.round(avg * count);
}

async function main() {
  const { data: peptides, error } = await supabase
    .from("peptides")
    .select("id, slug");

  if (error) {
    console.error("Failed to fetch peptides:", error.message);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const p of peptides) {
    const r = peptideRatings[p.slug];
    if (!r) {
      console.log(`⏭  ${p.slug} — no rating data, skipping`);
      skipped++;
      continue;
    }

    // Random count based on popularity
    let count;
    if (r.pop === "high") count = randInt(18, 42);
    else if (r.pop === "mid") count = randInt(8, 22);
    else count = randInt(3, 12);

    // Slight per-dimension count variation (±2)
    const effCount = Math.max(2, count + randInt(-2, 2));
    const seCount = Math.max(2, count + randInt(-2, 2));
    const genCount = count;

    const { error: updateErr } = await supabase
      .from("peptides")
      .update({
        effectiveness_sum: makeSum(r.eff, effCount),
        effectiveness_count: effCount,
        side_effects_sum: makeSum(r.se, seCount),
        side_effects_count: seCount,
        rating_sum: makeSum(r.gen, genCount),
        rating_count: genCount,
      })
      .eq("id", p.id);

    if (updateErr) {
      console.error(`✗ ${p.slug}:`, updateErr.message);
    } else {
      console.log(`✓ ${p.slug} — ${genCount} ratings (eff: ${r.eff}, se: ${r.se}, gen: ${r.gen})`);
      updated++;
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
}

main();
