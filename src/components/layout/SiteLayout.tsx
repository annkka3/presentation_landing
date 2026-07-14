import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { useApp } from '../../app/AppContext'

export function SiteLayout() {
  const { t } = useApp()
  return <><a className="skip-link" href="#main">{t.skip}</a><Header /><Outlet /><Footer /></>
}
