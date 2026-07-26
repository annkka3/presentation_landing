import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { buildSystems } from '../../data/portfolio'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

type BuildSystem = (typeof buildSystems)[number]

function SystemDiagram({ system }: { system: BuildSystem }) {
  return <div className={`build-diagram build-diagram--${system.key}`} aria-hidden="true">
    <span className="build-diagram-coordinate">{system.coordinate}</span>
    <svg viewBox="0 0 360 300" focusable="false">
      {system.key === 'product' && <g className="build-diagram-product">
        <rect x="48" y="62" width="86" height="58" rx="3" />
        <rect x="226" y="54" width="84" height="66" rx="3" />
        <rect x="136" y="190" width="90" height="58" rx="3" />
        <path d="M134 91H226M91 120l90 70m87-70-87 70" />
        <circle cx="181" cy="154" r="15" />
        <circle className="build-diagram-signal" cx="181" cy="154" r="4" />
      </g>}
      {system.key === 'visual' && <g className="build-diagram-visual">
        <rect x="62" y="50" width="202" height="148" rx="4" />
        <rect x="96" y="84" width="202" height="148" rx="4" />
        <path d="M118 122h98M118 146h152M118 170h78" />
        <path className="build-diagram-accent" d="M56 246c70-54 139-12 246-90" />
      </g>}
      {system.key === 'automation' && <g className="build-diagram-automation">
        <circle cx="62" cy="150" r="20" />
        <circle cx="180" cy="150" r="29" />
        <circle cx="298" cy="150" r="20" />
        <path d="M82 150h69M209 150h69" />
        <path d="m132 136 19 14-19 14M259 136l19 14-19 14" />
        <circle className="build-diagram-signal" cx="112" cy="150" r="5" />
        <path className="build-diagram-accent" d="M180 121V72h88" />
      </g>}
      {system.key === 'analytics' && <g className="build-diagram-analytics">
        <path d="M52 238V62M52 238h260" />
        <rect x="86" y="174" width="28" height="64" />
        <rect x="142" y="138" width="28" height="100" />
        <rect x="198" y="158" width="28" height="80" />
        <rect x="254" y="90" width="28" height="148" />
        <path className="build-diagram-accent" d="m74 192 82-70 56 24 70-82" />
        <circle className="build-diagram-signal" cx="282" cy="64" r="8" />
      </g>}
    </svg>
    <div className="build-diagram-legend"><span>INPUT</span><i /><span>OUTCOME</span></div>
  </div>
}

export function WhatIBuild() {
  const { locale, t } = useApp()
  const [active, setActive] = useState(0)
  const [ref, visible] = useIntersectionReveal<HTMLElement>()
  const system = buildSystems[active]

  return <section className={`section what-i-build-section ${visible ? 'is-visible' : ''}`} ref={ref}>
    <Container>
      <header className="what-i-build-header">
        <div><span className="section-eyebrow">{t.whatIBuildEyebrow}</span><h2>{t.expertise}</h2></div>
        <p>{t.whatIBuildIntro}</p>
      </header>
      <div className="what-i-build-layout" style={{ '--build-accent': system.accent } as React.CSSProperties}>
        <div className="build-system-index" role="list" aria-label={t.expertise}>
          {buildSystems.map((item, index) => <button
            key={item.key}
            type="button"
            className={active === index ? 'is-active' : ''}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            aria-controls="active-build-system"
          >
            <span>{item.num}</span><strong>{item.title[locale]}</strong><i aria-hidden="true">↗</i>
          </button>)}
        </div>
        <article className="build-system-content" id="active-build-system" aria-live="polite">
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
