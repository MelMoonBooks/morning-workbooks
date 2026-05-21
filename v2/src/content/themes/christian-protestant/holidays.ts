import { HolidayList } from '../../types';

// Protestant holidays
// Fixed-date holidays have no year field (apply every year)
// Movable holidays (Easter, Advent) have year-specific entries

const holyThursday = {
  name: "Holy Thursday",
  tradition: "christian-protestant" as const,
  isMajor: false,
  sentence: "Tonight is Holy Thursday. Jesus had a special dinner with his friends and showed them how to serve.",
};

const goodFriday = {
  name: "Good Friday",
  tradition: "christian-protestant" as const,
  isMajor: true,
  sentence: "Today is Good Friday. We remember how much Jesus loved us.",
};

const easter = {
  name: "Easter Sunday",
  tradition: "christian-protestant" as const,
  isMajor: true,
  sentence: "He is risen! Today is Easter — the most joyful day of the year. Jesus is alive!",
  theme: { word: "Easter", subject: "the empty tomb", instruction: "Color the Easter scene!", colorWord: "gold", tags: ["easter", "resurrection", "jesus"] },
};

const advent = {
  name: "First Sunday of Advent",
  tradition: "christian-protestant" as const,
  isMajor: false,
  sentence: "Advent begins today! We light the first candle and wait with joy for Jesus to come.",
};

const advent2 = {
  name: "Second Sunday of Advent",
  tradition: "christian-protestant" as const,
  isMajor: false,
  sentence: "It's the second Sunday of Advent. We light two candles and prepare our hearts for Jesus.",
};

const advent3 = {
  name: "Third Sunday of Advent",
  tradition: "christian-protestant" as const,
  isMajor: false,
  sentence: "It's the third Sunday of Advent — the joy candle is lit! Christmas is almost here.",
};

const advent4 = {
  name: "Fourth Sunday of Advent",
  tradition: "christian-protestant" as const,
  isMajor: false,
  sentence: "It's the fourth Sunday of Advent. All four candles glow tonight — Christmas Eve is so close!",
};

const pentecost = {
  name: "Pentecost",
  tradition: "christian-protestant" as const,
  isMajor: true,
  sentence: "Happy Pentecost! Today we celebrate when the Holy Spirit came down like tongues of fire and filled the disciples with courage and joy.",
};

const reformationDay = {
  name: "Reformation Day",
  tradition: "christian-protestant" as const,
  isMajor: false,
  sentence: "Today is Reformation Day. We remember when Martin Luther helped people read the Bible in their own language.",
};

const thanksgiving = {
  name: "Thanksgiving",
  tradition: "christian-protestant" as const,
  isMajor: true,
  sentence: "Happy Thanksgiving! Today we gather with family to thank God for all our blessings.",
};

const valentineBible = {
  name: "Valentine's Day",
  tradition: "christian-protestant" as const,
  isMajor: false,
  sentence: "Happy Valentine's Day! Today we celebrate love — and remember that God is love.",
};

export const christianProtestantHolidays: HolidayList = [
  // ── Fixed-date holidays (every year) ──
  { date: "01-06", name: "Epiphany",          tradition: "christian-protestant", isMajor: false, sentence: "Today is Epiphany! We remember the three wise men who followed the star to find Jesus." },
  { date: "02-14", ...valentineBible },
  { date: "10-31", ...reformationDay },
  { date: "12-24", name: "Christmas Eve",      tradition: "christian-protestant", isMajor: false, sentence: "Tonight is Christmas Eve! Tomorrow we celebrate the birth of Jesus." },
  {
    date: "12-25",
    name: "Christmas Day",
    tradition: "christian-protestant",
    isMajor: true,
    sentence: "Today is Christmas Day! This is the day that Jesus was born. Glory to God in the highest!",
    theme: { word: "nativity", subject: "the nativity", instruction: "Color the nativity scene!", colorWord: "gold", tags: ["christmas", "nativity", "jesus", "bethlehem"] },
  },

  // ── 2026 — movable dates ──
  { date: "04-02", year: 2026, ...holyThursday },
  { date: "04-03", year: 2026, ...goodFriday },
  { date: "04-05", year: 2026, ...easter },
  { date: "05-24", year: 2026, ...pentecost },
  { date: "11-26", year: 2026, ...thanksgiving },
  { date: "11-29", year: 2026, ...advent },
  { date: "12-06", year: 2026, ...advent2 },
  { date: "12-13", year: 2026, ...advent3 },
  { date: "12-20", year: 2026, ...advent4 },

  // ── 2027 ──
  { date: "03-25", year: 2027, ...holyThursday },
  { date: "03-26", year: 2027, ...goodFriday },
  { date: "03-28", year: 2027, ...easter },
  { date: "11-28", year: 2027, ...advent },

  // ── 2028 ──
  { date: "04-13", year: 2028, ...holyThursday },
  { date: "04-14", year: 2028, ...goodFriday },
  { date: "04-16", year: 2028, ...easter },
  { date: "12-03", year: 2028, ...advent },

  // ── 2029 ──
  { date: "03-29", year: 2029, ...holyThursday },
  { date: "03-30", year: 2029, ...goodFriday },
  { date: "04-01", year: 2029, ...easter },
  { date: "12-02", year: 2029, ...advent },

  // ── 2030 ──
  { date: "04-18", year: 2030, ...holyThursday },
  { date: "04-19", year: 2030, ...goodFriday },
  { date: "04-21", year: 2030, ...easter },
  { date: "12-01", year: 2030, ...advent },
];
