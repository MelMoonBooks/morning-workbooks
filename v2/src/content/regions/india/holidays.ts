import { HolidayList } from '../../types';

// Indian civic holidays and national observances
// These layer ON TOP of tradition-specific holidays (Diwali, Holi, etc.)
// for families in the India region

export const indiaHolidays: HolidayList = [
  { date: "01-26", name: "Republic Day",            tradition: "universal", isMajor: true,  sentence: "Happy Republic Day! Today we celebrate India's Constitution and the dream of a free nation." },
  { date: "01-14", name: "Makar Sankranti",         tradition: "universal", isMajor: false, sentence: "Happy Makar Sankranti! Time to fly kites and eat til-gul. May your days be sweet!" },
  { date: "03-08", name: "International Women's Day", tradition: "universal", isMajor: false, sentence: "Today we celebrate the strength and beauty of women everywhere." },
  { date: "04-14", name: "Ambedkar Jayanti",        tradition: "universal", isMajor: false, sentence: "Today we remember Dr. B.R. Ambedkar, who fought for justice and equality for all." },
  { date: "05-01", name: "May Day",                 tradition: "universal", isMajor: false, sentence: "Happy Workers' Day! We thank everyone who works hard for their families." },
  { date: "08-15", name: "Independence Day",        tradition: "universal", isMajor: true,  sentence: "Jai Hind! Today we celebrate India's freedom. Let us be proud of our beautiful country." },
  { date: "09-05", name: "Teachers' Day",           tradition: "universal", isMajor: false, sentence: "Happy Teachers' Day! Say thank you to the teachers who help you learn and grow." },
  { date: "10-02", name: "Gandhi Jayanti",          tradition: "universal", isMajor: false, sentence: "Today we remember Mahatma Gandhi, who taught us that truth and love can change the world." },
  { date: "11-14", name: "Children's Day",          tradition: "universal", isMajor: false, sentence: "Happy Children's Day! Today is YOUR special day — play, laugh, and have fun!" },
];
