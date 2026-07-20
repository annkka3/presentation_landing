import { useEffect, useRef, useState, type FocusEvent, type ReactNode, type TouchEvent, type UIEvent } from 'react'
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

type HeroFocus = (typeof heroModes)[number]['key']

function initialChapter() {
  const hash = decodeURIComponent(window.location.hash.slice(1))
  const stableIndex = chapters.findIndex(({ id }) => id === hash)
  const numbered = /^chapter-(\d)$/.exec(hash)
  return stableIndex >= 0 ? stableIndex : numbered ? Math.min(Number(numbered[1]) - 1, chapters.length - 1) : 0
}

function MobileHero({ onDirections }: { onDirections: () => void }) {
  const { locale, t } = useApp()
  const proof = locale === 'ru' ? [
    ['20+ лет', 'коммерческого опыта'],
    ['10+ проектов', 'в продукте и дизайне'],
    ['Полный цикл', 'от идеи до релиза'],
    ['AI-native подход', 'Claude · Codex · Cursor'],
  ] : [
    ['20+ years', 'commercial experience'],
    ['10+ projects', 'in product and design'],
    ['Full-cycle', 'from idea to launch'],
    ['AI-native workflow', 'Claude · Codex · Cursor'],
  ]

  return <div className="mobile-hero" id="top">
    <span className="mobile-hero-eyebrow">01 · AI PRODUCT BUILDER</span>
    <div className="mobile-hero-copy">
      <h1>{t.heroTitle}</h1>
      <p>{locale === 'ru' ? 'От продуктовой архитектуры и визуальной системы до реализации, проверки и запуска.' : 'From product architecture and visual systems to implementation, validation, and launch.'}</p>
    </div>
    <button className="mobile-hero-composite" type="button" onClick={onDirections} aria-label={t.chooseDirection}>
      <span className="mobile-hero-composite-design"><img src="/assets/design.png" alt="" width="900" height="563" loading="eager" decoding="async" /></span>
      <span className="mobile-hero-composite-product"><img src="/assets/product.png" alt="" width="900" height="563" loading="eager" decoding="async" /></span>
      <span className="mobile-hero-composite-automation"><img src="/assets/automation.png" alt="" width="900" height="563" loading="eager" decoding="async" /></span>
      <span className="mobile-hero-interface-layer" aria-hidden="true"><i /><i /><i /></span>
      <span className="mobile-hero-composite-labels" aria-hidden="true"><i>PRODUCT</i><i>DESIGN</i><i>AI</i><i>DATA</i></span>
    </button>
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
        className={`mobile-direction-tile mobile-direction-tile--${mode.key}`}
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
      {items.map((project, index) => <div role="listitem" className={!featured && index === 1 ? 'mobile-project-teaser' : undefined} key={project.id}><ProjectCard project={project} featured={featured} /></div>)}
    </div>
  </div>
}

function MobileProcess() {
  const { locale, t } = useApp()
  const [active, setActive] = useState(0)
  return <div className="mobile-section mobile-process-section">
    <h2>{t.process}</h2>
    <div className="mobile-process-timeline" aria-label={t.process}>
      {processSteps.map((step, index) => {
        const expanded = active === index
        return <article className={expanded ? 'is-active' : ''} key={step.num}>
          <button type="button" onClick={() => setActive(index)} aria-expanded={expanded} aria-controls={`mobile-process-${step.num}`}>
            <i className="mobile-process-dot" aria-hidden="true"/><span>{step.num}</span><strong>{step.title[locale]}</strong><em aria-hidden="true">{expanded ? '−' : '+'}</em>
          </button>
          <div id={`mobile-process-${step.num}`} className="mobile-process-detail" hidden={!expanded} aria-live="polite">
            <p>{step.description[locale]}</p><small>{locale === 'ru' ? 'РЕЗУЛЬТАТ' : 'OUTCOME'}</small><strong>{step.result[locale]}</strong>
          </div>
        </article>
      })}
    </div>
  </div>
}

function MobileChapter({ id, index, active, className = '', labelledBy, navigation, children }: { id: string; index: number; active: boolean; className?: string; labelledBy?: string; navigation: ReactNode; children: ReactNode }) {
  return <section className={`mobile-chapter home-chapter ${className}`} id={id} data-chapter={index + 1} aria-labelledby={labelledBy}>
    <div className="mobile-chapter-content">{children}</div>
    {active && <div className="mobile-chapter-navigation-slot">{navigation}</div>}
  </section>
}

