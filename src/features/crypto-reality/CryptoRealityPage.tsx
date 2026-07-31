import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { cryptoReality, cryptoScreens, type CryptoScreenKey } from '../../data/cryptoRealityCase'
import type { Locale } from '../../types'
import './CryptoRealityPage.css'

type L = { ru: string; en: string }

const t = (value: L | string, locale: Locale) => typeof value === 'string' ? value : value[locale]

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
      sizes={variant === 'panel' ? '(max-width: 760px) 92vw, 46vw' : '(max-width: 760px) 74vw, 280px'}
      alt={t(item.alt, locale)}
      width="1320"
      height="2868"
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
    />
    {caption && <figcaption>{t(caption, locale)}</figcaption>}
  </figure>
}

function CaseScreenSequence({ screens, captions, locale }: { screens: CryptoScreenKey[]; captions: (L | string)[]; locale: Locale }) {
  return <div className="cr-screen-sequence" aria-label={locale === 'ru' ? 'Последовательность экранов продукта' : 'Product screen sequence'}>
    {screens.map((screen, index) => <CaseScreenFrame key={screen} screen={screen} locale={locale} caption={captions[index]} />)}
  </div>
}

function CaseAnnotation({ title, text, index }: { title: string; text: L; index: number }) {
  const { locale } = useApp()
  return <article className="cr-annotation">
    <span>{String(index + 1).padStart(2, '0')}</span>
    <h3>{title}</h3>
    <p>{text[locale]}</p>
  </article>
}

function SignalDiagram({ items }: { items: string[] }) {
  return <div className="cr-signal-diagram" aria-hidden="true">
    {items.map((item, index) => <span key={item}>{item}{index < items.length - 1 && <i>→</i>}</span>)}
  </div>
}

function LoopDiagram({ locale }: { locale: Locale }) {
  return <div className="cr-loop-diagram">
    {cryptoReality.sections.loop.steps.map((step, index) => <article key={step.label}>
      <span>{String(index + 1).padStart(2, '0')}</span>
      <h3>{t(step.title, locale)}</h3>
      <p>{t(step.text, locale)}</p>
    </article>)}
  </div>
}

