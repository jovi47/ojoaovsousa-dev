# Search discovery

Updated 2026-10-23 UTC. Static discovery originated on `codex/search-discovery` and is included in published source `488d3e3184c74bc82706c7c0b0c42ee6617601ec` at [ojoaovsousa.pages.dev](https://ojoaovsousa.pages.dev/pt-br/), Cloudflare Pages Free Direct Upload. [Release receipt](cloudflare-pages.md#confirmed-production-release) identifies the exact artifact. Public source is [jovi47/ojoaovsousa-dev](https://github.com/jovi47/ojoaovsousa-dev); repository visibility does not imply PR merge. Technical crawlability does not guarantee ranking, Google indexing, rich results or LLM inclusion.

## Content and generation

`src/content.mjs` supplies the HTML titles, descriptions and visible introduction in PT-BR, English and Spanish. Titles identify João Victor and the service: **Desenvolvedor de software sob medida**, **Custom software developer**, **Desarrollador de software a medida**. Privacy/terms descriptions use their own introductions. The role remains software engineer; career and education disclosures are unchanged. There are no added ratings, delivery guarantees or qualifications.

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

## Local checks and cost

Published correction source `488d3e3`, integration `43af65e`, passed 96 local tests and build/audit 164/128. Only `city.js`/`viewer.css` change against published fd9; HTML/Markdown, URLs, metadata, canonical/hreflang, robots/schema/sitemap remain unchanged. Its frozen 128-file package is 9,966,622 raw bytes, ZIP 5,921,711 bytes; publication is confirmed as `34340e9f-8a71-4ee8-8384-78f709f5be8a` on 2026-10-23 UTC. All 36exact-artifact + 3 critical-CSS checks and 3 previous-fd9-target exact GETs passed; actual rollback was not exercised. No Search Console operation or new permission was added.

`tests/search-discovery.test.mjs` builds isolated temporary fixtures, preserving the integrated preview. It checks preview/local-origin guards, invalid configuration, opted-in fake-domain metadata, reciprocal language URLs, direct canonical/noindex, nine sitemap URLs, linked factual schema, generated Markdown omissions and exact artifact allowlisting. A fourth Markdown filename is rejected by the audit. Fixture directories are removed after the tests.

The published source `488d3e3` passed the **96-test local suite**, including discovery fixtures; build and audit passed 164 eligible sources/128 outputs. After publication, the integrator confirmed 36 HTTP checks against the exact frozen artifact and native 440px scene/GLB/photo/logo loading, stack/Challenge selection and contact dialog/Escape without forms, overflow or console warnings/errors; no message sent. Three exact production-CSS checks and three exact reads of the previous healthy artifact also passed, without exercising rollback. The deployment is `34340e9f-8a71-4ee8-8384-78f709f5be8a`; actual touch and Google indexing are not inferred. These proofs do not establish Search Console ownership or Google indexing. This documentation update did not rerun those checks. The artifact audit permits exactly `/llms.txt` and the three localized `index.md` outputs and scans them for the existing protected-value patterns.

New text files total **5,585 bytes** in the default preview. At the 25-byte fake origin `https://portfolio.example`, the total is **5,735 bytes**: llms 1,309; PT 1,497; EN 1,382; ES 1,547. Against the same base with that origin, home HTML increases by 935/709/915 bytes in PT/EN/ES, and direct by 810/674/800 bytes; all generated HTML combined increases 4,433 bytes. These are raw, uncompressed build measurements. Real origin length, caching and compression change transfer; Markdown is fetched only when requested. No client dependency, analytics SDK, provider call, paid generation or remote test is added. Monthly marginal transfer is `Σ(requests per artifact × actual transferred bytes)`, with hosting tariffs and traffic still unknown.

## Published release and Search Console pending

The authorized release uses `SITE_URL=https://ojoaovsousa.pages.dev` and `INDEXABLE=true`; default/local previews retain noindex. No custom domain was purchased. The exact source/deployment/ZIP receipt and 36 public HTTP checks are in [Cloudflare Pages](cloudflare-pages.md#confirmed-production-release). The published sitemap contains the nine canonical home/policy URLs, with direct/legacy/404/Markdown omitted as described above. The source-root configuration does not make a GitHub Pages project subpath compatible without a separately reviewed path adaptation.

Verification-only preparation on 2026-10-27 UTC starts from the exact published source `488d3e3184c74bc82706c7c0b0c42ee6617601ec`, isolated on `codex/gsc-verification`. The Chief obtained the public HTML-tag verification token from the existing URL-prefix property. The shared HTML renderer inserts that exact `google-site-verification` metatag only when `base` is the production origin and the page path is the home: root HTML plus `/pt-br/`, `/en/` and `/es/`. Root's existing redirect reaches the tagged PT home. Direct, policies,404 and other configured origins keep their existing HTML. No new public route, JavaScript, analytics SDK, request, account, domain or infrastructure cost is introduced. The separately downloaded HTML-file method is not reconstructed after its unknown download result.

[Google's ownership documentation](https://support.google.com/webmasters/answer/9008080?hl=en) requires the exact tag in the non-authenticated homepage head, follows the property's landing page after redirects and requires keeping the tag after verification. Prepared code is not proof of public installation or ownership. The Chief will upload only the audited128-file verification artifact, inspect the real public tag and then choose Verify for the same HTML-tag method/account/property. Keep the method in every later release, including the independent404/Safari/Clarity candidate. Canonical URLs, robots, sitemap, CSP and policies remain as published. A failed or inaccessible provider response remains a pending check, not verified ownership or indexing.

A URL-prefix property for `https://ojoaovsousa.pages.dev/` was added in the account identified as `jovi47personal`, but **ownership remains unverified**. The verification-file download failed; no verification file was downloaded into Downloads or installed in the site, and no metatag was installed. UI automation became unstable while the owner used the computer. Property creation alone proves neither ownership nor indexing.

1. Obtain the official verification mechanism, install it in a reviewed authorized release and confirm ownership in the correct property; do not store auth/session secrets in Git or docs.
2. Submit the real [sitemap.xml](https://ojoaovsousa.pages.dev/sitemap.xml) once and confirm its reading, avoiding redundant submissions.
3. Inspect canonical PT-BR/en/es homes and request indexing/new crawl when appropriate. Record accepted requests separately from later indexing results. Do not request direct, previews, private/retired pages or hypothetical APIs.
4. For future URL changes, preserve equivalents with permanent redirects when applicable, or remove retired URLs from current links/sitemaps and handle HTTP/removal evidence explicitly.

**No sitemap submission or crawl/indexing request has been made; Google indexing is not confirmed.** Contact uses visitor-chosen WhatsApp/mailto/Copy/LinkedIn, with no form, backend, Gmail SMTP/API or CAPTCHA. That owner decision replaced the earlier contact-backend proposal; it is not a pending integration requirement. No remote CI, new provider or Search Console operation was performed by this documentation reconciliation.

## Primary references

Consulted 2026-10-22 UTC:

- [Google: descriptive title links](https://developers.google.com/search/docs/appearance/title-link).
- [Google: localized versions and reciprocal hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions).
- [Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Google: noindex and the robots limitation](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- [Google: building and submitting a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [llms.txt v2](https://llmstxt.org/) and [Schema.org Service](https://schema.org/Service). These formats do not promise retrieval or search appearance.
