import { useEffect, useRef, useState, type FocusEvent, type TouchEvent } from 'react'
import { useApp } from '../app/AppContext'
import { Footer } from '../components/layout/Footer'
import { ProjectCard } from '../components/ui/ProjectCard'
import { education, experience, heroModes, processSteps, projects, skills } from '../data/portfolio'
import { useSnapCarousel } from '../hooks/useSnapCarousel'
import { Contact } from '../sections/Contact/Contact'

const chapters = [
  { id: 'chapter-hero' },
  { id: 'directions' },
  { id: 'featured' },
  { id: 'more-projects' },
  { id: 'process' },
  { id: 'skills' },
  { id: 'experience-education' },
  { id: 'contact' },
] as const

type GoTo = (index: number, instant?: boolean) => void
type HeroFocus = (typeof heroModes)[number]['key']

function initialChapter() {
  const hash = decodeURIComponent(window.location.hash.slice(1))
  const stableIndex = chapters.findIndex(({ id }) => id === hash)
  const numbered = /^chapter-(\d)$/.exec(hash)
  return stableIndex >= 0 ? stableIndex : numbered ? Math.min(Number(numbered[1]) - 1, chapters.length - 1) : 0
}

function CarouselNavigation({ active, total, goTo, label }: { active: number; total: number; goTo: GoTo; label: string }) {
  const { locale } = useApp()
  return <div className="mobile-carousel-navigation" aria-label={label}>
    <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={`${label}: ${locale === 'ru' ? 'предыдущий' : 'previous'}`}>←</button>
    <span className="mobile-carousel-count" aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    <span className="mobile-carousel-dots">
      {Array.from({ length: total }, (_, index) => <button key={index} type="button" className={active === index ? 'is-active' : ''} onClick={() => goTo(index)} aria-label={`${label}: ${index + 1}`} aria-current={active === index ? 'true' : undefined} />)}
    </span>
    <button type="button" onClick={() => goTo(active + 1)} disabled={active === total - 1} aria-label={`${label}: ${locale === 'ru' ? 'следующий' : 'next'}`}>→</button>
  </div>
}

function MobileHero({ onDirections }: { onDirections: () => void }) {
  const { locale, t } = useApp()
  const proof = locale === 'ru' ? [
    ['20+ лет', 'коммерческого опыта'],
    ['10+ проектов', 'в продукте и дизайне'],
    ['Полный цикл', 'от идеи до релиза'],
    ['AI-процесс', 'Claude · Codex · Cursor'],
  ] : [
    ['20+ years', 'commercial experience'],
    ['10+ projects', 'in product and design'],
    ['Full cycle', 'from idea to launch'],
    ['AI workflow', 'Claude · Codex · Cursor'],
  ]

  return <div className="mobile-hero" id="top">
    <div className="mobile-hero-copy">
      <h1>{t.heroTitle}</h1>
    </div>
    <button className="mobile-hero-directions" type="button" onClick={onDirections}>{t.chooseDirection}</button>
    <div className="mobile-proof-grid" aria-label={t.facts}>{proof.map(([stat, label]) => <div key={stat}><strong>{stat}</strong><span>{label}</span></div>)}</div>
  </div>
}

