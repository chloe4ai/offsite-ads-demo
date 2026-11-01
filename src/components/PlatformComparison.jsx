import { motion } from 'framer-motion'
import PlatformMark from './PlatformMark'

const platforms = [
  {
    id: 'amazon',
    name: 'Amazon DSP',
    color: '#FF9900',
    pricing: 'CPM from $2.50',
    minBudget: '$10,000/mo minimum',
    audience: '4,000+ segments',
    formats: 'Display, Video, Audio, CTV',
    targeting: 'Behavioral, Contextual, Retargeting, Lookalike',
    reporting: 'Brand Lift, Viewable CPM, Verification',
    bestFor: 'Full-funnel awareness, competitor conquesting',
  },
  {
    id: 'walmart',
    name: 'Walmart Connect',
    color: '#004E91',
    pricing: 'CPM from $3.00',
    minBudget: '$500/month minimum',
    audience: '150M+ Walmart shoppers',
    formats: 'Display, Native, Sponsored, Video, CTV',
    targeting: 'Purchase data, Category intent, In-store behavior',
    reporting: 'ROAS, Sales Lift, Attribution',
    bestFor: 'Lower-funnel purchase intent, retail media',
  },
]

const dimensions = [
  { key: 'pricing', label: 'Pricing' },
  { key: 'minBudget', label: 'Minimum Budget' },
  { key: 'audience', label: 'Audience Reach' },
  { key: 'formats', label: 'Ad Formats' },
  { key: 'targeting', label: 'Targeting' },
  { key: 'reporting', label: 'Reporting' },
  { key: 'bestFor', label: 'Best For' },
]

export default function PlatformComparison() {
  return (
    <div id="comparison" className="bg-navy-900/60 border border-white/8 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-navy-300" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
          </svg>
        </div>
        <div>
          <h2 className="font-display font-700 text-navy-50 text-lg">Platform Comparison</h2>
          <p className="text-xs text-navy-500">Same seven dimensions, side by side. Let your constraint pick.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left py-3 text-xs font-medium text-navy-500 uppercase tracking-wide w-1/3">Dimension</th>
              {platforms.map((p) => (
                <th key={p.id} className="text-left py-3 px-4">
                  <div className="flex items-center gap-2">
                    <PlatformMark platform={p.id} size="w-6 h-6 text-xs" />
                    <span className="text-sm font-medium text-navy-200">{p.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim, i) => (
              <motion.tr
                key={dim.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/4"
              >
                <td className="py-3 text-sm text-navy-500">{dim.label}</td>
                {platforms.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-sm text-navy-200">
                    {p[dim.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-navy-800/40 border border-white/5 text-xs text-navy-400">
        <strong className="text-navy-300">Note:</strong> Both platforms support retargeting, conversion tracking, and audience segmentation. Amazon DSP requires a managed-service relationship or approved DSP partner; Walmart Connect can be self-serve via the Walmart Advertising Console.
      </div>
    </div>
  )
}
