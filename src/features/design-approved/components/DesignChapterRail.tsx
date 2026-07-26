import { DESIGN_APPROVED_CHAPTERS } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

export function DesignChapterRail({ locale }: { locale: DesignApprovedLocale }) {
  return (
    <nav className="design-approved-chapter-rail" aria-label={locale === 'ru' ? 'Навигация Design Page' : 'Design page navigation'}>
      <span className="design-approved-chapter-rail__current">01</span>
      <div className="design-approved-chapter-rail__track">
        {DESIGN_APPROVED_CHAPTERS.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            aria-label={`${locale === 'ru' ? 'Перейти к разделу' : 'Go to chapter'} ${index + 1}: ${chapter.label[locale]}`}
            aria-current={index === 0 ? 'step' : undefined}
            style={{ top: `${index / 9 * 100}%` }}
            onClick={() => index === 0 && document.getElementById(chapter.id)?.scrollIntoView()}
          />
        ))}
        <i aria-hidden="true" />
      </div>
      <span>10</span>
    </nav>
  )
}

