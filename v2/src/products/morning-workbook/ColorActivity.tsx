import React from 'react';
import { TraceRow } from '../../shared/DrawingPrimitives';
import { DayImage } from '../../shared/ImageCache';

// ── Props types ──

interface ColorActivityProps {
  day: number;
  month: string;
  instruction: string;
  subject: string;
  colorWord: string;
}

// ── ColorSceneActivity (even days) ──
// Shows an instruction and a coloring image

function ColorSceneActivity({ month, day, instruction, subject }: {
  month: string;
  day: number;
  instruction: string;
  subject: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: "bold", color: "#374151", marginBottom: 6 }}>
        {instruction}
      </div>
      <DayImage month={month} day={day} label={subject} />
    </div>
  );
}

// ── TraceColorActivity (odd days) ──
// Trace the color word, then color the image

function TraceColorActivity({ month, day, subject, colorWord }: {
  month: string;
  day: number;
  subject: string;
  colorWord: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{
        fontSize: 10,
        fontWeight: "bold",
        color: "#374151",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 6,
      }}>
        Trace &amp; Color
      </div>
      <TraceRow text={colorWord} size={28} gap={2} />
      <div style={{ marginTop: 8 }}>
        <DayImage month={month} day={day} label={subject} />
      </div>
    </div>
  );
}

// ── ColorActivity (exported router) ──

function ColorActivity({ day, month, instruction, subject, colorWord }: ColorActivityProps) {
  const type = day % 2 === 0 ? "scene" : "trace";

  return (
    <div style={{
      flex: 1,
      border: "1.5px solid #d1d5db",
      borderRadius: 6,
      padding: "8px 10px",
      background: "white",
      minHeight: 180,
    }}>
      {type === "scene" ? (
        <ColorSceneActivity month={month} day={day} instruction={instruction} subject={subject} />
      ) : (
        <TraceColorActivity month={month} day={day} subject={subject} colorWord={colorWord} />
      )}
    </div>
  );
}

export default ColorActivity;
