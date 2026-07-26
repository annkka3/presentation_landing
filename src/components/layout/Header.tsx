import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../app/AppContext'
import { Container } from './Container'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const { locale, setLocale, theme, toggleTheme, t } = useApp()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [resumeMessageVisible, setResumeMessageVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileCompact, setMobileCompact] = useState(false)
  const [activeHash, setActiveHash] = useState(() => window.location.hash.slice(1))
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    addEventListener('scroll', update, { passive: true })
    return () => removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    const update = (event: Event) => setMobileCompact(Boolean((event as CustomEvent<{ compact?: boolean }>).detail?.compact))
    addEventListener('mobile-chapter-scroll', update)
    return () => removeEventListener('mobile-chapter-scroll', update)
  }, [])
  useEffect(() => {
    if (mobileCompact) document.documentElement.dataset.mobileHeader = 'compact'
    else delete document.documentElement.dataset.mobileHeader
    return () => { delete document.documentElement.dataset.mobileHeader }
  }, [mobileCompact])
  useEffect(() => {
    const update = () => setActiveHash(window.location.hash.slice(1))
    addEventListener('hashchange', update)
    addEventListener('popstate', update)
    addEventListener('mobile-chapter-change', update)
    return () => {
      removeEventListener('hashchange', update)
      removeEventListener('popstate', update)
      removeEventListener('mobile-chapter-change', update)
    }
  }, [])
  const prefix = location.pathname === '/' ? '' : '/'
  const isDesignRoute = location.pathname === '/design'
  const closeMenu = (restoreFocus = true) => {
    setMenuOpen(false)
    if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus())
  }
  const navigateFromMenu = (id: string) => {
    if (location.pathname !== '/') return
    if (window.location.hash !== `#${id}`) history.pushState(history.state, '', `#${id}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    requestAnimationFrame(() => {
      const chapter = document.getElementById(id)
      const heading = chapter?.querySelector<HTMLElement>('h1, h2')
      if (heading) {
        heading.tabIndex = -1
        heading.focus({ preventScroll: true })
      }
    })
  }
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${mobileCompact ? 'is-mobile-compact' : ''}`}>
      <Container className="header-inner">
        <Link className="brand" to="/" aria-label="Anna Gromyko — AI Product Builder">
          <span>ANNA GROMYKO</span><small>AI PRODUCT BUILDER</small>
        </Link>
        <nav className="main-nav" aria-label={t.nav}>
          <a href={`${prefix}#product`}>{t.navProduct}</a><Link to="/design" aria-current={isDesignRoute ? 'page' : undefined}>{t.navDesign}</Link><a href={`${prefix}#automation`}>{t.navAutomation}</a><a href={`${prefix}#analytics`}>{t.navAnalytics}</a><a href={`${prefix}#contact`}>{t.contact}</a>
        </nav>
        <div className="header-actions">
          <div className="language-toggle" role="group" aria-label={t.language}>
            <button aria-pressed={locale === 'ru'} onClick={() => setLocale('ru')}>RU</button>
            <button aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>EN</button>
          </div>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={t.themeToggle}>
            <span aria-hidden="true">{theme === 'light' ? <svg viewBox="0 0 24 24"><path d="M19 15.2A7.8 7.8 0 0 1 8.8 5 7.8 7.8 0 1 0 19 15.2Z" /></svg> : <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6m11 11 1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6m11-11 1.6-1.6"/></svg>}</span>
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
          <button ref={menuButtonRef} className="mobile-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label={locale === 'ru' ? 'Открыть меню' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-site-menu">
            <span aria-hidden="true"><i /><i /></span>
          </button>
          <span id="resume-status" className={`resume-status ${resumeMessageVisible ? 'is-visible' : ''}`} role="status" aria-live="polite">
            {resumeMessageVisible ? t.resumeUnavailable : ''}
          </span>
        </div>
      </Container>
      {menuOpen && createPortal(<div id="mobile-site-menu"><MobileMenu activeHash={activeHash} onClose={closeMenu} onNavigate={navigateFromMenu} /></div>, document.body)}
    </header>
  )
}
