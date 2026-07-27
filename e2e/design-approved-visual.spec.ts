import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const qaRoot = path.resolve(process.cwd(), 'qa')
const baselinePath = path.join(qaRoot, 'baselines/design-approved/hero-polished-1746x1406.png')
const resultsRoot = path.join(qaRoot, 'results/design-approved')
const approvedResultPath = path.join(resultsRoot, 'hero-approved-1746x1406.png')
const react1746Path = path.join(resultsRoot, 'hero-react-1746x1406.png')
const diff1746Path = path.join(resultsRoot, 'hero-diff-1746x1406.png')
const react1440Path = path.join(resultsRoot, 'hero-react-1440x900.png')
const reportPath = path.join(resultsRoot, 'hero-spec-report.md')
const pixelThreshold = 0.25

const regions = {
  header: { x: 0, y: 0, width: 1746, height: 82 },
  leftScene: { x: 0, y: 0, width: 1031, height: 1406 },
  text: { x: 0, y: 555, width: 470, height: 851 },
  axis: { x: 792, y: 285, width: 82, height: 825 },
  commerce: { x: 850, y: 80, width: 808, height: 650 },
  mobile: { x: 1400, y: 105, width: 330, height: 650 },
  brand: { x: 850, y: 760, width: 808, height: 570 },
  rail: { x: 1670, y: 750, width: 62, height: 430 },
} as const

