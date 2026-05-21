import React from 'react';

// ── Letter tracing SVG paths ──
// Each letter maps to an SVG path string in a 40-wide viewBox
export const LETTER_PATHS: Record<string, string> = {
  A:"M4 54 L20 4 L36 54 M10 34 H30", B:"M8 4 V54 M8 4 Q32 4 32 17 Q32 29 8 29 M8 29 Q34 29 34 42 Q34 54 8 54",
  C:"M34 12 Q20 2 6 14 Q-2 24 6 44 Q14 56 34 48", D:"M8 4 V54 M8 4 Q38 4 38 29 Q38 54 8 54",
  E:"M32 4 H8 V54 H32 M8 29 H26", F:"M32 4 H8 V54 M8 29 H26",
  G:"M34 12 Q20 2 6 14 Q-2 26 6 42 Q14 56 30 54 H36 V29 H22", H:"M8 4 V54 M32 4 V54 M8 29 H32",
  I:"M14 4 H26 M20 4 V54 M14 54 H26", J:"M14 4 H26 M22 4 V46 Q22 56 10 54",
  K:"M8 4 V54 M32 4 L8 29 L32 54", L:"M8 4 V54 H32", M:"M4 54 V4 L20 28 L36 4 V54",
  N:"M8 54 V4 L32 54 V4", O:"M20 4 Q36 4 36 29 Q36 54 20 54 Q4 54 4 29 Q4 4 20 4Z",
  P:"M8 4 V54 M8 4 Q34 4 34 17 Q34 30 8 30", Q:"M20 4 Q36 4 36 29 Q36 52 20 54 Q4 54 4 29 Q4 4 20 4Z M28 44 L36 54",
  R:"M8 4 V54 M8 4 Q34 4 34 17 Q34 30 8 30 L32 54", S:"M32 10 Q20 2 8 12 Q2 22 16 28 Q32 34 32 44 Q28 56 16 54 Q8 52 6 46",
  T:"M4 4 H36 M20 4 V54", U:"M8 4 V40 Q8 56 20 56 Q32 56 32 40 V4",
  V:"M4 4 L20 54 L36 4", W:"M4 4 L12 54 L20 32 L28 54 L36 4",
  X:"M6 4 L34 54 M34 4 L6 54", Y:"M4 4 L20 30 L36 4 M20 30 V54", Z:"M4 4 H36 L4 54 H36",
  a:"M30 28 Q30 54 14 54 Q4 54 4 42 Q4 30 16 29 Q22 28 30 28 M30 28 V54",
  b:"M8 2 V54 M8 38 Q8 28 18 28 Q30 28 30 41 Q30 54 18 54 Q8 54 8 41",
  c:"M30 32 Q22 26 12 30 Q4 36 6 46 Q10 56 20 54 Q28 52 30 46",
  d:"M32 2 V54 M32 38 Q32 28 22 28 Q10 28 10 41 Q10 54 22 54 Q32 54 32 41",
  e:"M6 40 H30 Q30 28 18 28 Q6 28 6 41 Q6 54 18 54 Q28 54 30 48",
  f:"M28 8 Q16 4 14 14 V54 M8 28 H22",
  g:"M30 28 Q30 54 14 54 Q4 54 4 42 Q4 30 14 28 Q22 26 30 28 M30 28 V60 Q30 68 18 68 Q10 68 8 62",
  h:"M8 2 V54 M8 38 Q8 28 20 28 Q30 28 30 38 V54",
  i:"M20 28 V54 M20 18 Q20 16 20 14", j:"M20 28 V58 Q20 68 10 66 M20 18 Q20 16 20 14",
  k:"M8 2 V54 M28 28 L8 41 L28 54", l:"M14 2 Q16 2 20 4 V50 Q20 54 24 54",
  m:"M6 28 V54 M6 36 Q6 28 16 28 Q24 28 24 36 V54 M24 36 Q24 28 32 28 Q40 28 40 36 V54",
  n:"M8 28 V54 M8 38 Q8 28 20 28 Q30 28 30 38 V54",
  o:"M18 28 Q6 28 6 41 Q6 54 18 54 Q30 54 30 41 Q30 28 18 28Z",
  p:"M8 28 V66 M8 38 Q8 28 18 28 Q30 28 30 41 Q30 54 18 54 Q8 54 8 41",
  q:"M32 28 V66 M32 38 Q32 28 22 28 Q10 28 10 41 Q10 54 22 54 Q32 54 32 41",
  r:"M8 28 V54 M8 36 Q10 28 20 28 Q26 28 28 32",
  s:"M28 32 Q22 26 12 30 Q6 34 12 40 Q20 46 26 50 Q30 56 18 54 Q10 52 8 48",
  t:"M20 10 V54 Q20 56 26 54 M10 28 H28",
  u:"M8 28 V46 Q8 56 20 54 Q30 52 30 44 V28 M30 44 V54",
  v:"M6 28 L20 54 L34 28", w:"M4 28 L12 54 L20 40 L28 54 L36 28",
  x:"M8 28 L30 54 M30 28 L8 54", y:"M8 28 L20 48 M32 28 L16 60 Q12 66 6 64",
  z:"M8 28 H30 L8 54 H30", " ":"",
};

