# Contact channels

Published in runtime `ed8f655` on 2026-10-31 UTC. [Confirmed publication and remaining limits](cloudflare-pages.md#current-controls-and-preferences-release). Earlier local observations below preserve their original validation scope.

## Floating contact motion

Local delivery `codex/contact-shake`, base9efeedf,2026-10-30UTC: the owner requested a subtle shake approximately every10–15seconds. The existing floating CTA now uses a12second CSS cycle, stationary for its first94%, with a brief horizontal shake bounded by3px. It reuses the existing tour/visibility/contact/dialog lifecycle; there is no JavaScript timer. Hidden/offscreen/contact-section/dialog states pause it. Hover, keyboard focus, active press, disabled state and annotation suppress it; reduced motion keeps the action static. Existing label, touch target and contact channels remain.

Native reading-page evidence: an actual running CSS animation reported12000ms duration;128 samples over≈12.8seconds captured6 moving samples, maximum observed displacement≈2.9px. Reduced-motion emulation returned animation none; opening the contact dialog paused the cycle. Static review covers the remaining existing lifecycle selectors. The temporary QA tab was closed and emulation reset. This does not measure physical-device performance, energy or every pause transition. Whitespace checks passed; no remote tests, push or deployment were performed.

Static CSS grows176 raw bytes across the two affected files. This is not a transfer or cost measurement; cache, compression, traffic and device work remain unmeasured. No dependency, provider, request, stored data or client JavaScript timer is introduced. Post-publication visual/SEO checks are recorded in the release receipt; Google processing remains pending.


Owner decision2026-10-22 UTC: replace the briefing fields/local draft with direct contact channels; CAPTCHA is unnecessary because the site does not accept or send messages. Originated on `codex/contact-channels`, based on integration`6dd40b5`, and is included in published source `9f2dbb5544c525dcdea94f81620fcaf731f59126`. The [release receipt](cloudflare-pages.md#confirmed-production-release) records the actual deployment and integrated proof.

## Current behavior

- Every existing contact CTA opens the same native dialog in PT-BR/EN/ES. Dialog titles: Vamos conversar / Let’s talk / Hablemos.
- WhatsApp is the primary action. Email opens the visitor’s mail app through a native mailto link. Copy writes only the existing public email address to the browser clipboard; denial/unavailable clipboard selects that visible address for manual copying. LinkedIn opens its existing profile.
- Local official WhatsApp/LinkedIn SVGs and the native email envelope are reused through `contactLinks`/`socialIcon`, including the contact section and footer. External web links retain `noopener noreferrer`; the real public email address is unchanged.
- Native dialog close/Escape and trigger focus restoration remain. Contact works through the existing visible reading/footer links without relying on the modal’s JavaScript.
- No name/email/phone/project fields, country picker, draft, contact submission, remote validation, automatic message, database, CAPTCHA or Gmail authorization remains. The visitor decides which external app to open and what to send. External service policies apply after opening those links; the local privacy/terms copy describes that behavior.

## Removal and scope

Imports/callers/build/audit/fixtures were checked before removal. The former inquiry-form/state, phone loader/country module,115-country CLDR policy, pinned libphonenumber dependency and its three vendor artifacts served only the removed form; their form/numbering tests and CSS/build integrity hooks were removed together. The new dialog and clipboard tests cover the remaining product risks, rather than retaining tests for fields that no longer exist. Earlier phone implementation/source history remains in Git; it is not the current interface or an approved backend plan.

No Gmail SMTP/API, secret, account, endpoint or CAPTCHA was created. Cloudflare Pages Free hosts the published static site; that hosting receipt does not add a Gmail/Worker/CAPTCHA contact integration.

## Local proof and costs

The integrated published source passed **86 local tests**, including the remaining dialog/clipboard contracts, and audit **162 eligible sources/128 outputs**; 36 exact-artifact HTTP checks passed after release. Contact tests check localized destinations/labels, no form controls, copied address, one pending copy and selectable fallback on clipboard denial. The auditor checks effective eligible paths/content and performs no upload.

Native QA covered 320/390/430/800/1280px, 390px dark, English 800px and Spanish 430px. The email/copy row stacks below 430px after a real 320px capture exposed excessive wrapping; no horizontal overflow remained in those observed states. Copy announced success; Escape restored focus. Public native QA confirmed the three destinations, zero forms and no console errors. No mail/WhatsApp/LinkedIn message was sent. The new tablet/foldable layout report is under separate investigation, not resolved or published by these earlier contact checks.

The retired phone files total1,007,571B (10,325B modules +252,237B library +743,901B debug source map +1,108B license). The current contact module is measured from `public/contact-channels.js`; actual transfer depends on browser cache/compression and requests. There is no new provider/generation/message charge or API. Email links remain public; direct links do not promise prevention of unsolicited messages sent through those external services.
