import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('anna-locale', 'ru')
    localStorage.setItem('anna-theme', 'dark')
  })
})

test('chapters 2–5 expose the approved structure and exact content', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design')

  await expect(page.getByText('01 / 10')).toBeVisible()
  await expect(page.locator('[data-chapter]')).toHaveCount(10)
  for (const id of ['design-directions', 'design-fashion-system', 'design-fashion-pipeline', 'design-brand-systems']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
  await expect(page.locator('#design-directions h2')).toHaveText('Направления дизайна')
  await expect(page.locator('#design-fashion-system')).toContainText('Визуальная система для fashion-бренда')
  await expect(page.locator('#design-fashion-pipeline')).toContainText('AI-Assisted Fashion Production Pipeline')
  await expect(page.locator('#design-fashion-pipeline')).toContainText('Период теста — 14 дней')
  await expect(page.locator('#design-fashion-pipeline')).not.toContainText(/CTR|conversion|побед|uplift/i)
  await expect(page.locator('#design-brand-systems')).toContainText('Eufashion Glasses — Luxury E-commerce System')
  await expect(page.locator('#design-brand-systems')).toContainText('Maison Noiree')
  await expect(page.locator('#design-brand-systems')).toContainText('Anna Gromyko Portfolio')
  await expect(page.locator('.floating-character, .glass-panel, [class*="character-wrapper"], [class*="character-badge"]')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('design directions are semantic and support pointer plus keyboard state changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design#design-directions')
  const directions = page.locator('.design-approved-directions__list button')

  await expect(directions).toHaveCount(5)
  await expect(directions.nth(0)).toHaveAttribute('aria-pressed', 'true')
  await expect(directions.nth(0)).toHaveAttribute('aria-selected', 'true')
  await expect(directions.nth(0)).toHaveAttribute('aria-expanded', 'true')
  await expect(directions.nth(0)).toHaveAttribute('aria-controls', 'design-direction-preview')
  await expect(directions.nth(0).locator('.design-approved-direction-copy small')).toHaveText(
    'User flows, информационная архитектура, responsive UX, компоненты и состояния продукта.',
  )
  await expect(directions.nth(0).locator('.design-approved-direction-copy small')).toBeVisible()
  await expect(page.locator('.design-approved-directions__preview')).not.toContainText(
    'User flows, информационная архитектура',
  )
  await expect(page.locator('.design-approved-directions__preview img')).toHaveAttribute('src', /case-anna-gromyko-portfolio/)
  await directions.nth(3).click()
  await expect(directions.nth(3)).toHaveAttribute('aria-pressed', 'true')
  await expect(directions.nth(3)).toHaveAttribute('aria-expanded', 'true')
  await expect(directions.nth(0)).toHaveAttribute('aria-expanded', 'false')
  await expect(directions.nth(3).locator('.design-approved-direction-copy small')).toHaveText(
    'Айдентика, типографика, цвет, кампании и визуальная система бренда для всех каналов.',
  )
  await expect(page.locator('.design-approved-directions__preview img')).toHaveAttribute('src', /case-the-dao-way/)
  await expect(page.locator('.design-approved-outcome')).toHaveText('ОТ ИДЕИ К УЗНАВАЕМОМУ ЯЗЫКУ')

  await page.mouse.move(0, 0)
  await directions.nth(3).press('ArrowDown')
  await expect(directions.nth(4)).toBeFocused()
  await expect(directions.nth(4)).toHaveAttribute('aria-pressed', 'true')
  await directions.nth(4).press('Home')
  await expect(directions.nth(0)).toBeFocused()

  const geometry = await page.evaluate(() => {
    const frame = document.querySelector<HTMLElement>('.design-approved-media-frame')!.getBoundingClientRect()
    const active = document.querySelector<HTMLElement>('.design-approved-directions__list button.is-active')!
    return {
      ratio: frame.width / frame.height,
      activeClass: active.classList.contains('is-active'),
    }
  })
  expect(geometry.ratio).toBeCloseTo(1.25, 2)
  expect(geometry.activeClass).toBe(true)
  await expect(directions.nth(0)).toHaveCSS('opacity', '1')
  await expect(directions.nth(0)).toHaveCSS('padding-top', '20px')
  await expect(page.locator('#design-directions')).toHaveCSS('outline-style', 'none')
})

test('lookbook carousel loops, has no autoplay, and supports controls, dots, keyboard and swipe', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design#design-fashion-system')
  const carousel = page.locator('.design-approved-carousel')
  const image = carousel.locator('> img')

  await expect(carousel.locator('.design-approved-carousel__dots button')).toHaveCount(6)
  await expect(image).toHaveAttribute('src', /case1-cover/)
  await page.waitForTimeout(700)
  await expect(image).toHaveAttribute('src', /case1-cover/)

  await carousel.getByRole('button', { name: 'Предыдущий разворот' }).click()
  await expect(image).toHaveAttribute('src', /lookbook-5/)
  await carousel.press('ArrowRight')
  await expect(image).toHaveAttribute('src', /case1-cover/)
  await carousel.getByRole('button', { name: 'Разворот 4' }).click()
  await expect(image).toHaveAttribute('src', /lookbook-3/)

  await carousel.evaluate((element) => {
    const start = new Touch({ identifier: 1, target: element, clientX: 300, clientY: 100 })
    const end = new Touch({ identifier: 1, target: element, clientX: 220, clientY: 100 })
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [start] }))
    element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [end] }))
  })
  await expect(image).toHaveAttribute('src', /lookbook-4/)
  await expect(page.locator('#design-fashion-system a')).toHaveAttribute('href', '/projects/marketplace-visual-systems')
})

