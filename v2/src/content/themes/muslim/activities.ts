import { ActivityMap } from '../../types';

// Muslim tradition activity overlays.
// Islamic holidays follow the lunar Hijri calendar and shift each year —
// dates here use the 2026 Gregorian equivalents (approximate, based on
// astronomical predictions).

export const muslimActivities: ActivityMap = {
  // ── January (Lailat al-Miraj — 2026: Jan 16) ──
  "1-16": { word: "mosque",    subject: "a beautiful mosque at night",   instruction: "Color the mosque and the night sky!",              colorWord: "blue",   tags: ["muslim", "lailat-al-miraj"] },

  // ── February (Ramadan begins — 2026: Feb 17) ──
  "2-17": { word: "moon",      subject: "the crescent moon over a mosque", instruction: "Color the crescent moon — Ramadan begins!",      colorWord: "yellow", tags: ["muslim", "ramadan"] },
  "2-20": { word: "lantern",   subject: "a Ramadan lantern (fanoos)",    instruction: "Color the colorful Ramadan lantern!",              colorWord: "gold",   tags: ["muslim", "ramadan"] },

  // ── March (Mid-Ramadan + Laylat al-Qadr) ──
  "3-15": { word: "Quran",     subject: "an open Quran with prayer beads", instruction: "Color the Quran and prayer beads!",              colorWord: "green",  tags: ["muslim", "ramadan"] },

  // ── March (Eid al-Fitr — 2026: Mar 19) ──
  "3-19": { word: "Eid",       subject: "a family celebrating Eid al-Fitr", instruction: "Color the Eid celebration — Eid Mubarak!",      colorWord: "green",  tags: ["muslim", "eid-al-fitr"] },
  "3-20": { word: "gifts",     subject: "Eid gifts (Eidi) and sweets",   instruction: "Color the Eid gifts and sweets!",                  colorWord: "red",    tags: ["muslim", "eid-al-fitr"] },

  // ── May (Eid al-Adha — 2026: May 26) ──
  "5-26": { word: "Eid",       subject: "a family celebrating Eid al-Adha", instruction: "Color the Eid al-Adha celebration!",            colorWord: "green",  tags: ["muslim", "eid-al-adha"] },
  "5-27": { word: "sheep",     subject: "sheep grazing in a field",      instruction: "Color the sheep for Eid al-Adha!",                 colorWord: "white",  tags: ["muslim", "eid-al-adha"] },

  // ── June (Hajj season + Day of Arafah — 2026: late May/early June) ──
  "6-15": { word: "Kaaba",     subject: "the Kaaba at Mecca",            instruction: "Color the Kaaba — the holy house of Allah!",       colorWord: "black",  tags: ["muslim", "hajj"] },

  // ── July (Islamic New Year / Muharram — 2026: ~Jul 5) ──
  "7-5":  { word: "calendar",  subject: "a crescent moon and stars",     instruction: "Color the crescent moon for the Islamic New Year!", colorWord: "purple", tags: ["muslim", "muharram"] },

  // ── July (Ashura — 2026: ~Jul 14) ──
  "7-14": { word: "water",     subject: "a cup of water for Ashura",     instruction: "Color the cup for the day of fasting!",            colorWord: "blue",   tags: ["muslim", "ashura"] },

  // ── September (Mawlid an-Nabi — 2026: ~Sept 13) ──
  "9-13": { word: "mosque",    subject: "a green mosque with a star",    instruction: "Color the mosque for the Prophet's birthday!",     colorWord: "green",  tags: ["muslim", "mawlid"] },

  // Generic Friday prayer (jumu'ah) — every Friday is special in Islam,
  // but we won't add per-Friday entries (too many; universal coverage is fine)

  // ── December (Quran-themed for kids who want Islamic content year-round) ──
  "12-1":  { word: "stars",    subject: "a sky full of stars and the crescent moon", instruction: "Color the night sky!",                  colorWord: "yellow", tags: ["muslim", "general"] },
};
