import { motion } from 'framer-motion'
import PlatformMark from './PlatformMark'
import { BID_TYPES } from '../lib/campaignRules'

const amazonAdStyles = [
  {
    id: 'hero',
    name: 'Hero Banner',
    size: '728x90',
    desc: 'Leaderboard — top of page, premium placement',
    bg: 'from-slate-800 to-slate-900',
    badge: 'Premium',
  },
  {
    id: 'rectangle',
    name: 'Product Rectangle',
    size: '300x250',
    desc: 'Medium rectangle — sidebar or in-content',
    bg: 'from-slate-700 to-slate-800',
    badge: 'Standard',
  },
  {
    id: 'mobile',
    name: 'Mobile Banner',
    size: '320x50',
    desc: 'Mobile interstitial — app and web',
    bg: 'from-slate-800 to-slate-700',
    badge: 'Mobile',
  },
]

const walmartAdStyles = [
  {
    id: 'display',
    name: 'Display Ad',
    size: '300x250',
    desc: 'Placed on Walmart.com homepage and category pages',
    bg: 'from-blue-900 to-blue-950',
    badge: 'Standard',
  },
  {
    id: 'native',
    name: 'Native In-Feed',
    size: '600x400',
    desc: 'Blend seamlessly into Walmart search results',
    bg: 'from-blue-800 to-blue-900',
    badge: 'Native',
  },
  {
    id: 'video',
    name: 'Video Ad',
    size: '1920x1080',
    desc: 'Pre-roll on Walmart streaming content',
    bg: 'from-blue-950 to-slate-900',
    badge: 'Video',
  },
]

export default function AdPreview({ platform, campaign }) {
  const adStyles = platform === 'amazon' ? amazonAdStyles : walmartAdStyles

  return (
    <div className="bg-navy-900/60 border border-white/8 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-navy-300" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </div>
        <div>
          <h2 className="font-display font-700 text-navy-50 text-lg">Ad Preview</h2>
          <p className="text-xs text-navy-500">One creative across every placement, before launch</p>
        </div>
      </div>

      <div className="space-y-4">
        {adStyles.map((style, i) => (
          <motion.div
            key={style.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="border border-white/5 rounded-2xl overflow-hidden bg-navy-800/40"
          >
            {/* Ad mock */}
            <div className={`relative h-40 bg-gradient-to-br ${style.bg} flex items-center justify-center p-4`}>
              <div className="absolute top-2 right-2">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/40 text-white/60 border border-white/10">
                  {style.badge}
                </span>
              </div>
              <div className="w-full max-w-[260px]">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <PlatformMark platform={platform} size="w-5 h-5 text-[10px]" />
                    <div className="h-3 flex-1 rounded bg-white/20" style={{ width: `${60 + i * 15}%` }} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3 w-3/4 rounded bg-white/15" />
                    <div className="h-2 w-full rounded bg-white/10" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="h-7 w-20 rounded-lg bg-amber-500 text-navy-950 text-xs font-bold flex items-center justify-center">
                      Shop Now
                    </div>
                    <div className="h-7 w-16 rounded-lg border border-white/20 flex items-center justify-center">
                      <div className="w-4 h-4 rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Size label */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
              <div>
                <div className="text-sm font-medium text-navy-200">{style.name}</div>
                <div className="text-xs text-navy-500 mt-0.5">{style.desc}</div>
              </div>
              <span className="text-xs font-mono text-navy-600 bg-navy-800 px-2 py-1 rounded-lg border border-white/5">
                {style.size}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Campaign summary chip */}
      <div className="mt-4 p-3 rounded-xl bg-navy-800/40 border border-white/5 flex flex-wrap gap-2">
        <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
          {platform === 'amazon' ? 'Amazon DSP' : 'Walmart Connect'}
        </span>
        <span className="text-xs font-mono text-navy-300 bg-navy-700 px-2 py-1 rounded-lg border border-white/5">
          {BID_TYPES.find((t) => t.value === campaign.bidType)?.short}
        </span>
        <span className="text-xs font-mono text-navy-300 bg-navy-700 px-2 py-1 rounded-lg border border-white/5">
          ${campaign.budget.toLocaleString()}/day
        </span>
        <span className="text-xs font-mono text-navy-300 bg-navy-700 px-2 py-1 rounded-lg border border-white/5">
          {campaign.objective}
        </span>
      </div>
    </div>
  )
}
