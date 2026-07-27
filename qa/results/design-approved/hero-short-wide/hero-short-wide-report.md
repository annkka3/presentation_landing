# Canonical `/design` — short-wide Hero fix

## Scope

- Accepted comparison base: commit `632968d`.
- Primary viewport: 2048×1107, device scale factor 1, browser zoom 100%, RU, dark, scroll 0.
- Short-wide matrix: 2048×1107, 1920×1000, 1728×930, 1680×900, 1512×820.
- Regression matrix: 1440×900, 1728×1117, 1746×1406.

## Why the previous matrix missed the defect

The previous desktop checks were mostly 1.54–1.60:1. At 2048×1107 the aspect ratio is 1.85:1, so the `44vw` commerce card became 901px wide and 676px tall while the stack still had only 1017px of height. The brand block was positioned from an independent vertical anchor, leaving too little readable height and producing a collision.

## Root cause

The previous desktop composition mixed unrelated dimensions:

- stack width and commerce aspect-ratio were driven by `vw`;
- available stack height was driven by `vh`;
- brand used an independent absolute anchor;
- phone was another independent absolute overlay.

Increasing width without increasing height therefore enlarged commerce vertically while brand continued to rise from the constrained lower area.

## Layout solution

Short-wide mode is isolated behind:

```css
@media (min-width: 1440px) and (max-height: 1150px) and (min-aspect-ratio: 17 / 10)
```

Inside this mode:

- the right stack becomes a two-row grid;
- commerce and brand participate in the same layout flow with an 18px grid gap;
- stack width is height-bounded with `min(44vw, clamp(475px, 58vh, 650px))`;
- brand receives a stable `28vh` block;
- phone remains absolute and scales with `min(382px, 34vh)`;
- label 03 is aligned away from the phone overlay.

Tall canonical and ordinary desktop modes retain their existing absolute composition.

## 2048×1107 bounding boxes

| Element | Before `632968d` fix | After short-wide fix |
| --- | --- | --- |
| Hero | x 0, y 0, 2048×1107 | x 0, y 0, 2048×1107 |
| Right stack | x 1056.88, y 48, 901.12×1017 | x 1315.95, y 48, 642.05×1017 |
| Commerce card | x 1056.88, y 127, 901.12×675.84, bottom 802.84 | x 1315.95, y 146.81, 642.05×481.54, bottom 628.35 |
| Brand card | x 1056.88, y 790.84, 901.12×213.16, bottom 1004 | x 1315.95, y 673.35, 642.05×281.95, bottom 955.30 |
| Phone | x 1716, y 159.02, 382×678.75 | x 1721.63, y 176.70, 376.38×668.75 |
| Scroll cue | x 1852.18, y 1039, 113.82×42 | x 1852.18, y 1039, 113.82×42 |

- Before panel gap: **−12px** (collision).
- After panel gap: **45px**.
- Visible brand height after: **281.95px**, or **25.47%** of Hero height.
- Horizontal overflow after: **0px**.

At 1512×820 the final panel gap is 45px, brand height is 201.59px, and the brand-to-scroll-cue clearance is 14.81px with no intersection.

## Character investigation

No production React renderer for a floating character exists in `src`; the only matches are defensive selectors, the `/design` removal guard, and tests. Controlled DOM inspection returned zero character nodes on:

- `/design`
- `/design#main`
- `/design#design-motion`
- `/design?mode=qa`
- `/design?mode=qa#design-motion`

The guard now explicitly checks `location.pathname === '/design' || location.pathname.startsWith('/design/')`, and an injected character node is removed by the existing observer. The visible right-side marker in controlled screenshots is the approved `.design-approved-chapter-rail`, not a character. Because the reported user screenshot itself was not attached, a more specific external overlay provider cannot be identified without inventing evidence.

## Canonical baseline

- 1746×1406 pre-short-wide vs post-short-wide Pixelmatch: **0.0000%**.
- Device scale factor: 1.
- Threshold: 0.25, anti-aliasing excluded.
- The short-wide media query does not match 1746×1406.

## Raw Playwright screenshots

- `hero-short-wide-before-2048x1107.png` — 2048×1107 — 2,023,052 bytes.
- `hero-short-wide-after-2048x1107.png` — 2048×1107 — 1,729,909 bytes.
- `hero-short-wide-after-1920x1000.png` — 1920×1000 — 1,477,363 bytes.
- `hero-short-wide-after-1728x930.png` — 1728×930 — 1,319,292 bytes.
- `hero-1440x900-regression.png` — 1440×900 — 1,186,813 bytes.
- `hero-1746x1406-regression.png` — 1746×1406 — 2,224,499 bytes.
- `hero-1746x1406-pre-short-wide.png` — 1746×1406 — 2,232,061 bytes.

## Tests

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test` — 28 passed.
- `npm run build` — passed.
- Targeted Chromium Playwright — 10 passed:
  - canonical route and homepage regression;
  - visual-polish matrix;
  - short-wide geometry;
  - route/query/hash character assertions;
  - polished canonical visual regression.

## Git and deployment

- Commit: `fix(design): support short-wide hero composition` (SHA is recorded in the final handoff).
- Push: branch status is recorded in the final handoff.
- Merge: not performed.
- Production deploy: not performed.
