import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'

const root = path.resolve(process.cwd(), 'qa')
const results = path.join(root, 'results/design-approved/milestone-c')
const baselines = path.join(root, 'baselines/design-approved/milestone-c')

async function prepare(page: Page, theme: 'dark' | 'light' = 'dark') {
  await page.addInitScript(({ selectedTheme }) => {
    localStorage.setItem('anna-locale', 'ru')
    localStorage.setItem('anna-theme', selectedTheme)
  }, { selectedTheme: theme })
  await page.goto('/design-approved-preview')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: `
    *,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
    .design-approved-page{scroll-behavior:auto!important}
    .design-approved-motion-poster video{display:none!important}
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
  await page.waitForTimeout(60)
  await page.screenshot({ path: path.join(results, file), animations: 'disabled' })
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

test('capture milestone C visual matrix and geometry evidence', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'QA matrix is captured once in Chromium')
  test.setTimeout(240_000)
  fs.mkdirSync(results, { recursive: true })

  await page.setViewportSize({ width: 1440, height: 900 })
  await prepare(page)
  await capture(page, '#design-visual-system', 'desktop-dark-1440x900-ch06.png')
  await capture(page, '#design-marketplace', 'desktop-dark-1440x900-ch07.png')
  await capture(page, '#design-motion', 'desktop-dark-1440x900-ch08.png')
  await capture(page, '#design-principles', 'desktop-dark-1440x900-ch09-principle01.png')
  await page.locator('.design-approved-principles__list button').nth(5).click()
  await capture(page, '#design-principles', 'desktop-dark-1440x900-ch09-principle06.png')
  await page.locator('.design-approved-process__list button').first().click()
  await capture(page, '.design-approved-process', 'desktop-dark-1440x900-ch09-process01.png')
  await page.locator('.design-approved-process__list button').nth(6).click()
  await capture(page, '.design-approved-process', 'desktop-dark-1440x900-ch09-process07.png')
  await capture(page, '.design-approved-tools__content', 'desktop-dark-1440x900-ch10-tools.png')
  await capture(page, '.design-approved-final-cta', 'desktop-dark-1440x900-ch10-cta.png')

  await page.setViewportSize({ width: 1440, height: 900 })
  await prepare(page, 'light')
  for (const [selector, file] of [
    ['#design-visual-system', 'desktop-light-1440x900-ch06.png'],
    ['#design-motion', 'desktop-light-1440x900-ch08.png'],
    ['#design-principles', 'desktop-light-1440x900-ch09.png'],
    ['#design-tools', 'desktop-light-1440x900-ch10.png'],
  ]) await capture(page, selector, file)

  await page.setViewportSize({ width: 1440, height: 768 })
  await prepare(page)
  for (const [selector, file] of [
    ['#design-motion', 'short-dark-1440x768-ch08.png'],
    ['#design-principles', 'short-dark-1440x768-ch09.png'],
    ['#design-tools', 'short-dark-1440x768-ch10.png'],
  ]) await capture(page, selector, file)

  await page.setViewportSize({ width: 390, height: 844 })
  await prepare(page)
  for (const [selector, file] of [
    ['#design-visual-system', 'mobile-dark-390x844-ch06.png'],
    ['#design-marketplace', 'mobile-dark-390x844-ch07.png'],
    ['.design-approved-motion-emotion', 'mobile-dark-390x844-ch08-emotion.png'],
    ['.design-approved-motion-control', 'mobile-dark-390x844-ch08-control.png'],
    ['.design-approved-motion-scale', 'mobile-dark-390x844-ch08-scale.png'],
    ['.design-approved-principles__block', 'mobile-dark-390x844-ch09-principles.png'],
    ['.design-approved-process', 'mobile-dark-390x844-ch09-process.png'],
    ['.design-approved-final-cta', 'mobile-dark-390x844-ch10-cta.png'],
  ]) await capture(page, selector, file)

  await page.setViewportSize({ width: 390, height: 844 })
  await prepare(page, 'light')
  for (const [selector, file] of [
    ['#design-visual-system', 'mobile-light-390x844-ch06.png'],
    ['#design-principles', 'mobile-light-390x844-ch09.png'],
    ['#design-tools', 'mobile-light-390x844-ch10.png'],
  ]) await capture(page, selector, file)

  await page.setViewportSize({ width: 1440, height: 900 })
  await prepare(page)
  const geometry = await page.evaluate(() => {
    const box = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector)
      if (!element) return null
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      return { width: rect.width, height: rect.height, ratio: rect.width / rect.height, display: style.display, columns: style.gridTemplateColumns }
    }
    const root = document.querySelector<HTMLElement>('.design-approved-page')!
    return {
      chapter6Grid: box('.design-approved-production-rail__grid'),
      chapter6Media: box('.design-approved-production-rail__media'),
      chapter7Grid: box('.design-approved-commercial__grid'),
      chapter7Media: box('.design-approved-commercial__media'),
      chapter8Grid: box('.design-approved-motion__grid'),
      chapter8Poster: box('.design-approved-motion-poster'),
      chapter9Principles: box('.design-approved-principles__grid'),
      chapter9Process: box('.design-approved-process__grid'),
      chapter10Grid: box('.design-approved-tools__grid'),
      chapter10Cta: box('.design-approved-final-cta'),
      overflow: root.scrollWidth - root.clientWidth,
    }
  })

  const line = (label: string, expected: string, value: ReturnType<typeof Object> | null) => {
    const item = value as { width: number, height: number, ratio: number, columns: string } | null
    return `| ${label} | ${expected} | ${item ? `${item.width.toFixed(2)}×${item.height.toFixed(2)}` : 'missing'} | ${item?.ratio.toFixed(4) ?? '—'} | ${item?.columns ?? '—'} |`
  }
  fs.writeFileSync(path.join(results, 'geometry-report.md'), `# Milestone C geometry report

Viewport: 1440×900, Chromium, DPR 1.

| Control | Canonical geometry | Computed box | Ratio | Computed columns |
| --- | --- | --- | --- | --- |
${line('Chapter 6 production rail', '4 equal columns', geometry.chapter6Grid)}
${line('Chapter 6 board', '683 / 1000', geometry.chapter6Media)}
${line('Chapter 7 commercial grid', '3 equal columns; 40px gap', geometry.chapter7Grid)}
${line('Chapter 7 cover', '4 / 3', geometry.chapter7Media)}
${line('Chapter 8 outer grid', '5fr / 6fr; 32px gap', geometry.chapter8Grid)}
${line('Chapter 8 Emotion poster', '4 / 5', geometry.chapter8Poster)}
${line('Chapter 9 Principles', '1.15fr / .85fr', geometry.chapter9Principles)}
${line('Chapter 9 Process', '1fr / 1fr', geometry.chapter9Process)}
${line('Chapter 10 Tools', '7fr / 5fr', geometry.chapter10Grid)}
${line('Chapter 10 CTA', 'min-height 42svh; 5.8fr / 6.2fr', geometry.chapter10Cta)}

Horizontal overflow in the Design snap container: ${geometry.overflow}px.
`)

  comparisonBoard(
    path.join(baselines, '07-commercial-cases.png'),
    path.join(results, 'desktop-dark-1440x900-ch07.png'),
    path.join(results, 'comparison-ch07-reference-vs-react.png'),
  )
  fs.writeFileSync(path.join(results, 'reference-source-report.md'), `# Milestone C reference-source report

| Chapter | Canonical evidence | Comparison |
| --- | --- | --- |
| 06 — Visual System | Handoff HTML + pixel-spec | \`comparison-ch06-spec-vs-react.md\`; supplied \`06-visual-system-rail.png\` visibly contains the preceding Luxury/Brand chapter and is not a valid baseline. |
| 07 — Commercial Cases | Handoff HTML + pixel-spec + approved screenshot | \`comparison-ch07-reference-vs-react.png\` |
| 08 — Motion | Handoff HTML + pixel-spec | \`comparison-ch08-spec-vs-react.md\`; supplied \`08-ai-motion.png\` duplicates Chapter 07 and is not a valid Motion baseline. |
| 09 — Principles & Process | Handoff HTML + pixel-spec | \`comparison-ch09-spec-vs-react.md\` |
| 10 — Tools, CTA, Footer | Handoff HTML + pixel-spec | \`comparison-ch10-spec-vs-react.md\` |

Only Chapter 07 has a content-correct approved screenshot in the supplied Chapter 06–10 set. No pixel-diff claim is made for Chapters 06 and 08–10.
`)
  for (const [chapter, controls, captures] of [
    ['06', 'four-column editorial rail; 683/1000 boards; inverse tokens', 'desktop/mobile dark and light'],
    ['08', '5fr/6fr grid; 4/5 poster; Emotion → Control → Scale on mobile', 'desktop, short-height, and three mobile subsections'],
    ['09', 'independent 1.15fr/.85fr and 1fr/1fr state systems', 'principle 01/06 and process 01/07'],
    ['10', '7fr/5fr tools grid; 5.8fr/6.2fr inverse CTA; compact footer', 'tools and CTA in desktop/mobile themes'],
  ]) fs.writeFileSync(path.join(results, `comparison-ch${chapter}-spec-vs-react.md`), `# Chapter ${chapter} — specification comparison

Canonical controls: ${controls}.

React evidence: ${captures}. See \`geometry-report.md\` for computed boxes and grid tracks.
`)

  expect(geometry.overflow).toBeLessThanOrEqual(0)
  expect((geometry.chapter6Media as { ratio: number }).ratio).toBeCloseTo(683 / 1000, 2)
  expect((geometry.chapter7Media as { ratio: number }).ratio).toBeCloseTo(4 / 3, 2)
  expect((geometry.chapter8Poster as { ratio: number }).ratio).toBeCloseTo(4 / 5, 2)
})
