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

test('canonical ЦветиМир route, legacy alias and internal link stay canonical', async ({ page }) => {
  await page.goto('/')
  const canonicalLink = page.locator('a[href="/projects/tsvetimir"]')
  await expect(canonicalLink).toHaveCount(1)
  await expect(page.locator('a[href="/projects/cvetimir"]')).toHaveCount(0)
  await canonicalLink.click()
  await expect(page).toHaveURL(/\/projects\/tsvetimir$/)
  await expect(page.getByRole('heading', { level: 1, name: 'ЦветиМир' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'ЦветиМир' })).toBeVisible()
  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'TsvetiMir' })).toBeVisible()
  await page.getByRole('link', { name: '← Back to home' }).click()
  await expect(page).toHaveURL(/\/$/)

  await page.goto('/projects/cvetimir')
  await expect(page).toHaveURL(/\/projects\/tsvetimir$/)
  await expect(page.getByRole('heading', { level: 1, name: /ЦветиМир|TsvetiMir/ })).toBeVisible()
})

for (const width of [320, 390]) {
  test(`mobile Resume is visible, localized and 44px at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    const resume = page.getByRole('button', { name: 'Скачать резюме' })
    await expect(resume).toBeVisible()
    await expect(resume).toContainText('CV ↓')
    const size = await resume.boundingBox()
    expect(size?.width).toBeGreaterThanOrEqual(44)
    expect(size?.height).toBeGreaterThanOrEqual(44)
    await resume.focus()
    await expect(resume).toBeFocused()
    await resume.press('Enter')
    await expect(page.getByRole('status')).toHaveText('Резюме будет добавлено перед публикацией')
    await page.getByRole('button', { name: 'EN' }).click()
    await expect(page.getByRole('button', { name: 'Download resume' })).toBeVisible()
    const metrics = await page.evaluate(() => {
      const box = (selector: string) => document.querySelector<HTMLElement>(selector)?.getBoundingClientRect()
      const brand = box('.brand')
      const actions = box('.header-actions')
      const controls = [...document.querySelectorAll<HTMLElement>('.language-toggle button, .theme-toggle, .resume-button')].map((control) => {
        const rect = control.getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      })
      return {
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
        brandVisible: Boolean(brand && brand.left >= 0 && brand.right <= innerWidth),
        actionsVisible: Boolean(actions && actions.left >= 0 && actions.right <= innerWidth),
        noCollision: Boolean(brand && actions && brand.right <= actions.left),
        controls,
      }
    })
    expect(metrics.scroll).toBeLessThanOrEqual(metrics.client)
    expect(metrics.brandVisible).toBe(true)
    expect(metrics.actionsVisible).toBe(true)
    expect(metrics.noCollision).toBe(true)
    metrics.controls.forEach((control) => {
      expect(control.width).toBeGreaterThanOrEqual(44)
      expect(control.height).toBeGreaterThanOrEqual(44)
    })
  })
}

test('Hero transfers keyboard active state and preserves mouse behavior', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  const panels = page.locator('.hero-panel')
  const widths = async () => panels.evaluateAll((items) => {
    const total = items[0]?.parentElement?.getBoundingClientRect().width || 1
    return items.map((item) => Math.round(item.getBoundingClientRect().width / total * 100))
  })
  const assertActive = async (index: number) => {
    await expect(panels.nth(index)).toHaveAttribute('data-state', 'active')
    await expect(page.locator('.hero-panel[data-state="active"]')).toHaveCount(1)
    await page.waitForTimeout(520)
    const computed = await widths()
    expect(computed[index]).toBeGreaterThanOrEqual(45)
    computed.filter((_, panelIndex) => panelIndex !== index).forEach((width) => expect(width).toBeLessThanOrEqual(19))
  }

  await panels.nth(0).focus()
  await assertActive(0)
  for (const index of [1, 2, 3]) {
    await page.keyboard.press('Tab')
    await expect(panels.nth(index)).toBeFocused()
    await expect(page.locator('.hero-panels')).toHaveClass(/has-active/)
    await assertActive(index)
  }
  await page.keyboard.press('Tab')
  await expect(page.locator('.hero-panels')).not.toHaveClass(/has-active/)
  await page.keyboard.press('Shift+Tab')
  await expect(panels.nth(3)).toBeFocused()
  await assertActive(3)
  await panels.nth(3).press('Enter')
  await expect(page).toHaveURL(/#featured$/)

  await page.locator('.project-card').first().focus()
  await page.locator('#product').hover({ position: { x: 30, y: 100 } })
  await page.waitForTimeout(650)
  await expect(page.locator('#product')).toHaveAttribute('data-state', 'active')
  expect(errors).toEqual([])
})

test('Hero keyboard state reaches its final width with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await page.locator('#automation').focus()
  await expect(page.locator('#automation')).toHaveAttribute('data-state', 'active')
  await expect.poll(() => page.locator('#automation').evaluate((panel) => panel.getBoundingClientRect().width / (panel.parentElement?.getBoundingClientRect().width || 1))).toBeGreaterThanOrEqual(.45)
})
