import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { buildSystems } from '../../data/portfolio'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

type BuildSystem = (typeof buildSystems)[number]

function SystemDiagram({ system }: { system: BuildSystem }) {
  return <div className={`build-diagram living-blueprint build-diagram--${system.key}`} aria-hidden="true">
    <span className="build-diagram-coordinate">{system.coordinate}</span>
    <svg className="build-diagram-underlay blueprint-base" viewBox="0 0 520 430" focusable="false">
      <defs>
        <radialGradient id={`blueprint-glow-${system.key}`} cx="70%" cy="68%" r="54%">
          <stop offset="0" stopColor="currentColor" stopOpacity=".20" />
          <stop offset=".36" stopColor="currentColor" stopOpacity=".08" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect className="blueprint-ambient" x="0" y="0" width="520" height="430" fill={`url(#blueprint-glow-${system.key})`} />
      <path className="blueprint-frame" d="M58 72h350l56 34v246H116l-58-34Z" />
      <path className="blueprint-grid-plane" d="M84 324h346M114 286h314M142 248h286M170 210h258M96 326l86-202M164 326l66-202M232 326l46-202M300 326l26-202M368 326l6-202" />
      <path className="blueprint-axis" pathLength="1" d="M105 357H426" />
      <path className="blueprint-guide" d="M176 92v238M260 92v238M344 92v238M428 118v212" />
      <text x="72" y="375">INPUT</text>
      <text x="418" y="375">OUTCOME</text>
      <text x="344" y="62">{system.num} / {system.key.toUpperCase()}</text>
    </svg>
    <svg className="build-diagram-main blueprint-model" viewBox="0 0 520 430" focusable="false">
      {system.key === 'product' && <g className="blueprint-state blueprint-product">
        <path className="blueprint-plane blueprint-step-1" d="M146 119 287 58l158 64-151 74Z" />
        <path className="blueprint-plane blueprint-step-2" d="M130 179 276 111l166 67-160 78Z" />
        <path className="blueprint-plane blueprint-step-3" d="M112 239 264 166l174 69-166 86Z" />
        <path className="blueprint-plane blueprint-step-4" d="M96 301 253 222l181 72-175 92Z" />
        <path className="blueprint-connector blueprint-step-5" pathLength="1" d="M287 58v164M445 122v172M146 119v182M294 196v125M282 256v65M272 321v65" />
        <path className="blueprint-signal-path blueprint-step-6" pathLength="1" d="M253 354 264 278 276 210 287 126 445 122" />
        <circle className="blueprint-node blueprint-step-6" cx="250" cy="348" r="5" />
        <circle className="blueprint-node blueprint-step-6" cx="273" cy="205" r="4" />
        <circle className="blueprint-node blueprint-step-6" cx="286" cy="126" r="4" />
        <circle className="blueprint-node blueprint-outcome blueprint-step-7" cx="445" cy="122" r="7" />
        <text className="blueprint-label blueprint-step-2" x="360" y="116">01 USER SCENARIOS</text>
        <text className="blueprint-label blueprint-step-3" x="360" y="174">02 INTERFACES</text>
        <text className="blueprint-label blueprint-step-5" x="360" y="294">03 DATA LAYER</text>
      </g>}
      {system.key === 'visual' && <g className="blueprint-state blueprint-visual">
        <path className="blueprint-shadow-plane blueprint-step-1" d="M124 305 278 241l154 40-158 68Z" />
        <path className="blueprint-panel blueprint-primary blueprint-step-2" d="M137 166 390 186l-18 142-253-22Z" />
        <path className="blueprint-panel blueprint-secondary blueprint-step-3" d="M212 93 442 112l-13 100-230-19Z" />
        <path className="blueprint-panel blueprint-secondary blueprint-step-4" d="M91 214 298 231l-12 98-207-18Z" />
        <path className="blueprint-detail blueprint-step-5" pathLength="1" d="M170 211h122M170 237h154M170 263h92M244 132h128M244 158h88M244 184h136" />
        <path className="blueprint-curve blueprint-step-6" pathLength="1" d="M100 356C177 292 269 331 420 211" />
        <circle className="blueprint-node blueprint-outcome blueprint-step-7" cx="420" cy="211" r="7" />
        <text className="blueprint-type blueprint-step-5" x="153" y="256">Aa</text>
      </g>}
      {system.key === 'automation' && <g className="blueprint-state blueprint-automation">
        <path className="blueprint-module blueprint-step-1" d="M128 113h86v48h-86ZM306 102h96v54h-96ZM318 279h92v54h-92Z" />
        <path className="blueprint-pipeline blueprint-step-2" pathLength="1" d="M91 214H190M264 214H430" />
        <circle className="blueprint-core blueprint-step-3" cx="227" cy="214" r="43" />
        <circle className="blueprint-core blueprint-step-4" cx="227" cy="214" r="22" />
        <circle className="blueprint-node blueprint-step-2" cx="91" cy="214" r="17" />
        <circle className="blueprint-node blueprint-step-5" cx="430" cy="214" r="17" />
        <path className="blueprint-decision blueprint-step-5" d="m227 286 30 30-30 30-30-30Z" />
        <path className="blueprint-alt blueprint-step-6" pathLength="1" d="M227 257v29m0 60v27H91V237" />
        <path className="blueprint-signal-path blueprint-step-7" pathLength="1" d="M108 214h302" />
        <text className="blueprint-label blueprint-step-4" x="286" y="202">ROUTING</text>
        <text className="blueprint-label blueprint-step-4" x="286" y="224">VALIDATION</text>
      </g>}
      {system.key === 'analytics' && <g className="blueprint-state blueprint-analytics">
        <path className="blueprint-data-plane blueprint-step-1" d="M105 320h286l52-64H156Z" />
        <path className="blueprint-data-plane blueprint-step-2" d="M130 269h257l42-49H173Z" />
        <path className="blueprint-bar blueprint-step-3" d="M154 320v-62h30v62ZM203 320v-102h30v102ZM252 320v-82h30v82ZM301 320v-138h30v138ZM350 320v-176h30v176Z" />
        <path className="blueprint-comparison blueprint-step-4" pathLength="1" d="M138 286c66-31 101 15 153-19 39-25 62-62 106-78" />
        <path className="blueprint-corridor blueprint-step-5" d="M319 170 415 82 446 113 345 205Z" />
        <path className="blueprint-curve blueprint-step-6" pathLength="1" d="M126 312c73-108 117-78 169-123 43-37 72-80 120-107" />
        <circle className="blueprint-node blueprint-outcome blueprint-step-7" cx="415" cy="82" r="9" />
        <text className="blueprint-label blueprint-step-6" x="348" y="72">DECISION</text>
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
