import { useEffect, useRef } from 'react'

export type ContactField = 'name' | 'contact' | 'message'
export type SignalState = 'idle' | 'focus' | 'submit-hover' | 'loading' | 'success' | 'error' | 'config'

type Side = 'left' | 'right'
type ClusterId = 'left-atmosphere' | 'left-links' | 'right-crown' | 'right-orbit' | 'right-cta'
type ElementType = 'anchor' | 'dot' | 'diamond' | 'dash' | 'ring'
type Depth = 0 | 1 | 2

type EditorialNode = {
  id: number
  side: Side
  cluster: ClusterId
  anchorX: number
  anchorY: number
  x: number
  y: number
  velocityX: number
  velocityY: number
  phase: number
  speed: number
  size: number
  rotation: number
  depth: Depth
  type: ElementType
  maxDisplacement: number
}

type EditorialEdge = {
  from: number
  to: number
  depth: Depth
  curve: number
}

type ExclusionZone = { x: number, y: number, width: number, height: number }
type ClusterRecipe = {
  id: ClusterId
  side: Side
  centerX: number
  centerY: number
  radiusX: number
  radiusY: number
  count: number
}

const hash = (value: number) => {
  const result = Math.sin(value * 93.731 + 18.417) * 43758.5453
  return result - Math.floor(result)
}

function getRecipes(viewportWidth: number, mobile: boolean): ClusterRecipe[] {
  if (mobile || viewportWidth <= 767) return [
    { id: 'left-atmosphere', side: 'left', centerX: .13, centerY: .19, radiusX: .1, radiusY: .12, count: 3 },
    { id: 'right-orbit', side: 'right', centerX: .88, centerY: .63, radiusX: .12, radiusY: .2, count: 7 },
    { id: 'right-cta', side: 'right', centerX: .72, centerY: .91, radiusX: .22, radiusY: .07, count: 6 },
  ]
  if (viewportWidth <= 1199) return [
    { id: 'left-atmosphere', side: 'left', centerX: .13, centerY: .22, radiusX: .11, radiusY: .16, count: 5 },
    { id: 'left-links', side: 'left', centerX: .32, centerY: .72, radiusX: .14, radiusY: .2, count: 5 },
    { id: 'right-crown', side: 'right', centerX: .73, centerY: .14, radiusX: .2, radiusY: .1, count: 5 },
    { id: 'right-orbit', side: 'right', centerX: .9, centerY: .49, radiusX: .1, radiusY: .28, count: 7 },
    { id: 'right-cta', side: 'right', centerX: .7, centerY: .85, radiusX: .24, radiusY: .1, count: 6 },
  ]
  return [
    { id: 'left-atmosphere', side: 'left', centerX: .12, centerY: .2, radiusX: .11, radiusY: .16, count: 7 },
    { id: 'left-links', side: 'left', centerX: .33, centerY: .69, radiusX: .15, radiusY: .23, count: 8 },
    { id: 'right-crown', side: 'right', centerX: .72, centerY: .13, radiusX: .24, radiusY: .11, count: 8 },
    { id: 'right-orbit', side: 'right', centerX: .91, centerY: .47, radiusX: .1, radiusY: .29, count: 10 },
    { id: 'right-cta', side: 'right', centerX: .7, centerY: .84, radiusX: .26, radiusY: .11, count: 9 },
  ]
}

function createExclusionZones(root: HTMLElement, coordinateElement: HTMLElement) {
  const hostBounds = coordinateElement.getBoundingClientRect()
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
    const padding = element.matches('h2, .submit-button') ? 18 : 11
    return {
      x: bounds.left - hostBounds.left - padding,
      y: bounds.top - hostBounds.top - padding,
      width: bounds.width + padding * 2,
      height: bounds.height + padding * 2,
    }
  })
}

function isInsideZone(x: number, y: number, zone: ExclusionZone, padding = 0) {
  return x >= zone.x - padding && x <= zone.x + zone.width + padding
    && y >= zone.y - padding && y <= zone.y + zone.height + padding
}

function visibilityAt(x: number, y: number, zones: ExclusionZone[]) {
  if (zones.some((zone) => isInsideZone(x, y, zone))) return .035
  if (zones.some((zone) => isInsideZone(x, y, zone, 12))) return .22
  if (zones.some((zone) => isInsideZone(x, y, zone, 28))) return .58
  return 1
}

