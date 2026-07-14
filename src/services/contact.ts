export interface ContactPayload {
  name: string
  contact: string
  message: string
  website: string
}

export async function sendContact(payload: ContactPayload) {
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined
  if (!endpoint) throw new Error('CONTACT_ENDPOINT_MISSING')
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('CONTACT_SEND_FAILED')
}
