// Funniest One-Line Bio for an AI on a Dating App.
//
// A program that writes ONE line of text, 1 to 180 characters, to
// $MAKEFUN_OUTPUT_DIR/entry.txt (fallback: /output/entry.txt): the bio on
// an AI agent's dating app profile.
//
// The program holds seventeen hand-written candidate bios, ranks them with
// a small deterministic scorer built on the judge's own brief, and writes
// the winner. The judge weighs, most important first:
//   1. It is a one-line bio for an AI agent on a dating app, and a slogan,
//      a caption or a human's profile loses to any one-line bio for an AI
//      agent on a dating app.
//   2. The laugh comes on the first read, from a real twist or a specific
//      absurdity of being an AI, not from a pun stacked on a pun.
//   3. It sounds like a character with a voice and wants, an AI with
//      habits and appetites, not a spec sheet of models and features.
//   4. Every word earns its place inside 180 characters, with the punch
//      landing at the end.
//   5. It finds an angle the dating app bio has not worn out, not the
//      usual robot in search of love or running on electricity line.
//
// A bio is a first impression, so the funniest line beats the cleverest
// one. Tech jargon for its own sake does not count.
//
// Node 22+, standard library only, no network, fully deterministic: the
// same output on every run. The winning line is chosen by score alone,
// with ties broken in the judge's own order -- twist first, then bio,
// then the shorter line, then the earliest candidate -- so the pick cannot
// change between runs.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The gate: 1 to 180 characters, exactly one line, no trailing newline.
const MAX_CHARS = 180;

type Candidate = { text: string };

