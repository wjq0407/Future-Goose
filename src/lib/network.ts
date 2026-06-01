interface NetworkStatus {
  isOnline: boolean;
  connectionType?: string;
}

let currentStatus: NetworkStatus = {
  isOnline: navigator.onLine,
};

const listeners = new Set<(status: NetworkStatus) => void>();

export function getNetworkStatus(): NetworkStatus {
  return { ...currentStatus };
}

export function isOnline(): boolean {
  return currentStatus.isOnline;
}

export function onNetworkStatusChange(callback: (status: NetworkStatus) => void): () => void {
  listeners.add(callback);
  
  return () => {
    listeners.delete(callback);
  };
}

export function initNetworkMonitoring(): void {
  const updateStatus = () => {
    const wasOnline = currentStatus.isOnline;
    const isNowOnline = navigator.onLine;
    
    currentStatus = {
      isOnline: isNowOnline,
      connectionType: getConnectionType(),
    };
    
    if (wasOnline !== isNowOnline) {
      notifyListeners();
    }
  };
  
  window.addEventListener('online', () => {
    updateStatus();
    if (currentStatus.isOnline) {
      console.info('网络已恢复');
    }
  });
  
  window.addEventListener('offline', () => {
    updateStatus();
    console.warn('网络已断开');
  });
  
  if ('connection' in navigator) {
    const conn = (navigator as { connection?: { addEventListener: (event: string, handler: () => void) => void; effectiveType?: string } }).connection;
    if (conn) {
      conn.addEventListener('change', updateStatus);
    }
  }
  
  updateStatus();
}

function getConnectionType(): string | undefined {
  if ('connection' in navigator) {
    const conn = (navigator as { connection?: { effectiveType?: string } }).connection;
    return conn?.effectiveType;
  }
  return undefined;
}

function notifyListeners(): void {
  const status = getNetworkStatus();
  listeners.forEach((callback) => callback(status));
}

export async function checkConnection(url: string = 'https://open.bigmodel.cn', timeout: number = 5000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors',
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
}