// Letters whose paths extend below y=54 (descenders)
const DESCENDERS = new Set(["g","j","p","q","y"]);

// ── Number tracing SVG paths (1-10) ──
export const NUMBER_PATHS: Record<number, string> = {
  1:"M16 8 L16 36",
  2:"M8 12 Q8 6 16 6 Q24 6 24 14 Q24 20 8 28 L8 36 L24 36",
  3:"M8 8 Q16 4 22 10 Q26 16 18 22 Q26 28 22 34 Q16 38 8 34",
  4:"M20 6 L8 24 L26 24 M20 6 L20 36",
  5:"M22 6 L10 6 L9 18 Q14 14 20 16 Q28 18 28 26 Q28 36 18 36 Q10 36 8 30",
  6:"M22 6 Q10 6 8 18 Q6 30 14 34 Q22 38 26 30 Q30 22 20 18 Q12 16 10 22",
  7:"M8 6 L24 6 L12 36",
  8:"M16 22 Q8 18 8 12 Q8 6 16 6 Q24 6 24 12 Q24 18 16 22 Q8 26 8 32 Q8 38 16 38 Q24 38 24 32 Q24 26 16 22",
  9:"M24 14 Q24 6 16 6 Q8 6 8 14 Q8 22 16 22 Q24 22 24 14 Q24 28 20 34 Q16 38 10 36",
  10:"M6 8 L6 36 M14 6 Q22 6 24 14 L24 28 Q24 36 16 36 Q8 36 8 28 L8 14 Q8 6 16 6",
};

// ── Seasonal object pools per month ──
export const SEASONAL_OBJECTS: Record<string, string[]> = {
  January:   ["cloud","moon","star","fish","heart"],
  February:  ["heart","flower","star","sun","fish"],
  March:     ["flower","fish","sun","apple","cloud"],
  April:     ["flower","cloud","sun","apple","fish"],
  May:       ["flower","sun","apple","fish","heart"],
  June:      ["fish","sun","flower","star","cloud"],
  July:      ["star","sun","fish","flower","heart"],
  August:    ["sun","apple","flower","fish","cloud"],
  September: ["apple","moon","flower","cloud","star"],
  October:   ["pumpkin","moon","apple","diya","star"],
  November:  ["apple","moon","star","cloud","heart"],
  December:  ["star","bell","heart","moon","cloud"],
};

export function seasonalObject(month: string, offset = 0): string {
  const pool = SEASONAL_OBJECTS[month] || SEASONAL_OBJECTS.December;
  return pool[offset % pool.length];
}

// ── Shared label style ──
export const LABEL_STYLE: React.CSSProperties = {
  fontSize: 10,
  fontWeight: "bold",
  color: "#374151",
  textTransform: "uppercase",
  letterSpacing: 0.8,
  marginBottom: 6,
};

