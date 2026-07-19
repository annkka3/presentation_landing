import type { Translation } from '../i18n/translations'
import type { ContactPayload } from './contact'

export type ContactErrors = Partial<Record<'name' | 'contact' | 'message', string>>

export function validateContact(values: ContactPayload, t: Translation, requireName = true): ContactErrors {
  const errors: ContactErrors = {}
  const name = values.name.trim()
  const contact = values.contact.trim()
  const message = values.message.trim()
  if (requireName && !name) errors.name = t.requiredName
  else if (name.length > 100) errors.name = t.tooLong
  if (!contact) errors.contact = t.requiredContact
  else if (contact.length > 160) errors.contact = t.tooLong
  if (!message) errors.message = t.requiredMessage
  else if (message.length > 3000) errors.message = t.tooLong
  return errors
}