test('chapter geometry, routes, rail availability, hash navigation and theme are correct', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design#design-fashion-pipeline')
  await expect(page.locator('#design-fashion-pipeline')).toBeInViewport()

  const geometry = await page.evaluate(() => {
    const ratio = (selector: string) => {
      const box = document.querySelector<HTMLElement>(selector)!.getBoundingClientRect()
      return box.width / box.height
    }
    return {
      pipeline: ratio('.design-approved-pipeline__lead-media'),
      ab: ratio('.design-approved-pipeline__ab-media'),
      eufashion: ratio('.design-approved-brand-systems__feature-media'),
      snap: getComputedStyle(document.querySelector('.design-approved-page')!).scrollSnapType,
    }
  })
  expect(geometry.pipeline).toBeCloseTo(1.5, 2)
  expect(geometry.ab).toBeCloseTo(1, 2)
  expect(geometry.eufashion).toBeCloseTo(1000 / 588, 2)
  expect(geometry.snap).toBe('y mandatory')

  const railButtons = page.locator('.design-approved-chapter-rail__track button')
  await expect(railButtons).toHaveCount(10)
  for (let index = 0; index < 10; index += 1) await expect(railButtons.nth(index)).toBeEnabled()
  await railButtons.nth(4).click()
  await expect(page).toHaveURL(/#design-brand-systems$/)
  await expect(page.locator('#design-brand-systems')).toBeInViewport()
  await expect.poll(() => page.locator('.design-approved-chapter-rail__current').textContent()).toBe('05')

  await expect(page.locator('.design-approved-brand-systems__feature')).toHaveAttribute('href', '/projects/eufashion-glasses')
  await expect(page.locator('.design-approved-brand-systems__grid a').nth(0)).toHaveAttribute('href', '/cases/the-dao-way')

  await railButtons.nth(0).click()
  await expect.poll(() => page.locator('.design-approved-page').evaluate((element) => Math.round(element.scrollTop))).toBe(0)
  await page.getByRole('button', { name: 'Переключить тему' }).click()
  await railButtons.nth(1).click()
  await expect(page.locator('#design-directions')).toHaveCSS('background-color', 'rgb(244, 241, 235)')
  await expect(page.locator('#design-directions')).toHaveCSS('color', 'rgb(24, 23, 20)')
  await railButtons.nth(0).click()
  await expect.poll(() => page.locator('.design-approved-page').evaluate((element) => Math.round(element.scrollTop))).toBe(0)
  await page.getByRole('button', { name: 'EN' }).click()
  await railButtons.nth(1).click()
  await expect(page.locator('#design-directions h2')).toHaveText('Design capabilities')
})

test('mobile chapters stack without horizontal overflow and reduced motion disables snap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/design#design-directions')
  await expect(page.locator('.design-approved-chapter-rail')).toBeHidden()
  await expect(page.locator('.design-approved-directions__grid')).toHaveCSS('grid-template-columns', '354px')
  await expect(page.locator('.design-approved-pipeline__grid')).toHaveCSS('grid-template-columns', '354px')
  await expect(page.locator('.design-approved-brand-systems__grid')).toHaveCSS('grid-template-columns', '354px')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await expect(page.locator('.design-approved-page')).toHaveCSS('scroll-snap-type', 'none')
})

test('responsive matrix and page keyboard navigation do not trap or overflow', async ({ page }) => {
  for (const viewport of [
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
    { width: 1024, height: 768 },
    { width: 430, height: 932 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/design#design-directions')
    await expect(page.locator('.design-approved-page')).toHaveCount(1)
    const overflow = await page.evaluate(() => {
      const main = document.querySelector<HTMLElement>('.design-approved-page')!
      return Math.max(document.documentElement.scrollWidth - document.documentElement.clientWidth, main.scrollWidth - main.clientWidth)
    })
    expect(overflow).toBeLessThanOrEqual(0)
  }

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design')
  await page.locator('.design-approved-page').click({ position: { x: 700, y: 850 } })
  await page.keyboard.press('PageDown')
  await expect(page).toHaveURL(/#design-directions$/)
  await page.keyboard.press('PageDown')
  await expect(page).toHaveURL(/#design-fashion-system$/)
  await page.keyboard.press('PageUp')
  await expect(page).toHaveURL(/#design-directions$/)
  await page.keyboard.press('Home')
  await expect(page).toHaveURL(/#design-approved-hero$/)
})
