import { Container } from '../../components/layout/Container'
import { ProjectCard } from '../../components/ui/ProjectCard'
import { projects } from '../../data/portfolio'
import { useApp } from '../../app/AppContext'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

export function MoreProjects() {
  const { t } = useApp()
  const [ref, visible] = useIntersectionReveal<HTMLElement>()
  return <section className={`section section-tight ${visible ? 'is-visible' : ''}`} ref={ref}>
    <Container><h2>{t.more}</h2><div className="secondary-grid">{projects.filter((project) => !project.featured).map((project) => <ProjectCard key={project.id} project={project} featured={false} />)}</div></Container>
  </section>
}
