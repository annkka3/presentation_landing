import { useState } from 'react'
import { CAPABILITIES, UI_TEXT } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

export function DesignDirections({ locale }: { locale: DesignApprovedLocale }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = CAPABILITIES[activeIndex]
  const text = UI_TEXT[locale]

  const move = (index: number, key: string) => {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(key)) return
    const next = key === 'Home' ? 0
      : key === 'End' ? CAPABILITIES.length - 1
        : ['ArrowDown', 'ArrowRight'].includes(key)
          ? (index + 1) % CAPABILITIES.length
          : (index - 1 + CAPABILITIES.length) % CAPABILITIES.length
    setActiveIndex(next)
    document.getElementById(`design-direction-${next + 1}`)?.focus()
  }

  return (
    <section id="design-directions" className="design-approved-chapter design-approved-directions" data-chapter="2" aria-labelledby="design-directions-title">
      <div>
        <h2 id="design-directions-title">{text.capabilitiesHeading}</h2>
        <p className="design-approved-chapter-lede">{text.capabilitiesSub}</p>
        <div className="design-approved-directions__grid">
          <div className="design-approved-directions__list" role="group" aria-label={text.capabilitiesHeading}>
            {CAPABILITIES.map((capability, index) => (
              <button
                id={`design-direction-${index + 1}`}
                key={capability.num}
                type="button"
                className={index === activeIndex ? 'is-active' : ''}
                aria-pressed={index === activeIndex}
                aria-selected={index === activeIndex}
                aria-controls="design-direction-preview"
                onClick={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onPointerEnter={(event) => event.pointerType === 'mouse' && setActiveIndex(index)}
                onKeyDown={(event) => {
                  if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
                    event.preventDefault()
                    move(index, event.key)
                  }
                }}
              >
                <span>{capability.num}</span>
                <strong>{capability.title[locale]}</strong>
              </button>
            ))}
          </div>
          <div id="design-direction-preview" className="design-approved-directions__preview" aria-live="polite">
            <div className="design-approved-media-frame">
              <img key={active.sample} src={active.sample} alt={active.title[locale]} style={{ objectPosition: active.sampleObjectPosition }} loading="lazy" />
            </div>
            <p className="design-approved-outcome">{active.outcome[locale]}</p>
            <p>{active.desc[locale]}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
