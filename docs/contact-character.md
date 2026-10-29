# Contact character

Implemented locally in `codex/contact-character-3d` from `fca0ec0` for the owner's explicit request for the actual3D character beside contact links. Native visual approval and publication remain pending. This replaces the earlier CSS rotation of a flat poster.

## Source and presentation

The figure loads only the existing approved `/jovi-character.glb`, the same asset used by the introduction. It does not import the city, its buildings, floor, residents or assembly rig. The GLB contains one scene, one mesh, one skin and one animation; images are embedded, with no external image URI. The source bones, geometry, materials and rest pose remain intact. Only a parent group rotates, one turn per16seconds. No replacement body, generated image or provider was introduced.

The lightweight `contact-character.js` initializer is wired into `city-app.js`. It waits until the figure intersects the viewport and the document is visible before importing the existing local Three/GLTFLoader modules and fetching the GLB. Missing IntersectionObserver, WebGL initialization failure, HTTP/parse failure or context loss leaves the local poster visible. Failure is terminal for that instance, avoiding retry loops. The poster is hidden only after a successful rendered frame; a failed render restores it.

The transparent, noninteractive canvas is inside an `aria-hidden` figure. It has no controls, accessible name or focus stop; existing contact names and URLs remain unchanged. The frame is190px high, reserves86–140px in the existing contact grid and shifts left10px (6px at320–360px). The left column remains `minmax(0,1fr)`; CTA wrapping and the existing email wrapping remain available. These dimensions express intent, not proof of native fit. A centered orthographic camera fits both the model's height and its full rotating horizontal radius with12% margin. Lighting and SRGB/ACES output reuse the introduction's visual settings. There is no floor, background or shadow map.

Integration requires importing `/contact-character.css` at the start of `interface-refinements.css` and removing the superseded contact-primary/character rules and `contact-character-turn` keyframes from that file. The parent owns that edit. This branch deliberately does not alter `interface-refinements.css` or `city-page.mjs`.

## Motion and lifecycle

Rendering is capped at24fps (approximately20fps on a60Hz RAF), with pixel ratio capped at1.5. RAF stops outside the viewport and when the document is hidden. Reduced motion renders one static frame when visible and repaints only for relevant visibility/size changes. ResizeObserver updates the frame; a native resize listener is used if that observer is absent. The existing main-world startup and reading/error recovery are unchanged.

One lazy renderer is created for the one contact figure per page. Its idle resources remain until page teardown to avoid repeated parsing on ordinary scrolling. Nonpersisted `pagehide` calls cleanup; persisted pages keep their instance for back-forward-cache restoration. Cleanup removes observers/listeners, cancels RAF, aborts pending fetch, releases deduplicated geometry/material/texture/skeleton resources and image bitmaps, disposes the renderer and releases its WebGL context. A GLB parse or injected view resolving after cleanup is disposed without becoming visible. The source-normalization and deduplicated resource ownership patterns follow `city-residents.js`; its assembly helper is not invoked because it would build unused body parts and scene-specific behavior.

## Validation and limits

New behavior tests and the updated isolated-canvas markup contract failed before implementation. All35 focused character/direct/viewer/black/city/recovery tests then passed locally in123ms. The tests exercise lazy admission, hidden-document admission,24fps capping, visibility pause/resume, static reduced motion, resize, cleanup during loading, context loss/error fallback, idempotent initialization, late hidden assets, full-yaw camera bounds and one-time disposal of shared resources/bitmaps. The direct-page contract now allows exactly one decorative contact canvas while continuing to reject `city-canvas`, world loaders, GLB markup and driving/board controls. Existing404 and world-startup tests still pass.

No browser, server, full build, remote test, push or deployment was started. `git diff --check` passed. Native QA must confirm the actual character's facing/scale/turn, transparent background, readable silhouette, poster fallback,320px contact layout, keyboard/contact actions, reduced motion and visibility behavior. Unit fixtures do not certify a real GPU or final spacing. The parent also integrates the CSS import/removal before that QA.

## Cost and data impact

Local raw sizes measured from this revision on2026-10-29: GLB568140bytes; existing Three module/core plus GLTFLoader/BufferGeometryUtils total2276177bytes. A completely cold contact visit can therefore request about2844317raw bytes for the asset/vendor path, plus approximately7.3KB of new initializer/CSS. The already-used poster is79866bytes. Actual transfer depends on HTTP compression and cache hits; the main3D page may already have these vendor/model URLs cached, while direct reading previously did not load them. Cached bytes still require a separate scene/texture allocation for this isolated renderer.

Monthly incremental transfer can be estimated as `visible-contact-visits × cold-cache-fraction × compressed-vendor-and-model-bytes`, plus the small initializer/CSS payload. For scale only,1000fully cold contacts at raw size would be about2.84GB before compression; this is a scenario, not measured consumption or a charge. Dollar cost, GPU memory and energy were not measured. No new provider, account, recurring service, data collection, storage, cookie or permission was added. The owner explicitly authorized this visual/runtime tradeoff. Canonical costs/context and authorized publication evidence are reconciled by the parent; no secrets or private material are involved.
