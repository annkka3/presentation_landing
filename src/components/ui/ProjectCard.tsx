import { Link } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import type { Project } from '../../types'

export function ProjectCard({ project, featured }: { project: Project; featured: boolean }) {
  const { locale, t } = useApp()
  return (
    <Link className={`project-card ${featured ? 'featured-card' : 'secondary-card'} accent-${project.accent}`} to={project.route} style={featured ? { '--span': project.span } as React.CSSProperties : undefined}>
      <div className="project-cover">
        <img src={project.coverSrc} alt={project.coverAlt[locale]} width="1670" height="982" loading="lazy" decoding="async" style={{ objectPosition: project.coverPosition }} />
        <span className="status-badge">{project.statusLabel[locale]}</span>
      </div>
      <div className="project-copy">
        <span className="eyebrow">{project.category[locale]}</span>
        <h3>{project.title[locale]}</h3>
        <p className="project-role">{project.role[locale]}</p>
        <p className="project-description" title={project.description[locale]}>{project.description[locale]}</p>
        <div className="tags" aria-label={locale === 'ru' ? 'Теги' : 'Tags'}>{project.tags.map((tag, index) => <span key={index}>{tag[locale]}</span>)}</div>
        <span className="card-cta">{featured ? t.openCase : t.openProject}</span>
      </div>
    </Link>
  )
}
