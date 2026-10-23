# Cloudflare Pages: manual release

Updated 2026-10-22 UTC. The owner selected Cloudflare Pages and requested the preferred name **ojoaovsousa.pages.dev**. The deployment coordinator confirmed an authenticated Cloudflare session; project creation is in progress. Name availability and the actual resulting hostname remain pending. This document describes prepared code, not a completed deployment.

## Scope and architecture

One Direct Upload project serves the existing static `dist/` artifact. GitHub remains the code source; no Git integration, push-triggered build, deploy hook or remote test workflow is added. A future change from Direct Upload to Git integration requires a new Pages project. No Kubernetes, database, container or VPS is needed for these static files.

The deployment branch was prepared from local integration `6dd40b5`. It adds only `public/_headers`, `public/_redirects`, artifact-audit support, a read-only release verifier and focused tests. No CLI package, account, resource, credential, API mutation or public deployment was created by this preparation.

The owner replaced the form with a shared contact window listing WhatsApp, e-mail (`mailto:`), LinkedIn and a copy action. Include that contact follow-up in the release revision before publication; the deployment branch's original integration base still contains the prior form. The approved contact flow has no input submission or sending endpoint: the visitor chooses a channel and decides whether to contact João in the external provider/app. Copying a contact value is local. There is no CAPTCHA, backend delivery or phone-validation library in the release scope, and no third-party script/frame is required by these links.

## Routing, security and cache

- `/` permanently redirects to `/pt-br/`; `/pt-br`, `/en` and `/es` normalize to their trailing-slash homes. The language switch remains explicit, without IP/language inference.
- Each localized `/black` and `/black/` URL permanently redirects 301 to its same-language home. There is no wildcard rewrite to the home.
- The generator retains root `404.html`. Pages uses that custom 404 for missing paths and does not enable its implicit SPA fallback. Verify the real HTTP404 after deployment.
- Static responses receive MIME-sniffing, framing, referrer and permissions protections. The CSP permits local scripts/fonts/styles and local/data/blob images; `connect-src blob:` is needed by Three’s embedded GLB texture loading. Only the existing noscript style hash is permitted inline. New third-party scripts/frames/networking require a reviewed policy change and browser verification.
- Markdown receives `text/markdown`; root GLBs receive `model/gltf-binary`. Deployment/branch subdomains under `pages.dev` receive `X-Robots-Tag:noindex,nofollow`; direct reading and404 remain noindex.
- Leave native Pages caching in place. Its default browser revalidation suits the current stable, unversioned asset names. Do not add immutable/year-long browser caching or custom cache rules without fingerprinted filenames and release checks.

No header is claimed effective until inspected on the deployed responses. CSP runtime checks must cover the three resident GLBs, portrait sign, menu/theme, contact window, external channel links/copy action and no-JavaScript fallback. Do not loosen the policy merely to silence an unrelated extension’s console errors.

## Account and access

The owner controls the Cloudflare account and GitHub repository. Use the existing authorized dashboard/OAuth session or an appropriately scoped Pages deployment credential through its authorized secret mechanism. Do not place credentials in commands, files committed to Git, uploads, logs or this runbook. A token/account ID is not required inside the static artifact.

Native dashboard entry: [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages). Select/create a **Direct Upload** Pages project deliberately; confirm the project name, actual hostname and production branch `main`. Creation may return a different hostname if the preferred name is unavailable; do not enable indexing with a guessed origin. Do not connect Git or enable Web Analytics by inference.

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

Replace the example origin if account creation confirms a different hostname. Upload **only the audited contents of `dist/`**, including `_headers`, `_redirects` and `404.html`. Never upload the checkout, Git history, Obsidian acervo, originals, `.private/`, real envs, `ACESSOS.local.md`, auth/session state or temporary files. The audit checks allowlisted paths, copied asset bytes and detected key material; additionally review the effective upload paths and content.

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

The **first production has no previous deployment** to restore. A failed upload or unknown state requires inspecting the dashboard before any repetition. A failure discovered after first publication requires a corrected audited artifact; do not claim an earlier healthy version exists. This preparation supplies a failing health gate and native recovery procedure, but no unattended rollback controller or tested account-level rollback. Record the actual recovery rehearsal and any first-release limitation when account access is available. No database/migration rollback applies to this static artifact.

After exact successful publication, reconcile GitHub/code and canonical project notes, then retire delivered inactive worktrees using the owner’s safe cleanup procedure. Preserve the one integrated preview and any pending/unpublished work. Do not treat account setup, upload initiation or an old deployment as proof of this revision’s publication.

## Cost assumptions and limits

As verified in official docs on 2026-10-22 UTC, static asset requests that do not invoke Functions are free and unlimited on Free/Paid. Free Pages allows 20,000 files and 25 MiB per asset; dashboard drag/drop allows 1,000 files. Hosted builds have a 500/month Free quota, but this flow performs builds locally and does not connect automatic Git builds. The artifact audit reports the actual file count; inspect the largest asset before upload.

Hosting scenario: static-only Pages Free, no custom domain purchase, no paid plan or add-on. Estimated provider charge for the stated static hosting scope is US$0/month within current terms/limits; actual traffic, account charges and local CPU/energy remain unmeasured. Formula if scope changes: hosting plan + billable Functions/other services + domain + authorized add-ons. The approved external-channel contact window adds no server sending/CAPTCHA service. Static free hosting does not make unrelated future services unlimited or free.

## Evidence and primary sources

Local preparation: four focused tests pass, covering routing/CSP compatibility contracts, exact artifact mismatch, fake 200 missing routes, required preview noindex, invalid target rejection and control-file audit contents/bytes. No public HTTP check, upload, native header/CSP confirmation, account-level rollback or Search Console action was performed by this preparation.

Current official documentation was consulted with Context7 and browser access:

- [Direct Upload and its project choice](https://developers.cloudflare.com/pages/get-started/direct-upload/).
- [Serving behavior,404 and cache defaults](https://developers.cloudflare.com/pages/configuration/serving-pages/).
- [Headers, matching and Functions limits](https://developers.cloudflare.com/pages/configuration/headers/).
- [Redirect rules](https://developers.cloudflare.com/pages/configuration/redirects/).
- [Preview indexing/access](https://developers.cloudflare.com/pages/configuration/preview-deployments/).
- [Native production rollback](https://developers.cloudflare.com/pages/configuration/rollbacks/).
- [Free limits](https://developers.cloudflare.com/pages/platform/limits/) and [static/Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/).
