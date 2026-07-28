import { useEffect, useRef } from 'react'

export type ContactField = 'name' | 'contact' | 'message'
export type SignalState = 'idle' | 'focus' | 'submit-hover' | 'loading' | 'success' | 'error' | 'config'

type NodeType = 'signal' | 'outline' | 'cross' | 'accent'
type NodeDepth = 0 | 1 | 2
type ClusterId = 'upper' | 'central' | 'outcome'

type ConstellationNode = {
  id: number
  cluster: ClusterId
  clusterIndex: number
  anchorX: number
  anchorY: number
  x: number
  y: number
  velocityX: number
  velocityY: number
  depth: NodeDepth
  phase: number
  speed: number
  size: number
  rotation: number
  type: NodeType
  maxDisplacement: number
}

type ConstellationEdge = {
  from: number
  to: number
  restLength: number
  depth: NodeDepth
  accent: boolean
}

type ExclusionZone = { x: number, y: number, width: number, height: number }
type Anchor = readonly [number, number]

const desktopAnchors: Record<ClusterId, readonly Anchor[]> = {
  upper: [
    [.59, .17], [.66, .11], [.72, .18], [.79, .13], [.86, .10], [.92, .17], [.69, .25], [.78, .28], [.87, .24], [.94, .29],
  ],
  central: [
    [.55, .40], [.62, .36], [.69, .43], [.76, .38], [.84, .42], [.92, .39], [.96, .48], [.59, .51], [.67, .56], [.75, .50], [.82, .57], [.90, .53], [.94, .61], [.79, .63],
  ],
  outcome: [
    [.51, .70], [.58, .67], [.65, .72], [.72, .68], [.79, .73], [.86, .69], [.93, .72], [.55, .79], [.62, .83], [.69, .77], [.76, .82], [.83, .78], [.90, .84], [.95, .80], [.53, .89], [.61, .93], [.68, .88], [.75, .95], [.82, .90], [.89, .94], [.95, .90], [.71, .99],
  ],
}

const tabletAnchors: Record<ClusterId, readonly Anchor[]> = {
  upper: [[.65, .14], [.75, .11], [.85, .18], [.94, .13], [.73, .26], [.88, .28]],
  central: [[.58, .40], [.68, .36], [.78, .43], [.89, .39], [.95, .49], [.64, .55], [.75, .52], [.86, .58], [.93, .63]],
  outcome: [[.54, .70], [.64, .67], [.73, .73], [.83, .69], [.93, .74], [.58, .82], [.68, .86], [.78, .80], [.88, .87], [.95, .84], [.64, .95], [.77, .93], [.90, .96]],
}

const mobileAnchors: Record<ClusterId, readonly Anchor[]> = {
  upper: [[.82, .31], [.92, .35], [.78, .42], [.95, .47]],
  central: [[.84, .53], [.94, .58], [.79, .65], [.91, .70], [.97, .74]],
  outcome: [[.49, .92], [.61, .96], [.72, .91], [.83, .96], [.94, .91], [.74, .99], [.96, .99]],
}

const hash = (value: number) => {
  const x = Math.sin(value * 91.173 + 17.71) * 43758.5453
  return x - Math.floor(x)
}

const sampleAnchors = (anchors: readonly Anchor[], count: number) => Array.from({ length: count }, (_, index) => {
  if (count === 1) return anchors[Math.floor(anchors.length / 2)]
  return anchors[Math.round(index * (anchors.length - 1) / (count - 1))]
})

