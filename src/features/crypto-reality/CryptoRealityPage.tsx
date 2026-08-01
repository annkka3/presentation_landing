import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from 'react'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { cryptoReality, cryptoScreens, type CryptoScreenKey } from '../../data/cryptoRealityCase'
import type { Locale } from '../../types'
import { CryptoRealityFinalSection } from './CryptoRealityFinalSection'
import './CryptoRealityPage.css'
import './CryptoRealityFinalSection.css'

type L = { ru: string; en: string }
type GalleryItem = {
  id: string
  screen: CryptoScreenKey
  label: L | string
  title?: L | string
  description?: L | string
}

const t = (value: L | string, locale: Locale) => typeof value === 'string' ? value : value[locale]
const l = (ru: string, en: string): L => ({ ru, en })

function CaseScreenFrame({
  screen,
  locale,
  priority = false,
  variant = 'phone',
  caption,
}: {
  screen: CryptoScreenKey
  locale: Locale
  priority?: boolean
  variant?: 'phone' | 'panel'
  caption?: L | string
}) {
  const item = cryptoScreens[screen]
  return <figure className={`cr-screen cr-screen--${variant}`}>
    <img
      src={item.src}
      srcSet={item.srcSet}
      sizes={variant === 'panel' ? '(max-width: 760px) min(84vw, 340px), 520px' : '(max-width: 760px) 64vw, 250px'}
      alt={t(item.alt, locale)}
      width="1320"
      height="2868"
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
    />
    {caption && <figcaption>{t(caption, locale)}</figcaption>}
  </figure>
}

