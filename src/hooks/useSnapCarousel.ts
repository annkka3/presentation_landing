import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useSnapCarousel(length: number, initialIndex = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const [active, setActive] = useState(Math.min(Math.max(initialIndex, 0), Math.max(length - 1, 0)))
  const reducedMotion = useReducedMotion()

  const goTo = useCallback((index: number, instant = false) => {
    const next = Math.min(Math.max(index, 0), Math.max(length - 1, 0))
    setActive(next)
    const track = ref.current
    const item = track?.children.item(next) as HTMLElement | null
    if (!track || !item) return
    track.scrollTo({ left: item.offsetLeft, behavior: instant || reducedMotion ? 'auto' : 'smooth' })
  }, [length, reducedMotion])

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const track = ref.current
      if (!track) return
      const items = [...track.children] as HTMLElement[]
      let nearest = 0
      let distance = Number.POSITIVE_INFINITY
      items.forEach((item, index) => {
        const nextDistance = Math.abs(item.offsetLeft - track.scrollLeft)
        if (nextDistance < distance) {
          nearest = index
          distance = nextDistance
        }
      })
      setActive((current) => current === nearest ? current : nearest)
    })
  }, [])

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target !== event.currentTarget && target.closest('input, textarea, select, button, a, [data-horizontal-carousel]')) return
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    goTo(active + (event.key === 'ArrowRight' ? 1 : -1))
  }, [active, goTo])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  useEffect(() => {
    const realign = () => goTo(active, true)
    addEventListener('orientationchange', realign)
    addEventListener('resize', realign)
    return () => {
      removeEventListener('orientationchange', realign)
      removeEventListener('resize', realign)
    }
  }, [active, goTo])

  return { ref, active, goTo, onScroll, onKeyDown }
}
