import { monthlyTarget, bookedEarlierThisMonth } from '../data/deals';

// Single source for Rahul's personal, derived stats so the Home widget and the
// Profile screen always show the same numbers (never two independent copies).
// All figures are computed from the live deal data:
//   - dealsManaged   : how many deals are in the book
//   - activePipeline : total value of deals NOT on hold
//   - achieved       : booked earlier this month + current "Closing"-stage value
//   - target / pct   : Rahul's monthly value goal and % achieved
export function personalStats(deals) {
  const dealsManaged = deals.length;
  const activePipeline = deals.reduce((sum, d) => (d.onHold ? sum : sum + d.value), 0);
  const closingValue = deals.reduce((sum, d) => (d.stage === 'Closing' ? sum + d.value : sum), 0);
  const achieved = bookedEarlierThisMonth + closingValue;
  const target = monthlyTarget;
  const targetPct = Math.round((achieved / target) * 100);
  return { dealsManaged, activePipeline, achieved, target, targetPct };
}
