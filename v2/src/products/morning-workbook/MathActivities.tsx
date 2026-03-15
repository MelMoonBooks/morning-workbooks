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
// Count objects and write the number

function CountActivity({ day, month }: DayMonthProps) {
  const obj = seasonalObject(month, day) as SvgObjectType;
  const count = (day % 5) + 1;

  return (
    <div>
      <div style={LABEL_STYLE}>Count the {obj}s and write the number</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {Array.from({ length: count }, (_, i) => (
          <SvgObject key={i} type={obj} />
        ))}
        <span style={{ fontSize: 22, fontWeight: "bold", margin: "0 4px" }}>=</span>
        <WriteBox />
      </div>
    </div>
  );
}

// ── CircleActivity (ages 3-4) ──
// Circle the smallest or biggest

function CircleActivity({ day, month }: DayMonthProps) {
  const obj = seasonalObject(month, day) as SvgObjectType;
  const task = day % 2 === 0 ? "smallest" : "biggest";
  const sizes: number[][] = [[36, 58, 46], [52, 36, 60], [60, 44, 38]];

  return (
    <div>
      <div style={LABEL_STYLE}>Circle the {task} {obj}</div>
      {sizes.map((row, r) => (
        <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          {row.map((s, c) => (
            <SvgObject key={c} type={obj} size={s} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── ColorNActivity (ages 3-4) ──
// Color N objects

function ColorNActivity({ day, month }: DayMonthProps) {
  const obj = seasonalObject(month, day) as SvgObjectType;
  const target = (day % 3) + 2;
  const plural = obj === "fish" ? "fish" : obj + "s";

  return (
    <div>
      <div style={LABEL_STYLE}>Color {target} {plural}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {Array.from({ length: 5 }, (_, i) => (
          <SvgObject key={i} type={obj} />
        ))}
      </div>
    </div>
  );
}

// ── AdditionActivity (ages 5-6) ──
// Addition with pictures

function AdditionActivity({ day, month }: DayMonthProps) {
  const addPairs: [number, number][] = [
    [1,1],[2,1],[1,2],[2,2],[3,1],[1,3],[2,3],[3,2],[4,1],[1,4],[3,3],[4,2],[2,4],
  ];
  const [a, b] = addPairs[day % addPairs.length];
  const objA = seasonalObject(month, day) as SvgObjectType;
  const objB = seasonalObject(month, day + 2) as SvgObjectType;

  return (
    <div>
      <div style={LABEL_STYLE}>Addition</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {Array.from({ length: a }, (_, i) => (
          <SvgObject key={`a${i}`} type={objA} />
        ))}
        <span style={{ fontSize: 22, fontWeight: "bold", margin: "0 4px" }}>+</span>
        {Array.from({ length: b }, (_, i) => (
          <SvgObject key={`b${i}`} type={objB} />
        ))}
        <span style={{ fontSize: 22, fontWeight: "bold", margin: "0 4px" }}>=</span>
        <WriteBox />
      </div>
    </div>
  );
}

// ── SubtractionActivity (ages 5-6) ──
// Subtraction with crossed out objects

function SubtractionActivity({ day, month }: DayMonthProps) {
  const subPairs: [number, number][] = [
    [3,1],[4,1],[4,2],[5,1],[5,2],[5,3],[6,2],[6,3],[7,3],[7,4],
  ];
  const [total, remove] = subPairs[day % subPairs.length];
  const obj = seasonalObject(month, day) as SvgObjectType;

  return (
    <div>
      <div style={LABEL_STYLE}>Subtraction</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ position: "relative", display: "inline-flex" }}>
            <SvgObject type={obj} />
            {i < remove && (
              <svg
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                viewBox="0 0 44 44"
              >
                <line x1="8" y1="8" x2="36" y2="36" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                <line x1="36" y1="8" x2="8" y2="36" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
          </div>
        ))}
        <span style={{ fontSize: 22, fontWeight: "bold", margin: "0 4px" }}>=</span>
        <WriteBox />
      </div>
    </div>
  );
}

// ── BeforeAfterActivity (ages 5-6) ──
// What comes before and after

function BeforeAfterActivity({ day }: DayProps) {
  const n = (day % 8) + 2;

  return (
    <div>
      <div style={LABEL_STYLE}>What comes before and after?</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <WriteBox />
        <span style={{ fontSize: 28, fontWeight: "bold" }}>{n}</span>
        <WriteBox />
      </div>
    </div>
  );
}

// ── TallerShorterActivity (ages 5-6) ──
// Circle taller or shorter

function TallerShorterActivity({ day, month }: DayMonthProps) {
  const task = day % 2 === 0 ? "taller" : "shorter";
  const obj = seasonalObject(month, day) as SvgObjectType;
  const sizeA = day % 2 === 0 ? 72 : 42;
  const sizeB = day % 2 === 0 ? 40 : 68;

  return (
    <div>
      <div style={LABEL_STYLE}>Circle the {task} {obj}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
        <SvgObject type={obj} size={sizeA} />
        <SvgObject type={obj} size={sizeB} />
      </div>
    </div>
  );
}

// ── PenniesActivity (ages 5-6) ──
// Count pennies

function PenniesActivity({ day }: DayProps) {
  const counts = [3,5,4,7,6,8,3,10,5,9,4,6,8,3,7,5,10,4,6,9,3,8,5,7,4,10,6,3,9,5,8];
  const count = counts[(day - 1) % counts.length];

  return (
    <div>
      <div style={LABEL_STYLE}>Count the pennies</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
        {Array.from({ length: count }, (_, i) => (
          <Penny key={i} />
        ))}
        <span style={{ fontSize: 22, fontWeight: "bold", margin: "0 4px" }}>=</span>
        <WriteBox />
        <span style={{ fontSize: 22, fontWeight: "bold" }}>&cent;</span>
      </div>
    </div>
  );
}

// ── WriteNumberActivity (ages 5-6) ──
// Trace and write numbers

function WriteNumberActivity({ day }: DayProps) {
  const n = (day % 10) + 1;
  const path = NUMBER_PATHS[n];
  const size = 64;
  const h = Math.round(size * 1.4);

  return (
    <div>
      <div style={LABEL_STYLE}>Trace and write the number {n}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Trace box with number path */}
        <svg width={size} height={h} viewBox="0 0 40 56" style={{ display: "block" }}>
          <rect x="1" y="1" width="38" height="54" rx="3"
            fill="none" stroke="#d1d5db" strokeWidth="1.2" strokeDasharray="4 3" />
          <line x1="4" y1="2" x2="36" y2="2" stroke="#d1d5db" strokeWidth="0.8" />
          <line x1="4" y1="28" x2="36" y2="28" stroke="#d1d5db" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="4" y1="54" x2="36" y2="54" stroke="#d1d5db" strokeWidth="0.8" />
          {path && (
            <path d={path} fill="none" stroke="#b0b0b0" strokeWidth="2.8"
              strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5" />
          )}
        </svg>
        {/* Two empty write boxes */}
        <WriteBox size={size} />
        <WriteBox size={size} />
      </div>
    </div>
  );
}

// ── MathActivity (router) ──
// Picks the right activity based on age and day

function MathActivity({ day, month, age }: MathActivityProps) {
  const maxTypes = age <= 4 ? 3 : 6;
  const type = day % maxTypes;

  let activity: React.ReactNode;

  if (age <= 4) {
    switch (type) {
      case 0: activity = <CountActivity day={day} month={month} />; break;
      case 1: activity = <CircleActivity day={day} month={month} />; break;
      case 2: activity = <ColorNActivity day={day} month={month} />; break;
      default: activity = <CountActivity day={day} month={month} />;
    }
  } else {
    switch (type) {
      case 0: activity = <AdditionActivity day={day} month={month} />; break;
      case 1: activity = <SubtractionActivity day={day} month={month} />; break;
      case 2: activity = <BeforeAfterActivity day={day} />; break;
      case 3: activity = <TallerShorterActivity day={day} month={month} />; break;
      case 4: activity = <PenniesActivity day={day} />; break;
      case 5: activity = <WriteNumberActivity day={day} />; break;
      default: activity = <AdditionActivity day={day} month={month} />;
    }
  }

  return (
    <div style={{
      border: "1.5px solid #d1d5db",
      borderRadius: 6,
      padding: "10px 14px",
      minHeight: 140,
    }}>
      {activity}
    </div>
  );
}

export default MathActivity;
