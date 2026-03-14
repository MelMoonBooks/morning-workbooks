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
function seasonalObj(month: string, offset=0): string {
  const pool = SEASONAL_OBJS[month] || ["star"];
  return pool[offset % pool.length];
}
const GENERIC_AFFIRMATIONS: Record<string,{action:string,quote:string}> = {
  "3-13":{ action:"Try something you have never done before!", quote:"Adventure is worthwhile in itself. — Amelia Earhart" },
};
const CHRISTIAN_AFFIRMATIONS: Record<string,{action:string,quote:string,ref:string}> = {
  "1-1":  { action: "Today is brand new — make it wonderful!", quote: "I am making everything new!", ref: "Rev 21:5" },
  "1-2":  { action: "Say thank you to someone today.", quote: "Give thanks no matter what happens.", ref: "1 Thess 5:18" },
  "1-3":  { action: "Take a deep breath and smile!", quote: "A cheerful heart makes you feel good.", ref: "Prov 17:22" },
  "1-4":  { action: "Do one kind thing without being asked.", quote: "Do everything in love.", ref: "1 Cor 16:14" },
  "1-5":  { action: "Look outside — what do you notice today?", quote: "The earth is full of God's love.", ref: "Ps 33:5" },
  "1-6":  { action: "Help someone who needs it today!", quote: "Wise men followed a star to find the light.", ref: "Epiphany" },
  "1-7":  { action: "Be brave and try something new!", quote: "Courage is doing it even when you are afraid.", ref: "" },
  "1-8":  { action: "Give a big hug to someone you love.", quote: "Love each other just as I have loved you.", ref: "John 15:12" },
  "1-9":  { action: "Notice something beautiful today.", quote: "The skies tell about the amazing things God does.", ref: "Ps 19:1" },
  "1-10": { action: "Share something with a friend!", quote: "It is more blessed to give than to receive.", ref: "Acts 20:35" },
  "1-11": { action: "Tell someone what you love about them.", quote: "Kind words are like honey — sweet to your heart.", ref: "Prov 16:24" },
  "1-12": { action: "Be patient today — good things take time.", quote: "Those who trust in God will get new strength.", ref: "Isa 40:31" },
  "1-13": { action: "Sing a song today, even a silly one!", quote: "Shout for joy to the Lord!", ref: "Ps 100:1" },
  "1-14": { action: "Happy Pongal! Thank the sun for its warmth today!", quote: "The sun rises and sets, faithful every day.", ref: "Pongal" },
  "1-15": { action: "Help set the table or clean up without being asked.", quote: "Sita served with grace and love in all things.", ref: "Ramayana" },
  "1-16": { action: "Draw a picture for someone you love.", quote: "Every good and perfect gift comes down from God.", ref: "James 1:17" },
  "1-17": { action: "Walk slowly and notice everything around you.", quote: "The Lord is my shepherd. He gives me everything I need.", ref: "Ps 23:1" },
  "1-18": { action: "Say sorry if you need to — it takes courage!", quote: "A gentle answer turns away anger.", ref: "Prov 15:1" },
  "1-19": { action: "Be kind to everyone you meet today.", quote: "Love your neighbor as you love yourself.", ref: "Mark 12:31" },
  "1-20": { action: "Do something that makes you laugh!", quote: "Joy is the simplest form of gratitude.", ref: "" },
  "1-21": { action: "Help a grown-up with something today.", quote: "Honor your father and mother.", ref: "Exod 20:12" },
  "1-22": { action: "Find one thing to be grateful for right now.", quote: "Gratitude turns what we have into enough.", ref: "" },
  "1-23": { action: "Be a good listener today — really hear someone.", quote: "Be quick to listen and slow to speak.", ref: "James 1:19" },
  "1-24": { action: "Wrap yourself in something cozy and feel thankful!", quote: "God your Lord is with you everywhere you go.", ref: "Josh 1:9" },
  "1-25": { action: "Tell someone you are proud of them!", quote: "Help each other be strong in the faith.", ref: "1 Thess 5:11" },
  "1-26": { action: "Try your hardest today — even at hard things.", quote: "I can do everything by the power of Christ who gives me strength.", ref: "Phil 4:13" },
  "1-27": { action: "Make someone smile on purpose!", quote: "A cheerful heart makes you feel good.", ref: "Prov 17:22" },
  "1-28": { action: "Be gentle with yourself today — you are learning!", quote: "Be kind and tender to one another.", ref: "Eph 4:32" },
  "1-29": { action: "Look at the sky — what shapes do the clouds make?", quote: "God made the stars — he knows each one by name.", ref: "Ps 147:4" },
  "1-30": { action: "Do something helpful without being asked!", quote: "Hanuman served with his whole heart and nothing was impossible.", ref: "Ramayana" },
  "1-31": { action: "January is almost over — what was your favorite day?", quote: "This is the day the Lord has made. Let's be joyful today!", ref: "Ps 118:24" },
  "2-1":  { action: "February is here! Show love every single day.", quote: "Love is patient. Love is kind.", ref: "1 Cor 13:4" },
  "2-2":  { action: "Make a card for someone who needs cheering up.", quote: "Help carry each other's heavy loads.", ref: "Gal 6:2" },
  "2-3":  { action: "Give a compliment to three people today!", quote: "Kind words are like honey — sweet and good.", ref: "Prov 16:24" },
  "2-4":  { action: "Tell your family one thing you love about them.", quote: "More than anything, love one another deeply.", ref: "Col 3:14" },
  "2-5":  { action: "Be someone's helper today!", quote: "Where you go, I will go.", ref: "Ruth 1:16" },
  "2-6":  { action: "Share your favorite snack with someone.", quote: "Give to others and it will be given to you.", ref: "Luke 6:38" },
  "2-7":  { action: "Draw a heart and give it to someone you love.", quote: "God, create a pure heart in me.", ref: "Ps 51:10" },
  "2-8":  { action: "Hug your favorite stuffed animal — you are loved!", quote: "I have loved you with a love that lasts forever.", ref: "Jer 31:3" },
  "2-9":  { action: "Do something kind for a friend today.", quote: "Friendship is the highest form of love.", ref: "Gita 12:13" },
  "2-10": { action: "Say I love you to someone in your family!", quote: "There is no fear in love.", ref: "1 John 4:18" },
  "2-11": { action: "Be extra patient with your sibling today.", quote: "Love puts up with everything.", ref: "1 Cor 13:7" },
  "2-12": { action: "Make up a silly love song and sing it!", quote: "Sing a new song to the Lord!", ref: "Ps 96:1" },
  "2-13": { action: "Write your name in big letters — you are wonderful!", quote: "How you made me is amazing and wonderful!", ref: "Ps 139:14" },
  "2-14": { action: "Happy Valentine's Day! Spread love everywhere!", quote: "Dear friends, let us love one another, because love comes from God.", ref: "1 John 4:7" },
  "2-15": { action: "Love is not just for Valentine's Day — show it today too!", quote: "Love never gives up.", ref: "1 Cor 13:8" },
  "2-16": { action: "Say a prayer for someone who is having a hard day.", quote: "Pray for each other.", ref: "James 5:16" },
  "2-17": { action: "Be kind to someone who is different from you.", quote: "You are all one in Christ Jesus.", ref: "Gal 3:28" },
  "2-18": { action: "Notice something beautiful about the world today.", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "2-19": { action: "Do a random act of kindness today!", quote: "Let your light shine so others can see it.", ref: "Matt 5:16" },
  "2-20": { action: "Forgive someone — it feels better than being angry.", quote: "Forgive, and you will be forgiven.", ref: "Luke 6:37" },
  "2-21": { action: "Tell someone you believe in them!", quote: "Nothing is impossible with God.", ref: "Matt 19:26" },
  "2-22": { action: "Be honest today — even when it is hard.", quote: "The truth will set you free.", ref: "John 8:32" },
  "2-23": { action: "Find something you can do to help your community.", quote: "Love your neighbor as you love yourself.", ref: "Mark 12:31" },
  "2-24": { action: "Make something beautiful today!", quote: "Work at everything you do with all your heart.", ref: "Col 3:23" },
  "2-25": { action: "Count five things you are grateful for!", quote: "Give thanks to the Lord because he is good.", ref: "Ps 107:1" },
  "2-26": { action: "Be a peacemaker today.", quote: "Blessed are those who make peace.", ref: "Matt 5:9" },
  "2-27": { action: "Do your best — that is always enough!", quote: "You have done a good job! You are a good and faithful helper!", ref: "Matt 25:21" },
  "2-28": { action: "February is almost over — love every single day!", quote: "This is the day the Lord has made. Let's be joyful today!", ref: "Ps 118:24" },
  "3-1":  { action: "Spring is almost here! Look for signs of new life.", quote: "Winter is past. The rains are over and gone.", ref: "Song 2:11" },
  "3-2":  { action: "Be a helper at home today.", quote: "Sita was devoted and filled her home with love.", ref: "Ramayana" },
  "3-3":  { action: "Happy Holi! Throw kindness like colors today!", quote: "Krishna danced and filled the world with joy.", ref: "Bhagavatam" },
  "3-4":  { action: "Use your brightest colors today!", quote: "God, you are dressed in glory and majesty.", ref: "Ps 104:1" },
  "3-5":  { action: "Be gentle with every living creature.", quote: "A good person takes care of their animals.", ref: "Prov 12:10" },
  "3-6":  { action: "Sing your favorite song at the top of your lungs!", quote: "Shout for joy to the Lord!", ref: "Ps 100:1" },
  "3-7":  { action: "Look for something tiny and amazing outside today.", quote: "See how the flowers grow. They don't work or worry — but God dresses them beautifully!", ref: "Matt 6:28" },
  "3-8":  { action: "Thank a woman in your life who loves you!", quote: "Her children stand up and say good things about her.", ref: "Prov 31:28" },
  "3-9":  { action: "Be patient — beautiful things take time.", quote: "Those who trust in God will get new strength.", ref: "Isa 40:31" },
  "3-10": { action: "Splash in a puddle today if you can!", quote: "God sends streams into the valleys.", ref: "Ps 104:10" },
  "3-11": { action: "Help a friend with something hard.", quote: "Two people are better than one.", ref: "Eccl 4:9" },
  "3-12": { action: "Make someone laugh today!", quote: "A cheerful heart makes you feel good.", ref: "Prov 17:22" },
  "3-13": { action: "Try something you have never done before!", quote: "Be strong and brave.", ref: "Josh 1:9" },
  "3-14": { action: "Find a flower or a bud — spring is waking up!", quote: "Flowers are appearing on the earth.", ref: "Song 2:12" },
  "3-15": { action: "Share a snack with someone today.", quote: "Give to others and it will be given to you.", ref: "Luke 6:38" },
  "3-16": { action: "Do something quietly kind — do not tell anyone!", quote: "When you give to someone, do it secretly.", ref: "Matt 6:3" },
  "3-17": { action: "Happy St. Patrick's Day! Find something green!", quote: "The Lord is my shepherd. He gives me everything I need.", ref: "Ps 23:1" },
  "3-18": { action: "Be brave and speak up for what is right.", quote: "Be strong and very brave.", ref: "Josh 1:6" },
  "3-19": { action: "Tell your family one thing you love about spring!", quote: "Winter is past. The rains are over and gone.", ref: "Song 2:11" },
  "3-20": { action: "Happy First Day of Spring! Everything is new again!", quote: "Anyone who believes in Christ is a new creation.", ref: "2 Cor 5:17" },
  "3-21": { action: "Plant something or water a plant today.", quote: "I planted the seed. Someone else watered it. But God made it grow.", ref: "1 Cor 3:6" },
  "3-22": { action: "Be someone's sunshine today!", quote: "Let your light shine so others can see it.", ref: "Matt 5:16" },
  "3-23": { action: "Smell something beautiful — flowers, rain, fresh air!", quote: "God loves us and fills the world with good things.", ref: "2 Cor 2:15" },
  "3-24": { action: "Tell someone three wonderful things about them!", quote: "Help each other every day.", ref: "Heb 3:13" },
  "3-25": { action: "Be gentle today with your words.", quote: "A gentle word is like a tree that gives life.", ref: "Prov 15:4" },
  "3-26": { action: "Do a good deed and keep it secret!", quote: "Your Father who sees what is done in secret will reward you.", ref: "Matt 6:4" },
  "3-27": { action: "Take a walk and say hello to nature!", quote: "The earth belongs to the Lord — and everything in it.", ref: "Ps 24:1" },
  "3-28": { action: "Make something beautiful out of what you have.", quote: "Work at everything you do with all your heart.", ref: "Col 3:23" },
  "3-29": { action: "Say a prayer for someone who needs help today.", quote: "Turn all your worries over to God. He cares about you.", ref: "1 Pet 5:7" },
  "3-30": { action: "Count your blessings out loud!", quote: "Count your blessings — name them one by one.", ref: "Hymn" },
  "3-31": { action: "March is over — what made you happiest this month?", quote: "This is the day the Lord has made. Let's be joyful today!", ref: "Ps 118:24" },
  "4-1":  { action: "April is here — something wonderful is coming!", quote: "And hope never makes us ashamed.", ref: "Rom 5:5" },
  "4-2":  { action: "Be gentle and kind to everyone today.", quote: "Jesus knelt down and washed his friends' feet to show his love.", ref: "John 13:5" },
  "4-3":  { action: "Remember — love is stronger than anything.", quote: "No one has greater love than the one who gives their life for their friends.", ref: "John 15:13" },
  "4-4":  { action: "Look for new life everywhere today!", quote: "I am doing something new! Do you see it happening?", ref: "Isa 43:19" },
  "4-5":  { action: "Happy Easter! He is risen — today is the most joyful day!", quote: "I am the resurrection and the life.", ref: "John 11:25" },
  "4-6":  { action: "Share your joy with someone today!", quote: "Be joyful in the Lord always. I will say it again — be joyful!", ref: "Phil 4:4" },
  "4-7":  { action: "Plant a seed today — real or in your heart!", quote: "A person will harvest what they plant.", ref: "Gal 6:7" },
  "4-8":  { action: "Dance in the rain if you can today!", quote: "God sends rain on good people and bad people alike.", ref: "Matt 5:45" },
  "4-9":  { action: "Watch for a bird — they sing just for you!", quote: "Look at the birds in the sky. Your Father in heaven feeds them.", ref: "Matt 6:26" },
  "4-10": { action: "Be a butterfly today — spread beauty everywhere!", quote: "Anyone who believes in Christ is a new creation.", ref: "2 Cor 5:17" },
  "4-11": { action: "Do something that makes your heart happy!", quote: "Find your delight in the Lord.", ref: "Ps 37:4" },
  "4-12": { action: "Help set the table for dinner tonight.", quote: "Serve one another in a spirit of love.", ref: "Gal 5:13" },
  "4-13": { action: "Be kind to the earth — pick up one piece of litter.", quote: "The Lord God put the man in the Garden of Eden to take care of it.", ref: "Gen 2:15" },
  "4-14": { action: "Smile at every single person you see today!", quote: "A happy heart makes a face look cheerful.", ref: "Prov 15:13" },
  "4-15": { action: "Jump in a puddle — spring is celebrating!", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "4-16": { action: "Tell someone how much they mean to you.", quote: "Love each other just as I have loved you.", ref: "John 15:12" },
  "4-17": { action: "Look up at the sky — what do you see?", quote: "The skies tell about the amazing things God does.", ref: "Ps 19:1" },
  "4-18": { action: "Feed the ducks or birds if you can today!", quote: "God gives food to every creature.", ref: "Ps 136:25" },
  "4-19": { action: "Thank God for the beautiful earth today!", quote: "The earth belongs to the Lord — and everything in it.", ref: "Ps 24:1" },
  "4-20": { action: "Do your very best work today!", quote: "Work at everything you do with all your heart.", ref: "Col 3:23" },
  "4-21": { action: "Be curious today — ask a big question!", quote: "Ask and it will be given to you. Search and you will find.", ref: "Matt 7:7" },
  "4-22": { action: "Happy Earth Day! Take care of our beautiful planet!", quote: "The Lord God put the man in the Garden of Eden to take care of it.", ref: "Gen 2:15" },
  "4-23": { action: "Bee kind today — busy and helpful!", quote: "God's words are sweeter than honey.", ref: "Ps 119:103" },
  "4-24": { action: "Tell someone you are proud of them!", quote: "Be joyful with those who are joyful.", ref: "Rom 12:15" },
  "4-25": { action: "Be patient — like a seed waiting to grow.", quote: "Be patient and stand firm.", ref: "James 5:7" },
  "4-26": { action: "Build something with your hands today!", quote: "The Lord God formed the man from the dust of the ground.", ref: "Gen 2:7" },
  "4-27": { action: "Go outside and listen — what do you hear?", quote: "Be still and know that I am God.", ref: "Ps 46:10" },
  "4-28": { action: "Help a friend who is feeling sad.", quote: "Help carry each other's heavy loads.", ref: "Gal 6:2" },
  "4-29": { action: "April showers bring May flowers — what are you growing?", quote: "At just the right time we will harvest if we don't give up.", ref: "Gal 6:9" },
  "4-30": { action: "April is ending — what beauty did it bring you?", quote: "This is the day the Lord has made. Let's be joyful today!", ref: "Ps 118:24" },
  "5-1":  { action: "May is here! Do something wonderful today.", quote: "This is the day the Lord has made. Let's be joyful today!", ref: "Ps 118:24" },
  "5-2":  { action: "Pick a flower or draw one for someone you love.", quote: "See how the flowers grow! Even Solomon was not dressed as beautifully as one of these.", ref: "Matt 6:29" },
  "5-3":  { action: "Feel the sunshine on your face and say thank you!", quote: "The Lord God is like the sun that gives us light.", ref: "Ps 84:11" },
  "5-4":  { action: "Watch a mama bird with her babies — how does she love them?", quote: "As a mother comforts her child, I will comfort you.", ref: "Isa 66:13" },
  "5-5":  { action: "Make a bouquet out of anything you find!", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "5-6":  { action: "Be a butterfly — bring beauty everywhere you go!", quote: "Let everything that has breath praise the Lord!", ref: "Ps 150:6" },
  "5-7":  { action: "Help in the garden if you can today.", quote: "I am the vine. You are the branches.", ref: "John 15:5" },
  "5-8":  { action: "Follow the bees — where do they go?", quote: "God's words are sweeter than honey.", ref: "Ps 119:103" },
  "5-9":  { action: "Give your mama or grandma the biggest hug!", quote: "Her children stand up and say good things about her.", ref: "Prov 31:28" },
  "5-10": { action: "Be as busy as a bee today — helpful and hardworking!", quote: "Work at everything you do with all your heart.", ref: "Eccl 9:10" },
  "5-11": { action: "Happy Mother's Day! Love your mama with your whole heart!", quote: "Honor your father and mother.", ref: "Exod 20:12" },
  "5-12": { action: "Tell someone what you love most about them.", quote: "Kind words are like honey — sweet and good.", ref: "Prov 16:24" },
  "5-13": { action: "Count five things blooming or growing around you!", quote: "The earth produced plants and trees, just as God had planned.", ref: "Gen 1:12" },
  "5-14": { action: "Surprise someone with something kind today!", quote: "Every good and perfect gift comes down from God.", ref: "James 1:17" },
  "5-15": { action: "Climb a tree or sit under one and think big thoughts!", quote: "That person is like a tree planted by streams of water.", ref: "Ps 1:3" },
  "5-16": { action: "Be brave and try something that feels scary!", quote: "Be strong and brave! I commanded you to be strong and brave!", ref: "Josh 1:9" },
  "5-17": { action: "Be gentle with every creature you find today.", quote: "A good person takes care of their animals.", ref: "Prov 12:10" },
  "5-18": { action: "Twirl in the sunshine — just because you can!", quote: "The joy of the Lord makes you strong.", ref: "Neh 8:10" },
  "5-19": { action: "Do something to make your home more beautiful today.", quote: "If the Lord does not build the house, the builders are working for nothing.", ref: "Ps 127:1" },
  "5-20": { action: "Fly a kite or watch one — let your spirit soar!", quote: "They will soar on wings like eagles.", ref: "Isa 40:31" },
  "5-21": { action: "Be a caterpillar today — one day you will be a butterfly!", quote: "God began a good work in you. I am sure he will carry it on until it is finished.", ref: "Phil 1:6" },
  "5-22": { action: "Lie in the grass and watch the clouds move.", quote: "Be still and know that I am God.", ref: "Ps 46:10" },
  "5-23": { action: "Move slowly today like a snail — notice everything!", quote: "Be still and know that I am God.", ref: "Ps 46:10" },
  "5-24": { action: "Jump like a frog — leap with joy!", quote: "Be joyful in the Lord always!", ref: "Phil 4:4" },
  "5-25": { action: "Watch something swim today.", quote: "He leads me beside quiet waters.", ref: "Ps 23:2" },
  "5-26": { action: "Say thank you to a helper in your community today!", quote: "Look out for the interests of others, not just your own.", ref: "Phil 2:4" },
  "5-27": { action: "Eat something red and sweet today!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "5-28": { action: "School is almost done — what did you learn this year?", quote: "The most important thing is to get wisdom.", ref: "Prov 4:7" },
  "5-29": { action: "Draw a picture of your favorite thing about school.", quote: "A wise child makes his father glad.", ref: "Prov 10:1" },
  "5-30": { action: "Summer is almost here — what are you most excited for?", quote: "When a wish comes true, it is like eating fruit from the tree of life.", ref: "Prov 13:12" },
  "5-31": { action: "Chase a dragonfly today — they are magical!", quote: "The Lord has made everything for a reason.", ref: "Prov 16:4" },
  "6-1":  { action: "Summer is here! Run outside and celebrate!", quote: "This is the day the Lord has made. Let's be joyful today!", ref: "Ps 118:24" },
  "6-2":  { action: "Make a wave — in the water or just with your hand!", quote: "God calmed the storm and made the waves quiet.", ref: "Ps 107:29" },
  "6-3":  { action: "Collect something beautiful from the ground today.", quote: "The earth is full of your riches, Lord.", ref: "Ps 104:24" },
  "6-4":  { action: "Choose joy today — even when it is hard!", quote: "Always be joyful!", ref: "1 Thess 5:16" },
  "6-5":  { action: "Watch a fish — be calm and quiet like the sea.", quote: "God calmed the storm and made the waves quiet.", ref: "Ps 107:29" },
  "6-6":  { action: "Feel the sun on your skin and say thank you!", quote: "The Lord God is like the sun that gives us light.", ref: "Ps 84:11" },
  "6-7":  { action: "Find a starfish shape today — in sand, clouds, or stars!", quote: "God counts all the stars and knows each one by name.", ref: "Ps 147:4" },
  "6-8":  { action: "Swim or splash in water if you can — be free!", quote: "He leads me beside quiet waters.", ref: "Ps 23:2" },
  "6-9":  { action: "Wear your most colorful outfit today!", quote: "God, you are dressed in glory and majesty.", ref: "Ps 104:1" },
  "6-10": { action: "Dance with your whole body today!", quote: "Let them praise God's name with dancing!", ref: "Ps 149:3" },
  "6-11": { action: "Smell something sweet today — flowers or fresh air!", quote: "God fills the world with beautiful things.", ref: "2 Cor 2:15" },
  "6-12": { action: "Find a rainbow after the rain today!", quote: "I have put my rainbow in the clouds.", ref: "Gen 9:13" },
  "6-13": { action: "Climb something tall and look out — the world is beautiful!", quote: "The skies tell about the amazing things God does.", ref: "Ps 19:1" },
  "6-14": { action: "Eat something cold and sweet — you earned it!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "6-15": { action: "Happy Father's Day! Give your daddy the biggest hug!", quote: "Honor your father and mother.", ref: "Exod 20:12" },
  "6-16": { action: "Watch a dolphin video — they leap for pure joy!", quote: "Let everything that has breath praise the Lord!", ref: "Ps 150:6" },
  "6-17": { action: "Watch the sunset tonight — count all the colors!", quote: "From where the sun rises to where it sets, people praise the Lord.", ref: "Ps 113:3" },
  "6-18": { action: "Lie on your back and find shapes in the clouds.", quote: "God fills the sky with clouds.", ref: "Job 37:11" },
  "6-19": { action: "Happy Juneteenth! Everyone deserves to be free and loved!", quote: "Announce freedom for everyone in the land.", ref: "Lev 25:10" },
  "6-20": { action: "How big is the ocean — how big is God!", quote: "The sea is huge! It is wide! It is full of more creatures than you can count.", ref: "Ps 104:25" },
  "6-21": { action: "Eat something tropical and sweet today!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "6-22": { action: "Let something sweet melt on your tongue — summer!", quote: "God's words taste sweeter than honey.", ref: "Ps 119:103" },
  "6-23": { action: "Look under a rock today — a whole world lives there!", quote: "The earth is full of your riches, Lord.", ref: "Ps 104:24" },
  "6-24": { action: "Pick a bright flower and give it to someone!", quote: "See how the flowers grow! God dresses them beautifully!", ref: "Matt 6:28" },
  "6-25": { action: "Find a roly-poly and watch it move!", quote: "Lord, you have made so many things! How wise you were when you made all of them!", ref: "Ps 104:24" },
  "6-26": { action: "Build a sandcastle or a tower today!", quote: "A wise person builds their house on the rock.", ref: "Matt 7:24" },
  "6-27": { action: "Watch the birds — be free like them today!", quote: "Look at the birds in the sky. Your Father in heaven feeds them.", ref: "Matt 6:26" },
  "6-28": { action: "Be an anchor today — steady and strong for someone.", quote: "We have this hope as an anchor for our souls.", ref: "Heb 6:19" },
  "6-29": { action: "Notice a fish today — how does it move in the water?", quote: "God created the large sea creatures.", ref: "Gen 1:21" },
  "6-30": { action: "Say hello and goodbye with love to everyone today!", quote: "May the Lord bless you and take care of you.", ref: "Num 6:24" },
  "7-1":  { action: "July is here! Be as bright as fireworks today!", quote: "Get up and shine! Your light has come!", ref: "Isa 60:1" },
  "7-2":  { action: "Wave something bright and say you are proud!", quote: "Let your light shine so others can see it.", ref: "Matt 5:16" },
  "7-3":  { action: "Fizz and sparkle today like a sparkler!", quote: "The joy of the Lord makes you strong.", ref: "Neh 8:10" },
  "7-4":  { action: "Happy 4th of July! Be thankful for freedom today!", quote: "Announce freedom for everyone in the land.", ref: "Lev 25:10" },
  "7-5":  { action: "Soar like an eagle — you are brave and free!", quote: "They will soar on wings like eagles.", ref: "Isa 40:31" },
  "7-6":  { action: "Cheer for something — be in the parade of life!", quote: "Be joyful in the Lord always!", ref: "Phil 4:4" },
  "7-7":  { action: "Eat a slice of watermelon today — savor every bite!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "7-8":  { action: "Feel the sand between your toes — or imagine it!", quote: "He lets me lie down in fields of green grass.", ref: "Ps 23:2" },
  "7-9":  { action: "Feel the sunshine and say — I am glad to be alive!", quote: "The Lord God is like the sun that gives us light.", ref: "Ps 84:11" },
  "7-10": { action: "Make a big splash today!", quote: "Let fair treatment flow like a river!", ref: "Amos 5:24" },
  "7-11": { action: "Find a colorful bug and admire its colors!", quote: "Lord, you have made so many things! How wise you were when you made all of them!", ref: "Ps 104:24" },
  "7-12": { action: "Float on your back — rest and let God hold you!", quote: "God gives sleep to those he loves.", ref: "Ps 127:2" },
  "7-13": { action: "Jump and leap like a dolphin today!", quote: "Be very glad and joyful!", ref: "Matt 5:12" },
  "7-14": { action: "Collect the most beautiful shell or stone you can find!", quote: "The earth is full of your riches, Lord.", ref: "Ps 104:24" },
  "7-15": { action: "Walk sideways like a crab — and laugh at yourself!", quote: "A cheerful heart makes you feel good.", ref: "Prov 17:22" },
  "7-16": { action: "Lick an ice cream cone very slowly — savor it!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "7-17": { action: "Build something with your hands today!", quote: "The Lord God formed man of the dust of the ground.", ref: "Gen 2:7" },
  "7-18": { action: "Make a flower crown or a crown of leaves!", quote: "God crowns the year with his good gifts.", ref: "Ps 65:11" },
  "7-19": { action: "Watch the sunset — count every color in the sky!", quote: "From where the sun rises to where it sets, people praise the Lord.", ref: "Ps 113:3" },
  "7-20": { action: "Build the biggest sandcastle you can imagine!", quote: "A wise person builds their house on the rock.", ref: "Matt 7:24" },
  "7-21": { action: "Chase a butterfly today — it is leading you to beauty!", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "7-22": { action: "Water something that is growing!", quote: "I planted the seed. Someone else watered it. But God made it grow.", ref: "1 Cor 3:6" },
  "7-23": { action: "Face the sun like a sunflower — always look for the light!", quote: "Get up and shine! Your light has come!", ref: "Isa 60:1" },
  "7-24": { action: "Eat corn on the cob — feel grateful for farmers!", quote: "The earth produced plants and trees, just as God had planned.", ref: "Gen 1:12" },
  "7-25": { action: "Pick berries or eat something that grew from the earth!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "7-26": { action: "Share a cup of lemonade with someone!", quote: "Give to others and it will be given to you.", ref: "Luke 6:38" },
  "7-27": { action: "Fly a kite — let your spirit soar high!", quote: "They will soar on wings like eagles.", ref: "Isa 40:31" },
  "7-28": { action: "Lie in the grass and find pictures in the clouds.", quote: "God fills the sky with clouds.", ref: "Job 37:11" },
  "7-29": { action: "Float a leaf on water and watch it travel.", quote: "He leads me beside quiet waters.", ref: "Ps 23:2" },
  "7-30": { action: "Catch fireflies or look for stars — light in the dark!", quote: "Your word is like a lamp that shows me the way.", ref: "Ps 119:105" },
  "7-31": { action: "July is almost done — name your favorite memory!", quote: "I will remember what the Lord has done.", ref: "Ps 77:11" },
  "8-1":  { action: "Pack your backpack with excitement — adventures ahead!", quote: "I know the plans I have for you. I will give you hope and a good future.", ref: "Jer 29:11" },
  "8-2":  { action: "Sharpen your pencil and get ready to learn!", quote: "The most important thing is to get wisdom.", ref: "Prov 4:7" },
  "8-3":  { action: "Open a book and go on an adventure!", quote: "Your word is like a lamp that shows me the way.", ref: "Ps 119:105" },
  "8-4":  { action: "Bring kindness to everyone who helps you learn!", quote: "A wise child makes his father glad.", ref: "Prov 10:1" },
  "8-5":  { action: "Learn something new today — your brain loves it!", quote: "Get wisdom. No matter what it costs, get understanding.", ref: "Prov 4:7" },
  "8-6":  { action: "Start the day with a big smile!", quote: "This is the day the Lord has made. Let's be joyful today!", ref: "Ps 118:24" },
  "8-7":  { action: "Use your brightest crayons today — color the world!", quote: "God, you are dressed in glory and majesty.", ref: "Ps 104:1" },
  "8-8":  { action: "Measure something today — how tall are you?", quote: "Can you add even one hour to your life by worrying?", ref: "Matt 6:27" },
  "8-9":  { action: "Soak up the sun before summer ends!", quote: "The Lord God is like the sun that gives us light.", ref: "Ps 84:11" },
  "8-10": { action: "Face the sun like a sunflower — always seek the light!", quote: "Get up and shine! Your light has come!", ref: "Isa 60:1" },
  "8-11": { action: "Eat something golden today — corn, peaches, honey!", quote: "God's words taste sweeter than honey.", ref: "Ps 119:103" },
  "8-12": { action: "You are changing and growing — like a butterfly!", quote: "God began a good work in you. I am sure he will carry it on until it is finished.", ref: "Phil 1:6" },
  "8-13": { action: "Watch a dragonfly — they have been flying since dinosaurs!", quote: "Lord, you have made so many things!", ref: "Ps 104:24" },
  "8-14": { action: "Water every growing thing you can find!", quote: "God sends streams into the valleys.", ref: "Ps 104:10" },
  "8-15": { action: "Watch a fish and be calm — just breathe.", quote: "Be still and know that I am God.", ref: "Ps 46:10" },
  "8-16": { action: "Jump in a puddle — summer is still here!", quote: "Be very glad and joyful!", ref: "Matt 5:12" },
  "8-17": { action: "Eat a slice of watermelon — summer's sweetest gift!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "8-18": { action: "Pick something blue and beautiful today!", quote: "The earth is full of your riches, Lord.", ref: "Ps 104:24" },
  "8-19": { action: "Smell a peach — autumn is whispering hello!", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "8-20": { action: "Notice the days getting shorter — autumn is coming!", quote: "There is a time for everything.", ref: "Eccl 3:1" },
  "8-21": { action: "Find the first yellow leaf of the year!", quote: "There is a time for everything and a season for every activity.", ref: "Eccl 3:1" },
  "8-22": { action: "Collect an acorn — hold the whole forest in your hand!", quote: "If your faith is as small as a mustard seed, nothing will be impossible for you.", ref: "Matt 17:20" },
  "8-23": { action: "Look for a spiderweb — it is the most amazing building!", quote: "Lord, you have made so many things! How wise you were when you made all of them!", ref: "Ps 104:24" },
  "8-24": { action: "Find a bee and follow it — they are hardworking and wise!", quote: "God's words taste sweeter than honey.", ref: "Ps 119:103" },
  "8-25": { action: "Find a grasshopper — they leap with joy!", quote: "Be joyful in the Lord always!", ref: "Phil 4:4" },
  "8-26": { action: "Create something with scissors and paper today!", quote: "Whatever your hand finds to do, do it with all your might.", ref: "Eccl 9:10" },
  "8-27": { action: "Make something stick today — a friendship, a smile!", quote: "Some friends are more loyal than brothers.", ref: "Prov 18:24" },
  "8-28": { action: "Fill your notebook with one great idea!", quote: "Write down the message I am going to show you.", ref: "Hab 2:2" },
  "8-29": { action: "Make a new friend — or be extra kind to an old one!", quote: "A person who wants friends must be friendly.", ref: "Prov 18:24" },
  "8-30": { action: "Summer is ending — give it one last big hug!", quote: "There is a time for everything.", ref: "Eccl 3:1" },
  "8-31": { action: "August is done — what wonderful thing will September bring?", quote: "I know the plans I have for you. I will give you hope and a good future.", ref: "Jer 29:11" },
  "9-1":  { action: "The leaves are changing — so are you! Growing every day.", quote: "There is a time for everything.", ref: "Eccl 3:1" },
  "9-2":  { action: "Collect the most beautiful leaf you can find!", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "9-3":  { action: "Eat a crunchy apple today — autumn is here!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "9-4":  { action: "Go to school with a brave and happy heart!", quote: "Be strong and brave. Do not be terrified.", ref: "Josh 1:9" },
  "9-5":  { action: "Smile at someone new today!", quote: "A person who wants friends must be friendly.", ref: "Prov 18:24" },
  "9-6":  { action: "Write neatly today — letters are a gift you give your reader!", quote: "Write down the message I am going to show you.", ref: "Hab 2:2" },
  "9-7":  { action: "Watch a squirrel — they prepare with great wisdom!", quote: "Look at the ant! Think about how it lives and become wise.", ref: "Prov 6:6" },
  "9-8":  { action: "Find a mushroom — what a magical little house!", quote: "The earth is full of your riches, Lord.", ref: "Ps 104:24" },
  "9-9":  { action: "Eat something green today — it grows for you!", quote: "God makes the grass grow.", ref: "Ps 104:14" },
  "9-10": { action: "Fill a basket with beautiful things you find outside!", quote: "God crowns the year with his good gifts.", ref: "Ps 65:11" },
  "9-11": { action: "Thank someone who keeps you safe today.", quote: "He will command his angels to take care of you.", ref: "Ps 91:11" },
  "9-12": { action: "Find a spider web and marvel at its beauty!", quote: "Lord, you have made so many things! How wise you were when you made all of them!", ref: "Ps 104:24" },
  "9-13": { action: "Listen carefully today — wisdom is all around you!", quote: "The Lord gives wisdom. Knowledge and understanding come from his mouth.", ref: "Prov 2:6" },
  "9-14": { action: "Happy Ganesha Chaturthi! Remove all obstacles with wisdom and love!", quote: "Get wisdom. No matter what it costs, get understanding.", ref: "Prov 4:7" },
  "9-15": { action: "Jump in a pile of leaves — or imagine one!", quote: "Be very glad and joyful!", ref: "Matt 5:12" },
  "9-16": { action: "Count how many colors the trees are turning!", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "9-17": { action: "Eat something purple today — grapes, plums, cabbage!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "9-18": { action: "Walk in the fog and imagine you are in a cloud!", quote: "God fills the sky with clouds.", ref: "Job 37:11" },
  "9-19": { action: "Walk quietly in the woods — what do you hear?", quote: "Be still and know that I am God.", ref: "Ps 46:10" },
  "9-20": { action: "Pick berries or look for the last fruits of summer!", quote: "The earth produced plants and trees, just as God had planned.", ref: "Gen 1:12" },
  "9-21": { action: "At dusk, look at the moon rising — it is enormous!", quote: "God made the moon to mark the seasons.", ref: "Ps 104:19" },
  "9-22": { action: "Climb on a pile of leaves and shout for joy!", quote: "Shout for joy to the Lord!", ref: "Ps 100:1" },
  "9-23": { action: "Find a bright red leaf and press it in a book!", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "9-24": { action: "Hold an acorn — inside is a whole oak tree! You contain greatness too!", quote: "How you made me is amazing and wonderful!", ref: "Ps 139:14" },
  "9-25": { action: "Find a funny-shaped gourd and give it a name!", quote: "A cheerful heart makes you feel good.", ref: "Prov 17:22" },
  "9-26": { action: "Fill a basket with good things and give some away!", quote: "Give to others and it will be given to you.", ref: "Luke 6:38" },
  "9-27": { action: "Stand tall today — you are brave and strong!", quote: "Be strong and brave.", ref: "Josh 1:9" },
  "9-28": { action: "Look for the harvest moon tonight — it is enormous!", quote: "God made the moon to mark the seasons.", ref: "Ps 104:19" },
  "9-29": { action: "Make someone laugh today — then be kind!", quote: "A cheerful heart makes you feel good.", ref: "Prov 17:22" },
  "9-30": { action: "September is over — what are you most grateful for?", quote: "Give thanks no matter what happens.", ref: "1 Thess 5:18" },
  "10-1":  { action: "October! The whole world is turning golden!", quote: "God crowns the year with his good gifts.", ref: "Ps 65:11" },
  "10-2":  { action: "Jump in every leaf pile you find today!", quote: "Be very glad and joyful!", ref: "Matt 5:12" },
  "10-3":  { action: "Eat a caramel apple or something sweet and autumny!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "10-4":  { action: "Be kind to an animal today — all creatures are beloved!", quote: "A good person takes care of their animals.", ref: "Prov 12:10" },
  "10-5":  { action: "Collect the most colorful leaves you can find!", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "10-6":  { action: "Bake something or help in the kitchen today!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "10-7":  { action: "Sit by a fire or imagine one — feel warm and cozy!", quote: "God your Lord is with you everywhere you go.", ref: "Josh 1:9" },
  "10-8":  { action: "Pick out your favorite pumpkin today!", quote: "The earth produced plants and trees, just as God had planned.", ref: "Gen 1:12" },
  "10-9":  { action: "Crunch through leaves — autumn is singing under your feet!", quote: "Shout for joy to the Lord!", ref: "Ps 100:1" },
  "10-10": { action: "Watch the sky at dusk — the colors are magical!", quote: "From the rising of the sun unto the going down of the same.", ref: "Ps 113:3" },
  "10-11": { action: "Wear your coziest sweater today!", quote: "God your Lord is with you everywhere you go.", ref: "Josh 1:9" },
  "10-12": { action: "Make something with fallen leaves — art from nature!", quote: "Work at everything you do with all your heart.", ref: "Eccl 9:10" },
  "10-13": { action: "Explore something new — be a brave adventurer!", quote: "Ask and it will be given to you. Search and you will find.", ref: "Matt 7:7" },
  "10-14": { action: "Find a pinecone — inside are a hundred trees!", quote: "If your faith is as small as a mustard seed, nothing will be impossible for you.", ref: "Matt 17:20" },
  "10-15": { action: "Carve a smile on a pumpkin — spread joy!", quote: "A happy heart makes a face look cheerful.", ref: "Prov 15:13" },
  "10-16": { action: "Feel the crisp air — autumn is a gift!", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "10-17": { action: "Make apple cider or apple juice — taste autumn!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "10-18": { action: "Rake leaves into a giant pile — then leap!", quote: "Be joyful in the Lord always!", ref: "Phil 4:4" },
  "10-19": { action: "Find the most perfect maple leaf and press it flat.", quote: "God makes everything beautiful at just the right time.", ref: "Eccl 3:11" },
  "10-20": { action: "Count how many different colors you can spot outside!", quote: "He clotheth himself with light as with a garment.", ref: "Ps 104:2" },
  "10-21": { action: "Happy Dussehra! Goodness always wins over darkness — be the light!", quote: "Rama's righteousness shone like the sun and nothing could defeat it.", ref: "Ramayana" },
  "10-22": { action: "Be brave today — like Rama who never gave up!", quote: "Be strong and brave. Do not be terrified.", ref: "Josh 1:9" },
  "10-23": { action: "Light a candle or a diya and watch the darkness disappear!", quote: "Your word is like a lamp that shows me the way.", ref: "Ps 119:105" },
  "10-24": { action: "Make a colorful pattern with chalk or crayons!", quote: "Work at everything you do with all your heart.", ref: "Col 3:23" },
  "10-25": { action: "Carve a funny face — laughter is a light in the dark!", quote: "A cheerful heart makes you feel good.", ref: "Prov 17:22" },
  "10-26": { action: "Wear your favorite cozy color today!", quote: "Get wisdom. No matter what it costs, get understanding.", ref: "Prov 4:7" },
  "10-27": { action: "Eat candy corn and count — every color is different!", quote: "Lord, you have made so many things!", ref: "Ps 104:24" },
  "10-28": { action: "Make a friendly ghost — not all scary things are scary!", quote: "Do not be afraid. I am with you.", ref: "Isa 41:10" },
  "10-29": { action: "Crunch through the last of the autumn leaves!", quote: "There is a time for everything.", ref: "Eccl 3:1" },
  "10-30": { action: "Tonight, the stars are extra bright — look up!", quote: "God counts all the stars and knows each one by name.", ref: "Ps 147:4" },
  "10-31": { action: "Happy Halloween! Be kind to every neighbor tonight!", quote: "Love your neighbor as you love yourself.", ref: "Mark 12:31" },
  "11-1":  { action: "Happy All Saints Day! We are surrounded by love!", quote: "We are surrounded by a huge number of witnesses to the life of faith.", ref: "Heb 12:1" },
  "11-2":  { action: "Say thank you for something small today.", quote: "Give thanks no matter what happens.", ref: "1 Thess 5:18" },
  "11-3":  { action: "Find one golden thing today — a leaf, a flower, sunlight!", quote: "Every good and perfect gift comes down from God.", ref: "James 1:17" },
  "11-4":  { action: "Name five things you are thankful for right now!", quote: "Give thanks to the Lord because he is good.", ref: "Ps 107:1" },
  "11-5":  { action: "Collect acorns like a squirrel — prepare with wisdom!", quote: "Look at the ant! Think about how it lives and become wise.", ref: "Prov 6:6" },
  "11-6":  { action: "Smell cinnamon today — it is the smell of thankfulness!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "11-7":  { action: "Eat something golden and warm today!", quote: "God's words taste sweeter than honey.", ref: "Ps 119:103" },
  "11-8":  { action: "Happy Diwali! Light a diya — you are a light in this world!", quote: "You are the light of the world — a city on a hill cannot be hidden.", ref: "Matt 5:14" },
  "11-9":  { action: "The Festival of Lights is here — spread light everywhere!", quote: "Lakshmi brings prosperity, love, and light wherever she goes.", ref: "Diwali" },
  "11-10": { action: "Light a candle today and make a wish for someone you love.", quote: "Your word is like a lamp that shows me the way.", ref: "Ps 119:105" },
  "11-11": { action: "Happy Veterans Day! Thank someone who keeps us safe!", quote: "No one has greater love than the one who gives their life for their friends.", ref: "John 15:13" },
  "11-12": { action: "Watch the bare trees — they are resting and will bloom again!", quote: "There is a time for everything.", ref: "Eccl 3:1" },
  "11-13": { action: "Make a pie or help bake something sweet!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "11-14": { action: "Gather nuts like a squirrel — be wise and prepared!", quote: "A wise person sees danger ahead and avoids it.", ref: "Prov 22:3" },
  "11-15": { action: "Hug your family extra tight today!", quote: "How good and pleasant it is when God's people live together in peace!", ref: "Ps 133:1" },
  "11-16": { action: "Find a pinecone and put it somewhere beautiful.", quote: "The earth is full of your riches, Lord.", ref: "Ps 104:24" },
  "11-17": { action: "Smell fresh bread baking — it is the smell of home!", quote: "I am the bread of life.", ref: "John 6:35" },
  "11-18": { action: "Give someone the biggest hug they have ever had!", quote: "Love each other just as I have loved you.", ref: "John 15:12" },
  "11-19": { action: "Do something kind for a neighbor today!", quote: "Love your neighbor as you love yourself.", ref: "Mark 12:31" },
  "11-20": { action: "Set the table beautifully for your family tonight!", quote: "You prepare a feast for me.", ref: "Ps 23:5" },
  "11-21": { action: "Wear a silly hat and make someone laugh!", quote: "A cheerful heart makes you feel good.", ref: "Prov 17:22" },
  "11-22": { action: "Fill your plate with gratitude as much as food!", quote: "You prepare a feast for me.", ref: "Ps 23:5" },
  "11-23": { action: "Thank someone who made a long journey for you.", quote: "You are blessed because you believed the Lord would keep his promises to you.", ref: "Luke 1:45" },
  "11-24": { action: "Honor those who came before us and share their stories.", quote: "Remember the days of long ago. Think about what happened in each generation.", ref: "Deut 32:7" },
  "11-25": { action: "Walk through autumn leaves and say thank you with every step!", quote: "Give thanks to the Lord because he is good.", ref: "Ps 107:1" },
  "11-26": { action: "Happy Thanksgiving! Count your blessings — all of them!", quote: "Every good and perfect gift comes down from God.", ref: "James 1:17" },
  "11-27": { action: "Share your leftovers or kindness with someone who needs them!", quote: "Give to others and it will be given to you.", ref: "Luke 6:38" },
  "11-28": { action: "Walk in the bare forest — rest is beautiful too.", quote: "He lets me lie down in fields of green grass. He gives me new strength.", ref: "Ps 23:2" },
  "11-29": { action: "Advent begins! Light the first candle — waiting is holy!", quote: "When hope is put off, it makes your heart sick. But when dreams come true, it is like eating fruit from the tree of life.", ref: "Prov 13:12" },
  "11-30": { action: "November is ending — what are you most grateful for?", quote: "Give thanks no matter what happens.", ref: "1 Thess 5:18" },
  "12-1":  { action: "Advent! One candle lit — the light is coming!", quote: "The people who walked in darkness have seen a great light.", ref: "Isa 9:2" },
  "12-2":  { action: "Make a paper snowflake — every one is unique, just like you!", quote: "How you made me is amazing and wonderful!", ref: "Ps 139:14" },
  "12-3":  { action: "Give something away today — it feels better than keeping!", quote: "It is more blessed to give than to receive.", ref: "Acts 20:35" },
  "12-4":  { action: "Light a candle at dinner and eat by its warm glow.", quote: "Your word is like a lamp that shows me the way.", ref: "Ps 119:105" },
  "12-5":  { action: "Write a letter to someone who is far away!", quote: "Write down the message I am going to show you.", ref: "Hab 2:2" },
  "12-6":  { action: "Leave a small gift for someone who least expects it!", quote: "Every good and perfect gift comes down from God.", ref: "James 1:17" },
  "12-7":  { action: "Sing a Christmas carol — even if you only know the first line!", quote: "Let everything that has breath praise the Lord!", ref: "Ps 150:6" },
  "12-8":  { action: "Make cookies for someone who needs cheering up!", quote: "God's words taste so sweet!", ref: "Ps 119:103" },
  "12-9":  { action: "Look at the stars tonight — the same ones the wise men followed!", quote: "A star will come from Jacob's family.", ref: "Num 24:17" },
  "12-10": { action: "Draw a picture of your family and give it as a gift!", quote: "How good and pleasant it is when God's people live together in peace!", ref: "Ps 133:1" },
  "12-11": { action: "Make a card for someone who is lonely this Christmas.", quote: "Love your neighbor as you love yourself.", ref: "Mark 12:31" },
  "12-12": { action: "Count the ornaments on your tree — every one is a memory!", quote: "God counts all the stars and knows each one by name.", ref: "Ps 147:4" },
  "12-13": { action: "Unwrap the greatest gift — today is given to you!", quote: "This is the day the Lord has made. Let's be joyful today!", ref: "Ps 118:24" },
  "12-14": { action: "Wrap a gift with great love — it matters more than the ribbon!", quote: "More than anything, love one another deeply.", ref: "Col 3:14" },
  "12-15": { action: "Eat a candy cane and remember the sweetness of the season!", quote: "A child is born to us. A son is given to us.", ref: "Isa 9:6" },
  "12-16": { action: "Fly a paper dove — peace to everyone today!", quote: "Glory to God in the highest! And peace on earth to those he is pleased with.", ref: "Luke 2:14" },
  "12-17": { action: "Watch the sheep in a nativity — they were the first to hear!", quote: "The shepherds said to one another — let's go to Bethlehem!", ref: "Luke 2:15" },
  "12-18": { action: "Bake Christmas cookies with someone you love!", quote: "A cheerful heart makes you feel good.", ref: "Prov 17:22" },
  "12-19": { action: "Follow a star tonight — even the wise men needed guidance!", quote: "We saw his star when it rose. We have come to worship him.", ref: "Matt 2:2" },
  "12-20": { action: "Pack your sleigh with kindness and deliver it!", quote: "Give to others and it will be given to you.", ref: "Luke 6:38" },
  "12-21": { action: "Three gifts — what would you give to the baby Jesus?", quote: "They bowed down and worshiped him. Then they opened their treasures and gave him gifts.", ref: "Matt 2:11" },
  "12-22": { action: "Make a wreath of holly — and hang it with love!", quote: "The joy of the Lord makes you strong.", ref: "Neh 8:10" },
  "12-23": { action: "Tomorrow Jesus is born — are you ready to celebrate?", quote: "A child is born to us. A son is given to us!", ref: "Isa 9:6" },
  "12-24": { action: "Christmas Eve! Look for one star brighter than the rest!", quote: "Today a Savior has been born to you. He is the Messiah, the Lord.", ref: "Luke 2:11" },
  "12-25": { action: "Merry Christmas! The greatest gift in the world is here!", quote: "God loved the world so much that he gave his one and only Son.", ref: "John 3:16" },
  "12-26": { action: "Share your Christmas joy with someone today.", quote: "It is more blessed to give than to receive.", ref: "Acts 20:35" },
  "12-27": { action: "Build a snowy village or draw one — peace on earth!", quote: "I leave my peace with you. I give my peace to you.", ref: "John 14:27" },
  "12-28": { action: "End the year with fireworks in your heart!", quote: "Get up and shine! Your light has come!", ref: "Isa 60:1" },
  "12-29": { action: "The year is almost done — what story will you tell about it?", quote: "I will remember what the Lord has done.", ref: "Ps 77:11" },
  "12-30": { action: "Say thank you for every single day of this year!", quote: "Give thanks no matter what happens.", ref: "1 Thess 5:18" },
  "12-31": { action: "Happy New Year's Eve! A whole new year of wonders awaits!", quote: "I am making everything new!", ref: "Rev 21:5" },
};

const HINDU_AFFIRMATIONS: Record<string,{quote:string,ref:string}> = {
  "1-2":  { quote: "Give thanks for this new day — it is a gift.", ref: "" },
  "1-4":  { quote: "Do good without wanting a reward. That is the highest path.", ref: "Gita 3:19" },
  "1-6":  { quote: "Wise ones follow the light wherever it leads them.", ref: "Upanishads" },
  "1-8":  { quote: "Love all beings — God lives inside every heart.", ref: "Gita 13:28" },
  "1-10": { quote: "Giving to others is the greatest form of worship.", ref: "Gita 17:20" },
  "1-12": { quote: "Patience is the greatest virtue. Wait, and good will come.", ref: "Mahabharata" },
  "1-16": { quote: "Every good thing in this world comes from the Divine.", ref: "Gita 10:41" },
  "1-18": { quote: "Speak gently. Words have great power.", ref: "Gita 17:15" },
  "1-20": { quote: "Joy lives inside you — it does not need anything from outside.", ref: "Gita 5:21" },
  "1-22": { quote: "Be grateful for everything. Gratitude opens the door to joy.", ref: "Upanishads" },
  "1-24": { quote: "God is with you always — inside your own heart.", ref: "Gita 18:61" },
  "1-26": { quote: "You can do anything when you act from love, not fear.", ref: "Gita 18:66" },
  "1-28": { quote: "Be kind to yourself. The Divine loves you completely.", ref: "Gita 9:29" },
  "2-2":  { quote: "Help others carry what is heavy. That is dharma.", ref: "Mahabharata" },
  "2-4":  { quote: "Love your family with your whole heart — that is devotion.", ref: "Gita 12:13" },
  "2-6":  { quote: "A generous heart is the greatest treasure.", ref: "Gita 16:1" },
  "2-8":  { quote: "You are loved beyond all measure — always and forever.", ref: "Gita 9:29" },
  "2-10": { quote: "Love is the bridge between you and all of creation.", ref: "Gita 12:13" },
  "2-12": { quote: "Sing to God with a joyful heart — music is a prayer.", ref: "Bhagavatam" },
  "2-14": { quote: "Pure love is the most powerful force in the universe.", ref: "Gita 12:20" },
  "2-16": { quote: "Pray with a pure heart and God will always hear you.", ref: "Gita 9:26" },
  "2-18": { quote: "God made this world beautiful as a gift of love.", ref: "Upanishads" },
  "2-20": { quote: "Let go of anger. A peaceful heart is a happy heart.", ref: "Gita 16:2" },
  "2-22": { quote: "Truth is the highest virtue. Always speak the truth.", ref: "Mahabharata" },
  "2-24": { quote: "Whatever you do, do it as an offering to God.", ref: "Gita 9:27" },
  "2-26": { quote: "Peace begins in your own heart. Nurture it every day.", ref: "Gita 6:7" },
  "3-4":  { quote: "The Divine is dressed in light and wears the universe as a garment.", ref: "Upanishads" },
  "3-6":  { quote: "Sing to God! Music carries prayers straight to heaven.", ref: "Bhagavatam" },
  "3-8":  { quote: "A mother's love is the closest thing to God's love on earth.", ref: "Mahabharata" },
  "3-10": { quote: "Water is sacred. It gives life to all living things.", ref: "Rigveda" },
  "3-12": { quote: "Laughter is a prayer. Joy is devotion.", ref: "Bhagavatam" },
  "3-14": { quote: "Nature is God's temple. Every flower is an offering.", ref: "Upanishads" },
  "3-16": { quote: "Do good deeds quietly. God sees everything.", ref: "Gita 9:26" },
  "3-18": { quote: "Stand up for what is right, just as Rama always did.", ref: "Ramayana" },
  "3-20": { quote: "Everything is born, grows, and is born again — like spring.", ref: "Gita 2:22" },
  "3-22": { quote: "You are made of light. Let it shine on everyone around you.", ref: "Upanishads" },
  "3-24": { quote: "Lift others up with your words — that is seva, selfless service.", ref: "Gita 3:19" },
  "3-26": { quote: "Good deeds done in secret are the purest kind.", ref: "Gita 17:20" },
  "3-28": { quote: "Offer all your work to God and you will always find peace.", ref: "Gita 9:27" },
  "4-2":  { quote: "Serve others as if you are serving God — that is devotion.", ref: "Gita 12:13" },
  "4-4":  { quote: "God is always creating new beauty. Open your eyes to see it.", ref: "Gita 10:41" },
  "4-6":  { quote: "Be joyful! The Divine is dancing inside your heart.", ref: "Bhagavatam" },
  "4-8":  { quote: "Rain is a blessing from heaven. Dance in it gratefully!", ref: "Rigveda" },
  "4-10": { quote: "The soul is like a butterfly — it is always becoming.", ref: "Gita 2:22" },
  "4-12": { quote: "Serve your family lovingly. That is the highest worship.", ref: "Gita 3:19" },
  "4-14": { quote: "A smiling face is the most beautiful face of all.", ref: "Mahabharata" },
  "4-16": { quote: "Love everyone you meet. God lives inside every being.", ref: "Gita 13:28" },
  "4-18": { quote: "God feeds every bird and fish. He will take care of you too.", ref: "Gita 9:22" },
  "4-20": { quote: "Do your very best and offer the results to God.", ref: "Gita 3:30" },
  "4-22": { quote: "The earth is our mother. Take care of her with love.", ref: "Atharva Veda" },
  "4-24": { quote: "Celebrate the goodness in others — that is pure love.", ref: "Gita 12:16" },
  "4-26": { quote: "God shaped you with love from the clay of the earth.", ref: "Upanishads" },
  "4-28": { quote: "Bear others' pain with a compassionate heart.", ref: "Gita 12:13" },
  "4-30": { quote: "Every day is a gift. Be grateful for each one.", ref: "Upanishads" },
  "5-2":  { quote: "Flowers are God's smile at the world. Give one today.", ref: "Upanishads" },
  "5-4":  { quote: "The sun is God's face shining on us with love.", ref: "Rigveda" },
  "5-6":  { quote: "The soul is always growing more beautiful, like a flower.", ref: "Gita 2:22" },
  "5-8":  { quote: "Bees teach us to work hard and share our sweetness.", ref: "Mahabharata" },
  "5-10": { quote: "Work with full effort and offer it all to God.", ref: "Gita 3:19" },
  "5-12": { quote: "Sweet words are a gift. Give them freely.", ref: "Gita 17:15" },
  "5-14": { quote: "Every gift you give is an offering to the Divine.", ref: "Gita 9:26" },
  "5-16": { quote: "Be brave like Hanuman — love gives you great strength.", ref: "Ramayana" },
  "5-18": { quote: "Dancing and singing are offerings of joy to God.", ref: "Bhagavatam" },
  "5-20": { quote: "Your spirit is free and high like a kite in the sky.", ref: "Upanishads" },
  "5-22": { quote: "Rest in God's arms like a child. You are always safe.", ref: "Gita 18:66" },
  "5-24": { quote: "Leap with joy! The Divine loves to see you happy.", ref: "Bhagavatam" },
  "5-26": { quote: "Serving the community is serving God.", ref: "Gita 3:19" },
  "5-28": { quote: "Learning is a sacred duty. Honor your teachers.", ref: "Taittiriya Upanishad" },
  "5-30": { quote: "God has wonderful things planned for you — trust the path.", ref: "Gita 18:66" },
  "6-2":  { quote: "The ocean is vast — and so is God's love for you.", ref: "Upanishads" },
  "6-4":  { quote: "Choose joy in all things. Joy is devotion.", ref: "Bhagavatam" },
  "6-6":  { quote: "Surya, the sun, blesses us with light and warmth each morning.", ref: "Rigveda" },
  "6-8":  { quote: "The river always finds its way to the ocean — so will you.", ref: "Upanishads" },
  "6-10": { quote: "Nritya — sacred dance — is a prayer of the whole body.", ref: "Bhagavatam" },
  "6-12": { quote: "Indra's rainbow is a promise that beauty follows rain.", ref: "Rigveda" },
  "6-14": { quote: "Sweetness is a gift from God. Enjoy it with gratitude.", ref: "Gita 17:9" },
  "6-16": { quote: "All living things praise God — the dolphins leap for joy!", ref: "Bhagavatam" },
  "6-18": { quote: "Varuna holds the sky in place. God holds you too.", ref: "Rigveda" },
  "6-20": { quote: "The ocean shows us how vast God's love truly is.", ref: "Upanishads" },
  "6-22": { quote: "Sweetness is everywhere when your heart is open.", ref: "Gita 5:21" },
  "6-24": { quote: "Flowers offered with love are the greatest gift to God.", ref: "Gita 9:26" },
  "6-26": { quote: "Build your life on a strong foundation of love and truth.", ref: "Mahabharata" },
  "6-28": { quote: "Stay steady and calm — the Divine is your anchor.", ref: "Gita 6:19" },
  "6-30": { quote: "May you go in peace. May peace follow you everywhere.", ref: "Upanishads" },
  "7-2":  { quote: "Let your goodness shine like a flag for all to see.", ref: "Gita 10:41" },
  "7-4":  { quote: "True freedom comes from knowing God lives inside you.", ref: "Gita 18:66" },
  "7-6":  { quote: "Celebrate life! The Divine loves your joyful heart.", ref: "Bhagavatam" },
  "7-8":  { quote: "The earth holds you gently. You are always supported.", ref: "Atharva Veda" },
  "7-10": { quote: "Let goodness flow like a great river into the world.", ref: "Mahabharata" },
  "7-12": { quote: "Rest peacefully. God watches over you day and night.", ref: "Gita 9:22" },
  "7-14": { quote: "Every beautiful thing in nature is a gift from God.", ref: "Gita 10:41" },
  "7-16": { quote: "Savor every sweet moment — God put it there for you.", ref: "Gita 5:21" },
  "7-18": { quote: "God crowns the year with beauty. You are part of that beauty.", ref: "Rigveda" },
  "7-20": { quote: "Build your life on truth, love, and service to others.", ref: "Mahabharata" },
  "7-22": { quote: "Nurture what is growing — in the garden and in your heart.", ref: "Gita 3:8" },
  "7-24": { quote: "The earth feeds us. Give thanks to her with every meal.", ref: "Atharva Veda" },
  "7-26": { quote: "Sharing is the most natural expression of love.", ref: "Gita 17:20" },
  "7-28": { quote: "The clouds carry rain as a blessing from Indra above.", ref: "Rigveda" },
  "7-30": { quote: "God's light shines everywhere — even in the firefly's glow.", ref: "Gita 10:36" },
  "8-2":  { quote: "Learning is sacred. Your teacher is a form of God.", ref: "Taittiriya Upanishad" },
  "8-4":  { quote: "Be kind to those who teach you. Knowledge is a great gift.", ref: "Taittiriya Upanishad" },
  "8-6":  { quote: "Begin each day with gratitude and a joyful heart.", ref: "Bhagavatam" },
  "8-8":  { quote: "God made you exactly the right size — perfectly and lovingly.", ref: "Upanishads" },
  "8-10": { quote: "Face the sun and let God's light fill your whole heart.", ref: "Rigveda" },
  "8-12": { quote: "You are always growing and becoming more beautiful.", ref: "Gita 2:22" },
  "8-14": { quote: "Water is sacred. Care for all of creation with love.", ref: "Rigveda" },
  "8-16": { quote: "Leap with joy — the Divine loves to see you happy!", ref: "Bhagavatam" },
  "8-18": { quote: "God painted the world in every color of the rainbow.", ref: "Upanishads" },
  "8-20": { quote: "Every season is sacred. This one too.", ref: "Gita 2:14" },
  "8-22": { quote: "A tiny seed holds the whole tree inside it — so do you.", ref: "Chandogya Upanishad" },
  "8-24": { quote: "The bee collects sweetness wherever it goes. So can you.", ref: "Mahabharata" },
  "8-26": { quote: "Create with your hands as an offering to God.", ref: "Gita 3:9" },
  "8-28": { quote: "Write down your dreams — God gave them to you.", ref: "Upanishads" },
  "8-30": { quote: "Every season is a teacher. Say thank you to each one.", ref: "Gita 2:14" },
  "9-2":  { quote: "Nature's beauty is God's art — admire it with gratitude.", ref: "Upanishads" },
  "9-4":  { quote: "Approach learning with courage. Knowledge is sacred.", ref: "Taittiriya Upanishad" },
  "9-6":  { quote: "Each letter you write is a step on the path of wisdom.", ref: "Upanishads" },
  "9-8":  { quote: "Every tiny creature is a temple of the Divine.", ref: "Gita 13:28" },
  "9-10": { quote: "God fills the world with good gifts. Gather them with joy.", ref: "Rigveda" },
  "9-12": { quote: "Every creature, even a spider, is filled with God's wisdom.", ref: "Gita 13:28" },
  "9-16": { quote: "The trees are dressed in gold for the joy of God.", ref: "Rigveda" },
  "9-18": { quote: "God moves through the mist and clouds like a loving presence.", ref: "Upanishads" },
  "9-20": { quote: "The earth gives her fruits with an open and loving hand.", ref: "Atharva Veda" },
  "9-22": { quote: "Shout for joy! The whole creation shouts with you.", ref: "Bhagavatam" },
  "9-24": { quote: "Inside you is the whole universe — you are made of stars.", ref: "Chandogya Upanishad" },
  "9-26": { quote: "Give freely and the universe will give back to you.", ref: "Gita 3:10" },
  "9-28": { quote: "The moon is God's gentle light in the night sky.", ref: "Gita 10:21" },
  "10-2": { quote: "Jump for joy! The whole creation celebrates with you.", ref: "Bhagavatam" },
  "10-4": { quote: "Every creature is a child of God. Be kind to all of them.", ref: "Gita 13:28" },
  "10-6": { quote: "Cooking for others is an act of love and devotion.", ref: "Gita 9:26" },
  "10-8": { quote: "The pumpkin grew slowly and perfectly — just like you.", ref: "Upanishads" },
  "10-10": { quote: "Watch the sky at dusk — God is painting just for you.", ref: "Rigveda" },
  "10-12": { quote: "Create beauty from what nature gives you — that is sacred art.", ref: "Gita 3:9" },
  "10-14": { quote: "Even something small holds all of God's greatness inside.", ref: "Chandogya Upanishad" },
  "10-16": { quote: "Crisp autumn air is God breathing freshness into the world.", ref: "Upanishads" },
  "10-18": { quote: "Leap into joy — God delights in your happiness!", ref: "Bhagavatam" },
  "10-20": { quote: "God fills the world with every color. Look and be amazed.", ref: "Rigveda" },
  "10-24": { quote: "Make colorful patterns like Lakshmi's rangoli — for God's joy.", ref: "Diwali" },
  "10-26": { quote: "Wisdom is the greatest color — wear it always.", ref: "Gita 4:38" },
  "10-28": { quote: "Do not be afraid. God is with you always.", ref: "Gita 18:66" },
  "10-30": { quote: "The stars are God's eyes watching over you with love.", ref: "Gita 10:21" },
  "11-2": { quote: "Give thanks for the small things. They add up to everything.", ref: "Upanishads" },
  "11-4": { quote: "Count your blessings. God has given you so very many.", ref: "Gita 16:1" },
  "11-6": { quote: "The smell of good food is an offering to the Divine.", ref: "Gita 9:26" },
  "11-10": { quote: "Your light is like a diya — it can light up the whole world.", ref: "Diwali" },
  "11-12": { quote: "All trees rest and wake again — the soul is the same.", ref: "Gita 2:22" },
  "11-14": { quote: "Prepare wisely for what is coming. That is the dharmic way.", ref: "Mahabharata" },
  "11-16": { quote: "Even a pinecone holds a forest. You hold greatness too.", ref: "Chandogya Upanishad" },
  "11-18": { quote: "A loving hug is the warmest form of seva.", ref: "Mahabharata" },
  "11-20": { quote: "Setting the table beautifully is an act of love and service.", ref: "Gita 3:19" },
  "11-22": { quote: "Eat with gratitude. Every meal is prasad — a gift from God.", ref: "Gita 9:26" },
  "11-24": { quote: "Honor your ancestors. Their love lives on inside you.", ref: "Mahabharata" },
  "11-26": { quote: "Give thanks for all you have. Gratitude is the highest prayer.", ref: "Gita 16:1" },
  "11-28": { quote: "Rest is sacred. Even God rests between acts of creation.", ref: "Upanishads" },
  "11-30": { quote: "Give thanks for this whole month. Every day was a blessing.", ref: "Upanishads" },
  "12-2": { quote: "Each snowflake is unique — God made you one of a kind too.", ref: "Upanishads" },
  "12-4": { quote: "A lamp chases away darkness — just as love chases away fear.", ref: "Gita 10:11" },
  "12-6": { quote: "Giving is an act of worship. Give something today.", ref: "Gita 17:20" },
  "12-8": { quote: "Sweet things are gifts from God. Make and share them.", ref: "Gita 17:9" },
  "12-10": { quote: "Your family is your first sangha — your first community of love.", ref: "Mahabharata" },
  "12-12": { quote: "God counts every star and remembers every act of love.", ref: "Gita 10:21" },
  "12-14": { quote: "Wrap your gifts with love. The love is the real present.", ref: "Gita 9:26" },
  "12-16": { quote: "Peace is the greatest gift. Share it with everyone.", ref: "Gita 6:7" },
  "12-18": { quote: "Making sweet things for others is a form of devotion.", ref: "Gita 9:26" },
  "12-20": { quote: "Follow the light wherever it leads — it always leads to God.", ref: "Gita 10:11" },
  "12-22": { quote: "Circle of lights, circle of love — God is in every ring.", ref: "Upanishads" },
  "12-24": { quote: "On the eve of something wonderful, joy fills the whole sky.", ref: "Bhagavatam" },
  "12-26": { quote: "Share your joy freely. Joy multiplies when it is given away.", ref: "Gita 5:21" },
  "12-28": { quote: "Your inner light can never be put out. It shines forever.", ref: "Gita 2:20" },
  "12-30": { quote: "Give thanks for every single day. Each one was a gift.", ref: "Upanishads" },
};
function getAffirmation(m: number, d: number, religion: string = "Non-religious"): {quote:string, ref:string} {
  const key = `${m+1}-${d}`;
  
  const nonReligious = [
    { quote:"Every day is a new beginning. Take a deep breath and start again.", ref:"" },
    { quote:"You are braver than you believe, stronger than you seem, and smarter than you think.", ref:"A.A. Milne" },
    { quote:"No act of kindness, no matter how small, is ever wasted.", ref:"Aesop" },
    { quote:"Look deep into nature, and then you will understand everything better.", ref:"Einstein" },
    { quote:"We rise by lifting others.", ref:"R.G. Ingersoll" },
    { quote:"The best thing to hold onto in life is each other.", ref:"Audrey Hepburn" },
    { quote:"The world is full of magical things, patiently waiting for our senses to grow sharper.", ref:"W.B. Yeats" },
    { quote:"Happiness is only real when shared.", ref:"Jon Krakauer" },
    { quote:"Kind words can be short and easy to speak, but their echoes are truly endless.", ref:"Mother Teresa" },
    { quote:"Be the change you wish to see in the world.", ref:"Gandhi" },
    { quote:"In every walk with nature, one receives far more than they seek.", ref:"John Muir" },
    { quote:"It always seems impossible until it is done.", ref:"Nelson Mandela" },
    { quote:"You yourself, as much as anybody in the universe, deserve your love.", ref:"Buddha" },
    { quote:"The sky is everywhere. It begins at your feet.", ref:"Jandy Nelson" },
    { quote:"Adventure is worthwhile in itself.", ref:"Amelia Earhart" },
    { quote:"No matter how long the winter, spring is sure to follow.", ref:"African Proverb" },
    { quote:"Creativity is intelligence having fun.", ref:"Einstein" },
    { quote:"To plant a garden is to believe in tomorrow.", ref:"Audrey Hepburn" },
    { quote:"A bird does not sing because it has an answer. It sings because it has a song.", ref:"Chinese Proverb" },
    { quote:"The earth does not belong to us. We belong to the earth.", ref:"Chief Seattle" },
    { quote:"Life is either a daring adventure or nothing at all.", ref:"Helen Keller" },
    { quote:"We don't remember days; we remember moments.", ref:"Cesare Pavese" },
    { quote:"Nature does not hurry, yet everything is accomplished.", ref:"Lao Tzu" },
    { quote:"Joy is the simplest form of gratitude.", ref:"Karl Barth" },
    { quote:"Every new beginning comes from some other beginning's end.", ref:"Seneca" },
    { quote:"The more you praise and celebrate your life, the more there is to celebrate.", ref:"Oprah Winfrey" },
    { quote:"Enough is a feast.", ref:"Buddhist Proverb" },
    { quote:"Write it on your heart that every day is the best day in the year.", ref:"Ralph Waldo Emerson" },
    { quote:"Turn your face to the sun and the shadows fall behind you.", ref:"Maori Proverb" },
    { quote:"Where flowers bloom, so does hope.", ref:"Lady Bird Johnson" },
    { quote:"Every moment is a fresh beginning.", ref:"T.S. Eliot" },
  ];

  const fallback = nonReligious[(m * 31 + d - 1) % nonReligious.length];

  if (religion === "Hindu") {
    return LANDING_HINDU[key] || fallback;
  }
  if (religion === "Christian" || religion === "Christian-Catholic" || religion === "Christian-Protestant") {
    return CHRISTIAN_AFFIRMATIONS[key] || fallback;
  }
  if (religion === "Both") {
    if (d % 2 === 0) return LANDING_HINDU[key] || fallback;
    return CHRISTIAN_AFFIRMATIONS[key] || fallback;
  }
  return fallback;
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
  const affirmation = getAffirmation(MONTH_NAMES.indexOf(month), day, religion);

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
       <div style={{fontSize:11,fontStyle:"italic",color:"#6b7280"}}>
  "{affirmation.quote}"
  {affirmation.ref && <span style={{fontSize:10,fontStyle:"normal",color:"#9ca3af"}}> — {affirmation.ref}</span>}
</div>
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

    const BG      = "#FFF0F5";
  const CARD_BG = "#ffffff";
  const BORDER  = "#d0d0d8";
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
            <div style={{fontSize:16,fontWeight:"bold",color:"#1f2937"}}>MelMoon Books</div>
            <div style={{fontSize:10,color:"#9b99c4",marginTop:-2}}>morning workbooks for little ones · ages 3–6</div>
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
        background:"#E8E8FF",border:`1.5px solid ${BORDER}`,borderRadius:12,
        padding:"14px 16px",margin:"12px 16px",
        display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end",
        boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
        maxWidth:560,width:"calc(100% - 32px)",boxSizing:"border-box",
      }}>
        {/* Child name */}
        <div style={{flex:1,minWidth:90}}>
          <div style={{fontSize:10,fontWeight:"bold",color:"#9b99c4",marginBottom:3}}>CHILD'S NAME</div>
          <input value={childName} onChange={e=>setChildName(e.target.value)}
            placeholder="Child's name"
            style={{width:"100%",padding:"5px 7px",borderRadius:6,border:`1.5px solid ${BORDER}`,
              fontSize:13,fontFamily:"Georgia",boxSizing:"border-box",background:"white"}}/>
        </div>
        {/* Month */}
        <div style={{flex:1,minWidth:80}}>
          <div style={{fontSize:10,fontWeight:"bold",color:"#9b99c4",marginBottom:3}}>MONTH</div>
          <select value={month} onChange={e=>setMonth(e.target.value)}
            style={{width:"100%",padding:"5px",borderRadius:6,border:`1.5px solid ${BORDER}`,fontSize:13,background:"white"}}>
            {MONTH_NAMES.map(m=><option key={m}>{m}</option>)}
          </select>
        </div>
        {/* Faith Tradition */}
        <div style={{flex:1,minWidth:90,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          <div style={{fontSize:9,fontWeight:"bold",color:"#9b99c4",marginBottom:3}}>FAITH<br/>TRADITION</div>
          <select value={religion} onChange={e=>setReligion(e.target.value)}
            style={{width:"100%",padding:"5px",borderRadius:6,border:`1.5px solid #d1d5db`,
              fontSize:13,color:"#374151",fontWeight:"normal",background:"white"}}>
            {["Non-religious","Christian","Hindu","Both"].map(r=><option key={r}>{r}</option>)}
          </select>
        </div>
        {/* Age */}
        <div>
          <div style={{fontSize:10,fontWeight:"bold",color:"#9b99c4",marginBottom:3}}>AGE</div>
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
          <div style={{fontSize:10,fontWeight:"bold",color:"#9b99c4",marginBottom:3}}>DAY</div>
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
            background:"white",color:"#9b99c4",fontFamily:"Georgia, serif"}}>
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
border:`1.5px solid ${BORDER}`,
background:"white",
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
        <div style={{fontSize:11,color:"#9b99c4",marginTop:12}}>No credit card required</div>
      </div>

    </div>
  );
}
