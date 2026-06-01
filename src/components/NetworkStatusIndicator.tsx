import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { onNetworkStatusChange, isOnline } from '@/lib/network';

export default function NetworkStatusIndicator() {
  const [online, setOnline] = useState(isOnline());
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    const unsubscribe = onNetworkStatusChange((status) => {
      setOnline(status.isOnline);
      
      if (!status.isOnline) {
        setShowOfflineBanner(true);
      } else {
        setShowOfflineBanner(false);
        setTimeout(() => {
          setOnline(true);
        }, 2000);
      }
    });

    return unsubscribe;
  }, []);

  if (online && !showOfflineBanner) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
      showOfflineBanner || !online ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
        {online ? (
          <>
            <Wifi className="w-4 h-4 text-green-400" />
            <span>网络已恢复</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-400" />
            <span>网络已断开，请检查网络连接</span>
          </>
        )}
      </div>
    </div>
  );
}
