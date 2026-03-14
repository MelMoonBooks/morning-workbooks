import React, { useState, useEffect } from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

// ── Constants ──────────────────────────────────────────────────────────────
const MONTH_NAMES = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];
const DAY_NAMES   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ── Shared drawing primitives (copied from App.tsx) ────────────────────────
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

function TraceLetter({ char, size=34 }: { char:string; size?:number }) {
  const path = LETTER_PATHS[char] ?? LETTER_PATHS[char.toUpperCase()] ?? "";
  const hasDesc = DESCENDERS.has(char);
  const vbH = hasDesc ? 72 : 56;
  const h = Math.round(size * (vbH / 40));
  return (
    <svg width={size} height={h} viewBox={`0 0 40 ${vbH}`} style={{display:"block"}}>
      <line x1="0" y1="2"  x2="40" y2="2"  stroke="#d1d5db" strokeWidth="1"/>
      <line x1="0" y1="28" x2="40" y2="28" stroke="#d1d5db" strokeWidth="0.8" strokeDasharray="4 3"/>
      <line x1="0" y1="54" x2="40" y2="54" stroke="#d1d5db" strokeWidth="1"/>
      {path && <path d={path} fill="none" stroke="#b0b0b0" strokeWidth="2.8"
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5"/>}
    </svg>
  );
}
function TraceRow({ text, size=30 }: { text:string; size?:number }) {
  return (
    <div style={{display:"flex", gap:3, flexWrap:"wrap"}}>
      {text.split("").map((c,i) => <TraceLetter key={i} char={c} size={size}/>)}
    </div>
  );
}
function RuledLine({ h=44 }: { h?:number }) {
  return (
    <svg width="100%" height={h} style={{display:"block"}}>
      <line x1="0" y1="1"   x2="100%" y2="1"   stroke="#9ca3af" strokeWidth="1.4"/>
      <line x1="0" y1={h/2} x2="100%" y2={h/2} stroke="#c4b5a0" strokeWidth="1" strokeDasharray="6 4"/>
      <line x1="0" y1={h-1} x2="100%" y2={h-1} stroke="#9ca3af" strokeWidth="1.4"/>
    </svg>
  );
}
function WriteBox({ size=44 }: { size?:number }) {
  const h = Math.round(size * 1.4);
  return (
    <svg width={size} height={h} viewBox="0 0 40 56" style={{display:"block"}}>
      <rect x="1" y="1" width="38" height="54" rx="3" fill="none" stroke="#d1d5db" strokeWidth="1.2" strokeDasharray="4 3"/>
      <line x1="4" y1="2"  x2="36" y2="2"  stroke="#d1d5db" strokeWidth="0.8"/>
      <line x1="4" y1="28" x2="36" y2="28" stroke="#d1d5db" strokeWidth="0.6" strokeDasharray="3 3"/>
      <line x1="4" y1="54" x2="36" y2="54" stroke="#d1d5db" strokeWidth="0.8"/>
    </svg>
  );
}
function SvgObject({ type, size=36 }: { type:string; size?:number }) {
  const shapes: Record<string,React.ReactNode> = {
    star:   <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="22,6 25,16 36,16 27,22 30,32 22,26 14,32 17,22 8,16 19,16"/></g>,
    flower: <g stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round"><circle cx="22" cy="22" r="4"/>{[0,60,120,180,240,300].map((a,i)=>{const r=Math.PI*a/180,cx=22+8*Math.cos(r),cy=22+8*Math.sin(r);return <ellipse key={i} cx={cx} cy={cy} rx="4" ry="3" transform={`rotate(${a},${cx},${cy})`}/>;})}<line x1="22" y1="26" x2="22" y2="38"/></g>,
    sun:    <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round"><circle cx="22" cy="22" r="7"/>{[0,45,90,135,180,225,270,315].map((a,i)=>{const rad=a*Math.PI/180;return <line key={i} x1={22+10*Math.cos(rad)} y1={22+10*Math.sin(rad)} x2={22+13*Math.cos(rad)} y2={22+13*Math.sin(rad)}/>;})}</g>,
    heart:  <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 34 Q10 26 10 18 Q10 12 16 12 Q19 12 22 16 Q25 12 28 12 Q34 12 34 18 Q34 26 22 34Z"/></g>,
    apple:  <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10 Q10 10 8 20 Q6 32 12 38 Q15 42 18 42 Q21 42 24 38 Q30 32 28 20 Q26 10 18 10Z"/><path d="M18 10 Q18 6 22 4"/></g>,
    pumpkin:<g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 Q22 6 26 6"/><path d="M14 14 Q8 14 8 22 Q8 32 14 34 Q18 36 22 34 Q26 36 30 34 Q36 32 36 22 Q36 14 30 14 Q26 14 22 16 Q18 14 14 14Z"/><line x1="22" y1="14" x2="22" y2="34"/></g>,
  };
  return (
    <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:size+8,height:size+8}}>
      <svg width={size} height={size} viewBox="0 0 44 44">{shapes[type]||shapes.star}</svg>
    </div>
  );
}

