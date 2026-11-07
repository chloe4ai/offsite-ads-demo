// One place for the rules the builder enforces and the delivery model the dashboard reads.
// Platform numbers are as of build time and are the shape of the difference, not a rate card.
// The coupling and delivery model are a deliberately simple illustration, not a real auction.

export const PLATFORMS = {
  amazon: {
    id: 'amazon',
    name: 'Amazon DSP',
    monthlyMin: 10000,
    floorCpm: 2.5,
    benchmarkCtr: 0.0038,
    benchmarkCvr: 0.025,
    benchmarkRoas: 8.2,
    whoTheFloorSelects:
      'A $10,000/month floor selects for brands with an agency and a full-funnel budget.',
  },
  walmart: {
    id: 'walmart',
    name: 'Walmart Connect',
    monthlyMin: 500,
    floorCpm: 3.0,
    benchmarkCtr: 0.0052,
    benchmarkCvr: 0.04,
    benchmarkRoas: 6.8,
    whoTheFloorSelects:
      'A $500/month floor lets a single-SKU seller run lower-funnel intent with a credit card.',
  },
}

export const OBJECTIVES = {
  amazon: [
    { value: 'awareness', label: 'Brand Awareness' },
    { value: 'consideration', label: 'Product Consideration' },
    { value: 'conversion', label: 'Conversion' },
  ],
  walmart: [
    { value: 'awareness', label: 'Brand Awareness' },
    { value: 'consideration', label: 'Product Discovery' },
    { value: 'conversion', label: 'Purchase Conversion' },
  ],
}

// Which bid types make sense for each objective, and why.
const OBJECTIVE_BID_TYPES = {
  awareness: {
    bidTypes: ['impression', 'video_view'],
    why: 'Awareness is bought on reach, so you pay per impression or view. Paying per click would let the auction optimise for clickers, not for reach.',
  },
  consideration: {
    bidTypes: ['impression', 'click', 'video_view'],
    why: 'Consideration can be bought on reach or on engagement; CPA is not offered because there is no purchase goal to optimise toward yet.',
  },
  conversion: {
    bidTypes: ['click', 'conversion'],
    why: 'Conversion campaigns pay for the action closest to the sale. Buying impressions here hands the outcome risk back to you.',
  },
}

export const BID_STRATEGIES = {
  amazon: [
    { value: 'auto', label: 'Auto Bidding', objectives: ['awareness', 'consideration', 'conversion'], note: 'The platform prices each auction to spend your budget; your amount is only a starting bid. Easiest to deliver, least control over cost.' },
    { value: 'fixed', label: 'Fixed Bid', objectives: ['awareness', 'consideration', 'conversion'], note: 'Same bid on every auction. Predictable cost, but delivery depends entirely on whether the bid clears.' },
    { value: 'dynamic_down', label: 'Dynamic (Down Only)', objectives: ['consideration', 'conversion'], note: 'Lowers the bid when a conversion is unlikely. Needs a downstream goal, so not offered for awareness.' },
    { value: 'dynamic_up', label: 'Dynamic (Up & Down)', objectives: ['conversion'], note: 'Raises bids up to 100% when a conversion is likely. Only meaningful with a conversion goal.' },
    { value: 'target_roas', label: 'Target ROAS', objectives: ['conversion'], bidTypes: ['conversion'], note: 'You set the return you want; the platform bids to hit it. A target above what the market returns throttles delivery.' },
  ],
  walmart: [
    { value: 'auto', label: 'Auto Bidding', objectives: ['awareness', 'consideration', 'conversion'], note: 'The platform prices each auction to spend your budget; your amount is only a starting bid. Easiest to deliver, least control over cost.' },
    { value: 'fixed', label: 'Fixed Bid', objectives: ['awareness', 'consideration', 'conversion'], note: 'Same bid on every auction. Predictable cost, but delivery depends entirely on whether the bid clears.' },
    { value: 'target_cpa', label: 'Target CPA', objectives: ['consideration', 'conversion'], bidTypes: ['click', 'conversion'], note: 'You set what a sale or action is worth; the platform bids to hit it. A target below market CPA throttles delivery.' },
    { value: 'target_roas', label: 'Target ROAS', objectives: ['conversion'], bidTypes: ['conversion'], note: 'You set the return you want; the platform bids to hit it. A target above what the market returns throttles delivery.' },
  ],
}

export const BID_TYPES = [
  { value: 'impression', label: 'CPM — Cost per 1,000 Impressions', short: 'CPM' },
  { value: 'click', label: 'CPC — Cost per Click', short: 'CPC' },
  { value: 'video_view', label: 'vCPM — Cost per 1,000 Video Views', short: 'vCPM' },
  { value: 'conversion', label: 'CPA — Cost per Acquisition', short: 'CPA' },
]

const DEFAULT_BID = { impression: 4, click: 1.5, video_view: 8, conversion: 40 }

export const strategiesFor = (platform, objective) =>
  BID_STRATEGIES[platform].filter((s) => s.objectives.includes(objective))

