import { ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-950 mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-navy-950" fill="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <span className="font-display font-700 text-navy-100 text-sm tracking-tight">OffSite</span>
                <span className="font-display font-400 text-amber-400 ml-1 text-sm">Ads</span>
              </div>
            </div>
            <div className="text-xs text-navy-500">
              Built by{' '}
              <a
                href="https://chloe4ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-400 hover:text-amber-400 transition-colors"
              >
                chloe4ai
              </a>{' '}
              — Demo purposes only. Not affiliated with Amazon or Walmart.
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/chloe4ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-navy-400 hover:text-navy-200 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              View on GitHub
            </a>
            <a
              href="https://advertising.amazon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-navy-400 hover:text-amber-400 transition-colors"
            >
              Amazon DSP
              <ExternalLink size={10} />
            </a>
            <a
              href="https://advertising.walmart.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-navy-400 hover:text-amber-400 transition-colors"
            >
              Walmart Connect
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-xs text-navy-600">
            OffSite Ads Demo — An interactive demonstration of off-site advertising campaign configuration for Amazon DSP and Walmart Connect.
            Built with React, Tailwind CSS, and Framer Motion.
          </p>
        </div>
      </div>
    </footer>
  )
}
