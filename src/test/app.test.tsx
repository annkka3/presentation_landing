import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppProvider, useApp } from '../app/AppContext'
import { Header } from '../components/layout/Header'
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

  it('uses the dark theme by default', () => {
    render(<AppProvider><Controls /></AppProvider>)
    expect(screen.getByText('ru:dark')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

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

  it('keeps one canonical ЦветиМир project record and route', () => {
    const records = projects.filter((project) => project.slug === 'tsvetimir')
    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({ id: 'tsvetimir', route: '/projects/tsvetimir' })
    expect(projects.some((project) => project.slug === 'cvetimir' || project.route === '/projects/cvetimir')).toBe(false)
  })

  it('exposes an honest localized unavailable Resume control', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><AppProvider><Header /></AppProvider></MemoryRouter>)
    const resume = screen.getByRole('button', { name: 'Резюме' })
    expect(resume).toHaveAttribute('aria-disabled', 'true')
    expect(resume).not.toHaveAttribute('href')
    await user.click(resume)
    expect(screen.getByRole('status')).toHaveTextContent('Резюме будет добавлено перед публикацией')
    await user.click(screen.getByRole('button', { name: 'EN' }))
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('The resume will be added before launch')
  })
})
