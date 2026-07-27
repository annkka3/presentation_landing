import { expect, test, type Page } from '@playwright/test'
import path from 'node:path'

const results = path.resolve('qa/results/design-approved/visual-polish')

const characterSelector = [
  '.floating-character',
  '.pixel-character',
  '.site-character',
  '.mascot',
  '[data-floating-character]',
  '[data-character="pixel"]',
  '[class*="character-wrapper"]',
  '[class*="character-badge"]',
].join(',')

const collisionPairs = [
  ['.design-approved-directions__list', '.design-approved-directions__preview'],
  ['.design-approved-carousel', '.design-approved-case-caption'],
  ['.design-approved-pipeline__lead', '.design-approved-pipeline__ab'],
  ['.design-approved-brand-systems__feature-media', '.design-approved-brand-systems__feature > div:last-child'],
  ['.design-approved-motion-emotion', '.design-approved-motion__right'],
  ['.design-approved-principles__active', '.design-approved-principles__list'],
  ['.design-approved-process__list', '.design-approved-process__detail'],
  ['.design-approved-tools__grid > div:first-child', '.design-approved-tools__groups'],
  ['.design-approved-final-cta h2', '.design-approved-final-cta > div > div'],
] as const

async function setMode(page: Page, locale: 'ru' | 'en', theme: 'dark' | 'light') {
  await page.addInitScript(({ nextLocale, nextTheme }) => {
    if (!localStorage.getItem('anna-locale')) localStorage.setItem('anna-locale', nextLocale)
    if (!localStorage.getItem('anna-theme')) localStorage.setItem('anna-theme', nextTheme)
  }, { nextLocale: locale, nextTheme: theme })
}

async function prepareChapter(page: Page, selector: string) {
  const target = page.locator(selector)
  await target.scrollIntoViewIfNeeded()
  await target.evaluate(async (section) => {
    const images = [...section.querySelectorAll<HTMLImageElement>('img')]
    await Promise.all(images.map((image) => {
      if (!image.complete) {
        return new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true })
          image.addEventListener('error', () => resolve(), { once: true })
        })
      }
      return image.decode?.().catch(() => undefined)
    }))
  })
  await page.waitForTimeout(120)
}

async function capture(page: Page, selector: string, name: string) {
  await prepareChapter(page, selector)
  await page.screenshot({ path: path.join(results, name), animations: 'disabled' })
}

test('polish matrix has no overflow, collisions, broken media or character nodes', async ({ page }) => {
  const runtimeErrors: string[] = []
  const failedRequests: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text())
  })
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  page.on('requestfailed', (request) => {
    const intentionallyAborted = request.failure()?.errorText.includes('ERR_ABORTED')
    if (request.url().startsWith('http://127.0.0.1:4173') && !intentionallyAborted) {
      failedRequests.push(`${request.method()} ${request.url()}`)
    }
  })
  await setMode(page, 'ru', 'dark')

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1512, height: 982 },
    { width: 1728, height: 1117 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/design')
    await expect(page.locator('.design-approved-page')).toBeVisible()
    expect(await page.locator(characterSelector).count()).toBe(0)
    expect(await page.locator('.design-approved-page').evaluate((root) => root.scrollWidth - root.clientWidth)).toBeLessThanOrEqual(0)

    for (const [leftSelector, rightSelector] of collisionPairs) {
      const overlap = await page.evaluate(({ leftSelector, rightSelector }) => {
        const left = document.querySelector(leftSelector)?.getBoundingClientRect()
        const right = document.querySelector(rightSelector)?.getBoundingClientRect()
        if (!left || !right) return 0
        const width = Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left))
        const height = Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top))
        return width * height
      }, { leftSelector, rightSelector })
      expect(overlap, `${viewport.width}×${viewport.height}: ${leftSelector} overlaps ${rightSelector}`).toBe(0)
    }
  }

  await page.evaluate((selector) => {
    const character = document.createElement('div')
    character.className = 'floating-character'
    character.dataset.testCharacter = 'true'
    document.body.append(character)
    if (!selector) throw new Error('Missing selector')
  }, characterSelector)
  await expect(page.locator('[data-test-character="true"]')).toHaveCount(0)

  for (const mode of [
    { locale: 'ru', theme: 'dark' },
    { locale: 'ru', theme: 'light' },
    { locale: 'en', theme: 'dark' },
    { locale: 'en', theme: 'light' },
  ] as const) {
    await page.evaluate(({ locale, theme }) => {
      localStorage.setItem('anna-locale', locale)
      localStorage.setItem('anna-theme', theme)
    }, mode)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', mode.locale)
    await expect(page.locator('html')).toHaveAttribute('data-theme', mode.theme)
    expect(await page.locator('.design-approved-page').evaluate((root) => root.scrollWidth - root.clientWidth)).toBeLessThanOrEqual(0)
  }

  await page.goto('/design#design-motion')
  await expect(page.locator('#design-motion')).toBeInViewport()
  await expect.poll(() => page.locator('.design-approved-chapter-rail__current').textContent()).toBe('08')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await expect(page.locator('.design-approved-page')).toHaveCSS('scroll-snap-type', 'none')
  await expect(page.locator('.design-approved-motion-poster > img')).toBeVisible()

  expect(runtimeErrors).toEqual([])
  expect(failedRequests).toEqual([])
})

