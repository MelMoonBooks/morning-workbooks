import React, { useState, useMemo } from 'react';
import { getDayContent, REGIONS } from './content';
import { colors, theme } from './shared/theme';
import { seasonalObject } from './shared/DrawingPrimitives';

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

function getMathDescription(day: number, month: string, age: number): string {
  const obj = seasonalObject(month, day);
  if (age <= 4) {
    const type = day % 3;
    if (type === 0) return `Count & Write: ${(day % 5) + 1} ${obj}(s)`;
    if (type === 1) return `Circle ${day % 2 === 0 ? "smallest" : "biggest"} ${obj}`;
    return `Color ${(day % 3) + 2} of 5 ${obj}(s)`;
  }
  const type = day % 6;
  const addPairs = [[1,1],[2,1],[1,2],[2,2],[3,1],[1,3],[2,3],[3,2],[4,1],[1,4],[3,3],[4,2],[2,4]];
  const subPairs = [[3,1],[4,1],[4,2],[5,1],[5,2],[5,3],[6,2],[6,3],[7,3],[7,4]];
  if (type === 0) { const [a,b] = addPairs[day % addPairs.length]; return `Add: ${a} + ${b} = ?`; }
  if (type === 1) { const [t,r] = subPairs[day % subPairs.length]; return `Subtract: ${t} - ${r} = ?`; }
  if (type === 2) return `Before & After: _  ${(day % 8) + 2}  _`;
  if (type === 3) return `Circle ${day % 2 === 0 ? "taller" : "shorter"} ${obj}`;
  if (type === 4) { const c = [3,5,4,7,6,8,3,10,5,9,4,6,8,3,7,5,10,4,6,9,3,8,5,7,4,10,6,3,9,5,8]; return `Count ${c[(day-1) % c.length]} pennies`; }
  return `Write number ${(day % 10) + 1}`;
}

// Detailed math description for CSV exports
function getMathDetails(day: number, month: string, age: number): { type: string; description: string; objects: string; numbers: string } {
  const obj = seasonalObject(month, day);
  if (age <= 4) {
    const type = day % 3;
    if (type === 0) { const count = (day % 5) + 1; return { type: "Count & Write", description: `Count ${count} ${obj}(s) and write the number`, objects: `${count}x ${obj}`, numbers: String(count) }; }
    if (type === 1) { const task = day % 2 === 0 ? "smallest" : "biggest"; return { type: "Circle Size", description: `Circle the ${task} ${obj} in each row (3 rows, 3 sizes each)`, objects: `3x3 ${obj} (sizes: 36/58/46, 52/36/60, 60/44/38)`, numbers: "" }; }
    const target = (day % 3) + 2; return { type: "Color N", description: `Color ${target} of 5 ${obj}(s)`, objects: `5x ${obj}`, numbers: `${target} of 5` };
  }
  const type = day % 6;
  const addPairs = [[1,1],[2,1],[1,2],[2,2],[3,1],[1,3],[2,3],[3,2],[4,1],[1,4],[3,3],[4,2],[2,4]];
  const subPairs = [[3,1],[4,1],[4,2],[5,1],[5,2],[5,3],[6,2],[6,3],[7,3],[7,4]];
  if (type === 0) { const [a,b] = addPairs[day % addPairs.length]; const obj2 = seasonalObject(month, day+2); return { type: "Addition", description: `${a} ${obj}(s) + ${b} ${obj2}(s) = ?`, objects: `${a}x ${obj}, ${b}x ${obj2}`, numbers: `${a} + ${b} = ${a+b}` }; }
  if (type === 1) { const [t,r] = subPairs[day % subPairs.length]; return { type: "Subtraction", description: `${t} ${obj}(s), cross out ${r}, how many left?`, objects: `${t}x ${obj} (${r} crossed)`, numbers: `${t} - ${r} = ${t-r}` }; }
  if (type === 2) { const n = (day % 8) + 2; return { type: "Before & After", description: `What comes before and after ${n}?`, objects: "none", numbers: `${n-1}, ${n}, ${n+1}` }; }
  if (type === 3) { const task = day % 2 === 0 ? "taller" : "shorter"; const sA = day % 2 === 0 ? 72 : 42; const sB = day % 2 === 0 ? 40 : 68; return { type: "Taller/Shorter", description: `Circle the ${task} ${obj}`, objects: `2x ${obj} (sizes: ${sA}, ${sB})`, numbers: "" }; }
  if (type === 4) { const counts = [3,5,4,7,6,8,3,10,5,9,4,6,8,3,7,5,10,4,6,9,3,8,5,7,4,10,6,3,9,5,8]; const c = counts[(day-1) % counts.length]; return { type: "Count Pennies", description: `Count ${c} pennies and write the total`, objects: `${c}x penny`, numbers: `${c}¢` }; }
  const n = (day % 10) + 1; return { type: "Write Number", description: `Trace the number ${n}, then write it twice`, objects: "none", numbers: String(n) };
}

