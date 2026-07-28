import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { sendContact, type ContactPayload } from '../../services/contact'
import { validateContact, type ContactErrors } from '../../services/validation'

const emptyValues = (): ContactPayload => ({ name: '', contact: '', message: '', website: '' })
const normalizeContactValue = (value: unknown) => value == null || value === 'null' ? '' : String(value)

const signalParticles = [
  [8, 14, 'dot'], [22, 8, 'dash'], [38, 18, 'square'], [57, 10, 'dot'], [76, 18, 'dash'], [91, 8, 'dot'],
  [14, 36, 'square'], [32, 43, 'dot'], [49, 32, 'dash'], [68, 42, 'dot'], [86, 34, 'square'],
  [5, 62, 'dash'], [24, 70, 'dot'], [43, 58, 'square'], [61, 69, 'dash'], [80, 60, 'dot'], [95, 73, 'square'],
  [12, 88, 'dot'], [34, 82, 'dash'], [53, 92, 'dot'], [72, 84, 'square'], [90, 94, 'dash'],
] as const

function ContactSignalField({ fieldRef }: { fieldRef: React.RefObject<HTMLDivElement | null> }) {
  return <div className="contact-signal-field" ref={fieldRef} aria-hidden="true">
    <span className="contact-signal-orbit" />
    {signalParticles.map(([x, y, shape], index) => <i
      key={`${x}-${y}`}
      className={`signal-particle signal-particle--${shape}`}
      data-x={x}
      data-y={y}
      style={{ '--signal-x': `${x}%`, '--signal-y': `${y}%`, '--signal-xn': x, '--signal-yn': y, '--signal-delay': `${(index % 7) * -0.7}s` } as React.CSSProperties}
    />)}
  </div>
}

