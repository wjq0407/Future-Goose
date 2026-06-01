import { useEffect, useState, useCallback } from 'react';
import { useToastStore, Toast } from '@/store/toastStore';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  const handleRemove = useCallback((id: string) => {
    setRemoving((prev) => new Set(prev).add(id));
    setTimeout(() => {
      removeToast(id);
      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, [removeToast]);

  useEffect(() => {
    const timers: Map<string, number> = new Map();

    for (const toast of toasts) {
      if (!removing.has(toast.id) && toast.duration && toast.duration > 0) {
        const timer = window.setTimeout(() => {
          handleRemove(toast.id);
        }, toast.duration);
        timers.set(toast.id, timer);
      }
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, removing, handleRemove]);

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getToastBorderColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200';
      case 'error':
        return 'border-red-200';
      case 'warning':
        return 'border-amber-200';
      case 'info':
        return 'border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto bg-white rounded-xl shadow-lg border ${getToastBorderColor(toast.type)} p-4 transition-all duration-300 ${
            removing.has(toast.id) ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
          }`}
        >
          <div className="flex items-start gap-3">
            {getToastIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{toast.message}</p>
              {toast.description && (
                <p className="text-xs text-gray-500 mt-1">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => handleRemove(toast.id)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
