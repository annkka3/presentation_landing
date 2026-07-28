import { useEffect, useMemo, useRef, useState } from 'react'

export type ContactField = 'name' | 'contact' | 'message'
export type SignalState = 'idle' | 'focus' | 'submit-hover' | 'loading' | 'success' | 'error' | 'config'

type Point = { x: number, y: number }
type DynamicPoint = Point & { originX: number, originY: number, velocityX: number, velocityY: number }
type RouteId = 'a' | 'b' | 'c' | 'd'
type NodeKind = 'ring' | 'diamond' | 'dot' | 'outcome'
type Breakpoint = 'desktop' | 'tablet' | 'mobile'
type ExclusionZone = { x: number, y: number, width: number, height: number }

type RouteSpec = {
  id: RouteId
  label: string
  points: Point[]
  nodes: Array<{ id: string, x: number, y: number, kind: NodeKind }>
}

const VIEWBOX_WIDTH = 1000
const VIEWBOX_HEIGHT = 620

const desktopRoutes: RouteSpec[] = [
  {
    id: 'a',
    label: 'Identity route',
    points: [
      { x: 8, y: 72 }, { x: 86, y: 16 }, { x: 250, y: 22 }, { x: 352, y: 78 },
      { x: 424, y: 126 }, { x: 348, y: 246 }, { x: 407, y: 333 },
      { x: 438, y: 382 }, { x: 354, y: 447 }, { x: 394, y: 528 },
    ],
    nodes: [
      { id: 'a-1', x: 52, y: 49, kind: 'ring' },
      { id: 'a-2', x: 352, y: 78, kind: 'dot' },
      { id: 'a-3', x: 407, y: 333, kind: 'diamond' },
      { id: 'a-4', x: 394, y: 528, kind: 'dot' },
    ],
  },
  {
    id: 'b',
    label: 'Connection route',
    points: [
      { x: 174, y: 516 }, { x: 326, y: 564 }, { x: 430, y: 430 }, { x: 512, y: 318 },
      { x: 566, y: 250 }, { x: 635, y: 268 }, { x: 704, y: 314 },
      { x: 778, y: 363 }, { x: 831, y: 414 }, { x: 894, y: 456 },
    ],
    nodes: [
      { id: 'b-1', x: 174, y: 516, kind: 'dot' },
      { id: 'b-2', x: 388, y: 486, kind: 'ring' },
      { id: 'b-3', x: 512, y: 318, kind: 'diamond' },
      { id: 'b-4', x: 704, y: 314, kind: 'ring' },
      { id: 'b-5', x: 894, y: 456, kind: 'dot' },
    ],
  },
  {
    id: 'c',
    label: 'Outcome route',
    points: [
      { x: 635, y: 78 }, { x: 788, y: 28 }, { x: 954, y: 68 }, { x: 970, y: 184 },
      { x: 983, y: 287 }, { x: 898, y: 318 }, { x: 928, y: 411 },
      { x: 960, y: 506 }, { x: 842, y: 574 }, { x: 688, y: 535 },
    ],
    nodes: [
      { id: 'c-1', x: 635, y: 78, kind: 'ring' },
      { id: 'c-2', x: 970, y: 184, kind: 'dot' },
      { id: 'c-3', x: 913, y: 328, kind: 'diamond' },
      { id: 'c-4', x: 928, y: 411, kind: 'dot' },
      { id: 'c-5', x: 842, y: 558, kind: 'ring' },
      { id: 'c-6', x: 688, y: 535, kind: 'outcome' },
    ],
  },
  {
    id: 'd',
    label: 'Accent route',
    points: [
      { x: 677, y: 28 }, { x: 762, y: -2 }, { x: 867, y: 8 }, { x: 944, y: 72 },
    ],
    nodes: [
      { id: 'd-1', x: 677, y: 28, kind: 'diamond' },
      { id: 'd-2', x: 944, y: 72, kind: 'dot' },
    ],
  },
]

