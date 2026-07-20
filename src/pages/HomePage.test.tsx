import { render, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { AppProvider } from '../app/AppContext'
import HomePage from './HomePage'

function CaseRoute() {
  return <main id="main">Case route</main>
}

describe('homepage editorial chapters', () => {
  afterEach(() => delete document.documentElement.dataset.page)

  it('sets and removes the route-scoped home attribute', async () => {
    const view = render(<MemoryRouter initialEntries={['/']}><AppProvider><Routes><Route path="/" element={<HomePage />} /><Route path="/case" element={<CaseRoute />} /></Routes></AppProvider></MemoryRouter>)
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-page', 'home'))
    view.unmount()
    expect(document.documentElement).not.toHaveAttribute('data-page')
  })

  it('renders seven stable scenes with Contact and Footer together', () => {
    render(<MemoryRouter><AppProvider><HomePage /></AppProvider></MemoryRouter>)
    const chapters = [...document.querySelectorAll<HTMLElement>('.home-chapter')]
    expect(chapters.map((chapter) => chapter.id)).toEqual(['chapter-hero', 'featured', 'more-projects', 'process', 'skills', 'experience-education', 'contact'])
    expect(document.querySelector('#contact .contact-form')).toBeInTheDocument()
    expect(document.querySelector('#contact .site-footer')).toBeInTheDocument()
  })

  it('provides the cinematic scroll container, scene navigation and footer label', () => {
    render(<MemoryRouter><AppProvider><HomePage /></AppProvider></MemoryRouter>)
    expect(document.querySelector('#main')).toHaveClass('scroll-container')
    expect(document.querySelectorAll('.scene-navigation a')).toHaveLength(7)
    expect(document.querySelector('.scene-footer')).toHaveTextContent('01 / 07')
    expect(document.querySelector('.scene-footer')).toHaveTextContent('ПРОКРУТИТЕ ДАЛЬШЕ')
  })

  it('renders the purpose-built mobile chapter track and compact controls', () => {
    const originalMatchMedia = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string) => ({
        matches: query.includes('max-width: 767px'),
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      }),
    })
    const view = render(<MemoryRouter><AppProvider><HomePage /></AppProvider></MemoryRouter>)
    expect(document.querySelector('.mobile-chapter-track')).toBeInTheDocument()
    expect(document.querySelectorAll('.mobile-chapter-track > .mobile-chapter')).toHaveLength(8)
    expect(document.querySelectorAll('.mobile-direction-tile')).toHaveLength(4)
    expect(document.querySelectorAll('.mobile-hero-composite img')).toHaveLength(3)
    expect(document.querySelector('.mobile-hero-data-layer')).toBeInTheDocument()
    expect(document.querySelector('.mobile-hero')).toHaveTextContent('AI-native подход')
    expect(document.querySelectorAll('#featured .mobile-project-list .project-card')).toHaveLength(4)
    expect(document.querySelectorAll('#more-projects .mobile-project-list .project-card')).toHaveLength(6)
    expect(document.querySelector('#featured .mobile-carousel-navigation')).not.toBeInTheDocument()
    expect(document.querySelector('#more-projects .mobile-carousel-navigation')).not.toBeInTheDocument()
    expect(document.querySelectorAll('#process .mobile-process-timeline article')).toHaveLength(6)
    expect(document.querySelectorAll('#process .mobile-process-timeline article.is-active')).toHaveLength(1)
    expect(document.querySelector('#process .mobile-carousel-navigation')).not.toBeInTheDocument()
    expect(document.querySelector('#process .mobile-step-rail')).not.toBeInTheDocument()
    expect(document.querySelector('#contact #name')).not.toBeInTheDocument()
    expect(document.querySelectorAll('.mobile-skills-accordion article.is-open')).toHaveLength(1)
    expect(document.querySelector('.mobile-chapter-navigation')).toHaveTextContent('01 / 08')
    expect(document.querySelector('.scroll-container')).not.toBeInTheDocument()
    view.unmount()
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: originalMatchMedia })
  })
})
