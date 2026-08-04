// ---------------------------------------------------------------------------
// Fake deal data. No backend — this is the seed for in-memory session state.
// Values are plausible Asian Paints dealer/retailer accounts across a territory.
//
// Every "AI" field (brief, sentiment + reason) is PRE-WRITTEN to read as if it
// were synthesised from the notes below. There is no model call anywhere.
// Sentiment is keyword/lexicon-based in spirit: each deal's trigger phrase is a
// real substring of its latest note (e.g. "price is a concern", "signed").
// ---------------------------------------------------------------------------

export function formatValue(rupees) {
  if (rupees >= 10000000) return `₹${(rupees / 10000000).toFixed(1)}Cr`;
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(0)}K`;
  return `₹${rupees}`;
}

// Rahul's own monthly value target (personal, not a team metric). "Achieved" is
// derived from the deal data itself (see Home): booked earlier this month plus
// the current "Closing"-stage deal value — kept on the same scale as the deals,
// not an invented number. With the seed data: 18.2L + Krishna's 9.8L = ₹28L / ₹40L.
export const monthlyTarget = 4000000;        // ₹40L
export const bookedEarlierThisMonth = 1820000; // ₹18.2L closed before the open pipeline

// daysAgo helpers assume "today" = the app's static today.
export const initialDeals = [
  {
    id: 'sharma-hardware',
    name: 'Sharma Hardware',
    location: 'Karol Bagh, Delhi',
    value: 1250000,
    stage: 'Negotiation',
    lastUpdatedDaysAgo: 6,
    clientRespondedDaysAgo: null,
    onHold: false,
    pendingDocsCount: 1,
    pendingDocLabel: 'PO copy',
    nextMeeting: 'Today, 4:30 PM',
    sentiment: {
      label: 'Negative',
      trigger: 'price is a concern',
      reason: 'Client said "price is a concern" on the bulk order in the last visit.',
    },
    brief:
      'Last visited 6 days ago. Rahul walked the owner through the bulk repaint quote for their new showroom, but he pushed back hard on pricing for the 200-drum order. The revised proposal (v2) is still pending his sign-off, and no fresh PO copy has come through since the initial ask.',
    documents: [
      { id: 'd1', name: 'Proposal_v2.pdf', type: 'pdf', size: '820 KB' },
      { id: 'd2', name: 'Site_measurements.xlsx', type: 'xls', size: '48 KB' },
    ],
    notes: [
      { id: 'n1', daysAgo: 6, text: 'Owner says price is a concern on the 200-drum bulk order. Wants ~8% off or a phased payment plan. Needs the finance team to weigh in.' },
      { id: 'n2', daysAgo: 11, text: 'Shared initial proposal. Interested in Royale for the showroom, Apcolite for the godown.' },
    ],
  },
  {
    id: 'krishna-colour-world',
    name: 'Krishna Colour World',
    location: 'Udyog Vihar, Gurugram',
    value: 980000,
    stage: 'Closing',
    lastUpdatedDaysAgo: 1,
    clientRespondedDaysAgo: 0,
    onHold: false,
    pendingDocsCount: 0,
    nextMeeting: 'Tomorrow, 11:00 AM',
    sentiment: {
      label: 'Positive',
      trigger: 'ready to sign',
      reason: 'Client messaged today that they are "ready to sign" once the annual scheme is confirmed.',
    },
    brief:
      'Momentum is strong — the owner replied this morning saying they are ready to sign once the annual dealer scheme is confirmed. Everything is agreed on volume and credit terms; this is now a matter of getting the paperwork in front of him before a competitor does.',
    documents: [
      { id: 'd1', name: 'Dealer_agreement.pdf', type: 'pdf', size: '640 KB' },
      { id: 'd2', name: 'Annual_scheme_2026.pdf', type: 'pdf', size: '1.2 MB' },
    ],
    notes: [
      { id: 'n1', daysAgo: 0, text: 'Owner messaged: ready to sign once annual scheme is confirmed. Very warm. Push to close this week.' },
      { id: 'n2', daysAgo: 3, text: 'Agreed on ₹9.8L annual commitment. Happy with the credit period offered.' },
    ],
  },
  {
    id: 'abc-paints-distributors',
    name: 'ABC Paints Distributors',
    location: 'Naraina, Delhi',
    value: 620000,
    stage: 'Proposal Sent',
    lastUpdatedDaysAgo: 2,
    clientRespondedDaysAgo: 1,
    onHold: false,
    pendingDocsCount: 1,
    pendingDocLabel: 'signed distributor form',
    nextMeeting: 'Wed, 3:00 PM',
    sentiment: {
      label: 'Positive',
      trigger: 'looks good',
      reason: 'Client replied yesterday that the proposal "looks good", pending one clarification.',
    },
    brief:
      'Warming up nicely. The distributor replied yesterday that the proposal looks good and only wants clarity on the return policy for slow-moving shades. One signed distributor form is still outstanding before onboarding can proceed.',
    documents: [
      { id: 'd1', name: 'Distributor_proposal.pdf', type: 'pdf', size: '710 KB' },
    ],
    notes: [
      { id: 'n1', daysAgo: 1, text: 'Replied that the proposal looks good. Just wants to confirm the return policy on slow-moving shades before signing the distributor form.' },
      { id: 'n2', daysAgo: 5, text: 'Sent full distributor proposal with margin structure.' },
    ],
  },
  {
    id: 'lakshmi-hardware-paints',
    name: 'Lakshmi Hardware & Paints',
    location: 'Sector 18, Noida',
    value: 540000,
    stage: 'Negotiation',
    lastUpdatedDaysAgo: 9,
    clientRespondedDaysAgo: null,
    onHold: false,
    pendingDocsCount: 0,
    nextMeeting: 'Not scheduled',
    sentiment: {
      label: 'Neutral',
      trigger: 'will think about it',
      reason: 'Client said they "will think about it" and has gone quiet since.',
    },
    brief:
      'Going cold. It has been 9 days with no contact after the owner said he would think about the switch from his current supplier. No objection was raised on price — the risk here is simply drift. A nudge visit is overdue before the interest fades entirely.',
    documents: [
      { id: 'd1', name: 'Comparison_sheet.pdf', type: 'pdf', size: '390 KB' },
    ],
    notes: [
      { id: 'n1', daysAgo: 9, text: 'Owner will think about it. Currently with a competitor, no strong complaint. Follow up in a week — that window has now passed.' },
    ],
  },
  {
    id: 'deccan-paint-mart',
    name: 'Deccan Paint Mart',
    location: 'Rohini, Delhi',
    value: 720000,
    stage: 'Proposal Sent',
    lastUpdatedDaysAgo: 5,
    clientRespondedDaysAgo: null,
    onHold: false,
    pendingDocsCount: 2,
    pendingDocLabel: 'GST certificate & trade license',
    nextMeeting: 'Fri, 12:30 PM',
    sentiment: {
      label: 'Neutral',
      trigger: 'documents delayed',
      reason: 'Onboarding is stalled — GST and trade-license documents are delayed from the client.',
    },
    brief:
      'Deal is fine on intent but blocked on paperwork. Two onboarding documents — GST certificate and trade license — are delayed from the owner. Until they arrive, the proposal cannot move to agreement. Worth a chase call before Friday.',
    documents: [
      { id: 'd1', name: 'Proposal_DeccanMart.pdf', type: 'pdf', size: '680 KB' },
    ],
    notes: [
      { id: 'n1', daysAgo: 5, text: 'Onboarding documents delayed — still waiting on GST cert and trade license. Owner keeps saying "next visit".' },
    ],
  },
  {
    id: 'verma-traders',
    name: 'Verma Traders',
    location: 'Vasundhara, Ghaziabad',
    value: 410000,
    stage: 'Proposal Sent',
    lastUpdatedDaysAgo: 4,
    clientRespondedDaysAgo: 3,
    onHold: false,
    pendingDocsCount: 1,
    pendingDocLabel: 'KYC document',
    nextMeeting: 'Thu, 5:00 PM',
    sentiment: {
      label: 'Neutral',
      trigger: 'need to check with partner',
      reason: 'Client is positive but "need to check with partner" before committing.',
    },
    brief:
      'A two-partner firm where one is sold and the other is not yet looped in. Replied three days ago that they need to check with the partner. One pending KYC document remains. Low risk, but needs the second decision-maker in the room to progress.',
    documents: [
      { id: 'd1', name: 'Quote_VermaTraders.pdf', type: 'pdf', size: '520 KB' },
    ],
    notes: [
      { id: 'n1', daysAgo: 3, text: 'Positive on the range but need to check with partner on the credit commitment. Asked to meet both partners next time.' },
    ],
  },
  {
    id: 'new-age-decor',
    name: 'New Age Decor',
    location: 'Kirti Nagar, Delhi',
    value: 350000,
    stage: 'Negotiation',
    lastUpdatedDaysAgo: 3,
    clientRespondedDaysAgo: 2,
    onHold: false,
    pendingDocsCount: 0,
    nextMeeting: 'Mon, 10:30 AM',
    sentiment: {
      label: 'Positive',
      trigger: 'happy with the samples',
      reason: 'Client is "happy with the samples" from the texture range.',
    },
    brief:
      'A design-led retailer that is happy with the texture and stucco samples left last week. Replied two days ago wanting to discuss display-unit support for their store. Small ticket now, but a good long-term premium account if the shelf space is won.',
    documents: [
      { id: 'd1', name: 'Texture_range_catalogue.pdf', type: 'pdf', size: '2.1 MB' },
    ],
    notes: [
      { id: 'n1', daysAgo: 2, text: 'Happy with the samples. Wants to talk about branded display units and a shade-card stand for the showroom.' },
    ],
  },
  {
    id: 'gupta-paint-house',
    name: 'Gupta Paint House',
    location: 'Vaishali, Ghaziabad',
    value: 890000,
    stage: 'Negotiation',
    lastUpdatedDaysAgo: 8,
    clientRespondedDaysAgo: null,
    onHold: true,
    pendingDocsCount: 0, // Paused for a shop renovation — no document is actually awaited
                         // from the client (notes/brief mention none), so it must not
                         // surface under the "Pending docs" filter.
    holdHint: 'the shop renovation wraps (~1 month)',
    nextMeeting: 'Paused',
    sentiment: {
      label: 'Neutral',
      trigger: 'shop renovation',
      reason: 'Paused by the client — their shop renovation pushes any decision out by a month.',
    },
    brief:
      'On hold at the client\'s request. The owner is mid shop-renovation and has asked to revisit the dealership expansion in about a month. Genuinely paused rather than lost — no need to flag this as urgent until the renovation wraps.',
    documents: [
      { id: 'd1', name: 'Expansion_plan.pdf', type: 'pdf', size: '560 KB' },
    ],
    notes: [
      { id: 'n1', daysAgo: 8, text: 'Owner asked to pause — shop renovation underway, revisit expansion in ~1 month. Keep warm, no pressure.' },
    ],
  },
  {
    id: 'sai-ram-distributors',
    name: 'Sai Ram Distributors',
    location: 'Sector 44, Gurugram',
    value: 1120000,
    stage: 'Negotiation',
    lastUpdatedDaysAgo: 12,
    clientRespondedDaysAgo: null,
    onHold: true,
    pendingDocsCount: 0,
    holdHint: 'the new quarter opens',
    nextMeeting: 'Paused',
    sentiment: {
      label: 'Neutral',
      trigger: 'budget on hold',
      reason: 'Client has put the annual budget on hold until the next quarter.',
    },
    brief:
      'A large account that has been parked. The distributor put their annual purchase budget on hold until the new quarter opens. High potential value, but nothing actionable this month — correctly kept out of the urgent pile.',
    documents: [
      { id: 'd1', name: 'Volume_proposal.pdf', type: 'pdf', size: '900 KB' },
    ],
    notes: [
      { id: 'n1', daysAgo: 12, text: 'Budget on hold till next quarter per the purchase head. Revisit in first week of the new quarter.' },
    ],
  },
  {
    id: 'bhandari-sales-corp',
    name: 'Bhandari Sales Corp',
    location: 'Sector 2, Noida',
    value: 280000,
    stage: 'Proposal Sent',
    lastUpdatedDaysAgo: 2,
    clientRespondedDaysAgo: null,
    onHold: false,
    pendingDocsCount: 0,
    nextMeeting: 'Next week',
    sentiment: {
      label: 'Neutral',
      trigger: 'reviewing the quote',
      reason: 'Client is still "reviewing the quote"; no signal either way yet.',
    },
    brief:
      'Early and steady. Proposal went out two days ago and the owner is reviewing the quote. No concerns raised, no strong buying signal yet. Nothing to chase today — a routine follow-up next week is the right cadence.',
    documents: [
      { id: 'd1', name: 'Quote_Bhandari.pdf', type: 'pdf', size: '480 KB' },
    ],
    notes: [
      { id: 'n1', daysAgo: 2, text: 'Reviewing the quote. Said he will revert next week. Small account, low urgency.' },
    ],
  },
];

// Static, clearly-stubbed "today's meetings" for the Home screen.
export const todaysMeetings = [
  { id: 'm1', dealId: 'sharma-hardware', name: 'Sharma Hardware', time: '4:30 PM', kind: 'Site visit' },
  { id: 'm2', dealId: 'verma-traders', name: 'Verma Traders', time: '5:00 PM', kind: 'Follow-up' },
];
