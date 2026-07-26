import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'

const qaRoot = path.resolve(process.cwd(), 'qa')
const resultsRoot = path.join(qaRoot, 'results/design-approved/milestone-b')
const baselinesRoot = path.join(qaRoot, 'baselines/design-approved/milestone-b')

async function stabilise(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.querySelectorAll<HTMLImageElement>('.design-approved-hero img')].map((image) => image.complete ? Promise.resolve() : new Promise<void>((resolve) => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => resolve(), { once: true })
    })))
  })
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.design-approved-page{scroll-behavior:auto!important}' })
}

async function capture(page: Page, selector: string, file: string) {
  await page.locator(selector).evaluate((element) => element.scrollIntoView({ block: 'start' }))
  await page.locator(selector).locator('img').evaluateAll((images) => Promise.all(images.map((image) => image.complete ? Promise.resolve() : new Promise<void>((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true })
    image.addEventListener('error', () => resolve(), { once: true })
  }))))
  await page.waitForTimeout(80)
  await page.screenshot({ path: path.join(resultsRoot, file), animations: 'disabled' })
}

function comparisonBoard(referencePath: string, actualPath: string, outputPath: string) {
  const reference = PNG.sync.read(fs.readFileSync(referencePath))
  const actual = PNG.sync.read(fs.readFileSync(actualPath))
  const gap = 24
  const board = new PNG({ width: reference.width + gap + actual.width, height: Math.max(reference.height, actual.height) })
  board.data.fill(18)
  PNG.bitblt(reference, board, 0, 0, reference.width, reference.height, 0, 0)
  PNG.bitblt(actual, board, 0, 0, actual.width, actual.height, reference.width + gap, 0)
  fs.writeFileSync(outputPath, PNG.sync.write(board))
}

