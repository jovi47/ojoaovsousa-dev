# Device language and theme

Owner decision,2026-10-30UTC: use device preferences by default and remember a visitor's explicit changes. Implemented in `codex/device-preferences`, based on9efeedf; publication requires the release receipt.

## Behavior

The generic `/` and `/index.html` entry selects a valid saved language first, otherwise the first supported `navigator.languages` entry, falling back to `navigator.language` and then PT-BR. Portuguese variants map to `/pt-br/`, English to `/en/`, Spanish to `/es/`. Search parameters and fragments survive the replacement. Explicit localized URLs and unknown paths are preserved, so every translation and the real404 remain accessible. The existing language links save a manual choice before native navigation.

The early, same-origin `public/preferences.js` script applies a valid saved `portfolio-theme`, otherwise `prefers-color-scheme`, before styles load. Device theme changes update the current page until the visitor chooses a theme. A manual change uses the existing `portfolio-theme` key and `themechange` event; the retired duplicate handler in `city-app.js` is removed. Existing accessible button names and renderer theme observation remain.

Only manual choices are persisted: `portfolio-theme` contains `light` or `dark`; `portfolio-language` contains `pt-br`, `en` or `es`. Automatic device readings are not stored or transmitted by this feature. Storage denial does not stop rendering, navigation or a manual theme change in the current page; persistence then remains unavailable. Preferences remain local until cleared. The three privacy translations describe this functional storage. No database, provider, permission or analytics-consent change is introduced.

To return to automatic preferences, remove only these two preference keys from this site's browser storage. Debug with the HTML `lang`, `data-theme`, device language list and color-scheme media query; do not export unrelated storage/auth. With JavaScript unavailable, static PT-BR root content and native language links remain; automatic detection is unavailable.

## Publication and SEO

Pages must serve the generic root with HTTP200 rather than the former fixed301 to PT-BR. Root remains noindex. The other trailing-slash and retired-language redirects remain. The release verifier checks the exact root document and preference script. A browser that cached the previous permanent redirect may keep using it until that cache is refreshed; validate with a fresh session after publication.

Nine canonical localized pages, reciprocal hreflang, PT-BR x-default, direct-reading noindex and sitemap membership are unchanged. Localized pages never force another language, following [Google's multilingual-site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites). The policy copy changes within its existing URLs. After authorized publication, verify root200, bootstrap MIME/CSP, localized canonical/indexability, privacy copy and sitemap availability; keep the existing Search Console submission and record its actual processing state.

## Evidence and cost

The new bootstrap/load-order and root deployment regressions failed before implementation.22 focused local tests passed in the integrated source, including a real production-mode static build of the existing SEO contract; no remote test workflow ran. Independent review found the fixed-root redirect conflict, which was corrected and re-reviewed without remaining findings.

Native browser QA used an isolated loopback origin: Spanish device settings selected `/es/` with query/fragment intact; a manual English choice survived returning to root; explicit PT-BR remained accessible. Dark applied automatically; manual light survived reload and a dark device setting; after clearing only QA-created preferences, live device changes updated the theme. These are emulated browser preferences, not physical-device certification. The QA tab and emulation are temporary and must be released before closing the delivery.

`preferences.js` adds2298 raw bytes and one cacheable same-origin script request; removing duplicate theme code saves861 raw JS bytes, net+1437. The script tag adds39 raw bytes per generated document; the three privacy paragraphs add407 raw text bytes in total. Actual compressed transfer, cache, latency, energy and monthly billing are unmeasured. Monthly marginal transfer equals effective requests per changed artifact times its effective transferred-byte delta, plus changed HTML traffic; applicable tariffs and usage remain unknown. No dependency, paid service, server job or JavaScript timer is added.
