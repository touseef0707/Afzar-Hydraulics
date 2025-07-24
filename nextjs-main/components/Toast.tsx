'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ToastMessage {
  id: string;
  content: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (
    content: string,
    type?: ToastType,
    duration?: number
  ) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [position] = useState<ToastPosition>('bottom-right');

  const showToast = (
    content: string,
    type: ToastType = 'info',
    duration: number = 3000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, content, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Get animation class based on position
  const getAnimationClass = () => {
    if (position === 'top-right' || position === 'bottom-right') 
      return 'animate-slideInRight';
    if (position === 'top-left' || position === 'bottom-left') 
      return 'animate-slideInLeft';
    return 'animate-slideInRight';
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={`fixed z-[1000] flex flex-col gap-2 ${
          position.includes('top') ? 'top-4' : 'bottom-4'
        } ${position.includes('left') ? 'left-4' : 'right-4'}`}
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
            animationClass={getAnimationClass()}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onClose,
  animationClass,
}: {
  toast: ToastMessage;
  onClose: () => void;
  animationClass: string;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  // Icon mapping
  const iconMap = {
    success: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    info: <Info className="w-5 h-5 flex-shrink-0" />,
  };

  // Background colors
  const bgColorMap = {
    success: 'bg-blue-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-indigo-500',
  };

  return (
    <div
      className={`min-w-[280px] max-w-md p-4 rounded-lg shadow-lg text-white flex items-start gap-3 ${bgColorMap[toast.type]} ${animationClass}`}
    >
      <div className="mt-0.5">{iconMap[toast.type]}</div>
      <div className="flex-1">
        <span className="font-medium">{toast.content}</span>
      </div>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 hover:cursor-pointer ml-2 text-xl"
        aria-label="Close toast"
      >
        &times;
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
