// Circular progress indicator for the monthly target widget. Pure SVG, no deps.

export default function ProgressRing({ pct, size = 66, stroke = 7, track = 'rgba(255,255,255,0.12)', arc = '#f0925e', text = '#f6f0e7' }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped / 100);
  const center = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden="true">
      <circle cx={center} cy={center} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={arc}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill={text}
        style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em' }}
      >
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}
