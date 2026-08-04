import { Link } from 'react-router-dom';
import { formatValue } from '../data/deals';
import { cardNudge } from '../lib/suggestions';
import { ScoreBlock, ReasonTag } from './tags';
import { ChevronRight, MapPin, Lightbulb } from './Icons';

// Reusable ranked deal card. Leading score block answers "how urgent", the
// reason pills answer "why" (never a bare number), trailing chevron affords tap.
// Whole card is one large tap target (Fitts's Law) and a real link (Jakob's Law).

export default function DealCard({ deal }) {
  const { priority } = deal;
  // Condensed version of this deal's top Quick Wins suggestion (same source as
  // Deal Detail). Null when there's no active next step (e.g. a paused deal).
  const nudge = cardNudge(deal);
  return (
    <Link
      to={`/deals/${deal.id}`}
      className="focus-ring group block rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100 transition-all duration-150 hover:shadow-pop hover:ring-neutral-200 active:scale-[0.99]"
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-16 w-14 shrink-0 items-center justify-center rounded-xl ${
            priority.onHold ? 'bg-violet-50' : priority.label === 'High' ? 'bg-rose-50' : priority.label === 'Medium' ? 'bg-amber-50' : 'bg-neutral-50'
          }`}
        >
          <ScoreBlock label={priority.label} score={priority.score} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-ink">{deal.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{deal.location}</span>
              </p>
            </div>
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-500" />
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {deal.priority.reasons.map((r, i) => (
              <ReasonTag key={i} tone={r.tone}>{r.text}</ReasonTag>
            ))}
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-sm font-bold text-ink tabular-nums">{formatValue(deal.value)}</span>
            <span className="text-2xs font-medium text-ink-faint">{deal.stage}</span>
          </div>

          {/* Suggested next step — condensed Quick Wins for this deal. Muted so it
              never competes with the priority score. Omitted when there's no
              active next action (paused deals). */}
          {nudge && (
            <div className="mt-2.5 flex items-center gap-1.5 border-t border-neutral-100 pt-2.5 text-xs text-ink-muted">
              <Lightbulb className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
              <span className="truncate">{nudge}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