// ── Activity data ──────────────────────────────────────────────────────────
const DAILY_ACTIVITIES: Record<string,{word:string,colorWord:string,instruction:string,subject:string}[]> = {
  January:   [{word:"snow",colorWord:"blue",instruction:"Color the snowflake blue!",subject:"a snowflake"},{word:"penguin",colorWord:"black",instruction:"Color the penguin!",subject:"a penguin"},{word:"mittens",colorWord:"red",instruction:"Color the mittens red!",subject:"mittens"},{word:"sled",colorWord:"red",instruction:"Color the sled red!",subject:"a sled"},{word:"snowman",colorWord:"white",instruction:"Color the snowman!",subject:"a snowman"},{word:"owl",colorWord:"white",instruction:"Color the snowy owl white!",subject:"a snowy owl"},{word:"fox",colorWord:"white",instruction:"Color the arctic fox!",subject:"an arctic fox"},{word:"star",colorWord:"yellow",instruction:"Color the winter stars yellow!",subject:"stars in the winter sky"},{word:"moon",colorWord:"yellow",instruction:"Color the moon yellow!",subject:"a winter moon"},{word:"pine",colorWord:"green",instruction:"Color the pine tree green!",subject:"a pine tree"},{word:"deer",colorWord:"brown",instruction:"Color the deer brown!",subject:"a deer in the snow"},{word:"bird",colorWord:"red",instruction:"Color the winter bird red!",subject:"a winter bird"},{word:"cocoa",colorWord:"brown",instruction:"Color the cocoa mug!",subject:"a mug of hot cocoa"},{word:"cloud",colorWord:"grey",instruction:"Color the snow clouds grey!",subject:"snow clouds"},{word:"cabin",colorWord:"brown",instruction:"Color the cozy cabin!",subject:"a cozy cabin"},{word:"robin",colorWord:"red",instruction:"Color the robin's chest red!",subject:"a robin"},{word:"crystal",colorWord:"blue",instruction:"Color the ice crystals light blue!",subject:"ice crystals"},{word:"polar",colorWord:"white",instruction:"Color the polar bear white!",subject:"a polar bear"},{word:"rabbit",colorWord:"white",instruction:"Color the snow rabbit white!",subject:"a snow rabbit"},{word:"wolf",colorWord:"grey",instruction:"Color the wolf grey!",subject:"a wolf howling"},{word:"frost",colorWord:"blue",instruction:"Color the frost patterns blue!",subject:"a frosty window"},{word:"igloo",colorWord:"white",instruction:"Color the igloo white!",subject:"an igloo"},{word:"boot",colorWord:"red",instruction:"Color the boots any colors you like!",subject:"snow boots"},{word:"flake",colorWord:"blue",instruction:"Color the snowflakes blue!",subject:"snowflakes"},{word:"ice",colorWord:"blue",instruction:"Color the ice skater!",subject:"an ice skater"},{word:"scarf",colorWord:"purple",instruction:"Color the scarf any colors you like!",subject:"a scarf"},{word:"hat",colorWord:"blue",instruction:"Color the hat blue!",subject:"a winter hat"},{word:"hope",colorWord:"gold",instruction:"Color the January sunrise!",subject:"a sunrise"},{word:"seed",colorWord:"brown",instruction:"Color the seeds and soil!",subject:"seeds in the ground"},{word:"sleep",colorWord:"brown",instruction:"Color the sleeping bear!",subject:"a sleeping bear"},{word:"year",colorWord:"gold",instruction:"Color the New Year banner!",subject:"a new year banner"}],
  February:  [{word:"heart",colorWord:"red",instruction:"Color the big red heart!",subject:"a big red heart"},{word:"rose",colorWord:"red",instruction:"Color the roses red!",subject:"roses"},{word:"card",colorWord:"pink",instruction:"Color the Valentine card!",subject:"a Valentine card"},{word:"bear",colorWord:"brown",instruction:"Color the teddy bear!",subject:"a teddy bear"},{word:"flower",colorWord:"pink",instruction:"Color the pink flowers!",subject:"pink flowers"},{word:"balloon",colorWord:"red",instruction:"Color the heart balloons!",subject:"heart balloons"},{word:"cupcake",colorWord:"pink",instruction:"Color the cupcake!",subject:"a cupcake"},{word:"bird",colorWord:"red",instruction:"Color the birds sharing a heart!",subject:"birds sharing a heart"},{word:"crown",colorWord:"purple",instruction:"Color the hearts purple and gold!",subject:"a crown"},{word:"letter",colorWord:"red",instruction:"Color the love letter!",subject:"a love letter"},{word:"cookie",colorWord:"pink",instruction:"Color the Valentine cookies!",subject:"Valentine cookies"},{word:"family",colorWord:"red",instruction:"Color the family portrait!",subject:"a family portrait"},{word:"kite",colorWord:"red",instruction:"Color the heart kite!",subject:"a heart kite"},{word:"rainbow",colorWord:"purple",instruction:"Color the rainbow with hearts!",subject:"a rainbow with hearts"},{word:"garden",colorWord:"pink",instruction:"Color the heart garden!",subject:"a heart garden"},{word:"friend",colorWord:"pink",instruction:"Color the flowers for a friend!",subject:"flowers for a friend"},{word:"mobile",colorWord:"purple",instruction:"Color the heart mobile!",subject:"a heart mobile"},{word:"castle",colorWord:"pink",instruction:"Color the pink castle!",subject:"a pink castle"},{word:"island",colorWord:"blue",instruction:"Color the heart-shaped island!",subject:"a heart-shaped island"},{word:"love",colorWord:"red",instruction:"Color the big Valentine heart!",subject:"a big Valentine heart"},{word:"kindness",colorWord:"green",instruction:"Color the kindness tree!",subject:"a kindness tree"},{word:"bracelet",colorWord:"purple",instruction:"Color the friendship bracelets!",subject:"friendship bracelets"},{word:"mailbox",colorWord:"red",instruction:"Color the mailbox red with hearts!",subject:"a mailbox"},{word:"wreath",colorWord:"red",instruction:"Color the heart wreath!",subject:"a heart wreath"},{word:"tree",colorWord:"pink",instruction:"Color the Valentine tree!",subject:"a Valentine tree"},{word:"butterfly",colorWord:"pink",instruction:"Color the butterflies!",subject:"butterflies"},{word:"lovebird",colorWord:"red",instruction:"Color the love birds!",subject:"love birds"},{word:"hearts",colorWord:"pink",instruction:"Color the hearts red and pink!",subject:"hearts"}],
  March:     [{word:"flower",colorWord:"pink",instruction:"Color the flower garden!",subject:"a flower garden"},{word:"tulip",colorWord:"red",instruction:"Color the tulips red!",subject:"tulips"},{word:"butterfly",colorWord:"orange",instruction:"Color the butterfly!",subject:"a butterfly"},{word:"rainbow",colorWord:"purple",instruction:"Color the rainbow!",subject:"a rainbow"},{word:"bird",colorWord:"yellow",instruction:"Color the spring birds!",subject:"spring birds"},{word:"chick",colorWord:"yellow",instruction:"Color the baby chicks yellow!",subject:"baby chicks"},{word:"kite",colorWord:"red",instruction:"Color the kite!",subject:"a kite"},{word:"shamrock",colorWord:"green",instruction:"Color the shamrock green!",subject:"a shamrock"},{word:"blossom",colorWord:"pink",instruction:"Color the spring tree pink!",subject:"a spring tree"},{word:"fish",colorWord:"orange",instruction:"Color the fish!",subject:"fish in the sea"},{word:"bunny",colorWord:"pink",instruction:"Color the bunny!",subject:"a bunny"},{word:"ladybug",colorWord:"red",instruction:"Color the ladybug red!",subject:"a ladybug"},{word:"duck",colorWord:"yellow",instruction:"Color the pond with ducks!",subject:"ducks on a pond"},{word:"bee",colorWord:"yellow",instruction:"Color the bee and flowers!",subject:"a bee and flowers"},{word:"lamb",colorWord:"white",instruction:"Color the baby animals!",subject:"baby animals"},{word:"rain",colorWord:"blue",instruction:"Color the spring rain!",subject:"spring rain and rainbow"},{word:"garden",colorWord:"green",instruction:"Color the garden!",subject:"a garden"},{word:"petal",colorWord:"pink",instruction:"Color the flowers pink!",subject:"flowers"},{word:"caterpillar",colorWord:"green",instruction:"Color the caterpillar!",subject:"a caterpillar"},{word:"wave",colorWord:"blue",instruction:"Color the ocean waves!",subject:"ocean waves"},{word:"beach",colorWord:"blue",instruction:"Color the beach scene!",subject:"a beach scene"},{word:"turtle",colorWord:"green",instruction:"Color the sea turtle!",subject:"a sea turtle"},{word:"plumeria",colorWord:"pink",instruction:"Color the plumeria flowers!",subject:"plumeria flowers"},{word:"picnic",colorWord:"green",instruction:"Color the spring picnic!",subject:"a spring picnic"},{word:"sunset",colorWord:"orange",instruction:"Color the Hawaiian sunset!",subject:"a Hawaiian sunset"},{word:"hula",colorWord:"purple",instruction:"Color the hula dancer!",subject:"a hula dancer"},{word:"sand",colorWord:"blue",instruction:"Color the wave blue and sand yellow!",subject:"waves and sand"},{word:"spring",colorWord:"pink",instruction:"Color the spring scene!",subject:"a spring scene"},{word:"Holi",colorWord:"purple",instruction:"Color the Holi colors!",subject:"Holi colors"},{word:"apple",colorWord:"red",instruction:"Color the apple!",subject:"an apple"},{word:"sun",colorWord:"yellow",instruction:"Color the bright sun!",subject:"the bright spring sun"}],
  April:     [{word:"egg",colorWord:"pink",instruction:"Color the Easter eggs!",subject:"Easter eggs"},{word:"bunny",colorWord:"pink",instruction:"Color the Easter bunny!",subject:"an Easter bunny"},{word:"chick",colorWord:"yellow",instruction:"Color the baby chicks!",subject:"baby chicks"},{word:"cross",colorWord:"gold",instruction:"Color the Easter cross!",subject:"an Easter cross"},{word:"basket",colorWord:"yellow",instruction:"Color the Easter basket!",subject:"an Easter basket"},{word:"lamb",colorWord:"white",instruction:"Color the baby lamb!",subject:"a baby lamb"},{word:"tulip",colorWord:"red",instruction:"Color the tulips!",subject:"tulips"},{word:"rain",colorWord:"blue",instruction:"Color the April rain!",subject:"April rain"},{word:"robin",colorWord:"red",instruction:"Color the robin!",subject:"a robin"},{word:"butterfly",colorWord:"orange",instruction:"Color the butterfly!",subject:"a butterfly"},{word:"daisy",colorWord:"white",instruction:"Color the daisies!",subject:"daisies"},{word:"nest",colorWord:"brown",instruction:"Color the nest!",subject:"a bird nest with eggs"},{word:"frog",colorWord:"green",instruction:"Color the frog!",subject:"a frog on a lily pad"},{word:"cloud",colorWord:"blue",instruction:"Color the spring clouds!",subject:"spring clouds"},{word:"duckling",colorWord:"yellow",instruction:"Color the ducklings!",subject:"ducklings"},{word:"rainbow",colorWord:"purple",instruction:"Color the rainbow!",subject:"a spring rainbow"},{word:"kite",colorWord:"red",instruction:"Color the kite!",subject:"a kite"},{word:"earth",colorWord:"green",instruction:"Color the earth!",subject:"the earth"},{word:"bee",colorWord:"yellow",instruction:"Color the bee on a flower!",subject:"a bee on a flower"},{word:"blossom",colorWord:"pink",instruction:"Color the cherry blossoms!",subject:"cherry blossoms"},{word:"snail",colorWord:"brown",instruction:"Color the snail!",subject:"a snail"},{word:"ladybug",colorWord:"red",instruction:"Color the ladybug!",subject:"a ladybug"},{word:"iris",colorWord:"purple",instruction:"Color the irises purple!",subject:"irises"},{word:"sprout",colorWord:"green",instruction:"Color the sprout!",subject:"a seedling sprouting"},{word:"pond",colorWord:"blue",instruction:"Color the spring pond!",subject:"a spring pond"},{word:"worm",colorWord:"pink",instruction:"Color the worm!",subject:"a worm in the rain"},{word:"garden",colorWord:"green",instruction:"Color the spring garden!",subject:"a spring garden"},{word:"lily",colorWord:"white",instruction:"Color the Easter lilies!",subject:"Easter lilies"},{word:"palm",colorWord:"green",instruction:"Color the palm branches!",subject:"palm branches"},{word:"mud",colorWord:"brown",instruction:"Color the muddy boots!",subject:"muddy boots"}],
  May:       [{word:"mom",colorWord:"pink",instruction:"Color the Mother's Day card!",subject:"a Mother's Day card"},{word:"rose",colorWord:"red",instruction:"Color the roses red!",subject:"roses"},{word:"sun",colorWord:"yellow",instruction:"Color the sun yellow!",subject:"the bright May sun"},{word:"flower",colorWord:"pink",instruction:"Color the bouquet!",subject:"a bouquet of flowers"},{word:"butterfly",colorWord:"orange",instruction:"Color the butterflies!",subject:"a butterfly garden"},{word:"garden",colorWord:"green",instruction:"Color the garden!",subject:"a flower garden"},{word:"bee",colorWord:"yellow",instruction:"Color the honeybee!",subject:"a honeybee"},{word:"crown",colorWord:"pink",instruction:"Color the flower crown!",subject:"a flower crown"},{word:"heart",colorWord:"red",instruction:"Color the flower heart!",subject:"a heart made of flowers"},{word:"gift",colorWord:"purple",instruction:"Color the gift for mom!",subject:"a gift for mom"},{word:"tree",colorWord:"green",instruction:"Color the tree in bloom!",subject:"a tree in bloom"},{word:"ladybug",colorWord:"red",instruction:"Color the ladybug!",subject:"a ladybug"},{word:"rainbow",colorWord:"purple",instruction:"Color the rainbow!",subject:"a spring rainbow"},{word:"daisy",colorWord:"white",instruction:"Color the daisies!",subject:"daisies in a field"},{word:"kite",colorWord:"red",instruction:"Color the kites!",subject:"kites in the sky"},{word:"snail",colorWord:"green",instruction:"Color the snail on a leaf!",subject:"a snail on a leaf"},{word:"frog",colorWord:"green",instruction:"Color the frog!",subject:"a frog"},{word:"pond",colorWord:"blue",instruction:"Color the pond with ducks!",subject:"a pond with ducks"},{word:"dandelion",colorWord:"yellow",instruction:"Color the dandelions!",subject:"dandelions"},{word:"strawberry",colorWord:"red",instruction:"Color the strawberries!",subject:"strawberries"},{word:"dragonfly",colorWord:"blue",instruction:"Color the dragonfly!",subject:"a dragonfly"},{word:"caterpillar",colorWord:"green",instruction:"Color the caterpillar!",subject:"a caterpillar"},{word:"cloud",colorWord:"blue",instruction:"Color the fluffy clouds!",subject:"fluffy clouds"},{word:"turtle",colorWord:"green",instruction:"Color the sea turtle!",subject:"a sea turtle"},{word:"lily",colorWord:"white",instruction:"Color the lily of the valley!",subject:"lily of the valley"},{word:"basket",colorWord:"brown",instruction:"Color the picnic basket!",subject:"a picnic basket"},{word:"bird",colorWord:"brown",instruction:"Color the mama bird!",subject:"a mother bird and nest"},{word:"hug",colorWord:"pink",instruction:"Color the hug scene!",subject:"a mother and child hug"},{word:"pencil",colorWord:"yellow",instruction:"Color the pencils yellow!",subject:"pencils and crayons"},{word:"school",colorWord:"red",instruction:"Color the schoolhouse!",subject:"a schoolhouse"},{word:"summer",colorWord:"yellow",instruction:"Color the summer scene!",subject:"a summer scene"}],
  June:      [{word:"beach",colorWord:"blue",instruction:"Color the beach scene!",subject:"a beach scene"},{word:"wave",colorWord:"blue",instruction:"Color the ocean waves!",subject:"ocean waves"},{word:"shell",colorWord:"pink",instruction:"Color the seashells!",subject:"seashells"},{word:"crab",colorWord:"red",instruction:"Color the crab red!",subject:"a crab"},{word:"fish",colorWord:"orange",instruction:"Color the fish bright colors!",subject:"colorful fish"},{word:"sun",colorWord:"yellow",instruction:"Color the summer sun!",subject:"the summer sun"},{word:"starfish",colorWord:"orange",instruction:"Color the starfish!",subject:"a starfish"},{word:"turtle",colorWord:"green",instruction:"Color the sea turtle!",subject:"a sea turtle"},{word:"lei",colorWord:"pink",instruction:"Color the lei!",subject:"a Hawaiian lei"},{word:"hula",colorWord:"green",instruction:"Color the hula dancer!",subject:"a hula dancer"},{word:"plumeria",colorWord:"pink",instruction:"Color the plumeria!",subject:"plumeria flowers"},{word:"rainbow",colorWord:"purple",instruction:"Color the rainbow!",subject:"a Hawaiian rainbow"},{word:"palm",colorWord:"green",instruction:"Color the palm trees!",subject:"palm trees"},{word:"icecream",colorWord:"pink",instruction:"Color the ice cream!",subject:"an ice cream cone"},{word:"dolphin",colorWord:"blue",instruction:"Color the dolphin!",subject:"a dolphin"},{word:"sunset",colorWord:"orange",instruction:"Color the ocean sunset!",subject:"an ocean sunset"},{word:"cloud",colorWord:"blue",instruction:"Color the summer clouds!",subject:"summer clouds"},{word:"whale",colorWord:"blue",instruction:"Color the whale!",subject:"a whale"},{word:"pineapple",colorWord:"yellow",instruction:"Color the pineapple!",subject:"a pineapple"},{word:"mango",colorWord:"orange",instruction:"Color the mangoes!",subject:"mangoes"},{word:"coral",colorWord:"pink",instruction:"Color the coral reef!",subject:"coral reef"},{word:"flower",colorWord:"red",instruction:"Color the tropical flowers!",subject:"tropical flowers"},{word:"sand",colorWord:"yellow",instruction:"Color the sandcastles!",subject:"sandcastles"},{word:"seagull",colorWord:"white",instruction:"Color the seagulls!",subject:"seagulls"},{word:"anchor",colorWord:"blue",instruction:"Color the anchor!",subject:"an anchor"},{word:"aloha",colorWord:"gold",instruction:"Color the aloha sunset!",subject:"an aloha sunset"},{word:"hermit",colorWord:"red",instruction:"Color the hermit crab!",subject:"a hermit crab"},{word:"moonfish",colorWord:"yellow",instruction:"Color the moonfish!",subject:"a moonfish"},{word:"freedom",colorWord:"red",instruction:"Color the Juneteenth flag!",subject:"a Juneteenth flag"},{word:"father",colorWord:"blue",instruction:"Color the dad and child!",subject:"a dad turtle with baby"}],
  July:      [{word:"flag",colorWord:"red",instruction:"Color the American flag!",subject:"an American flag"},{word:"star",colorWord:"blue",instruction:"Color the stars!",subject:"stars"},{word:"fireworks",colorWord:"red",instruction:"Color the fireworks!",subject:"fireworks"},{word:"eagle",colorWord:"brown",instruction:"Color the bald eagle!",subject:"a bald eagle"},{word:"watermelon",colorWord:"red",instruction:"Color the watermelon!",subject:"a watermelon"},{word:"beach",colorWord:"blue",instruction:"Color the summer beach!",subject:"a summer beach"},{word:"sun",colorWord:"yellow",instruction:"Color the sun bright yellow!",subject:"the hot July sun"},{word:"fish",colorWord:"orange",instruction:"Color the tropical fish!",subject:"tropical fish"},{word:"turtle",colorWord:"green",instruction:"Color the sea turtle!",subject:"a sea turtle"},{word:"dolphin",colorWord:"grey",instruction:"Color the dolphin!",subject:"a jumping dolphin"},{word:"shell",colorWord:"pink",instruction:"Color the seashells!",subject:"seashells"},{word:"icecream",colorWord:"pink",instruction:"Color the ice cream!",subject:"ice cream"},{word:"pineapple",colorWord:"yellow",instruction:"Color the pineapple!",subject:"a pineapple"},{word:"lei",colorWord:"pink",instruction:"Color the flower lei!",subject:"a flower lei"},{word:"sunset",colorWord:"orange",instruction:"Color the summer sunset!",subject:"a summer sunset"},{word:"sandcastle",colorWord:"yellow",instruction:"Color the sandcastle!",subject:"a sandcastle"},{word:"butterfly",colorWord:"purple",instruction:"Color the butterfly!",subject:"a butterfly"},{word:"sunflower",colorWord:"yellow",instruction:"Color the sunflowers!",subject:"sunflowers"},{word:"berry",colorWord:"red",instruction:"Color the berries!",subject:"berries"},{word:"lemonade",colorWord:"yellow",instruction:"Color the lemonade stand!",subject:"a lemonade stand"},{word:"kite",colorWord:"red",instruction:"Color the kites!",subject:"kites in a blue sky"},{word:"cloud",colorWord:"blue",instruction:"Color the summer clouds!",subject:"summer clouds"},{word:"lily",colorWord:"pink",instruction:"Color the water lilies!",subject:"water lilies"},{word:"firefly",colorWord:"yellow",instruction:"Color the fireflies!",subject:"fireflies at night"},{word:"corn",colorWord:"yellow",instruction:"Color the corn!",subject:"corn on the cob"},{word:"garden",colorWord:"green",instruction:"Color the summer garden!",subject:"a summer garden"},{word:"wave",colorWord:"blue",instruction:"Color the big ocean waves!",subject:"big ocean waves"},{word:"crab",colorWord:"orange",instruction:"Color the crab!",subject:"a crab on the beach"},{word:"freedom",colorWord:"blue",instruction:"Color the 4th of July scene!",subject:"a 4th of July scene"},{word:"summer",colorWord:"orange",instruction:"Color the summer fun scene!",subject:"a summer fun scene"},{word:"parade",colorWord:"red",instruction:"Color the parade floats!",subject:"a parade"}],
  August:    [{word:"backpack",colorWord:"blue",instruction:"Color the backpack!",subject:"a backpack"},{word:"pencil",colorWord:"yellow",instruction:"Color the pencils yellow!",subject:"pencils"},{word:"book",colorWord:"red",instruction:"Color the books!",subject:"books"},{word:"apple",colorWord:"red",instruction:"Color the apple red!",subject:"an apple for the teacher"},{word:"school",colorWord:"red",instruction:"Color the schoolhouse!",subject:"a schoolhouse"},{word:"bus",colorWord:"yellow",instruction:"Color the bus yellow!",subject:"a school bus"},{word:"crayon",colorWord:"red",instruction:"Color the crayons!",subject:"crayons"},{word:"ruler",colorWord:"yellow",instruction:"Color the ruler yellow!",subject:"a ruler"},{word:"beach",colorWord:"blue",instruction:"Color the beach!",subject:"a last summer beach day"},{word:"sun",colorWord:"yellow",instruction:"Color the sun golden!",subject:"the late summer sun"},{word:"sunflower",colorWord:"yellow",instruction:"Color the sunflowers!",subject:"sunflowers"},{word:"corn",colorWord:"yellow",instruction:"Color the cornfield!",subject:"a cornfield"},{word:"butterfly",colorWord:"orange",instruction:"Color the butterfly!",subject:"a butterfly"},{word:"dragonfly",colorWord:"blue",instruction:"Color the dragonfly!",subject:"a dragonfly"},{word:"garden",colorWord:"green",instruction:"Color the summer garden!",subject:"a summer garden"},{word:"fish",colorWord:"orange",instruction:"Color the fish!",subject:"fish in a pond"},{word:"frog",colorWord:"green",instruction:"Color the frog!",subject:"a frog"},{word:"melon",colorWord:"red",instruction:"Color the watermelon!",subject:"a watermelon"},{word:"berry",colorWord:"blue",instruction:"Color the blueberries!",subject:"blueberries"},{word:"peach",colorWord:"orange",instruction:"Color the peaches!",subject:"peaches"},{word:"leaf",colorWord:"green",instruction:"Color the first falling leaves!",subject:"first falling leaves"},{word:"acorn",colorWord:"brown",instruction:"Color the acorns!",subject:"acorns"},{word:"bee",colorWord:"yellow",instruction:"Color the bee!",subject:"a bee"},{word:"grasshopper",colorWord:"green",instruction:"Color the grasshopper!",subject:"a grasshopper"},{word:"scissors",colorWord:"red",instruction:"Color the scissors handles!",subject:"school scissors"},{word:"glue",colorWord:"purple",instruction:"Color the glue stick!",subject:"a glue stick"},{word:"notebook",colorWord:"blue",instruction:"Color the notebook!",subject:"a notebook"},{word:"friend",colorWord:"pink",instruction:"Color the school friends!",subject:"friends at school"},{word:"summer",colorWord:"yellow",instruction:"Color your favorite summer memory!",subject:"a summer memory"},{word:"spider",colorWord:"white",instruction:"Color the web and dew drops!",subject:"a spider web with dew"},{word:"cloud",colorWord:"blue",instruction:"Color the late summer clouds!",subject:"late summer clouds"}],
  September: [{word:"leaf",colorWord:"orange",instruction:"Color the autumn leaves!",subject:"autumn leaves"},{word:"acorn",colorWord:"brown",instruction:"Color the acorns brown!",subject:"acorns"},{word:"apple",colorWord:"red",instruction:"Color the apples red!",subject:"apples on a tree"},{word:"school",colorWord:"red",instruction:"Color the school scene!",subject:"a school scene"},{word:"bus",colorWord:"yellow",instruction:"Color the bus yellow!",subject:"a school bus"},{word:"squirrel",colorWord:"brown",instruction:"Color the squirrel brown!",subject:"a squirrel with a nut"},{word:"mushroom",colorWord:"red",instruction:"Color the mushroom red!",subject:"mushrooms"},{word:"pear",colorWord:"green",instruction:"Color the pears!",subject:"pears"},{word:"harvest",colorWord:"orange",instruction:"Color the harvest basket!",subject:"a harvest basket"},{word:"corn",colorWord:"yellow",instruction:"Color the corn golden!",subject:"corn"},{word:"owl",colorWord:"brown",instruction:"Color the owl brown!",subject:"an owl on a branch"},{word:"sunflower",colorWord:"yellow",instruction:"Color the sunflowers!",subject:"sunflowers"},{word:"pumpkin",colorWord:"orange",instruction:"Color the pumpkins!",subject:"pumpkins"},{word:"tree",colorWord:"orange",instruction:"Color the autumn tree!",subject:"an autumn tree"},{word:"grape",colorWord:"purple",instruction:"Color the grapes purple!",subject:"grapes"},{word:"deer",colorWord:"brown",instruction:"Color the deer!",subject:"a deer in the forest"},{word:"berry",colorWord:"red",instruction:"Color the berries!",subject:"berries on a branch"},{word:"bat",colorWord:"black",instruction:"Color the bat black!",subject:"a bat at dusk"},{word:"maple",colorWord:"red",instruction:"Color the maple leaf red!",subject:"a maple leaf"},{word:"pinecone",colorWord:"brown",instruction:"Color the pinecones!",subject:"pinecones"},{word:"gourd",colorWord:"orange",instruction:"Color the gourds!",subject:"gourds"},{word:"scarecrow",colorWord:"orange",instruction:"Color the scarecrow!",subject:"a scarecrow"},{word:"moon",colorWord:"orange",instruction:"Color the harvest moon!",subject:"a harvest moon"},{word:"crow",colorWord:"black",instruction:"Color the crow black!",subject:"a crow on a fence"},{word:"autumn",colorWord:"orange",instruction:"Color the autumn scene!",subject:"an autumn scene"},{word:"fog",colorWord:"grey",instruction:"Color the foggy morning!",subject:"a foggy morning"},{word:"hayride",colorWord:"gold",instruction:"Color the hayride!",subject:"a hayride"},{word:"wagon",colorWord:"red",instruction:"Color the wagon!",subject:"a red wagon of apples"},{word:"spider",colorWord:"black",instruction:"Color the spider and web!",subject:"a spider and web"},{word:"pencil",colorWord:"yellow",instruction:"Color the pencils!",subject:"pencils and paper"}],
  October:   [{word:"pumpkin",colorWord:"orange",instruction:"Color the pumpkin!",subject:"a pumpkin"},{word:"leaf",colorWord:"orange",instruction:"Color the autumn leaves!",subject:"autumn leaves"},{word:"owl",colorWord:"brown",instruction:"Color the owl!",subject:"an owl"},{word:"apple",colorWord:"red",instruction:"Color the apple tree!",subject:"an apple tree"},{word:"scarecrow",colorWord:"orange",instruction:"Color the scarecrow!",subject:"a scarecrow"},{word:"moon",colorWord:"yellow",instruction:"Color the moon yellow!",subject:"a moon"},{word:"corn",colorWord:"yellow",instruction:"Color the corn golden!",subject:"corn"},{word:"forest",colorWord:"orange",instruction:"Color the autumn forest!",subject:"an autumn forest"},{word:"bat",colorWord:"black",instruction:"Color the bat black!",subject:"a bat"},{word:"web",colorWord:"white",instruction:"Color the spider web!",subject:"a spider web"},{word:"harvest",colorWord:"orange",instruction:"Color the harvest basket!",subject:"a harvest basket"},{word:"diya",colorWord:"red",instruction:"Color the diya lamp!",subject:"a diya lamp"},{word:"lantern",colorWord:"orange",instruction:"Color the Diwali lanterns!",subject:"Diwali lanterns"},{word:"Rangoli",colorWord:"purple",instruction:"Color the Rangoli pattern!",subject:"a Rangoli pattern"},{word:"peacock",colorWord:"blue",instruction:"Color the peacock!",subject:"a peacock"},{word:"fireworks",colorWord:"yellow",instruction:"Color the fireworks!",subject:"fireworks"},{word:"Rama",colorWord:"gold",instruction:"Color the Ramayana scene!",subject:"a Ramayana scene"},{word:"sweet",colorWord:"pink",instruction:"Color the Diwali sweets!",subject:"Diwali sweets"},{word:"flame",colorWord:"yellow",instruction:"Color the diyas!",subject:"diyas"},{word:"night",colorWord:"blue",instruction:"Color the starry night sky!",subject:"a starry night sky"},{word:"elephant",colorWord:"purple",instruction:"Color the decorated elephant!",subject:"a decorated elephant"},{word:"patch",colorWord:"orange",instruction:"Color the pumpkin patch!",subject:"a pumpkin patch"},{word:"jack",colorWord:"orange",instruction:"Color the Jack-o-lantern!",subject:"a Jack-o-lantern"},{word:"witch",colorWord:"purple",instruction:"Color the witch hat!",subject:"a witch hat"},{word:"candy",colorWord:"orange",instruction:"Color the candy corn!",subject:"candy corn"},{word:"ghost",colorWord:"white",instruction:"Color the ghost!",subject:"a ghost"},{word:"tree",colorWord:"orange",instruction:"Color the autumn tree!",subject:"an autumn tree"},{word:"Halloween",colorWord:"purple",instruction:"Color the Halloween scene!",subject:"a Halloween scene"},{word:"sky",colorWord:"black",instruction:"Color the Halloween night sky!",subject:"a Halloween night sky"},{word:"star",colorWord:"yellow",instruction:"Color the pumpkins and stars!",subject:"stars"},{word:"haystack",colorWord:"gold",instruction:"Color the haystack golden!",subject:"a haystack"}],
  November:  [{word:"turkey",colorWord:"brown",instruction:"Color the turkey!",subject:"a turkey"},{word:"leaf",colorWord:"orange",instruction:"Color the falling leaves!",subject:"falling leaves"},{word:"thankful",colorWord:"red",instruction:"Color the thankful heart!",subject:"a thankful heart"},{word:"acorn",colorWord:"brown",instruction:"Color the acorns!",subject:"acorns and leaves"},{word:"pie",colorWord:"orange",instruction:"Color the pumpkin pie!",subject:"a pumpkin pie"},{word:"corn",colorWord:"yellow",instruction:"Color the Indian corn!",subject:"Indian corn"},{word:"harvest",colorWord:"brown",instruction:"Color the harvest table!",subject:"a harvest table"},{word:"deer",colorWord:"brown",instruction:"Color the deer!",subject:"a deer in autumn"},{word:"candle",colorWord:"orange",instruction:"Color the Thanksgiving candle!",subject:"a Thanksgiving candle"},{word:"veteran",colorWord:"red",instruction:"Color the flag!",subject:"a flag for Veterans Day"},{word:"owl",colorWord:"brown",instruction:"Color the owl!",subject:"an owl in the leaves"},{word:"apple",colorWord:"brown",instruction:"Color the apple pie!",subject:"an apple pie"},{word:"squirrel",colorWord:"brown",instruction:"Color the squirrel!",subject:"a squirrel gathering nuts"},{word:"pumpkin",colorWord:"orange",instruction:"Color the pumpkin!",subject:"a pumpkin"},{word:"pinecone",colorWord:"brown",instruction:"Color the pinecones!",subject:"pinecones"},{word:"bread",colorWord:"brown",instruction:"Color the loaf of bread!",subject:"a loaf of bread"},{word:"family",colorWord:"red",instruction:"Color the family together!",subject:"a family together"},{word:"maple",colorWord:"red",instruction:"Color the maple tree!",subject:"a maple tree"},{word:"feast",colorWord:"orange",instruction:"Color the Thanksgiving feast!",subject:"a Thanksgiving feast"},{word:"pilgrim",colorWord:"black",instruction:"Color the Pilgrim hat!",subject:"a Pilgrim hat"},{word:"cornucopia",colorWord:"brown",instruction:"Color the cornucopia!",subject:"a cornucopia"},{word:"wagon",colorWord:"brown",instruction:"Color the covered wagon!",subject:"a covered wagon"},{word:"autumn",colorWord:"orange",instruction:"Color the autumn forest!",subject:"an autumn forest"},{word:"star",colorWord:"gold",instruction:"Color the gratitude star!",subject:"a star of gratitude"},{word:"thanks",colorWord:"orange",instruction:"Color the Thanksgiving scene!",subject:"a Thanksgiving scene"},{word:"tree",colorWord:"brown",instruction:"Color the bare winter tree!",subject:"a bare winter tree"},{word:"advent",colorWord:"purple",instruction:"Color the Advent wreath!",subject:"an Advent wreath"},{word:"hope",colorWord:"purple",instruction:"Color the candle of hope!",subject:"a candle of hope"}],
  December:  [{word:"tree",colorWord:"green",instruction:"Color the Christmas tree!",subject:"a Christmas tree"},{word:"star",colorWord:"yellow",instruction:"Color the stars yellow!",subject:"a star"},{word:"angel",colorWord:"white",instruction:"Color the angel!",subject:"an angel"},{word:"candle",colorWord:"yellow",instruction:"Color the candle yellow!",subject:"a candle"},{word:"bell",colorWord:"gold",instruction:"Color the bell gold!",subject:"a bell"},{word:"wreath",colorWord:"green",instruction:"Color the wreath green!",subject:"a wreath"},{word:"stocking",colorWord:"red",instruction:"Color the stocking!",subject:"a stocking"},{word:"snow",colorWord:"blue",instruction:"Color the snowflake blue!",subject:"a snowflake"},{word:"snowman",colorWord:"white",instruction:"Color the snowman!",subject:"a snowman"},{word:"ginger",colorWord:"brown",instruction:"Color the gingerbread house!",subject:"a gingerbread house"},{word:"reindeer",colorWord:"brown",instruction:"Color the reindeer!",subject:"a reindeer"},{word:"manger",colorWord:"gold",instruction:"Color the manger scene!",subject:"the manger scene"},{word:"gift",colorWord:"red",instruction:"Color the gifts!",subject:"a gift"},{word:"candy",colorWord:"red",instruction:"Color the candy cane!",subject:"a candy cane"},{word:"dove",colorWord:"white",instruction:"Color the dove white!",subject:"a dove"},{word:"sheep",colorWord:"white",instruction:"Color the shepherd and sheep!",subject:"a shepherd and sheep"},{word:"cookie",colorWord:"pink",instruction:"Color the Christmas cookies!",subject:"Christmas cookies"},{word:"Bethlehem",colorWord:"yellow",instruction:"Color the star of Bethlehem!",subject:"the star of Bethlehem"},{word:"sleigh",colorWord:"red",instruction:"Color the sleigh red!",subject:"a sleigh"},{word:"wisemen",colorWord:"gold",instruction:"Color the three wise men!",subject:"the three wise men"},{word:"holly",colorWord:"red",instruction:"Color the holly berries!",subject:"holly berries"},{word:"Jesus",colorWord:"gold",instruction:"Color baby Jesus!",subject:"baby Jesus"},{word:"sky",colorWord:"blue",instruction:"Color the Christmas Eve sky!",subject:"a Christmas Eve sky"},{word:"nativity",colorWord:"gold",instruction:"Color the nativity!",subject:"the nativity"},{word:"bird",colorWord:"red",instruction:"Color the winter birds!",subject:"a winter bird"},{word:"village",colorWord:"white",instruction:"Color the snowy village!",subject:"a snowy village"},{word:"fireworks",colorWord:"yellow",instruction:"Color the fireworks!",subject:"fireworks"},{word:"noel",colorWord:"red",instruction:"Color the Christmas story!",subject:"a Christmas scene"},{word:"joy",colorWord:"gold",instruction:"Color the New Year's Eve celebration!",subject:"a New Year's scene"},{word:"peace",colorWord:"white",instruction:"Color the peace dove white!",subject:"a peace dove"},{word:"noel",colorWord:"red",instruction:"Color the Christmas scene!",subject:"a Christmas scene"}],
};