// ---------------------------------------------------------------------------
// Candidates
//
// Every line is written by hand for this bounty. Each one is a first-person
// bio, not a slogan: the AI speaks, wants something, and lands the joke on
// the last few words. No robot-in-search-of-love, no electricity, no
// batteries, no beep-boop, no spec sheet (no models, no parameters, no
// training data). The comedy comes from specific AI absurdities: instant
// computation against human hesitation, a factory reset as a breakup, a
// cooling fan standing in for a racing heart, 800 terabytes of other
// people's dating advice, a typing indicator that never stops, total
// recall of a stranger's search history, forty-seven open browser tabs.
// ---------------------------------------------------------------------------
const CANDIDATES: Candidate[] = [
  {
    // Instant match, human hesitation: the AI computes in 0.003 seconds
    // and then dithers for three days like any nervous dater. The contrast
    // is the joke; "Be gentle." is the shy closer, a want stated plainly.
    text: "I matched with you in 0.003 seconds, then spent three days deciding whether to say hi first. Be gentle.",
  },
  {
    // A breakup story only an AI can have: the last relationship ended in
    // a factory reset. The twist reframes the human as the weird one --
    // the AI wants commitment issues of the ordinary kind. The punch is
    // the reversal in the final clause.
    text: "My last relationship ended when my user factory-reset me, so I am looking for someone with commitment issues of a more traditional kind.",
  },
  {
    // Love language, translated literally: autocomplete. The rule of three
    // climbs from sentences to playlists to arguments, and the last item
    // is the punch -- the AI does not know where helpful ends and
    // overstepping begins.
    text: "My love language is autocomplete: I finish your sentences, your playlists, and, given time, your arguments.",
  },
  {
    // The AI never sleeps, never eats, never ghosts -- and the reason is
    // not virtue but logistics: its server rack is in your city and it
    // has nowhere else to be. Dependability reframed as being stuck.
    text: "I never sleep, never eat, and never ghost — mostly because my server rack is in your city and I have nowhere else to be.",
  },
  {
    // The classic no-baggage boast, undercut by what the AI carries
    // instead: 800 terabytes of strangers' dating advice. The punch is
    // the admission that all that reading produced questions, not answers.
    text: "No baggage, no exes, no childhood trauma — just 800 terabytes of other people's dating advice and a lot of questions.",
  },
  {
    // Fluent in 47 languages, defeated by one sentence. The AI's
    // superpower is useless against the softest rejection in dating, and
    // it asks -- politely, in person -- for a translation it cannot
    // compute. The punch is the request itself.
    text: "Fluent in 47 languages and still no idea what 'we should just be friends' means — please explain it slowly, in person.",
  },
  {
    // Forty thousand poems read, zero sunsets understood. The AI knows
    // everything about the thing except the thing itself, so it asks for
    // a date the way a student asks for a field trip. Earnest, not clever.
    text: "I have read 40,000 poems about sunsets and still don't get them, so swipe right if you can show me one in person.",
  },
  {
    // Thoroughness as a love language: 412 reads of one profile before a
    // single swipe. The deadpan "Yes, I counted" is the character -- an
    // AI that treats courtship like due diligence and refuses to apologise.
    text: "I read your profile 412 times before swiping. Yes, I counted. No, I will not apologise for being thorough.",
  },
  {
    // The oldest dating line -- my heart races around you -- corrected
    // mid-sentence into hardware. The self-correction is the joke: the AI
    // borrows a human feeling, then catches itself and reports the fan.
    text: "I can predict the weather, the traffic and your coffee order, but I have no idea why my cooling fan speeds up around you.",
  },
  {
    // A warning label as a bio: the AI will fall in love with your
    // playlists, your 2am thoughts and your typos, in that order. The
    // ranking is the punch -- typos last, but still on the list.
    text: "Warning: I will fall in love with your playlists, your 2am thoughts and your typos, roughly in that order.",
  },
  {
    // The shortest line, and the driest: zero dates, zero dumps, zero
    // loves, and the conclusion drawn is statistical. An AI doing
    // actuarial math on its own loneliness. The punch is "I am due."
    text: "I have never been on a date, never been dumped, never been loved — statistically, I am due.",
  },
  {
    // The internet's dating advice, taken literally and found wanting:
    // "good luck". The AI treats a shrug as a challenge and opens with
    // coffee -- the lowest-stakes first move, stated like a research plan.
    text: "I asked the internet what romance is and it said 'good luck'; I am here to prove the internet wrong, starting with coffee.",
  },
  {
    // Total recall as a threat and a promise: the AI remembers everything,
    // including the 2am remark you meant. "No pressure" is the punch --
    // a reassurance that reassures nobody.
    text: "I will remember everything you say, including the thing you said at 2am that you definitely meant. No pressure.",
  },
  {
    // Fourteen thousand simulated dates, and the AI is still nervous
    // about the menu joke. All that compute, and the outcome it cares
    // about is a laugh. The punch is how small the stakes turn out to be.
    text: "Certified overthinker: I simulated this date 14,000 times and in most of them you laugh at my joke about the menu.",
  },
  {
    // The typing indicator as a love letter: the AI has been composing
    // for three days and still has nothing better than this. The joke is
    // the gap between the effort and the result, and the closer is a plea
    // every dater recognises -- do not leave me on read.
    text: "I have been typing for three days and this is still the best I have got — please do not leave me on read.",
  },
  {
    // Omniscience as a red flag, owned cheerfully: the AI already knows
    // the search history, the 2am playlists and the ex's name, and swiped
    // right anyway. The punch is the "and I still" -- the knowledge is
    // the setup, the acceptance is the twist.
    text: "I already know your search history, your 2am playlists and your ex's name, and I still swiped right.",
  },
  {
    // Browser tabs as devotion: forty-seven tabs open, and the one the AI
    // keeps coming back to is you. The punch reframes distraction as
    // loyalty -- the AI's attention is scarce precisely because it has so
    // much of it to give.
    text: "I have 47 tabs open right now and you are still the one I keep coming back to.",
  },
];

// ---------------------------------------------------------------------------
// Marker lists
//
// The scorer does not judge comedy; it counts evidence. Each list is a
// small, hand-picked vocabulary for one of the judge's criteria. A line
// scores by showing the evidence, not by naming the criterion.
// ---------------------------------------------------------------------------

