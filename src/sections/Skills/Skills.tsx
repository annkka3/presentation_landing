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
        <text className="blueprint-label blueprint-step-4" x="360" y="233">03 LOGIC / RULES</text>
        <text className="blueprint-label blueprint-step-5" x="360" y="294">04 DATA LAYER</text>
      </g>}
      {system.key === 'visual' && <g className="blueprint-state blueprint-visual">
        <path className="blueprint-shadow-plane blueprint-step-1" d="M143 281 258 231l151 38-120 59Z" />
        <path className="blueprint-panel blueprint-step-2" d="M170 126 394 139l-13 118-224-13Z" />
        <path className="blueprint-panel blueprint-step-3" d="M110 174 344 190l-14 126-234-17Z" />
        <path className="blueprint-panel blueprint-step-4" d="M218 96 440 111l-13 100-222-15Z" />
        <path className="blueprint-detail blueprint-step-5" pathLength="1" d="M139 203h72M139 226h124M139 249h92M246 143h112M246 166h80M246 189h118M250 221h50m17 0h62" />
        <path className="blueprint-curve blueprint-step-6" pathLength="1" d="M112 342C198 268 280 335 407 207" />
        <circle className="blueprint-node blueprint-outcome blueprint-step-7" cx="407" cy="207" r="7" />
        <text className="blueprint-type blueprint-step-5" x="134" y="229">Aa</text>
      </g>}
      {system.key === 'automation' && <g className="blueprint-state blueprint-automation">
        <path className="blueprint-lane blueprint-step-1" d="M96 134h98v46h104v-32h112M96 282h102v-48h96v56h116" />
        <path className="blueprint-pipeline blueprint-step-2" pathLength="1" d="M97 214H202M252 214H418" />
        <circle className="blueprint-core blueprint-step-3" cx="227" cy="214" r="37" />
        <circle className="blueprint-core blueprint-step-4" cx="227" cy="214" r="21" />
        <circle className="blueprint-node blueprint-step-2" cx="97" cy="214" r="16" />
        <circle className="blueprint-node blueprint-step-5" cx="418" cy="214" r="16" />
        <path className="blueprint-decision blueprint-step-5" d="m227 282 28 28-28 28-28-28Z" />
        <path className="blueprint-alt blueprint-step-6" pathLength="1" d="M227 251v31m0 56v30H97V236" />
        <path className="blueprint-signal-path blueprint-step-7" pathLength="1" d="M114 214h288" />
        <text className="blueprint-label blueprint-step-4" x="281" y="206">VALIDATION</text>
        <text className="blueprint-label blueprint-step-4" x="281" y="226">ORCHESTRATION</text>
      </g>}
      {system.key === 'analytics' && <g className="blueprint-state blueprint-analytics">
        <path className="blueprint-data-plane blueprint-step-1" d="M112 310h270l48-58H160Z" />
        <path className="blueprint-data-plane blueprint-step-2" d="M139 260h242l38-44H176Z" />
        <path className="blueprint-bar blueprint-step-3" d="M166 307v-58h28v58ZM216 307v-96h28v96ZM266 307v-72h28v72ZM316 307v-126h28v126Z" />
        <path className="blueprint-comparison blueprint-step-4" pathLength="1" d="M148 274c57-28 103 14 151-18 35-23 56-58 96-72" />
        <path className="blueprint-corridor blueprint-step-5" d="M318 168 413 91 439 122 342 196Z" />
        <path className="blueprint-curve blueprint-step-6" pathLength="1" d="M139 302c67-94 110-72 158-111 42-35 69-74 116-100" />
        <circle className="blueprint-node blueprint-outcome blueprint-step-7" cx="413" cy="91" r="9" />
        <text className="blueprint-label blueprint-step-6" x="356" y="78">DECISION NODE</text>
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
