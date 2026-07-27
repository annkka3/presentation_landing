# Design Approved Hero — polished canonical regression

## Canonical visual comparison — 1746×1406

- Baseline: `qa/baselines/design-approved/hero-polished-1746x1406.png`
- React: `qa/results/design-approved/hero-react-1746x1406.png`
- Diff: `qa/results/design-approved/hero-diff-1746x1406.png`
- Device scale factor: 1
- Pixelmatch threshold: 0.25 (rasterisation tolerance only; geometry is unmasked)
- Overall difference: 0.0000%
- Native scrollbar mask: rightmost 16px only

### Region differences

- header: 0.0000%
- leftScene: 0.0000%
- text: 0.0000%
- axis: 0.0000%
- commerce: 0.0000%
- mobile: 0.0000%
- brand: 0.0000%
- rail: 0.0000%

## Pixel-spec compliance — 1440×900

| Control point | Expected | Computed | Result |
| --- | --- | --- | --- |
| Hero | 1440×900; overflow hidden; #050505 | 1440×900; hidden; rgb(5, 5, 5) | PASS |
| Left scene | 59vw = 849.59375px; height 900px | 849.59375×900 | PASS |
| Hero image | object-position 62% 20% | 62% 20% | PASS |
| Text | left 16px; polished bottom rhythm; max-width 414px | left 16px; bottom 55.796875px; max-width 414px | PASS |
| H1 | polished responsive scale; max-width 408px | 43.92px; 44.3592px; 408px; box 390.578125×177.4375 | PASS |
| Axis | left 652px; top 198px; height 495px | left 652px; top 198px; height 495px | PASS |
| Right stack | right 90px; top 48px; 633.59375×810px | right 90px; top 48px; 633.59375×810px | PASS |
| Mobile artifact | width 382px; top 98.59375px; right -140px inside stack | width 382px; top 98.59375px; right -140px | PASS |
| Commerce block | polished top anchor inside stack | top 49.5px; box 633.59375×504.1875px | PASS |
| Brand block | polished responsive anchor | bottom 49.5px; height 214.453125px | PASS |
| Scroll cue | right 82px; bottom 26px | right 82px; bottom 26px | PASS |

### Raw computed values

- Hero root: left=0, top=0, right=0, bottom=0, width=1440, height=900, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=hidden, background=rgb(5, 5, 5), objectPosition=50% 50%
- Left scene: left=0, top=0, right=590.40625, bottom=0, width=849.59375, height=900, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=hidden, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Hero image: left=0, top=0, right=590.40625, bottom=0, width=849.59375, height=900, maxWidth=100%, fontSize=16px, lineHeight=normal, overflow=clip, background=rgba(0, 0, 0, 0), objectPosition=62% 20%
- Text: left=16, top=245.265625, right=1033.421875, bottom=55.796875, width=390.578125, height=598.9375, maxWidth=414px, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- H1: left=16, top=278.265625, right=1033.421875, bottom=444.296875, width=390.578125, height=177.4375, maxWidth=408px, fontSize=43.92px, lineHeight=44.3592px, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Axis: left=652, top=198, right=786, bottom=207, width=2, height=495, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Right stack: left=716.40625, top=48, right=90, bottom=42, width=633.59375, height=810, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Mobile artifact: left=1108, top=146.59375, right=-50, bottom=74.65625, width=382, height=678.75, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Commerce block: left=716.40625, top=97.5, right=90, bottom=298.3125, width=633.59375, height=504.1875, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Brand block: left=716.40625, top=594.046875, right=90, bottom=91.5, width=633.59375, height=214.453125, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Scroll cue: left=1244.171875, top=832, right=82, bottom=26, width=113.828125, height=42, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Horizontal overflow: 0px
- Floating character nodes: 0
- Glass panel nodes: 0
- Console/page errors: 0