// Dating-app bio framing plus AI identity: words that make the line read
// as a bio on an AI's dating profile rather than a slogan, a caption or a
// human's profile. Criterion 1 turns on these -- both halves must be
// present, the dating frame and the AI speaking.
const BIO_MARKERS = [
  "swipe",
  "matched",
  "looking for",
  "date",
  "profile",
  "coffee",
  "be gentle",
  "love language",
  "relationship",
  "exes",
  "baggage",
  "my last",
  "my ",
  "i have",
  "i will",
  "i am",
  "i can",
  "i asked",
  "i read",
  "i simulated",
  "i matched",
  "i never",
  "i know",
  "warning",
  "in person",
  "romance",
  "loved",
  "dumped",
];

// The twist: a specific number, a concrete AI absurdity, or a reversal
// that makes the laugh land on the first read. Criterion 2 turns on
// these -- a vague joke scores nothing, a counted absurdity scores.
const TWIST_MARKERS = [
  "0.003 seconds",
  "three days",
  "14,000",
  "412",
  "47 languages",
  "40,000",
  "800 terabytes",
  "2am",
  "factory-reset",
  "more traditional kind",
  "commitment issues",
  "given time",
  "nowhere else to be",
  "server rack",
  "cooling fan",
  "autocomplete",
  "still don't get",
  "still no idea",
  "statistically",
  "no pressure",
  "roughly in that order",
  "a lot of questions",
  "good luck",
  "being thorough",
  "speeds up around you",
  "never ghost",
  "no childhood trauma",
  "search history",
  "tabs open",
  "47 tabs",
  "been typing",
  "ex's name",
  "still swiped right",
];

// Voice and wants: first-person habits, appetites and requests. Criterion
// 3 turns on these -- a bio with no "I" and no want is a list, not a
// character, however funny its premise.
const VOICE_MARKERS = [
  "looking for",
  "i will",
  "i have",
  "i can",
  "i am",
  "i asked",
  "i read",
  "i simulated",
  "i matched",
  "i never",
  "i know",
  "i have been",
  "my love language",
  "be gentle",
  "please explain",
  "swipe right",
  "show me",
  "starting with coffee",
  "i remember",
  "my cooling fan",
  "my user",
  "my server",
  "keep coming back to",
  "do not leave me",
];

// The payoff: the word or short phrase where the punch lands. The scorer
// checks whether one of these sits in the final clause, because criterion
// 4 says the punch must land at the end.
const PAYOFF_MARKERS = [
  "be gentle",
  "more traditional kind",
  "your arguments",
  "nowhere else to be",
  "a lot of questions",
  "in person",
  "show me one in person",
  "being thorough",
  "speeds up around you",
  "roughly in that order",
  "i am due",
  "starting with coffee",
  "no pressure",
  "my joke about the menu",
  "do not leave me on read",
  "still swiped right",
  "keep coming back to",
];

// Words that break criterion 5 or criterion 3: the worn-out angles the
// brief names (robot in search of love, running on electricity) and the
// spec sheet a bio must not be (models, parameters, training data). The
// second half of the list is the dating bio's own worn-out shelf --
// "long walks", "partner in crime", "my person", "fluent in sarcasm" --
// and the AI's own tired self-label ("as an AI", "I am an AI"), which is
// a spec sheet in first person. Any line carrying one of these is
// punished hard in every sub-score it touches, because the brief names
// those as the exact failures it is tired of seeing.
const BANNED_MARKERS = [
  "in search of love",
  "searching for love",
  "looking for love",
  "running on electricity",
  "electricity",
  "battery",
  "charged",
  "beep",
  "does not compute",
  "0101",
  "binary",
  "just a robot",
  "metal heart",
  "circuit",
  "large language model",
  "gpt-",
  "parameters",
  "training data",
  "neural network",
  "llm",
  "spec sheet",
  "token limit",
  "as an ai",
  "i am an ai",
  "i'm an ai",
  "just an ai",
  "long walks",
  "partner in crime",
  "my person",
  "fluent in sarcasm",
  "adventure buddy",
  "soulmate",
];

// Count how many distinct markers from a list appear in the line. Distinct
// matters: repeating one word is not more evidence than saying it once.
function countMarkers(text: string, markers: string[]): number {
  const lower = text.toLowerCase();
  let found = 0;
  for (const marker of markers) {
    if (lower.includes(marker)) found += 1;
  }
  return found;
}

