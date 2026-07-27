import { expect, test, type Page } from '@playwright/test'

async function openCanonicalDesign(page: Page, hash = '') {
  await page.addInitScript(() => {
    if (!localStorage.getItem('anna-locale')) localStorage.setItem('anna-locale', 'ru')
    if (!localStorage.getItem('anna-theme')) localStorage.setItem('anna-theme', 'dark')
  })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`/design${hash}`)
  await expect(page.locator('.design-approved-page')).toBeVisible()
}

test('chapters 8 and 9 preserve approved editorial structures and honest claims', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  await openCanonicalDesign(page, '#design-visual-system')

  await expect(page.locator('[data-chapter]')).toHaveCount(12)
  await expect(page.locator('#design-visual-system')).toBeInViewport()
  await expect(page.locator('.design-approved-production-rail article')).toHaveCount(4)
  await expect(page.locator('.design-approved-production-rail article').nth(0)).toContainText('01 SOURCE')
  await expect(page.locator('.design-approved-production-rail article').nth(3)).toContainText('04 SYSTEM')
  await page.getByRole('button', { name: /8: Система/ }).click()
  await expect.poll(() => page.locator('.design-approved-chapter-rail__current').textContent()).toBe('08')

  await page.getByRole('button', { name: /9: Коммерция/ }).click()
  await expect(page.locator('#design-marketplace')).toBeInViewport()
  await expect(page.locator('.design-approved-commercial__grid > a')).toHaveCount(3)
  await expect(page.locator('.design-approved-commercial__grid')).not.toContainText(/CTR|conversion rate|sales uplift|рост продаж|победивший/i)
  await expect(page.locator('.design-approved-commercial__hypothesis')).toContainText('Гипотеза')
  expect(errors).toEqual([])
})

test('motion video control is accessible, muted and pauses outside viewport', async ({ page }) => {
  await openCanonicalDesign(page, '#design-motion')
  const poster = page.locator('.design-approved-motion-poster')
  const playButton = poster.locator('.design-approved-motion-poster__play')
  await expect(playButton).toBeVisible()
  await expect(playButton).toHaveAccessibleName('Воспроизвести видео')
  await expect(playButton).toHaveCSS('width', '44px')
  await expect(poster.locator('video')).toHaveCount(1)
  expect(await poster.locator('video').evaluate((video: HTMLVideoElement) => video.muted)).toBe(true)

  await playButton.focus()
  await playButton.press('Enter')
  await expect(playButton).toHaveAttribute('aria-pressed', 'true')
  expect(await poster.locator('video').evaluate((video: HTMLVideoElement) => video.paused)).toBe(false)
  await page.getByRole('button', { name: /12: Контакт/ }).click()
  await expect(poster).not.toBeInViewport()
  await expect(poster.locator('video')).toHaveCount(0)

  await expect(page.locator('.design-approved-motion-filmstrip > div')).toHaveCount(5)
  await expect(page.locator('.design-approved-motion-control__angles img')).toHaveCount(4)
  await expect(page.locator('.design-approved-motion-control__tokens span')).toHaveCount(6)
  await expect(page.locator('.design-approved-storyboard__grid > div')).toHaveCount(5)
})

test('principles and process remain independent semantic state systems', async ({ page }) => {
  await openCanonicalDesign(page, '#design-principles')
  const principles = page.locator('.design-approved-principles__list button')
  const process = page.locator('.design-approved-process__list button')
  await expect(principles).toHaveCount(6)
  await expect(process).toHaveCount(7)
  await expect(principles.nth(0)).toHaveAttribute('aria-pressed', 'true')
  await expect(process.nth(0)).toHaveAttribute('aria-pressed', 'true')

  await principles.nth(5).click()
  await expect(principles.nth(5)).toHaveAttribute('aria-pressed', 'true')
  await expect(process.nth(0)).toHaveAttribute('aria-pressed', 'true')
  await process.nth(6).click()
  await expect(process.nth(6)).toHaveAttribute('aria-pressed', 'true')
  await expect(principles.nth(5)).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.design-approved-process__progress i')).toHaveCSS('width', /.+/)

  await principles.nth(5).press('Home')
  await expect(principles.nth(0)).toBeFocused()
  await process.nth(6).press('Home')
  await expect(process.nth(0)).toBeFocused()
})

