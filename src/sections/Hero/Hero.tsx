import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { heroModes } from '../../data/portfolio'
import { HeroOverlay } from './HeroOverlay'

export function Hero() {
  const { locale, t } = useApp()
  const [active, setActive] = useState<number | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const activate = (index: number) => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setActive(index), 140)
  }
  const clear = () => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setActive(null), 90)
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  const mobileClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (!matchMedia('(hover: none)').matches || mobileExpanded === index) return
    event.preventDefault()
    setMobileExpanded(index)
  }
  return <section className="hero-section" id="top">
    <Container>
      <h1>{t.heroTitle}</h1>
      <p className="hero-subtitle">{t.heroSubtitle}</p>
    </Container>
    <Container>
      <div className={`hero-panels ${active !== null ? 'has-active' : ''}`} role="group" aria-label={t.heroGroup} onMouseLeave={clear}>
        {heroModes.map((mode, index) => {
          const isActive = active === index || mobileExpanded === index
          return <a id={mode.key} key={mode.key} className={`hero-panel ${isActive ? 'is-active' : ''}`} href="#featured" onMouseEnter={() => activate(index)} onFocus={() => setActive(index)} onBlur={clear} onClick={(event) => mobileClick(event, index)} style={{ '--mode-accent': mode.accent } as React.CSSProperties}>
            <img src={mode.image} alt="" width="1792" height="1024" loading={index === 0 ? 'eager' : 'lazy'} style={{ objectPosition: mode.position }} />
            <span className="hero-scrim" aria-hidden="true" />
            {isActive && <HeroOverlay key={`${mode.key}-${active}`} mode={mode.key} />}
            <span className="hero-panel-copy"><span className="hero-number">{mode.num}</span><strong>{mode.title}</strong><span>{mode.tag[locale]}</span><span className="hero-cta">{t.viewCases}</span></span>
          </a>
        })}
      </div>
    </Container>
  </section>
}
