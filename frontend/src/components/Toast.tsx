import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const getStyle = () => {
    switch (type) {
      case 'error':
        return 'bg-rose-600 text-white shadow-rose-600/30';
      case 'info':
        return 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-slate-900/30';
      case 'success':
      default:
        return 'bg-emerald-600 text-white shadow-emerald-600/30';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-5 h-5 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md ${getStyle()}`}>
        {getIcon()}
        <span className="text-sm font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors ml-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
