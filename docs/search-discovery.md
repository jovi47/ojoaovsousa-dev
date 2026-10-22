# Search discovery

Implemented locally on `codex/search-discovery`, based on the visual checkpoint `ab7c922` and its follow-up `1e903d8`, on 2026-10-22 UTC. This delivery prepares static discovery files; it does not select a domain/host, publish the home, contact Google or guarantee ranking, rich results or LLM inclusion.

## Content and generation

`src/content.mjs` supplies the HTML titles, descriptions and visible introduction in PT-BR, English and Spanish. Titles identify João Victor and the service: **Desenvolvedor de software sob medida**, **Custom software developer**, **Desarrollador de software a medida**. Privacy/terms descriptions use their own introductions. The role remains software engineer; career and education disclosures are unchanged. There are no added ratings, delivery guarantees or qualifications.

`src/search-discovery.mjs` reuses these same content fields for:

- `llms.txt`: H1 identity, blockquote summary and H2 sections with Markdown links, following the [llms.txt v2 proposal](https://llmstxt.org/).
- `pt-br/index.md`, `en/index.md`, `es/index.md`: concise localized introduction, existing service descriptions and the two real project links. No raw CV, form data, recipient e-mail or telephone is exported.
- JSON-LD `Person` and `Service`: João Victor/ojoaovsousa, existing public profiles, localized role/service descriptions and a linked provider. Only the home and its direct reading equivalent emit this graph when an origin is configured. No address, awards, ratings, education or offers/prices are inferred.

Home/direct HTML advertises the localized Markdown alternative and `/llms.txt` using standard link relations. Markdown is generated in the build, not maintained as another copy. The local preview assigns it `text/markdown; charset=utf-8`. Host response types must still be checked after hosting is selected.

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

`tests/search-discovery.test.mjs` builds isolated temporary fixtures, preserving the integrated preview. It checks preview/local-origin guards, invalid configuration, opted-in fake-domain metadata, reciprocal language URLs, direct canonical/noindex, nine sitemap URLs, linked factual schema, generated Markdown omissions and exact artifact allowlisting. A fourth Markdown filename is rejected by the audit. Fixture directories are removed after the tests.

The **79-test local suite** passed before incorporating the visual follow-up. After that merge and the policy-description refinement, the three focused discovery tests, default preview build, artifact audit and `git diff --check` passed again. These are source/build checks, not browser acceptance or live HTTP/Search Console evidence. The artifact audit permits exactly `/llms.txt` and the three localized `index.md` outputs and scans them for the existing protected-value patterns.

New text files total **5,585 bytes** in the default preview. At the 25-byte fake origin `https://portfolio.example`, the total is **5,735 bytes**: llms 1,309; PT 1,497; EN 1,382; ES 1,547. Against the same base with that origin, home HTML increases by 935/709/915 bytes in PT/EN/ES, and direct by 810/674/800 bytes; all generated HTML combined increases 4,433 bytes. These are raw, uncompressed build measurements. Real origin length, caching and compression change transfer; Markdown is fetched only when requested. No client dependency, analytics SDK, provider call, paid generation or remote test is added. Monthly marginal transfer is `Σ(requests per artifact × actual transferred bytes)`, with hosting tariffs and traffic still unknown.

## Release and Search Console pending

1. Owner selects domain/host and authorizes the specific release. Configure its HTTPS origin in `SITE_URL`; do not copy the fixture domain. Keep `INDEXABLE` unset for previews. Current absolute assets/links target an origin root; a GitHub Pages project subpath such as `/jovi47-portfolio/` requires a separate path adaptation. User-root/custom-domain Pages and hosts serving at `/` still need their own actual checks.
2. Before enabling indexing, verify deployed HTTPS, response codes/404, legacy redirects, canonical/hreflang, policies, sitemap, robots, Markdown MIME and metadata against the exact release. Check real canonical URLs and JSON-LD with the available public validators, without implying a supported rich-result type.
3. In the correct verified Search Console property, submit the actual sitemap once, inspect the affected canonical URLs and request indexing/new crawl when appropriate. Record accepted requests and later indexing results separately. Do not index direct, previews, APIs/private routes or retired pages.
4. If a public URL changes later, preserve equivalent pages with permanent redirects where applicable; remove genuinely retired URLs from current links/sitemaps and handle their HTTP/removal evidence explicitly.

No domain, hosting, Search Console property verification, sitemap submission, crawl/indexing request or confirmation has been performed by this delivery. Contact backend/antispam remains a separate objective.

## Primary references

Consulted 2026-10-22 UTC:

- [Google: descriptive title links](https://developers.google.com/search/docs/appearance/title-link).
- [Google: localized versions and reciprocal hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions).
- [Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Google: noindex and the robots limitation](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- [Google: building and submitting a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [llms.txt v2](https://llmstxt.org/) and [Schema.org Service](https://schema.org/Service). These formats do not promise retrieval or search appearance.
