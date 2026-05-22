import React from 'react';
import { getDayContent, getAffirmationFor } from '../../content';
import { Holiday, Affirmation, DayTheme, Birthday } from '../../content/types';
import { RuledLine, TraceRow } from '../../shared/DrawingPrimitives';
import LetterTracing from './LetterTracing';
import ColorActivity from './ColorActivity';
import MathActivity from './MathActivities';

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

// ── Sight words ──
// Words are ordered roughly by difficulty/frequency, with the simplest first.
// Curriculum-informed progression: kids learn the first words at the start of
// the year and build up through May; summer is a review of everything.
//
// K list ordered from easiest (high-frequency, short) to harder (multi-syllable
// or less common). Same for 1st.
const SIGHT_WORDS_K = [
  // First 15 — taught Aug-Dec in most K curricula
  "I","a","the","my","is","to","go","see","like","can",
  "we","at","look","you","and",
  // Next 15 — mid-year (Jan-Mar)
  "in","on","it","he","she","up","do","no","yes","of",
  "are","for","this","what","said",
  // Last 10 — end-of-year (Apr-May)
  "they","with","was","were","have","from","had","but","one","when",
];
const SIGHT_WORDS_1 = [
  // First 15 — taught Aug-Dec in most 1st curricula
  "after","again","any","ask","by","could","every","from","give","going",
  "had","has","her","him","just",
  // Next 15 — mid-year
  "know","let","live","may","old","once","open","over","put","round",
  "some","stop","take","them","then",
  // Last 10 — end-of-year
  "think","walk","were","when","where","white","who","why","first","green",
];

// How many words from the list are "available" by month, mirroring how
// curricula introduce new sight words throughout the school year.
// Sep–Dec = first chunk only · Jan–May = expand to middle · Jun–Aug = full list (review)
function sightWordAvailability(month: number, listLength: number): number {
  if (month >= 9 && month <= 12) return Math.min(15, listLength);                // Sept-Dec
  if (month >= 1 && month <= 5)  return Math.min(30, listLength);                // Jan-May
  return listLength;                                                              // Jun-Aug (full review)
}

function pickSightWords(age: number, month: number, day: number): string[] {
  const list = age <= 5 ? SIGHT_WORDS_K : SIGHT_WORDS_1;
  const available = sightWordAvailability(month, list.length);
  const pool = list.slice(0, available);
  // Day-of-year-ish index for stable rotation (same date always picks same words)
  const idx = (month - 1) * 31 + day;
  return [
    pool[idx % pool.length],
    pool[(idx + 1) % pool.length],
    pool[(idx + 2) % pool.length],
  ];
}

// Show sight words for kids who are at K level or higher (age 5+)
function shouldShowSightWords(age: number): boolean {
  return age >= 5;
}

// ── Holiday icon ──
// Returns a small emoji shown to the left of a holiday blurb in the date box,
// so kids can at-a-glance tell what kind of holiday it is.
function getHolidayIcon(h: Holiday): string {
  switch (h.source) {
    case "hindu":                return "🕉️";
    case "christian-catholic":   return "✝️";
    case "christian-protestant": return "✝️";
    case "jewish":               return "✡️";
    case "muslim":               return "☪️";
    case "india":                return "🇮🇳";
    case "us":                   return "🇺🇸";
    case "uk":                   return "🇬🇧";
    default:                     return ""; // universal — no flag
  }
}

// ── Personalized greeting based on region/tradition ──
// India region → Namaste. Jewish tradition (when today's image is Jewish-themed)
// → Shalom. Muslim tradition (when today's image is Muslim-themed) → Salaam.
// Everyone else → Good morning. Greetings drawn from the user's selections so
// every page feels picked-out for the family.
function getGreetingWord(regions: string[], dominantTradition: string): string {
  if (regions.includes("india")) return "Namaste";
  if (dominantTradition === "jewish") return "Shalom";
  if (dominantTradition === "muslim") return "Salaam";
  return "Good morning";
}

