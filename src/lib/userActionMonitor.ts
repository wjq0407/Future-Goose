import type { UserAction } from '@/lib/performanceMonitor'

type ActionCallback = (action: UserAction) => void

let actionCallback: ActionCallback | null = null

export function onUserAction(callback: ActionCallback) {
  actionCallback = callback
  return () => {
    actionCallback = null
  }
}

export function trackPageView(pageName: string, metadata?: Record<string, unknown>) {
  if (!actionCallback) return
  
  actionCallback({
    type: 'page_view',
    name: pageName,
    timestamp: Date.now(),
    metadata,
  })
}

export function trackNavigation(from: string, to: string) {
  if (!actionCallback) return
  
  actionCallback({
    type: 'navigation',
    name: `Navigate: ${from} -> ${to}`,
    timestamp: Date.now(),
    metadata: { from, to },
  })
}

export function trackFeatureUse(featureName: string, metadata?: Record<string, unknown>) {
  if (!actionCallback) return
  
  actionCallback({
    type: 'feature_use',
    name: featureName,
    timestamp: Date.now(),
    metadata,
  })
}

export function trackFormSubmit(formName: string, metadata?: Record<string, unknown>) {
  if (!actionCallback) return
  
  actionCallback({
    type: 'form_submit',
    name: formName,
    timestamp: Date.now(),
    metadata,
  })
}

export function trackClick(elementName: string, metadata?: Record<string, unknown>) {
  if (!actionCallback) return
  
  actionCallback({
    type: 'click',
    name: elementName,
    timestamp: Date.now(),
    metadata,
  })
}

let lastPath = ''

export function initUserActionMonitor(): () => void {
  const observer = new MutationObserver(() => {
    const currentPath = window.location.pathname
    if (currentPath !== lastPath) {
      const prevPath = lastPath || 'initial'
      lastPath = currentPath
      trackNavigation(prevPath, currentPath)
      trackPageView(currentPath)
    }
  })
  
  observer.observe(document, { subtree: true, childList: true })
  
  trackPageView(window.location.pathname)
  
  console.log('[User Action Monitor] Initialized')
  
  return () => {
    observer.disconnect()
  }
}
