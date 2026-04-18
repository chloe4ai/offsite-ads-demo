import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-navy-600/20 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)', backgroundSize: '40px 40px'}} />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 text-xs font-medium mb-6 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Interactive Product Demo
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-700 text-navy-50 tracking-tight leading-[1.1] max-w-[800px] mx-auto mb-6 animate-fade-up" style={{animationDelay: '100ms'}}>
          Off-Site Advertising
          <br />
          <span className="text-amber-400">Done Right</span>
        </h1>

        <p className="text-base sm:text-lg text-navy-300 max-w-[560px] mx-auto leading-relaxed mb-10 animate-fade-up" style={{animationDelay: '200ms'}}>
          Build, preview, and measure sponsored ads campaigns across Amazon DSP and Walmart Connect — from a single interface.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{animationDelay: '300ms'}}>
          <button
            onClick={() => document.getElementById('campaign-builder').scrollIntoView({behavior: 'smooth'})}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-navy-950 font-semibold text-sm hover:bg-amber-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/25"
          >
            Build a Campaign
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => document.getElementById('comparison').scrollIntoView({behavior: 'smooth'})}
            className="px-6 py-3 rounded-xl border border-white/10 text-navy-200 font-medium text-sm hover:border-white/20 hover:text-navy-50 transition-all"
          >
            Compare Platforms
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[600px] mx-auto animate-fade-up" style={{animationDelay: '400ms'}}>
          {[
            { label: 'Campaign Types', value: '3' },
            { label: 'Audience Segments', value: '20+' },
            { label: 'Bid Strategies', value: '5' },
            { label: 'KPI Metrics', value: '12' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="text-2xl font-display font-700 text-amber-400">{stat.value}</div>
              <div className="text-xs text-navy-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
