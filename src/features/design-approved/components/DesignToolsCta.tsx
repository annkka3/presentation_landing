import { Link } from 'react-router-dom'
import { OUTPUTS, TOOL_GROUPS, UI_TEXT } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

export function DesignToolsCta({ locale }: { locale: DesignApprovedLocale }) {
  const text = UI_TEXT[locale]
  const focusDestination = (id: string) => {
    let attempts = 0
    const focusWhenReady = () => {
      const heading = document.querySelector<HTMLElement>(`#${id} h1, #${id} h2`)
      if (heading) {
        heading.tabIndex = -1
        heading.focus({ preventScroll: true })
        return
      }
      attempts += 1
      if (attempts < 60 && location.hash === `#${id}`) requestAnimationFrame(focusWhenReady)
    }
    requestAnimationFrame(focusWhenReady)
  }
  return (
    <section id="design-tools" className="design-approved-chapter design-approved-tools" data-chapter="12" aria-labelledby="design-tools-title">
      <div className="design-approved-tools__content">
        <h2 id="design-tools-title">{text.toolsHeading}</h2>
        <div className="design-approved-tools__grid">
          <div>
            <p className="design-approved-tools__column-label">{text.outputsCol}</p>
            <div className="design-approved-tools__outputs">
              {OUTPUTS.map((output) => <span key={output}>{output}</span>)}
            </div>
          </div>
          <div className="design-approved-tools__groups">
            {TOOL_GROUPS.map((group) => (
              <div key={group.label.en}>
                <p>{group.label[locale]}</p>
                <span>{group.line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="design-approved-final-cta">
        <div>
          <h2>{text.finalHeading}</h2>
          <div>
            <p>{text.finalText}</p>
            <div className="design-approved-final-cta__actions">
              <Link to="/#contact" onClick={() => focusDestination('contact')}>{text.finalPrimary}</Link>
              <Link to="/#featured" onClick={() => focusDestination('featured')}>{text.finalSecondary}</Link>
            </div>
            <p className="design-approved-final-cta__capabilities">{text.finalCapabilityLine}</p>
          </div>
        </div>
      </div>
      <footer className="design-approved-footer">
        <p>{text.footer}</p>
        <a href="#design-approved-hero">{text.backToTop}</a>
      </footer>
    </section>
  )
}
