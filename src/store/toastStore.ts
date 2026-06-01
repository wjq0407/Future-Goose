import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  success: (message: string, description?: string) => string;
  error: (message: string, description?: string) => string;
  warning: (message: string, description?: string) => string;
  info: (message: string, description?: string) => string;
}

const DEFAULT_DURATIONS = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const newToast = {
      ...toast,
      id,
      duration: toast.duration || DEFAULT_DURATIONS[toast.type] || 3000,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
  
  success: (message, description) => {
    return (useToastStore.getState() as ToastStore).addToast({
      type: 'success',
      message,
      description,
    });
  },
  
  error: (message, description) => {
    return (useToastStore.getState() as ToastStore).addToast({
      type: 'error',
      message,
      description,
    });
  },
  
  warning: (message, description) => {
    return (useToastStore.getState() as ToastStore).addToast({
      type: 'warning',
      message,
      description,
    });
  },
  
  info: (message, description) => {
    return (useToastStore.getState() as ToastStore).addToast({
      type: 'info',
      message,
      description,
    });
  },
}));
