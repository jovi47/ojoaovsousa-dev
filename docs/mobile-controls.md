# Shared contact and compact scene controls

Implemented locally from the owner's browser annotations on 2026-10-28 (owner's local date); publication is not implied.

The shared header and floating contact action use the same local stepped-outline conversation SVG with two small brick-like squares. Their existing translated names, contact destinations and channel dialog remain unchanged. The floating action always displays its localized text, including compact widths, and uses a plain rounded rectangle without the decorative LEGO tabs. Existing tour visibility/permission gates still apply; the annotation asked to retain the visible label, not to bypass the tour's disabled state.

At up to700px, construction selectors retain48px height and smaller21px marks. The scene tools retain44×44px targets and accessible localized names, positioned at the scene's upper right through the scene grid area. Replay's long visible label is hidden there; its title and accessible name remain available. The subsequent owner request removes previous/next and pause controls from all viewports in the separate scene implementation; this stylesheet does not recreate them. Reading/graphics fallback does not use the overlay.

The existing header portrait sways from−3° to3° over7seconds only when the user permits motion. The animation pauses when the page is hidden, a dialog is open, the identity is hovered/focused, or `body.annotation-active` is present. The scene lifecycle integration owns the annotation class; this stylesheet adds no event handlers or runtime process. At up to700px, the header contact action is omitted because the labeled floating contact action already supplies it. Above700px, the header retains the same shared icon and contact action.

`public/interface-refinements.css` is linked after the selected page stylesheet by the shared HTML renderer, so home, reading and policy headers stay consistent. No framework, dependency, provider, external asset, storage, data collection or recurring service is introduced. CSS animation can consume client CPU/GPU; the actual effect is unmeasured and not a claimed saving. Static bytes should be included with the final integrated build audit and canonical cost note.

Latest owner refinement replaces the earlier arrow with the geometric conversation mark and removes the duplicate mobile header action. These cosmetic changes require integrated visual review.

Focused checks before that cosmetic refinement:11 existing contact/viewer/direct tests passed locally in77ms, zero skipped; `git diff --check` passed. These cover markup/channel and fallback contracts, not rendered alignment, touch behavior or visual sizing. Real mobile/tablet/desktop visual QA belongs to the integrated preview before delivery. No remote tests, push, merge or deploy was performed by this branch.

Latest owner refinements: duplicate language links inside the phone hamburger menu are removed, retaining the header selector. Menu uses a centered28px SVG within the existing44px hit area. The visible mobile/desktop scene tools now contain replay only; four landmark selectors remain. This note describes the local branch, not a production release.

Alignment follow-up: replace the font hamburger with an inline28px SVG in a44×44px grid-centered button with zero padding. Native483px inspection measured icon/button center deltas0px horizontally and vertically;13 focused shared-markup/contact tests passed.
