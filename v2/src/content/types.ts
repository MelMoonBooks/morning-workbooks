// A single day's complete content theme
export interface DayTheme {
  word: string;              // for letter tracing
  subject: string;           // for coloring image description
  instruction: string;       // "Color the diya!"
  colorWord: string;         // word to trace in trace & color activity
  imageFile?: string;        // e.g. "march_14.png" or "diwali_diya.png"
  tags: string[];            // ["hindu", "diwali", "light", "festival"]
}

// A holiday entry
export interface Holiday {
  date: string;              // "MM-DD"
  year?: number;             // if set, only applies to this year (for lunar calendar holidays)
  name: string;              // "Diwali"
  tradition: string;         // "hindu" | "christian-catholic" | "universal" etc.
  isMajor: boolean;          // true = overrides dominant theme cycling
  sentence: string;          // "Happy Diwali! Today we celebrate the victory of light!"
  theme?: Partial<DayTheme>; // optional theme override for major holidays
}

// An affirmation/quote entry
export interface Affirmation {
  quote: string;
  ref: string;               // "Gita 3:19" or "Ps 23:1" or "Einstein" or ""
  tradition: string;         // which tradition this belongs to
}

// A coloring book product
export interface ColoringBook {
  id: string;
  title: string;
  description: string;
  coverEmoji: string;        // placeholder until real cover images exist
  coverImage?: string;
  traditions: string[];      // ["hindu"] or ["christian-catholic"] or ["universal"]
  regions: string[];         // ["us", "india", "global"]
  months: number[];          // [10, 11] = October/November (Diwali season)
  tags: string[];            // ["diwali", "light", "festival"]
  price: number;             // 9.99
  pageCount: number;
  available: boolean;        // false = "Coming Soon"
  previewPages?: string[];   // image file names for preview
}

// A child profile
export interface ChildProfile {
  id: string;
  name: string;
  age: number;               // 3, 4, 5, or 6
  traditions: string[];      // multi-select: ["hindu", "christian-catholic"]
  region: string;            // "us" | "india" | "uk" | "global"
  emoji: string;
  birthdays: Birthday[];     // this child's birthday list
}

// A birthday entry (per child profile)
export interface Birthday {
  id: string;
  name: string;              // "Nana Jo"
  month: number;             // 1-12
  day: number;               // 1-31
}

// Activities keyed by "M-D" string (e.g. "3-1" for March 1)
export type ActivityMap = Record<string, DayTheme>;

// Holidays as an array
export type HolidayList = Holiday[];

// Affirmations keyed by "M-D" string
export type AffirmationMap = Record<string, Affirmation>;
