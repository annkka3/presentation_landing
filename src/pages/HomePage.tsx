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

const scenes = [
  { id: 'chapter-hero', label: 'Hero' },
  { id: 'featured', label: 'Featured' },
  { id: 'more-projects', label: 'Cases' },
  { id: 'process', label: 'Process' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience-education', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

export default function HomePage() {
  const containerRef = useRef<HTMLElement>(null)
  const [activeScene, setActiveScene] = useState(0)

  useEffect(() => {
    document.documentElement.dataset.page = 'home'
    const container = containerRef.current
    if (!container) return
    let frame = 0

    const updateScene = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const containerTop = container.getBoundingClientRect().top
        const nodes = scenes.map(({ id }) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node))
        let closestIndex = 0
        let closestDistance = Number.POSITIVE_INFINITY

        nodes.forEach((node, index) => {
          const distance = (node.getBoundingClientRect().top - containerTop) / Math.max(container.clientHeight, 1)
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
    scrollToCurrentAnchor()
    addEventListener('hashchange', scrollToCurrentAnchor)
    return () => {
      cancelAnimationFrame(frame)
      container.removeEventListener('scroll', updateScene)
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
    <nav className="scene-navigation" aria-label="Portfolio scenes">
      {scenes.map((scene, index) => <a key={scene.id} href={`#${scene.id}`} aria-label={`${String(index + 1).padStart(2, '0')} — ${scene.label}`} aria-current={activeScene === index ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><i aria-hidden="true" /></a>)}
    </nav>
    <div className="scene-footer" aria-hidden="true"><span>{String(activeScene + 1).padStart(2, '0')} / 07</span><span>Scroll to explore ↓</span></div>
  </>
}
