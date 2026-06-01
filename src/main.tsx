import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { initGlobalErrorHandling } from './lib/errorHandling'
import { initNetworkMonitoring } from './lib/network'
import { initPerformanceMonitoring } from './lib/performanceInit'

initGlobalErrorHandling()
initNetworkMonitoring()
initPerformanceMonitoring()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
