import { initWebVitalsReport } from '@/lib/webVitals'
import { initApiMonitor, onResponseIntercept } from '@/lib/apiMonitor'
import { initErrorMonitor, onError } from '@/lib/errorMonitor'
import { initUserActionMonitor, onUserAction } from '@/lib/userActionMonitor'
import { usePerformanceStore } from '@/store/performanceStore'

export function initPerformanceMonitoring() {
  const { addWebVital, addApiMetric, addError, addUserAction } = usePerformanceStore.getState()
  
  const cleanupWebVitals = initWebVitalsReport(addWebVital)
  
  const cleanupApi = initApiMonitor()
  onResponseIntercept(addApiMetric)
  
  const cleanupErrors = initErrorMonitor()
  onError(addError)
  
  const cleanupActions = initUserActionMonitor()
  onUserAction(addUserAction)
  
  return () => {
    cleanupWebVitals()
    cleanupApi()
    cleanupErrors()
    cleanupActions()
  }
}
