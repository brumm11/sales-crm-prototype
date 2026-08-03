import { Link } from 'react-router-dom';
import { useDeals } from '../state/DealsContext';
import { todaysMeetings } from '../data/deals';
import StatusChip from '../components/StatusChip';
import { AlertTriangle, Pause, FileClock, Clock, ChevronRight, List } from '../components/Icons';

// Screen 1 — Home. A fast morning entry point: who/when, today's (stubbed)
// meetings, and three status counters that route into the same deal list,
// pre-filtered. Home is a lens on the deal list, not a separate data view.

export default function Home() {
  const { counts } = useDeals();

  return (
    <div className="flex flex-col gap-6 px-5 pb-10 pt-3">
      {/* Header */}
      <header className="pt-2">
        <p className="text-sm font-medium text-ink-faint">{formattedToday()}</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">Good morning, Rahul</h1>
        <p className="mt-1 text-sm text-ink-muted">
          You have {counts.needsAttention} deal{counts.needsAttention === 1 ? '' : 's'} that need attention today.
        </p>
      </header>

      {/* Status counters = filter triggers into My Deals */}
      <section aria-label="Deal status">
        <div className="grid grid-cols-1 gap-2.5">
          <StatusChip
            to="/deals?filter=attention"
            icon={AlertTriangle}
            tone="attention"
            label="Needs attention"
            count={counts.needsAttention}
            animateKey={counts.needsAttention}
          />
          <div className="grid grid-cols-2 gap-2.5">
            <StatusChip
              to="/deals?filter=hold"
              icon={Pause}
              tone="hold"
              label="On hold"
              count={counts.onHold}
              animateKey={counts.onHold}
            />
            <StatusChip
              to="/deals?filter=docs"
              icon={FileClock}
              tone="docs"
              label="Pending docs"
              count={counts.pendingDocuments}
              animateKey={counts.pendingDocuments}
            />
          </div>
        </div>
      </section>

      {/* Today's meetings — clearly stubbed static data */}
      <section aria-label="Today's meetings">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Today&apos;s meetings</h2>
          <span className="text-2xs font-medium text-ink-faint">{todaysMeetings.length} scheduled</span>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-neutral-100">
          {todaysMeetings.map((m, i) => (
            <Link
              key={m.id}
              to={`/deals/${m.dealId}`}
              className={`focus-ring flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-neutral-50 active:bg-neutral-100 ${
                i > 0 ? 'border-t border-neutral-100' : ''
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
                <p className="text-xs text-ink-muted">{m.kind}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink tabular-nums">{m.time}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* View all deals */}
      <Link
        to="/deals"
        className="focus-ring group flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-3.5 text-sm font-semibold text-ink shadow-card transition-all hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.99]"
      >
        <List className="h-4.5 w-4.5 text-ink-muted" />
        View all deals
        <ChevronRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function formattedToday() {
  // App's static "today". Kept fixed so the prototype reads consistently.
  const d = new Date(2026, 7, 3); // 3 Aug 2026
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}
