import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target, DollarSign, MousePointer, Calendar, Users,
  ChevronDown, Settings2, AlertCircle, CheckCircle2, TrendingUp, Info
} from 'lucide-react'
import {
  PLATFORMS, OBJECTIVES, strategiesFor, bidTypesFor, objectiveWhy, strategyNote,
  amountLabel, reconcile, validate, flightDays, flightSpend, requiredFlightSpend, MIN_NAME_LENGTH,
} from '../lib/campaignRules'

const audiences = {
  amazon: [
    { value: 'in_market', label: 'In-Market: Electronics' },
    { value: 'lifestyle_health', label: 'Lifestyle: Health-Conscious' },
    { value: 'prime_members', label: 'Prime Members' },
    { value: 'similar_audience', label: 'Similar to Buyers' },
    { value: 'retargeting_view', label: 'View Retargeting (30d)' },
    { value: 'retargeting_purchase', label: 'Purchase Retargeting (90d)' },
  ],
  walmart: [
    { value: 'health_shopper', label: 'Health & Wellness Shoppers' },
    { value: 'grocery_buyer', label: 'Grocery Buyers' },
    { value: 'walmart_plus', label: 'W+ Members' },
    { value: 'recent_purchaser', label: 'Recent Category Purchasers' },
    { value: 'cross_sell', label: 'Cross-Category Shoppers' },
    { value: 'cart_abandon', label: 'Cart Abandoners' },
  ],
}

const Why = ({ children }) => (
  <div className="flex gap-2 text-xs text-navy-300 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2">
    <Info size={13} className="text-amber-400 shrink-0 mt-0.5" />
    <span>{children}</span>
  </div>
)

const InputGroup = ({ label, children, hint }) => (
  <div className="space-y-2">
    <label className="block text-xs font-medium text-navy-400 uppercase tracking-wide">{label}</label>
    {children}
    {hint && <p className="text-xs text-navy-600">{hint}</p>}
  </div>
)

const Select = ({ value, onChange, options, icon: Icon, disabled }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500 pointer-events-none">
        <Icon size={14} />
      </div>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full appearance-none disabled:opacity-60 bg-navy-800/60 border border-white/8 text-navy-100 text-sm rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all"
      style={{ paddingLeft: Icon ? 36 : 12 }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: '#111827' }}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-500 pointer-events-none" />
  </div>
)

