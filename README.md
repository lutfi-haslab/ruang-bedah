# Ruang Bedah

A health & medicine wiki built as a small LMS: pick a subject, work through its
topics lesson by lesson. Every lesson follows the same anatomy — an interactive,
animated lab, a reading chapter, flashcards, and a quiz — and progress is saved
in the browser.

**Live:** https://ruang-bedah.pages.dev/

## Curriculum

Subject → Topic → Lesson, modelled in `src/data/curriculum.ts`
(5 subjects, 13 topics, 26 lessons). Currently available:

- The Heart: Chambers, Valves, and Vessels (interactive heart lab)
- Arteries, Veins, and Capillaries (animated blood-flow lab)
- The Lungs and the Pleura (animated breathing lab)
- The Cardiac Cycle: Systole and Diastole (four-phase cycle lab)
- Coronary Bypass (CABG): Building the Detour (blocked vs bypass lab)

## Stack

React 19 + TypeScript + Tailwind CSS v4, routed with react-router-dom,
deployed as a static SPA to Cloudflare Pages (`public/_redirects` provides the
SPA fallback). Design tokens and rules live in `DESIGN_SYSTEM.md`.

## Develop

```bash
bun install
bun run dev      # local dev server
bun run build    # typecheck + production build into dist/
```

## Note

Educational content only — not medical advice. The one binary asset,
`public/assets/heart-anterior.png` (the Open Graph image), is deployed with the
site but is not tracked here.
