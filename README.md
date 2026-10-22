# João Victor · jovi47

Multilingual freelance portfolio built with static HTML, CSS and native JavaScript. The toy studio and guide use DOM/CSS; there is no runtime framework, WebGL, remote font, analytics SDK or package dependency.

## Run

Requires Node 22 or newer. No install step.

```sh
node scripts/build.mjs
node scripts/dev.mjs
```

Preview defaults to `http://localhost:3000/pt-br/`. `PORT` selects an available local port. Source/assets watch and server-sent events reload the page. Stop with Ctrl-C. The server is loopback-only and returns real 404 responses.

```sh
node --test tests/*.test.mjs
node scripts/audit.mjs
```

## Content and interaction

- `src/content.mjs`: PT-BR, British English and Spanish copy, cases, policies and labels.
- `src/page.mjs`: semantic static pages and localized metadata.
- `src/character.mjs`, `public/character.css`, `public/guide.js`: reusable toy and section guide.
- `public/app.js`: theme, motion preference, carousel, dialogs and studio replay.
- `public/game-state.js`, `public/game.js`: optional exploration game, keyboard/touch movement, accessible coordinates, collection, exit and restart.
- `public/style.css`: visual system, responsive studio, components and reserved tour rail.

All important portfolio content exists in generated HTML. Interactive controls require JavaScript. Themes and motion preferences use optional localStorage; game progress is not stored or transmitted. Motion respects the OS preference and can be paused. Native dialogs provide Escape and focus restoration.

## Assets and provenance

`portrait.jpg` is the owner's current public GitHub avatar (user ID 52054783), retrieved on 2026-10-22 UTC; the separately mentioned photo was not attached. `horagora.jpg` and `andrea.jpg` are captured public homepages, not invented mockups. Hori's approved WebP is used only on the HorAgora case, as requested. The toy is an original CSS adaptation of the visual prompt shown in the owner's Meshy workspace. No generation credits were consumed and no high-polygon model is loaded.

Public references: LEGO Movie's main trailer, LEGO Play's creative building/stop-motion language and Habblaud's modular studio narrative. Source, trademarks and media were not copied. LEGO is a personal interest, with no brand affiliation.

## Hosting, SEO and recovery

`vercel.json` is ready for a static Vercel build (`node scripts/build.mjs`, output `dist`). The existing Vercel browser login reached a passkey requirement; no recovery codes, security changes or new credentials were used. A private owner-only Sites preview is configured by `.openai/hosting.json`.

The default build is deliberately `noindex, nofollow`, has a blocked preview robots policy and an empty sitemap. `SITE_URL` accepts an HTTPS origin; it enables canonical, alternate languages, Open Graph and visible-fact Person JSON-LD. Only set `INDEXABLE=true` for a deliberately authorized public canonical release. Update the hosting privacy notice, verify real headers/404s/languages and submit the correct canonical property/sitemap to Search Console after that release. A temporary private preview is not submitted for indexing.

Vercel security headers include MIME protection, referrer and permissions policies and CSP. The preview provider's actual HTTP policies must be verified separately. The portfolio has no forms, login, backend, database, customer data, secrets or transactional mutations. Privacy and Terms describe the actual preview and contact channels; they are not a compliance certification.

Recovery: redeploy the previously saved verified Site version, or redeploy a previous eligible Git commit to Vercel. The static app has no database migration to undo. Keep source and the prior artifact available until the new URL is verified; publishing does not by itself prove availability or rollback behavior.

## Validation and remaining limits

Behavioral tests cover game bounds, collection uniqueness, win/restart state, all locale/contact/policy paths and preview robots. Actual-browser QA covers responsive geometry, dialogs, keyboard completion, carousel boundaries, theme, motion and translated pages. No physical-device, assistive-technology or field Core Web Vitals claim is made. See `docs/verification.md` for observed revision-specific evidence.

Source/private-path review is mandatory before every push or deployment. Never include `.private`, `ACESSOS.local.md`, real envs, auth/session material or copies, even under another name. Remote tests are not part of development; this project has no GitHub workflow triggers.

Business, decisions, public marketing copy, approved assets and delivery evidence are canonical in the existing Obsidian vault's `portfolio/` project. Code/tests remain in Git.
