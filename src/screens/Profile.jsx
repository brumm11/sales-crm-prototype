import { useDeals } from '../state/DealsContext';
import { personalStats } from '../lib/stats';
import ProgressRing from '../components/ProgressRing';
import { MapPin } from '../components/Icons';

// Profile — a simple, read-only info screen. Nothing here is tappable: no
// settings, no editing, no logout. Stats reuse the exact same figures shown on
// Home (via the shared personalStats helper), never re-invented.

export default function Profile() {
  const { deals } = useDeals();
  const { dealsManaged, activePipeline, achieved, target, targetPct } = personalStats(deals);
  const inLakh = (v) => `₹${Math.round(v / 100000)}L`;

  return (
    <div className="flex min-h-full flex-col px-5 py-8">
      {/* Identity */}
      <section className="flex flex-col items-center text-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-white ring-4 ring-white shadow-card"
          style={{ background: 'linear-gradient(140deg, #e8763a, #b7853a)' }}
          aria-hidden="true"
        >
          R
        </div>
        <h1 className="mt-4 text-2xl font-bold text-ink">Rahul Sharma</h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">Field Sales Associate</p>
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-ink-soft">
          <MapPin className="h-3.5 w-3.5 text-ink-faint" />
          Delhi NCR
        </div>
      </section>

      {/* Read-only stats — same numbers as Home */}
      <section className="mt-8 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100">
            <p className="text-2xl font-bold tabular-nums text-ink">{dealsManaged}</p>
            <p className="mt-1 text-xs font-medium text-ink-muted">Deals managed</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100">
            <p className="text-2xl font-bold tabular-nums text-ink">{inLakh(activePipeline)}</p>
            <p className="mt-1 text-xs font-medium text-ink-muted">Active pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100">
          <ProgressRing pct={targetPct} track="rgba(42,36,32,0.1)" arc="#e8763a" text="#2a2420" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Monthly target</p>
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
    </div>
  );
}