function CaseMediaGallery({
  id,
  items,
  locale,
  compact = false,
  onActiveChange,
  className = '',
}: {
  id: string
  items: GalleryItem[]
  locale: Locale
  compact?: boolean
  onActiveChange?: (index: number) => void
  className?: string
}) {
  const [active, setActive] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const item = items[active]

  const select = (next: number) => {
    const normalized = (next + items.length) % items.length
    setActive(normalized)
    onActiveChange?.(normalized)
  }
  const change = (next: number) => select(next)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      change(active + 1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      change(active - 1)
    }
    if (event.key === 'Home') {
      event.preventDefault()
      select(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      select(items.length - 1)
    }
  }
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => setTouchStart(event.changedTouches[0]?.clientX ?? null)
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return
    const distance = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart
    if (Math.abs(distance) > 42) change(active + (distance < 0 ? 1 : -1))
    setTouchStart(null)
  }

  return <div
    className={`cr-gallery${compact ? ' cr-gallery--compact' : ''}${className ? ` ${className}` : ''}`}
    data-gallery={id}
    onKeyDown={onKeyDown}
  >
    <div
      className="cr-gallery-stage"
      role="tabpanel"
      id={`${id}-panel-${item.id}`}
      aria-labelledby={`${id}-tab-${item.id}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <CaseScreenFrame key={`${id}-${item.id}`} screen={item.screen} locale={locale} variant="panel" />
      <div className="cr-gallery-caption">
        <span>{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        <strong>{t(item.title ?? item.label, locale)}</strong>
        {item.description && <p>{t(item.description, locale)}</p>}
      </div>
    </div>
    <div className="cr-gallery-nav" role="tablist" aria-label={locale === 'ru' ? 'Выбор экрана' : 'Screen selection'}>
      {items.map((galleryItem, index) => {
        const screen = cryptoScreens[galleryItem.screen]
        return <button
          key={galleryItem.id}
          id={`${id}-tab-${galleryItem.id}`}
          type="button"
          role="tab"
          aria-selected={active === index}
          aria-controls={`${id}-panel-${galleryItem.id}`}
          className={active === index ? 'is-active' : undefined}
          onClick={() => select(index)}
        >
          <img
            src={screen.src}
            alt=""
            width="132"
            height="286"
            loading={Math.abs(active - index) <= 1 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <span><i>{String(index + 1).padStart(2, '0')}</i>{t(galleryItem.label, locale)}</span>
        </button>
      })}
    </div>
    <div className="cr-gallery-dots" aria-hidden="true">
      {items.map((galleryItem, index) => <i key={galleryItem.id} className={active === index ? 'is-active' : undefined} />)}
    </div>
  </div>
}

function useFirstViewportEntry<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || entered) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setEntered(true)
        observer.disconnect()
      }
    }, { threshold: 0.24 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [entered])

  return { ref, entered }
}

function SectionHeading({
  number,
  label,
  title,
  text,
  locale,
  id,
}: {
  number: string
  label: string
  title: L
  text?: L
  locale: Locale
  id: string
}) {
  return <div className="cr-section-heading">
    <span>{number} · {label}</span>
    <h2 id={id}>{t(title, locale)}</h2>
    {text && <p>{t(text, locale)}</p>}
  </div>
}

function CaseAnnotation({ title, text, index, locale }: { title: string; text: L; index: number; locale: Locale }) {
  return <article className="cr-annotation">
    <span>{String(index + 1).padStart(2, '0')}</span>
    <h3>{title}</h3>
    <p>{t(text, locale)}</p>
  </article>
}

function SignalDiagram({ items }: { items: string[] }) {
  return <div className="cr-signal-diagram" aria-hidden="true">
    {items.map((item, index) => <span key={item}>{item}{index < items.length - 1 && <i>→</i>}</span>)}
  </div>
}

function RadarProfile({ locale }: { locale: Locale }) {
  const stats = cryptoReality.sections.behavior.stats
  const points = useMemo(() => {
    const cx = 130
    const cy = 130
    const r = 86
    return stats.map((stat, index) => {
      const angle = -Math.PI / 2 + (index * Math.PI * 2) / stats.length
      const value = stat.value / 100
      return `${cx + Math.cos(angle) * r * value},${cy + Math.sin(angle) * r * value}`
    }).join(' ')
  }, [stats])

  return <div className="cr-radar">
    <svg viewBox="0 0 260 260" role="img" aria-label={cryptoReality.sections.behavior.note}>
      <polygon points="130,44 212,104 181,199 79,199 48,104" className="cr-radar-grid" />
      <polygon points="130,70 187,111 165,177 95,177 73,111" className="cr-radar-grid" />
      <polygon points={points} className="cr-radar-shape" />
      {stats.map((stat, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / stats.length
        return <g key={t(stat.label, locale)}>
          <line x1="130" y1="130" x2={130 + Math.cos(angle) * 98} y2={130 + Math.sin(angle) * 98} />
          <text x={130 + Math.cos(angle) * 114} y={130 + Math.sin(angle) * 114}>{t(stat.label, locale)}</text>
        </g>
      })}
    </svg>
    <small>{cryptoReality.sections.behavior.note}</small>
  </div>
}

function IntroSection({ locale }: { locale: Locale }) {
  const { hero, snapshot } = cryptoReality
  return <section className="cr-hero cr-case-section" aria-labelledby="cr-title">
    <Container>
      <div className="cr-hero-grid">
        <div className="cr-hero-copy">
          <span className="eyebrow">01 · INTRO · {hero.eyebrow}</span>
          <h1 id="cr-title">{hero.title}</h1>
          <p className="cr-hero-subtitle">{t(hero.subtitle, locale)}</p>
          <p>{t(hero.description, locale)}</p>
          <p className="cr-role-line">{hero.role}</p>
          <span className="status-badge detail-status">{hero.status}</span>
        </div>
        <div className="cr-hero-media" aria-label={locale === 'ru' ? 'Ключевые экраны Crypto Reality' : 'Key Crypto Reality screens'}>
          <CaseScreenFrame screen="memeEvent" locale={locale} priority />
          <CaseScreenFrame screen="createRoom" locale={locale} />
          <CaseScreenFrame screen="seasonVictory" locale={locale} />
          <div className="cr-hero-ghost" aria-hidden="true"><CaseScreenFrame screen="profile" locale={locale} /></div>
        </div>
      </div>
      <div className="cr-hero-facts">
        {snapshot.items.map((item) => <article key={item.title.en}>
          <h3>{t(item.title, locale)}</h3>
          <p>{t(item.text, locale)}</p>
        </article>)}
      </div>
      <p className="cr-hero-note">{t(snapshot.note, locale)}</p>
    </Container>
  </section>
}

function ProductHypothesis({ locale }: { locale: Locale }) {
  const { problem } = cryptoReality.sections
  const compactProblem = l(
    'Большинство криптоигр строятся вокруг угадывания цены, симуляции торговли или абстрактных наград. Поведенческие паттерны — FOMO, дисциплина, стресс, риск и влияние толпы — остаются за пределами игрового опыта.',
    'Most crypto games revolve around price prediction, trading simulation, or abstract rewards. Behavioral patterns — FOMO, discipline, stress, risk, and crowd influence — remain outside the game experience.',
  )
  const compactHypothesis = l(
    'Crypto Reality моделирует не сделку, а процесс принятия решений. Игрок реагирует на ситуации, сравнивает выбор с комнатой и постепенно формирует поведенческий профиль.',
    'Crypto Reality models decision-making rather than a trade. The player reacts to situations, compares choices with the room, and gradually forms a behavioral profile.',
  )
  return <section className="cr-section cr-case-section cr-problem" aria-labelledby="cr-problem-title">
    <Container>
      <SectionHeading number="02" label="PRODUCT HYPOTHESIS" title={problem.title} locale={locale} id="cr-problem-title" />
      <div className="cr-two-col">
        <article><h3>{t(problem.problemTitle, locale)}</h3><p>{t(compactProblem, locale)}</p></article>
        <article><h3>{t(problem.hypothesisTitle, locale)}</h3><p>{t(compactHypothesis, locale)}</p></article>
      </div>
      <blockquote className="cr-product-statement">{t(problem.statement, locale)}</blockquote>
      <div className="cr-hypothesis-flow"><SignalDiagram items={problem.signal} /></div>
    </Container>
  </section>
}

function CoreLoop({ locale }: { locale: Locale }) {
  const { loop } = cryptoReality.sections
  const [activeGallery, setActiveGallery] = useState(0)
  const activeSteps = [0, 1, 3, 5]
  const gallery: GalleryItem[] = [
    { id: 'room', screen: 'createRoom', label: loop.captions[0], title: loop.steps[0].title, description: loop.steps[0].text },
    { id: 'archetype', screen: 'archetypeRisk', label: loop.captions[1], title: loop.steps[1].title, description: loop.steps[1].text },
    { id: 'event', screen: 'memeChoices', label: loop.captions[2], title: loop.steps[3].title, description: loop.steps[3].text },
    { id: 'final', screen: 'seasonVictory', label: loop.captions[3], title: loop.steps[5].title, description: loop.steps[5].text },
  ]
  return <section className="cr-section cr-case-section cr-core-loop" aria-labelledby="cr-loop-title">
    <Container>
      <SectionHeading number="03" label="CORE LOOP" title={loop.title} text={loop.subtitle} locale={locale} id="cr-loop-title" />
      <div className="cr-core-layout">
        <div className="cr-loop-diagram">
          {loop.steps.map((step, index) => <article key={step.label} className={activeSteps[activeGallery] === index ? 'is-active' : undefined}>
            <span>{String(index + 1).padStart(2, '0')} · {step.label}</span>
            <h3>{t(step.title, locale)}</h3>
            <p>{t(step.text, locale)}</p>
          </article>)}
        </div>
        <CaseMediaGallery id="core-loop-gallery" items={gallery} locale={locale} onActiveChange={setActiveGallery} />
      </div>
    </Container>
  </section>
}

function SocialGame({ locale }: { locale: Locale }) {
  const { rooms } = cryptoReality.sections
  const gallery: GalleryItem[] = [
    { id: 'host', screen: 'createRoom', label: 'Host', description: l('Создание комнаты и настройка сезона.', 'Room creation and season setup.') },
    { id: 'invite', screen: 'invite', label: 'Invite', description: l('Код и Telegram-native приглашение.', 'Code and Telegram-native invite.') },
    { id: 'timeline', screen: 'roomState', label: 'Shared timeline', description: l('Общее состояние сезона и ответы комнаты.', 'Shared season state and room responses.') },
    { id: 'live', screen: 'eventRoom', label: 'Live leaderboard', description: l('Активное событие и текущая динамика.', 'Active event and live dynamics.') },
    { id: 'final', screen: 'leaderboard', label: 'Final leaderboard', description: l('Итоговое сравнение участников.', 'Final participant comparison.') },
  ]
  return <section className="cr-section cr-case-section cr-social" aria-labelledby="cr-social-title">
    <Container>
      <SectionHeading number="04" label="SOCIAL GAME" title={rooms.title} text={rooms.text} locale={locale} id="cr-social-title" />
      <CaseMediaGallery id="social-gallery" items={gallery} locale={locale} compact />
      <p className="cr-section-conclusion">{locale === 'ru' ? 'Комната связывает индивидуальное решение с поведением группы.' : 'The room connects an individual decision with group behavior.'}</p>
    </Container>
  </section>
}

function DecisionSystem({ locale }: { locale: Locale }) {
  const { decisions } = cryptoReality.sections
  const gallery: GalleryItem[] = [
    { id: 'situation', screen: 'memeEvent', label: l('Ситуация', 'Situation'), description: l('Неоднозначный рыночный или социальный сигнал.', 'An ambiguous market or social signal.') },
    { id: 'choice', screen: 'memeChoices', label: l('Выбор', 'Choice'), description: l('Несколько стратегий без подсказки о правильном ответе.', 'Several strategies with no hint at the correct answer.') },
    { id: 'consequence', screen: 'riskyResult', label: l('Последствие', 'Consequence'), description: l('Отложенная обратная связь меняет счёт и профиль.', 'Delayed feedback changes the score and profile.') },
  ]
  return <section className="cr-section cr-case-section cr-decisions" aria-labelledby="cr-decisions-title">
    <Container>
      <SectionHeading number="05" label="DECISION SYSTEM" title={decisions.title} text={decisions.text} locale={locale} id="cr-decisions-title" />
      <div className="cr-decision-editorial">
        <CaseMediaGallery id="decision-gallery" items={gallery} locale={locale} compact />
        <div className="cr-annotations">{decisions.annotations.map((annotation, index) => <CaseAnnotation key={annotation.title} title={annotation.title} text={annotation.text} index={index} locale={locale} />)}</div>
      </div>
    </Container>
  </section>
}

function BehavioralModel({ locale }: { locale: Locale }) {
  const { behavior } = cryptoReality.sections
  const { ref, entered } = useFirstViewportEntry<HTMLElement>()
  const gallery: GalleryItem[] = [
    { id: 'overview', screen: 'gameStats', label: l('Обзор показателей', 'Overview stats'), description: l('Окна дня и результаты по этапам.', 'Day windows and stage results.') },
    { id: 'details', screen: 'statsList', label: l('Детальные показатели', 'Detailed stats'), description: l('Полный поведенческий профиль игрока.', 'The complete player behavior profile.') },
  ]
  return <section ref={ref} className={`cr-section cr-case-section cr-behavior${entered ? ' is-entered' : ''}`} aria-labelledby="cr-behavior-title">
    <Container>
      <SectionHeading number="06" label="BEHAVIORAL MODEL" title={behavior.title} text={behavior.text} locale={locale} id="cr-behavior-title" />
      <div className="cr-behavior-layout">
        <div className="cr-behavior-grid">
          <div className="cr-stat-list">{behavior.stats.map((stat) => <div key={t(stat.label, locale)}><span>{t(stat.label, locale)}</span><i style={{ '--value': `${stat.value}%` } as CSSProperties} /><b>{stat.value}</b></div>)}</div>
          <RadarProfile locale={locale} />
        </div>
        <CaseMediaGallery id="behavior-gallery" items={gallery} locale={locale} compact />
      </div>
    </Container>
  </section>
}

function Archetypes({ locale }: { locale: Locale }) {
  const { archetypes } = cryptoReality.sections
  const [active, setActive] = useState(0)
  const item = archetypes.items[active]
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((active + 1) % archetypes.items.length)
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((active - 1 + archetypes.items.length) % archetypes.items.length)
    }
  }
  return <section className="cr-section cr-case-section cr-archetypes" aria-labelledby="cr-archetypes-title">
    <Container>
      <SectionHeading number="07" label="ARCHETYPES" title={archetypes.title} text={archetypes.subtitle} locale={locale} id="cr-archetypes-title" />
      <div className="cr-archetype-grid">
        <figure className="cr-archetype-visual" style={{ '--archetype-color': item.color } as CSSProperties}>
          <img
            key={item.image}
            src={item.image}
            alt={`${item.name} — ${locale === 'ru' ? 'архетип Crypto Reality' : 'Crypto Reality archetype'}`}
            width="1122"
            height="1402"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="cr-archetype-panel" style={{ '--archetype-color': item.color } as CSSProperties}>
          <h3>{item.name}</h3>
          <p>{t(item.text, locale)}</p>
          <ul>{item.traits.map((trait) => <li key={t(trait, locale)}>{t(trait, locale)}</li>)}</ul>
          <div className="cr-archetype-tabs" role="tablist" aria-label={t(archetypes.title, locale)} onKeyDown={onKeyDown}>
            {archetypes.items.map((archetype, index) => <button
              key={archetype.name}
              type="button"
              role="tab"
              aria-selected={active === index}
              className={active === index ? 'is-active' : undefined}
              style={{ '--archetype-color': archetype.color } as CSSProperties}
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
            >{archetype.name}</button>)}
          </div>
        </div>
      </div>
    </Container>
  </section>
}

const progressionGroups = {
  final: [
    { id: 'victory', screen: 'seasonVictory', label: l('Итог сезона', 'Season result') },
    { id: 'leaderboard', screen: 'leaderboard', label: 'Leaderboard' },
    { id: 'dynamics', screen: 'seasonDynamics', label: l('Динамика', 'Dynamics') },
  ],
  progression: [
    { id: 'achievements', screen: 'achievements', label: 'Achievements' },
    { id: 'profile', screen: 'profile', label: 'Profile' },
    { id: 'collection', screen: 'lobbyFinale', label: l('Коллекционный прогресс', 'Collection progress') },
  ],
  market: [
    { id: 'frames', screen: 'marketFrames', label: 'Frames' },
    { id: 'skins', screen: 'marketSkins', label: 'Skins' },
  ],
} satisfies Record<string, GalleryItem[]>

function ProgressionEditorial({ locale }: { locale: Locale }) {
  const { finale, progression } = cryptoReality.sections
  const items = progressionGroups.final
  const [active, setActive] = useState(0)
  const item = items[active]
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') setActive((active + 1) % items.length)
    if (event.key === 'ArrowLeft') setActive((active - 1 + items.length) % items.length)
  }

  return <div className="cr-progression-panel">
    <div className="cr-progression-media" role="tabpanel" id={`progression-panel-${item.id}`} aria-labelledby={`progression-tab-${item.id}`}>
      <CaseScreenFrame key={item.id} screen={item.screen} locale={locale} variant="panel" />
      <div className="cr-progression-caption">
        <span>{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        <strong>{t(item.label, locale)}</strong>
      </div>
    </div>
    <div className="cr-progression-copy">
      <p className="cr-progression-thesis">{t(finale.callout, locale)}</p>
      <div className="cr-progression-tabs" role="tablist" aria-label={locale === 'ru' ? 'Экраны финала сезона' : 'Season finale screens'} onKeyDown={onKeyDown}>
        {items.map((galleryItem, index) => <button
          key={galleryItem.id}
          id={`progression-tab-${galleryItem.id}`}
          type="button"
          role="tab"
          aria-selected={active === index}
          aria-controls={`progression-panel-${galleryItem.id}`}
          className={active === index ? 'is-active' : undefined}
          onClick={() => setActive(index)}
        ><i>{String(index + 1).padStart(2, '0')}</i><span>{t(galleryItem.label, locale)}</span></button>)}
      </div>
      <p className="cr-sparks-note">{t(progression.text, locale)}</p>
    </div>
  </div>
}

function ProgressionEconomy({ locale }: { locale: Locale }) {
  const { progression } = cryptoReality.sections
  return <section className="cr-section cr-case-section cr-progression-suite" aria-labelledby="cr-progression-title">
    <Container>
      <SectionHeading number="08" label="PROGRESSION AND ECONOMY" title={progression.title} locale={locale} id="cr-progression-title" />
      <ProgressionEditorial locale={locale} />
    </Container>
  </section>
}

function SystemDelivery({ locale }: { locale: Locale }) {
  const { architecture, role, solutions } = cryptoReality.sections
  const { ref, entered } = useFirstViewportEntry<HTMLElement>()
  return <>
    <section ref={ref} className={`cr-section cr-case-section cr-system-delivery${entered ? ' is-entered' : ''}`} aria-labelledby="cr-system-title">
      <Container>
        <SectionHeading number="09" label="SYSTEM AND DELIVERY" title={architecture.title} text={architecture.text} locale={locale} id="cr-system-title" />
        <div className="cr-architecture-map" aria-label={locale === 'ru' ? 'Архитектура продукта Crypto Reality' : 'Crypto Reality product architecture'}>
          {architecture.layers.map((layer, index) => <article key={layer.title} style={{ '--layer-index': index } as CSSProperties}>
            <span className="cr-layer-index">{String(index + 1).padStart(2, '0')}</span>
            <h3>{layer.title}</h3>
            <ul>{layer.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>)}
        </div>
      </Container>
    </section>

    <section className="cr-section cr-delivery-continuation" aria-labelledby="cr-role-title">
      <Container>
        <div className="cr-role-block">
          <div className="cr-section-heading cr-section-heading--compact">
            <span>PRODUCT · UX · VISUAL · DELIVERY</span>
            <h2 id="cr-role-title">{t(role.title, locale)}</h2>
          </div>
          <div className="cr-role-grid">
            {role.blocks.map((block) => <article key={block.title}><h3>{block.title}</h3><ul>{block.items.map((item) => <li key={item.en}>{t(item, locale)}</li>)}</ul></article>)}
          </div>
          <div className="cr-stack" aria-label={locale === 'ru' ? 'Технологический стек' : 'Technology stack'}>{role.stack.map((item) => <span key={item}>{item}</span>)}</div>
        </div>

        <div className="cr-decisions-block">
          <h2>{t(solutions.title, locale)}</h2>
          <div className="cr-solutions-grid">
            {solutions.items.map((item, index) => <article key={item.title.en}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{t(item.title, locale)}</h3>
              <p>{t(item.text, locale)}</p>
            </article>)}
          </div>
        </div>
      </Container>
    </section>

    <CryptoRealityFinalSection locale={locale} />
  </>
}

export default function CryptoRealityPage() {
  const { locale } = useApp()

  useEffect(() => {
    document.title = 'Crypto Reality — Anna Gromyko'
    document.documentElement.dataset.page = 'crypto-reality'
    scrollTo(0, 0)
    return () => {
      delete document.documentElement.dataset.page
    }
  }, [])

  return <main id="main" className="cr-case-page crypto-case">
    <IntroSection locale={locale} />
    <ProductHypothesis locale={locale} />
    <CoreLoop locale={locale} />
    <SocialGame locale={locale} />
    <DecisionSystem locale={locale} />
    <BehavioralModel locale={locale} />
    <Archetypes locale={locale} />
    <ProgressionEconomy locale={locale} />
    <SystemDelivery locale={locale} />
  </main>
}
