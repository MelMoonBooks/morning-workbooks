import { HolidayList } from '../../types';

// Catholic holidays
// Fixed-date holidays have no year field (apply every year)
// Movable holidays (Easter, Advent) have year-specific entries

const holyThursday = {
  name: "Holy Thursday",
  tradition: "christian-catholic" as const,
  isMajor: false,
  sentence: "Tonight is Holy Thursday. Jesus had a special dinner with his friends and showed them how to serve.",
};

const goodFriday = {
  name: "Good Friday",
  tradition: "christian-catholic" as const,
  isMajor: true,
  sentence: "Today is Good Friday. We remember how much Jesus loved us.",
};

const easter = {
  name: "Easter Sunday",
  tradition: "christian-catholic" as const,
  isMajor: true,
  sentence: "He is risen! Today is Easter — the most joyful day of the year. Jesus is alive!",
  theme: { word: "Easter", subject: "the empty tomb", instruction: "Color the Easter scene!", colorWord: "gold", tags: ["easter", "resurrection", "jesus"] },
};

const advent = {
  name: "First Sunday of Advent",
  tradition: "christian-catholic" as const,
  isMajor: false,
  sentence: "Advent begins today! We light the first candle and wait with joy for Jesus to come.",
};

export const christianCatholicHolidays: HolidayList = [
  // ── Fixed-date holidays (every year) ──
  { date: "01-06", name: "Epiphany",          tradition: "christian-catholic", isMajor: false, sentence: "Today is Epiphany! We remember the three wise men who followed the star to find Jesus." },
  { date: "11-01", name: "All Saints' Day",    tradition: "christian-catholic", isMajor: false, sentence: "Today is All Saints' Day! We remember all the holy people who showed us how to love God." },
  { date: "12-24", name: "Christmas Eve",      tradition: "christian-catholic", isMajor: false, sentence: "Tonight is Christmas Eve! Tomorrow we celebrate the birth of Jesus." },
  {
    date: "12-25",
    name: "Christmas Day",
    tradition: "christian-catholic",
    isMajor: true,
    sentence: "Today is Christmas Day! This is the day that Jesus was born. Glory to God in the highest!",
    theme: { word: "nativity", subject: "the nativity", instruction: "Color the nativity scene!", colorWord: "gold", tags: ["christmas", "nativity", "jesus", "bethlehem"] },
  },
  { date: "12-26", name: "St. Stephen's Day",  tradition: "christian-catholic", isMajor: false, sentence: "Today is the Feast of St. Stephen, the first person to give his life for following Jesus." },

  // ── 2026 — movable dates ──
  { date: "04-02", year: 2026, ...holyThursday },
  { date: "04-03", year: 2026, ...goodFriday },
  { date: "04-05", year: 2026, ...easter },
  { date: "11-29", year: 2026, ...advent },

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
