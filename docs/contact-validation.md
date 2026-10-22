# Contact channels

Owner decision2026-10-22 UTC: replace the briefing fields/local draft with direct contact channels; CAPTCHA is unnecessary because the site does not accept or send messages. Implemented locally on `codex/contact-channels`, based on integration`6dd40b5`. Browser QA and publication are separate integrator steps.

## Current behavior

- Every existing contact CTA opens the same native dialog in PT-BR/EN/ES. Dialog titles: Vamos conversar / Let’s talk / Hablemos.
- WhatsApp is the primary action. Email opens the visitor’s mail app through a native mailto link. Copy writes only the existing public email address to the browser clipboard; denial/unavailable clipboard selects that visible address for manual copying. LinkedIn opens its existing profile.
- Local official WhatsApp/LinkedIn SVGs and the native email envelope are reused through `contactLinks`/`socialIcon`, including the contact section and footer. External web links retain `noopener noreferrer`; the real public email address is unchanged.
- Native dialog close/Escape and trigger focus restoration remain. Contact works through the existing visible reading/footer links without relying on the modal’s JavaScript.
- No name/email/phone/project fields, country picker, draft, contact submission, remote validation, automatic message, database, CAPTCHA or Gmail authorization remains. The visitor decides which external app to open and what to send. External service policies apply after opening those links; the local privacy/terms copy describes that behavior.

## Removal and scope

Imports/callers/build/audit/fixtures were checked before removal. The former inquiry-form/state, phone loader/country module,115-country CLDR policy, pinned libphonenumber dependency and its three vendor artifacts served only the removed form; their form/numbering tests and CSS/build integrity hooks were removed together. The new dialog and clipboard tests cover the remaining product risks, rather than retaining tests for fields that no longer exist. Earlier phone implementation/source history remains in Git; it is not the current interface or an approved backend plan.

No Gmail SMTP/API, secret, account, endpoint or CAPTCHA was created. The Cloudflare website hosting delivery has its own scope/docs and is not implemented by this contact change.

## Local proof and costs

`npm run build`, `npm test` and `node scripts/audit.mjs` passed locally:82 tests, including3 contact-channel tests. These check localized destinations/labels, no form controls, copied address, one pending copy and selectable fallback on clipboard denial. The artifact auditor checks effective eligible paths/content; it performs no upload. Integrated browser/mobile/dark-mode and deployed-domain proof remain with the main task.

The retired phone files total1,007,571B (10,325B modules +252,237B library +743,901B debug source map +1,108B license). The current contact module is measured from `public/contact-channels.js`; actual transfer depends on browser cache/compression and requests. There is no new provider/generation/message charge or API. Email links remain public; direct links do not promise prevention of unsolicited messages sent through those external services.