function MobileDirections({ onSelect }: { onSelect: (focus: HeroFocus) => void }) {
  const { locale, t } = useApp()
  const descriptions: Record<HeroFocus, Record<'ru' | 'en', string>> = {
    product: { ru: 'Архитектура · UX', en: 'Architecture · UX' },
    design: { ru: 'Визуальные системы · UI', en: 'Visual systems · UI' },
    automation: { ru: 'Процессы · AI', en: 'Processes · AI' },
    analytics: { ru: 'Данные · SQL · Python', en: 'Data · SQL · Python' },
  }
  const positions: Record<HeroFocus, string> = { product: '50% 52%', design: '54% 34%', automation: '51% 48%', analytics: '58% 48%' }
  const alt: Record<HeroFocus, Record<'ru' | 'en', string>> = {
    product: { ru: 'Тёмная архитектура цифровой продуктовой системы', en: 'Dark architecture of a digital product system' },
    design: { ru: 'Редакционный fashion-образ женщины в светлой одежде', en: 'Editorial fashion portrait of a woman in ivory clothing' },
    automation: { ru: 'Механическая система автоматизации с потоками данных', en: 'Mechanical automation system with data flows' },
    analytics: { ru: 'Синяя аналитическая система с графиками данных', en: 'Blue analytics system with data charts' },
  }

  return <div className="mobile-directions-content">
    <header className="mobile-directions-header">
      <span>{t.directionsEyebrow}</span>
      <h2 id="mobile-directions-title">{t.directionsHeading}</h2>
      <p>{t.directionsIntro}</p>
    </header>
    <div className="mobile-directions-grid">
      {heroModes.map((mode, index) => <button
        className="mobile-direction-tile"
        type="button"
        key={mode.key}
        onClick={() => onSelect(mode.key)}
        aria-label={`${t.openDirection} ${mode.title[locale]}`}
        style={{ '--mode-accent': mode.accent } as React.CSSProperties}
      >
        <img src={mode.image} alt={alt[mode.key][locale]} width="900" height="563" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: positions[mode.key] }} />
        <span className="mobile-direction-tile-overlay" aria-hidden="true" />
        <span className="mobile-direction-tile-arrow" aria-hidden="true">↗</span>
        <span className="mobile-direction-tile-copy"><small>{mode.num}</small><strong>{mode.title[locale]}</strong><span>{descriptions[mode.key][locale]}</span></span>
      </button>)}
    </div>
  </div>
}

function MobileProjects({ featured, activeFocus = null }: { featured: boolean; activeFocus?: HeroFocus | null }) {
  const { locale, t } = useApp()
  const focusProject: Record<HeroFocus, string> = { product: 'dao-system', design: 'the-dao-way', automation: 'crypto-reality', analytics: 'risk-journal-analytics' }
  const items = projects.filter((project) => project.featured === featured).sort((a, b) => featured && activeFocus ? Number(b.id === focusProject[activeFocus]) - Number(a.id === focusProject[activeFocus]) : 0)
  const heading = featured ? t.featured : t.more

  return <div className={`mobile-section mobile-projects-section ${featured ? 'is-featured' : 'is-more'}`}>
    <h2>{heading}</h2>
    {featured && activeFocus && <p className="mobile-project-focus">{t.selectedDirection}: <strong>{heroModes.find((mode) => mode.key === activeFocus)?.title[locale]}</strong></p>}
    <div className="mobile-project-list" role="list" aria-label={heading}>
      {items.map((project) => <div role="listitem" key={project.id}><ProjectCard project={project} featured={featured} /></div>)}
    </div>
  </div>
}

function MobileProcess() {
  const { locale, t } = useApp()
  const { ref: carouselRef, active, goTo, onScroll, onKeyDown } = useSnapCarousel(processSteps.length)
  return <div className="mobile-section mobile-process-section">
    <h2>{t.process}</h2>
    <div className="mobile-process-carousel" data-horizontal-carousel>
      <div className="mobile-carousel-track" ref={carouselRef} onScroll={onScroll} onKeyDown={onKeyDown} tabIndex={0} role="region" aria-label={t.process}>
        {processSteps.map((step) => <article className="mobile-process-card" key={step.num} aria-current={active === Number(step.num) - 1 ? 'step' : undefined}>
          <span>{step.num}</span><h3>{step.title[locale]}</h3><p>{step.description[locale]}</p>
        </article>)}
      </div>
      <div className="mobile-step-rail" aria-label={t.process}>{processSteps.map((step, index) => <button key={step.num} type="button" className={active === index ? 'is-active' : ''} onClick={() => goTo(index)} aria-current={active === index ? 'step' : undefined}>{step.num}</button>)}</div>
      <CarouselNavigation active={active} total={processSteps.length} goTo={goTo} label={t.process} />
    </div>
  </div>
}

