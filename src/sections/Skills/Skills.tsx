import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { buildSystems } from '../../data/portfolio'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

type BuildSystem = (typeof buildSystems)[number]

const systemSceneImages: Record<BuildSystem['key'], string> = {
  product: '/assets/home-chapter-02/product-system.png',
  visual: '/assets/home-chapter-02/visual-system.png',
  automation: '/assets/home-chapter-02/automation-system.png',
  analytics: '/assets/home-chapter-02/analytics-system.png',
}

const systemSceneVideos: Record<BuildSystem['key'], string> = {
  product: '/assets/home-chapter-02/product-system.mp4',
  visual: '/assets/home-chapter-02/visual-system.mp4',
  automation: '/assets/home-chapter-02/automation-system.mp4',
  analytics: '/assets/home-chapter-02/analytics-system.mp4',
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (!window.matchMedia) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setPrefersReducedMotion(media.matches)
    syncPreference()
    media.addEventListener('change', syncPreference)
    return () => media.removeEventListener('change', syncPreference)
  }, [])

  return prefersReducedMotion
}

function SystemDiagram({ system }: { system: BuildSystem }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  return <div className={`build-diagram living-blueprint build-diagram--${system.key}`} aria-hidden="true">
    {prefersReducedMotion
      ? <img
        className="build-diagram-media build-diagram-image"
        src={systemSceneImages[system.key]}
        alt=""
        decoding="async"
        draggable={false}
      />
      : <video
        key={system.key}
        className="build-diagram-media build-diagram-video"
        src={systemSceneVideos[system.key]}
        poster={systemSceneImages[system.key]}
        muted
        autoPlay
        playsInline
        preload="auto"
      />}
  </div>
}

export function WhatIBuild() {
  const { locale, t } = useApp()
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState(0)
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'out' | 'in'>('in')
  const swapTimer = useRef<number | undefined>(undefined)
  const settleTimer = useRef<number | undefined>(undefined)
  const [ref, visible] = useIntersectionReveal<HTMLElement>()
  const system = buildSystems[active]

  useEffect(() => {
    settleTimer.current = window.setTimeout(() => setTransitionPhase('idle'), 490)
    return () => {
      clearTimeout(swapTimer.current)
      clearTimeout(settleTimer.current)
    }
  }, [])

  const selectSystem = (index: number) => {
    if (index === selected) return
    clearTimeout(swapTimer.current)
    clearTimeout(settleTimer.current)
    setSelected(index)
    setTransitionPhase('out')
    swapTimer.current = window.setTimeout(() => {
      setActive(index)
      setTransitionPhase('in')
      settleTimer.current = window.setTimeout(() => setTransitionPhase('idle'), 490)
    }, 160)
  }

  return <section className={`section what-i-build-section ${visible ? 'is-visible' : ''}`} ref={ref}>
    <Container>
      <header className="what-i-build-header">
        <div><span className="section-eyebrow">{t.whatIBuildEyebrow}</span><h2>{t.expertise}</h2></div>
        <p>{t.whatIBuildIntro}</p>
      </header>
      <div className={`what-i-build-layout build-transition-${transitionPhase}`} style={{ '--build-accent': system.accent } as React.CSSProperties}>
        <div className="build-system-index" role="tablist" aria-label={t.expertise}>
          {buildSystems.map((item, index) => <button
            key={item.key}
            id={`build-system-tab-${item.key}`}
            type="button"
            role="tab"
            className={selected === index ? 'is-active' : ''}
            onClick={() => selectSystem(index)}
            onFocus={() => selectSystem(index)}
            aria-selected={selected === index}
            aria-controls="active-build-system"
            style={{ '--tab-accent': item.accent } as React.CSSProperties}
          >
            <span>{item.num}</span><strong>{item.title[locale]}</strong><i aria-hidden="true">↗</i>
          </button>)}
        </div>
        <article className="build-system-content" id="active-build-system" role="tabpanel" aria-labelledby={`build-system-tab-${system.key}`} aria-live="polite" aria-busy={transitionPhase !== 'idle'}>
          <span className="build-system-kicker">{system.coordinate}</span>
          <h3>{system.title[locale]}</h3>
          <div className="build-output-list">
            {system.outputs.map((output, index) => <div key={output.title.en}>
              <span>0{index + 1}</span>
              <h4>{output.title[locale]}</h4>
              <p>{output.description[locale]}</p>
            </div>)}
          </div>
          {system.key === 'visual' && <Link className="build-system-route-link" to="/design">{locale === 'ru' ? 'Открыть дизайн-направление →' : 'Open design direction →'}</Link>}
        </article>
        <SystemDiagram system={system} />
      </div>
    </Container>
  </section>
}

export const Skills = WhatIBuild