function MobileChapterNavigation({ activeChapter, formFocused, labels, navigate, scrollTop }: { activeChapter: number; formFocused: boolean; labels: string[]; navigate: (index: number) => void; scrollTop: () => void }) {
  const { t } = useApp()
  const finalChapter = activeChapter === chapters.length - 1
  return <nav className={`mobile-chapter-navigation ${formFocused ? 'is-hidden' : ''}`} aria-label={t.chapterNavigation}>
    <button type="button" onClick={() => navigate(activeChapter - 1)} disabled={activeChapter === 0} aria-label={`${t.goToChapter} ${Math.max(activeChapter, 1)} ${t.chapterOf} 8`}>←</button>
    <span aria-live="polite">{String(activeChapter + 1).padStart(2, '0')} / 08</span>
    <span className="mobile-chapter-dots">{chapters.map((item, index) => <button key={item.id} type="button" className={activeChapter === index ? 'is-active' : ''} onClick={() => navigate(index)} aria-label={`${t.goToChapter} ${index + 1}: ${labels[index]}`} aria-current={activeChapter === index ? 'step' : undefined} />)}</span>
    <button type="button" onClick={finalChapter ? scrollTop : () => navigate(activeChapter + 1)} aria-label={finalChapter ? t.top : `${t.goToChapter} ${activeChapter + 2} ${t.chapterOf} 8`}>{finalChapter ? '↑' : '→'}</button>
  </nav>
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
    window.dispatchEvent(new CustomEvent('mobile-chapter-scroll', { detail: { compact: false } }))
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
  const scrollActiveChapterTop = () => document.getElementById(chapters[activeChapter].id)?.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  const onFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) return
    setFormFocused(true)
    requestAnimationFrame(() => event.target.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }))
  }
  const onBlurCapture = () => requestAnimationFrame(() => setFormFocused(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement))
  const onScrollCapture = (event: UIEvent<HTMLDivElement>) => {
    const target = event.target
    if (!(target instanceof HTMLElement) || !target.classList.contains('mobile-chapter')) return
    window.dispatchEvent(new CustomEvent('mobile-chapter-scroll', { detail: { compact: target.scrollTop > 48 } }))
  }
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

  const navigation = <MobileChapterNavigation activeChapter={activeChapter} formFocused={formFocused} labels={chapterLabels} navigate={navigateChapter} scrollTop={scrollActiveChapterTop}/>

  return <div className={`mobile-chapter-viewport ${formFocused ? 'is-form-focused' : ''}`} onFocusCapture={onFocusCapture} onBlurCapture={onBlurCapture} onScrollCapture={onScrollCapture} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <main id="main" className="mobile-chapter-track" ref={chapterRef} onScroll={onChapterScroll} onKeyDown={onChapterKeyDown} tabIndex={0} aria-label={t.chapterNavigation}>
      <MobileChapter id="chapter-hero" index={0} active={activeChapter === 0} navigation={navigation}><MobileHero onDirections={() => navigateChapter(1)} /></MobileChapter>
      <MobileChapter id="directions" index={1} active={activeChapter === 1} navigation={navigation} className="mobile-directions-chapter" labelledBy="mobile-directions-title"><MobileDirections onSelect={selectDirection} /></MobileChapter>
      <MobileChapter id="featured" index={2} active={activeChapter === 2} navigation={navigation}><MobileProjects featured activeFocus={activeFocus} /></MobileChapter>
      <MobileChapter id="more-projects" index={3} active={activeChapter === 3} navigation={navigation}><MobileProjects featured={false} /></MobileChapter>
      <MobileChapter id="process" index={4} active={activeChapter === 4} navigation={navigation}><MobileProcess /></MobileChapter>
      <MobileChapter id="skills" index={5} active={activeChapter === 5} navigation={navigation}><MobileSkills /></MobileChapter>
      <MobileChapter id="experience-education" index={6} active={activeChapter === 6} navigation={navigation}><MobileExperience /></MobileChapter>
      <MobileChapter id="contact" index={7} active={activeChapter === 7} navigation={navigation} className="mobile-contact-chapter"><Contact mobile /><Footer /></MobileChapter>
    </main>
  </div>
}
