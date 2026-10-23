# Historical studio implementation plan

Status: superseded by the [current Montagem 3D scope](samurai-world-plan.md). The checklist below belongs to the earlier studio/optional-game concept and does not authorize restoring it or publishing the current revision. Retained only for original scope/provenance; actual current verification belongs to `verification.md`.

## Original planning record

### Animated portfolio implementation plan

> Agentic workers: use subagent-driven-development for independent character/profile work, root implements integrated static experience. Owner explicitly requested no questions and recommended choices on 2026-10-22 UTC, overriding staged brainstorming approval gates.

Goal: a professional, fast three-language portfolio with a toy guide, genuine cases and an optional exploration game; publish a verified preview.

Architecture: generated static pages, CSS/SVG/DOM graphics, native modules and standard-library Node scripts. No runtime dependencies or database.

Spec: canonical Obsidian `/Users/jovi47/Documents/Obsidian Vault/portfolio/README.md`.

- [ ] `src/content.mjs`: translated copy for pt-br/en/es; source-backed case descriptions; public contacts.
- [ ] `scripts/build.mjs` and `src/page.mjs`: statically rendered localized home/policies/404, metadata/alternate URLs, share graphic and Vercel config. Start behavioral checks for required locale/contact/noindex/assets before production code; run red then implement.
- [ ] `public/style.css`: mobile-first tactile dark studio, isometric workbench, responsive editorial layout, carousel and mini world; inspect real rendering.
- [ ] Independent specialist `src/character.mjs`, `public/character.css`, `public/guide.js`: molded toy character and contextual motion without dependencies.
- [ ] `public/app.js`, `public/game.js`: carousel, theme/motion preferences, native dialog, touch/keyboard minigame with boundaries, progress/restart and announcements. Focused behavioral tests then interaction QA.
- [ ] `scripts/dev.mjs`: lightweight local preview with watch/SSE reload and exact static routing; test traversal and 404 contracts.
- [ ] Independent review, proportional local checks, real-browser responsive/accessibility/performance QA; fix observed defects.
- [ ] Public-file upload allowlist and secret/path review; Vercel preview deployment; verify same revision and rollback procedure. Noindex preview; no Search Console indexing of temporary URL.
- [ ] Separate GitHub README worktree/draft PR, profile bio if existing browser supports; no merge. Actual copy/assets stored in Obsidian, implementation docs reflect actual state.

Acceptance: three localized routes work without JS; contacts exact; real work and details usable; character accompanies tour; motion can pause and respects OS; game accessible and optional; mobile 320–430 and desktop screenshots coherent; no console errors or missing resources; preview URL verified. Missing user-supplied photo/Meshy export remains explicit, use verified current public portrait and CSS adaptation if available.
