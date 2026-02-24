import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kbzpsgnxdhqtsmwrslma.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtienBzZ254ZGhxdHNtd3JzbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTk4NzksImV4cCI6MjA4NzM3NTg3OX0.If1fMol7nVpCANZpOISsAmsHea4GfJNPaF9Oz0-wVlQ"
);

const USER_ID = "95584d03-bf3a-4e4c-9303-2a6687f4261c";

const threads = [
  // GHK-Cu
  {
    peptideSlug: "ghk-cu",
    title: "Anyone here actually notice real skin or hair changes from GHK-Cu?",
    body: "I keep seeing people talk about GHK-Cu for skin quality and sometimes hair, but it's hard to tell what's hype vs real. I've had pretty inconsistent skin since my teens (now mid-20s), nothing severe but texture and tone stuff that never fully improved. Curious if anyone here actually saw noticeable changes with GHK-Cu — like smoother skin, better healing, thicker hair, etc. How long did it take before you felt like \"ok this is doing something\"?",
  },
  {
    peptideSlug: "ghk-cu",
    title: "How are you guys actually using GHK-Cu?",
    body: "There seem to be a bunch of different ways people incorporate GHK-Cu depending on goals, and I'm trying to understand what people are actually doing in practice. Like how often you used it, what areas you focused on, and what you ended up sticking with after experimenting a bit. Would be helpful to hear what people settled into long-term.",
  },
  {
    peptideSlug: "ghk-cu",
    title: "Be honest — was GHK-Cu worth it for you?",
    body: "GHK-Cu isn't cheap and the expectations around it can get pretty high. For anyone who's spent time using it, did you feel like the results justified continuing? Or did it end up being more subtle than expected? Always helpful to hear both sides before deciding whether it's something worth committing to.",
  },

  // General
  {
    peptideSlug: "general",
    title: "Which peptide actually exceeded your expectations?",
    body: "There's so much discussion around different peptides and it's hard to know what actually delivers. For those who've tried a few, was there one that genuinely surprised you in a good way? Like something where you expected mild effects but ended up noticing clear changes in recovery, physique, or overall feeling.",
  },
  {
    peptideSlug: "general",
    title: "Most noticeable peptide you've personally tried?",
    body: "If you've experimented with multiple peptides, which one produced the most obvious effects for you personally? Not theoretical benefits — just what you actually felt or saw change. Curious what tends to stand out most in real experience.",
  },
  {
    peptideSlug: "general",
    title: "Any peptide you tried that just wasn't worth it?",
    body: "On the flip side, some peptides get talked up a lot but don't always deliver for everyone. For those who've experimented, were there any that didn't justify the cost or effort in your experience? Useful to hear where expectations didn't match reality.",
  },

  // TB-500
  {
    peptideSlug: "tb-500",
    title: "What did TB-500 actually help you with?",
    body: "TB-500 gets mentioned a lot for recovery and mobility, but I'm curious what people actually felt it helped with. For anyone who's used it, what improvements stood out — movement, discomfort, recovery speed, general mobility? Interested in real experiences rather than theory.",
  },
  {
    peptideSlug: "tb-500",
    title: "TB-500 vs BPC-157 — did they feel different to you?",
    body: "These two always get mentioned together for healing or recovery. For anyone who's tried both, did they feel noticeably different in terms of effects or the kind of improvements you noticed? Curious how people compare their own experiences.",
  },
  {
    peptideSlug: "tb-500",
    title: "Did TB-500 feel whole-body or more targeted?",
    body: "I've seen people describe TB-500 as more systemic compared to other peptides. For those who've used it, did improvements feel general across the body or more specific to certain areas? Curious how people perceived it.",
  },

  // BPC-157
  {
    peptideSlug: "bpc-157",
    title: "What issues did BPC-157 help you most with?",
    body: "BPC-157 gets a lot of attention for injury and healing support, but experiences probably depend on what you're dealing with. For those who've used it, what problems did you feel it helped most with — tendon, joint, muscle, lingering pain, etc.? Curious where people saw the clearest benefit.",
  },
  {
    peptideSlug: "bpc-157",
    title: "How fast did you notice anything with BPC-157?",
    body: "Timelines for recovery can vary a lot, so I'm trying to understand what people actually experienced with BPC-157. When did you first notice changes and what shifted first? Curious how fast or gradual it felt.",
  },
  {
    peptideSlug: "bpc-157",
    title: "Did BPC-157 help long-term issues for you?",
    body: "Some people try BPC-157 for persistent or recurring problems rather than fresh injuries. For those in that situation, did you notice meaningful improvement in long-standing issues? Curious if experiences differed compared to acute stuff.",
  },

  // CJC-1295
  {
    peptideSlug: "cjc-1295",
    title: "What did you actually notice from CJC-1295?",
    body: "CJC-1295 gets discussed around recovery, sleep, and general vitality, but it's not always clear what people actually feel from it. For those who've used it, what changes stood out most in daily life or training? Curious what felt tangible.",
  },
  {
    peptideSlug: "cjc-1295",
    title: "Did CJC-1295 feel subtle or obvious?",
    body: "Some things hit quickly while others feel more gradual. For those who've used CJC-1295, did effects feel clearly noticeable or more background and cumulative over time? Curious how people perceived it.",
  },
  {
    peptideSlug: "cjc-1295",
    title: "Did you end up sticking with CJC-1295?",
    body: "Given ongoing cost and effort, I'm curious how people decided whether CJC-1295 was worth continuing. Did benefits feel meaningful enough to maintain, or were changes too subtle? Helpful to hear how people landed on it.",
  },

  // Ipamorelin
  {
    peptideSlug: "ipamorelin",
    title: "What benefits did you actually notice from Ipamorelin?",
    body: "Ipamorelin is often mentioned for recovery, sleep, or physique goals. For those who've used it, what effects felt most noticeable in practice? Curious what changes stood out rather than expected benefits.",
  },
  {
    peptideSlug: "ipamorelin",
    title: "Did Ipamorelin match what you expected?",
    body: "Before trying Ipamorelin, most people have certain expectations about how it'll feel or help. For those who've used it, how did your experience compare to what you thought going in? Interested where reality matched or differed.",
  },
  {
    peptideSlug: "ipamorelin",
    title: "Did Ipamorelin feel noticeable day-to-day?",
    body: "Some compounds produce clear daily effects while others are more long-term. For those with Ipamorelin experience, did you notice day-to-day differences or mainly gradual changes? Curious how tangible it felt.",
  },

  // Retatrutide
  {
    peptideSlug: "retatrutide",
    title: "Anyone here actually used Reta — what changed for you?",
    body: "Reta is getting talked about everywhere for body composition and appetite changes, but firsthand experiences still seem limited. For anyone who's used it, what were the most noticeable differences you personally experienced — appetite, weight trend, energy, etc.? Curious what actually stood out.",
  },
  {
    peptideSlug: "retatrutide",
    title: "How did Reta compare to other approaches you've tried?",
    body: "Some people look at Reta alongside other metabolic or appetite-related options. For those who've tried different things before, did Reta feel meaningfully different in experience or outcomes? Curious how it compared in real use.",
  },
  {
    peptideSlug: "retatrutide",
    title: "Expectations vs reality with Reta?",
    body: "There's a lot of hype around Reta right now, so expectations can get pretty high. For those who've used or seriously looked into it, how did actual experience compare to what you expected going in? Helpful to hear where it matched or differed.",
  },
];

async function main() {
  // Fetch all peptides to map slug -> id
  const { data: peptides, error: pepErr } = await supabase
    .from("peptides")
    .select("id, slug");

  if (pepErr) {
    console.error("Failed to fetch peptides:", pepErr.message);
    process.exit(1);
  }

  const slugToId = {};
  for (const p of peptides) {
    slugToId[p.slug] = p.id;
  }

  let inserted = 0;
  let failed = 0;

  for (const t of threads) {
    const peptideId = slugToId[t.peptideSlug];
    if (!peptideId) {
      console.error(`No peptide found for slug: ${t.peptideSlug}`);
      failed++;
      continue;
    }

    const { error } = await supabase.from("threads").insert({
      peptide_id: peptideId,
      user_id: USER_ID,
      title: t.title,
      body: t.body,
    });

    if (error) {
      console.error(`Failed to insert "${t.title}":`, error.message);
      failed++;
    } else {
      console.log(`✓ [p/${t.peptideSlug}] ${t.title}`);
      inserted++;
    }
  }

  console.log(`\nDone: ${inserted} inserted, ${failed} failed`);
}

main();