// ── Cultural "Did you know?" facts by region + tradition ──
// Picked deterministically by day so the same date always shows the same fact
// (no flicker on PDF regeneration). Returns null when no region/tradition fact
// applies — caller hides the box entirely in that case.
const CULTURAL_FACTS: Record<string, string[]> = {
  // NOTE: keep these distinct from the picture-day observances in
  // src/content/regions/india/holidays.ts (peacock, lotus, mango, chai, rangoli,
  // monsoon, elephant, yoga, henna, etc.). The rotation should COMPLEMENT the
  // observance blurbs, not duplicate them — otherwise users see the same topic
  // twice within a few days.
  india: [
    "India invented the number zero — without zero, math would look very different!",
    "The Bengal tiger is India's national animal — fierce and beautiful.",
    "The Himalayas in northern India are the tallest mountains in the world.",
    "More than 1,600 languages are spoken across India.",
    "Indian sweets like jalebi and gulab jamun are loved at every celebration.",
    "Cricket is the most popular sport in India — millions watch every match.",
    "The Taj Mahal in India is one of the seven wonders of the world.",
    "Bollywood is the world's largest film industry — thousands of films a year!",
    "The Ganges is a sacred river that flows through northern India.",
    "In India, kids often touch their elders' feet as a sign of respect.",
    "India is the world's largest democracy, with over a billion citizens.",
    "Indian families often share meals together with food served on banana leaves.",
  ],
  uk: [
    "The robin is the UK's most beloved bird, especially around winter.",
    "Big Ben is the famous bell inside London's clock tower.",
    "Afternoon tea is a beloved British tradition — usually with little sandwiches.",
    "Stonehenge in England is over 4,000 years old.",
    "Red double-decker buses are a familiar sight on London streets.",
    "The Queen's guards in tall black hats stand outside Buckingham Palace.",
    "Scotland is famous for bagpipes and beautiful highland scenery.",
    "Wales has more sheep than people!",
    "British weather is famous for changing many times in one day.",
  ],
  // Same rule as India — don't duplicate Hindu picture-day observances
  // (Krishna, Ganesha, Hanuman, Saraswati, diya, mandir, Om, cow, aarti).
  hindu: [
    "Sanskrit is one of the world's oldest languages — many Hindu prayers are written in it.",
    "The Bhagavad Gita is a holy book of the Hindus, full of wisdom from Lord Krishna.",
    "Lord Shiva is one of the great Hindu gods — the destroyer and renewer of the world.",
    "Lord Vishnu protects the world — Krishna and Rama are two of his forms.",
    "The bindi is a small dot worn on the forehead — a sign of devotion and beauty.",
    "Many Hindus pray together as a family at home or at the mandir.",
    "Hindus light incense, ring bells, and offer flowers when they pray.",
    "Hindus celebrate festivals with colorful clothes, music, and sweets shared with friends.",
  ],
  "christian-catholic": [
    "Catholics make the sign of the cross to start and end their prayers.",
    "Every Catholic church has an altar where the Mass is celebrated.",
    "Catholics light candles to remember loved ones and to ask for help in prayer.",
    "St. Francis of Assisi loved animals and is the patron saint of pets.",
    "Catholics celebrate seven sacraments — special moments of God's love.",
  ],
  "christian-protestant": [
    "Protestants gather to read the Bible together and to sing songs of praise.",
    "Sunday school is a special time for kids to learn about Jesus.",
    "Many Protestant churches share a simple meal of bread and grape juice to remember Jesus.",
    "Hymns are special songs Christians have sung for hundreds of years.",
    "Christians believe Jesus rose from the dead on Easter morning.",
  ],
  jewish: [
    "Shabbat begins on Friday night when the candles are lit.",
    "The Star of David has six points and is a symbol of the Jewish people.",
    "Challah is a soft, braided bread eaten on Shabbat.",
    "Hebrew is read from right to left — the opposite of English!",
    "The shofar is a horn blown on Rosh Hashanah to welcome the new year.",
    "A mezuzah is a small scroll placed on the doorway of Jewish homes.",
  ],
  muslim: [
    "Muslims pray five times a day, facing toward Mecca.",
    "The crescent moon and star are symbols of Islam, often seen on mosques.",
    "Ramadan is a special month when Muslims fast from sunrise to sunset.",
    "Eid is a joyful holiday when families share food, gifts, and prayers.",
    "Arabic is the language of the Quran, the holy book of Islam.",
    "Salaam means peace — it's how Muslims greet each other.",
  ],
};

function pickCulturalFact(regions: string[], dominantTradition: string, month: number, day: number): string | null {
  // "Did you know?" shows for India region and Hindu tradition only.
  // UK, plus other traditions (Catholic, Protestant, Jewish, Muslim), get the
  // affirmation quote instead. When BOTH India and Hindu are selected, days
  // alternate between the two pools so families see a mix.
  const sourcePools: string[][] = [];
  if (regions.includes("india")) sourcePools.push(CULTURAL_FACTS.india);
  if (dominantTradition === "hindu") sourcePools.push(CULTURAL_FACTS.hindu);
  if (sourcePools.length === 0) return null;

  // Stable index — same date always picks same fact (so PDF regenerations match)
  const idx = (month - 1) * 31 + day;
  const pool = sourcePools[idx % sourcePools.length];
  const factIdx = Math.floor(idx / sourcePools.length) % pool.length;
  return pool[factIdx];
}

