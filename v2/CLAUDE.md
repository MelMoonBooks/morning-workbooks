# MelMoon Books — Claude Code Project Guide

## What This Is
MelMoon Books (melmoonbooks.com) is a children's educational product company. The first product is a **Morning Workbook** — a daily printable/downloadable workbook for children ages 3–6 that includes letter tracing, math activities, and coloring pages. Pages are personalized by child's name, age, faith tradition, region, and today's date.

The second product (in development) is **Faith Tradition Coloring Books** — themed coloring books tied to holidays and traditions (e.g. a Diwali coloring book, an Easter coloring book).

## Founder
Melanie B. Beckwith — immigration attorney, Alameda CA. Two daughters ages 3 and 5. Christian + Hindu mixed-faith family. GitHub: github.com/MelMoonBooks

---

## Current State (v1 — branch: main)

### Live App
- URL: morning-workbooks.vercel.app
- GitHub: github.com/MelMoonBooks/morning-workbooks
- Stack: React 18 + TypeScript + Vite + Clerk auth + Vercel

### What's Built
- Full morning workbook generator with:
  - Letter tracing (ages 3-4: single letter; ages 5-6: full word)
  - Color activities (even days: Color the Scene; odd days: Trace & Color)
  - Math activities (ages 3-4: count/circle/color; ages 5-6: addition/subtraction/before&after/taller-shorter/pennies/write numbers)
  - Mini calendar with day circling
  - Name writing line
  - Footer quote (faith-tradition aware)
  - Holiday messages in header
- Multi-child profile system (saved to localStorage)
- PDF download (html2canvas + jsPDF, all 31 days)
- Clerk authentication (email + Google)
- Landing page with live interactive preview (unauthenticated)
- Faith traditions: Non-religious, Christian, Hindu, Both

### Current File Structure
```
src/
  App.tsx          ← entire app (~2600 lines, monolithic)
  LandingPage.tsx  ← landing page with simplified preview
  main.tsx         ← routes between LandingPage (signed out) and App (signed in)
public/
  images/          ← coloring book images named march_01.png etc.
```

### Known Issues in v1
- App.tsx is monolithic — everything in one file
- LandingPage preview is a simplified version of DayPage, not the real thing
- Action prompts removed but affirmation system needs cleanup
- Only Non-religious and Hindu have full quote databases; Christian has full database; Jewish/Muslim not yet built
- Color scheme on landing page is inconsistent (work in progress)
- Images not loading on mobile (Vercel caching issue being investigated)

---

## V2 Architecture (branch: v2) — BUILD THIS

### Vision
V2 is a complete rewrite with clean architecture. The v1 app stays live on `main` while v2 is built on the `v2` branch. When ready, v2 merges into main.

### Core Design Principles

#### 1. Content is separated from code
All text content (quotes, holidays, activity subjects, coloring book metadata) lives in `src/content/` — not mixed into React components. This allows:
- Non-technical editors to update quotes without touching code
- Easy review by tradition experts (Hindu scholar, Catholic priest, Rabbi, etc.)
- Easy expansion to new traditions and regions
- Future migration to a CMS or database

#### 2. Layered content system
Content is built in layers that stack on top of each other:
```
Universal (base layer)
  + Region layer (US, India, UK)
  + Tradition layer (Hindu, Catholic, Protestant, Jewish, Muslim)
  = Final page content
```

#### 3. Dominant tradition cycling
When a family selects multiple traditions:
- Each day has one "dominant" tradition that drives the full page theme
- Traditions cycle: Day 1 = Tradition A dominant, Day 2 = Tradition B dominant, etc.
- Exception: If a MAJOR holiday falls on a day, that holiday overrides the cycling and becomes dominant
- Minor holidays and birthdays appear in the header but don't override the dominant theme

#### 4. Thematic consistency per page
Every element on a single day's page should be thematically aligned:
- The coloring image
- The word being traced
- The footer quote
- The holiday message
All should reinforce the same theme for that day.

#### 5. Products share the same content system
Both the Morning Workbook and Coloring Books use the same profile/tradition/region/theme system.

---

