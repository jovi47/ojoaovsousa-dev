# Mobile scene implementation plan

Goal: implement the owner-approved visual comments and keep medium screens guided by scroll.
Spec: Obsidian portfolio/backlog/immersive-world.md, “Proposta de refinamento por marcações visuais”, approved in this chat.
Architecture: reuse selection, local replay, existing render loop and responsive layout. No dependency/provider/schema change. Native inline execution; independent final review.

- [x] Scene task: test a single-pass autoplay state machine with controlled time (first visit builds4.2s, then holds5s; pauses, revisits and completion). Observe failure, implement, verify.
- [x] Integrate with visibility/dialog/annotation/reduced motion and user interaction. Owner subsequently removed visible pause/previous/next; preserve OS reduced motion and preserve native phone pan/pinch. Scope mobile to700px, restore guided tablet layout above it, increase phone framing approximately15% without clipping.
- [x] Controls task, separate branch/worktree: existing header/FAB/icons and compact controls; owned by controls agent. Integrate only its scoped diff.
- [ ] Update existing tests for new breakpoint; validate focused behavior, build/audit and native320–474/768–1024/desktop, three locales and themes. Heavy checks use Jovi admission; Linux currently unreachable, preserve previous unknown jobs.
- [ ] Review independently, fix findings, record exact revisions/evidence/cost limits in existing docs and Obsidian; preserve single integration preview3000. No push/CI/merge/deploy.

Review focus: interrupted first assembly; pending auto progression after manual focus; pointer/pinch scrolling; resize selection and guided completion; hidden/annotation/reduced rendering; contact safe areas and header widths.

Progress: isolated branches created from integration ab33a40; other dirty integration changes preserved. Source manifests: Git HEAD plus hashes to be recorded before the scoped check.

Ruling: latest visual comments supersede pause/arrows, diagonal contact icon, labeled scroll pill, visible rotation text and700–1100 free flow. New phone inspection is stacked over this scene delivery. Independent review found no confirmed defect; its viewport-restoration QA concern was addressed with a failing-then-passing focused test and background scroll lock. Native partial QA and full-suite admission limits are in mobile-experience.md. No heavy check bypass or CI run.

Source provenance before final focused check: HEAD`a3d6f4b6b3303f641997c31a9dc5bae56fc16445`; local eligible source hashes:

- `public/city.js`: `c27167ed87699f46b45708efe3a0d36c07b7d9fc38b588a0478bc77c6d98754a`
- `public/city-autoplay.js`: `3ec2df829915d0efc7f58b6b8b176824d72aca4e422b33a50ac6dc26defb1dfd`
- `public/city-inspection.js`: `9edfda63c6c60c91653cd60e6f8c46d6cb0993569729edee89761a4ea378a004`
- `public/viewer.css`: `f19c18928dcf8de1aede1db46880a899e5177fb2c26826b1b929507c9f4694cd`
- `src/viewer-page.mjs`: `a2e45225ee283e18ddf758f00eb451898fb8d722bb28ea93449b972f81699e24`
