# Cloudflare Pages: release and recovery

Updated 2026-10-23 UTC. Cloudflare Pages Free Direct Upload project **ojoaovsousa** serves [ojoaovsousa.pages.dev](https://ojoaovsousa.pages.dev/pt-br/). The owner-authorized source `9f2dbb5544c525dcdea94f81620fcaf731f59126` was published and verified as recorded below. No custom domain was purchased. This runbook separates the confirmed release from instructions for future releases and unresolved Search Console/recovery work.

## Repository deployment automation

The owner's2026-10-29 request adds a reviewed GitHub Actions workflow: relevant merges/pushes to main deploy production; manual Production/Sandbox entries run checks only as part of deployment. Exact-byte health failure after confirmed publication can roll back to the captured previous deployment, guarded against known supersession. Direct Upload remains the hosting model; no Cloudflare Git integration or new project is created. See [automatic production](automatic-production.md) for required secret/variables, ordering, unknown-result reconciliation, recovery tests and limits. Configuration in this branch is not proof that GitHub credentials/environments are installed or that any hosted run/rollback has occurred.

## Prepared release · 2026-10-29 UTC

Runtime source `1d6a70e69c02a7866e14fd6e361226f6374430d5`, branch `codex/production-2026-10-29`, consolidates the owner-approved responsive, copy, tour, preview, consent and recovery refinements. Publication is authorized but not yet confirmed.

Local validation: sequential Node suite reported121 passes and one missing-dist failure in2.791seconds. After the required default build, that sole affected site test passed; all122 cases therefore have passing evidence with no source changes between checks. Production build with `SITE_URL=https://ojoaovsousa.pages.dev INDEXABLE=true ANALYTICS_PREVIEW=false`, audit190 regular sources/134 outputs and whitespace check passed. These small static checks were performed sequentially without another preview or compiler. The prior queued job6aa2aa2c was confirmed cancelled before execution (PID/start null) at11:55:50Z; no duplicate execution was left queued.

Audited production package:134 files,10,012,829 raw bytes; ZIP5,936,500 bytes; SHA256 `a9f01f03c4b5fd5d33519601a1f608dddff2d7fe7b98bec7ed07a426fe458327`. Largest asset2,416,372 bytes, below25MiB. Only dist contents appear at ZIP root. Audit of11 outgoing commits/101 historical blobs/1,183,068 bytes detected no protected paths or key signatures; branch pushed for recoverability. No private/env/auth files were read or uploaded.

Cloudflare Production destination is confirmed, but upload is blocked by the browser extension's missing file-URL permission. The filechooser API rejected the file; native ZIP and dist selectors also left their final action disabled. Action-time authorization was requested to enable access only for upload and revoke afterward. No upload/deploy, production hash check or Search Console verification is claimed at this checkpoint. Existing34340e9f remains the known production deployment.

## Scope and architecture

One Direct Upload project serves the existing static `dist/` artifact. GitHub remains the code source; no Git integration, push-triggered build, deploy hook or remote test workflow is added. A future change from Direct Upload to Git integration requires a new Pages project. No Kubernetes, database, container or VPS is needed for these static files.

Deployment controls originated from local integration `6dd40b5`: `public/_headers`, `public/_redirects`, artifact-audit support, a read-only release verifier and focused tests. The later integrated source `9f2dbb5` includes the contact follow-up, portrait and search configuration and is the confirmed production source. The release used the authorized dashboard session; no CLI package or credential was added to the artifact.

The owner replaced the form with a shared contact window listing WhatsApp, e-mail (`mailto:`), LinkedIn and a copy action. The confirmed production source includes that contact follow-up; the form from the original preparation base is retired. The approved contact flow has no input submission or sending endpoint: the visitor chooses a channel and decides whether to contact João in the external provider/app. Copying a contact value is local. There is no CAPTCHA, backend delivery or phone-validation library in the release scope, and no third-party script/frame is required by these links.

## Routing, security and cache

- `/` permanently redirects to `/pt-br/`; `/pt-br`, `/en` and `/es` normalize to their trailing-slash homes. The language switch remains explicit, without IP/language inference.
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