// ── RuledLine ──
// A 3-line ruled area (top, dashed middle, bottom) for handwriting
export function RuledLine({ h = 44 }: { h?: number }) {
  return (
    <svg width="100%" height={h} style={{ display: "block", overflow: "visible" }}>
      <line x1="0" y1="1"     x2="100%" y2="1"     stroke="#9ca3af" strokeWidth="1.4" />
      <line x1="0" y1={h / 2} x2="100%" y2={h / 2} stroke="#c4b5a0" strokeWidth="1" strokeDasharray="6 4" />
      <line x1="0" y1={h - 1} x2="100%" y2={h - 1} stroke="#9ca3af" strokeWidth="1.4" />
    </svg>
  );
}

// ── TraceLetter ──
// Renders a single letter as a dashed SVG trace path
export function TraceLetter({ char, size = 36 }: { char: string; size?: number }) {
  const path     = LETTER_PATHS[char] ?? LETTER_PATHS[char.toUpperCase()] ?? "";
  const hasDesc  = DESCENDERS.has(char);
  const vbHeight = hasDesc ? 72 : 56;
  const h        = Math.round(size * (vbHeight / 40));
  return (
    <svg width={size} height={h} viewBox={`0 0 40 ${vbHeight}`} style={{ display: "block" }}>
      <line x1="0" y1="2"  x2="40" y2="2"  stroke="#d1d5db" strokeWidth="1" />
      <line x1="0" y1="28" x2="40" y2="28" stroke="#d1d5db" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1="0" y1="54" x2="40" y2="54" stroke="#d1d5db" strokeWidth="1" />
      {path && (
        <path d={path} fill="none" stroke="#b0b0b0" strokeWidth="2.8"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5" />
      )}
    </svg>
  );
}

// ── TraceRow ──
// Renders a row of traced letters for a word. `flexWrap: "nowrap"` prevents
// long words like "caterpillar" from breaking to a second line — the
// LetterTracing parent scales `size` down for long words so they still fit.
export function TraceRow({ text, size = 34, gap = 3 }: { text: string; size?: number; gap?: number }) {
  return (
    <div style={{ display: "flex", gap, flexWrap: "nowrap", justifyContent: "flex-start" }}>
      {text.split("").map((c, i) => <TraceLetter key={i} char={c} size={size} />)}
    </div>
  );
}

// ── WriteBox ──
// An empty dashed box for the child to write in
export function WriteBox({ size = 40 }: { size?: number }) {
  const h = Math.round(size * 1.4);
  return (
    <svg width={size} height={h} viewBox="0 0 40 56" style={{ display: "block" }}>
      <rect x="1" y="1" width="38" height="54" rx="3"
        fill="none" stroke="#d1d5db" strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1="4" y1="2"  x2="36" y2="2"  stroke="#d1d5db" strokeWidth="0.8" />
      <line x1="4" y1="28" x2="36" y2="28" stroke="#d1d5db" strokeWidth="0.6" strokeDasharray="3 3" />
      <line x1="4" y1="54" x2="36" y2="54" stroke="#d1d5db" strokeWidth="0.8" />
    </svg>
  );
}

// ── SvgObject ──
// Simple black-and-white SVG illustrations for math activities
export type SvgObjectType = "apple" | "star" | "fish" | "sun" | "heart" | "flower" | "moon" | "cloud" | "pumpkin" | "bell" | "diya";

