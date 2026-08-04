import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDeals } from '../state/DealsContext';
import { useToast } from '../components/Toast';
import { formatValue } from '../data/deals';
import { suggestActions } from '../lib/suggestions';
import TopBar from '../components/TopBar';
import Button from '../components/Button';
import BottomSheet from '../components/BottomSheet';
import {
  PriorityPill,
  SentimentBadge,
  sentimentBar,
  MetaChip,
  ReasonTag,
} from '../components/tags';
import {
  Sparkles,
  Lightbulb,
  FileGlyph,
  Upload,
  Plus,
  Check,
  Pause,
  Clock,
  Calendar,
  NotePen,
  MapPin,
  CheckCircle,
} from '../components/Icons';

// Screen 3 — Deal detail. Everything Rahul needs before/at a visit, plus the
// four field actions that feed the prioritisation logic. Actions here mutate
// shared state, so the priority card below updates live and the change is
// reflected back on My Deals.

export default function DealDetail() {
  const { id } = useParams();
  const { getDeal, markUpdate, toggleHold, addDocument, addNote } = useDeals();
  const toast = useToast();
  const deal = getDeal(id);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [marking, setMarking] = useState(false);
  const [holdBusy, setHoldBusy] = useState(false);

  if (!deal) return <NotFound />;

  const { priority } = deal;
  // Rule-based next steps, derived live from the same signals as the priority
  // score and sentiment — so they update when Rahul acts on the deal.
  const suggestions = suggestActions(deal);

  const handleMarkUpdate = () => {
    if (deal.lastUpdatedDaysAgo === 0 || marking) return;
    setMarking(true);
    // Brief loading beat so the state change feels real, not instant/silent.
    setTimeout(() => {
      markUpdate(deal.id);
      setMarking(false);
      toast('Marked as updated today');
    }, 550);
  };

  const handleToggleHold = () => {
    if (holdBusy) return;
    setHoldBusy(true);
    setTimeout(() => {
      toggleHold(deal.id);
      setHoldBusy(false);
      toast(deal.onHold ? 'Deal resumed' : 'Deal put on hold');
    }, 350);
  };

  return (
    <div className="flex min-h-full flex-col bg-neutral-50/60">
      <TopBar
        title={deal.name}
        subtitle={deal.location}
        fallback="/deals"
        right={<PriorityPill label={priority.label} score={priority.score} />}
      />

      <div className="flex flex-col gap-3 px-5 py-4 pb-8">
        {/* Header block */}
        <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-ink">{deal.name}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-ink-faint">
                <MapPin className="h-3.5 w-3.5" /> {deal.location}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tabular-nums text-ink">{formatValue(deal.value)}</p>
              <p className="text-2xs font-medium text-ink-faint">deal value</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <MetaChip>{deal.stage}</MetaChip>
            <MetaChip>Owner · Rahul</MetaChip>
            <MetaChip>
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {deal.nextMeeting}
            </MetaChip>
          </div>
        </section>

        {/* Live priority reflection — reacts to the actions below */}
        <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Priority</h3>
            <PriorityPill label={priority.label} score={priority.score} />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {priority.reasons.length > 0 ? (
              priority.reasons.map((r, i) => (
                <ReasonTag key={i} tone={r.tone}>{r.text}</ReasonTag>
              ))
            ) : (
              <span className="text-xs text-ink-muted">No urgency signals — this deal is calm right now.</span>
            )}
          </div>
          <p className="mt-2.5 flex items-center gap-1.5 text-2xs text-ink-faint">
            <Clock className="h-3.5 w-3.5" />
            {lastUpdatedLabel(deal.lastUpdatedDaysAgo)}
          </p>
        </section>

        {/* AI deal brief */}
        <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-ink">AI deal brief</h3>
            <span className="ml-auto rounded-full bg-accent-50 px-2 py-0.5 text-2xs font-semibold text-accent-700">
              Generated from notes
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{deal.brief}</p>

          {/* Sentiment tag — always paired with its one-line reason */}
          <div className="mt-3.5 flex gap-3 rounded-xl bg-neutral-50 p-3">
            <span className={`mt-0.5 w-1 shrink-0 rounded-full ${sentimentBar(deal.sentiment.label)}`} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-2xs font-semibold uppercase tracking-wide text-ink-faint">Sentiment</span>
                <SentimentBadge label={deal.sentiment.label} />
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{deal.sentiment.reason}</p>
              <p className="mt-1 text-2xs text-ink-faint">
                Flagged phrase: <span className="font-medium text-ink-muted">“{deal.sentiment.trigger}”</span>
              </p>
            </div>
          </div>
        </section>

        {/* Quick wins — rule-based next suggested action(s) */}
        <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Lightbulb className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-ink">Quick wins</h3>
            <span className="ml-auto rounded-full bg-amber-50 px-2 py-0.5 text-2xs font-semibold text-amber-700">
              Suggested · rule-based
            </span>
          </div>
          <ul className="mt-3 flex flex-col gap-2.5">
            {suggestions.map((s, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-2xs text-ink-faint">
            Suggested from this deal&apos;s status — guidance, not automation.
          </p>
        </section>

        {/* Documents */}
        <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Documents</h3>
            <span className="text-2xs font-medium text-ink-faint">{deal.documents.length} files</span>
          </div>

          {deal.pendingDocsCount > 0 && (
            <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-100">
              <FileGlyph type="file" className="h-4 w-4" />
              {deal.pendingDocsCount} document{deal.pendingDocsCount === 1 ? '' : 's'} still awaited from the client
            </div>
          )}

          <ul className="mt-3 flex flex-col gap-2">
            {deal.documents.map((doc) => (
              <li
                key={doc.id}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-inset transition-colors ${
                  doc.isNew ? 'animate-pop-in bg-emerald-50 ring-emerald-100' : 'bg-neutral-50 ring-neutral-100'
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${docTint(doc.type)}`}>
                  <FileGlyph type={doc.type} className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{doc.name}</p>
                  <p className="text-2xs text-ink-faint">{(doc.type || 'file').toUpperCase()} · {doc.size}</p>
                </div>
                {doc.isNew && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-2xs font-semibold text-emerald-700">
                    <Check className="h-3 w-3" /> New
                  </span>
                )}
              </li>
            ))}
          </ul>

          <Button
            variant="secondary"
            size="lg"
            className="mt-3"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="h-4.5 w-4.5" /> Upload document
          </Button>
        </section>

        {/* Notes */}
        <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Notes</h3>
            <button
              onClick={() => setNoteOpen(true)}
              className="focus-ring inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-2xs font-semibold text-ink-soft transition-colors hover:bg-neutral-200 active:scale-[0.97]"
            >
              <Plus className="h-3.5 w-3.5" /> Add note
            </button>
          </div>
          <ul className="mt-3 flex flex-col gap-3">
            {deal.notes.map((n) => (
              <li key={n.id} className={`relative pl-4 ${n.isNew ? 'animate-pop-in' : ''}`}>
                <span className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ${n.isNew ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                <p className="text-2xs font-medium text-ink-faint">{noteAge(n.daysAgo)}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{n.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sticky quick actions bar (thumb reach) */}
      <div className="sticky bottom-0 z-20 border-t border-neutral-100 bg-white/90 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            className="flex-1"
            loading={marking}
            disabled={deal.lastUpdatedDaysAgo === 0 && !marking}
            onClick={handleMarkUpdate}
          >
            {deal.lastUpdatedDaysAgo === 0 ? (
              <><Check className="h-4.5 w-4.5" /> Updated today</>
            ) : (
              <><Check className="h-4.5 w-4.5" /> Mark update</>
            )}
          </Button>

          <Button
            variant={deal.onHold ? 'subtle' : 'secondary'}
            className={`flex-1 ${deal.onHold ? 'text-violet-700' : ''}`}
            loading={holdBusy}
            onClick={handleToggleHold}
            aria-pressed={deal.onHold}
          >
            <Pause className="h-4.5 w-4.5" />
            {deal.onHold ? 'On hold' : 'Put on hold'}
          </Button>
        </div>
      </div>

      <UploadSheet
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(name) => {
          addDocument(deal.id, name);
          toast('Document uploaded');
        }}
      />
      <NoteSheet
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        onSave={(text) => {
          addNote(deal.id, text);
          toast('Note added');
        }}
      />
    </div>
  );
}

// --- Upload sheet: choose file → loading → success → appears in list ---------
function UploadSheet({ open, onClose, onUploaded }) {
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | uploading | done
  const inputRef = useRef(null);

  const reset = () => {
    setFileName('');
    setStatus('idle');
  };
  const close = () => {
    onClose();
    setTimeout(reset, 250);
  };

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  };

  const doUpload = () => {
    const name = fileName || 'PO_copy.jpg';
    setStatus('uploading');
    // Fake network beat — no real storage, just a believable confirmation flow.
    setTimeout(() => {
      setStatus('done');
      onUploaded(name);
      setTimeout(close, 850);
    }, 1100);
  };

  return (
    <BottomSheet open={open} onClose={close} title="Upload document">
      {status === 'done' ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="flex h-14 w-14 animate-pop-in items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <p className="mt-3 text-base font-semibold text-ink">Uploaded</p>
          <p className="mt-1 text-sm text-ink-muted">{fileName || 'PO_copy.jpg'} added to this deal.</p>
        </div>
      ) : (
        <div className="pb-1">
          <input ref={inputRef} type="file" className="hidden" onChange={onPick} />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={status === 'uploading'}
            className="focus-ring flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-7 text-center transition-colors hover:border-accent-200 hover:bg-accent-50/40 disabled:opacity-60"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-accent-600 shadow-card">
              <Upload className="h-5 w-5" />
            </span>
            {fileName ? (
              <span className="text-sm font-semibold text-ink">{fileName}</span>
            ) : (
              <>
                <span className="text-sm font-semibold text-ink">Tap to choose a file</span>
                <span className="text-2xs text-ink-faint">PDF, JPG, PNG or XLSX · up to 10 MB</span>
              </>
            )}
          </button>
          <Button
            variant="primary"
            size="lg"
            className="mt-3"
            loading={status === 'uploading'}
            onClick={doUpload}
          >
            {status === 'uploading' ? 'Uploading…' : 'Upload'}
          </Button>
          <p className="mt-2 text-center text-2xs text-ink-faint">
            Prototype — the file isn’t stored anywhere.
          </p>
        </div>
      )}
    </BottomSheet>
  );
}

// --- Note sheet: text input → appends to the visible notes list --------------
function NoteSheet({ open, onClose, onSave }) {
  const [text, setText] = useState('');
  const save = () => {
    const t = text.trim();
    if (!t) return;
    onSave(t);
    setText('');
    onClose();
  };
  return (
    <BottomSheet
      open={open}
      onClose={() => {
        onClose();
        setTimeout(() => setText(''), 250);
      }}
      title="Add note"
    >
      <div className="pb-1">
        <div className="flex items-center gap-2 text-ink-muted">
          <NotePen className="h-4 w-4" />
          <span className="text-xs font-medium">What happened on this visit?</span>
        </div>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="e.g. Owner agreed to 5% off if we include free display units…"
          className="focus-ring mt-2 w-full resize-none rounded-2xl border border-neutral-200 bg-white p-3.5 text-sm text-ink placeholder:text-neutral-400"
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-2xs text-ink-faint">Appends to the deal’s notes timeline.</span>
          <span className="text-2xs tabular-nums text-neutral-400">{text.length}/280</span>
        </div>
        <Button variant="primary" size="lg" className="mt-3" disabled={!text.trim()} onClick={save}>
          Save note
        </Button>
      </div>
    </BottomSheet>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <TopBar title="Deal" fallback="/deals" />
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-base font-semibold text-ink">Deal not found</p>
        <p className="mt-1 text-sm text-ink-muted">This deal doesn’t exist in the prototype data.</p>
        <Link
          to="/deals"
          className="focus-ring mt-5 rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-neutral-200"
        >
          Back to My Deals
        </Link>
      </div>
    </div>
  );
}

function lastUpdatedLabel(days) {
  if (days === 0) return 'Updated today';
  if (days === 1) return 'Last updated yesterday';
  return `Last updated ${days} days ago`;
}
function noteAge(days) {
  if (days === 0) return 'Just now';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}
function docTint(type) {
  switch (type) {
    case 'pdf': return 'bg-rose-50 text-rose-600';
    case 'xls': return 'bg-emerald-50 text-emerald-600';
    case 'img': return 'bg-accent-50 text-accent-600';
    case 'doc': return 'bg-blue-50 text-blue-600';
    default: return 'bg-neutral-100 text-neutral-500';
  }
}
