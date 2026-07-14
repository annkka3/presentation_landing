import { expect, test } from '@playwright/test'

test('language, theme, routes, form validation and accessibility basics', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  const themeButton = page.getByRole('button', { name: /Switch to light theme|Switch to dark theme/ })
  await themeButton.click()
  const theme = await page.locator('html').getAttribute('data-theme')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme ?? 'light')
  await page.getByRole('link', { name: /DAO SYSTEM/ }).click()
  await expect(page).toHaveURL(/cases\/dao-system/)
  await page.getByRole('link', { name: /Back to home/ }).click()
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Send message →' }).click()
  await expect(page.getByText('Enter your name.')).toBeVisible()
  expect(errors).toEqual([])
})

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client)
  })
}

test('reduced motion stops marquee animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.marquee-track')).toHaveCSS('animation-name', 'none')
})