export const bidTypesFor = (platform, objective, strategy) => {
  const byObjective = OBJECTIVE_BID_TYPES[objective].bidTypes
  const s = BID_STRATEGIES[platform].find((x) => x.value === strategy)
  const allowed = s?.bidTypes ? byObjective.filter((t) => s.bidTypes.includes(t)) : byObjective
  return BID_TYPES.filter((t) => allowed.includes(t.value))
}

export const objectiveWhy = (objective) => OBJECTIVE_BID_TYPES[objective].why

export const strategyNote = (platform, strategy) =>
  BID_STRATEGIES[platform].find((s) => s.value === strategy)?.note

// What the amount field means depends on strategy and bid type.
export const amountLabel = (strategy, bidType) => {
  if (strategy === 'target_roas') return 'Target ROAS (x)'
  if (strategy === 'target_cpa') return 'Target CPA (USD)'
  const short = BID_TYPES.find((t) => t.value === bidType)?.short ?? 'Bid'
  return strategy === 'auto' ? `Starting ${short} Bid (USD)` : `${short} Bid (USD)`
}

// What the amount field is denominated in: a ROAS multiple, a target cost per acquisition,
// or a bid in the bid type's own unit. When this changes, the old number means something else.
const amountUnit = (c) =>
  c.bidStrategy === 'target_roas' ? 'roas' : c.bidStrategy === 'target_cpa' ? 'cpa' : c.bidType

const DEFAULT_AMOUNT = { ...DEFAULT_BID, roas: 4, cpa: DEFAULT_BID.conversion }

/**
 * Re-applies the coupling after any change: if the objective no longer allows the strategy,
 * or the strategy no longer allows the bid type, fall back to the first valid option and
 * say what was changed. `previous` is the campaign before the edit: when the edit changes
 * what the amount is denominated in (a CPA bid becoming a ROAS target, a CPM bid becoming
 * a CPC bid), the amount is reset to that unit's default rather than carried over.
 * Returns { campaign, adjustments }.
 */
export function reconcile(platform, campaign, previous = campaign) {
  const adjustments = []
  let next = { ...campaign }

  const strategies = strategiesFor(platform, next.objective)
  if (!strategies.some((s) => s.value === next.bidStrategy)) {
    const fallback = strategies[0]
    adjustments.push(`Bid strategy reset to ${fallback.label}: the previous one does not fit this objective.`)
    next.bidStrategy = fallback.value
  }

  const types = bidTypesFor(platform, next.objective, next.bidStrategy)
  if (!types.some((t) => t.value === next.bidType)) {
    const fallback = types[0]
    adjustments.push(`Bid type switched to ${fallback.short}: the previous one does not fit this objective and strategy.`)
    next.bidType = fallback.value
  }

  const unit = amountUnit(next)
  if (unit !== amountUnit(previous) || unit !== amountUnit(campaign)) {
    next.bidAmount = DEFAULT_AMOUNT[unit]
    const shown = unit === 'roas' ? `${next.bidAmount}x` : `$${next.bidAmount}`
    adjustments.push(`${amountLabel(next.bidStrategy, next.bidType)} set to the default ${shown}: the previous amount was in a different unit.`)
  }

  return { campaign: next, adjustments }
}

export const flightDays = (c) => {
  const ms = new Date(c.endDate) - new Date(c.startDate)
  return Number.isFinite(ms) ? Math.max(1, Math.round(ms / 864e5) + 1) : 30
}

const isPositive = (x) => Number.isFinite(x) && x > 0

export const MIN_NAME_LENGTH = 4

// Both platforms state their minimum as spend per month, and it is a commitment on what the
// campaign will spend, not a daily rate. So the test is the flight's total budget
// (daily budget × flight days) against the minimum for the flight's length:
//   - a flight of up to 31 days, i.e. one calendar month or less, must commit the full
//     monthly minimum; a short burst does not get a pro-rated floor;
//   - a longer flight is pro-rated at one monthly minimum per 31 days, so it must average
//     the minimum over every month it runs without being held to more than that.
// $340/day for 3 days ($1,020) fails a $10,000 minimum; $323/day for 31 days ($10,013) passes.
export const flightSpend = (c) => c.budget * flightDays(c)

export const requiredFlightSpend = (platform, c) =>
  Math.round(PLATFORMS[platform].monthlyMin * Math.max(1, flightDays(c) / 31))

export function validate(platform, c) {
  const p = PLATFORMS[platform]
  const days = flightDays(c)
  const total = flightSpend(c)
  const required = requiredFlightSpend(platform, c)
  const minimum = `${p.name}'s $${p.monthlyMin.toLocaleString()}/month minimum`
  return [
    { key: 'name', ok: c.name.trim().length >= MIN_NAME_LENGTH, label: `Campaign name has at least ${MIN_NAME_LENGTH} characters` },
    {
      key: 'budget',
      ok: isPositive(c.budget) && total >= required,
      label: isPositive(c.budget)
        ? `$${c.budget.toLocaleString()}/day × ${days} days = $${total.toLocaleString()} vs. $${required.toLocaleString()} required by ${minimum}`
        : `Enter a daily budget above $0 to check it against ${minimum}`,
    },
    { key: 'amount', ok: isPositive(c.bidAmount), label: c.bidStrategy === 'target_roas' ? 'ROAS target above 0x' : 'Bid amount above $0' },
    { key: 'dates', ok: new Date(c.endDate) >= new Date(c.startDate), label: `Flight dates valid (${days} days)` },
    { key: 'audience', ok: !!c.audience, label: 'Audience targeting selected' },
  ]
}

