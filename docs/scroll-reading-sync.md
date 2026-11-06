# Scroll-synchronized construction and explanation

Implemented locally from the owner's request on2026-10-29 (owner's date). Tablet/desktop construction and lateral explanation now advance together; no publication is implied.

The cause was explicit: `chapterTrackLengths()` reserved a build span followed by `measured overflow + 400px` of separate reading distance for each of the three buildings. `syncConstruction()` held the card at its top during construction and moved its text only in that following phase.

The correction keeps the existing build distances and logical story bands, but gives the three reading-only segments zero physical length. Each card's scroll offset is now `measured overflow × clamp(within build segment / segment length,0,1)`. The text therefore advances/reverses with the same scroll segment as the construction; the next building begins immediately after that span. There is no extra timer or autonomous scroll loop.

At a600px viewport the physical spans are850px for About,600px for HorAgora,600px for ASC and550px for the question:2600px total instead of3800px plus the three measured overflows. The page still reserves the actual sticky-board/viewport space through `storyTrackHeight()`, including height-capped boards. Longer explanations scroll proportionally faster through the same span; the visitor controls reading pace by page-scroll speed ; independent card scrolling is available after construction.

`storyScrollOffset()` maps explicit progress anchors back into physical distance and preserves progress on resize. An existing anchor such as HorAgora `.47` lies in a legacy reading band. It resolves to the preceding build's last physical pixel, keeping that building visible rather than skipping to ASC. Legacy logical bands remain compatible; normal physical scrolling never enters their removed reading intervals. The final content reaches the bottom as the build span ends; there is no additional bottom hold.

The patch changes only the story helpers and their callers. Mobile autoplay at up to700px, its enlarged inspection, renderer pixel-ratio/Safari policy, selection and assets are untouched. The integration carries other active changes; apply only this branch's hunks without replacing its `city.js` file wholesale.

Focused local evidence: the new helper test first failed against the prior module's missing export. After implementation,23story/viewer tests passed in101ms with zero skips; this includes real runtime glue in a VM, proportional forward/reverse card scrolling, chapter reset, exact boundaries, legacy hash targets, height-capped boards and invalid dimensions. `git diff --check` passed. Tests are not a visual/touch/browser validation of explanation legibility or animation pacing; that belongs to the integrated preview. No build, server, remote test, push or deploy was run by this branch.

Cost assessment: no dependency, provider, network request, asset, storage or retained process was added. Removing physical scroll-only spans can reduce frames during the guided tour, but CPU/GPU/energy and monthly savings are unmeasured. Source/static payload bytes change minimally; the parent delivery records its exact artifact delta and canonical cost note. Production and Search Console remain unchanged until a separately authorized publication.
