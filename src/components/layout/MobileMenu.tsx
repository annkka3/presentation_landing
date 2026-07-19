import { useEffect, useRef, type KeyboardEvent } from 'react'
import { useApp } from '../../app/AppContext'

type MenuItem = { id: string; label: string }

export function MobileMenu({ activeHash, onClose, onNavigate }: { activeHash: string; onClose: (restoreFocus?: boolean) => void; onNavigate: (id: string) => void }) {
  const { locale, t } = useApp()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const items: MenuItem[] = [
    { id: 'chapter-hero', label: t.chapterHero },
    { id: 'directions', label: t.chapterDirections },
    { id: 'featured', label: locale === 'ru' ? 'Избранные кейсы' : 'Featured Cases' },
    { id: 'more-projects', label: locale === 'ru' ? 'Ещё проекты' : 'More Projects' },
    { id: 'process', label: t.chapterProcess },
    { id: 'skills', label: t.chapterExpertise },
    { id: 'experience-education', label: locale === 'ru' ? 'Опыт и образование' : 'Experience & Education' },
    { id: 'contact', label: t.chapterContact },
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
          const active = activeHash === item.id || (!activeHash && index === 0)
          return <a key={item.id} href={`/#${item.id}`} onClick={(event) => {
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
          <strong>{locale === 'ru' ? 'Резюме готовится' : 'Résumé coming soon'}</strong>
          <small>PDF</small>
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
