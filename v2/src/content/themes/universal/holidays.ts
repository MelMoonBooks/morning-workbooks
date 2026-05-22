import { HolidayList } from '../../types';

// Universal holidays — apply regardless of faith tradition
// Extracted from v1 HOLIDAYS (entries with "both" key that are civic/secular)

export const universalHolidays: HolidayList = [
  { date: "01-01", name: "New Year's Day",           tradition: "universal", isMajor: false, sentence: "Today is New Year's Day! A brand new year is beginning — what will you do with it?" },
  { date: "01-19", name: "Martin Luther King Jr. Day", tradition: "universal", isMajor: false, sentence: "Today we honor Dr. Martin Luther King Jr., who dreamed that all people would be treated with kindness." },
  { date: "02-14", name: "Valentine's Day",           tradition: "universal", isMajor: false, sentence: "Happy Valentine's Day! Today we celebrate love and kindness for everyone around us." },
  { date: "02-16", name: "Presidents' Day",           tradition: "universal", isMajor: false, sentence: "Today is Presidents' Day! We remember the leaders who helped our country." },
  { date: "03-17", name: "St. Patrick's Day",         tradition: "universal", isMajor: false, sentence: "Today is St. Patrick's Day! Look for something green today." },
  { date: "03-20", name: "First Day of Spring",       tradition: "universal", isMajor: false, sentence: "Today is the first day of spring! Flowers will start to bloom and the days get warmer." },
  { date: "04-22", name: "Earth Day",                 tradition: "universal", isMajor: false, sentence: "Today is Earth Day! Let's take care of our beautiful planet — pick up litter and hug a tree!" },
  { date: "05-10", name: "Mother's Day",              tradition: "universal", isMajor: false, sentence: "Happy Mother's Day! Today we celebrate all the mamas who love us so much." },
  // Memorial Day is a US-only holiday and floats year-to-year (last Monday of May) —
  // see regions/us/holidays.ts for year-aware entries.
  { date: "06-21", name: "Father's Day",              tradition: "universal", isMajor: false, sentence: "Happy Father's Day! Today we celebrate all the dads and grandpas who love us." },
  { date: "06-19", name: "Juneteenth",                tradition: "universal", isMajor: false, sentence: "Today is Juneteenth! We celebrate freedom and remember that all people deserve to be free." },
  { date: "07-04", name: "Independence Day",          tradition: "universal", isMajor: true,  sentence: "Happy 4th of July! Today is America's birthday — we celebrate with flags, parades, and fireworks!" },
  { date: "09-07", name: "Labor Day",                 tradition: "universal", isMajor: false, sentence: "Today is Labor Day! We say thank you to all the people who work hard every day." },
  { date: "10-12", name: "Columbus Day",              tradition: "universal", isMajor: false, sentence: "Today is Columbus Day. We remember the explorers who crossed the ocean long ago." },
  { date: "10-31", name: "Halloween",                 tradition: "universal", isMajor: false, sentence: "Tonight is Halloween! Have fun dressing up and being kind to your neighbors." },
  { date: "11-11", name: "Veterans Day",              tradition: "universal", isMajor: false, sentence: "Today is Veterans Day! We say thank you to the brave people who kept our country safe." },
  { date: "11-26", name: "Thanksgiving",              tradition: "universal", isMajor: true,  sentence: "Happy Thanksgiving! Today we think about everything we are grateful for." },
  { date: "12-25", name: "Christmas Day",             tradition: "universal", isMajor: false, sentence: "Merry Christmas! Today families celebrate and share gifts with the people they love." },
  { date: "12-31", name: "New Year's Eve",            tradition: "universal", isMajor: false, sentence: "Tonight is New Year's Eve! Say thank you for this year and get ready for tomorrow." },
];
