# sebasite Style Guide — "Manifest"

## Concept

Sebastian's best stories are about moving real things reliably: 1M+ packages through peak season, a Brexit fix that recaptured $3M, an app replatformed for millions of daily users. The site borrows the visual language of a **shipping manifest / packing slip** — warm paper, crisp ink, monospace labels, stamps, and perforated edges — and pairs it with confident editorial type.

The result should feel like a well-made engineering document, not a template: precise, warm, a little playful, and very easy to scan for a recruiter in 30 seconds.

Three rules:

1. **Label everything like a manifest.** Small uppercase monospace labels sit above content (`ROLE`, `SHIPPED`, `STACK`, `ETA`).
2. **One loud thing per screen.** Big display type or one green stamp — never both competing.
3. **Proof over adjectives.** Every section leads with a number or an outcome.

## Voice

- First person, plain, specific. "I replatformed Wyndham's app to React Native," not "Results-driven engineer leveraging…".
- Short sentences. Numbers as digits (`40%`, `1M+`, `$3M`).
- One light personal line per page is welcome (Factorio, pot roast, swimming, Medellín) — it's what makes this site memorable.

## Color

The resume already uses green `#4b8a3e`; the site keeps it as the signal color so resume and site read as one brand.

| Token | Light | Dark ("night shift") | Use |
| --- | --- | --- | --- |
| `--paper` | `#F6F3EC` | `#121412` | Page background |
| `--paper-2` | `#ECE7DC` | `#1B1E1B` | Cards, insets |
| `--ink` | `#16181D` | `#EDEAE2` | Body text, borders |
| `--ink-muted` | `#5A5E66` | `#A3A69E` | Secondary text, labels |
| `--rule` | `#D8D2C4` | `#2C302C` | Hairlines, perforations |
| `--signal` | `#4B8A3E` | `#7BC46A` | Stamps, fills, large text only |
| `--signal-ink` | `#2F6B2A` | `#9AD88A` | Links and small green text (AA) |
| `--marigold` | `#E8A33D` | `#F0B457` | Highlights, "new" tags, focus ring. A nod to Medellín's flower festival |
| `--danger` | `#B3412E` | `#E2725F` | Errors only |

Contrast notes: `--ink` on `--paper` is ~16:1. `--signal` on `--paper` is ~3.8:1, so it's for fills and text ≥ 24px only; use `--signal-ink` (~5.8:1) for links and small text. Ink text on a marigold fill is ~8:1.

Don't: use pure black/white, gradients, or more than one accent per component.

## Typography

| Role | Typeface | Notes |
| --- | --- | --- |
| Display | **Bricolage Grotesque** (variable, Google Fonts) | Name, section titles. Weight 700–800, tight tracking (`-0.02em`) |
| Body | **Inter** | 16–18px, line-height 1.55 |
| Labels / data | **JetBrains Mono** | Uppercase, 12px, `letter-spacing: 0.08em`, `--ink-muted` |

Fluid scale (clamp, mobile → desktop):

| Token | Size |
| --- | --- |
| `--step-5` (hero name) | `clamp(2.75rem, 7vw, 5.5rem)` |
| `--step-4` (section title) | `clamp(2rem, 4vw, 3rem)` |
| `--step-3` (card title) | `clamp(1.375rem, 2.2vw, 1.75rem)` |
| `--step-2` (lead paragraph) | `1.25rem` |
| `--step-1` (body) | `1.0625rem` |
| `--step-0` (small / labels) | `0.75rem` |

Use `font-variant-numeric: tabular-nums` for dates and metrics so columns align.

## Space, grid, shape

- Spacing scale (4px base): `4, 8, 12, 16, 24, 32, 48, 72, 112`.
- Content max-width `1120px`; reading max-width `68ch`.
- 12-column grid on desktop, 4 on mobile, `24px` gutters.
- Corners: `--radius-sm: 6px` (inputs, chips), `--radius-md: 14px` (cards). No pill buttons except status chips.
- Borders over shadows: `1px solid var(--ink)` on primary cards, `1px solid var(--rule)` on secondary. One shadow allowed: `4px 4px 0 var(--ink)` ("offset print") for the hovered primary card.

## Signature elements

- **Perforated edge**: a dashed `--rule` top border with small half-circle notches, used to separate the hero "label" from the rest of the page.
- **Stamp**: rotated `-4deg`, `2px` `--signal` border, mono uppercase, used once per section for the headline metric (`1M+ PACKAGES`, `$3M RECAPTURED`, `-40% MEMORY GROWTH`).
- **Tracking line**: the experience timeline is drawn as a vertical route with nodes; each job is a "stop" with a date in mono.
- **Barcode divider** (optional): a thin SVG barcode generated from the URL, used in the footer only.

## Layout (single page)

