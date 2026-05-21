import { HolidayList } from '../../types';

// Indian civic holidays and national observances
// These layer ON TOP of tradition-specific holidays (Diwali, Holi, etc.)
// for families in the India region

export const indiaHolidays: HolidayList = [
  // National civic holidays
  { date: "01-26", name: "Republic Day",            tradition: "universal", isMajor: true,  sentence: "Happy Republic Day! Today we celebrate India's Constitution and the dream of a free nation." },
  { date: "01-14", name: "Makar Sankranti",         tradition: "universal", isMajor: false, sentence: "Happy Makar Sankranti! Time to fly kites and eat til-gul. May your days be sweet!" },
  { date: "01-15", name: "Sankranti continues",     tradition: "universal", isMajor: false, sentence: "It's the second day of the Sankranti festival. Draw a rangoli pattern at your doorstep!" },
  { date: "03-03", name: "Holi in India",           tradition: "universal", isMajor: false, sentence: "All across India today, people throw bright gulal powders, dance, and shout 'Holi hai!' — it's the festival of colors." },
  { date: "03-08", name: "International Women's Day", tradition: "universal", isMajor: false, sentence: "Today we celebrate the strength and beauty of women everywhere." },
  { date: "04-14", name: "Ambedkar Jayanti",        tradition: "universal", isMajor: false, sentence: "Today we remember Dr. B.R. Ambedkar, who fought for justice and equality for all." },
  { date: "05-01", name: "May Day",                 tradition: "universal", isMajor: false, sentence: "Happy Workers' Day! We thank everyone who works hard for their families." },
  { date: "08-15", name: "Independence Day",        tradition: "universal", isMajor: true,  sentence: "Jai Hind! Today we celebrate India's freedom. Let us be proud of our beautiful country." },
  { date: "09-05", name: "Teachers' Day",           tradition: "universal", isMajor: false, sentence: "Happy Teachers' Day! Say thank you to the teachers who help you learn and grow." },
  { date: "10-02", name: "Gandhi Jayanti",          tradition: "universal", isMajor: false, sentence: "Today we remember Mahatma Gandhi, who taught us that truth and love can change the world." },
  { date: "11-14", name: "Children's Day",          tradition: "universal", isMajor: false, sentence: "Happy Children's Day! Today is YOUR special day — play, laugh, and have fun!" },

  // Cultural observances and seasonal symbols
  { date: "02-14", name: "India's National Flower", tradition: "universal", isMajor: false, sentence: "The lotus is India's national flower — it grows beautifully even in muddy water, reminding us to bloom wherever we are." },
  { date: "04-15", name: "Mango season",            tradition: "universal", isMajor: false, sentence: "Mango season is here! The king of fruits is ripe — savor every sweet bite." },
  { date: "05-10", name: "India's National Bird",   tradition: "universal", isMajor: false, sentence: "The peacock is India's national bird. Its colorful feathers and graceful dance bring joy to everyone who sees it." },
  { date: "06-15", name: "Monsoon season",          tradition: "universal", isMajor: false, sentence: "Monsoon season has arrived! The rains cool the earth, fill the rivers, and bring life to the fields. Grab an umbrella!" },
  { date: "07-10", name: "Festival elephants",      tradition: "universal", isMajor: false, sentence: "In Indian festivals, elephants are decorated with colorful paint and ornaments — they are honored as gentle giants." },
  { date: "10-14", name: "Diwali preparations",     tradition: "universal", isMajor: false, sentence: "Diwali is coming soon! Families clean their homes and light diyas to welcome Lakshmi, the goddess of prosperity." },
  { date: "10-15", name: "Diwali preparations",     tradition: "universal", isMajor: false, sentence: "Hang colorful Diwali lanterns to welcome light and joy into your home." },
  { date: "10-16", name: "Diwali preparations",     tradition: "universal", isMajor: false, sentence: "Draw a beautiful rangoli at your doorstep for Diwali — a colorful welcome to friends and good fortune." },
  { date: "12-15", name: "Chai season",             tradition: "universal", isMajor: false, sentence: "Winter chai is the perfect cozy drink. Spiced with cardamom, ginger, and warmth — every cup is love." },
];