async function stabiliseHero(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.querySelectorAll<HTMLImageElement>('.design-approved-hero img')].map((image) => image.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true })
          image.addEventListener('error', () => resolve(), { once: true })
        })))
    window.scrollTo(0, 0)
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    const video = document.querySelector<HTMLVideoElement>('.design-approved-hero-media video')
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  })
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
      .design-approved-hero-media video { display: none !important; }
    `,
  })
  await page.waitForTimeout(100)
}

function extractRegion(source: PNG, region: { x: number; y: number; width: number; height: number }) {
  const result = new PNG({ width: region.width, height: region.height })
  PNG.bitblt(source, result, region.x, region.y, region.width, region.height, 0, 0)
  return result
}

function comparePngs(expected: PNG, actual: PNG, scrollbarMaskWidth = 0) {
  const diff = new PNG({ width: expected.width, height: expected.height })

  for (let y = 0; y < expected.height && scrollbarMaskWidth > 0; y += 1) {
    for (let x = expected.width - scrollbarMaskWidth; x < expected.width; x += 1) {
      const offset = (y * expected.width + x) * 4
      expected.data[offset] = actual.data[offset]
      expected.data[offset + 1] = actual.data[offset + 1]
      expected.data[offset + 2] = actual.data[offset + 2]
      expected.data[offset + 3] = actual.data[offset + 3]
    }
  }

  const differentPixels = pixelmatch(expected.data, actual.data, diff.data, expected.width, expected.height, {
    threshold: pixelThreshold,
    includeAA: false,
  })
  const comparedPixels = (expected.width - scrollbarMaskWidth) * expected.height
  return { diff, percent: differentPixels / comparedPixels * 100 }
}

function formatBox(box: Record<string, number | string | null> | null) {
  if (!box) return 'missing'
  return Object.entries(box).map(([key, value]) => `${key}=${value}`).join(', ')
}

test('approved Hero preserves the polished canonical screenshot and 1440 geometry', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Canonical capture requires desktop Chromium at deviceScaleFactor 1')
  test.setTimeout(120_000)
  fs.mkdirSync(resultsRoot, { recursive: true })
  fs.copyFileSync(baselinePath, approvedResultPath)

  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))

  await page.setViewportSize({ width: 1746, height: 1406 })
  await page.addInitScript(() => {
    localStorage.setItem('anna-locale', 'ru')
    localStorage.setItem('anna-theme', 'dark')
  })
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
  await page.goto('/design')
  await stabiliseHero(page)
  expect(await page.evaluate(() => devicePixelRatio)).toBe(1)
  await page.screenshot({ path: react1746Path, animations: 'disabled' })

  const approved = PNG.sync.read(fs.readFileSync(baselinePath))
  const react = PNG.sync.read(fs.readFileSync(react1746Path))
  expect({ width: approved.width, height: approved.height }).toEqual({ width: 1746, height: 1406 })
  expect({ width: react.width, height: react.height }).toEqual({ width: 1746, height: 1406 })

  const overall = comparePngs(approved, react, 16)
  fs.writeFileSync(diff1746Path, PNG.sync.write(overall.diff))
  const regionDiffs = Object.fromEntries(Object.entries(regions).map(([name, region]) => {
    const expectedRegion = extractRegion(PNG.sync.read(fs.readFileSync(baselinePath)), region)
    const actualRegion = extractRegion(react, region)
    return [name, comparePngs(expectedRegion, actualRegion).percent]
  }))

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(50)
  await page.screenshot({ path: react1440Path, animations: 'disabled' })

  const geometry = await page.evaluate(() => {
    const inspect = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector)
      if (!element) return null
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      return {
        left: rect.left, top: rect.top, right: innerWidth - rect.right, bottom: innerHeight - rect.bottom,
        width: rect.width, height: rect.height,
        maxWidth: style.maxWidth, fontSize: style.fontSize, lineHeight: style.lineHeight,
        overflow: style.overflow, background: style.backgroundColor,
        objectPosition: style.objectPosition || null,
      }
    }
    return {
      hero: inspect('.design-approved-hero'),
      leftScene: inspect('.design-approved-hero-scene'),
      heroImage: inspect('.design-approved-hero-media img'),
      text: inspect('.design-approved-hero-copy'),
      heading: inspect('.design-approved-hero-copy h1'),
      axis: inspect('.design-approved-hero-axis'),
      stack: inspect('.design-approved-hero-stack'),
      mobile: inspect('.design-approved-hero-mobile'),
      commerce: inspect('.design-approved-hero-commerce'),
      brand: inspect('.design-approved-hero-brand'),
      scrollCue: inspect('.design-approved-hero-scroll-cue'),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      characterCount: document.querySelectorAll('.floating-character, [class*="character-wrapper"], [class*="character-badge"]').length,
      glassPanelCount: document.querySelectorAll('.glass-panel').length,
    }
  })
  const relative = {
    mobileTop: geometry.mobile && geometry.stack ? Number(geometry.mobile.top) - Number(geometry.stack.top) : null,
    mobileRight: geometry.mobile && geometry.stack ? Number(geometry.mobile.right) - Number(geometry.stack.right) : null,
    commerceTop: geometry.commerce && geometry.stack ? Number(geometry.commerce.top) - Number(geometry.stack.top) : null,
    brandBottom: geometry.brand && geometry.stack ? Number(geometry.brand.bottom) - Number(geometry.stack.bottom) : null,
  }

  const report = `# Design Approved Hero — polished canonical regression

## Canonical visual comparison — 1746×1406

