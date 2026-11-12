# Search discovery

Updated 2026-11-06 UTC. Production source is `c94e71c30b207ed03cc92f19005de3a6e2edcd08` on main (unchanged runtime `b701acd`), deployment `46a28ba1-0cde-48ad-95b5-d94d9a9a82d5`, at [ojoaovsousa.pages.dev](https://ojoaovsousa.pages.dev/pt-br/). [Release receipt](cloudflare-pages.md#main-reconciliation-release) records148local tests,37production HTTP/artifact checks and4additional exact-asset checks. Main reconciliation and later receipt-only commits change no SEO/runtime bytes. Google processing and ranking remain separate from publication.

## Sitemap fetch investigation

The owner reported Couldn't fetch on2026-11-05. At that time the exact prefix property's sitemap entry was `/sitemap.xml`, Unknown, submitted3November,0discovered pages; details showed last read3November and Sitemap could not be read without another actionable error. No generator/routing defect was reproduced: HTTP200, application/xml,653bytes, valid sitemap namespace,9unique canonical URLs, no redirect/noindex header; robots returns200/Allow with the correct sitemap URL and cache requires revalidation.

The decisive authenticated Live Test targeted the **exact sitemap URL**, not the home. On5November21:17:01 in the owner's UI (2026-11-06T00:17:01Z), Google Inspection Tool smartphone reported Crawl allowed Yes, Page fetch Successful and Indexing allowed Yes. View tested page exposed the actual nine-URL XML; More info confirmed content type application/xml and HTTP200OK. This is a real Google fetch, not a spoofed Googlebot user agent, and it does not mean the XML should be requested for indexing.

After that fresh proof and the persistent3November failure, one new submission was made using the same URL. Browser mouse input failed before a recorded submission; reloading confirmed the previous date before the keyboard submission. A connection interruption during Submitting Sitemap was reconciled by reopening the report **without resending**: the saved Submitted date advanced to5November. The report still showed Unknown/Couldn't fetch/0URLs. Its detail later displayed Last read5November, while the top-level Last read cell remained empty. Submission is confirmed; successful sitemap processing is **not** confirmed, and the cause of the sitemap-service failure has not been established by the successful Inspection Tool fetch. Do not rename the sitemap, request XML indexing, create an automation or keep resubmitting to hide this pending provider state. [Google's official fetch diagnosis](https://support.google.com/webmasters/answer/7451001?hl=en#fetch_errors) distinguishes submission, live retrieval and processing.

The historical CLI403 has an independently reproduced cause: Cloudflare's managed Pages Browser Integrity Check rejects Python urllib's library-default User-Agent with error1010. A descriptive application User-Agent returns200 and the same XML. Node requests with Googlebot/InspectionTool user agents also returned200, but those are not Google-origin evidence. This filter cannot be disabled on managed Pages hostnames; it is not proof that the sitemap generator or Google access failed. Use the existing Node verifier, or a descriptive User-Agent for a legitimate stdlib diagnostic client, and preserve the security configuration. [Cloudflare's documented behavior](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/).

Public browser QA at390/1440px produced no warning/error logs through project reading,3D recovery/focus and contact dialog/Escape. The active SDK under the QA browser's saved consent was revoked through the real preference control and became0provider scripts after reload. No source defect was reproduced, so this investigation changes documentation only; no speculative runtime patch or new deployment is justified. Console observations are scoped to those flows, not a guarantee for every browser/extension/provider event. No new cost, data treatment, dependency or account was added.

## Current Search Console follow-up

The following4November baseline is historical; the current sitemap investigation above supersedes its submission/access state.

On 2026-11-04 UTC the correct prefix property `https://ojoaovsousa.pages.dev/` was opened under the existing management account. The published verification tag, canonical/hreflang, robots and nine-URL sitemap remain intact. Public checks covered localized homes/policies, redirects, real404 and exact artifact bytes. No sitemap or URL was removed.

The existing sitemap submission (3 November) still reports Couldn't fetch, Unknown and zero discovered pages; it was not resubmitted. Index inspection confirms `/pt-br/` is already indexed, which does not confirm Google's indexed copy contains this new release. Its post-publication live test returned URL is available to Google / Page can be indexed at approximately 12:49 UTC.

A single request for updated indexing of `/pt-br/` was rejected with Quota Exceeded (daily quota). No request was accepted and no retry was made. Further home/policy requests must wait for the provider quota to reset, no earlier than 5 November; no recurring automation was created. The PT-BR privacy URL is unknown to Google's current index. Its post-publication live test also returned URL is available to Google / Page can be indexed at approximately 12:51 UTC. The original verification and management permissions were preserved; no auth/session state was copied.

## Content and generation

`src/content.mjs` supplies the HTML titles, descriptions and visible introduction in PT-BR, English and Spanish. Titles identify João Victor and the service: **Sites e software sob medida**, **Websites and custom software**, **Sitios web y software a medida**. Privacy/terms descriptions use their own introductions. The role remains software engineer; career and education disclosures are unchanged. There are no added ratings, delivery guarantees or qualifications.

`src/search-discovery.mjs` reuses these same content fields for:

- `llms.txt`: H1 identity, blockquote summary and H2 sections with Markdown links, following the [llms.txt v2 proposal](https://llmstxt.org/).
- `pt-br/index.md`, `en/index.md`, `es/index.md`: concise localized introduction, existing service descriptions and the two real project links. No raw CV, form data, recipient e-mail or telephone is exported.
- JSON-LD `Person` and `Service`: João Victor/ojoaovsousa, existing public profiles, localized role/service descriptions and a linked provider. Only the home and its direct reading equivalent emit this graph when an origin is configured. No address, awards, ratings, education or offers/prices are inferred.

Home/direct HTML advertises the localized Markdown alternative and `/llms.txt` using standard link relations. Markdown is generated in the build, not maintained as another copy. The local preview assigns it `text/markdown; charset=utf-8`. The published artifact passed the 36 HTTP verifier checks, including Markdown MIME; repeat actual host checks for later releases.

## Build modes

| Configuration | Result |
| --- | --- |
| No `SITE_URL`, including `INDEXABLE=true` alone | Noindex HTML, robots disallow, empty sitemap, relative Markdown links; no canonical/JSON-LD origin is invented. |
| HTTPS public origin, without exact `INDEXABLE=true` | Noindex preview; configured canonical/alternate URLs and factual JSON-LD can be inspected. Robots stays disallow and sitemap empty. |
| HTTPS public origin and exact `INDEXABLE=true` | Home/policy HTML allows indexing; robots allows crawling and advertises the sitemap. Requires a separately authorized release. |
| Localhost, its subdomains/trailing-dot spelling, local/internal names or IP literal | Origin omitted and indexing stays disabled even with `INDEXABLE=true`. |
| Non-HTTPS URL, credentials, path, query or fragment | Build rejects the configuration before replacing `dist/`. |

Origin validation checks URL syntax, not DNS, ownership or public reachability. The production behavior test uses only `https://portfolio.example` inside a temporary fixture; that is not a configured or published project domain.

In an opted-in release, each language home/policy self-canonicalizes and supplies reciprocal PT-BR/en-GB/es alternatives plus PT-BR `x-default`. The sitemap contains nine canonical HTML URLs: three homes and their privacy/terms pages. It omits the root duplicate, direct reading, legacy black routes, 404 and Markdown alternatives. Direct remains noindex/canonical-to-home; the legacy black redirect is preserved. No API exists in this revision, so no hypothetical API path is added to robots.

Robots disallow is a crawler directive, not access control or a guaranteed removal mechanism. A crawler cannot read an HTML noindex when robots blocks its fetch; a previously discovered public preview would require an appropriate accessible noindex/removal plan. Keep unpublished previews private until hosting controls and the release are approved. Preparing these files alone does not establish that a URL is absent from search.

## Standalone Fisiopoa preview

`/prototypes/fisiopoa/` serves the approved light version with its own navigation, relative assets and privacy page. The 17 reviewed files match archive SHA-256 `b486b75af9ba34c397ae61deaae7f47f5288d5a25612f420dd7bde96d0fdc0c3` byte for byte. There is no theme selector or portfolio analytics on the prototype. It is absent from the portfolio's links, sitemap and `llms.txt` even in an indexable build. Production robots.txt remains crawlable so crawlers can read the exclusion directives.

Both HTML pages declare `noindex, nofollow`; Pages `_headers` covers the bare route and its subtree. Pages' directory redirects resolve relative assets from the slash URL, and the privacy document serves at `/prototypes/fisiopoa/privacidade` (the `.html` link redirects there). The local dev handler mirrors these variants and preserves query strings. The artifact audit allows only the 17 reviewed files under this path.

On the slash URL only, Pages removes the inherited CSP and replaces it with one policy that permits a frame from `https://www.google.com`. The map is lazy and sends no referrer. The privacy page, sibling routes and the rest of the portfolio retain their existing CSP. No message is sent by loading the landing; contact links open their providers only on visitor action.

To preview locally, run `npm run build` then `npm run dev` and open the route in the project preview. On publication, verify HTTP 200 after the slash redirect, relative assets and privacy, both robots directives, one effective CSP, the visible map and the independent navigation on mobile. Do not request indexing. The package adds 536,541 raw bytes plus 402 bytes of Pages rules, with no dependency or contracted charge. The map adds requests to its provider only when loaded; transfer and billing remain unmeasured.

## Local checks and cost

Published correction source `488d3e3`, integration `43af65e`, passed 96 local tests and build/audit 164/128. Only `city.js`/`viewer.css` change against published fd9; HTML/Markdown, URLs, metadata, canonical/hreflang, robots/schema/sitemap remain unchanged. Its frozen 128-file package is 9,966,622 raw bytes, ZIP 5,921,711 bytes; publication is confirmed as `34340e9f-8a71-4ee8-8384-78f709f5be8a` on 2026-10-23 UTC. All 36exact-artifact + 3 critical-CSS checks and 3 previous-fd9-target exact GETs passed; actual rollback was not exercised. No Search Console operation or new permission was added.

`tests/search-discovery.test.mjs` builds isolated temporary fixtures, preserving the integrated preview. It checks preview/local-origin guards, invalid configuration, opted-in fake-domain metadata, reciprocal language URLs, direct canonical/noindex, nine sitemap URLs, linked factual schema, generated Markdown omissions and exact artifact allowlisting. A fourth Markdown filename is rejected by the audit. Fixture directories are removed after the tests.

The published source `488d3e3` passed the **96-test local suite**, including discovery fixtures; build and audit passed 164 eligible sources/128 outputs. After publication, the integrator confirmed 36 HTTP checks against the exact frozen artifact and native 440px scene/GLB/photo/logo loading, stack/Challenge selection and contact dialog/Escape without forms, overflow or console warnings/errors; no message sent. Three exact production-CSS checks and three exact reads of the previous healthy artifact also passed, without exercising rollback. The deployment is `34340e9f-8a71-4ee8-8384-78f709f5be8a`; actual touch and Google indexing are not inferred. These proofs do not establish Search Console ownership or Google indexing. This documentation update did not rerun those checks. The artifact audit permits exactly `/llms.txt` and the three localized `index.md` outputs and scans them for the existing protected-value patterns.

New text files total **5,585 bytes** in the default preview. At the 25-byte fake origin `https://portfolio.example`, the total is **5,735 bytes**: llms 1,309; PT 1,497; EN 1,382; ES 1,547. Against the same base with that origin, home HTML increases by 935/709/915 bytes in PT/EN/ES, and direct by 810/674/800 bytes; all generated HTML combined increases 4,433 bytes. These are raw, uncompressed build measurements. Real origin length, caching and compression change transfer; Markdown is fetched only when requested. No client dependency, analytics SDK, provider call, paid generation or remote test is added. Monthly marginal transfer is `Σ(requests per artifact × actual transferred bytes)`, with hosting tariffs and traffic still unknown.

## Published release and Search Console pending

The authorized release uses `SITE_URL=https://ojoaovsousa.pages.dev` and `INDEXABLE=true`; default/local previews retain noindex. No custom domain was purchased. The exact source/deployment/ZIP receipt and 36 public HTTP checks are in [Cloudflare Pages](cloudflare-pages.md#confirmed-production-release). The published sitemap contains the nine canonical home/policy URLs, with direct/legacy/404/Markdown omitted as described above. The source-root configuration does not make a GitHub Pages project subpath compatible without a separately reviewed path adaptation.

The exact URL-prefix property `https://ojoaovsousa.pages.dev/` is verified by the published HTML tag. Historical release10c5b6b preserves all9canonical URLs and passed36 public artifact/HTTP checks. The existing Search Console tab showed the submission success confirmation; after reload its table lists `/sitemap.xml`, submitted29Oct2026, status “Couldn't fetch”, unknown type and0discovered pages. The public sitemap/robots respond correctly. Keep the accepted submission, avoid redundant resubmissions and investigate Google fetch/processing after its report updates. At that historical checkpoint, native input commands timed out and no URL-inspection/indexing request or confirmed indexing was claimed. Current evidence is recorded above. No auth or session data was copied.

## Primary references

Consulted 2026-10-22 UTC:

- [Google: descriptive title links](https://developers.google.com/search/docs/appearance/title-link).
- [Google: localized versions and reciprocal hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions).
- [Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Google: noindex and the robots limitation](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- [Google: building and submitting a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [llms.txt v2](https://llmstxt.org/) and [Schema.org Service](https://schema.org/Service). These formats do not promise retrieval or search appearance.

## Device-preference entry — local change

The current source serves the generic root with200/noindex and a same-origin early preference script, replacing its fixed PT-BR301. Explicit language URLs, reciprocal alternates, PT-BR x-default and the nine sitemap URLs remain. The existing policy URLs now describe manual language/theme preference storage. [Implementation, local evidence and post-publication checks](device-preferences.md). Cached historical301 responses may require a fresh browser session; no Search Console processing result follows from this source change.
