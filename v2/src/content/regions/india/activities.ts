import { ActivityMap } from '../../types';

// India-specific activity theme overlays
// These replace the universal activity for specific days when region = "india"
// Only days that should differ from universal need entries here

export const indiaActivities: ActivityMap = {
  // Republic Day
  "1-26": { word: "India",    subject: "the Indian flag",          instruction: "Color the Indian flag saffron, white, and green!", colorWord: "saffron", tags: ["india", "republic-day", "flag"] },

  // Makar Sankranti / Pongal season
  "1-14": { word: "kite",     subject: "kites in the sky",         instruction: "Color the kites flying high!",                    colorWord: "yellow",  tags: ["india", "sankranti", "kites"] },
  "1-15": { word: "rangoli",  subject: "a rangoli pattern",        instruction: "Color the rangoli with bright colors!",           colorWord: "red",     tags: ["india", "rangoli", "art"] },

  // Holi season (March)
  "3-3":  { word: "gulal",    subject: "children playing Holi",    instruction: "Color the Holi scene with every color you have!", colorWord: "purple",  tags: ["india", "holi", "colors"] },

  // Independence Day
  "8-15": { word: "flag",     subject: "the Indian tricolor flag", instruction: "Color the flag saffron, white, and green!",       colorWord: "green",   tags: ["india", "independence", "flag"] },

  // Gandhi Jayanti
  "10-2": { word: "Gandhi",   subject: "a spinning wheel (charkha)", instruction: "Color the charkha brown and the thread white!", colorWord: "brown",   tags: ["india", "gandhi", "peace"] },

  // Children's Day
  "11-14": { word: "child",   subject: "happy children playing",   instruction: "Color the children playing!",                    colorWord: "pink",    tags: ["india", "childrens-day", "play"] },

  // Diwali season overlays (October/November)
  "10-14": { word: "diya",    subject: "a diya lamp",              instruction: "Color the diya with warm golden colors!",         colorWord: "gold",    tags: ["india", "diwali", "diya"] },
  "10-15": { word: "lantern", subject: "Diwali lanterns",          instruction: "Color the Diwali lanterns bright!",               colorWord: "orange",  tags: ["india", "diwali", "lantern"] },
  "10-16": { word: "rangoli", subject: "a Rangoli pattern",        instruction: "Color the Rangoli pattern with all the colors!",  colorWord: "purple",  tags: ["india", "diwali", "rangoli"] },

  // General India-themed days scattered through the year
  "2-14": { word: "lotus",    subject: "a lotus flower",           instruction: "Color the lotus pink and the water blue!",        colorWord: "pink",    tags: ["india", "lotus", "flower"] },
  "4-15": { word: "mango",    subject: "mangoes on a tree",        instruction: "Color the mangoes yellow and the leaves green!",  colorWord: "yellow",  tags: ["india", "mango", "fruit"] },
  "5-10": { word: "peacock",  subject: "a peacock",                instruction: "Color the peacock blue and green!",               colorWord: "blue",    tags: ["india", "peacock", "bird"] },
  "6-15": { word: "monsoon",  subject: "monsoon rain and umbrella", instruction: "Color the rain blue and the umbrella red!",      colorWord: "blue",    tags: ["india", "monsoon", "rain"] },
  "7-10": { word: "elephant", subject: "a decorated elephant",     instruction: "Color the elephant with colorful decorations!",   colorWord: "purple",  tags: ["india", "elephant", "festival"] },
  "9-5":  { word: "teacher",  subject: "a teacher and students",   instruction: "Color the teacher and students!",                 colorWord: "red",     tags: ["india", "teachers-day", "school"] },
  "12-15": { word: "chai",    subject: "a cup of chai",            instruction: "Color the chai cup and the steam!",               colorWord: "brown",   tags: ["india", "chai", "winter"] },
};
