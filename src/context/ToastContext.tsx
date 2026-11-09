'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Link from 'next/link';
import { CheckCircle2, Info, AlertCircle, Sparkles, X, ArrowRight } from 'lucide-react';

export interface ToastOptions {
  type?: 'success' | 'info' | 'gold' | 'error';
  title?: string;
  link?: string;
  linkText?: string;
  duration?: number;
}

interface ToastMessage extends ToastOptions {
  id: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const duration = options?.duration ?? 4000;

      const newToast: ToastMessage = {
        id,
        message,
        type: options?.type || 'success',
        title: options?.title,
        link: options?.link,
        linkText: options?.linkText,
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 3)); // keep max 3

      setTimeout(() => {
        hideToast(id);
      }, duration);
    },
    [hideToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none select-none">
        {toasts.map((toast) => {
          const isGold = toast.type === 'gold';
          const isError = toast.type === 'error';
          const isInfo = toast.type === 'info';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
                isGold
                  ? 'bg-[#120f08]/95 border-amber-400/50 text-white shadow-[0_10px_35px_rgba(251,191,36,0.2)]'
                  : isError
                  ? 'bg-[#180a0a]/95 border-red-500/50 text-white shadow-[0_10px_35px_rgba(239,68,68,0.2)]'
                  : isInfo
                  ? 'bg-[#0a0f18]/95 border-blue-400/50 text-white shadow-[0_10px_35px_rgba(59,130,246,0.2)]'
                  : 'bg-[#080d1a]/95 border-cyan-400/50 text-white shadow-[0_10px_35px_rgba(6,182,212,0.25)]'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon Badge */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isGold
                      ? 'bg-amber-400/20 text-amber-300'
                      : isError
                      ? 'bg-red-500/20 text-red-300'
                      : isInfo
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  {isGold ? (
                    <Sparkles className="w-4 h-4" />
                  ) : isError ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : isInfo ? (
                    <Info className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-2">
                  {toast.title && (
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-neutral-300 mb-0.5">
                      {toast.title}
                    </h4>
                  )}
                  <p className="text-xs sm:text-sm font-medium text-white leading-snug">
                    {toast.message}
                  </p>

                  {/* Optional Action Link */}
                  {toast.link && (
                    <Link
                      href={toast.link}
                      onClick={() => hideToast(toast.id)}
                      className="inline-flex items-center gap-1 mt-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>{toast.linkText || 'View Collection'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => hideToast(toast.id)}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
