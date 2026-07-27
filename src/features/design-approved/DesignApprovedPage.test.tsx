import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppProvider } from '../../app/AppContext'
import DesignApprovedPage from './DesignApprovedPage'

describe('DesignApprovedPage milestone A', () => {
  beforeEach(() => localStorage.clear())

  it('renders the isolated approved hero and preserves app locale controls', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><AppProvider><DesignApprovedPage /></AppProvider></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: /Создаю визуальные/ })).toBeInTheDocument()
    expect(screen.getByText('01 / 12')).toBeInTheDocument()
    expect(document.querySelector('.floating-character')).not.toBeInTheDocument()
    expect(document.querySelector('.glass-panel')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'EN' }))
    expect(document.documentElement.lang).toBe('en')
    expect(screen.getByRole('heading', { level: 1, name: /I create visual systems/ })).toBeInTheDocument()
  })

  it('removes character nodes injected while the Design route is mounted', async () => {
    render(<MemoryRouter><AppProvider><DesignApprovedPage /></AppProvider></MemoryRouter>)

    const injectedCharacter = document.createElement('div')
    injectedCharacter.className = 'floating-character'
    document.body.append(injectedCharacter)

    await waitFor(() => expect(document.querySelector('.floating-character')).not.toBeInTheDocument())
  })
})
