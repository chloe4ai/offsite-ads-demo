import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import PlatformSelector from './components/PlatformSelector'
import CampaignBuilder from './components/CampaignBuilder'
import AdPreview from './components/AdPreview'
import PerformanceDashboard from './components/PerformanceDashboard'
import PlatformComparison from './components/PlatformComparison'
import Footer from './components/Footer'

const INITIAL_AMAZON = {
  name: 'Spring Sale — Premium Headphones',
  objective: 'awareness',
  budget: 12000,
  bidStrategy: 'auto',
  productAsin: 'B09V4HXPB5',
  audience: 'electronics_intenders',
  bidType: 'impression',
  bidAmount: 5,
  startDate: '2026-05-01',
  endDate: '2026-05-31',
}

const INITIAL_WALMART = {
  name: 'Spring Sale — Multivitamins',
  objective: 'consideration',
  budget: 8000,
  bidStrategy: 'target_cpa',
  productSku: 'SKU-VIT-D30',
  audience: 'health_shopper',
  bidType: 'click',
  bidAmount: 2.5,
  startDate: '2026-05-01',
  endDate: '2026-05-31',
}

function App() {
  const [platform, setPlatform] = useState('amazon')
  const [amazonCampaign, setAmazonCampaign] = useState(INITIAL_AMAZON)
  const [walmartCampaign, setWalmartCampaign] = useState(INITIAL_WALMART)

  const campaign = platform === 'amazon' ? amazonCampaign : walmartCampaign
  const setCampaign = platform === 'amazon' ? setAmazonCampaign : setWalmartCampaign

  return (
    <div className="min-h-screen bg-navy-950 text-navy-100 font-sans">
      <Header />
      <Hero />
      <PlatformSelector platform={platform} setPlatform={setPlatform} />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-32">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          <CampaignBuilder
            platform={platform}
            campaign={campaign}
            setCampaign={setCampaign}
          />
          <AdPreview platform={platform} campaign={campaign} />
        </div>
        <div className="mt-8">
          <PerformanceDashboard platform={platform} />
        </div>
        <div className="mt-8">
          <PlatformComparison />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
