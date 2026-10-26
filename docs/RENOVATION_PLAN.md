# sebasite Renovation & Repair Plan

Audit date: Oct 19, 2026. Site: https://sebasite.netlify.app/ (Solid.js + Vite on Netlify, one Netlify function).

## What's broken right now (verified against production)

| # | Feature | Symptom | Root cause |
| --- | --- | --- | --- |
| 1 | Resume AI chat | Every message returns "No response." | `/.netlify/functions/chat` returns HTTP 500: OpenAI `429 You have no credits remaining`. The UI ignores `res.ok` / `data.error`, so the user sees a misleading reply. |
| 2 | Share a Checklist | Lists never load; create/add does nothing | The Supabase project in the production bundle (`icxsevcmjmykuvheyavx.supabase.co`) no longer exists (DNS NXDOMAIN). Free-tier projects get paused, then deleted. |
| 3 | Shared checklist links | Someone opening a link you sent is bounced to `/` | `ShareList.tsx` `createEffect` calls `newList()` (navigate home) when the id isn't in the visitor's localStorage, and it runs before `onMount` adds it. Only the list's creator can ever open it. |
| 4 | Enter key everywhere | Pressing Enter in the chat box or QR input tries to create a todo; on revisits todos get created multiple times | `ShareList.tsx` adds a `document` `keydown` listener in `onMount` and never removes it. |
| 5 | Switching lists | Clicking a saved list from another list shows stale data | Solid props are destructured (`({list_id})`, `({containers})`), which drops reactivity; the resource is built once with the first id. |
| 6 | Chat cost/abuse | Probably why credits ran out | The function trusts client-supplied history: any role (including `system`), unlimited messages and length, unbounded tool-call loop, no `max_tokens`, no rate limit, no spend cap. |

Smaller issues: header text overflows horizontally at ≤1024px wide; header colors (aquamarine on slate grey, ~2.9:1) fail contrast; the burger menu and list names are clickable `<div>`/`<b>` elements, so keyboard users can't reach them; logo `<img>` tags have no `alt`; social icons are hotlinked from GitHub/Wikimedia.

## Already done in this pass (content)

- `public/me/sebastian_aguirre_resume.txt`, `public/me/summary.txt`, and the inline copy in `netlify/functions/chat.ts` now match the 2026 resume (TELUS Digital role, new title, skills, Boston; medical sabbatical / Weymouth / "August 2025" removed).
- Home intro rewritten to "Full Stack & Mobile Engineer", plus links to the resume PDF (`public/me/Sebastian_Aguirre_Resume_2026.pdf`) and email.
- Page `<title>` and meta description (was "Solid App").
- Chat header no longer claims "GPT-4o" (the function uses `gpt-4o-mini`).

## Personal info checklist (manual — needs Sebastian)

LinkedIn URL `linkedin.com/in/sebastian-aguirre-52ba93aa` resolves and matches the resume. The profile content, judged from the public `linkedin.pdf` export (Aug 2025), is behind:

- [ ] Headline → "Full Stack & Mobile Engineer".
- [ ] Add **TELUS Digital, Full Stack Engineer, Sep 2025 – Oct 2026**, with Wyndham / Dow Jones / McClatchy bullets.
- [ ] Align titles with the resume (or the resume with LinkedIn) — recruiters compare them:
  - LogixHealth: LinkedIn "Mobile Application Developer" vs resume "Mobile Applications Engineer".
  - Bento: LinkedIn "Senior Software Engineer" vs resume "Mobile Team Lead".
- [ ] Replace the About section ("Im an energetic software developer…") with the resume summary.
- [ ] Top skills: currently .NET Framework / HTML / C# → Swift, React Native, TypeScript (plus AI-assisted development).
- [ ] Add the website to the LinkedIn contact info.
- [ ] Optional: claim a vanity URL (e.g. `/in/sebastian-aguirre-dev`). If you do, update the resume, `Home.tsx`, and `public/me/*.txt`.
- [ ] `public/me/linkedin.pdf` is publicly downloadable and stale. Delete it, or re-export after updating LinkedIn. Nothing in the code references it.
- [x] Twitch link removed from the site.
- [x] No "open to new roles" status on the site.

## Phase 1 — Stop the bleeding (≈1 day)

**Chat (bugs 1, 6)**

