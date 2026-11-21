import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import KosanHubApi from './pages/KosanHubApi.jsx'
import './pages/KosanHubApi.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KosanHubApi />
  </StrictMode>,
)
