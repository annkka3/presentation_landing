import { expect, test } from '@playwright/test'

test('language, theme, routes, form validation and accessibility basics', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  const themeButton = page.getByRole('button', { name: 'Switch theme' })
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

for (const width of [320, 360, 375, 390, 393, 402, 430, 480, 767, 768, 1024, 1440, 1920]) {
  test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client)
  })
}

test('reduced motion stops decorative motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  if (await page.locator('.mobile-chapter-track').count()) {
    await expect(page.locator('.mobile-chapter-track')).toHaveCSS('scroll-behavior', 'auto')
  } else {
    await expect(page.locator('.marquee-track')).toHaveCSS('animation-name', 'none')
  }
})

test('canonical ЦветиМир route, legacy alias and internal link stay canonical', async ({ page }) => {
  await page.goto('/')
  const canonicalLink = page.locator('a[href="/projects/tsvetimir"]')
  await expect(canonicalLink).toHaveCount(1)
  await expect(page.locator('a[href="/projects/cvetimir"]')).toHaveCount(0)
  await canonicalLink.click()
  await expect(page).toHaveURL(/\/projects\/tsvetimir(?:#.*)?$/)
  await expect(page.getByRole('heading', { level: 1, name: 'ЦветиМир' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'ЦветиМир' })).toBeVisible()
  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'TsvetiMir' })).toBeVisible()
  await page.getByRole('link', { name: '← Back to home' }).click()
  await expect(page).toHaveURL(/\/(?:#chapter-hero)?$/)

  await page.goto('/projects/cvetimir')
  await expect(page).toHaveURL(/\/projects\/tsvetimir$/)
  await expect(page.getByRole('heading', { level: 1, name: /ЦветиМир|TsvetiMir/ })).toBeVisible()
})

for (const width of [320, 390]) {
  test(`mobile Header geometry is exact and localized at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-page', 'home')
    const menu = page.getByRole('button', { name: 'Открыть меню' })
    await expect(menu).toBeVisible()
    const size = await menu.boundingBox()
    expect(size?.width).toBe(44)
    expect(size?.height).toBe(44)
    await menu.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('PDF · скоро')).toBeVisible()
    await page.getByRole('button', { name: 'Закрыть меню' }).click()
    await expect(menu).toBeFocused()
    await page.getByRole('button', { name: 'EN' }).click()
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
    const metrics = await page.evaluate(() => {
      const box = (selector: string) => document.querySelector<HTMLElement>(selector)?.getBoundingClientRect()
      const brand = box('.brand')
      const actions = box('.header-actions')
      const controls = [...document.querySelectorAll<HTMLElement>('.language-toggle, .theme-toggle, .mobile-menu-button')].map((control) => {
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
    expect(new Set(metrics.controls.map((control) => control.height)).size).toBe(1)
    expect(metrics.controls.every((control) => control.height === 44)).toBe(true)
  })
}

test('Header utility controls share one geometry and preserve locale', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const heights = await page.locator('.language-toggle, .theme-toggle, .resume-button').evaluateAll((controls) => controls.map((control) => control.getBoundingClientRect().height))
  expect(heights).toEqual([42, 42, 42])
  await page.getByRole('button', { name: 'EN' }).click()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Switch theme' })).toBeVisible()
})

test('RU and EN homepage UI remain fully localized', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toContainText('Продукт')
  const ruText = await page.locator('body').innerText()
  for (const prohibited of ['VIEW CASE STUDY', 'VIEW PROJECT', 'SCROLL TO EXPLORE', 'CURRENT', 'Featured case studies', 'More projects', 'Expertise', 'Process', 'Experience', 'Education']) {
    expect(ruText).not.toContain(prohibited)
  }
  for (const preserved of ['DAO SYSTEM', 'Crypto Reality', 'The DAO Way', 'Risk Journal Analytics', 'Anna Gromyko Portfolio', 'SQL', 'Python']) {
    expect(ruText).toContain(preserved)
  }
  await page.getByRole('button', { name: 'EN' }).click()
  const enText = await page.locator('body').innerText()
  for (const accidental of ['Избранные кейсы', 'Ещё проекты', 'Процесс работы', 'Компетенции', 'Образование', 'Связаться', 'ПРОКРУТИТЕ ДАЛЬШЕ']) {
    expect(enText).not.toContain(accidental)
  }
})

test('chapter rail navigates, hides responsively and final counter returns to top', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const rail = page.getByRole('navigation', { name: 'Навигация по разделам' })
  await expect(rail).toBeVisible()
  await expect(rail.locator('.scene-navigation-current')).toHaveText('01')
  await page.getByRole('link', { name: 'Перейти к разделу 7 из 7' }).click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(rail.locator('.scene-navigation-current')).toHaveText('07')
  const footerCue = page.locator('.scene-footer')
  await expect(footerCue).toContainText('07 / 07')
  await expect(footerCue).toContainText('НАВЕРХ')
  await footerCue.click()
  await expect(page).toHaveURL(/#chapter-hero$/)
  await expect(rail.locator('.scene-navigation-current')).toHaveText('01')
  await page.setViewportSize({ width: 900, height: 900 })
  await expect(rail).toBeHidden()
  await expect(footerCue).toBeVisible()
})

test('Contact links, localization and missing endpoint behavior stay honest', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#contact')
  await expect(page.getByRole('link', { name: /annagromyko88@gmail.com/ })).toHaveAttribute('href', 'mailto:annagromyko88@gmail.com')
  await expect(page.getByRole('link', { name: /@AnnaGromyko/ })).toHaveAttribute('href', 'https://t.me/AnnaGromyko')
  await expect(page.getByRole('link', { name: /github.com\/annkka3/ })).toHaveAttribute('href', 'https://github.com/annkka3')
  await expect(page.getByPlaceholder('Как к вам обращаться?')).toBeVisible()
  await page.getByLabel('Имя').fill('Анна')
  await page.getByLabel('Email или Telegram').fill('@anna')
  await page.getByRole('textbox', { name: 'Сообщение', exact: true }).fill('Описание проекта и задачи для совместной работы.')
  await page.getByRole('button', { name: 'Отправить сообщение →' }).click()
  await expect(page.getByText('Отправка с сайта пока не настроена. Напишите мне по email или в Telegram.')).toBeVisible()
  await expect(page.getByText('Сообщение отправлено. Спасибо!')).toHaveCount(0)
  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page.getByPlaceholder('How should I address you?')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Send message →' })).toBeVisible()
})

test('Hero transfers keyboard active state and preserves mouse behavior', async ({ page }) => {
  test.setTimeout(120_000)
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
    expect(computed[index]).toBeGreaterThanOrEqual(43)
    computed.filter((_, panelIndex) => panelIndex !== index).forEach((width) => expect(width).toBeLessThanOrEqual(20))
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
  await expect(panels.nth(0)).toHaveAttribute('href', '/product')
  await expect(panels.nth(1)).toHaveAttribute('href', '/design')
  await expect(panels.nth(2)).toHaveAttribute('href', '/automation')
  await expect(panels.nth(3)).toHaveAttribute('href', '/analytics')

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
  await expect.poll(() => page.locator('#automation').evaluate((panel) => panel.getBoundingClientRect().width / (panel.parentElement?.getBoundingClientRect().width || 1))).toBeGreaterThanOrEqual(.43)
})

test('What I Build reorganizes two concrete outputs and Featured keeps DAO SYSTEM dominant', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#skills')
  await expect(page.getByRole('heading', { level: 2, name: 'Что я создаю' })).toBeVisible()
  await expect(page.locator('.build-system-index button')).toHaveCount(4)
  await expect(page.locator('#active-build-system .build-output-list > div')).toHaveCount(2)
  await page.getByRole('button', { name: '02 ВИЗУАЛЬНЫЕ СИСТЕМЫ' }).click()
  await expect(page.locator('#active-build-system')).toContainText('Лендинги, воронки и commerce')
  await expect(page.locator('.build-diagram')).toHaveClass(/build-diagram--visual/)

  await page.goto('/#featured')
  await expect(page.locator('.featured-archive .project-card')).toHaveCount(4)
  await expect(page.locator('.featured-secondary-cases .project-card')).toHaveCount(3)
  await expect(page.locator('.featured-system-statement')).toHaveCount(4)
  const hierarchy = await page.evaluate(() => {
    const archive = document.querySelector<HTMLElement>('.featured-archive')!.getBoundingClientRect()
    const lead = document.querySelector<HTMLElement>('.featured-archive>.is-lead-case')!.getBoundingClientRect()
    return lead.width / archive.width
  })
  expect(hierarchy).toBeGreaterThan(.55)
  expect(hierarchy).toBeLessThan(.66)
  await expect(page.locator('.featured-archive>.is-lead-case')).toContainText('DAO SYSTEM')
})

test('homepage owns seven stable editorial scenes and route-scoped state', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-page', 'home')
  const chapters = page.locator('.home-chapter')
  await expect(chapters).toHaveCount(7)
  expect(await chapters.evaluateAll((items) => items.map((item) => item.getAttribute('data-home-chapter')))).toEqual(['01', '02', '03', '04', '05', '06', '07'])
  expect(await chapters.evaluateAll((items) => items.map((item) => item.id))).toEqual(['chapter-hero', 'skills', 'featured', 'more-projects', 'process', 'experience-education', 'contact'])
  await expect(page.locator('.scene-navigation a')).toHaveCount(7)
  await expect(page.locator('.scene-footer')).toContainText('01 / 07')
  await expect(page.locator('.scene-footer')).toContainText('ПРОКРУТИТЕ ДАЛЬШЕ')
  await expect(page.locator('#contact .contact-form')).toBeVisible()
  await expect(page.locator('#contact .site-footer')).toBeVisible()
  await page.goto('/cases/dao-system')
  await expect(page.locator('html')).not.toHaveAttribute('data-page')
})

test('design route loads independently with ten chapters and preserved app controls', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design')
  await expect(page.locator('html')).toHaveAttribute('data-page', 'design')
  await expect(page.getByRole('heading', { level: 1, name: /Создаю визуальные/ })).toBeVisible()
  await expect(page.locator('.design-approved-page [data-chapter]')).toHaveCount(10)
  await expect(page.locator('.design-approved-chapter-rail__current')).toHaveText('01')
  await expect(page.locator('.design-approved-chapter-rail')).toContainText('10')
  await expect(page.locator('.design-approved-hero-header')).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Design' })).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.design-approved-hero-resume')).toHaveCount(0)
  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1, name: /I create visual systems/ })).toBeVisible()
  await page.getByRole('button', { name: /Toggle theme|Switch theme|Переключить тему/ }).click()
  const theme = await page.locator('html').getAttribute('data-theme')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme ?? 'light')
  await expect(page.locator('html')).toHaveAttribute('data-page', 'design')
  expect(errors).toEqual([])
})

test('design route supports direct hashes, rail navigation, browser back and no mobile overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design#design-motion')
  await expect(page.locator('#design-motion')).toBeInViewport()
  await expect.poll(() => page.locator('.design-approved-chapter-rail__current').textContent()).toBe('08')
  await page.getByRole('button', { name: /10: Contact|10: Контакт/ }).click()
  await expect(page).toHaveURL(/\/design#design-tools$/)
  await expect(page.locator('#design-tools')).toBeInViewport()

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/design#design-directions')
  await expect(page.locator('#design-directions')).toBeInViewport()
  await expect(page.locator('.design-approved-chapter-rail')).toBeHidden()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('design route honors reduced motion without videos or snap', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design')
  await expect(page.locator('.design-approved-page')).toHaveCSS('scroll-snap-type', 'none')
  await expect(page.locator('.design-approved-hero-media video')).toBeHidden()
})

test('canonical design route isolates the exact approved hero', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/design')

  await expect(page.locator('html')).toHaveAttribute('data-page', 'design')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await expect(page.getByRole('heading', { level: 1, name: /Создаю визуальные/ })).toBeVisible()
  await expect(page.getByText('01 / 10')).toBeVisible()
  await expect(page.locator('.site-header, .floating-character, .glass-panel, [class*="character-wrapper"], [class*="character-badge"]')).toHaveCount(0)
  await expect(page.locator('.design-approved-hero-header')).toBeVisible()
  await expect(page.locator('.design-approved-chapter-rail__track button')).toHaveCount(10)

  const geometry = await page.evaluate(() => {
    const rect = (selector: string) => {
      const box = document.querySelector<HTMLElement>(selector)?.getBoundingClientRect()
      return box && { top: box.top, right: innerWidth - box.right, bottom: innerHeight - box.bottom, left: box.left, width: box.width, height: box.height }
    }
    return {
      hero: rect('.design-approved-hero'),
      header: rect('.design-approved-hero-header'),
      scene: rect('.design-approved-hero-scene'),
      copy: rect('.design-approved-hero-copy'),
      axis: rect('.design-approved-hero-axis'),
      stack: rect('.design-approved-hero-stack'),
      commerce: rect('.design-approved-hero-commerce'),
      brand: rect('.design-approved-hero-brand'),
      mobile: rect('.design-approved-hero-mobile'),
      scrollCue: rect('.design-approved-hero-scroll-cue'),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  expect(geometry.hero).toMatchObject({ top: 0, left: 0, width: 1440, height: 900 })
  expect(geometry.header).toMatchObject({ top: 20, right: 18, left: 16 })
  expect(geometry.scene).toMatchObject({ top: 0, left: 0, height: 900, width: 849.59375 })
  expect(geometry.copy).toMatchObject({ bottom: 55.796875, left: 16 })
  expect(geometry.axis).toMatchObject({ top: 198, left: 652, width: 2, height: 495 })
  expect(geometry.stack).toMatchObject({ top: 48, right: 90, width: 633.59375, height: 810 })
  expect(geometry.commerce).toMatchObject({ top: 97.5, right: 90, width: 633.59375 })
  expect(geometry.brand).toMatchObject({ right: 90, bottom: 91.5, width: 633.59375, height: 214.453125 })
  expect(geometry.mobile).toMatchObject({ right: -22, width: 382 })
  expect(geometry.scrollCue).toMatchObject({ right: 82, bottom: 26 })
  expect(geometry.overflow).toBeLessThanOrEqual(0)

  await page.getByRole('button', { name: 'EN' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1, name: /I create visual systems/ })).toBeVisible()
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  const theme = await page.locator('html').getAttribute('data-theme')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme ?? 'light')
  expect(errors).toEqual([])
})

test('canonical design route has no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/design')
  await expect(page.locator('.design-approved-chapter-rail')).toBeHidden()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('production build does not expose the approved preview route', async ({ page }) => {
  await page.goto('/design-approved-preview')
  await expect(page.getByRole('heading', { name: /Страница не найдена|Page not found/i })).toBeVisible()
  await expect(page.locator('.design-approved-page')).toHaveCount(0)
})

test('mandatory scene snap is vertical on desktop and horizontal on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.scroll-container')).toHaveCSS('scroll-snap-type', 'y mandatory')
  await expect(page.locator('.home-scene').first()).toHaveCSS('scroll-snap-align', 'start')
  await expect(page.locator('.home-scene').first()).toHaveCSS('scroll-snap-stop', 'always')
  await expect.poll(() => page.locator('.home-scene').first().evaluate((scene) => Math.round(scene.getBoundingClientRect().height))).toBe(900)
  await page.setViewportSize({ width: 1024, height: 768 })
  await expect(page.locator('.scroll-container')).toHaveCSS('scroll-snap-type', 'y mandatory')
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.scroll-container')).toHaveCount(0)
  await expect(page.locator('.mobile-chapter-track')).toHaveCSS('scroll-snap-type', 'x mandatory')
  await expect(page.locator('.mobile-chapter')).toHaveCount(8)
  await expect(page.locator('.mobile-chapter').first()).toHaveCSS('scroll-snap-align', 'start')
  await expect(page.locator('.scene-navigation')).toBeHidden()
})

test('reduced motion disables both snap and Hero playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.scroll-container')).toHaveCSS('scroll-snap-type', 'none')
  await expect(page.locator('.hero-panel video')).toHaveCount(0)
  await expect(page.locator('.hero-panel > img')).toHaveCount(4)
})

test('cinematic scroll container reaches every scene and supports keyboard navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.scroll-container')).toBeVisible()
  const metrics = await page.evaluate(() => ({
    documentLocked: getComputedStyle(document.body).overflowY === 'hidden',
    containerOverflow: getComputedStyle(document.querySelector('.scroll-container')!).overflowY,
    containerScrollable: document.querySelector<HTMLElement>('.scroll-container')!.scrollHeight > document.querySelector<HTMLElement>('.scroll-container')!.clientHeight,
    bodyOverflow: getComputedStyle(document.body).overflowY,
    chapterOverflow: [...document.querySelectorAll('.home-chapter')].map((chapter) => getComputedStyle(chapter).overflowY),
  }))
  expect(metrics.documentLocked).toBe(true)
  expect(metrics.containerOverflow).toBe('auto')
  expect(metrics.containerScrollable).toBe(true)
  expect(metrics.chapterOverflow.every((overflow) => overflow === 'hidden')).toBe(true)
  for (const id of ['featured', 'more-projects', 'process', 'skills', 'experience-education', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await expect(page.locator(`#${id}`)).toBeInViewport()
  }
  await page.locator('.scroll-container').focus()
  await page.keyboard.press('End')
  await expect(page.locator('.site-footer')).toBeInViewport()
  await page.keyboard.press('Home')
  await expect(page.locator('#chapter-hero')).toBeInViewport()
})

