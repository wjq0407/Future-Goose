import { useToastStore } from '@/store/toastStore';

let isInitialized = false;

export function initGlobalErrorHandling(): void {
  if (isInitialized) return;
  isInitialized = true;

  window.addEventListener('error', (event: ErrorEvent) => {
    event.preventDefault();
    
    const error = event.error || new Error(event.message);
    console.error('全局未捕获错误:', error);
    
    const message = error.message || '发生了未知错误';
    useToastStore.getState().error(
      '发生错误',
      message.length > 100 ? message.substring(0, 100) + '...' : message
    );
  });

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    event.preventDefault();
    
    const reason = event.reason;
    console.error('未处理的Promise拒绝:', reason);
    
    const message = reason instanceof Error 
      ? reason.message 
      : String(reason || '异步操作失败');
    
    if (reason && typeof reason === 'object' && 'errorType' in reason && reason.errorType === 'API_KEY_NOT_SET') {
      useToastStore.getState().info(
        '需要配置API Key',
        '点击右上角设置按钮配置API Key以使用AI功能'
      );
      return;
    }
    
    if (reason && typeof reason === 'object' && 'errorType' in reason && reason.errorType === 'API_KEY_INVALID') {
      useToastStore.getState().error(
        'API Key无效',
        '请检查并重新配置API Key'
      );
      return;
    }
    
    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
      useToastStore.getState().error(
        '网络连接失败',
        '请检查网络连接后重试'
      );
      return;
    }
    
    useToastStore.getState().error(
      '操作失败',
      message.length > 100 ? message.substring(0, 100) + '...' : message
    );
  });
}

export function handleAsyncError(
  promise: Promise<unknown>,
  errorHandler?: (error: Error) => void
): Promise<unknown> {
  return promise.catch((reason) => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    
    if (errorHandler) {
      errorHandler(err);
    } else {
      console.error('异步操作错误:', err);
      useToastStore.getState().error(
        '操作失败',
        err.message
      );
    }
    
    throw err;
  });
}

export function safeAsync<T>(
  promise: Promise<T>,
  fallbackValue?: T
): Promise<T | undefined> {
  return promise.catch((reason) => {
    console.error('安全执行错误:', reason);
    useToastStore.getState().error(
      '操作失败',
      reason instanceof Error ? reason.message : '未知错误'
    );
    return fallbackValue;
  });
}
