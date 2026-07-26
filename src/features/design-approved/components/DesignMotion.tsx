import { useEffect, useRef, useState } from 'react'
import { DESIGN_APPROVED_ASSETS as A } from '../designApprovedAssets'
import { MOTION_DATA, UI_TEXT } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

export function DesignMotion({ locale }: { locale: DesignApprovedLocale }) {
  const text = UI_TEXT[locale]
  const videoRef = useRef<HTMLVideoElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)

  const pause = () => {
    videoRef.current?.pause()
    setPlaying(false)
  }

  const play = async () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !videoRef.current) return
    try {
      await videoRef.current.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  useEffect(() => {
    const element = posterRef.current
    const scrollRoot = document.querySelector('.design-approved-page')
    if (!element) return
    const loadObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVideoEnabled(true)
    }, { root: scrollRoot, rootMargin: '100% 0px', threshold: .05 })
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        pause()
        setVideoEnabled(false)
      }
    }, { root: scrollRoot, threshold: .05 })
    const pauseWhenOutsideRoot = () => {
      const elementRect = element.getBoundingClientRect()
      const rootRect = scrollRoot?.getBoundingClientRect() ?? { top: 0, bottom: window.innerHeight }
      if (elementRect.bottom <= rootRect.top || elementRect.top >= rootRect.bottom) pause()
    }
    loadObserver.observe(element)
    visibilityObserver.observe(element)
    scrollRoot?.addEventListener('scroll', pauseWhenOutsideRoot, { passive: true })
    return () => {
      loadObserver.disconnect()
      visibilityObserver.disconnect()
      scrollRoot?.removeEventListener('scroll', pauseWhenOutsideRoot)
    }
  }, [])

  return (
    <section id="design-motion" className="design-approved-chapter design-approved-motion" data-chapter="8" aria-labelledby="design-motion-title">
      <span className="design-approved-motion__thesis">{text.motionThesis}</span>
      <h2 id="design-motion-title">{text.motionHeading}</h2>
      <p className="design-approved-chapter-lede">{text.motionSub}</p>
      <div className="design-approved-motion__grid">
        <div className="design-approved-motion-emotion">
          <span className="design-approved-motion__label">{text.motionEmotionLabel}</span>
          <div
            ref={posterRef}
            className={`design-approved-motion-poster${playing ? ' is-playing' : ''}`}
            onPointerEnter={(event) => event.pointerType === 'mouse' && void play()}
            onPointerLeave={pause}
          >
            <img src={A.motionEmotionHero} alt={text.motionEmotionTitle} loading="lazy" width="800" height="1000" />
            {videoEnabled && (
              <video
                ref={videoRef}
                src={A.motionEmotionVideo}
                muted
                loop
                playsInline
                preload="metadata"
                poster={A.motionEmotionHero}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            )}
            <span className="design-approved-motion-poster__scenarios">{text.motionScenariosLabel}</span>
            <span className="design-approved-motion-poster__formats">9:16 · 1:1 · 4:5</span>
            <button
              type="button"
              className="design-approved-motion-poster__play"
              aria-label={playing ? (locale === 'ru' ? 'Поставить видео на паузу' : 'Pause video') : (locale === 'ru' ? 'Воспроизвести видео' : 'Play video')}
              aria-pressed={playing}
              onClick={() => playing ? pause() : void play()}
            >
              {playing ? 'Ⅱ' : '▶'}
            </button>
          </div>
          <div className="design-approved-motion-filmstrip">
            {MOTION_DATA.filmstrip.map((frame, index) => (
              <div key={frame.src}>
                <div className={index === 0 ? 'is-active' : ''}><img src={frame.src} alt={`${text.motionEmotionTitle}: ${frame.label[locale]}`} style={{ objectPosition: frame.pos }} loading="lazy" width="240" height="240" /></div>
                <span>{frame.label[locale]}</span>
              </div>
            ))}
          </div>
          <h3>{text.motionEmotionTitle}</h3>
          <p>{text.motionEmotionText}</p>
        </div>

        <div className="design-approved-motion__right">
          <div className="design-approved-motion-control">
            <span className="design-approved-motion__label">{text.motionControlLabel}</span>
            <div className="design-approved-motion-control__grid">
              <div className="design-approved-motion-control__main"><img src={A.motionControl01} alt={text.motionControlTitle} loading="lazy" width="800" height="1000" /></div>
              <div>
                <h3>{text.motionControlTitle}</h3>
                <p>{text.motionControlText}</p>
                <div className="design-approved-motion-control__angles">
                  {MOTION_DATA.angles.map((angle, index) => <img key={angle.src} src={angle.src} alt={`${text.motionControlTitle} — ${locale === 'ru' ? 'ракурс' : 'angle'} ${index + 1}`} style={{ objectPosition: angle.pos }} loading="lazy" width="300" height="300" />)}
                </div>
                <div className="design-approved-motion-control__tokens">
                  {MOTION_DATA.tokens[locale].map((token) => <span key={token}>{token}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="design-approved-motion-scale">
            <span className="design-approved-motion__label">{text.motionScaleLabel}</span>
            <div className="design-approved-storyboard">
              <div className="design-approved-storyboard__grid">
                {MOTION_DATA.storyboard.map((cell, index) => (
                  <div key={cell.src} style={{ gridColumn: cell.col, gridRow: cell.row }}>
                    <img src={cell.src} alt={`${MOTION_DATA.scenarios[index]?.label[locale] ?? text.motionScaleTitle} — ${cell.ratio}`} style={{ objectPosition: cell.pos }} loading="lazy" width="400" height="500" />
                    <span>{cell.num} {MOTION_DATA.scenarios[index]?.label[locale]}</span><small>{cell.ratio}</small>
                  </div>
                ))}
                <div className="design-approved-storyboard__detail">
                  <img src={MOTION_DATA.detail.src} alt={`${MOTION_DATA.scenarios[4].label[locale]} — 4:5`} style={{ objectPosition: MOTION_DATA.detail.pos }} loading="lazy" width="400" height="500" />
                  <span>{MOTION_DATA.detail.num} {MOTION_DATA.scenarios[4].label[locale]}</span><small>{text.motionCtaLabel}</small>
                </div>
              </div>
              <p>{text.motionOutputLine}</p>
              <div className="design-approved-storyboard__pipeline">{MOTION_DATA.pipeline[locale].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div>
            </div>
            <h3>{text.motionScaleTitle}</h3>
            <p>{text.motionScaleText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
