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
      <path className="blueprint-frame" d="M50 82h376l42 28v232H110l-60-30Z" />
      <path className="blueprint-grid-plane" d="M72 326h388M106 287h344M140 248h300M174 209h256M94 326l84-198M166 326l64-198M238 326l44-198M310 326l24-198M382 326l4-198" />
      <path className="blueprint-axis" pathLength="1" d="M105 357H426" />
      <path className="blueprint-guide" d="M178 108v222M262 108v222M346 108v222M430 124v206" />
      <text x="72" y="375">INPUT</text>
      <text x="418" y="375">OUTCOME</text>
      <text x="344" y="62">{system.num} / {system.key.toUpperCase()}</text>
    </svg>
    <svg className="build-diagram-main blueprint-model" viewBox="0 0 520 430" focusable="false">
      {system.key === 'product' && <g className="blueprint-state blueprint-product">
        <path className="blueprint-plane blueprint-plane-back blueprint-step-1" d="M116 128 292 55l174 70-186 85Z" />
        <path className="blueprint-plane blueprint-plane-mid blueprint-step-2" d="M96 190 280 112l190 75-198 93Z" />
        <path className="blueprint-plane blueprint-plane-mid blueprint-step-3" d="M80 254 266 176l200 78-204 100Z" />
        <path className="blueprint-plane blueprint-plane-front blueprint-step-4" d="M62 319 254 234l212 80-218 108Z" />
        <path className="blueprint-connector blueprint-step-5" pathLength="1" d="M292 55v179M466 125v189M116 128v191M280 210v144M272 280v74M262 354v68" />
        <path className="blueprint-signal-path blueprint-step-6" pathLength="1" d="M248 392C260 330 266 286 274 240C284 178 292 104 466 125" />
        <circle className="blueprint-node blueprint-step-6" cx="248" cy="392" r="5" />
        <circle className="blueprint-node blueprint-step-6" cx="274" cy="240" r="4.5" />
        <circle className="blueprint-node blueprint-step-6" cx="292" cy="104" r="4" />
        <circle className="blueprint-node blueprint-outcome blueprint-step-7" cx="466" cy="125" r="8" />
        <text className="blueprint-label blueprint-step-2" x="356" y="120">PRODUCT LOGIC</text>
        <text className="blueprint-label blueprint-step-5" x="92" y="370">DATA LAYER</text>
      </g>}
      {system.key === 'visual' && <g className="blueprint-state blueprint-visual">
        <path className="blueprint-shadow-plane blueprint-step-1" d="M88 344 300 260l154 43-216 92Z" />
        <path className="blueprint-panel blueprint-secondary blueprint-surface-back blueprint-step-2" d="M238 80 468 102l-16 116-230-23Z" />
        <path className="blueprint-panel blueprint-secondary blueprint-surface-mid blueprint-step-3" d="M106 203 388 228l-20 144-282-28Z" />
        <path className="blueprint-panel blueprint-primary blueprint-surface-front blueprint-step-4" d="M158 149 446 175l-22 178-288-28Z" />
        <path className="blueprint-detail blueprint-step-5" pathLength="1" d="M206 198h142M206 226h184M206 256h112M286 132h120M286 158h76" />
        <path className="blueprint-curve blueprint-step-6" pathLength="1" d="M74 370C160 292 262 344 448 220" />
        <circle className="blueprint-node blueprint-outcome blueprint-step-7" cx="448" cy="220" r="8" />
        <text className="blueprint-type blueprint-step-5" x="180" y="276">Aa</text>
      </g>}
      {system.key === 'automation' && <g className="blueprint-state blueprint-automation">
        <path className="blueprint-routing-plane blueprint-step-1" d="M70 136 220 84h252l-148 56Z" />
        <path className="blueprint-routing-plane blueprint-step-2" d="M58 292 232 238h248l-178 62Z" />
        <path className="blueprint-routing-plane blueprint-routing-front blueprint-step-3" d="M88 224 250 170h224l-162 60Z" />
        <path className="blueprint-module blueprint-process-plane blueprint-step-3" d="M122 120 238 102l42 34-118 19Z" />
        <path className="blueprint-module blueprint-process-plane blueprint-step-4" d="M322 104 450 86l38 34-130 20Z" />
        <path className="blueprint-module blueprint-process-plane blueprint-step-4" d="M324 302 462 280l34 38-140 20Z" />
        <path className="blueprint-pipeline blueprint-step-4" pathLength="1" d="M66 224C140 224 166 224 190 224M314 224C352 224 390 224 462 224" />
        <circle className="blueprint-core blueprint-step-5" cx="252" cy="224" r="70" />
        <circle className="blueprint-core blueprint-core-inner blueprint-step-5" cx="252" cy="224" r="29" />
        <circle className="blueprint-node blueprint-step-4" cx="66" cy="224" r="13" />
        <circle className="blueprint-node blueprint-step-6" cx="462" cy="224" r="13" />
        <path className="blueprint-validation blueprint-step-6" pathLength="1" d="M252 292C252 340 188 330 166 374H74V244" />
        <path className="blueprint-signal-path blueprint-step-7" pathLength="1" d="M80 224C154 224 188 224 222 224S300 224 448 224" />
        <text className="blueprint-label blueprint-step-5" x="326" y="214">CONTROL CORE</text>
        <text className="blueprint-label blueprint-step-6" x="94" y="388">VALIDATION</text>
      </g>}
      {system.key === 'analytics' && <g className="blueprint-state blueprint-analytics">
        <path className="blueprint-data-plane blueprint-step-1" d="M78 333h314l78-78H158Z" />
        <path className="blueprint-data-plane blueprint-step-2" d="M106 274h282l62-58H170Z" />
        <path className="blueprint-corridor blueprint-step-3" d="M314 182 430 68 474 108 346 226Z" />
        <path className="blueprint-bar blueprint-step-4" d="M150 333v-54h30v54ZM205 333v-94h30v94ZM260 333v-74h30v74ZM315 333v-128h30v128ZM370 333v-168h30v168Z" />
        <path className="blueprint-comparison blueprint-step-5" pathLength="1" d="M130 300c58-28 100 12 154-20 44-26 65-58 110-78" />
        <path className="blueprint-curve blueprint-step-6" pathLength="1" d="M112 322C178 202 234 257 300 186C344 139 374 94 430 68" />
        <circle className="blueprint-node blueprint-outcome blueprint-step-7" cx="430" cy="68" r="10" />
        <text className="blueprint-label blueprint-step-6" x="360" y="54">DECISION</text>
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
