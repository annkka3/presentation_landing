import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Container } from './Container'

export function Header() {
  const { locale, setLocale, theme, toggleTheme, t } = useApp()
  const [scrolled, setScrolled] = useState(false)
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
          <a href={`${prefix}#product`}>Product</a><a href={`${prefix}#design`}>Design</a><a href={`${prefix}#automation`}>Automation</a><a href={`${prefix}#analytics`}>Analytics</a><a href={`${prefix}#contact`}>{t.contact}</a>
        </nav>
        <div className="header-actions">
          <div className="language-toggle" role="group" aria-label={t.language}>
            <button aria-pressed={locale === 'ru'} onClick={() => setLocale('ru')}>RU</button>
            <button aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>EN</button>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'light' ? t.themeDark : t.themeLight}>
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
          </button>
          <a className="resume-button" href="#contact">{t.resume}</a>
        </div>
      </Container>
    </header>
  )
}
