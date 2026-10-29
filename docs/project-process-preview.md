# Process stages and fictional website previews

Current implementation on the preview-variations branch, based on the published desktop UI revision `90e3d80`. The new examples and shuffle described below are local changes; this document does not claim they are published or visually approved.

## Presentation and progression

The shared PT/EN/ES component has one localized H2, four native stage buttons in a horizontal connected timeline and one active description. Without JavaScript, all stage descriptions remain available and the completed architecture example is visible. Enhanced content is at most1040px wide. At960px and wider, terminal and site preview occupy separate windows and remain visible together; compact screens alternate them. The fixed preview heights are300px through700px,330px through799px,390px through959px and430px above that. These are source dimensions, not visual-QA evidence.

The process retains25% intersection activation,400ms startup,420ms line pacing and sixteen lines. Completed groups of four lines fill the connectors and reveal header, copy, artwork/metrics and services in the desktop preview through `data-process-built`. Manual selection and Home/End/arrow navigation preserve roving focus. Document hiding pauses work; full viewport exit resets assembly. Reduced motion starts at the final static state. The existing breakpoint listener reconciles panel visibility and accessibility attributes without restarting the clock; cleanup restores static content.

A45% dark overlay and green check remain above the finished preview, including reduced-motion and no-JavaScript rendering. The check pop and450ms example entrance respect reduced motion. The final examples carousel uses one5000ms timer only when the finished component is sufficiently visible, the document is visible and reduced motion is off. No additional animation timer was introduced by the new examples.

## Five local examples and shuffled order

The examples are architecture/interiors (**forma**), management (**nexo**), a medical website (**viva+**), a homeware shop (**lume**) and a restaurant (**brasa**). Each has an explicit fictional label in PT/EN/ES. Lume and Brasa reuse the existing header, hero, decorative CTA and services layout, so all four construction reveals apply to them too. Their ceramics and plate illustrations are original inline SVG authored for this portfolio. They are illustrative interfaces, not claims about completed client projects. None has a live link, button, form, provider, external URL or purchasing/booking workflow.

`createProjectExamples()` performs Fisher–Yates once per component initialization using `Math.random`. It selects the first shuffled example immediately, before assembly starts, and preserves that choice through completion. The completed carousel then cycles all five in the same shuffled order. Retaining that order avoids additional reshuffles and guarantees no adjacent repeat at the cycle boundary. Pausing, resizing and resuming do not reshuffle. A fresh component initialization selects a fresh permutation; randomness does not guarantee a different first choice on every visit. There is no cookie, storage or visitor identifier. The optional random-function argument exists for deterministic tests.

Static markup always starts with Forma and hides the other four examples. Cleanup cancels the existing carousel timer and restores that original fallback regardless of shuffled order. Reduced motion still selects a random example on initialization but displays it statically. Existing CSP remains unchanged: SVG uses local attributes, chart heights use external CSS and no inline style attribute is emitted.

## Validation and delivery limits

The new five-example markup assertion and deterministic shuffle test failed before implementation. All26 focused process/direct/viewer tests passed afterward in90ms with no skips. Coverage includes two known shuffle sequences, immediate initial selection, all-five traversal, cycle boundary, pause/resume, assembly-to-completion continuity, reduced-motion changes, document visibility, timer cleanup and restoration of Forma. Existing localized markup checks reject interactive sample controls, external assets and inline styles. `git diff --check` passed.

Previous integrated native QA covered the earlier three-example layout at320px PT/EN/ES,483px and1280px, including dark mode and persistent completion overlay. That historical evidence does not validate the new shop/restaurant wrapping or randomized initial layouts. The parent must inspect all five in its single integrated preview at compact and desktop widths, including construction, reduced motion and final overlay. No server, browser, build, remote test, push, merge or deploy was started for this branch.

The related desktop identity, section rhythm, heading and breakpoint decisions are described in [desktop-layout.md](desktop-layout.md). Publication and Search Console evidence remain the responsibility of the authorized parent delivery; this patch changes no URL, metadata, canonical, robots or sitemap contract.

## Cost and data impact

Two small local HTML/SVG samples and their translations increase generated markup; the shuffle adds four random draws and array swaps per initialization. Existing5000ms timing is reused, with no extra timer, network request, dependency, provider, collected data or storage. Full-page compression, client energy and monthly billing effects have not been measured; no savings or billing claim is made. Canonical context and marketing-source records are reconciled by the parent in the existing portfolio notes, without private material.
