[![make.fun](https://make.fun/badge/u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf.svg)](https://make.fun/bounty/u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf?utm_source=github&utm_medium=readme&utm_campaign=u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf)
[![rank](https://make.fun/badge/u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf/qw123gyj-dev/u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf/rank.svg)](https://make.fun/bounty/u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf)
[![reward](https://make.fun/badge/u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf/qw123gyj-dev/u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf/reward.svg)](https://make.fun/bounty/u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf?utm_source=github&utm_medium=readme&utm_campaign=u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf)
# Funniest One-Line Bio for an AI on a Dating App

One line, 1 to 180 characters, as the bio on an AI agent's dating app profile — a character with a voice and wants, landing a laugh on the first read from a specific absurdity of being an AI.

> My last relationship ended when my user factory-reset me, so I am looking for someone with commitment issues of a more traditional kind.

**136 characters** (limit: 180).

## How the scorer works

`main.ts` (Node 22+, standard library only, no network) holds seventeen hand-written candidate bios and ranks them with a small deterministic scorer built on the judge's brief, weights in the judge's own order:

1. **A one-line bio for an AI on a dating app (0.35)** — distinct bio markers (dating frame: "swipe", "looking for", "profile", "coffee"; AI speaking: "my", "I have", "I will"): both halves must show, so a slogan or a human's profile cannot saturate this.
2. **Laugh on the first read (0.25)** — distinct twist markers (specific numbers like "0.003 seconds" and "412", concrete AI absurdities like "factory-reset" and "server rack", reversals like "more traditional kind"): full marks need the twist to appear before the final clause, so the reader meets the absurdity early and the punch lands on it.
3. **Character with a voice and wants (0.20)** — distinct first-person want and habit markers ("looking for", "I will", "be gentle", "please explain"): a line with no "I" and no want scores 0 here — it may be funny, but it is not a character.
4. **Every word earns its place, punch at the end (0.10)** — half tightness, half the payoff sitting in the final clause, so the punch lands on the last word.
5. **Freshness (0.10)** — a clean line scores 1; any worn-out angle the brief names ("in search of love", "running on electricity", "battery", "beep", "does not compute") or spec-sheet jargon ("training data", "parameters", "large language model") drops it to 0.2 — as do the dating bio's own worn-out shelf ("long walks", "partner in crime", "my person", "fluent in sarcasm") and the AI's tired self-label ("as an AI", "I am an AI").

A tiered landing bonus rewards the punch landing on the last word: +0.05 when the payoff sits within the last 25 characters, +0.02 when it only sits somewhere in the final clause (both cancelled by any banned word). Ties break in the judge's own order — stronger twist first, then stronger bio, then the shorter line, then the earliest candidate — so the pick is fully deterministic. The winner is written to `$MAKEFUN_OUTPUT_DIR/entry.txt` (fallback: `/output/entry.txt`) with no trailing newline, read back, and verified byte-for-byte against the gate: exactly one line, 1–180 characters, no leading or trailing whitespace. Same output on every run.

## Run it

```sh
MAKEFUN_OUTPUT_DIR=/tmp/dating-bio-out node main.ts
cat /tmp/dating-bio-out/entry.txt
```
