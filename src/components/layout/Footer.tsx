import { useApp } from '../../app/AppContext'
import { Container } from './Container'

export function Footer() {
  const { t } = useApp()
  return <footer className="site-footer"><Container><span>{t.footer}</span><a href="#top">{t.top}</a></Container></footer>
}
