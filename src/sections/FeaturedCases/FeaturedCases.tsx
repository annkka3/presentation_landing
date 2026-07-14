import { Container } from '../../components/layout/Container'
import { ProjectCard } from '../../components/ui/ProjectCard'
import { projects } from '../../data/portfolio'
import { useApp } from '../../app/AppContext'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

export function FeaturedCases() {
  const { t } = useApp()
  const [ref, visible] = useIntersectionReveal<HTMLElement>()
  return <section className={`section ${visible ? 'is-visible' : ''}`} id="featured" ref={ref}>
    <Container><h2>{t.featured}</h2><div className="featured-grid">{projects.filter((project) => project.featured).map((project) => <ProjectCard key={project.id} project={project} featured />)}</div></Container>
  </section>
}
