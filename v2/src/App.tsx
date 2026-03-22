import React, { useState, useEffect } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { ChildProfile } from './content/types';
import { getDayContent } from './content';
import DayPage from './products/morning-workbook/DayPage';
import ProfileModal, { loadProfiles, saveProfiles } from './shared/ProfileModal';
import { ImageCacheContext } from './shared/ImageCache';

const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

export default function App() {
  // ── Child profiles ──
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => loadProfiles());
  const [activeId, setActiveId] = useState<string | null>(() => {
    const saved = loadProfiles();
    return saved[0]?.id ?? null;
  });
  const [showProfiles, setShowProfiles] = useState(false);

  const activeChild = profiles.find(p => p.id === activeId) ?? null;

  // ── Workbook controls ──
  const now = new Date();
  const [month, setMonth]         = useState(now.getMonth() + 1);
  const [previewDay, setPreviewDay] = useState(now.getDate());
  const [showMonth, setShowMonth] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<number | null>(null);
  const year = now.getFullYear();

  // Derived from active child profile
  const childName  = activeChild?.name ?? "";
  const age        = activeChild?.age ?? 5;
  const traditions = activeChild?.traditions ?? ["universal"];
  const region     = activeChild?.region ?? "us";
  const birthdays  = activeChild?.birthdays ?? [];

  const daysInMonth = new Date(year, month, 0).getDate();
  const monthName = MONTH_NAMES[month - 1];

  // Clamp preview day when month changes
  useEffect(() => {
    if (previewDay > daysInMonth) setPreviewDay(daysInMonth);
  }, [month, daysInMonth]);

  const handleProfileSave = (updated: ChildProfile[]) => {
    setProfiles(updated);
    saveProfiles(updated);
  };

  const handleSelectChild = (id: string | null) => {
    setActiveId(id);
  };

  // ── PDF Download ──
  const handleDownloadPDF = async () => {
    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement("script");
      s.src = src; s.onload = () => resolve(); s.onerror = () => reject();
      document.head.appendChild(s);
    });

    const fetchBase64 = (url: string): Promise<string | null> =>
      fetch(url)
        .then(r => r.ok ? r.blob() : Promise.reject())
        .then(blob => new Promise<string>(res => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as string);
          reader.readAsDataURL(blob);
        }))
        .catch(() => null);

    try {
      setPdfProgress(0);
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");

      const { jsPDF } = (window as any).jspdf;
      const html2canvas = (window as any).html2canvas;
      const ReactDOM = await import("react-dom/client");
      const React2 = await import("react");

      // Pre-fetch images as base64 (tiered: tradition, region, universal)
      const imageCache: Record<string, string> = {};
      for (let d = 1; d <= daysInMonth; d++) {
        const paddedDay = String(d).padStart(2, "0");
        const baseKey = `${monthName.toLowerCase()}_${paddedDay}`;
        // Try tradition-specific, region-specific, then universal
        const dayContent = getDayContent(traditions, region, month, d, year);
        const candidates = [
          ...(dayContent.theme.imageFile ? [dayContent.theme.imageFile.replace(/\.png$/, "")] : []),
          ...(dayContent.dominantTradition !== "universal" ? [`${dayContent.dominantTradition}/${baseKey}`] : []),
          `${region}/${baseKey}`,
          baseKey,
        ];
        for (const key of candidates) {
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
        setPdfProgress(Math.round((d / daysInMonth) * 100));

        const wrapper = document.createElement("div");
        container.innerHTML = "";
        container.appendChild(wrapper);

        await new Promise<void>(resolve => {
          const root = ReactDOM.createRoot(wrapper);
          root.render(
            React2.createElement(
              ImageCacheContext.Provider,
              { value: imageCache },
              React2.createElement(DayPage, {
                day: d, month, year, childName, traditions, region, age,
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
      setPdfProgress(null);
      pdf.save(`${childName || "MorningWork"}_${monthName}_${year}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      setPdfProgress(null);
      alert(`PDF failed: ${(err as Error).message}`);
    }
  };

  // ── Tradition display helpers ──
  const traditionLabel = (t: string[]) => {
    const labels: Record<string, string> = {
      "universal": "Non-religious", "christian-catholic": "Catholic",
      "christian-protestant": "Protestant", "hindu": "Hindu",
      "jewish": "Jewish", "muslim": "Muslim",
    };
    return t.map(id => labels[id] ?? id).join(" + ");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0ece3", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 48px", fontFamily: "Georgia, serif" }}>

      {/* Top bar */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", maxWidth: 640, marginBottom: 8 }}>
        <UserButton afterSignOutUrl={window.location.href} />
      </div>

      {/* Profile Modal */}
      {showProfiles && (
        <ProfileModal
          profiles={profiles}
          onClose={() => setShowProfiles(false)}
          onSave={handleProfileSave}
          onSelect={handleSelectChild}
          activeId={activeId}
        />
      )}

      {/* Child Selector Bar */}
      <div style={{ maxWidth: 640, width: "100%", marginBottom: 10, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {profiles.map(p => (
          <button key={p.id} onClick={() => handleSelectChild(p.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              borderRadius: 20, border: `2px solid ${activeId === p.id ? "#1f2937" : "#d1d5db"}`,
              background: activeId === p.id ? "#1f2937" : "white",
              color: activeId === p.id ? "white" : "#374151",
              fontSize: 12, fontWeight: "bold", cursor: "pointer",
            }}>
            <span style={{ fontSize: 15 }}>{p.emoji}</span>
            {p.name}
            {activeId === p.id && <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 1 }}>✓</span>}
          </button>
        ))}
        <button onClick={() => setShowProfiles(true)}
          style={{
            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
            borderRadius: 20, border: "2px dashed #d1d5db", background: "white",
            color: "#6b7280", fontSize: 12, fontWeight: "bold", cursor: "pointer",
          }}>
          {profiles.length === 0 ? "👶 Add a Child" : "✏️ Manage"}
        </button>
      </div>

      {/* Controls */}
      <div style={{
        background: "white", border: "2px solid #e5e7eb", borderRadius: 12,
        padding: "12px 16px", marginBottom: 14, display: "flex", gap: 12,
        flexWrap: "wrap", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        maxWidth: 640, width: "100%",
      }}>
        {/* Active child info */}
        {activeChild && (
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 3 }}>ACTIVE CHILD</div>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#1f2937" }}>
              {activeChild.emoji} {activeChild.name}
              <span style={{ fontSize: 11, fontWeight: "normal", color: "#6b7280", marginLeft: 8 }}>
                Age {activeChild.age} · {traditionLabel(activeChild.traditions)}
              </span>
            </div>
          </div>
        )}

        {/* Month */}
        <div>
          <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 3 }}>MONTH</div>
          <select value={month} onChange={e => setMonth(Number(e.target.value))}
            style={{ padding: "5px 8px", borderRadius: 6, border: "2px solid #e5e7eb", fontSize: 13 }}>
            {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
        </div>

        {/* Preview day */}
        <div>
          <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 3 }}>PREVIEW DAY</div>
          <input type="number" min={1} max={daysInMonth} value={previewDay}
            onChange={e => setPreviewDay(Math.min(daysInMonth, Math.max(1, Number(e.target.value))))}
            style={{ width: 52, padding: "5px 6px", borderRadius: 6, border: "2px solid #e5e7eb", fontSize: 13, textAlign: "center" }} />
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => setShowMonth(v => !v)}
          style={{
            padding: "7px 18px", fontSize: 12, fontWeight: "bold", cursor: "pointer",
            border: "2px solid #1f2937", borderRadius: 8,
            background: showMonth ? "#e5e7eb" : "white", color: "#1f2937",
          }}>
          {showMonth ? "▲ Hide Month View" : `▼ Show All of ${monthName}`}
        </button>
        <button onClick={handleDownloadPDF} disabled={pdfProgress !== null}
          style={{
            padding: "7px 18px", fontSize: 12, fontWeight: "bold",
            cursor: pdfProgress !== null ? "wait" : "pointer",
            border: "2px solid #1f2937", borderRadius: 8,
            background: "#1f2937", color: "white",
            opacity: pdfProgress !== null ? 0.7 : 1,
          }}>
          {pdfProgress !== null ? `Building PDF… ${pdfProgress}%` : `↓ Download PDF — ${monthName} (${daysInMonth} pages)`}
        </button>
      </div>

      {/* Active child hint */}
      <div style={{
        fontSize: 11, color: "#6b7280", marginBottom: 12, background: "white",
        border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "5px 14px",
      }}>
        Day {previewDay} · {monthName} {year}
        {activeChild && (
          <span style={{ marginLeft: 8, color: "#9ca3af" }}>
            · {activeChild.emoji} {activeChild.name} · {traditionLabel(activeChild.traditions)}
          </span>
        )}
      </div>

      {/* Single day preview */}
      <div style={{ width: 540, maxWidth: "100%" }}>
        <DayPage
          day={previewDay}
          month={month}
          year={year}
          childName={childName}
          traditions={traditions}
          region={region}
          age={age}
          birthdays={birthdays}
        />
      </div>

      <p style={{ marginTop: 14, fontSize: 11, color: "#9ca3af", maxWidth: 540, textAlign: "center" }}>
        Even days = Color the Scene · Odd days = Trace &amp; Color · Change Preview Day to rotate
      </p>

      {/* Month view */}
      {showMonth && (
        <div style={{ marginTop: 32, width: 540, maxWidth: "100%" }}>
          <div style={{
            textAlign: "center", fontSize: 14, fontWeight: "bold", color: "#1f2937",
            marginBottom: 20, fontFamily: "Georgia,serif", letterSpacing: 0.5,
          }}>
            {monthName} {year} — All {daysInMonth} Days
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
              <div key={d}>
                <div style={{ fontSize: 10, fontWeight: "bold", color: "#9ca3af", letterSpacing: 1, textAlign: "center", marginBottom: 5 }}>
                  — DAY {d} —
                </div>
                <DayPage
                  day={d}
                  month={month}
                  year={year}
                  childName={childName}
                  traditions={traditions}
                  region={region}
                  age={age}
                  birthdays={birthdays}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
