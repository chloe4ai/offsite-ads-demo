import { motion } from 'framer-motion'

import PlatformMark from './PlatformMark'

const platforms = [
  { id: 'amazon', name: 'Amazon DSP', desc: 'Amazon DSP: reach audiences on Amazon and third-party sites. $10,000/month minimum.' },
  { id: 'walmart', name: 'Walmart Connect', desc: 'Walmart Connect: reach Walmart shoppers on and off walmart.com. $500/month minimum.' },
]

export default function PlatformSelector({ platform, setPlatform }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
      <div className="flex gap-2 p-1 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm w-fit mx-auto mb-2">
        {platforms.map((p) => (
          <motion.button
            key={p.id}
            onClick={() => setPlatform(p.id)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              platform === p.id
                ? 'bg-white/10 text-navy-50 shadow-lg'
                : 'text-navy-400 hover:text-navy-200'
            }`}
          >
            <PlatformMark platform={p.id} />
            {p.name}
          </motion.button>
        ))}
      </div>
      <p className="text-center text-xs text-navy-500 mt-2">
        {platforms.find((p) => p.id === platform)?.desc}
      </p>
    </div>
  )
}
