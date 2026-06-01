export type PerformanceMetric = {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  navigationType: string
  metadata?: Record<string, unknown>
}

export type ApiMetric = {
  url: string
  method: string
  duration: number
  status: number
  success: boolean
  timestamp: number
  size?: number
}

export type ErrorRecord = {
  message: string
  stack?: string
  type: 'javascript' | 'network' | 'promise' | 'resource'
  timestamp: number
  url?: string
  context?: Record<string, unknown>
}

export type UserAction = {
  type: 'page_view' | 'click' | 'navigation' | 'feature_use' | 'form_submit'
  name: string
  timestamp: number
  metadata?: Record<string, unknown>
}

export type PerformanceData = {
  webVitals: PerformanceMetric[]
  apiMetrics: ApiMetric[]
  errors: ErrorRecord[]
  userActions: UserAction[]
  sessionStart: number
  pageLoadTime: number
}

export function getRating(value: number, thresholds: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
