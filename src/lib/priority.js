// ---------------------------------------------------------------------------
// Priority score — deterministic, rule-based, explainable. NOT machine learning.
// ---------------------------------------------------------------------------
// Rahul opens the app and needs to know which deal to visit next without
// reopening every record. This function turns the raw signals on a deal into a
// 0–100 score AND the human-readable reasons behind it, so the number is always
// accompanied by a "why". The score reacts within the session: when Rahul marks
// an update or toggles hold, the underlying signals change and the score with it.
//
// Signals & weights (max contribution in points):
//   Deal value            → up to 30   (bigger deal = worth prioritising)
//   Days since last update → up to 28   (staler = more at risk of going cold)
//   Recent client reply    → up to 22   (strike while the iron is hot)
//   Pending documents      → up to 20   (a concrete, blocking to-do)
//
//   On hold                → HARD CAP. A paused deal is demoted below the
//                            "needs attention" line regardless of the above,
//                            because Rahul has explicitly said "don't flag me".
// ---------------------------------------------------------------------------

const VALUE_CAP = 1200000;   // ₹12L — value contribution maxes out here
const STALE_FULL_DAYS = 9;   // staleness contribution maxes out at 9+ days
const HOLD_CEILING = 26;     // on-hold deals cannot score above this

const NEEDS_ATTENTION_THRESHOLD = 52; // score at/above this = "needs attention"

export function computePriority(deal) {
  const reasons = [];

  // 1. Deal value ---------------------------------------------------------
  const valuePts = clamp(deal.value / VALUE_CAP, 0, 1) * 26;
  if (deal.value >= 800000) {
    reasons.push({ text: 'Large deal', tone: 'value', weight: valuePts });
  }

  // 2. Days since last update --------------------------------------------
  const stalePts = clamp(deal.lastUpdatedDaysAgo / STALE_FULL_DAYS, 0, 1) * 30;
  if (deal.lastUpdatedDaysAgo >= 6) {
    reasons.push({
      text: `No follow-up in ${deal.lastUpdatedDaysAgo} days`,
      tone: 'urgent',
      weight: stalePts,
    });
  } else if (deal.lastUpdatedDaysAgo >= 3) {
    reasons.push({
      text: `${deal.lastUpdatedDaysAgo} days since update`,
      tone: 'warn',
      weight: stalePts,
    });
  }

  // 3. Recent client response --------------------------------------------
  let responsePts = 0;
  if (deal.clientRespondedDaysAgo != null) {
    if (deal.clientRespondedDaysAgo <= 1) {
      responsePts = 28;
      reasons.push({
        text:
          deal.clientRespondedDaysAgo === 0
            ? 'Client responded today'
            : 'Client responded yesterday',
        tone: 'positive',
        weight: responsePts,
      });
    } else if (deal.clientRespondedDaysAgo <= 3) {
      responsePts = 16;
      reasons.push({
        text: `Client replied ${deal.clientRespondedDaysAgo} days ago`,
        tone: 'positive',
        weight: responsePts,
      });
    }
  }

  // 4. Pending documents --------------------------------------------------
  let docsPts = 0;
  if (deal.pendingDocsCount > 0) {
    docsPts = clamp(deal.pendingDocsCount / 2, 0, 1) * 22;
    reasons.push({
      text:
        deal.pendingDocsCount === 1
          ? 'Pending document'
          : `${deal.pendingDocsCount} pending documents`,
      tone: 'warn',
      weight: docsPts,
    });
  }

  // Raw score -------------------------------------------------------------
  let score = Math.round(valuePts + stalePts + responsePts + docsPts);

  // 5. On-hold cap --------------------------------------------------------
  let capped = false;
  if (deal.onHold) {
    capped = true;
    score = Math.min(score, HOLD_CEILING);
    // On hold becomes the leading reason and pushes the deal out of "needs attention".
    reasons.unshift({ text: 'On hold', tone: 'hold', weight: 999 });
  }

  score = clamp(score, 0, 100);

  // Surface the strongest reasons first; keep it to 3 so cards stay scannable.
  const topReasons = reasons
    .slice()
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(({ text, tone }) => ({ text, tone }));

  return {
    score,
    label: labelFor(score, capped),
    reasons: topReasons,
    needsAttention: !capped && score >= NEEDS_ATTENTION_THRESHOLD,
    onHold: !!deal.onHold,
    hasPendingDocs: deal.pendingDocsCount > 0,
  };
}

function labelFor(score, capped) {
  if (capped) return 'Low';
  if (score >= NEEDS_ATTENTION_THRESHOLD) return 'High';
  if (score >= 33) return 'Medium';
  return 'Low';
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export { NEEDS_ATTENTION_THRESHOLD };
