import { useEffect, useRef, type KeyboardEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../../app/AppContext'

type MenuItem = { id: string; label: string; href: string }

export function MobileMenu({ activeHash, onClose, onNavigate }: { activeHash: string; onClose: (restoreFocus?: boolean) => void; onNavigate: (id: string) => void }) {
  const { locale, t } = useApp()
  const location = useLocation()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const items: MenuItem[] = [
    { id: 'chapter-hero', label: t.chapterHero, href: '/#chapter-hero' },
    { id: 'design-route', label: t.navDesign, href: '/design' },
    { id: 'skills', label: t.chapterExpertise, href: '/#skills' },
    { id: 'directions', label: t.chapterDirections, href: '/#directions' },
    { id: 'featured', label: locale === 'ru' ? 'Избранные кейсы' : 'Featured Cases', href: '/#featured' },
    { id: 'more-projects', label: locale === 'ru' ? 'Ещё проекты' : 'More Projects', href: '/#more-projects' },
    { id: 'process', label: t.chapterProcess, href: '/#process' },
    { id: 'experience-education', label: locale === 'ru' ? 'Опыт и образование' : 'Experience & Education', href: '/#experience-education' },
    { id: 'contact', label: t.chapterContact, href: '/#contact' },
  ]

  useEffect(() => {
    const root = document.documentElement
    const bodyOverflow = document.body.style.overflow
    const rootOverflow = root.style.overflow
    root.dataset.mobileMenu = 'open'
    root.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const frame = requestAnimationFrame(() => {
      closeRef.current?.focus()
    })
    return () => {
      cancelAnimationFrame(frame)
      delete root.dataset.mobileMenu
      root.style.overflow = rootOverflow
      document.body.style.overflow = bodyOverflow
    }
  }, [])

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose(true)
      return
    }
    if (event.key !== 'Tab') return
    const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])]
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const select = (id: string) => {
    onNavigate(id)
    onClose(false)
  }

  return <div className="mobile-menu-overlay" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title" ref={dialogRef} onKeyDown={trapFocus}>
    <div className="mobile-menu-shell">
      <header className="mobile-menu-header">
        <div className="mobile-menu-brand" id="mobile-menu-title"><strong>ANNA GROMYKO</strong><span>AI PRODUCT BUILDER</span></div>
        <button ref={closeRef} className="mobile-menu-close" type="button" onClick={() => onClose(true)} aria-label={locale === 'ru' ? 'Закрыть меню' : 'Close menu'}>×</button>
      </header>
      <nav className="mobile-menu-navigation" aria-label={locale === 'ru' ? 'Меню разделов' : 'Chapter menu'}>
        {items.map((item, index) => {
          const active = item.id === 'design-route' ? location.pathname === '/design' : activeHash === item.id || (location.pathname === '/' && !activeHash && index === 0)
          return <a className={`mobile-menu-item mobile-menu-item--${item.id}`} key={item.id} href={item.href} onClick={(event) => {
            if (item.id === 'design-route') {
              onClose(false)
              return
            }
            if (location.pathname === '/') event.preventDefault()
            select(item.id)
          }} aria-current={active ? 'page' : undefined}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
            {active && <small>{locale === 'ru' ? 'ТЕКУЩИЙ' : 'CURRENT'}</small>}
            <i aria-hidden="true">→</i>
          </a>
        })}
      </nav>
      <div className="mobile-menu-utilities">
        <div className="mobile-menu-resume" aria-label={t.resumeUnavailable}>
          <span>{locale === 'ru' ? 'РЕЗЮМЕ' : 'RÉSUMÉ'}</span>
          <strong>{locale === 'ru' ? 'PDF · скоро' : 'PDF · coming soon'}</strong>
        </div>
        <div className="mobile-menu-contacts">
          <a href="mailto:annagromyko88@gmail.com"><span>EMAIL</span><strong>annagromyko88@gmail.com</strong></a>
          <a href="https://t.me/AnnaGromyko" target="_blank" rel="noopener noreferrer"><span>TELEGRAM</span><strong>@AnnaGromyko</strong></a>
          <a href="https://github.com/annkka3" target="_blank" rel="noopener noreferrer"><span>GITHUB</span><strong>github.com/annkka3</strong></a>
        </div>
      </div>
    </div>
  </div>
}