export function SvgObject({ type, size = 36 }: { type: SvgObjectType; size?: number }) {
  const shapes: Record<string, React.ReactNode> = {
    apple: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10 Q10 10 8 20 Q6 32 12 38 Q15 42 18 42 Q21 42 24 38 Q30 32 28 20 Q26 10 18 10Z"/>
        <path d="M18 10 Q18 6 22 4"/><path d="M18 10 Q16 7 14 8"/>
      </g>
    ),
    star: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22,6 25,16 36,16 27,22 30,32 22,26 14,32 17,22 8,16 19,16"/>
      </g>
    ),
    fish: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 22 Q18 14 30 22 Q18 30 10 22Z"/>
        <path d="M10 22 L4 16 L4 28 Z"/>
        <circle cx="26" cy="21" r="1.5" fill="#1f2937"/>
      </g>
    ),
    sun: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <circle cx="22" cy="22" r="7"/>
        {[0,45,90,135,180,225,270,315].map((a, i) => {
          const rad = a * Math.PI / 180;
          return <line key={i} x1={22 + 10 * Math.cos(rad)} y1={22 + 10 * Math.sin(rad)}
            x2={22 + 13 * Math.cos(rad)} y2={22 + 13 * Math.sin(rad)} />;
        })}
      </g>
    ),
    heart: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 34 Q10 26 10 18 Q10 12 16 12 Q19 12 22 16 Q25 12 28 12 Q34 12 34 18 Q34 26 22 34Z"/>
      </g>
    ),
    flower: (
      <g stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <circle cx="22" cy="22" r="4"/>
        {[0,60,120,180,240,300].map((a, i) => {
          const r = Math.PI * a / 180;
          const cx = 22 + 8 * Math.cos(r);
          const cy = 22 + 8 * Math.sin(r);
          return <ellipse key={i} cx={cx} cy={cy} rx="4" ry="3" transform={`rotate(${a},${cx},${cy})`} />;
        })}
        <line x1="22" y1="26" x2="22" y2="38"/>
      </g>
    ),
    moon: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M28 12 Q16 14 14 22 Q12 30 20 36 Q30 38 34 28 Q26 28 24 22 Q22 16 28 12Z"/>
      </g>
    ),
    cloud: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 28 Q8 28 8 24 Q8 20 12 20 Q12 14 18 14 Q22 14 24 18 Q26 16 30 18 Q34 18 34 22 Q36 22 36 26 Q36 30 32 30 L12 30 Q10 30 10 28Z"/>
      </g>
    ),
    pumpkin: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10 Q22 6 26 6"/>
        <path d="M14 14 Q8 14 8 22 Q8 32 14 34 Q18 36 22 34 Q26 36 30 34 Q36 32 36 22 Q36 14 30 14 Q26 14 22 16 Q18 14 14 14Z"/>
        <line x1="22" y1="14" x2="22" y2="34"/>
        <path d="M14 20 Q12 26 14 30" strokeWidth="1"/>
        <path d="M30 20 Q32 26 30 30" strokeWidth="1"/>
      </g>
    ),
    bell: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 8 Q22 10 22 12 Q14 14 12 22 L12 30 L32 30 L32 22 Q30 14 22 12"/>
        <path d="M10 30 L34 30"/>
        <path d="M19 30 Q19 34 22 34 Q25 34 25 30"/>
        <circle cx="22" cy="8" r="2"/>
      </g>
    ),
    diya: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 28 Q10 22 22 22 Q34 22 34 28 Q34 34 22 36 Q10 34 10 28Z"/>
        <path d="M22 22 L22 16"/>
        <path d="M20 14 Q22 10 24 14 Q22 16 20 14Z" fill="#1f2937"/>
        <line x1="14" y1="36" x2="30" y2="36"/>
      </g>
    ),
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size + 8, height: size + 8 }}>
      <svg width={size} height={size} viewBox="0 0 44 44" style={{ display: "block" }}>
        {shapes[type] || shapes.star}
      </svg>
    </div>
  );
}

// ── Penny ──
// A simple penny illustration for counting activities
export function Penny({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: "block" }}>
      <circle cx="16" cy="16" r="14" fill="none" stroke="#1f2937" strokeWidth="1.8"/>
      <circle cx="16" cy="16" r="11" fill="none" stroke="#1f2937" strokeWidth="0.8"/>
      <text x="16" y="20" textAnchor="middle" fontSize="8"
        fontFamily="Georgia,serif" fill="#1f2937">1¢</text>
    </svg>
  );
}
