# Main release reconciliation

**Goal:** make `main` the recoverable source of the approved public portfolio and reconcile its historical PRs without restoring superseded behavior.

**Architecture:** preserve the published runtime from `8a17351` / `b701acd`, documented at `fa58b3e`. Add the already-integrated historical heads as ancestry, verify the resulting source and artifact, then merge this reconciliation into `main` with a regular merge commit. Publish the exact merged revision through the existing manual Pages path.

**Stack:** Node built-in tooling, Git, GitHub and the existing Cloudflare Pages Direct Upload project. No new dependency, provider or data model.

**Authorization:** owner requested reconciliation, meaningful PR merges into `main` and production publication in this chat on 2026-11-05. It includes this integration/release, not new credentials, paid resources or unrelated product changes.

## Constraints and review focus

- Never include PRIVATE, real envs, credentials, auth/session state or `ACESSOS.local.md`, including historical objects and copied content.
- Tests run locally; no PR/push test workflow. This branch adds no workflow.
- Keep the single localhost:3000 integration preview and other active worktrees.
- Do not restore the retired phone form, completed-only tablet grid or previous hero/recovery implementation.
- Preserve production canonical URLs, Google verification, consent behavior and real 404.
- Unknown publication results require reconciliation, never a duplicate upload.
- A clean merge does not prove a healthy release; compare the exact artifact and test public recovery.

## Integration evidence

| PRs | Preserved evidence |
| --- | --- |
| 1–6, 14–16 | Exact heads are ancestors of `fa58b3e`; form #2 was removed by #6 before the current release. |
| 7–8 | All historical commits are patch-equivalent in the published history; #8 replaced #7's completed-only tablet grid. |
| 9–11 | Retina/404/analytics were consolidated in the release history, including `75c2cdb`; current published files and tests retain the implemented behavior. |
| 12 | Google tag and test consolidated in `c89e4d0`, retained in the published renderer. |
| 17–20 | Release `ed8f655` names all four exact PR heads and contains their consolidated source. |
| 13 | Separate automation scope. Keep draft: Pages-scoped Actions secret and environment policy are not configured; no hosted run/live automatic rollback is proven. |

The ancestry-only merge `a27b8a0` preserves the complete `fa58b3e` tree. It intentionally does not apply the historical branches' old runtime or old current-state documentation again. PR2 and PR7 were closed as superseded; the other17historical feature PRs were retargeted to main and confirmed indirectly merged through PR21. Main merge is `c94e71c30b207ed03cc92f19005de3a6e2edcd08`. See [GitHub indirect merge semantics](https://docs.github.com/en/pull-requests/reference/pull-request-merges#indirect-merges).

## Execution

- [x] Confirm repository, open PR heads, exact deployed source and canonical origin.
- [x] Create one internal worktree and preserve the published tree while reconciling ancestry.
- [x] Run default build, 148-test suite, production build, artifact audit, protected-history review and37current-production HTTP/artifact checks. JoviMac `e3698b15-55ca-40e1-993b-8887decccc94` completed exit0 on `de62f97699def4f1f880100d14ce97c40f58108f`:148pass/0fail/0skip,201sources/137outputs/10,075,017bytes. The reachable-history audit checked1,055objects/611blobs without protected paths or detected keys. The37public checks cover the verifier's declared paths, not every output file.
- [x] Obtain independent read-only review; no Critical/Important issue, both wording findings corrected.
- [x] Retarget the17active feature PRs, close the two superseded PRs and merge PR21 into main without squash/rebase. GitHub confirmed actual states; no workflow run was triggered.
- [x] Confirm merged runtime inputs and all137frozen outputs match the checked revision; publish the exact SHA after16healthy previous-target reads.
- [x] Verify37public HTTP/artifact checks,4extra exact assets,390/1440px browser recovery/contact/focus and SDK revocation. The unchanged sitemap's provider error remains a separately investigated pending state.
- [x] Record exact merge/deployment receipts and costs. [Published receipt](cloudflare-pages.md#main-reconciliation-release) preserves source/deployment identity. Local retirement records and canonical project memory track safe cleanup independently of subsequent documentation-only commits.

## Host, costs and limits

Linux was unreachable in the current Jovi status sample. Local checks and authenticated publication use the Mac through its existing admission queue, with explicit estimates; no Linux job is repeated or migrated. The current independent preview remains on localhost:3000.

This reconciliation changes Git ancestry and documentation only. Runtime/build inputs and generated production bytes must remain identical to the approved source. Contracted incremental cost is US$0; actual deployment transfer, browser resources and local energy are unmeasured. Manual upload uses the existing authorized Wrangler session in place; nothing is copied into Actions.

Physical-device acceptance, actual Clarity ingestion/masking and an actual automatic rollback remain unproven. They must not be inferred from local tests or this release.
