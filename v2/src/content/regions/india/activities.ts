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
  "5-3":  { word: "rangoli",  subject: "a rangoli at a doorway",   instruction: "Color the rangoli with bright welcoming colors!", colorWord: "pink",    tags: ["india", "rangoli", "welcome"] },
  "5-10": { word: "peacock",  subject: "a peacock",                instruction: "Color the peacock blue and green!",               colorWord: "blue",    tags: ["india", "peacock", "bird"] },
  "5-17": { word: "lassi",    subject: "a glass of mango lassi",   instruction: "Color the lassi yellow and the glass cool blue!", colorWord: "yellow",  tags: ["india", "lassi", "mango", "drink"] },
  // Launch-week specials (5-22, 5-23, 5-24)
  "5-22": { word: "marigold", subject: "a marigold garland (toran) at a doorway", instruction: "Color the marigold garland bright orange and yellow!", colorWord: "orange", tags: ["india", "marigold", "festival"] },
  "5-23": { word: "thali",    subject: "an Indian thali platter",  instruction: "Color the thali with all the foods!",             colorWord: "yellow",  tags: ["india", "thali", "food"] },
  "5-24": { word: "cricket",  subject: "a child playing cricket",  instruction: "Color the cricket player and the bat!",           colorWord: "green",   tags: ["india", "cricket", "sport"] },
  "5-31": { word: "India",    subject: "kids waving the Indian flag", instruction: "Color the flag saffron, white, and green!",    colorWord: "saffron", tags: ["india", "flag", "kids"] },
  "6-7":  { word: "tabla",    subject: "a tabla drum and sitar",   instruction: "Color the tabla and sitar — instruments of India!", colorWord: "brown",  tags: ["india", "tabla", "sitar", "music"] },
  "6-15": { word: "monsoon",  subject: "monsoon rain and umbrella", instruction: "Color the rain blue and the umbrella red!",      colorWord: "blue",    tags: ["india", "monsoon", "rain"] },
  "6-22": { word: "rickshaw", subject: "an auto-rickshaw (tuk-tuk)", instruction: "Color the rickshaw bright yellow and green!",   colorWord: "yellow",  tags: ["india", "rickshaw", "transport"] },
  "6-28": { word: "chai",     subject: "a cup of steaming chai",   instruction: "Color the chai cup warm browns and steam!",       colorWord: "brown",   tags: ["india", "chai", "tea"] },

  // July — added for cohesion: one themed India day every ~3-4 days (8 per month)
  "7-3":  { word: "samosa",   subject: "a plate of samosas with chutney", instruction: "Color the samosas and chutneys!",        colorWord: "brown",   tags: ["india", "samosa", "food"] },
  "7-7":  { word: "bangles",  subject: "a stack of colorful Indian bangles", instruction: "Color the bangles in every bright color!", colorWord: "pink", tags: ["india", "bangles"] },
  "7-14": { word: "yoga",     subject: "a child doing yoga at sunrise", instruction: "Color the morning yoga scene!",            colorWord: "orange",  tags: ["india", "yoga", "morning"] },
  "7-18": { word: "henna",    subject: "hands with henna patterns", instruction: "Color the beautiful henna patterns!",          colorWord: "brown",   tags: ["india", "henna", "mehndi"] },
  "7-22": { word: "kheer",    subject: "a bowl of kheer with nuts and saffron", instruction: "Color the kheer and the warm spices!", colorWord: "yellow", tags: ["india", "kheer", "sweet"] },
  "7-24": { word: "train",    subject: "an Indian train in the countryside", instruction: "Color the train and the green fields!", colorWord: "green",  tags: ["india", "train", "travel"] },
  "7-31": { word: "dance",    subject: "a child in a Bharatanatyam pose", instruction: "Color the classical Indian dance pose!", colorWord: "red",     tags: ["india", "dance", "bharatanatyam"] },
  "7-10": { word: "elephant", subject: "a decorated elephant",     instruction: "Color the elephant with colorful decorations!",   colorWord: "purple",  tags: ["india", "elephant", "festival"] },
  "9-5":  { word: "teacher",  subject: "a teacher and students",   instruction: "Color the teacher and students!",                 colorWord: "red",     tags: ["india", "teachers-day", "school"] },
  "12-15": { word: "chai",    subject: "a cup of chai",            instruction: "Color the chai cup and the steam!",               colorWord: "brown",   tags: ["india", "chai", "winter"] },
};