const tabletRoutes: RouteSpec[] = desktopRoutes.filter((route) => route.id !== 'd').map((route) => ({
  ...route,
  nodes: route.id === 'a' ? route.nodes.slice(0, 3) : route.id === 'b' ? route.nodes.slice(0, 4) : route.nodes.slice(0, 5),
}))

const mobileRoutes: RouteSpec[] = [
  {
    id: 'a',
    label: 'Identity route',
    points: [
      { x: 22, y: 72 }, { x: 168, y: 12 }, { x: 348, y: 32 }, { x: 438, y: 118 },
    ],
    nodes: [
      { id: 'a-1', x: 58, y: 54, kind: 'ring' },
      { id: 'a-2', x: 438, y: 118, kind: 'dot' },
    ],
  },
  {
    id: 'c',
    label: 'Outcome route',
    points: [
      { x: 672, y: 286 }, { x: 946, y: 254 }, { x: 970, y: 382 }, { x: 922, y: 456 },
      { x: 874, y: 528 }, { x: 696, y: 598 }, { x: 512, y: 550 },
    ],
    nodes: [
      { id: 'c-1', x: 672, y: 286, kind: 'ring' },
      { id: 'c-2', x: 922, y: 456, kind: 'diamond' },
      { id: 'c-3', x: 820, y: 554, kind: 'dot' },
      { id: 'c-4', x: 696, y: 598, kind: 'ring' },
      { id: 'c-5', x: 512, y: 550, kind: 'outcome' },
    ],
  },
]

const microElements = [
  { x: 106, y: 112, type: 'dot' }, { x: 278, y: 52, type: 'diamond' }, { x: 374, y: 290, type: 'dash' },
  { x: 286, y: 542, type: 'dot' }, { x: 470, y: 446, type: 'dash' }, { x: 596, y: 352, type: 'dot' },
  { x: 772, y: 315, type: 'diamond' }, { x: 944, y: 260, type: 'dot' }, { x: 887, y: 514, type: 'dash' },
  { x: 760, y: 565, type: 'dot' },
]

const pathFromPoints = (points: Point[]) => {
  if (points.length < 4) return ''
  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 1; index + 2 < points.length; index += 3) {
    path += ` C ${points[index].x} ${points[index].y}, ${points[index + 1].x} ${points[index + 1].y}, ${points[index + 2].x} ${points[index + 2].y}`
  }
  return path
}

const getBreakpoint = (mobile: boolean): Breakpoint => {
  if (mobile || window.innerWidth <= 767) return 'mobile'
  if (window.innerWidth <= 1279) return 'tablet'
  return 'desktop'
}

const routesForBreakpoint = (breakpoint: Breakpoint) => breakpoint === 'mobile' ? mobileRoutes : breakpoint === 'tablet' ? tabletRoutes : desktopRoutes

function getSafeZones(root: HTMLElement, field: HTMLElement): ExclusionZone[] {
  const fieldBounds = field.getBoundingClientRect()
  const selectors = [
    '.contact-copy h2',
    '.contact-copy > p',
    '.contact-links a',
    '.contact-links button',
    '.contact-form h3',
    '.contact-form > p',
    '.contact-form-helper',
    '.form-field label',
    '.form-field input',
    '.form-field textarea',
    '.submit-button',
  ]
  return selectors.flatMap((selector) => [...root.querySelectorAll<HTMLElement>(selector)]).map((element) => {
    const bounds = element.getBoundingClientRect()
    const padding = element.matches('h2, .submit-button') ? 16 : 9
    return {
      x: (bounds.left - fieldBounds.left - padding) / fieldBounds.width * VIEWBOX_WIDTH,
      y: (bounds.top - fieldBounds.top - padding) / fieldBounds.height * VIEWBOX_HEIGHT,
      width: (bounds.width + padding * 2) / fieldBounds.width * VIEWBOX_WIDTH,
      height: (bounds.height + padding * 2) / fieldBounds.height * VIEWBOX_HEIGHT,
    }
  })
}

