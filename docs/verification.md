# Verification of the integrated portfolio

Updated2026-10-23 UTC. Current source combines the visual presentation/new approved photo, stack-independent service copy, direct contact channels, search discovery and manual Cloudflare Pages controls. Publication is authorized; the project/hostname `ojoaovsousa.pages.dev` is confirmed, but the public artifact has not yet been verified. See [release evidence](cloudflare-pages.md) for deployment state.

## Local gates

- `npm test`: **86/86 passed**, no skips/failures, on integrated behavioral code `95a45dc` (1.27s reported by Node); its CSS-only follow-up `e37ebe8` was accepted through native visual checks. Includes construction/reversal/last-scene completion, motion math, late-loading/disposal of portraits/residents, process/FAQ, native contact/clipboard, discovery guards and release-verifier/audit rejection cases.
- Three-language noindex build and protected-content audit passed:162 eligible regular sources/128 outputs. Final upload uses a separately frozen, audited build with the confirmed HTTPS origin and explicit indexability. No remote test pipeline was run.
- The old phone-country fixture failure is resolved by removal of the retired form imports; the three discovery tests now pass in the full suite. Form-only tests, dependency, country data and vendor bundle were removed with their consumers. They are not current product behavior.

## Native browser checks

The single HMR preview remains at `http://localhost:3000/pt-br/` from `.worktrees/integration`, Node27417 on127.0.0.1:3000. No additional visual server was created.

The contact dialog was inspected at320/390/430/800/1280px, plus390px dark mode, English800px and Spanish430px. No horizontal page/dialog overflow occurred. The email/copy row now stacks below430px after a real320px screenshot showed excessive address wrapping. All contact actions have comfortable touch heights; Copy is44px. Native copy announced success; Escape closed the modal and returned focus to its trigger. Unit coverage also confirms denied/unavailable clipboard selects the visible address for manual copying. No mail/WhatsApp/LinkedIn message was sent.

The dialog contains zero form fields and uses the same WhatsApp/email/LinkedIn destinations and local official icons as reading/footer. The website does not collect contact fields, submit messages, keep drafts or call an email backend. CAPTCHA/Gmail credentials were intentionally dropped following the owner's direct-channel decision; no such resources were created. Direct links do not promise prevention of unsolicited messages through external providers.

The new owner-supplied photo decodes at1086×1448 and was visually inspected in desktop introduction and390px direct reading without distortion/overflow. Runtime JPEG provenance/hash/dimensions are in [portrait-source.json](portrait-source.json); no retouch or face change was performed. PT/EN/ES service descriptions stay open to the technology needed by each project, while factual experience/repertoire remains specific.

Previous integrated native scene acceptance covered light/dark, reduced motion,320–430px mobile, tablet and desktop: question-tab orange selection and keyboard behavior, replay/build controls, aligned headings, footer/FAB spacing, large green success overlay and reversible scene assembly. These are browser viewport emulations, not physical-device or accessibility certification. The final publication still requires checking actual headers/CSP and all three GLBs in the public browser.

## Publication boundary

GitHub commits/draft PRs do not imply merge or publication. Cloudflare receives only the audited frozen `dist/` contents, never the checkout, Git/Obsidian, originals, `.private/`, envs, auth, credentials, raw CV or protected copies. Public HTTPS/status/redirect404/hash/canonical/robots/sitemap, recovery and Search Console evidence will be recorded in the release runbook after the actual operations. Indexability does not prove Google indexing or ranking.
