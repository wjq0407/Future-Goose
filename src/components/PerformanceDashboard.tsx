import { useState, useEffect } from 'react'
import { usePerformanceStore } from '@/store/performanceStore'
import type { PerformanceMetric } from '@/lib/performanceMonitor'
import { Gauge, BarChart3, AlertTriangle, MousePointerClick, Activity, X, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react'

const RATING_COLORS = {
  good: 'text-green-500 bg-green-50 border-green-200',
  'needs-improvement': 'text-yellow-500 bg-yellow-50 border-yellow-200',
  poor: 'text-red-500 bg-red-50 border-red-200',
}

const RATING_LABELS = {
  good: '良好',
  'needs-improvement': '待改善',
  poor: '差',
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function formatBytes(bytes: number | undefined): string {
  if (bytes === undefined) return 'N/A'
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString('zh-CN')
}

function WebVitalsPanel() {
  const { webVitals } = usePerformanceStore()
  
  const latest: Record<string, PerformanceMetric> = {}
  webVitals.forEach(m => {
    latest[m.name] = m
  })
  
  const metrics = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB']
  const metricLabels: Record<string, string> = {
    CLS: '累计布局偏移',
    INP: '交互到绘制',
    FCP: '首次内容绘制',
    LCP: '最大内容绘制',
    TTFB: '首字节时间',
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Web Vitals</h3>
      </div>
      
      {metrics.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无数据</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {metrics.map(name => {
            const metric = latest[name]
            if (!metric) return null
            
            return (
              <div key={name} className={`p-4 rounded-lg border ${RATING_COLORS[metric.rating]}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                    {RATING_LABELS[metric.rating]}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {metric.name === 'CLS' ? metric.value.toFixed(3) : formatDuration(metric.value)}
                </div>
                <div className="text-xs opacity-75">{metricLabels[name]}</div>
                <div className="text-xs opacity-60 mt-1">{formatTimestamp(metric.timestamp)}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ApiPanel() {
  const { apiMetrics } = usePerformanceStore()
  const [showAll, setShowAll] = useState(false)
  
  const displayMetrics = showAll ? apiMetrics : apiMetrics.slice(-10)
  
  const stats = apiMetrics.reduce(
    (acc, m) => {
      acc.total++
      acc.success += m.success ? 1 : 0
      acc.fail += m.success ? 0 : 1
      acc.totalDuration += m.duration
      return acc
    },
    { total: 0, success: 0, fail: 0, totalDuration: 0 }
  )
  
  const avgDuration = stats.total > 0 ? stats.totalDuration / stats.total : 0
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">API 性能</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-blue-600">总请求</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.success}</div>
          <div className="text-xs text-green-600">成功</div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{stats.fail}</div>
          <div className="text-xs text-red-600">失败</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{formatDuration(avgDuration)}</div>
          <div className="text-xs text-purple-600">平均响应</div>
        </div>
      </div>
      
      {displayMetrics.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无数据</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">方法</th>
                <th className="px-3 py-2 text-left">URL</th>
                <th className="px-3 py-2 text-right">状态</th>
                <th className="px-3 py-2 text-right">耗时</th>
                <th className="px-3 py-2 text-right">大小</th>
                <th className="px-3 py-2 text-right">时间</th>
              </tr>
            </thead>
            <tbody>
              {displayMetrics.map((m, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-xs">{m.method}</td>
                  <td className="px-3 py-2 text-xs truncate max-w-[200px]" title={m.url}>
                    {m.url}
                  </td>
                  <td className={`px-3 py-2 text-right text-xs ${m.success ? 'text-green-600' : 'text-red-600'}`}>
                    {m.status || 'N/A'}
                  </td>
                  <td className="px-3 py-2 text-right text-xs">{formatDuration(m.duration)}</td>
                  <td className="px-3 py-2 text-right text-xs">{formatBytes(m.size)}</td>
                  <td className="px-3 py-2 text-right text-xs">{formatTimestamp(m.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {apiMetrics.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50"
        >
          {showAll ? '显示最近10条' : `显示全部 (${apiMetrics.length}条)`}
        </button>
      )}
    </div>
  )
}

function ErrorPanel() {
  const { errors } = usePerformanceStore()
  const [showAll, setShowAll] = useState(false)
  
  const displayErrors = showAll ? errors : errors.slice(-10)
  
  const typeIcons: Record<string, React.ReactNode> = {
    javascript: <AlertTriangle className="w-4 h-4" />,
    network: <Activity className="w-4 h-4" />,
    promise: <AlertTriangle className="w-4 h-4" />,
    resource: <AlertTriangle className="w-4 h-4" />,
  }
  
  const typeColors: Record<string, string> = {
    javascript: 'text-red-600 bg-red-50',
    network: 'text-orange-600 bg-orange-50',
    promise: 'text-yellow-600 bg-yellow-50',
    resource: 'text-pink-600 bg-pink-50',
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold">错误监控</h3>
        <span className="ml-auto px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
          {errors.length}
        </span>
      </div>
      
      {displayErrors.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无错误</p>
      ) : (
        <div className="space-y-2">
          {displayErrors.map((error, i) => (
            <div key={i} className="p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-start gap-2">
                <span className={`p-1.5 rounded ${typeColors[error.type]}`}>
                  {typeIcons[error.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{error.message}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="uppercase">{error.type}</span>
                    <span>{formatTimestamp(error.timestamp)}</span>
                    {error.url && <span className="truncate">{error.url}</span>}
                  </div>
                </div>
              </div>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer">查看堆栈</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
      
      {errors.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50"
        >
          {showAll ? '显示最近10条' : `显示全部 (${errors.length}条)`}
        </button>
      )}
    </div>
  )
}

function ActionPanel() {
  const { userActions } = usePerformanceStore()
  const [showAll, setShowAll] = useState(false)
  
  const displayActions = showAll ? userActions : userActions.slice(-20)
  
  const typeIcons: Record<string, React.ReactNode> = {
    page_view: <BarChart3 className="w-4 h-4" />,
    click: <MousePointerClick className="w-4 h-4" />,
    navigation: <ArrowUp className="w-4 h-4" />,
    feature_use: <Activity className="w-4 h-4" />,
    form_submit: <ArrowDown className="w-4 h-4" />,
  }
  
  const typeLabels: Record<string, string> = {
    page_view: '页面访问',
    click: '点击',
    navigation: '导航',
    feature_use: '功能使用',
    form_submit: '表单提交',
  }
  
  const stats = userActions.reduce(
    (acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MousePointerClick className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold">用户行为</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(stats).map(([type, count]) => (
          <div key={type} className="p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              {typeIcons[type]}
              <span className="text-xs text-gray-600">{typeLabels[type]}</span>
            </div>
            <div className="text-2xl font-bold">{count}</div>
          </div>
        ))}
      </div>
      
      {displayActions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无数据</p>
      ) : (
        <div className="space-y-1">
          {displayActions.map((action, i) => (
            <div key={i} className="flex items-center gap-2 p-2 text-sm hover:bg-gray-50 rounded">
              <span className="text-gray-400">{typeIcons[action.type]}</span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{typeLabels[action.type]}</span>
              <span className="flex-1 truncate">{action.name}</span>
              <span className="text-xs text-gray-400">{formatTimestamp(action.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
      
      {userActions.length > 20 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm text-green-600 hover:text-green-700 border border-green-200 rounded-lg hover:bg-green-50"
        >
          {showAll ? '显示最近20条' : `显示全部 (${userActions.length}条)`}
        </button>
      )}
    </div>
  )
}

export default function PerformanceDashboard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'vitals' | 'api' | 'errors' | 'actions'>('vitals')
  const { reset, session } = usePerformanceStore()
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])
  
  if (!isOpen) return null
  
  const tabs = [
    { id: 'vitals' as const, label: 'Web Vitals', icon: <Gauge className="w-4 h-4" /> },
    { id: 'api' as const, label: 'API', icon: <Activity className="w-4 h-4" /> },
    { id: 'errors' as const, label: '错误', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'actions' as const, label: '行为', icon: <MousePointerClick className="w-4 h-4" /> },
  ]
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col m-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">性能监控面板</h2>
            <span className="text-xs text-gray-500">Session: {session.sessionId}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => reset()}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="重置数据"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="关闭 (Ctrl+Shift+P)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'vitals' && <WebVitalsPanel />}
          {activeTab === 'api' && <ApiPanel />}
          {activeTab === 'errors' && <ErrorPanel />}
          {activeTab === 'actions' && <ActionPanel />}
        </div>
        
        <div className="p-3 border-t bg-gray-50 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">
            快捷键: Ctrl+Shift+P 打开/关闭面板 | 页面加载时间: {session.pageLoadTime.toFixed(0)}ms
          </p>
        </div>
      </div>
    </div>
  )
}
