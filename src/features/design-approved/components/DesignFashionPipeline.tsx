import { FASHION_PIPELINE_CASE, TECHNICAL_AB_CASE, UI_TEXT } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

export function DesignFashionPipeline({ locale }: { locale: DesignApprovedLocale }) {
  const pipeline = FASHION_PIPELINE_CASE
  const ab = TECHNICAL_AB_CASE

  return (
    <section id="design-fashion-pipeline" className="design-approved-chapter design-approved-pipeline" data-chapter="4" aria-label={locale === 'ru' ? 'AI Fashion Pipeline и Technical A/B' : 'AI Fashion Pipeline and Technical A/B'}>
      <div className="design-approved-pipeline__grid">
        <a className="design-approved-pipeline__lead" href={pipeline.href}>
          <div className="design-approved-pipeline__lead-media"><img src={pipeline.cover} alt={pipeline.title[locale]} loading="lazy" /></div>
          <div>
            <span>{pipeline.num} · {pipeline.category[locale]}</span>
            <h2>{pipeline.title[locale]}</h2>
            <p>{pipeline.description[locale]}</p>
            <small>{pipeline.status[locale]} · {pipeline.tags[locale]}</small>
          </div>
        </a>
        <a className="design-approved-pipeline__ab" href={ab.href}>
          <div className="design-approved-pipeline__ab-media"><img src={ab.cover} alt={UI_TEXT[locale].abImgAlt} loading="lazy" /></div>
          <div>
            <span>{ab.category[locale]}</span>
            <h3>{ab.title[locale]}</h3>
            <p>{ab.description[locale]}</p>
          </div>
        </a>
      </div>
    </section>
  )
}
