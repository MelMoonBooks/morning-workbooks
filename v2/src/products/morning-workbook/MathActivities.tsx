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

// ── MathActivity (router) ──

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
      background: "white",
      minHeight: 140,
    }}>
      {activity}
    </div>
  );
}

export default MathActivity;
