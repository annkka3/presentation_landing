import { useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from '../../app/AppContext'
import { DESIGN_APPROVED_CHAPTERS } from './designApprovedContent'
import { DesignBrandSystems } from './components/DesignBrandSystems'
import { DesignChapterRail } from './components/DesignChapterRail'
import { DesignDirections } from './components/DesignDirections'
import { DesignFashionPipeline } from './components/DesignFashionPipeline'
import { DesignHero } from './components/DesignHero'
import { DesignMarketplaceSystem } from './components/DesignMarketplaceSystem'
import './DesignApprovedPage.css'

export default function DesignApprovedPage() {
  const { locale } = useApp()
  const pageRef = useRef<HTMLElement>(null)
  const [activeChapter, setActiveChapter] = useState(0)

  const navigateToChapter = useCallback((index: number) => {
    if (index > 4) return
    const chapter = DESIGN_APPROVED_CHAPTERS[index]
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
    if (hash && DESIGN_APPROVED_CHAPTERS.slice(0, 5).some((chapter) => chapter.id === hash)) {
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }))
    }
  }, [])

  useEffect(() => {
    const handleChapterKeys = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('a, button, input, textarea, select, [contenteditable="true"]')) return
      if (!['PageDown', 'PageUp', 'Home'].includes(event.key)) return
      event.preventDefault()
      const hashIndex = DESIGN_APPROVED_CHAPTERS.slice(0, 5).findIndex((chapter) => `#${chapter.id}` === location.hash)
      const currentIndex = hashIndex >= 0 ? hashIndex : activeChapter
      if (event.key === 'Home') navigateToChapter(0)
      else navigateToChapter(Math.max(0, Math.min(4, currentIndex + (event.key === 'PageDown' ? 1 : -1))))
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
      <DesignChapterRail locale={locale} activeChapter={activeChapter} onNavigate={navigateToChapter} />
    </main>
  )
}
