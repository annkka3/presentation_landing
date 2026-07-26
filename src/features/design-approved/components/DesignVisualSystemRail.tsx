import { RAIL_STAGES, UI_TEXT } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

export function DesignVisualSystemRail({ locale }: { locale: DesignApprovedLocale }) {
  const text = UI_TEXT[locale]
  return (
    <section id="design-visual-system" className="design-approved-chapter design-approved-visual-system" data-chapter="6" aria-labelledby="design-visual-system-title">
      <h2 id="design-visual-system-title">{text.railHeading}</h2>
      <p className="design-approved-visual-system__lede">{text.railSub}</p>
      <p className="design-approved-visual-system__label">{text.railProjectLabel}</p>
      <div className="design-approved-production-rail">
        <i aria-hidden="true" />
        <div className="design-approved-production-rail__grid">
          {RAIL_STAGES.map((stage) => (
            <article key={stage.num}>
              <span>{stage.num}</span>
              <div className="design-approved-production-rail__media">
                <img
                  src={stage.thumb}
                  alt={`${stage.title[locale]} — ${stage.desc[locale]}`}
                  style={{ objectFit: stage.fit, objectPosition: stage.objectPosition, filter: stage.filter }}
                  loading="lazy"
                  width="683"
                  height="1000"
                />
              </div>
              <h3>{stage.title[locale]}</h3>
              <p>{stage.desc[locale]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