test('section anchors respect the sticky Header and browser Back', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop Header navigation is hidden at the mobile breakpoint')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByRole('link', { name: /Contact|Контакты|Связаться/ }).first().click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('#contact')).toBeInViewport()
  await expect.poll(() => page.locator('#contact .contact-section').evaluate((section) => Math.round(section.getBoundingClientRect().top))).toBeGreaterThanOrEqual(70)
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect.poll(() => page.locator('.scroll-container').evaluate((container) => Math.round(container.scrollTop))).toBeLessThan(100)
  await expect(page.locator('#chapter-hero')).toBeInViewport()
})

test('direct Contact anchor restores the mobile chapter', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#contact')
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('.mobile-chapter-track')).toHaveCSS('scroll-snap-type', 'x mandatory')
  await expect(page.locator('#contact')).toBeInViewport()
  await expect(page.locator('#contact .contact-form')).toBeVisible()
  await expect(page.locator('#contact .contact-eyebrow')).toHaveText('08 · КОНТАКТ')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('08 / 08')
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

test('mobile Directions uses static visuals and never requests video files', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const videoRequests: string[] = []
  page.on('request', (request) => { if (/\.mp4(?:\?|$)/.test(request.url())) videoRequests.push(request.url()) })
  await page.goto('/')
  await expect(page.locator('.mobile-direction-tile')).toHaveCount(4)
  await expect(page.locator('.mobile-direction-tile video')).toHaveCount(0)
  await expect(page.locator('.mobile-direction-tile > img')).toHaveCount(4)
  expect(videoRequests).toEqual([])
})

