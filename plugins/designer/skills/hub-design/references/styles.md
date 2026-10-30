# Styles in words: checkable rules and clichés

The owner named a style ("in the Swiss style", "bento", "Y2K") with no design system of their own: read that style's section before the mockup. The rules are a guide for the frame system, not a stop; a "cliché" is what not to do: it is how a style looks when built from a template. If the style is not on the list, lean on the style's primary sources the same way: 3–5 rules you can see on the mockup, and one cliché. The mark [inference] means the rule was formulated from analysis, with no primary source.

## 1. Swiss · poster, story, web
Source: Müller-Brockmann, Ruder, Vignelli.
1. A modular grid: a picture or block takes 1, 2, 3 or 4 fields. In MB the text is in 2 columns, captions in 4.
2. A line of about 7 words (MB), no more than 60 characters (Ruder).
3. Sizes: usually two, the second about twice as big (Vignelli, "there are exceptions"). MB has three: 12, 9 and 7 pt. Set flush left.
4. Color as a signal: red, blue, yellow (Vignelli). Few typefaces: Vignelli has four (Garamond, Bodoni, Century Expanded, Helvetica).
5. Asymmetry rests on the grid, no frames, emptiness works ("white makes the black sing").

**Cliché:** Helvetica, a red plate and an even grid with no asymmetry.

## 2. Poster and experimental typography · poster, story
Source: Crouwel, Carson; rules 3–4 from the adewale skill.
1. The shape of letters and blocks is derived from the grid (Crouwel, New Alphabet).
2. You may break legibility in the heading; long text must read (Carson: "Don't mistake legibility for communication").
3. A scale contrast of 10× or more between display and caption.
4. There is a micro-layer of facts: dates, places, numbers. In 3 seconds the title, the date and the action read.
5. In motion few elements move at once.

**Cliché:** random rotations and overlaps with no system, a font broken for no reason.

## 3. Editorial · longread, carousels, web
Source: Bringhurst, Turley, Pentagram.
1. A line of 45–75 characters in print, 40–50 in multi-column; on screen "closer to 36 than to 66" (Bringhurst). Do not go narrower than 38–40 characters by width.
2. The unit of layout is the spread. There is a baseline grid, a gutter of at least 12 pt. Heading line spacing is less than its size (24/21).
3. The structure is constant, the presentation changes (Turley: "bricks and mortar… on top we spray graffiti").
4. All levels are visible: section label, heading, lead, caption, running head [inference].

**Cliché:** a serif heading on white and one 720px column in the center.

## 4. Bento grid · web, slides, summary cards
Source: practice (Setproduct, Brainy, deck.gallery), no primary source.
1. At least two cell sizes. The anchor is about twice the largest supporting one.
2. One gap and one radius for the whole grid.
3. One cell carries one fact. The biggest cell shows the product itself.
4. The padding inside and the gap are tied by one rule for the whole mockup. The sources differ: Setproduct sets the padding about equal to the gap, Brainy makes the gap half the padding.

**Cliché:** all cells one size, in each an icon and three lines. Not for sequential reading, comparison and price lists.

## 5. Anti-design, maximalism, collage · poster, story, promo
Source: It's Nice That, Adobe, Behance (trend reviews), NN/g.
1. Chaos is controlled: the grid and the hierarchy are visible.
2. Analog texture: a scan, a stamp, paper, cut-out letters.
3. One object or text is the main one, the rest is background [inference].

**Cliché:** a stock grunge pack on top of ordinary layout. Not for product screens (NN/g).

## 6. Neo-brutalism · promo, web, story
Source: NN/g.
1. 2–3 bright contrasting colors.
2. A hard single-color shadow with an offset of about 4px.
3. A massive heading, neutral text (Inter, Roboto).
4. Thick borders balanced by margins of 24–32px.

**Cliché:** a yellow button with a black border on any SaaS. Not for finance, medicine and dense data.

