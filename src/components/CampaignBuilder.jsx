import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target, DollarSign, MousePointer, Calendar, Users,
  ChevronDown, Settings2, AlertCircle, CheckCircle2, TrendingUp
} from 'lucide-react'

const objectives = {
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

const bidStrategies = {
  amazon: [
    { value: 'auto', label: 'Auto Bidding' },
    { value: 'fixed', label: 'Fixed Bid' },
    { value: 'target_roas', label: 'Target ROAS' },
    { value: 'dynamic_up', label: 'Dynamic (Up Only)' },
    { value: 'dynamic_down', label: 'Dynamic (Down Only)' },
  ],
  walmart: [
    { value: 'auto', label: 'Auto Bidding' },
    { value: 'target_cpa', label: 'Target CPA' },
    { value: 'target_roas', label: 'Target ROAS' },
    { value: 'fixed', label: 'Fixed Bid' },
  ],
}

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

const bidTypes = [
  { value: 'impression', label: 'CPM — Cost per 1,000 Impressions' },
  { value: 'click', label: 'CPC — Cost per Click' },
  { value: 'video_view', label: 'vCPM — Cost per Video View' },
  { value: 'conversion', label: 'CPA — Cost per Acquisition' },
]

const InputGroup = ({ label, children, hint }) => (
  <div className="space-y-2">
    <label className="block text-xs font-medium text-navy-400 uppercase tracking-wide">{label}</label>
    {children}
    {hint && <p className="text-xs text-navy-600">{hint}</p>}
  </div>
)

const Select = ({ value, onChange, options, icon: Icon }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500 pointer-events-none">
        <Icon size={14} />
      </div>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-navy-800/60 border border-white/8 text-navy-100 text-sm rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all"
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
  const update = (key, value) => setCampaign((c) => ({ ...c, [key]: value }))

  const validation = {
    name: campaign.name.length > 3,
    budget: campaign.budget >= 500,
    audience: !!campaign.audience,
  }
  const isValid = Object.values(validation).every(Boolean)

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
        <InputGroup label="Campaign Name" hint="Max 128 characters">
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
            options={objectives[platform]}
            icon={Target}
          />
        </InputGroup>

        {/* Two-col: Budget + Bid Strategy */}
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Daily Budget (USD)" hint="Min $50/day">
            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
              <input
                type="number"
                value={campaign.budget}
                onChange={(e) => update('budget', Number(e.target.value))}
                min={50}
                step={100}
                className="w-full bg-navy-800/60 border border-white/8 text-navy-100 text-sm rounded-xl py-2.5 pl-8 pr-3 placeholder:text-navy-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all"
              />
            </div>
          </InputGroup>
          <InputGroup label="Bid Strategy">
            <Select
              value={campaign.bidStrategy}
              onChange={(v) => update('bidStrategy', v)}
              options={bidStrategies[platform]}
              icon={TrendingUp}
            />
          </InputGroup>
        </div>

        {/* Bid Type + Bid Amount */}
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Bid Type">
            <Select
              value={campaign.bidType}
              onChange={(v) => update('bidType', v)}
              options={bidTypes}
              icon={MousePointer}
            />
          </InputGroup>
          <InputGroup label={campaign.bidType === 'impression' ? 'CPM Bid (USD)' : campaign.bidType === 'click' ? 'CPC Bid (USD)' : campaign.bidType === 'video_view' ? 'vCPM Bid (USD)' : 'CPA Bid (USD)'}>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
              <input
                type="number"
                value={campaign.bidAmount}
                onChange={(e) => update('bidAmount', Number(e.target.value))}
                min={0.5}
                step={0.5}
                className="w-full bg-navy-800/60 border border-white/8 text-navy-100 text-sm rounded-xl py-2.5 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all"
              />
            </div>
          </InputGroup>
        </div>

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
            {[
              { key: 'name', label: 'Campaign name set' },
              { key: 'budget', label: `Budget ≥ $500 (set to $${campaign.budget.toLocaleString()})` },
              { key: 'audience', label: 'Audience targeting selected' },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-xs">
                {validation[item.key] ? (
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle size={14} className="text-rose-500 shrink-0" />
                )}
                <span className={validation[item.key] ? 'text-navy-300' : 'text-navy-500'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <button
            disabled={!isValid}
            className={`mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all ${
              isValid
                ? 'bg-amber-500 text-navy-950 hover:bg-amber-400 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-500/20'
                : 'bg-navy-800 text-navy-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {isValid ? 'Launch Campaign Preview' : 'Complete Required Fields'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