test('mobile chapters, nested carousel and UI state stay independent', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const track = page.locator('.mobile-chapter-track')
  await expect(track.locator(':scope > .mobile-chapter')).toHaveCount(8)
  await expect(page.locator('.mobile-hero-system img')).toHaveCount(1)
  await expect(page.locator('.mobile-hero-system-tabs [role="tab"]')).toHaveCount(4)
  await expect(page.locator('.mobile-hero-copy')).toContainText('От архитектуры продукта и интерфейсов до AI-процессов')
  await expect(page.locator('.mobile-hero')).toContainText('Сложность становится структурой')
  await expect(page.locator('.mobile-hero .mobile-direction-tile, .mobile-hero .mobile-direction-card')).toHaveCount(0)
  await expect(page.locator('.mobile-direction-tile')).toHaveCount(4)
  await expect(page.locator('.mobile-skills-accordion article.is-open')).toHaveCount(1)
  await expect(page.locator('.mobile-skills-accordion article')).toHaveCount(4)
  await expect(page.locator('.mobile-skills-accordion article.is-open .mobile-build-output')).toHaveCount(2)
  await expect(page.locator('.mobile-experience-tabs [aria-selected="true"]')).toHaveText('Опыт')

  await page.getByRole('button', { name: 'ИССЛЕДОВАТЬ СИСТЕМУ' }).click()
  await expect(page).toHaveURL(/#skills$/)
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('02 / 08')
  await expect.poll(() => track.evaluate((node) => Math.round(node.scrollLeft))).toBe(390)
  await page.getByRole('button', { name: 'Перейти к разделу 3: Направления' }).click()
  await expect(page).toHaveURL(/#directions$/)
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('03 / 08')
  await expect.poll(() => track.evaluate((node) => Math.round(node.scrollLeft))).toBe(780)
  await page.getByRole('button', { name: 'Открыть кейсы направления АНАЛИТИКА' }).click()
  await expect(page).toHaveURL(/#featured$/)
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('04 / 08')
  await expect(page.locator('.mobile-project-focus')).toContainText('АНАЛИТИКА')
  await expect(page.locator('#featured .project-card').first()).toContainText('DAO SYSTEM')
  await expect.poll(() => track.evaluate((node) => Math.round(node.scrollLeft))).toBe(1170)
  await expect(page.locator('#featured .mobile-project-list .project-card')).toHaveCount(4)
  await expect(page.locator('#more-projects .mobile-project-list .project-card')).toHaveCount(6)
  await expect(page.locator('#featured .mobile-carousel-navigation, #more-projects .mobile-carousel-navigation')).toHaveCount(0)
  await expect(page.locator('#featured .mobile-carousel-count, #more-projects .mobile-carousel-count')).toHaveCount(0)
  await expect(page.locator('#process .mobile-process-timeline article')).toHaveCount(6)
  await expect(page.locator('#process .mobile-process-timeline article.is-active')).toHaveCount(1)
  await expect(page.locator('#process .mobile-carousel-navigation, #process .mobile-step-rail, #process .mobile-carousel-count')).toHaveCount(0)
  await expect(page.locator('.mobile-chapter-navigation')).toHaveCount(1)

  await page.getByRole('button', { name: 'EN' }).click()
  await page.getByRole('button', { name: 'Switch theme' }).click()
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('04 / 08')
  await expect(page).toHaveURL(/#featured$/)
  await page.goBack()
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('03 / 08')
  await page.goBack()
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('02 / 08')
  await page.goBack()
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('01 / 08')
})

test('mobile editorial menu traps focus, keeps honest utilities and navigates with history', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#featured')
  const trigger = page.getByRole('button', { name: 'Открыть меню' })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-mobile-menu', 'open')
  await expect(page.locator('.mobile-chapter-navigation')).toHaveCSS('pointer-events', 'none')
  const menuGeometry = await page.evaluate(() => {
    const rows = [...document.querySelectorAll<HTMLElement>('.mobile-menu-navigation a')]
    const arrows = rows.map((row) => {
      const arrow = row.querySelector<HTMLElement>('i')!.getBoundingClientRect()
      const bounds = row.getBoundingClientRect()
      return Math.abs((arrow.top + arrow.bottom) / 2 - (bounds.top + bounds.bottom) / 2)
    })
    const standard = getComputedStyle(rows[0].querySelector<HTMLElement>('strong')!)
    const experience = getComputedStyle(document.querySelector<HTMLElement>('.mobile-menu-item--experience-education>strong')!)
    return {
      rowHeights: rows.map((row) => row.getBoundingClientRect().height),
      arrowOffsets: arrows,
      standardLineHeight: Number.parseFloat(standard.lineHeight),
      experienceLineHeight: Number.parseFloat(experience.lineHeight),
    }
  })
  expect(new Set(menuGeometry.rowHeights).size).toBe(1)
  expect(menuGeometry.rowHeights[0]).toBe(58)
  expect(Math.max(...menuGeometry.arrowOffsets)).toBeLessThanOrEqual(1)
  expect(menuGeometry.experienceLineHeight).toBeLessThan(menuGeometry.standardLineHeight)
  const close = page.getByRole('button', { name: 'Закрыть меню' })
  await expect(close).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('link', { name: /github.com\/annkka3/ })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(close).toBeFocused()
  await expect(dialog.getByRole('link', { name: /05 Избранные кейсы/ })).toHaveAttribute('aria-current', 'page')
  await expect(dialog.getByText('PDF · скоро')).toBeVisible()
  await expect(dialog.getByRole('link', { name: /annagromyko88@gmail.com/ })).toHaveAttribute('href', 'mailto:annagromyko88@gmail.com')
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()

  await trigger.click()
  await dialog.getByRole('link', { name: /09 Контакты/ }).click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('08 / 08')
  await page.goBack()
  await expect(page).toHaveURL(/#featured$/)
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('04 / 08')
  await page.getByRole('button', { name: 'EN' }).click()
  await page.getByRole('button', { name: 'Switch theme' }).click()
  const persistedTheme = await page.locator('html').getAttribute('data-theme')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('dialog').getByRole('link', { name: /05 Featured Cases/ })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByText('PDF · coming soon')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-theme', persistedTheme ?? 'dark')
  await page.keyboard.press('Escape')
})

test('mobile chapter swipe uses a deliberate threshold and ignores interactive controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#directions')
  const swipe = async (from: { x: number; y: number }, to: { x: number; y: number }, selector = '.mobile-chapter-viewport') => {
    await page.dispatchEvent(selector, 'touchstart', { touches: [{ identifier: 1, clientX: from.x, clientY: from.y }], changedTouches: [] })
    await page.dispatchEvent(selector, 'touchend', { touches: [], changedTouches: [{ identifier: 1, clientX: to.x, clientY: to.y }] })
  }
  await swipe({ x: 300, y: 240 }, { x: 260, y: 244 })
  await expect(page).toHaveURL(/#directions$/)
  await swipe({ x: 300, y: 180 }, { x: 245, y: 280 })
  await expect(page).toHaveURL(/#directions$/)
  await swipe({ x: 330, y: 240 }, { x: 100, y: 250 })
  await expect(page).toHaveURL(/#featured$/)
  await swipe({ x: 330, y: 240 }, { x: 80, y: 245 }, '#featured .mobile-project-list > div:first-child .project-card')
  await expect(page).toHaveURL(/#featured$/)
})

for (const viewport of [{ width: 320, height: 568 }, { width: 360, height: 740 }, { width: 375, height: 667 }, { width: 390, height: 844 }, { width: 393, height: 852 }, { width: 430, height: 932 }]) {
  test(`mobile menu and single project navigation fit at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/#featured')
    await expect(page.locator('#featured .mobile-project-list .project-card')).toHaveCount(4)
    await expect(page.locator('#featured .mobile-carousel-navigation, #more-projects .mobile-carousel-navigation')).toHaveCount(0)
    await expect(page.locator('.mobile-chapter-navigation')).toHaveCount(1)
    await expect(page.locator('.mobile-chapter-navigation')).toContainText('04 / 08')
    const navigationFlow = await page.evaluate(() => {
      const chapter = document.querySelector<HTMLElement>('#featured')!
      const content = chapter.querySelector<HTMLElement>('.mobile-chapter-content')!.getBoundingClientRect()
      const slot = chapter.querySelector<HTMLElement>('.mobile-chapter-navigation-slot')!.getBoundingClientRect()
      const navigation = chapter.querySelector<HTMLElement>('.mobile-chapter-navigation')!
      return { gap: slot.top - content.bottom, position: getComputedStyle(navigation).position }
    })
    expect(navigationFlow.gap).toBeGreaterThanOrEqual(0)
    expect(navigationFlow.position).toBe('relative')
    const heights = await page.locator('.language-toggle, .theme-toggle, .mobile-menu-button').evaluateAll((controls) => controls.map((control) => Math.round(control.getBoundingClientRect().height)))
    expect(new Set(heights).size).toBe(1)
    await page.getByRole('button', { name: 'Открыть меню' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const geometry = await dialog.evaluate((menu) => ({ width: menu.clientWidth, scrollWidth: menu.scrollWidth, height: menu.clientHeight, viewportHeight: innerHeight }))
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width)
    expect(geometry.height).toBe(geometry.viewportHeight)
    await page.getByRole('button', { name: 'Закрыть меню' }).click()
  })
}

for (const viewport of [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 844 }, { width: 430, height: 932 }]) {
  test(`mobile Directions 2x2 grid fits at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/#directions')
    await expect(page.locator('.mobile-direction-tile')).toHaveCount(4)
    await expect(page.locator('.mobile-chapter-navigation')).toContainText('03 / 08')
    await expect.poll(() => page.evaluate(() => {
      const grid = document.querySelector<HTMLElement>('.mobile-directions-grid')!.getBoundingClientRect()
      const slot = document.querySelector<HTMLElement>('.mobile-chapter-navigation-slot')!.getBoundingClientRect()
      return grid.bottom <= slot.top
    })).toBe(true)
    const metrics = await page.evaluate(() => {
      const chapter = document.querySelector<HTMLElement>('.mobile-directions-chapter')!
      const heading = document.querySelector<HTMLElement>('.mobile-directions-header')!.getBoundingClientRect()
      const grid = document.querySelector<HTMLElement>('.mobile-directions-grid')!.getBoundingClientRect()
      const slot = document.querySelector<HTMLElement>('.mobile-chapter-navigation-slot')!.getBoundingClientRect()
      const cards = [...document.querySelectorAll<HTMLElement>('.mobile-direction-tile')].map((card) => card.getBoundingClientRect())
      return { chapterScrolls: chapter.scrollHeight > chapter.clientHeight, headingBottom: heading.bottom, gridTop: grid.top, gridBottom: grid.bottom, slotTop: slot.top, cardsVisible: cards.every((card) => card.width > 0 && card.height > 0), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }
    })
    expect(metrics.chapterScrolls).toBe(false)
    expect(metrics.headingBottom).toBeLessThanOrEqual(metrics.gridTop)
    expect(metrics.gridBottom).toBeLessThanOrEqual(metrics.slotTop)
    expect(metrics.cardsVisible).toBe(true)
    expect(metrics.overflow).toBeLessThanOrEqual(0)
  })
}

test('mobile Contact focus clears the safe bottom navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#contact')
  const navigation = page.locator('.mobile-chapter-navigation')
  await expect(navigation).toContainText('08 / 08')
  await expect(page.locator('#contact .form-field')).toHaveCount(2)
  await expect(page.locator('#contact #name')).toHaveCount(0)
  const submit = page.locator('#contact .submit-button')
  await submit.scrollIntoViewIfNeeded()
  const submitGeometry = await page.evaluate(() => ({
    submitBottom: document.querySelector<HTMLElement>('#contact .submit-button')!.getBoundingClientRect().bottom,
    trackBottom: document.querySelector<HTMLElement>('.mobile-chapter-track')!.getBoundingClientRect().bottom,
    slotTop: document.querySelector<HTMLElement>('#contact .mobile-chapter-navigation-slot')!.getBoundingClientRect().top,
  }))
  expect(submitGeometry.submitBottom).toBeLessThanOrEqual(submitGeometry.trackBottom)
  expect(submitGeometry.submitBottom).toBeLessThan(submitGeometry.slotTop)
  await expect(navigation).not.toHaveClass(/is-hidden/)
  await page.getByLabel('Email или Telegram').focus()
  await expect(navigation).toHaveClass(/is-hidden/)
  await page.getByLabel('Email или Telegram').blur()
  await expect(navigation).not.toHaveClass(/is-hidden/)
})

test('mobile Process is one editorial list with a single expanded step', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#process')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('06 / 08')
  await expect(page.locator('#process .mobile-process-timeline article')).toHaveCount(6)
  await expect(page.locator('#process .mobile-process-timeline article.is-active button strong')).toHaveText('Разбираю бизнес-задачу')
  await expect(page.locator('#process .mobile-process-timeline article.is-active .mobile-process-detail > strong')).toHaveText('Краткий бриф и критерии успеха.')
  await expect(page.locator('#process .mobile-carousel-navigation, #process .mobile-step-rail, #process .mobile-carousel-count')).toHaveCount(0)
  await page.getByRole('button', { name: '04 Собираю прототип или MVP' }).click()
  await expect(page.locator('#process .mobile-process-timeline article.is-active button strong')).toHaveText('Собираю прототип или MVP')
  await expect(page.locator('#process .mobile-process-timeline article.is-active .mobile-process-detail > strong')).toHaveText('Прототип или рабочая версия продукта.')
  await expect(page.locator('#process .mobile-process-timeline article')).toHaveCount(6)
})

test('mobile chapter scroll compacts and restores the header brand', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#featured')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('04 / 08')
  await expect.poll(() => page.locator('.mobile-chapter-track').evaluate((node) => Math.round(node.scrollLeft))).toBe(1170)
  const chapter = page.locator('#featured')
  await chapter.evaluate((node) => { node.scrollTop = 80; node.dispatchEvent(new Event('scroll', { bubbles: true })) })
  await expect(page.locator('.site-header')).toHaveClass(/is-mobile-compact/)
  await expect(page.locator('.brand small')).toHaveCSS('opacity', '0')
  await chapter.evaluate((node) => { node.scrollTop = 0; node.dispatchEvent(new Event('scroll', { bubbles: true })) })
  await expect(page.locator('.site-header')).not.toHaveClass(/is-mobile-compact/)
})

