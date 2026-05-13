import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Test entrypoint — bypasses Clerk auth to test v2 components directly

import React, { useState, useMemo } from 'react';
import DayPage from './products/morning-workbook/DayPage';
import { getDayContent, REGIONS } from './content';
import { Birthday, ChildProfile } from './content/types';
import { coloringBooks } from './content/coloring-books';
import ProfileModal from './shared/ProfileModal';
import ContentDashboard from './ContentDashboard';
import { colors, theme } from './shared/theme';

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

function makeId() { return Math.random().toString(36).slice(2, 10); }
const BDAY_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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

// ── Landing Page (no Clerk) ──
function TestLandingPage({ onSwitch }: { onSwitch: () => void }) {
  const now = new Date();
  const [childName, setChildName] = useState("");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [year] = useState(now.getFullYear());
  const [age, setAge] = useState(5);
  const [traditions, setTraditions] = useState<string[]>(["universal"]);
  const [region, setRegion] = useState("us");

  const toggleTradition = (id: string) => {
    setTraditions(prev => {
      if (prev.includes(id)) { if (prev.length <= 1) return prev; return prev.filter(t => t !== id); }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const content = useMemo(() => getDayContent(traditions, region, month, day, year), [traditions, region, month, day, year]);
  const suggestedBooks = content.suggestedColoringBooks;
  const daysInMonth = new Date(year, month, 0).getDate();

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
      <nav style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: `1px solid ${theme.navBorder}`, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: theme.textPrimary }}>MelMoon Books</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={onSwitch} style={{ padding: "7px 16px", borderRadius: 8, border: `1.5px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.textPrimary, fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
            Sign In (test)
          </button>
          <button style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: colors.deepTeal, color: theme.buttonText, fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "56px 24px 40px", maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", color: theme.textPrimary, margin: "0 0 12px", lineHeight: 1.2 }}>
          Morning Workbooks for Little Learners
        </h1>
        <p style={{ fontSize: 16, color: theme.textSecondary, lineHeight: 1.6, margin: 0 }}>
          Personalized daily workbooks for ages 3–6 with letter tracing, math, and coloring.
             Choose a region to add international holidays — and if your family has a faith tradition, you can include that too. Every page reflects what matters to you.
        </p>
      </section>

      {/* Controls */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "0 24px 16px" }}>
        <div style={{ background: theme.cardBg, borderRadius: 12, border: `1.5px solid ${theme.cardBorder}`, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: theme.textPrimary, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.8 }}>Customize the preview</div>
          <div style={{ fontSize: 11, color: theme.textPlaceholder, marginBottom: 12, fontStyle: "italic" }}>Try different combinations — nothing is saved until you create a free account.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <div style={{ flex: "1 1 160px" }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>CHILD'S NAME</div>
              <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="e.g. Asha"
                style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: `1.5px solid ${theme.cardBorder}`, fontSize: 13, boxSizing: "border-box", fontFamily: "Georgia,serif" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>AGE</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[3,4,5,6].map(a => (
                  <button key={a} onClick={() => setAge(a)} style={{ width: 36, height: 32, borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold",
                    border: `1.5px solid ${age === a ? theme.pillActive : theme.pillInactive}`, background: age === a ? theme.pillActive : theme.cardBg, color: age === a ? theme.buttonText : theme.textPrimary }}>{a}</button>
                ))}
              </div>
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
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>REGION</div>
              <div style={{ display: "flex", gap: 4 }}>
                {REGIONS.map(r => (
                  <button key={r.id} onClick={() => setRegion(r.id)} style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                    border: `1.5px solid ${region === r.id ? theme.pillActive : theme.pillInactive}`, background: region === r.id ? theme.pillActive : theme.cardBg, color: region === r.id ? theme.buttonText : theme.textPrimary }}>{r.flag} {r.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>FAITH TRADITIONS <span style={{ fontWeight: "normal", color: theme.textPlaceholder }}>(select up to 3 — they alternate daily)</span></div>
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
        </div>

        {/* DayPage — fixed width to match real printed page proportions */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 540, maxWidth: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
            <DayPage day={day} month={month} year={year} childName={childName} traditions={traditions} region={region} age={age} />
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "16px 0", fontSize: 12, color: theme.textMuted }}>
          PDF download and printed book ordering require a free account.
        </div>
      </section>

      {/* Coloring Books */}
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

      {/* Pricing */}
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

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "32px 24px 48px" }}>
        <button style={{ padding: "14px 36px", borderRadius: 10, border: "none", background: colors.deepTeal, color: theme.buttonText, fontSize: 16, fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
          Create Free Account
        </button>
        <div style={{ fontSize: 12, color: theme.textPlaceholder, marginTop: 8 }}>No credit card required</div>
      </section>

      <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${theme.navBorder}`, padding: "16px 24px", textAlign: "center", fontSize: 11, color: theme.textPlaceholder }}>
        MelMoon Books · melmoonbooks.com
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
          <h1 style={{ fontSize: 24, color: theme.textPrimary, margin: 0 }}>MelMoon Books</h1>
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
              <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 4 }}>REGION</div>
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
                FAMILY BIRTHDAYS <span style={{ fontWeight: "normal", color: theme.textPlaceholder }}>(appear on the workbook page)</span>
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

// ── Root: toggle between landing page and workbook ──
function TestApp() {
  const [view, setView] = useState<"landing" | "workbook" | "dashboard">("landing");
  if (view === "dashboard") return <ContentDashboard onBack={() => setView("workbook")} />;
  if (view === "workbook") return <TestWorkbook onSwitch={() => setView("landing")} onDashboard={() => setView("dashboard")} />;
  return <TestLandingPage onSwitch={() => setView("workbook")} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestApp />
  </StrictMode>,
);
