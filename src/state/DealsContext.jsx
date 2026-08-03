import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { initialDeals } from '../data/deals';
import { computePriority } from '../lib/priority';

// ---------------------------------------------------------------------------
// One in-memory source of truth for every deal, shared across all screens.
// Actions taken on Deal Detail (mark update, toggle hold, upload, add note)
// mutate the raw signals here, so the priority score on My Deals recomputes and
// visibly reflects the change — the whole point of the prototype's loop.
// State is session-only; a refresh resets to the seed data.
// ---------------------------------------------------------------------------

const DealsContext = createContext(null);

let noteSeq = 1000;
let docSeq = 2000;

export function DealsProvider({ children }) {
  const [deals, setDeals] = useState(initialDeals);

  const markUpdate = useCallback((id) => {
    // "I touched this deal today" — resets the staleness signal to 0 days.
    setDeals((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, lastUpdatedDaysAgo: 0 } : d
      )
    );
  }, []);

  const toggleHold = useCallback((id) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, onHold: !d.onHold, nextMeeting: !d.onHold ? 'Paused' : 'To be scheduled' }
          : d
      )
    );
  }, []);

  const addDocument = useCallback((id, fileName) => {
    // Fake upload: a new doc appears and one "pending document" is cleared.
    const type = guessType(fileName);
    setDeals((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              lastUpdatedDaysAgo: 0,
              pendingDocsCount: Math.max(0, d.pendingDocsCount - 1),
              documents: [
                { id: `up-${docSeq++}`, name: fileName, type, size: freshSize(), isNew: true },
                ...d.documents,
              ],
            }
          : d
      )
    );
  }, []);

  const addNote = useCallback((id, text) => {
    // Logging a note is also "touching" the deal → resets staleness.
    setDeals((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              lastUpdatedDaysAgo: 0,
              notes: [{ id: `note-${noteSeq++}`, daysAgo: 0, text, isNew: true }, ...d.notes],
            }
          : d
      )
    );
  }, []);

  // Derived view: every deal decorated with its computed priority.
  const rankedDeals = useMemo(() => {
    return deals
      .map((d) => ({ ...d, priority: computePriority(d) }))
      .sort((a, b) => b.priority.score - a.priority.score);
  }, [deals]);

  const counts = useMemo(() => {
    let needsAttention = 0;
    let onHold = 0;
    let pendingDocuments = 0;
    for (const d of rankedDeals) {
      if (d.priority.needsAttention) needsAttention += 1;
      if (d.priority.onHold) onHold += 1;
      if (d.priority.hasPendingDocs) pendingDocuments += 1;
    }
    return { needsAttention, onHold, pendingDocuments };
  }, [rankedDeals]);

  const getDeal = useCallback(
    (id) => rankedDeals.find((d) => d.id === id) || null,
    [rankedDeals]
  );

  const value = useMemo(
    () => ({ deals: rankedDeals, counts, getDeal, markUpdate, toggleHold, addDocument, addNote }),
    [rankedDeals, counts, getDeal, markUpdate, toggleHold, addDocument, addNote]
  );

  return <DealsContext.Provider value={value}>{children}</DealsContext.Provider>;
}

export function useDeals() {
  const ctx = useContext(DealsContext);
  if (!ctx) throw new Error('useDeals must be used within a DealsProvider');
  return ctx;
}

function guessType(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return 'pdf';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls';
  if (['jpg', 'jpeg', 'png', 'heic', 'webp'].includes(ext)) return 'img';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'file';
}

function freshSize() {
  const kb = 200 + Math.floor(Math.random() * 1600);
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}