test('mobile project CTAs stay above the shared chapter safe zone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const id of ['featured', 'more-projects']) {
    await page.goto(`/#${id}`)
    await expect(page.locator('.mobile-chapter-navigation')).toContainText(id === 'featured' ? '04 / 08' : '05 / 08')
    const cta = page.locator(`#${id} .project-card`).first().locator('.card-cta')
    await cta.scrollIntoViewIfNeeded()
    const geometry = await page.evaluate((chapterId) => ({
      ctaBottom: document.querySelector<HTMLElement>(`#${chapterId} .project-card .card-cta`)!.getBoundingClientRect().bottom,
      contentBottom: document.querySelector<HTMLElement>(`#${chapterId} .mobile-chapter-content`)!.getBoundingClientRect().bottom,
      slotTop: document.querySelector<HTMLElement>(`#${chapterId} .mobile-chapter-navigation-slot`)!.getBoundingClientRect().top,
      navPosition: getComputedStyle(document.querySelector<HTMLElement>(`#${chapterId} .mobile-chapter-navigation`)!).position,
    }), id)
    expect(geometry.ctaBottom).toBeLessThan(geometry.slotTop)
    expect(geometry.contentBottom).toBeLessThanOrEqual(geometry.slotTop)
    expect(geometry.navPosition).toBe('relative')
  }
})

