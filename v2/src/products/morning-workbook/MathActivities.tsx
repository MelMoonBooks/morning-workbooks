import React from 'react';
import { SvgObject, WriteBox, Penny, seasonalObject, LABEL_STYLE, NUMBER_PATHS, type SvgObjectType } from '../../shared/DrawingPrimitives';

// ── Props types ──

interface MathActivityProps {
  day: number;
  month: string;
  age: number;
}

interface DayMonthProps {
  day: number;
  month: string;
}

interface DayProps {
  day: number;
}

// ── CountActivity (ages 3-4) ──

function CountActivity({ day, month }: DayMonthProps) {
  const obj = seasonalObject(month, day) as SvgObjectType;
  const count = (day % 5) + 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Count and write the number</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          {Array.from({ length: count }, (_, i) => (
            <SvgObject key={i} type={obj} size={58} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ fontSize: 22, color: "#9ca3af" }}>=</div>
          <WriteBox size={52} />
        </div>
      </div>
    </div>
  );
}

// ── CircleActivity (ages 3-4) ──

function CircleActivity({ day, month }: DayMonthProps) {
  const obj = seasonalObject(month, day) as SvgObjectType;
  const task = day % 2 === 0 ? "smallest" : "biggest";
  const rowSizes = [[36, 58, 46], [52, 36, 60], [60, 44, 38]];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Circle the {task} in each row</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
        {rowSizes.map((sizes, ri) => (
          <div key={ri} style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly",
            borderBottom: ri < 2 ? "1px dashed #e5e7eb" : "none", paddingBottom: ri < 2 ? 4 : 0 }}>
            {sizes.map((sz, ci) => <SvgObject key={ci} type={obj} size={sz} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ColorNActivity (ages 3-4) ──

function ColorNActivity({ day, month }: DayMonthProps) {
  const obj = seasonalObject(month, day) as SvgObjectType;
  const target = (day % 3) + 2;
  const plural = obj === "fish" ? "fish" : obj + "s";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Color {target} {plural}</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap", gap: 4 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <SvgObject key={i} type={obj} size={54} />
        ))}
      </div>
    </div>
  );
}

// ── CircleLetterActivity (PreK/TK) — "Circle all the A's" ──

function CircleLetterActivity({ day }: DayProps) {
  // Pick a letter of the day from a curated set of early-learning letters
  const targetLetters = "ABCDEFGHIJKLMNOPRSTUVW";
  const target = targetLetters[day % targetLetters.length];
  // Build a grid of 8 letters — make sure target appears 3 times, others fill the rest
  const distractors = targetLetters.split("").filter(c => c !== target);
  const distractorPicks: string[] = [];
  let cursor = (day * 5) % distractors.length;
  while (distractorPicks.length < 5) {
    distractorPicks.push(distractors[cursor % distractors.length]);
    cursor++;
  }
  const grid: string[] = [target, distractorPicks[0], target, distractorPicks[1], distractorPicks[2], target, distractorPicks[3], distractorPicks[4]];
  // Slight shuffle based on day so the target positions vary
  const startIdx = day % grid.length;
  const shuffled = [...grid.slice(startIdx), ...grid.slice(0, startIdx)];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Circle all the {target}'s</div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: 6, padding: "6px 8px" }}>
        {shuffled.map((c, i) => (
          <div key={i} style={{
            border: "1.5px solid #d1d5db", borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: "bold", color: "#1f2937",
          }}>{c}</div>
        ))}
      </div>
    </div>
  );
}

// ── BeginningSoundActivityPK (PreK/TK) — picture + 2 letter choices ──

