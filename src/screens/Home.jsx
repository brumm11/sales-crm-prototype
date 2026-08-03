import { Link } from 'react-router-dom';
import { useDeals } from '../state/DealsContext';
import { useToast } from '../components/Toast';
import { todaysMeetings } from '../data/deals';
import { AlertTriangle, Pause, FileClock, Clock, ChevronRight, List, BarChart } from '../components/Icons';

// Screen 1 — Home. A fast morning entry point: who/when, today's (stubbed)
// meetings, and three status counters that route into the same deal list,
// pre-filtered. Home is a lens on the deal list, not a separate data view.
//
// Home uses a warm DARK treatment (charcoal canvas, elevated cards, terracotta
// + gold accents) as a distinct "dashboard" entry screen; the deal list and
// detail screens stay on the light warm theme.

export default function Home() {
  const { counts } = useDeals();
  const toast = useToast();

  return (
    <div className="min-h-full bg-[#181410] text-[#f4efe8]">
      <div className="flex flex-col gap-6 px-5 pb-12 pt-4">
        {/* Header */}
        <header className="flex items-start justify-between gap-3 pt-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#9a9082]">{formattedToday()}</p>
            <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-[#f6f2eb]">
              Good morning, Rahul
            </h1>
            <p className="mt-1.5 text-sm text-[#a89f92]">
              You have {counts.needsAttention} deal{counts.needsAttention === 1 ? '' : 's'} that need attention today.
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast('Insights view — coming soon')}
            aria-label="Insights"
            className="focus-ring mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-accent-500 transition-colors hover:bg-white/[0.08] active:bg-white/[0.06]"
          >
            <BarChart className="h-5 w-5" />
          </button>
        </header>

        {/* Status counters = filter triggers into My Deals */}
        <section aria-label="Deal status">
          <div className="grid grid-cols-1 gap-3">
            {/* Needs attention — wide, horizontal */}
            <Link
              to="/deals?filter=attention"
              className="focus-ring group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition-all duration-150 hover:bg-white/[0.06] active:scale-[0.99]"
            >
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-[#3c2a1c] text-accent-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div key={counts.needsAttention} className="animate-count-pulse text-2xl font-bold leading-none tabular-nums text-accent-500">
                  {counts.needsAttention}
                </div>
                <div className="mt-1.5 text-sm font-medium text-[#cdc4b6]">Needs attention</div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-[#6b6155] transition-colors group-hover:text-[#9a9082]" />
            </Link>

            {/* On hold + Pending docs — vertical cards */}
            <div className="grid grid-cols-2 gap-3">
              <VerticalStat
                to="/deals?filter=hold"
                icon={Pause}
                tile="bg-white/[0.06] text-[#c4bcb0]"
                label="On hold"
                count={counts.onHold}
                numClass="text-[#f4efe8]"
              />
              <VerticalStat
                to="/deals?filter=docs"
                icon={FileClock}
                tile="bg-[#332a1b] text-[#e4b673]"
                label="Pending docs"
                count={counts.pendingDocuments}
                numClass="text-[#e4b673]"
              />
            </div>
          </div>
        </section>

        {/* Today's meetings — clearly stubbed static data */}
        <section aria-label="Today's meetings">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#f4efe8]">Today&apos;s meetings</h2>
            <span className="text-xs font-medium text-[#8a8175]">{todaysMeetings.length} scheduled</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]">
            {todaysMeetings.map((m, i) => (
              <Link
                key={m.id}
                to={`/deals/${m.dealId}`}
                className={`focus-ring flex items-center gap-3 px-3.5 py-3.5 transition-colors hover:bg-white/[0.05] active:bg-white/[0.07] ${
                  i > 0 ? 'border-t border-white/[0.06]' : ''
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3a2c1e] text-accent-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#f4efe8]">{m.name}</p>
                  <p className="text-xs text-[#9a9082]">{m.kind}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-[#e7e0d5]">{m.time}</p>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#6b6155]" />
              </Link>
            ))}
          </div>
        </section>

        {/* View all deals */}
        <Link
          to="/deals"
          className="focus-ring group flex items-center justify-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.03] py-3.5 text-sm font-semibold text-[#f4efe8] transition-all hover:bg-white/[0.07] active:scale-[0.99]"
        >
          <List className="h-4.5 w-4.5 text-[#a89f92]" />
          View all deals
          <ChevronRight className="h-4 w-4 text-[#8a8175] transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

// A vertical status counter: icon + chevron on the top row, then big count, then label.
function VerticalStat({ to, icon: Icon, tile, label, count, numClass }) {
  return (
    <Link
      to={to}
      className="focus-ring group flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition-all duration-150 hover:bg-white/[0.06] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tile}`}>
          <Icon className="h-5 w-5" />
        </div>
        <ChevronRight className="h-4 w-4 text-[#6b6155] transition-colors group-hover:text-[#9a9082]" />
      </div>
      <div className="mt-6">
        <div key={count} className={`animate-count-pulse text-2xl font-bold leading-none tabular-nums ${numClass}`}>
          {count}
        </div>
        <div className="mt-1.5 text-sm font-medium text-[#a89f92]">{label}</div>
      </div>
    </Link>
  );
}

function formattedToday() {
  // App's static "today". Kept fixed so the prototype reads consistently.
  const d = new Date(2026, 7, 3); // 3 Aug 2026
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}