export function Contact({ mobile = false }: { mobile?: boolean }) {
  const { locale, t } = useApp()
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'config'>('idle')
  const [activeField, setActiveField] = useState<'name' | 'contact' | 'message' | null>(null)
  const [submitHovered, setSubmitHovered] = useState(false)
  const fieldRef = useRef<HTMLDivElement>(null)
  const pointerFrame = useRef(0)
  const update = (field: keyof ContactPayload, value: unknown) => setValues((current) => ({ ...current, [field]: normalizeContactValue(value) }))
  const signalState = status === 'loading' || status === 'success' || status === 'error' || status === 'config'
    ? status
    : submitHovered ? 'submit-hover' : activeField ? 'focus' : 'idle'

  useEffect(() => () => cancelAnimationFrame(pointerFrame.current), [])

  const moveSignal = (event: ReactPointerEvent<HTMLFormElement>) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !fieldRef.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100
    cancelAnimationFrame(pointerFrame.current)
    pointerFrame.current = requestAnimationFrame(() => {
      fieldRef.current?.querySelectorAll<HTMLElement>('.signal-particle').forEach((particle) => {
        const x = Number(particle.dataset.x)
        const y = Number(particle.dataset.y)
        const distance = Math.hypot(pointerX - x, pointerY - y)
        const influence = Math.max(0, 1 - distance / 38)
        particle.style.setProperty('--react-x', `${((pointerX - x) / 18) * influence}px`)
        particle.style.setProperty('--react-y', `${((pointerY - y) / 18) * influence}px`)
      })
    })
  }
  const resetSignal = () => {
    fieldRef.current?.querySelectorAll<HTMLElement>('.signal-particle').forEach((particle) => {
      particle.style.removeProperty('--react-x')
      particle.style.removeProperty('--react-y')
    })
  }
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'loading') return
    const nextErrors = validateContact(values, t, !mobile)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    if (values.website) return
    setStatus('loading')
    try {
      await sendContact({ ...values, name: values.name.trim(), contact: values.contact.trim(), message: values.message.trim() })
      setStatus('success')
      setValues(emptyValues())
    } catch (error) {
      setStatus(error instanceof Error && error.message === 'CONTACT_ENDPOINT_MISSING' ? 'config' : 'error')
    }
  }
  const copyEmail = () => navigator.clipboard?.writeText('annagromyko88@gmail.com')
  return <section className={`section contact-section ${mobile ? 'is-mobile-contact' : ''}`}><div className="contact-content"><Container className="contact-grid">
    <div className="contact-copy"><span className="contact-eyebrow">{mobile ? t.mobileContactEyebrow : t.contactEyebrow}</span><h2 className="contact-display-heading">{t.contactHeading}</h2><p>{mobile ? t.mobileContactIntro : t.contactIntro}</p><p className="contact-availability">{t.availability}</p><div className="contact-links">
      {mobile ? <button type="button" onClick={copyEmail} aria-label={t.copyEmail}><span className="contact-link-copy"><span>EMAIL</span><strong>annagromyko88@gmail.com</strong></span><i aria-hidden="true">⧉</i></button> : <a href="mailto:annagromyko88@gmail.com"><span className="contact-link-copy"><span>EMAIL</span><strong>annagromyko88@gmail.com</strong></span><i aria-hidden="true">↗</i></a>}
      <a href="https://t.me/AnnaGromyko" target="_blank" rel="noopener noreferrer"><span className="contact-link-copy"><span>TELEGRAM</span><strong>@AnnaGromyko</strong></span><i aria-hidden="true">↗</i></a>
      <a href="https://github.com/annkka3" target="_blank" rel="noopener noreferrer"><span className="contact-link-copy"><span>GITHUB</span><strong>github.com/annkka3</strong></span><i aria-hidden="true">↗</i></a>
    </div></div>
    <form className="contact-form" data-signal-state={signalState} data-active-field={activeField ?? undefined} onSubmit={submit} onPointerMove={moveSignal} onPointerLeave={resetSignal} noValidate aria-labelledby="contact-form-heading">
      <ContactSignalField fieldRef={fieldRef} />
      {mobile && <span className="contact-form-helper">{locale === 'ru' ? 'ОПИШИТЕ ЗАДАЧУ' : 'DESCRIBE THE BRIEF'}</span>}
      <h3 className="contact-display-heading" id="contact-form-heading">{t.formHeading}</h3><p>{t.formDescription}</p>
      {!mobile && <div className="form-field"><label htmlFor="name">{t.name}</label><input id="name" value={normalizeContactValue(values.name)} onFocus={() => setActiveField('name')} onBlur={() => setActiveField(null)} onChange={(event) => update('name', event.target.value)} placeholder={t.namePlaceholder} maxLength={101} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined}/>{errors.name && <small id="name-error">{errors.name}</small>}</div>}
      <div className="form-field"><label htmlFor="contact-field">{t.contactField}</label><input id="contact-field" value={normalizeContactValue(values.contact)} onFocus={() => setActiveField('contact')} onBlur={() => setActiveField(null)} onChange={(event) => update('contact', event.target.value)} placeholder={t.contactPlaceholder} maxLength={161} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? 'contact-error' : undefined}/>{errors.contact && <small id="contact-error">{errors.contact}</small>}</div>
      <div className="form-field"><label htmlFor="message">{t.message}</label><textarea id="message" rows={6} value={normalizeContactValue(values.message)} onFocus={() => setActiveField('message')} onBlur={() => setActiveField(null)} onChange={(event) => update('message', event.target.value)} placeholder={t.messagePlaceholder} maxLength={3001} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined}/>{errors.message && <small id="message-error">{errors.message}</small>}</div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">{t.website}</label><input id="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update('website', event.target.value)}/></div>
      <button className="submit-button" disabled={status === 'loading'} onPointerEnter={() => setSubmitHovered(true)} onPointerLeave={() => setSubmitHovered(false)}>{status === 'loading' ? t.sending : t.send}</button>
      <p className={`form-status ${status}`} aria-live="polite">{status === 'success' ? t.success : status === 'config' ? t.configError : status === 'error' ? t.sendError : ''}</p>
    </form>
  </Container><Container className="contact-closing">{t.contactClosing}</Container></div></section>
}
