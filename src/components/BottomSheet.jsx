import { useEffect } from 'react';
import { X } from './Icons';

// Bottom sheet — the pattern users know from native mobile apps (Jakob's Law).
// Slides up over a scrim, closes on scrim tap / Escape / the close button.

export default function BottomSheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-[1px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full animate-sheet-up rounded-t-3xl bg-white pb-6 shadow-sheet"
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <div className="mx-auto absolute left-1/2 top-2.5 h-1 w-9 -translate-x-1/2 rounded-full bg-neutral-200" />
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="focus-ring -mr-2 flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-neutral-100 active:bg-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5">{children}</div>
      </div>
    </div>
  );
}
