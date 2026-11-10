import { useEffect } from 'react';
import { X } from 'lucide-react';

const DISMISS_AFTER_MS = 6000;

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onDismiss, DISMISS_AFTER_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[80] max-w-[calc(100vw-2rem)]"
    >
      {message && (
        <div className="chamfer-br flex items-start gap-4 border-l-2 border-green bg-surface py-4 pl-5 pr-4 shadow-[0_12px_40px_rgb(var(--color-black)/0.6)]">
          <p className="font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-ink">
            {message}
          </p>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="-m-1 p-1 text-muted transition-colors hover:text-ink"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}
