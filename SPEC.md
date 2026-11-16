# Dluhopisový Radar — rekonstrukce reference

MODE = REPLICA — clean full-page screenshot 1122 × 1402 px, edge-to-edge, no crop.
REFERENCE_WIDTH = 1440 px; PAGE_HEIGHT = 1799 px; reference rendered scale 1440/1122 ≈ 1.2834.
CONTAINER_MAX = 1360px; GUTTER = 40px; GRID = left 1090px / right 240px / gap 30px.

## Typography at 1440 px
- character: premium editorial serif titles and neutral grotesk navigation/body
- stack: Georgia, 'Times New Roman', serif (heads); Arial, Helvetica, sans-serif (body)
- h1: 54px / w700 / lh 0.96 / tracking -2.2px, lines exact:
  1. „Máme emise na radaru.“
  2. „Než investujete své peníze,“
  3. „prověřte si emitenta.“
- h2: 38px / w700 / lh 1.05
- body: 18px / w400 / lh 1.27; small: 13px
- h1_to_body_ratio 3.0

## Colors (sampled and visually estimated from reference)
- text #071026; muted #394657; bg #ffffff; surface #eef4f7; border #d5e2e8
- accent #b0f600; emerald #006b59; teal #0a6570; navy #09384c
- cta_bg #adf500; cta_text #0a1619

## Geometry at 1440 (all section boxes explicit)
| id | CSS selector | height | content |
| --- | --- | ---: | --- |
| header | header.site-header | 82px | logo / slogan / main links / search |
| hero | section#hero | 430px | left copy / CTA / right photography with circular radar overlay |
| process | section#process | 413px | heading + 4 horizontal step rows; sidebar advertisement begins here |
| actions | section#actions | 184px | two wide photographic service tiles |
| insights | section#insights | 310px | three article cards |
| databases | section#databases | 139px | two wide database links |
| adbanner | section#adbanner | 103px | full-width horizontal advertisement |
| footer | footer.site-footer | 138px | dark navy branding + nav + legal |
| **sum** | | **1799px** | |

SIDEBAR: absolute top about 42px into #process; runs through #insights, about 855px height; 240px wide. Desktop only; reflow below content on small screens.

## Component sizes
- hero button 258×53 px, radius 18px; secondary 246×53px radius 18px
- process row 1090×74px, radius 14px, gap 8px; circular numbers 43px
- actions: 2 cards each ~529×163px, gap 18px, radius 16px
- article cards: ~354×226px, image top 120px, radius 13px
- database cards 670×120px, radius 15px, gap 18px
- banner 1360×82px, radius 15px
- header logo icon 61×42px; footer same visual weight

## Asset slots
Hero image occupies right 65% of the hero with fade left/bottom; one photo of luxury glass residential complex. Radar overlay drawn as UI, not burned into photo. Editorial photos are fully independent subjects. Sidebar vertical architecture photography. Service and database tiles have distinct facade crops.

## Responsive derivations
At <=1100px hide sidebar and expand main, switch 3 article columns to 2, keep hero two columns where possible. At <=720px hamburger/dropdown mobile menu, single-column hero with photo below copy, one-column cards, step rows stack, sections use min-height/auto inside media queries, footer flows naturally.

## Interaction contract
Navigation scrolls to real sections; search dialog searches local demonstrative data (not real verified market data); hero CTA opens request form; other links open seeded database/modal or section; advertisers contact form. Modal traps focus, supports Esc and overlay close. Forms validate locally and clearly say no submission was sent to a server.
