import { motion } from 'framer-motion'

const platforms = [
  {
    id: 'amazon',
    name: 'Amazon DSP',
    logo: (
      <svg viewBox="0 0 28 28" className="w-full h-full" fill="none">
        <path d="M13.6 2.3C7.9 2.3 3.7 6.5 3.7 12.2c0 4.2 2.5 7.9 6.2 9.6 0.3 0.1 0.4-0.1 0.4-0.3v-2.9c-2.1 0.3-2.6-1-2.6-1C7 18.3 6 18 6 18c-0.3-0.8-0.8-1-0.8-1-0.7-0.4 0-0.4 0-0.4 0.8 0.1 1.1 0.8 1.1 0.8 0.6 1.1 1.6 0.8 2 0.6 0.1-0.5 0.3-0.8 0.5-1-1.5-0.2-3.2-0.8-3.2-3.4 0-0.7 0.3-1.4 0.7-1.8-0.1-0.2-0.3-0.8 0.1-1.8 0 0 0.6-0.2 1.9 0.7 0.6-0.2 1.2-0.2 1.8-0.2s1.2 0.1 1.8 0.2c1.3-0.9 1.9-0.7 1.9-0.7 0.4 1 0.2 1.6 0.1 1.8 0.4 0.4 0.7 1.1 0.7 1.8 0 2.7-1.6 3.2-3.2 3.4 0.3 0.2 0.5 0.7 0.5 1.4v2.1c0 0.2 0.1 0.4 0.4 0.3 3.7-1.7 6.2-5.4 6.2-9.6C23.5 6.5 19.3 2.3 13.6 2.3z" fill="#FF9900"/>
        <path d="M10.2 9.6c-0.5-0.2-1.1-0.2-1.6 0-0.1 0.8-0.1 1.6 0 2.4 0.5 0.2 1.1 0.2 1.6 0 0.1-0.8 0.1-1.6 0-2.4zM13.6 10c-0.5-0.2-1.1-0.2-1.6 0-0.1 0.8-0.1 1.6 0 2.4 0.5 0.2 1.1 0.2 1.6 0 0.1-0.8 0.1-1.6 0-2.4zM17 9.6c-0.5-0.2-1.1-0.2-1.6 0-0.1 0.8-0.1 1.6 0 2.4 0.5 0.2 1.1 0.2 1.6 0 0.1-0.8 0.1-1.6 0-2.4z" fill="#FF9900"/>
      </svg>
    ),
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
    logo: (
      <svg viewBox="0 0 28 28" className="w-full h-full" fill="none">
        <rect width="28" height="28" rx="4" fill="#004E91"/>
        <path d="M4 8h20M4 14h20M4 20h20" stroke="white" strokeWidth="2.5"/>
        <circle cx="14" cy="14" r="5" fill="#FFC220"/>
      </svg>
    ),
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
          <p className="text-xs text-navy-500">Side-by-side feature breakdown</p>
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
                    <div className={`w-6 h-6 rounded-lg ${p.id === 'amazon' ? 'bg-[#FF9900]' : 'bg-[#004E91]'} flex items-center justify-center p-0.5`}>
                      {p.logo}
                    </div>
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