// ---- Illustrative delivery model -------------------------------------------------------
// Converts the bid into an effective CPM, compares it with what the market clears at
// (floor × 1.4), and turns the gap into a share of auctions won. Target strategies are
// throttled by how far the target sits from the platform benchmark.

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DOW_DEMAND = [0.9, 0.95, 1.0, 1.05, 1.15, 1.0, 0.9]
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x))

// A missing, zero, negative or non-numeric amount bids nothing rather than poisoning the maths.
const usableAmount = (c) => (isPositive(c.bidAmount) ? c.bidAmount : 0)

export function effectiveCpm(platform, c) {
  const p = PLATFORMS[platform]
  const amount = usableAmount(c)
  if (c.bidStrategy === 'target_roas') return null
  if (c.bidStrategy === 'target_cpa') return amount * p.benchmarkCtr * p.benchmarkCvr * 1000
  switch (c.bidType) {
    case 'click':
      return amount * p.benchmarkCtr * 1000
    case 'conversion':
      return amount * p.benchmarkCtr * p.benchmarkCvr * 1000
    default:
      return amount
  }
}

export function simulateDelivery(platform, c) {
  const p = PLATFORMS[platform]
  const clearing = p.floorCpm * 1.4
  const eCpm = effectiveCpm(platform, c)
  const budget = isPositive(c.budget) ? c.budget : 0
  let winShare
  let diagnosis

  if (!isPositive(c.bidAmount) && c.bidStrategy !== 'auto') {
    winShare = 0
    diagnosis =
      c.bidStrategy === 'target_roas'
        ? 'Without a ROAS target above 0x there is nothing for the platform to bid toward, so nothing delivers.'
        : 'Without a bid above $0 the campaign does not enter the auction, so nothing delivers.'
  } else if (c.bidStrategy === 'target_roas') {
    winShare = clamp((p.benchmarkRoas / c.bidAmount) ** 1.5, 0, 1)
    diagnosis =
      winShare < 0.9
        ? `A ${c.bidAmount}x ROAS target is above the ~${p.benchmarkRoas}x this inventory returns, so the platform sits out most auctions.`
        : `A ${c.bidAmount}x ROAS target is at or below the ~${p.benchmarkRoas}x benchmark, so the target does not hold delivery back.`
  } else if (c.bidStrategy === 'auto') {
    winShare = 1
    diagnosis =
      eCpm < clearing
        ? `Auto bidding pays the ~$${clearing.toFixed(2)} clearing CPM even though your starting bid works out to $${eCpm.toFixed(2)}. You get delivery; you give up control of price.`
        : `Auto bidding delivers the budget at roughly the ~$${clearing.toFixed(2)} clearing CPM.`
  } else {
    winShare = clamp((eCpm / clearing) ** 2, 0, 1)
    if (eCpm < p.floorCpm) {
      winShare = Math.min(winShare, 0.05)
      diagnosis = `Your bid works out to a $${eCpm.toFixed(2)} effective CPM, below the $${p.floorCpm.toFixed(2)} floor. It barely enters the auction.`
    } else if (winShare < 0.9) {
      diagnosis = `Your bid works out to a $${eCpm.toFixed(2)} effective CPM against a ~$${clearing.toFixed(2)} clearing price, so it wins only part of the auctions it enters.`
    } else {
      diagnosis = `Your bid works out to a $${eCpm.toFixed(2)} effective CPM, comfortably above the ~$${clearing.toFixed(2)} clearing price.`
    }
  }

  const paidCpm = eCpm === null || c.bidStrategy === 'auto' ? clearing : clamp(eCpm, p.floorCpm, clearing * 1.2)
  const days = DOW.map((day, i) => {
    const spend = Math.round(budget * clamp(winShare * DOW_DEMAND[i], 0, 1))
    const impressions = Math.round((spend / paidCpm) * 1000)
    const clicks = Math.round(impressions * p.benchmarkCtr)
    return { day, budget, spend, impressions, clicks }
  })

  const totalSpend = days.reduce((s, d) => s + d.spend, 0)
  const totalBudget = budget * days.length
  return {
    days,
    totalSpend,
    totalBudget,
    pacing: totalBudget ? totalSpend / totalBudget : 0,
    impressions: days.reduce((s, d) => s + d.impressions, 0),
    clicks: days.reduce((s, d) => s + d.clicks, 0),
    diagnosis,
    benchmarkRoas: p.benchmarkRoas,
  }
}
