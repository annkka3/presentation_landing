import { DIGITAL_CASES, EUFASHION_CASE } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

export function DesignBrandSystems({ locale }: { locale: DesignApprovedLocale }) {
  const eufashion = EUFASHION_CASE
  const [maison, portfolio] = DIGITAL_CASES

  return (
    <>
      <section id="design-brand-systems" className="design-approved-chapter design-approved-brand-systems design-approved-brand-systems--eufashion" data-chapter="5" aria-label={locale === 'ru' ? 'Eufashion Glasses — Luxury E-commerce System' : 'Eufashion Glasses — Luxury E-commerce System'}>
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
      </section>

      {[maison, portfolio].map((caseData, index) => (
        <section
          key={caseData.num}
          id={index === 0 ? 'design-maison-noiree' : 'design-portfolio'}
          className={`design-approved-chapter design-approved-brand-case design-approved-brand-case--${index === 0 ? 'maison' : 'portfolio'}`}
          data-chapter={index + 6}
          aria-labelledby={`design-brand-case-title-${caseData.num}`}
        >
          <a href={caseData.href}>
            <div className="design-approved-brand-case__media" style={{ aspectRatio: caseData.aspect }}>
              <img
                src={caseData.cover}
                alt={caseData.title[locale]}
                style={{ objectFit: caseData.fit, objectPosition: caseData.objectPosition }}
                loading="lazy"
              />
            </div>
            <div className="design-approved-brand-case__copy">
              <span>{caseData.num} · {caseData.category[locale]}</span>
              <h2 id={`design-brand-case-title-${caseData.num}`}>{caseData.title[locale]}</h2>
              <p>{caseData.tags[locale]}</p>
            </div>
          </a>
        </section>
      ))}
    </>
  )
}
