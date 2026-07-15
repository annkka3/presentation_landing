import { useEffect } from 'react'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../sections/Hero/Hero'
import { TrustMarquee } from '../sections/TrustMarquee/TrustMarquee'
import { FeaturedCases } from '../sections/FeaturedCases/FeaturedCases'
import { MoreProjects } from '../sections/MoreProjects/MoreProjects'
import { Skills } from '../sections/Skills/Skills'
import { Process } from '../sections/Process/Process'
import { Experience } from '../sections/Experience/Experience'
import { Contact } from '../sections/Contact/Contact'

export default function HomePage() {
  useEffect(() => {
    document.documentElement.dataset.page = 'home'
    let frame = 0
    const scrollToCurrentAnchor = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const id = decodeURIComponent(window.location.hash.slice(1))
        if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' })
      })
    }
    scrollToCurrentAnchor()
    addEventListener('hashchange', scrollToCurrentAnchor)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('hashchange', scrollToCurrentAnchor)
      if (document.documentElement.dataset.page === 'home') delete document.documentElement.dataset.page
    }
  }, [])

  return <main id="main">
    <div className="home-chapter" id="chapter-hero" data-home-chapter="01"><Hero /><TrustMarquee /></div>
    <div className="home-chapter" id="featured" data-home-chapter="02"><FeaturedCases /></div>
    <div className="home-chapter" id="more-projects" data-home-chapter="03"><MoreProjects /></div>
    <div className="home-chapter" id="expertise-process" data-home-chapter="04"><Skills /><Process /></div>
    <div className="home-chapter" id="experience-education" data-home-chapter="05"><Experience /></div>
    <div className="home-chapter" id="contact" data-home-chapter="06"><Contact /><Footer /></div>
  </main>
}