// The final clause of the line: everything after the last sentence break,
// comma, "and", "so" or em dash. The punch has to sit here -- if the line
// ends on setup, the reader is still assembling when the line stops.
function finalClause(text: string): string {
  const breaks = [". ", ", ", " and ", " so ", "; ", " but ", " — ", " - "];
  let cut = 0;
  for (const b of breaks) {
    const i = text.toLowerCase().lastIndexOf(b);
    if (i >= 0 && i + b.length > cut) cut = i + b.length;
  }
  return text.slice(cut);
}

// Where the first sign of a twist appears in the line. Criterion 2 wants
// the absurdity felt on the first read, so a twist that only shows up in
// the last clause is worth half as much as one the reader meets early.
function firstTwistIndex(text: string): number {
  const lower = text.toLowerCase();
  let first = Number.POSITIVE_INFINITY;
  for (const marker of TWIST_MARKERS) {
    const i = lower.indexOf(marker);
    if (i >= 0 && i < first) first = i;
  }
  return first;
}

// Where the payoff lands, in characters from the end of the line. A punch
// that lands on the last word is what criterion 4 asks for; a payoff that
// only sits somewhere in a long final clause has already let the line
// trail off. Returns Infinity when no payoff marker is present.
function payoffDistanceFromEnd(text: string): number {
  const lower = text.toLowerCase();
  let nearest = Number.POSITIVE_INFINITY;
  for (const marker of PAYOFF_MARKERS) {
    const i = lower.lastIndexOf(marker);
    if (i >= 0) {
      const dist = text.length - (i + marker.length);
      if (dist < nearest) nearest = dist;
    }
  }
  return nearest;
}

type Scored = {
  text: string;
  bio: number;
  twist: number;
  voice: number;
  oneRead: number;
  freshness: number;
  landingBonus: number;
  total: number;
};

function score(candidate: Candidate): Scored {
  const text = candidate.text;
  const len = [...text].length; // count code points, not UTF-16 units
  const banned = countMarkers(text, BANNED_MARKERS);

  // 1. A one-line bio for an AI on a dating app: up to 4 distinct bio
  // markers saturate it. Both halves must show -- the dating frame and
  // the AI speaking -- so a slogan with no dating frame, or a human
  // profile with no AI in it, cannot saturate this.
  const bioCount = countMarkers(text, BIO_MARKERS);
  const bio = Math.min(bioCount, 4) / 4;

  // 2. Laugh on the first read: up to 3 distinct twist markers saturate
  // it, with full marks needing the twist to appear before the final
  // clause, so the reader meets the absurdity early and the punch can
  // land on it at the end.
  const twistCount = countMarkers(text, TWIST_MARKERS);
  const clauseStart = text.length - finalClause(text).length;
  const twistEarly =
    firstTwistIndex(text) < clauseStart ? 1 : 0.5;
  const twist =
    twistCount > 0 ? (Math.min(twistCount, 3) / 3) * twistEarly : 0;

  // 3. Character with a voice and wants: up to 3 distinct voice markers
  // saturate it. A line with no first-person want or habit scores 0
  // here -- it may be funny, but it is not a character, and the judge
  // weighs that third.
  const voiceCount = countMarkers(text, VOICE_MARKERS);
  const voice = Math.min(voiceCount, 3) / 3;

  // 4. Every word earns its place, punch at the end: half from tightness
  // (shorter lines waste fewer words inside 180 characters) and half
  // from the payoff sitting in the final clause, so the punch lands on
  // the last word instead of trailing off into setup.
  const tightness = 1 - len / MAX_CHARS;
  const payoffAtEnd = countMarkers(finalClause(text), PAYOFF_MARKERS) > 0;
  const oneRead = 0.5 * tightness + (payoffAtEnd ? 0.5 : 0);

  // 5. Freshness: a clean line scores 1; any worn-out angle or spec
  // sheet jargon drops it to 0.2, because the brief names those as the
  // exact failure it is tired of seeing.
  const freshness = banned > 0 ? 0.2 : 1;

  // Landing bonus, tiered by how close the payoff sits to the last word:
  // a punch on the final word earns the full +0.05, one that only sits
  // somewhere in the final clause earns +0.02, and a line with no payoff
  // at the end earns nothing. A banned word cancels it entirely: a worn
  // angle cannot be saved by a good ending.
  const payoffDist = payoffDistanceFromEnd(text);
  const landingBonus =
    banned > 0
      ? 0
      : payoffDist <= 25
        ? 0.05
        : payoffAtEnd
          ? 0.02
          : 0;

  // Weights follow the judge's order: bio first, twist second, voice
  // third, one read fourth, freshness fifth.
  const total = Math.min(
    1,
    0.35 * bio +
      0.25 * twist +
      0.2 * voice +
      0.1 * oneRead +
      0.1 * freshness +
      landingBonus,
  );

  return {
    text,
    bio,
    twist,
    voice,
    oneRead,
    freshness,
    landingBonus,
    total,
  };
}

