import { create } from 'zustand'
import type { PerformanceMetric, ApiMetric, ErrorRecord, UserAction, PerformanceData } from '@/lib/performanceMonitor'
import { generateSessionId } from '@/lib/performanceMonitor'
import { getPageLoadTime } from '@/lib/webVitals'

interface PerformanceState {
  session: {
    sessionId: string
    startTime: number
    pageLoadTime: number
  }
  webVitals: PerformanceMetric[]
  apiMetrics: ApiMetric[]
  errors: ErrorRecord[]
  userActions: UserAction[]
  
  addWebVital: (metric: PerformanceMetric) => void
  addApiMetric: (metric: ApiMetric) => void
  addError: (error: ErrorRecord) => void
  addUserAction: (action: UserAction) => void
  getPerformanceData: () => PerformanceData
  reset: () => void
}

const MAX_METRICS = 1000
const MAX_ERRORS = 500
const MAX_ACTIONS = 2000

function addToArray<T>(array: T[], item: T, max: number): T[] {
  const newArray = [...array, item]
  if (newArray.length > max) {
    return newArray.slice(newArray.length - max)
  }
  return newArray
}

export const usePerformanceStore = create<PerformanceState>()((set, get) => ({
  session: {
    sessionId: generateSessionId(),
    startTime: Date.now(),
    pageLoadTime: getPageLoadTime(),
  },
  webVitals: [],
  apiMetrics: [],
  errors: [],
  userActions: [],
  
  addWebVital: (metric) => {
    set((state) => ({
      webVitals: addToArray(state.webVitals, metric, MAX_METRICS),
    }))
  },
  
  addApiMetric: (metric) => {
    set((state) => ({
      apiMetrics: addToArray(state.apiMetrics, metric, MAX_METRICS),
    }))
  },
  
  addError: (error) => {
    set((state) => ({
      errors: addToArray(state.errors, error, MAX_ERRORS),
    }))
  },
  
  addUserAction: (action) => {
    set((state) => ({
      userActions: addToArray(state.userActions, action, MAX_ACTIONS),
    }))
  },
  
  getPerformanceData: () => {
    const state = get()
    return {
      webVitals: state.webVitals,
      apiMetrics: state.apiMetrics,
      errors: state.errors,
      userActions: state.userActions,
      sessionStart: state.session.startTime,
      pageLoadTime: state.session.pageLoadTime,
    }
  },
  
  reset: () => {
    set({
      webVitals: [],
      apiMetrics: [],
      errors: [],
      userActions: [],
    })
  },
}))
