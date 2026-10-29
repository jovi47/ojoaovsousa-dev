# Automatic Pages deployment and recovery

Implemented as repository configuration for the owner's explicit request on2026-10-29. This branch does not prove activation, a hosted run, installed credentials, publication or a live rollback. No merge or production run was performed while authoring it.

## Triggers and authorization

`.github/workflows/deploy-pages.yml` runs on pushes to `main` affecting runtime sources, scripts, tests, package manifests or this exact workflow. A merged PR with those changes therefore requests production deployment. Documentation-only pushes do not publish. There is no pull-request, schedule or feature-branch push trigger; remote tests run only inside these authorized deployment runs.

The Actions page also exposes **Run workflow → target: sandbox / production**. Sandbox is the safe default and uploads to the `sandbox` Pages branch with noindex. Production requires `refs/heads/main`, the checked-out event SHA and the latest remote main SHA to match. An older queued revision is refused before upload. Sandbox can review an explicitly selected trusted repository branch; do not run unreviewed code with deployment secrets.

Concurrency uses one group per target, `cancel-in-progress: false` and `queue: max`. Active publications finish rather than being killed by a newer merge. GitHub admits up to100pending runs; waiting order is based on entering the concurrency group and is not an absolute dispatch-order guarantee. The main-SHA check prevents an older waiting revision from publishing over a newer main revision. External dashboard/CLI writers are outside GitHub's lock.

## Required configuration

In `jovi47/ojoaovsousa-dev`, configure the existing Cloudflare account/project, preferably through the corresponding GitHub `production` and `sandbox` environments:

| Setting | Kind | Required meaning |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | Actions secret | Existing-account token with Cloudflare Pages Edit/Write for this scope, including project/deployment reads and rollback |
| `CLOUDFLARE_ACCOUNT_ID` | Actions variable | Confirmed32hexaccount identifier |
| `CLOUDFLARE_PAGES_PROJECT` | Actions variable | Exactly `ojoaovsousa` |

Repository-level variables/secrets can supply both environments; environment-level settings allow separate access policy. Keep production deployment branches restricted to main. Required-reviewer environment rules intentionally delay automatic deployment and must reflect the owner's chosen policy. Do not change protection or acquire/copy credentials by inference.

Read-only metadata inspection during authoring returned no Actions secrets, variables or environments. This is a setup blocker, not a reason to place the existing local OAuth session in GitHub. Only names and purpose belong in documentation. No real secret, `.private/`, env, auth/session file or `ACESSOS.local.md` may enter Git, an artifact, runner log or upload. The configuration-presence check fails before build/test work when required inputs are absent.

## Sequence and publication proof

1. Pinned official checkout/setup-node actions obtain the reviewed SHA without persisted checkout credentials. Node24 runs the repository's built-in-tooling scripts; no application dependency is added.
2. A default noindex build runs before `npm test`, because an existing site test reads `dist`. Checks then run in the same deployment job.
3. Build the exact release with `SITE_URL=https://ojoaovsousa.pages.dev`, `ANALYTICS_PREVIEW=false` and `INDEXABLE=true` only for production. Sandbox uses `INDEXABLE=false`.
4. `scripts/audit.mjs` reviews eligible source paths, protected-value patterns, generated paths and copied bytes. It permits only `.github/workflows/deploy-pages.yml` from `.github`, scanning its YAML as text; arbitrary workflows remain rejected. `.wrangler/` is ignored by Git/Docker.
5. The native Node coordinator records the current successful production deployment before upload. It compares eight public production responses with that deployment's immutable alias and keeps their SHA256digests in memory as a recovery proof. If this baseline is unhealthy or cannot be identified, production publication stops.
6. Wrangler4.155.0, pinned from the official npm registry, uploads only an isolated temporary copy of the audited `dist`, outside the checkout and any parent Wrangler/functions configuration. `_worker.js` and Functions are refused. CLI installation is a deployment tool operation on the disposable runner, not a new application dependency. Temporary copies are removed afterward; no runner artifact/cache is uploaded.
7. The coordinator invokes upload once, using the full SHA, explicit `main`/`sandbox` branch and `github-run:<run ID>` marker. It identifies a new deployment by SHA, branch, environment, marker and deployment ID, then waits for successful deploy status. The published production pointer must identify that deployment.
8. Health reuses `verify-cloudflare.mjs` for its36HTTP/exact-artifact checks, then compares every additional local JS/CSS runtime asset with its deployed bytes and MIME. It covers new inspection/autoplay/interface/process/analytics modules as well as the preexisting entry assets. Health can repeat read-only requests up to three times for edge propagation; upload is never repeated by the coordinator.