1. **Hero / shipping label** — name (display), role "Full Stack & Mobile Engineer", location "Boston, MA", primary actions: `Resume (PDF)`, `LinkedIn`, `GitHub`, `Email`. No availability/status chip.
2. **Proof strip** — 3–4 stamps with the headline numbers.
3. **Recent work** — TELUS Digital client cards (Wyndham, Dow Jones, McClatchy), each: client, what I did, one metric, stack chips.
4. **Route** — the full experience timeline back to 2014, collapsible below the fold.
5. **Skills** — five manifest rows (Languages, Mobile, Web/Cloud, AI, Tools) as chips. Mirrors the resume exactly.
6. **Lab** — the interactive tools as "parcels": Ask my resume (AI chat), Share a Checklist, QR code generator.
7. **Off the clock** — one short line + photo (`src/assets/IMG_9622.jpeg`) with a duotone ink/paper treatment.
8. **Footer** — email, links, "Last updated" date, barcode divider.

## Components

**Buttons**

- Primary: `--ink` fill, `--paper` text, `--radius-sm`, 44px min height. Hover: offset print shadow + 1px translate.
- Secondary: transparent, `1px --ink` border.
- Text link: `--signal-ink`, underline offset `0.2em`, thickness `1px` → `2px` on hover.

**Manifest label** — `<span class="label">STACK</span>` mono, uppercase, muted, 8px below to content.

**Chip** — mono 12px, `--paper-2` background, `1px --rule` border, `--radius-sm`.

**Client card** — `--paper` background, `1px --ink` border, `--radius-md`, 24px padding. Header row: client name (step-3) + date (mono, right-aligned). Footer row: stack chips.

**Parcel (tool card)** — same as client card plus a mono header bar (`PARCEL 01 · ASK MY RESUME`) with perforated bottom edge. Every parcel must have three states designed: idle, loading, error/offline (with an "email me instead" fallback).

**Chat**

- User bubble: `--ink` fill, `--paper` text, right-aligned.
- Assistant bubble: `--paper-2`, left-aligned, renders basic markdown (links, lists).
- Suggested prompts as chips above the input: "What did you do at Wyndham?", "What's your AI workflow?", "How do I contact you?".
- Loading: three mono dots `· · ·` animating; disable input.

**Inputs** — 44px min height, `1px --ink` border, `--radius-sm`; focus ring `2px solid var(--marigold)` with `2px` offset; error text in `--danger` below the field, linked with `aria-describedby`.

## Iconography and imagery

- Icons: inline SVG, 1.5px stroke, 20/24px ([Lucide](https://lucide.dev) style). Self-host brand marks for GitHub/LinkedIn instead of hotlinking.
- Photo: one portrait, duotone (ink + paper), cropped tight. No stock imagery.
- Favicon: monogram "SA" in a stamp outline, `--signal` on `--paper`. Also provide `apple-touch-icon` and an OG image (1200×630) using the hero label design.

## Motion

- Durations: `120ms` (hover), `220ms` (reveal), easing `cubic-bezier(.2,.7,.2,1)`.
- Page load: hero label slides up 8px + fades in; stamps "thunk" (scale 1.08 → 1) staggered by 80ms.
- Timeline nodes fill as they scroll into view.
- Everything above is disabled under `@media (prefers-reduced-motion: reduce)`.

## Accessibility baseline

- WCAG 2.2 AA contrast (see color notes); visible focus on every interactive element.
- Real `<button>`/`<a>` elements — no `onClick` on `<div>`/`<b>`.
- All images have `alt`; decorative SVGs use `aria-hidden="true"`.
- Chat log is an `aria-live="polite"` region.
- Tap targets ≥ 44×44px; layout tested at 320px width.

## Tokens (paste into `src/index.css`)

```css
:root {
  --paper: #F6F3EC;
  --paper-2: #ECE7DC;
  --ink: #16181D;
  --ink-muted: #5A5E66;
  --rule: #D8D2C4;
  --signal: #4B8A3E;
  --signal-ink: #2F6B2A;
  --marigold: #E8A33D;
  --danger: #B3412E;

  --font-display: "Bricolage Grotesque", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --step-5: clamp(2.75rem, 7vw, 5.5rem);
  --step-4: clamp(2rem, 4vw, 3rem);
  --step-3: clamp(1.375rem, 2.2vw, 1.75rem);
  --step-2: 1.25rem;
  --step-1: 1.0625rem;
  --step-0: 0.75rem;

  --radius-sm: 6px;
  --radius-md: 14px;
  --shadow-print: 4px 4px 0 var(--ink);
  --ease: cubic-bezier(.2, .7, .2, 1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --paper: #121412;
    --paper-2: #1B1E1B;
    --ink: #EDEAE2;
    --ink-muted: #A3A69E;
    --rule: #2C302C;
    --signal: #7BC46A;
    --signal-ink: #9AD88A;
    --marigold: #F0B457;
    --danger: #E2725F;
  }
}
```