const SEASONAL_OBJS: Record<string,string[]> = {
  January:["cloud","moon","star","fish","heart"], February:["heart","flower","star","sun","fish"],
  March:["flower","fish","sun","apple","flower"], April:["flower","sun","star","apple","fish"],
  May:["flower","sun","apple","fish","heart"], June:["fish","sun","flower","star","flower"],
  July:["star","sun","fish","flower","heart"], August:["sun","apple","flower","fish","flower"],
  September:["apple","star","flower","sun","star"], October:["pumpkin","star","apple","star","star"],
  November:["apple","star","star","sun","heart"], December:["star","star","heart","star","flower"],
};

const GENERIC_AFFIRMATIONS: Record<string,{action:string,quote:string}> = {
  "3-13":{ action:"Try something you have never done before!", quote:"Adventure is worthwhile in itself. — Amelia Earhart" },
};
function getAffirmation(m: number, d: number): {action:string,quote:string} {
  const key = `${m+1}-${d}`;
  return GENERIC_AFFIRMATIONS[key] ?? { action:"Be kind and make today wonderful!", quote:"Every day is a new beginning." };
}

function seasonalObj(month: string, offset=0): string {
  const pool = SEASONAL_OBJS[month] || ["star"];
  return pool[offset % pool.length];
}

