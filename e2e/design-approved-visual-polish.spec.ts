import { expect, test, type Page } from '@playwright/test'
import path from 'node:path'

const results = path.resolve('qa/results/design-approved/visual-polish')
const heroHeaderResults = path.resolve('qa/results/design-approved/hero-header-alignment')

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

test('hero header and artifact anchors remain aligned across the viewport matrix', async ({ page }) => {
  test.setTimeout(60_000)
  await setMode(page, 'ru', 'dark')

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1512, height: 820 },
    { width: 1512, height: 982 },
    { width: 1680, height: 900 },
    { width: 1728, height: 930 },
    { width: 1728, height: 1117 },
    { width: 1746, height: 1406 },
    { width: 1920, height: 1000 },
    { width: 2048, height: 1107 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/design')
    await expect(page.locator('.design-approved-hero-brand__card')).toBeVisible()

    const geometry = await page.evaluate(() => {
      const rect = (selector: string) => {
        const element = document.querySelector<HTMLElement>(selector)
        if (!element) return null
        const box = element.getBoundingClientRect()
        return { left: box.left, right: box.right, top: box.top, bottom: box.bottom }
      }
      return {
        scene: rect('.design-approved-hero-scene'),
        brandmark: rect('.design-approved-hero-brandmark'),
        eyebrow: rect('.design-approved-hero-eyebrow'),
        analytics: rect('.design-approved-hero-nav__light a[href="/#analytics"]'),
        contact: rect('.design-approved-hero-nav__contact'),
        controls: rect('.design-approved-hero-controls'),
        rail: rect('.design-approved-chapter-rail'),
        stack: rect('.design-approved-hero-stack'),
        phone: rect('.design-approved-hero-mobile'),
        brandLabel: rect('.design-approved-hero-brand .design-approved-hero-stack-label b'),
        resumeCount: document.querySelectorAll('.design-approved-hero-resume, #design-approved-resume-status').length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }
    })

    expect(geometry.scene).not.toBeNull()
    expect(geometry.brandmark).not.toBeNull()
    expect(geometry.eyebrow).not.toBeNull()
    expect(geometry.analytics).not.toBeNull()
    expect(geometry.contact).not.toBeNull()
    expect(geometry.controls).not.toBeNull()
    expect(geometry.rail).not.toBeNull()
    expect(geometry.stack).not.toBeNull()
    expect(geometry.phone).not.toBeNull()
    expect(geometry.brandLabel).not.toBeNull()
    if (!geometry.scene || !geometry.brandmark || !geometry.eyebrow || !geometry.analytics
      || !geometry.contact || !geometry.controls || !geometry.rail || !geometry.stack
      || !geometry.phone || !geometry.brandLabel) continue

    expect(Math.abs(geometry.brandmark.left - geometry.eyebrow.left)).toBeLessThanOrEqual(.5)
    expect(geometry.analytics.right).toBeLessThanOrEqual(geometry.scene.right - 12)
    expect(geometry.contact.left).toBeGreaterThanOrEqual(geometry.scene.right + 12)
    expect(Math.abs(geometry.controls.right - geometry.rail.right)).toBeLessThanOrEqual(.5)
    expect(geometry.phone.right - geometry.stack.right).toBeCloseTo(112, 0)
    expect(geometry.phone.top).toBeGreaterThan(geometry.stack.top + 100)
    expect(geometry.brandLabel.right).toBeLessThanOrEqual(geometry.phone.left)
    expect(geometry.resumeCount).toBe(0)
    expect(geometry.overflow).toBeLessThanOrEqual(0)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/design')
  await expect(page.locator('.design-approved-hero-brandmark')).toBeVisible()
  await expect(page.locator('.design-approved-hero-eyebrow')).toBeVisible()
  const mobileAlignment = await page.evaluate(() => {
    const brandmark = document.querySelector<HTMLElement>('.design-approved-hero-brandmark')!.getBoundingClientRect()
    const eyebrow = document.querySelector<HTMLElement>('.design-approved-hero-eyebrow')!.getBoundingClientRect()
    return {
      delta: Math.abs(brandmark.left - eyebrow.left),
      resumeCount: document.querySelectorAll('.design-approved-hero-resume, #design-approved-resume-status').length,
    }
  })
  expect(mobileAlignment.delta).toBeLessThanOrEqual(.5)
  expect(mobileAlignment.resumeCount).toBe(0)
})

