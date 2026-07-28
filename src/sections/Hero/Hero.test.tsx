import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProvider } from '../../app/AppContext'
import { heroModes } from '../../data/portfolio'
import { Hero } from './Hero'

type MediaState = { reduced?: boolean; mobile?: boolean; coarse?: boolean }

class ControlledIntersectionObserver implements IntersectionObserver {
  static instances: ControlledIntersectionObserver[] = []
  readonly root = null
  readonly rootMargin = '0px'
  readonly scrollMargin = '0px'
  readonly thresholds = [0, .25]
  private target?: Element
  constructor(private readonly callback: IntersectionObserverCallback) {
    ControlledIntersectionObserver.instances.push(this)
  }
  disconnect() {}
  observe(target: Element) { this.target = target }
  takeRecords() { return [] }
  unobserve() {}
  setVisibility(isVisible: boolean) {
    if (!this.target) return
    const rect = this.target.getBoundingClientRect()
    this.callback([{ boundingClientRect: rect, intersectionRatio: isVisible ? 1 : 0, intersectionRect: rect, isIntersecting: isVisible, rootBounds: null, target: this.target, time: performance.now() }], this)
  }
}

function setMedia({ reduced = false, mobile = false, coarse = false }: MediaState = {}) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? reduced : query.includes('max-width') ? mobile : query.includes('pointer: coarse') ? coarse : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    })),
  })
}

function setSaveData(saveData: boolean) {
  Object.defineProperty(navigator, 'connection', {
    configurable: true,
    value: { saveData, addEventListener: vi.fn(), removeEventListener: vi.fn() },
  })
}

function renderHero() {
  render(<AppProvider><Hero /></AppProvider>)
  act(() => ControlledIntersectionObserver.instances.at(-1)?.setVisibility(true))
}

