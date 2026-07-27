import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const qaRoot = path.resolve(process.cwd(), 'qa')
const baseline = path.join(qaRoot, 'baselines/design-approved/hero-approved-1746x1406.png')
const results = path.join(qaRoot, 'results/design-approved/milestone-d1')

async function prepare(page: Page, theme: 'dark' | 'light' = 'dark') {
  await page.goto('/design')
  await page.evaluate((selectedTheme) => {
    localStorage.setItem('anna-locale', 'ru')
    localStorage.setItem('anna-theme', selectedTheme)
  }, theme)
  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: `
    *,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
    .design-approved-page{scroll-behavior:auto!important}
    .design-approved-hero-media video,.design-approved-motion-poster video{display:none!important}
  ` })
}

async function capture(page: Page, selector: string, file: string) {
  const target = page.locator(selector).first()
  await target.evaluate((element) => element.scrollIntoView({ block: 'start' }))
  await target.locator('img').evaluateAll((images) => Promise.all(images.map((image) => image.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => resolve(), { once: true })
    }))))
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  })
  await page.waitForTimeout(60)
  await page.screenshot({ path: path.join(results, file), animations: 'disabled' })
}

test('capture live canonical Design release matrix and approved Hero diff', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Release matrix is captured once in desktop Chromium')
  test.setTimeout(300_000)
  fs.mkdirSync(results, { recursive: true })

  await page.setViewportSize({ width: 1746, height: 1406 })
  await prepare(page)
  await capture(page, '#design-approved-hero', 'desktop-dark-1746x1406-ch01.png')
  const approved = PNG.sync.read(fs.readFileSync(baseline))
  const actual = PNG.sync.read(fs.readFileSync(path.join(results, 'desktop-dark-1746x1406-ch01.png')))
  const diff = new PNG({ width: approved.width, height: approved.height })
  for (let y = 0; y < approved.height; y += 1) {
    for (let x = approved.width - 16; x < approved.width; x += 1) {
      const offset = (y * approved.width + x) * 4
      approved.data[offset] = actual.data[offset]
      approved.data[offset + 1] = actual.data[offset + 1]
      approved.data[offset + 2] = actual.data[offset + 2]
      approved.data[offset + 3] = actual.data[offset + 3]
    }
  }
  const changed = pixelmatch(approved.data, actual.data, diff.data, approved.width, approved.height, { threshold: .25, includeAA: false })
  const percent = changed / ((approved.width - 16) * approved.height) * 100
  fs.writeFileSync(path.join(results, 'hero-diff-1746x1406.png'), PNG.sync.write(diff))
  fs.writeFileSync(path.join(results, 'hero-live-comparison.md'), `# Live /design Hero comparison

- Canonical baseline: \`qa/baselines/design-approved/hero-approved-1746x1406.png\`
- Live route capture: \`qa/results/design-approved/milestone-d1/desktop-dark-1746x1406-ch01.png\`
- Diff: \`qa/results/design-approved/milestone-d1/hero-diff-1746x1406.png\`
- Pixelmatch threshold: 0.25
- Native scrollbar mask: rightmost 16px
- Overall difference: ${percent.toFixed(4)}%
`)

  const chapters = [
    'design-approved-hero', 'design-directions', 'design-fashion-system', 'design-fashion-pipeline', 'design-brand-systems',
    'design-visual-system', 'design-marketplace', 'design-motion', 'design-principles', 'design-tools',
  ]
  await page.setViewportSize({ width: 1440, height: 900 })
  await prepare(page)
  for (let index = 0; index < chapters.length; index += 1) {
    await capture(page, `#${chapters[index]}`, `desktop-dark-1440x900-ch${String(index + 1).padStart(2, '0')}.png`)
  }

  await page.setViewportSize({ width: 1440, height: 900 })
  await prepare(page, 'light')
  for (const index of [0, 1, 5, 7, 8, 9]) {
    await capture(page, `#${chapters[index]}`, `desktop-light-1440x900-ch${String(index + 1).padStart(2, '0')}.png`)
  }

  await page.setViewportSize({ width: 1440, height: 768 })
  await prepare(page)
  for (const index of [0, 7, 8, 9]) {
    await capture(page, `#${chapters[index]}`, `short-dark-1440x768-ch${String(index + 1).padStart(2, '0')}.png`)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await prepare(page)
  for (const index of [0, 1, 5, 7, 8, 9]) {
    await capture(page, `#${chapters[index]}`, `mobile-dark-390x844-ch${String(index + 1).padStart(2, '0')}.png`)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await prepare(page, 'light')
  for (const index of [0, 5, 9]) {
    await capture(page, `#${chapters[index]}`, `mobile-light-390x844-ch${String(index + 1).padStart(2, '0')}.png`)
  }

  fs.writeFileSync(path.join(results, 'route-and-geometry-report.md'), `# Milestone D1 route and geometry report

- Route under test: \`/design\`
- Canonical root count: 1
- Chapters: 10
- Desktop matrix: Chapters 01–10 at 1440×900 dark
- Light matrix: Chapters 01, 02, 06, 08, 09, 10 at 1440×900
- Short-height matrix: Chapters 01, 08, 09, 10 at 1440×768
- Mobile dark matrix: Chapters 01, 02, 06, 08, 09, 10 at 390×844
- Mobile light matrix: Chapters 01, 06, 10 at 390×844
- Hero approved-baseline difference: ${percent.toFixed(4)}%
`)

  expect(percent).toBeLessThan(1)
})
