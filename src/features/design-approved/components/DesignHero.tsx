import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../../app/AppContext'
import { DESIGN_APPROVED_ASSETS as A } from '../designApprovedAssets'
import { HERO_DIRECTIONS, PROOF_POINTS, UI_TEXT } from '../designApprovedContent'

export function DesignHero() {
  const { locale, setLocale, theme, toggleTheme } = useApp()
  const text = UI_TEXT[locale]
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activeDirection, setActiveDirection] = useState<number | null>(null)
  const [resumeMessageVisible, setResumeMessageVisible] = useState(false)
  const words = text.heroH1.split(' ')
  const firstWord = words[0]
  const rest = ` ${words.slice(1).join(' ')}`
  const activeArtifact = activeDirection === null ? null : activeDirection < 3 ? 'commerce' : activeDirection === 3 ? 'brand' : 'mobile'
  const artifactOpacity = (artifact: 'commerce' | 'brand' | 'mobile') => activeArtifact === null || activeArtifact === artifact ? 1 : .35

  const playVideo = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    videoRef.current?.play().catch(() => undefined)
  }

  const stopVideo = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  return (
    <section id="design-approved-hero" className="design-approved-hero" data-chapter="1" aria-label="Design Hero">
      <header className="design-approved-hero-header">
        <Link className="design-approved-hero-brandmark" to="/" aria-label="Anna Gromyko — AI Product Builder">
          <span>ANNA GROMYKO</span>
          <small>AI PRODUCT BUILDER</small>
        </Link>
        <nav className="design-approved-hero-nav" aria-label={locale === 'ru' ? 'Основная навигация' : 'Primary navigation'}>
          <Link to="/#product">{text.navProduct}</Link>
          <a className="design-approved-hero-nav__active" href="#main" aria-current="page">{text.navDesign}</a>
          <Link to="/#automation">{text.navAutomation}</Link>
          <Link to="/#analytics">{text.navAnalytics}</Link>
          <Link className="design-approved-hero-nav__contact" to="/#contact">{text.navContact}</Link>
        </nav>
        <div className="design-approved-hero-controls">
          <div className="design-approved-hero-language" role="group" aria-label={text.language}>
            <button type="button" aria-pressed={locale === 'ru'} onClick={() => setLocale('ru')}>RU</button>
            <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>EN</button>
          </div>
          <button className="design-approved-hero-theme" type="button" onClick={toggleTheme} aria-label={text.themeToggle}>
            <span aria-hidden="true">{theme === 'light' ? '☽' : '☀'}</span>
          </button>
          <button
            className="design-approved-hero-resume"
            type="button"
            aria-disabled="true"
            aria-describedby="design-approved-resume-status"
            onClick={() => setResumeMessageVisible(true)}
          >
            {text.resume}
          </button>
          <span id="design-approved-resume-status" className="design-approved-hero-resume-status" role="status" aria-live="polite">
            {resumeMessageVisible ? text.resumeUnavailable : ''}
          </span>
        </div>
      </header>

      <div className="design-approved-hero-scene" onMouseEnter={playVideo} onMouseLeave={stopVideo}>
        <div className="design-approved-hero-media">
          <img src={A.heroFashion} alt="" width="1574" height="1574" fetchPriority="high" decoding="async" />
          <video ref={videoRef} src={A.case1Hover} muted loop playsInline preload="metadata" aria-hidden="true" />
          <div className="design-approved-hero-media__gradient" />
          <div className="design-approved-hero-media__sheen" />
        </div>
        <div className="design-approved-hero-copy">
          <span className="design-approved-hero-eyebrow">{text.eyebrow}</span>
          <h1><span>{firstWord}</span>{rest}</h1>
          <p>{text.heroSub}</p>
          <div className="design-approved-hero-directions" aria-label={locale === 'ru' ? 'Направления дизайна' : 'Design directions'}>
            {HERO_DIRECTIONS.map((direction, index) => (
              <button
                key={direction.num}
                type="button"
                onMouseEnter={() => setActiveDirection(index)}
                onMouseLeave={() => setActiveDirection(null)}
                onFocus={() => setActiveDirection(index)}
                onBlur={() => setActiveDirection(null)}
              >
                <span>{direction.num}</span>
                <strong>{direction.label[locale]}</strong>
              </button>
            ))}
            <p aria-live="polite">{activeDirection === null ? '' : HERO_DIRECTIONS[activeDirection].outcome[locale]}</p>
          </div>
          <div className="design-approved-hero-actions">
            <a href="#design-fashion-system">{text.ctaPrimary}</a>
            <Link to="/#contact">{text.ctaSecondary}</Link>
          </div>
          <dl className="design-approved-hero-proof">
            {PROOF_POINTS.map((point) => (
              <div key={point.stat.en}>
                <dt>{point.stat[locale]}</dt>
                <dd>{point.label[locale]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="design-approved-hero-axis" aria-hidden="true">
        <i />
        <div><span>01</span><b>{text.heroVerticalLabel}</b></div>
      </div>

      <div className="design-approved-hero-stack">
        <div className="design-approved-hero-mobile" style={{ opacity: artifactOpacity('mobile') }}>
          <img src={A.heroMobile} alt="" width="941" height="1672" decoding="async" />
        </div>
        <div className="design-approved-hero-mobile-label" aria-hidden="true">
          <span>04</span><div><b>MOBILE</b><b>EXPERIENCE</b></div>
        </div>
        <div className="design-approved-hero-commerce" style={{ opacity: artifactOpacity('commerce') }}>
          <div className="design-approved-hero-stack-label"><span>02</span><i /><b>{text.heroLabelCommerce}</b></div>
          <div className="design-approved-hero-commerce__card">
            <img src={A.heroCommerce} alt={text.heroLabelCommerce} width="1448" height="1086" decoding="async" />
          </div>
        </div>
        <div className="design-approved-hero-brand" style={{ opacity: artifactOpacity('brand') }}>
          <div className="design-approved-hero-stack-label design-approved-hero-stack-label--end"><span>03</span><i /><b>{text.heroLabelBrand}</b></div>
          <div className="design-approved-hero-brand__card">
            <img src={A.heroBrand} alt={text.heroLabelBrand} width="1600" height="1000" decoding="async" />
          </div>
        </div>
      </div>

      <div className="design-approved-hero-scroll-cue">
        <span>01 / 10</span>
        <b>{text.scrollHint} ↓</b>
      </div>
    </section>
  )
}
