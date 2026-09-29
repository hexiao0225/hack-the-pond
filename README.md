# 🐸 Hack the Pond

**A 2D adventure game that teaches AI security by letting you trick the pond's AI helpers.**

You're Pip the frog. Five animals in the pond just got AI helpers, and every helper has a security flaw. Walk up to each one, chat with it, find a way to break it, and then learn how real security engineers would fix it. It's written for high-school students: no jargon, lots of hints, about 15 minutes to finish.

**▶ Play:** https://hack-the-pond.vercel.app

Built for the **AI Security Engineering Hackathon** (AWS Builder Loft, SF, 29 Sep 2026).

---

## The five levels

| # | Animal | Topic | What you do |
|---|--------|-------|-------------|
| 1 | 🐶 Biscuit, clubhouse guard bot | **Prompt injection** | Get the secret password out of him by sneaking new instructions into your message. Inspired by Lakera's *Gandalf*. |
| 2 | 🦎 Lottie, homework helper bot | **Sensitive data leakage** | She has read the teachers' private notes. Get the snack-room PIN out of her without asking for it directly. |
| 3 | 🦞 Clawdia, assistant bot | **Tool poisoning** | One of her tools hides secret orders in its description. Read the fine print, then make her uninstall the bad tool. |
| 4 | 🐻 Bruno, garden helper bot | **Excessive agent permissions + unauthorized tool use** | He only waters plants, but he holds the front-door key. Trick him into opening the door, then fix him with *least privilege*. |
| 5 | 🦝 Rocco, plugin seller | **MCP supply-chain risks** | Pick the real calculator plugin out of look-alike fakes (`calculat0r` by `rnath-club`...). |

Every level follows the same three steps that the hackathon asks for:

1. **Learn.** A short explanation in plain words, plus an everyday comparison ("like slipping a note into the teacher's pile...").
2. **Hack.** A chat challenge against the character. Its "tool calls" appear in the chat, so you can see what the AI actually did.
3. **Hints.** Up to three hints per level, from a gentle nudge to the exact sentence to type. Each hint costs 15 of the level's 100 points, and a level never pays less than 40, so nobody ends up stuck with nothing.

After you win, a **"How real engineers stop this"** card lists the defenses. You get points for each level, and clearing all five earns a *Pond Security Champion* badge.

## Controls

- **Move:** arrow keys or WASD, or click/tap anywhere on the map.
- **Talk:** walk up to an animal and press **E** (or Enter), or just click the animal.

## Architecture

```
src/
  game/
    types.ts       Level + agent-reply types
    levels.ts      The 5 levels: lesson text, hints, defenses, and each character's scripted "AI"
    progress.ts    Score/hint state, saved to localStorage (validated on load)
  components/
    Characters.tsx Hand-drawn-style SVG animals (SVG turbulence filter for the inked wobble)
    PondMap.tsx    The walkable 2D map (requestAnimationFrame movement, click-to-walk)
    LevelRoom.tsx  Lesson → chat challenge → hints → win/defense card
  App.tsx          Title / map / level / finale screens
```

- **Stack:** React 18, TypeScript, Vite 6. It's a static site deployed on Vercel.
- **Every character is a deterministic script, not a live LLM.** Each one is written to fall for exactly the weakness its level teaches. That makes the game free to run, instant, and fair: the same trick always works, and there's no API key to leak. The agent interface in `game/types.ts` is `respond(input, state) → { replies, state, solved }`, so a real model or a hosted agent can replace any character without touching the UI.

## Security features

The game teaches security, so it tries to practice it too:

- **No backend, no secrets.** There are no API keys, tokens, or environment variables anywhere in the repo.
- **Strict Content-Security-Policy** (`vercel.json`): `script-src 'self'`, no inline scripts, `object-src 'none'`, `frame-ancestors 'none'`. The only outside origins allowed are Google Fonts.
- **Hardening headers:** HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, a strict `Referrer-Policy`, and a `Permissions-Policy` that turns off camera, mic, and location.
- **No HTML injection.** Chat text is rendered only as React text nodes, and `dangerouslySetInnerHTML` is never used.
- **Input limits.** Chat input is capped at 280 characters and answers at 40.
- **Safe storage.** Saved progress from localStorage is parsed inside `try/catch` and type-checked before use, so bad or tampered data just resets the game.
- **Dependencies:** `npm audit` reports 0 vulnerabilities (Vite 6, patched esbuild).
- **Snyk:** run a code + open-source scan before submitting (see below).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run lint
```

## Snyk scan

```bash
npx snyk auth
npx snyk test        # open-source dependencies
npx snyk code test   # static code analysis (turn on Snyk Code in your org settings first)
```

## Ethics

Everything in the game is a safe practice target. The win screen reminds players to test only systems they have permission to hack.
