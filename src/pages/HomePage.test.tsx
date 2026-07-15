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
    expect(document.querySelector('.scene-footer')).toHaveTextContent('Scroll to explore')
  })
})
