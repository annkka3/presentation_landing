import { COMMERCIAL_CASES, UI_TEXT } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

export function DesignCommercialCases({ locale }: { locale: DesignApprovedLocale }) {
  const text = UI_TEXT[locale]
  return (
    <section id="design-marketplace" className="design-approved-chapter design-approved-commercial" data-chapter="7" aria-labelledby="design-commercial-title">
      <h2 id="design-commercial-title">{text.commercialHeading}</h2>
      <p className="design-approved-chapter-lede">{text.commercialSub}</p>
      <div className="design-approved-commercial__grid">
        {COMMERCIAL_CASES.map((caseData) => {
          const cover = locale === 'en' && 'coverEn' in caseData ? caseData.coverEn : caseData.cover
          return (
            <a key={caseData.num} href={caseData.href}>
              <div className="design-approved-commercial__media">
                <img src={cover} alt={caseData.title[locale]} style={{ objectPosition: caseData.objectPosition }} loading="lazy" width="1200" height="900" />
              </div>
              <span>{caseData.category[locale]}</span>
              <h3>{caseData.title[locale]}</h3>
              <p className="design-approved-commercial__role">{caseData.role[locale]}</p>
              <p>{caseData.description[locale]}</p>
              {caseData.hypothesis && <p className="design-approved-commercial__hypothesis">{caseData.hypothesis[locale]}</p>}
              <small>{caseData.status[locale]}</small>
            </a>
          )
        })}
      </div>
    </section>
  )
}