test('capture milestone B matrix, comparison boards and geometry reports', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'QA matrix is captured once in desktop Chromium')
  test.setTimeout(180_000)
  fs.mkdirSync(resultsRoot, { recursive: true })

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design-approved-preview')
  await page.evaluate(() => {
    localStorage.setItem('anna-locale', 'ru')
    localStorage.setItem('anna-theme', 'dark')
  })
  await page.reload()
  await stabilise(page)

  await capture(page, '#design-directions', 'desktop-dark-1440x900-ch02-state01.png')
  await page.locator('#design-direction-4').click()
  await capture(page, '#design-directions', 'desktop-dark-1440x900-ch02-state04.png')
  await capture(page, '#design-fashion-system', 'desktop-dark-1440x900-ch03.png')
  await capture(page, '#design-fashion-pipeline', 'desktop-dark-1440x900-ch04.png')
  await capture(page, '#design-brand-systems', 'desktop-dark-1440x900-ch05.png')

  await page.evaluate(() => localStorage.setItem('anna-theme', 'light'))
  await page.reload()
  await stabilise(page)
  await page.mouse.move(0, 0)
  await page.locator('#design-direction-1').click()
  await capture(page, '#design-directions', 'desktop-light-1440x900-ch02.png')
  await capture(page, '#design-fashion-system', 'desktop-light-1440x900-ch03.png')
  await capture(page, '#design-brand-systems', 'desktop-light-1440x900-ch05.png')

  await page.evaluate(() => localStorage.setItem('anna-theme', 'dark'))
  await page.reload()
  await page.setViewportSize({ width: 1440, height: 768 })
  await stabilise(page)
  for (let chapter = 2; chapter <= 5; chapter += 1) {
    const ids = ['', '', 'design-directions', 'design-fashion-system', 'design-fashion-pipeline', 'design-brand-systems']
    await capture(page, `#${ids[chapter]}`, `short-dark-1440x768-ch0${chapter}.png`)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  for (let chapter = 2; chapter <= 5; chapter += 1) {
    const ids = ['', '', 'design-directions', 'design-fashion-system', 'design-fashion-pipeline', 'design-brand-systems']
    await capture(page, `#${ids[chapter]}`, `mobile-dark-390x844-ch0${chapter}.png`)
  }

  const geometry = await page.setViewportSize({ width: 1440, height: 900 }).then(async () => {
    await page.reload()
    await stabilise(page)
    return page.evaluate(() => {
      const box = (selector: string) => {
        const element = document.querySelector<HTMLElement>(selector)
        if (!element) return null
        const rect = element.getBoundingClientRect()
        return { width: rect.width, height: rect.height, ratio: rect.width / rect.height }
      }
      return {
        chapter2Preview: box('.design-approved-media-frame'),
        chapter3Carousel: box('.design-approved-carousel'),
        chapter4Pipeline: box('.design-approved-pipeline__lead-media'),
        chapter4AB: box('.design-approved-pipeline__ab-media'),
        chapter5Eufashion: box('.design-approved-brand-systems__feature-media'),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }
    })
  })

  const reportIntro = '# Milestone B geometry report\n\nViewport: 1440×900, Chromium, DPR 1.\n\n'
  const rows = [
    ['Chapter 2 preview', '5 / 4', geometry.chapter2Preview],
    ['Chapter 3 carousel', '1402 / 1122', geometry.chapter3Carousel],
    ['Chapter 4 pipeline', '1536 / 1024', geometry.chapter4Pipeline],
    ['Chapter 4 A/B', '1 / 1', geometry.chapter4AB],
    ['Chapter 5 Eufashion', '1000 / 588', geometry.chapter5Eufashion],
  ] as const
  const table = '| Control | Expected ratio | Computed box | Computed ratio |\n| --- | --- | --- | --- |\n'
    + rows.map(([name, expected, value]) => `| ${name} | ${expected} | ${value?.width}×${value?.height} | ${value?.ratio.toFixed(4)} |`).join('\n')
  fs.writeFileSync(path.join(resultsRoot, 'geometry-report.md'), `${reportIntro}${table}\n\nHorizontal overflow: ${geometry.overflow}px.\n`)

  const comparisons = [
    ['04-ai-pipeline.png', 'desktop-dark-1440x900-ch03.png', 'comparison-ch03-reference-vs-react.png'],
    ['05-eufashion-brand.png', 'desktop-dark-1440x900-ch04.png', 'comparison-ch04-reference-vs-react.png'],
  ] as const
  for (const [reference, actual, output] of comparisons) {
    comparisonBoard(path.join(baselinesRoot, reference), path.join(resultsRoot, actual), path.join(resultsRoot, output))
  }
  fs.writeFileSync(path.join(resultsRoot, 'reference-source-report.md'), `# Milestone B reference-source report

| Chapter | Canonical source used | Comparison artifact |
| --- | --- | --- |
| 02 — Design Directions | \`pixel-spec.md\` and handoff HTML | No valid chapter screenshot: supplied \`02-directions.png\` contains the mobile Hero. |
| 03 — Marketplace Visual System | Handoff HTML + supplied \`04-ai-pipeline.png\` (its visible content is Chapter 03) | \`comparison-ch03-reference-vs-react.png\` |
| 04 — AI Fashion Pipeline | Handoff HTML + supplied \`05-eufashion-brand.png\` (its visible content is Chapter 04) | \`comparison-ch04-reference-vs-react.png\` |
| 05 — Eufashion + Brand Systems | \`pixel-spec.md\` and handoff HTML | No valid chapter screenshot in the package. |

The source filenames are preserved unchanged under \`qa/baselines/design-approved/milestone-b/\` for auditability.
`)
  fs.writeFileSync(path.join(resultsRoot, 'comparison-ch02-spec-vs-react.md'), `# Chapter 02 — pixel-spec comparison board

| Pixel-spec control | Expected | Implementation |
| --- | --- | --- |
| Section | min-height 100svh; centered | Captured at 1440×900 |
| Grid | 1fr / 1fr | ${geometry.chapter2Preview?.width}px preview width |
| Preview | 5 / 4 | ${geometry.chapter2Preview?.ratio.toFixed(4)} |
| State coverage | 01 initial + 04 active | \`desktop-dark-1440x900-ch02-state01.png\`, \`desktop-dark-1440x900-ch02-state04.png\` |

The supplied \`02-directions.png\` is a mobile Hero capture and is not used as a Chapter 02 visual baseline.
`)
  fs.writeFileSync(path.join(resultsRoot, 'comparison-ch05-spec-vs-react.md'), `# Chapter 05 — pixel-spec comparison board

| Pixel-spec control | Expected | Implementation |
| --- | --- | --- |
| Feature grid | 8fr / 4fr | Captured at 1440×900 |
| Eufashion media | 1000 / 588; contain | ${geometry.chapter5Eufashion?.ratio.toFixed(4)} |
| Supporting grid | 7.5fr / 4.5fr; asymmetric | Maison Noiree dominant; Portfolio supporting |
| Screenshot | required | \`desktop-dark-1440x900-ch05.png\` |

No valid Chapter 05 screenshot exists in the supplied package, so HTML and pixel-spec geometry are canonical.
`)

  expect(geometry.overflow).toBeLessThanOrEqual(0)
  expect(geometry.chapter2Preview?.ratio).toBeCloseTo(5 / 4, 2)
  expect(geometry.chapter3Carousel?.ratio).toBeCloseTo(1402 / 1122, 2)
  expect(geometry.chapter4Pipeline?.ratio).toBeCloseTo(1536 / 1024, 2)
  expect(geometry.chapter4AB?.ratio).toBeCloseTo(1, 2)
  expect(geometry.chapter5Eufashion?.ratio).toBeCloseTo(1000 / 588, 2)
})