## 7. Y2K and Frutiger Aero · social, promo
Source: CARI, Eye on Design, Collins. The trend itself is weakly confirmed: listicles and posts on Behance.
1. Y2K: chrome, iridescence, a bloated rounded font, loading bars.
2. Aero: gloss, a humanist grotesque, glow, bokeh, grass, water, glass spheres.
3. One or two motifs of the era per mockup [inference].

**Cliché:** all the clichés at once.

## 8. Apple HIG · app
Source: HIG.
1. Text size on iOS 17 pt, minimum 11 pt; macOS 13 and 10 pt.
2. Contrast 4.5:1 for text up to 17 pt, 3:1 from 18 pt or bold.
3. A control 44×44 pt, minimum 28×28. The padding around an element is about 12 pt with a backing, 24 pt without it.
4. SF tracking changes with the size: 17 pt −0.43, 28 pt +0.38.
5. One color means one thing.

**Cliché:** a white background, Inter and a 20px radius instead of a type scale.

## 9. Liquid Glass · in-app navigation
Source: HIG Materials (a snapshot from 09.2025). At WWDC 2026 Apple reworked the basis of the glass and added a slider from clear to tinted: check against the current HIG.
1. Glass only in the control layer, not in the content.
2. Little glass.
3. Clear glass only over a saturated photo or video; under a bright one a darkening layer of 35% is needed.
4. Radii are concentric: the inner one equals the outer minus the padding.

**Cliché:** glass on every card, glass on glass.

## 10. Material 3 Expressive · Android
Source: m3.material.io.
1. Motion by springs: fast 350 ms, default 500 ms, slow 650 ms. Spatial springs are separate from effects springs.
2. Unusual shapes (of 35) are not put on containers with a lot of text.
3. Typography: 5 roles × 3 sizes plus emphasized styles.

**Cliché:** maximum rounding everywhere, everything loud.

## 11. Dark minimalism of Linear/Vercel · web for developers
Source: the analysis of Linear in VoltAgent DESIGN.md.
1. The background is almost black, one accent, the accent is not for decoration.
2. Panels with a 1px border, a 12px radius, no pills.
3. Display 80px with tracking −3px; instead of atmospheric pictures, product screenshots.

**Cliché:** the style itself is already a stamp ("The Linear aesthetic ate the industry"). Neon on `#0D1117`.

## 12. Immersive 3D and WebGL · promo site
Source: Awwwards, NN/g; rule 1 from a listicle.
1. One sculptural 3D object, not a screen stuffed with 3D.
2. Do not hijack scrolling; have a reduced-motion version (NN/g).

**Cliché:** 3D for the sake of 3D [inference]. Not for a working product.

## 13. Brutalism (web) · culture, portfolio
Source: NN/g.
1. Rawness only in the visuals; the hierarchy and navigation stay intact.
2. A system or monospace font, radius 0, 1px borders.
3. Only for an audience of designers, artists or entertainment.

**Cliché:** "broken" instead of "raw", navigation impossible to find [inference].

## 14. Glassmorphism (web) · overlays
Source: NN/g, Microsoft Acrylic.
1. Transparency about 30%, blur about 25px; the more varied the background, the stronger the blur.
2. A thin light border of low opacity.
3. Do not place several glass panels side by side.

**Cliché:** glass on a flat gradient where there is nothing to blur. Not under the main text.

## 15. Neumorphism · decorative blocks
Source: Malewicz, Setproduct, Webflow.
1. Two shadows, light and dark; the background is not pure white and not pure black.
2. Only cards and decor: a button must be visible as a button.
3. Keep text contrast apart from the style: low contrast is a choice, the style does not require it (Malewicz).

**Cliché:** a gray soapy button that cannot be told from the background [inference].

## 16. Mesh gradients · promo, posts, first screen
Source: rules from a designer's training, tested on a post.
1. 3–4 colors from the hero's palette, close in lightness; mesh only as a background, one hero.
2. On a blob of three or more colors, grain of 4–8%, otherwise bands and plastic.
3. Text on a calm zone, contrast from 4.5:1, margins 50–100 px.

**Cliché:** a purple-blue gradient "like every SaaS", a blob under the text, a gradient on both the background and the buttons.