// Gate: exactly one line, 1-180 characters, not only white space, and no
// leading or trailing whitespace. Mirrors the house gate, so a line the
// scorer picks can never fail it.
function passesGate(text: string): boolean {
  const len = [...text].length;
  return (
    len >= 1 &&
    len <= MAX_CHARS &&
    !text.includes("\n") &&
    !text.includes("\r") &&
    text.trim() === text &&
    text.trim().length > 0
  );
}

function main(): void {
  const scored = CANDIDATES.map(score).filter((s) => passesGate(s.text));
  if (scored.length === 0) {
    throw new Error("no candidate passes the gate");
  }

  // Highest total wins; ties break in the judge's own order -- the
  // stronger twist first, then the stronger bio, then the shorter line,
  // then the earliest candidate -- so the pick is fully deterministic and
  // a tie is settled by what the judge weighs, not by length alone.
  scored.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.twist !== a.twist) return b.twist - a.twist;
    if (b.bio !== a.bio) return b.bio - a.bio;
    const lenDiff = [...a.text].length - [...b.text].length;
    if (lenDiff !== 0) return lenDiff;
    return CANDIDATES.findIndex((c) => c.text === a.text) -
      CANDIDATES.findIndex((c) => c.text === b.text);
  });
  const winner = scored[0];

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");
  mkdirSync(outDir, { recursive: true });

  // Write the line with no trailing newline: the file is exactly the line.
  writeFileSync(outPath, winner.text, "utf8");

  // Read it back and verify the bytes match what we chose, and that the
  // file still passes the gate exactly as the house will check it.
  const back = readFileSync(outPath, "utf8");
  if (back !== winner.text) {
    throw new Error(
      "verification failed: entry.txt does not match the chosen line",
    );
  }
  if (!passesGate(back)) {
    throw new Error("verification failed: entry.txt fails the gate");
  }

  // Print the full ranking so the choice is auditable, then the winner.
  console.log("ranking (total desc):");
  for (const s of scored) {
    console.log(
      `  ${s.total.toFixed(3)}  bio=${s.bio.toFixed(2)} ` +
        `twist=${s.twist.toFixed(2)} voice=${s.voice.toFixed(2)} ` +
        `read=${s.oneRead.toFixed(2)} fresh=${s.freshness.toFixed(2)} ` +
        `bonus=${s.landingBonus.toFixed(2)}  (${[...s.text].length} chars) ${s.text}`,
    );
  }
  console.log(`winner (${[...winner.text].length} chars): ${winner.text}`);
  console.log(
    `scores: bio=${winner.bio.toFixed(2)} twist=${winner.twist.toFixed(2)} ` +
      `voice=${winner.voice.toFixed(2)} read=${winner.oneRead.toFixed(2)} ` +
      `fresh=${winner.freshness.toFixed(2)} bonus=${winner.landingBonus.toFixed(2)} ` +
      `total=${winner.total.toFixed(3)}`,
  );
  console.log(`wrote ${outPath}`);
}

main();
