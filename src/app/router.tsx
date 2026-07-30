import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { SiteLayout } from '../components/layout/SiteLayout'

const HomePage = lazy(() => import('../pages/HomePage'))
const DesignApprovedPage = lazy(() => import('../features/design-approved/DesignApprovedPage'))
const CryptoRealityPage = lazy(() => import('../features/crypto-reality/CryptoRealityPage'))
const CaseStudyPage = lazy(() => import('../pages/CaseStudyPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

const fallback = <div className="route-loading" aria-live="polite">Loading…</div>

export const router = createBrowserRouter([{
  element: <SiteLayout />,
  children: [
    { path: '/', element: <Suspense fallback={fallback}><HomePage /></Suspense> },
    { path: '/design', element: <Suspense fallback={fallback}><DesignApprovedPage /></Suspense> },
    ...(import.meta.env.DEV
      ? [{ path: '/design-approved-preview', element: <Suspense fallback={fallback}><DesignApprovedPage /></Suspense> }]
      : []),
    { path: '/cases/crypto-reality', element: <Suspense fallback={fallback}><CryptoRealityPage /></Suspense> },
    { path: '/cases/:slug', element: <Suspense fallback={fallback}><CaseStudyPage /></Suspense> },
    { path: '/projects/cvetimir', element: <Navigate to="/projects/tsvetimir" replace /> },
    { path: '/projects/:slug', element: <Suspense fallback={fallback}><CaseStudyPage /></Suspense> },
    { path: '*', element: <Suspense fallback={fallback}><NotFoundPage /></Suspense> },
  ],
}])
