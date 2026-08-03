import { AlertTriangle, Pause, FileClock, Smile, Meh, Frown, Sparkles } from './Icons';

// ---------------------------------------------------------------------------
// Meaning-carrying labels. Color is NEVER the only signal — every tag pairs its
// hue with a text label (and often an icon), so priority/sentiment/status read
// without relying on color (accessibility mandate).
// ---------------------------------------------------------------------------

// Reason pill tones → restrained, meaningful palette.
const reasonTone = {
  urgent: 'bg-rose-50 text-rose-700 ring-rose-100',
  warn: 'bg-amber-50 text-amber-700 ring-amber-100',
  positive: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  value: 'bg-accent-50 text-accent-700 ring-accent-100',
  hold: 'bg-violet-50 text-violet-700 ring-violet-100',
  neutral: 'bg-neutral-100 text-ink-soft ring-neutral-200',
};

export function ReasonTag({ tone = 'neutral', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-2xs font-semibold ring-1 ring-inset ${reasonTone[tone]}`}
    >
      {children}
    </span>
  );
}

// Priority label + score. High/Medium/Low each get a distinct swatch + text.
const priorityStyle = {
  High: { dot: 'bg-rose-500', text: 'text-rose-700', chip: 'bg-rose-50 ring-rose-100' },
  Medium: { dot: 'bg-amber-500', text: 'text-amber-700', chip: 'bg-amber-50 ring-amber-100' },
  Low: { dot: 'bg-neutral-400', text: 'text-ink-muted', chip: 'bg-neutral-100 ring-neutral-200' },
};

export function PriorityPill({ label, score }) {
  const s = priorityStyle[label];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-semibold ring-1 ring-inset ${s.chip} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {label} · {score}
    </span>
  );
}

// Big score number with its label, used on the deal card leading edge.
export function ScoreBlock({ label, score }) {
  const s = priorityStyle[label];
  return (
    <div className="flex flex-col items-center justify-center">
      <span className={`text-xl font-bold tabular-nums leading-none ${s.text}`}>{score}</span>
      <span className="mt-1 inline-flex items-center gap-1">
        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
        <span className="text-2xs font-semibold text-ink-muted">{label}</span>
      </span>
    </div>
  );
}

// Sentiment tag: colored label + required one-line reason handled by caller.
const sentimentStyle = {
  Positive: { icon: Smile, chip: 'bg-emerald-50 text-emerald-700 ring-emerald-100', bar: 'bg-emerald-500' },
  Neutral: { icon: Meh, chip: 'bg-neutral-100 text-ink-soft ring-neutral-200', bar: 'bg-neutral-400' },
  Negative: { icon: Frown, chip: 'bg-rose-50 text-rose-700 ring-rose-100', bar: 'bg-rose-500' },
};

export function SentimentBadge({ label }) {
  const s = sentimentStyle[label];
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${s.chip}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function sentimentBar(label) {
  return sentimentStyle[label].bar;
}

// Small stage/status chips used in the deal detail header.
export function MetaChip({ children }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-ink-soft">
      {children}
    </span>
  );
}

export { AlertTriangle, Pause, FileClock, Sparkles };
