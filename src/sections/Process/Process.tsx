import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { processSteps } from '../../data/portfolio'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

const processMeta = [
  { label: 'INPUT', tone: 'cyan' },
  { label: 'LOGIC', tone: 'cyan' },
  { label: 'SPEC', tone: 'cyan' },
  { label: 'BUILD', tone: 'gold' },
  { label: 'VERIFY', tone: 'gold' },
  { label: 'HANDOFF', tone: 'gold' },
] as const

const processDisplayOrder = [0, 1, 2, 5, 4, 3] as const

function ProcessIcon({ index }: { index: number }) {
  return <svg viewBox="0 0 52 52" focusable="false" aria-hidden="true">
    {index === 0 && <g><circle cx="26" cy="26" r="10" /><path d="M26 8v8m0 20v8M8 26h8m20 0h8m-25 0h14M26 19v14" /></g>}
    {index === 1 && <g><path d="M15 18 26 12l12 6-12 7Z" /><path d="M15 26 26 20l12 6-12 7Z" /><path d="M15 34 26 28l12 6-12 7Z" /></g>}
    {index === 2 && <g><path d="M17 12h18l5 6v22H17Z" /><path d="M35 12v7h7M22 23h11M22 30h14M22 37h9" /></g>}
    {index === 3 && <g><path d="M16 20 26 14l11 6v13l-11 6-10-6Z" /><path d="m16 20 10 6 11-6M26 26v13" /></g>}
    {index === 4 && <g><path d="M14 36h24M16 32l8-8 7 5 9-13" /><path d="m36 16 4 0 0 4M15 15h8M15 21h5" /></g>}
    {index === 5 && <g><path d="M13 28 40 13 29 40l-4-12Z" /><path d="m25 28 15-15M14 38h10" /></g>}
  </svg>
}

export function Process() {
  const { locale, t } = useApp()
  const [ref, visible] = useIntersectionReveal<HTMLElement>()
  return <section className={`section process-section ${visible ? 'is-visible' : ''}`} ref={ref}>
    <Container>
      <header className="process-header">
        <h2>{t.process}</h2>
        <p>{locale === 'ru' ? 'Структурированный подход: от идеи к измеримому результату.' : 'A structured approach: from idea to measurable outcome.'}</p>
      </header>
      <div className="process-circuit">
        <svg className="process-route" viewBox="0 0 1200 540" focusable="false" aria-hidden="true">
          <defs>
            <linearGradient id="process-route-gradient" x1="70" y1="0" x2="1230" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#68d6e1" />
              <stop offset=".48" stopColor="#4fb9bd" />
              <stop offset=".7" stopColor="#b8965a" />
              <stop offset="1" stopColor="#d0a95d" />
            </linearGradient>
            <radialGradient id="process-route-glow" cx="78%" cy="72%" r="34%">
              <stop offset="0" stopColor="#cfa45a" stopOpacity=".24" />
              <stop offset=".5" stopColor="#68d6e1" stopOpacity=".08" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect className="process-route-ambient" width="1200" height="540" fill="url(#process-route-glow)" />
          <path className="process-route-grid" d="M72 6h1138M72 456h1138M205 52v430M480 52v430M755 52v430M1138 52v430" />
          <path className="process-route-shadow" d="M70 2H430H858H1148Q1230 2 1230 229Q1230 456 1148 456H858H430H70" />
          <path className="process-route-main" pathLength="1" d="M70 2H430H858H1148Q1230 2 1230 229Q1230 456 1148 456H858H430H70" />
          <path className="process-route-signal" pathLength="1" d="M70 2H430H858H1148Q1230 2 1230 229Q1230 456 1148 456H858H430H70" />
        </svg>
        {processDisplayOrder.map((stepIndex, index) => {
          const step = processSteps[stepIndex]
          const meta = processMeta[stepIndex]
          return <article
            className={`process-node process-node--${index + 1} process-node--${meta.tone}`}
            key={step.num}
            style={{ '--delay': `${360 + index * 120}ms` } as React.CSSProperties}
            tabIndex={0}
          >
            <span className="process-node-rail">
              <span className="process-node-dot" aria-hidden="true" />
              <span className="process-node-number">{step.num}</span>
              <span className="process-node-icon"><ProcessIcon index={stepIndex} /></span>
            </span>
            <span className="process-node-copy">
              <span className="process-node-label">{meta.label}</span>
              <h3>{step.title[locale]}</h3>
              <p>{step.description[locale]}</p>
            </span>
          </article>
        })}
      </div>
    </Container><span className="scan-line" aria-hidden="true" />
  </section>
}
