# Shared header, contact and compact scene controls

## Current header —2026-10-30UTC

The owner's final choice retains the original orange **Fale comigo / Let’s talk / Hablemos** header action above700px, with its black2px border,5px corners, existing conversation icon and2px lower shadow. Its existing contact behavior and phone omission remain. Earlier removal and color trials were superseded. Equivalent contact styles formerly spread across the base sheets are consolidated in the shared controls stylesheet.

Language shows only its flag, retaining the full localized accessible name and existing language choices. Language and theme use44×44px targets,1px neutral borders and12px corners. The compact menu retains its original28px three-line glyph and44×44px target with no visible border. All three strokes use the existing text color: black in light mode and light in dark mode. The header's outer border remains neutral. Action gaps are8px,6px through700px and4px through430px. Native navigation, focus outlines and disclosures remain.

The header portrait retains its restrained7second sway, paused for hidden documents, dialogs, annotation and hover/focus, and absent with reduced motion. The floating contact action retains its orange surface, decorative studs, visible localized label and geometric icon. Floating-contact motion belongs to the separate `codex/contact-shake` delivery. Device preference defaults belong to `codex/device-preferences`.

## Compact scene controls

Through700px, construction selectors retain48px targets and21px marks. Replay retains a44×44px target in the scene's upper-right grid area; its long visible label is hidden there while title and accessible name remain. Four construction selectors remain. Reading/graphics fallback does not use that overlay. These existing scene behaviors were not changed or re-homologated by this header correction.

## Evidence and limits

Branch `codex/header-consistency`, base9efeedf, is integrated into the existing localhost3000 preview. The all-locale viewer contract checks flag-only summaries and the restored original contact action.11 focused viewer/direct/black tests passed. Final native checks include320/430/701/752/1440px, light/dark styling,44px targets, menu keyboard opening/focus and no horizontal overflow. The restored contact was inspected at752px. Independent static review found no remaining issue. Physical devices/zoom remain untested; publication needs the release receipt.

Affected CSS totals342 fewer raw bytes; the flag-only summary removes59 raw HTML bytes per header in every locale. These are scoped inventories, not compressed transfer, energy or billing measurements. No dependency, provider, storage, collected data or recurring process is added by the visual branch. URLs, metadata, canonical, robots, structured data and sitemap inputs are unchanged; existing contact destinations remain.