## V2 Folder Structure

```
src/
  content/
    types.ts                    ← All TypeScript interfaces
    index.ts                    ← Content merger — combines layers based on selections
    themes/
      universal/
        activities.ts           ← Default activities for all 12 months
        holidays.ts             ← US civic holidays (4th July, Thanksgiving, etc.)
        affirmations.ts         ← Non-religious wisdom quotes (365 entries)
      christian-catholic/
        activities.ts           ← Catholic-specific activity themes
        holidays.ts             ← Feast days, saint days, liturgical calendar
        affirmations.ts         ← Bible verses + saint quotes (365 entries)
      christian-protestant/
        activities.ts
        holidays.ts
        affirmations.ts         ← Bible verses (365 entries)
      hindu/
        activities.ts           ← Indian-themed activities (color the diya, rangoli, dosa)
        holidays.ts             ← Diwali, Holi, Navratri, Pongal, Ganesha Chaturthi, etc.
        affirmations.ts         ← Gita, Ramayana, Mahabharata, Upanishads (365 entries)
      jewish/
        activities.ts
        holidays.ts             ← Rosh Hashanah, Yom Kippur, Hanukkah, Passover, etc.
        affirmations.ts         ← Torah, Talmud, Jewish wisdom quotes
      muslim/
        activities.ts
        holidays.ts             ← Eid al-Fitr, Eid al-Adha, Ramadan, etc.
        affirmations.ts         ← Quran verses, Hadith wisdom quotes
    regions/
      us/
        holidays.ts             ← 4th July, Memorial Day, Labor Day, etc.
      india/
        holidays.ts             ← Republic Day, Independence Day, regional festivals
        activities.ts           ← India-specific activity themes
      uk/
        holidays.ts
    coloring-books.ts           ← Coloring book catalog metadata
  products/
    morning-workbook/
      DayPage.tsx               ← The full workbook page (shared with landing page)
      PDFGenerator.tsx          ← PDF generation logic
      MathActivities.tsx        ← All math activity components
      LetterTracing.tsx         ← Letter tracing components
      ColorActivity.tsx         ← Coloring activity components
    coloring-book/
      ColoringBookPage.tsx      ← Future coloring book product
      PDFGenerator.tsx
  shared/
    ProfileModal.tsx            ← Child profile management
    ImageCache.tsx              ← Image loading/caching system
    DrawingPrimitives.tsx       ← RuledLine, WriteBox, TraceLetter, SvgObject, etc.
  App.tsx                       ← Morning workbook app (authenticated)
  LandingPage.tsx               ← Landing page (uses real DayPage, not simplified)
  main.tsx                      ← Clerk auth routing
```

---

## TypeScript Interfaces (src/content/types.ts)

```typescript
// A single day's complete content theme
interface DayTheme {
  word: string              // for letter tracing
  subject: string           // for coloring image description
  instruction: string       // "Color the diya!"
  colorWord: string         // word to trace in trace & color activity
  imageFile?: string        // e.g. "march_14.png" or "diwali_diya.png"
  tags: string[]            // ["hindu", "diwali", "light", "festival"]
}

// A holiday entry
interface Holiday {
  date: string              // "MM-DD"
  name: string              // "Diwali"
  tradition: string         // "hindu" | "christian-catholic" | "universal" etc.
  isMajor: boolean          // true = overrides dominant theme cycling
  sentence: string          // "Happy Diwali! Today we celebrate the victory of light!"
  theme?: Partial<DayTheme> // optional theme override for major holidays
}

// An affirmation/quote entry
interface Affirmation {
  quote: string
  ref: string               // "Gita 3:19" or "Ps 23:1" or "Einstein" or ""
  tradition: string         // which tradition this belongs to
}

// A coloring book product
interface ColoringBook {
  id: string
  title: string
  description: string
  coverEmoji: string        // placeholder until real cover images exist
  coverImage?: string
  traditions: string[]      // ["hindu"] or ["christian-catholic"] or ["universal"]
  regions: string[]         // ["us", "india", "global"]
  months: number[]          // [10, 11] = October/November (Diwali season)
  tags: string[]            // ["diwali", "light", "festival"]
  price: number             // 9.99
  pageCount: number
  available: boolean        // false = "Coming Soon"
  previewPages?: string[]   // image file names for preview
}

// A child profile
interface ChildProfile {
  id: string
  name: string
  age: number               // 3, 4, 5, or 6
  traditions: string[]      // multi-select: ["hindu", "christian-catholic"]
  region: string            // "us" | "india" | "uk" | "global"
  emoji: string
  birthdays: Birthday[]     // this child's birthday list
}

// A birthday entry (per child profile)
interface Birthday {
  id: string
  name: string              // "Nana Jo"
  month: number             // 1-12
  day: number               // 1-31
}
```

