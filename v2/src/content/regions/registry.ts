import type { ActivityMap, HolidayList } from '../types';

// ── Region Registry ──
// To add a new region:
// 1. Create a folder: src/content/regions/{region-id}/
// 2. Add holidays.ts and optionally activities.ts
// 3. Import them here and add an entry to REGIONS
//
// That's it — getDayContent(), ProfileModal, and LandingPage all read from this registry.

export interface RegionConfig {
  id: string;
  label: string;           // display name
  flag: string;            // emoji flag for UI
  holidays: HolidayList;
  activities: ActivityMap;  // empty {} if no region-specific activities
}

// ── Imports ──
import { usHolidays } from './us/holidays';
import { indiaHolidays } from './india/holidays';
import { indiaActivities } from './india/activities';
import { ukHolidays } from './uk/holidays';

// ── Registry ──
// Order here determines display order in UI
export const REGIONS: RegionConfig[] = [
  { id: "us",    label: "United States",   flag: "🇺🇸", holidays: usHolidays,    activities: {} },
  { id: "india", label: "India",           flag: "🇮🇳", holidays: indiaHolidays,  activities: indiaActivities },
  { id: "uk",    label: "United Kingdom",  flag: "🇬🇧", holidays: ukHolidays,     activities: {} },
];

// Convenience lookups used by getDayContent()
export const holidaysByRegion: Record<string, HolidayList> = Object.fromEntries(
  REGIONS.map(r => [r.id, r.holidays])
);

export const activitiesByRegion: Record<string, ActivityMap> = Object.fromEntries(
  REGIONS.map(r => [r.id, r.activities])
);
