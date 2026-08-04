import { Link, useLocation } from 'react-router-dom';
import { House, LayerGrid, User } from './Icons';

// App-level bottom navigation. Home + Deals route to the real working screens;
// Profile is an intentional "coming soon" stub (never a dead tap). Theme-aware
// so it reads native on the dark Home and the light content screens. Rendered
// by the Shell on top-level screens only — hidden on the nested Deal Detail so
// it never fights that screen's own sticky action bar or its back navigation.

const TABS = [
  { to: '/', label: 'Home', icon: House, match: (p) => p === '/' },
  { to: '/deals', label: 'Deals', icon: LayerGrid, match: (p) => p.startsWith('/deals') },
  { to: '/profile', label: 'Profile', icon: User, match: (p) => p.startsWith('/profile') },
];

export default function BottomNav({ dark }) {
  const { pathname } = useLocation();

  const border = dark ? 'border-white/[0.08]' : 'border-neutral-200/70';
  const bg = dark ? 'bg-[#181410]/95' : 'bg-white/95';
  const activeColor = dark ? 'text-accent-500' : 'text-accent-600';
  const idleColor = dark ? 'text-[#7d756a]' : 'text-ink-faint';

  return (
    <nav
      className={`z-30 flex shrink-0 items-stretch border-t ${border} ${bg} px-2 pt-1.5 backdrop-blur-md`}
      style={{ paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))' }}
      aria-label="Primary"
    >
      {TABS.map((t) => {
        const active = t.match(pathname);
        const Icon = t.icon;
        return (
          <Link
            key={t.to}
            to={t.to}
            aria-current={active ? 'page' : undefined}
            className={`focus-ring flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-colors ${
              active ? activeColor : `${idleColor} hover:${dark ? 'text-[#a89f92]' : 'text-ink-muted'}`
            }`}
          >
            <Icon className="h-[22px] w-[22px]" />
            <span className={`text-[11px] leading-none ${active ? 'font-bold' : 'font-medium'}`}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