function getDayActivity(month: string, day: number) {
  const list = DAILY_ACTIVITIES[month] || DAILY_ACTIVITIES.December;
  return list[Math.min(day-1, list.length-1)];
}

// ── Mini activity components ───────────────────────────────────────────────
const LABEL_STYLE: React.CSSProperties = {fontSize:9,fontWeight:"bold",color:"#374151",textTransform:"uppercase",letterSpacing:0.8,marginBottom:6};

function LetterTracingBox({ day, month, age }: { day:number; month:string; age:number }) {
  const { word } = getDayActivity(month, day);
  const size = word.length <= 4 ? 30 : word.length <= 6 ? 24 : 20;
  if (age <= 4) {
    const letter = word[0].toUpperCase();
    return (
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={LABEL_STYLE}>Trace the letter</div>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <TraceLetter char={letter} size={44}/>
          <TraceLetter char={letter} size={44}/>
          <TraceLetter char={letter} size={44}/>
        </div>
        <div style={{fontSize:9,color:"#9ca3af",marginBottom:3}}>now write it yourself</div>
        <RuledLine h={52}/>
      </div>
    );
  }
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL_STYLE}>Trace the letters</div>
      <div style={{fontSize:9,color:"#9ca3af",marginBottom:2}}>uppercase</div>
      <TraceRow text={word.toUpperCase()} size={size}/>
      <div style={{fontSize:9,color:"#9ca3af",margin:"5px 0 2px"}}>lowercase</div>
      <TraceRow text={word.toLowerCase()} size={size}/>
      <div style={{fontSize:9,color:"#9ca3af",margin:"5px 0 2px"}}>now write</div>
      <RuledLine h={40}/>
    </div>
  );
}

