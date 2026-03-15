import React from 'react';
import { TraceLetter, TraceRow, RuledLine, LABEL_STYLE } from '../../shared/DrawingPrimitives';
import { DayTheme } from '../../content/types';

interface LetterTracingProps {
  word: string;
  age: number;
}

export default function LetterTracing({ word, age }: LetterTracingProps) {
  if (age <= 4) {
    // Ages 3-4: single letter tracing
    const letter = word[0].toUpperCase();
    const size = 48;
    return (
      <div>
        <div style={LABEL_STYLE}>Trace the letter</div>
        <div style={{ display: "flex", gap: 6 }}>
          <TraceLetter char={letter} size={size} />
          <TraceLetter char={letter} size={size} />
          <TraceLetter char={letter} size={size} />
        </div>
        <div style={{ ...LABEL_STYLE, marginTop: 10 }}>now write it yourself</div>
        <RuledLine h={Math.round(size * 1.4)} />
      </div>
    );
  }

  // Ages 5-6: full word tracing
  const size = word.length <= 4 ? 34 : word.length <= 6 ? 28 : 22;
  return (
    <div>
      <div style={LABEL_STYLE}>Trace the letters</div>
      <div style={{ ...LABEL_STYLE, marginTop: 6 }}>uppercase</div>
      <TraceRow text={word.toUpperCase()} size={size} />
      <div style={{ ...LABEL_STYLE, marginTop: 10 }}>lowercase</div>
      <TraceRow text={word.toLowerCase()} size={size} />
      <div style={{ ...LABEL_STYLE, marginTop: 10 }}>now write it yourself</div>
      <RuledLine h={Math.round(size * 1.4)} />
    </div>
  );
}
