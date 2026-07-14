import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppProvider, useApp } from '../app/AppContext'
import { ProjectCard } from '../components/ui/ProjectCard'
import { projects } from '../data/portfolio'
import { copy } from '../i18n/translations'
import { validateContact } from '../services/validation'

function Controls() {
  const { locale, setLocale, theme, toggleTheme } = useApp()
  return <><output>{locale}:{theme}</output><button onClick={() => setLocale('en')}>English</button><button onClick={toggleTheme}>Theme</button></>
}

describe('portfolio systems', () => {
  beforeEach(() => localStorage.clear())

  it('switches language and persists theme', async () => {
    const user = userEvent.setup()
    render(<AppProvider><Controls /></AppProvider>)
    await user.click(screen.getByText('English'))
    await user.click(screen.getByText('Theme'))
    expect(screen.getByText('en:light')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('anna-theme')).toBe('light')
  })

  it('renders localized project data from one source', () => {
    localStorage.setItem('anna-locale', 'en')
    render(<MemoryRouter><AppProvider><ProjectCard project={projects[0]} featured /></AppProvider></MemoryRouter>)
    expect(screen.getByText('In development')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'DAO SYSTEM' })).toBeInTheDocument()
  })

  it('validates required contact fields', () => {
    expect(validateContact({ name: ' ', contact: '', message: '', website: '' }, copy.en)).toEqual({
      name: 'Enter your name.', contact: 'Enter an email or Telegram handle.', message: 'Add a message.',
    })
  })
})
