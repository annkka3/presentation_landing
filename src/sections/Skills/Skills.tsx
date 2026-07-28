import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { buildSystems } from '../../data/portfolio'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

type BuildSystem = (typeof buildSystems)[number]

function SystemDiagram({ system }: { system: BuildSystem }) {
  return <div className={`build-diagram build-diagram--${system.key}`} aria-hidden="true">
    <span className="build-diagram-coordinate">{system.coordinate}</span>
    <svg className="build-diagram-underlay" viewBox="0 0 360 300" focusable="false">
      {system.key === 'product' && <g>
        <path d="M42 219 108 181l64 37-65 38Z" />
        <path d="m108 181 64-37 64 37-64 37Z" />
        <path d="m172 218 64-37v48l-64 38Z" />
        <rect x="214" y="58" width="92" height="71" rx="4" />
        <rect x="36" y="78" width="112" height="72" rx="4" />
      </g>}
      {system.key === 'visual' && <g>
        <rect x="38" y="52" width="178" height="126" rx="4" />
        <rect x="78" y="82" width="214" height="148" rx="4" />
        <rect x="122" y="118" width="178" height="118" rx="4" />
        <path d="M30 245c78-64 160 4 298-116" />
      </g>}
      {system.key === 'automation' && <g>
        <path d="M28 82h78v54h68v-34h62v86h94" />
        <path d="M28 222h82v-46h64v28h62v-82h94" />
        <path d="M62 44v38m210 106v68M110 136v40m126 28v-16" />
        <circle cx="106" cy="136" r="9" /><circle cx="174" cy="176" r="9" /><circle cx="236" cy="188" r="9" />
      </g>}
      {system.key === 'analytics' && <g>
        <path d="M38 66h286M38 106h286M38 146h286M38 186h286M38 226h286M74 42v210M122 42v210M170 42v210M218 42v210M266 42v210" />
        <path d="m52 218 57-48 48 12 53-78 44 25 58-70" />
        <rect x="84" y="184" width="20" height="44" /><rect x="132" y="150" width="20" height="78" />
        <rect x="180" y="166" width="20" height="62" /><rect x="228" y="112" width="20" height="116" />
      </g>}
    </svg>
    <svg className="build-diagram-main" viewBox="0 0 360 300" focusable="false">
      {system.key === 'product' && <g className="build-diagram-product">
        <rect className="diagram-node diagram-step-1" x="48" y="62" width="86" height="58" rx="3" />
        <rect className="diagram-node diagram-step-2" x="226" y="54" width="84" height="66" rx="3" />
        <circle className="diagram-product-core diagram-step-3" cx="181" cy="154" r="15" />
        <path className="diagram-path diagram-step-4" pathLength="1" d="M134 91H226M91 120l90 70m87-70-87 70" />
        <rect className="diagram-node diagram-product-result diagram-step-5" x="136" y="190" width="90" height="58" rx="3" />
        <circle className="build-diagram-signal diagram-step-6" cx="181" cy="154" r="4" />
      </g>}
      {system.key === 'visual' && <g className="build-diagram-visual">
        <rect className="diagram-visual-layer diagram-step-1" x="62" y="50" width="202" height="148" rx="4" />
        <rect className="diagram-visual-layer diagram-step-2" x="96" y="84" width="202" height="148" rx="4" />
        <path className="diagram-visual-line diagram-step-3" pathLength="1" d="M118 122h98" />
        <path className="diagram-visual-line diagram-step-4" pathLength="1" d="M118 146h152" />
        <path className="diagram-visual-line diagram-step-5" pathLength="1" d="M118 170h78" />
        <path className="build-diagram-accent diagram-path diagram-step-6" pathLength="1" d="M56 246c70-54 139-12 246-90" />
        <circle className="build-diagram-signal diagram-step-7" cx="302" cy="156" r="4" />
      </g>}
      {system.key === 'automation' && <g className="build-diagram-automation">
        <circle className="diagram-node diagram-step-1" cx="62" cy="150" r="20" />
        <circle className="diagram-node diagram-step-2" cx="180" cy="150" r="29" />
        <circle className="diagram-node diagram-step-3" cx="298" cy="150" r="20" />
        <path className="diagram-path diagram-step-2" pathLength="1" d="M82 150h69" />
        <path className="diagram-path diagram-step-3" pathLength="1" d="M209 150h69" />
        <path className="diagram-path diagram-step-3" pathLength="1" d="m132 136 19 14-19 14M259 136l19 14-19 14" />
        <path className="build-diagram-accent diagram-path diagram-step-4" pathLength="1" d="M180 121V72h88" />
        <circle className="build-diagram-signal diagram-automation-impulse diagram-step-5" cx="82" cy="150" r="5" />
      </g>}
      {system.key === 'analytics' && <g className="build-diagram-analytics">
        <path className="diagram-path diagram-analytics-axis diagram-step-1" pathLength="1" d="M52 238V62M52 238h260" />
        <rect className="diagram-analytics-bar diagram-step-2" x="86" y="174" width="28" height="64" />
        <rect className="diagram-analytics-bar diagram-step-3" x="142" y="138" width="28" height="100" />
        <rect className="diagram-analytics-bar diagram-step-4" x="198" y="158" width="28" height="80" />
        <rect className="diagram-analytics-bar diagram-step-5" x="254" y="90" width="28" height="148" />
        <path className="build-diagram-accent diagram-path diagram-step-6" pathLength="1" d="m74 192 82-70 56 24 70-82" />
        <circle className="build-diagram-signal diagram-step-7" cx="282" cy="64" r="8" />
      </g>}
    </svg>
    <div className="build-diagram-legend"><span>INPUT</span><i /><span>OUTCOME</span></div>
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
