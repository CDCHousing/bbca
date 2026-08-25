"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ToastVariant = "success" | "error";

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

const AUTO_DISMISS_MS = 4000;

/**
 * Local toast state for a single admin screen. Pair the returned `toasts`
 * with <ToastStack /> and call `showToast` instead of `alert()`.
 */
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, variant }]);
      timers.current.push(
        setTimeout(() => dismissToast(id), AUTO_DISMISS_MS)
      );
    },
    [dismissToast]
  );

  // clear pending timers if the screen unmounts mid-toast
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return { toasts, showToast, dismissToast };
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "bg-[#1B2A52] text-white",
  error: "bg-[#D0202F] text-white",
};

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  // slide/fade in on first paint rather than pulling in an animation library
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium max-w-sm transition-all duration-200 ${
        VARIANT_STYLES[toast.variant]
      } ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="text-white/70 hover:text-white transition-colors leading-none"
      >
        &times;
      </button>
    </div>
  );
}
