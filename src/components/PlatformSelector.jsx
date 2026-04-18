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
    bg: 'bg-[#FF9900]',
    desc: 'Reach audiences on Amazon and 1000+ premium sites via Demand-Side Platform.',
    metrics: { impressions: '4.2B', ctr: '0.38%', roas: '8.2x' },
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
    bg: 'bg-[#004E91]',
    desc: 'Reach Walmart shoppers on walmart.com and across the Walmart network.',
    metrics: { impressions: '1.8B', ctr: '0.52%', roas: '6.8x' },
  },
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
            <div className={`w-7 h-7 rounded-lg ${p.bg} flex items-center justify-center p-1`}>
              {p.logo}
            </div>
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

export { platforms }
