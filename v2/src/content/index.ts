import { DayTheme, Holiday, Affirmation, ColoringBook } from './types';

// Theme activities
import { universalActivities } from './themes/universal/activities';
import { christianCatholicActivities } from './themes/christian-catholic/activities';
import { christianProtestantActivities } from './themes/christian-protestant/activities';
import { hinduActivities } from './themes/hindu/activities';
import { jewishActivities } from './themes/jewish/activities';
import { muslimActivities } from './themes/muslim/activities';

// Theme holidays
import { universalHolidays } from './themes/universal/holidays';
import { christianCatholicHolidays } from './themes/christian-catholic/holidays';
import { christianProtestantHolidays } from './themes/christian-protestant/holidays';
import { hinduHolidays } from './themes/hindu/holidays';
import { jewishHolidays } from './themes/jewish/holidays';
import { muslimHolidays } from './themes/muslim/holidays';

// Theme affirmations
import { universalAffirmations } from './themes/universal/affirmations';
import { christianCatholicAffirmations } from './themes/christian-catholic/affirmations';
import { christianProtestantAffirmations } from './themes/christian-protestant/affirmations';
import { hinduAffirmations } from './themes/hindu/affirmations';
import { jewishAffirmations } from './themes/jewish/affirmations';
import { muslimAffirmations } from './themes/muslim/affirmations';

// Region registry (single source of truth for all regions)
import { holidaysByRegion, activitiesByRegion, REGIONS } from './regions/registry';
export { REGIONS } from './regions/registry';
export type { RegionConfig } from './regions/registry';

// Coloring books
import { coloringBooks } from './coloring-books';

import type { ActivityMap, AffirmationMap, HolidayList } from './types';

const activitiesByTradition: Record<string, ActivityMap> = {
  'universal': universalActivities,
  'christian-catholic': christianCatholicActivities,
  'christian-protestant': christianProtestantActivities,
  'hindu': hinduActivities,
  'jewish': jewishActivities,
  'muslim': muslimActivities,
};

const holidaysByTradition: Record<string, HolidayList> = {
  'universal': universalHolidays,
  'christian-catholic': christianCatholicHolidays,
  'christian-protestant': christianProtestantHolidays,
  'hindu': hinduHolidays,
  'jewish': jewishHolidays,
  'muslim': muslimHolidays,
};

const affirmationsByTradition: Record<string, AffirmationMap> = {
  'universal': universalAffirmations,
  'christian-catholic': christianCatholicAffirmations,
  'christian-protestant': christianProtestantAffirmations,
  'hindu': hinduAffirmations,
  'jewish': jewishAffirmations,
  'muslim': muslimAffirmations,
};

// holidaysByRegion and activitiesByRegion are imported from ./regions/registry

function getDominantTradition(
  traditions: string[],
  day: number,
  holidays: Holiday[]
): string {
  // Check for major holiday override first
  const majorHoliday = holidays.find(h => h.isMajor);
  if (majorHoliday) return majorHoliday.tradition;

  // Otherwise cycle through traditions by day
  if (traditions.length === 0) return 'universal';
  return traditions[day % traditions.length];
}

export interface DayContent {
  theme: DayTheme;
  holidays: Holiday[];
  affirmation: Affirmation;
  dominantTradition: string;
  suggestedColoringBooks: ColoringBook[];
}

// Given a child's traditions, region, month, and day — return the complete content for that day
export function getDayContent(
  traditions: string[],
  region: string,
  month: number,
  day: number,
  year: number
): DayContent {
  const dateKey = `${month}-${day}`;
  const dateKeyMM = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Helper: match holiday by date, and by year if the holiday has one
  const matchesDate = (h: Holiday) => h.date === dateKeyMM && (h.year == null || h.year === year);

  // 1. Collect ALL holidays from all selected traditions + region
  const allHolidays: Holiday[] = [];

  // Always include universal holidays
  allHolidays.push(...universalHolidays.filter(matchesDate));

  // Add tradition-specific holidays
  for (const t of traditions) {
    const traditionHolidays = holidaysByTradition[t] ?? [];
    allHolidays.push(...traditionHolidays.filter(matchesDate));
  }

  // Add region holidays
  const regionHolidays = holidaysByRegion[region] ?? [];
  allHolidays.push(...regionHolidays.filter(matchesDate));

  // 2. Determine dominant tradition
  const dominantTradition = getDominantTradition(traditions, day, allHolidays);

  // 3. Start with universal activities for this day
  let theme: DayTheme = universalActivities[dateKey] ?? {
    word: '',
    subject: '',
    instruction: '',
    colorWord: '',
    tags: [],
  };

  // 4. Apply region activity overlay if available
  const regionActivities = activitiesByRegion[region];
  if (regionActivities?.[dateKey]) {
    theme = { ...theme, ...regionActivities[dateKey] };
  }

  // 5. Apply dominant tradition's theme overlay
  const traditionActivities = activitiesByTradition[dominantTradition];
  if (traditionActivities?.[dateKey]) {
    theme = { ...theme, ...traditionActivities[dateKey] };
  }

  // 6. If a major holiday has a theme override, apply it
  const majorHoliday = allHolidays.find(h => h.isMajor && h.theme);
  if (majorHoliday?.theme) {
    theme = { ...theme, ...majorHoliday.theme };
  }

  // 7. Select affirmation from dominant tradition (fall back to universal)
  const traditionAffirmations = affirmationsByTradition[dominantTradition];
  const affirmation: Affirmation = traditionAffirmations?.[dateKey]
    ?? universalAffirmations[dateKey]
    ?? { quote: '', ref: '', tradition: 'universal' };

  // 8. Find suggested coloring books matching traditions + current month
  const suggestedColoringBooks = coloringBooks.filter(book =>
    book.months.includes(month) &&
    book.traditions.some(t => traditions.includes(t) || t === 'universal') &&
    (book.regions.includes(region) || book.regions.includes('global'))
  );

  return {
    theme,
    holidays: allHolidays,
    affirmation,
    dominantTradition,
    suggestedColoringBooks,
  };
}
