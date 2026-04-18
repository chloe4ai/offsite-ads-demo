# OffSite Ads Demo

An interactive, production-quality web application demonstrating how off-site advertising campaigns are configured, previewed, and measured across **Amazon DSP** and **Walmart Connect**.

Built with **React**, **Tailwind CSS**, and **Framer Motion**.

## Features

### Campaign Builder
- Configure campaign name, objective, daily budget, bid strategy, bid type, and bid amount
- Select from platform-specific audience segments (Amazon: in-market, retargeting, lookalike; Walmart: purchase data, grocery, W+ members)
- Set campaign duration with date pickers
- Enter product ASIN (Amazon) or SKU (Walmart)
- Real-time validation with launch readiness indicator

### Ad Preview
- Live preview of ad creatives across multiple placements (hero banner, product rectangle, mobile, native in-feed, video)
- Platform-branded mock ad units showing logo, headline, CTA button, and product imagery
- Campaign summary chips showing platform, bid type, budget, and objective

### Performance Dashboard
- 7-day KPI metrics: impressions, clicks, spend, ROAS
- Bar chart: Impressions & Clicks by day
- Area chart: Daily spend trend
- Metric cards with week-over-week delta indicators

### Platform Comparison
- Side-by-side feature table covering pricing, minimum budgets, audience reach, ad formats, targeting, reporting, and use cases
- Platform logo and branding for Amazon DSP and Walmart Connect

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React + inline SVG |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## About Off-Site Advertising

**Off-site advertising** (also called display advertising or programmatic advertising) allows brands to reach audiences on third-party websites and apps — not just on the platform's owned properties.

| Platform | Description | Minimum Budget |
|----------|-------------|----------------|
| **Amazon DSP** | Reach audiences across 1000+ premium sites. Supports display, video, audio, and CTV. | $10,000/mo (managed) |
| **Walmart Connect** | Reach Walmart shoppers on walmart.com and the Walmart network using first-party purchase data. | $500/mo (self-serve) |

### Key Concepts Demonstrated

- **Campaign Objectives**: Awareness, Consideration, Conversion
- **Bid Strategies**: Auto, Fixed, Target ROAS, Target CPA, Dynamic bidding
- **Bid Types**: CPM, CPC, vCPM, CPA
- **Audience Targeting**: In-market segments, retargeting, lookalike, lifestyle, purchase behavior
- **KPIs**: Impressions, CTR, ROAS, Spend, Conversions

## License

MIT — Demo purposes only. Not affiliated with Amazon.com, Inc. or Walmart Inc.

---

Built by [chloe4ai](https://github.com/chloe4ai)