1. Restore the API: add OpenAI credits **and** set a monthly project budget/hard limit in the OpenAI dashboard, or move to a cheaper provider/model. Rotate the key if you suspect abuse.
2. Harden `netlify/functions/chat.ts`:
   - Accept only `{role: 'user' | 'assistant', content: string}`; drop everything else.
   - Keep only the last ~12 messages; cap each at ~2,000 chars and the total body size.
   - Limit tool-call iterations to 3; set `max_tokens` (~500).
   - Wrap `JSON.parse(tool_call.function.arguments)` in try/catch.
   - Add Netlify rate limiting for the function path (e.g. 20 req/min per IP) and an `Origin` check.
   - Return `{error}` with proper status codes; never leak raw provider errors to the client.
3. Fix `ChatAppSolid.tsx`: check `res.ok`; on failure show "The AI is offline — email me at osebas15@gmail.com" instead of "No response."
4. Rename the "LinkedIn Profile" heading in the system prompt to "Resume" (it receives resume text).

**Checklist (bugs 2–5)** — decision: keep it; the Supabase backend is being brought back online. Confirm whether it's the same project/URL or a new one (Option A applies if new):

- **Option A, revive it:** create a new Supabase project, recreate the `todos` table (`id`, `task`, `is_complete`, `inserted_at`, `list_id`) with Row Level Security, upgrade `@supabase/supabase-js` v1 → v2 (v1's `.from('todos:list_id=eq.x').on()` realtime API doesn't work on new projects; use `supabase.channel().on('postgres_changes', …)`), and set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in Netlify. Add a scheduled ping or upgrade so the project isn't paused again.
- **Option B, retire it:** remove `ShareList*`, `ListIdCell`, `TodoCell`, `CopyToClipboard`, `backend/`, the `/sharelist/:list_id` route, and the Supabase dependency. Keep the URL so it redirects home.

If you keep it (Option A), also:

- Remove the `newList()` redirect in the effect; call `addListIds([props.list_id])` when the list loads (bug 3).
- Replace the document `keydown` listener with a `<form onSubmit>` around the todo input (bug 4).
- Stop destructuring props; use `props.list_id` and wrap `ShareList` in a keyed `<Show>` so a new id rebuilds it (bug 5).

## Phase 2 — Foundation cleanup (≈1 day)

- **Single source of truth for profile data**: create `src/content/profile.ts` (name, title, links, summary, skills, jobs). The homepage renders from it, and the Netlify function imports it to build the prompt. Delete the duplicated text in `chat.ts` and `public/me/*.txt`.
- **Delete dead code**: `src/resume_bot/app.ts` (Node-only, uses `fs`/`dotenv`, never imported), `AboutMe.tsx`, `ColoredLine.tsx`, unused imports in `App.tsx`, duplicate `src/public/_redirects`, empty `test/` folders, template `README.md`.
- **Dependencies**: remove `@mui/*`, `@emotion/*`, `react`, `dotenv` (unused in a Solid app); keep one lockfile (pnpm *or* npm — `package-lock.json` is gitignored but present).
- Add `tsconfig.json` (TSX files currently rely on `jsconfig.json`) and `netlify.toml` (build command, publish dir, Node version, function rate limits).

## Phase 3 — Renovation (≈3–5 days, see `docs/STYLE_GUIDE.md`)

1. Add design tokens and fonts to `src/index.css`; remove the old slate/aquamarine styles.
2. Build primitives: `Label`, `Chip`, `Button`, `Card`, `Stamp`, `Parcel`.
3. Rebuild `Home.tsx` as the single-page layout: hero label → proof stamps → recent work → route timeline → skills → lab → off the clock → footer.
4. Restyle the chat as a Parcel with suggested prompts, markdown rendering, an `aria-live` log, and an offline state.
5. Restyle the QR tool, plus the checklist if kept.
6. Self-hosted SVG brand icons, new favicon set, OG image, `robots.txt`, `sitemap.xml`, JSON-LD `Person` schema.
7. Responsive pass at 320 / 768 / 1280px; dark mode; reduced-motion.

## Phase 4 — Keep it from breaking again

- GitHub Action on every PR: `vite build`, typecheck (`tsc --noEmit`), and a link checker (e.g. lychee) over the built site and `public/me/*`.
- A small Playwright smoke test: homepage renders, resume PDF is 200, the chat returns a non-error reply (or a mocked one), and a shared checklist link opens on a fresh browser profile.
- Uptime/health check on `/.netlify/functions/chat` (Netlify scheduled function or a free uptime monitor) that alerts via your existing Pushover setup.
- Lighthouse budget: ≥ 95 for Performance, Accessibility, Best Practices, and SEO.

## Definition of done

- No feature on the page fails silently; every tool has a working path or an honest fallback.
- Site, resume PDF, chat bot knowledge, and LinkedIn all say the same thing.
- Lighthouse ≥ 95 across the board; AA contrast; works at 320px.
