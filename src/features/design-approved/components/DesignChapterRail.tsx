import { DESIGN_APPROVED_CHAPTERS } from '../designApprovedContent'
import type { DesignApprovedLocale } from '../designApprovedTypes'

interface DesignChapterRailProps {
  locale: DesignApprovedLocale
  activeChapter: number
  onNavigate: (index: number) => void
}

export function DesignChapterRail({ locale, activeChapter, onNavigate }: DesignChapterRailProps) {
  return (
    <nav className="design-approved-chapter-rail" data-on-hero={activeChapter === 0} data-active-chapter={activeChapter + 1} aria-label={locale === 'ru' ? 'Навигация Design Page' : 'Design page navigation'}>
      <span className="design-approved-chapter-rail__current">{String(activeChapter + 1).padStart(2, '0')}</span>
      <div className="design-approved-chapter-rail__track">
        {DESIGN_APPROVED_CHAPTERS.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            aria-label={`${locale === 'ru' ? 'Перейти к разделу' : 'Go to chapter'} ${index + 1}: ${chapter.label[locale]}`}
            aria-current={index === activeChapter ? 'step' : undefined}
            style={{ top: `${index / 9 * 100}%` }}
            onClick={() => onNavigate(index)}
          />
        ))}
        <i aria-hidden="true" style={{ top: `${activeChapter / 9 * 100}%` }} />
      </div>
      <span>10</span>
    </nav>
  )
}
