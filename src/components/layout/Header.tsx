import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Container } from './Container'

export function Header() {
  const { locale, setLocale, theme, toggleTheme, t } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [resumeMessageVisible, setResumeMessageVisible] = useState(false)
  const location = useLocation()
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    addEventListener('scroll', update, { passive: true })
    return () => removeEventListener('scroll', update)
  }, [])
  const prefix = location.pathname === '/' ? '' : '/'
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Container className="header-inner">
        <Link className="brand" to="/" aria-label="Anna Gromyko — AI Product Builder">
          <span>ANNA GROMYKO</span><small>AI PRODUCT BUILDER</small>
        </Link>
        <nav className="main-nav" aria-label={t.nav}>
          <a href={`${prefix}#product`}>{t.navProduct}</a><a href={`${prefix}#design`}>{t.navDesign}</a><a href={`${prefix}#automation`}>{t.navAutomation}</a><a href={`${prefix}#analytics`}>{t.navAnalytics}</a><a href={`${prefix}#contact`}>{t.contact}</a>
        </nav>
        <div className="header-actions">
          <div className="language-toggle" role="group" aria-label={t.language}>
            <button aria-pressed={locale === 'ru'} onClick={() => setLocale('ru')}>RU</button>
            <button aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>EN</button>
          </div>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={t.themeToggle}>
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
          </button>
          <button
            className="resume-button"
            type="button"
            aria-label={t.resumeDownload}
            aria-describedby="resume-status"
            aria-disabled="true"
            onClick={() => setResumeMessageVisible(true)}
          >
            <span className="resume-label-full" aria-hidden="true">{t.resume}</span>
            <span className="resume-label-compact" aria-hidden="true">CV ↓</span>
          </button>
          <span id="resume-status" className={`resume-status ${resumeMessageVisible ? 'is-visible' : ''}`} role="status" aria-live="polite">
            {resumeMessageVisible ? t.resumeUnavailable : ''}
          </span>
        </div>
      </Container>
    </header>
  )
}