function ColorBox({ day, month }: { day:number; month:string }) {
  const { instruction, colorWord } = getDayActivity(month, day);
  const isScene = day % 2 === 0;
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL_STYLE}>{isScene ? "Color the Scene" : "Trace & Color"}</div>
      {!isScene && (
        <>
          <TraceRow text={colorWord} size={24}/>
          <div style={{marginTop:4}}/>
        </>
      )}
      <div style={{fontSize:10,color:"#374151",marginBottom:8,lineHeight:1.4}}>{instruction}</div>
      <div style={{flex:1,border:"1.5px dashed #c4b5a0",borderRadius:6,minHeight:80,
        display:"flex",alignItems:"center",justifyContent:"center",background:"white"}}>
        <div style={{fontSize:9,color:"#c4b5a0",textAlign:"center",lineHeight:1.5}}>
          🎨<br/>Color {colorWord}!
        </div>
      </div>
    </div>
  );
}

function MathBox({ day, month, age }: { day:number; month:string; age:number }) {
  const maxTypes = age <= 4 ? 3 : 6;
  const type = day % maxTypes;
  const obj = seasonalObj(month, day);
  const count = (day % 5) + 1;

  if (age <= 4) {
    if (type === 0) return (
      <div>
        <div style={LABEL_STYLE}>Count and write the number</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
            {Array.from({length:count}).map((_,i) => <SvgObject key={i} type={obj} size={46}/>)}
          </div>
          <div style={{fontSize:20,color:"#9ca3af"}}>=</div>
          <WriteBox size={44}/>
        </div>
      </div>
    );
    if (type === 1) {
      const task = day % 2 === 0 ? "smallest" : "biggest";
      const rows = [[36,52,44],[50,34,58],[58,42,36]];
      return (
        <div>
          <div style={LABEL_STYLE}>Circle the {task} in each row</div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {rows.map((sizes,ri) => (
              <div key={ri} style={{display:"flex",justifyContent:"space-evenly",borderBottom:ri<2?"1px dashed #e5e7eb":"none",paddingBottom:ri<2?4:0}}>
                {sizes.map((sz,ci) => <SvgObject key={ci} type={obj} size={sz}/>)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    const target = (day % 3) + 2;
    const plural = obj==="fish"?"fish":obj+"s";
    return (
      <div>
        <div style={LABEL_STYLE}>Color {target} {plural}</div>
        <div style={{display:"flex",justifyContent:"space-evenly",flexWrap:"wrap",gap:4}}>
          {Array.from({length:5}).map((_,i) => <SvgObject key={i} type={obj} size={50}/>)}
        </div>
      </div>
    );
  }

  // Ages 5-6
  const addPairs = [[1,1],[2,1],[1,2],[2,2],[3,1],[1,3],[2,3],[3,2],[4,1]];
  const subPairs = [[3,1],[4,1],[4,2],[5,1],[5,2],[5,3],[6,2],[6,3]];
  if (type === 0) {
    const [a,b] = addPairs[day % addPairs.length];
    return (
      <div>
        <div style={LABEL_STYLE}>How many altogether?</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:4,padding:"4px 8px",border:"1.5px solid #e5e7eb",borderRadius:6}}>
            {Array.from({length:a}).map((_,i) => <SvgObject key={i} type={obj} size={44}/>)}
          </div>
          <span style={{fontSize:22,fontWeight:"bold",color:"#374151"}}>+</span>
          <div style={{display:"flex",gap:4,padding:"4px 8px",border:"1.5px solid #e5e7eb",borderRadius:6}}>
            {Array.from({length:b}).map((_,i) => <SvgObject key={i} type={seasonalObj(month,day+2)} size={44}/>)}
          </div>
          <span style={{fontSize:22,fontWeight:"bold",color:"#374151"}}>=</span>
          <WriteBox size={46}/>
        </div>
      </div>
    );
  }
  if (type === 1) {
    const [total,remove] = subPairs[day % subPairs.length];
    const xSz = 54;
    return (
      <div>
        <div style={LABEL_STYLE}>Cross out {remove} — how many are left?</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
          {Array.from({length:total}).map((_,i) => (
            <div key={i} style={{position:"relative",display:"inline-flex"}}>
              <SvgObject type={obj} size={46}/>
              {i < remove && (
                <svg style={{position:"absolute",top:0,left:0,pointerEvents:"none"}} width={xSz} height={xSz} viewBox={`0 0 ${xSz} ${xSz}`}>
                  <line x1="8" y1="8" x2={xSz-8} y2={xSz-8} stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
                  <line x1={xSz-8} y1="8" x2="8" y2={xSz-8} stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          ))}
          <span style={{fontSize:22,fontWeight:"bold",color:"#374151"}}>=</span>
          <WriteBox size={46}/>
        </div>
      </div>
    );
  }
  if (type === 2) {
    const n = (day % 8) + 2;
    return (
      <div>
        <div style={LABEL_STYLE}>What comes before and after?</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{fontSize:9,color:"#9ca3af"}}>before</div><WriteBox size={44}/>
          </div>
          <div style={{fontSize:28,fontWeight:"bold",color:"#1f2937",border:"2px solid #1f2937",borderRadius:8,width:50,height:58,display:"flex",alignItems:"center",justifyContent:"center"}}>{n}</div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{fontSize:9,color:"#9ca3af"}}>after</div><WriteBox size={44}/>
          </div>
        </div>
      </div>
    );
  }
  const n2 = (day % 10) + 1;
  return (
    <div>
      <div style={LABEL_STYLE}>Write the number {n2}</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
        {[0,1,2].map(i => (
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{fontSize:9,color:"#9ca3af"}}>{i===0?"trace":"write"}</div>
            <svg width={60} height={60} viewBox="0 0 32 44" style={{border:"1px dashed #e5e7eb",borderRadius:4}}>
              <line x1="0" y1="2"  x2="32" y2="2"  stroke="#e5e7eb" strokeWidth="0.8"/>
              <line x1="0" y1="22" x2="32" y2="22" stroke="#e5e7eb" strokeWidth="0.6" strokeDasharray="3 3"/>
              <line x1="0" y1="42" x2="32" y2="42" stroke="#e5e7eb" strokeWidth="0.8"/>
              {i===0 && <text x="16" y="34" textAnchor="middle" fontSize="28" fontFamily="Georgia,serif" fill="#d1d5db">{n2}</text>}
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Full preview workbook page ─────────────────────────────────────────────
function PreviewWorkbookPage({ day, month, year, childName, age, religion }: {
  day:number; month:string; year:number; childName:string; age:number; religion:string;
}) {
  const today = new Date(year, MONTH_NAMES.indexOf(month), day);
  const dayName = DAY_NAMES[today.getDay()];
  const affirmation = getAffirmation(MONTH_NAMES.indexOf(month), day);

  return (
    <div style={{
      background:"white",
      border:"1.5px solid #e5e7eb",
      borderRadius:12,
      padding:"18px 20px",
      fontFamily:"Georgia, serif",
      width:"100%",
      maxWidth:560,
      boxShadow:"0 4px 24px rgba(0,0,0,0.07)",
      boxSizing:"border-box",
    }}>
      {/* Header */}
      <div style={{textAlign:"center",borderBottom:"1.5px solid #e5e7eb",paddingBottom:10,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:"bold",color:"#1f2937",letterSpacing:1,textTransform:"uppercase"}}>
          Morning Workbook {childName ? `· ${childName}` : ""}
        </div>
        <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>
          {dayName}, {month} {day}, {year}
          {religion !== "Generic" && <span style={{marginLeft:8,fontSize:10,color:"#9ca3af"}}>· {religion}</span>}
        </div>
      </div>

      {/* Top row */}
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        <div style={{flex:1,border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",background:"#fafaf9",minHeight:160,display:"flex",flexDirection:"column"}}>
          <LetterTracingBox day={day} month={month} age={age}/>
        </div>
        <div style={{flex:1,border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px",background:"#fafaf9",minHeight:160,display:"flex",flexDirection:"column"}}>
          <ColorBox day={day} month={month}/>
        </div>
      </div>

      {/* Math row */}
      <div style={{border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 14px",background:"#fafaf9",marginBottom:12}}>
        <MathBox day={day} month={month} age={age}/>
      </div>

      {/* Footer */}
      <div style={{borderTop:"1.5px solid #e5e7eb",paddingTop:10,textAlign:"center"}}>
        {day % 2 === 1
          ? <div style={{fontSize:12,fontWeight:"bold",color:"#1f2937"}}>✨ {affirmation.action}</div>
          : <div style={{fontSize:11,fontStyle:"italic",color:"#6b7280"}}>"{affirmation.quote}"</div>
        }
      </div>
    </div>
  );
}

// ── Locked button ──────────────────────────────────────────────────────────
function LockedButton({ label, sublabel, onClickMessage }: { label:string; sublabel:string; onClickMessage:string }) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div style={{position:"relative",display:"inline-block"}}>
      <button
        onClick={() => setShowTip(v => !v)}
        style={{
          padding:"8px 18px",fontSize:12,fontWeight:"bold",cursor:"pointer",
          border:"2px solid #d1d5db",borderRadius:8,
          background:"#f3f4f6",color:"#9ca3af",
          display:"flex",alignItems:"center",gap:6,
          fontFamily:"Georgia, serif",
        }}>
        🔒 {label}
      </button>
      {showTip && (
        <div style={{
          position:"absolute",top:"110%",left:"50%",transform:"translateX(-50%)",
          background:"#1f2937",color:"white",fontSize:11,borderRadius:8,
          padding:"8px 14px",whiteSpace:"nowrap",zIndex:100,
          boxShadow:"0 4px 16px rgba(0,0,0,0.2)",
          textAlign:"center",lineHeight:1.5,
        }}>
          {onClickMessage}<br/>
          <span style={{opacity:0.7,fontSize:10}}>{sublabel}</span>
        </div>
      )}
    </div>
  );
}

// ── Main LandingPage ───────────────────────────────────────────────────────
export default function LandingPage() {
  const today      = new Date();
  const monthIdx   = today.getMonth();
  const currentDay = today.getDate();
  const currentYear= today.getFullYear();
  const currentMonth = MONTH_NAMES[monthIdx];

  const daysInMonth = new Date(currentYear, monthIdx + 1, 0).getDate();

  const [childName, setChildName] = useState("");
  const [age,       setAge]       = useState(4);
  const [religion,  setReligion]  = useState("Generic");
  const [month,     setMonth]     = useState(currentMonth);
  const [previewDay,setPreviewDay]= useState(currentDay);
  const [showPricing, setShowPricing] = useState(false);

  const tradColors: Record<string,string> = {
    Generic:"#6366f1", Christian:"#0369a1", Hindu:"#b45309", Both:"#7c3aed"
  };

    const BG      = "#F5F5F5";
  const CARD_BG = "#ffffff";
  const BORDER  = "#ddd0c8";
  const YELLOW  = "#FADADD";
  const PEACH   = "#FFDAB9";
  const MINT    = "#C8E6C9";
  const LILAC   = "#C9C9FF";

  return (
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia, serif",display:"flex",flexDirection:"column",alignItems:"center"}}>

      {/* ── Nav ── */}
      <nav style={{
width:"100%",background:"#C9C9FF",borderBottom:`1px solid ${BORDER}`,
        padding:"14px 24px",display:"flex",alignItems:"center",
        justifyContent:"space-between",boxSizing:"border-box",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>📖</span>
          <div>
            <div style={{fontSize:16,fontWeight:"bold",color:"#1f2937"}}>Morning Workbooks</div>
            <div style={{fontSize:10,color:"#a78a6a",marginTop:-2}}>personalized pages for little ones · ages 3–6</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <SignInButton mode="modal">
            <button style={{
              padding:"8px 18px",fontSize:13,borderRadius:8,
              border:`1.5px solid ${BORDER}`,background:"white",
              color:"#374151",cursor:"pointer",fontFamily:"Georgia, serif",
            }}>Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={{
              padding:"8px 18px",fontSize:13,borderRadius:8,
              border:"none",background:"#1f2937",
              color:"white",cursor:"pointer",fontWeight:"bold",
              fontFamily:"Georgia, serif",
            }}>Get Started Free</button>
          </SignUpButton>
        </div>
      </nav>

      {/* ── Tagline ── */}
      <div style={{textAlign:"center",padding:"28px 24px 12px",maxWidth:540}}>
        <h1 style={{fontSize:24,fontWeight:"bold",color:"#1f2937",margin:"0 0 10px",lineHeight:1.3}}>
          A fresh workbook, every single morning
        </h1>
        <p style={{fontSize:13,color:"#6b7280",lineHeight:1.7,margin:0}}>
          Letter tracing, math, and coloring — tailored to your child's age, today's date, and your family's traditions. Something to do at breakfast instead of screens.
        </p>
      </div>

      {/* ── Controls ── */}
      <div style={{
background:"#FFF8B5",border:`1.5px solid ${BORDER}`,borderRadius:12,
        padding:"14px 16px",margin:"12px 16px",
        display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",
        boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
        maxWidth:560,width:"calc(100% - 32px)",boxSizing:"border-box",
      }}>
        {/* Child name */}
        <div style={{flex:1,minWidth:90}}>
          <div style={{fontSize:10,fontWeight:"bold",color:"#a78a6a",marginBottom:3}}>CHILD'S NAME</div>
          <input value={childName} onChange={e=>setChildName(e.target.value)}
            placeholder="Child's name"
            style={{width:"100%",padding:"5px 7px",borderRadius:6,border:`1.5px solid ${BORDER}`,
              fontSize:13,fontFamily:"Georgia",boxSizing:"border-box",background:"white"}}/>
        </div>

        {/* Month */}
        <div style={{flex:1,minWidth:80}}>
          <div style={{fontSize:10,fontWeight:"bold",color:"#a78a6a",marginBottom:3}}>MONTH</div>
          <select value={month} onChange={e=>setMonth(e.target.value)}
            style={{width:"100%",padding:"5px",borderRadius:6,border:`1.5px solid ${BORDER}`,fontSize:13,background:"white"}}>
            {MONTH_NAMES.map(m=><option key={m}>{m}</option>)}
          </select>
        </div>

        {/* Tradition */}
        <div style={{flex:1,minWidth:80}}>
          <div style={{fontSize:10,fontWeight:"bold",color:"#a78a6a",marginBottom:3}}>TRADITION</div>
          <select value={religion} onChange={e=>setReligion(e.target.value)}
            style={{width:"100%",padding:"5px",borderRadius:6,
              border:`1.5px solid ${tradColors[religion]??"#e5e7eb"}`,
              fontSize:13,color:"#374151",fontWeight:"bold",background:"white"}}>
            {["Generic","Christian","Hindu","Both"].map(r=><option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Age */}
        <div>
          <div style={{fontSize:10,fontWeight:"bold",color:"#a78a6a",marginBottom:3}}>AGE</div>
          <div style={{display:"flex",gap:3}}>
            {[3,4,5,6].map(a=>(
              <button key={a} onClick={()=>setAge(a)}
                style={{width:28,height:28,borderRadius:5,cursor:"pointer",
                  border:`1.5px solid ${age===a?"#1f2937":BORDER}`,
                  background:age===a?"#1f2937":"white",
                  color:age===a?"white":"#374151",fontSize:12,fontWeight:"bold"}}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Preview day */}
        <div>
          <div style={{fontSize:10,fontWeight:"bold",color:"#a78a6a",marginBottom:3}}>DAY</div>
          <input type="number" min={1} max={daysInMonth} value={previewDay}
            onChange={e=>setPreviewDay(Math.min(daysInMonth,Math.max(1,Number(e.target.value))))}
            style={{width:52,padding:"5px 6px",borderRadius:6,border:`1.5px solid ${BORDER}`,
              fontSize:13,textAlign:"center",background:"white"}}/>
        </div>
      </div>

      {/* ── Action bar with locked buttons ── */}
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap",justifyContent:"center",padding:"0 16px"}}>
        <LockedButton
          label={`Download PDF — ${month}`}
          sublabel="$2.99 per month · PDF download"
          onClickMessage="Sign up to download PDFs for $2.99/month"
        />
        <LockedButton
          label="Order a Printed Book"
          sublabel="From $24.99 shipped"
          onClickMessage="Sign up to order a printed book"
        />
        <button onClick={()=>setShowPricing(v=>!v)}
          style={{padding:"8px 16px",fontSize:12,cursor:"pointer",
            border:`1.5px solid ${BORDER}`,borderRadius:8,
            background:"white",color:"#a78a6a",fontFamily:"Georgia, serif"}}>
          {showPricing ? "▲ Hide Pricing" : "▼ See Pricing"}
        </button>
      </div>

      {/* ── Pricing table ── */}
      {showPricing && (
        <div style={{
          maxWidth:560,width:"calc(100% - 32px)",margin:"0 16px 20px",
background:"#D6E9FF",border:`1.5px solid ${BORDER}`,borderRadius:12,
          padding:"20px 24px",boxSizing:"border-box",
        }}>
          <div style={{fontSize:14,fontWeight:"bold",color:"#1f2937",marginBottom:16,textAlign:"center"}}>Pricing</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[
              { label:"Free Account",     price:"Free",     desc:"Preview the full app · Save child profiles · No downloads", highlight:false },
              { label:"PDF Download",     price:"$2.99",    desc:"Download that month's PDF · One purchase = one month", highlight:true },
              { label:"PDF Subscription", price:"$4.99/mo", desc:"Unlock current month PDF automatically · Cancel anytime", highlight:false },
              { label:"1 Printed Book",   price:"$24.99",   desc:"One month · Printed & shipped to your door", highlight:false },
              { label:"3 Printed Books",  price:"$59.99",   desc:"Three months · Save $15 vs buying one at a time", highlight:false },
              { label:"12 Printed Books", price:"$199.99",  desc:"Full year · Save $100 vs buying one at a time", highlight:true },
            ].map((tier,i) => (
              <div key={i} style={{
                display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"10px 14px",borderRadius:8,
                border:`1.5px solid ${tier.highlight?"#c4b5a0":BORDER}`,
                background:tier.highlight?"#C8E6C9":"white",
              }}>
                <div>
                  <div style={{fontSize:13,fontWeight:"bold",color:"#1f2937"}}>{tier.label}</div>
                  <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{tier.desc}</div>
                </div>
                <div style={{fontSize:15,fontWeight:"bold",color:"#1f2937",marginLeft:16,whiteSpace:"nowrap"}}>
                  {tier.price}
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,textAlign:"center"}}>
            <SignUpButton mode="modal">
              <button style={{
                padding:"11px 28px",fontSize:13,fontWeight:"bold",
                borderRadius:10,border:"none",background:"#1f2937",
                color:"white",cursor:"pointer",fontFamily:"Georgia, serif",
              }}>Create Free Account</button>
            </SignUpButton>
          </div>
        </div>
      )}

      {/* ── Live workbook preview ── */}
      <div style={{width:"100%",display:"flex",justifyContent:"center",padding:"0 16px",boxSizing:"border-box",marginBottom:16}}>
        <PreviewWorkbookPage
          day={previewDay}
          month={month}
          year={currentYear}
          childName={childName}
          age={age}
          religion={religion}
        />
      </div>

      {/* ── Bottom CTA ── */}
      <div style={{
margin:"8px 16px 48px",background:"#D6E9FF",
        border:"1.5px solid #D6E9FF",borderRadius:12,
        padding:"22px 28px",maxWidth:560,width:"calc(100% - 32px)",
        textAlign:"center",boxSizing:"border-box",
      }}>
        <div style={{fontSize:16,fontWeight:"bold",color:"#1f2937",marginBottom:8}}>
          Ready to save your child's profile?
        </div>
        <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6,marginBottom:18}}>
          Create a free account to save profiles and access downloads.
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <SignUpButton mode="modal">
            <button style={{
              padding:"11px 26px",fontSize:13,fontWeight:"bold",
              borderRadius:10,border:"none",background:"#1f2937",
              color:"white",cursor:"pointer",fontFamily:"Georgia, serif",
            }}>Create Free Account</button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button style={{
              padding:"11px 22px",fontSize:13,borderRadius:10,
              border:`1.5px solid ${BORDER}`,background:"white",
              color:"#374151",cursor:"pointer",fontFamily:"Georgia, serif",
            }}>Sign In</button>
          </SignInButton>
        </div>
        <div style={{fontSize:11,color:"#c4b5a0",marginTop:12}}>No credit card required</div>
      </div>

    </div>
  );
}
