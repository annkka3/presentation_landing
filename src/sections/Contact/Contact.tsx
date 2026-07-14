import { useState, type FormEvent } from 'react'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { sendContact, type ContactPayload } from '../../services/contact'
import { validateContact, type ContactErrors } from '../../services/validation'

const initialValues: ContactPayload = { name: '', contact: '', message: '', website: '' }

export function Contact() {
  const { t } = useApp()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'config'>('idle')
  const update = (field: keyof ContactPayload, value: string) => setValues((current) => ({ ...current, [field]: value }))
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'loading') return
    const nextErrors = validateContact(values, t)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    if (values.website) return
    setStatus('loading')
    try {
      await sendContact({ ...values, name: values.name.trim(), contact: values.contact.trim(), message: values.message.trim() })
      setStatus('success')
      setValues(initialValues)
    } catch (error) {
      setStatus(error instanceof Error && error.message === 'CONTACT_ENDPOINT_MISSING' ? 'config' : 'error')
    }
  }
  return <section className="section contact-section" id="contact"><Container className="contact-grid">
    <div className="contact-copy"><h2>{t.contactHeading}</h2><p>{t.contactIntro}</p><div className="contact-links">
      <a href="mailto:annagromyko88@gmail.com"><span>EMAIL</span>annagromyko88@gmail.com <i aria-hidden="true">↗</i></a>
      <a href="https://t.me/AnnaGromyko" target="_blank" rel="noopener noreferrer"><span>TELEGRAM</span>@AnnaGromyko <i aria-hidden="true">↗</i></a>
      <a href="https://github.com/annkka3" target="_blank" rel="noopener noreferrer"><span>GITHUB</span>github.com/annkka3 <i aria-hidden="true">↗</i></a>
    </div></div>
    <form className="contact-form" onSubmit={submit} noValidate>
      <h3>{t.formHeading}</h3><p>{t.formDescription}</p>
      <div className="form-field"><label htmlFor="name">{t.name}</label><input id="name" value={values.name} onChange={(event) => update('name', event.target.value)} placeholder={t.namePlaceholder} maxLength={101} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined}/>{errors.name && <small id="name-error">{errors.name}</small>}</div>
      <div className="form-field"><label htmlFor="contact-field">{t.contactField}</label><input id="contact-field" value={values.contact} onChange={(event) => update('contact', event.target.value)} placeholder={t.contactPlaceholder} maxLength={161} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? 'contact-error' : undefined}/>{errors.contact && <small id="contact-error">{errors.contact}</small>}</div>
      <div className="form-field"><label htmlFor="message">{t.message}</label><textarea id="message" rows={6} value={values.message} onChange={(event) => update('message', event.target.value)} placeholder={t.messagePlaceholder} maxLength={3001} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined}/>{errors.message && <small id="message-error">{errors.message}</small>}</div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update('website', event.target.value)}/></div>
      <button className="submit-button" disabled={status === 'loading'}>{status === 'loading' ? t.sending : t.send}</button>
      <p className={`form-status ${status}`} aria-live="polite">{status === 'success' ? t.success : status === 'config' ? t.configError : status === 'error' ? t.sendError : ''}</p>
    </form>
  </Container></section>
}
