import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Test entrypoint — bypasses Clerk auth to test v2 components directly

import React, { useState, useMemo, useEffect, useRef } from 'react';
import DayPage from './products/morning-workbook/DayPage';
import { getDayContent, REGIONS } from './content';
import { Birthday, ChildProfile } from './content/types';
import { coloringBooks } from './content/coloring-books';
import ProfileModal from './shared/ProfileModal';
import ContentDashboard from './ContentDashboard';
import { colors, theme } from './shared/theme';
import { ImageCacheContext } from './shared/ImageCache';

const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

const TRADITIONS = [
  { id: "universal",            label: "Non-religious" },
  { id: "hindu",                label: "Hindu" },
  { id: "christian-catholic",   label: "Catholic" },
  { id: "christian-protestant", label: "Protestant" },
  { id: "jewish",               label: "Jewish" },
  { id: "muslim",               label: "Muslim" },
];

// Grade levels — replaces raw ages in the UI. Internally we still pass
// the corresponding `age` to DayPage so the existing letter/math/coloring
// difficulty logic doesn't have to change. During summer months (Jun-Aug)
// the display label switches to "Rising [next grade]".
// `hidden: true` removes a grade from the UI without deleting its data
// (useful while we're still building grade-specific content).
const GRADES = [
  { id: "preschool",    label: "Preschool",    risingLabel: "Rising TK",   age: 3, hidden: false },
  { id: "tk",           label: "TK",           risingLabel: "Rising K",    age: 4, hidden: false },
  { id: "kindergarten", label: "Kindergarten", risingLabel: "Rising 1st",  age: 5, hidden: false },
  { id: "first",        label: "1st",          risingLabel: "Rising 2nd",  age: 6, hidden: true  }, // hidden until 1st-grade-specific exercises are built
];

// During Jun/Jul/Aug, kids are "rising" to the next grade
const isSummerMonth = (month: number) => month >= 6 && month <= 8;

// Returns the display label for a given grade id in a given month
function gradeDisplayLabel(gradeId: string, month: number): string {
  const grade = GRADES.find(g => g.id === gradeId);
  if (!grade) return "";
  return isSummerMonth(month) ? grade.risingLabel : grade.label;
}

// Convert grade id → age (used to pass to DayPage / activities)
function gradeToAge(gradeId: string): number {
  return GRADES.find(g => g.id === gradeId)?.age ?? 5;
}

// Convert age → grade id (used for backward compatibility with stored profiles)
function ageToGradeId(age: number): string {
  return GRADES.find(g => g.age === age)?.id ?? "kindergarten";
}

function makeId() { return Math.random().toString(36).slice(2, 10); }
const BDAY_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── Analytics helper ──
// Wraps PostHog's capture in a try/catch so a missing/stub key never breaks
// the app. The PostHog script in index.html stubs `window.posthog.capture`
// when no key is present, so this is also safe at first load.
function track(eventName: string, properties: Record<string, any> = {}) {
  try {
    const ph = (window as any).posthog;
    if (ph && typeof ph.capture === "function") {
      ph.capture(eventName, properties);
    }
  } catch (e) {
    // Never let analytics errors break the user experience
    console.warn("Analytics tracking error:", e);
  }
}

// Identify a person (used when they submit their email)
function identifyUser(email: string, properties: Record<string, any> = {}) {
  try {
    const ph = (window as any).posthog;
    if (ph && typeof ph.identify === "function") {
      ph.identify(email, { email, ...properties });
    }
  } catch (e) {
    console.warn("Analytics identify error:", e);
  }
}

// ── Coloring Book Card ──
function BookCard({ book }: { book: any }) {
  return (
    <div style={{ flexShrink: 0, width: 180, border: `1.5px solid ${theme.cardBorder}`, borderRadius: 12, overflow: "hidden", background: theme.cardBg, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: theme.cardBg, fontSize: 48 }}>
        {book.coverEmoji}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: "bold", color: theme.textPrimary, lineHeight: 1.3 }}>{book.title}</div>
        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4, lineHeight: 1.4 }}>{book.description.slice(0, 60)}…</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div style={{ fontSize: 14, fontWeight: "bold", color: theme.textPrimary }}>${book.price.toFixed(2)}</div>
          {!book.available && <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, background: colors.driftwood, borderRadius: 4, padding: "2px 8px" }}>Coming Soon</div>}
        </div>
      </div>
    </div>
  );
}

