import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, label, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const root = document.documentElement;

    dialog.showModal();
    root.style.overflow = 'hidden';

    return () => {
      dialog.close();
      root.style.overflow = '';
      trigger?.focus?.();
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto border border-line bg-carbon p-0 text-muted backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="relative p-5 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${label}`}
            className="absolute right-3 top-3 p-2 text-muted transition-colors hover:text-ink"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
