import '@testing-library/jest-dom/vitest'

const storage = new Map<string, string>()
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, String(value)),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    key: (index: number) => [...storage.keys()][index] ?? null,
    get length() { return storage.size },
  },
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => true,
  }),
})

class ImmediateIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly scrollMargin = '0px'
  readonly thresholds = [0]
  constructor(private readonly callback: IntersectionObserverCallback) {}
  disconnect() {}
  observe(target: Element) {
    this.callback([{ boundingClientRect: target.getBoundingClientRect(), intersectionRatio: 1, intersectionRect: target.getBoundingClientRect(), isIntersecting: true, rootBounds: null, target, time: performance.now() }], this)
  }
  takeRecords() { return [] }
  unobserve() {}
}

Object.defineProperty(window, 'IntersectionObserver', { configurable: true, writable: true, value: ImmediateIntersectionObserver })
Object.defineProperty(globalThis, 'IntersectionObserver', { configurable: true, writable: true, value: ImmediateIntersectionObserver })
Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, writable: true, value: () => Promise.resolve() })
Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, writable: true, value: () => undefined })
Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, writable: true, value: () => undefined })
