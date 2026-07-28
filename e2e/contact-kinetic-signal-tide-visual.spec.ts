import { expect, test } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'

const results = path.resolve('qa/results/contact-kinetic-signal-tide')
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173'

async function openContact(page: import('@playwright/test').Page) {
  await page.goto(`${baseURL}/#contact`)
  await expect(page.locator('#contact .contact-tide-canvas')).toBeVisible()
  await expect(page.locator('#contact .contact-signal-field')).toHaveAttribute('data-renderer', 'kinetic-signal-tide')
  await page.waitForTimeout(900)
}

test('captures the kinetic signal tide QA matrix and motion reel', async ({ page, browser }, testInfo) => {
  test.skip(process.env.RUN_VISUAL_QA !== '1', 'Run explicitly for the contact visual QA release')
  test.skip(testInfo.project.name === 'mobile', 'One controlled Chromium capture is sufficient')
  test.setTimeout(360_000)
  await fs.mkdir(results, { recursive: true })

  await page.setViewportSize({ width: 1440, height: 900 })
  await openContact(page)
  await page.screenshot({ path: path.join(results, 'contact-tide-idle-1440x900.png') })
  const hiddenTideStyle = await page.addStyleTag({ content: '.contact-signal-field{display:none!important}' })
  await page.screenshot({ path: path.join(results, 'contact-clean-baseline-1440x900.png') })
  await hiddenTideStyle.evaluate((element) => element.remove())

  await page.setViewportSize({ width: 1728, height: 1117 })
  await openContact(page)
  await page.screenshot({ path: path.join(results, 'contact-tide-idle-1728x1117.png') })

  await page.setViewportSize({ width: 1440, height: 900 })
  await openContact(page)
  const field = page.locator('#contact .contact-signal-field')
  const canvas = field.locator('.contact-tide-canvas')
  const bounds = await field.boundingBox()
  expect(bounds).not.toBeNull()

  await page.mouse.move(bounds!.x + bounds!.width * .12, bounds!.y + bounds!.height * .56)
  await page.waitForTimeout(360)
  await page.screenshot({ path: path.join(results, 'contact-tide-cursor-left.png') })
  await page.mouse.move(bounds!.x + bounds!.width * .51, bounds!.y + bounds!.height * .56, { steps: 14 })
  await page.waitForTimeout(360)
  await page.screenshot({ path: path.join(results, 'contact-tide-cursor-center.png') })
  await page.mouse.move(bounds!.x + bounds!.width * .88, bounds!.y + bounds!.height * .52, { steps: 14 })
  await page.waitForTimeout(360)
  await page.screenshot({ path: path.join(results, 'contact-tide-cursor-right.png') })
  expect(Number(await canvas.getAttribute('data-max-displacement'))).toBeGreaterThan(8)

  await page.getByLabel('Email или Telegram').focus()
  await page.waitForTimeout(240)
  await page.screenshot({ path: path.join(results, 'contact-tide-input-focus.png') })
  await page.getByRole('button', { name: 'Отправить сообщение →' }).hover()
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(results, 'contact-tide-cta-hover.png') })

  await canvas.evaluate((element) => element.dispatchEvent(new CustomEvent('tideqastate', { detail: { signalState: 'loading' } })))
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(results, 'contact-tide-submit.png') })
  await canvas.evaluate((element) => element.dispatchEvent(new CustomEvent('tideqastate', { detail: { signalState: 'success' } })))
  await page.waitForTimeout(420)
  await page.screenshot({ path: path.join(results, 'contact-tide-success.png') })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${baseURL}/#contact`)
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('08 / 08')
  await expect(page.locator('.mobile-contact-chapter .contact-tide-canvas')).toBeVisible()
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(results, 'contact-tide-mobile.png') })

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openContact(page)
  await expect(page.locator('#contact .contact-tide-canvas')).toHaveAttribute('data-motion', 'static')
  await page.screenshot({ path: path.join(results, 'contact-tide-reduced-motion.png') })

  const videoContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: results, size: { width: 1440, height: 900 } },
  })
  const videoPage = await videoContext.newPage()
  const video = videoPage.video()
  await openContact(videoPage)
  const videoField = videoPage.locator('#contact .contact-signal-field')
  const videoBounds = await videoField.boundingBox()
  expect(videoBounds).not.toBeNull()
  await videoPage.waitForTimeout(900)
  await videoPage.mouse.move(videoBounds!.x + videoBounds!.width * .12, videoBounds!.y + videoBounds!.height * .55, { steps: 18 })
  await videoPage.waitForTimeout(700)
  await videoPage.mouse.move(videoBounds!.x + videoBounds!.width * .52, videoBounds!.y + videoBounds!.height * .58, { steps: 26 })
  await videoPage.waitForTimeout(750)
  await videoPage.mouse.move(videoBounds!.x + videoBounds!.width * .88, videoBounds!.y + videoBounds!.height * .52, { steps: 24 })
  await videoPage.waitForTimeout(800)
  await videoPage.getByRole('button', { name: 'Отправить сообщение →' }).hover()
  await videoPage.waitForTimeout(1000)
  await videoContext.close()
  if (video) await fs.copyFile(await video.path(), path.join(results, 'contact-tide-qa.webm'))
})
