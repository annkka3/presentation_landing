import { useState } from 'react'
import { Container } from '../../components/layout/Container'
import { ProjectCard } from '../../components/ui/ProjectCard'
import { daoProofLayers, featuredSystemStatements, projects } from '../../data/portfolio'
import { useApp } from '../../app/AppContext'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

export function FeaturedCases() {
  const { locale, t } = useApp()
  const [ref, visible] = useIntersectionReveal<HTMLElement>()
  const featured = projects.filter((project) => project.featured)
  const lead = featured.find((project) => project.id === 'dao-system') ?? featured[0]
  const secondary = featured.filter((project) => project.id !== lead.id)
  const [active, setActive] = useState(lead.id)

  return <section className={`section ${visible ? 'is-visible' : ''}`} ref={ref}>
    <Container>
      <header className="featured-archive-header">
        <div><span className="section-eyebrow">03 · SYSTEM ARCHIVE</span><h2>{t.featured}</h2></div>
        <p>{locale === 'ru' ? 'Выбранные продукты как доказательство связанной системной практики.' : 'Selected products as evidence of one connected systems practice.'}</p>
      </header>
      <div className={`featured-archive is-active-${active}`} onMouseLeave={() => setActive(lead.id)}>
        <ProjectCard project={lead} featured lead active={active === lead.id} statement={featuredSystemStatements[lead.id]} proofLayers={daoProofLayers} onActivate={() => setActive(lead.id)} />
        <div className="featured-secondary-cases">
          {secondary.map((project) => <ProjectCard key={project.id} project={project} featured active={active === project.id} statement={featuredSystemStatements[project.id]} onActivate={() => setActive(project.id)} />)}
        </div>
      </div>
    </Container>
  </section>
}
