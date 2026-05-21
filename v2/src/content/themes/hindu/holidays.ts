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

const buddhaPurnima = {
  name: "Buddha Purnima",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Happy Buddha Purnima! Today we celebrate the Buddha's birthday — the wise teacher who taught kindness and peace.",
  theme: { word: "Buddha", subject: "Buddha sitting on a lotus", instruction: "Color the Buddha and the lotus flower!", colorWord: "pink", tags: ["buddha", "purnima", "wisdom", "peace"] },
};

// Fixed-date Hindu observances (same day every year)
const makarSankranti = {
  name: "Makar Sankranti",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Happy Makar Sankranti! Today the sun begins its journey north. Families fly colorful kites to welcome warmer days!",
};

// Lunar Hindu holidays — dates shift each year
const vasantPanchami = {
  name: "Vasant Panchami",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Happy Vasant Panchami! Today we honor Saraswati, the goddess of learning and music. Wear yellow and bless your books!",
};

const ramNavami = {
  name: "Ram Navami",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Happy Ram Navami! Today we celebrate the birth of Lord Rama — the brave and kind prince.",
};

const hanumanJayanti = {
  name: "Hanuman Jayanti",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Happy Hanuman Jayanti! Today we celebrate Hanuman — the brave monkey-god who helped Rama with strength and devotion.",
};

const guruPurnima = {
  name: "Guru Purnima",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Happy Guru Purnima! Today we thank all our teachers — the people who help us learn and grow wise.",
};

const rakshaBandhan = {
  name: "Raksha Bandhan",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Happy Raksha Bandhan! Today sisters tie a rakhi around their brother's wrist as a promise of love and protection.",
};

const janmashtami = {
  name: "Krishna Janmashtami",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Happy Janmashtami! Today we celebrate the birth of Lord Krishna — the playful blue god who plays his flute.",
};

const dhanteras = {
  name: "Dhanteras",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Happy Dhanteras! Today we draw rangoli patterns at our doorways and welcome good fortune for Diwali.",
};

const govardhanPuja = {
  name: "Govardhan Puja",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Today is Govardhan Puja — the day after Diwali. We honor Lakshmi, the goddess of prosperity and abundance.",
};

const bhaiDooj = {
  name: "Bhai Dooj",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Happy Bhai Dooj! Today sisters and brothers celebrate each other with sweets, prayers, and fireworks.",
};

const holiDay2 = {
  name: "Dhulandi (Day of Holi)",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "The Holi celebration continues! Krishna and his friends loved playing with colors — today we do the same.",
};

const ganeshaVisarjan = {
  name: "Ganesha Visarjan",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "Today families carry Ganesha to the river in a colorful procession and say goodbye until next year. Ganpati Bappa Morya!",
};

const mahaNavami = {
  name: "Maha Navami (Navratri day 9)",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "It's Maha Navami — the 9th night of Navratri! Tonight is the great celebration of Goddess Durga. Dance dandiya and garba!",
};

const dussehraEve = {
  name: "Dussehra celebrations",
  tradition: "hindu" as const,
  isMajor: false,
  sentence: "The Dussehra festival continues. We remember how good always wins over evil — just like Rama defeated Ravana.",
};

export const hinduHolidays: HolidayList = [
  // ── 2026 ──
  { date: "01-14", year: 2026, ...pongal },
  { date: "01-15", year: 2026, ...makarSankranti },
  { date: "02-02", year: 2026, ...vasantPanchami },
  { date: "03-03", year: 2026, ...holi },
  { date: "03-04", year: 2026, ...holiDay2 },
  { date: "04-06", year: 2026, ...ramNavami },
  { date: "04-13", year: 2026, ...hanumanJayanti },
  { date: "05-11", year: 2026, ...buddhaPurnima },
  { date: "07-21", year: 2026, ...guruPurnima },
  { date: "08-09", year: 2026, ...rakshaBandhan },
  { date: "08-16", year: 2026, ...janmashtami },
  { date: "08-27", year: 2026, ...ganeshaChaturthi },
  { date: "09-07", year: 2026, ...ganeshaVisarjan },
  { date: "09-14", year: 2026, ...ganeshaVisarjan },
  { date: "10-18", year: 2026, ...mahaNavami },
  { date: "10-19", year: 2026, ...dussehra },
  { date: "10-21", year: 2026, ...dussehraEve },
  { date: "11-07", year: 2026, ...dhanteras },
  { date: "11-08", year: 2026, ...diwali },
  { date: "11-09", year: 2026, ...govardhanPuja },
  { date: "11-10", year: 2026, ...bhaiDooj },

  // ── 2027 ──
  { date: "01-14", year: 2027, ...pongal },
  { date: "03-22", year: 2027, ...holi },
  { date: "05-01", year: 2027, ...buddhaPurnima },
  { date: "09-16", year: 2027, ...ganeshaChaturthi },
  { date: "10-08", year: 2027, ...dussehra },
  { date: "10-29", year: 2027, ...diwali },

  // ── 2028 ──
  { date: "01-14", year: 2028, ...pongal },
  { date: "03-11", year: 2028, ...holi },
  { date: "05-18", year: 2028, ...buddhaPurnima },
  { date: "09-04", year: 2028, ...ganeshaChaturthi },
  { date: "09-26", year: 2028, ...dussehra },
  { date: "10-17", year: 2028, ...diwali },

  // ── 2029 ──
  { date: "01-14", year: 2029, ...pongal },
  { date: "03-01", year: 2029, ...holi },
  { date: "05-08", year: 2029, ...buddhaPurnima },
  { date: "09-22", year: 2029, ...ganeshaChaturthi },
  { date: "10-15", year: 2029, ...dussehra },
  { date: "11-04", year: 2029, ...diwali },

  // ── 2030 ──
  { date: "01-14", year: 2030, ...pongal },
  { date: "03-20", year: 2030, ...holi },
  { date: "05-27", year: 2030, ...buddhaPurnima },
  { date: "09-12", year: 2030, ...ganeshaChaturthi },
  { date: "10-05", year: 2030, ...dussehra },
  { date: "10-26", year: 2030, ...diwali },
];