function MobileSkills() {
  const { locale, t } = useApp()
  const [open, setOpen] = useState(0)
  return <div className="mobile-section mobile-skills-section">
    <h2>{t.expertise}</h2>
    <div className="mobile-skills-accordion">
      {skills.map((skill, index) => {
        const expanded = open === index
        return <article key={skill.title.en} className={expanded ? 'is-open' : ''}>
          <h3><button type="button" onClick={() => setOpen(index)} aria-expanded={expanded} aria-controls={`mobile-skill-${index}`}><span>0{index + 1}</span><strong>{skill.title[locale]}</strong><i aria-hidden="true">{expanded ? '−' : '+'}</i></button></h3>
          <div id={`mobile-skill-${index}`} hidden={!expanded}><p>{skill.description[locale]}</p></div>
        </article>
      })}
    </div>
  </div>
}

function MobileExperience() {
  const { locale, t } = useApp()
  const [tab, setTab] = useState<'experience' | 'education'>('experience')
  return <div className="mobile-section mobile-experience-section">
    <h2>{t.chapterExperience}</h2>
    <div className="mobile-experience-tabs" role="tablist" aria-label={t.chapterExperience}>
      <button type="button" role="tab" aria-selected={tab === 'experience'} onClick={() => setTab('experience')}>{t.experience}</button>
      <button type="button" role="tab" aria-selected={tab === 'education'} onClick={() => setTab('education')}>{t.education}</button>
    </div>
    {tab === 'experience' ? <div className="mobile-timeline" role="tabpanel">
      {experience.map((item) => <article key={item.dates.en} className={item.current ? 'current' : ''}><time>{item.dates[locale]}</time><h3>{item.role[locale]}</h3>{item.current && <small>{t.current}</small>}<p>{item.description[locale]}</p></article>)}
    </div> : <div className="mobile-education" role="tabpanel">
      {education.map((item) => <article key={item.school.en}><h3>{item.school[locale]}</h3><p>{item.detail[locale]}</p></article>)}
    </div>}
  </div>
}

