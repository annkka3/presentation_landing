import { useEffect, useRef, useState } from 'react'

export function useIntersectionReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '0px 0px -8%', threshold: 0.08 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, visible] as const
}