Only bounded metadata receipts are printed: mode, branch, SHA, runID, previous/current deployment IDs, status, public result URL and fixed diagnostic reason. The last receipt is also written to the Actions step summary. Raw Cloudflare API responses, environment bindings and CLI stdout/stderr are not dumped. This workflow does not add a GitHub artifact upload or cache.

## Recovery, unknown outcomes and limits

A failure before publication never triggers rollback. A failed sandbox health check never mutates production. After production health failure, rollback is attempted only when a fresh project read still identifies this run's newly published deployment. If another writer has replaced it, recovery stops for an operator rather than restoring over that writer.

The API receives one POST to the captured previous deployment's rollback endpoint. A lost POST response is reconciled by project reads, without sending another POST. Recovery requires the previous production ID to become current and its eight saved public digests/statuses to match again. The Actions run remains failed even when recovery succeeds, with status `rolled-back` and both IDs in its receipt.

No deployment ID after an upload response loss, multiple candidates, API unavailability, pending status past the bounded wait, supersession or uncertain rollback produces `needs-attention`. Reconcile the run's SHA/branch/marker/ID in the Cloudflare dashboard/API before further mutation. Rerunning an already deployed SHA/branch is refused before another upload, including a fresh workflow run; this is deliberate protection against blindly repeating an unknown result. Select a new reviewed commit or perform an explicit, reviewed operator recovery when appropriate.

Cloudflare exposes no compare-and-swap precondition on rollback. The fresh ownership check prevents known supersession, but an external writer can still race between the read and POST; keep dashboard/CLI writers out of the same publication window. Runner termination or timeout after mutation cannot guarantee an executing recovery callback. Wrangler may have its own internal request handling; the coordinator guarantees one CLI invocation and one rollback POST, not provider exactly-once behavior. If these limits occur, retain the IDs and reconcile manually.

This is a static site: there is no database migration to reverse. Recovery smoke checks prove eight previously captured public responses, not every past asset, browser interaction, Clarity ingestion or Search Console indexing. The post-release browser/SEO/provider checklist in the Pages runbook remains required. Source/worktree cleanup follows exact publication evidence and preservation of active work/local files; do not remove the integrated preview merely because a workflow file was merged.

## Verification and cost

Local focused checks during authoring:21tests passed sequentially in506ms, including upload-result reconciliation, pre-publication refusal, post-publication rollback, foreign-writer protection, lost rollback response, sandbox isolation, all-runtime-byte checking, API response minimization and restrictive workflow allowlisting. New coordinator tests first failed before its module existed. Later source updates require their final reported check; these notes do not claim a live GitHub run or destructive rollback rehearsal.

No model/third-party asset generation, runtime integration, account or paid plan is added. Cost model: authorized deployment runs/month × measured runner minutes/run × the account's applicable runner tariff, plus CLI transfer/storage and static hosting under its existing plan. Duration, account charges and marginal CPU/energy are unmeasured; failed setup is stopped before the expensive gates and development PRs consume no hosted test run. GitHub/Cloudflare quotas and account policy remain separate from a code-level workflow.

Official sources consulted2026-10-29: [Cloudflare Direct Upload with CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/), [Wrangler Pages flags](https://developers.cloudflare.com/workers/wrangler/commands/pages/), [project configuration/canonical deployment](https://developers.cloudflare.com/api/resources/pages/subresources/projects/methods/get/), [deployment identity/list](https://developers.cloudflare.com/api/resources/pages/subresources/projects/subresources/deployments/methods/list/), [rollback endpoint](https://developers.cloudflare.com/api/resources/pages/subresources/projects/subresources/deployments/methods/rollback/) and [GitHub concurrency/queue](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency).