---

## Content Merging Logic (src/content/index.ts)

```typescript
// Given a child's traditions, region, month, and day — return the complete content for that day
function getDayContent(
  traditions: string[],
  region: string,
  month: string,
  day: number,
  year: number
): {
  theme: DayTheme,
  holidays: Holiday[],
  affirmation: Affirmation,
  dominantTradition: string,
  suggestedColoringBooks: ColoringBook[]
}
```

**Logic:**
1. Start with universal activities for month/day
2. Check for major holidays in ALL selected traditions + region → if found, that holiday is dominant
3. If no major holiday, use cycling to determine dominant tradition (day % traditions.length)
4. Apply dominant tradition's theme overlay
5. Collect ALL holidays from all traditions for the header display
6. Select affirmation from dominant tradition's database
7. Find suggested coloring books matching traditions + current month

---

## Dominant Tradition Cycling

```typescript
function getDominantTradition(
  traditions: string[],
  day: number,
  month: string,
  year: number,
  holidays: Holiday[]
): string {
  // Check for major holiday override first
  const majorHoliday = holidays.find(h => h.isMajor);
  if (majorHoliday) return majorHoliday.tradition;
  
  // Otherwise cycle through traditions by day
  return traditions[day % traditions.length];
}
```

---

## Landing Page Design (v2)

### Layout (top to bottom)
1. **Nav** — MelMoon Books + Sign In + Get Started Free
2. **Hero** — tagline + description mentioning faith traditions feature
3. **Interactive workbook preview** — full controls (child name, month, faith tradition multi-select, age, day, region, birthdays) + REAL DayPage component (identical to app)
4. **Suggested coloring books carousel** — scrolls horizontally, updates dynamically as user toggles tradition/region/month
5. **Pricing** — workbook tiers + coloring book add-ons
6. **CTA** — Create Free Account

### Key landing page features
- Uses the REAL `DayPage` component — not a simplified version
- Child name can be typed but is NOT saved
- Birthdays can be added but are NOT saved
- PDF download and book ordering are LOCKED (show tooltip explaining pricing)
- Faith tradition is multi-select (can select multiple)
- Coloring book carousel responds in real-time to tradition/region changes

### Coloring book carousel
- Shows 4-6 coloring book cards in a horizontal scroll
- Cards show: cover emoji/image, title, price, "Coming Soon" badge if not available
- Updates when user changes tradition, region, or month
- Placeholder cards for books not yet created

---

## Pricing Structure

| Product | Price | Details |
|---|---|---|
| Free Account | $0 | Preview app, save profiles, no downloads |
| PDF Download | $2.99 | One month's PDF, one purchase |
| PDF Subscription | $4.99/mo | Current month PDF unlocked automatically |
| 1 Printed Book | $24.99 | One month, printed & shipped |
| 3 Printed Books | $59.99 | Save $15 vs buying one at a time |
| 12 Printed Books | $199.99 | Full year, save $100 |
| Coloring Book PDF | $9.99 | One coloring book PDF download |
| Coloring Book Print | $19.99 | One coloring book printed & shipped |

---

## Faith Traditions (v2)

### Supported traditions
- `non-religious` — universal wisdom quotes, no religious content
- `christian-catholic` — Bible verses + Catholic saint days + feast days
- `christian-protestant` — Bible verses + Protestant holidays
- `hindu` — Gita, Ramayana, Mahabharata, Upanishads + Indian festivals
- `jewish` — Torah, Talmud + Jewish holidays
- `muslim` — Quran, Hadith + Islamic holidays

