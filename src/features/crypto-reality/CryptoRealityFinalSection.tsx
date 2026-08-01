import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import { cryptoReality } from '../../data/cryptoRealityCase'
import type { Locale } from '../../types'

const SYSTEM_LABELS = ['GAME MECHANICS', 'SOCIAL LOGIC', 'BEHAVIORAL MODEL', 'ECONOMY', 'TELEGRAM UX', 'BACKEND']
const THREAD_LABELS = ['PRODUCT', 'UX', 'VISUAL', 'LOGIC', 'DELIVERY']

const t = (value: { ru: string; en: string } | string, locale: Locale) => typeof value === 'string' ? value : value[locale]

function SystemRevealHeadline({ locale }: { locale: Locale }) {
  const revealRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
  }, [])

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = revealRef.current
    if (!node || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const rect = node.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      node.style.setProperty('--reveal-x', `${x}px`)
      node.style.setProperty('--reveal-y', `${y}px`)
    })
  }

  return <div
    ref={revealRef}
    className="crypto-reality-final__headline-reveal"
    onPointerMove={onPointerMove}
    onPointerEnter={onPointerMove}
  >
    <h2 id="cr-final-title" className="crypto-reality-final__headline">
      {locale === 'ru' ? <>
        <span>Продукт, в котором</span>
        <span>интерфейс — только</span>
        <span><em>видимая часть</em> системы</span>
      </> : <>
        <span>A product where</span>
        <span>the interface is only</span>
        <span><em>the visible part</em> of the system</span>
      </>}
    </h2>
    <div className="crypto-reality-final__system-underlay" aria-hidden="true">
      {SYSTEM_LABELS.map((label, index) => <span key={label} style={{ '--system-index': index } as CSSProperties}>{label}</span>)}
      <i /><i /><i /><i />
    </div>
    <span className="crypto-reality-final__scan" aria-hidden="true" />
  </div>
}

function FinalSystemThread({ active }: { active: boolean }) {
  return <div className={`crypto-reality-final__thread${active ? ' is-signaling' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 1000 210" preserveAspectRatio="none">
      <path className="crypto-reality-final__thread-path" d="M40 108 C210 108 214 46 378 46 S566 170 708 170 S810 86 960 86" />
      <path className="crypto-reality-final__thread-signal" d="M40 108 C210 108 214 46 378 46 S566 170 708 170 S810 86 960 86" />
    </svg>
    <div className="crypto-reality-final__thread-nodes">
      {THREAD_LABELS.map((label, index) => <span key={label} style={{ '--node-index': index } as CSSProperties}><i />{label}</span>)}
    </div>
  </div>
}

function NextProjectPortal({ locale, onActive }: { locale: Locale; onActive: (active: boolean) => void }) {
  const portalRef = useRef<HTMLAnchorElement>(null)
  const frameRef = useRef<number | null>(null)
  const contact = cryptoReality.sections.contact

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
  }, [])

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const node = portalRef.current
    if (!node || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const rect = node.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      node.style.setProperty('--portal-x', `${x}px`)
      node.style.setProperty('--portal-y', `${y}px`)
    })
  }

  return <Link
    ref={portalRef}
    className="crypto-reality-final__portal"
    to="/cases/the-dao-way"
    onPointerMove={onPointerMove}
    onPointerEnter={(event) => { onPointerMove(event); onActive(true) }}
    onPointerLeave={() => onActive(false)}
    onFocus={() => onActive(true)}
    onBlur={() => onActive(false)}
  >
    <img src="/assets/case-the-dao-way.png" alt="" aria-hidden="true" />
    <span className="crypto-reality-final__portal-overlay" aria-hidden="true" />
    <span className="crypto-reality-final__portal-content">
      <small>{contact.next}</small>
      <strong>{contact.nextTitle}</strong>
      <span>{t(contact.nextText, locale)}</span>
      <b>{locale === 'ru' ? 'Открыть кейс ↗' : 'Open case ↗'}</b>
    </span>
    <i className="crypto-reality-final__portal-arrow" aria-hidden="true">↗</i>
  </Link>
}

export function CryptoRealityFinalSection({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(false)
  const [portalActive, setPortalActive] = useState(false)
  const contact = cryptoReality.sections.contact

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setEntered(true)
        observer.disconnect()
      }
    }, { threshold: 0.28 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <section
    ref={sectionRef}
    className={`cr-section cr-final-section crypto-reality-final${entered ? ' is-entered' : ''}${portalActive ? ' is-portal-active' : ''}`}
    aria-labelledby="cr-final-title"
  >
    <Container>
      <div className="crypto-reality-final__grid">
        <div className="crypto-reality-final__copy">
          <span className="crypto-reality-final__eyebrow">FINAL</span>
          <SystemRevealHeadline locale={locale} />
          <p className="crypto-reality-final__description">{t(contact.text, locale)}</p>
          <div className="crypto-reality-final__actions">
            <a className="hero-action hero-action--primary" href="mailto:annagromyko88@gmail.com">{t(contact.discuss, locale)}<span aria-hidden="true">→</span></a>
            <Link className="hero-action hero-action--secondary" to="/#featured">{t(contact.other, locale)}<span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <NextProjectPortal locale={locale} onActive={setPortalActive} />
        <FinalSystemThread active={portalActive} />
      </div>
    </Container>
  </section>
}