function getMiniCalendar(month: number, year: number) {
  const firstDay    = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  return { firstDay, daysInMonth };
}

interface DayPageProps {
  day: number;
  month: number;        // 1-12
  year: number;
  childName: string;
  traditions: string[]; // e.g. ["hindu", "christian-catholic"]
  region: string | string[];  // e.g. "us" or ["us", "india"] for multi-country families
  age: number;          // 3-6
  birthdays?: Birthday[]; // family birthdays to check
  id?: string;          // DOM id for PDF capture
}

export default function DayPage({ day, month, year, childName, traditions, region, age, birthdays = [], id }: DayPageProps) {
  // Multi-country families: use the primary (first) country for image fallback paths
  const primaryRegion: string = Array.isArray(region) ? (region[0] ?? 'us') : region;
  const regionList: string[] = Array.isArray(region) ? region : [region];
  const content = getDayContent(traditions, region, month, day, year);
  const { theme, holidays, affirmation, dominantTradition } = content;

  const { firstDay, daysInMonth } = getMiniCalendar(month, year);
  const date = new Date(year, month - 1, day);
  const monthName   = MONTH_NAMES[month - 1];
  const dateDisplay = `${DAY_NAMES[date.getDay()]}, ${monthName} ${day}`;
  const lineH       = age <= 4 ? 48 : 40;

  // Personalized greeting (Rita-feedback fix)
  const greetingWord = getGreetingWord(regionList, dominantTradition);

  // Pick the region used for image lookup. When today's activity overlay came
  // from a non-primary selected region (theme.tags contains its id), use that
  // region so DayImage finds e.g. `india/may_03.png` instead of falling back
  // to universal. Otherwise default to the primary region.
  const imageRegion: string =
    regionList.find(r => (theme.tags || []).includes(r)) ?? primaryRegion;

  // ── Cultural slot ("Did you know?") ──
  // Goal: avoid clutter. If today's picture is tied to a holiday/region blurb,
  // promote that blurb up to the "Did you know?" slot and remove it from the
  // date box (so the same sentence doesn't appear twice). If no matching blurb,
  // fall back to the rotating fact pool. On days with no eligible content,
  // the slot is hidden entirely.
  // Try tradition match first; if dominantTradition has no holiday today,
  // fall through to region match (so a Hindu+India family on May 3 still
  // promotes the India rangoli blurb even though dominantTradition is hindu).
  let pictureMatchedHoliday: Holiday | null = null;
  if (dominantTradition !== "universal") {
    pictureMatchedHoliday = holidays.find(h => h.tradition === dominantTradition) ?? null;
  }
  if (!pictureMatchedHoliday) {
    const themeTags = (theme.tags || []) as string[];
    const regionTag = regionList.find(r => themeTags.includes(r));
    if (regionTag) {
      const themeWord    = (theme.word || "").toLowerCase();
      const subjectWords = (theme.subject || "").toLowerCase().split(/\s+/).filter(w => w.length > 3);
      pictureMatchedHoliday = holidays.find(h => {
        if (h.tradition !== "universal") return false;
        const s = h.sentence.toLowerCase();
        return (themeWord && s.includes(themeWord)) || subjectWords.some(w => s.includes(w));
      }) ?? null;
    }
  }

  // The footer cultural slot. Three render modes (priority order):
  //   1. Promoted holiday/region blurb (picture-matching day → no label)
  //   2. Cultural fact from a cycling source (India, Hindu → "Did you know?")
  //   3. Affirmation quote (Catholic, Protestant, Jewish, Muslim, universal)
  //
  // Cycle: each day picks one "source" from [India if selected] + [each selected
  // tradition]. So a family with US+India+Hindu+Catholic cycles India → Hindu →
  // Catholic → India → Hindu → Catholic. Each tradition gets honored on its turn.
  const footerCycle: string[] = [];
  if (regionList.includes("india")) footerCycle.push("india");
  for (const t of traditions) {
    if (t !== "universal" && !footerCycle.includes(t)) footerCycle.push(t);
  }
  if (footerCycle.length === 0) footerCycle.push("universal");
  const cycleIdx = (month - 1) * 31 + day;
  const todaysFooterSource = footerCycle[cycleIdx % footerCycle.length];
  const subIdx = Math.floor(cycleIdx / footerCycle.length);

  const culturalFactPlain = pictureMatchedHoliday?.sentence ?? null;
  let culturalFactRotating: string | null = null;
  let footerAffirmation: Affirmation | null = null;
  if (!culturalFactPlain) {
    if (todaysFooterSource === "india") {
      culturalFactRotating = CULTURAL_FACTS.india[subIdx % CULTURAL_FACTS.india.length];
    } else if (todaysFooterSource === "hindu") {
      culturalFactRotating = CULTURAL_FACTS.hindu[subIdx % CULTURAL_FACTS.hindu.length];
    } else {
      // Tradition source — use that tradition's affirmation quote
      footerAffirmation = getAffirmationFor(todaysFooterSource, month, day);
    }
  }

  // Filter the date-box list:
  //   1. Drop the picture-matched holiday (it's now in the bottom box)
  //   2. Drop any cultural observances (peacock, mandir, monsoon, etc.) —
  //      these only ever appear via picture-match promotion, never standalone
  const holidaysForDateBox = (pictureMatchedHoliday
    ? holidays.filter(h => h !== pictureMatchedHoliday)
    : holidays
  ).filter(h => !h.isObservance);

  // Build calendar grid cells
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  // Check for birthdays on this day
  const todaysBirthdays = birthdays.filter(b => b.month === month && b.day === day);
  const hasMessages = holidaysForDateBox.length > 0 || todaysBirthdays.length > 0;

  return (
    <div id={id} style={{ width: "100%", background: "white", borderRadius: 4, overflow: "hidden", fontFamily: "Georgia,serif" }}>

      {/* ── Header ── */}
      <div style={{ padding: "12px 20px 10px", borderBottom: "2px solid #1f2937", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: "bold", color: "#1f2937", letterSpacing: 0.3 }}>
          {greetingWord}, {childName || "Friend"}!
        </div>
      </div>

      {/* ── Name / Date | Calendar ── */}
      <div style={{ padding: "10px 18px 12px", borderBottom: "1.5px solid #d1d5db", display: "flex", alignItems: "stretch", gap: 14 }}>
        {/* Left: name line + date box */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: "bold", color: "#374151", marginBottom: 4 }}>Name</div>
            {/* PreK/TK (ages 3-4): show name as dashed/traceable letters PLUS a
                continuation of the ruled line so kids can try writing the name
                again on their own next to the traced version.
                Kindergarten+ (5+): just a blank line — they write it themselves. */}
            {age <= 4 && childName ? (
              (() => {
                const nameLen = childName.length;
                const letterSize =
                  nameLen <= 4  ? 30 :
                  nameLen <= 6  ? 26 :
                  nameLen <= 8  ? 22 :
                                  18;
                // Match the TraceLetter's rendered height AND stroke weights so
                // the continuation visually matches the letters' built-in lines.
                const traceHeight = Math.round(letterSize * 56 / 40);
                // TraceLetter uses these exact stroke values — mirror them here
                // so the continuation line doesn't look heavier than the lines
                // running under the dashed letters.
                return (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                    <div style={{ flexShrink: 0 }}>
                      <TraceRow text={childName} size={letterSize} gap={2} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <svg
                        width="100%"
                        height={traceHeight}
                        viewBox={`0 0 100 56`}
                        preserveAspectRatio="none"
                        style={{ display: "block" }}
                      >
                        <line x1="0" y1="2"  x2="100" y2="2"  stroke="#d1d5db" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                        <line x1="0" y1="28" x2="100" y2="28" stroke="#d1d5db" strokeWidth="0.8" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
                        <line x1="0" y1="54" x2="100" y2="54" stroke="#d1d5db" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </div>
                );
              })()
            ) : (
              <RuledLine h={lineH} />
            )}
          </div>
          <div style={{ border: "1.5px solid #d1d5db", borderRadius: 6, padding: "6px 10px" }}>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#1f2937", marginBottom: hasMessages ? 4 : 0 }}>
              {dateDisplay}
            </div>
            {holidaysForDateBox.map((h, i) => {
              const icon = getHolidayIcon(h);
              return (
                <div key={i} style={{ fontSize: 11, color: "#374151", fontStyle: "italic", lineHeight: 1.5, marginTop: i > 0 ? 2 : 0 }}>
                  {icon && <span style={{ marginRight: 4, fontStyle: "normal" }}>{icon}</span>}
                  {h.sentence}
                </div>
              );
            })}
            {todaysBirthdays.map(b => (
              <div key={b.id} style={{ fontSize: 11, color: "#1f2937", fontWeight: "bold", lineHeight: 1.5, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: "inline-block", flexShrink: 0 }}>
                  <rect x="3" y="12" width="18" height="9" rx="2" fill="none" stroke="#1f2937" strokeWidth="1.8"/>
                  <rect x="6" y="15" width="12" height="6" rx="1" fill="none" stroke="#1f2937" strokeWidth="1"/>
                  <line x1="12" y1="12" x2="12" y2="8" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10.5 8 Q12 5 13.5 8" fill="none" stroke="#1f2937" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Happy Birthday, {b.name}!
              </div>
            ))}
          </div>

          {/* ── Today's Sight Words (K + 1st grade) ── */}
          {shouldShowSightWords(age) && (
            <div style={{
              border: "1.5px dashed #9ca3af", borderRadius: 6,
              padding: "5px 10px", marginTop: 4,
            }}>
              <div style={{ fontSize: 9, fontWeight: "bold", color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>
                Today's Sight Words
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {pickSightWords(age, month, day).map((word, i) => (
                  <div key={i} style={{ fontSize: 16, fontWeight: "bold", color: "#1f2937", fontFamily: "Georgia, serif" }}>
                    {word}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: mini calendar */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 10, fontWeight: "bold", color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
            Circle today →
          </div>
          <div style={{ border: "1.5px solid #d1d5db", borderRadius: 6, overflow: "hidden", width: 204 }}>
            <div style={{ background: "#f3f4f6", textAlign: "center", padding: "3px 0", fontSize: 10, fontWeight: "bold", color: "#374151", borderBottom: "1px solid #d1d5db" }}>
              {monthName} {year}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 8, fontWeight: "bold", color: "#9ca3af", padding: "2px 0" }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, padding: "2px" }}>
              {calendarCells.map((cd, i) => (
                <div key={i} style={{
                  height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, borderRadius: "50%", border: "2px solid transparent",
                  color: cd ? "#374151" : "transparent", fontWeight: "normal",
                }}>{cd || ""}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity grid ── */}
      <div style={{ padding: "10px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Top row: letter tracing + color activity */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, border: "1.5px solid #d1d5db", borderRadius: 6, padding: "8px 10px" }}>
            <LetterTracing word={theme.word} age={age} />
          </div>
          <ColorActivity
            day={day}
            month={monthName}
            instruction={theme.instruction}
            subject={theme.subject}
            colorWord={theme.colorWord}
            tradition={dominantTradition}
            region={imageRegion}
            imageFile={theme.imageFile}
          />
        </div>
        {/* Bottom: math activity */}
        <MathActivity day={day} month={monthName} age={age} />
      </div>

      {/* ── Footer ──
          One slot, three modes (priority order):
          1. Picture-matching holiday/region blurb (any family on a special day)
          2. Rotating "Did you know?" fact (India/UK regions + Hindu tradition)
          3. Affirmation quote (everyone else's default) */}
      <div style={{
        borderTop: "2px solid #1f2937", padding: "10px 20px", textAlign: "center",
        minHeight: 58, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 3,
      }}>
        {culturalFactPlain ? (
          <div style={{ fontSize: 12, color: "#4b5563", fontStyle: "italic", maxWidth: 400 }}>
            {culturalFactPlain}
          </div>
        ) : culturalFactRotating ? (
          <div style={{ fontSize: 12, color: "#4b5563", fontStyle: "italic", maxWidth: 400 }}>
            <span style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", letterSpacing: 0.8, textTransform: "uppercase", marginRight: 6, fontStyle: "normal" }}>
              Did you know?
            </span>
            {culturalFactRotating}
          </div>
        ) : (() => {
          // Use the cycle-picked tradition's affirmation when available,
          // otherwise fall back to the dominantTradition's affirmation
          const a = footerAffirmation ?? affirmation;
          return (
            <div style={{ fontSize: 12, color: "#4b5563", fontStyle: "italic", maxWidth: 400 }}>
              &ldquo;{a.quote}&rdquo;
              {a.ref && (
                <span style={{ fontSize: 11, color: "#6b7280", fontStyle: "normal" }}> — {a.ref}</span>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
