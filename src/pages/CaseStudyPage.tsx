import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from '../app/AppContext'
import { Container } from '../components/layout/Container'
import { projects } from '../data/portfolio'
import NotFoundPage from './NotFoundPage'

export default function CaseStudyPage() {
  const { slug } = useParams()
  const { locale, t } = useApp()
  const project = projects.find((item) => item.slug === slug)
  const index = projects.findIndex((item) => item.slug === slug)
  const next = index >= 0 ? projects[(index + 1) % projects.length] : undefined
  useEffect(() => {
    if (!project) return
    document.title = `${project.title[locale]} — Anna Gromyko`
    scrollTo(0, 0)
  }, [project, locale])
  if (!project) return <NotFoundPage />
  return <main id="main" className="case-page"><Container>
    <Link className="back-link" to="/">{t.back}</Link>
    <span className="eyebrow">{project.category[locale]}</span><h1>{project.title[locale]}</h1><p className="case-role">{project.role[locale]}</p><span className="status-badge detail-status">{project.statusLabel[locale]}</span>
    <p className="case-summary">{project.description[locale]}</p>
    <img className="case-hero-image" src={project.coverSrc} alt={project.coverAlt[locale]} width="1670" height="982" />
    <div className="case-details">
      <section><h2>{t.challenge}</h2><p>{project.description[locale]}</p></section>
      <section><h2>{t.scope}</h2><ul>{project.tags.map((tag) => <li key={tag.en}>{tag[locale]}</li>)}</ul></section>
      <section><h2>{t.approach}</h2><p>{project.role[locale]}</p></section>
      <section><h2>{t.result}</h2><p>{project.statusLabel[locale]}</p></section>
    </div>
    {next && <Link className="next-project" to={next.route}><span>{t.next}</span>{next.title[locale]} →</Link>}
  </Container></main>
}
