import { useEffect } from 'react'
import { useApp } from '../../app/AppContext'
import { DesignChapterRail } from './components/DesignChapterRail'
import { DesignHero } from './components/DesignHero'
import './DesignApprovedPage.css'

export default function DesignApprovedPage() {
  const { locale } = useApp()

  useEffect(() => {
    document.documentElement.dataset.page = 'design-approved-preview'
    document.title = locale === 'ru' ? 'Дизайн и визуальные системы — Anna Gromyko' : 'Design & Visual Systems — Anna Gromyko'
    return () => {
      if (document.documentElement.dataset.page === 'design-approved-preview') delete document.documentElement.dataset.page
    }
  }, [locale])

  return (
    <main id="main" className="design-approved-page" aria-label={locale === 'ru' ? 'Design portfolio preview' : 'Design portfolio preview'}>
      <DesignHero />
      <DesignChapterRail locale={locale} />
    </main>
  )
}
