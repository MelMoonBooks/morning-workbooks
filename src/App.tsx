import React, { useState } from "react";

const THEMES = {
  January:   { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  February:  { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  March:     { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  April:     { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  May:       { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  June:      { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  July:      { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  August:    { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  September: { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  October:   { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  November:  { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
  December:  { gradient: ["#f9fafb", "#f3f4f6"], color: "#374151" },
};

const DAYS        = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_NAMES   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];

const HOLIDAYS = {
  "01-01": { both:      { label:"New Year's Day",         sentence:"Today is New Year's Day! A brand new year is beginning — what will you do with it?" } },
  "01-14": { hindu:     { label:"Pongal",                  sentence:"Happy Pongal! Today we thank the sun and the earth for giving us food. We cook sweet rice and celebrate!" },
             both:      { label:"Pongal",                  sentence:"Happy Pongal! Today is a harvest festival — we say thank you for all the good food and sunshine." } },
  "01-06": { christian: { label:"Epiphany",               sentence:"Today is Epiphany! We remember the three wise men who followed the star to find Jesus." } },
  "01-19": { both:      { label:"Martin Luther King Jr. Day", sentence:"Today we honor Dr. Martin Luther King Jr., who dreamed that all people would be treated with kindness." } },
  "02-14": { both:      { label:"Valentine's Day",        sentence:"Happy Valentine's Day! Today we celebrate love and kindness for everyone around us." } },
  "02-16": { both:      { label:"Presidents' Day",        sentence:"Today is Presidents' Day! We remember the leaders who helped our country." } },
  "03-03": { hindu:     { label:"Holi",                   sentence:"Happy Holi! Today we throw colors and dance and sing. Krishna loves to celebrate Holi!" },
             both:      { label:"Holi",                   sentence:"Happy Holi! Today is the festival of colors — throw colors, be joyful, and celebrate new beginnings!" } },
  "03-17": { both:      { label:"St. Patrick's Day",      sentence:"Today is St. Patrick's Day! Look for something green today." } },
  "03-20": { both:      { label:"First Day of Spring",    sentence:"Today is the first day of spring! Flowers will start to bloom and the days get warmer." } },
  "04-02": { christian: { label:"Holy Thursday",          sentence:"Tonight is Holy Thursday. Jesus had a special dinner with his friends and showed them how to serve." } },
  "04-03": { christian: { label:"Good Friday",            sentence:"Today is Good Friday. We remember how much Jesus loved us." } },
  "04-05": { christian: { label:"Easter Sunday",          sentence:"He is risen! Today is Easter — the most joyful day of the year. Jesus is alive!" },
             both:      { label:"Easter Sunday",          sentence:"Happy Easter! Today we celebrate new life, spring, and eggs hidden in the garden." } },
  "04-22": { both:      { label:"Earth Day",              sentence:"Today is Earth Day! Let's take care of our beautiful planet — pick up litter and hug a tree!" } },
  "05-11": { both:      { label:"Mother's Day",           sentence:"Happy Mother's Day! Today we celebrate all the mamas who love us so much." } },
  "05-26": { both:      { label:"Memorial Day",           sentence:"Today is Memorial Day. We say thank you to the brave people who kept our country safe." } },
  "06-15": { both:      { label:"Father's Day",           sentence:"Happy Father's Day! Today we celebrate all the dads and grandpas who love us." } },
  "06-19": { both:      { label:"Juneteenth",             sentence:"Today is Juneteenth! We celebrate freedom and remember that all people deserve to be free." } },
  "07-04": { both:      { label:"Independence Day",       sentence:"Happy 4th of July! Today is America's birthday — we celebrate with flags, parades, and fireworks!" } },
  "09-07": { both:      { label:"Labor Day",              sentence:"Today is Labor Day! We say thank you to all the people who work hard every day." } },
  "09-14": { hindu:     { label:"Ganesha Chaturthi",      sentence:"Happy Ganesha Chaturthi! Today we celebrate Ganesha's birthday — the son of Shiva who brings wisdom, prosperity, and removes all obstacles. Ganpati Bappa Morya!" },
             both:      { label:"Ganesha Chaturthi",      sentence:"Happy Ganesha Chaturthi! Today we celebrate the birthday of Ganesha, the elephant-headed god of wisdom and new beginnings!" } },
  "10-13": { both:      { label:"Columbus Day",           sentence:"Today is Columbus Day. We remember the explorers who crossed the ocean long ago." } },
  "10-21": { hindu:     { label:"Dussehra",               sentence:"Happy Dussehra! Today is the tenth day of Navratri — we celebrate the victory of good over evil. Rama defeated Ravana and goodness always wins!" },
             both:      { label:"Dussehra",               sentence:"Happy Dussehra! Today we celebrate that goodness is stronger than evil — light always wins over darkness!" } },
  "11-08": { hindu:     { label:"Diwali",                 sentence:"Happy Diwali! Today we celebrate the victory of light over darkness. Ram has come home — light your diyas!" },
             both:      { label:"Diwali",                 sentence:"Happy Diwali! Today we light diyas to remember that goodness and light always win." } },
  "10-31": { both:      { label:"Halloween",              sentence:"Tonight is Halloween! Have fun dressing up and being kind to your neighbors." } },
  "11-01": { christian: { label:"All Saints' Day",        sentence:"Today is All Saints' Day! We remember all the holy people who showed us how to love God." } },
  "11-11": { both:      { label:"Veterans Day",           sentence:"Today is Veterans Day! We say thank you to the brave people who kept our country safe." } },
  "11-26": { both:      { label:"Thanksgiving",           sentence:"Happy Thanksgiving! Today we think about everything we are grateful for." } },
  "11-29": { christian: { label:"First Sunday of Advent", sentence:"Advent begins today! We light the first candle and wait with joy for Jesus to come." } },
  "12-24": { christian: { label:"Christmas Eve",          sentence:"Tonight is Christmas Eve! Tomorrow we celebrate the birth of Jesus." } },
  "12-25": { christian: { label:"Christmas Day",          sentence:"Today is Christmas Day! This is the day that Jesus was born. Glory to God in the highest!" },
             both:      { label:"Christmas Day",          sentence:"Merry Christmas! Today families celebrate and share gifts with the people they love." } },
  "12-26": { christian: { label:"St. Stephen's Day",      sentence:"Today is the Feast of St. Stephen, the first person to give his life for following Jesus." } },
  "12-31": { both:      { label:"New Year's Eve",         sentence:"Tonight is New Year's Eve! Say thank you for this year and get ready for tomorrow." } },
};

function getHolidayMessage(monthIdx, day, religion) {
  const key = `${String(monthIdx+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  const entry = HOLIDAYS[key];
  if (!entry) return null;
  if (religion === "Hindu"     && entry.hindu)     return entry.hindu;
  if (religion === "Christian" && entry.christian) return entry.christian;
  if (entry.both)                                   return entry.both;
  if (religion === "Both")     return entry.christian || entry.hindu || null;
  return null;
}

function getMiniCalendar(month, year) {
  const idx = { January:0, February:1, March:2, April:3, May:4, June:5,
                July:6, August:7, September:8, October:9, November:10, December:11 }[month] ?? 0;
  const firstDay    = new Date(year, idx, 1).getDay();
  const daysInMonth = new Date(year, idx + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function RuledLine({ h = 44 }) {
  return (
    <svg width="100%" height={h} style={{ display:"block", overflow:"visible" }}>
      <line x1="0" y1="1"   x2="100%" y2="1"   stroke="#9ca3af" strokeWidth="1.4" />
      <line x1="0" y1={h/2} x2="100%" y2={h/2} stroke="#c4b5a0" strokeWidth="1" strokeDasharray="6 4" />
      <line x1="0" y1={h-1} x2="100%" y2={h-1} stroke="#9ca3af" strokeWidth="1.4" />
    </svg>
  );
}

// ── Letter tracing paths ──
const LETTER_PATHS = {
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
  z:"M8 28 H30 L8 54 H30", " ":"",
};

// Letters whose paths extend below y=54 (descenders)
const DESCENDERS = new Set(["g","j","p","q","y"]);

function TraceLetter({ char, size = 36 }) {
  const path       = LETTER_PATHS[char] ?? LETTER_PATHS[char.toUpperCase()] ?? "";
  const hasDesc    = DESCENDERS.has(char);
  // viewBox: normal letters fit in 0 0 40 56; descenders need 0 0 40 72
  const vbHeight   = hasDesc ? 72 : 56;
  // rendered height scales proportionally
  const h          = Math.round(size * (vbHeight / 40));
  return (
    <svg width={size} height={h} viewBox={`0 0 40 ${vbHeight}`} style={{ display:"block" }}>
      <line x1="0" y1="2"  x2="40" y2="2"  stroke="#d1d5db" strokeWidth="1" />
      <line x1="0" y1="28" x2="40" y2="28" stroke="#d1d5db" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1="0" y1="54" x2="40" y2="54" stroke="#d1d5db" strokeWidth="1" />
      {path && (
        <path d={path} fill="none" stroke="#b0b0b0" strokeWidth="2.8"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5" />
      )}
    </svg>
  );
}

function TraceRow({ text, size = 34, gap = 3 }) {
  return (
    <div style={{ display:"flex", gap, flexWrap:"wrap" }}>
      {text.split("").map((c, i) => <TraceLetter key={i} char={c} size={size} />)}
    </div>
  );
}

// ── Write box ──
function WriteBox({ size = 40 }) {
  const h = Math.round(size * 1.4);
  return (
    <svg width={size} height={h} viewBox="0 0 40 56" style={{ display:"block" }}>
      <rect x="1" y="1" width="38" height="54" rx="3"
        fill="none" stroke="#d1d5db" strokeWidth="1.2" strokeDasharray="4 3"/>
      <line x1="4" y1="2"  x2="36" y2="2"  stroke="#d1d5db" strokeWidth="0.8"/>
      <line x1="4" y1="28" x2="36" y2="28" stroke="#d1d5db" strokeWidth="0.6" strokeDasharray="3 3"/>
      <line x1="4" y1="54" x2="36" y2="54" stroke="#d1d5db" strokeWidth="0.8"/>
    </svg>
  );
}

// ══════════════════════════════════════════
// COLOR ACTIVITY — 31 unique activities per month
// Even days  → "Color the Scene"  (image placeholder + instruction)
// Odd days   → "Trace & Color"    (trace a color word + image placeholder)
// Image slot is a fixed dashed box — parent pastes in artwork
// ══════════════════════════════════════════

// ══════════════════════════════════════════
// UNIFIED DAILY ACTIVITY TABLE
// Every day has: word (for tracing), subject (for coloring image),
// instruction (for color activity box), colorWord (for trace & color days)
//
// Even days → Color the Scene  (instruction shown, child colors subject)
// Odd days  → Trace & Color    (trace colorWord, child colors subject)
// Letter box ALWAYS traces: age 3-4 = first letter of word, age 5-6 = word itself
// ══════════════════════════════════════════

const DAILY_ACTIVITIES = {
  "December": [
    { word:"tree",      subject:"a Christmas tree",          instruction:"Color the Christmas tree!",                        colorWord:"green"  }, // 1
    { word:"star",      subject:"a star",                    instruction:"Color the stars yellow and the ornaments red!",    colorWord:"yellow" }, // 2
    { word:"angel",     subject:"an angel",                  instruction:"Color the angel!",                                 colorWord:"white"  }, // 3
    { word:"candle",    subject:"a candle",                  instruction:"Color the candle yellow and the holder red!",      colorWord:"yellow" }, // 4
    { word:"bell",      subject:"a bell",                    instruction:"Color the bell gold!",                             colorWord:"gold"   }, // 5
    { word:"wreath",    subject:"a wreath",                  instruction:"Color the wreath green and the bow red!",          colorWord:"green"  }, // 6
    { word:"stocking",  subject:"a stocking",                instruction:"Color the stocking!",                              colorWord:"red"    }, // 7
    { word:"snow",      subject:"a snowflake",               instruction:"Color the snowflake blue!",                        colorWord:"blue"   }, // 8
    { word:"snowman",   subject:"a snowman",                 instruction:"Color the snowman!",                               colorWord:"white"  }, // 9
    { word:"star",      subject:"a starry sky",              instruction:"Color the stars yellow and the sky blue!",         colorWord:"yellow" }, // 10
    { word:"ginger",    subject:"a gingerbread house",       instruction:"Color the gingerbread house!",                     colorWord:"brown"  }, // 11
    { word:"reindeer",  subject:"a reindeer",                instruction:"Color the reindeer brown and the nose red!",       colorWord:"brown"  }, // 12
    { word:"manger",    subject:"the manger scene",          instruction:"Color the manger scene!",                         colorWord:"gold"   }, // 13
    { word:"gift",      subject:"a gift",                    instruction:"Color the gifts any colors you like!",             colorWord:"red"    }, // 14
    { word:"candy",     subject:"a candy cane",              instruction:"Color the candy cane red and white!",              colorWord:"red"    }, // 15
    { word:"dove",      subject:"a dove",                    instruction:"Color the dove white!",                            colorWord:"white"  }, // 16
    { word:"sheep",     subject:"a shepherd and sheep",      instruction:"Color the shepherd and his sheep!",                colorWord:"white"  }, // 17
    { word:"cookie",    subject:"Christmas cookies",         instruction:"Color the Christmas cookies!",                     colorWord:"pink"   }, // 18
    { word:"Bethlehem", subject:"the star of Bethlehem",     instruction:"Color the star of Bethlehem yellow!",              colorWord:"yellow" }, // 19
    { word:"sleigh",    subject:"a sleigh",                  instruction:"Color the sleigh red and the snow white!",         colorWord:"red"    }, // 20
    { word:"wisemen",   subject:"the three wise men",        instruction:"Color the three wise men!",                        colorWord:"gold"   }, // 21
    { word:"holly",     subject:"holly berries",             instruction:"Color the holly berries red and the leaves green!",colorWord:"red"    }, // 22
    { word:"Jesus",     subject:"baby Jesus",                instruction:"Color the baby Jesus in the manger!",              colorWord:"gold"   }, // 23
    { word:"sky",       subject:"a Christmas Eve sky",       instruction:"Color the Christmas Eve sky with stars!",          colorWord:"blue"   }, // 24
    { word:"nativity",  subject:"the nativity",              instruction:"Color the nativity — use your favorite colors!",   colorWord:"gold"   }, // 25
    { word:"bird",      subject:"a winter bird",             instruction:"Color the winter birds!",                          colorWord:"red"    }, // 26
    { word:"village",   subject:"a snowy village",           instruction:"Color the snowy village!",                         colorWord:"white"  }, // 27
    { word:"fireworks", subject:"fireworks",                 instruction:"Color the fireworks any colors you like!",         colorWord:"yellow" }, // 28
    { word:"noel",      subject:"a Christmas scene",         instruction:"Color the Christmas story — any colors you like!", colorWord:"red"    }, // 29
    { word:"joy",       subject:"a New Year's scene",        instruction:"Color the New Year's Eve celebration!",            colorWord:"gold"   }, // 30
    { word:"peace",     subject:"a peace dove",              instruction:"Color the peace dove white!",                      colorWord:"white"  }, // 31
  ],
  "March": [
    { word:"flower",    subject:"a flower garden",           instruction:"Color the flower garden!",                         colorWord:"pink"   }, // 1
    { word:"tulip",     subject:"tulips",                    instruction:"Color the tulips red and the leaves green!",       colorWord:"red"    }, // 2
    { word:"butterfly", subject:"a butterfly",               instruction:"Color the butterfly!",                             colorWord:"orange" }, // 3
    { word:"rainbow",   subject:"a rainbow",                 instruction:"Color the rainbow any colors you like!",           colorWord:"purple" }, // 4
    { word:"turtle",    subject:"a sea turtle",              instruction:"Color the sea turtle green!",                      colorWord:"green"  }, // 5
    { word:"bird",      subject:"spring birds",              instruction:"Color the spring birds!",                          colorWord:"yellow" }, // 6
    { word:"beach",     subject:"a beach scene",             instruction:"Color the beach scene!",                           colorWord:"blue"   }, // 7
    { word:"petal",     subject:"flowers",                   instruction:"Color the flowers pink and yellow!",               colorWord:"pink"   }, // 8
    { word:"caterpillar",subject:"a caterpillar",            instruction:"Color the caterpillar!",                           colorWord:"green"  }, // 9
    { word:"wave",      subject:"ocean waves",               instruction:"Color the ocean waves blue!",                      colorWord:"blue"   }, // 10
    { word:"chick",     subject:"baby chicks",               instruction:"Color the baby chicks yellow!",                    colorWord:"yellow" }, // 11
    { word:"kite",      subject:"a kite",                    instruction:"Color the kite any colors you like!",              colorWord:"red"    }, // 12
    { word:"Holi",      subject:"Holi colors",               instruction:"Color the Holi colors!",                           colorWord:"purple" }, // 13
    { word:"shamrock",  subject:"a shamrock",                instruction:"Color the shamrock green!",                        colorWord:"green"  }, // 14
    { word:"blossom",   subject:"a spring tree",             instruction:"Color the spring tree with pink blossoms!",        colorWord:"pink"   }, // 15
    { word:"fish",      subject:"fish in the sea",           instruction:"Color the fish in the sea!",                       colorWord:"orange" }, // 16
    { word:"basket",    subject:"an Easter basket",          instruction:"Color the Easter basket!",                         colorWord:"yellow" }, // 17
    { word:"bunny",     subject:"a bunny",                   instruction:"Color the bunny white and pink!",                  colorWord:"pink"   }, // 18
    { word:"sand",      subject:"waves and sand",            instruction:"Color the wave blue and the sand yellow!",         colorWord:"blue"   }, // 19
    { word:"lei",       subject:"a lei",                     instruction:"Color the lei with pink and purple flowers!",      colorWord:"pink"   }, // 20
    { word:"hula",      subject:"a hula dancer",             instruction:"Color the hula dancer!",                           colorWord:"purple" }, // 21
    { word:"sunset",    subject:"a Hawaiian sunset",         instruction:"Color the Hawaiian sunset!",                       colorWord:"orange" }, // 22
    { word:"plumeria",  subject:"plumeria flowers",          instruction:"Color the plumeria flowers!",                      colorWord:"pink"   }, // 23
    { word:"picnic",    subject:"a spring picnic",           instruction:"Color the spring picnic scene!",                   colorWord:"green"  }, // 24
    { word:"ladybug",   subject:"a ladybug",                 instruction:"Color the ladybug red with black dots!",           colorWord:"red"    }, // 25
    { word:"duck",      subject:"ducks on a pond",           instruction:"Color the pond with ducks!",                       colorWord:"yellow" }, // 26
    { word:"bee",       subject:"a bee and flowers",         instruction:"Color the bee and the flowers!",                   colorWord:"yellow" }, // 27
    { word:"rain",      subject:"spring rain and rainbow",   instruction:"Color the spring rain and rainbow!",               colorWord:"blue"   }, // 28
    { word:"lamb",      subject:"baby animals",              instruction:"Color the baby animals!",                          colorWord:"white"  }, // 29
    { word:"garden",    subject:"a garden",                  instruction:"Color the garden any colors you like!",            colorWord:"green"  }, // 30
    { word:"spring",    subject:"a spring scene",            instruction:"Color the spring scene!",                          colorWord:"pink"   }, // 31
  ],
  "October": [
    { word:"pumpkin",   subject:"a pumpkin",                 instruction:"Color the pumpkin!",                               colorWord:"orange" }, // 1
    { word:"star",      subject:"stars",                     instruction:"Color the pumpkins orange and the stars yellow!",  colorWord:"yellow" }, // 2
    { word:"leaf",      subject:"autumn leaves",             instruction:"Color the autumn leaves!",                         colorWord:"orange" }, // 3
    { word:"haystack",  subject:"a haystack",                instruction:"Color the haystack golden and the sky blue!",      colorWord:"gold"   }, // 4
    { word:"owl",       subject:"an owl",                    instruction:"Color the owl!",                                   colorWord:"brown"  }, // 5
    { word:"apple",     subject:"an apple tree",             instruction:"Color the apple tree red and green!",              colorWord:"red"    }, // 6
    { word:"scarecrow", subject:"a scarecrow",               instruction:"Color the scarecrow!",                             colorWord:"orange" }, // 7
    { word:"moon",      subject:"a moon",                    instruction:"Color the moon yellow and the sky dark blue!",     colorWord:"yellow" }, // 8
    { word:"corn",      subject:"corn",                      instruction:"Color the corn golden yellow!",                    colorWord:"yellow" }, // 9
    { word:"forest",    subject:"an autumn forest",          instruction:"Color the autumn forest!",                         colorWord:"orange" }, // 10
    { word:"bat",       subject:"a bat",                     instruction:"Color the bat black and the moon yellow!",         colorWord:"black"  }, // 11
    { word:"web",       subject:"a spider web",              instruction:"Color the spider web!",                            colorWord:"white"  }, // 12
    { word:"harvest",   subject:"a harvest basket",          instruction:"Color the harvest basket!",                        colorWord:"orange" }, // 13
    { word:"diya",      subject:"a diya lamp",               instruction:"Color the diya lamp!",                             colorWord:"red"    }, // 14
    { word:"lantern",   subject:"Diwali lanterns",           instruction:"Color the Diwali lanterns orange and yellow!",     colorWord:"orange" }, // 15
    { word:"Rangoli",   subject:"a Rangoli pattern",         instruction:"Color the Rangoli pattern!",                       colorWord:"purple" }, // 16
    { word:"peacock",   subject:"a peacock",                 instruction:"Color the peacock!",                               colorWord:"blue"   }, // 17
    { word:"fireworks", subject:"fireworks",                 instruction:"Color the fireworks any colors you like!",         colorWord:"yellow" }, // 18
    { word:"Rama",      subject:"a Ramayana scene",          instruction:"Color the Ramayana scene!",                        colorWord:"gold"   }, // 19
    { word:"sweet",     subject:"Diwali sweets",             instruction:"Color the Diwali sweets!",                         colorWord:"pink"   }, // 20
    { word:"flame",     subject:"diyas",                     instruction:"Color the diyas red and yellow!",                  colorWord:"yellow" }, // 21
    { word:"night",     subject:"a starry night sky",        instruction:"Color the stars yellow and the sky dark blue!",    colorWord:"blue"   }, // 22
    { word:"elephant",  subject:"a decorated elephant",      instruction:"Color the elephant with decorations!",             colorWord:"purple" }, // 23
    { word:"patch",     subject:"a pumpkin patch",           instruction:"Color the autumn pumpkin patch!",                  colorWord:"orange" }, // 24
    { word:"jack",      subject:"a Jack-o-lantern",          instruction:"Color the Jack-o-lantern!",                        colorWord:"orange" }, // 25
    { word:"witch",     subject:"a witch hat",               instruction:"Color the witch hat black and purple!",            colorWord:"purple" }, // 26
    { word:"candy",     subject:"candy corn",                instruction:"Color the candy corn yellow, orange, and white!",  colorWord:"orange" }, // 27
    { word:"ghost",     subject:"a ghost",                   instruction:"Color the ghost!",                                 colorWord:"white"  }, // 28
    { word:"tree",      subject:"an autumn tree",            instruction:"Color the autumn tree!",                           colorWord:"orange" }, // 29
    { word:"Halloween", subject:"a Halloween scene",         instruction:"Color the Halloween scene any colors you like!",   colorWord:"purple" }, // 30
    { word:"sky",       subject:"a Halloween night sky",     instruction:"Color the Halloween night sky!",                   colorWord:"black"  }, // 31
  ],
  "February": [
    { word:"heart",     subject:"a big red heart",           instruction:"Color the big red heart!",                         colorWord:"red"    }, // 1
    { word:"hearts",    subject:"hearts",                    instruction:"Color the hearts red and pink!",                   colorWord:"pink"   }, // 2
    { word:"rose",      subject:"roses",                     instruction:"Color the roses red!",                             colorWord:"red"    }, // 3
    { word:"card",      subject:"a Valentine card",          instruction:"Color the Valentine card any colors you like!",    colorWord:"pink"   }, // 4
    { word:"wreath",    subject:"a heart wreath",            instruction:"Color the heart wreath red and pink!",             colorWord:"red"    }, // 5
    { word:"bear",      subject:"a teddy bear",              instruction:"Color the teddy bear holding a heart!",            colorWord:"brown"  }, // 6
    { word:"mailbox",   subject:"a mailbox",                 instruction:"Color the mailbox red with hearts!",               colorWord:"red"    }, // 7
    { word:"flower",    subject:"pink flowers",              instruction:"Color the pink flowers!",                          colorWord:"pink"   }, // 8
    { word:"bracelet",  subject:"friendship bracelets",      instruction:"Color the friendship bracelets!",                  colorWord:"purple" }, // 9
    { word:"balloon",   subject:"heart balloons",            instruction:"Color the heart balloons red and pink!",           colorWord:"red"    }, // 10
    { word:"cupcake",   subject:"a cupcake",                 instruction:"Color the cupcake with a heart on top!",           colorWord:"pink"   }, // 11
    { word:"bird",      subject:"birds sharing a heart",     instruction:"Color the birds sharing a heart!",                 colorWord:"red"    }, // 12
    { word:"tree",      subject:"a Valentine tree",          instruction:"Color the Valentine tree with hearts!",            colorWord:"pink"   }, // 13
    { word:"love",      subject:"a big Valentine heart",     instruction:"Color the big Valentine heart any colors you like!",colorWord:"red"   }, // 14
    { word:"rainbow",   subject:"a rainbow with hearts",     instruction:"Color the rainbow with hearts!",                   colorWord:"purple" }, // 15
    { word:"crown",     subject:"a crown",                   instruction:"Color the hearts purple and gold!",                colorWord:"purple" }, // 16
    { word:"letter",    subject:"a love letter",             instruction:"Color the love letter with hearts!",               colorWord:"red"    }, // 17
    { word:"garden",    subject:"a heart garden",            instruction:"Color the heart garden!",                          colorWord:"pink"   }, // 18
    { word:"kindness",  subject:"a kindness tree",           instruction:"Color the kindness tree!",                         colorWord:"green"  }, // 19
    { word:"friend",    subject:"flowers for a friend",      instruction:"Color the flowers for a friend!",                  colorWord:"pink"   }, // 20
    { word:"butterfly", subject:"butterflies",               instruction:"Color the butterflies pink and yellow!",           colorWord:"pink"   }, // 21
    { word:"lovebird",  subject:"love birds",                instruction:"Color the love birds!",                            colorWord:"red"    }, // 22
    { word:"mobile",    subject:"a heart mobile",            instruction:"Color the heart mobile any colors you like!",      colorWord:"purple" }, // 23
    { word:"cookie",    subject:"Valentine cookies",         instruction:"Color the Valentine cookies!",                     colorWord:"pink"   }, // 24
    { word:"family",    subject:"a family portrait",         instruction:"Color the family portrait with hearts!",           colorWord:"red"    }, // 25
    { word:"kite",      subject:"a heart kite",              instruction:"Color the heart kite!",                            colorWord:"red"    }, // 26
    { word:"castle",    subject:"a pink castle",             instruction:"Color the pink castle!",                           colorWord:"pink"   }, // 27
    { word:"island",    subject:"a heart-shaped island",     instruction:"Color the heart-shaped island!",                   colorWord:"blue"   }, // 28
  ],
  "January": [
    { word:"year",      subject:"a new year banner",         instruction:"Color the New Year banner!",                        colorWord:"gold"   }, // 1
    { word:"snow",      subject:"a snowflake",               instruction:"Color the snowflake blue!",                         colorWord:"blue"   }, // 2
    { word:"penguin",   subject:"a penguin",                 instruction:"Color the penguin black and white!",                colorWord:"black"  }, // 3
    { word:"mittens",   subject:"mittens",                   instruction:"Color the mittens red!",                            colorWord:"red"    }, // 4
    { word:"scarf",     subject:"a scarf",                   instruction:"Color the scarf any colors you like!",              colorWord:"purple" }, // 5
    { word:"hat",       subject:"a winter hat",              instruction:"Color the hat blue and the pompom white!",          colorWord:"blue"   }, // 6
    { word:"sled",      subject:"a sled",                    instruction:"Color the sled red!",                               colorWord:"red"    }, // 7
    { word:"snowball",  subject:"a snowball fight",          instruction:"Color the snow white and the coats colorful!",      colorWord:"white"  }, // 8
    { word:"igloo",     subject:"an igloo",                  instruction:"Color the igloo white and the sky blue!",           colorWord:"white"  }, // 9
    { word:"polar",     subject:"a polar bear",              instruction:"Color the polar bear white!",                       colorWord:"white"  }, // 10
    { word:"bird",      subject:"a winter bird",             instruction:"Color the winter bird red!",                        colorWord:"red"    }, // 11
    { word:"frost",     subject:"a frosty window",           instruction:"Color the frost patterns blue and white!",          colorWord:"blue"   }, // 12
    { word:"cocoa",     subject:"a mug of hot cocoa",        instruction:"Color the cocoa mug red and the cocoa brown!",      colorWord:"brown"  }, // 13
    { word:"ice",       subject:"an ice skater",             instruction:"Color the ice skater any colors you like!",         colorWord:"blue"   }, // 14
    { word:"owl",       subject:"a snowy owl",               instruction:"Color the snowy owl white!",                        colorWord:"white"  }, // 15
    { word:"cloud",     subject:"snow clouds",               instruction:"Color the clouds grey and the snow white!",         colorWord:"grey"   }, // 16
    { word:"deer",      subject:"a deer in the snow",        instruction:"Color the deer brown and the snow white!",          colorWord:"brown"  }, // 17
    { word:"pine",      subject:"a pine tree",               instruction:"Color the pine tree green!",                        colorWord:"green"  }, // 18
    { word:"wolf",      subject:"a wolf howling",            instruction:"Color the wolf grey and the moon yellow!",          colorWord:"grey"   }, // 19
    { word:"star",      subject:"stars in the winter sky",   instruction:"Color the winter stars yellow!",                    colorWord:"yellow" }, // 20
    { word:"rabbit",    subject:"a snow rabbit",             instruction:"Color the snow rabbit white!",                      colorWord:"white"  }, // 21
    { word:"boot",      subject:"snow boots",                instruction:"Color the boots any colors you like!",              colorWord:"red"    }, // 22
    { word:"fox",       subject:"an arctic fox",             instruction:"Color the fox white and the nose black!",           colorWord:"white"  }, // 23
    { word:"moon",      subject:"a winter moon",             instruction:"Color the moon yellow and the sky dark blue!",      colorWord:"yellow" }, // 24
    { word:"crystal",   subject:"ice crystals",              instruction:"Color the ice crystals light blue!",                colorWord:"blue"   }, // 25
    { word:"sleep",     subject:"a sleeping bear",           instruction:"Color the bear brown and the cave dark!",           colorWord:"brown"  }, // 26
    { word:"flake",     subject:"snowflakes",                instruction:"Color the snowflakes blue and white!",              colorWord:"blue"   }, // 27
    { word:"cabin",     subject:"a cozy cabin",              instruction:"Color the cabin brown and the smoke grey!",         colorWord:"brown"  }, // 28
    { word:"robin",     subject:"a robin",                   instruction:"Color the robin's chest red!",                      colorWord:"red"    }, // 29
    { word:"seed",      subject:"seeds in the ground",       instruction:"Color the seeds brown and the soil dark!",          colorWord:"brown"  }, // 30
    { word:"hope",      subject:"a sunrise",                 instruction:"Color the January sunrise pink and gold!",          colorWord:"gold"   }, // 31
  ],
  "April": [
    { word:"egg",       subject:"Easter eggs",               instruction:"Color the Easter eggs bright colors!",              colorWord:"pink"   }, // 1
    { word:"bunny",     subject:"an Easter bunny",           instruction:"Color the Easter bunny white and pink!",            colorWord:"pink"   }, // 2
    { word:"chick",     subject:"baby chicks",               instruction:"Color the baby chicks yellow!",                     colorWord:"yellow" }, // 3
    { word:"cross",     subject:"an Easter cross",           instruction:"Color the cross gold and the flowers pink!",        colorWord:"gold"   }, // 4
    { word:"basket",    subject:"an Easter basket",          instruction:"Color the Easter basket any colors you like!",      colorWord:"yellow" }, // 5
    { word:"lamb",      subject:"a baby lamb",               instruction:"Color the lamb white and the grass green!",         colorWord:"white"  }, // 6
    { word:"tulip",     subject:"tulips",                    instruction:"Color the tulips red and yellow!",                  colorWord:"red"    }, // 7
    { word:"rain",      subject:"April rain",                instruction:"Color the raindrops blue and the umbrella yellow!", colorWord:"blue"   }, // 8
    { word:"palm",      subject:"palm branches",             instruction:"Color the palm branches green!",                    colorWord:"green"  }, // 9
    { word:"robin",     subject:"a robin",                   instruction:"Color the robin's chest orange-red!",               colorWord:"red"    }, // 10
    { word:"butterfly", subject:"a butterfly",               instruction:"Color the butterfly any colors you like!",          colorWord:"orange" }, // 11
    { word:"daisy",     subject:"daisies",                   instruction:"Color the daisies white and yellow!",               colorWord:"white"  }, // 12
    { word:"nest",      subject:"a bird nest with eggs",     instruction:"Color the nest brown and the eggs blue!",           colorWord:"brown"  }, // 13
    { word:"lily",      subject:"Easter lilies",             instruction:"Color the lilies white!",                           colorWord:"white"  }, // 14
    { word:"garden",    subject:"a spring garden",           instruction:"Color the spring garden any colors you like!",      colorWord:"green"  }, // 15
    { word:"frog",      subject:"a frog on a lily pad",      instruction:"Color the frog green and the lily pad dark green!", colorWord:"green"  }, // 16
    { word:"worm",      subject:"a worm in the rain",        instruction:"Color the worm pink and the rain blue!",            colorWord:"pink"   }, // 17
    { word:"cloud",     subject:"spring clouds",             instruction:"Color the clouds white and the sky blue!",          colorWord:"blue"   }, // 18
    { word:"duckling",  subject:"ducklings",                 instruction:"Color the ducklings yellow!",                       colorWord:"yellow" }, // 19
    { word:"rainbow",   subject:"a spring rainbow",          instruction:"Color the rainbow any colors you like!",            colorWord:"purple" }, // 20
    { word:"kite",      subject:"a kite",                    instruction:"Color the kite bright colors!",                     colorWord:"red"    }, // 21
    { word:"blossom",   subject:"cherry blossoms",           instruction:"Color the cherry blossoms pink!",                   colorWord:"pink"   }, // 22
    { word:"earth",     subject:"the earth",                 instruction:"Color the earth blue and green!",                   colorWord:"blue"   }, // 23
    { word:"bee",       subject:"a bee on a flower",         instruction:"Color the bee yellow and black!",                   colorWord:"yellow" }, // 24
    { word:"snail",     subject:"a snail",                   instruction:"Color the snail's shell brown and yellow!",         colorWord:"brown"  }, // 25
    { word:"ladybug",   subject:"a ladybug",                 instruction:"Color the ladybug red with black dots!",            colorWord:"red"    }, // 26
    { word:"mud",       subject:"muddy boots",               instruction:"Color the boots brown and muddy!",                  colorWord:"brown"  }, // 27
    { word:"iris",      subject:"irises",                    instruction:"Color the irises purple!",                          colorWord:"purple" }, // 28
    { word:"sprout",    subject:"a seedling sprouting",      instruction:"Color the sprout green and the soil brown!",        colorWord:"green"  }, // 29
    { word:"pond",      subject:"a spring pond",             instruction:"Color the pond blue and the lily pads green!",      colorWord:"blue"   }, // 30
  ],
  "May": [
    { word:"mom",       subject:"a Mother's Day card",       instruction:"Color the Mother's Day card pink and gold!",        colorWord:"pink"   }, // 1
    { word:"rose",      subject:"roses",                     instruction:"Color the roses red!",                              colorWord:"red"    }, // 2
    { word:"sun",       subject:"the bright May sun",        instruction:"Color the sun yellow!",                             colorWord:"yellow" }, // 3
    { word:"bird",      subject:"a mother bird and nest",    instruction:"Color the mama bird and her nest!",                 colorWord:"brown"  }, // 4
    { word:"flower",    subject:"a bouquet of flowers",      instruction:"Color the bouquet any colors you like!",            colorWord:"pink"   }, // 5
    { word:"butterfly", subject:"a butterfly garden",        instruction:"Color the butterflies bright colors!",              colorWord:"orange" }, // 6
    { word:"garden",    subject:"a flower garden",           instruction:"Color the garden any colors you like!",             colorWord:"green"  }, // 7
    { word:"bee",       subject:"a honeybee",                instruction:"Color the bee yellow and black!",                   colorWord:"yellow" }, // 8
    { word:"hug",       subject:"a mother and child hug",    instruction:"Color the hug scene any colors you like!",          colorWord:"pink"   }, // 9
    { word:"crown",     subject:"a flower crown",            instruction:"Color the flower crown pink and yellow!",           colorWord:"pink"   }, // 10
    { word:"basket",    subject:"a picnic basket",           instruction:"Color the picnic basket brown!",                    colorWord:"brown"  }, // 11
    { word:"lily",      subject:"lily of the valley",        instruction:"Color the flowers white and the leaves green!",     colorWord:"white"  }, // 12
    { word:"heart",     subject:"a heart made of flowers",   instruction:"Color the flower heart pink and red!",              colorWord:"red"    }, // 13
    { word:"gift",      subject:"a gift for mom",            instruction:"Color the gift any colors you like!",               colorWord:"purple" }, // 14
    { word:"tree",      subject:"a tree in bloom",           instruction:"Color the tree pink and green!",                    colorWord:"green"  }, // 15
    { word:"ladybug",   subject:"a ladybug",                 instruction:"Color the ladybug red with black dots!",            colorWord:"red"    }, // 16
    { word:"turtle",    subject:"a sea turtle",              instruction:"Color the sea turtle green!",                       colorWord:"green"  }, // 17
    { word:"rainbow",   subject:"a spring rainbow",          instruction:"Color the rainbow any colors you like!",            colorWord:"purple" }, // 18
    { word:"daisy",     subject:"daisies in a field",        instruction:"Color the daisies white and yellow!",               colorWord:"white"  }, // 19
    { word:"kite",      subject:"kites in the sky",          instruction:"Color the kites bright colors!",                    colorWord:"red"    }, // 20
    { word:"caterpillar",subject:"a caterpillar",            instruction:"Color the caterpillar green!",                      colorWord:"green"  }, // 21
    { word:"cloud",     subject:"fluffy clouds",             instruction:"Color the clouds white and the sky blue!",          colorWord:"blue"   }, // 22
    { word:"snail",     subject:"a snail on a leaf",         instruction:"Color the leaf green and the shell yellow!",        colorWord:"green"  }, // 23
    { word:"frog",      subject:"a frog",                    instruction:"Color the frog green!",                             colorWord:"green"  }, // 24
    { word:"pond",      subject:"a pond with ducks",         instruction:"Color the pond blue and the ducks yellow!",         colorWord:"blue"   }, // 25
    { word:"dandelion", subject:"dandelions",                instruction:"Color the dandelions yellow!",                      colorWord:"yellow" }, // 26
    { word:"strawberry",subject:"strawberries",              instruction:"Color the strawberries red!",                       colorWord:"red"    }, // 27
    { word:"school",    subject:"a schoolhouse",             instruction:"Color the schoolhouse red!",                        colorWord:"red"    }, // 28
    { word:"pencil",    subject:"pencils and crayons",       instruction:"Color the pencils yellow and the crayons colorful!",colorWord:"yellow" }, // 29
    { word:"summer",    subject:"a summer scene",            instruction:"Color the summer scene bright colors!",             colorWord:"yellow" }, // 30
    { word:"dragonfly", subject:"a dragonfly",               instruction:"Color the dragonfly blue and green!",               colorWord:"blue"   }, // 31
  ],
  "June": [
    { word:"beach",     subject:"a beach scene",             instruction:"Color the beach yellow and the water blue!",        colorWord:"blue"   }, // 1
    { word:"wave",      subject:"ocean waves",               instruction:"Color the waves blue and white!",                   colorWord:"blue"   }, // 2
    { word:"shell",     subject:"seashells",                 instruction:"Color the shells pink and white!",                  colorWord:"pink"   }, // 3
    { word:"crab",      subject:"a crab",                    instruction:"Color the crab red!",                               colorWord:"red"    }, // 4
    { word:"fish",      subject:"colorful fish",             instruction:"Color the fish bright colors!",                     colorWord:"orange" }, // 5
    { word:"sun",       subject:"the summer sun",            instruction:"Color the sun bright yellow!",                      colorWord:"yellow" }, // 6
    { word:"starfish",  subject:"a starfish",                instruction:"Color the starfish orange!",                        colorWord:"orange" }, // 7
    { word:"turtle",    subject:"a sea turtle",              instruction:"Color the sea turtle green!",                       colorWord:"green"  }, // 8
    { word:"lei",       subject:"a Hawaiian lei",            instruction:"Color the lei pink and purple!",                    colorWord:"pink"   }, // 9
    { word:"hula",      subject:"a hula dancer",             instruction:"Color the hula dancer's skirt green!",              colorWord:"green"  }, // 10
    { word:"plumeria",  subject:"plumeria flowers",          instruction:"Color the plumeria pink and yellow!",               colorWord:"pink"   }, // 11
    { word:"rainbow",   subject:"a Hawaiian rainbow",        instruction:"Color the rainbow any colors you like!",            colorWord:"purple" }, // 12
    { word:"palm",      subject:"palm trees",                instruction:"Color the palm tree green and brown!",              colorWord:"green"  }, // 13
    { word:"icecream",  subject:"an ice cream cone",         instruction:"Color the ice cream any flavor you like!",          colorWord:"pink"   }, // 14
    { word:"kite",      subject:"a kite on the beach",       instruction:"Color the kite bright colors!",                     colorWord:"red"    }, // 15
    { word:"dolphin",   subject:"a dolphin",                 instruction:"Color the dolphin grey and blue!",                  colorWord:"blue"   }, // 16
    { word:"sunset",    subject:"an ocean sunset",           instruction:"Color the sunset pink, orange, and gold!",          colorWord:"orange" }, // 17
    { word:"cloud",     subject:"summer clouds",             instruction:"Color the clouds white and the sky blue!",          colorWord:"blue"   }, // 18
    { word:"boat",      subject:"a sailboat",                instruction:"Color the sail white and the boat blue!",           colorWord:"blue"   }, // 19
    { word:"whale",     subject:"a whale",                   instruction:"Color the whale blue and the water turquoise!",     colorWord:"blue"   }, // 20
    { word:"pineapple", subject:"a pineapple",               instruction:"Color the pineapple yellow and green!",             colorWord:"yellow" }, // 21
    { word:"mango",     subject:"mangoes",                   instruction:"Color the mangoes orange and yellow!",              colorWord:"orange" }, // 22
    { word:"coral",     subject:"coral reef",                instruction:"Color the coral pink and orange!",                  colorWord:"pink"   }, // 23
    { word:"flower",    subject:"tropical flowers",          instruction:"Color the tropical flowers bright colors!",         colorWord:"red"    }, // 24
    { word:"hermit",    subject:"a hermit crab",             instruction:"Color the hermit crab red!",                        colorWord:"red"    }, // 25
    { word:"sand",      subject:"sandcastles",               instruction:"Color the sandcastle yellow and the sea blue!",     colorWord:"yellow" }, // 26
    { word:"seagull",   subject:"seagulls",                  instruction:"Color the seagulls white and grey!",                colorWord:"white"  }, // 27
    { word:"anchor",    subject:"an anchor",                 instruction:"Color the anchor dark blue!",                       colorWord:"blue"   }, // 28
    { word:"moonfish",  subject:"a moonfish",                instruction:"Color the moonfish silver and yellow!",             colorWord:"yellow" }, // 29
    { word:"aloha",     subject:"an aloha sunset",           instruction:"Color the aloha sunset any colors you like!",       colorWord:"gold"   }, // 30
  ],
  "July": [
    { word:"flag",      subject:"an American flag",          instruction:"Color the flag red, white, and blue!",              colorWord:"red"    }, // 1
    { word:"star",      subject:"stars",                     instruction:"Color the stars red, white, and blue!",             colorWord:"blue"   }, // 2
    { word:"fireworks", subject:"fireworks",                 instruction:"Color the fireworks bright colors!",                colorWord:"red"    }, // 3
    { word:"freedom",   subject:"a 4th of July scene",       instruction:"Color the 4th of July scene red, white, and blue!", colorWord:"blue"   }, // 4
    { word:"eagle",     subject:"a bald eagle",              instruction:"Color the eagle brown with a white head!",          colorWord:"brown"  }, // 5
    { word:"parade",    subject:"a parade",                  instruction:"Color the parade floats bright colors!",            colorWord:"red"    }, // 6
    { word:"watermelon",subject:"a watermelon",              instruction:"Color the watermelon red and green!",               colorWord:"red"    }, // 7
    { word:"beach",     subject:"a summer beach",            instruction:"Color the beach yellow and the sea blue!",          colorWord:"blue"   }, // 8
    { word:"sun",       subject:"the hot July sun",          instruction:"Color the sun bright yellow!",                      colorWord:"yellow" }, // 9
    { word:"wave",      subject:"big ocean waves",           instruction:"Color the waves blue!",                             colorWord:"blue"   }, // 10
    { word:"fish",      subject:"tropical fish",             instruction:"Color the fish bright colors!",                     colorWord:"orange" }, // 11
    { word:"turtle",    subject:"a sea turtle",              instruction:"Color the sea turtle green!",                       colorWord:"green"  }, // 12
    { word:"dolphin",   subject:"a jumping dolphin",         instruction:"Color the dolphin grey and the water blue!",        colorWord:"grey"   }, // 13
    { word:"shell",     subject:"seashells",                 instruction:"Color the shells pink, white, and tan!",            colorWord:"pink"   }, // 14
    { word:"crab",      subject:"a crab on the beach",       instruction:"Color the crab orange-red!",                       colorWord:"orange" }, // 15
    { word:"icecream",  subject:"ice cream",                 instruction:"Color the ice cream your favorite flavor!",         colorWord:"pink"   }, // 16
    { word:"pineapple", subject:"a pineapple",               instruction:"Color the pineapple yellow and the top green!",     colorWord:"yellow" }, // 17
    { word:"lei",       subject:"a flower lei",              instruction:"Color the lei pink, yellow, and purple!",           colorWord:"pink"   }, // 18
    { word:"sunset",    subject:"a summer sunset",           instruction:"Color the sunset orange, pink, and purple!",        colorWord:"orange" }, // 19
    { word:"sandcastle",subject:"a sandcastle",              instruction:"Color the sandcastle golden and the sea blue!",     colorWord:"yellow" }, // 20
    { word:"butterfly", subject:"a butterfly",               instruction:"Color the butterfly any colors you like!",          colorWord:"purple" }, // 21
    { word:"garden",    subject:"a summer garden",           instruction:"Color the garden bright colors!",                   colorWord:"green"  }, // 22
    { word:"sunflower", subject:"sunflowers",                instruction:"Color the sunflowers yellow!",                      colorWord:"yellow" }, // 23
    { word:"corn",      subject:"corn on the cob",           instruction:"Color the corn yellow!",                            colorWord:"yellow" }, // 24
    { word:"berry",     subject:"berries",                   instruction:"Color the berries red and purple!",                 colorWord:"red"    }, // 25
    { word:"lemonade",  subject:"a lemonade stand",          instruction:"Color the lemonade yellow and the stand bright!",   colorWord:"yellow" }, // 26
    { word:"kite",      subject:"kites in a blue sky",       instruction:"Color the kites bright colors!",                    colorWord:"red"    }, // 27
    { word:"cloud",     subject:"summer clouds",             instruction:"Color the clouds white and the sky bright blue!",   colorWord:"blue"   }, // 28
    { word:"lily",      subject:"water lilies",              instruction:"Color the lilies pink and the pads green!",         colorWord:"pink"   }, // 29
    { word:"firefly",   subject:"fireflies at night",        instruction:"Color the fireflies yellow and the sky dark blue!", colorWord:"yellow" }, // 30
    { word:"summer",    subject:"a summer fun scene",        instruction:"Color the summer scene any colors you like!",       colorWord:"orange" }, // 31
  ],
  "August": [
    { word:"backpack",  subject:"a backpack",                instruction:"Color the backpack any colors you like!",           colorWord:"blue"   }, // 1
    { word:"pencil",    subject:"pencils",                   instruction:"Color the pencils yellow!",                         colorWord:"yellow" }, // 2
    { word:"book",      subject:"books",                     instruction:"Color the books bright colors!",                    colorWord:"red"    }, // 3
    { word:"apple",     subject:"an apple for the teacher",  instruction:"Color the apple red!",                              colorWord:"red"    }, // 4
    { word:"school",    subject:"a schoolhouse",             instruction:"Color the schoolhouse red and the door brown!",     colorWord:"red"    }, // 5
    { word:"bus",       subject:"a school bus",              instruction:"Color the bus yellow!",                             colorWord:"yellow" }, // 6
    { word:"crayon",    subject:"crayons",                   instruction:"Color the crayons all different colors!",           colorWord:"red"    }, // 7
    { word:"ruler",     subject:"a ruler",                   instruction:"Color the ruler yellow!",                           colorWord:"yellow" }, // 8
    { word:"beach",     subject:"a last summer beach day",   instruction:"Color the beach yellow and the ocean blue!",        colorWord:"blue"   }, // 9
    { word:"sun",       subject:"the late summer sun",       instruction:"Color the sun golden yellow!",                      colorWord:"yellow" }, // 10
    { word:"sunflower", subject:"sunflowers",                instruction:"Color the sunflowers yellow and brown!",            colorWord:"yellow" }, // 11
    { word:"corn",      subject:"a cornfield",               instruction:"Color the corn yellow and the stalks green!",       colorWord:"yellow" }, // 12
    { word:"butterfly", subject:"a butterfly",               instruction:"Color the butterfly orange and black!",             colorWord:"orange" }, // 13
    { word:"dragonfly", subject:"a dragonfly",               instruction:"Color the dragonfly blue!",                         colorWord:"blue"   }, // 14
    { word:"garden",    subject:"a summer garden",           instruction:"Color the garden any colors you like!",             colorWord:"green"  }, // 15
    { word:"fish",      subject:"fish in a pond",            instruction:"Color the fish orange and the pond blue!",          colorWord:"orange" }, // 16
    { word:"frog",      subject:"a frog",                    instruction:"Color the frog green!",                             colorWord:"green"  }, // 17
    { word:"melon",     subject:"a watermelon",              instruction:"Color the watermelon red and green!",               colorWord:"red"    }, // 18
    { word:"berry",     subject:"blueberries",               instruction:"Color the blueberries blue!",                       colorWord:"blue"   }, // 19
    { word:"peach",     subject:"peaches",                   instruction:"Color the peaches orange-pink!",                    colorWord:"orange" }, // 20
    { word:"cloud",     subject:"late summer clouds",        instruction:"Color the clouds white and the sky blue!",          colorWord:"blue"   }, // 21
    { word:"leaf",      subject:"first falling leaves",      instruction:"Color the leaves green with hints of yellow!",      colorWord:"green"  }, // 22
    { word:"acorn",     subject:"acorns",                    instruction:"Color the acorns brown!",                           colorWord:"brown"  }, // 23
    { word:"spider",    subject:"a spider web with dew",     instruction:"Color the web white and the dew drops blue!",       colorWord:"white"  }, // 24
    { word:"bee",       subject:"a bee",                     instruction:"Color the bee yellow and black!",                   colorWord:"yellow" }, // 25
    { word:"grasshopper",subject:"a grasshopper",            instruction:"Color the grasshopper green!",                      colorWord:"green"  }, // 26
    { word:"scissors",  subject:"school scissors",           instruction:"Color the scissors handles red!",                   colorWord:"red"    }, // 27
    { word:"glue",      subject:"a glue stick",              instruction:"Color the glue stick purple!",                      colorWord:"purple" }, // 28
    { word:"notebook",  subject:"a notebook",                instruction:"Color the notebook any color you like!",            colorWord:"blue"   }, // 29
    { word:"friend",    subject:"friends at school",         instruction:"Color the school friends any colors you like!",     colorWord:"pink"   }, // 30
    { word:"summer",    subject:"a summer memory",           instruction:"Color your favorite summer memory!",                colorWord:"yellow" }, // 31
  ],
  "September": [
    { word:"leaf",      subject:"autumn leaves",             instruction:"Color the leaves red, orange, and yellow!",         colorWord:"orange" }, // 1
    { word:"acorn",     subject:"acorns",                    instruction:"Color the acorns brown!",                           colorWord:"brown"  }, // 2
    { word:"apple",     subject:"apples on a tree",          instruction:"Color the apples red!",                             colorWord:"red"    }, // 3
    { word:"school",    subject:"a school scene",            instruction:"Color the school any colors you like!",             colorWord:"red"    }, // 4
    { word:"bus",       subject:"a school bus",              instruction:"Color the bus yellow!",                             colorWord:"yellow" }, // 5
    { word:"pencil",    subject:"pencils and paper",         instruction:"Color the pencils yellow!",                         colorWord:"yellow" }, // 6
    { word:"squirrel",  subject:"a squirrel with a nut",     instruction:"Color the squirrel brown!",                         colorWord:"brown"  }, // 7
    { word:"mushroom",  subject:"mushrooms",                 instruction:"Color the mushroom cap red with white dots!",       colorWord:"red"    }, // 8
    { word:"pear",      subject:"pears",                     instruction:"Color the pears yellow-green!",                     colorWord:"green"  }, // 9
    { word:"harvest",   subject:"a harvest basket",          instruction:"Color the basket brown and the produce colorful!",  colorWord:"orange" }, // 10
    { word:"corn",      subject:"corn",                      instruction:"Color the corn golden yellow!",                     colorWord:"yellow" }, // 11
    { word:"spider",    subject:"a spider and web",          instruction:"Color the spider black and the web white!",         colorWord:"black"  }, // 12
    { word:"owl",       subject:"an owl on a branch",        instruction:"Color the owl brown and the branch dark!",          colorWord:"brown"  }, // 13
    { word:"sunflower", subject:"sunflowers",                instruction:"Color the sunflowers yellow and brown!",            colorWord:"yellow" }, // 14
    { word:"pumpkin",   subject:"pumpkins",                  instruction:"Color the pumpkins orange!",                        colorWord:"orange" }, // 15
    { word:"tree",      subject:"an autumn tree",            instruction:"Color the tree red, orange, and yellow!",           colorWord:"orange" }, // 16
    { word:"grape",     subject:"grapes",                    instruction:"Color the grapes purple!",                          colorWord:"purple" }, // 17
    { word:"fog",       subject:"a foggy morning",           instruction:"Color the foggy scene grey and white!",             colorWord:"grey"   }, // 18
    { word:"deer",      subject:"a deer in the forest",      instruction:"Color the deer brown!",                             colorWord:"brown"  }, // 19
    { word:"berry",     subject:"berries on a branch",       instruction:"Color the berries red and the leaves orange!",      colorWord:"red"    }, // 20
    { word:"bat",       subject:"a bat at dusk",             instruction:"Color the bat black and the sky purple!",           colorWord:"black"  }, // 21
    { word:"hayride",   subject:"a hayride",                 instruction:"Color the hay golden and the wagon brown!",         colorWord:"gold"   }, // 22
    { word:"maple",     subject:"a maple leaf",              instruction:"Color the maple leaf bright red!",                  colorWord:"red"    }, // 23
    { word:"pinecone",  subject:"pinecones",                 instruction:"Color the pinecones brown!",                        colorWord:"brown"  }, // 24
    { word:"gourd",     subject:"gourds",                    instruction:"Color the gourds orange, yellow, and green!",       colorWord:"orange" }, // 25
    { word:"wagon",     subject:"a red wagon of apples",     instruction:"Color the wagon red and the apples red!",           colorWord:"red"    }, // 26
    { word:"scarecrow", subject:"a scarecrow",               instruction:"Color the scarecrow any colors you like!",          colorWord:"orange" }, // 27
    { word:"moon",      subject:"a harvest moon",            instruction:"Color the harvest moon orange!",                    colorWord:"orange" }, // 28
    { word:"crow",      subject:"a crow on a fence",         instruction:"Color the crow black!",                             colorWord:"black"  }, // 29
    { word:"autumn",    subject:"an autumn scene",           instruction:"Color the autumn scene any colors you like!",       colorWord:"orange" }, // 30
  ],
  "November": [
    { word:"turkey",    subject:"a turkey",                  instruction:"Color the turkey brown and the feathers colorful!", colorWord:"brown"  }, // 1
    { word:"leaf",      subject:"falling leaves",            instruction:"Color the leaves red, orange, and yellow!",         colorWord:"orange" }, // 2
    { word:"saint",     subject:"All Saints Day scene",      instruction:"Color the saints' scene gold and white!",           colorWord:"gold"   }, // 3
    { word:"thankful",  subject:"a thankful heart",          instruction:"Color the thankful heart red and gold!",            colorWord:"red"    }, // 4
    { word:"acorn",     subject:"acorns and leaves",         instruction:"Color the acorns brown and the leaves orange!",     colorWord:"brown"  }, // 5
    { word:"pie",       subject:"a pumpkin pie",             instruction:"Color the pie orange and the crust golden!",        colorWord:"orange" }, // 6
    { word:"corn",      subject:"Indian corn",               instruction:"Color the corn with many colors!",                  colorWord:"yellow" }, // 7
    { word:"harvest",   subject:"a harvest table",           instruction:"Color the harvest table brown and colorful!",       colorWord:"brown"  }, // 8
    { word:"deer",      subject:"a deer in autumn",          instruction:"Color the deer brown!",                             colorWord:"brown"  }, // 9
    { word:"candle",    subject:"a Thanksgiving candle",     instruction:"Color the candle orange and the flame yellow!",     colorWord:"orange" }, // 10
    { word:"veteran",   subject:"a flag for Veterans Day",   instruction:"Color the flag red, white, and blue!",              colorWord:"red"    }, // 11
    { word:"owl",       subject:"an owl in the leaves",      instruction:"Color the owl brown and the leaves orange!",        colorWord:"brown"  }, // 12
    { word:"apple",     subject:"an apple pie",              instruction:"Color the pie golden brown!",                       colorWord:"brown"  }, // 13
    { word:"squirrel",  subject:"a squirrel gathering nuts", instruction:"Color the squirrel orange-brown!",                  colorWord:"brown"  }, // 14
    { word:"pumpkin",   subject:"a pumpkin",                 instruction:"Color the pumpkin orange!",                         colorWord:"orange" }, // 15
    { word:"pinecone",  subject:"pinecones",                 instruction:"Color the pinecones brown!",                        colorWord:"brown"  }, // 16
    { word:"bread",     subject:"a loaf of bread",           instruction:"Color the bread golden brown!",                     colorWord:"brown"  }, // 17
    { word:"family",    subject:"a family together",         instruction:"Color the family scene any colors you like!",       colorWord:"red"    }, // 18
    { word:"maple",     subject:"a maple tree",              instruction:"Color the maple tree red and orange!",              colorWord:"red"    }, // 19
    { word:"feast",     subject:"a Thanksgiving feast",      instruction:"Color the feast table any colors you like!",        colorWord:"orange" }, // 20
    { word:"pilgrim",   subject:"a Pilgrim hat",             instruction:"Color the Pilgrim hat black and the buckle gold!",  colorWord:"black"  }, // 21
    { word:"cornucopia",subject:"a cornucopia",              instruction:"Color the cornucopia brown and the fruits colorful!",colorWord:"brown" }, // 22
    { word:"wagon",     subject:"a covered wagon",           instruction:"Color the wagon brown!",                            colorWord:"brown"  }, // 23
    { word:"Native",    subject:"a Native American scene",   instruction:"Color the scene with warm, earthy colors!",         colorWord:"brown"  }, // 24
    { word:"autumn",    subject:"an autumn forest",          instruction:"Color the forest red, orange, and yellow!",         colorWord:"orange" }, // 25
    { word:"star",      subject:"a star of gratitude",       instruction:"Color the gratitude star gold!",                    colorWord:"gold"   }, // 26
    { word:"thanks",    subject:"a Thanksgiving scene",      instruction:"Color the Thanksgiving scene any colors you like!", colorWord:"orange" }, // 27
    { word:"tree",      subject:"a bare winter tree",        instruction:"Color the bare tree brown and the sky grey!",       colorWord:"brown"  }, // 28
    { word:"advent",    subject:"an Advent wreath",          instruction:"Color the Advent wreath green with purple candles!",colorWord:"purple" }, // 29
    { word:"hope",      subject:"a candle of hope",          instruction:"Color the candle purple and the flame yellow!",     colorWord:"purple" }, // 30
  ],
};

// Helper: get today's activity data
function getDayActivity(month, day) {
  const list = DAILY_ACTIVITIES[month] || DAILY_ACTIVITIES.December;
  return list[Math.min(day - 1, list.length - 1)];
}

// ─────────────────────────────────────────────────────────
// IMAGE SYSTEM
// ─────────────────────────────────────────────────────────
//
// HOW TO ADD IMAGES IN STACKBLITZ:
//   1. In the StackBlitz file panel, create a folder: public/images/
//   2. Upload your coloring book images named exactly:
//        january_01.png, january_02.png ... january_31.png
//        february_01.png ... march_31.png  etc.
//   3. The app will automatically show the image when the file exists.
//      If no image is found, it shows the dashed placeholder instead.
//
// TIP: Generate in ChatGPT Coloring Book Hero, download, rename, upload.
// ─────────────────────────────────────────────────────────

// Image cache context — holds pre-fetched base64 data URLs for PDF rendering.
// During normal preview, images load via <img src="/images/..."> as usual.
// During PDF generation, we pre-fetch all images as base64 and inject them
// via this context so html2canvas never has to make network requests.
const ImageCacheContext = React.createContext<Record<string,string>>({});

function DayImage({ month, day, label }: { month: string; day: number; label: string }) {
  const [loaded, setLoaded] = React.useState(false);
  const [error,  setError]  = React.useState(false);
  const cache     = React.useContext(ImageCacheContext);
  const paddedDay = String(day).padStart(2, "0");
  const key       = `${month.toLowerCase()}_${paddedDay}`;

  // If cache has a base64 for this day, use it directly — no load state needed
  const cachedSrc = cache[key];

  // Reset state when key changes
  React.useEffect(() => { setLoaded(false); setError(false); }, [key]);

  // PDF mode: base64 already available — render img directly, no placeholder dance
  if (cachedSrc) {
    return (
      <div style={{ flex:1, width:"100%", minHeight:110,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <img
          src={cachedSrc}
          alt={label}
          style={{ maxWidth:"100%", maxHeight:160, width:"auto", height:"auto", objectFit:"contain", borderRadius:4, display:"block" }}
        />
      </div>
    );
  }

  // Normal preview mode: load from public/images/, show placeholder until loaded
  const src = `/images/${key}.png`;
  return (
    <div style={{ flex:1, width:"100%", minHeight:110, position:"relative",
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      {!error && (
        <img
          src={src}
          alt={label}
          onLoad={()=>setLoaded(true)}
          onError={()=>setError(true)}
          style={{ display: loaded ? "block" : "none",
            maxWidth:"100%", maxHeight:160, width:"auto", height:"auto", objectFit:"contain", borderRadius:4 }}
        />
      )}
      {(!loaded || error) && (
        <div style={{ flex:1, width:"100%", minHeight:110,
          border:"1.5px dashed #9ca3af", borderRadius:6,
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"white" }}>
          <div style={{ fontSize:9, color:"#c4b5a0", textAlign:"center",
            lineHeight:1.4, maxWidth:"80%", fontStyle:"italic" }}>
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ACTIVITY: Color the Scene (even days) ──
// Uses getDayActivity for the instruction + subject label
function ColorSceneActivity({ day, month }) {
  const { instruction, subject } = getDayActivity(month, day);
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ fontSize:12, fontWeight:"bold", color:"#1f2937",
        marginBottom:6, lineHeight:1.4 }}>
        {instruction}
      </div>
      <DayImage month={month} day={day} label={subject}/>
    </div>
  );
}

// ── ACTIVITY: Trace & Color (odd days) ──
// Traces the colorWord, colors the same subject as the scene
function TraceColorActivity({ day, month }) {
  const { colorWord, subject } = getDayActivity(month, day);
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ fontSize:10, fontWeight:"bold", color:"#374151",
        textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>
        Trace &amp; Color
      </div>
      <TraceRow text={colorWord} size={28} gap={2}/>
      <div style={{ flex:1, display:"flex", marginTop:6 }}>
        <DayImage month={month} day={day} label={subject}/>
      </div>
    </div>
  );
}

// ── Rotating color activity: even→scene, odd→trace ──
function ColorActivity({ day, month }) {
  const type = day % 2 === 0 ? "scene" : "trace";
  return (
    <div style={{ flex:1, border:"1.5px solid #d1d5db", borderRadius:6,
      padding:"8px 10px", background:"white", display:"flex",
      flexDirection:"column", minHeight:180 }}>
      {type === "scene"
        ? <ColorSceneActivity day={day} month={month}/>
        : <TraceColorActivity day={day} month={month}/>
      }
    </div>
  );
}

// ══════════════════════════════════════
// MATH ACTIVITIES
// ══════════════════════════════════════

function SvgObject({ type, size = 36 }) {
  const shapes = {
    apple: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10 Q10 10 8 20 Q6 32 12 38 Q15 42 18 42 Q21 42 24 38 Q30 32 28 20 Q26 10 18 10Z"/>
        <path d="M18 10 Q18 6 22 4"/><path d="M18 10 Q16 7 14 8"/>
      </g>
    ),
    star: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22,6 25,16 36,16 27,22 30,32 22,26 14,32 17,22 8,16 19,16"/>
      </g>
    ),
    fish: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 22 Q18 14 30 22 Q18 30 10 22Z"/>
        <path d="M10 22 L4 16 L4 28 Z"/>
        <circle cx="26" cy="21" r="1.5" fill="#1f2937"/>
      </g>
    ),
    sun: (
      <g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <circle cx="22" cy="22" r="7"/>
        {[0,45,90,135,180,225,270,315].map((a,i)=>{
          const rad=a*Math.PI/180;
          return <line key={i} x1={22+10*Math.cos(rad)} y1={22+10*Math.sin(rad)}
            x2={22+13*Math.cos(rad)} y2={22+13*Math.sin(rad)}/>;
        })}
      </g>
    ),
    heart: (<g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 34 Q10 26 10 18 Q10 12 16 12 Q19 12 22 16 Q25 12 28 12 Q34 12 34 18 Q34 26 22 34Z"/></g>),
    flower: (
      <g stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <circle cx="22" cy="22" r="4"/>
        {[0,60,120,180,240,300].map((a,i)=>{const r=Math.PI*a/180,cx=22+8*Math.cos(r),cy=22+8*Math.sin(r);return <ellipse key={i} cx={cx} cy={cy} rx="4" ry="3" transform={`rotate(${a},${cx},${cy})`}/>;})}<line x1="22" y1="26" x2="22" y2="38"/>
      </g>
    ),
    moon: (<g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round"><path d="M28 12 Q16 14 14 22 Q12 30 20 36 Q30 38 34 28 Q26 28 24 22 Q22 16 28 12Z"/></g>),
    cloud: (<g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M10 28 Q8 28 8 24 Q8 20 12 20 Q12 14 18 14 Q22 14 24 18 Q26 16 30 18 Q34 18 34 22 Q36 22 36 26 Q36 30 32 30 L12 30 Q10 30 10 28Z"/></g>),
    pumpkin: (<g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 Q22 6 26 6"/><path d="M14 14 Q8 14 8 22 Q8 32 14 34 Q18 36 22 34 Q26 36 30 34 Q36 32 36 22 Q36 14 30 14 Q26 14 22 16 Q18 14 14 14Z"/><line x1="22" y1="14" x2="22" y2="34"/><path d="M14 20 Q12 26 14 30" strokeWidth="1"/><path d="M30 20 Q32 26 30 30" strokeWidth="1"/></g>),
    bell: (<g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 8 Q22 10 22 12 Q14 14 12 22 L12 30 L32 30 L32 22 Q30 14 22 12"/><path d="M10 30 L34 30"/><path d="M19 30 Q19 34 22 34 Q25 34 25 30"/><circle cx="22" cy="8" r="2"/></g>),
    diya: (<g stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M10 28 Q10 22 22 22 Q34 22 34 28 Q34 34 22 36 Q10 34 10 28Z"/><path d="M22 22 L22 16"/><path d="M20 14 Q22 10 24 14 Q22 16 20 14Z" fill="#1f2937"/><line x1="14" y1="36" x2="30" y2="36"/></g>),
  };
  return (
    <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
      width:size+8, height:size+8 }}>
      <svg width={size} height={size} viewBox="0 0 44 44" style={{ display:"block" }}>
        {shapes[type] || shapes.star}
      </svg>
    </div>
  );
}

// ── Seasonal object pools per month (generally seasonal, not exact-match) ──
const SEASONAL_OBJS = {
  January:   ["cloud","moon","star","fish","heart"],
  February:  ["heart","flower","star","sun","fish"],
  March:     ["flower","fish","sun","apple","cloud"],
  April:     ["flower","cloud","sun","apple","fish"],
  May:       ["flower","sun","apple","fish","heart"],
  June:      ["fish","sun","flower","star","cloud"],
  July:      ["star","sun","fish","flower","heart"],
  August:    ["sun","apple","flower","fish","cloud"],
  "September": ["apple","moon","flower","cloud","star"],
  October:   ["pumpkin","moon","apple","diya","star"],
  November:  ["apple","moon","star","cloud","heart"],
  December:  ["star","bell","heart","moon","cloud"],
};
function seasonalObj(month, offset=0) {
  const pool = SEASONAL_OBJS[month] || SEASONAL_OBJS.December;
  return pool[offset % pool.length];
}

// ── Shared label style ──
const LABEL = {fontSize:10,fontWeight:"bold",color:"#374151",
  textTransform:"uppercase",letterSpacing:0.8,marginBottom:6};

// ═══════════════════════════════════════════
// AGES 3–4  (3 rotating types)
// ═══════════════════════════════════════════

// 3–4 TYPE 0 — Count & Write
function CountActivity({ day, month }) {
  const obj   = seasonalObj(month, day);
  const count = (day % 5) + 1;
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL}>Count and write the number</div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
          {Array.from({length:count}).map((_,i)=><SvgObject key={i} type={obj} size={58}/>)}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{fontSize:22,color:"#9ca3af"}}>=</div>
          <WriteBox size={52}/>
        </div>
      </div>
    </div>
  );
}

// 3–4 TYPE 1 — Circle Smallest / Biggest
function CircleActivity({ day, month }) {
  const obj  = seasonalObj(month, day);
  const task = day % 2 === 0 ? "smallest" : "biggest";
  const rowSizes = [[36,58,46],[52,36,60],[60,44,38]];
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL}>Circle the {task} in each row</div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-evenly"}}>
        {rowSizes.map((sizes,ri)=>(
          <div key={ri} style={{display:"flex",alignItems:"center",justifyContent:"space-evenly",
            borderBottom:ri<2?"1px dashed #e5e7eb":"none",paddingBottom:ri<2?4:0}}>
            {sizes.map((sz,ci)=><SvgObject key={ci} type={obj} size={sz}/>)}
          </div>
        ))}
      </div>
    </div>
  );
}

// 3–4 TYPE 2 — Color N Objects
function ColorNActivity({ day, month }) {
  const obj    = seasonalObj(month, day);
  const target = (day % 3) + 2;
  const plural = obj==="fish" ? "fish" : obj+"s";
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL}>Color {target} {plural}</div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"space-evenly",flexWrap:"wrap",gap:4}}>
        {Array.from({length:5}).map((_,i)=><SvgObject key={i} type={obj} size={54}/>)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// AGES 5–6  (6 rotating types)
// ═══════════════════════════════════════════

// 5–6 TYPE 0 — Addition with pictures
function AdditionActivity({ day, month }) {
  const addPairs = [[1,1],[2,1],[1,2],[2,2],[3,1],[1,3],[2,3],[3,2],[4,1],[1,4],[3,3],[4,2],[2,4]];
  const [a,b] = addPairs[day % addPairs.length];
  const objA  = seasonalObj(month, day);
  const objB  = seasonalObj(month, day+2);
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL}>How many altogether?</div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
        <div style={{display:"flex",gap:6,padding:"6px 10px",border:"1.5px solid #d1d5db",borderRadius:6,alignItems:"center",flexWrap:"wrap",justifyContent:"center",maxWidth:160}}>
          {Array.from({length:a}).map((_,i)=><SvgObject key={i} type={objA} size={48}/>)}
        </div>
        <div style={{fontSize:26,color:"#374151",fontWeight:"bold"}}>+</div>
        <div style={{display:"flex",gap:6,padding:"6px 10px",border:"1.5px solid #d1d5db",borderRadius:6,alignItems:"center",flexWrap:"wrap",justifyContent:"center",maxWidth:160}}>
          {Array.from({length:b}).map((_,i)=><SvgObject key={i} type={objB} size={48}/>)}
        </div>
        <div style={{fontSize:26,color:"#374151",fontWeight:"bold"}}>=</div>
        <WriteBox size={50}/>
      </div>
    </div>
  );
}

// 5–6 TYPE 1 — Subtraction with pictures (crossed out)
function SubtractionActivity({ day, month }) {
  const subPairs = [[3,1],[4,1],[4,2],[5,1],[5,2],[5,3],[6,2],[6,3],[7,3],[7,4]];
  const [total,remove] = subPairs[day % subPairs.length];
  const obj = seasonalObj(month, day);
  const sz  = 50;
  const xSz = sz + 8;
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL}>Cross out {remove} — how many are left?</div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
        {Array.from({length:total}).map((_,i)=>(
          <div key={i} style={{position:"relative",display:"inline-flex"}}>
            <SvgObject type={obj} size={sz}/>
            {i < remove && (
              <svg style={{position:"absolute",top:0,left:0,pointerEvents:"none"}}
                width={xSz} height={xSz} viewBox={`0 0 ${xSz} ${xSz}`}>
                <line x1="8" y1="8" x2={xSz-8} y2={xSz-8} stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
                <line x1={xSz-8} y1="8" x2="8" y2={xSz-8} stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:8}}>
          <div style={{fontSize:26,color:"#374151",fontWeight:"bold"}}>=</div>
          <WriteBox size={50}/>
        </div>
      </div>
    </div>
  );
}

// 5–6 TYPE 2 — Before & After
function BeforeAfterActivity({ day }) {
  const n = (day % 8) + 2; // 2–9 so before and after are always valid 1–10
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL}>What comes before and after?</div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:9,color:"#9ca3af"}}>before</div>
          <WriteBox size={46}/>
        </div>
        <div style={{fontSize:30,fontWeight:"bold",color:"#1f2937",
          border:"2px solid #1f2937",borderRadius:8,width:52,height:60,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          {n}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:9,color:"#9ca3af"}}>after</div>
          <WriteBox size={46}/>
        </div>
      </div>
    </div>
  );
}

// 5–6 TYPE 3 — Taller / Shorter (two objects, different heights)
function TallerShorterActivity({ day, month }) {
  const task  = day % 2 === 0 ? "taller" : "shorter";
  const obj   = seasonalObj(month, day);
  const sizeA = day % 2 === 0 ? 72 : 42;
  const sizeB = day % 2 === 0 ? 40 : 68;
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL}>Circle the {task} one</div>
      <div style={{flex:1,display:"flex",alignItems:"flex-end",justifyContent:"center",gap:60,paddingBottom:8}}>
        <SvgObject type={obj} size={sizeA}/>
        <SvgObject type={obj} size={sizeB}/>
      </div>
    </div>
  );
}

// 5–6 TYPE 4 — Count the Pennies
// SVG penny: small circle with "1¢" inside
function Penny({ size=44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{display:"block"}}>
      <circle cx="16" cy="16" r="14" fill="none" stroke="#1f2937" strokeWidth="1.8"/>
      <circle cx="16" cy="16" r="11" fill="none" stroke="#1f2937" strokeWidth="0.8"/>
      <text x="16" y="20" textAnchor="middle" fontSize="8"
        fontFamily="Georgia,serif" fill="#1f2937">1¢</text>
    </svg>
  );
}
function PenniesActivity({ day }) {
  const counts = [3,5,4,7,6,8,3,10,5,9,4,6,8,3,7,5,10,4,6,9,3,8,5,7,4,10,6,3,9,5,8];
  const count  = counts[(day-1) % counts.length];
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL}>Count the pennies</div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
        {Array.from({length:count}).map((_,i)=><Penny key={i} size={44}/>)}
        <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:8}}>
          <div style={{fontSize:22,color:"#9ca3af"}}>=</div>
          <WriteBox size={50}/>
          <div style={{fontSize:13,color:"#374151"}}>¢</div>
        </div>
      </div>
    </div>
  );
}

// 5–6 TYPE 5 — Write the Number (trace a large numeral + write it)
// Uses dotted SVG paths for numbers 1–10
const NUMBER_PATHS = {
  1:"M16 8 L16 36",
  2:"M8 12 Q8 6 16 6 Q24 6 24 14 Q24 20 8 28 L8 36 L24 36",
  3:"M8 8 Q16 4 22 10 Q26 16 18 22 Q26 28 22 34 Q16 38 8 34",
  4:"M20 6 L8 24 L26 24 M20 6 L20 36",
  5:"M22 6 L10 6 L9 18 Q14 14 20 16 Q28 18 28 26 Q28 36 18 36 Q10 36 8 30",
  6:"M22 6 Q10 6 8 18 Q6 30 14 34 Q22 38 26 30 Q30 22 20 18 Q12 16 10 22",
  7:"M8 6 L24 6 L12 36",
  8:"M16 22 Q8 18 8 12 Q8 6 16 6 Q24 6 24 12 Q24 18 16 22 Q8 26 8 32 Q8 38 16 38 Q24 38 24 32 Q24 26 16 22",
  9:"M24 14 Q24 6 16 6 Q8 6 8 14 Q8 22 16 22 Q24 22 24 14 Q24 28 20 34 Q16 38 10 36",
  10:"M6 8 L6 36 M14 6 Q22 6 24 14 L24 28 Q24 36 16 36 Q8 36 8 28 L8 14 Q8 6 16 6",
};
function WriteNumberActivity({ day }) {
  const n    = (day % 10) + 1; // 1–10
  const path = NUMBER_PATHS[n] || NUMBER_PATHS[1];
  const size = 64;
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={LABEL}>Write the number {n}</div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
        {/* Trace it */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:9,color:"#9ca3af"}}>trace</div>
          <svg width={size} height={size} viewBox="0 0 32 44"
            style={{border:"1px dashed #e5e7eb",borderRadius:4}}>
            <line x1="0" y1="2"  x2="32" y2="2"  stroke="#e5e7eb" strokeWidth="0.8"/>
            <line x1="0" y1="22" x2="32" y2="22" stroke="#e5e7eb" strokeWidth="0.6" strokeDasharray="3 3"/>
            <line x1="0" y1="42" x2="32" y2="42" stroke="#e5e7eb" strokeWidth="0.8"/>
            <path d={path} fill="none" stroke="#b0b0b0" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4"/>
          </svg>
        </div>
        {/* Write it twice */}
        {[1,2].map(i=>(
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{fontSize:9,color:"#9ca3af"}}>write</div>
            <svg width={size} height={size} viewBox="0 0 32 44"
              style={{border:"1px dashed #e5e7eb",borderRadius:4}}>
              <line x1="0" y1="2"  x2="32" y2="2"  stroke="#e5e7eb" strokeWidth="0.8"/>
              <line x1="0" y1="22" x2="32" y2="22" stroke="#e5e7eb" strokeWidth="0.6" strokeDasharray="3 3"/>
              <line x1="0" y1="42" x2="32" y2="42" stroke="#e5e7eb" strokeWidth="0.8"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MathActivity router ──
// Ages 3–4: 3 types  → count, circle-size, color-N
// Ages 5–6: 6 types  → addition, subtraction, before&after, taller/shorter, pennies, write-number
function MathActivity({ day, month, age }) {
  const maxTypes = age <= 4 ? 3 : 6;
  const type     = day % maxTypes;
  return (
    <div style={{border:"1.5px solid #d1d5db",borderRadius:6,
      padding:"10px 14px",background:"white",minHeight:140}}>
      {age <= 4 ? <>
        {type===0 && <CountActivity      day={day} month={month}/>}
        {type===1 && <CircleActivity     day={day} month={month}/>}
        {type===2 && <ColorNActivity     day={day} month={month}/>}
      </> : <>
        {type===0 && <AdditionActivity    day={day} month={month}/>}
        {type===1 && <SubtractionActivity day={day} month={month}/>}
        {type===2 && <BeforeAfterActivity day={day}/>}
        {type===3 && <TallerShorterActivity day={day} month={month}/>}
        {type===4 && <PenniesActivity     day={day}/>}
        {type===5 && <WriteNumberActivity day={day}/>}
      </>}
    </div>
  );
}

// ══════════════════════════════════════════
// LETTER TRACING ACTIVITY — dynamic per day + age
//
// Ages 3–4: one letter per day (uppercase only), write it once
// Ages 5–6: short word per day, uppercase + lowercase rows + write line
//
// 31-day schedules:
//   Ages 3-4 → single letters cycling A→Z then back
//   Ages 5-6 → themed words per month
// ══════════════════════════════════════════

// ── LETTER TRACING ACTIVITY ──
// Ages 3–4: trace the first letter of today's word (large, 3×)
// Ages 5–6: trace the full word (uppercase + lowercase + write line)
// The word always matches the picture in the color activity box.
function LetterTracingActivity({ day, month, age }) {
  const { word } = getDayActivity(month, day);

  if (age <= 4) {
    const letter = word[0].toUpperCase();
    const size   = 48;
    return (
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={{fontSize:10,fontWeight:"bold",color:"#374151",
          textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>
          Trace the letter
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <TraceLetter char={letter} size={size}/>
          <TraceLetter char={letter} size={size}/>
          <TraceLetter char={letter} size={size}/>
        </div>
        <div style={{fontSize:9,color:"#9ca3af",marginBottom:3}}>now write it yourself</div>
        <RuledLine h={Math.round(size*1.4)}/>
      </div>
    );
  }

  // Ages 5–6: full word, font size scales with length
  const size = word.length <= 4 ? 34 : word.length <= 6 ? 28 : 22;
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{fontSize:10,fontWeight:"bold",color:"#374151",
        textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>
        Trace the letters
      </div>
      <div style={{fontSize:9,color:"#9ca3af",marginBottom:2}}>uppercase</div>
      <TraceRow text={word.toUpperCase()} size={size} gap={2}/>
      <div style={{fontSize:9,color:"#9ca3af",margin:"5px 0 2px"}}>lowercase</div>
      <TraceRow text={word.toLowerCase()} size={size} gap={2}/>
      <div style={{fontSize:9,color:"#9ca3af",margin:"5px 0 2px"}}>now write</div>
      <RuledLine h={Math.round(size*1.4)}/>
    </div>
  );
}

// ── Daily Affirmations (365 entries, holiday-aware) ──
const AFFIRMATIONS: Record<string,{action:string,quote:string,ref:string}> = {
  "1-1":  { action: "Today is brand new — make it wonderful!", quote: "Behold, I make all things new.", ref: "Rev 21:5" },
  "1-2":  { action: "Say thank you to someone today.", quote: "In every thing give thanks.", ref: "1 Thess 5:18" },
  "1-3":  { action: "Take a deep breath and smile!", quote: "A merry heart doeth good like a medicine.", ref: "Prov 17:22" },
  "1-4":  { action: "Do one kind thing without being asked.", quote: "Let all that you do be done with love.", ref: "1 Cor 16:14" },
  "1-5":  { action: "Look outside — what do you notice today?", quote: "The earth is full of the goodness of the Lord.", ref: "Ps 33:5" },
  "1-6":  { action: "Help someone who needs it today!", quote: "Wise men followed a star to find the light.", ref: "Epiphany" },
  "1-7":  { action: "Be brave and try something new!", quote: "Courage is doing it even when you are afraid.", ref: "" },
  "1-8":  { action: "Give a big hug to someone you love.", quote: "Love one another as I have loved you.", ref: "John 15:12" },
  "1-9":  { action: "Notice something beautiful today.", quote: "The heavens declare the glory of God.", ref: "Ps 19:1" },
  "1-10": { action: "Share something with a friend!", quote: "It is more blessed to give than to receive.", ref: "Acts 20:35" },
  "1-11": { action: "Tell someone what you love about them.", quote: "Kind words are like honey — sweet to the soul.", ref: "Prov 16:24" },
  "1-12": { action: "Be patient today — good things take time.", quote: "They that wait upon the Lord shall renew their strength.", ref: "Isa 40:31" },
  "1-13": { action: "Sing a song today, even a silly one!", quote: "Make a joyful noise unto the Lord.", ref: "Ps 100:1" },
  "1-14": { action: "Happy Pongal! Thank the sun for its warmth today!", quote: "The sun rises and sets, faithful every day.", ref: "Pongal" },
  "1-15": { action: "Help set the table or clean up without being asked.", quote: "Sita served with grace and love in all things.", ref: "Ramayana" },
  "1-16": { action: "Draw a picture for someone you love.", quote: "Every good gift comes from above.", ref: "James 1:17" },
  "1-17": { action: "Walk slowly and notice everything around you.", quote: "The Lord is my shepherd — I shall not want.", ref: "Ps 23:1" },
  "1-18": { action: "Say sorry if you need to — it takes courage!", quote: "A soft answer turneth away wrath.", ref: "Prov 15:1" },
  "1-19": { action: "Be kind to everyone you meet today.", quote: "Love thy neighbor as thyself.", ref: "Mark 12:31" },
  "1-20": { action: "Do something that makes you laugh!", quote: "Joy is the simplest form of gratitude.", ref: "" },
  "1-21": { action: "Help a grown-up with something today.", quote: "Honor thy father and thy mother.", ref: "Exod 20:12" },
  "1-22": { action: "Find one thing to be grateful for right now.", quote: "Gratitude turns what we have into enough.", ref: "" },
  "1-23": { action: "Be a good listener today — really hear someone.", quote: "Let every man be swift to hear, slow to speak.", ref: "James 1:19" },
  "1-24": { action: "Wrap yourself in something cozy and feel thankful!", quote: "The Lord thy God is with thee whithersoever thou goest.", ref: "Josh 1:9" },
  "1-25": { action: "Tell someone you are proud of them!", quote: "Encourage one another and build each other up.", ref: "1 Thess 5:11" },
  "1-26": { action: "Try your hardest today — even at hard things.", quote: "I can do all things through Christ which strengtheneth me.", ref: "Phil 4:13" },
  "1-27": { action: "Make someone smile on purpose!", quote: "A cheerful heart is good medicine.", ref: "Prov 17:22" },
  "1-28": { action: "Be gentle with yourself today — you are learning!", quote: "Be kind to one another, tenderhearted.", ref: "Eph 4:32" },
  "1-29": { action: "Look at the sky — what shapes do the clouds make?", quote: "He who made the Pleiades and Orion made you too.", ref: "Amos 5:8" },
  "1-30": { action: "Do something helpful without being asked!", quote: "Hanuman served with his whole heart and nothing was impossible.", ref: "Ramayana" },
  "1-31": { action: "January is almost over — what was your favorite day?", quote: "This is the day the Lord hath made — rejoice!", ref: "Ps 118:24" },
  "2-1":  { action: "February is here! Show love every single day.", quote: "Love is patient, love is kind.", ref: "1 Cor 13:4" },
  "2-2":  { action: "Make a card for someone who needs cheering up.", quote: "Bear one another's burdens.", ref: "Gal 6:2" },
  "2-3":  { action: "Give a compliment to three people today!", quote: "Pleasant words are as a honeycomb.", ref: "Prov 16:24" },
  "2-4":  { action: "Tell your family one thing you love about them.", quote: "Above all, clothe yourselves with love.", ref: "Col 3:14" },
  "2-5":  { action: "Be someone's helper today!", quote: "Wherever you go, I will go.", ref: "Ruth 1:16" },
  "2-6":  { action: "Share your favorite snack with someone.", quote: "Give, and it shall be given unto you.", ref: "Luke 6:38" },
  "2-7":  { action: "Draw a heart and give it to someone you love.", quote: "Create in me a clean heart.", ref: "Ps 51:10" },
  "2-8":  { action: "Hug your favorite stuffed animal — you are loved!", quote: "I have loved thee with an everlasting love.", ref: "Jer 31:3" },
  "2-9":  { action: "Do something kind for a friend today.", quote: "Friendship is the highest form of love.", ref: "Gita 12:13" },
  "2-10": { action: "Say I love you to someone in your family!", quote: "There is no fear in love.", ref: "1 John 4:18" },
  "2-11": { action: "Be extra patient with your sibling today.", quote: "Love endureth all things.", ref: "1 Cor 13:7" },
  "2-12": { action: "Make up a silly love song and sing it!", quote: "Sing unto the Lord a new song.", ref: "Ps 96:1" },
  "2-13": { action: "Write your name in big letters — you are wonderful!", quote: "I praise you, for I am fearfully and wonderfully made.", ref: "Ps 139:14" },
  "2-14": { action: "Happy Valentine's Day! Spread love everywhere!", quote: "Beloved, let us love one another, for love is of God.", ref: "1 John 4:7" },
  "2-15": { action: "Love is not just for Valentine's Day — show it today too!", quote: "Love never fails.", ref: "1 Cor 13:8" },
  "2-16": { action: "Say a prayer for someone who is having a hard day.", quote: "Pray for one another.", ref: "James 5:16" },
  "2-17": { action: "Be kind to someone who is different from you.", quote: "There is neither Jew nor Greek — all are one.", ref: "Gal 3:28" },
  "2-18": { action: "Notice something beautiful about the world today.", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "2-19": { action: "Do a random act of kindness today!", quote: "Let your light shine before others.", ref: "Matt 5:16" },
  "2-20": { action: "Forgive someone — it feels better than being angry.", quote: "Forgive and you will be forgiven.", ref: "Luke 6:37" },
  "2-21": { action: "Tell someone you believe in them!", quote: "With God all things are possible.", ref: "Matt 19:26" },
  "2-22": { action: "Be honest today — even when it is hard.", quote: "The truth shall make you free.", ref: "John 8:32" },
  "2-23": { action: "Find something you can do to help your community.", quote: "Love thy neighbor as thyself.", ref: "Mark 12:31" },
  "2-24": { action: "Make something beautiful today!", quote: "Whatever you do, do it with all your heart.", ref: "Col 3:23" },
  "2-25": { action: "Count five things you are grateful for!", quote: "Give thanks to the Lord, for he is good.", ref: "Ps 107:1" },
  "2-26": { action: "Be a peacemaker today.", quote: "Blessed are the peacemakers.", ref: "Matt 5:9" },
  "2-27": { action: "Do your best — that is always enough!", quote: "Well done, good and faithful servant.", ref: "Matt 25:21" },
  "2-28": { action: "February is almost over — love every single day!", quote: "This is the day the Lord hath made — rejoice!", ref: "Ps 118:24" },
  "3-1":  { action: "Spring is almost here! Look for signs of new life.", quote: "The winter is past, the rains are over and gone.", ref: "Song 2:11" },
  "3-2":  { action: "Be a helper at home today.", quote: "Sita was devoted and filled her home with love.", ref: "Ramayana" },
  "3-3":  { action: "Happy Holi! Throw kindness like colors today!", quote: "Krishna danced and filled the world with joy.", ref: "Bhagavatam" },
  "3-4":  { action: "Use your brightest colors today!", quote: "Thou art clothed with honor and majesty.", ref: "Ps 104:1" },
  "3-5":  { action: "Be gentle with every living creature.", quote: "A righteous man cares for the needs of his animal.", ref: "Prov 12:10" },
  "3-6":  { action: "Sing your favorite song at the top of your lungs!", quote: "Make a joyful noise unto the Lord.", ref: "Ps 100:1" },
  "3-7":  { action: "Look for something tiny and amazing outside today.", quote: "Consider the lilies of the field — how they grow!", ref: "Matt 6:28" },
  "3-8":  { action: "Thank a woman in your life who loves you!", quote: "Her children rise up and call her blessed.", ref: "Prov 31:28" },
  "3-9":  { action: "Be patient — beautiful things take time.", quote: "They that wait upon the Lord shall renew their strength.", ref: "Isa 40:31" },
  "3-10": { action: "Splash in a puddle today if you can!", quote: "He sendeth springs into the valleys.", ref: "Ps 104:10" },
  "3-11": { action: "Help a friend with something hard.", quote: "Two are better than one.", ref: "Eccl 4:9" },
  "3-12": { action: "Make someone laugh today!", quote: "A merry heart doeth good like a medicine.", ref: "Prov 17:22" },
  "3-13": { action: "Try something you have never done before!", quote: "Be strong and courageous.", ref: "Josh 1:9" },
  "3-14": { action: "Find a flower or a bud — spring is waking up!", quote: "The flowers appear on the earth.", ref: "Song 2:12" },
  "3-15": { action: "Share a snack with someone today.", quote: "Give, and it shall be given unto you.", ref: "Luke 6:38" },
  "3-16": { action: "Do something quietly kind — do not tell anyone!", quote: "When thou doest alms, let not thy left hand know.", ref: "Matt 6:3" },
  "3-17": { action: "Happy St. Patrick's Day! Find something green!", quote: "The Lord is my shepherd, I shall not want.", ref: "Ps 23:1" },
  "3-18": { action: "Be brave and speak up for what is right.", quote: "Be strong and of a good courage.", ref: "Josh 1:6" },
  "3-19": { action: "Tell your family one thing you love about spring!", quote: "For lo, the winter is past.", ref: "Song 2:11" },
  "3-20": { action: "Happy First Day of Spring! Everything is new again!", quote: "If anyone is in Christ, he is a new creation.", ref: "2 Cor 5:17" },
  "3-21": { action: "Plant something or water a plant today.", quote: "I planted, Apollos watered, but God gave the growth.", ref: "1 Cor 3:6" },
  "3-22": { action: "Be someone's sunshine today!", quote: "Let your light shine before others.", ref: "Matt 5:16" },
  "3-23": { action: "Smell something beautiful — flowers, rain, fresh air!", quote: "For we are the aroma of Christ.", ref: "2 Cor 2:15" },
  "3-24": { action: "Tell someone three wonderful things about them!", quote: "Encourage one another daily.", ref: "Heb 3:13" },
  "3-25": { action: "Be gentle today with your words.", quote: "A gentle tongue is a tree of life.", ref: "Prov 15:4" },
  "3-26": { action: "Do a good deed and keep it secret!", quote: "Thy Father which seeth in secret shall reward thee.", ref: "Matt 6:4" },
  "3-27": { action: "Take a walk and say hello to nature!", quote: "The earth is the Lord's and the fullness thereof.", ref: "Ps 24:1" },
  "3-28": { action: "Make something beautiful out of what you have.", quote: "Whatever you do, do it heartily.", ref: "Col 3:23" },
  "3-29": { action: "Say a prayer for someone who needs help today.", quote: "Cast all your anxiety on him because he cares for you.", ref: "1 Pet 5:7" },
  "3-30": { action: "Count your blessings out loud!", quote: "Count your blessings — name them one by one.", ref: "Hymn" },
  "3-31": { action: "March is over — what made you happiest this month?", quote: "This is the day the Lord hath made — rejoice!", ref: "Ps 118:24" },
  "4-1":  { action: "April is here — something wonderful is coming!", quote: "Hope does not put us to shame.", ref: "Rom 5:5" },
  "4-2":  { action: "Be gentle and kind to everyone today.", quote: "Jesus washed his friends feet to show his love.", ref: "John 13:5" },
  "4-3":  { action: "Remember — love is stronger than anything.", quote: "Greater love hath no man than this.", ref: "John 15:13" },
  "4-4":  { action: "Look for new life everywhere today!", quote: "See, I am doing a new thing! Do you not perceive it?", ref: "Isa 43:19" },
  "4-5":  { action: "Happy Easter! He is risen — today is the most joyful day!", quote: "I am the resurrection and the life.", ref: "John 11:25" },
  "4-6":  { action: "Share your joy with someone today!", quote: "Rejoice in the Lord always — and again I say rejoice!", ref: "Phil 4:4" },
  "4-7":  { action: "Plant a seed today — real or in your heart!", quote: "Whatever a man soweth, that shall he also reap.", ref: "Gal 6:7" },
  "4-8":  { action: "Dance in the rain if you can today!", quote: "He sendeth rain on the just and on the unjust.", ref: "Matt 5:45" },
  "4-9":  { action: "Watch for a bird — they sing just for you!", quote: "Look at the birds of the air — your Father feeds them.", ref: "Matt 6:26" },
  "4-10": { action: "Be a butterfly today — spread beauty everywhere!", quote: "If any man be in Christ he is a new creature.", ref: "2 Cor 5:17" },
  "4-11": { action: "Do something that makes your heart happy!", quote: "Delight thyself in the Lord.", ref: "Ps 37:4" },
  "4-12": { action: "Help set the table for dinner tonight.", quote: "Serve one another humbly in love.", ref: "Gal 5:13" },
  "4-13": { action: "Be kind to the earth — pick up one piece of litter.", quote: "The Lord God put man in the garden to tend it.", ref: "Gen 2:15" },
  "4-14": { action: "Smile at every single person you see today!", quote: "A glad heart makes a cheerful face.", ref: "Prov 15:13" },
  "4-15": { action: "Jump in a puddle — spring is celebrating!", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "4-16": { action: "Tell someone how much they mean to you.", quote: "Love one another as I have loved you.", ref: "John 15:12" },
  "4-17": { action: "Look up at the sky — what do you see?", quote: "The heavens declare the glory of God.", ref: "Ps 19:1" },
  "4-18": { action: "Feed the ducks or birds if you can today!", quote: "He giveth food to all flesh.", ref: "Ps 136:25" },
  "4-19": { action: "Thank God for the beautiful earth today!", quote: "The earth is the Lord's and the fullness thereof.", ref: "Ps 24:1" },
  "4-20": { action: "Do your very best work today!", quote: "Whatever you do, work heartily.", ref: "Col 3:23" },
  "4-21": { action: "Be curious today — ask a big question!", quote: "Ask and it shall be given; seek and ye shall find.", ref: "Matt 7:7" },
  "4-22": { action: "Happy Earth Day! Take care of our beautiful planet!", quote: "The Lord God put man in the garden to tend it.", ref: "Gen 2:15" },
  "4-23": { action: "Bee kind today — busy and helpful!", quote: "How sweet are thy words — sweeter than honey.", ref: "Ps 119:103" },
  "4-24": { action: "Tell someone you are proud of them!", quote: "Rejoice with them that do rejoice.", ref: "Rom 12:15" },
  "4-25": { action: "Be patient — like a seed waiting to grow.", quote: "Be patient, brothers, until the coming of the Lord.", ref: "James 5:7" },
  "4-26": { action: "Build something with your hands today!", quote: "The Lord God formed the man from the dust of the ground.", ref: "Gen 2:7" },
  "4-27": { action: "Go outside and listen — what do you hear?", quote: "Be still and know that I am God.", ref: "Ps 46:10" },
  "4-28": { action: "Help a friend who is feeling sad.", quote: "Bear ye one another's burdens.", ref: "Gal 6:2" },
  "4-29": { action: "April showers bring May flowers — what are you growing?", quote: "In due season we shall reap, if we faint not.", ref: "Gal 6:9" },
  "4-30": { action: "April is ending — what beauty did it bring you?", quote: "This is the day the Lord hath made — rejoice!", ref: "Ps 118:24" },
  "5-1":  { action: "May is here! Do something wonderful today.", quote: "This is the day the Lord hath made — rejoice!", ref: "Ps 118:24" },
  "5-2":  { action: "Pick a flower or draw one for someone you love.", quote: "Consider the lilies — even Solomon was not arrayed like these.", ref: "Matt 6:29" },
  "5-3":  { action: "Feel the sunshine on your face and say thank you!", quote: "The Lord God is a sun and shield.", ref: "Ps 84:11" },
  "5-4":  { action: "Watch a mama bird with her babies — how does she love them?", quote: "As a mother comforts her child, so will I comfort you.", ref: "Isa 66:13" },
  "5-5":  { action: "Make a bouquet out of anything you find!", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "5-6":  { action: "Be a butterfly — bring beauty everywhere you go!", quote: "Let everything that has breath praise the Lord.", ref: "Ps 150:6" },
  "5-7":  { action: "Help in the garden if you can today.", quote: "I am the vine; you are the branches.", ref: "John 15:5" },
  "5-8":  { action: "Follow the bees — where do they go?", quote: "How sweet are thy words — sweeter than honey!", ref: "Ps 119:103" },
  "5-9":  { action: "Give your mama or grandma the biggest hug!", quote: "Her children arise and call her blessed.", ref: "Prov 31:28" },
  "5-10": { action: "Be as busy as a bee today — helpful and hardworking!", quote: "Whatever your hand finds to do, do it with all your might.", ref: "Eccl 9:10" },
  "5-11": { action: "Happy Mother's Day! Love your mama with your whole heart!", quote: "Honor thy father and thy mother.", ref: "Exod 20:12" },
  "5-12": { action: "Tell someone what you love most about them.", quote: "Kind words are like honey — sweet to the soul.", ref: "Prov 16:24" },
  "5-13": { action: "Count five things blooming or growing around you!", quote: "The earth brought forth grass and herb and tree.", ref: "Gen 1:12" },
  "5-14": { action: "Surprise someone with something kind today!", quote: "Every good gift and every perfect gift is from above.", ref: "James 1:17" },
  "5-15": { action: "Climb a tree or sit under one and think big thoughts!", quote: "He is like a tree planted by streams of water.", ref: "Ps 1:3" },
  "5-16": { action: "Be brave and try something that feels scary!", quote: "Have I not commanded you — be strong and courageous!", ref: "Josh 1:9" },
  "5-17": { action: "Be gentle with every creature you find today.", quote: "A righteous man cares for the needs of his animal.", ref: "Prov 12:10" },
  "5-18": { action: "Twirl in the sunshine — just because you can!", quote: "The joy of the Lord is your strength.", ref: "Neh 8:10" },
  "5-19": { action: "Do something to make your home more beautiful today.", quote: "Unless the Lord builds the house, the builders labor in vain.", ref: "Ps 127:1" },
  "5-20": { action: "Fly a kite or watch one — let your spirit soar!", quote: "They will soar on wings like eagles.", ref: "Isa 40:31" },
  "5-21": { action: "Be a caterpillar today — one day you will be a butterfly!", quote: "I am confident he who began a good work will complete it.", ref: "Phil 1:6" },
  "5-22": { action: "Lie in the grass and watch the clouds move.", quote: "Be still and know that I am God.", ref: "Ps 46:10" },
  "5-23": { action: "Move slowly today like a snail — notice everything!", quote: "Be still and know that I am God.", ref: "Ps 46:10" },
  "5-24": { action: "Jump like a frog — leap with joy!", quote: "Rejoice in the Lord always!", ref: "Phil 4:4" },
  "5-25": { action: "Watch something swim today.", quote: "He leadeth me beside the still waters.", ref: "Ps 23:2" },
  "5-26": { action: "Say thank you to a helper in your community today!", quote: "Let each of you look not only to his own interests.", ref: "Phil 2:4" },
  "5-27": { action: "Eat something red and sweet today!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "5-28": { action: "School is almost done — what did you learn this year?", quote: "The beginning of wisdom is this — get wisdom!", ref: "Prov 4:7" },
  "5-29": { action: "Draw a picture of your favorite thing about school.", quote: "A wise son makes a glad father.", ref: "Prov 10:1" },
  "5-30": { action: "Summer is almost here — what are you most excited for?", quote: "Hope deferred makes the heart sick, but desire fulfilled is a tree of life.", ref: "Prov 13:12" },
  "5-31": { action: "Chase a dragonfly today — they are magical!", quote: "The Lord hath made every thing for his purpose.", ref: "Prov 16:4" },
  "6-1":  { action: "Summer is here! Run outside and celebrate!", quote: "This is the day the Lord hath made — rejoice!", ref: "Ps 118:24" },
  "6-2":  { action: "Make a wave — in the water or just with your hand!", quote: "He stilled the storm to a whisper.", ref: "Ps 107:29" },
  "6-3":  { action: "Collect something beautiful from the ground today.", quote: "The earth is full of thy riches.", ref: "Ps 104:24" },
  "6-4":  { action: "Choose joy today — even when it is hard!", quote: "Rejoice evermore.", ref: "1 Thess 5:16" },
  "6-5":  { action: "Watch a fish — be calm and quiet like the sea.", quote: "He maketh the storm a calm, so that the waves are still.", ref: "Ps 107:29" },
  "6-6":  { action: "Feel the sun on your skin and say thank you!", quote: "The Lord God is a sun and shield.", ref: "Ps 84:11" },
  "6-7":  { action: "Find a starfish shape today — in sand, clouds, or stars!", quote: "He telleth the number of the stars.", ref: "Ps 147:4" },
  "6-8":  { action: "Swim or splash in water if you can — be free!", quote: "He leadeth me beside the still waters.", ref: "Ps 23:2" },
  "6-9":  { action: "Wear your most colorful outfit today!", quote: "Thou art clothed with honor and majesty.", ref: "Ps 104:1" },
  "6-10": { action: "Dance with your whole body today!", quote: "Let them praise his name with dancing.", ref: "Ps 149:3" },
  "6-11": { action: "Smell something sweet today — flowers or fresh air!", quote: "For we are the aroma of Christ.", ref: "2 Cor 2:15" },
  "6-12": { action: "Find a rainbow after the rain today!", quote: "I have set my rainbow in the clouds.", ref: "Gen 9:13" },
  "6-13": { action: "Climb something tall and look out — the world is beautiful!", quote: "The heavens declare the glory of God.", ref: "Ps 19:1" },
  "6-14": { action: "Eat something cold and sweet — you earned it!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "6-15": { action: "Happy Father's Day! Give your daddy the biggest hug!", quote: "Honor thy father and thy mother.", ref: "Exod 20:12" },
  "6-16": { action: "Watch a dolphin video — they leap for pure joy!", quote: "Let everything that has breath praise the Lord.", ref: "Ps 150:6" },
  "6-17": { action: "Watch the sunset tonight — count all the colors!", quote: "From the rising of the sun to its setting, the Lord's name is praised.", ref: "Ps 113:3" },
  "6-18": { action: "Lie on your back and find shapes in the clouds.", quote: "He spreadeth his clouds.", ref: "Job 37:11" },
  "6-19": { action: "Happy Juneteenth! Everyone deserves to be free and loved!", quote: "Proclaim liberty throughout the land.", ref: "Lev 25:10" },
  "6-20": { action: "How big is the ocean — how big is God!", quote: "There is the sea, vast and spacious, teeming with creatures.", ref: "Ps 104:25" },
  "6-21": { action: "Eat something tropical and sweet today!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "6-22": { action: "Let something sweet melt on your tongue — summer!", quote: "How sweet are thy words unto my taste!", ref: "Ps 119:103" },
  "6-23": { action: "Look under a rock today — a whole world lives there!", quote: "The earth is full of thy riches.", ref: "Ps 104:24" },
  "6-24": { action: "Pick a bright flower and give it to someone!", quote: "Consider the lilies — how they grow!", ref: "Matt 6:28" },
  "6-25": { action: "Find a roly-poly and watch it move!", quote: "How many are your works, Lord! In wisdom you made them all.", ref: "Ps 104:24" },
  "6-26": { action: "Build a sandcastle or a tower today!", quote: "A wise man builds his house upon the rock.", ref: "Matt 7:24" },
  "6-27": { action: "Watch the birds — be free like them today!", quote: "Look at the birds of the air — your Father feeds them.", ref: "Matt 6:26" },
  "6-28": { action: "Be an anchor today — steady and strong for someone.", quote: "We have this hope as an anchor for the soul.", ref: "Heb 6:19" },
  "6-29": { action: "Notice a fish today — how does it move in the water?", quote: "God created the great creatures of the sea.", ref: "Gen 1:21" },
  "6-30": { action: "Say hello and goodbye with love to everyone today!", quote: "The Lord bless you and keep you.", ref: "Num 6:24" },
  "7-1":  { action: "July is here! Be as bright as fireworks today!", quote: "Arise, shine, for your light has come!", ref: "Isa 60:1" },
  "7-2":  { action: "Wave something bright and say you are proud!", quote: "Let your light shine before others.", ref: "Matt 5:16" },
  "7-3":  { action: "Fizz and sparkle today like a sparkler!", quote: "The joy of the Lord is your strength.", ref: "Neh 8:10" },
  "7-4":  { action: "Happy 4th of July! Be thankful for freedom today!", quote: "Proclaim liberty throughout the land.", ref: "Lev 25:10" },
  "7-5":  { action: "Soar like an eagle — you are brave and free!", quote: "They will soar on wings like eagles.", ref: "Isa 40:31" },
  "7-6":  { action: "Cheer for something — be in the parade of life!", quote: "Rejoice in the Lord always!", ref: "Phil 4:4" },
  "7-7":  { action: "Eat a slice of watermelon today — savor every bite!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "7-8":  { action: "Feel the sand between your toes — or imagine it!", quote: "He makes me lie down in green pastures.", ref: "Ps 23:2" },
  "7-9":  { action: "Feel the sunshine and say — I am glad to be alive!", quote: "The Lord God is a sun and shield.", ref: "Ps 84:11" },
  "7-10": { action: "Make a big splash today!", quote: "Let justice roll on like a river.", ref: "Amos 5:24" },
  "7-11": { action: "Find a colorful bug and admire its colors!", quote: "How many are your works, Lord! In wisdom you made them all.", ref: "Ps 104:24" },
  "7-12": { action: "Float on your back — rest and let God hold you!", quote: "He grants sleep to those he loves.", ref: "Ps 127:2" },
  "7-13": { action: "Jump and leap like a dolphin today!", quote: "Rejoice and be exceeding glad!", ref: "Matt 5:12" },
  "7-14": { action: "Collect the most beautiful shell or stone you can find!", quote: "The earth is full of thy riches.", ref: "Ps 104:24" },
  "7-15": { action: "Walk sideways like a crab — and laugh at yourself!", quote: "A merry heart doeth good like a medicine.", ref: "Prov 17:22" },
  "7-16": { action: "Lick an ice cream cone very slowly — savor it!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "7-17": { action: "Build something with your hands today!", quote: "The Lord God formed man of the dust of the ground.", ref: "Gen 2:7" },
  "7-18": { action: "Make a flower crown or a crown of leaves!", quote: "Thou crownest the year with thy goodness.", ref: "Ps 65:11" },
  "7-19": { action: "Watch the sunset — count every color in the sky!", quote: "From the rising of the sun to its setting, the Lord's name is to be praised.", ref: "Ps 113:3" },
  "7-20": { action: "Build the biggest sandcastle you can imagine!", quote: "A wise man builds his house upon the rock.", ref: "Matt 7:24" },
  "7-21": { action: "Chase a butterfly today — it is leading you to beauty!", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "7-22": { action: "Water something that is growing!", quote: "I planted, Apollos watered, but God gave the growth.", ref: "1 Cor 3:6" },
  "7-23": { action: "Face the sun like a sunflower — always look for the light!", quote: "Arise, shine, for your light has come!", ref: "Isa 60:1" },
  "7-24": { action: "Eat corn on the cob — feel grateful for farmers!", quote: "The earth brought forth grass and herb and tree bearing fruit.", ref: "Gen 1:12" },
  "7-25": { action: "Pick berries or eat something that grew from the earth!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "7-26": { action: "Share a cup of lemonade with someone!", quote: "Give, and it shall be given unto you.", ref: "Luke 6:38" },
  "7-27": { action: "Fly a kite — let your spirit soar high!", quote: "They will soar on wings like eagles.", ref: "Isa 40:31" },
  "7-28": { action: "Lie in the grass and find pictures in the clouds.", quote: "He spreadeth his clouds.", ref: "Job 37:11" },
  "7-29": { action: "Float a leaf on water and watch it travel.", quote: "He leadeth me beside the still waters.", ref: "Ps 23:2" },
  "7-30": { action: "Catch fireflies or look for stars — light in the dark!", quote: "Thy word is a lamp unto my feet and a light unto my path.", ref: "Ps 119:105" },
  "7-31": { action: "July is almost done — name your favorite memory!", quote: "I will remember the works of the Lord.", ref: "Ps 77:11" },
  "8-1":  { action: "Pack your backpack with excitement — adventures ahead!", quote: "For I know the plans I have for you — plans to prosper you.", ref: "Jer 29:11" },
  "8-2":  { action: "Sharpen your pencil and get ready to learn!", quote: "The beginning of wisdom is this — get wisdom!", ref: "Prov 4:7" },
  "8-3":  { action: "Open a book and go on an adventure!", quote: "Thy word is a lamp unto my feet.", ref: "Ps 119:105" },
  "8-4":  { action: "Bring kindness to everyone who helps you learn!", quote: "A wise son makes a glad father.", ref: "Prov 10:1" },
  "8-5":  { action: "Learn something new today — your brain loves it!", quote: "Get wisdom, and with all thy getting get understanding.", ref: "Prov 4:7" },
  "8-6":  { action: "Start the day with a big smile!", quote: "This is the day the Lord hath made — rejoice!", ref: "Ps 118:24" },
  "8-7":  { action: "Use your brightest crayons today — color the world!", quote: "Thou art clothed with honor and majesty.", ref: "Ps 104:1" },
  "8-8":  { action: "Measure something today — how tall are you?", quote: "Which of you by taking thought can add one cubit to his stature?", ref: "Matt 6:27" },
  "8-9":  { action: "Soak up the sun before summer ends!", quote: "The Lord God is a sun and shield.", ref: "Ps 84:11" },
  "8-10": { action: "Face the sun like a sunflower — always seek the light!", quote: "Arise, shine — for your light has come!", ref: "Isa 60:1" },
  "8-11": { action: "Eat something golden today — corn, peaches, honey!", quote: "How sweet are thy words — sweeter than honey!", ref: "Ps 119:103" },
  "8-12": { action: "You are changing and growing — like a butterfly!", quote: "I am confident he who began a good work will complete it.", ref: "Phil 1:6" },
  "8-13": { action: "Watch a dragonfly — they have been flying since dinosaurs!", quote: "How many are your works, Lord!", ref: "Ps 104:24" },
  "8-14": { action: "Water every growing thing you can find!", quote: "He sendeth springs into the valleys.", ref: "Ps 104:10" },
  "8-15": { action: "Watch a fish and be calm — just breathe.", quote: "Be still and know that I am God.", ref: "Ps 46:10" },
  "8-16": { action: "Jump in a puddle — summer is still here!", quote: "Rejoice and be exceeding glad!", ref: "Matt 5:12" },
  "8-17": { action: "Eat a slice of watermelon — summer's sweetest gift!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "8-18": { action: "Pick something blue and beautiful today!", quote: "The earth is full of thy riches.", ref: "Ps 104:24" },
  "8-19": { action: "Smell a peach — autumn is whispering hello!", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "8-20": { action: "Notice the days getting shorter — autumn is coming!", quote: "To everything there is a season.", ref: "Eccl 3:1" },
  "8-21": { action: "Find the first yellow leaf of the year!", quote: "To everything there is a season, and a time for every purpose.", ref: "Eccl 3:1" },
  "8-22": { action: "Collect an acorn — hold the whole forest in your hand!", quote: "Faith as small as a mustard seed can move mountains.", ref: "Matt 17:20" },
  "8-23": { action: "Look for a spiderweb — it is the most amazing building!", quote: "How many are your works, Lord! In wisdom you made them all.", ref: "Ps 104:24" },
  "8-24": { action: "Find a bee and follow it — they are hardworking and wise!", quote: "How sweet are thy words — sweeter than honey!", ref: "Ps 119:103" },
  "8-25": { action: "Find a grasshopper — they leap with joy!", quote: "Rejoice in the Lord always!", ref: "Phil 4:4" },
  "8-26": { action: "Create something with scissors and paper today!", quote: "Whatever your hand finds to do, do it with all your might.", ref: "Eccl 9:10" },
  "8-27": { action: "Make something stick today — a friendship, a smile!", quote: "There is a friend who sticks closer than a brother.", ref: "Prov 18:24" },
  "8-28": { action: "Fill your notebook with one great idea!", quote: "Write the vision and make it plain.", ref: "Hab 2:2" },
  "8-29": { action: "Make a new friend — or be extra kind to an old one!", quote: "A man that hath friends must show himself friendly.", ref: "Prov 18:24" },
  "8-30": { action: "Summer is ending — give it one last big hug!", quote: "To everything there is a season.", ref: "Eccl 3:1" },
  "8-31": { action: "August is done — what wonderful thing will September bring?", quote: "For I know the plans I have for you.", ref: "Jer 29:11" },
  "9-1":  { action: "The leaves are changing — so are you! Growing every day.", quote: "To everything there is a season.", ref: "Eccl 3:1" },
  "9-2":  { action: "Collect the most beautiful leaf you can find!", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "9-3":  { action: "Eat a crunchy apple today — autumn is here!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "9-4":  { action: "Go to school with a brave and happy heart!", quote: "Be strong and courageous — do not be afraid.", ref: "Josh 1:9" },
  "9-5":  { action: "Smile at someone new today!", quote: "A man that hath friends must show himself friendly.", ref: "Prov 18:24" },
  "9-6":  { action: "Write neatly today — letters are a gift you give your reader!", quote: "Write the vision and make it plain.", ref: "Hab 2:2" },
  "9-7":  { action: "Watch a squirrel — they prepare with great wisdom!", quote: "Go to the ant, thou sluggard — consider her ways and be wise!", ref: "Prov 6:6" },
  "9-8":  { action: "Find a mushroom — what a magical little house!", quote: "The earth is full of thy riches.", ref: "Ps 104:24" },
  "9-9":  { action: "Eat something green today — it grows for you!", quote: "He causeth the grass to grow.", ref: "Ps 104:14" },
  "9-10": { action: "Fill a basket with beautiful things you find outside!", quote: "Thou crownest the year with thy goodness.", ref: "Ps 65:11" },
  "9-11": { action: "Thank someone who keeps you safe today.", quote: "He shall give his angels charge over thee.", ref: "Ps 91:11" },
  "9-12": { action: "Find a spider web and marvel at its beauty!", quote: "How many are your works, Lord! In wisdom you made them all.", ref: "Ps 104:24" },
  "9-13": { action: "Listen carefully today — wisdom is all around you!", quote: "The Lord gives wisdom — out of his mouth come knowledge and understanding.", ref: "Prov 2:6" },
  "9-14": { action: "Happy Ganesha Chaturthi! Remove all obstacles with wisdom and love!", quote: "Get wisdom — and with all your getting, get understanding.", ref: "Prov 4:7" },
  "9-15": { action: "Jump in a pile of leaves — or imagine one!", quote: "Rejoice and be exceeding glad!", ref: "Matt 5:12" },
  "9-16": { action: "Count how many colors the trees are turning!", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "9-17": { action: "Eat something purple today — grapes, plums, cabbage!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "9-18": { action: "Walk in the fog and imagine you are in a cloud!", quote: "He spreadeth his clouds.", ref: "Job 37:11" },
  "9-19": { action: "Walk quietly in the woods — what do you hear?", quote: "Be still and know that I am God.", ref: "Ps 46:10" },
  "9-20": { action: "Pick berries or look for the last fruits of summer!", quote: "The earth brought forth grass and herb and tree bearing fruit.", ref: "Gen 1:12" },
  "9-21": { action: "At dusk, look at the moon rising — it is enormous!", quote: "He made the moon to mark the seasons.", ref: "Ps 104:19" },
  "9-22": { action: "Climb on a pile of leaves and shout for joy!", quote: "Make a joyful noise unto the Lord!", ref: "Ps 100:1" },
  "9-23": { action: "Find a bright red leaf and press it in a book!", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "9-24": { action: "Hold an acorn — inside is a whole oak tree! You contain greatness too!", quote: "I praise you, for I am fearfully and wonderfully made.", ref: "Ps 139:14" },
  "9-25": { action: "Find a funny-shaped gourd and give it a name!", quote: "A merry heart doeth good like a medicine.", ref: "Prov 17:22" },
  "9-26": { action: "Fill a basket with good things and give some away!", quote: "Give, and it shall be given unto you.", ref: "Luke 6:38" },
  "9-27": { action: "Stand tall today — you are brave and strong!", quote: "Be strong and courageous.", ref: "Josh 1:9" },
  "9-28": { action: "Look for the harvest moon tonight — it is enormous!", quote: "He made the moon to mark the seasons.", ref: "Ps 104:19" },
  "9-29": { action: "Make someone laugh today — then be kind!", quote: "A merry heart doeth good like a medicine.", ref: "Prov 17:22" },
  "9-30": { action: "September is over — what are you most grateful for?", quote: "In every thing give thanks.", ref: "1 Thess 5:18" },
  "10-1":  { action: "October! The whole world is turning golden!", quote: "Thou crownest the year with thy goodness.", ref: "Ps 65:11" },
  "10-2":  { action: "Jump in every leaf pile you find today!", quote: "Rejoice and be exceeding glad!", ref: "Matt 5:12" },
  "10-3":  { action: "Eat a caramel apple or something sweet and autumny!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "10-4":  { action: "Be kind to an animal today — all creatures are beloved!", quote: "A righteous man cares for the needs of his animal.", ref: "Prov 12:10" },
  "10-5":  { action: "Collect the most colorful leaves you can find!", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "10-6":  { action: "Bake something or help in the kitchen today!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "10-7":  { action: "Sit by a fire or imagine one — feel warm and cozy!", quote: "The Lord thy God is with thee whithersoever thou goest.", ref: "Josh 1:9" },
  "10-8":  { action: "Pick out your favorite pumpkin today!", quote: "The earth brought forth grass and herb and fruit.", ref: "Gen 1:12" },
  "10-9":  { action: "Crunch through leaves — autumn is singing under your feet!", quote: "Make a joyful noise unto the Lord!", ref: "Ps 100:1" },
  "10-10": { action: "Watch the sky at dusk — the colors are magical!", quote: "From the rising of the sun unto the going down of the same.", ref: "Ps 113:3" },
  "10-11": { action: "Wear your coziest sweater today!", quote: "The Lord thy God is with thee whithersoever thou goest.", ref: "Josh 1:9" },
  "10-12": { action: "Make something with fallen leaves — art from nature!", quote: "Whatever your hands find to do, do it with all your might.", ref: "Eccl 9:10" },
  "10-13": { action: "Explore something new — be a brave adventurer!", quote: "Ask and it shall be given — seek and ye shall find.", ref: "Matt 7:7" },
  "10-14": { action: "Find a pinecone — inside are a hundred trees!", quote: "Faith as small as a mustard seed can move mountains.", ref: "Matt 17:20" },
  "10-15": { action: "Carve a smile on a pumpkin — spread joy!", quote: "A glad heart makes a cheerful face.", ref: "Prov 15:13" },
  "10-16": { action: "Feel the crisp air — autumn is a gift!", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "10-17": { action: "Make apple cider or apple juice — taste autumn!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "10-18": { action: "Rake leaves into a giant pile — then leap!", quote: "Rejoice in the Lord always!", ref: "Phil 4:4" },
  "10-19": { action: "Find the most perfect maple leaf and press it flat.", quote: "He hath made every thing beautiful in his time.", ref: "Eccl 3:11" },
  "10-20": { action: "Count how many different colors you can spot outside!", quote: "He clotheth himself with light as with a garment.", ref: "Ps 104:2" },
  "10-21": { action: "Happy Dussehra! Goodness always wins over darkness — be the light!", quote: "Rama's righteousness shone like the sun and nothing could defeat it.", ref: "Ramayana" },
  "10-22": { action: "Be brave today — like Rama who never gave up!", quote: "Be strong and courageous — do not be afraid.", ref: "Josh 1:9" },
  "10-23": { action: "Light a candle or a diya and watch the darkness disappear!", quote: "Thy word is a lamp unto my feet and a light unto my path.", ref: "Ps 119:105" },
  "10-24": { action: "Make a colorful pattern with chalk or crayons!", quote: "Whatever you do, do it with all your heart.", ref: "Col 3:23" },
  "10-25": { action: "Carve a funny face — laughter is a light in the dark!", quote: "A merry heart doeth good like a medicine.", ref: "Prov 17:22" },
  "10-26": { action: "Wear your favorite cozy color today!", quote: "Get wisdom — and with all your getting get understanding.", ref: "Prov 4:7" },
  "10-27": { action: "Eat candy corn and count — every color is different!", quote: "How many are your works, Lord!", ref: "Ps 104:24" },
  "10-28": { action: "Make a friendly ghost — not all scary things are scary!", quote: "Fear thou not, for I am with thee.", ref: "Isa 41:10" },
  "10-29": { action: "Crunch through the last of the autumn leaves!", quote: "To everything there is a season.", ref: "Eccl 3:1" },
  "10-30": { action: "Tonight, the stars are extra bright — look up!", quote: "He telleth the number of the stars.", ref: "Ps 147:4" },
  "10-31": { action: "Happy Halloween! Be kind to every neighbor tonight!", quote: "Love thy neighbor as thyself.", ref: "Mark 12:31" },
  "11-1":  { action: "Happy All Saints Day! We are surrounded by love!", quote: "Therefore we are surrounded by a great cloud of witnesses.", ref: "Heb 12:1" },
  "11-2":  { action: "Say thank you for something small today.", quote: "In every thing give thanks.", ref: "1 Thess 5:18" },
  "11-3":  { action: "Find one golden thing today — a leaf, a flower, sunlight!", quote: "Every good and perfect gift is from above.", ref: "James 1:17" },
  "11-4":  { action: "Name five things you are thankful for right now!", quote: "Give thanks to the Lord, for he is good.", ref: "Ps 107:1" },
  "11-5":  { action: "Collect acorns like a squirrel — prepare with wisdom!", quote: "Go to the ant, thou sluggard — consider her ways and be wise.", ref: "Prov 6:6" },
  "11-6":  { action: "Smell cinnamon today — it is the smell of thankfulness!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "11-7":  { action: "Eat something golden and warm today!", quote: "How sweet are thy words — sweeter than honey!", ref: "Ps 119:103" },
  "11-8":  { action: "Happy Diwali! Light a diya — you are a light in this world!", quote: "You are the light of the world — a city on a hill cannot be hidden.", ref: "Matt 5:14" },
  "11-9":  { action: "The Festival of Lights is here — spread light everywhere!", quote: "Lakshmi brings prosperity, love, and light wherever she goes.", ref: "Diwali" },
  "11-10": { action: "Light a candle today and make a wish for someone you love.", quote: "Thy word is a lamp unto my feet.", ref: "Ps 119:105" },
  "11-11": { action: "Happy Veterans Day! Thank someone who keeps us safe!", quote: "Greater love hath no man than this — to lay down his life.", ref: "John 15:13" },
  "11-12": { action: "Watch the bare trees — they are resting and will bloom again!", quote: "To everything there is a season.", ref: "Eccl 3:1" },
  "11-13": { action: "Make a pie or help bake something sweet!", quote: "Taste and see that the Lord is good.", ref: "Ps 34:8" },
  "11-14": { action: "Gather nuts like a squirrel — be wise and prepared!", quote: "A prudent man foresees danger and takes precautions.", ref: "Prov 22:3" },
  "11-15": { action: "Hug your family extra tight today!", quote: "Behold how good and how pleasant it is for family to dwell in unity!", ref: "Ps 133:1" },
  "11-16": { action: "Find a pinecone and put it somewhere beautiful.", quote: "The earth is full of thy riches.", ref: "Ps 104:24" },
  "11-17": { action: "Smell fresh bread baking — it is the smell of home!", quote: "I am the bread of life.", ref: "John 6:35" },
  "11-18": { action: "Give someone the biggest hug they have ever had!", quote: "Love one another as I have loved you.", ref: "John 15:12" },
  "11-19": { action: "Do something kind for a neighbor today!", quote: "Love thy neighbor as thyself.", ref: "Mark 12:31" },
  "11-20": { action: "Set the table beautifully for your family tonight!", quote: "Thou preparest a table before me.", ref: "Ps 23:5" },
  "11-21": { action: "Wear a silly hat and make someone laugh!", quote: "A merry heart doeth good like a medicine.", ref: "Prov 17:22" },
  "11-22": { action: "Fill your plate with gratitude as much as food!", quote: "Thou preparest a table before me.", ref: "Ps 23:5" },
  "11-23": { action: "Thank someone who made a long journey for you.", quote: "Blessed is she who believed that what was spoken would be fulfilled.", ref: "Luke 1:45" },
  "11-24": { action: "Honor those who came before us and share their stories.", quote: "Remember the days of old — consider the years of many generations.", ref: "Deut 32:7" },
  "11-25": { action: "Walk through autumn leaves and say thank you with every step!", quote: "Give thanks to the Lord, for he is good.", ref: "Ps 107:1" },
  "11-26": { action: "Happy Thanksgiving! Count your blessings — all of them!", quote: "Every good gift and every perfect gift is from above.", ref: "James 1:17" },
  "11-27": { action: "Share your leftovers or kindness with someone who needs them!", quote: "Give, and it shall be given unto you.", ref: "Luke 6:38" },
  "11-28": { action: "Walk in the bare forest — rest is beautiful too.", quote: "He makes me lie down in green pastures — he restores my soul.", ref: "Ps 23:2" },
  "11-29": { action: "Advent begins! Light the first candle — waiting is holy!", quote: "Hope deferred makes the heart sick, but desire fulfilled is a tree of life.", ref: "Prov 13:12" },
  "11-30": { action: "November is ending — what are you most grateful for?", quote: "In every thing give thanks.", ref: "1 Thess 5:18" },
  "12-1":  { action: "Advent! One candle lit — the light is coming!", quote: "The people walking in darkness have seen a great light.", ref: "Isa 9:2" },
  "12-2":  { action: "Make a paper snowflake — every one is unique, just like you!", quote: "I praise you, for I am fearfully and wonderfully made.", ref: "Ps 139:14" },
  "12-3":  { action: "Give something away today — it feels better than keeping!", quote: "It is more blessed to give than to receive.", ref: "Acts 20:35" },
  "12-4":  { action: "Light a candle at dinner and eat by its warm glow.", quote: "Thy word is a lamp unto my feet.", ref: "Ps 119:105" },
  "12-5":  { action: "Write a letter to someone who is far away!", quote: "Write the vision and make it plain.", ref: "Hab 2:2" },
  "12-6":  { action: "Leave a small gift for someone who least expects it!", quote: "Every good and perfect gift is from above.", ref: "James 1:17" },
  "12-7":  { action: "Sing a Christmas carol — even if you only know the first line!", quote: "Let everything that has breath praise the Lord.", ref: "Ps 150:6" },
  "12-8":  { action: "Make cookies for someone who needs cheering up!", quote: "How sweet are thy words!", ref: "Ps 119:103" },
  "12-9":  { action: "Look at the stars tonight — the same ones the wise men followed!", quote: "A star shall come out of Jacob.", ref: "Num 24:17" },
  "12-10": { action: "Draw a picture of your family and give it as a gift!", quote: "Behold how good and pleasant it is for family to dwell together!", ref: "Ps 133:1" },
  "12-11": { action: "Make a card for someone who is lonely this Christmas.", quote: "Love thy neighbor as thyself.", ref: "Mark 12:31" },
  "12-12": { action: "Count the ornaments on your tree — every one is a memory!", quote: "He telleth the number of the stars.", ref: "Ps 147:4" },
  "12-13": { action: "Unwrap the greatest gift — today is given to you!", quote: "This is the day the Lord hath made — rejoice!", ref: "Ps 118:24" },
  "12-14": { action: "Wrap a gift with great love — it matters more than the ribbon!", quote: "Above all, clothe yourselves with love.", ref: "Col 3:14" },
  "12-15": { action: "Eat a candy cane and remember the sweetness of the season!", quote: "For unto us a child is born, unto us a son is given.", ref: "Isa 9:6" },
  "12-16": { action: "Fly a paper dove — peace to everyone today!", quote: "Peace on earth, goodwill toward men.", ref: "Luke 2:14" },
  "12-17": { action: "Watch the sheep in a nativity — they were the first to hear!", quote: "The shepherds said — let us go to Bethlehem!", ref: "Luke 2:15" },
  "12-18": { action: "Bake Christmas cookies with someone you love!", quote: "A merry heart doeth good like a medicine.", ref: "Prov 17:22" },
  "12-19": { action: "Follow a star tonight — even the wise men needed guidance!", quote: "We saw his star in the east and have come to worship him.", ref: "Matt 2:2" },
  "12-20": { action: "Pack your sleigh with kindness and deliver it!", quote: "Give, and it shall be given unto you.", ref: "Luke 6:38" },
  "12-21": { action: "Three gifts — what would you give to the baby Jesus?", quote: "They presented unto him gifts — gold, frankincense, and myrrh.", ref: "Matt 2:11" },
  "12-22": { action: "Make a wreath of holly — and hang it with love!", quote: "The joy of the Lord is your strength.", ref: "Neh 8:10" },
  "12-23": { action: "Tomorrow Jesus is born — are you ready to celebrate?", quote: "Unto us a child is born, unto us a son is given!", ref: "Isa 9:6" },
  "12-24": { action: "Christmas Eve! Look for one star brighter than the rest!", quote: "Tonight the Savior is born — Christ the Lord!", ref: "Luke 2:11" },
  "12-25": { action: "Merry Christmas! The greatest gift in the world is here!", quote: "For God so loved the world that he gave his only Son.", ref: "John 3:16" },
  "12-26": { action: "Share your Christmas joy with someone today.", quote: "It is more blessed to give than to receive.", ref: "Acts 20:35" },
  "12-27": { action: "Build a snowy village or draw one — peace on earth!", quote: "Peace I leave with you — my peace I give unto you.", ref: "John 14:27" },
  "12-28": { action: "End the year with fireworks in your heart!", quote: "Arise, shine — for your light has come!", ref: "Isa 60:1" },
  "12-29": { action: "The year is almost done — what story will you tell about it?", quote: "I will remember the works of the Lord.", ref: "Ps 77:11" },
  "12-30": { action: "Say thank you for every single day of this year!", quote: "In every thing give thanks.", ref: "1 Thess 5:18" },
  "12-31": { action: "Happy New Year's Eve! A whole new year of wonders awaits!", quote: "Behold, I make all things new.", ref: "Rev 21:5" },
};

function getDailyAffirmation(month: string, day: number) {
  const monthIdx: Record<string,number> = { January:1, February:2, March:3, April:4, May:5, June:6,
    July:7, August:8, September:9, October:10, November:11, December:12 };
  const key = `${monthIdx[month]}-${Number(day)}`;
  return AFFIRMATIONS[key] || { action: "Be kind and brave today!", quote: "This is the day the Lord hath made — rejoice!", ref: "Ps 118:24" };
}





// ═══════════════════════════════════════════════════════
// SINGLE DAY PAGE COMPONENT (reusable)
// ═══════════════════════════════════════════════════════
function DayPage({ day, month, year, childName, religion, age, id }: {
  day: number; month: string; year: number; childName: string;
  religion: string; age: number; id?: string;
}) {
  const affirmation = getDailyAffirmation(month, day);
  const { firstDay, daysInMonth } = getMiniCalendar(month, year);
  const realMonthIdx: Record<string,number> = { January:0, February:1, March:2, April:3, May:4,
    June:5, July:6, August:7, September:8, October:9, November:10, December:11 };
  const mIdx        = realMonthIdx[month] ?? 0;
  const date        = new Date(year, mIdx, day);
  const dateDisplay = `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[mIdx]} ${day}`;
  const holiday     = getHolidayMessage(mIdx, day, religion);
  const lineH       = age<=4 ? 48 : 40;

  const calendarCells: (number|null)[] = [];
  for (let i=0;i<firstDay;i++) calendarCells.push(null);
  for (let d=1;d<=daysInMonth;d++) calendarCells.push(d);

  return (
    <div id={id} style={{width:"100%",background:"white",borderRadius:4,overflow:"hidden",fontFamily:"Georgia,serif"}}>
      {/* Header */}
      <div style={{padding:"12px 20px 10px",borderBottom:"2px solid #1f2937",textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:"bold",color:"#1f2937",letterSpacing:0.3}}>
          Good Morning, {childName||"Friend"}!
        </div>
      </div>
      {/* Name / Date | Calendar */}
      <div style={{padding:"10px 18px 12px",borderBottom:"1.5px solid #d1d5db",display:"flex",alignItems:"stretch",gap:14}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:8,justifyContent:"center"}}>
          <div>
            <div style={{fontSize:12,fontWeight:"bold",color:"#374151",marginBottom:4}}>Name</div>
            <RuledLine h={lineH}/>
          </div>
          <div style={{border:"1.5px solid #d1d5db",borderRadius:6,padding:"6px 10px"}}>
            <div style={{fontSize:14,fontWeight:"bold",color:"#1f2937",marginBottom:holiday?4:0}}>{dateDisplay}</div>
            {holiday&&<div style={{fontSize:11,color:"#374151",fontStyle:"italic",lineHeight:1.5}}>{holiday.sentence}</div>}
          </div>
        </div>
        <div style={{flexShrink:0,display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{fontSize:10,fontWeight:"bold",color:"#374151",textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Circle today →</div>
          <div style={{border:"1.5px solid #d1d5db",borderRadius:6,overflow:"hidden",width:204}}>
            <div style={{background:"#f3f4f6",textAlign:"center",padding:"3px 0",fontSize:10,fontWeight:"bold",color:"#374151",borderBottom:"1px solid #d1d5db"}}>{month} {year}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
              {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:8,fontWeight:"bold",color:"#9ca3af",padding:"2px 0"}}>{d}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,padding:"2px"}}>
              {calendarCells.map((cd,i)=>(
                <div key={i} style={{height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,borderRadius:"50%",border:"2px solid transparent",color:cd?"#374151":"transparent",fontWeight:"normal"}}>{cd||""}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Activity grid */}
      <div style={{padding:"10px 16px 8px",display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",gap:10}}>
          <div style={{flex:1,border:"1.5px solid #d1d5db",borderRadius:6,padding:"8px 10px"}}>
            <LetterTracingActivity day={day} month={month} age={age}/>
          </div>
          <ColorActivity day={day} month={month}/>
        </div>
        <MathActivity day={day} month={month} age={age}/>
      </div>
      {/* Footer */}
      <div style={{borderTop:"2px solid #1f2937",padding:"10px 20px",textAlign:"center",minHeight:58,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
        {day % 2 === 0
          ? <div style={{fontSize:12,color:"#4b5563",fontStyle:"italic",maxWidth:400}}>
              &ldquo;{affirmation.quote}&rdquo;{affirmation.ref&&<span style={{fontSize:11,color:"#6b7280",fontStyle:"normal"}}> — {affirmation.ref}</span>}
            </div>
          : <div style={{fontSize:13,color:"#1f2937",fontWeight:"bold",maxWidth:400}}>
              {affirmation.action}
            </div>
        }
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════
export default function ActivityPage() {
  const [childName,   setChildName]   = useState("Asha");
  const [month,       setMonth]       = useState("March");
  const [religion,    setReligion]    = useState("Christian");
  const [age,         setAge]         = useState(5);
  const [previewDay,  setPreviewDay]  = useState(10);
  const [showMonth,   setShowMonth]   = useState(false);
  const [pdfProgress, setPdfProgress] = useState<number|null>(null);
  const year = 2026;

  const { daysInMonth } = getMiniCalendar(month, year);

  const colorType  = previewDay%2===0 ? "Color the Scene" : "Trace & Color";
  const mathLabels = ["Count & Write","Circle Smallest/Biggest","Color N Objects","Addition","Subtraction","Before & After"];
  const mathType   = mathLabels[previewDay % (age<=4?3:6)];

  const handleDownloadPDF = async () => {
    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement("script");
      s.src = src; s.onload = ()=>resolve(); s.onerror = ()=>reject();
      document.head.appendChild(s);
    });

    // Fetch a single image URL and return a base64 data URL (or null if missing)
    const fetchBase64 = (url: string): Promise<string|null> =>
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

      const { jsPDF }   = (window as any).jspdf;
      const html2canvas = (window as any).html2canvas;
      const ReactDOM    = await import("react-dom/client");
      const React2      = await import("react");

      // Pre-fetch all images for this month as base64 so html2canvas can embed them
      setPdfProgress(0);
      const imageCache: Record<string,string> = {};
      for (let d = 1; d <= daysInMonth; d++) {
        const paddedDay = String(d).padStart(2, "0");
        const key = `${month.toLowerCase()}_${paddedDay}`;
        const b64 = await fetchBase64(`/images/${key}.png`);
        if (b64) imageCache[key] = b64;
      }

      // Lulu 8.5x11: 0.75in margins = 54pt all sides
      const pdf      = new jsPDF({ orientation: "portrait", unit: "pt", format: [612, 792] });
      const margin   = 54;
      const contentW = 612 - margin * 2; // 504pt = 7in
      const contentH = 792 - margin * 2; // 684pt = 9.5in

      // Off-screen container
      const container = document.createElement("div");
      container.style.cssText = "position:fixed;left:-9999px;top:0;width:540px;background:white;z-index:-1;";
      document.body.appendChild(container);

      for (let d = 1; d <= daysInMonth; d++) {
        setPdfProgress(Math.round((d / daysInMonth) * 100));

        const wrapper = document.createElement("div");
        container.innerHTML = "";
        container.appendChild(wrapper);

        // Wrap DayPage in ImageCacheContext.Provider so DayImage uses base64 srcs
        await new Promise<void>(resolve => {
          const root = ReactDOM.createRoot(wrapper);
          root.render(
            React2.createElement(
              ImageCacheContext.Provider,
              { value: imageCache },
              React2.createElement(DayPage, { day:d, month, year, childName, religion, age })
            )
          );
          // Extra time for base64 images to fully paint
          setTimeout(resolve, 250);
        });

        const canvas = await html2canvas(wrapper, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: 540,
          windowWidth: 600,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.93);
        const imgH    = Math.min(contentW * (canvas.height / canvas.width), contentH);

        if (d > 1) pdf.addPage();
        pdf.addImage(imgData, "JPEG", margin, margin, contentW, imgH);
      }

      document.body.removeChild(container);
      setPdfProgress(null);
      pdf.save(`${childName||"MorningWork"}_${month}_${year}.pdf`);

    } catch (err) {
      console.error("PDF error:", err);
      setPdfProgress(null);
      alert(`PDF failed: ${(err as Error).message}`);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#f0ece3",display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 16px 48px",fontFamily:"Georgia, serif"}}>

      {/* Controls */}
      <div style={{background:"white",border:"2px solid #e5e7eb",borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",maxWidth:640,width:"100%"}}>
        <div style={{flex:1,minWidth:90}}>
          <div style={{fontSize:10,fontWeight:"bold",color:"#6b7280",marginBottom:3}}>CHILD'S NAME</div>
          <input value={childName} onChange={e=>setChildName(e.target.value)}
            style={{width:"100%",padding:"5px 7px",borderRadius:6,border:"2px solid #e5e7eb",fontSize:13,fontFamily:"Georgia",boxSizing:"border-box"}}/>
        </div>
        {[
          {label:"MONTH",    el:<select value={month}    onChange={e=>setMonth(e.target.value)} style={{width:"100%",padding:"5px",borderRadius:6,border:"2px solid #e5e7eb",fontSize:13}}>{["January","February","March","April","May","June","July","August","September","October","November","December"].map(m=><option key={m}>{m}</option>)}</select>},
          {label:"TRADITION",el:<select value={religion} onChange={e=>setReligion(e.target.value)} style={{width:"100%",padding:"5px",borderRadius:6,border:"2px solid #e5e7eb",fontSize:13}}>{["Both","Christian","Hindu"].map(r=><option key={r}>{r}</option>)}</select>},
        ].map(({label,el})=>(
          <div key={label} style={{flex:1,minWidth:80}}>
            <div style={{fontSize:10,fontWeight:"bold",color:"#6b7280",marginBottom:3}}>{label}</div>
            {el}
          </div>
        ))}
        <div>
          <div style={{fontSize:10,fontWeight:"bold",color:"#6b7280",marginBottom:3}}>AGE</div>
          <div style={{display:"flex",gap:3}}>
            {[3,4,5,6].map(a=>(
              <button key={a} onClick={()=>setAge(a)} style={{width:28,height:28,borderRadius:5,cursor:"pointer",border:`2px solid ${age===a?"#1f2937":"#e5e7eb"}`,background:age===a?"#1f2937":"white",color:age===a?"white":"#374151",fontSize:12,fontWeight:"bold"}}>{a}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:10,fontWeight:"bold",color:"#6b7280",marginBottom:3}}>PREVIEW DAY</div>
          <input type="number" min={1} max={daysInMonth} value={previewDay}
            onChange={e=>setPreviewDay(Math.min(daysInMonth,Math.max(1,Number(e.target.value))))}
            style={{width:52,padding:"5px 6px",borderRadius:6,border:"2px solid #e5e7eb",fontSize:13,textAlign:"center"}}/>
        </div>
      </div>

      {/* Action bar */}
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>setShowMonth(v=>!v)}
          style={{padding:"7px 18px",fontSize:12,fontWeight:"bold",cursor:"pointer",border:"2px solid #1f2937",borderRadius:8,background:showMonth?"#e5e7eb":"white",color:"#1f2937"}}>
          {showMonth ? "▲ Hide Month View" : "▼ Show All of " + month}
        </button>
        <button onClick={handleDownloadPDF} disabled={pdfProgress!==null}
          style={{padding:"7px 18px",fontSize:12,fontWeight:"bold",cursor:pdfProgress!==null?"wait":"pointer",border:"2px solid #1f2937",borderRadius:8,background:"#1f2937",color:"white",opacity:pdfProgress!==null?0.7:1}}>
          {pdfProgress!==null ? `Building PDF… ${pdfProgress}%` : `↓ Download PDF — ${month} (${daysInMonth} pages)`}
        </button>
      </div>

      {/* Activity type hint */}
      <div style={{fontSize:11,color:"#6b7280",marginBottom:12,background:"white",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"5px 14px"}}>
        Day {previewDay} · Math: <strong>{mathType}</strong> · Color: <strong>{colorType}</strong>
      </div>

      {/* Single day preview */}
      <div style={{width:540,maxWidth:"100%"}}>
        <DayPage day={previewDay} month={month} year={year} childName={childName} religion={religion} age={age}/>
      </div>

      <p style={{marginTop:14,fontSize:11,color:"#9ca3af",maxWidth:540,textAlign:"center"}}>
        Even days = Color the Scene · Odd days = Trace &amp; Color · Change Preview Day to rotate
      </p>

      {/* Month view — shown below when toggled */}
      {showMonth && (
        <div style={{marginTop:32,width:540,maxWidth:"100%"}}>
          <div style={{textAlign:"center",fontSize:14,fontWeight:"bold",color:"#1f2937",marginBottom:20,fontFamily:"Georgia,serif",letterSpacing:0.5}}>
            {month} {year} — All {daysInMonth} Days
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:28}}>
            {Array.from({length:daysInMonth},(_,i)=>i+1).map(d=>(
              <div key={d}>
                <div style={{fontSize:10,fontWeight:"bold",color:"#9ca3af",letterSpacing:1,textAlign:"center",marginBottom:5}}>— DAY {d} —</div>
                <div>
                  <DayPage day={d} month={month} year={year} childName={childName} religion={religion} age={age}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
