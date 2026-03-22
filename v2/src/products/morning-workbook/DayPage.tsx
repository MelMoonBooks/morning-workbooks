import React from 'react';
import { getDayContent } from '../../content';
import { Holiday, Affirmation, DayTheme, Birthday } from '../../content/types';
import { RuledLine } from '../../shared/DrawingPrimitives';
import LetterTracing from './LetterTracing';
import ColorActivity from './ColorActivity';
import MathActivity from './MathActivities';

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

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
  region: string;       // e.g. "us"
  age: number;          // 3-6
  birthdays?: Birthday[]; // family birthdays to check
  id?: string;          // DOM id for PDF capture
}

export default function DayPage({ day, month, year, childName, traditions, region, age, birthdays = [], id }: DayPageProps) {
  const content = getDayContent(traditions, region, month, day, year);
  const { theme, holidays, affirmation, dominantTradition } = content;

  const { firstDay, daysInMonth } = getMiniCalendar(month, year);
  const date = new Date(year, month - 1, day);
  const monthName   = MONTH_NAMES[month - 1];
  const dateDisplay = `${DAY_NAMES[date.getDay()]}, ${monthName} ${day}`;
  const lineH       = age <= 4 ? 48 : 40;

  // Build calendar grid cells
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  // Check for birthdays on this day
  const todaysBirthdays = birthdays.filter(b => b.month === month && b.day === day);
  const hasMessages = holidays.length > 0 || todaysBirthdays.length > 0;

  return (
    <div id={id} style={{ width: "100%", background: "white", borderRadius: 4, overflow: "hidden", fontFamily: "Georgia,serif" }}>

      {/* ── Header ── */}
      <div style={{ padding: "12px 20px 10px", borderBottom: "2px solid #1f2937", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: "bold", color: "#1f2937", letterSpacing: 0.3 }}>
          Good Morning, {childName || "Friend"}!
        </div>
      </div>

      {/* ── Name / Date | Calendar ── */}
      <div style={{ padding: "10px 18px 12px", borderBottom: "1.5px solid #d1d5db", display: "flex", alignItems: "stretch", gap: 14 }}>
        {/* Left: name line + date box */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: "bold", color: "#374151", marginBottom: 4 }}>Name</div>
            <RuledLine h={lineH} />
          </div>
          <div style={{ border: "1.5px solid #d1d5db", borderRadius: 6, padding: "6px 10px" }}>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#1f2937", marginBottom: hasMessages ? 4 : 0 }}>
              {dateDisplay}
            </div>
            {holidays.map((h, i) => (
              <div key={i} style={{ fontSize: 11, color: "#374151", fontStyle: "italic", lineHeight: 1.5, marginTop: i > 0 ? 2 : 0 }}>
                {h.sentence}
              </div>
            ))}
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
            region={region}
            imageFile={theme.imageFile}
          />
        </div>
        {/* Bottom: math activity */}
        <MathActivity day={day} month={monthName} age={age} />
      </div>

      {/* ── Footer (affirmation) ── */}
      <div style={{
        borderTop: "2px solid #1f2937", padding: "10px 20px", textAlign: "center",
        minHeight: 58, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 3,
      }}>
        <div style={{ fontSize: 12, color: "#4b5563", fontStyle: "italic", maxWidth: 400 }}>
          &ldquo;{affirmation.quote}&rdquo;
          {affirmation.ref && (
            <span style={{ fontSize: 11, color: "#6b7280", fontStyle: "normal" }}> — {affirmation.ref}</span>
          )}
        </div>
      </div>
    </div>
  );
}
