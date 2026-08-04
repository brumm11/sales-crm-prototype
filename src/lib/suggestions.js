// ---------------------------------------------------------------------------
// Quick wins — rule-based "next suggested action". NOT machine learning.
// ---------------------------------------------------------------------------
// Reads the exact same signals that drive the priority score and sentiment
// (on-hold status, pending docs, days since update, recent client response,
// sentiment label, deal stage) and turns them into 1–2 specific, plain-language
// next steps. Because it reads the live deal, it reacts within the session:
// mark an update, upload the pending doc, or toggle hold and the suggestions
// change with it — it is never a disconnected, hardcoded panel.
//
// Each suggestion carries BOTH a full `text` (shown in the Quick Wins section on
// Deal Detail) and a condensed `short` (shown as the one-line nudge on the My
// Deals cards). Both come from this single source, so the card nudge can never
// diverge in substance from the deal's own Quick Wins. `passive` marks a
// suggestion that isn't an active next step (a paused deal) — the card omits it.
//
// Per-deal flavour (which document is missing, when a pause lifts) comes from
// optional data fields (pendingDocLabel, holdHint); the rules decide WHICH
// suggestions fire from the deal's current state.
// ---------------------------------------------------------------------------

const DAY_NAMES = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

// "Wed, 3:00 PM" -> " before Wednesday's meeting"; empty when there's no real
// upcoming meeting (paused / not scheduled / vague).
function meetingClause(nextMeeting) {
  if (!nextMeeting) return '';
  if (/paused|not scheduled|next week|to be scheduled/i.test(nextMeeting)) return '';
  const day = nextMeeting.split(',')[0].trim();
  const label = /today|tomorrow/i.test(day)
    ? day.toLowerCase()
    : DAY_NAMES[day] || day;
  return ` before ${label}'s meeting`;
}

export function suggestActions(deal) {
  const out = [];
  const by = meetingClause(deal.nextMeeting);

  // On hold — the quick win is NOT to chase, but to schedule a revisit. A paused
  // deal gets exactly one, calm suggestion; nothing here should nag it. Marked
  // passive so the My Deals card omits it (no active field step for a paused deal).
  if (deal.onHold) {
    return [{
      text: `Paused at the client's side — don't chase. Set a reminder to re-engage when ${deal.holdHint || 'the client is ready'}.`,
      short: 'Paused — revisit when it resumes',
      passive: true,
    }];
  }

  // Negative sentiment — go address the specific objection that was flagged.
  if (deal.sentiment?.label === 'Negative') {
    out.push({
      text: `Client flagged "${deal.sentiment.trigger}" — go in with a revised offer to unblock it${by}.`,
      short: `Take a revised offer on the "${deal.sentiment.trigger}"`,
    });
  }

  // Pending documents — chase the specific document before it stalls the deal.
  if (deal.pendingDocsCount > 0) {
    const what = deal.pendingDocLabel || (deal.pendingDocsCount > 1 ? 'documents' : 'document');
    out.push({
      text: `Confirm the pending ${what}${by} so onboarding doesn't stall.`,
      short: `Confirm the pending ${what}`,
    });
  }

  // Warm, recent response — strike while the iron is hot.
  if (deal.clientRespondedDaysAgo != null && deal.clientRespondedDaysAgo <= 2 && deal.sentiment?.label === 'Positive') {
    out.push(
      /clos/i.test(deal.stage)
        ? { text: 'Client is ready — get the agreement in front of them within 24 hours to close.', short: 'Send the agreement to close' }
        : { text: 'Client is warm — propose next steps within 24 hours to keep the momentum.', short: 'Propose next steps while the client is warm' }
    );
  }

  // Going cold — stale with no recent contact from the client.
  if (deal.lastUpdatedDaysAgo >= 6 && deal.clientRespondedDaysAgo == null) {
    out.push({
      text: `No contact in ${deal.lastUpdatedDaysAgo} days — a short nudge visit will stop this going cold.`,
      short: `Nudge visit — no contact in ${deal.lastUpdatedDaysAgo} days`,
    });
  }

  // Fallback by stage so every deal always has a sensible next step.
  if (out.length === 0) {
    if (/proposal/i.test(deal.stage)) {
      out.push({ text: "Proposal is out — follow up to confirm they've reviewed the quote.", short: 'Follow up on the sent proposal' });
    } else if (/negoti/i.test(deal.stage)) {
      out.push({ text: 'Keep it moving — agree the next milestone on your next visit.', short: 'Agree the next milestone' });
    } else {
      out.push({ text: 'Check in to confirm the next step and keep this deal progressing.', short: 'Check in on the next step' });
    }
  }

  return out.slice(0, 2);
}

// Condensed one-liner for the My Deals card — the primary (first active)
// suggestion's `short`. Returns null when the only suggestion is passive (e.g. a
// paused deal), so the card omits the line rather than showing a non-action.
export function cardNudge(deal) {
  const primary = suggestActions(deal).find((s) => !s.passive);
  return primary ? primary.short : null;
}
