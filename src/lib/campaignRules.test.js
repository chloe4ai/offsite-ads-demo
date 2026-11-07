import { describe, it, expect } from 'vitest'
import {
  PLATFORMS, OBJECTIVES, BID_STRATEGIES, BID_TYPES, strategiesFor, bidTypesFor,
  reconcile, validate, flightDays, requiredFlightSpend, effectiveCpm, simulateDelivery,
} from './campaignRules'

const base = {
  name: 'Spring Sale',
  objective: 'awareness',
  budget: 500,
  bidStrategy: 'fixed',
  audience: 'in_market',
  bidType: 'impression',
  bidAmount: 4,
  startDate: '2026-05-01',
  endDate: '2026-05-31',
}

const check = (platform, c, key) => validate(platform, c).find((x) => x.key === key)

// Applies one edit the way the builder does: the edited campaign plus the one before it.
const edit = (platform, c, key, value) => reconcile(platform, { ...c, [key]: value }, c).campaign

describe('reconcile: bid amount follows the unit it is denominated in', () => {
  const cpaBid = { ...base, objective: 'conversion', bidType: 'conversion', bidAmount: 40 }

  it('resets a $40 CPA bid to the 4x default when switching to Target ROAS', () => {
    const next = edit('amazon', cpaBid, 'bidStrategy', 'target_roas')
    expect(next.bidStrategy).toBe('target_roas')
    expect(next.bidAmount).toBe(4)
  })

  it('resets a 12x ROAS target to the $40 CPA default when switching back to a fixed bid', () => {
    const roas = { ...cpaBid, bidStrategy: 'target_roas', bidAmount: 12 }
    const next = edit('amazon', roas, 'bidStrategy', 'fixed')
    expect(next.bidType).toBe('conversion')
    expect(next.bidAmount).toBe(40)
  })

  it('resets a CPC bid to the target CPA default when switching to Target CPA', () => {
    const cpc = { ...base, objective: 'consideration', bidType: 'click', bidAmount: 1.5 }
    const next = edit('walmart', cpc, 'bidStrategy', 'target_cpa')
    expect(next.bidType).toBe('click')
    expect(next.bidAmount).toBe(40)
  })

  it('keeps an amount the user typed when the unit does not change', () => {
    const roas = edit('amazon', cpaBid, 'bidStrategy', 'target_roas')
    expect(edit('amazon', roas, 'bidAmount', 6).bidAmount).toBe(6)
    expect(edit('amazon', { ...base, bidAmount: 5 }, 'budget', 600).bidAmount).toBe(5)
  })
})

describe('reconcile always ends in a valid state', () => {
  for (const platform of Object.keys(PLATFORMS)) {
    for (const { value: objective } of OBJECTIVES[platform]) {
      for (const { value: bidStrategy } of BID_STRATEGIES[platform]) {
        for (const { value: bidType } of BID_TYPES) {
          it(`${platform} · ${objective} · ${bidStrategy} · ${bidType}`, () => {
            const c = { ...base, objective, bidStrategy, bidType }
            const next = reconcile(platform, c, base).campaign
            expect(strategiesFor(platform, next.objective).map((s) => s.value)).toContain(next.bidStrategy)
            expect(bidTypesFor(platform, next.objective, next.bidStrategy).map((t) => t.value)).toContain(next.bidType)
            expect(next.bidAmount).toBeGreaterThan(0)
            expect(check(platform, next, 'amount').ok).toBe(true)
            // Reconciling a reconciled campaign changes nothing.
            expect(reconcile(platform, next, next).campaign).toEqual(next)
          })
        }
      }
    }
  }
})

