// Simulated iOS status bar + Dynamic Island.
// A real phone draws these itself (OS chrome); in a browser they don't exist,
// so we fake them to complete the "this is a phone app" framing. Theme-aware:
// light glyphs on the dark Home, dark glyphs on the light screens.

export default function StatusBar({ dark }) {
  const fg = dark ? '#f4efe8' : '#2a2420';
  return (
    <div className="relative z-40 flex h-12 shrink-0 select-none items-center justify-between px-6" style={{ color: fg }}>
      {/* Time */}
      <span className="text-[15px] font-semibold tracking-tight tabular-nums">9:41</span>

      {/* Dynamic Island — the camera cutout is always physically black */}
      <span
        className="absolute left-1/2 top-2 h-[26px] w-[95px] -translate-x-1/2 rounded-full bg-black"
        aria-hidden="true"
      />

      {/* Right cluster: cellular, wi-fi, battery */}
      <div className="flex items-center gap-1.5" style={{ color: fg }} aria-hidden="true">
        <Cellular />
        <Wifi />
        <Battery />
      </div>
    </div>
  );
}

function Cellular() {
  // Four ascending bars, all full (strong signal).
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="9" y="3" width="3" height="9" rx="1" />
      <rect x="13.5" y="0.5" width="3" height="11.5" rx="1" />
    </svg>
  );
}

function Wifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 2.2c2.5 0 4.8 1 6.5 2.6l-1.4 1.5A7.4 7.4 0 0 0 8 4.3 7.4 7.4 0 0 0 2.9 6.3L1.5 4.8A9.4 9.4 0 0 1 8 2.2Z" />
      <path d="M8 5.8c1.5 0 2.9.6 3.9 1.6l-1.5 1.5A3.4 3.4 0 0 0 8 7.9c-.9 0-1.8.4-2.4 1l-1.5-1.5A5.4 5.4 0 0 1 8 5.8Z" />
      <circle cx="8" cy="10.4" r="1.4" />
    </svg>
  );
}

function Battery() {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
      <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
      <rect x="24" y="4" width="1.6" height="5" rx="0.8" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}
