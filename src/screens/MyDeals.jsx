import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDeals } from '../state/DealsContext';
import TopBar from '../components/TopBar';
import DealCard from '../components/DealCard';
import { AlertTriangle, Pause, FileClock, List, Inbox, Search, X } from '../components/Icons';

// Screen 2 — My Deals. The ranked "who do I visit next" list. Sorted by
// priority score descending. Filter chips (shared with Home's counters) narrow
// the list; an explicit empty state covers a filter with zero results.

const FILTERS = [
  { key: 'all', label: 'All', icon: List },
  { key: 'attention', label: 'Needs attention', icon: AlertTriangle },
  { key: 'hold', label: 'On hold', icon: Pause },
  { key: 'docs', label: 'Pending docs', icon: FileClock },
];

const emptyCopy = {
  attention: {
    title: 'Nothing urgent right now',
    body: 'No deals are flagged for attention. Anything paused or on-hold is intentionally kept out of this view.',
  },
  hold: {
    title: 'No deals on hold',
    body: 'Nothing is paused. Deals you toggle to “On hold” from a deal’s page will collect here.',
  },
  docs: {
    title: 'No pending documents',
    body: 'Every deal has its paperwork in order. Nice — nothing to chase.',
  },
  all: { title: 'No deals yet', body: 'Your deals will appear here.' },
};

export default function MyDeals() {
  const { deals } = useDeals();
  const [params, setParams] = useSearchParams();
  const active = params.get('filter') || 'all';
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  // Tab filter and search apply together: pick the tab's subset, then narrow by
  // a case-insensitive partial match on the company name.
  const filtered = useMemo(() => {
    let list;
    switch (active) {
      case 'attention': list = deals.filter((d) => d.priority.needsAttention); break;
      case 'hold': list = deals.filter((d) => d.priority.onHold); break;
      case 'docs': list = deals.filter((d) => d.priority.hasPendingDocs); break;
      default: list = deals;
    }
    if (q) list = list.filter((d) => d.name.toLowerCase().includes(q));
    return list;
  }, [deals, active, q]);

  const setFilter = (key) => {
    if (key === 'all') setParams({}, { replace: true });
    else setParams({ filter: key }, { replace: true });
  };

  const subtitle = `${filtered.length} deal${filtered.length === 1 ? '' : 's'} · ranked by priority`;

  return (
    <div className="flex min-h-full flex-col">
      <TopBar title="My Deals" subtitle={subtitle} fallback="/" />

      {/* Search + filter chips — one sticky block below the top bar */}
      <div className="sticky top-14 z-20 border-b border-neutral-100 bg-white/85 px-5 pb-3 pt-3 backdrop-blur-md">
        {/* Search / jump to account by company name */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals..."
            aria-label="Search deals by company name"
            className="focus-ring w-full rounded-full border border-neutral-200 bg-neutral-100 py-2.5 pl-10 pr-9 text-sm font-medium text-ink placeholder:font-normal placeholder:text-neutral-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="focus-ring absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-neutral-200 active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter chips — horizontally scrollable, no wrap, no layout shift */}
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => {
            const on = active === f.key;
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={on}
                className={`focus-ring flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-150 active:scale-[0.96] ${
                  on
                    ? 'bg-ink text-white shadow-sm'
                    : 'bg-neutral-100 text-ink-soft hover:bg-neutral-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List / empty state */}
      <div className="flex-1 px-5 py-4">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        ) : q ? (
          <SearchEmpty query={query.trim()} onClear={() => setQuery('')} />
        ) : (
          <EmptyState filter={active} onReset={() => setFilter('all')} />
        )}
      </div>
    </div>
  );
}

function SearchEmpty({ query, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center shadow-card ring-1 ring-neutral-100">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
        <Search className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink">No deals match</h3>
      <p className="mt-1.5 max-w-[16rem] text-sm text-ink-muted">
        Nothing matches “{query}” here. Try a different name or clear the search.
      </p>
      <button
        onClick={onClear}
        className="focus-ring mt-5 rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold text-ink-soft transition-colors hover:bg-neutral-200 active:scale-[0.97]"
      >
        Clear search
      </button>
    </div>
  );
}

function EmptyState({ filter, onReset }) {
  const copy = emptyCopy[filter] || emptyCopy.all;
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center shadow-card ring-1 ring-neutral-100">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink">{copy.title}</h3>
      <p className="mt-1.5 max-w-[16rem] text-sm text-ink-muted">{copy.body}</p>
      <button
        onClick={onReset}
        className="focus-ring mt-5 rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold text-ink-soft transition-colors hover:bg-neutral-200 active:scale-[0.97]"
      >
        View all deals
      </button>
    </div>
  );
}