function BeginningSoundActivityPK({ day, month }: DayMonthProps) {
  const obj = seasonalObject(month, day) as SvgObjectType;
  const firstLetterMap: Record<string, string> = {
    apple: "A", star: "S", fish: "F", sun: "S", heart: "H",
    flower: "F", moon: "M", cloud: "C", pumpkin: "P", bell: "B", diya: "D",
  };
  const correctLetter = firstLetterMap[obj] ?? obj[0].toUpperCase();
  // One distractor only (PreK is simpler — 2 choices instead of 3)
  const alphabet = "BCDFGHJKLMNPRSTVW";
  let distractor = alphabet[(day * 3) % alphabet.length];
  if (distractor === correctLetter) distractor = alphabet[(day * 3 + 1) % alphabet.length];
  // Alternate position of correct answer day-by-day
  const ordered = day % 2 === 0 ? [correctLetter, distractor] : [distractor, correctLetter];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>What sound does it start with?</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <div style={{ border: "1.5px solid #d1d5db", borderRadius: 6, padding: 6 }}>
          <SvgObject type={obj} size={56} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ordered.map((ltr, i) => (
            <div key={i} style={{
              width: 40, height: 40, border: "2px solid #1f2937",
              borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: "bold", color: "#1f2937",
            }}>{ltr}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── WeatherChartActivity (PreK/TK) — circle today's weather ──

function WeatherChartActivity({ day, month }: DayMonthProps) {
  // 4 weather options — kids look outside and circle the matching one
  const SunIcon = ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="6" fill="none" stroke="#1f2937" strokeWidth="2" />
      {[0,45,90,135,180,225,270,315].map(a => {
        const rad = a * Math.PI / 180;
        const x1 = 16 + Math.cos(rad) * 9, y1 = 16 + Math.sin(rad) * 9;
        const x2 = 16 + Math.cos(rad) * 13, y2 = 16 + Math.sin(rad) * 13;
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />;
      })}
    </svg>
  );
  const CloudIcon = ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path d="M 8 20 Q 4 20 4 15 Q 4 11 9 11 Q 10 6 16 7 Q 21 7 22 12 Q 28 12 28 17 Q 28 21 24 21 L 8 21 Z" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
  const RainIcon = ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path d="M 8 14 Q 4 14 4 10 Q 4 6 9 6 Q 10 2 16 3 Q 21 3 22 8 Q 28 8 28 12 Q 28 16 24 16 L 8 16 Z" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round" />
      <line x1="10" y1="20" x2="9" y2="26" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="20" x2="15" y2="26" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="20" x2="21" y2="26" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  const SnowIcon = ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <line x1="16" y1="4" x2="16" y2="28" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="16" x2="28" y2="16" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="7" x2="25" y2="25" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="7" x2="7" y2="25" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  // Show 3 most likely options based on season (no snow in summer, etc.)
  const monthNum = ["january","february","march","april","may","june","july","august","september","october","november","december"].indexOf(month.toLowerCase()) + 1;
  const isWinter = monthNum === 12 || monthNum === 1 || monthNum === 2;
  const options: { label: string; Icon: typeof SunIcon }[] = isWinter
    ? [{ label: "snowy", Icon: SnowIcon }, { label: "cloudy", Icon: CloudIcon }, { label: "sunny", Icon: SunIcon }]
    : [{ label: "sunny", Icon: SunIcon }, { label: "cloudy", Icon: CloudIcon }, { label: "rainy", Icon: RainIcon }];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Circle today's weather</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "4px 8px" }}>
        {options.map((opt, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <opt.Icon size={40} />
            <div style={{ fontSize: 11, color: "#374151" }}>{opt.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FeelingsActivity (PreK/TK) — how do you feel today? ──

function FeelingsActivity(_: DayProps) {
  // Simple SVG faces — print-friendly black & white
  const Face = ({ emotion, size = 44 }: { emotion: "happy"|"sad"|"sleepy"|"excited"; size?: number }) => {
    const stroke = "#1f2937";
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="13" fill="none" stroke={stroke} strokeWidth="2" />
        {emotion === "happy" && (
          <>
            <circle cx="11" cy="13" r="1.5" fill={stroke} />
            <circle cx="21" cy="13" r="1.5" fill={stroke} />
            <path d="M 10 19 Q 16 24 22 19" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {emotion === "sad" && (
          <>
            <circle cx="11" cy="13" r="1.5" fill={stroke} />
            <circle cx="21" cy="13" r="1.5" fill={stroke} />
            <path d="M 10 22 Q 16 17 22 22" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {emotion === "sleepy" && (
          <>
            <path d="M 9 13 L 13 13" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
            <path d="M 19 13 L 23 13" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
            <line x1="13" y1="21" x2="19" y2="21" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {emotion === "excited" && (
          <>
            <circle cx="11" cy="13" r="1.5" fill={stroke} />
            <circle cx="21" cy="13" r="1.5" fill={stroke} />
            <ellipse cx="16" cy="21" rx="4" ry="3" fill="none" stroke={stroke} strokeWidth="2" />
          </>
        )}
      </svg>
    );
  };

  const emotions: ("happy"|"sad"|"sleepy"|"excited")[] = ["happy","sad","sleepy","excited"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>How do you feel today?</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "4px 6px" }}>
        {emotions.map(e => (
          <div key={e} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Face emotion={e} size={44} />
            <div style={{ fontSize: 10, color: "#374151" }}>{e}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AdditionActivity (ages 5-6) ──

function AdditionActivity({ day, month }: DayMonthProps) {
  const addPairs: [number, number][] = [
    [1,1],[2,1],[1,2],[2,2],[3,1],[1,3],[2,3],[3,2],[4,1],[1,4],[3,3],[4,2],[2,4],
  ];
  const [a, b] = addPairs[day % addPairs.length];
  const objA = seasonalObject(month, day) as SvgObjectType;
  const objB = seasonalObject(month, day + 2) as SvgObjectType;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>How many altogether?</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, padding: "6px 10px", border: "1.5px solid #d1d5db", borderRadius: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "center", maxWidth: 160 }}>
          {Array.from({ length: a }, (_, i) => <SvgObject key={i} type={objA} size={48} />)}
        </div>
        <div style={{ fontSize: 26, color: "#374151", fontWeight: "bold" }}>+</div>
        <div style={{ display: "flex", gap: 6, padding: "6px 10px", border: "1.5px solid #d1d5db", borderRadius: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "center", maxWidth: 160 }}>
          {Array.from({ length: b }, (_, i) => <SvgObject key={i} type={objB} size={48} />)}
        </div>
        <div style={{ fontSize: 26, color: "#374151", fontWeight: "bold" }}>=</div>
        <WriteBox size={50} />
      </div>
    </div>
  );
}

// ── SubtractionActivity (ages 5-6) ──

function SubtractionActivity({ day, month }: DayMonthProps) {
  const subPairs: [number, number][] = [
    [3,1],[4,1],[4,2],[5,1],[5,2],[5,3],[6,2],[6,3],[7,3],[7,4],
  ];
  const [total, remove] = subPairs[day % subPairs.length];
  const obj = seasonalObject(month, day) as SvgObjectType;
  const sz = 50;
  const xSz = sz + 8;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Cross out {remove} — how many are left?</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ position: "relative", display: "inline-flex" }}>
            <SvgObject type={obj} size={sz} />
            {i < remove && (
              <svg style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                width={xSz} height={xSz} viewBox={`0 0 ${xSz} ${xSz}`}>
                <line x1="8" y1="8" x2={xSz - 8} y2={xSz - 8} stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
                <line x1={xSz - 8} y1="8" x2="8" y2={xSz - 8} stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
          <div style={{ fontSize: 26, color: "#374151", fontWeight: "bold" }}>=</div>
          <WriteBox size={50} />
        </div>
      </div>
    </div>
  );
}

// ── BeforeAfterActivity (ages 5-6) ──

function BeforeAfterActivity({ day }: DayProps) {
  const n = (day % 8) + 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>What comes before and after?</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 9, color: "#9ca3af" }}>before</div>
          <WriteBox size={46} />
        </div>
        <div style={{ fontSize: 30, fontWeight: "bold", color: "#1f2937",
          border: "2px solid #1f2937", borderRadius: 8, width: 52, height: 60,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          {n}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 9, color: "#9ca3af" }}>after</div>
          <WriteBox size={46} />
        </div>
      </div>
    </div>
  );
}

// ── TallerShorterActivity (ages 5-6) ──

function TallerShorterActivity({ day, month }: DayMonthProps) {
  const task = day % 2 === 0 ? "taller" : "shorter";
  const obj = seasonalObject(month, day) as SvgObjectType;
  const sizeA = day % 2 === 0 ? 72 : 42;
  const sizeB = day % 2 === 0 ? 40 : 68;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Circle the {task} one</div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 60, paddingBottom: 8 }}>
        <SvgObject type={obj} size={sizeA} />
        <SvgObject type={obj} size={sizeB} />
      </div>
    </div>
  );
}

// ── PenniesActivity (ages 5-6) ──

function PenniesActivity({ day }: DayProps) {
  const counts = [3,5,4,7,6,8,3,10,5,9,4,6,8,3,7,5,10,4,6,9,3,8,5,7,4,10,6,3,9,5,8];
  const count = counts[(day - 1) % counts.length];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Count the pennies</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
        {Array.from({ length: count }, (_, i) => (
          <Penny key={i} size={44} />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
          <div style={{ fontSize: 22, color: "#9ca3af" }}>=</div>
          <WriteBox size={50} />
          <div style={{ fontSize: 13, color: "#374151" }}>&cent;</div>
        </div>
      </div>
    </div>
  );
}

// ── WriteNumberActivity (ages 5-6) ──

function WriteNumberActivity({ day }: DayProps) {
  const n = (day % 10) + 1;
  const path = NUMBER_PATHS[n];
  const size = 64;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Write the number {n}</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        {/* Trace it */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 9, color: "#9ca3af" }}>trace</div>
          <svg width={size} height={size} viewBox="0 0 32 44"
            style={{ border: "1px dashed #e5e7eb", borderRadius: 4 }}>
            <line x1="0" y1="2" x2="32" y2="2" stroke="#e5e7eb" strokeWidth="0.8" />
            <line x1="0" y1="22" x2="32" y2="22" stroke="#e5e7eb" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="0" y1="42" x2="32" y2="42" stroke="#e5e7eb" strokeWidth="0.8" />
            {path && <path d={path} fill="none" stroke="#b0b0b0" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />}
          </svg>
        </div>
        {/* Write it twice */}
        {[1, 2].map(i => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 9, color: "#9ca3af" }}>write</div>
            <svg width={size} height={size} viewBox="0 0 32 44"
              style={{ border: "1px dashed #e5e7eb", borderRadius: 4 }}>
              <line x1="0" y1="2" x2="32" y2="2" stroke="#e5e7eb" strokeWidth="0.8" />
              <line x1="0" y1="22" x2="32" y2="22" stroke="#e5e7eb" strokeWidth="0.6" strokeDasharray="3 3" />
              <line x1="0" y1="42" x2="32" y2="42" stroke="#e5e7eb" strokeWidth="0.8" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// More advanced K activities — literacy + cognitive, more end-of-year level.
// Designed to appear in two-box pairings with existing math activities.
// ══════════════════════════════════════════════════════════════════════

// ── PatternActivity (K) — "What comes next?" ──

function PatternActivity({ day }: DayProps) {
  // Each entry: [shape sequence as letters, label, missing index]
  // Shapes: O = circle, T = triangle, S = square
  const patterns = [
    { seq: ["O","T","O","T","O","T"], missingIdx: 5 },        // AB pattern, 6 items
    { seq: ["S","S","O","S","S","O"], missingIdx: 5 },        // AAB pattern
    { seq: ["O","T","S","O","T","S"], missingIdx: 5 },        // ABC pattern
    { seq: ["T","O","O","T","O","O"], missingIdx: 5 },        // ABB pattern
    { seq: ["S","O","T","S","O","T"], missingIdx: 5 },        // ABC pattern
    { seq: ["O","O","T","O","O","T"], missingIdx: 5 },        // AAB pattern
  ];
  const p = patterns[day % patterns.length];

  const Shape = ({ s, dashed }: { s: string; dashed?: boolean }) => {
    const sz = 26;
    const stroke = "#1f2937";
    if (dashed) {
      return (
        <div style={{
          width: sz, height: sz, border: `2px dashed ${stroke}`,
          borderRadius: 3, flexShrink: 0,
        }} />
      );
    }
    if (s === "O") return <div style={{ width: sz, height: sz, borderRadius: "50%", background: stroke, flexShrink: 0 }} />;
    if (s === "S") return <div style={{ width: sz, height: sz, background: stroke, flexShrink: 0 }} />;
    // Triangle (filled)
    return (
      <svg width={sz} height={sz} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <polygon points="12,3 22,21 2,21" fill={stroke} />
      </svg>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>What comes next?</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
        {p.seq.map((s, i) => (
          <Shape key={i} s={s} dashed={i === p.missingIdx} />
        ))}
      </div>
    </div>
  );
}

// ── TenFrameActivity (K) — "Show the number N" ──

function TenFrameActivity({ day }: DayProps) {
  const n = ((day % 9) + 2); // 2..10
  const cellSize = 24;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Show the number {n}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(5, ${cellSize}px)`, gridTemplateRows: `repeat(2, ${cellSize}px)`, gap: 0 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{
              width: cellSize, height: cellSize,
              border: "1.5px solid #1f2937",
              boxSizing: "border-box",
            }} />
          ))}
        </div>
        <div style={{ fontSize: 10, color: "#6b7280", marginTop: 6 }}>
          Fill in {n} {n === 1 ? "box" : "boxes"}
        </div>
      </div>
    </div>
  );
}

// ── BeginningSoundActivity (K) — "What sound does it start with?" ──

function BeginningSoundActivity({ day, month }: DayMonthProps) {
  // Pick a seasonal object and use its first letter as the answer.
  // Then offer 3 choices including the correct one.
  const obj = seasonalObject(month, day) as SvgObjectType;
  // First-letter map for our seasonal SVG objects (must match SvgObjectType)
  const firstLetterMap: Record<string, string> = {
    apple: "A", star: "S", fish: "F", sun: "S", heart: "H",
    flower: "F", moon: "M", cloud: "C", pumpkin: "P", bell: "B", diya: "D",
  };
  const correctLetter = firstLetterMap[obj] ?? obj[0].toUpperCase();
  // Pick two distractor letters deterministically
  const alphabet = "BCDFGHJKLMNPRSTVW";
  const distractors: string[] = [];
  let cursor = (day * 3) % alphabet.length;
  while (distractors.length < 2) {
    const c = alphabet[cursor % alphabet.length];
    if (c !== correctLetter && !distractors.includes(c)) distractors.push(c);
    cursor++;
  }
  // Shuffle (deterministic) so correct answer isn't always first
  const choices = [correctLetter, distractors[0], distractors[1]];
  const order = day % 3; // 0,1,2 placement of correct answer
  const ordered = [
    choices[order],
    choices[(order + 1) % 3],
    choices[(order + 2) % 3],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>What sound does it start with?</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ border: "1.5px solid #d1d5db", borderRadius: 6, padding: 6 }}>
          <SvgObject type={obj} size={50} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {ordered.map((ltr, i) => (
            <div key={i} style={{
              width: 32, height: 32, border: "1.5px solid #1f2937",
              borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: "bold", color: "#1f2937",
            }}>{ltr}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SightWordSentenceActivity (K) — "I ___ a dog. (see/are/the)" ──

function SightWordSentenceActivity({ day }: DayProps) {
  const sentences: { text: string; blank: string; choices: string[] }[] = [
    { text: "I __ a dog.",      blank: "see",  choices: ["see","are","the"] },
    { text: "The cat __ big.",  blank: "is",   choices: ["is","are","was"] },
    { text: "We __ to school.", blank: "go",   choices: ["go","is","my"] },
    { text: "I __ run fast.",   blank: "can",  choices: ["can","the","is"] },
    { text: "She __ here.",     blank: "is",   choices: ["is","go","the"] },
    { text: "I like __ cat.",   blank: "my",   choices: ["my","go","is"] },
    { text: "We __ playing.",   blank: "are",  choices: ["are","is","my"] },
    { text: "__ sun is bright.",blank: "The",  choices: ["The","Go","My"] },
  ];
  const s = sentences[day % sentences.length];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Fill in the blank</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, paddingLeft: 4 }}>
        <div style={{ fontSize: 16, color: "#1f2937", fontFamily: "Georgia,serif" }}>
          {s.text.split("__").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span style={{ display: "inline-block", borderBottom: "2px solid #1f2937", minWidth: 56, verticalAlign: "bottom", marginBottom: 2 }} />
              )}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {s.choices.map((c, i) => (
            <div key={i} style={{ fontSize: 13, fontWeight: "bold", color: "#1f2937", fontFamily: "Georgia,serif" }}>{c}</div>
          ))}
        </div>
        <div style={{ fontSize: 9, color: "#9ca3af", fontStyle: "italic" }}>Circle the right word</div>
      </div>
    </div>
  );
}

// ── RhymeMatchActivity (K) — "Draw a line to the rhyme" ──

function RhymeMatchActivity({ day }: DayProps) {
  const pools: { left: string[]; right: string[] }[] = [
    { left: ["cat","hop","big"], right: ["pig","hat","top"] },
    { left: ["sun","car","bed"], right: ["red","fun","star"] },
    { left: ["bug","cake","tree"], right: ["bee","rug","lake"] },
    { left: ["king","duck","ball"], right: ["truck","tall","ring"] },
    { left: ["jump","mouse","fox"], right: ["box","house","bump"] },
  ];
  const p = pools[day % pools.length];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Draw a line to the rhyme</div>
      <div style={{ flex: 1, display: "flex", justifyContent: "space-between", paddingTop: 4, paddingBottom: 4, gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", gap: 6 }}>
          {p.left.map((w, i) => (
            <div key={i} style={{ fontSize: 14, fontWeight: "bold", color: "#1f2937", fontFamily: "Georgia,serif" }}>{w}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", gap: 6, textAlign: "right" }}>
          {p.right.map((w, i) => (
            <div key={i} style={{ fontSize: 14, fontWeight: "bold", color: "#1f2937", fontFamily: "Georgia,serif" }}>{w}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── NumberSentenceActivity (K) — "4 + 2 = ___" simple equations ──

function NumberSentenceActivity({ day }: DayProps) {
  // Mix of addition, subtraction, and missing-addend equations
  type Eq = { a: string; op: "+" | "-"; b: string; eq: string };
  const sentences: Eq[] = [
    { a: "4", op: "+", b: "2", eq: "?" },     // 4 + 2 = ?
    { a: "3", op: "+", b: "1", eq: "?" },     // 3 + 1 = ?
    { a: "5", op: "-", b: "2", eq: "?" },     // 5 - 2 = ?
    { a: "6", op: "+", b: "3", eq: "?" },     // 6 + 3 = ?
    { a: "2", op: "+", b: "?", eq: "5" },     // missing addend: 2 + ? = 5
    { a: "7", op: "-", b: "3", eq: "?" },     // 7 - 3 = ?
    { a: "5", op: "+", b: "4", eq: "?" },     // 5 + 4 = ?
    { a: "8", op: "-", b: "2", eq: "?" },     // 8 - 2 = ?
    { a: "?", op: "+", b: "3", eq: "7" },     // missing addend: ? + 3 = 7
    { a: "4", op: "+", b: "4", eq: "?" },     // 4 + 4 = ?
    { a: "9", op: "-", b: "5", eq: "?" },     // 9 - 5 = ?
    { a: "6", op: "-", b: "2", eq: "?" },     // 6 - 2 = ?
  ];
  // Pick two equations per day for a fuller box
  const idx = day % sentences.length;
  const idx2 = (day + 3) % sentences.length;
  const eqs = [sentences[idx], sentences[idx2]];

  // Label adapts to which operations are showing
  const hasAdd = eqs.some(e => e.op === "+");
  const hasSub = eqs.some(e => e.op === "-");
  const label =
    hasAdd && !hasSub ? "Add it up" :
    !hasAdd && hasSub ? "Take it away" :
                        "Solve it";

  const Box = ({ val }: { val: string }) => {
    if (val === "?") {
      return (
        <span style={{
          display: "inline-block", minWidth: 30, height: 30,
          border: "1.5px solid #1f2937", borderRadius: 4,
          margin: "0 2px", verticalAlign: "middle",
        }} />
      );
    }
    return (
      <span style={{ fontSize: 22, fontWeight: "bold", color: "#1f2937", margin: "0 4px" }}>{val}</span>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>{label}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "4px 8px" }}>
        {eqs.map((eq, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <Box val={eq.a} />
            <span style={{ fontSize: 22, fontWeight: "bold", color: "#374151" }}>{eq.op}</span>
            <Box val={eq.b} />
            <span style={{ fontSize: 22, fontWeight: "bold", color: "#374151" }}>=</span>
            <Box val={eq.eq} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DoesntBelongActivity (K) — "Which doesn't belong?" ──

function DoesntBelongActivity({ day }: DayProps) {
  // Groups of 4: 3 match a clear category, 1 doesn't.
  // 15 distinct sets so the same pictures don't repeat for months.
  const groups: { items: SvgObjectType[] }[] = [
    { items: ["apple", "flower", "pumpkin", "fish"] },   // 3 plants/foods + animal
    { items: ["sun", "cloud", "moon", "apple"] },        // 3 sky things + plant
    { items: ["bell", "diya", "star", "fish"] },         // 3 celebration items + animal
    { items: ["sun", "moon", "star", "flower"] },        // 3 sky things + plant
    { items: ["apple", "pumpkin", "flower", "cloud"] },  // 3 nature/garden + sky
    { items: ["fish", "flower", "apple", "bell"] },      // 3 living + non-living
    { items: ["star", "heart", "bell", "fish"] },        // 3 small symbols + animal
    { items: ["moon", "cloud", "star", "pumpkin"] },     // 3 night sky + plant
    { items: ["sun", "cloud", "moon", "fish"] },         // 3 sky + animal
    { items: ["apple", "sun", "pumpkin", "star"] },      // 3 round + spiky
    { items: ["bell", "diya", "heart", "fish"] },        // 3 symbols + animal
    { items: ["flower", "apple", "pumpkin", "moon"] },   // 3 from garden + sky
    { items: ["sun", "moon", "cloud", "heart"] },        // 3 sky + symbol
    { items: ["fish", "apple", "flower", "sun"] },       // 3 earth + sky
    { items: ["diya", "bell", "star", "flower"] },       // 3 celebration + plant
  ];
  // Shuffle index a bit so consecutive appearances on this slot use different groups
  const g = groups[(day * 5 + 1) % groups.length];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={LABEL_STYLE}>Which doesn't belong?</div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: 6, padding: "4px 6px" }}>
        {g.items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #d1d5db", borderRadius: 6 }}>
            <SvgObject type={it} size={42} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Single activity box wrapper ──
function ActivityBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      border: "1.5px solid #d1d5db",
      borderRadius: 6,
      padding: "10px 14px",
      background: "white",
      minHeight: 160,
      flex: 1,
      display: "flex",
      flexDirection: "column",
    }}>
      {children}
    </div>
  );
}

// ── K-grade activity pairings ──
// Each day, kindergarteners get TWO complementary activities side by side.
// We rotate through ~9 different pairings so they don't see the same combo
// repeatedly within a week or two.
type ActivityRenderer = (day: number, month: string) => React.ReactNode;
const A = {
  pattern:           (d: number) => <PatternActivity day={d} />,
  tenFrame:          (d: number) => <TenFrameActivity day={d} />,
  beginningSound:    (d: number, m: string) => <BeginningSoundActivity day={d} month={m} />,
  sightWordSentence: (d: number) => <SightWordSentenceActivity day={d} />,
  rhymeMatch:        (d: number) => <RhymeMatchActivity day={d} />,
  doesntBelong:      (d: number) => <DoesntBelongActivity day={d} />,
  numberSentence:    (d: number) => <NumberSentenceActivity day={d} />,  // abstract "4 + 2 = ?"
  addition:          (d: number, m: string) => <AdditionActivity day={d} month={m} />, // visual addition
  subtraction:       (d: number, m: string) => <SubtractionActivity day={d} month={m} />,
  beforeAfter:       (d: number) => <BeforeAfterActivity day={d} />,
  writeNumber:       (d: number) => <WriteNumberActivity day={d} />,
  pennies:           (d: number) => <PenniesActivity day={d} />,
  tallerShorter:     (d: number, m: string) => <TallerShorterActivity day={d} month={m} />,
} satisfies Record<string, ActivityRenderer>;

const K_PAIRINGS: [ActivityRenderer, ActivityRenderer][] = [
  [A.pattern,            A.numberSentence],      // pattern + simple math sentence
  [A.tenFrame,           A.beginningSound],      // Option B from screenshot
  [A.sightWordSentence,  A.rhymeMatch],          // Option C from screenshot
  [A.doesntBelong,       A.writeNumber],         // categories + write number
  [A.beginningSound,     A.subtraction],
  [A.pattern,            A.addition],            // Option A from screenshot (visual addition)
  [A.rhymeMatch,         A.beforeAfter],
  [A.tenFrame,           A.numberSentence],      // ten frame + simple math sentence
  [A.sightWordSentence,  A.pennies],
  [A.pattern,            A.tallerShorter],       // pattern (was doesntBelong duplicate)
  [A.beginningSound,     A.addition],            // sound + visual addition
  [A.rhymeMatch,         A.numberSentence],      // (was rhyme + tallerShorter)
];

// ── MathActivity (router) ──
// Despite the name, this is the bottom activity area. For K it shows two
// activities side-by-side; for preschool/TK it shows one (simpler activities).

function MathActivity({ day, month, age }: MathActivityProps) {
  // K + 1st grade: two-box layout with rotating literacy + math pairs
  if (age >= 5) {
    const [left, right] = K_PAIRINGS[day % K_PAIRINGS.length];
    return (
      <div style={{ display: "flex", gap: 10 }}>
        <ActivityBox>{left(day, month)}</ActivityBox>
        <ActivityBox>{right(day, month)}</ActivityBox>
      </div>
    );
  }

  // Preschool/TK: single-box layout, rotating across 7 different activities
  // for more daily variety (was 3, now 7).
  const type = day % 7;
  let activity: React.ReactNode;
  switch (type) {
    case 0: activity = <CountActivity day={day} month={month} />; break;
    case 1: activity = <CircleLetterActivity day={day} />; break;
    case 2: activity = <ColorNActivity day={day} month={month} />; break;
    case 3: activity = <BeginningSoundActivityPK day={day} month={month} />; break;
    case 4: activity = <CircleActivity day={day} month={month} />; break;
    case 5: activity = <WeatherChartActivity day={day} month={month} />; break;
    case 6: activity = <FeelingsActivity day={day} />; break;
    default: activity = <CountActivity day={day} month={month} />;
  }

  return (
    <div style={{
      border: "1.5px solid #d1d5db",
      borderRadius: 6,
      padding: "10px 14px",
      background: "white",
      minHeight: 140,
    }}>
      {activity}
    </div>
  );
}

export default MathActivity;
