import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { skills } from '../../data/portfolio'
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal'

function SkillIcon({ index }: { index: number }) {
  const paths = [
    <><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><path className="draw" d="m8.8 8 2.2 7m4.2-7-2.2 7M9 7h6"/></>,
    <><path className="bracket-l" d="m9 5-5 7 5 7"/><path className="bracket-r" d="m15 5 5 7-5 7"/></>,
    <><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></>,
    <><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="m8 11 8-4m-8 6 8 4"/></>,
    <><path className="draw" d="m3 18 5-6 4 3 8-10"/><path d="M3 21h18"/></>,
    <><circle cx="12" cy="12" r="9"/><path className="check" d="m7.5 12.5 3 3 6.5-7"/></>,
  ]
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[index]}</svg>
}

export function Skills() {
  const { locale, t } = useApp()
  const [ref, visible] = useIntersectionReveal<HTMLElement>()
  return <section className={`section ${visible ? 'is-visible' : ''}`} ref={ref}>
    <Container><h2>{t.expertise}</h2><div className="skills-grid">
      {skills.map((skill, index) => <article className={`skill-card skill-${index}`} key={skill.title.en} tabIndex={0}><span className="skill-icon"><SkillIcon index={index} /></span><h3>{skill.title[locale]}</h3><p>{skill.description[locale]}</p></article>)}
    </div></Container>
  </section>
}
