# Cloudflare Pages: manual release

Updated2026-10-29UTC. Cloudflare Pages Free Direct Upload project **ojoaovsousa** serves [ojoaovsousa.pages.dev](https://ojoaovsousa.pages.dev/pt-br/). Current source is `10c5b6bcaa003fbdf9e567482c09dd6c7facb11b`; earlier dated receipts below describe their historical releases. No custom domain was purchased. This runbook separates the confirmed release from instructions for future releases and unresolved Search Console/recovery work.

## Current visual release ·2026-10-29UTC

Production source `10c5b6bcaa003fbdf9e567482c09dd6c7facb11b`, deployment `0976c277-0da3-4fe5-8c49-6eb6d9975d3c`, is confirmed at https://ojoaovsousa.pages.dev/pt-br/ through existing Pages Direct Upload/Production main. All approved icon/theme/footer/alignment changes, five shuffled fictional examples, separate terminal/preview at all widths, process-before-FAQ order, horizontal-S airplane and removal of the rejected contact figure are included. GitHub drafts PR15/PR16 preserve the independent source scopes; the consolidated source branch is `codex/visual-release-2026-10-29`. No branch was merged.

132 local tests passed; audit195 source files/136 outputs passed. All runtime/build inputs match the integrated localhost preview byte-for-byte.136 files total10,068,215 raw bytes; frozen ZIP5,951,998 bytes, SHA256 `5628ba3dcacf93392e9c9c60cfe2c048e1aed3e96a7f2d402ad0f6c53a56812e`.60 outgoing historical blobs were checked for protected paths/detected keys. Only audited dist was uploaded:20 new files,114 reused, plus the two control files. After publication36 HTTP/artifact checks and12 exact changed CSS/JS checks passed. Native public1654px footer confirmed the shared reading layout and process-before-FAQ order;430px home had the live canvas and no overflow.

Previous healthy sourcefda06ef/deployment71efe85e passed36 checks immediately before publication and remains the recovery target. Actual rollback was not exercised. No remote tests/build, new provider, permission, paid feature or data treatment was added. Local integrated preview remains available; release checkouts are retired only after remote recovery and local-process/content checks.

Search Console prefix ownership is verified. On this release follow-up the existing tab displayed “Sitemap submitted successfully”; reloading confirmed `/sitemap.xml` submitted29Oct2026, with current status “Couldn't fetch”, unknown type and0discovered pages. Public sitemap/robots and all9canonical URLs passed HTTP checks. Do not resubmit the same sitemap repeatedly. Google fetch/processing and URL-indexing confirmation remain pending; native input still timed out, so no URL-inspection/index request is claimed. No auth/session was copied.

## Confirmed publication · 2026-10-29 UTC

The consolidated responsive/copy/tour/privacy/recovery release was published from `8e8dc9c35485c52eb15c224ecd58d7ab4de813cd`, branch `codex/production-2026-10-29`, through Wrangler4.155.0 to the existing Production/main target. Confirmed deployment: `719ba634-934c-46a0-b41b-7d79502b7678`, [immutable alias](https://719ba634.ojoaovsousa.pages.dev/pt-br/). The canonical origin remains `https://ojoaovsousa.pages.dev`.

The earlier browser upload was blocked before any transfer; the owner then explicitly authorized the CLI and completed device OAuth. Global credentials stay outside the repository/artifact, encrypted in the normal Wrangler location; do not copy OAuth credentials into CI. `.wrangler/` is excluded from Git and Docker. Only the audited134-file production `dist/` was uploaded (31 new files,101 reused); no checkout, private/env/auth content or obsolete ZIP was uploaded.

Sequential local checks for that release have122 passing cases, production build/audit190 sources and134 outputs. After publication the read-only verifier passed36 HTTP/artifact checks and11 additional CSS/JS exact-byte comparisons. The previous healthy recovery target was `34340e9f-8a71-4ee8-8384-78f709f5be8a`/source488d3e3, checked before publication; no real rollback was exercised. Earlier pending heavy job6aa2aa2c was cancelled before execution, with no PID/start. The tiny dependency-free checks ran locally and sequentially; no remote test workflow ran.

The next desktop/visual refinement is tracked by `docs/desktop-layout.md`; its source checks do not by themselves imply that later refinement is already public. A separate draft [PR13](https://github.com/jovi47/ojoaovsousa-dev/pull/13) prepares automatic main-branch publication, health verification and guarded recovery. The account/project Actions variables have been configured; the Pages-scoped API-token secret and authorized integration of that workflow remain pending. No automatic deployment or live automatic rollback is claimed.

Search Console ownership for the exact canonical prefix was auto-verified through the published HTML tag. The dashboard is accessible; sitemap submission/indexing confirmation remain separate follow-up actions. Preserve the tag.

## Responsive follow-up published · 2026-10-29 UTC

Source `fda06efcbf2e9be24efc6ce9958b3b038cdcc582` is confirmed live as deployment `71efe85e-a470-446f-bfd3-2cbd9bcec96c`, Production/main. This includes all refinements documented in `desktop-layout.md`: shared desktop identity/cue, cards and alignment, compact brick controls/flags, contact brick icons, process headline, separate desktop terminal/preview and staged construction.19 files uploaded and113 reused, plus the two Pages control files. No Git branch was merged.

Validation:126 local tests passed; production build and audit191 sources/134 outputs passed. The new canonical production passed36 HTTP/artifact checks and12 additional exact CSS/JS comparisons. Native public desktop showed the localized headline and both windows with the final green-check overlay, no overflow; source-native responsive/theme evidence is in the desktop guide. Frozen ZIP/JSON manifest for this exact source are retained in the local task artifacts. Previous719ba634 was reverified with36 checks immediately before upload and remains the recovery target; real rollback was not exercised.

[PR14](https://github.com/jovi47/ojoaovsousa-dev/pull/14) preserves this follow-up independently of pipeline PR13. The shared localhost3000 preview remains active in the integration worktree; delivered release checkouts may be retired after remote recoverability and local-content checks. Search Console ownership is verified, but authenticated browser input/screenshot repeatedly timed out before sitemap submission confirmation; no indexing request or confirmed indexing is claimed.

## Scope and architecture

One Direct Upload project serves the existing static `dist/` artifact. GitHub remains the code source; no Git integration, push-triggered build, deploy hook or remote test workflow is added. A future change from Direct Upload to Git integration requires a new Pages project. No Kubernetes, database, container or VPS is needed for these static files.

Deployment controls originated from local integration `6dd40b5`: `public/_headers`, `public/_redirects`, artifact-audit support, a read-only release verifier and focused tests. The later integrated source `9f2dbb5` includes the contact follow-up, portrait and search configuration and is the confirmed production source. The release used the authorized dashboard session; no CLI package or credential was added to the artifact.

The owner replaced the form with a shared contact window listing WhatsApp, e-mail (`mailto:`), LinkedIn and a copy action. The confirmed production source includes that contact follow-up; the form from the original preparation base is retired. The approved contact flow has no input submission or sending endpoint: the visitor chooses a channel and decides whether to contact João in the external provider/app. Copying a contact value is local. There is no CAPTCHA, backend delivery or phone-validation library in the release scope, and no third-party script/frame is required by these links.

## Routing, security and cache

- In the current local source, `/` serves a noindex200 preference entry; `/pt-br`, `/en` and `/es` still normalize to their trailing-slash homes. Device/manual language negotiation is client-side only at the generic entry, with explicit language links preserved. This routing becomes published only with its release receipt. See [device preferences](device-preferences.md).
- Each localized `/black` and `/black/` URL permanently redirects 301 to its same-language home. There is no wildcard rewrite to the home.
- The generator retains root `404.html`. Pages uses that custom 404 for missing paths and does not enable its implicit SPA fallback. The confirmed release passed the real HTTP404 check; repeat it for each later release.
- Static responses receive MIME-sniffing, framing, referrer and permissions protections. The CSP permits local scripts/fonts/styles and local/data/blob images; `connect-src blob:` is needed by Three’s embedded GLB texture loading. Only the existing noscript style hash is permitted inline. New third-party scripts/frames/networking require a reviewed policy change and browser verification.
- Markdown receives `text/markdown`; root GLBs receive `model/gltf-binary`. Deployment/branch subdomains under `pages.dev` receive `X-Robots-Tag:noindex,nofollow`; direct reading and404 remain noindex.
- Leave native Pages caching in place. Its default browser revalidation suits the current stable, unversioned asset names. Do not add immutable/year-long browser caching or custom cache rules without fingerprinted filenames and release checks.

The confirmed release passed the 36 read-only checks, including required deployed headers; native QA showed no console errors with the scene/GLBs, portrait sign and three contact destinations. For every later release, inspect actual responses before claiming headers effective. CSP runtime checks must cover the three resident GLBs, portrait sign, menu/theme, contact window, external channel links/copy action and no-JavaScript fallback. Do not loosen the policy merely to silence an unrelated extension’s console errors.

## Account and access

The owner controls the Cloudflare account and GitHub repository. Use the existing authorized dashboard/OAuth session or an appropriately scoped Pages deployment credential through its authorized secret mechanism. Do not place credentials in commands, files committed to Git, uploads, logs or this runbook. A token/account ID is not required inside the static artifact.

Native dashboard entry: [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages). The existing project is **ojoaovsousa**, **Direct Upload**, production branch `main`, hostname `ojoaovsousa.pages.dev`. Select that confirmed project for subsequent authorized releases. A different project/hostname requires its own origin validation; do not enable indexing with a guessed origin. Do not connect Git or enable Web Analytics by inference. The code repository is public [jovi47/ojoaovsousa-dev](https://github.com/jovi47/ojoaovsousa-dev); no Git build integration or PR merge follows from that visibility.

## Local gates and artifact

Use one reviewed, clean revision containing the intended integration and deployment changes. Preserve the integrated preview and other active worktrees. Build and test locally before each authorized upload; repeat only affected checks when the same revision has already passed the rest.

```sh
rtk git status --short
rtk git rev-parse HEAD
rtk proxy env SITE_URL=https://ojoaovsousa.pages.dev INDEXABLE= node scripts/build.mjs
rtk npm test
rtk proxy node scripts/audit.mjs
rtk git diff --check
```

The shown origin is the confirmed production hostname. Replace it only after a separately authorized hostname change and validation. Upload **only the audited contents of `dist/`**, including `_headers`, `_redirects` and `404.html`. Never upload the checkout, Git history, Obsidian acervo, originals, `.private/`, real envs, `ACESSOS.local.md`, auth/session state or temporary files. The audit checks allowlisted paths, copied asset bytes and detected key material; additionally review the effective upload paths and content.

Build flags are local inputs: `SITE_URL` is the confirmed HTTPS production origin; exact `INDEXABLE=true` enables the nine canonical home/policy URLs. Unset/false keeps HTML noindex, robots disallow and sitemap empty. No origin or a local/IP origin cannot enable indexing. Direct remains noindex/canonical-to-home. Never reuse an indexable production artifact as a preview build.

## Deploy sandbox: explicit preview

Use the noindex build above. In the dashboard’s Pages project choose **Create deployment**, explicitly selecting Preview when offered, then upload only `dist/`. Alternatively, an already available and authorized Wrangler CLI can upload the same artifact:

```sh
rtk proxy wrangler pages deploy dist --project-name ojoaovsousa --branch sandbox
```

Record the actual immutable deployment URL, branch/environment, reviewed commit, upload result and UTC time. Then run the read-only verifier against that actual URL, with the confirmed production canonical origin:

```sh
rtk proxy node scripts/verify-cloudflare.mjs https://ACTUAL-DEPLOYMENT.ojoaovsousa.pages.dev preview https://ojoaovsousa.pages.dev
```

The URL shown here is a placeholder, not a deployed address. Verify the preview’s noindex response header and perform native browser QA. Preview URLs are public by default; noindex is not access control. Enable Access only as a separately authorized account configuration if private previews are needed.

## Deploy production: explicit publication

After preview checks, build the **same reviewed source revision** with `SITE_URL` set to its confirmed production origin and `INDEXABLE=true`; rerun relevant SEO/build/audit gates. The indexability change intentionally produces different HTML/robots/sitemap bytes from preview. Keep the exact production `dist/` for verification; do not let HMR or another build replace that artifact.

Select **Create deployment → Production** in the dashboard and upload only that artifact. An already available authorized CLI may instead use an explicit production branch:

```sh
rtk proxy wrangler pages deploy dist --project-name ojoaovsousa --branch main
rtk proxy node scripts/verify-cloudflare.mjs https://ojoaovsousa.pages.dev production
```

Do not rely on Wrangler’s inferred local branch. Record the reviewed commit and deployment ID/URL from the actual result. The verifier checks status codes,301 destinations, HTML canonical/indexability, security headers, robots/sitemap, Markdown MIME and exact local bytes for the affected pages and critical 3D/font assets. It uses GET requests with a 15-second timeout per request and performs no mutation, email send or load test.

An accepted upload is not healthy publication. Stop on a failed status/header/hash/canonical check; inspect the actual deployment rather than retrying an unknown result. Verify the public 3D/contact-channel journey, localized homes/policies and404 in a browser, then maintain Search Console for the confirmed property: sitemap, URL inspection and indexing requests where available. Record accepted actions separately from confirmed indexing; never promise ranking or immediate indexation.

## Recovery and publication evidence

Before replacing an existing production, record its deployment ID/commit and verify it is a valid recovery target. Native recovery: project **Deployments → All deployments → target production → … → Rollback to this deployment**, confirm, then repeat read-only health and browser checks. Only successful production deployments are native rollback targets; previews cannot be promoted via rollback.

The **first production has no previous deployment** to restore. A failed upload or unknown state requires inspecting the dashboard before any repetition. A failure discovered after first publication requires a corrected audited artifact; do not claim an earlier healthy version exists. The release controls supply a failing health gate and native recovery procedure, but no unattended rollback controller or tested account-level rollback. The first `9f2dbb5` release had no earlier successful production to restore. Current `488d3e3` has healthy previous deployment `3a6c6e40-cd54-45aa-b755-b62357288bf0`/source `fd9f177` as its verified recovery target; no actual rollback rehearsal has been performed. No database/migration rollback applies to this static artifact.

After exact successful publication, reconcile GitHub/code and canonical project notes, then retire delivered inactive worktrees using the owner’s safe cleanup procedure. Preserve the one integrated preview and any pending/unpublished work. Do not treat account setup, upload initiation or an old deployment as proof of this revision’s publication.

## Cost assumptions and limits

As verified in official docs on 2026-10-22 UTC, static asset requests that do not invoke Functions are free and unlimited on Free/Paid. Free Pages allows 20,000 files and 25 MiB per asset; dashboard drag/drop allows 1,000 files. Hosted builds have a 500/month Free quota, but this flow performs builds locally and does not connect automatic Git builds. The artifact audit reports the actual file count; inspect the largest asset before upload.

Hosting scenario: static-only Pages Free, no custom domain purchase, no paid plan or add-on. Estimated provider charge for the stated static hosting scope is US$0/month within current terms/limits; actual traffic, account charges and local CPU/energy remain unmeasured. Formula if scope changes: hosting plan + billable Functions/other services + domain + authorized add-ons. The approved external-channel contact window adds no server sending/CAPTCHA service. Static free hosting does not make unrelated future services unlimited or free.

## Confirmed production release

Successful Direct Upload on 2026-10-23 UTC; receipt reconciled from the integrator; this documentation update did not upload or rerun public requests:

| Item | Confirmed evidence |
| --- | --- |
| Source commit | `488d3e3184c74bc82706c7c0b0c42ee6617601ec` ([PR8](https://github.com/jovi47/ojoaovsousa-dev/pull/8), including 99f479d; integration 43af65e) |
| Project/plan/mode | `ojoaovsousa`, Pages Free, Direct Upload; static only, no paid add-on/Worker/CAPTCHA/Gmail integration |
| Production | [https://ojoaovsousa.pages.dev](https://ojoaovsousa.pages.dev/pt-br/), localized homes/direct/policies |
| Deployment | `34340e9f-8a71-4ee8-8384-78f709f5be8a` |
| Deployment alias | [https://34340e9f.ojoaovsousa.pages.dev](https://34340e9f.ojoaovsousa.pages.dev) |
| Exact artifact | 128 files, 9,966,622B; ZIP 5,921,711B; +1142 rawB versus fd9, only city.js/viewer.css changed, not transfer per visitor |
| ZIP SHA-256 | `b957eacc45d26f93e72a1ea227a2411ab73fb40135452781c1ecb2045759890f` |
| Local/public gates |96 local tests; audit 164 sources/128 outputs ; 36 exact-artifact + 3 critical-CSS checks passed. Three outgoing commits/170 historical blobs audited without protected paths/detected keys |
| Native public QA |440px all four selected-model titles/descriptions, arrows/ASC preserved after scroll, stack restoration and hidden phone secondary action passed; zero forms/overflow/warnings/errors. Physical touch remains untested |

Three critical production CSS GETs matched the frozen artifact. Three previous-target GETs at the 3a6 alias (`/pt-br/`, `city.js`, `viewer.css`) returned 200 and matched exact frozen fd9 bytes. Evidence totals 36 release +3CSS +3recovery-target reads; native rollback was not exercised.

The HTTP verifier covers actual statuses/301/404, canonical/indexability, security headers, robots/sitemap, Markdown MIME and exact local artifact bytes. The earlier four focused control/verifier tests covered routing/CSP contracts, mismatch rejection, fake200 missing routes, preview noindex, invalid targets and control-file audit bytes. This is not a load test, physical-device certification, rollback rehearsal or proof of Google indexing.

The Search Console URL-prefix property `https://ojoaovsousa.pages.dev/` was added in the owner-identified account `jovi47personal` but **ownership is not verified**. The verification-file download failed: no file was downloaded into Downloads and no verification file/metatag was installed. UI automation became unstable while the owner used the computer. Next: obtain/install the official verification mechanism in a reviewed release, confirm ownership, submit the actual sitemap and inspect/request indexing where appropriate. **No sitemap submission or indexing request was made; indexing is not confirmed.** Do not store verification/auth secrets or infer success from property creation.

The public repository rename/visibility/homepage was confirmed by REST/API at 2026-10-23 00:30 UTC: [jovi47/ojoaovsousa-dev](https://github.com/jovi47/ojoaovsousa-dev), `private:false`, homepage `https://ojoaovsousa.pages.dev`; the local filesystem root remains `jovi47-portfolio`. No PR merge is confirmed. PR7/PR8 are not merged; the default repository release/docs checkpoint remains `1c6e6d7`, rather than the new deployed source. Later documentation-only commits do not change the `488d3e3` artifact. Previous healthy deployment `3a6c6e40`/source `fd9f177` is retained as the verified recovery target; no rollback rehearsal was performed. The exact HTTP receipt is `work/cloudflare-release-488d3e3/http-verification.json`.

## Primary sources

Current official documentation was consulted with Context7 and browser access:

- [Direct Upload and its project choice](https://developers.cloudflare.com/pages/get-started/direct-upload/).
- [Serving behavior,404 and cache defaults](https://developers.cloudflare.com/pages/configuration/serving-pages/).
- [Headers, matching and Functions limits](https://developers.cloudflare.com/pages/configuration/headers/).
- [Redirect rules](https://developers.cloudflare.com/pages/configuration/redirects/).
- [Preview indexing/access](https://developers.cloudflare.com/pages/configuration/preview-deployments/).
- [Native production rollback](https://developers.cloudflare.com/pages/configuration/rollbacks/).
- [Free limits](https://developers.cloudflare.com/pages/platform/limits/) and [static/Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/).
