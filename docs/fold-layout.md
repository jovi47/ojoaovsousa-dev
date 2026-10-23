# Completed viewer at intermediate widths

This follow-up starts from published revision `9f2dbb5544c525dcdea94f81620fcaf731f59126`. It changes only the completed viewer layout between 701 and 1100 CSS pixels. No new device model is inferred from the ambiguous device name supplied by the owner.

## Cause and change

The completed story removes its long assembly track, but the board still reserved `100svh − header`. Its scene, navigation and content card were absolutely positioned, so the card's actual end could not close the board. The embedded reading hero then added 90px of top padding from `viewer.css`, overriding the later-looking 55px rule in its imported `direct.css`.

The integrator measured the published page at 854×1280 CSS pixels, completed and selecting Challenge: board/tour at y64 with height 1216; card y702, height 426, bottom 1129; embedded hero starts y1280 with 90px top padding. That leaves approximately 151px after the card plus 90px before the next hero content. At 1024×768 landscape, the board was about 704.56px tall while the card was capped at 225.65px for 390.30px of challenge content, requiring internal scrolling; the gap after the card plus the next hero padding was about 176px. This is a viewport/content layout issue, not a margin on the challenge title.

After completion, this width range uses normal grid flow: existing scene → existing four selectors → active card. Board height follows those rows. The scene keeps exactly its prior full width and `48svh − header` height; camera framing and canvas dimensions do not change merely because the tour completes. The card keeps its existing horizontal dimensions and padding, but its height limit becomes viewport minus header and two page gutters. Short cards fit their content; longer cards still scroll internally. The embedded hero uses the existing `--direct-space` rhythm.

The sticky assembly layout and measured reading track remain unchanged. `measureStory` returns early once assembled, so the content-sized completed board does not feed a new story-height measurement cycle. The completed grid is excluded from reading/graphics-failure modes. Mobile up to 700px and desktop above 1100px retain their existing layout.

## Verification and limits

Local focused verification passed: 11/11 existing story mapping/termination, viewer and direct-content tests; build of all three locales; artifact audit of 163 source files and 128 output files; whitespace check. No new test mirrors CSS declarations or fixes a pixel value. Native browser QA must compare stable geometry before/after completion at 768×1024, 854×1280, 1024×768 and 1100px, plus the 700/701 and 1100/1101 boundaries. Preserve 320–430 mobile and 1280px desktop.

Check scroll assembly reaches 1.000 and selects Challenge; Skip, selection changes, local replay, fonts/resize, open career/project details, keyboard focus and reading/reduced/failure fallback remain usable. Measure the final card bottom against the next embedded hero, inspect screenshots and check no overlap/overflow. Emulated viewports do not prove a physical foldable device. Native after-change results belong to the integrator; no deployment is implied by this code preparation.

Cost impact: +942 raw bytes in the existing stylesheet and this technical note; no runtime dependency, asset request, third-party provider, storage or paid generation. Actual traffic and monetary charge remain unmeasured.
