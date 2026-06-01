import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals'
import type { PerformanceMetric } from '@/lib/performanceMonitor'
import { getRating } from '@/lib/performanceMonitor'

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

const thresholds = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
}

export function initWebVitalsReport(callback: (metric: PerformanceMetric) => void): () => void {
  const reportMetric = (metric: Metric, name: string) => {
    const perfMetric: PerformanceMetric = {
      name,
      value: metric.value,
      rating: getRating(metric.value, thresholds[name as keyof typeof thresholds]),
      timestamp: Date.now(),
      navigationType: metric.navigationType,
      metadata: {
        id: metric.id,
        rating: metric.rating,
      },
    }
    callback(perfMetric)
  }

  onCLS((metric) => reportMetric(metric, 'CLS'))
  onINP((metric) => reportMetric(metric, 'INP'))
  onFCP((metric) => reportMetric(metric, 'FCP'))
  onLCP((metric) => reportMetric(metric, 'LCP'))
  onTTFB((metric) => reportMetric(metric, 'TTFB'))
  
  return () => {
  }
}

export function getPageLoadTime(): number {
  if (typeof window === 'undefined') return 0
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (!navigation) return 0
  
  return navigation.loadEventEnd - navigation.startTime
}

export function getMemoryUsage(): { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } | null {
  if (typeof window === 'undefined' || !(performance as PerformanceWithMemory).memory) return null
  
  const memory = (performance as PerformanceWithMemory).memory
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
  }
}
