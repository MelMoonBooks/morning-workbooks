import { ActivityMap } from '../../types';

// Protestant tradition activity overlays.
// Focused on the major Christian holidays observed in Protestant churches,
// minus saint-specific feast days (which Protestants don't generally observe).

export const christianProtestantActivities: ActivityMap = {
  // ── January ──
  "1-6":  { word: "wisemen",   subject: "the three wise men bringing gifts", instruction: "Color the three wise men following the star!", colorWord: "gold",   tags: ["protestant", "epiphany"] },

  // ── February ──
  "2-14": { word: "love",      subject: "a heart with a Bible",           instruction: "Color the heart and Bible — God is love!",         colorWord: "red",    tags: ["protestant", "valentine"] },

  // ── March / April (Easter season — 2026 dates) ──
  "4-3":  { word: "palms",     subject: "palm branches for Palm Sunday",  instruction: "Color the palm branches green!",                   colorWord: "green",  tags: ["protestant", "palm-sunday"] },
  "4-5":  { word: "Jesus",     subject: "the empty tomb with sunrise",    instruction: "Color the sunrise — Jesus is alive!",              colorWord: "yellow", tags: ["protestant", "easter"] },

  // ── May (Pentecost — 2026) ──
  "5-24": { word: "flame",     subject: "tongues of fire over the disciples", instruction: "Color the flames of the Holy Spirit!",         colorWord: "red",    tags: ["protestant", "pentecost"] },

  // ── October ──
  "10-31": { word: "Bible",    subject: "an open Bible with light shining out", instruction: "Color the Bible — Reformation Day!",         colorWord: "gold",   tags: ["protestant", "reformation-day"] },

  // ── November ──
  "11-26": { word: "harvest",  subject: "a Thanksgiving table with a turkey", instruction: "Color the Thanksgiving feast!",                colorWord: "brown",  tags: ["protestant", "thanksgiving"] },

  // ── December (Advent + Christmas) ──
  "12-7":  { word: "candles",  subject: "an Advent wreath with candles",  instruction: "Color the Advent candles!",                        colorWord: "purple", tags: ["protestant", "advent"] },
  "12-14": { word: "candles",  subject: "an Advent wreath with two candles lit", instruction: "Color the second week of Advent!",          colorWord: "purple", tags: ["protestant", "advent"] },
  "12-21": { word: "candles",  subject: "an Advent wreath with three candles lit", instruction: "Color the third week of Advent — joy!",   colorWord: "pink",   tags: ["protestant", "advent"] },
  "12-24": { word: "star",     subject: "the star of Bethlehem over the stable", instruction: "Color the Christmas Eve star!",             colorWord: "yellow", tags: ["protestant", "christmas-eve"] },
  "12-25": { word: "Jesus",    subject: "baby Jesus in the manger",       instruction: "Color baby Jesus — born for us!",                  colorWord: "gold",   tags: ["protestant", "christmas"] },
};