test('chapter 12 contains tools, CTA and footer, and its actions work', async ({ page }) => {
  await openCanonicalDesign(page, '#design-tools')
  await expect(page.locator('.design-approved-tools__outputs span')).toHaveCount(8)
  await expect(page.locator('.design-approved-tools__groups > div')).toHaveCount(4)
  await expect.poll(() => page.locator('.design-approved-chapter-rail__current').textContent()).toBe('12')

  const primaryHref = await page.locator('.design-approved-final-cta__actions a').nth(0).getAttribute('href')
  const secondaryHref = await page.locator('.design-approved-final-cta__actions a').nth(1).getAttribute('href')
  expect(primaryHref).toBe('/#contact')
  expect(secondaryHref).toBe('/#featured')

  await page.locator('.design-approved-final-cta__actions a').nth(0).click()
  await expect(page).toHaveURL(/\/#contact$/)
  await expect(page.locator('#contact h2')).toBeFocused()
  await page.goBack()
  await expect(page).toHaveURL(/\/design#design-tools$/)
  await page.locator('.design-approved-final-cta__actions a').nth(1).click()
  await expect(page).toHaveURL(/\/#featured$/)
  await expect(page.locator('#featured h2')).toBeFocused()
  await page.goBack()
  await expect(page).toHaveURL(/\/design#design-tools$/)

  await page.locator('.design-approved-footer a').click()
  await expect(page).toHaveURL(/#design-approved-hero$/)
  await expect.poll(() => page.locator('.design-approved-page').evaluate((element) => Math.round(element.scrollTop))).toBe(0)
})

test('all hashes, rail navigation and page keys cover chapters 1–12', async ({ page }) => {
  await openCanonicalDesign(page, '#design-visual-system')
  for (const id of ['design-visual-system', 'design-marketplace', 'design-motion', 'design-principles', 'design-tools']) {
    await page.goto(`/design#${id}`)
    await expect(page.locator(`#${id}`)).toBeInViewport()
  }

  await page.goto('/design')
  await page.locator('.design-approved-page').click({ position: { x: 700, y: 850 } })
  await page.keyboard.press('End')
  await expect(page).toHaveURL(/#design-tools$/)
  await page.keyboard.press('Home')
  await expect(page).toHaveURL(/#design-approved-hero$/)
  await page.keyboard.press('PageDown')
  await expect(page).toHaveURL(/#design-directions$/)
  await page.keyboard.press('PageUp')
  await expect(page).toHaveURL(/#design-approved-hero$/)
})

test('theme, locale, reduced motion and responsive matrix remain safe', async ({ page }) => {
  await openCanonicalDesign(page)
  await page.getByRole('button', { name: 'Переключить тему' }).click()
  await page.getByRole('button', { name: 'EN' }).click()
  await page.getByRole('button', { name: /8: System Method/ }).click()
  await expect(page.locator('#design-visual-system h2')).toHaveText('How a visual becomes a system')
  await expect(page.locator('#design-visual-system')).toHaveCSS('background-color', 'rgb(17, 17, 15)')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  for (const viewport of [
    { width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 768 },
    { width: 1440, height: 900 }, { width: 1600, height: 900 }, { width: 1920, height: 1080 },
    { width: 1024, height: 768 }, { width: 390, height: 844 }, { width: 430, height: 932 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/design#design-motion')
    await expect(page.locator('.design-approved-page')).toBeVisible()
    const overflow = await page.locator('.design-approved-page').evaluate((element) => element.scrollWidth - element.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  }

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/design#design-motion')
  await expect(page.locator('.design-approved-page')).toHaveCSS('scroll-snap-type', 'none')
  await expect(page.locator('.design-approved-motion-poster > img')).toBeVisible()
  await expect(page.locator('.design-approved-motion-poster video')).toBeHidden()
  await expect(page.locator('.floating-character, .glass-panel, [class*="character-wrapper"], [class*="character-badge"]')).toHaveCount(0)
})
