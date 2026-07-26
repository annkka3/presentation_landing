# Design Approved Hero — Milestone A.1

## Canonical visual comparison — 1746×1406

- Baseline: `qa/baselines/design-approved/hero-approved-1746x1406.png`
- React: `qa/results/design-approved/hero-react-1746x1406.png`
- Diff: `qa/results/design-approved/hero-diff-1746x1406.png`
- Device scale factor: 1
- Pixelmatch threshold: 0.25 (rasterisation tolerance only; geometry is unmasked)
- Overall difference: 0.6681%
- Native scrollbar mask: rightmost 16px only

### Region differences

- header: 0.7823%
- leftScene: 0.7120%
- text: 1.2713%
- axis: 1.6526%
- commerce: 0.3475%
- mobile: 0.5622%
- brand: 1.1097%
- rail: 0.4989%

## Pixel-spec compliance — 1440×900

| Control point | Expected | Computed | Result |
| --- | --- | --- | --- |
| Hero | 1440×900; overflow hidden; #050505 | 1440×900; hidden; rgb(5, 5, 5) | PASS |
| Left scene | 59vw = 849.59375px; height 900px | 849.59375×900 | PASS |
| Hero image | object-position 62% 20% | 62% 20% | PASS |
| Text | left 16px; bottom 70px; max-width 448px | left 16px; bottom 70px; max-width 448px | PASS |
| H1 | 51px; line-height 52.02px; max-width 440px | 51px; 52.02px; 440px; box 440×260.078125 | PASS |
| Axis | left 652px; top 198px; height 495px | left 652px; top 198px; height 495px | PASS |
| Right stack | right 90px; top 48px; 633.59375×810px | right 90px; top 48px; 633.59375×810px | PASS |
| Mobile artifact | width 382px; top 98.59375px; right -140px inside stack | width 382px; top 98.59375px; right -140px | PASS |
| Commerce block | top 50px inside stack | top 50px; box 633.59375×506.1875px | PASS |
| Brand block | bottom 60px inside stack; height 324px | bottom 60px; height 324px | PASS |
| Scroll cue | right 82px; bottom 26px | right 82px; bottom 26px | PASS |

### Raw computed values

- Hero root: left=0, top=0, right=0, bottom=0, width=1440, height=900, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=hidden, background=rgb(5, 5, 5), objectPosition=50% 50%
- Left scene: left=0, top=0, right=590.40625, bottom=0, width=849.59375, height=900, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=hidden, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Hero image: left=0, top=0, right=590.40625, bottom=0, width=849.59375, height=900, maxWidth=100%, fontSize=16px, lineHeight=normal, overflow=clip, background=rgba(0, 0, 0, 0), objectPosition=62% 20%
- Text: left=16, top=68.859375, right=984, bottom=70, width=440, height=761.140625, maxWidth=448px, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- H1: left=16, top=107.859375, right=984, bottom=532.0625, width=440, height=260.078125, maxWidth=440px, fontSize=51px, lineHeight=52.02px, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Axis: left=652, top=198, right=786, bottom=207, width=2, height=495, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Right stack: left=716.40625, top=48, right=90, bottom=42, width=633.59375, height=810, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Mobile artifact: left=1108, top=146.59375, right=-50, bottom=74.65625, width=382, height=678.75, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Commerce block: left=716.40625, top=98, right=90, bottom=295.8125, width=633.59375, height=506.1875, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Brand block: left=716.40625, top=474, right=90, bottom=102, width=633.59375, height=324, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Scroll cue: left=1223.484375, top=824, right=82, bottom=26, width=134.515625, height=50, maxWidth=none, fontSize=16px, lineHeight=normal, overflow=visible, background=rgba(0, 0, 0, 0), objectPosition=50% 50%
- Horizontal overflow: 0px
- Floating character nodes: 0
- Glass panel nodes: 0
- Console/page errors: 0
