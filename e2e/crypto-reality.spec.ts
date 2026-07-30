import { expect, test } from '@playwright/test'

test('Crypto Reality exposes the complete editorial case and responsive media', async ({ page }) => {
  await page.goto('/cases/crypto-reality')

  await expect(page.getByRole('heading', { level: 1, name: 'Crypto Reality' })).toBeVisible()
  await expect(page.locator('.cr-section')).toHaveCount(13)
  await expect(page.locator('.cr-screen')).toHaveCount(31)
  await expect(page.getByRole('heading', { level: 2, name: 'Из отдельных экранов — в связанную систему' })).toBeVisible()
  await expect(page.locator('.cr-architecture-map article')).toHaveCount(6)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('Crypto Reality archetypes support keyboard and pointer selection', async ({ page }) => {
  await page.goto('/cases/crypto-reality')

  const degen = page.getByRole('tab', { name: 'Meme-coin Degen', exact: true })
  await degen.focus()
  await expect(degen).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.cr-archetype-panel h3')).toHaveText('Meme-coin Degen')

  const detective = page.getByRole('tab', { name: 'On-chain Detective', exact: true })
  await detective.click()
  await expect(detective).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.cr-archetype-panel h3')).toHaveText('On-chain Detective')
})
