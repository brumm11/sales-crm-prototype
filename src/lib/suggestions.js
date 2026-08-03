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
  // deal gets exactly one, calm suggestion; nothing here should nag it.
  if (deal.onHold) {
    return [
      `Paused at the client's side — don't chase. Set a reminder to re-engage when ${deal.holdHint || 'the client is ready'}.`,
    ];
  }

  // Negative sentiment — go address the specific objection that was flagged.
  if (deal.sentiment?.label === 'Negative') {
    out.push(
      `Client flagged "${deal.sentiment.trigger}" — go in with a revised offer to unblock it${by}.`
    );
  }

  // Pending documents — chase the specific document before it stalls the deal.
  if (deal.pendingDocsCount > 0) {
    const what = deal.pendingDocLabel || (deal.pendingDocsCount > 1 ? 'documents' : 'document');
    out.push(`Confirm the pending ${what}${by} so onboarding doesn't stall.`);
  }

  // Warm, recent response — strike while the iron is hot.
  if (deal.clientRespondedDaysAgo != null && deal.clientRespondedDaysAgo <= 2 && deal.sentiment?.label === 'Positive') {
    out.push(
      /clos/i.test(deal.stage)
        ? 'Client is ready — get the agreement in front of them within 24 hours to close.'
        : 'Client is warm — propose next steps within 24 hours to keep the momentum.'
    );
  }

  // Going cold — stale with no recent contact from the client.
  if (deal.lastUpdatedDaysAgo >= 6 && deal.clientRespondedDaysAgo == null) {
    out.push(`No contact in ${deal.lastUpdatedDaysAgo} days — a short nudge visit will stop this going cold.`);
  }

  // Fallback by stage so every deal always has a sensible next step.
  if (out.length === 0) {
    if (/proposal/i.test(deal.stage)) {
      out.push("Proposal is out — follow up to confirm they've reviewed the quote.");
    } else if (/negoti/i.test(deal.stage)) {
      out.push('Keep it moving — agree the next milestone on your next visit.');
    } else {
      out.push('Check in to confirm the next step and keep this deal progressing.');
    }
  }

  return out.slice(0, 2);
}
