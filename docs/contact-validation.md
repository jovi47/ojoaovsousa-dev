# Local contact validation

State: implemented locally on `codex/contact-validation`, based on the visual delivery through `1e903d8`. No server sending, provider integration, account, environment change or deployment is included. The editable implementation and tests remain in Git; canonical copy reconciliation is coordinated by the integrator.

## Form behaviour

- The existing shared briefing form now requires a phone number as well as name, email and project description, in PT/EN/ES.
- A native selector lists every country supported by the pinned phone metadata. `Intl.DisplayNames` and `Intl.Collator` localize/order names; each option shows its calling code. The initial option is explicitly international `+code`, with no country inferred from language, location or browser settings.
- A national number needs the selected country. An explicit `+country code` takes precedence, so a visitor can enter a number from anywhere. Spaces, parentheses, hyphens and periods are accepted as formatting. Extensions are explicitly unsupported and rejected rather than silently removed.
- `parsePhoneNumberFromString(input, {defaultCountry, extract:false})` from `/max` and `.isValid()` check the numbering-plan format. The local draft receives E.164. This does not prove allocation, reachability, ownership or a WhatsApp account.
- Email validation trims ordinary outer spaces, limits the address to254 characters/local part to64, checks common ASCII address/domain syntax and rejects control characters, whitespace inside an address, repeated local-part dots and malformed domain labels. Common plus-addressing and apostrophes remain valid. Quoted local parts, SMTPUTF8 addresses and address literals are outside this small form’s supported syntax. No DNS/MX, SMTP, delivery or ownership verification is performed.
- Email/phone errors are localized, associated with their fields and use native validity/focus. Name/project limits remain120/3000. Changing any field or the country hides the old mailto link, clears the old draft and cancels an outdated asynchronous preparation result.
- The library starts loading only when the existing dialog opens (or a phone validation is explicitly requested). A shared in-flight promise prevents duplicate script requests. Loading failure/10-second timeout leaves no draft, shows a retry message and allows another preparation attempt; the other contact links remain available.

## Data boundary

The form still prepares a local `mailto:jovi47profissional@gmail.com` draft. It does not submit a request, persist contact fields, call a provider, send email or subscribe a visitor to marketing. Only the explicit “Open my email” link passes the prepared data to the visitor’s email app; the visitor reviews and decides whether to send. Recipient/subject remain fixed, and the body is URL-encoded. Local privacy copy in all three languages now identifies the phone field.

The recipient address still appears in the public contact/draft source; masking only visible text would not hide it. Moving it to a server environment belongs to the real-delivery integration. Server delivery, abuse prevention and provider authentication require a separate approved scope. Browser validation is a usability check and is not a server-side security boundary.

## Dependency and provenance

- Approved package: [`libphonenumber-js`1.13.15](https://www.npmjs.com/package/libphonenumber-js/v/1.13.15), MIT, pinned without a version range in `package.json`/`package-lock.json`.
- Registry archive: `https://registry.npmjs.org/libphonenumber-js/-/libphonenumber-js-1.13.15.tgz`.
- npm integrity: `sha512-AHdhEQeDFEJ4GKDAQ9AwxChy+v2kUILUB3TGQRpkXMkWePjXTU/WQEzWVQoIx/Gz8fE73Wr5SEuZCy2vk8jrMQ==`.
- Official upstream UMD and source map are copied unchanged into `public/vendor/`, with the original license. `npm run build` compares their bytes to the installed pinned package and fails if they differ; it does not write into watched `public/`, avoiding an HMR rebuild loop.

| Public file | Bytes | SHA-256 |
| --- | ---: | --- |
| `vendor/libphonenumber-max.js` |252,237|`49963114d3f93de9fc618d37b0faca897235baf314ede30ee8c0a511029d8508`|
| `vendor/libphonenumber-max.js.map` |743,901|`5311b9522686b65bafd2b565e57a98290eb2a59d5740a43a1e5201a2dde4a8d9`|
| `vendor/libphonenumber-LICENSE.txt` |1,108|`ea6fc5fe0f905c5fdedd8f160f1dd73ce739004fc5f35656b35258aea126dbde`|

## Cost and verification limits

There is no new generation, paid API, provider subscription or message charge. The initial HTML includes the country options and small local form modules; the252,237-byte phone UMD is deferred until the dialog is opened. The source map is a debugger resource, not part of normal form execution. Transfer depends on cache/compression and actual requests: `initial requests × transferred initial bytes + uncached dialog opens × transferred UMD bytes`, plus a source-map request only if developer tools request it. File sizes above are uncompressed source measurements, not a measured network or performance result. Existing hosting rates still apply; unknown traffic/rates are not assumed zero.

Local verification: all81 tests passed, including the five new focused validation/form checks; the three-locale noindex build and artifact audit passed (159 regular source files,127 outputs). A separate read-only reviewer found no concrete issue in normalization, stale drafts, lazy loading or retry behaviour. Reproduce with `npm ci --ignore-scripts --no-audit --no-fund`, `npm run build`, `npm test`, and `node scripts/audit.mjs`. Coverage includes BR/US/ES/PT, explicit international codes, malformed numbers/extensions/email/control injection, stale draft invalidation, lazy loading/retry and all localized form/privacy contracts. Browser/mobile/dark-mode QA and integration remain with the main task; no new server or preview port was started here.

Integrator browser evidence,2026-10-22 UTC: on the shared preview, invalid email/phone showed both localized errors with no draft; valid BR/US/ES/PT examples produced E.164 drafts. Editing the project removed the old link/body. There were246 selector options and no phone script before opening, then one local script. PT was checked at320/390/430px, English at1280px and Spanish at800px, without horizontal overflow; fields were48px high at320px. Escape closed the dialog and restored header focus. Only fictional local data was used; no mail link was opened or message sent. The initial light theme was restored.