### Multi-select behavior
- Parents can select 1, 2, or 3 traditions
- 1 tradition: always that tradition
- 2 traditions: alternate daily (odd days = tradition A, even days = tradition B)
- 3 traditions: cycle (day % 3)
- Major holidays always override cycling

---

## Coloring Book Catalog (initial)

### Available at launch
- None yet — all "Coming Soon"

### Planned titles
**Hindu:**
- The First Diwali (October/November)
- Holi — Festival of Colors (March)
- Ganesha — The Remover of Obstacles (September)
- The Story of Rama and Sita (October)

**Christian:**
- The Easter Story (March/April)
- The Christmas Nativity (December)
- Saints for Little Ones (November/All year)

**Universal:**
- Seasons of the Year (All year)
- Animals of the World (All year)
- My Family (All year)

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + TypeScript | Frontend |
| Vite | Build tool |
| Clerk | Authentication (email + Google) |
| Vercel | Hosting + deployment |
| GitHub | Source control (main = live, v2 = development) |
| html2canvas + jsPDF | PDF generation |
| Stripe | Payments (not yet integrated) |
| Lulu API | Print on demand (not yet integrated) |
| Supabase | Database (planned for v2) |

---

## Image System

### Naming convention
`{month}_{day}.png` — e.g. `march_14.png`

### Location
`public/images/` in the GitHub repo

### Status
- March: days 11-18 uploaded, rest are placeholders
- April-August: not yet uploaded

### Generation
Images generated in ChatGPT using "Coloring Book Hero" style prompt:
> "Simple black and white coloring book page for a 4-year-old of [subject]. Clean outlines, no shading, lots of white space."

---

## Authentication Flow

```
User visits morning-workbooks.vercel.app
  ↓
main.tsx checks Clerk auth state
  ↓
SignedOut → LandingPage (full preview, no save, locked downloads)
SignedIn → App (full app, profiles saved, downloads available with subscription)
```

---

## Environment Variables (Vercel)
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key

---

## What To Build Next (V2 Priority Order)

1. **Set up content folder structure** — create all the files in src/content/ with proper TypeScript interfaces
2. **Move activities to content files** — extract DAILY_ACTIVITIES from App.tsx into src/content/themes/universal/activities.ts
3. **Move affirmations to content files** — one file per tradition
4. **Move holidays to content files** — universal + per tradition
5. **Create coloring books catalog** — src/content/coloring-books.ts
6. **Build content merger** — src/content/index.ts with getDayContent()
7. **Build shared drawing primitives** — src/shared/DrawingPrimitives.tsx
8. **Build shared DayPage component** — src/products/morning-workbook/DayPage.tsx
9. **Build ProfileModal with birthday support** — src/shared/ProfileModal.tsx
10. **Build new LandingPage** — uses real DayPage + coloring book carousel
11. **Build new App.tsx** — clean, imports from content/ and products/
12. **Add Jewish + Muslim quote databases**
13. **Add region support** (US default, India as second region)
14. **Stripe integration**
15. **Lulu print-on-demand integration**

---

## Notes on Content Quality

The content libraries (affirmations, holidays, activities) are the core competitive advantage of this product. They should be:
- **Tradition-authentic** — reviewed by tradition experts if possible
- **Age-appropriate** — simple language for ages 3-6
- **Thematically consistent** — quote, activity, and image should align on the same day
- **Attribution accurate** — every religious quote must have correct source (Gita 3:19, Ps 23:1, etc.)

When writing new quotes for Jewish and Muslim traditions, use the same format as existing traditions:
```typescript
"1-1": { quote: "...", ref: "Torah, Genesis 1:1", tradition: "jewish" }
```

---

## Session History Summary
This project was built over approximately 15-20 Claude.ai chat sessions in one week (March 2026). The v1 app is functional and being used by the founder's children for real-world testing. V2 is a clean architectural rewrite designed for scale, multiple markets, and multiple product types.
