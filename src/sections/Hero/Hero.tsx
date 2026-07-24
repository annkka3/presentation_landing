import { useEffect, useRef, useState, type FocusEvent } from 'react'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { heroModes } from '../../data/portfolio'
import { HeroOverlay } from './HeroOverlay'

interface NetworkInformationWithSaveData extends EventTarget {
  saveData?: boolean
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformationWithSaveData
}

function heroVideoIsAllowed() {
  const connection = (navigator as NavigatorWithConnection).connection
  return !matchMedia('(max-width: 767px)').matches
    && !matchMedia('(pointer: coarse)').matches
    && !matchMedia('(prefers-reduced-motion: reduce)').matches
    && connection?.saveData !== true
}

export function Hero() {
  const { locale, t } = useApp()
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null)
  const [focusedPanel, setFocusedPanel] = useState<number | null>(null)
  const [videoAllowed, setVideoAllowed] = useState(heroVideoIsAllowed)
  const [heroVisible, setHeroVisible] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(!document.hidden)
  const [playingPanel, setPlayingPanel] = useState<number | null>(null)
  const heroRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const timer = useRef<number | undefined>(undefined)
  const activePanel = focusedPanel ?? hoveredPanel
  const activateHover = (index: number) => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setHoveredPanel(index), 140)
  }
  const clearHover = () => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setHoveredPanel(null), 90)
  }
  const focusPanel = (index: number) => {
    clearTimeout(timer.current)
    setFocusedPanel(index)
  }
  const leaveHeroFocus = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget
    if (next instanceof Node && event.currentTarget.contains(next)) return
    setFocusedPanel(null)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    const mediaQueries = [
      matchMedia('(max-width: 767px)'),
      matchMedia('(pointer: coarse)'),
      matchMedia('(prefers-reduced-motion: reduce)'),
    ]
    const connection = (navigator as NavigatorWithConnection).connection
    const update = () => setVideoAllowed(heroVideoIsAllowed())
    mediaQueries.forEach((media) => media.addEventListener('change', update))
    connection?.addEventListener('change', update)
    update()
    return () => {
      mediaQueries.forEach((media) => media.removeEventListener('change', update))
      connection?.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const node = heroRef.current
    if (!node || !('IntersectionObserver' in window)) {
      setHeroVisible(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      setHeroVisible(entry.isIntersecting && entry.intersectionRatio >= 0.25)
    }, { threshold: [0, 0.25] })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video || (videoAllowed && heroVisible && documentVisible && activePanel === index)) return
      video.pause()
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) video.currentTime = 0
    })

    if (!videoAllowed || !heroVisible || !documentVisible || activePanel === null) return
    const video = videoRefs.current[activePanel]
    if (!video) return
    video.muted = true
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) video.currentTime = 0
    const playback = video.play()
    playback?.catch(() => setPlayingPanel((current) => current === activePanel ? null : current))
  }, [activePanel, documentVisible, heroVisible, videoAllowed])

  useEffect(() => () => {
    videoRefs.current.forEach((video) => {
      if (!video) return
      video.pause()
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) video.currentTime = 0
    })
  }, [])

  return <section className="hero-section" id="top" ref={heroRef}>
    <Container className="hero-layout">
      <div className="hero-copy">
        <span className="hero-eyebrow">{t.heroEyebrow}</span>
        <h1>{t.heroTitle}</h1>
        <div className="hero-intro">
          <p className="hero-subtitle">{t.heroSubtitle}</p>
          <div className="hero-actions">
            <a className="hero-action hero-action--primary" href="#skills">{t.heroPrimary}<span aria-hidden="true">↓</span></a>
            <a className="hero-action hero-action--secondary" href="#featured">{t.heroSecondary}<span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-system-caption" aria-hidden="true"><span>CONNECTED SYSTEM / 04 LAYERS</span><span>STRUCTURE → OUTCOME</span></div>
        <div className={`hero-panels ${activePanel !== null ? 'has-active' : ''}`} role="group" aria-label={t.heroGroup} onMouseLeave={clearHover} onBlur={leaveHeroFocus}>
        {heroModes.map((mode, index) => {
          const isActive = activePanel === index
          const videoIsPlaying = playingPanel === index && isActive
          return <a id={mode.key} key={mode.key} className={`hero-panel hero-panel--${mode.key} ${isActive ? 'is-active' : ''} ${videoIsPlaying ? 'is-video-playing' : ''}`} data-state={isActive ? 'active' : 'idle'} href={mode.route} onMouseEnter={() => activateHover(index)} onFocus={() => focusPanel(index)} style={{ '--mode-accent': mode.accent } as React.CSSProperties}>
            <img src={mode.image} alt="" width="900" height="563" loading={index === 0 ? 'eager' : 'lazy'} style={{ objectPosition: mode.position }} />
            {videoAllowed && <video
              ref={(node) => { videoRefs.current[index] = node }}
              poster={mode.image}
              width={mode.videoWidth}
              height={mode.videoHeight}
              muted
              playsInline
              loop
              disablePictureInPicture
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
              style={{ objectPosition: mode.position }}
              onPlaying={() => { if (activePanel === index) setPlayingPanel(index) }}
              onPause={() => setPlayingPanel((current) => current === index ? null : current)}
              onError={() => setPlayingPanel((current) => current === index ? null : current)}
            >
              <source src={mode.video} type="video/mp4" />
            </video>}
            <span className="hero-scrim" aria-hidden="true" />
            {isActive && <HeroOverlay key={`${mode.key}-${activePanel}`} mode={mode.key} />}
            <span className="hero-panel-copy">
              <span className="hero-number">{mode.num}</span>
              <strong>{mode.title[locale]}</strong>
              <span>{mode.tag[locale]}</span>
              <span className="hero-transformation">{mode.transformation[locale]}</span>
              <span className="hero-cta">{t.openDirectionPage} ↗</span>
            </span>
          </a>
        })}
          <span className="hero-system-pulse" aria-hidden="true" />
        </div>
      </div>
    </Container>
  </section>
}
