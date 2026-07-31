import { expect, test } from '@playwright/test'

test('Crypto Reality exposes the complete editorial case and responsive media', async ({ page }) => {
  await page.goto('/cases/crypto-reality')

  await expect(page.getByRole('heading', { level: 1, name: 'Crypto Reality' })).toBeVisible()
  await expect(page.locator('.cr-section')).toHaveCount(13)
  await expect(page.locator('.cr-screen')).toHaveCount(30)
  await expect(page.locator('.cr-archetype-visual img')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 2, name: 'Из отдельных экранов — в связанную систему' })).toBeVisible()
  await expect(page.locator('.cr-architecture-map article')).toHaveCount(6)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
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