test('mobile landscape keeps Directions and the global navigator usable', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 })
  await page.goto('/#directions')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('03 / 08')
  await expect(page.locator('.mobile-direction-tile')).toHaveCount(4)
  const geometry = await page.evaluate(() => {
    const grid = document.querySelector<HTMLElement>('.mobile-directions-grid')!.getBoundingClientRect()
    const slot = document.querySelector<HTMLElement>('.mobile-chapter-navigation-slot')!.getBoundingClientRect()
    const subtitle = document.querySelector<HTMLElement>('.brand small')!.getBoundingClientRect()
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      flowGap: slot.top - grid.bottom,
      subtitleHeight: subtitle.height,
    }
  })
  expect(geometry.overflow).toBeLessThanOrEqual(0)
  expect(geometry.flowGap).toBeGreaterThanOrEqual(0)
  expect(geometry.subtitleHeight).toBe(0)
})

test('responsive QA screenshots and critical geometry', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'One screenshot set is sufficient')
  const viewports = [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 844 }, { width: 430, height: 932 }, { width: 768, height: 900 }, { width: 1024, height: 900 }, { width: 1440, height: 900 }]
  for (const { width, height } of viewports) {
    await page.setViewportSize({ width, height })
    await page.goto(width < 768 ? '/#directions' : '/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    if (width < 768) {
      await expect(page.locator('.site-header')).toHaveCSS('height', '68px')
      await expect(page.locator('.main-nav')).toBeHidden()
      await expect(page.locator('.scene-navigation')).toBeHidden()
      const geometry = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
        controls: [...document.querySelectorAll<HTMLElement>('.language-toggle, .theme-toggle, .mobile-menu-button')].map((control) => control.getBoundingClientRect().height),
      }))
      expect(geometry.scroll).toBeLessThanOrEqual(geometry.client)
      expect(new Set(geometry.controls).size).toBe(1)
      await page.locator('.mobile-direction-tile img').first().evaluate((image: HTMLImageElement) => image.decode())
    }
    await page.screenshot({ path: `qa/screenshots/responsive-${width}.png`, fullPage: false })
  }
})

