import { ActivityMap } from '../../types';

// Jewish tradition activity overlays.
// Focused on the major Jewish holidays. Hebrew calendar holidays shift each
// year — dates here use the 2026 Gregorian equivalents where applicable.

export const jewishActivities: ActivityMap = {
  // ── February (Tu B'Shevat — 2026: Feb 2) ──
  "2-2":  { word: "tree",      subject: "a tree with fruit for Tu B'Shevat", instruction: "Color the tree and its fruits!",               colorWord: "green",  tags: ["jewish", "tu-bishvat"] },

  // ── March (Purim — 2026: Mar 3) ──
  "3-3":  { word: "mask",      subject: "a Purim mask and noisemaker (grogger)", instruction: "Color the mask and grogger for Purim!",     colorWord: "purple", tags: ["jewish", "purim"] },
  "3-4":  { word: "hamantash", subject: "hamantaschen cookies",          instruction: "Color the triangle cookies for Purim!",            colorWord: "yellow", tags: ["jewish", "purim"] },

  // ── April (Passover — 2026: Apr 1-9) ──
  "4-1":  { word: "matzah",    subject: "matzah and a seder plate",     instruction: "Color the seder plate for Passover!",              colorWord: "brown",  tags: ["jewish", "passover"] },
  "4-2":  { word: "cup",       subject: "Elijah's cup at the seder",    instruction: "Color Elijah's cup of wine!",                      colorWord: "purple", tags: ["jewish", "passover"] },
  "4-9":  { word: "sea",       subject: "Moses parting the Red Sea",     instruction: "Color Moses leading his people through the sea!", colorWord: "blue",   tags: ["jewish", "passover"] },

  // ── May (Lag BaOmer + Shavuot — 2026: May 22) ──
  "5-22": { word: "Torah",     subject: "the Torah scroll",              instruction: "Color the Torah for Shavuot!",                    colorWord: "gold",   tags: ["jewish", "shavuot"] },
  "5-23": { word: "wheat",     subject: "wheat and seven kinds of fruits", instruction: "Color the seven species for Shavuot!",          colorWord: "yellow", tags: ["jewish", "shavuot"] },

  // ── September (Rosh Hashanah — 2026: Sept 12-14) ──
  "9-12": { word: "shofar",    subject: "a shofar being blown",          instruction: "Color the shofar — Happy New Year!",              colorWord: "brown",  tags: ["jewish", "rosh-hashanah"] },
  "9-13": { word: "apple",     subject: "apples and honey",              instruction: "Color the apples and honey for a sweet new year!", colorWord: "red",    tags: ["jewish", "rosh-hashanah"] },

  // ── September (Yom Kippur — 2026: Sept 21) ──
  "9-21": { word: "book",      subject: "the book of life",              instruction: "Color the book of life for Yom Kippur!",          colorWord: "blue",   tags: ["jewish", "yom-kippur"] },

  // ── September-October (Sukkot — 2026: Sept 26-Oct 3) ──
  "9-26": { word: "sukkah",    subject: "a sukkah decorated with fruits", instruction: "Color the sukkah and its decorations!",          colorWord: "green",  tags: ["jewish", "sukkot"] },
  "9-27": { word: "lulav",     subject: "a lulav and etrog",             instruction: "Color the lulav (palm) and etrog (citron)!",     colorWord: "green",  tags: ["jewish", "sukkot"] },

  // ── October (Simchat Torah — 2026: Oct 4) ──
  "10-4": { word: "Torah",     subject: "people dancing with Torah scrolls", instruction: "Color the joyful Torah dancing!",             colorWord: "blue",   tags: ["jewish", "simchat-torah"] },

  // ── December (Hanukkah — 2026: Dec 4-12) ──
  "12-4":  { word: "menorah",  subject: "a menorah with one candle lit",  instruction: "Color the menorah on the first night of Hanukkah!", colorWord: "blue", tags: ["jewish", "hanukkah"] },
  "12-7":  { word: "dreidel",  subject: "spinning dreidels",              instruction: "Color the dreidels!",                              colorWord: "blue",   tags: ["jewish", "hanukkah"] },
  "12-10": { word: "latkes",   subject: "latkes and applesauce",          instruction: "Color the potato latkes!",                         colorWord: "brown",  tags: ["jewish", "hanukkah"] },
  "12-12": { word: "menorah",  subject: "a menorah fully lit with all candles", instruction: "Color the bright menorah on the last night!", colorWord: "yellow", tags: ["jewish", "hanukkah"] },
};
