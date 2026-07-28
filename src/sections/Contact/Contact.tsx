import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useApp } from '../../app/AppContext'
import { Container } from '../../components/layout/Container'
import { sendContact, type ContactPayload } from '../../services/contact'
import { validateContact, type ContactErrors } from '../../services/validation'

const emptyValues = (): ContactPayload => ({ name: '', contact: '', message: '', website: '' })
const normalizeContactValue = (value: unknown) => value == null || value === 'null' ? '' : String(value)

type ContactField = 'name' | 'contact' | 'message'
type SignalState = 'idle' | 'focus' | 'submit-hover' | 'loading' | 'success' | 'error' | 'config'
type ParticleShape = 'dot' | 'square' | 'outline' | 'dash' | 'line' | 'plus' | 'arc'

type SignalParticle = {
  anchorX: number
  anchorY: number
  x: number
  y: number
  velocityX: number
  velocityY: number
  depth: number
  phase: number
  speed: number
  size: number
  rotation: number
  shape: ParticleShape
}

const signalShapes: ParticleShape[] = ['dot', 'dash', 'outline', 'dot', 'line', 'square', 'plus', 'dot', 'dash', 'outline', 'line']
const hash = (value: number) => {
  const x = Math.sin(value * 91.173 + 17.71) * 43758.5453
  return x - Math.floor(x)
}

function createSignalParticles(width: number, height: number) {
  const count = width < 520 ? 38 : 58
  return Array.from({ length: count }, (_, index): SignalParticle => {
    const column = (index * 17) % count
    const row = (index * 23) % count
    const anchorX = width * (.035 + .93 * ((column + .36 + hash(index + 3)) / count))
    const anchorY = height * (.04 + .91 * ((row + .28 + hash(index + 31)) / count))
    const depth = .5 + hash(index + 57) * .5
    const shape = index === 19 || index === 47 ? 'arc' : signalShapes[index % signalShapes.length]
    return {
      anchorX,
      anchorY,
      x: anchorX,
      y: anchorY,
      velocityX: 0,
      velocityY: 0,
      depth,
      phase: hash(index + 71) * Math.PI * 2,
      speed: .7 + hash(index + 89) * .8,
      size: 1.2 + hash(index + 101) * 2.2,
      rotation: hash(index + 131) * Math.PI,
      shape,
    }
  })
}

