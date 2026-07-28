import { expect, test } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'

const results = path.resolve('qa/results/contact-editorial-ribbons')
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173'

async function openContact(page: import('@playwright/test').Page) {
  await page.goto(`${baseURL}/#contact`)
  await expect(page.locator('#contact .contact-signal-svg')).toBeVisible()
  await page.waitForTimeout(1350)
}

test('captures the approved editorial signal ribbon QA matrix and motion reel', async ({ page, browser }, testInfo) => {
  test.skip(process.env.RUN_VISUAL_QA !== '1', 'Run explicitly for the contact visual QA release')
  test.skip(testInfo.project.name === 'mobile', 'One controlled Chromium capture is sufficient')
  test.setTimeout(360_000)
  await fs.mkdir(results, { recursive: true })

  await page.setViewportSize({ width: 1440, height: 900 })
  await openContact(page)
  await page.screenshot({ path: path.join(results, 'contact-editorial-idle-1440x900.png') })

  await page.setViewportSize({ width: 1728, height: 1117 })
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(results, 'contact-editorial-idle-1728x1117.png') })

  await page.setViewportSize({ width: 1440, height: 900 })
  const grid = page.locator('#contact .contact-grid')
  const bounds = await grid.boundingBox()
  expect(bounds).not.toBeNull()

  await page.mouse.move(bounds!.x + bounds!.width * .13, bounds!.y + bounds!.height * .22)
  await page.waitForTimeout(420)
  await page.screenshot({ path: path.join(results, 'contact-editorial-cursor-left.png') })

  await page.mouse.move(bounds!.x + bounds!.width * .5, bounds!.y + bounds!.height * .52, { steps: 12 })
  await page.waitForTimeout(420)
  await page.screenshot({ path: path.join(results, 'contact-editorial-cursor-center.png') })

  await page.mouse.move(bounds!.x + bounds!.width * .9, bounds!.y + bounds!.height * .54, { steps: 12 })
  await page.waitForTimeout(420)
  await page.screenshot({ path: path.join(results, 'contact-editorial-cursor-right.png') })

  await page.getByLabel('Email или Telegram').focus()
  await page.waitForTimeout(260)
  await page.screenshot({ path: path.join(results, 'contact-editorial-input-focus.png') })

  const submit = page.getByRole('button', { name: 'Отправить сообщение →' })
  await submit.hover()
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(results, 'contact-editorial-cta-hover.png') })

  const field = page.locator('.contact-editorial-ribbons')
  await field.evaluate((element) => { (element as HTMLElement).dataset.signalState = 'loading' })
  await page.waitForTimeout(240)
  await page.screenshot({ path: path.join(results, 'contact-editorial-submit.png') })
  await field.evaluate((element) => { (element as HTMLElement).dataset.signalState = 'success' })
  await page.waitForTimeout(340)
  await page.screenshot({ path: path.join(results, 'contact-editorial-success.png') })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${baseURL}/#contact`)
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('08 / 08')
  await expect(page.locator('.mobile-contact-chapter .contact-signal-svg')).toBeVisible()
  await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(results, 'contact-editorial-mobile.png') })

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${baseURL}/#contact`)
  await expect(page.locator('#contact .contact-signal-svg')).toHaveAttribute('data-motion', 'static')
  await page.waitForTimeout(250)
  await page.screenshot({ path: path.join(results, 'contact-editorial-reduced-motion.png') })

  const videoContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: results, size: { width: 1440, height: 900 } },
  })
  const videoPage = await videoContext.newPage()
  const video = videoPage.video()
  await openContact(videoPage)
  const videoGrid = videoPage.locator('#contact .contact-grid')
  const videoBounds = await videoGrid.boundingBox()
  expect(videoBounds).not.toBeNull()
  await videoPage.waitForTimeout(1300)
  await videoPage.mouse.move(videoBounds!.x + videoBounds!.width * .13, videoBounds!.y + videoBounds!.height * .22, { steps: 18 })
  await videoPage.waitForTimeout(900)
  await videoPage.mouse.move(videoBounds!.x + videoBounds!.width * .5, videoBounds!.y + videoBounds!.height * .52, { steps: 24 })
  await videoPage.waitForTimeout(900)
  await videoPage.mouse.move(videoBounds!.x + videoBounds!.width * .9, videoBounds!.y + videoBounds!.height * .54, { steps: 24 })
  await videoPage.waitForTimeout(1000)
  await videoPage.getByLabel('Email или Telegram').focus()
  await videoPage.waitForTimeout(900)
  await videoPage.getByRole('button', { name: 'Отправить сообщение →' }).hover()
  await videoPage.waitForTimeout(1200)
  await videoPage.mouse.move(videoBounds!.x + videoBounds!.width * .5, videoBounds!.y + videoBounds!.height * .85, { steps: 18 })
  await videoPage.waitForTimeout(2100)
  await videoContext.close()
  if (video) await fs.copyFile(await video.path(), path.join(results, 'contact-editorial-qa.webm'))
})

test('captures corrected editorial signal ribbon mobile state', async ({ page }, testInfo) => {
  test.skip(process.env.RUN_VISUAL_QA !== '1', 'Run explicitly for the contact visual QA release')
  test.skip(testInfo.project.name === 'mobile', 'One controlled Chromium capture is sufficient')
  await fs.mkdir(results, { recursive: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${baseURL}/#contact`)
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('08 / 08')
  await expect(page.locator('.mobile-contact-chapter .contact-signal-svg')).toBeVisible()
  await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(results, 'contact-editorial-mobile.png') })
})
