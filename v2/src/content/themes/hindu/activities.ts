import { ActivityMap } from '../../types';

// Hindu tradition activity overlays.
// These replace the universal activity for specific days when Hindu is the
// dominant tradition. Focused on the major Hindu holidays and festivals.
// Only days that should differ from universal need entries here — every other
// day falls back to the universal activity.

export const hinduActivities: ActivityMap = {
  // ── January ──
  "1-14": { word: "Pongal",   subject: "a Pongal sun and pot",       instruction: "Color the Pongal celebration!",                       colorWord: "yellow", tags: ["hindu", "pongal", "harvest"] },
  "1-15": { word: "kite",     subject: "kites in the sky for Makar Sankranti", instruction: "Color the colorful kites!",               colorWord: "red",    tags: ["hindu", "sankranti", "kites"] },

  // ── February ──
  "2-2":  { word: "veena",    subject: "Saraswati with a veena",     instruction: "Color Saraswati, the goddess of learning, in white!", colorWord: "white",  tags: ["hindu", "saraswati", "vasant-panchami"] },

  // ── March (Holi season) ──
  "3-3":  { word: "colors",   subject: "children playing Holi with colors", instruction: "Color the Holi scene with every color!",       colorWord: "purple", tags: ["hindu", "holi", "colors"] },
  "3-4":  { word: "Krishna",  subject: "Krishna with a flute",       instruction: "Color Krishna playing his flute!",                    colorWord: "blue",   tags: ["hindu", "krishna"] },

  // ── April ──
  "4-6":  { word: "Rama",     subject: "Rama with a bow",            instruction: "Color Rama, the brave prince!",                       colorWord: "blue",   tags: ["hindu", "ram-navami"] },
  "4-13": { word: "Hanuman",  subject: "Hanuman the monkey god",     instruction: "Color Hanuman, the brave helper of Rama!",            colorWord: "orange", tags: ["hindu", "hanuman-jayanti"] },

  // ── May ──
  "5-11": { word: "lotus",    subject: "Buddha sitting on a lotus",  instruction: "Color the Buddha and the lotus flower!",              colorWord: "pink",   tags: ["hindu", "buddha-purnima"] },

  // ── July ──
  "7-21": { word: "teacher",  subject: "a guru teaching a student",  instruction: "Color the wise teacher and student!",                 colorWord: "orange", tags: ["hindu", "guru-purnima"] },

  // ── August ──
  "8-9":  { word: "rakhi",    subject: "a sister tying a rakhi on her brother's wrist", instruction: "Color the rakhi celebration!",      colorWord: "red",    tags: ["hindu", "raksha-bandhan"] },
  "8-16": { word: "Krishna",  subject: "baby Krishna in a swing",    instruction: "Color baby Krishna for Janmashtami!",                 colorWord: "blue",   tags: ["hindu", "janmashtami"] },

  // ── September ──
  "9-7":  { word: "Ganesha",  subject: "Ganesha the elephant god",   instruction: "Color Ganesha and decorate him with flowers!",        colorWord: "red",    tags: ["hindu", "ganesha-chaturthi"] },
  "9-14": { word: "Ganesha",  subject: "Ganesha being carried in a procession", instruction: "Color the Ganesha procession!",            colorWord: "yellow", tags: ["hindu", "ganesha-chaturthi"] },

  // ── October (Navratri + Dussehra) ──
  "10-15": { word: "Durga",   subject: "the goddess Durga riding a lion", instruction: "Color the strong goddess Durga!",               colorWord: "red",    tags: ["hindu", "navratri", "durga"] },
  "10-18": { word: "dandiya", subject: "children dancing dandiya",   instruction: "Color the children dancing dandiya!",                 colorWord: "orange", tags: ["hindu", "navratri", "dance"] },
  "10-21": { word: "Rama",    subject: "Rama defeating Ravana",      instruction: "Color the victory of Rama for Dussehra!",             colorWord: "blue",   tags: ["hindu", "dussehra"] },

  // ── November (Diwali) ──
  "11-7":  { word: "rangoli", subject: "a colorful rangoli pattern", instruction: "Color the rangoli with bright colors!",              colorWord: "red",    tags: ["hindu", "diwali", "rangoli"] },
  "11-8":  { word: "diya",    subject: "diyas lit for Diwali",       instruction: "Color the diyas red and yellow — Happy Diwali!",     colorWord: "yellow", tags: ["hindu", "diwali", "diya"] },
  "11-9":  { word: "Lakshmi", subject: "the goddess Lakshmi",        instruction: "Color Lakshmi, the goddess of prosperity!",          colorWord: "gold",   tags: ["hindu", "diwali", "lakshmi"] },
  "11-10": { word: "fireworks", subject: "Diwali fireworks",         instruction: "Color the fireworks in the night sky!",              colorWord: "purple", tags: ["hindu", "diwali", "fireworks"] },
};