// ── ScaledWorksheet ──
// Wraps the worksheet at its native 540px width and proportionally scales
// the entire rendering on narrow screens so content stays at proper
// proportions instead of reflowing (e.g. "kite" wrapping the "e" to a
// second row).
//
// Uses CSS `zoom` because (unlike `transform: scale`) it actually changes
// layout — so the parent's height adjusts automatically and we don't have
// to manually calculate scaled heights, which was the bug in the original.
function ScaledWorksheet({ children, nativeWidth = 540 }: { children: React.ReactNode; nativeWidth?: number }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      if (!outerRef.current) return;
      const available = outerRef.current.clientWidth;
      if (available <= 0) return;  // wait until layout is real
      setScale(Math.min(1, available / nativeWidth));
    };
    update();
    // Re-measure shortly after mount in case the parent took a tick to lay out
    const t = setTimeout(update, 100);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
    };
  }, [nativeWidth]);

  return (
    <div ref={outerRef} style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      <div style={{
        width: nativeWidth,
        // @ts-expect-error — `zoom` is a valid CSS property, supported in all
        // modern browsers (Chrome/Safari forever, Firefox since 126 in 2024),
        // but TypeScript's CSS types are sometimes behind the standard.
        zoom: scale,
        flexShrink: 0,
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Paid Month CTA card ──
// Supports an optional second "available month" so end-of-month visitors can
// buy either the current month or next month directly from the card without
// hunting through the month dropdown.
function PaidMonthCTA({
  monthName, daysInMonth, monthNum, year,
  altMonthName, altDaysInMonth, altMonthNum, altYear,
  isLive, onBuy, onNotify,
}: {
  monthName: string; daysInMonth: number; monthNum: number; year: number;
  altMonthName?: string; altDaysInMonth?: number; altMonthNum?: number; altYear?: number;
  isLive: boolean;
  onBuy: (overrideMonth?: number, overrideYear?: number) => void;
  onNotify: () => void;
}) {
  const hasAlt = altMonthName !== undefined;

  return (
    <div style={{
      position: "relative", zIndex: 1, maxWidth: 540, margin: "12px auto",
      background: theme.cardBg, borderRadius: 14, border: `2px solid ${colors.deepTeal}`,
      padding: "24px 28px", textAlign: "center",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    }}>
      <div style={{ fontSize: 18, fontWeight: "bold", color: theme.textPrimary, marginBottom: 6 }}>
        Loved what you see?
      </div>
      <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 14, lineHeight: 1.5 }}>
        {hasAlt
          ? <>Get a full month of personalized worksheets for your family — pick {monthName} or {altMonthName}.</>
          : <>Get the full month of {monthName} for your family — {daysInMonth} personalized pages per child, ready to print.</>}
      </div>
      <div style={{ fontSize: 28, fontWeight: "bold", color: theme.textPrimary, marginBottom: 4 }}>
        $2.99 <span style={{ fontSize: 14, fontWeight: "normal", color: theme.textMuted }}>per month</span>
      </div>
      <div style={{ fontSize: 11, color: theme.textPlaceholder, marginBottom: 14, fontStyle: "italic" }}>
        One purchase covers all your kids
      </div>
      {isLive ? (
        <>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => onBuy(monthNum, year)} style={{
              padding: "14px 22px", fontSize: 14, fontWeight: "bold", cursor: "pointer",
              border: "none", borderRadius: 10,
              background: colors.deepTeal, color: theme.buttonText,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>
              ↓ Get {monthName} ({daysInMonth} days)
            </button>
            {hasAlt && (
              <button onClick={() => onBuy(altMonthNum, altYear)} style={{
                padding: "14px 22px", fontSize: 14, fontWeight: "bold", cursor: "pointer",
                border: `2px solid ${colors.deepTeal}`, borderRadius: 10,
                background: theme.cardBg, color: colors.deepTeal,
              }}>
                ↓ Get {altMonthName} ({altDaysInMonth} days)
              </button>
            )}
          </div>
          <div style={{ fontSize: 11, color: theme.textPlaceholder, marginTop: 10 }}>
            Instant PDF download · Secure checkout via Stripe
          </div>
        </>
      ) : (
        <>
          <div style={{
            padding: "14px 32px", fontSize: 15, fontWeight: "bold",
            border: `2px dashed ${colors.deepTeal}`, borderRadius: 10,
            background: theme.cardBg, color: colors.deepTeal,
            display: "inline-block",
          }}>
            Coming soon
          </div>
          <div style={{ fontSize: 11, color: theme.textPlaceholder, marginTop: 10 }}>
            Full month PDF coming this week
          </div>
        </>
      )}
    </div>
  );
}

// ── Landing Page (no Clerk) ──
function TestLandingPage({ onSwitch }: { onSwitch: () => void }) {
  const now = new Date();
  const [childName, setChildName] = useState("");

  // Default to the current month/day. From the 20th onward we also show a
  // banner letting people know NEXT month's worksheets are ready to preview
  // and buy — but we don't auto-switch, since kids who haven't done a month's
  // worksheets yet still enjoy them.
  const ROLLOVER_DAY = 20;
  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();
  const todayYear = now.getFullYear();
  const nextMonthReady = todayDay >= ROLLOVER_DAY;
  const nextMonthNum   = todayMonth === 12 ? 1 : todayMonth + 1;

  const [month, setMonth] = useState(todayMonth);
  const [day, setDay]     = useState(todayDay);
  const [year]            = useState(todayYear);
  const [grade, setGrade] = useState<string>("kindergarten");
  const age = gradeToAge(grade);  // derived for backward compat with DayPage/activities
  const [traditions, setTraditions] = useState<string[]>(["universal"]);
  const [regions, setRegions] = useState<string[]>(["us"]);
  const [showMonth, setShowMonth] = useState(false);
  const [showBirthdays, setShowBirthdays] = useState(false);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);

  const addBirthday = () => {
    track("birthday_added");
    setBirthdays(prev => [...prev, { id: makeId(), name: "", month: 1, day: 1 }]);
  };

  // ── Printed-books waitlist email capture ──
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = waitlistEmail.trim();
    // Basic email validation — enough for capture, not RFC-strict
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setWaitlistError("Please enter a valid email address.");
      return;
    }
    setWaitlistError(null);
    // Identify in PostHog so we can pull email list later
    identifyUser(trimmed, { signed_up_for: "printed_books_waitlist" });
    track("printed_books_interest", {
      email: trimmed,
      // Carry the customer's current customization context — useful to know
      // what kind of family is most interested in printed books.
      currentTraditions: traditions,
      currentRegions: regions,
      currentAge: age,
    });
    setWaitlistSubmitted(true);
  };
  const updateBirthday = (id: string, patch: Partial<Birthday>) => {
    setBirthdays(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b));
  };
  const removeBirthday = (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
  };

  // ──────────────────────────────────────────────────────────────
  // STRIPE PAYMENT LINK — live URL for the $2.99 Full Month PDF product
  // ──────────────────────────────────────────────────────────────
  const STRIPE_PAYMENT_LINK: string | null = "https://buy.stripe.com/eVq4gr8hAd32gVX32M2wU00";

  // Accept an optional month override — so the paid CTA can offer both the
  // current AND next month independently of which month is selected in the
  // preview picker.
  const handleBuyMonthPDF = (overrideMonth?: number, overrideYear?: number) => {
    const buyMonth = overrideMonth ?? month;
    const buyYear  = overrideYear  ?? year;
    track("get_full_month_clicked", {
      childName: childName || "(unnamed)",
      age, month: buyMonth, year: buyYear,
      traditions, regions,
      birthdayCount: birthdays.length,
    });
    if (STRIPE_PAYMENT_LINK) {
      // Save the customer's customization to localStorage so the
      // success page (after Stripe redirects back) can regenerate the
      // 31-page PDF with the same name/age/traditions/country/birthdays
      // the customer saw on screen.
      try {
        localStorage.setItem("pendingMonthPDF", JSON.stringify({
          name: childName, age, month: buyMonth, year: buyYear, traditions, regions, birthdays,
          timestamp: Date.now(),
        }));
      } catch (e) {
        console.warn("Could not save pending order to localStorage:", e);
      }
      track("payment_started", { paymentMethod: "stripe_payment_link" });
      window.location.href = STRIPE_PAYMENT_LINK;
    }
  };

  const toggleTradition = (id: string) => {
    setTraditions(prev => {
      const action = prev.includes(id) ? "remove" : "add";
      track("tradition_toggled", { tradition: id, action });
      if (prev.includes(id)) { if (prev.length <= 1) return prev; return prev.filter(t => t !== id); }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const toggleRegion = (id: string) => {
    setRegions(prev => {
      const action = prev.includes(id) ? "remove" : "add";
      track("country_toggled", { country: id, action });
      if (prev.includes(id)) { if (prev.length <= 1) return prev; return prev.filter(r => r !== id); }
      return [...prev, id];
    });
  };

  const content = useMemo(() => getDayContent(traditions, regions, month, day, year), [traditions, regions, month, day, year]);
  const suggestedBooks = content.suggestedColoringBooks;
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthName = MONTH_NAMES[month - 1];

  // Always offer both the current actual month AND next actual month on the
  // paid CTA. If the user is viewing either of those, the OTHER appears as
  // a second button. (If they navigated to an unrelated month like August,
  // no alt — only one button so it's not confusing.)
  let altMonthProps: {
    altMonthName?: string; altDaysInMonth?: number;
    altMonthNum?: number;  altYear?: number;
  } = {};
  const isViewingCurrent = month === todayMonth && year === todayYear;
  const isViewingNext    = month === nextMonthNum && year === (nextMonthNum === 1 ? todayYear + 1 : todayYear);
  if (isViewingCurrent) {
    const altNum = nextMonthNum;
    const altYr  = altNum === 1 ? todayYear + 1 : todayYear;
    altMonthProps = {
      altMonthName:   MONTH_NAMES[altNum - 1],
      altDaysInMonth: new Date(altYr, altNum, 0).getDate(),
      altMonthNum:    altNum,
      altYear:        altYr,
    };
  } else if (isViewingNext) {
    altMonthProps = {
      altMonthName:   MONTH_NAMES[todayMonth - 1],
      altDaysInMonth: new Date(todayYear, todayMonth, 0).getDate(),
      altMonthNum:    todayMonth,
      altYear:        todayYear,
    };
  }
  const [pdfProgress, setPdfProgress] = useState<number | null>(null);

  // ── Single-day PDF download (free, no login required) ──
  const handleDownloadDayPDF = async () => {
    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement("script");
      s.src = src; s.onload = () => resolve(); s.onerror = () => reject();
      document.head.appendChild(s);
    });
    const fetchBase64 = (url: string): Promise<string | null> =>
      fetch(url).then(r => r.ok ? r.blob() : Promise.reject())
        .then(blob => new Promise<string>(res => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as string);
          reader.readAsDataURL(blob);
        })).catch(() => null);

    try {
      setPdfProgress(10);
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      const { jsPDF } = (window as any).jspdf;
      const html2canvas = (window as any).html2canvas;
      const ReactDOM = await import("react-dom/client");
      const React2 = await import("react");

      setPdfProgress(30);
      const imageCache: Record<string, string> = {};
      const paddedDay = String(day).padStart(2, "0");
      const baseKey = `${monthName.toLowerCase()}_${paddedDay}`;
      const primaryRegion = regions[0] ?? "us";
      const candidates = [
        ...(content.theme.imageFile ? [content.theme.imageFile.replace(/\.png$/, "")] : []),
        ...(content.dominantTradition !== "universal" ? [`${content.dominantTradition}/${baseKey}`] : []),
        `${primaryRegion}/${baseKey}`,
        baseKey,
      ];
      for (const key of candidates) {
        const b64 = await fetchBase64(`/images/${key}.png`);
        if (b64) { imageCache[key] = b64; break; }
      }

      setPdfProgress(50);
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [612, 792] });
      const margin = 54;
      const contentW = 612 - margin * 2;
      const contentH = 792 - margin * 2;
      const container = document.createElement("div");
      container.style.cssText = "position:fixed;left:-9999px;top:0;width:540px;background:white;z-index:-1;";
      document.body.appendChild(container);
      const wrapper = document.createElement("div");
      container.appendChild(wrapper);
      await new Promise<void>(resolve => {
        const root = ReactDOM.createRoot(wrapper);
        root.render(
          React2.createElement(ImageCacheContext.Provider, { value: imageCache },
            React2.createElement(DayPage, { day, month, year, childName, traditions, region: regions, age, birthdays })
          )
        );
        setTimeout(resolve, 300);
      });
      setPdfProgress(80);
      const canvas = await html2canvas(wrapper, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: "#ffffff", width: 540, windowWidth: 600, logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.93);
      const imgH = Math.min(contentW * (canvas.height / canvas.width), contentH);
      pdf.addImage(imgData, "JPEG", margin, margin, contentW, imgH);
      document.body.removeChild(container);
      setPdfProgress(null);
      const safeName = (childName || "MorningWork").replace(/[^a-zA-Z0-9]/g, "");
      pdf.save(`${safeName}_${monthName}${day}_${year}.pdf`);

      // Track successful free PDF generation with full customization context
      track("free_pdf_generated", {
        childName: childName || "(unnamed)",
        age, month, day, year,
        traditions, regions,
        birthdayCount: birthdays.length,
      });
    } catch (err) {
      console.error("PDF error:", err);
      setPdfProgress(null);
      alert(`PDF failed: ${(err as Error).message}`);
      track("free_pdf_error", { error: (err as Error).message });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(to bottom, ${theme.pageBg} 0%, ${theme.pageBg} 30%, #dceef2 60%, #c8e2ed 100%)`, fontFamily: "Georgia,serif", position: "relative", overflow: "hidden" }}>
      {/* Watercolor rainbow — full-width behind hero area */}
      {/* Watercolor rainbow — full-width arc across the top */}
      <div style={{
        position: "absolute", top: "-180px", left: "50%", transform: "translateX(-50%)",
        width: "120vw", height: "700px", borderRadius: "50%",
        background: `conic-gradient(
          from 180deg,
          rgba(175,115,195,0.30) 0deg,
          rgba(210,85,85,0.35) 30deg,
          rgba(230,145,85,0.30) 55deg,
          rgba(240,210,110,0.30) 80deg,
          rgba(120,195,120,0.32) 110deg,
          rgba(85,175,210,0.35) 145deg,
          rgba(115,125,205,0.32) 180deg,
          rgba(165,120,195,0.30) 215deg,
          rgba(195,130,175,0.25) 245deg,
          transparent 280deg
        )`,
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, padding: "14px 24px", borderBottom: `1px solid ${theme.navBorder}`, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}>
        {/* Logo — uses /logo.png if available, otherwise just shows the wordmark */}
        <img src="/logo.png" alt="" style={{ height: 36, width: "auto", display: "block" }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        <div style={{ fontSize: 22, fontWeight: 700, color: theme.textPrimary, fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: 0.3 }}>Melmoon Books</div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "48px 24px 32px", maxWidth: 680, margin: "0 auto" }}>
        <h1 style={{
          fontSize: 36, fontWeight: 700, color: theme.textPrimary,
          margin: "0 0 14px", lineHeight: 1.15,
          fontFamily: "'Playfair Display', Georgia, serif",
        }}>
          Start the morning with a playful worksheet, not a screen.
        </h1>
        <p style={{ fontSize: 16, color: theme.textSecondary, lineHeight: 1.6, margin: "0 0 24px" }}>
          Personalized daily worksheets for ages 3–6 with letter tracing, math, and a coloring page.
          Customize to your child's age, your country, and your family's traditions.
        </p>
        <button onClick={handleDownloadDayPDF} disabled={pdfProgress !== null}
          style={{
            padding: "14px 32px", fontSize: 16, fontWeight: "bold",
            cursor: pdfProgress !== null ? "wait" : "pointer",
            border: "none", borderRadius: 10,
            background: colors.deepTeal, color: theme.buttonText,
            opacity: pdfProgress !== null ? 0.7 : 1,
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}>
          {pdfProgress !== null
            ? `Building your PDF… ${pdfProgress}%`
            : `↓ Get today's free worksheet`}
        </button>
        <div style={{ fontSize: 12, color: theme.textPlaceholder, marginTop: 10 }}>
          Free instant download · No account needed · Customize below
        </div>
      </section>

      {/* Controls */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "0 24px 16px" }}>
        <div style={{ background: theme.cardBg, borderRadius: 12, border: `1.5px solid ${theme.cardBorder}`, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: theme.textPrimary, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.8 }}>Customize the preview</div>
          <div style={{ fontSize: 11, color: theme.textPlaceholder, marginBottom: 12, fontStyle: "italic" }}>Try different combinations to see how the worksheet adapts.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <div style={{ flex: "1 1 160px" }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>CHILD'S NAME</div>
              <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="e.g. Asha"
                style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: `1.5px solid ${theme.cardBorder}`, fontSize: 13, boxSizing: "border-box", fontFamily: "Georgia,serif" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>
                GRADE
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {GRADES.filter(g => !g.hidden).map(g => (
                  <button key={g.id} onClick={() => setGrade(g.id)}
                    style={{
                      padding: "6px 12px", height: 32, borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: "bold",
                      border: `1.5px solid ${grade === g.id ? theme.pillActive : theme.pillInactive}`,
                      background: grade === g.id ? theme.pillActive : theme.cardBg,
                      color: grade === g.id ? theme.buttonText : theme.textPrimary,
                    }}>
                    {isSummerMonth(month) ? g.risingLabel : g.label}
                  </button>
                ))}
              </div>
              {isSummerMonth(month) && (
                <div style={{ fontSize: 10, color: theme.textPlaceholder, fontStyle: "italic", marginTop: 5, maxWidth: 280, lineHeight: 1.4 }}>
                  It's summer! Pick the grade your child just finished, or the one they're starting in the fall — either works for review and prep.
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>MONTH</div>
              <select value={month} onChange={e => { setMonth(Number(e.target.value)); setDay(1); }}
                style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${theme.cardBorder}`, fontSize: 13, fontFamily: "Georgia,serif" }}>
                {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>DAY</div>
              <select value={day} onChange={e => setDay(Number(e.target.value))}
                style={{ padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${theme.cardBorder}`, fontSize: 13 }}>
                {Array.from({ length: daysInMonth }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>COUNTRY <span style={{ fontWeight: "normal", color: theme.textPlaceholder }}>(select all that apply)</span></div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {REGIONS.map(r => {
                  const selected = regions.includes(r.id);
                  return (
                    <button key={r.id} onClick={() => toggleRegion(r.id)} style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                      border: `1.5px solid ${selected ? theme.pillActive : theme.pillInactive}`, background: selected ? theme.pillActive : theme.cardBg, color: selected ? theme.buttonText : theme.textPrimary }}>{r.flag} {r.label}</button>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>TRADITIONS <span style={{ fontWeight: "normal", color: theme.textPlaceholder }}>(select up to 3 — they alternate daily)</span></div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TRADITIONS.map(t => {
                const selected = traditions.includes(t.id);
                return (
                  <button key={t.id} onClick={() => toggleTradition(t.id)} style={{ padding: "6px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: "bold",
                    border: `2px solid ${selected ? theme.pillActive : theme.pillInactive}`, background: selected ? theme.pillActive : theme.cardBg, color: selected ? theme.buttonText : theme.textPrimary }}>{t.label}</button>
                );
              })}
            </div>
          </div>

          {/* ── Family birthdays (optional, collapsed by default) ── */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${theme.cardBorder}` }}>
            <button onClick={() => setShowBirthdays(v => !v)} style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              fontSize: 12, fontWeight: "bold", color: theme.textPrimary,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 11 }}>{showBirthdays ? "▼" : "▶"}</span>
              {showBirthdays ? "Hide family birthdays" : "+ Add family birthdays (optional)"}
              {!showBirthdays && birthdays.length > 0 && (
                <span style={{ fontSize: 11, color: theme.textMuted, fontWeight: "normal" }}>
                  · {birthdays.length} added
                </span>
              )}
            </button>
            {showBirthdays && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 10, lineHeight: 1.5 }}>
                  Birthdays appear on the worksheet that day (e.g. "Today is Nana Jo's birthday! 🎂").
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {birthdays.map(b => {
                    const daysInBdayMonth = new Date(year, b.month, 0).getDate();
                    return (
                      <div key={b.id} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <input value={b.name} onChange={e => updateBirthday(b.id, { name: e.target.value })}
                          placeholder="e.g. Nana Jo"
                          style={{ flex: "1 1 140px", padding: "5px 8px", borderRadius: 6, border: `1.5px solid ${theme.cardBorder}`, fontSize: 12, fontFamily: "Georgia,serif" }} />
                        <select value={b.month} onChange={e => updateBirthday(b.id, { month: Number(e.target.value), day: Math.min(b.day, new Date(year, Number(e.target.value), 0).getDate()) })}
                          style={{ padding: "5px 6px", borderRadius: 6, border: `1.5px solid ${theme.cardBorder}`, fontSize: 12, fontFamily: "Georgia,serif" }}>
                          {BDAY_MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                        </select>
                        <select value={b.day} onChange={e => updateBirthday(b.id, { day: Number(e.target.value) })}
                          style={{ padding: "5px 6px", borderRadius: 6, border: `1.5px solid ${theme.cardBorder}`, fontSize: 12 }}>
                          {Array.from({ length: daysInBdayMonth }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                        </select>
                        <button onClick={() => removeBirthday(b.id)} style={{
                          background: "none", border: "none", padding: "3px 6px",
                          color: theme.textPlaceholder, fontSize: 16, cursor: "pointer",
                          lineHeight: 1,
                        }} aria-label="Remove birthday">×</button>
                      </div>
                    );
                  })}
                </div>
                <button onClick={addBirthday} style={{
                  marginTop: 10, padding: "6px 12px", borderRadius: 6,
                  border: `1.5px dashed ${theme.cardBorder}`, background: "none",
                  fontSize: 11, fontWeight: "bold", color: theme.textPrimary, cursor: "pointer",
                }}>
                  + Add a birthday
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DayPage — fixed native width 540, scales proportionally on narrow screens */}
        <ScaledWorksheet>
          <div style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
            <DayPage day={day} month={month} year={year} childName={childName} traditions={traditions} region={regions} age={age} birthdays={birthdays} />
          </div>
        </ScaledWorksheet>
        <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
          <button onClick={handleDownloadDayPDF} disabled={pdfProgress !== null}
            style={{
              padding: "12px 28px", fontSize: 15, fontWeight: "bold",
              cursor: pdfProgress !== null ? "wait" : "pointer",
              border: `2px solid ${colors.deepTeal}`, borderRadius: 10,
              background: colors.deepTeal, color: theme.buttonText,
              opacity: pdfProgress !== null ? 0.7 : 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}>
            {pdfProgress !== null
              ? `Building PDF… ${pdfProgress}%`
              : `↓ Download this page — Free`}
          </button>
        </div>

        {/* ── Show all days + paid full-month CTA. When an alt month is
            available, expand BOTH months stacked so parents can preview the
            full content of each before deciding which to buy. ── */}
        {(() => {
          const hasAlt = altMonthProps.altMonthName !== undefined;
          const primaryDays  = daysInMonth;
          const altDays      = altMonthProps.altDaysInMonth ?? 0;
          const totalDays    = primaryDays + altDays;
          const buttonLabel  = showMonth
            ? `▲ Hide the full months`
            : hasAlt
              ? `▼ See all days of ${monthName} & ${altMonthProps.altMonthName} (${totalDays} days)`
              : `▼ See all ${primaryDays} days of ${monthName}`;
          return (
            <>
              <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
                <button onClick={() => {
                    const next = !showMonth;
                    setShowMonth(next);
                    if (next) track("show_full_month_clicked", {
                      primaryMonth: month, primaryDays,
                      altMonth: altMonthProps.altMonthNum, altDays,
                      bothMonths: hasAlt,
                    });
                  }}
                  style={{
                    padding: "10px 22px", fontSize: 14, fontWeight: "bold", cursor: "pointer",
                    border: `2px solid ${colors.deepTeal}`, borderRadius: 10,
                    background: showMonth ? theme.cardBg : "white",
                    color: theme.textPrimary,
                  }}>
                  {buttonLabel}
                </button>
              </div>

              {showMonth && (
                <>
                  {/* Paid CTA at top of month view */}
                  <PaidMonthCTA
                    monthName={monthName}
                    daysInMonth={daysInMonth}
                    monthNum={month}
                    year={year}
                    {...altMonthProps}
                    isLive={STRIPE_PAYMENT_LINK !== null}
                    onBuy={handleBuyMonthPDF}
                    onNotify={onSwitch}
                  />

                  {/* Primary month — all days */}
                  <div style={{
                    textAlign: "center", fontSize: 14, fontWeight: "bold",
                    color: theme.textPrimary, letterSpacing: 1.2,
                    margin: "16px 0 12px", paddingBottom: 6,
                    borderBottom: `1.5px solid ${colors.deepTeal}`,
                  }}>
                    {monthName.toUpperCase()} {year}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "8px 0 24px" }}>
                    {Array.from({ length: primaryDays }, (_, i) => i + 1).map(d => (
                      <div key={`p-${d}`}>
                        <div style={{ textAlign: "center", fontSize: 11, fontWeight: "bold", color: theme.textMuted, letterSpacing: 1.5, marginBottom: 8 }}>
                          — DAY {d} —
                        </div>
                        <ScaledWorksheet>
                          <div style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
                            <DayPage day={d} month={month} year={year} childName={childName} traditions={traditions} region={regions} age={age} birthdays={birthdays} />
                          </div>
                        </ScaledWorksheet>
                      </div>
                    ))}
                  </div>

                  {/* Alt month — all days */}
                  {hasAlt && altMonthProps.altMonthNum && altMonthProps.altYear && (
                    <>
                      <div style={{
                        textAlign: "center", fontSize: 14, fontWeight: "bold",
                        color: theme.textPrimary, letterSpacing: 1.2,
                        margin: "24px 0 12px", paddingBottom: 6,
                        borderBottom: `1.5px solid ${colors.deepTeal}`,
                      }}>
                        {altMonthProps.altMonthName!.toUpperCase()} {altMonthProps.altYear}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "8px 0 24px" }}>
                        {Array.from({ length: altDays }, (_, i) => i + 1).map(d => (
                          <div key={`a-${d}`}>
                            <div style={{ textAlign: "center", fontSize: 11, fontWeight: "bold", color: theme.textMuted, letterSpacing: 1.5, marginBottom: 8 }}>
                              — DAY {d} —
                            </div>
                            <ScaledWorksheet>
                              <div style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
                                <DayPage day={d} month={altMonthProps.altMonthNum!} year={altMonthProps.altYear!} childName={childName} traditions={traditions} region={regions} age={age} birthdays={birthdays} />
                              </div>
                            </ScaledWorksheet>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Paid CTA at bottom of month view */}
                  <PaidMonthCTA
                    monthName={monthName}
                    daysInMonth={daysInMonth}
                    monthNum={month}
                    year={year}
                    {...altMonthProps}
                    isLive={STRIPE_PAYMENT_LINK !== null}
                    onBuy={handleBuyMonthPDF}
                    onNotify={onSwitch}
                  />
                </>
              )}
            </>
          );
        })()}

      </section>

      {/* Coloring Books — hidden for first launch */}
      {false && (
      <section style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "32px 24px", background: colors.paleSage, borderRadius: 20, marginTop: 8 }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: theme.textPrimary, marginBottom: 4 }}>Coloring Books</div>
        <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16 }}>Themed coloring books that match your family's traditions. Change traditions above to see different suggestions!</div>
        {suggestedBooks.length > 0 ? (
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory" }}>
            {suggestedBooks.map(book => <div key={book.id} style={{ scrollSnapAlign: "start" }}><BookCard book={book} /></div>)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0", color: theme.textPlaceholder, fontSize: 13 }}>No coloring books match the current selection yet. More coming soon!</div>
        )}
      </section>
      )}

      {/* Pricing — hidden for first launch */}
      {false && (
      <section style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "32px 24px", background: colors.softTeal, borderRadius: 20, marginTop: 8 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: "bold", color: theme.textPrimary }}>Simple Pricing</div>
          <div style={{ fontSize: 14, color: theme.textMuted, marginTop: 4 }}>Start free. Upgrade when you're ready.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { name: "Free", price: "$0", detail: "Preview app, save profiles" },
            { name: "PDF Download", price: "$2.99", detail: "One month's PDF" },
            { name: "PDF Subscription", price: "$4.99/mo", detail: "Current month auto-unlocked" },
            { name: "1 Printed Book", price: "$24.99", detail: "One month, printed & shipped" },
            { name: "3 Printed Books", price: "$59.99", detail: "Save $15" },
            { name: "12 Printed Books", price: "$199.99", detail: "Full year, save $100" },
          ].map(tier => (
            <div key={tier.name} style={{ border: `1.5px solid ${theme.cardBorder}`, borderRadius: 12, padding: 20, background: theme.cardBg, textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: theme.textPrimary, marginBottom: 4 }}>{tier.name}</div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: theme.textPrimary, marginBottom: 4 }}>{tier.price}</div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>{tier.detail}</div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Printed Workbooks waitlist — coming soon */}
      <section style={{
        position: "relative", zIndex: 1, maxWidth: 540, margin: "16px auto 32px",
        padding: "24px 24px",
        background: theme.cardBg, borderRadius: 14,
        border: `1.5px solid ${theme.cardBorder}`,
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 11, fontWeight: "bold", color: colors.deepTeal, letterSpacing: 1.5, marginBottom: 8 }}>
          COMING SOON
        </div>
        <div style={{ fontSize: 20, fontWeight: "bold", color: theme.textPrimary, marginBottom: 6 }}>
          Printed workbooks!
        </div>
        {waitlistSubmitted ? (
          <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 12, lineHeight: 1.5 }}>
            ✓ Thank you! We'll email you the moment printed workbooks are ready.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.5, marginBottom: 16 }}>
              A whole month of personalized worksheets, professionally printed and shipped to your door. Submit your email if you'd like to be notified when they're available.
            </div>
            <form onSubmit={handleWaitlistSubmit} style={{
              display: "flex", gap: 8, flexWrap: "wrap",
              maxWidth: 380, margin: "0 auto",
            }}>
              <input type="email" value={waitlistEmail}
                onChange={e => { setWaitlistEmail(e.target.value); setWaitlistError(null); }}
                placeholder="you@example.com" required
                style={{
                  flex: "1 1 200px", padding: "10px 12px",
                  borderRadius: 8, border: `1.5px solid ${theme.cardBorder}`,
                  fontSize: 14, fontFamily: "Georgia,serif",
                  boxSizing: "border-box",
                }} />
              <button type="submit" style={{
                padding: "10px 20px", borderRadius: 8, border: "none",
                background: colors.deepTeal, color: theme.buttonText,
                fontSize: 14, fontWeight: "bold", cursor: "pointer",
                flexShrink: 0,
              }}>
                Notify me
              </button>
            </form>
            {waitlistError && (
              <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 8 }}>{waitlistError}</div>
            )}
          </>
        )}
      </section>

      <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${theme.navBorder}`, padding: "16px 24px", textAlign: "center", fontSize: 11, color: theme.textPlaceholder }}>
        Melmoon Books · melmoonbooks.com
      </footer>
    </div>
  );
}

// ── Workbook Test (with birthdays) ──
const CHILD_EMOJIS = ["🌟","🌈","🦋","🐣","🌻","🦄","🐬","🍎","🎨","🎵"];

function TestWorkbook({ onSwitch, onDashboard }: { onSwitch: () => void; onDashboard: () => void }) {
  const now = new Date();
  const [profiles, setProfiles] = useState<ChildProfile[]>([
    { id: "demo-asha", name: "Asha", age: 5, traditions: ["hindu", "christian-catholic"], region: "us", emoji: "🌟",
      birthdays: [{ id: "demo1", name: "Nana Jo", month: now.getMonth() + 1, day: now.getDate() }, { id: "demo2", name: "Papa", month: 6, day: 15 }] },
  ]);
  const [activeId, setActiveId] = useState<string | null>("demo-asha");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [year] = useState(now.getFullYear());
  const [newBday, setNewBday] = useState({ name: "", month: 1, day: 1 });

  const activeChild = profiles.find(p => p.id === activeId) ?? null;
  const childName  = activeChild?.name ?? "";
  const age        = activeChild?.age ?? 5;
  const traditions = activeChild?.traditions ?? ["universal"];
  const region     = activeChild?.region ?? "us";
  const birthdays  = activeChild?.birthdays ?? [];

  const content = useMemo(() => getDayContent(traditions, region, month, day, year), [traditions, region, month, day, year]);
  const daysInMonth = new Date(year, month, 0).getDate();

  // Update active child's field
  const updateChild = (updates: Partial<ChildProfile>) => {
    if (!activeId) return;
    setProfiles(prev => prev.map(p => p.id === activeId ? { ...p, ...updates } : p));
  };

  const toggleTradition = (id: string) => {
    if (!activeChild) return;
    const has = activeChild.traditions.includes(id);
    if (has && activeChild.traditions.length <= 1) return;
    if (!has && activeChild.traditions.length >= 3) return;
    const next = has ? activeChild.traditions.filter(t => t !== id) : [...activeChild.traditions, id];
    updateChild({ traditions: next });
  };

  const addBirthday = () => {
    if (!newBday.name.trim() || !activeChild) return;
    updateChild({ birthdays: [...activeChild.birthdays, { id: makeId(), name: newBday.name.trim(), month: newBday.month, day: newBday.day }] });
    setNewBday({ name: "", month: 1, day: 1 });
  };

  const removeBirthday = (bdayId: string) => {
    if (!activeChild) return;
    updateChild({ birthdays: activeChild.birthdays.filter(b => b.id !== bdayId) });
  };

  const addChild = () => {
    if (profiles.length >= 8) return;
    const lastChild = profiles[profiles.length - 1];
    const newId = makeId();
    const newProfile: ChildProfile = {
      id: newId,
      name: "",
      age: 5,
      traditions: lastChild ? [...lastChild.traditions] : ["universal"],
      region: lastChild?.region ?? "us",
      emoji: CHILD_EMOJIS[profiles.length % CHILD_EMOJIS.length],
      birthdays: lastChild ? lastChild.birthdays.map(b => ({ ...b, id: makeId() })) : [],
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveId(newId);
  };

  const removeChild = (id: string) => {
    if (!window.confirm(`Remove this child?`)) return;
    const newList = profiles.filter(p => p.id !== id);
    setProfiles(newList);
    if (activeId === id) setActiveId(newList[0]?.id ?? null);
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, fontFamily: "Georgia, serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h1 style={{ fontSize: 24, color: theme.textPrimary, margin: 0 }}>Melmoon Books</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onDashboard} style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${colors.deepTeal}`, background: colors.deepTeal, color: "white", fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
              Content Dashboard
            </button>
            <button onClick={onSwitch} style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${theme.buttonOutline}`, background: theme.cardBg, color: theme.textPrimary, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
              Landing Page
            </button>
          </div>
        </div>

        {/* Child selector pills + add button */}
        <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {profiles.map(p => (
            <button key={p.id} onClick={() => setActiveId(p.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20,
                border: `2px solid ${activeId === p.id ? theme.pillActive : theme.pillInactive}`,
                background: activeId === p.id ? theme.pillActive : theme.cardBg,
                color: activeId === p.id ? theme.buttonText : theme.textPrimary,
                fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
              <span style={{ fontSize: 15 }}>{p.emoji}</span> {p.name || "New child"}
              {activeId === p.id && <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 2 }}>✓</span>}
            </button>
          ))}
          {profiles.length < 8 && (
            <button onClick={addChild}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20,
                border: `2px dashed ${theme.cardBorder}`, background: theme.cardBg, color: theme.textMuted,
                fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
              + Add Child
            </button>
          )}
        </div>

        {/* Inline child settings (only if a child is selected) */}
        {activeChild && (
          <div style={{ background: theme.cardBg, border: `2px solid ${theme.cardBorder}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            {/* Row 1: Name + Age + Remove */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 12 }}>
              <div style={{ flex: "1 1 160px" }}>
                <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>CHILD'S NAME</div>
                <input value={activeChild.name} onChange={e => updateChild({ name: e.target.value })}
                  placeholder="e.g. Asha, Lily, Noah…"
                  style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: `1.5px solid ${theme.cardBorder}`, fontSize: 14, boxSizing: "border-box", fontFamily: "Georgia,serif" }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>AGE</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[3,4,5,6].map(a => (
                    <button key={a} onClick={() => updateChild({ age: a })}
                      style={{ width: 34, height: 32, borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold",
                        border: `1.5px solid ${activeChild.age === a ? theme.pillActive : theme.pillInactive}`,
                        background: activeChild.age === a ? theme.pillActive : theme.cardBg,
                        color: activeChild.age === a ? theme.buttonText : theme.textPrimary }}>{a}</button>
                  ))}
                </div>
              </div>
              {profiles.length > 1 && (
                <button onClick={() => removeChild(activeChild.id)}
                  style={{ padding: "6px 12px", borderRadius: 7, border: "1.5px solid #fca5a5", background: theme.cardBg,
                    color: "#ef4444", fontSize: 11, fontWeight: "bold", cursor: "pointer", marginBottom: 1 }}>
                  Remove
                </button>
              )}
            </div>

            {/* Row 2: Traditions */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>
                FAITH TRADITIONS <span style={{ fontWeight: "normal", color: theme.textPlaceholder }}>(select up to 3 — they alternate daily)</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TRADITIONS.map(t => {
                  const selected = activeChild.traditions.includes(t.id);
                  return (
                    <button key={t.id} onClick={() => toggleTradition(t.id)}
                      style={{ padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                        border: `2px solid ${selected ? theme.pillActive : theme.pillInactive}`,
                        background: selected ? theme.pillActive : theme.cardBg,
                        color: selected ? theme.buttonText : theme.textPrimary }}>{t.label}</button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Region */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>COUNTRY</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {REGIONS.map(r => (
                  <button key={r.id} onClick={() => updateChild({ region: r.id })}
                    style={{ padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                      border: `1.5px solid ${activeChild.region === r.id ? theme.pillActive : theme.pillInactive}`,
                      background: activeChild.region === r.id ? theme.pillActive : theme.cardBg,
                      color: activeChild.region === r.id ? theme.buttonText : theme.textPrimary }}>{r.flag} {r.label}</button>
                ))}
              </div>
            </div>

            {/* Row 4: Birthdays */}
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>
                FAMILY BIRTHDAYS <span style={{ fontWeight: "normal", color: theme.textPlaceholder }}>(appear on the worksheet)</span>
              </div>
              {activeChild.birthdays.map(b => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, padding: "4px 8px", background: theme.cardBg, borderRadius: 6, border: `1px solid ${theme.cardBorder}` }}>
                  <span style={{ flex: 1, fontSize: 12, color: theme.textPrimary }}>{b.name}</span>
                  <span style={{ fontSize: 11, color: theme.textMuted }}>{BDAY_MONTHS[b.month - 1]} {b.day}</span>
                  <button onClick={() => removeBirthday(b.id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                <input value={newBday.name} onChange={e => setNewBday(b => ({ ...b, name: e.target.value }))} placeholder="Name (e.g. Nana Jo)"
                  onKeyDown={e => { if (e.key === "Enter") addBirthday(); }}
                  style={{ flex: 1, padding: "5px 8px", borderRadius: 6, border: `1.5px solid ${theme.cardBorder}`, fontSize: 12, boxSizing: "border-box" }} />
                <select value={newBday.month} onChange={e => setNewBday(b => ({ ...b, month: Number(e.target.value) }))}
                  style={{ padding: "5px 4px", borderRadius: 6, border: `1.5px solid ${theme.cardBorder}`, fontSize: 11 }}>
                  {BDAY_MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <input type="number" min={1} max={31} value={newBday.day} onChange={e => setNewBday(b => ({ ...b, day: Number(e.target.value) }))}
                  style={{ width: 44, padding: "5px 4px", borderRadius: 6, border: `1.5px solid ${theme.cardBorder}`, fontSize: 11, textAlign: "center" }} />
                <button onClick={addBirthday} disabled={!newBday.name.trim()}
                  style={{ padding: "5px 10px", borderRadius: 6, border: "none",
                    background: newBday.name.trim() ? theme.buttonBg : theme.cardBorder,
                    color: newBday.name.trim() ? theme.buttonText : theme.textPlaceholder,
                    fontSize: 11, fontWeight: "bold", cursor: newBday.name.trim() ? "pointer" : "not-allowed" }}>+</button>
              </div>
            </div>
          </div>
        )}

        {/* No children state */}
        {profiles.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: theme.textPlaceholder, fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>👶</div>
            Click "+ Add Child" above to get started!
          </div>
        )}

        {/* Month/Day controls */}
        <div style={{ background: theme.cardBg, border: `2px solid ${theme.cardBorder}`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 3 }}>MONTH</div>
            <select value={month} onChange={e => { setMonth(Number(e.target.value)); setDay(1); }}
              style={{ padding: "5px 8px", borderRadius: 6, border: `2px solid ${theme.cardBorder}`, fontSize: 13 }}>
              {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 3 }}>DAY</div>
            <select value={day} onChange={e => setDay(Number(e.target.value))}
              style={{ padding: "5px 8px", borderRadius: 6, border: `2px solid ${theme.cardBorder}`, fontSize: 13 }}>
              {Array.from({ length: daysInMonth }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, fontSize: 11, color: theme.textMuted, textAlign: "right" }}>
            Tradition today: <strong>{content.dominantTradition}</strong>
            {content.holidays.length > 0 && <><br/>{content.holidays.map(h => h.name).join(", ")}</>}
          </div>
        </div>

        {/* DayPage */}
        {activeChild && (
          <>
            <div style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
              <DayPage day={day} month={month} year={year} childName={childName} traditions={traditions} region={region} age={age} birthdays={birthdays} />
            </div>
            <p style={{ marginTop: 14, fontSize: 11, color: theme.textPlaceholder, textAlign: "center" }}>
              Even days = Color the Scene · Odd days = Trace &amp; Color
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Paid Success Page ──
// Shown after a customer successfully pays via Stripe. Reads their
// customization from localStorage and auto-generates a 31-page PDF
// for download. Customer can also re-customize for additional kids
// (one purchase covers the whole family).
function PaidSuccessPage({ onBackToLanding }: { onBackToLanding: () => void }) {
  const [order, setOrder] = useState<{
    name: string; age: number; month: number; year: number;
    traditions: string[]; regions: string[]; birthdays: Birthday[];
  } | null>(null);
  const [pdfProgress, setPdfProgress] = useState<number | null>(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoRanRef = useRef(false);

  // Editable copy of the order so customer can regenerate for siblings
  // (and pick a different month if they paid for the wrong one)
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState(5);
  const [editTraditions, setEditTraditions] = useState<string[]>(["universal"]);
  const [editRegions, setEditRegions] = useState<string[]>(["us"]);
  const [editBirthdays, setEditBirthdays] = useState<Birthday[]>([]);
  const [editMonth, setEditMonth] = useState(1);
  const [editYear, setEditYear] = useState(new Date().getFullYear());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pendingMonthPDF");
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrder(parsed);
        setEditName(parsed.name || "");
        setEditAge(parsed.age || 5);
        setEditTraditions(parsed.traditions || ["universal"]);
        setEditRegions(parsed.regions || ["us"]);
        setEditBirthdays(parsed.birthdays || []);
        setEditMonth(parsed.month || new Date().getMonth() + 1);
        setEditYear(parsed.year || new Date().getFullYear());
        // Track successful payment completion with the customization context
        track("payment_completed", {
          childName: parsed.name || "(unnamed)",
          age: parsed.age,
          month: parsed.month,
          year: parsed.year,
          traditions: parsed.traditions,
          regions: parsed.regions,
          birthdayCount: (parsed.birthdays || []).length,
        });
      } else {
        // No pending order found — customer reached this URL directly.
        // We'll still let them generate a PDF, just with defaults.
        setOrder({
          name: "", age: 5, month: new Date().getMonth() + 1, year: new Date().getFullYear(),
          traditions: ["universal"], regions: ["us"], birthdays: [],
        });
        track("paid_success_direct_visit");
      }
    } catch (e) {
      console.warn("Could not load pending order:", e);
    }
  }, []);

  // Auto-generate the first PDF once the order loads
  useEffect(() => {
    if (order && !autoRanRef.current) {
      autoRanRef.current = true;
      setTimeout(() => generateMonthPDF(order, false), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const generateMonthPDF = async (data: {
    name: string; age: number; month: number; year: number;
    traditions: string[]; regions: string[]; birthdays: Birthday[];
  }, isRegen: boolean) => {
    const { name, age, month, year, traditions, regions, birthdays } = data;
    const monthName = MONTH_NAMES[month - 1];
    const daysInMonth = new Date(year, month, 0).getDate();

    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement("script");
      s.src = src; s.onload = () => resolve(); s.onerror = () => reject();
      document.head.appendChild(s);
    });
    const fetchBase64 = (url: string): Promise<string | null> =>
      fetch(url).then(r => r.ok ? r.blob() : Promise.reject())
        .then(blob => new Promise<string>(res => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as string);
          reader.readAsDataURL(blob);
        })).catch(() => null);

    try {
      setError(null);
      setPdfProgress(2);
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      const { jsPDF } = (window as any).jspdf;
      const html2canvas = (window as any).html2canvas;
      const ReactDOM = await import("react-dom/client");
      const React2 = await import("react");

      // Pre-fetch all images for the month (tradition / region / universal fallback)
      setPdfProgress(8);
      const imageCache: Record<string, string> = {};
      const primaryRegion = regions[0] ?? "us";
      for (let d = 1; d <= daysInMonth; d++) {
        const paddedDay = String(d).padStart(2, "0");
        const baseKey = `${monthName.toLowerCase()}_${paddedDay}`;
        const dayContent = getDayContent(traditions, regions, month, d, year);
        const candidates = [
          ...(dayContent.theme.imageFile ? [dayContent.theme.imageFile.replace(/\.png$/, "")] : []),
          ...(dayContent.dominantTradition !== "universal" ? [`${dayContent.dominantTradition}/${baseKey}`] : []),
          `${primaryRegion}/${baseKey}`,
          baseKey,
        ];
        for (const key of candidates) {
          if (imageCache[key]) break;
          const b64 = await fetchBase64(`/images/${key}.png`);
          if (b64) { imageCache[key] = b64; break; }
        }
      }

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [612, 792] });
      const margin = 54;
      const contentW = 612 - margin * 2;
      const contentH = 792 - margin * 2;

      const container = document.createElement("div");
      container.style.cssText = "position:fixed;left:-9999px;top:0;width:540px;background:white;z-index:-1;";
      document.body.appendChild(container);

      for (let d = 1; d <= daysInMonth; d++) {
        // Progress: 10% setup + 85% rendering + 5% finalizing
        setPdfProgress(10 + Math.round((d / daysInMonth) * 85));

        const wrapper = document.createElement("div");
        container.innerHTML = "";
        container.appendChild(wrapper);

        await new Promise<void>(resolve => {
          const root = ReactDOM.createRoot(wrapper);
          root.render(
            React2.createElement(ImageCacheContext.Provider, { value: imageCache },
              React2.createElement(DayPage, {
                day: d, month, year, childName: name, traditions, region: regions, age, birthdays,
              })
            )
          );
          setTimeout(resolve, 250);
        });

        const canvas = await html2canvas(wrapper, {
          scale: 2, useCORS: true, allowTaint: true,
          backgroundColor: "#ffffff", width: 540, windowWidth: 600, logging: false,
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.93);
        const imgH = Math.min(contentW * (canvas.height / canvas.width), contentH);
        if (d > 1) pdf.addPage();
        pdf.addImage(imgData, "JPEG", margin, margin, contentW, imgH);
      }

      document.body.removeChild(container);
      setPdfProgress(98);

      const safeName = (name || "MorningWork").replace(/[^a-zA-Z0-9]/g, "");
      pdf.save(`${safeName}_${monthName}_${year}.pdf`);
      setPdfProgress(null);
      setHasDownloaded(true);

      // Track each PDF generation — combined with payment_completed, this
      // lets us see how many children each paying family generates a PDF for.
      track("month_pdf_generated", {
        childName: name || "(unnamed)",
        age, month, year, traditions, regions,
        birthdayCount: birthdays.length,
        isRegeneration: isRegen,
      });

      // Clear the pending order only after the first auto-download — keep around
      // if customer wants to regenerate for siblings.
      if (!isRegen) {
        try { localStorage.removeItem("pendingMonthPDF"); } catch {}
      }
    } catch (err) {
      console.error("PDF error:", err);
      setPdfProgress(null);
      setError(`PDF generation failed: ${(err as Error).message}. Please try again, or email melanie@melmoonbooks.com with your order info.`);
      track("month_pdf_error", { error: (err as Error).message, isRegeneration: isRegen });
    }
  };

  const handleRegenerate = () => {
    if (!order) return;
    generateMonthPDF({
      name: editName, age: editAge, month: editMonth, year: editYear,
      traditions: editTraditions, regions: editRegions, birthdays: editBirthdays,
    }, true);
  };

  const toggleEditTradition = (id: string) => {
    setEditTraditions(prev => {
      if (prev.includes(id)) { if (prev.length <= 1) return prev; return prev.filter(t => t !== id); }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };
  const toggleEditRegion = (id: string) => {
    setEditRegions(prev => {
      if (prev.includes(id)) { if (prev.length <= 1) return prev; return prev.filter(r => r !== id); }
      return [...prev, id];
    });
  };

  if (!order) {
    return (
      <div style={{ minHeight: "100vh", background: theme.pageBg, fontFamily: "Georgia,serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", color: theme.textMuted }}>Loading your order…</div>
      </div>
    );
  }

  const monthName = MONTH_NAMES[order.month - 1];
  const daysInMonth = new Date(order.year, order.month, 0).getDate();

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(to bottom, ${theme.pageBg} 0%, ${theme.pageBg} 50%, #dceef2 100%)`, fontFamily: "Georgia,serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Thank you header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: "bold", color: theme.textPrimary, margin: "0 0 8px" }}>
            Thank you for your purchase!
          </h1>
          <p style={{ fontSize: 15, color: theme.textSecondary, margin: 0, lineHeight: 1.5 }}>
            Your full month of {monthName} {order.year} — {daysInMonth} personalized worksheets — is being generated below.
          </p>
        </div>

        {/* Download status card */}
        <div style={{
          background: theme.cardBg, borderRadius: 14, border: `2px solid ${colors.deepTeal}`,
          padding: "28px 24px", textAlign: "center", marginBottom: 24,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}>
          {pdfProgress !== null ? (
            <>
              <div style={{ fontSize: 16, fontWeight: "bold", color: theme.textPrimary, marginBottom: 16 }}>
                Building your PDF…
              </div>
              <div style={{
                width: "100%", height: 12, background: theme.cardBorder,
                borderRadius: 6, overflow: "hidden", marginBottom: 10,
              }}>
                <div style={{
                  width: `${pdfProgress}%`, height: "100%",
                  background: colors.deepTeal, transition: "width 0.3s ease",
                }} />
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>
                {pdfProgress}% · this takes about 30-60 seconds for all {daysInMonth} days
              </div>
            </>
          ) : error ? (
            <>
              <div style={{ fontSize: 15, color: "#b91c1c", marginBottom: 12, lineHeight: 1.5 }}>{error}</div>
              <button onClick={() => generateMonthPDF(order, false)} style={{
                padding: "10px 24px", fontSize: 14, fontWeight: "bold", cursor: "pointer",
                border: "none", borderRadius: 8, background: colors.deepTeal, color: theme.buttonText,
              }}>
                Try again
              </button>
            </>
          ) : hasDownloaded ? (
            <>
              <div style={{ fontSize: 16, fontWeight: "bold", color: theme.textPrimary, marginBottom: 8 }}>
                ✓ PDF downloaded
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16 }}>
                Check your Downloads folder for <strong>{(order.name || "MorningWork").replace(/[^a-zA-Z0-9]/g, "")}_{monthName}_{order.year}.pdf</strong>
              </div>
              <button onClick={() => generateMonthPDF(order, true)} style={{
                padding: "10px 22px", fontSize: 13, fontWeight: "bold", cursor: "pointer",
                border: `1.5px solid ${colors.deepTeal}`, borderRadius: 8,
                background: theme.cardBg, color: colors.deepTeal,
              }}>
                ↓ Download again
              </button>
            </>
          ) : (
            <div style={{ fontSize: 14, color: theme.textMuted }}>Preparing your PDF…</div>
          )}
        </div>

        {/* Multi-child: regenerate for siblings */}
        <div style={{
          background: theme.cardBg, borderRadius: 12, border: `1.5px solid ${theme.cardBorder}`,
          padding: 20,
        }}>
          <div style={{ fontSize: 15, fontWeight: "bold", color: theme.textPrimary, marginBottom: 4 }}>
            Have more than one child, or need a different month?
          </div>
          <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, lineHeight: 1.5 }}>
            Your purchase covers the whole family. Edit the name, month, or any other details below, then download a personalized PDF.
          </div>

          {/* Month selector — lets customer fix a wrong-month purchase */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>MONTH</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <select value={editMonth} onChange={e => setEditMonth(Number(e.target.value))}
                style={{ padding: "6px 10px", borderRadius: 7, border: `1.5px solid ${theme.cardBorder}`, fontSize: 14, fontFamily: "Georgia,serif" }}>
                {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <select value={editYear} onChange={e => setEditYear(Number(e.target.value))}
                style={{ padding: "6px 10px", borderRadius: 7, border: `1.5px solid ${theme.cardBorder}`, fontSize: 14, fontFamily: "Georgia,serif" }}>
                {[editYear - 1, editYear, editYear + 1].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Child name */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>CHILD'S NAME</div>
            <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="e.g. Liam"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1.5px solid ${theme.cardBorder}`, fontSize: 14, boxSizing: "border-box", fontFamily: "Georgia,serif" }} />
          </div>

          {/* Grade + Country + Traditions in a compact row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>
                GRADE {order && isSummerMonth(order.month) && <span style={{ fontWeight: "normal", color: theme.textPlaceholder }}>(rising)</span>}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {GRADES.filter(g => !g.hidden).map(g => (
                  <button key={g.id} onClick={() => setEditAge(g.age)} style={{
                    padding: "6px 12px", height: 32, borderRadius: 6, cursor: "pointer",
                    fontSize: 12, fontWeight: "bold",
                    border: `1.5px solid ${editAge === g.age ? theme.pillActive : theme.pillInactive}`,
                    background: editAge === g.age ? theme.pillActive : theme.cardBg,
                    color: editAge === g.age ? theme.buttonText : theme.textPrimary,
                  }}>
                    {order && isSummerMonth(order.month) ? g.risingLabel : g.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>COUNTRY</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {REGIONS.map(r => {
                  const selected = editRegions.includes(r.id);
                  return (
                    <button key={r.id} onClick={() => toggleEditRegion(r.id)} style={{
                      padding: "6px 10px", borderRadius: 6, cursor: "pointer",
                      fontSize: 11, fontWeight: "bold",
                      border: `1.5px solid ${selected ? theme.pillActive : theme.pillInactive}`,
                      background: selected ? theme.pillActive : theme.cardBg,
                      color: selected ? theme.buttonText : theme.textPrimary,
                    }}>{r.flag} {r.label}</button>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>TRADITIONS</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TRADITIONS.map(t => {
                const selected = editTraditions.includes(t.id);
                return (
                  <button key={t.id} onClick={() => toggleEditTradition(t.id)} style={{
                    padding: "6px 12px", borderRadius: 7, cursor: "pointer",
                    fontSize: 12, fontWeight: "bold",
                    border: `2px solid ${selected ? theme.pillActive : theme.pillInactive}`,
                    background: selected ? theme.pillActive : theme.cardBg,
                    color: selected ? theme.buttonText : theme.textPrimary,
                  }}>{t.label}</button>
                );
              })}
            </div>
          </div>

          <button onClick={handleRegenerate} disabled={pdfProgress !== null}
            style={{
              width: "100%", padding: "12px", fontSize: 14, fontWeight: "bold",
              cursor: pdfProgress !== null ? "wait" : "pointer",
              border: "none", borderRadius: 8,
              background: colors.deepTeal, color: theme.buttonText,
              opacity: pdfProgress !== null ? 0.7 : 1,
            }}>
            {pdfProgress !== null
              ? `Building PDF… ${pdfProgress}%`
              : `↓ Generate ${MONTH_NAMES[editMonth - 1]} ${editYear} PDF for ${editName || "this child"}`}
          </button>
        </div>

        {/* Back to landing */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={onBackToLanding} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, color: theme.textMuted, textDecoration: "underline",
          }}>
            ← Back to melmoonbooks.com
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Root: toggle between landing page, workbook, and paid-success ──
function TestApp() {
  // Detect ?paid=success in URL to auto-route to the success page
  const initialView: "landing" | "workbook" | "dashboard" | "paid-success" = (() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("paid") === "success") return "paid-success";
    }
    return "landing";
  })();
  const [view, setView] = useState<"landing" | "workbook" | "dashboard" | "paid-success">(initialView);

  const goToLanding = () => {
    // Clean query params from URL when navigating back to landing
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    setView("landing");
  };

  if (view === "paid-success") return <PaidSuccessPage onBackToLanding={goToLanding} />;
  if (view === "dashboard") return <ContentDashboard onBack={() => setView("workbook")} />;
  if (view === "workbook") return <TestWorkbook onSwitch={() => setView("landing")} onDashboard={() => setView("dashboard")} />;
  return <TestLandingPage onSwitch={() => setView("workbook")} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestApp />
  </StrictMode>,
);