function ProductArchitecture({ locale }: { locale: Locale }) {
  const { architecture } = cryptoReality.sections
  return <section className="cr-section cr-architecture" aria-labelledby="cr-architecture-title">
    <Container>
      <div className="cr-section-heading">
        <span>11 · SYSTEM ARCHITECTURE</span>
        <h2 id="cr-architecture-title">{t(architecture.title, locale)}</h2>
        <p>{t(architecture.text, locale)}</p>
      </div>
      <div className="cr-architecture-map" aria-label={locale === 'ru' ? 'Архитектура продукта Crypto Reality' : 'Crypto Reality product architecture'}>
        {architecture.layers.map((layer) => <article key={layer.title}>
          <h3>{layer.title}</h3>
          <ul>{layer.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>)}
      </div>
    </Container>
  </section>
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

function CryptoRealityHero({ locale }: { locale: Locale }) {
  const { hero } = cryptoReality
  return <section className="cr-hero" aria-labelledby="cr-title">
    <Container>
      <Link className="back-link cr-back" to="/">{t(cryptoReality.back, locale)}</Link>
      <div className="cr-hero-grid">
        <div className="cr-hero-copy">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1 id="cr-title">{hero.title}</h1>
          <p className="cr-hero-subtitle">{t(hero.subtitle, locale)}</p>
          <p>{t(hero.description, locale)}</p>
          <p className="cr-role-line">{hero.role}</p>
          <span className="status-badge detail-status">{hero.status}</span>
          <ul className="cr-facts">{hero.facts.map((fact) => <li key={fact.en}>{t(fact, locale)}</li>)}</ul>
        </div>
        <div className="cr-hero-media" aria-label={locale === 'ru' ? 'Ключевые экраны Crypto Reality' : 'Key Crypto Reality screens'}>
          <CaseScreenFrame screen="memeEvent" locale={locale} priority />
          <CaseScreenFrame screen="createRoom" locale={locale} />
          <CaseScreenFrame screen="seasonVictory" locale={locale} />
          <div className="cr-hero-ghost" aria-hidden="true"><CaseScreenFrame screen="profile" locale={locale} /></div>
        </div>
      </div>
    </Container>
  </section>
}

function ProjectSnapshot({ locale }: { locale: Locale }) {
  const { snapshot } = cryptoReality
  return <section className="cr-section cr-snapshot" aria-labelledby="cr-snapshot-title">
    <Container>
      <h2 id="cr-snapshot-title" className="sr-only">Project snapshot</h2>
      <div className="cr-snapshot-grid">
        {snapshot.items.map((item) => <article key={item.title.en}>
          <h3>{t(item.title, locale)}</h3>
          <p>{t(item.text, locale)}</p>
        </article>)}
      </div>
      <p className="cr-snapshot-note">{t(snapshot.note, locale)}</p>
    </Container>
  </section>
}

function ProblemHypothesis({ locale }: { locale: Locale }) {
  const { problem } = cryptoReality.sections
  return <section className="cr-section cr-problem" aria-labelledby="cr-problem-title">
    <Container>
      <div className="cr-section-heading">
        <span>03 · PRODUCT HYPOTHESIS</span>
        <h2 id="cr-problem-title">{t(problem.title, locale)}</h2>
      </div>
      <div className="cr-two-col">
        <article><h3>{t(problem.problemTitle, locale)}</h3><p>{t(problem.problemText, locale)}</p></article>
        <article><h3>{t(problem.hypothesisTitle, locale)}</h3><p>{t(problem.hypothesisText, locale)}</p></article>
      </div>
      <blockquote className="cr-product-statement">{t(problem.statement, locale)}</blockquote>
      <SignalDiagram items={problem.signal} />
    </Container>
  </section>
}

function SeasonCoreLoop({ locale }: { locale: Locale }) {
  const { loop } = cryptoReality.sections
  return <section className="cr-section cr-core-loop" aria-labelledby="cr-loop-title">
    <Container>
      <div className="cr-section-heading">
        <span>04 · CORE LOOP</span>
        <h2 id="cr-loop-title">{t(loop.title, locale)}</h2>
        <p>{t(loop.subtitle, locale)}</p>
      </div>
      <LoopDiagram locale={locale} />
      <CaseScreenSequence screens={['createRoom', 'archetypeRisk', 'memeChoices', 'seasonVictory']} captions={loop.captions} locale={locale} />
    </Container>
  </section>
}

function RoomSocialSystem({ locale }: { locale: Locale }) {
  const { rooms } = cryptoReality.sections
  return <section className="cr-section cr-room-system" aria-labelledby="cr-rooms-title">
    <Container>
      <div className="cr-section-heading">
        <span>05 · ROOM-BASED SOCIAL GAME</span>
        <h2 id="cr-rooms-title">{t(rooms.title, locale)}</h2>
        <p>{t(rooms.text, locale)}</p>
      </div>
      <SignalDiagram items={rooms.flow} />
      <div className="cr-room-grid">
        <CaseScreenFrame screen="createRoom" locale={locale} variant="panel" caption={rooms.groups[0]} />
        <div className="cr-mosaic">
          {(['invite', 'roomState', 'eventRoom', 'leaderboard'] as CryptoScreenKey[]).map((screen) => <CaseScreenFrame key={screen} screen={screen} locale={locale} />)}
        </div>
      </div>
    </Container>
  </section>
}

function DecisionSystem({ locale }: { locale: Locale }) {
  const { decisions } = cryptoReality.sections
  return <section className="cr-section cr-decisions" aria-labelledby="cr-decisions-title">
    <Container>
      <div className="cr-section-heading">
        <span>06 · DECISION SYSTEM</span>
        <h2 id="cr-decisions-title">{t(decisions.title, locale)}</h2>
        <p>{t(decisions.text, locale)}</p>
      </div>
      <div className="cr-decision-grid">
        <CaseScreenFrame screen="memeChoices" locale={locale} variant="panel" />
        <div className="cr-annotations">{decisions.annotations.map((annotation, index) => <CaseAnnotation key={annotation.title} title={annotation.title} text={annotation.text} index={index} />)}</div>
      </div>
      <div className="cr-transition-label">{decisions.transition}</div>
      <div className="cr-result-pair">
        <CaseScreenFrame screen="riskyResult" locale={locale} variant="panel" />
        <CaseScreenFrame screen="resultDetail" locale={locale} variant="panel" />
      </div>
      <div className="cr-decision-support">
        {(['fundingEvent', 'goodResult', 'goodResultDetail'] as CryptoScreenKey[]).map((screen) =>
          <CaseScreenFrame key={screen} screen={screen} locale={locale} />
        )}
      </div>
    </Container>
  </section>
}

function BehaviorModel({ locale }: { locale: Locale }) {
  const { behavior } = cryptoReality.sections
  return <section className="cr-section cr-behavior" aria-labelledby="cr-behavior-title">
    <Container>
      <div className="cr-section-heading">
        <span>07 · BEHAVIORAL MODEL</span>
        <h2 id="cr-behavior-title">{t(behavior.title, locale)}</h2>
        <p>{t(behavior.text, locale)}</p>
      </div>
      <div className="cr-behavior-grid">
        <div className="cr-stat-list">{behavior.stats.map((stat) => <div key={t(stat.label, locale)}><span>{t(stat.label, locale)}</span><i style={{ '--value': `${stat.value}%` } as React.CSSProperties} /><b>{stat.value}</b></div>)}</div>
        <RadarProfile locale={locale} />
        <article className="cr-example"><h3>{locale === 'ru' ? 'Мини-пример' : 'Mini example'}</h3><p>{t(behavior.example, locale)}</p></article>
      </div>
      <div className="cr-behavior-screens">
        <CaseScreenFrame screen="gameStats" locale={locale} variant="panel" />
        <CaseScreenFrame screen="statsList" locale={locale} variant="panel" />
      </div>
    </Container>
  </section>
}

function ArchetypeExplorer({ locale }: { locale: Locale }) {
  const { archetypes } = cryptoReality.sections
  const [active, setActive] = useState(0)
  const item = archetypes.items[active]
  return <section className="cr-section cr-archetypes" aria-labelledby="cr-archetypes-title">
    <Container>
      <div className="cr-section-heading">
        <span>08 · ARCHETYPES</span>
        <h2 id="cr-archetypes-title">{t(archetypes.title, locale)}</h2>
        <p>{t(archetypes.subtitle, locale)}</p>
      </div>
      <div className="cr-archetype-grid">
        <figure className="cr-archetype-visual" style={{ '--archetype-color': item.color } as React.CSSProperties}>
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
        <div className="cr-archetype-panel" style={{ '--archetype-color': item.color } as React.CSSProperties}>
          <h3>{item.name}</h3>
          <p>{t(item.text, locale)}</p>
          <ul>{item.traits.map((trait) => <li key={t(trait, locale)}>{t(trait, locale)}</li>)}</ul>
          <div className="cr-archetype-tabs" role="tablist" aria-label={t(archetypes.title, locale)}>
            {archetypes.items.map((archetype, index) => <button
              key={archetype.name}
              type="button"
              role="tab"
              aria-selected={active === index}
              className={active === index ? 'is-active' : undefined}
              style={{ '--archetype-color': archetype.color } as React.CSSProperties}
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
            >{archetype.name}</button>)}
          </div>
        </div>
      </div>
    </Container>
  </section>
}

function SeasonFinale({ locale }: { locale: Locale }) {
  const { finale } = cryptoReality.sections
  return <section className="cr-section cr-finale" aria-labelledby="cr-finale-title">
    <Container>
      <div className="cr-finale-grid">
        <CaseScreenFrame screen="seasonVictory" locale={locale} variant="panel" />
        <div className="cr-section-heading">
          <span>09 · SEASON FINALE</span>
          <h2 id="cr-finale-title">{t(finale.title, locale)}</h2>
          <p>{t(finale.text, locale)}</p>
          <blockquote>{t(finale.callout, locale)}</blockquote>
        </div>
      </div>
      <CaseScreenSequence
        screens={['seasonDynamics', 'lobbyFinale', 'leaderboard', 'achievements']}
        captions={[
          l('Динамика сезона', 'Season dynamics'),
          l('Финальное состояние лобби', 'Final lobby state'),
          'Leaderboard',
          l('Сезонные достижения', 'Season achievements'),
        ]}
        locale={locale}
      />
    </Container>
  </section>
}

function ProgressionEconomy({ locale }: { locale: Locale }) {
  const { progression } = cryptoReality.sections
  return <section className="cr-section cr-progression" aria-labelledby="cr-progression-title">
    <Container>
      <div className="cr-section-heading">
        <span>10 · PROGRESSION AND DAO MARKET</span>
        <h2 id="cr-progression-title">{t(progression.title, locale)}</h2>
        <p>{t(progression.text, locale)}</p>
      </div>
      <div className="cr-layer-row">{progression.layers.map((layer) => <span key={layer}>{layer}</span>)}</div>
      <CaseScreenSequence screens={['achievements', 'profile', 'marketFrames', 'marketSkins']} captions={[progression.layers[0], progression.layers[1], 'Frames', 'Skins']} locale={locale} />
      <SignalDiagram items={progression.flow} />
      <p className="cr-disclaimer">{t(progression.disclaimer, locale)}</p>
    </Container>
  </section>
}

function RoleAndDelivery({ locale }: { locale: Locale }) {
  const { role } = cryptoReality.sections
  return <section className="cr-section cr-role" aria-labelledby="cr-role-title">
    <Container>
      <div className="cr-section-heading">
        <span>12 · ROLE, PROCESS AND DELIVERY</span>
        <h2 id="cr-role-title">{t(role.title, locale)}</h2>
      </div>
      <div className="cr-role-grid">
        {role.blocks.map((block) => <article key={block.title}><h3>{block.title}</h3><ul>{block.items.map((item) => <li key={item.en}>{t(item, locale)}</li>)}</ul></article>)}
      </div>
      <div className="cr-stack" aria-label={locale === 'ru' ? 'Технологический стек' : 'Technology stack'}>{role.stack.map((item) => <span key={item}>{item}</span>)}</div>
    </Container>
  </section>
}

function ProductDecisions({ locale }: { locale: Locale }) {
  const { solutions } = cryptoReality.sections
  return <section className="cr-section cr-solutions" aria-labelledby="cr-solutions-title">
    <Container>
      <div className="cr-section-heading">
        <span>PRODUCT DECISIONS</span>
        <h2 id="cr-solutions-title">{t(solutions.title, locale)}</h2>
      </div>
      <div className="cr-solutions-grid">
        {solutions.items.map((item, index) => <article key={item.title.en}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{t(item.title, locale)}</h3>
          <p>{t(item.text, locale)}</p>
        </article>)}
      </div>
    </Container>
  </section>
}

function ProjectContact({ locale }: { locale: Locale }) {
  const { contact } = cryptoReality.sections
  return <section className="cr-section cr-contact" aria-labelledby="cr-contact-title">
    <Container>
      <div className="cr-contact-grid">
        <div>
          <span className="eyebrow">FINAL</span>
          <h2 id="cr-contact-title">{t(contact.title, locale)}</h2>
          <p>{t(contact.text, locale)}</p>
          <div className="cr-cta-row">
            <a className="hero-action hero-action--primary" href="mailto:annagromyko88@gmail.com">{t(contact.discuss, locale)}<span aria-hidden="true">→</span></a>
            <Link className="hero-action hero-action--secondary" to="/#featured">{t(contact.other, locale)}<span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <Link className="cr-next-project" to="/cases/the-dao-way">
          <span>{contact.next}</span>
          <strong>{contact.nextTitle}</strong>
          <small>{t(contact.nextText, locale)}</small>
        </Link>
      </div>
    </Container>
  </section>
}

function l(ru: string, en: string): L {
  return { ru, en }
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

  return <main id="main" className="cr-case-page">
    <CryptoRealityHero locale={locale} />
    <ProjectSnapshot locale={locale} />
    <ProblemHypothesis locale={locale} />
    <SeasonCoreLoop locale={locale} />
    <RoomSocialSystem locale={locale} />
    <DecisionSystem locale={locale} />
    <BehaviorModel locale={locale} />
    <ArchetypeExplorer locale={locale} />
    <SeasonFinale locale={locale} />
    <ProgressionEconomy locale={locale} />
    <ProductArchitecture locale={locale} />
    <RoleAndDelivery locale={locale} />
    <ProductDecisions locale={locale} />
    <ProjectContact locale={locale} />
  </main>
}