function ContactSignalField({ activeField, signalState }: { activeField: ContactField | null, signalState: SignalState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ activeField, signalState })

  useEffect(() => {
    stateRef.current = { activeField, signalState }
  }, [activeField, signalState])

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const form = host?.closest('form')
    const context = canvas?.getContext?.('2d')
    if (!canvas || !host || !form || !context) return

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionQuery?.matches ?? false
    let width = 1
    let height = 1
    let pixelRatio = 1
    let particles: SignalParticle[] = []
    let frame = 0
    let frameIndex = 0
    let previousTime = performance.now()
    let visible = true
    const pointer = { x: 0, y: 0, previousX: 0, previousY: 0, velocityX: 0, velocityY: 0, active: false }

    const setMotionDataset = () => {
      canvas.dataset.motion = reducedMotion ? 'static' : 'physics'
      canvas.dataset.pointerActive = String(pointer.active && !reducedMotion)
    }

    const drawGuideLayer = (time: number) => {
      const state = stateRef.current.signalState
      const accent = state === 'success' ? '91,224,207' : state === 'error' || state === 'config' ? '238,138,130' : '198,164,103'
      const pulse = reducedMotion ? 0 : Math.sin(time * .00042) * .025
      const gradient = context.createRadialGradient(width * .72, height * .7, 0, width * .72, height * .7, width * .5)
      gradient.addColorStop(0, `rgba(${accent},${.065 + pulse})`)
      gradient.addColorStop(.48, `rgba(${accent},.018)`)
      gradient.addColorStop(1, `rgba(${accent},0)`)
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      context.save()
      context.strokeStyle = `rgba(${accent},.11)`
      context.lineWidth = .8
      context.beginPath()
      context.ellipse(width * .79, height * .75, width * .19, height * .24, -.18, Math.PI * .16, Math.PI * 1.46)
      context.stroke()
      context.strokeStyle = `rgba(${accent},.065)`
      context.beginPath()
      context.ellipse(width * .29, height * .37, width * .34, height * .17, .08, Math.PI * .9, Math.PI * 1.88)
      context.stroke()
      context.restore()
    }

    const drawParticle = (particle: SignalParticle, alpha: number, accent: string) => {
      const size = particle.size * (.74 + particle.depth * .44)
      context.save()
      context.translate(particle.x, particle.y)
      context.rotate(particle.rotation)
      context.strokeStyle = `rgba(${accent},${alpha})`
      context.fillStyle = `rgba(${accent},${Math.min(.82, alpha + .08)})`
      context.lineWidth = Math.max(.7, particle.depth)
      context.lineCap = 'round'
      switch (particle.shape) {
        case 'dot':
          context.beginPath()
          context.arc(0, 0, size * .54, 0, Math.PI * 2)
          context.fill()
          break
        case 'square':
          context.fillRect(-size * .55, -size * .55, size * 1.1, size * 1.1)
          break
        case 'outline':
          context.strokeRect(-size, -size, size * 2, size * 2)
          break
        case 'dash':
          context.beginPath()
          context.moveTo(-size * 2.5, 0)
          context.lineTo(size * 2.5, 0)
          context.stroke()
          break
        case 'line':
          context.beginPath()
          context.moveTo(-size * 3.6, 0)
          context.lineTo(size * 3.6, 0)
          context.stroke()
          break
        case 'plus':
          context.beginPath()
          context.moveTo(-size * 1.45, 0)
          context.lineTo(size * 1.45, 0)
          context.moveTo(0, -size * 1.45)
          context.lineTo(0, size * 1.45)
          context.stroke()
          break
        case 'arc':
          context.beginPath()
          context.arc(0, 0, size * 4.6, -.45, Math.PI * 1.12)
          context.stroke()
          break
      }
      context.restore()
    }

    const render = (time: number, delta = 1) => {
      context.clearRect(0, 0, width, height)
      drawGuideLayer(time)
      const state = stateRef.current
      const focusY = state.activeField === 'name' ? height * .34 : state.activeField === 'contact' ? height * .49 : state.activeField === 'message' ? height * .67 : -1000
      const accent = state.signalState === 'success' ? '91,224,207' : state.signalState === 'error' || state.signalState === 'config' ? '238,138,130' : '198,164,103'
      const radius = Math.max(82, Math.min(132, Math.min(width, height) * .25))
      let maxDisplacement = 0

      particles.forEach((particle) => {
        if (!reducedMotion) {
          const drift = 1.15 + particle.depth * 1.55
          const targetX = particle.anchorX + Math.sin(time * .00034 * particle.speed + particle.phase) * drift
          let targetY = particle.anchorY + Math.cos(time * .00029 * particle.speed + particle.phase * .73) * drift
          const inFocusBand = state.activeField !== null && Math.abs(particle.anchorY - focusY) < height * .095
          if (inFocusBand) targetY += Math.sin(particle.anchorX * .021 + time * .0006) * 1.8
          const spring = inFocusBand ? .022 : .015
          particle.velocityX += (targetX - particle.x) * spring * delta
          particle.velocityY += (targetY - particle.y) * spring * delta

          if (pointer.active) {
            const dx = particle.x - pointer.x
            const dy = particle.y - pointer.y
            const distance = Math.max(1, Math.hypot(dx, dy))
            if (distance < radius) {
              const influence = 1 - distance / radius
              const force = influence * influence * (2.6 + particle.depth * 2.4) * delta
              particle.velocityX += dx / distance * force + pointer.velocityX * influence * .035
              particle.velocityY += dy / distance * force + pointer.velocityY * influence * .035
            }
          }

          if (state.signalState === 'loading' || state.signalState === 'submit-hover') {
            particle.velocityX += (width * .35 - particle.x) * .0007 * delta
            particle.velocityY += (height * .84 - particle.y) * .0007 * delta
          }
          const damping = Math.pow(.895, delta)
          particle.velocityX *= damping
          particle.velocityY *= damping
          const velocity = Math.hypot(particle.velocityX, particle.velocityY)
          if (velocity > 7.5) {
            particle.velocityX = particle.velocityX / velocity * 7.5
            particle.velocityY = particle.velocityY / velocity * 7.5
          }
          particle.x += particle.velocityX * delta
          particle.y += particle.velocityY * delta
        }

        const displacement = Math.hypot(particle.x - particle.anchorX, particle.y - particle.anchorY)
        maxDisplacement = Math.max(maxDisplacement, displacement)
        const focusBoost = state.activeField !== null && Math.abs(particle.anchorY - focusY) < height * .095 ? .15 : 0
        const alpha = Math.min(.78, .2 + particle.depth * .3 + focusBoost + (state.signalState === 'submit-hover' ? .08 : 0))
        drawParticle(particle, alpha, accent)
      })

      if (frameIndex++ % 5 === 0) canvas.dataset.maxDisplacement = maxDisplacement.toFixed(1)
      pointer.velocityX *= .82
      pointer.velocityY *= .82
    }

    const tick = (time: number) => {
      const delta = Math.min(1.8, Math.max(.35, (time - previousTime) / 16.667))
      previousTime = time
      render(time, delta)
      frame = visible && !reducedMotion ? requestAnimationFrame(tick) : 0
    }

    const start = () => {
      if (!visible || reducedMotion || frame) return
      previousTime = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const resize = () => {
      const bounds = host.getBoundingClientRect()
      const nextWidth = Math.max(1, bounds.width)
      const nextHeight = Math.max(1, bounds.height)
      pixelRatio = Math.min(1.75, window.devicePixelRatio || 1)
      width = nextWidth
      height = nextHeight
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      particles = createSignalParticles(width, height)
      canvas.dataset.particleCount = String(particles.length)
      render(performance.now())
      start()
    }

    const movePointer = (event: PointerEvent) => {
      if (reducedMotion) return
      const bounds = host.getBoundingClientRect()
      const nextX = event.clientX - bounds.left
      const nextY = event.clientY - bounds.top
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
      setMotionDataset()
      start()
    }

    const leavePointer = () => {
      pointer.active = false
      setMotionDataset()
      start()
    }

    const updateMotionPreference = () => {
      reducedMotion = motionQuery?.matches ?? false
      if (reducedMotion && frame) cancelAnimationFrame(frame)
      frame = 0
      pointer.active = false
      setMotionDataset()
      particles.forEach((particle) => {
        particle.x = particle.anchorX
        particle.y = particle.anchorY
        particle.velocityX = 0
        particle.velocityY = 0
      })
      render(performance.now())
      start()
    }

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible && frame) cancelAnimationFrame(frame)
      frame = 0
      start()
    }, { rootMargin: '120px' })

    form.addEventListener('pointermove', movePointer)
    form.addEventListener('pointerleave', leavePointer)
    motionQuery?.addEventListener?.('change', updateMotionPreference)
    resizeObserver?.observe(host)
    intersectionObserver?.observe(host)
    setMotionDataset()
    resize()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      form.removeEventListener('pointermove', movePointer)
      form.removeEventListener('pointerleave', leavePointer)
      motionQuery?.removeEventListener?.('change', updateMotionPreference)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
    }
  }, [])

  return <div className="contact-signal-field" data-renderer="canvas" aria-hidden="true">
    <canvas className="contact-signal-canvas" ref={canvasRef} />
  </div>
}

