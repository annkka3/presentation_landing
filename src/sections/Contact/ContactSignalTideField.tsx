import { useEffect, useRef } from 'react'

export type ContactField = 'name' | 'contact' | 'message'
export type SignalState = 'idle' | 'focus' | 'submit-hover' | 'loading' | 'success' | 'error' | 'config'

type Depth = 'background' | 'middle' | 'foreground'
type Shape = 'dot' | 'square' | 'dash' | 'diamond' | 'plus'

type TideParticle = {
  id: number
  anchorX: number
  anchorY: number
  fade: number
  x: number
  y: number
  velocityX: number
  velocityY: number
  depth: Depth
  shape: Shape
  size: number
  opacity: number
  phase: number
  speed: number
  rotation: number
  maxDisplacement: number
}

const hash = (value: number) => {
  const result = Math.sin(value * 94.517 + 31.173) * 43758.5453
  return result - Math.floor(result)
}

function getParticleCount(viewportWidth: number, mobile: boolean) {
  if (mobile || viewportWidth <= 767) return 220
  if (viewportWidth <= 1279) return 1300
  if (viewportWidth >= 1680) return 3200
  return 2800
}

function getShape(index: number): Shape {
  const slot = (index * 37) % 100
  if (slot < 48) return 'dot'
  if (slot < 72) return 'square'
  if (slot < 88) return 'dash'
  if (slot < 96) return 'diamond'
  return 'plus'
}

function createTide(width: number, height: number, viewportWidth: number, mobile: boolean) {
  const count = getParticleCount(viewportWidth, mobile)
  const rowCount = mobile ? 12 : viewportWidth <= 1279 ? 22 : 34
  const columnCount = Math.ceil(count / rowCount)
  return Array.from({ length: count }, (_, index): TideParticle => {
    const row = index % rowCount
    const column = Math.floor(index / rowCount)
    const distribution = (column + .08 + hash(index + 11) * .84) / columnCount
    const normalizedX = .004 + Math.pow(distribution, .92) * .992
    const centerRise = Math.exp(-Math.pow((normalizedX - .54) / .2, 2)) * .13
    const rightRise = Math.exp(-Math.pow((normalizedX - .83) / .18, 2)) * .28
    const rightFall = Math.exp(-Math.pow((normalizedX - 1) / .08, 2)) * .12
    const topContour = Math.max(.06, .46 - centerRise - rightRise + rightFall)
    const depthSample = hash(index + 29)
    const depth: Depth = depthSample < .58 ? 'background' : depthSample < .92 ? 'middle' : 'foreground'
    const vertical = (row + .12 + hash(index + 47) * .7) / rowCount
    const perspective = Math.pow(vertical, 1.34)
    const rowWave = Math.sin(normalizedX * Math.PI * 2.35 + row * .38) * .014
    const anchorX = normalizedX * width
    const anchorY = Math.min(.995, topContour + perspective * (.992 - topContour) + rowWave) * height
    const topFade = Math.min(1, Math.max(0, (anchorY / height - topContour + .02) / .2))
    const lowerWeight = .54 + Math.pow(vertical, .95) * .58
    const size = (depth === 'background' ? .5 + hash(index + 61) * .44
      : depth === 'middle' ? .82 + hash(index + 67) * .68
        : 1.22 + hash(index + 71) * .98) * lowerWeight
    const opacity = (depth === 'background' ? .3 + hash(index + 79) * .2
      : depth === 'middle' ? .54 + hash(index + 83) * .28
        : .78 + hash(index + 89) * .18) * (.2 + topFade * .8)
    return {
      id: index,
      anchorX,
      anchorY,
      fade: topFade,
      x: anchorX,
      y: anchorY,
      velocityX: 0,
      velocityY: 0,
      depth,
      shape: getShape(index),
      size,
      opacity,
      phase: hash(index + 97) * Math.PI * 2,
      speed: .68 + hash(index + 101) * .58,
      rotation: (hash(index + 107) - .5) * .7,
      maxDisplacement: depth === 'background' ? 13 : depth === 'middle' ? 27 : 42,
    }
  })
}

function depthSummary(particles: TideParticle[]) {
  const counts: Record<Depth, number> = { background: 0, middle: 0, foreground: 0 }
  particles.forEach((particle) => { counts[particle.depth] += 1 })
  return `background:${counts.background},middle:${counts.middle},foreground:${counts.foreground}`
}

