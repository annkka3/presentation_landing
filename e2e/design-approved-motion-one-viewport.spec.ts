import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const screenshotsRoot = path.resolve('qa/results/design-approved/chapter-10-motion')

const desktopViewports = [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 768 },
  { width: 1440, height: 900 },
  { width: 1512, height: 982 },
  { width: 1728, height: 1117 },
  { width: 1920, height: 1080 },
] as const

async function openMotion(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport)
  await page.goto('/design#design-motion')
  const chapter = page.locator('#design-motion')
  await expect(chapter).toBeInViewport()
  await chapter.locator('img').evaluateAll((images) => Promise.all(images.map((image) => {
    if (image.complete) return image.decode?.().catch(() => undefined)
    return new Promise<void>((resolve) => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => resolve(), { once: true })
    })
  })))
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}.design-approved-page{scroll-behavior:auto!important}' })
  await page.waitForTimeout(80)
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('anna-locale', 'ru')
    localStorage.setItem('anna-theme', 'dark')
  })
})

test('Chapter 10 keeps Emotion, Control and Scale in one desktop snap viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Desktop geometry matrix runs once in Chromium')
  test.setTimeout(120_000)
  const reports: Array<{
    viewport: string
    section: { top: number; bottom: number; height: number }
    header: { top: number; bottom: number; height: number }
    emotion: { top: number; bottom: number; height: number }
    control: { top: number; bottom: number; height: number }
    scale: { top: number; bottom: number; height: number }
    nextTop: number
    overflow: number
  }> = []

  for (const viewport of desktopViewports) {
    await openMotion(page, viewport)
    const geometry = await page.evaluate(() => {
      const rect = (selector: string) => {
        const box = document.querySelector<HTMLElement>(selector)!.getBoundingClientRect()
        return { top: box.top, right: box.right, bottom: box.bottom, left: box.left, width: box.width, height: box.height }
      }
      const fit = (selector: string) => {
        const element = document.querySelector<HTMLElement>(selector)!
        return { selector, clientHeight: element.clientHeight, scrollHeight: element.scrollHeight }
      }
      return {
        section: rect('#design-motion'),
        headerStart: rect('#design-motion > .design-approved-motion__thesis'),
        header: rect('#design-motion > .design-approved-chapter-lede'),
        emotion: rect('.design-approved-motion-emotion'),
        control: rect('.design-approved-motion-control'),
        scale: rect('.design-approved-motion-scale'),
        next: rect('#design-principles'),
        fits: [
          fit('.design-approved-motion-emotion'),
          fit('.design-approved-motion-control'),
          fit('.design-approved-motion-scale'),
          fit('.design-approved-motion-control__grid > div:last-child'),
        ],
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }
    })

    expect(geometry.section.height, `${viewport.width}×${viewport.height}: section height`).toBeLessThanOrEqual(viewport.height + 1)
    expect(geometry.header.bottom - geometry.headerStart.top, `${viewport.width}×${viewport.height}: compact header`).toBeLessThanOrEqual(130)
    expect(geometry.emotion.bottom, `${viewport.width}×${viewport.height}: Emotion bottom`).toBeLessThanOrEqual(geometry.section.bottom - 16)
    expect(geometry.control.bottom, `${viewport.width}×${viewport.height}: Control before Scale`).toBeLessThan(geometry.scale.top)
    expect(geometry.scale.bottom, `${viewport.width}×${viewport.height}: Scale bottom`).toBeLessThanOrEqual(geometry.section.bottom - 16)
    expect(geometry.next.top, `${viewport.width}×${viewport.height}: Chapter 11 hidden`).toBeGreaterThanOrEqual(viewport.height - 1)
    expect(geometry.overflow, `${viewport.width}×${viewport.height}: horizontal overflow`).toBeLessThanOrEqual(0)
    for (const fit of geometry.fits) {
      expect(fit.scrollHeight, `${viewport.width}×${viewport.height}: ${fit.selector} is not clipped`).toBeLessThanOrEqual(fit.clientHeight + 1)
    }
    reports.push({
      viewport: `${viewport.width}×${viewport.height}`,
      section: geometry.section,
      header: geometry.header,
      emotion: geometry.emotion,
      control: geometry.control,
      scale: geometry.scale,
      nextTop: geometry.next.top,
      overflow: geometry.overflow,
    })

    const screenshotName = viewport.width === 1440 && viewport.height === 900
      ? 'chapter-10-after-1440x900.png'
      : viewport.width === 1280 && viewport.height === 720
        ? 'chapter-10-after-1280x720.png'
        : viewport.width === 1728 && viewport.height === 1117
          ? 'chapter-10-after-1728x1117.png'
          : null
    if (screenshotName) {
      await page.screenshot({ path: path.join(screenshotsRoot, screenshotName), animations: 'disabled' })
    }
  }

  const table = reports.map((report) => (
    `| ${report.viewport} | ${report.section.height.toFixed(2)} | ${report.header.bottom.toFixed(2)} | `
    + `${report.emotion.top.toFixed(2)}–${report.emotion.bottom.toFixed(2)} | `
    + `${report.control.top.toFixed(2)}–${report.control.bottom.toFixed(2)} | `
    + `${report.scale.top.toFixed(2)}–${report.scale.bottom.toFixed(2)} | `
    + `${report.nextTop.toFixed(2)} | ${report.overflow} |`
  )).join('\n')
  fs.writeFileSync(path.join(screenshotsRoot, 'geometry-report.md'), `# Chapter 10 Motion — desktop geometry

| Viewport | Section height | Header bottom | Emotion top–bottom | Control top–bottom | Scale top–bottom | Chapter 11 top | Overflow |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${table}
`)
})

test('Chapter 10 remains sequential and readable below desktop', async ({ page }) => {
  for (const viewport of [{ width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    await openMotion(page, viewport)
    const blocks = page.locator('#design-motion .design-approved-motion-emotion, #design-motion .design-approved-motion-control, #design-motion .design-approved-motion-scale')
    await expect(blocks).toHaveCount(3)
    const tops = await blocks.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top))
    expect(tops[0]).toBeLessThan(tops[1])
    expect(tops[1]).toBeLessThan(tops[2])
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
  }
})
