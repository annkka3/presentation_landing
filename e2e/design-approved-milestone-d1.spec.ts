import { expect, test, type Page } from '@playwright/test'

async function setMode(page: Page, locale: 'ru' | 'en' = 'ru', theme: 'dark' | 'light' = 'dark') {
  await page.addInitScript(({ nextLocale, nextTheme }) => {
    localStorage.setItem('anna-locale', nextLocale)
    localStorage.setItem('anna-theme', nextTheme)
  }, { nextLocale: locale, nextTheme: theme })
}

test('canonical route replaces legacy subtree and exposes localized metadata', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await setMode(page)
  await page.goto('/design')
  await expect(page.locator('html')).toHaveAttribute('data-page', 'design')
  await expect(page.locator('.design-approved-page')).toHaveCount(1)
  await expect(page.locator('.design-page, .design-rail, .glass-panel, .floating-character, [class*="character-wrapper"], [class*="character-badge"]')).toHaveCount(0)
  await expect(page.locator('[data-chapter]')).toHaveCount(10)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page).toHaveTitle('Дизайн и визуальные системы — Anna Gromyko')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /UX\/UI.*лендинги.*AI motion/)
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(/\/design$/)
  await expect(page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Design' })).toHaveAttribute('aria-current', 'page')

  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page).toHaveTitle('Design & Visual Systems — Anna Gromyko')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /landing pages.*visual storytelling/)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Design & Visual Systems — Anna Gromyko')
})

test('homepage entries use the canonical lazy route without requesting Design assets early', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const approvedRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().includes('/assets/design-approved/')) approvedRequests.push(request.url())
  })
  await setMode(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(approvedRequests).toEqual([])
  await expect(page.locator('.scene-footer')).toContainText('01 / 07')
  await expect(page.locator('.main-nav a[href="/design"]')).toHaveAttribute('href', '/design')
  await expect(page.locator('.hero-panel').nth(1)).toHaveAttribute('href', '/design')
  await page.locator('.build-system-index button').nth(1).click()
  await expect(page.locator('.build-system-route-link')).toHaveAttribute('href', '/design')

  await page.locator('.main-nav a[href="/design"]').click()
  await expect(page).toHaveURL(/\/design$/)
  await expect(page.locator('.design-approved-page')).toBeVisible()
  expect(approvedRequests.length).toBeGreaterThan(0)
})

test('direct hashes transfer focus and history restores both route chapters', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await setMode(page)
  await page.goto('/#featured')
  await expect(page.locator('#featured')).toBeInViewport()
  await page.locator('.main-nav a[href="/design"]').click()
  await expect(page).toHaveURL(/\/design$/)
  await page.getByRole('button', { name: /8: Motion/ }).click()
  await expect(page).toHaveURL(/\/design#design-motion$/)
  await expect.poll(() => page.locator('.design-approved-chapter-rail__current').textContent()).toBe('08')

  await page.goBack()
  await expect(page).toHaveURL(/\/#featured$/)
  await expect(page.locator('#featured')).toBeInViewport()
  await page.goForward()
  await expect(page).toHaveURL(/\/design#design-motion$/)
  await expect(page.locator('#design-motion')).toBeInViewport()

  await page.goto('/design#design-tools')
  await expect(page.locator('#design-tools')).toBeInViewport()
  await expect(page.locator('#design-tools')).toBeFocused()
  await expect.poll(() => page.locator('.design-approved-chapter-rail__current').textContent()).toBe('10')
  await page.reload()
  await expect(page.locator('#design-tools')).toBeInViewport()
})

test('contact and featured CTAs preserve Design history, mode and focus', async ({ page }) => {
  await setMode(page, 'en', 'light')
  await page.goto('/design#design-tools')
  const actions = page.locator('.design-approved-final-cta__actions a')
  await actions.nth(0).click()
  await expect(page).toHaveURL(/\/#contact$/)
  await expect(page.locator('#contact h2')).toBeFocused()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.goBack()
  await expect(page).toHaveURL(/\/design#design-tools$/)

  await actions.nth(1).click()
  await expect(page).toHaveURL(/\/#featured$/)
  await expect(page.locator('#featured h2')).toBeFocused()
  await page.goBack()
  await expect(page).toHaveURL(/\/design#design-tools$/)
})

test('approved Resume placeholder remains explicit and reachable on desktop and mobile', async ({ page }) => {
  await setMode(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design')
  const resume = page.locator('.design-approved-hero-resume')
  await expect(resume).toBeVisible()
  await resume.click()
  await expect(page.locator('#design-approved-resume-status')).toHaveText('Резюме будет добавлено перед публикацией')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await expect(resume).toBeVisible()
  await expect(resume.locator('.design-approved-hero-resume__compact')).toHaveText('CV')
  await expect(page.locator('.design-approved-chapter-rail')).toBeHidden()
  expect(await page.locator('.design-approved-page').evaluate((root) => root.scrollWidth - root.clientWidth)).toBeLessThanOrEqual(0)
})

test('production build has no public preview alias and no application errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('requestfailed', (request) => {
    if (request.url().startsWith('http://127.0.0.1:4173')) errors.push(`${request.method()} ${request.url()}`)
  })
  await page.goto('/design-approved-preview')
  await expect(page.getByRole('heading', { name: /Страница не найдена|Page not found/ })).toBeVisible()
  await expect(page.locator('.design-approved-page')).toHaveCount(0)
  await page.goto('/design#design-motion')
  await expect(page.locator('.design-approved-page')).toBeVisible()
  expect(errors).toEqual([])
})
