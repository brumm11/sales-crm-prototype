import { Link } from 'react-router-dom';
import { useDeals } from '../state/DealsContext';
import { useToast } from '../components/Toast';
import { todaysMeetings } from '../data/deals';
import { personalStats } from '../lib/stats';
import ProgressRing from '../components/ProgressRing';
import { AlertTriangle, Pause, FileClock, Clock, ChevronRight, List, Droplet, CalendarCheck, Wallet } from '../components/Icons';

// Screen 1 — Home. A fast morning entry point: who/when, today's (stubbed)
// meetings, and three status counters that route into the same deal list,
// pre-filtered. Home is a lens on the deal list, not a separate data view.
//
// Home uses a warm DARK treatment (charcoal canvas, elevated cards, terracotta
// + gold accents) as a distinct "dashboard" entry screen; the deal list and
// detail screens stay on the light warm theme.

export default function Home() {
  const { counts, deals } = useDeals();
  const toast = useToast();

  // Rahul's own week — shared derived stats (same source the Profile screen uses).
  // visits is a plausible static field-rep number.
  const { activePipeline, achieved, target, targetPct } = personalStats(deals);
  const pipelineLabel = `₹${Math.round(activePipeline / 100000)}L`;
  const visitsThisWeek = 16;
  const inLakh = (v) => `₹${Math.round(v / 100000)}L`;

  return (
    <div className="min-h-full bg-[#181410] text-[#f4efe8]">
      <div className="flex flex-col gap-6 px-5 pb-12 pt-4">
        {/* Top bar — app identifier + Rahul's profile avatar */}
        <header className="pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600 text-white">
                <Droplet className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-[#f4efe8]">Syook</span>
            </div>
            <button
              type="button"
              onClick={() => toast('Signed in as Rahul Sharma')}
              aria-label="Your profile"
              className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-1 ring-white/15 transition-transform active:scale-95"
              style={{ background: 'linear-gradient(140deg, #e8763a, #b7853a)' }}
            >
              R
            </button>
          </div>

          {/* Greeting */}
          <div className="mt-6">
            <p className="text-sm font-medium text-[#9a9082]">{formattedToday()}</p>
            <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-[#f6f2eb]">
              Good morning, Rahul
            </h1>
            <p className="mt-1.5 text-sm text-[#a89f92]">
              You have {counts.needsAttention} deal{counts.needsAttention === 1 ? '' : 's'} that need attention today.
            </p>
          </div>
        </header>

        {/* Personal stats — Rahul's own week. Pure context, NOT actions: no
            navigation, no chevron. Muted colored tiles, kept shorter and less
            saturated than the actionable status counters below so they stay
            visually secondary. */}
        <section aria-label="Your week">
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              icon={CalendarCheck}
              value={visitsThisWeek}
              label="Visits this week"
              grad="linear-gradient(140deg, #3a2a1d, #2a2016)"
              iconClass="text-[#f0925e]"
            />
            <StatTile
              icon={Wallet}
              value={pipelineLabel}
              label="Active pipeline"
              grad="linear-gradient(140deg, #21302b, #1a2620)"
              iconClass="text-[#8fc47a]"
            />
          </div>

          {/* Monthly target vs achieved — motivating context, not an action.
              Not tappable. Kept secondary to the status counters below. */}
          <div className="mt-3 flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
            <ProgressRing pct={targetPct} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#9a9082]">Monthly target</span>
                <span className="text-2xs font-medium text-[#8a8175]">{targetPct}% achieved</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tabular-nums text-[#f6f0e7]">{inLakh(achieved)}</span>
                <span className="text-sm text-[#8a8175]">of {inLakh(target)} goal</span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                <div className="h-full rounded-full bg-accent-500" style={{ width: `${targetPct}%` }} />
              </div>
            </div>
          </div>
        </section>

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
                  <p className="truncate text-sm font-bold text-[#f4efe8]">{m.name}</p>
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

// A personal stat tile — colored but muted, compact, non-interactive.
function StatTile({ icon: Icon, value, label, grad, iconClass }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] p-3.5" style={{ background: grad }}>
      <div className="flex items-center gap-2">
        <Icon className={`h-[18px] w-[18px] shrink-0 ${iconClass}`} />
        <span className="text-2xl font-bold leading-none tabular-nums text-[#f6f0e7]">{value}</span>
      </div>
      <div className="mt-1.5 text-xs font-medium text-[#a89f8f]">{label}</div>
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