function getConfiguration(viewportWidth: number) {
  if (viewportWidth <= 767) return { total: 14, counts: [3, 4, 7] as const, anchors: mobileAnchors, radius: 84, force: .72, clusters: 3 }
  if (viewportWidth <= 1199) return { total: 24, counts: [5, 8, 11] as const, anchors: tabletAnchors, radius: 105, force: .84, clusters: 3 }
  if (viewportWidth >= 1800) return { total: 40, counts: [8, 13, 19] as const, anchors: desktopAnchors, radius: 138, force: 1, clusters: 3 }
  if (viewportWidth >= 1600) return { total: 38, counts: [8, 12, 18] as const, anchors: desktopAnchors, radius: 132, force: .96, clusters: 3 }
  return { total: 34, counts: [7, 11, 16] as const, anchors: desktopAnchors, radius: 124, force: .92, clusters: 3 }
}

function createExclusionZones(width: number, height: number, mobile: boolean): ExclusionZone[] {
  if (mobile) return [
    { x: width * .02, y: height * .02, width: width * .76, height: height * .25 },
    { x: width * .02, y: height * .28, width: width * .73, height: height * .18 },
    { x: width * .02, y: height * .48, width: width * .73, height: height * .27 },
    { x: width * .02, y: height * .78, width: width * .91, height: height * .12 },
  ]
  return [
    { x: width * .04, y: height * .05, width: width * .53, height: height * .23 },
    { x: width * .04, y: height * .29, width: width * .49, height: height * .13 },
    { x: width * .04, y: height * .44, width: width * .49, height: height * .13 },
    { x: width * .04, y: height * .59, width: width * .49, height: height * .13 },
    { x: width * .04, y: height * .79, width: width * .42, height: height * .12 },
    { x: width * .96, y: 0, width: width * .04, height },
  ]
}

function pointInZone(x: number, y: number, zone: ExclusionZone, padding = 0) {
  return x >= zone.x - padding && x <= zone.x + zone.width + padding
    && y >= zone.y - padding && y <= zone.y + zone.height + padding
}

function edgeCrossesZones(a: ConstellationNode, b: ConstellationNode, zones: ExclusionZone[]) {
  return Array.from({ length: 9 }, (_, index) => (index + 1) / 10).some((step) => {
    const x = a.anchorX + (b.anchorX - a.anchorX) * step
    const y = a.anchorY + (b.anchorY - a.anchorY) * step
    return zones.some((zone) => pointInZone(x, y, zone, 4))
  })
}

function nodeVisibility(x: number, y: number, zones: ExclusionZone[]) {
  if (zones.some((zone) => pointInZone(x, y, zone))) return .08
  if (zones.some((zone) => pointInZone(x, y, zone, 18))) return .38
  return 1
}

