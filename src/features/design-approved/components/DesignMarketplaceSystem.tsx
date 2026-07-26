import { useState } from 'react'
import { LOOKBOOK_SLIDES, MARKETPLACE_CASE, UI_TEXT } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

export function DesignMarketplaceSystem({ locale }: { locale: DesignApprovedLocale }) {
  const [index, setIndex] = useState(0)
  const caseData = MARKETPLACE_CASE
  const text = UI_TEXT[locale]
  const go = (next: number) => setIndex((next + LOOKBOOK_SLIDES.length) % LOOKBOOK_SLIDES.length)

  return (
    <section id="design-fashion-system" className="design-approved-chapter design-approved-marketplace" data-chapter="3" aria-labelledby="design-marketplace-title">
      <div className="design-approved-marketplace__grid">
        <div
          className="design-approved-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label={locale === 'ru' ? 'Лукбук Maison Noiree' : 'Maison Noiree lookbook'}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1) }
            if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1) }
          }}
          onTouchStart={(event) => { event.currentTarget.dataset.touchX = String(event.touches[0]?.clientX ?? 0) }}
          onTouchEnd={(event) => {
            const start = Number(event.currentTarget.dataset.touchX)
            const end = event.changedTouches[0]?.clientX ?? start
            if (Math.abs(end - start) > 40) go(index + (end < start ? 1 : -1))
          }}
        >
          <img src={LOOKBOOK_SLIDES[index]} alt={`Maison Noiree · Lookbook spread ${index + 1}`} loading="lazy" />
          <button type="button" className="design-approved-carousel__control design-approved-carousel__control--prev" onClick={() => go(index - 1)} aria-label={locale === 'ru' ? 'Предыдущий разворот' : 'Previous spread'}>‹</button>
          <button type="button" className="design-approved-carousel__control design-approved-carousel__control--next" onClick={() => go(index + 1)} aria-label={locale === 'ru' ? 'Следующий разворот' : 'Next spread'}>›</button>
          <div className="design-approved-carousel__dots">
            {LOOKBOOK_SLIDES.map((slide, dotIndex) => (
              <button key={slide} type="button" className={dotIndex === index ? 'is-active' : ''} aria-label={`${locale === 'ru' ? 'Разворот' : 'Spread'} ${dotIndex + 1}`} aria-current={dotIndex === index ? 'true' : undefined} onClick={() => go(dotIndex)} />
            ))}
          </div>
        </div>
        <a className="design-approved-case-caption" href={caseData.href} aria-labelledby="design-marketplace-title">
          <span>{caseData.num} · {caseData.category[locale]}</span>
          <h2 id="design-marketplace-title">{caseData.title[locale]}</h2>
          <p className="design-approved-case-role">{caseData.role[locale]}</p>
          <p>{caseData.description[locale]}</p>
          <small>{caseData.status[locale]} · {caseData.tags[locale]}</small>
          <b>{text.viewCase}</b>
        </a>
      </div>
    </section>
  )
}
