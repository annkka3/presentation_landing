import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProvider } from '../../app/AppContext'
import { sendContact } from '../../services/contact'
import { Contact } from './Contact'

vi.mock('../../services/contact', () => ({ sendContact: vi.fn() }))

const mockedSendContact = vi.mocked(sendContact)

async function completeForm() {
  const user = userEvent.setup()
  render(<AppProvider><Contact /></AppProvider>)
  await user.type(screen.getByLabelText('Имя'), 'Анна')
  await user.type(screen.getByLabelText('Email или Telegram'), '@anna')
  await user.type(screen.getByLabelText('Сообщение'), 'Описание проекта и задачи для совместной работы.')
  return user
}

describe('Contact', () => {
  beforeEach(() => {
    localStorage.clear()
    mockedSendContact.mockReset()
  })

  it('shows success only after the endpoint resolves successfully', async () => {
    let resolveRequest: (() => void) | undefined
    mockedSendContact.mockImplementation(() => new Promise<void>((resolve) => { resolveRequest = resolve }))
    const user = await completeForm()
    await user.click(screen.getByRole('button', { name: 'Отправить сообщение →' }))
    expect(screen.getByRole('button', { name: 'Отправка…' })).toBeDisabled()
    expect(screen.queryByText('Сообщение отправлено. Спасибо!')).not.toBeInTheDocument()
    resolveRequest?.()
    expect(await screen.findByText('Сообщение отправлено. Спасибо!')).toBeInTheDocument()
    expect(document.querySelector('.contact-form')).toHaveAttribute('data-signal-state', 'success')
  })

  it('keeps empty controls normalized and exposes precise field states', async () => {
    const user = userEvent.setup()
    render(<AppProvider><Contact /></AppProvider>)
    const form = document.querySelector('.contact-form')
    const name = screen.getByLabelText('Имя')
    const submit = screen.getByRole('button', { name: 'Отправить сообщение →' })

    expect(name).toHaveValue('')
    expect(screen.queryByDisplayValue('null')).not.toBeInTheDocument()
    expect(document.querySelector('.contact-signal-field')).toHaveAttribute('data-renderer', 'constellation-canvas')
    expect(document.querySelector('.contact-signal-canvas')).toBeInTheDocument()
    await user.click(name)
    expect(form).toHaveAttribute('data-signal-state', 'focus')
    expect(form).toHaveAttribute('data-active-field', 'name')
    fireEvent.pointerEnter(submit)
    fireEvent.blur(name)
    expect(form).toHaveAttribute('data-signal-state', 'submit-hover')
  })

  it('offers direct alternatives when the endpoint is absent', async () => {
    mockedSendContact.mockRejectedValue(new Error('CONTACT_ENDPOINT_MISSING'))
    const user = await completeForm()
    await user.click(screen.getByRole('button', { name: 'Отправить сообщение →' }))
    expect(await screen.findByText('Отправка с сайта пока не настроена. Напишите мне по email или в Telegram.')).toBeInTheDocument()
    expect(screen.queryByText('Сообщение отправлено. Спасибо!')).not.toBeInTheDocument()
  })
})