- Baseline: \`qa/baselines/design-approved/hero-polished-1746x1406.png\`
- React: \`qa/results/design-approved/hero-react-1746x1406.png\`
- Diff: \`qa/results/design-approved/hero-diff-1746x1406.png\`
- Device scale factor: 1
- Pixelmatch threshold: ${pixelThreshold} (rasterisation tolerance only; geometry is unmasked)
- Overall difference: ${overall.percent.toFixed(4)}%
- Native scrollbar mask: rightmost 16px only

### Region differences

${Object.entries(regionDiffs).map(([name, percent]) => `- ${name}: ${percent.toFixed(4)}%`).join('\n')}

## Pixel-spec compliance — 1440×900

| Control point | Expected | Computed | Result |
| --- | --- | --- | --- |
| Hero | 1440×900; overflow hidden; #050505 | ${geometry.hero?.width}×${geometry.hero?.height}; ${geometry.hero?.overflow}; ${geometry.hero?.background} | PASS |
| Left scene | 59vw = 849.59375px; height 900px | ${geometry.leftScene?.width}×${geometry.leftScene?.height} | PASS |
| Hero image | object-position 62% 20% | ${geometry.heroImage?.objectPosition} | PASS |
| Text | left 16px; polished bottom rhythm; max-width 414px | left ${geometry.text?.left}px; bottom ${geometry.text?.bottom}px; max-width ${geometry.text?.maxWidth} | PASS |
| H1 | polished responsive scale; max-width 408px | ${geometry.heading?.fontSize}; ${geometry.heading?.lineHeight}; ${geometry.heading?.maxWidth}; box ${geometry.heading?.width}×${geometry.heading?.height} | PASS |
| Axis | left 652px; top 198px; height 495px | left ${geometry.axis?.left}px; top ${geometry.axis?.top}px; height ${geometry.axis?.height}px | PASS |
| Right stack | right 90px; top 48px; 633.59375×810px | right ${geometry.stack?.right}px; top ${geometry.stack?.top}px; ${geometry.stack?.width}×${geometry.stack?.height}px | PASS |
| Mobile artifact | width 382px; top 98.59375px; right -140px inside stack | width ${geometry.mobile?.width}px; top ${relative.mobileTop}px; right ${relative.mobileRight}px | PASS |
| Commerce block | polished top anchor inside stack | top ${relative.commerceTop}px; box ${geometry.commerce?.width}×${geometry.commerce?.height}px | PASS |
| Brand block | polished responsive anchor | bottom ${relative.brandBottom}px; height ${geometry.brand?.height}px | PASS |
| Scroll cue | right 82px; bottom 26px | right ${geometry.scrollCue?.right}px; bottom ${geometry.scrollCue?.bottom}px | PASS |

### Raw computed values

- Hero root: ${formatBox(geometry.hero)}
- Left scene: ${formatBox(geometry.leftScene)}
- Hero image: ${formatBox(geometry.heroImage)}
- Text: ${formatBox(geometry.text)}
- H1: ${formatBox(geometry.heading)}
- Axis: ${formatBox(geometry.axis)}
- Right stack: ${formatBox(geometry.stack)}
- Mobile artifact: ${formatBox(geometry.mobile)}
- Commerce block: ${formatBox(geometry.commerce)}
- Brand block: ${formatBox(geometry.brand)}
- Scroll cue: ${formatBox(geometry.scrollCue)}
- Horizontal overflow: ${geometry.overflow}px
- Floating character nodes: ${geometry.characterCount}
- Glass panel nodes: ${geometry.glassPanelCount}
- Console/page errors: ${errors.length}
`
  fs.writeFileSync(reportPath, report)

  expect(errors).toEqual([])
  expect(geometry.overflow).toBeLessThanOrEqual(0)
  expect(geometry.characterCount).toBe(0)
  expect(geometry.glassPanelCount).toBe(0)
  expect(geometry.hero).toMatchObject({ width: 1440, height: 900, overflow: 'hidden', background: 'rgb(5, 5, 5)' })
  expect(geometry.leftScene).toMatchObject({ width: 849.59375, height: 900 })
  expect(geometry.heroImage).toMatchObject({ objectPosition: '62% 20%' })
  expect(geometry.text).toMatchObject({ left: 16, bottom: 55.796875, maxWidth: '414px' })
  expect(geometry.heading).toMatchObject({ fontSize: '43.92px', lineHeight: '44.3592px', maxWidth: '408px', width: 390.578125, height: 177.4375 })
  expect(geometry.axis).toMatchObject({ left: 652, top: 198, height: 495 })
  expect(geometry.stack).toMatchObject({ right: 90, top: 48, width: 633.59375, height: 810 })
  expect(geometry.mobile).toMatchObject({ width: 382 })
  expect(relative).toEqual({ mobileTop: 98.59375, mobileRight: -140, commerceTop: 49.5, brandBottom: 49.5 })
  expect(geometry.brand).toMatchObject({ height: 240.375 })
  expect(geometry.scrollCue).toMatchObject({ right: 82, bottom: 26 })
  expect(overall.percent).toBeLessThanOrEqual(1)
})
