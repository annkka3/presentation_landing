import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { useApp } from '../../app/AppContext'

export function SiteLayout() {
  const { t } = useApp()
  const location = useLocation()
  const isDesignRoute = location.pathname === '/design' || (import.meta.env.DEV && location.pathname === '/design-approved-preview')
  return <><a className="skip-link" href="#main">{t.skip}</a>{!isDesignRoute && <Header />}<Outlet />{location.pathname !== '/' && !isDesignRoute && <Footer />}</>
}