function nodeShape(kind: NodeKind) {
  if (kind === 'diamond') return <><rect className="signal-node-shape signal-node-diamond" x="-4" y="-4" width="8" height="8" rx=".8" /><circle className="signal-node-core" r="1.25" /></>
  if (kind === 'dot') return <circle className="signal-node-dot" r="2.4" />
  if (kind === 'outcome') return <><circle className="signal-node-halo" r="18" /><circle className="signal-node-outer" r="10" /><circle className="signal-node-inner" r="5.6" /><circle className="signal-node-core" r="2" /></>
  return <><circle className="signal-node-halo" r="14" /><circle className="signal-node-outer" r="7" /><circle className="signal-node-core" r="1.8" /></>
}

export function ContactConstellationField({ activeField, signalState, mobile }: { activeField: ContactField | null, signalState: SignalState, mobile: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => getBreakpoint(mobile))
  const [zones, setZones] = useState<ExclusionZone[]>([])
  const routes = useMemo(() => routesForBreakpoint(breakpoint), [breakpoint])
  const focusY = activeField === 'name' ? 226 : activeField === 'contact' ? 330 : activeField === 'message' ? 440 : 0

  useEffect(() => {
    const update = () => setBreakpoint(getBreakpoint(mobile))
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [mobile])

  useEffect(() => {
    const svg = svgRef.current
    const field = svg?.parentElement
    const root = field?.parentElement
    if (!svg || !field || !root) return

    const updateZones = () => setZones(getSafeZones(root, field))
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateZones)
    observer?.observe(root)
    updateZones()
    return () => observer?.disconnect()
  }, [breakpoint])

  useEffect(() => {
    const svg = svgRef.current
    const field = svg?.parentElement
    const root = field?.parentElement
    if (!svg || !field || !root) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointerQuery = window.matchMedia('(pointer: fine)')
    let reducedMotion = motionQuery.matches
    let finePointer = finePointerQuery.matches
    let visible = typeof IntersectionObserver !== 'undefined'
    let frame = 0
    let previousTime = performance.now()
    const fieldWidth = Math.max(1, field.getBoundingClientRect().width)
    const influenceRadius = Math.min(220, Math.max(150, fieldWidth * .145)) / fieldWidth * VIEWBOX_WIDTH
    const pointer = { x: 0, y: 0, active: false }
    const routePoints = new Map<RouteId, DynamicPoint[]>()
    const nodePoints = new Map<string, DynamicPoint>()

    routes.forEach((route) => {
      routePoints.set(route.id, route.points.map((point) => ({
        ...point,
        originX: point.x,
        originY: point.y,
        velocityX: 0,
        velocityY: 0,
      })))
      route.nodes.forEach((node) => nodePoints.set(node.id, {
        x: node.x,
        y: node.y,
        originX: node.x,
        originY: node.y,
        velocityX: 0,
        velocityY: 0,
      }))
    })

    const setDatasets = (maxDisplacement = 0) => {
      svg.dataset.motion = reducedMotion ? 'static' : 'physics'
      svg.dataset.pointerActive = String(pointer.active && !reducedMotion)
      svg.dataset.routeCount = String(routes.length)
      svg.dataset.nodeCount = String(nodePoints.size)
      svg.dataset.microCount = String(breakpoint === 'mobile' ? 4 : microElements.length)
      svg.dataset.safeZones = String(zones.length)
      svg.dataset.maxDisplacement = maxDisplacement.toFixed(1)
      svg.dataset.breakpoint = breakpoint
      svg.dataset.signalState = signalState
    }

    const applyPhysics = (point: DynamicPoint, delta: number, strength: number, maxDisplacement: number) => {
      let targetX = point.originX
      let targetY = point.originY
      if (pointer.active && !reducedMotion) {
        const dx = point.x - pointer.x
        const dy = point.y - pointer.y
        const distance = Math.max(1, Math.hypot(dx, dy))
        if (distance < influenceRadius) {
          const influence = 1 - distance / influenceRadius
          targetX += dx / distance * influence * influence * maxDisplacement * strength
          targetY += dy / distance * influence * influence * maxDisplacement * strength
          point.velocityX += dx / distance * influence * influence * .82 * strength * delta
          point.velocityY += dy / distance * influence * influence * .82 * strength * delta
        }
      }
      point.velocityX += (targetX - point.x) * .038 * delta
      point.velocityY += (targetY - point.y) * .038 * delta
      const damping = Math.pow(.84, delta)
      point.velocityX *= damping
      point.velocityY *= damping
      point.x += point.velocityX * delta
      point.y += point.velocityY * delta
      const displacement = Math.hypot(point.x - point.originX, point.y - point.originY)
      if (displacement > maxDisplacement) {
        const angle = Math.atan2(point.y - point.originY, point.x - point.originX)
        point.x = point.originX + Math.cos(angle) * maxDisplacement
        point.y = point.originY + Math.sin(angle) * maxDisplacement
      }
      return displacement
    }

    const render = (time: number, delta: number) => {
      let maxDisplacement = 0
      routes.forEach((route) => {
        const points = routePoints.get(route.id)!
        points.forEach((point, index) => {
          const isControl = index % 3 !== 0
          maxDisplacement = Math.max(maxDisplacement, applyPhysics(point, delta, route.id === 'c' ? 1 : route.id === 'a' ? .7 : .88, isControl ? 30 : 22))
        })
        const path = pathFromPoints(points)
        svg.querySelectorAll<SVGPathElement>(`[data-route="${route.id}"]`).forEach((element) => element.setAttribute('d', path))
      })
      nodePoints.forEach((point, id) => {
        const kind = routes.flatMap((route) => route.nodes).find((node) => node.id === id)?.kind
        maxDisplacement = Math.max(maxDisplacement, applyPhysics(point, delta, id.startsWith('c') ? 1 : .68, kind === 'outcome' || kind === 'ring' ? 38 : 24))
        svg.querySelector<SVGGElement>(`[data-node="${id}"]`)?.setAttribute('transform', `translate(${point.x} ${point.y})`)
      })
      setDatasets(maxDisplacement)
      previousTime = time
    }

    const tick = (time: number) => {
      const delta = Math.min(1.7, Math.max(.35, (time - previousTime) / 16.667))
      render(time, delta)
      frame = visible && !reducedMotion ? requestAnimationFrame(tick) : 0
    }

    const start = () => {
      if (!visible || reducedMotion || frame) return
      previousTime = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const movePointer = (event: PointerEvent) => {
      if (reducedMotion || !finePointer || breakpoint === 'mobile') return
      const bounds = field.getBoundingClientRect()
      pointer.x = (event.clientX - bounds.left) / bounds.width * VIEWBOX_WIDTH
      pointer.y = (event.clientY - bounds.top) / bounds.height * VIEWBOX_HEIGHT
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
      routePoints.forEach((points) => points.forEach((point) => {
        point.x = point.originX
        point.y = point.originY
        point.velocityX = 0
        point.velocityY = 0
      }))
      nodePoints.forEach((point) => {
        point.x = point.originX
        point.y = point.originY
        point.velocityX = 0
        point.velocityY = 0
      })
      render(performance.now(), 1)
      start()
    }

    const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible && frame) cancelAnimationFrame(frame)
      frame = 0
      start()
    }, { rootMargin: '100px' })

    root.addEventListener('pointermove', movePointer)
    root.addEventListener('pointerleave', leavePointer)
    motionQuery.addEventListener('change', updateMotion)
    finePointerQuery.addEventListener('change', updateMotion)
    intersectionObserver?.observe(root)
    setDatasets()
    render(performance.now(), 1)
    start()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', movePointer)
      root.removeEventListener('pointerleave', leavePointer)
      motionQuery.removeEventListener('change', updateMotion)
      finePointerQuery.removeEventListener('change', updateMotion)
      intersectionObserver?.disconnect()
    }
  }, [breakpoint, routes, signalState, zones])

  const maskId = `contact-signal-mask-${breakpoint}`
  const activeMicroElements = breakpoint === 'mobile' ? microElements.slice(6, 10) : microElements

  return <div className="contact-signal-field contact-editorial-ribbons" data-renderer="editorial-signal-ribbons" data-signal-state={signalState} data-entered="true" aria-hidden="true">
    <svg ref={svgRef} className="contact-signal-svg" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="none">
      <defs>
        <filter id="contact-signal-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5.5" />
        </filter>
        <filter id="contact-signal-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
        <radialGradient id="contact-glow-left"><stop offset="0" stopColor="#d7b66f" stopOpacity=".052" /><stop offset="1" stopColor="#d7b66f" stopOpacity="0" /></radialGradient>
        <radialGradient id="contact-glow-center"><stop offset="0" stopColor="#d7b66f" stopOpacity=".068" /><stop offset="1" stopColor="#d7b66f" stopOpacity="0" /></radialGradient>
        <radialGradient id="contact-glow-right"><stop offset="0" stopColor="#e8d9b8" stopOpacity=".09" /><stop offset="1" stopColor="#d7b66f" stopOpacity="0" /></radialGradient>
        <mask id={maskId}>
          <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="white" />
          {zones.map((zone, index) => <rect key={index} x={zone.x} y={zone.y} width={zone.width} height={zone.height} rx="9" fill="black" />)}
        </mask>
      </defs>

      <g className="signal-ambient-layer">
        <ellipse cx="74" cy="84" rx="210" ry="158" fill="url(#contact-glow-left)" />
        {breakpoint !== 'mobile' && <ellipse cx="510" cy="390" rx="260" ry="190" fill="url(#contact-glow-center)" />}
        <ellipse cx="785" cy="492" rx="280" ry="205" fill="url(#contact-glow-right)" />
      </g>

      <g className="signal-route-layer" mask={`url(#${maskId})`}>
        {routes.map((route) => {
          const path = pathFromPoints(route.points)
          return <g className={`signal-route signal-route-${route.id}`} key={route.id}>
            <path data-route={route.id} className="signal-route-glow" d={path} />
            <path data-route={route.id} className="signal-route-main" pathLength="1" d={path} />
            <path data-route={route.id} className="signal-route-accent" pathLength="1" d={path} />
          </g>
        })}
      </g>

      <g className="signal-micro-layer" mask={`url(#${maskId})`}>
        {activeMicroElements.map((item, index) => <g key={index} className={`signal-micro signal-micro-${item.type}`} transform={`translate(${item.x} ${item.y})`}>
          {item.type === 'diamond' ? <rect x="-2.3" y="-2.3" width="4.6" height="4.6" /> : item.type === 'dash' ? <line x1="-4" x2="4" /> : <circle r="1.35" />}
        </g>)}
      </g>

      <g className="signal-node-layer">
        {routes.flatMap((route) => route.nodes.map((node, index) => <g
          key={node.id}
          data-node={node.id}
          data-route-node={route.id}
          className={`signal-node signal-node-${node.kind}`}
          style={{ '--node-delay': `${130 + index * 85 + routes.indexOf(route) * 120}ms` } as React.CSSProperties}
          transform={`translate(${node.x} ${node.y})`}
        >{nodeShape(node.kind)}</g>))}
      </g>

      {breakpoint !== 'mobile' && <circle className="signal-traveller signal-traveller-idle" r="2.6">
        <animateMotion dur="9s" begin="1.25s" repeatCount="indefinite" path={pathFromPoints(desktopRoutes[1].points)} />
        <animate attributeName="opacity" values="0;0;.9;.9;0;0" keyTimes="0;.08;.12;.25;.31;1" dur="9s" begin="1.25s" repeatCount="indefinite" />
      </circle>}

      {activeField && <line className="signal-focus-sweep" x1="586" x2="925" y1={focusY} y2={focusY} />}
      {(signalState === 'submit-hover' || signalState === 'loading') && <circle className="signal-traveller signal-traveller-cta" r="3">
        <animateMotion dur={signalState === 'loading' ? '1.2s' : '1.8s'} repeatCount={signalState === 'loading' ? '2' : '1'} path={pathFromPoints(routes.find((route) => route.id === 'c')?.points ?? [])} />
      </circle>}
    </svg>
  </div>
}
