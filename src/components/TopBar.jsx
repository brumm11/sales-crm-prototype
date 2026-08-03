import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from './Icons';

// Sticky top bar with a back affordance. Translucent blur on scroll, like iOS.

export default function TopBar({ title, subtitle, right, onBack, fallback = '/' }) {
  const navigate = useNavigate();
  const back = () => {
    if (onBack) return onBack();
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback);
  };
  return (
    <div className="sticky top-0 z-30 border-b border-neutral-100 bg-white/85 backdrop-blur-md">
      <div className="flex h-14 items-center gap-1 px-2">
        <button
          onClick={back}
          aria-label="Go back"
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-neutral-100 active:bg-neutral-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold leading-tight text-ink">{title}</h1>
          {subtitle && <p className="truncate text-xs leading-tight text-ink-faint">{subtitle}</p>}
        </div>
        {right && <div className="pr-1">{right}</div>}
      </div>
    </div>
  );
}
