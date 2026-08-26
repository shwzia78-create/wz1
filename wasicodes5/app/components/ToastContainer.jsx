import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();
  const safeToasts = toasts || [];

  if (safeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {safeToasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
            case 'info':
              return <Info className="w-5 h-5 text-blue-600 shrink-0" />;
            case 'success':
            default:
              return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'warning':
              return 'border-amber-300 bg-amber-50/95 text-amber-950';
            case 'error':
              return 'border-rose-300 bg-rose-50/95 text-rose-950';
            case 'info':
              return 'border-blue-300 bg-blue-50/95 text-blue-950';
            case 'success':
            default:
              return 'border-emerald-300 bg-emerald-50/95 text-emerald-950';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-xs transition-all duration-300 animate-in slide-in-from-bottom-3 ${getBorderColor()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold">{toast.title}</h4>
              <p className="text-xs text-slate-700 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};