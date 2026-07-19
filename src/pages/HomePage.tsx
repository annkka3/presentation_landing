import { useEffect, useRef, useState } from 'react'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../sections/Hero/Hero'
import { TrustMarquee } from '../sections/TrustMarquee/TrustMarquee'
import { FeaturedCases } from '../sections/FeaturedCases/FeaturedCases'
import { MoreProjects } from '../sections/MoreProjects/MoreProjects'
import { Skills } from '../sections/Skills/Skills'
import { Process } from '../sections/Process/Process'
import { Experience } from '../sections/Experience/Experience'
import { Contact } from '../sections/Contact/Contact'
import { useApp } from '../app/AppContext'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MobileHomePage } from './MobileHomePage'

const scenes = [
  { id: 'chapter-hero' },
  { id: 'featured' },
  { id: 'more-projects' },
  { id: 'process' },
  { id: 'skills' },
  { id: 'experience-education' },
  { id: 'contact' },
] as const

function DesktopHomePage() {
  const { t } = useApp()
  const containerRef = useRef<HTMLElement>(null)
  const [activeScene, setActiveScene] = useState(0)
  const chapterLabels = [t.chapterHero, t.chapterFeatured, t.chapterProjects, t.chapterProcess, t.chapterExpertise, t.chapterExperience, t.chapterContact]

  useEffect(() => {
    document.documentElement.dataset.page = 'home'
    const container = containerRef.current
    if (!container) return
    let frame = 0

    const updateScene = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const containerStyle = getComputedStyle(container)
        const usesContainerScroll = containerStyle.overflowY === 'auto' || containerStyle.overflowY === 'scroll'
        const containerTop = usesContainerScroll ? container.getBoundingClientRect().top : 0
        const viewportHeight = usesContainerScroll ? container.clientHeight : window.innerHeight
        const nodes = scenes.map(({ id }) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node))
        let closestIndex = 0
        let closestDistance = Number.POSITIVE_INFINITY

        nodes.forEach((node, index) => {
          const distance = (node.getBoundingClientRect().top - containerTop) / Math.max(viewportHeight, 1)
          const absoluteDistance = Math.abs(distance)
          if (absoluteDistance < closestDistance) {
            closestDistance = absoluteDistance
            closestIndex = index
          }
          node.style.setProperty('--parallax-y', `${Math.max(-20, Math.min(20, distance * 20))}px`)
        })

        setActiveScene((current) => current === closestIndex ? current : closestIndex)
      })
    }

    const scrollToCurrentAnchor = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const id = decodeURIComponent(window.location.hash.slice(1))
        if (id) document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'auto' })
        else container.scrollTo({ top: 0, behavior: 'auto' })
        updateScene()
      })
    }

    container.addEventListener('scroll', updateScene, { passive: true })
    addEventListener('scroll', updateScene, { passive: true })
    addEventListener('resize', updateScene)
    scrollToCurrentAnchor()
    addEventListener('hashchange', scrollToCurrentAnchor)
    return () => {
      cancelAnimationFrame(frame)
      container.removeEventListener('scroll', updateScene)
      removeEventListener('scroll', updateScene)
      removeEventListener('resize', updateScene)
      removeEventListener('hashchange', scrollToCurrentAnchor)
      if (document.documentElement.dataset.page === 'home') delete document.documentElement.dataset.page
    }
  }, [])

  return <>
    <main id="main" className="scroll-container" ref={containerRef} tabIndex={0} aria-label="Portfolio scenes">
      <div className={`home-chapter home-scene hero-scene ${activeScene === 0 ? 'is-scene-active' : ''}`} id="chapter-hero" data-home-chapter="01"><Hero /><TrustMarquee /></div>
      <div className={`home-chapter home-scene featured-scene ${activeScene === 1 ? 'is-scene-active' : ''}`} id="featured" data-home-chapter="02"><FeaturedCases /></div>
      <div className={`home-chapter home-scene cases-scene ${activeScene === 2 ? 'is-scene-active' : ''}`} id="more-projects" data-home-chapter="03"><MoreProjects /></div>
      <div className={`home-chapter home-scene process-scene ${activeScene === 3 ? 'is-scene-active' : ''}`} id="process" data-home-chapter="04"><Process /></div>
      <div className={`home-chapter home-scene skills-scene ${activeScene === 4 ? 'is-scene-active' : ''}`} id="skills" data-home-chapter="05"><Skills /></div>
      <div className={`home-chapter home-scene experience-scene ${activeScene === 5 ? 'is-scene-active' : ''}`} id="experience-education" data-home-chapter="06"><Experience /></div>
      <div className={`home-chapter home-scene contact-scene ${activeScene === 6 ? 'is-scene-active' : ''}`} id="contact" data-home-chapter="07"><Contact /><Footer /></div>
    </main>
    <nav className="scene-navigation" aria-label={t.chapterNavigation}>
      <span className="scene-navigation-current" aria-hidden="true">{String(activeScene + 1).padStart(2, '0')}</span>
      <div className="scene-navigation-track">
        <span className="scene-navigation-line" aria-hidden="true" />
        <span className="scene-navigation-dot" aria-hidden="true" style={{ '--chapter-progress': activeScene / (scenes.length - 1) } as React.CSSProperties} />
        <div className="scene-navigation-targets">
          {scenes.map((scene, index) => <a key={scene.id} href={`#${scene.id}`} aria-label={`${t.goToChapter} ${index + 1} ${t.chapterOf} ${scenes.length}`} aria-current={activeScene === index ? 'step' : undefined}><span>{chapterLabels[index]}</span></a>)}
        </div>
      </div>
      <span className="scene-navigation-total" aria-hidden="true">07</span>
    </nav>
    <button
      className={`scene-footer ${activeScene === scenes.length - 1 ? 'is-final' : ''}`}
      type="button"
      aria-label={activeScene === scenes.length - 1 ? t.top : `${t.goToChapter} ${activeScene + 2} ${t.chapterOf} ${scenes.length}`}
      onClick={() => { window.location.hash = scenes[activeScene === scenes.length - 1 ? 0 : activeScene + 1].id }}
    >
      <span>{String(activeScene + 1).padStart(2, '0')} / 07</span><span>{activeScene === scenes.length - 1 ? `${t.backToTop} ↑` : `${t.scrollExplore} ↓`}</span>
    </button>
  </>
}

export default function HomePage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <MobileHomePage /> : <DesktopHomePage />
}
