import { HolidayList } from '../../types';

// US civic holidays and observances
// These layer ON TOP of universal holidays for families in the US region
// Note: Some holidays like 4th of July are already in universal/holidays.ts
// This file adds US-specific ones not in the universal set

export const usHolidays: HolidayList = [
  { date: "01-01", name: "New Year's Day",              tradition: "universal", isMajor: false, sentence: "Happy New Year! A whole new year of adventure awaits!" },
  { date: "01-20", name: "Martin Luther King Jr. Day",  tradition: "universal", isMajor: false, sentence: "Today we honor Dr. King, who dreamed that all people would be treated with kindness and fairness." },
  { date: "02-17", name: "Presidents' Day",             tradition: "universal", isMajor: false, sentence: "Today is Presidents' Day! We remember the leaders who helped build our country." },
  { date: "03-02", name: "Read Across America Day",     tradition: "universal", isMajor: false, sentence: "Grab a book and read! Today we celebrate the joy of reading." },
  { date: "05-05", name: "Cinco de Mayo",               tradition: "universal", isMajor: false, sentence: "Happy Cinco de Mayo! Today we celebrate Mexican culture, music, and delicious food." },
  { date: "05-26", name: "Memorial Day",     year: 2026, tradition: "universal", isMajor: false, sentence: "Today is Memorial Day. We remember the brave people who kept our country safe." },
  { date: "05-25", name: "Memorial Day",     year: 2027, tradition: "universal", isMajor: false, sentence: "Today is Memorial Day. We remember the brave people who kept our country safe." },
  { date: "06-19", name: "Juneteenth",                  tradition: "universal", isMajor: false, sentence: "Today is Juneteenth! We celebrate freedom and remember that all people deserve to be free." },
  { date: "07-04", name: "Independence Day",            tradition: "universal", isMajor: true,  sentence: "Happy 4th of July! Today is America's birthday — flags, parades, and fireworks!" },
  { date: "09-01", name: "Labor Day",        year: 2026, tradition: "universal", isMajor: false, sentence: "Today is Labor Day! We thank all the people who work hard every day." },
  { date: "09-06", name: "Labor Day",        year: 2027, tradition: "universal", isMajor: false, sentence: "Today is Labor Day! We thank all the people who work hard every day." },
  { date: "10-12", name: "Indigenous Peoples' Day",     tradition: "universal", isMajor: false, sentence: "Today we honor the Indigenous peoples who have lived on this land since long ago." },
  { date: "10-31", name: "Halloween",                   tradition: "universal", isMajor: false, sentence: "Tonight is Halloween! Have fun dressing up and being kind to your neighbors." },
  { date: "11-11", name: "Veterans Day",                tradition: "universal", isMajor: false, sentence: "Today is Veterans Day! We say thank you to all who served our country." },
  { date: "11-27", name: "Thanksgiving",     year: 2026, tradition: "universal", isMajor: true,  sentence: "Happy Thanksgiving! Today we think about everything we are grateful for." },
  { date: "11-25", name: "Thanksgiving",     year: 2027, tradition: "universal", isMajor: true,  sentence: "Happy Thanksgiving! Today we think about everything we are grateful for." },
  { date: "12-31", name: "New Year's Eve",              tradition: "universal", isMajor: false, sentence: "Tonight is New Year's Eve! Say thank you for this year and get ready for tomorrow." },
];
