import { useState } from 'react'
import { PRINCIPLES, PROCESS_STEPS, UI_TEXT } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

function nextIndex(current: number, key: string, length: number) {
  if (key === 'Home') return 0
  if (key === 'End') return length - 1
  if (key === 'ArrowDown' || key === 'ArrowRight') return (current + 1) % length
  if (key === 'ArrowUp' || key === 'ArrowLeft') return (current - 1 + length) % length
  return current
}

const navigationKeys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']

export function DesignPrinciplesProcess({ locale }: { locale: DesignApprovedLocale }) {
  const text = UI_TEXT[locale]
  const [principleIndex, setPrincipleIndex] = useState(0)
  const [processIndex, setProcessIndex] = useState(0)
  const activeProcess = PROCESS_STEPS[processIndex]

  const moveFocus = (kind: 'principle' | 'process', current: number, key: string, length: number) => {
    if (!navigationKeys.includes(key)) return
    const next = nextIndex(current, key, length)
    if (kind === 'principle') setPrincipleIndex(next)
    else setProcessIndex(next)
    document.getElementById(`design-${kind}-${next + 1}`)?.focus()
  }

  return (
    <section id="design-principles" className="design-approved-chapter design-approved-principles" data-chapter="11" aria-label={locale === 'ru' ? 'Принципы и процесс' : 'Principles and process'}>
      <div className="design-approved-principles__block">
        <h2>{text.principlesHeading}</h2>
        <div className="design-approved-principles__grid">
          <div id="design-principle-preview" className="design-approved-principles__active" aria-live="polite">
            <span>{String(principleIndex + 1).padStart(2, '0')}</span>
            <p>{PRINCIPLES[principleIndex][locale]}</p>
          </div>
          <div className="design-approved-principles__list" role="group" aria-label={text.principlesHeading}>
            {PRINCIPLES.map((principle, index) => (
              <button
                id={`design-principle-${index + 1}`}
                key={principle.en}
                type="button"
                className={index === principleIndex ? 'is-active' : ''}
                aria-pressed={index === principleIndex}
                aria-controls="design-principle-preview"
                onClick={() => setPrincipleIndex(index)}
                onFocus={() => setPrincipleIndex(index)}
                onPointerEnter={(event) => event.pointerType === 'mouse' && setPrincipleIndex(index)}
                onKeyDown={(event) => {
                  if (navigationKeys.includes(event.key)) {
                    event.preventDefault()
                    moveFocus('principle', index, event.key, PRINCIPLES.length)
                  }
                }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span><strong>{principle[locale]}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="design-approved-process">
        <h2>{text.processHeading}</h2>
        <div className="design-approved-process__grid">
          <div>
            <div className="design-approved-process__progress" aria-hidden="true"><i style={{ width: `${processIndex / 6 * 100}%` }} /></div>
            <div className="design-approved-process__list" role="group" aria-label={text.processHeading}>
              {PROCESS_STEPS.map((step, index) => (
                <button
                  id={`design-process-${index + 1}`}
                  key={step.num}
                  type="button"
                  className={index === processIndex ? 'is-active' : index < processIndex ? 'is-done' : ''}
                  aria-pressed={index === processIndex}
                  aria-controls="design-process-detail"
                  onClick={() => setProcessIndex(index)}
                  onFocus={() => setProcessIndex(index)}
                  onPointerEnter={(event) => event.pointerType === 'mouse' && setProcessIndex(index)}
                  onKeyDown={(event) => {
                    if (navigationKeys.includes(event.key)) {
                      event.preventDefault()
                      moveFocus('process', index, event.key, PROCESS_STEPS.length)
                    }
                  }}
                >
                  <span>{step.num}</span><strong>{step.title[locale]}</strong>
                </button>
              ))}
            </div>
          </div>
          <div id="design-process-detail" className="design-approved-process__detail" aria-live="polite">
            <span>{activeProcess.num}</span>
            <h3>{activeProcess.title[locale]}</h3>
            <p>{activeProcess.desc[locale]}</p>
            <div>{activeProcess.items[locale].map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