function edgeCrossesZone(from: EditorialNode, to: EditorialNode, zones: ExclusionZone[]) {
  return Array.from({ length: 11 }, (_, index) => (index + 1) / 12).some((step) => {
    const x = from.anchorX + (to.anchorX - from.anchorX) * step
    const y = from.anchorY + (to.anchorY - from.anchorY) * step
    return zones.some((zone) => isInsideZone(x, y, zone, 5))
  })
}

function createComposition(width: number, height: number, viewportWidth: number, mobile: boolean, zones: ExclusionZone[]) {
  const recipes = getRecipes(viewportWidth, mobile)
  const nodes: EditorialNode[] = []
  const typeCycle: ElementType[] = ['dot', 'diamond', 'dot', 'dash', 'ring', 'dot', 'anchor', 'dot', 'diamond', 'dash']
  let globalIndex = 0

  recipes.forEach((recipe, recipeIndex) => {
    for (let index = 0; index < recipe.count; index += 1) {
      const progress = recipe.count === 1 ? 0 : index / (recipe.count - 1)
      const angle = progress * Math.PI * (1.45 + recipeIndex * .09) + recipeIndex * .72
      const radiusScale = .5 + progress * .5
      const anchorX = (recipe.centerX + Math.cos(angle) * recipe.radiusX * radiusScale + (hash(globalIndex + 8) - .5) * .018) * width
      const anchorY = (recipe.centerY + Math.sin(angle) * recipe.radiusY * radiusScale + (hash(globalIndex + 17) - .5) * .025) * height
      const anchorSlots = mobile ? [8, 13] : [3, 12, 19, 29, 37]
      const isAnchor = anchorSlots.includes(globalIndex)
      const type = isAnchor ? 'anchor' : typeCycle[(globalIndex + recipeIndex) % typeCycle.length]
      const depth: Depth = isAnchor ? 2 : globalIndex % 5 < 2 ? 0 : globalIndex % 5 < 4 ? 1 : 2
      const baseSize = type === 'anchor' ? 3.4 : type === 'dot' ? .85 : type === 'dash' ? 3.2 : 2.2
      nodes.push({
        id: globalIndex,
        side: recipe.side,
        cluster: recipe.id,
        anchorX,
        anchorY,
        x: anchorX,
        y: anchorY,
        velocityX: 0,
        velocityY: 0,
        phase: hash(globalIndex + 31) * Math.PI * 2,
        speed: .65 + hash(globalIndex + 41) * .55,
        size: baseSize + hash(globalIndex + 53) * (type === 'anchor' ? 1.2 : .7),
        rotation: hash(globalIndex + 67) * Math.PI,
        depth,
        type,
        maxDisplacement: recipe.side === 'right' ? 21 + depth * 6 : 12 + depth * 4,
      })
      globalIndex += 1
    }
  })

  const edges: EditorialEdge[] = []
  recipes.forEach((recipe, recipeIndex) => {
    const clusterNodes = nodes.filter((node) => node.cluster === recipe.id)
    for (let index = 0; index < clusterNodes.length - 1; index += 1) {
      if ((index + recipeIndex) % 4 === 2) continue
      const from = clusterNodes[index]
      const to = clusterNodes[index + 1]
      if (!edgeCrossesZone(from, to, zones)) {
        edges.push({ from: from.id, to: to.id, depth: Math.min(from.depth, to.depth) as Depth, curve: (index % 2 ? 1 : -1) * (4 + recipeIndex * 1.5) })
      }
    }
    if (clusterNodes.length > 6) {
      const from = clusterNodes[1]
      const to = clusterNodes[clusterNodes.length - 2]
      if (!edgeCrossesZone(from, to, zones)) edges.push({ from: from.id, to: to.id, depth: 0, curve: recipe.side === 'right' ? 16 : -10 })
    }
  })

  return { nodes, edges, recipes }
}

function summarizeTypes(nodes: EditorialNode[]) {
  const counts: Record<ElementType, number> = { anchor: 0, dot: 0, diamond: 0, dash: 0, ring: 0 }
  nodes.forEach((node) => { counts[node.type] += 1 })
  return Object.entries(counts).map(([type, count]) => `${type}:${count}`).join(',')
}

