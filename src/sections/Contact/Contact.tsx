import { useState, type FormEvent } from 'react'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { sendContact, type ContactPayload } from '../../services/contact'
import { validateContact, type ContactErrors } from '../../services/validation'
import { ContactConstellationField, type ContactField, type SignalState } from './ContactConstellationField'

const emptyValues = (): ContactPayload => ({ name: '', contact: '', message: '', website: '' })
const normalizeContactValue = (value: unknown) => value == null || value === 'null' ? '' : String(value)

export function Contact({ mobile = false }: { mobile?: boolean }) {
  const { locale, t } = useApp()
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'config'>('idle')
  const [activeField, setActiveField] = useState<ContactField | null>(null)
  const [submitHovered, setSubmitHovered] = useState(false)
  const update = (field: keyof ContactPayload, value: unknown) => setValues((current) => ({ ...current, [field]: normalizeContactValue(value) }))
  const signalState: SignalState = status === 'loading' || status === 'success' || status === 'error' || status === 'config'
    ? status
    : submitHovered ? 'submit-hover' : activeField ? 'focus' : 'idle'

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
    <form className="contact-form" data-signal-state={signalState} data-active-field={activeField ?? undefined} onSubmit={submit} noValidate aria-labelledby="contact-form-heading">
      <ContactConstellationField activeField={activeField} signalState={signalState} mobile={mobile} />
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