describe('Hero video playback', () => {
  const playCalls: HTMLVideoElement[] = []
  const pauseCalls: HTMLVideoElement[] = []

  beforeEach(() => {
    ControlledIntersectionObserver.instances = []
    Object.defineProperty(window, 'IntersectionObserver', { configurable: true, writable: true, value: ControlledIntersectionObserver })
    Object.defineProperty(globalThis, 'IntersectionObserver', { configurable: true, writable: true, value: ControlledIntersectionObserver })
    setMedia()
    setSaveData(false)
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    Object.defineProperty(HTMLMediaElement.prototype, 'readyState', { configurable: true, get: () => HTMLMediaElement.HAVE_METADATA })
    playCalls.length = 0
    pauseCalls.length = 0
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
      playCalls.push(this as HTMLVideoElement)
      return Promise.resolve()
    })
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
      pauseCalls.push(this as HTMLVideoElement)
    })
  })

  afterEach(() => vi.restoreAllMocks())

  it('renders the approved video and poster mapping', () => {
    renderHero()
    expect(document.querySelector('.hero-system-pulse')).not.toBeInTheDocument()
    const videos = [...document.querySelectorAll<HTMLVideoElement>('.hero-panel video')]
    expect(videos).toHaveLength(4)
    videos.forEach((video, index) => {
      expect(video).toHaveAttribute('poster', heroModes[index].image)
      expect(video.querySelector('source')).toHaveAttribute('src', heroModes[index].video)
    })
  })

  it('does not expose audio controls or picture in picture', () => {
    renderHero()
    document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
      expect(video).not.toHaveAttribute('controls')
      expect(video).toHaveAttribute('disablepictureinpicture')
      expect(video).toHaveAttribute('aria-hidden', 'true')
      expect(video).toHaveAttribute('tabindex', '-1')
    })
  })

  it('keeps every decorative video muted', () => {
    renderHero()
    document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => expect(video.muted).toBe(true))
  })

  it('uses inline looping playback with metadata preload', () => {
    renderHero()
    document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
      expect(video).toHaveAttribute('playsinline')
      expect(video).toHaveAttribute('loop')
      expect(video).toHaveAttribute('preload', 'metadata')
    })
  })

  it('requests playback only for the active desktop panel', async () => {
    renderHero()
    playCalls.length = 0
    fireEvent.focus(document.querySelector('#product')!)
    await waitFor(() => expect(playCalls).toHaveLength(1))
    expect(playCalls[0].closest('.hero-panel')).toHaveAttribute('id', 'product')
  })

  it('pauses the previous panel when active focus changes', async () => {
    renderHero()
    fireEvent.focus(document.querySelector('#product')!)
    await waitFor(() => expect(playCalls).toHaveLength(1))
    pauseCalls.length = 0
    fireEvent.focus(document.querySelector('#design')!)
    await waitFor(() => expect(playCalls).toHaveLength(2))
    expect(pauseCalls.some((video) => video.closest('.hero-panel')?.id === 'product')).toBe(true)
  })

  it('resets the previous panel to its first frame', async () => {
    renderHero()
    const product = document.querySelector<HTMLVideoElement>('#product video')!
    fireEvent.focus(document.querySelector('#product')!)
    await waitFor(() => expect(playCalls).toHaveLength(1))
    product.currentTime = 3
    fireEvent.focus(document.querySelector('#design')!)
    await waitFor(() => expect(product.currentTime).toBe(0))
  })

  it('pauses and resets playback when the Hero leaves the viewport', async () => {
    renderHero()
    const product = document.querySelector<HTMLVideoElement>('#product video')!
    fireEvent.focus(document.querySelector('#product')!)
    await waitFor(() => expect(playCalls).toHaveLength(1))
    product.currentTime = 2
    pauseCalls.length = 0
    act(() => ControlledIntersectionObserver.instances.at(-1)?.setVisibility(false))
    expect(pauseCalls).toContain(product)
    expect(product.currentTime).toBe(0)
  })

  it('pauses playback when the document becomes hidden', async () => {
    renderHero()
    const product = document.querySelector<HTMLVideoElement>('#product video')!
    fireEvent.focus(document.querySelector('#product')!)
    await waitFor(() => expect(playCalls).toHaveLength(1))
    pauseCalls.length = 0
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    fireEvent(document, new Event('visibilitychange'))
    expect(pauseCalls).toContain(product)
  })

  it('uses static posters and prevents playback with reduced motion', () => {
    setMedia({ reduced: true })
    renderHero()
    expect(document.querySelectorAll('video')).toHaveLength(0)
    expect(document.querySelectorAll('.hero-panel > img')).toHaveLength(4)
    expect(playCalls).toHaveLength(0)
  })

  it('uses static posters and prevents autoplay on mobile', () => {
    setMedia({ mobile: true })
    renderHero()
    expect(document.querySelectorAll('video')).toHaveLength(0)
    expect(document.querySelectorAll('.hero-panel > img')).toHaveLength(4)
    expect(playCalls).toHaveLength(0)
  })

  it('uses static posters when a coarse pointer is present', () => {
    setMedia({ coarse: true })
    renderHero()
    expect(document.querySelectorAll('video')).toHaveLength(0)
    expect(playCalls).toHaveLength(0)
  })

  it('uses static posters when Save Data is enabled', () => {
    setSaveData(true)
    renderHero()
    expect(document.querySelectorAll('video')).toHaveLength(0)
    expect(playCalls).toHaveLength(0)
  })

  it('keeps the poster and does not log if autoplay is rejected', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new DOMException('Not allowed', 'NotAllowedError'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    renderHero()
    fireEvent.focus(document.querySelector('#product')!)
    await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalled())
    expect(document.querySelector('#product > img')).toBeInTheDocument()
    expect(document.querySelector('#product video')).toHaveAttribute('poster', heroModes[0].image)
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('preserves one centralized keyboard active state', () => {
    renderHero()
    const product = screen.getByRole('link', { name: /ПРОДУКТ/ })
    const design = screen.getByRole('link', { name: /ДИЗАЙН/ })
    fireEvent.focus(product)
    expect(product).toHaveAttribute('data-state', 'active')
    fireEvent.focus(design)
    expect(product).toHaveAttribute('data-state', 'idle')
    expect(design).toHaveAttribute('data-state', 'active')
    expect(document.querySelectorAll('.hero-panel[data-state="active"]')).toHaveLength(1)
  })
})