test('mobile menu and vertical project QA screenshots', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'One screenshot set is sufficient')
  await page.addInitScript(() => localStorage.setItem('anna-theme', 'dark'))
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Открыть меню' }).click()
  await page.screenshot({ path: 'qa/screenshots/mobile-navigation-320.png', fullPage: false })
  await page.getByRole('button', { name: 'Закрыть меню' }).click()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#featured')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('04 / 08')
  await expect.poll(() => page.locator('.mobile-chapter-track').evaluate((track) => Math.round(track.scrollLeft))).toBe(1170)
  await page.locator('#featured .project-cover img').first().evaluate((image: HTMLImageElement) => image.decode())
  await page.screenshot({ path: 'qa/screenshots/mobile-navigation-390.png', fullPage: false })
  await page.setViewportSize({ width: 430, height: 932 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.getByRole('button', { name: 'Открыть меню' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'qa/screenshots/mobile-navigation-430.png', fullPage: false })
})

test('mobile recomposition QA screenshots', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'One screenshot set is sufficient')
  await page.addInitScript(() => localStorage.setItem('anna-theme', 'dark'))
  const shots = [
    { width: 360, height: 740, hash: '', index: 0, counter: '01 / 08', path: 'qa/screenshots/mobile-recomposition-360.png' },
    { width: 390, height: 844, hash: '#process', index: 5, counter: '06 / 08', path: 'qa/screenshots/mobile-recomposition-390.png' },
    { width: 430, height: 932, hash: '#contact', index: 7, counter: '08 / 08', path: 'qa/screenshots/mobile-recomposition-430.png' },
  ]
  for (const shot of shots) {
    await page.setViewportSize({ width: shot.width, height: shot.height })
    await page.goto(`/${shot.hash}`)
    await expect(page.locator('.mobile-chapter-navigation')).toContainText(shot.counter)
    await expect.poll(() => page.locator('.mobile-chapter-track').evaluate((track) => Math.round(track.scrollLeft))).toBe(shot.width * shot.index)
    await page.screenshot({ path: shot.path, fullPage: false })
  }
})

test('homepage redesign review previews', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'One review capture set is sufficient')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('anna-theme', 'dark'))
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.screenshot({ path: 'qa/screenshots/home-desktop-dark-1440.png', fullPage: false })
  await page.getByRole('button', { name: 'Переключить тему' }).click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: 'qa/screenshots/home-desktop-light-1440.png', fullPage: false })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.screenshot({ path: 'qa/screenshots/home-mobile-light-390.png', fullPage: false })
  await page.getByRole('button', { name: 'Переключить тему' }).click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: 'qa/screenshots/home-mobile-dark-390.png', fullPage: false })
})

