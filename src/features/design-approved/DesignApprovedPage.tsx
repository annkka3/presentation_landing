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

export default function DesignApprovedPage() {
  const { locale } = useApp()
  const pageRef = useRef<HTMLElement>(null)
  const [activeChapter, setActiveChapter] = useState(0)

  const navigateToChapter = useCallback((index: number) => {
    const chapter = DESIGN_APPROVED_CHAPTERS[index]
    if (!chapter) return
    pageRef.current?.querySelectorAll('video').forEach((video) => video.pause())
    document.getElementById(chapter.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${chapter.id}`)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.page = 'design-approved-preview'
    document.title = locale === 'ru' ? 'Дизайн и визуальные системы — Anna Gromyko' : 'Design & Visual Systems — Anna Gromyko'
    return () => {
      if (document.documentElement.dataset.page === 'design-approved-preview') delete document.documentElement.dataset.page
    }
  }, [locale])

  useEffect(() => {
    const root = pageRef.current
    if (!root) return
    const sections = [...root.querySelectorAll<HTMLElement>('[data-chapter]')]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveChapter(Number((visible.target as HTMLElement).dataset.chapter) - 1)
    }, { root, threshold: [0.35, 0.55, 0.75] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const hash = decodeURIComponent(location.hash.slice(1))
    if (hash && DESIGN_APPROVED_CHAPTERS.some((chapter) => chapter.id === hash)) {
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }))
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
