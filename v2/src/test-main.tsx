import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Test entrypoint — bypasses Clerk auth to test v2 components directly

import React, { useState, useMemo } from 'react';
import DayPage from './products/morning-workbook/DayPage';
import { getDayContent, REGIONS } from './content';
import { Birthday, ChildProfile } from './content/types';
import { coloringBooks } from './content/coloring-books';
import ProfileModal from './shared/ProfileModal';

const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

const TRADITIONS = [
  { id: "universal",            label: "Non-religious" },
  { id: "christian-catholic",   label: "Catholic" },
  { id: "christian-protestant", label: "Protestant" },
  { id: "hindu",                label: "Hindu" },
  { id: "jewish",               label: "Jewish" },
  { id: "muslim",               label: "Muslim" },
];

function makeId() { return Math.random().toString(36).slice(2, 10); }
const BDAY_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── Coloring Book Card ──
function BookCard({ book }: { book: any }) {
  return (
    <div style={{ flexShrink: 0, width: 180, border: "1.5px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontSize: 48 }}>
        {book.coverEmoji}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: "bold", color: "#1f2937", lineHeight: 1.3 }}>{book.title}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, lineHeight: 1.4 }}>{book.description.slice(0, 60)}…</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#1f2937" }}>${book.price.toFixed(2)}</div>
          {!book.available && <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", background: "#f3f4f6", borderRadius: 4, padding: "2px 8px" }}>Coming Soon</div>}
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
    <div style={{ minHeight: "100vh", background: "#faf9f6", fontFamily: "Georgia,serif" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #e5e7eb", background: "white" }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#1f2937" }}>MelMoon Books</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={onSwitch} style={{ padding: "7px 16px", borderRadius: 8, border: "1.5px solid #d1d5db", background: "white", color: "#374151", fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
            Sign In (test)
          </button>
          <button style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: "#1f2937", color: "white", fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "48px 24px 32px", maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", color: "#1f2937", margin: "0 0 12px", lineHeight: 1.2 }}>
          Morning Workbooks for Little Learners
        </h1>
        <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.6, margin: 0 }}>
          Personalized daily workbooks for ages 3–6 with letter tracing, math, and coloring.
          Choose your family's faith traditions — Christian, Hindu, Jewish, Muslim, or non-religious — and every page reflects what matters to you.
        </p>
      </section>

      {/* Controls */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 16px" }}>
        <div style={{ background: "white", borderRadius: 12, border: "1.5px solid #e5e7eb", padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: "#374151", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.8 }}>Customize the preview</div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 12, fontStyle: "italic" }}>Try different combinations — nothing is saved until you create a free account.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <div style={{ flex: "1 1 160px" }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>CHILD'S NAME</div>
              <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="e.g. Asha"
                style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: "1.5px solid #e5e7eb", fontSize: 13, boxSizing: "border-box", fontFamily: "Georgia,serif" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>AGE</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[3,4,5,6].map(a => (
                  <button key={a} onClick={() => setAge(a)} style={{ width: 36, height: 32, borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold",
                    border: `1.5px solid ${age === a ? "#1f2937" : "#e5e7eb"}`, background: age === a ? "#1f2937" : "white", color: age === a ? "white" : "#374151" }}>{a}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>MONTH</div>
              <select value={month} onChange={e => { setMonth(Number(e.target.value)); setDay(1); }}
                style={{ padding: "6px 8px", borderRadius: 7, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: "Georgia,serif" }}>
                {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>DAY</div>
              <select value={day} onChange={e => setDay(Number(e.target.value))}
                style={{ padding: "6px 8px", borderRadius: 7, border: "1.5px solid #e5e7eb", fontSize: 13 }}>
                {Array.from({ length: daysInMonth }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>REGION</div>
              <div style={{ display: "flex", gap: 4 }}>
                {REGIONS.map(r => (
                  <button key={r.id} onClick={() => setRegion(r.id)} style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                    border: `1.5px solid ${region === r.id ? "#1f2937" : "#e5e7eb"}`, background: region === r.id ? "#1f2937" : "white", color: region === r.id ? "white" : "#374151" }}>{r.flag} {r.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>FAITH TRADITIONS <span style={{ fontWeight: "normal", color: "#9ca3af" }}>(select up to 3 — they alternate daily)</span></div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TRADITIONS.map(t => {
                const selected = traditions.includes(t.id);
                return (
                  <button key={t.id} onClick={() => toggleTradition(t.id)} style={{ padding: "6px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: "bold",
                    border: `2px solid ${selected ? "#1f2937" : "#e5e7eb"}`, background: selected ? "#1f2937" : "white", color: selected ? "white" : "#374151" }}>{t.label}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* DayPage */}
        <div style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
          <DayPage day={day} month={month} year={year} childName={childName} traditions={traditions} region={region} age={age} />
        </div>
        <div style={{ textAlign: "center", padding: "16px 0", fontSize: 12, color: "#6b7280" }}>
          PDF download and printed book ordering require a free account.
        </div>
      </section>

      {/* Coloring Books */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 32px" }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#1f2937", marginBottom: 4 }}>Coloring Books</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Themed coloring books that match your family's traditions. Change traditions above to see different suggestions!</div>
        {suggestedBooks.length > 0 ? (
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory" }}>
            {suggestedBooks.map(book => <div key={book.id} style={{ scrollSnapAlign: "start" }}><BookCard book={book} /></div>)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#9ca3af", fontSize: 13 }}>No coloring books match the current selection yet. More coming soon!</div>
        )}
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: "bold", color: "#1f2937" }}>Simple Pricing</div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Start free. Upgrade when you're ready.</div>
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
            <div key={tier.name} style={{ border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 20, background: "white", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#374151", marginBottom: 4 }}>{tier.name}</div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: "#1f2937", marginBottom: 4 }}>{tier.price}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{tier.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "32px 24px 48px" }}>
        <button style={{ padding: "14px 36px", borderRadius: 10, border: "none", background: "#1f2937", color: "white", fontSize: 16, fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
          Create Free Account
        </button>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>No credit card required</div>
      </section>

      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "16px 24px", textAlign: "center", fontSize: 11, color: "#9ca3af" }}>
        MelMoon Books · melmoonbooks.com
      </footer>
    </div>
  );
}

// ── Workbook Test (with birthdays) ──
const CHILD_EMOJIS = ["🌟","🌈","🦋","🐣","🌻","🦄","🐬","🍎","🎨","🎵"];

function TestWorkbook({ onSwitch }: { onSwitch: () => void }) {
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
    <div style={{ minHeight: "100vh", background: "#f0ece3", fontFamily: "Georgia, serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h1 style={{ fontSize: 24, color: "#1f2937", margin: 0 }}>MelMoon Books</h1>
          <button onClick={onSwitch} style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #d1d5db", background: "white", color: "#374151", fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
            View Landing Page
          </button>
        </div>

        {/* Child selector pills + add button */}
        <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {profiles.map(p => (
            <button key={p.id} onClick={() => setActiveId(p.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20,
                border: `2px solid ${activeId === p.id ? "#1f2937" : "#d1d5db"}`,
                background: activeId === p.id ? "#1f2937" : "white",
                color: activeId === p.id ? "white" : "#374151",
                fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
              <span style={{ fontSize: 15 }}>{p.emoji}</span> {p.name || "New child"}
              {activeId === p.id && <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 2 }}>✓</span>}
            </button>
          ))}
          {profiles.length < 8 && (
            <button onClick={addChild}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20,
                border: "2px dashed #d1d5db", background: "white", color: "#6b7280",
                fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
              + Add Child
            </button>
          )}
        </div>

        {/* Inline child settings (only if a child is selected) */}
        {activeChild && (
          <div style={{ background: "white", border: "2px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            {/* Row 1: Name + Age + Remove */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 12 }}>
              <div style={{ flex: "1 1 160px" }}>
                <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>CHILD'S NAME</div>
                <input value={activeChild.name} onChange={e => updateChild({ name: e.target.value })}
                  placeholder="e.g. Asha, Lily, Noah…"
                  style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: "1.5px solid #e5e7eb", fontSize: 14, boxSizing: "border-box", fontFamily: "Georgia,serif" }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>AGE</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[3,4,5,6].map(a => (
                    <button key={a} onClick={() => updateChild({ age: a })}
                      style={{ width: 34, height: 32, borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold",
                        border: `1.5px solid ${activeChild.age === a ? "#1f2937" : "#e5e7eb"}`,
                        background: activeChild.age === a ? "#1f2937" : "white",
                        color: activeChild.age === a ? "white" : "#374151" }}>{a}</button>
                  ))}
                </div>
              </div>
              {profiles.length > 1 && (
                <button onClick={() => removeChild(activeChild.id)}
                  style={{ padding: "6px 12px", borderRadius: 7, border: "1.5px solid #fca5a5", background: "white",
                    color: "#ef4444", fontSize: 11, fontWeight: "bold", cursor: "pointer", marginBottom: 1 }}>
                  Remove
                </button>
              )}
            </div>

            {/* Row 2: Traditions */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>
                FAITH TRADITIONS <span style={{ fontWeight: "normal", color: "#9ca3af" }}>(select up to 3 — they alternate daily)</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TRADITIONS.map(t => {
                  const selected = activeChild.traditions.includes(t.id);
                  return (
                    <button key={t.id} onClick={() => toggleTradition(t.id)}
                      style={{ padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                        border: `2px solid ${selected ? "#1f2937" : "#e5e7eb"}`,
                        background: selected ? "#1f2937" : "white",
                        color: selected ? "white" : "#374151" }}>{t.label}</button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Region */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>REGION</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {REGIONS.map(r => (
                  <button key={r.id} onClick={() => updateChild({ region: r.id })}
                    style={{ padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                      border: `1.5px solid ${activeChild.region === r.id ? "#1f2937" : "#e5e7eb"}`,
                      background: activeChild.region === r.id ? "#1f2937" : "white",
                      color: activeChild.region === r.id ? "white" : "#374151" }}>{r.flag} {r.label}</button>
                ))}
              </div>
            </div>

            {/* Row 4: Birthdays */}
            <div>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>
                FAMILY BIRTHDAYS <span style={{ fontWeight: "normal", color: "#9ca3af" }}>(appear on the workbook page)</span>
              </div>
              {activeChild.birthdays.map(b => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, padding: "4px 8px", background: "#f9fafb", borderRadius: 6, border: "1px solid #e5e7eb" }}>
                  <span style={{ flex: 1, fontSize: 12, color: "#374151" }}>{b.name}</span>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{BDAY_MONTHS[b.month - 1]} {b.day}</span>
                  <button onClick={() => removeBirthday(b.id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                <input value={newBday.name} onChange={e => setNewBday(b => ({ ...b, name: e.target.value }))} placeholder="Name (e.g. Nana Jo)"
                  onKeyDown={e => { if (e.key === "Enter") addBirthday(); }}
                  style={{ flex: 1, padding: "5px 8px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 12, boxSizing: "border-box" }} />
                <select value={newBday.month} onChange={e => setNewBday(b => ({ ...b, month: Number(e.target.value) }))}
                  style={{ padding: "5px 4px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 11 }}>
                  {BDAY_MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <input type="number" min={1} max={31} value={newBday.day} onChange={e => setNewBday(b => ({ ...b, day: Number(e.target.value) }))}
                  style={{ width: 44, padding: "5px 4px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 11, textAlign: "center" }} />
                <button onClick={addBirthday} disabled={!newBday.name.trim()}
                  style={{ padding: "5px 10px", borderRadius: 6, border: "none",
                    background: newBday.name.trim() ? "#1f2937" : "#e5e7eb",
                    color: newBday.name.trim() ? "white" : "#9ca3af",
                    fontSize: 11, fontWeight: "bold", cursor: newBday.name.trim() ? "pointer" : "not-allowed" }}>+</button>
              </div>
            </div>
          </div>
        )}

        {/* No children state */}
        {profiles.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>👶</div>
            Click "+ Add Child" above to get started!
          </div>
        )}

        {/* Month/Day controls */}
        <div style={{ background: "white", border: "2px solid #e5e7eb", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 3 }}>MONTH</div>
            <select value={month} onChange={e => { setMonth(Number(e.target.value)); setDay(1); }}
              style={{ padding: "5px 8px", borderRadius: 6, border: "2px solid #e5e7eb", fontSize: 13 }}>
              {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 3 }}>DAY</div>
            <select value={day} onChange={e => setDay(Number(e.target.value))}
              style={{ padding: "5px 8px", borderRadius: 6, border: "2px solid #e5e7eb", fontSize: 13 }}>
              {Array.from({ length: daysInMonth }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, fontSize: 11, color: "#6b7280", textAlign: "right" }}>
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
            <p style={{ marginTop: 14, fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
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
  const [view, setView] = useState<"landing" | "workbook">("landing");
  return view === "landing"
    ? <TestLandingPage onSwitch={() => setView("workbook")} />
    : <TestWorkbook onSwitch={() => setView("landing")} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestApp />
  </StrictMode>,
);