test('homepage correction pass keeps overlays out of content and captures review states', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'One correction capture set is sufficient')
  test.setTimeout(120_000)
  const waitForVisibleImages = async () => {
    await page.waitForFunction(() => [...document.images]
      .filter((image) => {
        const rect = image.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth
      })
      .every((image) => image.complete && image.naturalWidth > 0), undefined, { timeout: 10_000 })
  }

  await page.addInitScript(() => localStorage.setItem('anna-theme', 'dark'))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.scene-footer')).toContainText('ПРОКРУТИТЕ ДАЛЬШЕ')
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-desktop-dark-hero-1440.png', fullPage: false })
  await page.locator('#design').hover()
  await expect(page.locator('#design')).toHaveAttribute('data-state', 'active')
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-desktop-dark-hero-design-1440.png', fullPage: false })

  for (const shot of [
    { hash: '#skills', path: 'qa/screenshots/correction-desktop-dark-what-i-build-1440.png' },
    { hash: '#featured', path: 'qa/screenshots/correction-desktop-dark-featured-1440.png' },
    { hash: '#experience-education', path: 'qa/screenshots/correction-desktop-dark-experience-1440.png' },
    { hash: '#contact', path: 'qa/screenshots/correction-desktop-dark-contact-1440.png' },
  ]) {
    await page.goto(`/${shot.hash}`)
    await expect(page.locator('.scene-footer')).not.toContainText('ПРОКРУТИТЕ ДАЛЬШЕ')
    const collision = await page.evaluate(() => {
      const footer = document.querySelector<HTMLElement>('.scene-footer')!.getBoundingClientRect()
      const targets = [...document.querySelectorAll<HTMLElement>('.project-copy, .tags, .card-cta, .process-step, .timeline article, .education-list article, .contact-form, .site-footer')]
        .filter((node) => {
          const rect = node.getBoundingClientRect()
          return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight
        })
      return targets.some((node) => {
        const rect = node.getBoundingClientRect()
        return !(footer.right < rect.left || footer.left > rect.right || footer.bottom < rect.top || footer.top > rect.bottom)
      })
    })
    expect(collision).toBe(false)
    await waitForVisibleImages()
    await page.screenshot({ path: shot.path, fullPage: false })
  }

  await page.goto('/')
  await page.getByRole('button', { name: 'Переключить тему' }).click()
  await page.waitForTimeout(900)
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-desktop-light-hero-1440.png', fullPage: false })
  await page.locator('#design').hover()
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-desktop-light-hero-design-1440.png', fullPage: false })
  await page.goto('/#featured')
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-desktop-light-featured-1440.png', fullPage: false })

  await page.setViewportSize({ width: 1440, height: 768 })
  await page.goto('/')
  await expect(page.locator('.hero-panel')).toHaveCount(4)
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-desktop-short-hero-1440x768.png', fullPage: false })
  await page.goto('/#featured')
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-desktop-short-featured-1440x768.png', fullPage: false })

  await page.evaluate(() => localStorage.setItem('anna-theme', 'dark'))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.reload()
  await expect(page.locator('.mobile-hero-system>img')).toHaveCount(1)
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-mobile-dark-hero-390.png', fullPage: false })
  await page.goto('/#skills')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('02 / 08')
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-mobile-dark-what-i-build-390.png', fullPage: false })
  await page.goto('/#featured')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('04 / 08')
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-mobile-dark-featured-390.png', fullPage: false })
  await page.goto('/#contact')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('08 / 08')
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-mobile-dark-contact-390.png', fullPage: false })
  await page.getByRole('button', { name: 'Переключить тему' }).click()
  await page.waitForTimeout(900)
  await page.goto('/')
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-mobile-light-hero-390.png', fullPage: false })
  await page.goto('/#featured')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('04 / 08')
  await waitForVisibleImages()
  await page.screenshot({ path: 'qa/screenshots/correction-mobile-light-featured-390.png', fullPage: false })
})

