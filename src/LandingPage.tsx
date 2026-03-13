import React, { useState } from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

// ── Shared activity data (minimal subset for preview) ──────────────────────

const MONTH_NAMES = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];
const DAY_NAMES   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const LETTER_PATHS: Record<string,string> = {
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
  z:"M8 28 H30 L8 54 H30",
};

const DESCENDERS = new Set(["g","j","p","q","y"]);

function TraceLetter({ char, size = 34 }: { char: string; size?: number }) {
  const path    = LETTER_PATHS[char] ?? LETTER_PATHS[char.toUpperCase()] ?? "";
  const hasDesc = DESCENDERS.has(char);
  const vbH     = hasDesc ? 72 : 56;
  const h       = Math.round(size * (vbH / 40));
  return (
    <svg width={size} height={h} viewBox={`0 0 40 ${vbH}`} style={{ display:"block" }}>
      <line x1="0" y1="2"  x2="40" y2="2"  stroke="#d1d5db" strokeWidth="1" />
      <line x1="0" y1="28" x2="40" y2="28" stroke="#d1d5db" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1="0" y1="54" x2="40" y2="54" stroke="#d1d5db" strokeWidth="1" />
      {path && <path d={path} fill="none" stroke="#b0b0b0" strokeWidth="2.8"
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5" />}
    </svg>
  );
}

function TraceRow({ text, size = 30 }: { text: string; size?: number }) {
  return (
    <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
      {text.split("").map((c,i) => <TraceLetter key={i} char={c} size={size} />)}
    </div>
  );
}

function RuledLine({ h = 44 }: { h?: number }) {
  return (
    <svg width="100%" height={h} style={{ display:"block" }}>
      <line x1="0" y1="1"   x2="100%" y2="1"   stroke="#9ca3af" strokeWidth="1.4" />
      <line x1="0" y1={h/2} x2="100%" y2={h/2} stroke="#c4b5a0" strokeWidth="1" strokeDasharray="6 4" />
      <line x1="0" y1={h-1} x2="100%" y2={h-1} stroke="#9ca3af" strokeWidth="1.4" />
    </svg>
  );
}

function WriteBox({ size = 44 }: { size?: number }) {
  const h = Math.round(size * 1.4);
  return (
    <svg width={size} height={h} viewBox="0 0 40 56" style={{ display:"block" }}>
      <rect x="1" y="1" width="38" height="54" rx="3" fill="none" stroke="#d1d5db" strokeWidth="1.2" strokeDasharray="4 3"/>
      <line x1="4" y1="2"  x2="36" y2="2"  stroke="#d1d5db" strokeWidth="0.8"/>
      <line x1="4" y1="28" x2="36" y2="28" stroke="#d1d5db" strokeWidth="0.6" strokeDasharray="3 3"/>
      <line x1="4" y1="54" x2="36" y2="54" stroke="#d1d5db" strokeWidth="0.8"/>
    </svg>
  );
}

// Simple SVG objects for math activities
function SvgObject({ type, size = 36 }: { type: string; size?: number }) {
  const shapes: Record<string, React.ReactNode> = {
    star: (<g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="22,6 25,16 36,16 27,22 30,32 22,26 14,32 17,22 8,16 19,16"/></g>),
    flower: (<g stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round"><circle cx="22" cy="22" r="4"/>{[0,60,120,180,240,300].map((a,i)=>{const r=Math.PI*a/180,cx=22+8*Math.cos(r),cy=22+8*Math.sin(r);return <ellipse key={i} cx={cx} cy={cy} rx="4" ry="3" transform={`rotate(${a},${cx},${cy})`}/>;})}<line x1="22" y1="26" x2="22" y2="38"/></g>),
    sun: (<g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round"><circle cx="22" cy="22" r="7"/>{[0,45,90,135,180,225,270,315].map((a,i)=>{const rad=a*Math.PI/180;return <line key={i} x1={22+10*Math.cos(rad)} y1={22+10*Math.sin(rad)} x2={22+13*Math.cos(rad)} y2={22+13*Math.sin(rad)}/>;})}</g>),
    heart: (<g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 34 Q10 26 10 18 Q10 12 16 12 Q19 12 22 16 Q25 12 28 12 Q34 12 34 18 Q34 26 22 34Z"/></g>),
  };
  return (
    <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:size+8, height:size+8 }}>
      <svg width={size} height={size} viewBox="0 0 44 44">{shapes[type] || shapes.star}</svg>
    </div>
  );
}

// Daily activities per month (word + colorWord for preview)
const PREVIEW_ACTIVITIES: Record<string,{word:string,colorWord:string,instruction:string}[]> = {
  January:   [{word:"snow",colorWord:"blue",instruction:"Color the snowflake blue!"}],
  February:  [{word:"heart",colorWord:"red",instruction:"Color the big red heart!"}],
  March:     [{word:"flower",colorWord:"pink",instruction:"Color the flower garden!"}],
  April:     [{word:"egg",colorWord:"pink",instruction:"Color the Easter eggs bright colors!"}],
  May:       [{word:"mom",colorWord:"pink",instruction:"Color the Mother's Day card pink and gold!"}],
  June:      [{word:"beach",colorWord:"blue",instruction:"Color the beach yellow and the water blue!"}],
  July:      [{word:"flag",colorWord:"red",instruction:"Color the flag red, white, and blue!"}],
  August:    [{word:"backpack",colorWord:"blue",instruction:"Color the backpack any colors you like!"}],
  September: [{word:"leaf",colorWord:"orange",instruction:"Color the leaves red, orange, and yellow!"}],
  October:   [{word:"pumpkin",colorWord:"orange",instruction:"Color the pumpkin!"}],
  November:  [{word:"turkey",colorWord:"brown",instruction:"Color the turkey brown and the feathers colorful!"}],
  December:  [{word:"tree",colorWord:"green",instruction:"Color the Christmas tree!"}],
};

// Generic affirmations for preview (one per day-of-month)
const PREVIEW_AFFIRMATIONS: Record<number,{action:string,quote:string}> = {
  1:  { action:"Today is brand new — make it wonderful!", quote:"Every day is a new beginning." },
  2:  { action:"Say thank you to someone today.", quote:"Enjoy the little things." },
  3:  { action:"Take a deep breath and smile!", quote:"You are braver than you believe." },
  4:  { action:"Do one kind thing without being asked.", quote:"No act of kindness is ever wasted." },
  5:  { action:"Look outside — what do you notice today?", quote:"Look deep into nature." },
  6:  { action:"Help someone who needs it today!", quote:"We rise by lifting others." },
  7:  { action:"Be brave and try something new!", quote:"You can't use up creativity." },
  8:  { action:"Give a big hug to someone you love.", quote:"The best thing to hold onto is each other." },
  9:  { action:"Notice something beautiful today.", quote:"The world is full of magical things." },
  10: { action:"Share something with a friend!", quote:"Happiness is only real when shared." },
  11: { action:"Tell someone what you love about them.", quote:"Kind words echo forever." },
  12: { action:"Be patient — good things take time.", quote:"Patience is how you act while waiting." },
  13: { action:"Sing a song today, even a silly one!", quote:"Music gives wings to the mind." },
  14: { action:"Take a moment to rest today.", quote:"Almost everything works if you unplug a while." },
  15: { action:"Help without being asked.", quote:"The time is always right to do right." },
  16: { action:"Draw a picture for someone you love.", quote:"Every child is an artist." },
  17: { action:"Walk slowly and notice everything.", quote:"Not all those who wander are lost." },
  18: { action:"Say sorry if you need to.", quote:"It takes great bravery to do right." },
  19: { action:"Be kind to everyone you meet today.", quote:"Be the change you wish to see." },
  20: { action:"Do something that makes you laugh!", quote:"Good thoughts shine like sunbeams." },
  21: { action:"Help a grown-up with something today.", quote:"Walk in nature and receive gifts." },
  22: { action:"Find one thing to be grateful for.", quote:"When you are grateful, fear disappears." },
  23: { action:"Be a good listener today.", quote:"Two ears, one mouth — listen more." },
  24: { action:"Wrap yourself in something cozy!", quote:"Wherever you are, be all there." },
  25: { action:"Tell someone you are proud of them!", quote:"An appreciated person always does more." },
  26: { action:"Try your hardest today.", quote:"It always seems impossible until done." },
  27: { action:"Make someone smile on purpose!", quote:"Never underestimate the power of a smile." },
  28: { action:"Be gentle with yourself today.", quote:"You deserve your own love." },
  29: { action:"Look at the sky today.", quote:"The sky begins at your feet." },
  30: { action:"Do something helpful without being asked!", quote:"Contribute to making things better." },
  31: { action:"What was your favorite day this month?", quote:"Life is what happens while you plan." },
};

// ── Preview workbook page ──────────────────────────────────────────────────

function PreviewPage({ age }: { age: number }) {
  const today    = new Date();
  const monthIdx = today.getMonth();
  const day      = today.getDate();
  const month    = MONTH_NAMES[monthIdx];
  const dayName  = DAY_NAMES[today.getDay()];
  const year     = today.getFullYear();

  const activity    = PREVIEW_ACTIVITIES[month]?.[0] ?? { word:"star", colorWord:"yellow", instruction:"Color the stars!" };
  const affirmation = PREVIEW_AFFIRMATIONS[day] ?? PREVIEW_AFFIRMATIONS[1];

  const word     = activity.word;
  const traceSize = word.length <= 4 ? 30 : word.length <= 6 ? 24 : 20;

  // Math activity based on age
  const mathObjs = age <= 4 ? ["star","flower","heart"] : ["star","sun"];
  const mathCount = (day % 3) + 2;

  return (
    <div style={{
      background: "white",
      border: "1.5px solid #e5e7eb",
      borderRadius: 12,
      padding: "20px 22px",
      fontFamily: "Georgia, serif",
      maxWidth: 520,
      width: "100%",
      boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    }}>
      {/* Header */}
      <div style={{ textAlign:"center", borderBottom:"1.5px solid #e5e7eb", paddingBottom:10, marginBottom:14 }}>
        <div style={{ fontSize:13, fontWeight:"bold", color:"#1f2937", letterSpacing:1, textTransform:"uppercase" }}>
          Morning Workbook
        </div>
        <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>
          {dayName}, {month} {day}, {year}
        </div>
      </div>

      {/* Top row: Letter tracing + Color activity */}
      <div style={{ display:"flex", gap:12, marginBottom:12 }}>

        {/* Letter tracing */}
        <div style={{ flex:1, border:"1.5px solid #e5e7eb", borderRadius:8, padding:"10px 12px", background:"#fafaf9" }}>
          <div style={{ fontSize:9, fontWeight:"bold", color:"#374151", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
            {age <= 4 ? "Trace the letter" : "Trace the letters"}
          </div>
          {age <= 4 ? (
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
              <TraceLetter char={word[0].toUpperCase()} size={44}/>
              <TraceLetter char={word[0].toUpperCase()} size={44}/>
              <TraceLetter char={word[0].toUpperCase()} size={44}/>
            </div>
          ) : (
            <>
              <div style={{ fontSize:9, color:"#9ca3af", marginBottom:2 }}>uppercase</div>
              <TraceRow text={word.toUpperCase()} size={traceSize}/>
              <div style={{ fontSize:9, color:"#9ca3af", margin:"5px 0 2px" }}>lowercase</div>
              <TraceRow text={word.toLowerCase()} size={traceSize}/>
            </>
          )}
          <div style={{ fontSize:9, color:"#9ca3af", marginTop:6, marginBottom:2 }}>now write it</div>
          <RuledLine h={age <= 4 ? 52 : 40}/>
        </div>

        {/* Color activity */}
        <div style={{ flex:1, border:"1.5px solid #e5e7eb", borderRadius:8, padding:"10px 12px", background:"#fafaf9" }}>
          <div style={{ fontSize:9, fontWeight:"bold", color:"#374151", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
            Color Activity
          </div>
          <div style={{ fontSize:11, color:"#374151", marginBottom:8, lineHeight:1.4 }}>
            {activity.instruction}
          </div>
          {/* Placeholder image box */}
          <div style={{
            border: "1.5px dashed #c4b5a0",
            borderRadius: 6,
            height: 90,
            display:"flex", alignItems:"center", justifyContent:"center",
            background:"white",
          }}>
            <div style={{ fontSize:9, color:"#c4b5a0", textAlign:"center", lineHeight:1.5 }}>
              🎨<br/>Color {activity.colorWord}!
            </div>
          </div>
        </div>
      </div>

      {/* Math activity */}
      <div style={{ border:"1.5px solid #e5e7eb", borderRadius:8, padding:"10px 14px", background:"#fafaf9", marginBottom:12 }}>
        <div style={{ fontSize:9, fontWeight:"bold", color:"#374151", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
          {age <= 4 ? "Count and write the number" : "Addition"}
        </div>
        {age <= 4 ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
              {Array.from({length: mathCount}).map((_,i) =>
                <SvgObject key={i} type={mathObjs[i % mathObjs.length]} size={48}/>
              )}
            </div>
            <div style={{ fontSize:20, color:"#9ca3af" }}>=</div>
            <WriteBox size={46}/>
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <div style={{ display:"flex", gap:4, padding:"4px 8px", border:"1.5px solid #e5e7eb", borderRadius:6 }}>
              {Array.from({length:2}).map((_,i) => <SvgObject key={i} type="star" size={44}/>)}
            </div>
            <div style={{ fontSize:22, fontWeight:"bold", color:"#374151" }}>+</div>
            <div style={{ display:"flex", gap:4, padding:"4px 8px", border:"1.5px solid #e5e7eb", borderRadius:6 }}>
              {Array.from({length:3}).map((_,i) => <SvgObject key={i} type="flower" size={44}/>)}
            </div>
            <div style={{ fontSize:22, fontWeight:"bold", color:"#374151" }}>=</div>
            <WriteBox size={46}/>
          </div>
        )}
      </div>

      {/* Footer affirmation */}
      <div style={{
        borderTop: "1.5px solid #e5e7eb",
        paddingTop: 10,
        textAlign: "center",
      }}>
        {day % 2 === 1 ? (
          <div style={{ fontSize:12, fontWeight:"bold", color:"#1f2937" }}>
            ✨ {affirmation.action}
          </div>
        ) : (
          <div style={{ fontSize:11, fontStyle:"italic", color:"#6b7280" }}>
            "{affirmation.quote}"
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main LandingPage component ─────────────────────────────────────────────

export default function LandingPage() {
  const [age, setAge] = useState<number>(4);

  const today    = new Date();
  const month    = MONTH_NAMES[today.getMonth()];
  const day      = today.getDate();
  const dayName  = DAY_NAMES[today.getDay()];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0e8",
      fontFamily: "Georgia, serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>

      {/* ── Nav ── */}
      <nav style={{
        width: "100%",
        background: "#faf6ef",
        borderBottom: "1px solid #e8e0d0",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:22 }}>📖</span>
          <div>
            <div style={{ fontSize:16, fontWeight:"bold", color:"#1f2937" }}>Morning Workbooks</div>
            <div style={{ fontSize:10, color:"#9ca3af", marginTop:-2 }}>for little ones ages 3–6</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <SignInButton mode="modal">
            <button style={{
              padding:"8px 18px", fontSize:13, borderRadius:8,
              border:"1.5px solid #c4b5a0", background:"white",
              color:"#374151", cursor:"pointer", fontFamily:"Georgia, serif",
            }}>
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={{
              padding:"8px 18px", fontSize:13, borderRadius:8,
              border:"none", background:"#1f2937",
              color:"white", cursor:"pointer", fontWeight:"bold",
              fontFamily:"Georgia, serif",
            }}>
              Get Started Free
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        textAlign: "center",
        padding: "36px 24px 20px",
        maxWidth: 560,
      }}>
        <div style={{ fontSize:13, color:"#9ca3af", textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>
          {dayName}, {month} {day}
        </div>
        <h1 style={{
          fontSize: 28, fontWeight:"bold", color:"#1f2937",
          margin:"0 0 12px", lineHeight:1.3,
        }}>
          A fresh workbook, every single morning
        </h1>
        <p style={{
          fontSize:14, color:"#6b7280", lineHeight:1.7,
          margin:"0 0 24px",
        }}>
          Personalized letter tracing, math, and coloring activities — tailored to your child's age and today's date. Something to do at breakfast instead of screens.
        </p>

        {/* Age picker */}
        <div style={{
          display:"inline-flex", gap:0,
          border:"1.5px solid #c4b5a0", borderRadius:10,
          overflow:"hidden", marginBottom:28,
          background:"white",
        }}>
          <button
            onClick={() => setAge(4)}
            style={{
              padding:"10px 22px", fontSize:13, border:"none",
              background: age <= 4 ? "#1f2937" : "white",
              color: age <= 4 ? "white" : "#374151",
              cursor:"pointer", fontFamily:"Georgia, serif",
              fontWeight: age <= 4 ? "bold" : "normal",
            }}>
            Ages 3–4
          </button>
          <button
            onClick={() => setAge(5)}
            style={{
              padding:"10px 22px", fontSize:13, border:"none",
              borderLeft:"1.5px solid #c4b5a0",
              background: age >= 5 ? "#1f2937" : "white",
              color: age >= 5 ? "white" : "#374151",
              cursor:"pointer", fontFamily:"Georgia, serif",
              fontWeight: age >= 5 ? "bold" : "normal",
            }}>
            Ages 5–6
          </button>
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div style={{ width:"100%", display:"flex", justifyContent:"center", padding:"0 16px", boxSizing:"border-box" }}>
        <PreviewPage age={age}/>
      </div>

      {/* ── CTA nudge ── */}
      <div style={{
        margin: "32px 16px 48px",
        background: "#faf6ef",
        border: "1.5px solid #e8e0d0",
        borderRadius: 12,
        padding: "24px 28px",
        maxWidth: 520,
        width:"100%",
        textAlign:"center",
        boxSizing:"border-box",
      }}>
        <div style={{ fontSize:18, fontWeight:"bold", color:"#1f2937", marginBottom:8 }}>
          Want to save your child's profile?
        </div>
        <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.6, marginBottom:20 }}>
          Create a free account to save profiles for up to 5 children. Download PDFs for $4.99/month, or get a printed book delivered to your door.
        </div>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <SignUpButton mode="modal">
            <button style={{
              padding:"12px 28px", fontSize:14, fontWeight:"bold",
              borderRadius:10, border:"none", background:"#1f2937",
              color:"white", cursor:"pointer", fontFamily:"Georgia, serif",
            }}>
              Create Free Account
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button style={{
              padding:"12px 24px", fontSize:14,
              borderRadius:10, border:"1.5px solid #c4b5a0",
              background:"white", color:"#374151",
              cursor:"pointer", fontFamily:"Georgia, serif",
            }}>
              Sign In
            </button>
          </SignInButton>
        </div>
        <div style={{ fontSize:11, color:"#c4b5a0", marginTop:14 }}>
          Free accounts — no credit card required
        </div>
      </div>

      {/* ── Pricing pills ── */}
      <div style={{
        display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center",
        padding:"0 16px 48px", maxWidth:560,
      }}>
        {[
          { label:"Free", desc:"Preview + save profiles", highlight:false },
          { label:"$4.99/mo", desc:"Unlimited PDF downloads", highlight:true },
          { label:"$19.99/mo", desc:"PDFs + printed book/month", highlight:false },
        ].map((tier,i) => (
          <div key={i} style={{
            padding:"14px 20px", borderRadius:10, textAlign:"center",
            border: tier.highlight ? "2px solid #1f2937" : "1.5px solid #e8e0d0",
            background: tier.highlight ? "#1f2937" : "white",
            minWidth:140,
          }}>
            <div style={{ fontSize:17, fontWeight:"bold", color: tier.highlight ? "white" : "#1f2937" }}>
              {tier.label}
            </div>
            <div style={{ fontSize:11, color: tier.highlight ? "#d1d5db" : "#6b7280", marginTop:4 }}>
              {tier.desc}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
