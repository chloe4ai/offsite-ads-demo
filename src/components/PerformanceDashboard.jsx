import {
  BarChart, Bar, ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, Eye, MousePointerClick, DollarSign, Gauge, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { simulateDelivery } from '../lib/campaignRules'

const tooltipStyle = {
  backgroundColor: '#1e2a45',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  color: '#c2cfe8',
  fontSize: 12,
  padding: '8px 12px',
}

function MetricCard({ icon: Icon, label, value, sub, color, subColor = 'text-navy-400' }) {
  return (
    <div className="bg-navy-800/40 border border-white/5 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center">
          <Icon size={14} className={color} />
        </div>
        <span className="text-xs text-navy-500 font-medium">{label}</span>
      </div>
      <div className="text-2xl font-display font-700 text-navy-50">{value}</div>
      <div className={`text-xs mt-1 font-medium ${subColor}`}>{sub}</div>
    </div>
  )
}

const compact = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : `${n}`)

export default function PerformanceDashboard({ campaign, platform }) {
  const sim = simulateDelivery(platform, campaign)
  const data = sim.days
  const ctr = sim.impressions ? (sim.clicks / sim.impressions) * 100 : 0
  const pacingPct = Math.round(sim.pacing * 100)
  const underdelivering = pacingPct < 90

  return (
    <div id="delivery" className="bg-navy-900/60 border border-white/8 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="font-display font-700 text-navy-50 text-lg">Projected Delivery</h2>
            <p className="text-xs text-navy-500">First 7 days of this campaign · illustrative model, recomputed as you edit</p>
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className={`mb-6 flex gap-3 rounded-2xl border px-4 py-3 text-sm ${underdelivering ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-emerald-500/20 bg-emerald-500/5 text-navy-200'}`}>
        {underdelivering
          ? <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
          : <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />}
        <div>
          <div className="font-medium">
            {underdelivering ? `Underdelivering: ${pacingPct}% of budget spent` : `On pace: ${pacingPct}% of budget spent`}
          </div>
          <div className="text-xs mt-1 opacity-80">{sim.diagnosis}</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          icon={Gauge}
          label="Budget Delivered"
          value={`${pacingPct}%`}
          sub={`$${compact(sim.totalSpend)} of $${compact(sim.totalBudget)}`}
          color={underdelivering ? 'text-rose-400' : 'text-emerald-400'}
          subColor={underdelivering ? 'text-rose-400' : 'text-emerald-500'}
        />
        <MetricCard
          icon={Eye}
          label="Impressions"
          value={compact(sim.impressions)}
          sub={`${compact(Math.round(sim.impressions / 7))}/day avg`}
          color="text-blue-400"
        />
        <MetricCard
          icon={MousePointerClick}
          label="Clicks"
          value={sim.clicks.toLocaleString()}
          sub={`${ctr.toFixed(2)}% CTR (platform benchmark)`}
          color="text-amber-400"
        />
        <MetricCard
          icon={DollarSign}
          label="Benchmark ROAS"
          value={`${sim.benchmarkRoas}x`}
          sub="Platform average, not modeled"
          color="text-navy-300"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-navy-800/30 border border-white/5 rounded-2xl p-4">
          <h3 className="text-sm font-medium text-navy-300 mb-4">Impressions & Clicks</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#4d6491', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="imp" tick={{ fill: '#4d6491', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={compact} />
              <YAxis yAxisId="clk" orientation="right" tick={{ fill: '#4d6491', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={compact} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#6b83b1' }} />
              <Bar yAxisId="imp" dataKey="impressions" fill="#334470" radius={[4, 4, 0, 0]} name="Impressions" />
              <Bar yAxisId="clk" dataKey="clicks" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/30 border border-white/5 rounded-2xl p-4">
          <h3 className="text-sm font-medium text-navy-300 mb-4">Daily Spend vs. Budget</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#4d6491', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4d6491', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${compact(v)}`} domain={[0, (max) => Math.max(max, campaign.budget) * 1.1]} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#6b83b1' }} />
              <Area type="monotone" dataKey="spend" name="Spend" stroke="#f59e0b" strokeWidth={2} fill="url(#spendGrad)" dot={false} />
              <Line type="monotone" dataKey="budget" name="Daily budget" stroke="#96a6ce" strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
