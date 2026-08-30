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
// Light warm theme, consistent with My Deals / Deal Detail / Profile. The three
// status counters are clearly interactive (elevated cards + chevron affordance +
// hover/press), distinct from the flat, non-tappable stat/target widgets.

export default function Home() {
  const { counts, deals } = useDeals();
  const toast = useToast();

  // Shared derived stats (same source the Profile screen uses). visits is a
  // plausible static field-rep number.
  const { activePipeline, achieved, target, targetPct } = personalStats(deals);
  const pipelineLabel = `₹${Math.round(activePipeline / 100000)}L`;
  const visitsThisWeek = 16;
  const inLakh = (v) => `₹${Math.round(v / 100000)}L`;

  return (
    <div className="min-h-full">
      <div className="flex flex-col gap-6 px-5 pb-8 pt-4">
        {/* Top bar — app identifier + Rahul's profile avatar */}
        <header className="pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600 text-white">
                <Droplet className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-ink">Sales CRM</span>
            </div>
            <button
              type="button"
              onClick={() => toast('Signed in as Rahul Sharma')}
              aria-label="Your profile"
              className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-card ring-1 ring-black/5 transition-transform active:scale-95"
              style={{ background: 'linear-gradient(140deg, #e8763a, #b7853a)' }}
            >
              R
            </button>
          </div>

          {/* Greeting */}
          <div className="mt-6">
            <p className="text-sm font-medium text-ink-faint">{formattedToday()}</p>
            <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-ink">Good morning, Rahul</h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              You have {counts.needsAttention} deal{counts.needsAttention === 1 ? '' : 's'} that need attention today.
            </p>
          </div>
        </header>

        {/* Personal stats — Rahul's own week. Flat, non-interactive context. */}
        <section aria-label="Your week">
          <div className="grid grid-cols-2 gap-3">
            <StatTile icon={CalendarCheck} value={visitsThisWeek} label="Visits this week" tint="bg-accent-50" iconClass="text-accent-600" />
            <StatTile icon={Wallet} value={pipelineLabel} label="Active pipeline" tint="bg-emerald-50" iconClass="text-emerald-600" />
          </div>

          {/* Monthly target vs achieved — motivating context, not an action. */}
          <div className="mt-3 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100">
            <ProgressRing pct={targetPct} track="rgba(42,36,32,0.1)" arc="#e8763a" text="#2a2420" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Monthly target</span>
                <span className="text-2xs font-medium text-ink-faint">{targetPct}% achieved</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tabular-nums text-ink">{inLakh(achieved)}</span>
                <span className="text-sm text-ink-muted">of {inLakh(target)} goal</span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full rounded-full bg-accent-600" style={{ width: `${targetPct}%` }} />
              </div>
            </div>
          </div>
        </section>

        {/* Status counters = tappable filter triggers into My Deals */}
        <section aria-label="Deal status">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Where to start</h2>
            <span className="text-2xs font-semibold uppercase tracking-wide text-ink-faint">Tap to filter</span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            <CounterCard wide to="/deals?filter=attention" icon={AlertTriangle} tone="attention" label="Needs attention" count={counts.needsAttention} />
            <div className="grid grid-cols-2 gap-2.5">
              <CounterCard to="/deals?filter=hold" icon={Pause} tone="hold" label="On hold" count={counts.onHold} />
              <CounterCard to="/deals?filter=docs" icon={FileClock} tone="docs" label="Pending docs" count={counts.pendingDocuments} />
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
                className={`focus-ring flex items-center gap-3 px-3.5 py-3.5 transition-colors hover:bg-neutral-50 active:bg-neutral-100 ${
                  i > 0 ? 'border-t border-neutral-100' : ''
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{m.name}</p>
                  <p className="text-xs text-ink-muted">{m.kind}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-ink">{m.time}</p>
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
    </div>
  );
}

// A personal stat tile — flat, subtly colored, non-interactive (no shadow, no
// chevron) so it reads as context rather than an action.
function StatTile({ icon: Icon, value, label, tint, iconClass }) {
  return (
    <div className={`rounded-2xl p-3.5 ${tint}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-[18px] w-[18px] shrink-0 ${iconClass}`} />
        <span className="text-2xl font-bold leading-none tabular-nums text-ink">{value}</span>
      </div>
      <div className="mt-1.5 text-xs font-medium text-ink-muted">{label}</div>
    </div>
  );
}

// Colour + hover styling per status. Meaningful colour, paired with label/icon.
const COUNTER = {
  attention: { tile: 'bg-rose-50 text-rose-600', num: 'text-rose-600', ring: 'hover:ring-rose-200', chev: 'group-hover:bg-rose-100 group-hover:text-rose-600' },
  hold: { tile: 'bg-violet-50 text-violet-600', num: 'text-violet-700', ring: 'hover:ring-violet-200', chev: 'group-hover:bg-violet-100 group-hover:text-violet-700' },
  docs: { tile: 'bg-amber-50 text-amber-600', num: 'text-amber-700', ring: 'hover:ring-amber-200', chev: 'group-hover:bg-amber-100 group-hover:text-amber-700' },
};

// A tappable status counter → filters My Deals. Elevated card + coloured icon
// tile + a chevron in a pill, with a hover lift and press — reads clearly as a
// button, distinct from the flat stat tiles above.
function CounterCard({ to, icon: Icon, tone, label, count, wide }) {
  const c = COUNTER[tone];
  const chip = (size) => (
    <span className={`flex ${size} items-center justify-center rounded-full bg-neutral-100 text-ink-muted transition-colors ${c.chev}`}>
      <ChevronRight className="h-4 w-4" />
    </span>
  );

  if (wide) {
    return (
      <Link
        to={to}
        className={`focus-ring group flex items-center gap-3.5 rounded-2xl bg-white p-3.5 shadow-card ring-1 ring-neutral-100 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-pop ${c.ring} active:translate-y-0 active:scale-[0.99]`}
      >
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.tile}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div key={count} className={`animate-count-pulse text-2xl font-bold leading-none tabular-nums ${c.num}`}>{count}</div>
          <div className="mt-1 text-sm font-semibold text-ink">{label}</div>
        </div>
        {chip('h-7 w-7')}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`focus-ring group flex flex-col justify-between rounded-2xl bg-white p-3.5 shadow-card ring-1 ring-neutral-100 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-pop ${c.ring} active:translate-y-0 active:scale-[0.98]`}
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.tile}`}>
          <Icon className="h-5 w-5" />
        </div>
        {chip('h-6 w-6')}
      </div>
      <div className="mt-5">
        <div key={count} className={`animate-count-pulse text-2xl font-bold leading-none tabular-nums ${c.num}`}>{count}</div>
        <div className="mt-1 text-sm font-semibold text-ink">{label}</div>
      </div>
    </Link>
  );
}

function formattedToday() {
  // App's static "today". Kept fixed so the prototype reads consistently.
  const d = new Date(2026, 7, 3); // 3 Aug 2026
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}
