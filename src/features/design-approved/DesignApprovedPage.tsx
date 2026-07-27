import { useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from '../../app/AppContext'
import { DESIGN_APPROVED_CHAPTERS } from './designApprovedContent'
import { DesignBrandSystems } from './components/DesignBrandSystems'
import { DesignChapterRail } from './components/DesignChapterRail'
import { DesignCommercialCases } from './components/DesignCommercialCases'
import { DesignDirections } from './components/DesignDirections'
import { DesignFashionPipeline } from './components/DesignFashionPipeline'
import { DesignHero } from './components/DesignHero'
import { DesignMarketplaceSystem } from './components/DesignMarketplaceSystem'
import { DesignMotion } from './components/DesignMotion'
import { DesignPrinciplesProcess } from './components/DesignPrinciplesProcess'
import { DesignToolsCta } from './components/DesignToolsCta'
import { DesignVisualSystemRail } from './components/DesignVisualSystemRail'
import './DesignApprovedPage.css'
import './DesignApprovedMilestoneC.css'
import './DesignApprovedPolish.css'

const DESIGN_CHARACTER_SELECTOR = [
  '.floating-character',
  '.pixel-character',
  '.site-character',
  '.mascot',
  '[data-floating-character]',
  '[data-character="pixel"]',
  '[class*="character-wrapper"]',
  '[class*="character-badge"]',
].join(',')

export default function DesignApprovedPage() {
  const { locale } = useApp()
  const pageRef = useRef<HTMLElement>(null)
  const chapterNavigationTargetRef = useRef(
    DESIGN_APPROVED_CHAPTERS.find((chapter) => `#${chapter.id}` === location.hash)?.id ?? null,
  )
  const [activeChapter, setActiveChapter] = useState(() => {
    const index = DESIGN_APPROVED_CHAPTERS.findIndex((chapter) => `#${chapter.id}` === location.hash)
    return index >= 0 ? index : 0
  })

  const navigateToChapter = useCallback((index: number) => {
    const chapter = DESIGN_APPROVED_CHAPTERS[index]
    if (!chapter) return
    chapterNavigationTargetRef.current = chapter.id
    pageRef.current?.querySelectorAll('video').forEach((video) => video.pause())
    document.getElementById(chapter.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${chapter.id}`)
    setActiveChapter(index)
    dispatchEvent(new CustomEvent('design-approved-chapter-focus', { detail: { id: chapter.id } }))
  }, [])

  useEffect(() => {
    document.documentElement.dataset.page = 'design'
    const isDesignPath = () => location.pathname === '/design' || location.pathname.startsWith('/design/')
    const removeCharacterNodes = (root: ParentNode = document) => {
      if (!isDesignPath()) return
      root.querySelectorAll(DESIGN_CHARACTER_SELECTOR).forEach((node) => node.remove())
    }
    removeCharacterNodes()
    const characterGuard = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches(DESIGN_CHARACTER_SELECTOR)) node.remove()
          else removeCharacterNodes(node)
        })
      })
    })
    characterGuard.observe(document.body, { childList: true, subtree: true })
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) canonical.href = `${location.origin}/design`
    return () => {
      characterGuard.disconnect()
      if (document.documentElement.dataset.page === 'design') delete document.documentElement.dataset.page
      if (canonical) canonical.href = `${location.origin}/`
      document.title = 'Anna Gromyko — AI Product Builder'
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
      const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
      if (description) description.content = document.documentElement.lang === 'ru'
        ? 'Проектирование и запуск цифровых продуктов на стыке бизнес-логики, UX, AI, автоматизации и данных.'
        : 'Designing and shipping digital products at the intersection of business logic, UX, AI, automation, and data.'
      if (ogTitle) ogTitle.content = 'Anna Gromyko — AI Product Builder'
      if (ogDescription) ogDescription.content = 'Digital products at the intersection of business logic, UX, AI, automation, and data.'
    }
  }, [])

  useEffect(() => {
    const title = locale === 'ru' ? 'Дизайн и визуальные системы — Anna Gromyko' : 'Design & Visual Systems — Anna Gromyko'
    const descriptionText = locale === 'ru'
      ? 'UX/UI, лендинги, конверсионные воронки, marketplace и commerce-системы, brand identity, art direction, AI motion и visual storytelling.'
      : 'UX/UI, landing pages, conversion funnels, marketplace and commerce systems, brand identity, art direction, AI motion, and visual storytelling.'
    document.title = title
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
    if (description) description.content = descriptionText
    if (ogTitle) ogTitle.content = title
    if (ogDescription) ogDescription.content = descriptionText
  }, [locale])

  useEffect(() => {
    const root = pageRef.current
    if (!root) return
    const sections = [...root.querySelectorAll<HTMLElement>('[data-chapter]')]
    const observer = new IntersectionObserver(() => {
      const rootRect = root.getBoundingClientRect()
      const visible = sections
        .map((section) => {
          const rect = section.getBoundingClientRect()
          const visibleHeight = Math.max(0, Math.min(rect.bottom, rootRect.bottom) - Math.max(rect.top, rootRect.top))
          return { section, visibleHeight }
        })
        .sort((a, b) => b.visibleHeight - a.visibleHeight)[0]
      const navigationTarget = chapterNavigationTargetRef.current
      if (navigationTarget) {
        const targetVisibility = sections
          .map((section) => {
            const rect = section.getBoundingClientRect()
            const visibleHeight = Math.max(0, Math.min(rect.bottom, rootRect.bottom) - Math.max(rect.top, rootRect.top))
            return {
              id: section.id,
              ratio: visibleHeight / Math.max(1, Math.min(rect.height, rootRect.height)),
            }
          })
          .find(({ id }) => id === navigationTarget)
        if (!targetVisibility || targetVisibility.ratio < 0.5) return
        chapterNavigationTargetRef.current = null
      }
      if (visible?.visibleHeight) setActiveChapter(Number(visible.section.dataset.chapter) - 1)
    }, { root, threshold: [0.35, 0.55, 0.75] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let firstFrame = 0
    let secondFrame = 0
    const focusChapter = () => {
        const hash = decodeURIComponent(location.hash.slice(1))
        const chapter = DESIGN_APPROVED_CHAPTERS.find((item) => item.id === hash) ?? DESIGN_APPROVED_CHAPTERS[0]
        const section = document.getElementById(chapter.id)
        chapterNavigationTargetRef.current = chapter.id
        section?.scrollIntoView?.({ block: 'start' })
        if (section) {
          section.tabIndex = -1
          section.focus({ preventScroll: true })
        }
        const index = DESIGN_APPROVED_CHAPTERS.findIndex((item) => item.id === chapter.id)
        setActiveChapter(index >= 0 ? index : 0)
        dispatchEvent(new CustomEvent('design-approved-chapter-focus', { detail: { id: chapter.id } }))
    }
    const scheduleFocus = () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(focusChapter)
      })
    }
    scheduleFocus()
    addEventListener('load', scheduleFocus)
    addEventListener('pageshow', scheduleFocus)
    addEventListener('hashchange', scheduleFocus)
    addEventListener('popstate', scheduleFocus)
    return () => {
      removeEventListener('load', scheduleFocus)
      removeEventListener('pageshow', scheduleFocus)
      removeEventListener('hashchange', scheduleFocus)
      removeEventListener('popstate', scheduleFocus)
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [])

  useEffect(() => {
    const handleChapterKeys = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('a, button, input, textarea, select, [contenteditable="true"]')) return
      if (!['PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      const hashIndex = DESIGN_APPROVED_CHAPTERS.findIndex((chapter) => `#${chapter.id}` === location.hash)
      const currentIndex = hashIndex >= 0 ? hashIndex : activeChapter
      if (event.key === 'Home') navigateToChapter(0)
      else if (event.key === 'End') navigateToChapter(9)
      else navigateToChapter(Math.max(0, Math.min(9, currentIndex + (event.key === 'PageDown' ? 1 : -1))))
    }
    window.addEventListener('keydown', handleChapterKeys)
    return () => window.removeEventListener('keydown', handleChapterKeys)
  }, [activeChapter, navigateToChapter])

  return (
    <main ref={pageRef} id="main" className="design-approved-page" aria-label="Design portfolio preview">
      <DesignHero />
      <DesignDirections locale={locale} />
      <DesignMarketplaceSystem locale={locale} />
      <DesignFashionPipeline locale={locale} />
      <DesignBrandSystems locale={locale} />
      <DesignVisualSystemRail locale={locale} />
      <DesignCommercialCases locale={locale} />
      <DesignMotion locale={locale} />
      <DesignPrinciplesProcess locale={locale} />
      <DesignToolsCta locale={locale} />
      <DesignChapterRail locale={locale} activeChapter={activeChapter} onNavigate={navigateToChapter} />
    </main>
  )
}
