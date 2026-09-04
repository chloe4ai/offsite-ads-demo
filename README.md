# Off-Site Ads

**A $500 floor and a $10,000 floor are not the same product with different numbers.**

Off-site retail media gets described as one motion — take the retailer's purchase data, buy inventory somewhere else, attribute back. In practice Amazon DSP and Walmart Connect select for different advertisers, reward different objectives, and fail in different places. This prototype puts the two flows side by side end to end so the difference is visible rather than asserted.

▶ **[Open the prototype](https://chloe4ai.github.io/offsite-ads-demo/)** — no install, all data is mocked

---

## The product argument

**1. The minimum spend is the segmentation.**
Amazon DSP starts at $10,000/month with CPMs from $2.50 and 4,000+ behavioral segments. Walmart Connect starts at $500/month with CPMs from $3.00 against 150M+ shoppers of first-party purchase data. That gap is not pricing trivia — it decides who walks in the door. Amazon's floor selects for brands with an agency and a full-funnel awareness budget. Walmart's floor lets a single-SKU seller run lower-funnel intent with a credit card. Every downstream design choice — how much the builder explains, how many defaults it sets, how forgiving the reporting has to be — follows from which of those two advertisers you are actually serving.

**2. Bid type, not budget, is where self-serve advertisers fall off.**
Advertisers arrive knowing what they want to spend. Almost none arrive knowing whether they want a fixed CPM, an auto bid, or a target-ROAS strategy — and getting it wrong is invisible until the campaign underdelivers a week later. The builder in this prototype treats objective → bid strategy → bid type as one coupled decision and shows the consequence at each step, rather than presenting them as three independent dropdowns the way most consoles do.

**3. Preview is a measurement surface, not a courtesy.**
The same creative renders differently across display, native, video and CTV placements. Showing all placements at once turns "will this look broken somewhere" from a post-launch discovery into a pre-launch decision.

**4. The comparison table is the honest part.**
Rather than claiming one platform wins, the prototype lays both against the same seven dimensions — pricing, minimum budget, reach, formats, targeting, reporting, best-for — and lets the advertiser's own constraint pick. A retail-media product that will not tell you when it is the wrong choice does not get believed the second time.

---

## What's in it

| Surface | What it does |
|---|---|
| **Campaign builder** | Name, objective, daily budget, bid strategy, bid type and amount, audience segments — with the coupling between them made explicit |
| **Ad preview** | One creative across every placement type on both platforms |
| **Performance dashboard** | 7-day impressions, clicks, spend and ROAS |
| **Platform comparison** | Amazon DSP vs. Walmart Connect on seven dimensions, side by side |

Amazon DSP is modeled as full-funnel awareness and competitor conquesting — behavioral, contextual, retargeting and lookalike targeting, reported through brand lift, viewable CPM and verification. Walmart Connect is modeled as lower-funnel purchase intent — purchase-data, category-intent and in-store-behavior targeting, reported through ROAS, sales lift and attribution.

## Stack

React 19 + Vite + Tailwind 4, Framer Motion for transitions, Recharts for the KPI readout. Deployed to GitHub Pages from `main` on every push.

```bash
npm install
npm run dev      # local
npm run build    # static build into dist/
```

## What this is not

- **Not connected to anything.** Every number is fixture data. The point is the flow and the framing, not the reporting.
- **Not a real auction.** There is no bidder, no pacing, no budget-delivery model behind the bid-type selector. The selector demonstrates that the choice matters and what it changes; it does not simulate the outcome.
- **Platform facts are as of build time.** Minimums, CPM floors and segment counts move. Treat them as the shape of the difference, not a rate card.

## What I'd build next

- **A pacing view.** The single most common self-serve failure is underdelivery, and nothing in this prototype exposes it. A delivery curve against budget-remaining would make the bid-type decision consequential instead of merely explained.
- **Incrementality, not attribution.** Both platforms report last-touch by default, which flatters retail media. A holdout-based lift readout beside the attributed number is the version I would actually want to ship.
- **An onboarding drop-off funnel** through the builder, so the "bid type is where they fall off" claim above becomes a measurement rather than a hypothesis.

## License

MIT
