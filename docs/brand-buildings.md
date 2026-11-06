# Brand headquarters in the island

Implemented 2026-10-22 UTC in the local samurai-world revision. The current direction uses two small Japanese houses, with unmodified official project logos mounted on white rooftop signs. Both entrances face +Z.

- HorAgora: royal blue `#315BFF`, white walls, light eave trim and an entrance with offset uprights echoing the cut H in its official symbol. A small LEGO H crest sits above the rooftop wordmark.
- ASC: navy `#00205B`, mint `#B1FCBA`, white walls, swept wing-shaped eaves and mint feather tips. Its small LEGO bird crest sits above the official rooftop wordmark.
- Both local logo anchors are `[0, 2.1, 0.065]`. The controller applies the official PNG at its original aspect ratio.

The two houses contain 870 bricks and 490 studs combined, rendered in 14 instanced batches. Their assembly remains absolute and reversible when scrubbing the story. Roof tiles and gently lifted eaves are separate LEGO pieces. Each house is about 2.43×1.96 units, including the roof, and 2.84 units high including the small crests. No extra runtime provider, library or model download was added for this architecture.

The `layout` option keeps placement in the scene controller; the small house geometry does not move either target. Door and approach metadata stay at local Z offsets `0.87` and `1.25`. The same geometry supports the island and the black scene.

The LEGO crests are sampled mechanically from the symbols in the official public PNGs: HorAgora crop `[0, 0, 400, 532]`, ASC crop `[0, 0, 710, 800]`, then alpha-bounds crop and 20×20 sampling. Transparent cells remain empty. Geometry uses the existing brand-color instanced batches. These miniature LEGO interpretations supplement the unmodified official PNG wordmarks; they do not replace them.

Source references (reviewed public brand assets):

- `public/hori.webp` — SHA-256 `8ef5b94029337659d6b89c27b70010bf7f74e12a1ccca672a0ddc3f637f19837`.

- `public/asc-logo.png` — SHA-256 `5182737e6906af3e274a97ce9947f29459ba7b741d0395b30095447462f25493`.

- `public/horagora-logo.png` — SHA-256 `b052e9c9297d507b8aa1916cbf3e65a7796c2246f9f8447aabe1939f588e61cf`.

The earlier Hori runtime remesh was uncolored: its embedded base-color texture contained only white/black. A second remesh from the approved static master also failed to retain those colors (5 credits consumed, known unsuitable result, not published). Source color restoration uses the approved public master materials and UV textures, and preserves the low-poly remesh geometry and UVs. Its derivation, actual charge, checks and previews are recorded beside the output asset. The full high-polygon approved master is not a runtime download.

Validation: the focused village test checks frontal entrances, the two project targets, instancing budget, real brand colors, reversible assembly and disposal. Browser composition is validated by the parent integration task.