describe('platform minimum is checked against the flight', () => {
  it('fails a 3-day $340/day Amazon flight against the $10,000/month minimum', () => {
    const c = { ...base, budget: 340, startDate: '2026-05-01', endDate: '2026-05-03' }
    expect(flightDays(c)).toBe(3)
    expect(check('amazon', c, 'budget').ok).toBe(false)
  })

  it('passes a 31-day $323/day Amazon flight that spends $10,013', () => {
    const c = { ...base, budget: 323, startDate: '2026-05-01', endDate: '2026-05-31' }
    expect(flightDays(c)).toBe(31)
    expect(check('amazon', c, 'budget').ok).toBe(true)
  })

  it('fails a 28-day flight that commits less than one monthly minimum', () => {
    const c = { ...base, budget: 340, startDate: '2026-02-01', endDate: '2026-02-28' }
    expect(check('amazon', c, 'budget').ok).toBe(false)
  })

  it('pro-rates flights longer than 31 days', () => {
    const c = { ...base, startDate: '2026-05-01', endDate: '2026-07-31' }
    expect(requiredFlightSpend('amazon', c)).toBe(Math.round(10000 * (92 / 31)))
    expect(check('amazon', { ...c, budget: 340 }, 'budget').ok).toBe(true)
    expect(check('amazon', { ...c, budget: 300 }, 'budget').ok).toBe(false)
  })

  it('$200/day passes on Walmart Connect and fails on Amazon DSP (README claim)', () => {
    const c = { ...base, budget: 200 }
    expect(check('walmart', c, 'budget').ok).toBe(true)
    expect(check('amazon', c, 'budget').ok).toBe(false)
  })

  it.each([0, -100, NaN, Infinity])('fails a budget of %s', (budget) => {
    expect(check('walmart', { ...base, budget }, 'budget').ok).toBe(false)
  })
})

describe('invalid amounts', () => {
  const roas = { ...base, objective: 'conversion', bidStrategy: 'target_roas', bidType: 'conversion' }

  it.each([0, -2, NaN])('a ROAS target of %s fails validation and delivers nothing', (bidAmount) => {
    const c = { ...roas, bidAmount }
    expect(check('amazon', c, 'amount').ok).toBe(false)
    const sim = simulateDelivery('amazon', c)
    expect(sim.totalSpend).toBe(0)
    expect(sim.pacing).toBe(0)
    expect(Number.isFinite(sim.impressions)).toBe(true)
  })

  it.each([0, -5, NaN])('a fixed bid of %s fails validation and delivers nothing', (bidAmount) => {
    const c = { ...base, bidAmount }
    expect(check('amazon', c, 'amount').ok).toBe(false)
    expect(effectiveCpm('amazon', c)).toBe(0)
    const sim = simulateDelivery('amazon', c)
    expect(sim.totalSpend).toBe(0)
    expect(sim.impressions).toBe(0)
    expect(sim.diagnosis).not.toMatch(/NaN/)
  })

  it.each([-100, NaN])('a budget of %s never produces negative or NaN spend', (budget) => {
    const sim = simulateDelivery('amazon', { ...base, budget })
    expect(sim.totalSpend).toBe(0)
    expect(sim.pacing).toBe(0)
  })
})

describe('target CPA converts through CVR and CTR whatever the billing unit', () => {
  it('gives the same effective CPM for click and conversion billing', () => {
    const c = { ...base, objective: 'conversion', bidStrategy: 'target_cpa', bidAmount: 40 }
    const p = PLATFORMS.walmart
    const expected = 40 * p.benchmarkCtr * p.benchmarkCvr * 1000
    expect(effectiveCpm('walmart', { ...c, bidType: 'click' })).toBeCloseTo(expected)
    expect(effectiveCpm('walmart', { ...c, bidType: 'conversion' })).toBeCloseTo(expected)
  })
})

describe('delivery window', () => {
  it('covers only the 3 days of a 3-day flight, from its start weekday', () => {
    const sim = simulateDelivery('amazon', { ...base, startDate: '2026-05-01', endDate: '2026-05-03' })
    expect(sim.days.map((d) => d.day)).toEqual(['Fri', 'Sat', 'Sun'])
    expect(sim.totalBudget).toBe(500 * 3)
  })

  it('caps at 7 days for longer flights', () => {
    const sim = simulateDelivery('amazon', base)
    expect(sim.days).toHaveLength(7)
    expect(sim.totalBudget).toBe(500 * 7)
  })
})

describe('campaign name', () => {
  it('label states the rule it checks', () => {
    expect(check('amazon', { ...base, name: 'Abc' }, 'name')).toMatchObject({ ok: false, label: expect.stringMatching(/at least 4 characters/) })
    expect(check('amazon', { ...base, name: 'Abcd' }, 'name').ok).toBe(true)
    expect(check('amazon', { ...base, name: '  ab  ' }, 'name').ok).toBe(false)
  })
})
