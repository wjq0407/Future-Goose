import type { ErrorRecord } from '@/lib/performanceMonitor'

type ErrorCallback = (error: ErrorRecord) => void

let errorCallback: ErrorCallback | null = null

export function onError(callback: ErrorCallback) {
  errorCallback = callback
  return () => {
    errorCallback = null
  }
}

function handleError(event: ErrorEvent) {
  if (!errorCallback) return
  
  const error: ErrorRecord = {
    message: event.message || 'Unknown error',
    stack: event.error?.stack,
    type: 'javascript',
    timestamp: Date.now(),
    url: event.filename || window.location.href,
    context: {
      lineno: event.lineno,
      colno: event.colno,
    },
  }
  
  errorCallback(error)
}

function handleUnhandledRejection(event: PromiseRejectionEvent) {
  if (!errorCallback) return
  
  const error: ErrorRecord = {
    message: event.reason?.message || event.reason?.toString() || 'Unhandled promise rejection',
    stack: event.reason?.stack,
    type: 'promise',
    timestamp: Date.now(),
  }
  
  errorCallback(error)
}

function handleResourceError(event: Event) {
  if (!errorCallback) return
  
  const target = event.target as HTMLElement
  const error: ErrorRecord = {
    message: `Resource load failed: ${target.tagName}`,
    type: 'resource',
    timestamp: Date.now(),
    context: {
      src: (target as HTMLScriptElement).src || (target as HTMLImageElement).src || (target as HTMLLinkElement).href,
    },
  }
  
  errorCallback(error)
}

export function initErrorMonitor(): () => void {
  window.addEventListener('error', handleError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
  
  const resourceElements = document.querySelectorAll('script, img, link')
  resourceElements.forEach(el => {
    el.addEventListener('error', handleResourceError)
  })
  
  console.log('[Error Monitor] Initialized')
  
  return () => {
    window.removeEventListener('error', handleError)
    window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }
}
