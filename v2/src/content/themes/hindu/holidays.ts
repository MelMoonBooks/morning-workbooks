import { HolidayList } from '../../types';

// Hindu holidays — dates shift yearly (lunar calendar)
// Each entry includes a year so getDayContent() can filter by year
// Add new years as needed

const pongal = {
  name: "Pongal",
  tradition: "hindu" as const,
  isMajor: true,
  sentence: "Happy Pongal! Today we thank the sun and the earth for giving us food. We cook sweet rice and celebrate!",
  theme: { word: "Pongal", subject: "a Pongal pot", instruction: "Color the Pongal pot!", colorWord: "orange", tags: ["pongal", "harvest", "sun"] },
};

const holi = {
  name: "Holi",
  tradition: "hindu" as const,
  isMajor: true,
  sentence: "Happy Holi! Today we throw colors and dance and sing. Krishna loves to celebrate Holi!",
  theme: { word: "Holi", subject: "Holi colors", instruction: "Color the Holi colors!", colorWord: "purple", tags: ["holi", "colors", "krishna", "festival"] },
};

const ganeshaChaturthi = {
  name: "Ganesha Chaturthi",
  tradition: "hindu" as const,
  isMajor: true,
  sentence: "Happy Ganesha Chaturthi! Today we celebrate Ganesha's birthday — the son of Shiva who brings wisdom, prosperity, and removes all obstacles. Ganpati Bappa Morya!",
  theme: { word: "Ganesha", subject: "Lord Ganesha", instruction: "Color Lord Ganesha!", colorWord: "orange", tags: ["ganesha", "chaturthi", "elephant", "wisdom"] },
};

const dussehra = {
  name: "Dussehra",
  tradition: "hindu" as const,
  isMajor: true,
  sentence: "Happy Dussehra! Today is the tenth day of Navratri — we celebrate the victory of good over evil. Rama defeated Ravana and goodness always wins!",
  theme: { word: "Rama", subject: "a Ramayana scene", instruction: "Color the Ramayana scene!", colorWord: "gold", tags: ["dussehra", "navratri", "rama", "victory"] },
};

const diwali = {
  name: "Diwali",
  tradition: "hindu" as const,
  isMajor: true,
  sentence: "Happy Diwali! Today we celebrate the victory of light over darkness. Ram has come home — light your diyas!",
  theme: { word: "Diwali", subject: "Diwali diyas", instruction: "Color the Diwali diyas!", colorWord: "gold", tags: ["diwali", "light", "diyas", "festival"] },
};

export const hinduHolidays: HolidayList = [
  // ── 2026 ──
  { date: "01-14", year: 2026, ...pongal },
  { date: "03-03", year: 2026, ...holi },
  { date: "08-27", year: 2026, ...ganeshaChaturthi },
  { date: "10-19", year: 2026, ...dussehra },
  { date: "11-08", year: 2026, ...diwali },

  // ── 2027 ──
  { date: "01-14", year: 2027, ...pongal },
  { date: "03-22", year: 2027, ...holi },
  { date: "09-16", year: 2027, ...ganeshaChaturthi },
  { date: "10-08", year: 2027, ...dussehra },
  { date: "10-29", year: 2027, ...diwali },

  // ── 2028 ──
  { date: "01-14", year: 2028, ...pongal },
  { date: "03-11", year: 2028, ...holi },
  { date: "09-04", year: 2028, ...ganeshaChaturthi },
  { date: "09-26", year: 2028, ...dussehra },
  { date: "10-17", year: 2028, ...diwali },

  // ── 2029 ──
  { date: "01-14", year: 2029, ...pongal },
  { date: "03-01", year: 2029, ...holi },
  { date: "09-22", year: 2029, ...ganeshaChaturthi },
  { date: "10-15", year: 2029, ...dussehra },
  { date: "11-04", year: 2029, ...diwali },

  // ── 2030 ──
  { date: "01-14", year: 2030, ...pongal },
  { date: "03-20", year: 2030, ...holi },
  { date: "09-12", year: 2030, ...ganeshaChaturthi },
  { date: "10-05", year: 2030, ...dussehra },
  { date: "10-26", year: 2030, ...diwali },
];