test('captures the approved visual-polish evidence set', async ({ page }) => {
  await setMode(page, 'ru', 'dark')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design')

  for (const [selector, name] of [
    ['#design-approved-hero', 'desktop-1440x900-01-hero.png'],
    ['#design-directions', 'desktop-1440x900-02-directions.png'],
    ['#design-fashion-system', 'desktop-1440x900-03-fashion-visual-system.png'],
    ['#design-marketplace', 'desktop-1440x900-04-marketplace-cases.png'],
    ['#design-visual-system', 'desktop-1440x900-05-visual-system-process.png'],
    ['#design-motion', 'desktop-1440x900-08-motion.png'],
    ['#design-principles', 'desktop-1440x900-09-principles-process.png'],
    ['#design-tools', 'desktop-1440x900-10-tools-cta.png'],
  ] as const) await capture(page, selector, name)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/design')
  for (const [selector, name] of [
    ['#design-approved-hero', 'mobile-390x844-01-hero.png'],
    ['#design-directions', 'mobile-390x844-02-directions.png'],
    ['#design-motion', 'mobile-390x844-08-motion.png'],
    ['.design-approved-final-cta', 'mobile-390x844-10-cta.png'],
  ] as const) await capture(page, selector, name)
})

test('hero commerce and brand panels keep a controlled responsive overlap', async ({ page }) => {
  await setMode(page, 'ru', 'dark')

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1512, height: 982 },
    { width: 1728, height: 1117 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/design')
    await expect(page.locator('.design-approved-hero-commerce__card')).toBeVisible()
    await expect(page.locator('.design-approved-hero-brand__card')).toBeVisible()
    await expect(page.locator('.design-approved-hero-mobile')).toBeVisible()
    const geometry = await page.evaluate(() => {
      const commerce = document.querySelector<HTMLElement>('.design-approved-hero-commerce__card')!.getBoundingClientRect()
      const brand = document.querySelector<HTMLElement>('.design-approved-hero-brand__card')!.getBoundingClientRect()
      const phone = document.querySelector<HTMLElement>('.design-approved-hero-mobile')!.getBoundingClientRect()
      const root = document.querySelector<HTMLElement>('.design-approved-page')!
      return {
        panelOverlap: commerce.bottom - brand.top,
        phoneOverCommerce: phone.left < commerce.right && phone.right > commerce.left,
        overflow: root.scrollWidth - root.clientWidth,
      }
    })

    expect(geometry.panelOverlap).toBeGreaterThanOrEqual(-14)
    expect(geometry.panelOverlap).toBeLessThanOrEqual(14)
    expect(geometry.phoneOverCommerce).toBe(true)
    expect(geometry.overflow).toBeLessThanOrEqual(0)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/design')
  await expect(page.locator('.design-approved-hero-commerce')).toHaveCSS('position', 'static')
  await expect(page.locator('.design-approved-hero-brand')).toHaveCSS('position', 'static')
})