test('captures the hero header alignment viewport matrix', async ({ page }) => {
  test.setTimeout(90_000)
  await setMode(page, 'ru', 'dark')

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1512, height: 820 },
    { width: 1512, height: 982 },
    { width: 1680, height: 900 },
    { width: 1728, height: 930 },
    { width: 1728, height: 1117 },
    { width: 1746, height: 1406 },
    { width: 1920, height: 1000 },
    { width: 2048, height: 1107 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/design')
    await expect(page.locator('.design-approved-hero-brandmark')).toBeVisible()
    await prepareChapter(page, '#design-approved-hero')
    await page.screenshot({
      path: path.join(heroHeaderResults, `ru-dark-${viewport.width}x${viewport.height}.png`),
      animations: 'disabled',
    })
  }

  for (const variant of [
    { locale: 'en', theme: 'dark', width: 1440, height: 900 },
    { locale: 'en', theme: 'light', width: 1746, height: 1406 },
    { locale: 'en', theme: 'light', width: 390, height: 844 },
  ] as const) {
    await page.setViewportSize({ width: variant.width, height: variant.height })
    await page.goto('/design')
    await page.evaluate(({ locale, theme }) => {
      localStorage.setItem('anna-locale', locale)
      localStorage.setItem('anna-theme', theme)
    }, variant)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', variant.locale)
    await expect(page.locator('html')).toHaveAttribute('data-theme', variant.theme)
    await prepareChapter(page, '#design-approved-hero')
    await page.screenshot({
      path: path.join(
        heroHeaderResults,
        `${variant.locale}-${variant.theme}-${variant.width}x${variant.height}.png`,
      ),
      animations: 'disabled',
    })
  }
})

test('hero commerce and brand panels keep a controlled responsive relationship', async ({ page }) => {
  test.setTimeout(60_000)
  await setMode(page, 'ru', 'dark')

  const regressionViewports = [
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1512, height: 982 },
    { width: 1728, height: 1117 },
    { width: 1746, height: 1406 },
  ]

  for (const viewport of regressionViewports) {
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
        panelGap: brand.top - commerce.bottom,
        phoneOverCommerce: phone.left < commerce.right && phone.right > commerce.left,
        overflow: root.scrollWidth - root.clientWidth,
      }
    })

    expect(geometry.panelGap).toBeGreaterThanOrEqual(16)
    expect(geometry.phoneOverCommerce).toBe(true)
    expect(geometry.overflow).toBeLessThanOrEqual(0)
  }

  for (const viewport of [
    { width: 2048, height: 1107 },
    { width: 1920, height: 1000 },
    { width: 1728, height: 930 },
    { width: 1680, height: 900 },
    { width: 1512, height: 820 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/design')
    const hero = page.locator('#design-approved-hero')
    const commerce = page.locator('.design-approved-hero-commerce__card')
    const brand = page.locator('.design-approved-hero-brand__card')
    const phone = page.locator('.design-approved-hero-mobile')
    const brandLabel = page.locator('.design-approved-hero-brand .design-approved-hero-stack-label b')
    const scrollCue = page.locator('.design-approved-hero-scroll-cue')
    await expect(commerce).toBeVisible()
    await expect(brand).toBeVisible()
    await expect(phone).toBeVisible()

    const [heroBox, commerceBox, brandBox, phoneBox, brandLabelBox, scrollCueBox] = await Promise.all([
      hero.boundingBox(),
      commerce.boundingBox(),
      brand.boundingBox(),
      phone.boundingBox(),
      brandLabel.boundingBox(),
      scrollCue.boundingBox(),
    ])
    expect(heroBox).not.toBeNull()
    expect(commerceBox).not.toBeNull()
    expect(brandBox).not.toBeNull()
    expect(phoneBox).not.toBeNull()
    expect(brandLabelBox).not.toBeNull()
    expect(scrollCueBox).not.toBeNull()
    if (!heroBox || !commerceBox || !brandBox || !phoneBox || !brandLabelBox || !scrollCueBox) continue

    expect(brandBox.y).toBeGreaterThanOrEqual(commerceBox.y + commerceBox.height + 16)
    expect(commerceBox.y).toBeGreaterThanOrEqual(heroBox.y)
    expect(commerceBox.y + commerceBox.height).toBeLessThanOrEqual(heroBox.y + heroBox.height)
    expect(brandBox.y).toBeGreaterThanOrEqual(heroBox.y)
    expect(brandBox.y + brandBox.height).toBeLessThanOrEqual(heroBox.y + heroBox.height)
    expect(phoneBox.y + phoneBox.height).toBeLessThanOrEqual(heroBox.y + heroBox.height)
    expect(brandBox.height).toBeGreaterThanOrEqual(viewport.height * .24)
    expect(brandLabelBox.x + brandLabelBox.width).toBeLessThanOrEqual(phoneBox.x)
    expect(Math.min(brandBox.y + brandBox.height, scrollCueBox.y + scrollCueBox.height)
      - Math.max(brandBox.y, scrollCueBox.y)).toBeLessThanOrEqual(0)
    expect(await page.locator('.design-approved-page').evaluate((root) => root.scrollWidth - root.clientWidth)).toBeLessThanOrEqual(0)
  }

  for (const route of [
    '/design',
    '/design#main',
    '/design#design-motion',
    '/design?mode=qa',
    '/design?mode=qa#design-motion',
  ]) {
    await page.goto(route)
    await expect(page.locator(characterSelector)).toHaveCount(0)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/design')
  await expect(page.locator('.design-approved-hero-commerce')).toHaveCSS('position', 'static')
  await expect(page.locator('.design-approved-hero-brand')).toHaveCSS('position', 'static')
})
