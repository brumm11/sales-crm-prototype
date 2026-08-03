import { Link } from 'react-router-dom';
import { ChevronRight } from './Icons';

// Home-screen status counter that IS a filter trigger, not a readout.
// Clear affordance that it's tappable: icon tile, count, chevron, hover/press.

const toneMap = {
  attention: { tile: 'bg-rose-50 text-rose-600', ring: 'hover:ring-rose-200', num: 'text-rose-600' },
  hold: { tile: 'bg-violet-50 text-violet-600', ring: 'hover:ring-violet-200', num: 'text-violet-600' },
  docs: { tile: 'bg-amber-50 text-amber-600', ring: 'hover:ring-amber-200', num: 'text-amber-600' },
};

export default function StatusChip({ to, icon: Icon, label, count, tone, animateKey }) {
  const t = toneMap[tone];
  return (
    <Link
      to={to}
      className={`focus-ring group flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card ring-1 ring-neutral-100 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-pop ${t.ring} active:translate-y-0 active:scale-[0.98]`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.tile}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div key={animateKey} className={`animate-count-pulse text-xl font-bold tabular-nums leading-none ${t.num}`}>
          {count}
        </div>
        <div className="mt-1 truncate text-xs font-medium text-ink-muted">{label}</div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-500" />
    </Link>
  );
}
