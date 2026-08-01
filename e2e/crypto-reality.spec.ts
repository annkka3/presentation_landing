import { expect, test } from '@playwright/test'

test('Crypto Reality exposes the complete editorial case and responsive media', async ({ page }) => {
  await page.goto('/cases/crypto-reality')

  await expect(page.getByRole('heading', { level: 1, name: 'Crypto Reality' })).toBeVisible()
  await expect(page.locator('.cr-case-section')).toHaveCount(9)
  await expect(page.locator('.cr-gallery')).toHaveCount(4)
  await expect(page.locator('.cr-archetype-visual img')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 2, name: 'Из отдельных экранов — в связанную систему' })).toBeVisible()
  await expect(page.locator('.cr-architecture-map article')).toHaveCount(6)
  await expect(page.locator('.cr-gallery-stage .cr-screen')).toHaveCount(4)
  await expect(page.locator('.cr-progression-panel')).toBeVisible()
  await expect(page.locator('.cr-progression-tabs [role="tab"]')).toHaveCount(3)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('Crypto Reality galleries support pointer and keyboard navigation', async ({ page }) => {
  await page.goto('/cases/crypto-reality')

  const gallery = page.locator('[data-gallery="core-loop-gallery"]')
  const tabs = gallery.getByRole('tab')
  await expect(tabs).toHaveCount(4)
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')

  await tabs.nth(1).click()
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(gallery.locator('.cr-gallery-stage img')).toHaveAttribute('src', /archetype-risk/)

  await tabs.nth(1).press('ArrowRight')
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
  await expect(gallery.locator('.cr-gallery-stage img')).toHaveAttribute('src', /meme-choices/)
  await expect(page.locator('.cr-loop-diagram article.is-active')).toContainText('Choice')
})

test('Crypto Reality archetypes support keyboard and pointer selection', async ({ page }, testInfo) => {
  await page.goto('/cases/crypto-reality')

  const degen = page.getByRole('tab', { name: 'Meme-coin Degen', exact: true })
  await degen.focus()
  await expect(degen).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.cr-archetype-panel h3')).toHaveText('Meme-coin Degen')
  await expect(page.locator('.cr-archetype-visual img')).toHaveAttribute(
    'src',
    '/assets/crypto-reality/archetypes/meme-coin-degen.webp',
  )

  const detective = page.getByRole('tab', { name: 'On-chain Detective', exact: true })
  if (testInfo.project.name === 'mobile') {
    await detective.evaluate((element) => (element as HTMLButtonElement).click())
  } else {
    await detective.click()
  }
  await expect(detective).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.cr-archetype-panel h3')).toHaveText('On-chain Detective')
  await expect(page.locator('.cr-archetype-visual img')).toHaveAttribute(
    'src',
    '/assets/crypto-reality/archetypes/on-chain-detective.webp',
  )
})

test('Crypto Reality final section is readable, responsive, and keyboard interactive', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'chromium') await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/cases/crypto-reality')

  const finale = page.locator('.crypto-reality-final')
  const portal = finale.getByRole('link', { name: /THE DAO WAY/ })
  await finale.scrollIntoViewIfNeeded()

  await expect(finale.getByText('FINAL', { exact: true })).toBeVisible()
  await expect(finale.getByRole('heading', { level: 2 })).toContainText('Продукт, в котором')
  await expect(finale.locator('.crypto-reality-final__headline em')).toHaveText('видимая часть')
  await expect(portal).toHaveAttribute('href', '/cases/the-dao-way')
  await expect(portal).toContainText('Открыть кейс ↗')

  await portal.focus()
  await expect(finale).toHaveClass(/is-portal-active/)
  await expect(portal).toBeFocused()

  const layout = await finale.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }))
  expect(layout.overflow).toBeLessThanOrEqual(0)
  if (testInfo.project.name === 'chromium') expect(layout.height).toBeLessThanOrEqual(828)
})

test('Crypto Reality final section respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/cases/crypto-reality')

  const finale = page.locator('.crypto-reality-final')
  await finale.scrollIntoViewIfNeeded()
  await expect(finale.locator('.crypto-reality-final__headline em')).toBeVisible()
  await expect(finale.locator('.crypto-reality-final__scan')).toHaveCSS('display', 'none')
  await expect(finale.locator('.crypto-reality-final__thread')).toHaveCSS('display', 'none')
  await expect(finale.getByRole('link', { name: /THE DAO WAY/ })).toBeVisible()
})
