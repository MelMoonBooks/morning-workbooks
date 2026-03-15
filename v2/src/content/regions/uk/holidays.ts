import { HolidayList } from '../../types';

// UK holidays and national observances
// These layer on top of universal + tradition holidays for families in the UK

export const ukHolidays: HolidayList = [
  { date: "01-01", name: "New Year's Day",             tradition: "universal", isMajor: false, sentence: "Happy New Year! A whole new year of adventure awaits!" },
  { date: "01-25", name: "Burns Night",                tradition: "universal", isMajor: false, sentence: "Happy Burns Night! Tonight we celebrate Scotland's famous poet Robert Burns." },
  { date: "02-14", name: "Valentine's Day",            tradition: "universal", isMajor: false, sentence: "Happy Valentine's Day! Today we show love and kindness to everyone." },
  { date: "03-01", name: "St David's Day",             tradition: "universal", isMajor: false, sentence: "Happy St David's Day! Today we celebrate Wales — look for a daffodil!" },
  { date: "03-17", name: "St Patrick's Day",           tradition: "universal", isMajor: false, sentence: "Happy St Patrick's Day! Wear something green today!" },
  { date: "04-23", name: "St George's Day",            tradition: "universal", isMajor: false, sentence: "Happy St George's Day! Today we celebrate England." },
  { date: "05-05", name: "Early May Bank Holiday", year: 2026, tradition: "universal", isMajor: false, sentence: "It's a bank holiday! Enjoy a day off with your family." },
  { date: "05-25", name: "Spring Bank Holiday",    year: 2026, tradition: "universal", isMajor: false, sentence: "Happy Spring Bank Holiday! Time for a picnic in the park." },
  { date: "06-14", name: "Queen's Official Birthday", year: 2026, tradition: "universal", isMajor: false, sentence: "Today we celebrate the Queen's Official Birthday with a parade!" },
  { date: "08-31", name: "Summer Bank Holiday",    year: 2026, tradition: "universal", isMajor: false, sentence: "It's the Summer Bank Holiday — the last long weekend of summer!" },
  { date: "10-31", name: "Halloween",                  tradition: "universal", isMajor: false, sentence: "Tonight is Halloween! Have fun dressing up and carving pumpkins." },
  { date: "11-05", name: "Bonfire Night",              tradition: "universal", isMajor: false, sentence: "Remember, remember the fifth of November! Time for fireworks and bonfires!" },
  { date: "11-11", name: "Remembrance Day",            tradition: "universal", isMajor: false, sentence: "Today we remember and honour all those who served. We wear a poppy to show we care." },
  { date: "11-30", name: "St Andrew's Day",            tradition: "universal", isMajor: false, sentence: "Happy St Andrew's Day! Today we celebrate Scotland." },
  { date: "12-25", name: "Christmas Day",              tradition: "universal", isMajor: false, sentence: "Happy Christmas! Today we celebrate with family, presents, and Christmas dinner." },
  { date: "12-26", name: "Boxing Day",                 tradition: "universal", isMajor: false, sentence: "Happy Boxing Day! A day for leftovers, walks, and spending time with family." },
  { date: "12-31", name: "Hogmanay / New Year's Eve",  tradition: "universal", isMajor: false, sentence: "Happy Hogmanay! Say goodbye to this year and welcome the new one!" },
];