function createConstellation(width: number, height: number, viewportWidth: number, mobile: boolean) {
  const config = getConfiguration(viewportWidth)
  const clusterIds: ClusterId[] = ['upper', 'central', 'outcome']
  const nodes: ConstellationNode[] = []
  let globalIndex = 0

  clusterIds.forEach((cluster, clusterOrder) => {
    const count = config.counts[clusterOrder]
    sampleAnchors(config.anchors[cluster], count).forEach(([normalizedX, normalizedY], clusterIndex) => {
      const jitterX = (hash(globalIndex + 11) - .5) * width * .012
      const jitterY = (hash(globalIndex + 29) - .5) * height * .012
      const anchorX = normalizedX * width + jitterX
      const anchorY = normalizedY * height + jitterY
      const layerSlot = (globalIndex * 7) % 20
      const depth: NodeDepth = layerSlot < 9 ? 0 : layerSlot < 17 ? 1 : 2
      const accentSlots = config.total <= 16
        ? [Math.floor(config.total * .79)]
        : config.total <= 28
          ? [Math.floor(config.total * .28), Math.floor(config.total * .8)]
          : [Math.floor(config.total * .2), Math.floor(config.total * .66), Math.floor(config.total * .84)]
      const isAccent = accentSlots.includes(globalIndex)
      const cycle: NodeType[] = ['signal', 'signal', 'outline', 'signal', 'cross', 'signal', 'outline', 'signal', 'outline', 'signal', 'cross', 'signal']
      const type: NodeType = isAccent ? 'accent' : cycle[globalIndex % cycle.length]
      const nodeDepth: NodeDepth = isAccent ? 2 : depth
      const size = type === 'signal' ? 1.05 + hash(globalIndex + 43) * .42
        : type === 'outline' ? 2.5 + hash(globalIndex + 47) * .65
          : type === 'cross' ? 2.7 + hash(globalIndex + 53) * .55
            : 3.7 + hash(globalIndex + 59) * .9
      nodes.push({
        id: globalIndex,
        cluster,
        clusterIndex,
        anchorX,
        anchorY,
        x: anchorX,
        y: anchorY,
        velocityX: 0,
        velocityY: 0,
        depth: nodeDepth,
        phase: hash(globalIndex + 67) * Math.PI * 2,
        speed: .66 + hash(globalIndex + 71) * .52,
        size,
        rotation: hash(globalIndex + 79) > .5 ? Math.PI * .25 : 0,
        type,
        maxDisplacement: nodeDepth === 0 ? 12 : nodeDepth === 1 ? 21 : 31,
      })
      globalIndex += 1
    })
  })

  const zones = createExclusionZones(width, height, mobile)
  const edges: ConstellationEdge[] = []
  const degrees = new Array(nodes.length).fill(0)
  const addEdge = (a: ConstellationNode, b: ConstellationNode, accent = false) => {
    if (degrees[a.id] >= 3 || degrees[b.id] >= 3 || edgeCrossesZones(a, b, zones)) return
    const restLength = Math.hypot(a.anchorX - b.anchorX, a.anchorY - b.anchorY)
    if (restLength > width * (mobile ? .25 : .29)) return
    edges.push({ from: a.id, to: b.id, restLength, depth: Math.min(a.depth, b.depth) as NodeDepth, accent })
    degrees[a.id] += 1
    degrees[b.id] += 1
  }

  clusterIds.forEach((cluster, clusterOrder) => {
    const clusterNodes = nodes.filter((node) => node.cluster === cluster)
    for (let index = 0; index < clusterNodes.length - 1; index += 1) {
      if ((index + clusterOrder) % 5 !== 3) addEdge(clusterNodes[index], clusterNodes[index + 1], cluster === 'outcome' && index % 6 === 2)
    }
    for (let index = 1; index < clusterNodes.length - 2; index += 4) {
      addEdge(clusterNodes[index], clusterNodes[index + 2], cluster === 'outcome')
    }
  })

  return { nodes, edges, zones, config }
}

function nodeTypeSummary(nodes: ConstellationNode[]) {
  const counts: Record<NodeType, number> = { signal: 0, outline: 0, cross: 0, accent: 0 }
  nodes.forEach((node) => { counts[node.type] += 1 })
  return `signal:${counts.signal},outline:${counts.outline},cross:${counts.cross},accent:${counts.accent}`
}

