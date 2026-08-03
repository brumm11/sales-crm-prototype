import { createContext, useContext, useCallback, useState, useRef } from 'react';
import { CheckCircle, AlertTriangle } from './Icons';

// Global toast: a real success/error confirmation for actions like upload,
// mark-update and hold toggles — not a silent instant change.

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const push = useCallback((message, tone = 'success') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, tone, key: Date.now() });
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-50 flex justify-center px-4">
        {toast && (
          <div
            key={toast.key}
            role="status"
            aria-live="polite"
            className="pointer-events-auto flex animate-toast-in items-center gap-2.5 rounded-2xl bg-ink px-4 py-3 text-white shadow-pop"
          >
            {toast.tone === 'success' ? (
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
