import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { processSteps } from '../../data/portfolio'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

export function Process() {
  const { locale, t } = useApp()
  const [ref, visible] = useIntersectionReveal<HTMLElement>()
  return <section className={`section process-section ${visible ? 'is-visible' : ''}`} ref={ref}>
    <Container><h2>{t.process}</h2><div className="process-grid">
      {processSteps.map((step, index) => <article className="process-step" key={step.num} style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}><span>{step.num}</span>{index !== processSteps.length - 1 && <i aria-hidden="true">→</i>}<h3>{step.title[locale]}</h3><p>{step.description[locale]}</p></article>)}
    </div></Container><span className="scan-line" aria-hidden="true" />
  </section>
}
