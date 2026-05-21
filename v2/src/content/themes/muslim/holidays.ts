import { HolidayList } from '../../types';

// Islamic holidays — 2026 Gregorian dates (Hijri calendar shifts ~11 days
// earlier each Gregorian year). Dates here are approximate astronomical
// predictions; local moon-sighting may differ by a day in either direction.

export const muslimHolidays: HolidayList = [
  { date: "01-16", name: "Lailat al-Miraj",         tradition: "muslim", isMajor: false, sentence: "Tonight is Lailat al-Miraj — we remember the Prophet Muhammad's night journey to the heavens." },
  { date: "02-17", name: "First day of Ramadan",    tradition: "muslim", isMajor: true,  sentence: "Ramadan Mubarak! Today the holy month of fasting begins. Families pray together and share meals after sunset." },
  { date: "02-20", name: "Ramadan continues",       tradition: "muslim", isMajor: false, sentence: "We're in the holy month of Ramadan. Hang the fanoos (lanterns) and share food with neighbors after sunset." },
  { date: "03-15", name: "Laylat al-Qadr",          tradition: "muslim", isMajor: true,  sentence: "Tonight is Laylat al-Qadr — the Night of Power — when the Quran was first revealed to the Prophet Muhammad." },
  { date: "03-18", name: "Last day of Ramadan",     tradition: "muslim", isMajor: false, sentence: "Today is the last day of Ramadan. Tomorrow we celebrate Eid al-Fitr!" },
  { date: "03-19", name: "Eid al-Fitr",             tradition: "muslim", isMajor: true,  sentence: "Eid Mubarak! Today is Eid al-Fitr — the celebration at the end of Ramadan. Families pray, share gifts, and eat sweets together." },
  { date: "03-20", name: "Eid al-Fitr (day 2)",     tradition: "muslim", isMajor: false, sentence: "Eid celebrations continue today — more family, more food, more joy." },
  { date: "05-25", name: "Day of Arafah",           tradition: "muslim", isMajor: true,  sentence: "Today is the Day of Arafah — the most important day of the Hajj pilgrimage. We pray and remember what matters most." },
  { date: "06-15", name: "Hajj season",             tradition: "muslim", isMajor: false, sentence: "During Hajj season, millions of Muslims travel to Mecca to circle the Kaaba — the holy house built by Prophet Ibrahim." },
  { date: "05-26", name: "Eid al-Adha",             tradition: "muslim", isMajor: true,  sentence: "Eid Mubarak! Today is Eid al-Adha — the Festival of Sacrifice. We remember Prophet Ibrahim and share food with our neighbors." },
  { date: "05-27", name: "Eid al-Adha (day 2)",     tradition: "muslim", isMajor: false, sentence: "Eid al-Adha celebrations continue. Visiting family and sharing meals." },
  { date: "07-05", name: "Hijri New Year",          tradition: "muslim", isMajor: true,  sentence: "Today is the Islamic New Year — the start of a new Hijri year. May it bring blessings to all." },
  { date: "07-14", name: "Day of Ashura",           tradition: "muslim", isMajor: false, sentence: "Today is Ashura — a day of fasting, remembrance, and reflection." },
  { date: "09-13", name: "Mawlid an-Nabi",          tradition: "muslim", isMajor: true,  sentence: "Today we celebrate Mawlid an-Nabi — the birthday of the Prophet Muhammad ﷺ." },
];
