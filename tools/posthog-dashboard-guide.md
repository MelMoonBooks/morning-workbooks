# Melmoon Books Analytics Dashboard

A step-by-step guide to building a PostHog dashboard for the morning workbooks launch. Each section below maps to one **Insight** in PostHog. Total time to set up: ~30 minutes.

---

## What's being tracked

Every visitor session captures the following events automatically:

| Event | When it fires | Properties |
|---|---|---|
| `$pageview` | Auto, every page load | `$current_url`, referrer, etc. |
| `tradition_toggled` | User picks a tradition | `tradition`, `action` (select) |
| `country_toggled` | User picks a country | `country`, `action` (add/remove) |
| `birthday_added` | User adds a family birthday | — |
| `get_full_month_clicked` | User clicks the "Get [Month] free" CTA | `childName`, `age`, `month`, `year`, `traditions`, `regions`, `birthdayCount`, `launchFree` |
| `free_month_started` | User redirects to the free success page | `paymentMethod: "launch_free"` |
| `payment_started` | (Paid mode only) User redirects to Stripe | `paymentMethod: "stripe_payment_link"` |
| `waitlist_submitted` | User submits the printed-books email form | `email`, `currentTraditions`, `currentRegions`, `currentAge` |

People are also `identify()`'d by email when they submit the waitlist, so PostHog auto-stitches sessions across devices.

---

## Setup steps (do this once)

1. Open PostHog → log in
2. Sidebar → **Dashboards** → **New dashboard** → name it **"Morning Workbooks Launch"**
3. For each insight below, click **"Add insight"** → follow the recipe → save → it appears on the dashboard

---

## Insight 1: Conversion funnel

**Goal:** see how many people make it from landing → download.

- **Type:** Funnel
- **Steps** (in order):
  1. Event = `$pageview` where `$current_url` contains `melmoonbooks.com`
  2. Event = `tradition_toggled` OR `country_toggled` OR `birthday_added` (use "Any of" condition) — proxy for "actually customized"
  3. Event = `get_full_month_clicked`
  4. Event = `free_month_started`
- **Conversion window:** 1 hour
- **Visualization:** Vertical funnel bar chart

This is your most important chart. Read it left-to-right and look for the steepest drop-off. That's where to focus next.

---

## Insight 2: Tradition + Region popularity

**Goal:** what combos are people actually picking?

- **Type:** Bar chart
- **Event:** `get_full_month_clicked`
- **Breakdown:** by `traditions` (then create a second insight with breakdown by `regions`)
- **Math:** Unique users (not total events)
- **Date range:** Last 7 days

Make two of these side-by-side: one for `traditions`, one for `regions`. After a week you'll see which combos are core to your audience.

**Hypothesis to check:** India + Hindu (or India + Non-religious) should be the top combos for the ad cohort.

---

## Insight 3: Daily new visitors trend

**Goal:** is traffic growing day over day? Did the ad spike?

- **Type:** Line chart
- **Event:** `$pageview`
- **Math:** Unique users
- **Filter:** `$current_url` contains `melmoonbooks.com`
- **Group by:** Day
- **Date range:** Last 14 days

Watch for ad-spike days vs. organic baseline.

---

## Insight 4: Email signup conversions

**Goal:** how many people are signing up for the printed-books waitlist?

- **Type:** Single value (Big Number)
- **Event:** `waitlist_submitted`
- **Math:** Total count
- **Date range:** Last 7 days

Add a second one with **Math = Unique users** to see if it's the same person submitting multiple times or new people each day.

Bonus: filter by `currentRegions` containing `india` to see if Indian diaspora is interested in printed copies — could be a high-margin product line for that segment.

---

## Insight 5: Most-viewed days of the month

**Goal:** which days are people previewing most? Tells you which images get the most eyeball time.

- **Type:** Bar chart
- **Event:** `$pageview` (or build a custom `day_previewed` event later if needed)
- **Filter:** `$current_url` contains `?day=` (if you've URL-encoded day; otherwise see note below)
- **Breakdown:** by `$current_url` (then sort by frequency)
- **Date range:** Last 14 days

**Note:** if days aren't in the URL, you can add a quick custom event in `test-main.tsx` whenever someone changes the day picker. Ask me to wire it up if you want this.

---

## Insight 6: Time on site (engagement depth)

**Goal:** are visitors actually exploring, or bouncing?

- **Type:** Trends → Average session duration
- **Math:** Average `$session_duration`
- **Group by:** Day
- **Date range:** Last 14 days

Healthy mobile-ad traffic for a kid-focused site typically averages 60-120 seconds. Below 30s means the landing isn't clicking; above 3 min means people are exploring deeply (which is what you want for the free download).

---

## What to do with the dashboard

**Daily 5-minute check (recommended):**
1. Did unique visitors trend up or down vs. yesterday?
2. What % converted at each step of the funnel? Has any step gotten worse?
3. What's the top tradition + region combo today vs. all-time?
4. Any waitlist signups overnight?

**Weekly review (recommended):**
1. Compare full-week numbers to previous week
2. Look at unusual drop-offs by date — was it an ad-spend day? Vercel deploy day?
3. Pull session replays (PostHog → Session replays) for users who customized but didn't click "Get free month" — watch 3-5 to see what stopped them

---

## When to come back to me

After you've watched the data for ~3-5 days, tell me:
- Which combos are dominant
- Where the funnel is bleeding worst
- What kind of repeat-visit signal you're seeing

I can then help you target the next round of content + tweaks at the actual gaps, instead of guessing.

---

## Optional: a built-in dashboard inside Cowork

If you'd rather see a single "morning briefing" page inside Cowork that pulls fresh PostHog data every time you open it (instead of logging into posthog.com), I can build that as a live artifact. It needs your PostHog Personal API key as a one-time setup — let me know and I'll spec it out.