function shapeSummary(particles: TideParticle[]) {
  const counts: Record<Shape, number> = { dot: 0, square: 0, dash: 0, diamond: 0, plus: 0 }
  particles.forEach((particle) => { counts[particle.shape] += 1 })
  return Object.entries(counts).map(([shape, count]) => `${shape}:${count}`).join(',')
}

export function ContactSignalTideField({ activeField, signalState, mobile }: { activeField: ContactField | null, signalState: SignalState, mobile: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ activeField, signalState })

  useEffect(() => {
    stateRef.current = { activeField, signalState }
    canvasRef.current?.dispatchEvent(new CustomEvent('tidestatechange', { detail: { activeField, signalState } }))
  }, [activeField, signalState])

  useEffect(() => {
    const canvas = canvasRef.current
    const field = canvas?.parentElement
    const root = field?.parentElement
    const context = canvas?.getContext('2d')
    if (!canvas || !field || !root || !context) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointerQuery = window.matchMedia('(pointer: fine)')
    let reducedMotion = motionQuery.matches
    let finePointer = finePointerQuery.matches
    let width = 1
    let height = 1
    let pixelRatio = 1
    let particles: TideParticle[] = []
    let frame = 0
    let previousTime = performance.now()
    let visible = typeof IntersectionObserver !== 'undefined'
    let pageVisible = document.visibilityState !== 'hidden'
    let ctaX = 0
    let ctaY = 0
    let ctaWidth = 0
    let lastState: SignalState = stateRef.current.signalState
    const pointer = { x: 0, y: 0, previousX: 0, previousY: 0, velocityX: 0, velocityY: 0, active: false }

    const setDatasets = (maxDisplacement = 0) => {
      canvas.dataset.motion = reducedMotion ? 'static' : 'physics'
      canvas.dataset.pointerActive = String(pointer.active && !reducedMotion)
      canvas.dataset.particleCount = String(particles.length)
      canvas.dataset.depths = depthSummary(particles)
      canvas.dataset.shapes = shapeSummary(particles)
      canvas.dataset.maxDisplacement = maxDisplacement.toFixed(1)
      canvas.dataset.signalState = stateRef.current.signalState
      canvas.dataset.fieldHeight = Math.round(height).toString()
    }

    const drawGlow = () => {
      const center = context.createRadialGradient(width * .52, height * .82, 0, width * .52, height * .82, Math.min(420, width * .28))
      center.addColorStop(0, 'rgba(212,179,110,.12)')
      center.addColorStop(.48, 'rgba(155,121,66,.042)')
      center.addColorStop(1, 'rgba(155,121,66,0)')
      context.fillStyle = center
      context.fillRect(0, 0, width, height)

      const outcome = context.createRadialGradient(width * .82, height * .68, 0, width * .82, height * .68, Math.min(520, width * .34))
      outcome.addColorStop(0, 'rgba(226,171,74,.22)')
      outcome.addColorStop(.44, 'rgba(171,120,44,.072)')
      outcome.addColorStop(1, 'rgba(155,121,66,0)')
      context.fillStyle = outcome
      context.fillRect(0, 0, width, height)
    }

    const drawParticle = (particle: TideParticle, time: number) => {
      const state = stateRef.current.signalState
      const ctaDistance = Math.hypot(particle.x - ctaX, particle.y - ctaY)
      const ctaBoost = (state === 'submit-hover' || state === 'loading') && ctaDistance < Math.max(130, ctaWidth * .72)
      const successBoost = state === 'success' && ctaDistance < Math.max(180, ctaWidth)
      const pointerDistance = pointer.active ? Math.hypot(particle.x - pointer.x, particle.y - pointer.y) : Infinity
      const localWake = Math.max(0, 1 - pointerDistance / 170)
      const breath = reducedMotion ? 0 : Math.sin(time * .00072 * particle.speed + particle.phase) * .025
      const edgeFade = Math.min(1, Math.max(0, (particle.y / height - .12) / .25))
      const alpha = Math.min(1, (particle.opacity + breath + (ctaBoost ? .1 : 0) + (successBoost ? .08 : 0) + localWake * .035) * edgeFade)
      const color = particle.depth === 'foreground' ? '241,215,158' : particle.depth === 'middle' ? '219,166,78' : '172,126,58'
      context.save()
      context.translate(particle.x, particle.y)
      context.rotate(particle.rotation)
      context.globalAlpha = alpha
      context.fillStyle = `rgb(${color})`
      context.strokeStyle = `rgb(${color})`
      context.lineWidth = particle.depth === 'foreground' ? .9 : .65
      if (particle.depth === 'foreground') {
        context.shadowColor = 'rgba(212,179,110,.42)'
        context.shadowBlur = 7
      }
      if (particle.shape === 'dot') {
        context.beginPath()
        context.arc(0, 0, particle.size, 0, Math.PI * 2)
        context.fill()
      } else if (particle.shape === 'square') {
        const side = particle.size * 1.72
        context.fillRect(-side * .5, -side * .5, side, side)
      } else if (particle.shape === 'dash') {
        context.fillRect(-particle.size * 2.6, -particle.size * .34, particle.size * 5.2, particle.size * .68)
      } else if (particle.shape === 'diamond') {
        context.rotate(Math.PI * .25)
        const side = particle.size * 1.84
        context.strokeRect(-side * .5, -side * .5, side, side)
      } else {
        context.beginPath()
        context.moveTo(-particle.size * 1.8, 0)
        context.lineTo(particle.size * 1.8, 0)
        context.moveTo(0, -particle.size * 1.8)
        context.lineTo(0, particle.size * 1.8)
        context.stroke()
      }
      context.restore()
    }

    const applySuccessImpulse = () => {
      particles.forEach((particle) => {
        const dx = particle.x - ctaX
        const dy = particle.y - ctaY
        const distance = Math.max(1, Math.hypot(dx, dy))
        if (distance < Math.max(210, ctaWidth * 1.05)) {
          const influence = 1 - distance / Math.max(210, ctaWidth * 1.05)
          const depthForce = particle.depth === 'foreground' ? 3.4 : particle.depth === 'middle' ? 2.2 : 1.2
          particle.velocityX += dx / distance * influence * depthForce
          particle.velocityY += dy / distance * influence * depthForce
        }
      })
    }

    const render = (time: number, delta = 1) => {
      context.clearRect(0, 0, width, height)
      drawGlow()
      const state = stateRef.current.signalState
      if (state === 'success' && lastState !== 'success') applySuccessImpulse()
      lastState = state
      let maxDisplacement = 0

      particles.forEach((particle) => {
        if (!reducedMotion) {
          const drift = particle.depth === 'background' ? .58 : particle.depth === 'middle' ? 1.08 : 1.75
          let targetX = particle.anchorX + Math.sin(time * .00014 * particle.speed + particle.phase) * drift
          let targetY = particle.anchorY + Math.cos(time * .00018 * particle.speed + particle.phase * .73) * drift
          const ctaDistance = Math.hypot(particle.anchorX - ctaX, particle.anchorY - ctaY)
          const ctaRadius = Math.max(140, ctaWidth * .78)
          if ((state === 'submit-hover' || state === 'loading') && ctaDistance < ctaRadius) {
            const influence = 1 - ctaDistance / ctaRadius
            targetY -= influence * (state === 'loading' ? 13 : 7)
            targetX += (ctaX - particle.anchorX) * influence * (state === 'loading' ? .075 : .028)
          }
          particle.velocityX += (targetX - particle.x) * .017 * delta
          particle.velocityY += (targetY - particle.y) * .017 * delta

          if (pointer.active) {
            const dx = particle.x - pointer.x
            const dy = particle.y - pointer.y
            const distance = Math.max(1, Math.hypot(dx, dy))
            const influenceRadius = mobile ? 104 : window.innerWidth <= 1279 ? 142 : 178
            if (distance < influenceRadius) {
              const influence = 1 - distance / influenceRadius
              const depthForce = particle.depth === 'background' ? .46 : particle.depth === 'middle' ? .84 : 1.18
              const force = influence * influence * 3.25 * depthForce * delta
              const tangentX = -dy / distance
              const tangentY = dx / distance
              const wake = Math.min(5, Math.hypot(pointer.velocityX, pointer.velocityY)) * influence * .075 * depthForce
              particle.velocityX += dx / distance * force + tangentX * wake + pointer.velocityX * influence * .018
              particle.velocityY += dy / distance * force + tangentY * wake + pointer.velocityY * influence * .018
            }
          }

          const damping = Math.pow(.89, delta)
          particle.velocityX *= damping
          particle.velocityY *= damping
          const nextX = particle.x + particle.velocityX * delta
          const nextY = particle.y + particle.velocityY * delta
          const displacement = Math.hypot(nextX - particle.anchorX, nextY - particle.anchorY)
          if (displacement > particle.maxDisplacement) {
            const angle = Math.atan2(nextY - particle.anchorY, nextX - particle.anchorX)
            particle.x = particle.anchorX + Math.cos(angle) * particle.maxDisplacement
            particle.y = particle.anchorY + Math.sin(angle) * particle.maxDisplacement
            particle.velocityX *= .34
            particle.velocityY *= .34
          } else {
            particle.x = nextX
            particle.y = nextY
          }
          maxDisplacement = Math.max(maxDisplacement, Math.hypot(particle.x - particle.anchorX, particle.y - particle.anchorY))
        }
        drawParticle(particle, time)
      })
      pointer.velocityX *= .74
      pointer.velocityY *= .74
      setDatasets(maxDisplacement)
    }

    const tick = (time: number) => {
      const delta = Math.min(1.7, Math.max(.35, (time - previousTime) / 16.667))
      previousTime = time
      render(time, delta)
      frame = visible && pageVisible && !reducedMotion ? requestAnimationFrame(tick) : 0
    }

    const start = () => {
      if (!visible || !pageVisible || reducedMotion || frame) return
      previousTime = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const resize = () => {
      const bounds = field.getBoundingClientRect()
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      pixelRatio = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      const button = root.querySelector<HTMLElement>('.submit-button')
      const buttonBounds = button?.getBoundingClientRect()
      ctaX = buttonBounds ? buttonBounds.left - bounds.left + buttonBounds.width * .5 : width * .68
      ctaY = buttonBounds ? buttonBounds.bottom - bounds.top + 10 : height * .18
      ctaWidth = buttonBounds?.width ?? 230
      particles = createTide(width, height, window.innerWidth, mobile)
      setDatasets()
      render(performance.now())
      start()
    }

    const movePointer = (event: PointerEvent) => {
      if (reducedMotion || !finePointer || mobile) return
      const bounds = field.getBoundingClientRect()
      const nextX = event.clientX - bounds.left
      const nextY = event.clientY - bounds.top
      const active = nextY > -190 && nextY < height + 80 && nextX > -60 && nextX < width + 60
      if (!active) {
        pointer.active = false
        setDatasets()
        return
      }
      if (!pointer.active) {
        pointer.previousX = nextX
        pointer.previousY = nextY
      }
      pointer.velocityX = nextX - pointer.previousX
      pointer.velocityY = nextY - pointer.previousY
      pointer.x = nextX
      pointer.y = nextY
      pointer.previousX = nextX
      pointer.previousY = nextY
      pointer.active = true
      setDatasets()
      start()
    }

    const leavePointer = () => {
      pointer.active = false
      setDatasets()
      start()
    }

    const updateMotion = () => {
      reducedMotion = motionQuery.matches
      finePointer = finePointerQuery.matches
      pointer.active = false
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      particles.forEach((particle) => {
        particle.x = particle.anchorX
        particle.y = particle.anchorY
        particle.velocityX = 0
        particle.velocityY = 0
      })
      setDatasets()
      render(performance.now())
      start()
    }

    const updateVisibility = () => {
      pageVisible = document.visibilityState !== 'hidden'
      if (!pageVisible && frame) cancelAnimationFrame(frame)
      frame = 0
      start()
    }

    const renderState = (event: Event) => {
      const detail = (event as CustomEvent<{ signalState?: SignalState }>).detail
      if (detail?.signalState) stateRef.current.signalState = detail.signalState
      if (reducedMotion) render(performance.now())
      else start()
    }

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible && frame) cancelAnimationFrame(frame)
      frame = 0
      start()
    }, { rootMargin: '100px' })

    root.addEventListener('pointermove', movePointer)
    root.addEventListener('pointerleave', leavePointer)
    canvas.addEventListener('tidestatechange', renderState)
    canvas.addEventListener('tideqastate', renderState)
    document.addEventListener('visibilitychange', updateVisibility)
    motionQuery.addEventListener('change', updateMotion)
    finePointerQuery.addEventListener('change', updateMotion)
    resizeObserver?.observe(field)
    intersectionObserver?.observe(field)
    resize()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', movePointer)
      root.removeEventListener('pointerleave', leavePointer)
      canvas.removeEventListener('tidestatechange', renderState)
      canvas.removeEventListener('tideqastate', renderState)
      document.removeEventListener('visibilitychange', updateVisibility)
      motionQuery.removeEventListener('change', updateMotion)
      finePointerQuery.removeEventListener('change', updateMotion)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
    }
  }, [mobile])

  return <div className="contact-signal-field contact-tide-field" data-renderer="kinetic-signal-tide" aria-hidden="true">
    <canvas className="contact-tide-canvas" ref={canvasRef} />
  </div>
}
