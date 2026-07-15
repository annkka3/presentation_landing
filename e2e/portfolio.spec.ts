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

test('homepage owns six stable editorial chapters and route-scoped snap state', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-page', 'home')
  const chapters = page.locator('.home-chapter')
  await expect(chapters).toHaveCount(6)
  expect(await chapters.evaluateAll((items) => items.map((item) => item.getAttribute('data-home-chapter')))).toEqual(['01', '02', '03', '04', '05', '06'])
  expect(await chapters.evaluateAll((items) => items.map((item) => item.id))).toEqual(['chapter-hero', 'featured', 'more-projects', 'expertise-process', 'experience-education', 'contact'])
  await expect(page.locator('#contact .contact-form')).toBeVisible()
  await expect(page.locator('#contact .site-footer')).toBeVisible()
  await page.goto('/cases/dao-system')
  await expect(page.locator('html')).not.toHaveAttribute('data-page')
})

test('soft snap is computed only for a sufficiently large desktop viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect.poll(() => page.locator('html').evaluate((html) => getComputedStyle(html).scrollSnapType)).toMatch(/^y(?: proximity)?$/)
  await page.setViewportSize({ width: 390, height: 844 })
  await expect.poll(() => page.locator('html').evaluate((html) => getComputedStyle(html).scrollSnapType)).toBe('none')
  await page.setViewportSize({ width: 1366, height: 680 })
  await expect.poll(() => page.locator('html').evaluate((html) => getComputedStyle(html).scrollSnapType)).toBe('none')
})

test('reduced motion disables both snap and Hero playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'none')
  await expect(page.locator('.hero-panel video')).toHaveCount(0)
  await expect(page.locator('.hero-panel > img')).toHaveCount(4)
})

test('native document scrolling reaches every chapter without a nested scroll trap', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const metrics = await page.evaluate(() => ({
    scrollingElement: document.scrollingElement === document.documentElement,
    bodyOverflow: getComputedStyle(document.body).overflowY,
    chapterOverflow: [...document.querySelectorAll('.home-chapter')].map((chapter) => getComputedStyle(chapter).overflowY),
  }))
  expect(metrics.scrollingElement).toBe(true)
  expect(metrics.bodyOverflow).not.toBe('hidden')
  expect(metrics.chapterOverflow.every((overflow) => overflow === 'visible')).toBe(true)
  for (const id of ['featured', 'more-projects', 'expertise-process', 'experience-education', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await expect(page.locator(`#${id}`)).toBeInViewport()
  }
  await page.keyboard.press('End')
  await expect(page.locator('.site-footer')).toBeInViewport()
  await page.keyboard.press('Home')
  await expect(page.locator('#chapter-hero')).toBeInViewport()
})

test('section anchors respect the sticky Header and browser Back', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByRole('link', { name: /Contact|Контакты|Связаться/ }).first().click()
  await expect(page).toHaveURL(/#contact$/)
  await expect.poll(() => page.locator('#contact').evaluate((chapter) => Math.round(chapter.getBoundingClientRect().top))).toBeGreaterThanOrEqual(70)
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('#chapter-hero')).toBeInViewport()
})

test('desktop Hero plays only the active approved video and pauses offscreen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop playback requires a fine pointer')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const product = page.locator('#product video')
  const design = page.locator('#design video')
  await expect(product).toHaveAttribute('poster', '/assets/product.png')
  await page.locator('#product').hover({ position: { x: 80, y: 120 } })
  await expect.poll(() => product.evaluate((video: HTMLVideoElement) => ({ paused: video.paused, time: video.currentTime }))).toMatchObject({ paused: false })
  await page.locator('#design').focus()
  await expect.poll(() => design.evaluate((video: HTMLVideoElement) => video.paused)).toBe(false)
  await expect.poll(() => product.evaluate((video: HTMLVideoElement) => ({ paused: video.paused, time: video.currentTime }))).toEqual({ paused: true, time: 0 })
  await page.locator('#featured').scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator('.hero-panel video').evaluateAll((videos: HTMLVideoElement[]) => videos.every((video) => video.paused && video.currentTime === 0))).toBe(true)
})

test('mobile keeps static Hero posters and never requests video files', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const videoRequests: string[] = []
  page.on('request', (request) => { if (/\.mp4(?:\?|$)/.test(request.url())) videoRequests.push(request.url()) })
  await page.goto('/')
  await page.locator('#analytics').scrollIntoViewIfNeeded()
  await expect(page.locator('.hero-panel video')).toHaveCount(0)
  await expect(page.locator('.hero-panel > img')).toHaveCount(4)
  expect(videoRequests).toEqual([])
})

test('approved MP4 assets return video MIME and support byte ranges', async ({ request }) => {
  for (const path of ['/assets/product_v1.mp4', '/assets/design_v3.mp4', '/assets/automation.mp4', '/assets/analytics.mp4']) {
    const response = await request.get(path, { headers: { Range: 'bytes=0-1023' } })
    expect([200, 206]).toContain(response.status())
    expect(response.headers()['content-type']).toContain('video/mp4')
    if (response.status() === 206) expect(response.headers()['content-range']).toMatch(/^bytes 0-1023\//)
  }
})

test('homepage has no console errors, failed application requests or overflow', async ({ page }) => {
  const consoleErrors: string[] = []
  const failedRequests: string[] = []
  const failedResponses: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  page.on('requestfailed', (request) => {
    const intentionalMediaAbort = /\.mp4(?:\?|$)/.test(request.url()) && request.failure()?.errorText === 'net::ERR_ABORTED'
    if (!intentionalMediaAbort) failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`)
  })
  page.on('response', (response) => { if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`) })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.locator('#contact').scrollIntoViewIfNeeded()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  expect(consoleErrors).toEqual([])
  expect(failedRequests).toEqual([])
  expect(failedResponses).toEqual([])
})
