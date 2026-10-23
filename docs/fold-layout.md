# Completed viewer at intermediate widths

Historical intermediate fix: the current mobile/tablet follow-up replaces this completed-only grid with introduction → scene → reading flow from entry through 1100px. The cause and measurements below retain useful baseline evidence; they do not describe the current final layout. See [mobile experience](mobile-experience.md) and [current verification](verification.md).

This follow-up starts from published revision `9f2dbb5544c525dcdea94f81620fcaf731f59126`. It changes only the completed viewer layout between 701 and 1100 CSS pixels. No new device model is inferred from the ambiguous device name supplied by the owner.

## Cause and change

The completed story removes its long assembly track, but the board still reserved `100svh − header`. Its scene, navigation and content card were absolutely positioned, so the card's actual end could not close the board. The embedded reading hero then added 90px of top padding from `viewer.css`, overriding the later-looking 55px rule in its imported `direct.css`.

The integrator measured the published page at 854×1280 CSS pixels, completed and selecting Challenge: board/tour at y64 with height 1216; card y702, height 426, bottom 1129; embedded hero starts y1280 with 90px top padding. That leaves approximately 151px after the card plus 90px before the next hero content. At 1024×768 landscape, the board was about 704.56px tall while the card was capped at 225.65px for 390.30px of challenge content, requiring internal scrolling; the gap after the card plus the next hero padding was about 176px. This is a viewport/content layout issue, not a margin on the challenge title.

After completion, this width range uses normal grid flow: existing scene → existing four selectors → active card. Board height follows those rows. The scene keeps exactly its prior full width and `48svh − header` height; camera framing and canvas dimensions do not change merely because the tour completes. The card keeps its existing horizontal dimensions and padding, but its height limit becomes viewport minus header and two page gutters. Short cards fit their content; longer cards still scroll internally. The embedded hero uses the existing `--direct-space` rhythm.

The sticky assembly layout and measured reading track remain unchanged. `measureStory` returns early once assembled, so the content-sized completed board does not feed a new story-height measurement cycle. The completed grid is excluded from reading/graphics-failure modes. The obsolete tablet-only completed absolute-position rule was removed: the new grid already overrides its navigation/card declarations, the intro is hidden after completion, and reading/failure modes hide the board. The separate mobile rule up to 700px remains intact; desktop above 1100px retains its existing layout.

## Verification and limits

Local focused verification passed: 11/11 existing story mapping/termination, viewer and direct-content tests; build of all three locales; artifact audit of 163 source files and 128 output files; whitespace check. No new test mirrors CSS declarations or fixes a pixel value.

The integrator supplied these native-browser observations against the local grid candidate, with stable viewport measurements:

| CSS viewport / action | Observed result |
| --- | --- |
| 854×1280, completed Challenge | Progress 1.000 and Challenge selected. Board height 1058.66px ends at the card's bottom 1122.66px; the hero follows immediately with 44px padding. Combined gap falls from about 241px to 44px. Canvas height 550.39px is unchanged. |
| 1024×768, completed Challenge | Board 813.18px; card 426.28px and full scroll height 426px, instead of the prior 225px cap. No card/page overflow; the hero follows the card with the shared padding. |
| 854×1280, all four selections | Stack card 1168px with expected overflow for long content; HorAgora 889.81px, ASC 917.80px, Challenge 426.28px. The hero follows the actual card end in every selection. |
| Breakpoints and mobile | 700px keeps the prior block layout; 701px and 1100px use the grid; 1101px keeps desktop. 390×844 retains mobile. No page overflow in the measured cases. |
| Keyboard | Shift+Tab from Your project reached ASC; Enter selected ASC. |
| Full scroll and replay | A fresh 854×1280 load completed the measured story at 1.000/Challenge with no console warnings/errors. ASC replay ended at 1.000 with an empty replay state and ASC still selected; its board stayed 1550.18px during replay. |

An independent source review found no functional issue and identified the now-removed redundant tablet rule. These measurements precede that declaration cleanup; the winning grid declarations are unchanged. They are local emulated browser evidence, not a physical Asus/foldable test or proof of publication. Broader physical-device, replay and fallback acceptance is not inferred from these cases.

Cost impact: +605 raw bytes in the existing stylesheet and this technical note; no runtime dependency, asset request, third-party provider, storage or paid generation. Actual traffic and monetary charge remain unmeasured.