export function MobileHomePage() {
  const { t } = useApp()
  const { ref: chapterRef, active: activeChapter, goTo: goToChapter, onScroll: onChapterScroll, onKeyDown: onChapterKeyDown } = useSnapCarousel(chapters.length, initialChapter())
  const [formFocused, setFormFocused] = useState(false)
  const [activeFocus, setActiveFocus] = useState<HeroFocus | null>(() => history.state?.mobileFocus ?? null)
  const touchStart = useRef<{ x: number; y: number; blocked: boolean } | null>(null)
  const chapterLabels = [t.chapterHero, t.chapterDirections, t.chapterFeatured, t.chapterProjects, t.chapterProcess, t.chapterExpertise, t.chapterExperience, t.chapterContact]

  useEffect(() => {
    document.documentElement.dataset.page = 'home'
    requestAnimationFrame(() => goToChapter(initialChapter(), true))
    const restoreHash = () => {
      goToChapter(initialChapter(), true)
      setActiveFocus(history.state?.mobileFocus ?? null)
    }
    addEventListener('hashchange', restoreHash)
    addEventListener('popstate', restoreHash)
    return () => {
      removeEventListener('hashchange', restoreHash)
      removeEventListener('popstate', restoreHash)
      if (document.documentElement.dataset.page === 'home') delete document.documentElement.dataset.page
    }
  }, [goToChapter])

  useEffect(() => {
    if (window.location.pathname !== '/') return
    const hash = `#${chapters[activeChapter].id}`
    if (window.location.hash !== hash) history.replaceState(history.state, '', `${location.pathname}${location.search}${hash}`)
    window.dispatchEvent(new Event('mobile-chapter-change'))
  }, [activeChapter])

  const navigateChapter = (index: number, focus: HeroFocus | null = activeFocus) => {
    const next = Math.min(Math.max(index, 0), chapters.length - 1)
    if (window.location.hash !== `#${chapters[next].id}`) history.pushState({ ...history.state, mobileFocus: focus }, '', `#${chapters[next].id}`)
    goToChapter(next)
  }
  const selectDirection = (focus: HeroFocus) => {
    setActiveFocus(focus)
    navigateChapter(2, focus)
  }
  const onFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) return
    setFormFocused(true)
    requestAnimationFrame(() => event.target.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  }
  const onBlurCapture = () => requestAnimationFrame(() => setFormFocused(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement))
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const point = event.touches[0]
    const target = event.target as HTMLElement
    touchStart.current = { x: point.clientX, y: point.clientY, blocked: Boolean(target.closest('a,button,input,textarea,select,[data-horizontal-carousel]')) }
  }
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start || start.blocked) return
    const point = event.changedTouches[0]
    const dx = point.clientX - start.x
    const dy = point.clientY - start.y
    if (Math.abs(dx) < 56 || Math.abs(dx) <= Math.abs(dy) * 1.2) return
    navigateChapter(activeChapter + (dx < 0 ? 1 : -1))
  }

  return <div className="mobile-chapter-viewport" onFocusCapture={onFocusCapture} onBlurCapture={onBlurCapture} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <main id="main" className="mobile-chapter-track" ref={chapterRef} onScroll={onChapterScroll} onKeyDown={onChapterKeyDown} tabIndex={0} aria-label={t.chapterNavigation}>
      <section className="mobile-chapter home-chapter" id="chapter-hero" data-chapter="1"><MobileHero onDirections={() => navigateChapter(1)} /></section>
      <section className="mobile-chapter home-chapter mobile-directions-chapter" id="directions" data-chapter="2" aria-labelledby="mobile-directions-title"><MobileDirections onSelect={selectDirection} /></section>
      <section className="mobile-chapter home-chapter" id="featured" data-chapter="3"><MobileProjects featured activeFocus={activeFocus} /></section>
      <section className="mobile-chapter home-chapter" id="more-projects" data-chapter="4"><MobileProjects featured={false} /></section>
      <section className="mobile-chapter home-chapter" id="process" data-chapter="5"><MobileProcess /></section>
      <section className="mobile-chapter home-chapter" id="skills" data-chapter="6"><MobileSkills /></section>
      <section className="mobile-chapter home-chapter" id="experience-education" data-chapter="7"><MobileExperience /></section>
      <section className="mobile-chapter home-chapter mobile-contact-chapter" id="contact" data-chapter="8"><Contact mobile /><Footer /></section>
    </main>
    <nav className={`mobile-chapter-navigation ${formFocused ? 'is-hidden' : ''}`} aria-label={t.chapterNavigation}>
      <button type="button" onClick={() => navigateChapter(activeChapter - 1)} disabled={activeChapter === 0} aria-label={`${t.goToChapter} ${Math.max(activeChapter, 1)} ${t.chapterOf} 8`}>←</button>
      <span aria-live="polite">{String(activeChapter + 1).padStart(2, '0')} / 08</span>
      <span className="mobile-chapter-dots">{chapters.map((item, index) => <button key={item.id} type="button" className={activeChapter === index ? 'is-active' : ''} onClick={() => navigateChapter(index)} aria-label={`${t.goToChapter} ${index + 1}: ${chapterLabels[index]}`} aria-current={activeChapter === index ? 'step' : undefined} />)}</span>
      <button type="button" onClick={() => navigateChapter(activeChapter === chapters.length - 1 ? 0 : activeChapter + 1)} aria-label={activeChapter === chapters.length - 1 ? t.top : `${t.goToChapter} ${activeChapter + 2} ${t.chapterOf} 8`}>{activeChapter === chapters.length - 1 ? '↑' : '→'}</button>
    </nav>
  </div>
}
