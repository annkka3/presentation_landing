import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { education, experience } from '../../data/portfolio'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

export function Experience() {
  const { locale, t } = useApp()
  const [ref, visible] = useIntersectionReveal<HTMLElement>()
  return <section className={`section ${visible ? 'is-visible' : ''}`} ref={ref}>
    <Container className="experience-grid">
      <div><h2>{t.experience}</h2><div className="timeline">{experience.map((item) => <article key={item.dates.en} className={item.current ? 'current' : ''}><span className="timeline-dot"/><time>{item.dates[locale]}</time><h3>{item.role[locale]} {item.current && <small>{t.current}</small>}</h3><p>{item.description[locale]}</p></article>)}</div></div>
      <div><h2>{t.education}</h2><div className="education-list">{education.map((item) => <article key={item.school.en} tabIndex={0}><h3>{item.school[locale]}</h3><p>{item.detail[locale]}</p></article>)}</div></div>
    </Container>
  </section>
}
