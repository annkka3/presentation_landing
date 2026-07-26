import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AppProvider } from './app/AppContext'
import { router } from './app/router'
import './styles/tokens.css'
import './styles/globals.css'
import './styles/components.css'
import './styles/responsive.css'
import './styles/design.css'

createRoot(document.getElementById('root')!).render(<StrictMode><AppProvider><RouterProvider router={router} /></AppProvider></StrictMode>)