export function Contact({ mobile = false }: { mobile?: boolean }) {
  const { locale, t } = useApp()
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'config'>('idle')
  const [activeField, setActiveField] = useState<ContactField | null>(null)
  const [submitHovered, setSubmitHovered] = useState(false)
  const update = (field: keyof ContactPayload, value: unknown) => setValues((current) => ({ ...current, [field]: normalizeContactValue(value) }))
  const signalState = status === 'loading' || status === 'success' || status === 'error' || status === 'config'
    ? status
    : submitHovered ? 'submit-hover' : activeField ? 'focus' : 'idle'

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'loading') return
    const nextErrors = validateContact(values, t, !mobile)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    if (values.website) return
    setStatus('loading')
    try {
      await sendContact({ ...values, name: values.name.trim(), contact: values.contact.trim(), message: values.message.trim() })
      setStatus('success')
      setValues(emptyValues())
    } catch (error) {
      setStatus(error instanceof Error && error.message === 'CONTACT_ENDPOINT_MISSING' ? 'config' : 'error')
    }
  }
  const copyEmail = () => navigator.clipboard?.writeText('annagromyko88@gmail.com')
  return <section className={`section contact-section ${mobile ? 'is-mobile-contact' : ''}`}><div className="contact-content"><Container className="contact-grid">
    <div className="contact-copy"><span className="contact-eyebrow">{mobile ? t.mobileContactEyebrow : t.contactEyebrow}</span><h2 className="contact-display-heading">{t.contactHeading}</h2><p>{mobile ? t.mobileContactIntro : t.contactIntro}</p><p className="contact-availability">{t.availability}</p><div className="contact-links">
      {mobile ? <button type="button" onClick={copyEmail} aria-label={t.copyEmail}><span className="contact-link-copy"><span>EMAIL</span><strong>annagromyko88@gmail.com</strong></span><i aria-hidden="true">⧉</i></button> : <a href="mailto:annagromyko88@gmail.com"><span className="contact-link-copy"><span>EMAIL</span><strong>annagromyko88@gmail.com</strong></span><i aria-hidden="true">↗</i></a>}
      <a href="https://t.me/AnnaGromyko" target="_blank" rel="noopener noreferrer"><span className="contact-link-copy"><span>TELEGRAM</span><strong>@AnnaGromyko</strong></span><i aria-hidden="true">↗</i></a>
      <a href="https://github.com/annkka3" target="_blank" rel="noopener noreferrer"><span className="contact-link-copy"><span>GITHUB</span><strong>github.com/annkka3</strong></span><i aria-hidden="true">↗</i></a>
    </div></div>
    <form className="contact-form" data-signal-state={signalState} data-active-field={activeField ?? undefined} onSubmit={submit} noValidate aria-labelledby="contact-form-heading">
      <ContactSignalField activeField={activeField} signalState={signalState} />
      {mobile && <span className="contact-form-helper">{locale === 'ru' ? 'ОПИШИТЕ ЗАДАЧУ' : 'DESCRIBE THE BRIEF'}</span>}
      <h3 className="contact-display-heading" id="contact-form-heading">{t.formHeading}</h3><p>{t.formDescription}</p>
      {!mobile && <div className="form-field"><label htmlFor="name">{t.name}</label><input id="name" value={normalizeContactValue(values.name)} onFocus={() => setActiveField('name')} onBlur={() => setActiveField(null)} onChange={(event) => update('name', event.target.value)} placeholder={t.namePlaceholder} maxLength={101} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined}/>{errors.name && <small id="name-error">{errors.name}</small>}</div>}
      <div className="form-field"><label htmlFor="contact-field">{t.contactField}</label><input id="contact-field" value={normalizeContactValue(values.contact)} onFocus={() => setActiveField('contact')} onBlur={() => setActiveField(null)} onChange={(event) => update('contact', event.target.value)} placeholder={t.contactPlaceholder} maxLength={161} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? 'contact-error' : undefined}/>{errors.contact && <small id="contact-error">{errors.contact}</small>}</div>
      <div className="form-field"><label htmlFor="message">{t.message}</label><textarea id="message" rows={6} value={normalizeContactValue(values.message)} onFocus={() => setActiveField('message')} onBlur={() => setActiveField(null)} onChange={(event) => update('message', event.target.value)} placeholder={t.messagePlaceholder} maxLength={3001} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined}/>{errors.message && <small id="message-error">{errors.message}</small>}</div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">{t.website}</label><input id="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update('website', event.target.value)}/></div>
      <button className="submit-button" disabled={status === 'loading'} onPointerEnter={() => setSubmitHovered(true)} onPointerLeave={() => setSubmitHovered(false)}>{status === 'loading' ? t.sending : t.send}</button>
      <p className={`form-status ${status}`} aria-live="polite">{status === 'success' ? t.success : status === 'config' ? t.configError : status === 'error' ? t.sendError : ''}</p>
    </form>
  </Container><Container className="contact-closing">{t.contactClosing}</Container></div></section>
}
