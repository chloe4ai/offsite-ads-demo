import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, Eye, MousePointerClick, DollarSign, RefreshCw, ArrowUpRight } from 'lucide-react'

const amazonData = [
  { day: 'Mon', impressions: 420000, clicks: 1580, spend: 2100, ctr: 0.38 },
  { day: 'Tue', impressions: 510000, clicks: 1930, spend: 2450, ctr: 0.38 },
  { day: 'Wed', impressions: 480000, clicks: 1820, spend: 2280, ctr: 0.38 },
  { day: 'Thu', impressions: 630000, clicks: 2400, spend: 2980, ctr: 0.38 },
  { day: 'Fri', impressions: 720000, clicks: 2730, spend: 3420, ctr: 0.38 },
  { day: 'Sat', impressions: 580000, clicks: 2200, spend: 2750, ctr: 0.38 },
  { day: 'Sun', impressions: 460000, clicks: 1740, spend: 2180, ctr: 0.38 },
]

const walmartData = [
  { day: 'Mon', impressions: 280000, clicks: 1460, spend: 1400, ctr: 0.52 },
  { day: 'Tue', impressions: 320000, clicks: 1660, spend: 1600, ctr: 0.52 },
  { day: 'Wed', impressions: 350000, clicks: 1820, spend: 1750, ctr: 0.52 },
  { day: 'Thu', impressions: 410000, clicks: 2130, spend: 2050, ctr: 0.52 },
  { day: 'Fri', impressions: 480000, clicks: 2500, spend: 2400, ctr: 0.52 },
  { day: 'Sat', impressions: 390000, clicks: 2030, spend: 1950, ctr: 0.52 },
  { day: 'Sun', impressions: 310000, clicks: 1610, spend: 1550, ctr: 0.52 },
]

const tooltipStyle = {
  backgroundColor: '#1e2a45',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  color: '#c2cfe8',
  fontSize: 12,
  padding: '8px 12px',
}

function MetricCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-navy-800/40 border border-white/5 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center">
          <Icon size={14} className={color} />
        </div>
        <span className="text-xs text-navy-500 font-medium">{label}</span>
      </div>
      <div className="text-2xl font-display font-700 text-navy-50">{value}</div>
      <div className="flex items-center gap-1 mt-1">
        <ArrowUpRight size={12} className="text-emerald-500" />
        <span className="text-xs text-emerald-500 font-medium">{sub}</span>
      </div>
    </div>
  )
}

export default function PerformanceDashboard({ platform }) {
  const data = platform === 'amazon' ? amazonData : walmartData
  const totalImpressions = data.reduce((sum, d) => sum + d.impressions, 0)
  const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0)
  const totalSpend = data.reduce((sum, d) => sum + d.spend, 0)
  const avgCTR = totalClicks / totalImpressions * 100
  const avgROAS = platform === 'amazon' ? 8.2 : 6.8

  return (
    <div className="bg-navy-900/60 border border-white/8 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center animate-pulse-glow">
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="font-display font-700 text-navy-50 text-lg">Performance Dashboard</h2>
            <p className="text-xs text-navy-500">Last 7-day campaign metrics</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-navy-400 hover:text-navy-200 transition-colors">
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          icon={Eye}
          label="Total Impressions"
          value={`${(totalImpressions / 1000000).toFixed(1)}M`}
          sub="+12% vs last week"
          color="text-blue-400"
        />
        <MetricCard
          icon={MousePointerClick}
          label="Total Clicks"
          value={totalClicks.toLocaleString()}
          sub={`${avgCTR.toFixed(2)}% CTR`}
          color="text-amber-400"
        />
        <MetricCard
          icon={DollarSign}
          label="Total Spend"
          value={`$${(totalSpend / 1000).toFixed(1)}K`}
          sub="On budget"
          color="text-rose-400"
        />
        <MetricCard
          icon={TrendingUp}
          label="Avg ROAS"
          value={`${avgROAS}x`}
          sub="Return on Ad Spend"
          color="text-emerald-400"
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
              <YAxis tick={{ fill: '#4d6491', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}K`} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#6b83b1' }} />
              <Bar dataKey="impressions" fill="#334470" radius={[4, 4, 0, 0]} name="Impressions" />
              <Bar dataKey="clicks" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/30 border border-white/5 rounded-2xl p-4">
          <h3 className="text-sm font-medium text-navy-300 mb-4">Daily Spend Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#4d6491', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4d6491', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}K`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#spendGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
