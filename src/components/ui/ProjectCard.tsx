import { type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import type { LocalizedText, Project } from '../../types'

export function ProjectCard({
  project,
  featured,
  lead = false,
  active = false,
  statement,
  proofLayers = [],
  onActivate,
}: {
  project: Project
  featured: boolean
  lead?: boolean
  active?: boolean
  statement?: LocalizedText
  proofLayers?: LocalizedText[]
  onActivate?: () => void
}) {
  const { locale, t } = useApp()
  const navigate = useNavigate()
  const navigateWithContinuity = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const transition = (document as unknown as { startViewTransition?: (update: () => void) => unknown }).startViewTransition
    if (!transition) return
    event.preventDefault()
    transition.call(document, () => navigate(project.route))
  }
  return (
    <Link
      className={`project-card ${featured ? 'featured-card' : 'secondary-card'} accent-${project.accent} ${lead ? 'is-lead-case' : ''} ${active ? 'is-archive-active' : ''}`}
      data-project-id={project.id}
      to={project.route}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={navigateWithContinuity}
      style={featured ? { '--span': project.span, viewTransitionName: `project-${project.id}` } as React.CSSProperties : undefined}
    >
      <div className="project-cover">
        <img src={project.coverSrc} alt={project.coverAlt[locale]} width="1670" height="982" loading="lazy" decoding="async" style={{ objectPosition: project.coverPosition }} />
        <span className="status-badge">{project.statusLabel[locale]}</span>
        {statement && <span className="featured-system-signal" aria-hidden="true"><i /><i /><i /></span>}
      </div>
      <div className="project-copy">
        <span className="eyebrow">{project.category[locale]}</span>
        <h3>{project.title[locale]}</h3>
        <p className="project-role">{project.role[locale]}</p>
        <p className="project-description" title={project.description[locale]}>{project.description[locale]}</p>
        {statement && <strong className="featured-system-statement">{statement[locale]}</strong>}
        {proofLayers.length > 0 && <div className="featured-proof-layers" aria-label={locale === 'ru' ? 'Слои системы' : 'System layers'}>{proofLayers.map((layer) => <span key={layer.en}>{layer[locale]}</span>)}</div>}
        <div className="tags" aria-label={locale === 'ru' ? 'Теги' : 'Tags'}>{project.tags.map((tag, index) => <span key={index}>{tag[locale]}</span>)}</div>
        <span className="card-cta">{featured ? t.openCase : t.openProject}</span>
      </div>
    </Link>
  )
}
