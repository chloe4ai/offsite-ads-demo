# Off-Site Ads

**A $500 floor and a $10,000 floor are not the same product with different numbers.**

Off-site retail media gets described as one motion — take the retailer's purchase data, buy inventory somewhere else, attribute back. In practice Amazon DSP and Walmart Connect select for different advertisers, reward different objectives, and fail in different places. This prototype puts the two flows side by side end to end so the difference is visible rather than asserted.

▶ **[Open the prototype](https://chloe4ai.github.io/offsite-ads-demo/)** — no install, all data is mocked

---

## The product argument

**1. The minimum spend is the segmentation.**
Amazon DSP starts at $10,000/month with CPMs from $2.50 and 4,000+ behavioral segments. Walmart Connect starts at $500/month with CPMs from $3.00 against 150M+ shoppers of first-party purchase data. That gap is not pricing trivia — it decides who walks in the door. Amazon's floor selects for brands with an agency and a full-funnel awareness budget. Walmart's floor lets a single-SKU seller run lower-funnel intent with a credit card. Every downstream design choice — how much the builder explains, how many defaults it sets, how forgiving the reporting has to be — follows from which of those two advertisers you are actually serving. In the prototype the same $200/day over a month-long flight passes on Walmart Connect and fails on Amazon DSP, and the builder says which advertiser each floor is selecting for.

**2. Bid type, not budget, is where self-serve advertisers fall off.**
Advertisers arrive knowing what they want to spend. Almost none arrive knowing whether they want a fixed CPM, an auto bid, or a target-ROAS strategy — and getting it wrong is invisible until the campaign underdelivers a week later. The builder in this prototype treats objective → bid strategy → bid type as one coupled decision: each objective narrows the strategies and bid types on offer, an invalid combination is corrected with a note saying why, and the delivery panel shows what the choice costs — a fixed bid that does not clear, or a ROAS target above what the inventory returns, visibly underdelivers.

**3. Preview is a measurement surface, not a courtesy.**
The same creative renders differently across leaderboard, rectangle, mobile, native and video placements. Showing all placements at once turns "will this look broken somewhere" from a post-launch discovery into a pre-launch decision.

**4. The comparison table is the honest part.**
Rather than claiming one platform wins, the prototype lays both against the same seven dimensions — pricing, minimum budget, reach, formats, targeting, reporting, best-for — and lets the advertiser's own constraint pick. A retail-media product that will not tell you when it is the wrong choice does not get believed the second time.

---

## What's in it

| Surface | What it does |
|---|---|
| **Campaign builder** | Name, objective, daily budget, bid strategy, bid type and amount, audience segments — with each platform's monthly minimum enforced against the flight's total budget and the coupling between objective, strategy and bid type made explicit |
| **Ad preview** | One creative across every placement type on both platforms |
| **Projected delivery** | Pacing over the first 7 days of the flight, or the whole flight if shorter (spend vs. daily budget), impressions and clicks, recomputed from the campaign as you edit, with a one-line diagnosis of why it is or is not delivering. Shown only once the builder's checks pass |
| **Platform comparison** | Amazon DSP vs. Walmart Connect on seven dimensions, side by side |

Amazon DSP is modeled as full-funnel awareness and competitor conquesting — behavioral, contextual, retargeting and lookalike targeting, reported through brand lift, viewable CPM and verification. Walmart Connect is modeled as lower-funnel purchase intent — purchase-data, category-intent and in-store-behavior targeting, reported through ROAS, sales lift and attribution.

All the rules and the delivery model live in one file, `src/lib/campaignRules.js`, so the builder and the dashboard cannot disagree.

## Stack

React 19 + Vite + Tailwind 4, Framer Motion for transitions, Recharts for the KPI readout, Vitest for the rules. Deployed to GitHub Pages from `main` on every push once lint and tests pass; pull requests run the same checks and build without deploying.

```bash
npm install
npm run dev      # local
npm run lint
npm test         # campaign rules (src/lib/campaignRules.test.js)
npm run build    # static build into dist/
```

## What this is not

- **Not connected to anything.** Every number is fixture data. The point is the flow and the framing, not the reporting.
- **Not a real auction.** Delivery comes from a deliberately simple model: the bid is converted to an effective CPM using platform-benchmark CTR and CVR, compared with a clearing price of 1.4× the floor, and the gap becomes a share of auctions won. Auto bidding always clears; ROAS targets are throttled by their distance from the platform benchmark. It shows the direction and rough size of the effect, not a forecast.
- **The minimum is checked against the flight, not a monthly rate.** Both platforms state their minimum per month, as a commitment on spend. The builder multiplies the daily budget by the flight's days and requires one full monthly minimum for any flight up to 31 days, pro-rating longer flights at one minimum per 31 days. So $340/day for a 3-day burst ($1,020) fails Amazon DSP's $10,000, while $323/day for 31 days ($10,013) passes.
- **The coupling is a modeled rule set.** Which strategies and bid types each objective allows is my reading of how the two consoles behave, simplified; the real consoles have more options and more exceptions.
- **Platform facts are as of build time.** Minimums, CPM floors and segment counts move. Treat them as the shape of the difference, not a rate card.

## What I'd build next

- **Pacing over the whole flight.** The delivery panel covers the first seven days at a flat budget. Real pacing redistributes unspent budget across the remaining flight, which is where most self-serve underdelivery becomes visible too late.
- **Incrementality, not attribution.** Both platforms report last-touch by default, which flatters retail media. A holdout-based lift readout beside the attributed number is the version I would actually want to ship.
- **An onboarding drop-off funnel** through the builder, so the "bid type is where they fall off" claim above becomes a measurement rather than a hypothesis.

## License

MIT
