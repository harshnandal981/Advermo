/**
 * Simple toast notification utility
 * Can be replaced with a more sophisticated solution like react-hot-toast or sonner
 */

type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

// Simple in-memory event emitter for toast notifications
const toastListeners: Array<(type: ToastType, message: string, options?: ToastOptions) => void> = [];

export function onToast(callback: (type: ToastType, message: string, options?: ToastOptions) => void) {
  toastListeners.push(callback);
  return () => {
    const index = toastListeners.indexOf(callback);
    if (index > -1) {
      toastListeners.splice(index, 1);
    }
  };
}

function emitToast(type: ToastType, message: string, options?: ToastOptions) {
  toastListeners.forEach(listener => listener(type, message, options));
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    emitToast('success', message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    emitToast('error', message, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    emitToast('warning', message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    emitToast('info', message, options);
  },
};

// Fallback to alert if no listeners are registered
if (typeof window !== 'undefined') {
  onToast((type, message) => {
    if (toastListeners.length === 1) {
      // Only this listener exists (the fallback), use alert
      alert(`${type.toUpperCase()}: ${message}`);
    }
  });
}
