import { DIGITAL_CASES, EUFASHION_CASE } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

export function DesignBrandSystems({ locale }: { locale: DesignApprovedLocale }) {
  const eufashion = EUFASHION_CASE

  return (
    <section id="design-brand-systems" className="design-approved-chapter design-approved-brand-systems" data-chapter="5" aria-label={locale === 'ru' ? 'Eufashion Glasses и Digital and Brand Systems' : 'Eufashion Glasses and Digital and Brand Systems'}>
      <a className="design-approved-brand-systems__feature" href={eufashion.href}>
        <div className="design-approved-brand-systems__feature-media">
          <img src={eufashion.cover} alt={eufashion.title[locale]} style={{ objectPosition: eufashion.objectPosition }} loading="lazy" />
        </div>
        <div>
          <span>{eufashion.num} · {eufashion.category[locale]}</span>
          <h2>{eufashion.title[locale]}</h2>
          <p>{eufashion.description[locale]}</p>
          <small>{eufashion.status[locale]} · {eufashion.tags[locale]}</small>
        </div>
      </a>
      <div className="design-approved-brand-systems__grid">
        {DIGITAL_CASES.map((caseData) => (
          <a key={caseData.num} className={caseData.dominant ? 'is-dominant' : ''} href={caseData.href}>
            <div className="design-approved-brand-systems__media" style={{ aspectRatio: caseData.aspect }}>
              <img src={caseData.cover} alt={caseData.title[locale]} style={{ objectFit: caseData.fit, objectPosition: caseData.objectPosition }} loading="lazy" />
            </div>
            <span>{caseData.num} · {caseData.category[locale]}</span>
            <h3 style={{ fontSize: caseData.titleSize }}>{caseData.title[locale]}</h3>
            <p>{caseData.tags[locale]}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
