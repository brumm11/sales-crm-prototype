// Inline SVG icons. Control/directional glyphs are stroke-based at weight 2 for
// real presence (not a hairline); semantic icons (alert, pause, doc, pin) are
// filled/duotone so they carry visual weight in tiles, counters and cards.
// Sized via className (default 20px).

function Svg({ children, className = 'w-5 h-5', ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

// Base for filled/duotone glyphs.
function FillSvg({ children, className = 'w-5 h-5', ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const ChevronRight = (p) => (
  <Svg {...p}><path d="M9 6l6 6-6 6" /></Svg>
);
export const ChevronLeft = (p) => (
  <Svg {...p}><path d="M15 6l-6 6 6 6" /></Svg>
);
export const AlertTriangle = (p) => (
  <FillSvg {...p}>
    <path opacity="0.28" d="M10.7 3.6a1.5 1.5 0 0 1 2.6 0l8.2 14.6a1.5 1.5 0 0 1-1.3 2.24H3.8a1.5 1.5 0 0 1-1.3-2.24L10.7 3.6Z" />
    <path d="M12 8.2a1 1 0 0 1 1 1v3.6a1 1 0 1 1-2 0V9.2a1 1 0 0 1 1-1Zm0 8.8a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" />
  </FillSvg>
);
export const Pause = (p) => (
  <FillSvg {...p}>
    <rect x="6.5" y="5" width="4" height="14" rx="1.6" />
    <rect x="13.5" y="5" width="4" height="14" rx="1.6" />
  </FillSvg>
);
export const FileClock = (p) => (
  <FillSvg {...p}>
    <path opacity="0.3" d="M6 2h6.5L18 7.5V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Z" />
    <path d="M16.5 12a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.9a1 1 0 0 0-1 1v1.6c0 .27.11.52.3.71l1 1a1 1 0 0 0 1.4-1.42l-.7-.7V14.9a1 1 0 0 0-1-1Z" />
  </FillSvg>
);
export const Clock = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>
);
export const MapPin = (p) => (
  <FillSvg {...p}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 5.05 6 11.7 7 12.76a.7.7 0 0 0 1 0c1-1.06 7-7.71 7-12.76A7.5 7.5 0 0 0 12 2Zm0 10a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
  </FillSvg>
);
export const Check = (p) => (
  <Svg {...p}><path d="M20 6 9 17l-5-5" /></Svg>
);
export const CheckCircle = (p) => (
  <Svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m22 4-10 10.01-3-3" /></Svg>
);
export const Plus = (p) => (
  <Svg {...p}><path d="M12 5v14" /><path d="M5 12h14" /></Svg>
);
export const Upload = (p) => (
  <Svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5-5 5 5" /><path d="M12 5v12" /></Svg>
);
export const X = (p) => (
  <Svg {...p}><path d="M18 6 6 18" /><path d="M6 6l12 12" /></Svg>
);
export const Sparkles = (p) => (
  <Svg {...p}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
    <path d="M19 14l.7 1.9L21.6 17l-1.9.7L19 19.6l-.7-1.9L16.4 17l1.9-.7L19 14Z" />
  </Svg>
);
export const Smile = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></Svg>
);
export const Meh = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M8 15h8" /><path d="M9 9h.01" /><path d="M15 9h.01" /></Svg>
);
export const Frown = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></Svg>
);
export const Calendar = (p) => (
  <Svg {...p}><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18" /><path d="M8 3v3" /><path d="M16 3v3" /></Svg>
);
export const NotePen = (p) => (
  <Svg {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
  </Svg>
);
// Filled icons (real visual weight, not 1px stroke) — used by stat tiles etc.
export function CalendarCheck({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm13 7H4v10h16V9Zm-3.8 2.3a1 1 0 0 1 .1 1.4l-3.5 4a1 1 0 0 1-1.45.06l-1.9-1.9a1 1 0 1 1 1.4-1.42l1.14 1.14 2.8-3.2a1 1 0 0 1 1.4-.12Z" />
    </svg>
  );
}
export function Wallet({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4 6a3 3 0 0 1 3-3h10a1 1 0 1 1 0 2H7a1 1 0 0 0 0 2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm13 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}
export function House({ className = 'w-5 h-5' }) {
  return (
    <FillSvg className={className}>
      <path d="M11.3 2.7a1 1 0 0 1 1.4 0l8 7.5c.2.2.3.45.3.73V20a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-4a1.5 1.5 0 0 0-3 0v4a1 1 0 0 1-1 1H3.9a1 1 0 0 1-1-1v-9.07c0-.28.11-.53.3-.73l8.1-7.5Z" />
    </FillSvg>
  );
}
export function User({ className = 'w-5 h-5' }) {
  return (
    <FillSvg className={className}>
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 1.5c-3.9 0-7 2.35-7 5.25 0 .69.56 1.25 1.25 1.25h11.5c.69 0 1.25-.56 1.25-1.25 0-2.9-3.1-5.25-7-5.25Z" />
    </FillSvg>
  );
}
export function LayerGrid({ className = 'w-5 h-5' }) {
  return (
    <FillSvg className={className}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </FillSvg>
  );
}

// App brand mark — a paint droplet (fits the paints-dealer context).
export function Droplet({ className = 'w-5 h-5' }) {
  return (
    <FillSvg className={className}>
      <path d="M12 2.6c.3 0 .6.15.78.4C14.3 5 18.5 10.7 18.5 14.3a6.5 6.5 0 0 1-13 0c0-3.6 4.2-9.3 5.72-11.3.18-.25.48-.4.78-.4Z" />
    </FillSvg>
  );
}
export const BarChart = (p) => (
  <Svg {...p}>
    <path d="M7 15v3" /><path d="M12 10v8" /><path d="M17 6v12" />
  </Svg>
);
export const Lightbulb = (p) => (
  <Svg {...p}>
    <path d="M9 18h6" /><path d="M10 21h4" />
    <path d="M12 3a6 6 0 0 0-4 10.5c.5.5 1 1.2 1 2.5h6c0-1.3.5-2 1-2.5A6 6 0 0 0 12 3Z" />
  </Svg>
);
export const List = (p) => (
  <Svg {...p}><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></Svg>
);
export const Search = (p) => (
  <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
);
export const Inbox = (p) => (
  <Svg {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" /></Svg>
);

// File-type glyphs for the documents list.
export function FileGlyph({ type, className = 'w-5 h-5' }) {
  return (
    <Svg className={className}>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M19 8v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5Z" />
    </Svg>
  );
}
