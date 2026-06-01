import type { ApiMetric } from '@/lib/performanceMonitor'

type RequestInterceptor = (url: string, method: string) => void
type ResponseInterceptor = (metric: ApiMetric) => void

let requestInterceptors: RequestInterceptor[] = []
let responseInterceptors: ResponseInterceptor[] = []

export function onRequestIntercept(interceptor: RequestInterceptor) {
  requestInterceptors.push(interceptor)
  return () => {
    requestInterceptors = requestInterceptors.filter(i => i !== interceptor)
  }
}

export function onResponseIntercept(interceptor: ResponseInterceptor) {
  responseInterceptors.push(interceptor)
  return () => {
    responseInterceptors = responseInterceptors.filter(i => i !== interceptor)
  }
}

const originalFetch = window.fetch

window.fetch = async function(...args) {
  const [input, init] = args
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
  const method = init?.method || 'GET'
  
  requestInterceptors.forEach(interceptor => interceptor(url, method))
  
  const startTime = performance.now()
  
  try {
    const response = await originalFetch.apply(this, args)
    const duration = performance.now() - startTime
    
    const contentLength = response.headers.get('content-length')
    const size = contentLength ? parseInt(contentLength, 10) : undefined
    
    const metric: ApiMetric = {
      url,
      method,
      duration,
      status: response.status,
      success: response.ok,
      timestamp: Date.now(),
      size,
    }
    
    responseInterceptors.forEach(interceptor => interceptor(metric))
    
    return response
  } catch (error) {
    const duration = performance.now() - startTime
    
    if ((error as Error).name === 'AbortError') {
      throw error;
    }
    
    const metric: ApiMetric = {
      url,
      method,
      duration,
      status: 0,
      success: false,
      timestamp: Date.now(),
    }
    
    responseInterceptors.forEach(interceptor => interceptor(metric))
    
    throw error
  }
}

export function initApiMonitor(): () => void {
  console.log('[API Monitor] Initialized')
  return () => {
    console.log('[API Monitor] Cleaned up')
  }
}
