import React, { useState, useMemo } from 'react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import DayPage from './products/morning-workbook/DayPage';
import { getDayContent, REGIONS } from './content';
import { ColoringBook } from './content/types';

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

// ── Coloring Book Card ──
function BookCard({ book }: { book: ColoringBook }) {
  return (
    <div style={{
      flexShrink: 0, width: 180, border: "1.5px solid #e5e7eb", borderRadius: 12,
      overflow: "hidden", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        height: 120, display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f9fafb", fontSize: 48,
      }}>
        {book.coverImage
          ? <img src={book.coverImage} alt={book.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
          : book.coverEmoji}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: "bold", color: "#1f2937", lineHeight: 1.3 }}>{book.title}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, lineHeight: 1.4 }}>{book.description.slice(0, 60)}…</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#1f2937" }}>${book.price.toFixed(2)}</div>
          {!book.available && (
            <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", background: "#f3f4f6", borderRadius: 4, padding: "2px 8px" }}>
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
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
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter(t => t !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  // Get suggested coloring books based on current selections
  const content = useMemo(() => getDayContent(traditions, region, month, day, year), [traditions, region, month, day, year]);
  const suggestedBooks = content.suggestedColoringBooks;

  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6", fontFamily: "Georgia,serif" }}>

      {/* ── Nav ── */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 24px", borderBottom: "1px solid #e5e7eb", background: "white",
      }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#1f2937" }}>MelMoon Books</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <SignInButton mode="modal">
            <button style={{
              padding: "7px 16px", borderRadius: 8, border: "1.5px solid #d1d5db",
              background: "white", color: "#374151", fontSize: 13, fontWeight: "bold", cursor: "pointer",
            }}>Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={{
              padding: "7px 16px", borderRadius: 8, border: "none",
              background: "#1f2937", color: "white", fontSize: 13, fontWeight: "bold", cursor: "pointer",
            }}>Get Started Free</button>
          </SignUpButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ textAlign: "center", padding: "48px 24px 32px", maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", color: "#1f2937", margin: "0 0 12px", lineHeight: 1.2 }}>
          Morning Workbooks for Little Learners
        </h1>
        <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.6, margin: 0 }}>
          Personalized daily workbooks for ages 3–6 with letter tracing, math, and coloring.
          Choose your family's faith traditions — Christian, Hindu, Jewish, Muslim, or non-religious — and every page reflects what matters to you.
        </p>
      </section>

      {/* ── Interactive Preview Controls ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 16px" }}>
        <div style={{
          background: "white", borderRadius: 12, border: "1.5px solid #e5e7eb",
          padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: "#374151", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Customize the preview
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 12, fontStyle: "italic" }}>
            Try different combinations — nothing is saved until you create a free account.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {/* Child name */}
            <div style={{ flex: "1 1 160px" }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>CHILD'S NAME</div>
              <input value={childName} onChange={e => setChildName(e.target.value)}
                placeholder="e.g. Asha"
                style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: "1.5px solid #e5e7eb", fontSize: 13, boxSizing: "border-box", fontFamily: "Georgia,serif" }} />
            </div>
            {/* Age */}
            <div style={{ flex: "0 0 auto" }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>AGE</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[3,4,5,6].map(a => (
                  <button key={a} onClick={() => setAge(a)}
                    style={{ width: 36, height: 32, borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold",
                      border: `1.5px solid ${age === a ? "#1f2937" : "#e5e7eb"}`,
                      background: age === a ? "#1f2937" : "white",
                      color: age === a ? "white" : "#374151" }}>{a}</button>
                ))}
              </div>
            </div>
            {/* Month */}
            <div style={{ flex: "0 0 auto" }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>MONTH</div>
              <select value={month} onChange={e => { setMonth(Number(e.target.value)); setDay(1); }}
                style={{ padding: "6px 8px", borderRadius: 7, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: "Georgia,serif" }}>
                {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            {/* Day */}
            <div style={{ flex: "0 0 auto" }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>DAY</div>
              <select value={day} onChange={e => setDay(Number(e.target.value))}
                style={{ padding: "6px 8px", borderRadius: 7, border: "1.5px solid #e5e7eb", fontSize: 13 }}>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            {/* Region */}
            <div style={{ flex: "0 0 auto" }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>REGION</div>
              <div style={{ display: "flex", gap: 4 }}>
                {REGIONS.map(r => (
                  <button key={r.id} onClick={() => setRegion(r.id)}
                    style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                      border: `1.5px solid ${region === r.id ? "#1f2937" : "#e5e7eb"}`,
                      background: region === r.id ? "#1f2937" : "white",
                      color: region === r.id ? "white" : "#374151" }}>{r.flag} {r.label}</button>
                ))}
              </div>
            </div>
          </div>
          {/* Traditions (multi-select) */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>
              FAITH TRADITIONS <span style={{ fontWeight: "normal", color: "#9ca3af" }}>(select up to 3 — they alternate daily)</span>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TRADITIONS.map(t => {
                const selected = traditions.includes(t.id);
                return (
                  <button key={t.id} onClick={() => toggleTradition(t.id)}
                    style={{ padding: "6px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: "bold",
                      border: `2px solid ${selected ? "#1f2937" : "#e5e7eb"}`,
                      background: selected ? "#1f2937" : "white",
                      color: selected ? "white" : "#374151" }}>{t.label}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Real DayPage Preview ── */}
        <div style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
          <DayPage
            day={day}
            month={month}
            year={year}
            childName={childName}
            traditions={traditions}
            region={region}
            age={age}
          />
        </div>

        {/* Locked actions tooltip */}
        <div style={{
          textAlign: "center", padding: "16px 0", fontSize: 12, color: "#6b7280",
        }}>
          PDF download and printed book ordering require a free account.{" "}
          <SignUpButton mode="modal">
            <button style={{ background: "none", border: "none", color: "#1f2937", fontWeight: "bold", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>
              Sign up free
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* ── Coloring Book Carousel ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 32px" }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#1f2937", marginBottom: 4 }}>
          Coloring Books
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
          Themed coloring books that match your family's traditions. Change traditions above to see different suggestions!
        </div>
        {suggestedBooks.length > 0 ? (
          <div style={{
            display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8,
            scrollSnapType: "x mandatory",
          }}>
            {suggestedBooks.map(book => (
              <div key={book.id} style={{ scrollSnapAlign: "start" }}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#9ca3af", fontSize: 13 }}>
            No coloring books match the current selection yet. More coming soon!
          </div>
        )}
      </section>

      {/* ── Pricing ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: "bold", color: "#1f2937" }}>Simple Pricing</div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Start free. Upgrade when you're ready.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { name: "Free",             price: "$0",        detail: "Preview app, save profiles" },
            { name: "PDF Download",     price: "$2.99",     detail: "One month's PDF" },
            { name: "PDF Subscription", price: "$4.99/mo",  detail: "Current month auto-unlocked" },
            { name: "1 Printed Book",   price: "$24.99",    detail: "One month, printed & shipped" },
            { name: "3 Printed Books",  price: "$59.99",    detail: "Save $15" },
            { name: "12 Printed Books", price: "$199.99",   detail: "Full year, save $100" },
          ].map(tier => (
            <div key={tier.name} style={{
              border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 20,
              background: "white", textAlign: "center",
            }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#374151", marginBottom: 4 }}>{tier.name}</div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: "#1f2937", marginBottom: 4 }}>{tier.price}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{tier.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign: "center", padding: "32px 24px 48px" }}>
        <SignUpButton mode="modal">
          <button style={{
            padding: "14px 36px", borderRadius: 10, border: "none",
            background: "#1f2937", color: "white", fontSize: 16, fontWeight: "bold", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            Create Free Account
          </button>
        </SignUpButton>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>No credit card required</div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "16px 24px", textAlign: "center", fontSize: 11, color: "#9ca3af" }}>
        MelMoon Books · melmoonbooks.com
      </footer>
    </div>
  );
}