function exportCsv(rows: string[][], filename: string) {
  const csv = rows.map(row => row.map(cell => {
    if (cell.includes('"') || cell.includes(',') || cell.includes('\n')) return '"' + cell.replace(/"/g, '""') + '"';
    return cell;
  }).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ContentDashboard({ onBack }: { onBack: () => void }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [traditions, setTraditions] = useState<string[]>(["hindu", "christian-catholic"]);
  const [region, setRegion] = useState("us");
  const [age, setAge] = useState(5);
  const year = 2026;

  const toggleTradition = (id: string) => {
    setTraditions(prev => {
      if (prev.includes(id)) { if (prev.length <= 1) return prev; return prev.filter(t => t !== id); }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const monthName = MONTH_NAMES[month - 1];

  const rows = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      const content = getDayContent(traditions, region, month, d, year);
      return { day: d, ...content, mathDesc: getMathDescription(d, monthName, age) };
    });
  }, [traditions, region, month, year, age, daysInMonth, monthName]);

  const [showExports, setShowExports] = useState(false);

  // Export: current view (what's on screen)
  const handleExportCurrent = () => {
    const header = ["Month", "Day", "Dominant Tradition", "Tracing Word", "Color Type", "Coloring Subject", "Instruction", "Color Word", "Math Activity", "Holidays", "Quote", "Quote Source", "Image File"];
    const csvRows = [header, ...rows.map(r => [
      monthName, String(r.day), r.dominantTradition, r.theme.word,
      r.day % 2 === 0 ? "Color the Scene" : "Trace & Color",
      r.theme.subject, r.theme.instruction, r.theme.colorWord, r.mathDesc,
      r.holidays.map(h => h.name).join("; "), r.affirmation.quote, r.affirmation.ref,
      r.theme.imageFile ?? `${monthName.toLowerCase()}_${String(r.day).padStart(2, "0")}.png`,
    ])];
    exportCsv(csvRows, `melmoon-${monthName.toLowerCase()}-${traditions.join("+")}.csv`);
    setShowExports(false);
  };

  // Export: all images needed (full year, all traditions + regions)
  const handleExportImages = () => {
    const allTraditions = ["universal", "christian-catholic", "christian-protestant", "hindu", "jewish", "muslim"];
    const allRegions = REGIONS.map(r => r.id);
    const imageSet = new Map<string, { file: string; month: string; day: number; tradition: string; subject: string; instruction: string }>();

    for (let m = 1; m <= 12; m++) {
      const mn = MONTH_NAMES[m - 1];
      const dim = new Date(year, m, 0).getDate();
      for (let d = 1; d <= dim; d++) {
        const paddedDay = String(d).padStart(2, "0");
        const baseFile = `${mn.toLowerCase()}_${paddedDay}.png`;

        // Universal image (always needed)
        const uContent = getDayContent(["universal"], "us", m, d, year);
        if (!imageSet.has(baseFile)) {
          imageSet.set(baseFile, { file: baseFile, month: mn, day: d, tradition: "universal", subject: uContent.theme.subject, instruction: uContent.theme.instruction });
        }

        // Tradition-specific images (only when theme differs from universal)
        for (const t of allTraditions) {
          if (t === "universal") continue;
          const tContent = getDayContent([t], "us", m, d, year);
          if (tContent.theme.subject !== uContent.theme.subject || tContent.theme.imageFile) {
            const tFile = tContent.theme.imageFile ?? `${t}/${mn.toLowerCase()}_${paddedDay}.png`;
            if (!imageSet.has(tFile)) {
              imageSet.set(tFile, { file: tFile, month: mn, day: d, tradition: t, subject: tContent.theme.subject, instruction: tContent.theme.instruction });
            }
          }
        }

        // Region-specific images (only when theme differs)
        for (const reg of allRegions) {
          const rContent = getDayContent(["universal"], reg, m, d, year);
          if (rContent.theme.subject !== uContent.theme.subject) {
            const rFile = `${reg}/${mn.toLowerCase()}_${paddedDay}.png`;
            if (!imageSet.has(rFile)) {
              imageSet.set(rFile, { file: rFile, month: mn, day: d, tradition: `region:${reg}`, subject: rContent.theme.subject, instruction: rContent.theme.instruction });
            }
          }
        }
      }
    }

    const header = ["Image File", "Month", "Day", "Tradition/Region", "Subject (what to draw)", "Instruction", "ChatGPT Prompt"];
    const csvRows = [header, ...Array.from(imageSet.values()).map(img => [
      img.file, img.month, String(img.day), img.tradition, img.subject, img.instruction,
      `Simple black and white coloring book page for a 4-year-old of ${img.subject}. Clean outlines, no shading, lots of white space.`,
    ])];
    exportCsv(csvRows, `melmoon-all-images-needed.csv`);
    setShowExports(false);
  };

  // Export: full year of a single tradition (for expert review)
  // Uses the currently selected region so reviewer sees region-appropriate holidays
  const handleExportTraditionReview = (tradId: string, tradLabel: string) => {
    const regionLabel = REGIONS.find(r => r.id === region)?.label ?? region;
    const header = ["Month", "Day", "Region", "Tracing Word", "Coloring Subject", "Instruction", "Holiday", "Holiday Message", "Quote", "Quote Source"];
    const csvRows: string[][] = [header];
    for (let m = 1; m <= 12; m++) {
      const mn = MONTH_NAMES[m - 1];
      const dim = new Date(year, m, 0).getDate();
      for (let d = 1; d <= dim; d++) {
        const content = getDayContent([tradId], region, m, d, year);
        csvRows.push([
          mn, String(d), regionLabel, content.theme.word, content.theme.subject, content.theme.instruction,
          content.holidays.map(h => h.name).join("; "),
          content.holidays.map(h => h.sentence).join(" | "),
          content.affirmation.quote, content.affirmation.ref,
        ]);
      }
    }
    exportCsv(csvRows, `melmoon-${tradLabel.toLowerCase()}-${region}-review-${year}.csv`);
    setShowExports(false);
  };

  // Export: region-specific content — all holidays and activity overrides from that region's files
  const handleExportRegionReview = (regionId: string, regionLabel: string) => {
    // Import the raw region data directly from the registry
    const regionConfig = REGIONS.find(r => r.id === regionId);
    if (!regionConfig) return;

    const header = ["Month", "Day", "Type", "Name / Subject", "Message / Instruction", "Is Major?", "Image File"];
    const csvRows: string[][] = [header];

    // Add all region holidays
    for (const h of regionConfig.holidays) {
      // Filter by year if applicable
      if (h.year && h.year !== year) continue;
      const [mm, dd] = h.date.split("-").map(Number);
      csvRows.push([
        MONTH_NAMES[mm - 1], String(dd), "Holiday",
        h.name, h.sentence, h.isMajor ? "YES" : "no", "",
      ]);
    }

    // Add all region activity overrides
    for (const [key, activity] of Object.entries(regionConfig.activities)) {
      const [m, d] = key.split("-").map(Number);
      const paddedDay = String(d).padStart(2, "0");
      csvRows.push([
        MONTH_NAMES[m - 1], String(d), "Activity Override",
        activity.subject, activity.instruction, "",
        activity.imageFile ?? `${regionId}/${MONTH_NAMES[m - 1].toLowerCase()}_${paddedDay}.png`,
      ]);
    }

    // Sort by month then day
    const headerRow = csvRows.shift()!;
    csvRows.sort((a, b) => {
      const ma = MONTH_NAMES.indexOf(a[0]), mb = MONTH_NAMES.indexOf(b[0]);
      if (ma !== mb) return ma - mb;
      return Number(a[1]) - Number(b[1]);
    });
    csvRows.unshift(headerRow);

    exportCsv(csvRows, `melmoon-region-${regionId}-review-${year}.csv`);
    setShowExports(false);
  };

  // Export: math activities for a full year at a specific age
  const handleExportMath = (exportAge: number) => {
    const ageLabel = exportAge <= 4 ? "ages-3-4" : "ages-5-6";
    const header = ["Month", "Day", "Activity Type", "Description", "Objects Used", "Numbers/Answers", "Seasonal Object"];
    const csvRows: string[][] = [header];
    for (let m = 1; m <= 12; m++) {
      const mn = MONTH_NAMES[m - 1];
      const dim = new Date(year, m, 0).getDate();
      for (let d = 1; d <= dim; d++) {
        const details = getMathDetails(d, mn, exportAge);
        const obj = seasonalObject(mn, d);
        csvRows.push([
          mn, String(d), details.type, details.description, details.objects, details.numbers, obj,
        ]);
      }
    }
    exportCsv(csvRows, `melmoon-math-${ageLabel}-${year}.csv`);
    setShowExports(false);
  };

  const thBg = "#f0f4f2";
  const cellStyle: React.CSSProperties = { padding: "6px 8px", borderBottom: "1px solid #e5e7eb", fontSize: 11, verticalAlign: "top", lineHeight: 1.4 };
  const thStyle: React.CSSProperties = { ...cellStyle, background: thBg, fontWeight: "bold", position: "sticky" as const, top: 0, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 };

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, fontFamily: "Georgia, serif", padding: "16px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h1 style={{ fontSize: 20, color: theme.textPrimary, margin: 0 }}>Content Dashboard</h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowExports(v => !v)} style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${colors.deepTeal}`, background: colors.deepTeal, color: "white", fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
                Export CSV ▾
              </button>
              {showExports && (
                <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "white", border: `1.5px solid ${theme.cardBorder}`, borderRadius: 10, padding: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, minWidth: 260 }}>
                  <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, padding: "4px 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Current View</div>
                  <button onClick={handleExportCurrent} style={{ width: "100%", textAlign: "left", padding: "8px 8px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: theme.textPrimary, borderRadius: 6 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    {monthName} — {traditions.join(" + ")}
                  </button>

                  <div style={{ borderTop: `1px solid ${theme.cardBorder}`, margin: "6px 0" }} />
                  <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, padding: "4px 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Image Generation</div>
                  <button onClick={handleExportImages} style={{ width: "100%", textAlign: "left", padding: "8px 8px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: theme.textPrimary, borderRadius: 6 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    All images needed (full year, all traditions)
                  </button>

                  <div style={{ borderTop: `1px solid ${theme.cardBorder}`, margin: "6px 0" }} />
                  <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, padding: "4px 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Math Activities (full year)</div>
                  <button onClick={() => handleExportMath(3)} style={{ width: "100%", textAlign: "left", padding: "6px 8px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: theme.textPrimary, borderRadius: 6 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    Ages 3–4 — count, circle, color
                  </button>
                  <button onClick={() => handleExportMath(5)} style={{ width: "100%", textAlign: "left", padding: "6px 8px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: theme.textPrimary, borderRadius: 6 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    Ages 5–6 — add, subtract, before/after, pennies
                  </button>

                  <div style={{ borderTop: `1px solid ${theme.cardBorder}`, margin: "6px 0" }} />
                  <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, padding: "4px 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Tradition Review (full year, {REGIONS.find(r => r.id === region)?.label} region)</div>
                  {TRADITIONS.map(t => (
                    <button key={t.id} onClick={() => handleExportTraditionReview(t.id, t.label)} style={{ width: "100%", textAlign: "left", padding: "6px 8px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: theme.textPrimary, borderRadius: 6 }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                      {t.label} — send to reviewer
                    </button>
                  ))}

                  <div style={{ borderTop: `1px solid ${theme.cardBorder}`, margin: "6px 0" }} />
                  <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, padding: "4px 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Region Review (differences only)</div>
                  {REGIONS.map(r => (
                    <button key={r.id} onClick={() => handleExportRegionReview(r.id, r.label)} style={{ width: "100%", textAlign: "left", padding: "6px 8px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: theme.textPrimary, borderRadius: 6 }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                      {r.flag} {r.label} — holidays &amp; activity overrides
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onBack} style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.textPrimary, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}>
              Back
            </button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ background: theme.cardBg, border: `1.5px solid ${theme.cardBorder}`, borderRadius: 12, padding: 14, marginBottom: 12, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 3 }}>MONTH</div>
            <select value={month} onChange={e => setMonth(Number(e.target.value))}
              style={{ padding: "5px 8px", borderRadius: 6, border: `1.5px solid ${theme.cardBorder}`, fontSize: 13 }}>
              {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 3 }}>AGE</div>
            <div style={{ display: "flex", gap: 4 }}>
              {[3,4,5,6].map(a => (
                <button key={a} onClick={() => setAge(a)} style={{ width: 30, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: "bold",
                  border: `1.5px solid ${age === a ? colors.deepTeal : theme.cardBorder}`,
                  background: age === a ? colors.deepTeal : "white", color: age === a ? "white" : theme.textPrimary }}>{a}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 3 }}>REGION</div>
            <div style={{ display: "flex", gap: 4 }}>
              {REGIONS.map(r => (
                <button key={r.id} onClick={() => setRegion(r.id)} style={{ padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                  border: `1.5px solid ${region === r.id ? colors.deepTeal : theme.cardBorder}`,
                  background: region === r.id ? colors.deepTeal : "white", color: region === r.id ? "white" : theme.textPrimary }}>{r.flag} {r.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: "bold", color: theme.textMuted, marginBottom: 3 }}>TRADITIONS</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {TRADITIONS.map(t => {
                const sel = traditions.includes(t.id);
                return (
                  <button key={t.id} onClick={() => toggleTradition(t.id)} style={{ padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 10, fontWeight: "bold",
                    border: `1.5px solid ${sel ? colors.deepTeal : theme.cardBorder}`,
                    background: sel ? colors.deepTeal : "white", color: sel ? "white" : theme.textPrimary }}>{t.label}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>
          {monthName} {year} · {daysInMonth} days · {traditions.join(" + ")} · Age {age}
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: 8, border: `1px solid ${theme.cardBorder}`, overflow: "auto", maxHeight: "70vh" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 35 }}>Day</th>
                <th style={{ ...thStyle, width: 80 }}>Dominant</th>
                <th style={{ ...thStyle, width: 60 }}>Word</th>
                <th style={{ ...thStyle, width: 70 }}>Color Type</th>
                <th style={{ ...thStyle, width: 130 }}>Subject / Instruction</th>
                <th style={{ ...thStyle, width: 120 }}>Math Activity</th>
                <th style={{ ...thStyle, width: 120 }}>Holidays</th>
                <th style={{ ...thStyle, width: 200 }}>Quote</th>
                <th style={{ ...thStyle, width: 90 }}>Ref</th>
                <th style={{ ...thStyle, width: 110 }}>Image File</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const isHoliday = r.holidays.length > 0;
                const rowBg = isHoliday ? "#fef9ee" : "white";
                return (
                  <tr key={r.day} style={{ background: rowBg }}>
                    <td style={{ ...cellStyle, fontWeight: "bold", textAlign: "center" }}>{r.day}</td>
                    <td style={{ ...cellStyle, color: r.dominantTradition === "universal" ? theme.textMuted : colors.deepTeal, fontWeight: "bold", fontSize: 10 }}>
                      {r.dominantTradition}
                    </td>
                    <td style={{ ...cellStyle, fontWeight: "bold" }}>{r.theme.word}</td>
                    <td style={{ ...cellStyle, fontSize: 10 }}>{r.day % 2 === 0 ? "Color Scene" : "Trace & Color"}</td>
                    <td style={cellStyle}>
                      <div style={{ fontWeight: "bold", marginBottom: 2 }}>{r.theme.subject}</div>
                      <div style={{ color: theme.textMuted, fontSize: 10 }}>{r.theme.instruction}</div>
                    </td>
                    <td style={{ ...cellStyle, fontSize: 10 }}>{r.mathDesc}</td>
                    <td style={cellStyle}>
                      {r.holidays.map((h, i) => (
                        <div key={i} style={{ fontSize: 10, marginBottom: 2 }}>
                          <strong>{h.name}</strong>
                          {h.isMajor && <span style={{ color: "#b45309", marginLeft: 4, fontSize: 9 }}>MAJOR</span>}
                        </div>
                      ))}
                    </td>
                    <td style={{ ...cellStyle, fontStyle: "italic", color: theme.textSecondary }}>
                      {r.affirmation.quote}
                    </td>
                    <td style={{ ...cellStyle, fontSize: 10, color: theme.textMuted }}>
                      {r.affirmation.ref}
                    </td>
                    <td style={{ ...cellStyle, fontSize: 10, color: theme.textMuted, fontFamily: "monospace" }}>
                      {r.theme.imageFile ?? `${monthName.toLowerCase()}_${String(r.day).padStart(2, "0")}.png`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