test('mobile polish holds across the required responsive matrix', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'One responsive-matrix pass is sufficient')
  test.setTimeout(60_000)
  const viewports = [
    { width: 320, height: 568 },
    { width: 360, height: 740 },
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 393, height: 852 },
    { width: 402, height: 874 },
    { width: 430, height: 932 },
    { width: 480, height: 960 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.evaluate(() => document.fonts.ready.then(() => undefined))
    const geometry = await page.evaluate(() => {
      const teaser = document.querySelector<HTMLElement>('.mobile-project-teaser')
      const badge = teaser?.querySelector<HTMLElement>('.status-badge')
      const controls = [...document.querySelectorAll<HTMLElement>('.language-toggle, .theme-toggle, .mobile-menu-button')]
      const visual = document.querySelector<HTMLElement>('.mobile-hero-system')
      const heading = document.querySelector<HTMLElement>('.mobile-hero-copy h1')
      const chapterNav = document.querySelector<HTMLElement>('#chapter-hero .mobile-chapter-navigation')
      const heroActions = [...document.querySelectorAll<HTMLElement>('.mobile-hero-actions button')]
      const directionArrows = [...document.querySelectorAll<HTMLElement>('.mobile-hero-state-arrow')]

      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        mobileVideoCount: document.querySelectorAll('.mobile-hero video').length,
        heroImageCount: document.querySelectorAll('.mobile-hero-system>img').length,
        heroTabCount: document.querySelectorAll('.mobile-hero-system-tabs [role="tab"]').length,
        selectedHeroTabs: document.querySelectorAll('.mobile-hero-system-tabs [aria-selected="true"]').length,
        heroActionHeights: heroActions.map((item) => item.getBoundingClientRect().height),
        heroActionWidths: heroActions.map((item) => item.getBoundingClientRect().width),
        directionArrowSizes: directionArrows.map((item) => ({ width: item.getBoundingClientRect().width, height: item.getBoundingClientRect().height })),
        visualWidth: visual?.getBoundingClientRect().width ?? 0,
        visualRadius: visual ? getComputedStyle(visual).borderRadius : '',
        buildArticleCount: document.querySelectorAll('.mobile-skills-accordion article').length,
        openBuildCount: document.querySelectorAll('.mobile-skills-accordion article.is-open').length,
        activeOutputCount: document.querySelectorAll('.mobile-skills-accordion article.is-open .mobile-build-output').length,
        featuredLeadId: document.querySelector<HTMLElement>('#featured .project-card')?.dataset.projectId ?? '',
        featuredStatementCount: document.querySelectorAll('#featured .featured-system-statement').length,
        teaserHeight: teaser?.getBoundingClientRect().height ?? 0,
        teaserBadgeDisplay: badge ? getComputedStyle(badge).display : 'none',
        controlHeights: controls.map((control) => control.getBoundingClientRect().height),
        headingFontSize: heading ? Number.parseFloat(getComputedStyle(heading).fontSize) : 0,
        headingLines: heading ? Math.round(heading.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(heading).lineHeight)) : 0,
        chapterNavBorder: chapterNav ? getComputedStyle(chapterNav).borderTopWidth : '',
        directionSubtitleGaps: [...document.querySelectorAll<HTMLElement>('.mobile-direction-tile-copy>span')].map((item) => getComputedStyle(item).marginTop),
        tagPaddings: [...document.querySelectorAll<HTMLElement>('.mobile-projects-section .tags span')].map((item) => getComputedStyle(item).padding),
        processRowHeights: [...document.querySelectorAll<HTMLElement>('.mobile-process-timeline article>button')].map((item) => item.getBoundingClientRect().height),
        buildAccentRadius: getComputedStyle(document.querySelector<HTMLElement>('.mobile-skills-accordion article.is-open')!, '::before').borderRadius,
        contactFormMargin: getComputedStyle(document.querySelector<HTMLElement>('.mobile-contact-chapter .contact-form')!).marginTop,
      }
    })

    expect(geometry.overflow).toBeLessThanOrEqual(0)
    expect(geometry.mobileVideoCount).toBe(0)
    expect(geometry.heroImageCount).toBe(1)
    expect(geometry.heroTabCount).toBe(4)
    expect(geometry.selectedHeroTabs).toBe(1)
    expect(geometry.heroActionHeights.every((height) => height >= 44)).toBe(true)
    expect(geometry.directionArrowSizes.every((size) => size.width >= 44 && size.height >= 44)).toBe(true)
    expect(geometry.buildArticleCount).toBe(4)
    expect(geometry.openBuildCount).toBe(1)
    expect(geometry.activeOutputCount).toBe(2)
    expect(geometry.featuredLeadId).toBe('dao-system')
    expect(geometry.featuredStatementCount).toBe(4)
    expect(geometry.teaserHeight).toBeLessThanOrEqual(84)
    expect(geometry.teaserBadgeDisplay).toBe('none')
    expect(new Set(geometry.controlHeights).size).toBe(1)
    expect(Math.abs(geometry.heroActionWidths.reduce((sum, width) => sum + width, 0) + 7 - geometry.visualWidth)).toBeLessThanOrEqual(2)
    expect(geometry.visualRadius).toBe('20px')
    expect(geometry.chapterNavBorder).toBe('0px')
    expect(new Set(geometry.directionSubtitleGaps)).toEqual(new Set(['11px']))
    expect(new Set(geometry.tagPaddings).size).toBe(1)
    expect(new Set(geometry.processRowHeights)).toEqual(new Set([60]))
    expect(geometry.buildAccentRadius).not.toBe('0px')
    expect(geometry.contactFormMargin).toBe('38px')
    expect(geometry.headingLines).toBeLessThanOrEqual(8)

    if (viewport.width === 390) {
      const actions = await page.locator('.mobile-hero-actions').boundingBox()
      expect((actions?.y ?? viewport.height) + (actions?.height ?? 0)).toBeLessThanOrEqual(viewport.height)
      expect(geometry.headingFontSize).toBeLessThanOrEqual(30)
    }
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#skills')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('02 / 08')
  await expect(page.locator('#skills article.is-open .mobile-build-output')).toHaveCount(2)
  await page.goto('/#directions')
  await expect(page.locator('.mobile-chapter-navigation')).toContainText('03 / 08')
  await expect(page.locator('.mobile-direction-tile')).toHaveCount(4)

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const type = await page.evaluate(() => {
    const main = getComputedStyle(document.querySelector<HTMLElement>('.mobile-contact-chapter > .mobile-chapter-content .contact-display-heading')!)
    const form = getComputedStyle(document.querySelector<HTMLElement>('.mobile-contact-chapter .contact-form .contact-display-heading')!)
    return {
      mainFamily: main.fontFamily,
      formFamily: form.fontFamily,
      mainWeight: main.fontWeight,
      formWeight: form.fontWeight,
      mainTracking: Number.parseFloat(main.letterSpacing) / Number.parseFloat(main.fontSize),
      formTracking: Number.parseFloat(form.letterSpacing) / Number.parseFloat(form.fontSize),
      mainLeading: Number.parseFloat(main.lineHeight) / Number.parseFloat(main.fontSize),
      formLeading: Number.parseFloat(form.lineHeight) / Number.parseFloat(form.fontSize),
    }
  })
  expect(type.mainFamily).toBe(type.formFamily)
  expect(type.mainWeight).toBe(type.formWeight)
  expect(type.mainTracking).toBeCloseTo(type.formTracking, 2)
  expect(type.mainLeading).toBeCloseTo(type.formLeading, 2)

  const readThemeGeometry = () => page.evaluate(() => ({
    primaryHeight: document.querySelector<HTMLElement>('.mobile-hero-actions .is-primary')!.getBoundingClientRect().height,
    visualRadius: getComputedStyle(document.querySelector<HTMLElement>('.mobile-hero-system')!).borderRadius,
    directionRadius: getComputedStyle(document.querySelector<HTMLElement>('.mobile-direction-tile')!).borderRadius,
    projectPadding: getComputedStyle(document.querySelector<HTMLElement>('.mobile-projects-section .project-copy')!).padding,
    tagPadding: getComputedStyle(document.querySelector<HTMLElement>('.mobile-projects-section .tags span')!).padding,
    processHeight: document.querySelector<HTMLElement>('.mobile-process-timeline article>button')!.getBoundingClientRect().height,
    expertiseHeight: document.querySelector<HTMLElement>('.mobile-skills-accordion h3 button')!.getBoundingClientRect().height,
    tabsHeight: document.querySelector<HTMLElement>('.mobile-experience-tabs')!.getBoundingClientRect().height,
    submitHeight: document.querySelector<HTMLElement>('.mobile-contact-chapter .submit-button')!.getBoundingClientRect().height,
  }))
  const lightDarkGeometryBefore = await readThemeGeometry()
  const themeBefore = await page.locator('html').getAttribute('data-theme')
  await page.locator('.theme-toggle').click()
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', themeBefore ?? '')
  expect(await readThemeGeometry()).toEqual(lightDarkGeometryBefore)
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  const reducedMotion = await page.evaluate(() => ({
    image: getComputedStyle(document.querySelector<HTMLElement>('.mobile-hero-system>img')!).animationName,
    pulse: getComputedStyle(document.querySelector<HTMLElement>('.mobile-hero-system-pulse')!).animationName,
  }))
  expect(reducedMotion.image).toBe('none')
  expect(reducedMotion.pulse).toBe('none')
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
    const vercelPreviewAbort = request.url().endsWith('/.well-known/vercel/jwe') && request.failure()?.errorText === 'net::ERR_ABORTED'
    if (!intentionalMediaAbort && !vercelPreviewAbort) failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`)
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
