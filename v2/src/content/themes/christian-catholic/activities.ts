import { ActivityMap } from '../../types';

// Catholic tradition activity overlays.
// Focused on the major feast days and seasons of the Catholic liturgical year.

export const christianCatholicActivities: ActivityMap = {
  // ── January ──
  "1-1":  { word: "Mary",     subject: "Mary the Mother of God",      instruction: "Color Mary, the mother of Jesus!",                   colorWord: "blue",   tags: ["catholic", "mary"] },
  "1-6":  { word: "wisemen",  subject: "the three wise men with gifts", instruction: "Color the three wise men bringing gifts to Jesus!", colorWord: "gold",   tags: ["catholic", "epiphany"] },

  // ── February ──
  "2-2":  { word: "candle",   subject: "candles for Candlemas",       instruction: "Color the candles for Candlemas!",                   colorWord: "yellow", tags: ["catholic", "candlemas"] },
  "2-14": { word: "Valentine", subject: "Saint Valentine with hearts", instruction: "Color Saint Valentine and the hearts!",              colorWord: "red",    tags: ["catholic", "valentine"] },

  // ── March ──
  "3-17": { word: "shamrock", subject: "Saint Patrick with a shamrock", instruction: "Color the shamrock green for Saint Patrick!",      colorWord: "green",  tags: ["catholic", "st-patrick"] },
  "3-19": { word: "Joseph",   subject: "Saint Joseph the carpenter",  instruction: "Color Saint Joseph at his workshop!",                colorWord: "brown",  tags: ["catholic", "st-joseph"] },
  "3-25": { word: "angel",    subject: "the angel Gabriel and Mary",  instruction: "Color the Annunciation — when Mary said yes!",       colorWord: "blue",   tags: ["catholic", "annunciation"] },

  // ── April (Easter season — dates vary by year; using 2026) ──
  "4-3":  { word: "palms",    subject: "palm branches for Palm Sunday", instruction: "Color the palm branches green!",                   colorWord: "green",  tags: ["catholic", "palm-sunday"] },
  "4-5":  { word: "Jesus",    subject: "the empty tomb with a lily",  instruction: "Color the Easter lily — Jesus is risen!",            colorWord: "white",  tags: ["catholic", "easter"] },
  "4-25": { word: "lion",     subject: "Saint Mark with a lion",      instruction: "Color Saint Mark the Evangelist!",                   colorWord: "gold",   tags: ["catholic", "st-mark"] },

  // ── May (Marian month) ──
  "5-1":  { word: "Mary",     subject: "Mary crowned with flowers",   instruction: "Color the May crowning of Mary!",                    colorWord: "pink",   tags: ["catholic", "may", "mary"] },
  "5-13": { word: "rosary",   subject: "Our Lady of Fatima with a rosary", instruction: "Color Our Lady of Fatima!",                     colorWord: "blue",   tags: ["catholic", "fatima"] },

  // ── June ──
  "6-13": { word: "Anthony",  subject: "Saint Anthony with baby Jesus", instruction: "Color Saint Anthony of Padua!",                    colorWord: "brown",  tags: ["catholic", "st-anthony"] },
  "6-24": { word: "John",     subject: "John the Baptist by the river", instruction: "Color John the Baptist by the river Jordan!",     colorWord: "brown",  tags: ["catholic", "john-baptist"] },
  "6-29": { word: "Peter",    subject: "Saint Peter with keys",       instruction: "Color Saint Peter holding the keys to heaven!",      colorWord: "gold",   tags: ["catholic", "st-peter"] },

  // ── July ──
  "7-31": { word: "Ignatius", subject: "Saint Ignatius of Loyola",    instruction: "Color Saint Ignatius!",                              colorWord: "blue",   tags: ["catholic", "st-ignatius"] },

  // ── August ──
  "8-15": { word: "Mary",     subject: "the Assumption of Mary into heaven", instruction: "Color Mary being lifted up to heaven!",       colorWord: "blue",   tags: ["catholic", "assumption"] },

  // ── September ──
  "9-29": { word: "Michael",  subject: "Saint Michael the Archangel", instruction: "Color Saint Michael, the brave archangel!",          colorWord: "gold",   tags: ["catholic", "st-michael"] },

  // ── October ──
  "10-4": { word: "Francis",  subject: "Saint Francis with animals",  instruction: "Color Saint Francis surrounded by animals!",         colorWord: "brown",  tags: ["catholic", "st-francis"] },

  // ── November ──
  "11-1": { word: "saints",   subject: "many saints in heaven",       instruction: "Color all the saints together — All Saints Day!",    colorWord: "gold",   tags: ["catholic", "all-saints"] },
  "11-2": { word: "candle",   subject: "a candle for the faithful departed", instruction: "Color the candle for All Souls Day!",         colorWord: "white",  tags: ["catholic", "all-souls"] },

  // ── December ──
  "12-8":  { word: "Mary",    subject: "Mary in white robes — Immaculate Conception", instruction: "Color Mary, full of grace!",         colorWord: "blue",   tags: ["catholic", "immaculate-conception"] },
  "12-12": { word: "Guadalupe", subject: "Our Lady of Guadalupe with roses", instruction: "Color Our Lady of Guadalupe and her roses!",  colorWord: "red",    tags: ["catholic", "guadalupe"] },
  "12-13": { word: "Lucy",    subject: "Saint Lucy with candles",     instruction: "Color Saint Lucy with the candles!",                 colorWord: "yellow", tags: ["catholic", "st-lucy"] },
  "12-25": { word: "Jesus",   subject: "the Holy Family in the stable", instruction: "Color the Holy Family — baby Jesus, Mary, and Joseph!", colorWord: "gold", tags: ["catholic", "christmas"] },
};