export default function CampaignBuilder({ platform, campaign, setCampaign }) {
  const [adjustments, setAdjustments] = useState([])
  const p = PLATFORMS[platform]

  const update = (key, value) => {
    const { campaign: next, adjustments: notes } = reconcile(platform, { ...campaign, [key]: value }, campaign)
    setAdjustments(notes)
    setCampaign(next)
  }

  const checks = validate(platform, campaign)
  const isValid = checks.every((c) => c.ok)
  const budgetOk = checks.find((c) => c.key === 'budget').ok
  const strategies = strategiesFor(platform, campaign.objective)
  const bidTypes = bidTypesFor(platform, campaign.objective, campaign.bidStrategy)
  const lockedBidType = bidTypes.length === 1

  return (
    <div id="campaign-builder" className="bg-navy-900/60 border border-white/8 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
          <Settings2 size={18} className="text-amber-400" />
        </div>
        <div>
          <h2 className="font-display font-700 text-navy-50 text-lg">Campaign Builder</h2>
          <p className="text-xs text-navy-500">Configure targeting, bidding & budget</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Campaign Name */}
        <InputGroup label="Campaign Name" hint={`${MIN_NAME_LENGTH}–128 characters`}>
          <div className="relative">
            <input
              type="text"
              value={campaign.name}
              onChange={(e) => update('name', e.target.value)}
              maxLength={128}
              placeholder="e.g. Spring Sale — Wireless Earbuds"
              className="w-full bg-navy-800/60 border border-white/8 text-navy-100 text-sm rounded-xl py-2.5 px-3 placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-navy-600">
              {campaign.name.length}/128
            </div>
          </div>
        </InputGroup>

        {/* Objective */}
        <InputGroup label="Campaign Objective">
          <Select
            value={campaign.objective}
            onChange={(v) => update('objective', v)}
            options={OBJECTIVES[platform]}
            icon={Target}
          />
        </InputGroup>
        <Why>{objectiveWhy(campaign.objective)}</Why>

        {/* Two-col: Budget + Bid Strategy */}
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Daily Budget (USD)" hint={`$${flightSpend(campaign).toLocaleString()} over ${flightDays(campaign)} days · needs $${requiredFlightSpend(platform, campaign).toLocaleString()}`}>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
              <input
                type="number"
                value={campaign.budget}
                onChange={(e) => update('budget', Number(e.target.value))}
                min={0}
                step={platform === 'amazon' ? 50 : 5}
                className="w-full bg-navy-800/60 border border-white/8 text-navy-100 text-sm rounded-xl py-2.5 pl-8 pr-3 placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all"
              />
            </div>
          </InputGroup>
          <InputGroup label="Bid Strategy">
            <Select
              value={campaign.bidStrategy}
              onChange={(v) => update('bidStrategy', v)}
              options={strategies}
              icon={TrendingUp}
            />
          </InputGroup>
        </div>
        <div className={`text-xs rounded-lg px-3 py-2 border ${budgetOk ? 'text-navy-400 border-white/5 bg-navy-800/30' : 'text-rose-300 border-rose-500/30 bg-rose-500/10'}`}>
          {budgetOk ? p.whoTheFloorSelects : `Below ${p.name}'s $${p.monthlyMin.toLocaleString()}/month minimum. ${p.whoTheFloorSelects}`}
        </div>

        {/* Bid Type + Bid Amount */}
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Bid Type">
            <Select
              value={campaign.bidType}
              onChange={(v) => update('bidType', v)}
              options={bidTypes}
              icon={MousePointer}
              disabled={lockedBidType}
            />
          </InputGroup>
          <InputGroup label={amountLabel(campaign.bidStrategy, campaign.bidType)}>
            <div className="relative">
              {campaign.bidStrategy !== 'target_roas' && (
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
              )}
              <input
                type="number"
                value={campaign.bidAmount}
                onChange={(e) => update('bidAmount', Number(e.target.value))}
                min={0}
                step={campaign.bidStrategy === 'target_roas' ? 0.5 : 0.25}
                className={`w-full bg-navy-800/60 border border-white/8 text-navy-100 text-sm rounded-xl py-2.5 ${campaign.bidStrategy === 'target_roas' ? 'pl-3' : 'pl-8'} pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all`}
              />
            </div>
          </InputGroup>
        </div>
        <Why>
          {strategyNote(platform, campaign.bidStrategy)}
          {lockedBidType && ` This strategy only bids on ${bidTypes[0].short}.`}
        </Why>
        {adjustments.map((note) => (
          <div key={note} className="flex gap-2 text-xs text-amber-300">
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <span>{note}</span>
          </div>
        ))}

        {/* Audience */}
        <InputGroup label="Audience Targeting">
          <Select
            value={campaign.audience}
            onChange={(v) => update('audience', v)}
            options={[{ value: '', label: 'Select audience...' }, ...audiences[platform]]}
            icon={Users}
          />
        </InputGroup>

        {/* Dates */}
        <InputGroup label="Campaign Duration">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
              <input
                type="date"
                value={campaign.startDate}
                onChange={(e) => update('startDate', e.target.value)}
                className="w-full bg-navy-800/60 border border-white/8 text-navy-100 text-sm rounded-xl py-2.5 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all [color-scheme:dark]"
              />
            </div>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
              <input
                type="date"
                value={campaign.endDate}
                onChange={(e) => update('endDate', e.target.value)}
                className="w-full bg-navy-800/60 border border-white/8 text-navy-100 text-sm rounded-xl py-2.5 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
        </InputGroup>

        {/* Product ID */}
        <InputGroup label={platform === 'amazon' ? 'Product ASIN' : 'Product SKU'} hint={platform === 'amazon' ? 'e.g. B09V4HXPB5 — found on Amazon product page' : 'e.g. SKU-VIT-D30 — from your Walmart catalog'}>
          <div className="relative">
            <AlertCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
            <input
              type="text"
              value={platform === 'amazon' ? campaign.productAsin : campaign.productSku}
              onChange={(e) => update(platform === 'amazon' ? 'productAsin' : 'productSku', e.target.value)}
              placeholder={platform === 'amazon' ? 'B09V4HXPB5' : 'SKU-VIT-D30'}
              className="w-full bg-navy-800/60 border border-white/8 text-navy-100 text-sm rounded-xl py-2.5 pl-8 pr-3 placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all font-mono"
            />
          </div>
        </InputGroup>

        {/* Validation Summary */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-white/5 pt-4"
        >
          <div className="flex flex-col gap-2">
            {checks.map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-xs">
                {item.ok ? (
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle size={14} className="text-rose-500 shrink-0" />
                )}
                <span className={item.ok ? 'text-navy-300' : 'text-rose-300'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <button
            disabled={!isValid}
            onClick={() => document.getElementById('delivery').scrollIntoView({ behavior: 'smooth' })}
            className={`mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all ${
              isValid
                ? 'bg-amber-500 text-navy-950 hover:bg-amber-400 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-500/20'
                : 'bg-navy-800 text-navy-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {isValid ? 'See Projected Delivery' : 'Fix the Items Above'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