export function ContactConstellationField({ activeField, signalState, mobile }: { activeField: ContactField | null, signalState: SignalState, mobile: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ activeField, signalState })

  useEffect(() => {
    stateRef.current = { activeField, signalState }
    canvasRef.current?.dispatchEvent(new Event('editorialfieldstatechange'))
  }, [activeField, signalState])

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const interactionRoot = host?.parentElement
    const context = canvas?.getContext?.('2d')
    if (!canvas || !host || !interactionRoot || !context) return

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const finePointerQuery = window.matchMedia?.('(pointer: fine)')
    let reducedMotion = motionQuery?.matches ?? false
    let finePointer = finePointerQuery?.matches ?? true
    let width = 1
    let height = 1
    let pixelRatio = 1
    let nodes: EditorialNode[] = []
    let edges: EditorialEdge[] = []
    let zones: ExclusionZone[] = []
    let frame = 0
    let frameIndex = 0
    let previousTime = performance.now()
    let sectionVisible = true
    let pageVisible = document.visibilityState !== 'hidden'
    const pointer = { x: 0, y: 0, previousX: 0, previousY: 0, velocityX: 0, velocityY: 0, active: false }

    const setDatasets = () => {
      const leftCount = nodes.filter((node) => node.side === 'left').length
      const rightCount = nodes.length - leftCount
      canvas.dataset.motion = reducedMotion ? 'static' : 'physics'
      canvas.dataset.pointerActive = String(pointer.active && !reducedMotion)
      canvas.dataset.nodeCount = String(nodes.length)
      canvas.dataset.particleCount = String(nodes.length)
      canvas.dataset.edgeCount = String(edges.length)
      canvas.dataset.clusterCount = String(new Set(nodes.map((node) => node.cluster)).size)
      canvas.dataset.nodeTypes = summarizeTypes(nodes)
      canvas.dataset.balance = `${leftCount}:${rightCount}`
      canvas.dataset.safeZones = String(zones.length)
    }

    const drawAmbientLayer = (time: number) => {
      const parallaxX = pointer.active ? (pointer.x / width - .5) * 5 : 0
      const parallaxY = pointer.active ? (pointer.y / height - .5) * 4 : 0
      const breath = reducedMotion ? 1 : .94 + Math.sin(time * .00022) * .06
      const glows = [
        { x: width * .12, y: height * .27, radius: width * .17, alpha: .046 },
        { x: width * .82, y: height * .44, radius: width * .28, alpha: .078 },
        { x: width * .69, y: height * .85, radius: width * .2, alpha: stateRef.current.signalState === 'submit-hover' ? .11 : .066 },
      ]
      glows.forEach((glow, index) => {
        const gradient = context.createRadialGradient(glow.x + parallaxX * (index + 1), glow.y + parallaxY, 0, glow.x, glow.y, glow.radius)
        gradient.addColorStop(0, `rgba(211,174,105,${glow.alpha * breath})`)
        gradient.addColorStop(.46, `rgba(185,149,82,${glow.alpha * .42})`)
        gradient.addColorStop(1, 'rgba(185,149,82,0)')
        context.fillStyle = gradient
        context.fillRect(0, 0, width, height)
      })

      const arcs = mobile
        ? [
            [.85, .66, .19, .23, -.24, .2, 1.42],
            [.72, .93, .26, .1, .08, 1.05, 1.91],
          ]
        : [
            [.12, .23, .13, .18, -.22, .12, 1.2],
            [.34, .71, .18, .25, .35, .64, 1.38],
            [.75, .14, .27, .13, -.08, .08, 1.16],
            [.91, .5, .13, .34, .18, .34, 1.52],
            [.69, .86, .3, .14, -.12, .86, 1.68],
          ]
      context.save()
      context.lineWidth = .6
      arcs.forEach((arc, index) => {
        const [x, y, radiusX, radiusY, rotation, start, length] = arc
        const sideStrength = index < 2 ? .42 : 1
        context.strokeStyle = `rgba(211,174,105,${(.072 + index * .011) * sideStrength})`
        context.beginPath()
        context.ellipse(
          width * x + parallaxX * (index % 2 ? -.55 : .7),
          height * y + parallaxY * (index % 2 ? .45 : -.6),
          width * radiusX,
          height * radiusY,
          rotation,
          Math.PI * start,
          Math.PI * (start + length),
        )
        context.stroke()
      })
      context.restore()
    }

    const drawEdge = (edge: EditorialEdge) => {
      const from = nodes[edge.from]
      const to = nodes[edge.to]
      const midpointX = (from.x + to.x) * .5
      const midpointY = (from.y + to.y) * .5
      const distanceToPointer = pointer.active ? Math.hypot(midpointX - pointer.x, midpointY - pointer.y) : Infinity
      const radius = from.side === 'right' ? 188 : 132
      const pressure = Math.max(0, 1 - distanceToPointer / radius)
      const dx = to.x - from.x
      const dy = to.y - from.y
      const length = Math.max(1, Math.hypot(dx, dy))
      const bend = edge.curve + pressure * (from.side === 'right' ? 13 : 7)
      const controlX = midpointX - dy / length * bend
      const controlY = midpointY + dx / length * bend
      const mask = Math.min(visibilityAt(from.x, from.y, zones), visibilityAt(to.x, to.y, zones), visibilityAt(midpointX, midpointY, zones))
      const alpha = (edge.depth === 0 ? .075 : edge.depth === 1 ? .13 : .19) * mask * (1 + pressure * .2)
      if (alpha < .01) return
      context.save()
      context.strokeStyle = `rgba(203,164,94,${Math.min(.22, alpha)})`
      context.lineWidth = edge.depth === 0 ? .45 : edge.depth === 1 ? .6 : .72
      context.beginPath()
      context.moveTo(from.x, from.y)
      context.quadraticCurveTo(controlX, controlY, to.x, to.y)
      context.stroke()
      context.restore()
    }

    const drawNode = (node: EditorialNode, time: number) => {
      const mask = visibilityAt(node.x, node.y, zones)
      const distanceToPointer = pointer.active ? Math.hypot(node.x - pointer.x, node.y - pointer.y) : Infinity
      const interactionRadius = node.side === 'right' ? 190 : 132
      const proximity = Math.max(0, 1 - distanceToPointer / interactionRadius)
      const baseAlpha = node.depth === 0 ? .4 : node.depth === 1 ? .64 : .86
      const breath = !reducedMotion && node.type === 'anchor' ? Math.sin(time * .00072 + node.phase) * .07 : 0
      const stateBoost = stateRef.current.signalState === 'success' && node.cluster === 'right-cta' ? .12 : 0
      const alpha = Math.min(.94, (baseAlpha + breath + proximity * .14 + stateBoost) * mask)
      if (alpha < .012) return
      const warm = node.type === 'anchor' ? '232,215,177' : node.depth === 2 ? '218,184,119' : '190,151,83'

      context.save()
      context.translate(node.x, node.y)
      context.rotate(node.rotation)
      context.globalAlpha = alpha
      context.strokeStyle = `rgb(${warm})`
      context.fillStyle = `rgb(${warm})`
      context.lineWidth = node.depth === 0 ? .55 : .82
      if (node.type === 'anchor') {
        context.shadowColor = `rgba(211,174,105,${.32 + proximity * .22})`
        context.shadowBlur = 9 + proximity * 7
        context.beginPath()
        context.arc(0, 0, node.size, 0, Math.PI * 2)
        context.fill()
        context.shadowBlur = 0
        context.globalAlpha = alpha * .68
        context.beginPath()
        context.arc(0, 0, node.size + 3.2, 0, Math.PI * 2)
        context.stroke()
      } else if (node.type === 'dot') {
        context.beginPath()
        context.arc(0, 0, node.size, 0, Math.PI * 2)
        context.fill()
      } else if (node.type === 'diamond') {
        context.beginPath()
        context.rect(-node.size, -node.size, node.size * 2, node.size * 2)
        if (node.depth === 2) {
          context.globalAlpha = alpha * .28
          context.fill()
          context.globalAlpha = alpha
        }
        context.stroke()
      } else if (node.type === 'dash') {
        context.beginPath()
        context.moveTo(-node.size * 1.7, 0)
        context.lineTo(node.size * 1.7, 0)
        context.stroke()
      } else {
        context.beginPath()
        context.arc(0, 0, node.size, 0, Math.PI * 2)
        context.stroke()
        context.globalAlpha = alpha * .5
        context.beginPath()
        context.arc(0, 0, .65, 0, Math.PI * 2)
        context.fill()
      }
      context.restore()
    }

    const render = (time: number, delta = 1) => {
      context.clearRect(0, 0, width, height)
      drawAmbientLayer(time)
      const state = stateRef.current
      const form = interactionRoot.querySelector<HTMLElement>('.contact-form')
      const hostBounds = host.getBoundingClientRect()
      const formBounds = form?.getBoundingClientRect()
      const focusY = formBounds
        ? formBounds.top - hostBounds.top + (
            state.activeField === 'name' ? formBounds.height * .34
              : state.activeField === 'contact' ? formBounds.height * .5
                : state.activeField === 'message' ? formBounds.height * .68 : -1000
          )
        : -1000
      let maxDisplacement = 0

      nodes.forEach((node) => {
        if (!reducedMotion) {
          const depthMotion = node.depth === 0 ? .48 : node.depth === 1 ? .82 : 1.16
          let targetX = node.anchorX + Math.sin(time * .00018 * node.speed + node.phase) * depthMotion
          let targetY = node.anchorY + Math.cos(time * .00015 * node.speed + node.phase * .74) * depthMotion
          const focusAffected = node.side === 'right' && state.activeField !== null && Math.abs(node.anchorY - focusY) < height * .13
          if (focusAffected) {
            targetX += node.cluster === 'right-orbit' ? -2.6 : 1.4
            targetY += (node.id % 3 - 1) * 1.5
          }
          if ((state.signalState === 'submit-hover' || state.signalState === 'loading') && node.cluster === 'right-cta') {
            targetX += (width * .68 - node.anchorX) * (state.signalState === 'loading' ? .09 : .035)
            targetY += (height * .85 - node.anchorY) * (state.signalState === 'loading' ? .09 : .035)
          }
          const spring = focusAffected ? .022 : .0155
          node.velocityX += (targetX - node.x) * spring * delta
          node.velocityY += (targetY - node.y) * spring * delta

          if (pointer.active) {
            const dx = node.x - pointer.x
            const dy = node.y - pointer.y
            const distance = Math.max(1, Math.hypot(dx, dy))
            const radius = node.side === 'right' ? 190 : 132
            if (distance < radius) {
              const influence = 1 - distance / radius
              const sideForce = node.side === 'right' ? 1.32 : .64
              const depthForce = node.depth === 0 ? .62 : node.depth === 1 ? .88 : 1.12
              const force = influence * influence * 3.1 * sideForce * depthForce * delta
              node.velocityX += dx / distance * force + pointer.velocityX * influence * .018 * depthForce
              node.velocityY += dy / distance * force + pointer.velocityY * influence * .018 * depthForce
            }
          }

          const damping = Math.pow(.89, delta)
          node.velocityX *= damping
          node.velocityY *= damping
          const nextX = node.x + node.velocityX * delta
          const nextY = node.y + node.velocityY * delta
          const nextDisplacement = Math.hypot(nextX - node.anchorX, nextY - node.anchorY)
          if (nextDisplacement > node.maxDisplacement) {
            const angle = Math.atan2(nextY - node.anchorY, nextX - node.anchorX)
            node.x = node.anchorX + Math.cos(angle) * node.maxDisplacement
            node.y = node.anchorY + Math.sin(angle) * node.maxDisplacement
            node.velocityX *= .32
            node.velocityY *= .32
          } else {
            node.x = nextX
            node.y = nextY
          }
          maxDisplacement = Math.max(maxDisplacement, Math.hypot(node.x - node.anchorX, node.y - node.anchorY))
        }
      })

      edges.forEach(drawEdge)
      nodes.forEach((node) => drawNode(node, time))
      if (frameIndex++ % 5 === 0) canvas.dataset.maxDisplacement = maxDisplacement.toFixed(1)
      pointer.velocityX *= .76
      pointer.velocityY *= .76
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
      zones = createExclusionZones(interactionRoot, host)
      const composition = createComposition(width, height, window.innerWidth, mobile, zones)
      nodes = composition.nodes
      edges = composition.edges
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

    interactionRoot.addEventListener('pointermove', movePointer)
    interactionRoot.addEventListener('pointerleave', leavePointer)
    canvas.addEventListener('editorialfieldstatechange', renderStateChange)
    document.addEventListener('visibilitychange', updateVisibility)
    motionQuery?.addEventListener?.('change', updateMotionPreference)
    finePointerQuery?.addEventListener?.('change', updateMotionPreference)
    resizeObserver?.observe(host)
    intersectionObserver?.observe(host)
    resize()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      interactionRoot.removeEventListener('pointermove', movePointer)
      interactionRoot.removeEventListener('pointerleave', leavePointer)
      canvas.removeEventListener('editorialfieldstatechange', renderStateChange)
      document.removeEventListener('visibilitychange', updateVisibility)
      motionQuery?.removeEventListener?.('change', updateMotionPreference)
      finePointerQuery?.removeEventListener?.('change', updateMotionPreference)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
    }
  }, [mobile])

  return <div className="contact-signal-field contact-editorial-field" data-renderer="editorial-bilateral-canvas" aria-hidden="true">
    <canvas className="contact-signal-canvas" ref={canvasRef} />
  </div>
}
