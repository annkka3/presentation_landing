import { Link } from 'react-router-dom'
import { useApp } from '../app/AppContext'
import { Container } from '../components/layout/Container'

export default function NotFoundPage() {
  const { t } = useApp()
  return <main id="main" className="not-found"><Container><span>404</span><h1>{t.notFound}</h1><Link to="/">{t.home} →</Link></Container></main>
}