export function ContactConstellationField({ activeField, signalState, mobile }: { activeField: ContactField | null, signalState: SignalState, mobile: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ activeField, signalState })

  useEffect(() => {
    stateRef.current = { activeField, signalState }
    canvasRef.current?.dispatchEvent(new Event('constellationstatechange'))
  }, [activeField, signalState])

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const form = host?.closest('form')
    const context = canvas?.getContext?.('2d')
    if (!canvas || !host || !form || !context) return

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const finePointerQuery = window.matchMedia?.('(pointer: fine)')
    let reducedMotion = motionQuery?.matches ?? false
    let finePointer = finePointerQuery?.matches ?? true
    let width = 1
    let height = 1
    let pixelRatio = 1
    let nodes: ConstellationNode[] = []
    let edges: ConstellationEdge[] = []
    let zones: ExclusionZone[] = []
    let influenceRadius = 124
    let forceScale = 1
    let frame = 0
    let frameIndex = 0
    let previousTime = performance.now()
    let sectionVisible = true
    let pageVisible = document.visibilityState !== 'hidden'
    const pointer = { x: 0, y: 0, previousX: 0, previousY: 0, velocityX: 0, velocityY: 0, active: false }

    const setDatasets = () => {
      canvas.dataset.motion = reducedMotion ? 'static' : 'physics'
      canvas.dataset.pointerActive = String(pointer.active && !reducedMotion)
      canvas.dataset.nodeCount = String(nodes.length)
      canvas.dataset.particleCount = String(nodes.length)
      canvas.dataset.edgeCount = String(edges.length)
      canvas.dataset.clusterCount = mobile ? '3' : '3'
      canvas.dataset.nodeTypes = nodeTypeSummary(nodes)
    }

    const drawGuideLayer = () => {
      const gradient = context.createRadialGradient(width * .78, height * .79, 0, width * .78, height * .79, width * .34)
      gradient.addColorStop(0, 'rgba(185,149,82,.042)')
      gradient.addColorStop(.58, 'rgba(185,149,82,.012)')
      gradient.addColorStop(1, 'rgba(185,149,82,0)')
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)
      context.save()
      context.strokeStyle = 'rgba(185,149,82,.055)'
      context.lineWidth = .65
      context.beginPath()
      context.ellipse(width * .81, height * .83, width * .17, height * .18, -.16, Math.PI * .12, Math.PI * 1.55)
      context.stroke()
      context.restore()
    }

    const drawEdge = (edge: ConstellationEdge) => {
      const from = nodes[edge.from]
      const to = nodes[edge.to]
      const currentLength = Math.hypot(from.x - to.x, from.y - to.y)
      const stretch = currentLength / Math.max(1, edge.restLength)
      if (stretch > 1.48) return
      const midpointX = (from.x + to.x) * .5
      const midpointY = (from.y + to.y) * .5
      const pointerDistance = pointer.active ? Math.hypot(midpointX - pointer.x, midpointY - pointer.y) : Infinity
      const pressureFade = pointerDistance < influenceRadius ? .34 + .66 * pointerDistance / influenceRadius : 1
      const stretchFade = Math.max(0, 1 - Math.max(0, stretch - 1) * 2.1)
      const mask = Math.min(nodeVisibility(midpointX, midpointY, zones), nodeVisibility(from.x, from.y, zones), nodeVisibility(to.x, to.y, zones))
      const baseAlpha = edge.depth === 0 ? .085 : edge.depth === 1 ? .15 : .205
      const alpha = Math.min(edge.accent && stateRef.current.signalState === 'submit-hover' ? .27 : .24, baseAlpha * pressureFade * stretchFade * mask)
      if (alpha < .012) return
      context.save()
      context.strokeStyle = `rgba(185,149,82,${alpha})`
      context.lineWidth = edge.depth === 0 ? .5 : edge.depth === 1 ? .65 : .78
      context.beginPath()
      context.moveTo(from.x, from.y)
      context.lineTo(to.x, to.y)
      context.stroke()
      context.restore()
    }

    const drawNode = (node: ConstellationNode, time: number) => {
      const mask = nodeVisibility(node.x, node.y, zones)
      const baseAlpha = node.depth === 0 ? .26 : node.depth === 1 ? .5 : .75
      const accentBreath = node.type === 'accent' && !reducedMotion ? .06 * Math.sin(time * .00082 + node.phase) : 0
      const successBoost = stateRef.current.signalState === 'success' && node.cluster === 'outcome' ? .1 : 0
      const alpha = Math.min(.85, (baseAlpha + accentBreath + successBoost) * mask)
      const warm = node.type === 'accent' ? '208,173,104' : node.depth === 2 ? '235,222,191' : '185,149,82'
      context.save()
      context.translate(node.x, node.y)
      context.rotate(node.rotation)
      context.globalAlpha = alpha
      context.strokeStyle = `rgb(${warm})`
      context.fillStyle = `rgb(${warm})`
      context.lineWidth = node.depth === 0 ? .65 : .9
      if (node.type === 'accent') {
        context.shadowColor = 'rgba(185,149,82,.34)'
        context.shadowBlur = 7
      }
      if (node.type === 'signal') {
        context.beginPath()
        context.arc(0, 0, node.size, 0, Math.PI * 2)
        context.fill()
      } else if (node.type === 'outline') {
        context.strokeRect(-node.size, -node.size, node.size * 2, node.size * 2)
      } else if (node.type === 'cross') {
        context.beginPath()
        context.moveTo(-node.size, 0)
        context.lineTo(node.size, 0)
        context.moveTo(0, -node.size)
        context.lineTo(0, node.size)
        context.stroke()
      } else {
        context.beginPath()
        context.arc(0, 0, node.size, 0, Math.PI * 2)
        context.fill()
        context.shadowBlur = 0
        context.globalAlpha = Math.min(.9, alpha + .08)
        context.strokeStyle = 'rgb(235,222,191)'
        context.lineWidth = .65
        context.beginPath()
        context.arc(0, 0, node.size + 2.2, 0, Math.PI * 2)
        context.stroke()
      }
      context.restore()
    }

    const render = (time: number, delta = 1) => {
      context.clearRect(0, 0, width, height)
      drawGuideLayer()
      const state = stateRef.current
      const focusY = mobile
        ? state.activeField === 'contact' ? height * .44 : state.activeField === 'message' ? height * .73 : -1000
        : state.activeField === 'name' ? height * .40 : state.activeField === 'contact' ? height * .55 : state.activeField === 'message' ? height * .72 : -1000
      let maxDisplacement = 0

      nodes.forEach((node) => {
        if (!reducedMotion) {
          const driftAmplitude = node.depth === 0 ? .55 : node.depth === 1 ? .95 : 1.35
          let targetX = node.anchorX + Math.sin(time * .0002 * node.speed + node.phase) * driftAmplitude
          let targetY = node.anchorY + Math.cos(time * .00017 * node.speed + node.phase * .73) * driftAmplitude
          const inFocusBand = state.activeField !== null && Math.abs(node.anchorY - focusY) < height * .085
          if (inFocusBand) {
            targetY = focusY + (node.clusterIndex % 3 - 1) * 2.2
            targetX += (node.clusterIndex % 2 ? 1 : -1) * 1.2
          }
          if (state.signalState === 'submit-hover' && node.cluster === 'outcome' && node.clusterIndex < 5) {
            targetX += (width * .49 - node.anchorX) * .04
            targetY += (height * .84 - node.anchorY) * .04
          }
          if (state.signalState === 'loading' && node.cluster === 'outcome' && node.clusterIndex < 7) {
            targetX += (width * .47 - node.anchorX) * .11
            targetY += (height * .84 - node.anchorY) * .11
          }
          if (state.signalState === 'success' && node.cluster === 'outcome') {
            targetX += (node.anchorX - width * .74) * .055
            targetY += (node.anchorY - height * .82) * .055
          }
          const spring = inFocusBand ? .024 : .017
          node.velocityX += (targetX - node.x) * spring * delta
          node.velocityY += (targetY - node.y) * spring * delta

          if (pointer.active) {
            const dx = node.x - pointer.x
            const dy = node.y - pointer.y
            const distance = Math.max(1, Math.hypot(dx, dy))
            if (distance < influenceRadius) {
              const influence = 1 - distance / influenceRadius
              const depthForce = node.depth === 0 ? .58 : node.depth === 1 ? .86 : 1.12
              const force = influence * influence * 2.8 * depthForce * forceScale * delta
              node.velocityX += dx / distance * force + pointer.velocityX * influence * .022 * depthForce
              node.velocityY += dy / distance * force + pointer.velocityY * influence * .022 * depthForce
            }
          }

          const damping = Math.pow(inFocusBand ? .86 : .89, delta)
          node.velocityX *= damping
          node.velocityY *= damping
          const displacement = Math.hypot(node.x - node.anchorX, node.y - node.anchorY)
          const nextDisplacement = Math.hypot(node.x + node.velocityX * delta - node.anchorX, node.y + node.velocityY * delta - node.anchorY)
          if (nextDisplacement > node.maxDisplacement) {
            const angle = Math.atan2(node.y + node.velocityY * delta - node.anchorY, node.x + node.velocityX * delta - node.anchorX)
            node.x = node.anchorX + Math.cos(angle) * node.maxDisplacement
            node.y = node.anchorY + Math.sin(angle) * node.maxDisplacement
            node.velocityX *= .35
            node.velocityY *= .35
          } else {
            node.x += node.velocityX * delta
            node.y += node.velocityY * delta
          }
          maxDisplacement = Math.max(maxDisplacement, displacement)
        }
      })

      edges.forEach(drawEdge)
      nodes.forEach((node) => drawNode(node, time))
      if (frameIndex++ % 5 === 0) canvas.dataset.maxDisplacement = maxDisplacement.toFixed(1)
      pointer.velocityX *= .78
      pointer.velocityY *= .78
    }

    const tick = (time: number) => {
      const delta = Math.min(1.7, Math.max(.35, (time - previousTime) / 16.667))
      previousTime = time
      render(time, delta)
      frame = sectionVisible && pageVisible && !reducedMotion ? requestAnimationFrame(tick) : 0
    }

    const start = () => {
      if (!sectionVisible || !pageVisible || reducedMotion || frame) return
      previousTime = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const resize = () => {
      const bounds = host.getBoundingClientRect()
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      pixelRatio = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      const constellation = createConstellation(width, height, window.innerWidth, mobile)
      nodes = constellation.nodes
      edges = constellation.edges
      zones = constellation.zones
      influenceRadius = constellation.config.radius
      forceScale = constellation.config.force
      setDatasets()
      render(performance.now())
      start()
    }

    const movePointer = (event: PointerEvent) => {
      if (reducedMotion || (!finePointer && mobile)) return
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
      setDatasets()
      start()
    }

    const leavePointer = () => {
      pointer.active = false
      setDatasets()
      start()
    }

    const updateMotionPreference = () => {
      reducedMotion = motionQuery?.matches ?? false
      finePointer = finePointerQuery?.matches ?? true
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      pointer.active = false
      nodes.forEach((node) => {
        node.x = node.anchorX
        node.y = node.anchorY
        node.velocityX = 0
        node.velocityY = 0
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

    const renderStateChange = () => {
      if (reducedMotion) render(performance.now())
    }

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      sectionVisible = entry.isIntersecting
      if (!sectionVisible && frame) cancelAnimationFrame(frame)
      frame = 0
      start()
    }, { rootMargin: '120px' })

    form.addEventListener('pointermove', movePointer)
    form.addEventListener('pointerleave', leavePointer)
    canvas.addEventListener('constellationstatechange', renderStateChange)
    document.addEventListener('visibilitychange', updateVisibility)
    motionQuery?.addEventListener?.('change', updateMotionPreference)
    finePointerQuery?.addEventListener?.('change', updateMotionPreference)
    resizeObserver?.observe(host)
    intersectionObserver?.observe(host)
    setDatasets()
    resize()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      form.removeEventListener('pointermove', movePointer)
      form.removeEventListener('pointerleave', leavePointer)
      canvas.removeEventListener('constellationstatechange', renderStateChange)
      document.removeEventListener('visibilitychange', updateVisibility)
      motionQuery?.removeEventListener?.('change', updateMotionPreference)
      finePointerQuery?.removeEventListener?.('change', updateMotionPreference)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
    }
  }, [mobile])

  return <div className="contact-signal-field contact-constellation-field" data-renderer="constellation-canvas" aria-hidden="true">
    <canvas className="contact-signal-canvas" ref={canvasRef} />
  </div>
}
