import React from 'react';
import { TraceRow } from '../../shared/DrawingPrimitives';
import { DayImage } from '../../shared/ImageCache';

interface ColorActivityProps {
  day: number;
  month: string;
  instruction: string;
  subject: string;
  colorWord: string;
  tradition?: string;
  region?: string;
  imageFile?: string;
}

// ── ColorSceneActivity (even days) ──

function ColorSceneActivity({ month, day, instruction, subject, tradition, region, imageFile }: {
  month: string; day: number; instruction: string; subject: string;
  tradition?: string; region?: string; imageFile?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ fontSize: 12, fontWeight: "bold", color: "#1f2937", marginBottom: 6, lineHeight: 1.4 }}>
        {instruction}
      </div>
      <div style={{ flex: 1, display: "flex" }}>
        <DayImage month={month} day={day} label={subject} tradition={tradition} region={region} imageFile={imageFile} />
      </div>
    </div>
  );
}

// ── TraceColorActivity (odd days) ──

function TraceColorActivity({ month, day, subject, colorWord, tradition, region, imageFile }: {
  month: string; day: number; subject: string; colorWord: string;
  tradition?: string; region?: string; imageFile?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{
        fontSize: 10, fontWeight: "bold", color: "#374151",
        textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6,
      }}>
        Trace &amp; Color
      </div>
      <TraceRow text={colorWord} size={28} gap={2} />
      <div style={{ flex: 1, display: "flex", marginTop: 6 }}>
        <DayImage month={month} day={day} label={subject} tradition={tradition} region={region} imageFile={imageFile} />
      </div>
    </div>
  );
}

// ── ColorActivity (exported router) ──

function ColorActivity({ day, month, instruction, subject, colorWord, tradition, region, imageFile }: ColorActivityProps) {
  const type = day % 2 === 0 ? "scene" : "trace";

  return (
    <div style={{
      flex: 1, border: "1.5px solid #d1d5db", borderRadius: 6,
      padding: "8px 10px", background: "white", display: "flex",
      flexDirection: "column", minHeight: 180,
    }}>
      {type === "scene" ? (
        <ColorSceneActivity month={month} day={day} instruction={instruction} subject={subject}
          tradition={tradition} region={region} imageFile={imageFile} />
      ) : (
        <TraceColorActivity month={month} day={day} subject={subject} colorWord={colorWord}
          tradition={tradition} region={region} imageFile={imageFile} />
      )}
    </div>
  );
}

export default ColorActivity;
