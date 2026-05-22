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
  // isObservance: true → these never appear in the top box on their own.
  // They only show in the bottom box when the day's picture matches.
  { date: "02-14", name: "India's National Flower", tradition: "universal", isMajor: false, isObservance: true, sentence: "The lotus is India's national flower — it grows beautifully even in muddy water, reminding us to bloom wherever we are." },
  { date: "04-15", name: "Mango season",            tradition: "universal", isMajor: false, isObservance: true, sentence: "Mango season is here! The king of fruits is ripe — savor every sweet bite." },
  { date: "05-03", name: "Rangoli at the door",     tradition: "universal", isMajor: false, isObservance: true, sentence: "In India, families draw colorful rangoli patterns at their doorways to welcome guests and good fortune." },
  { date: "05-10", name: "India's National Bird",   tradition: "universal", isMajor: false, isObservance: true, sentence: "The peacock is India's national bird. Its colorful feathers and graceful dance bring joy to everyone who sees it." },
  { date: "05-17", name: "Mango lassi",             tradition: "universal", isMajor: false, isObservance: true, sentence: "Mango lassi is a sweet, cool drink loved across India — perfect for a warm summer day." },
  // Launch-week specials (5-22, 5-23, 5-24)
  { date: "05-22", name: "Marigold garlands",       tradition: "universal", isMajor: false, isObservance: true, sentence: "Marigold garlands called torans are hung at doorways across India to welcome guests and bring good luck." },
  { date: "05-23", name: "Indian thali",            tradition: "universal", isMajor: false, isObservance: true, sentence: "A thali is a round platter with many small dishes — rice, dal, vegetables, bread, and a sweet — all together in one meal." },
  { date: "05-24", name: "Cricket in India",        tradition: "universal", isMajor: false, isObservance: true, sentence: "Cricket is the most-loved sport in India — kids play it in every street and field, dreaming of one day playing for Team India." },
  { date: "05-31", name: "The Indian tricolor",     tradition: "universal", isMajor: false, isObservance: true, sentence: "India's flag has three colors: saffron for courage, white for peace, and green for the land. The blue wheel in the middle is the Ashoka Chakra." },
  { date: "06-07", name: "Music of India",          tradition: "universal", isMajor: false, isObservance: true, sentence: "The tabla and sitar are two famous instruments of India. The tabla keeps the beat, and the sitar makes beautiful melodies." },
  { date: "06-15", name: "Monsoon season",          tradition: "universal", isMajor: false, isObservance: true, sentence: "Monsoon season has arrived! The rains cool the earth, fill the rivers, and bring life to the fields. Grab an umbrella!" },
  { date: "06-22", name: "Auto-rickshaws of India", tradition: "universal", isMajor: false, isObservance: true, sentence: "In Indian cities, bright yellow-and-green auto-rickshaws zip through the streets carrying families everywhere they need to go." },
  { date: "06-28", name: "A cup of chai",           tradition: "universal", isMajor: false, isObservance: true, sentence: "Chai is more than tea in India — it's brewed with spices like cardamom and ginger, and shared with family and friends every day." },
  { date: "07-03", name: "Samosas of India",        tradition: "universal", isMajor: false, isObservance: true, sentence: "Samosas are crispy triangle pastries filled with potatoes and peas — the most-loved snack in India!" },
  { date: "07-07", name: "Indian bangles",          tradition: "universal", isMajor: false, isObservance: true, sentence: "In India, women and girls wear stacks of colorful bangles on their wrists — they jingle softly with every movement." },
  { date: "07-10", name: "Festival elephants",      tradition: "universal", isMajor: false, isObservance: true, sentence: "In Indian festivals, elephants are decorated with colorful paint and ornaments — they are honored as gentle giants." },
  { date: "07-14", name: "Morning yoga",            tradition: "universal", isMajor: false, isObservance: true, sentence: "Yoga began in India and is now practiced all over the world — even kids can do it to start the day strong!" },
  { date: "07-18", name: "Henna patterns",          tradition: "universal", isMajor: false, isObservance: true, sentence: "Henna (mehndi) is a beautiful brown paste used to draw delicate patterns on hands — a tradition for weddings and festivals." },
  { date: "07-22", name: "Kheer — Indian rice pudding", tradition: "universal", isMajor: false, isObservance: true, sentence: "Kheer is a creamy Indian rice pudding made with milk, sugar, cardamom, and saffron — a sweet treat for festivals and celebrations." },
  { date: "07-24", name: "Indian Railways",         tradition: "universal", isMajor: false, isObservance: true, sentence: "Indian Railways is one of the biggest train networks in the world — trains carry millions of people across the country every day." },
  { date: "07-31", name: "Classical Indian dance",  tradition: "universal", isMajor: false, isObservance: true, sentence: "Bharatanatyam is a classical Indian dance — graceful hand gestures and storytelling movements over 2,000 years old!" },
  { date: "10-14", name: "Diwali preparations",     tradition: "universal", isMajor: false, isObservance: true, sentence: "Diwali is coming soon! Families clean their homes and light diyas to welcome Lakshmi, the goddess of prosperity." },
  { date: "10-15", name: "Diwali preparations",     tradition: "universal", isMajor: false, isObservance: true, sentence: "Hang colorful Diwali lanterns to welcome light and joy into your home." },
  { date: "10-16", name: "Diwali preparations",     tradition: "universal", isMajor: false, isObservance: true, sentence: "Draw a beautiful rangoli at your doorstep for Diwali — a colorful welcome to friends and good fortune." },
  { date: "12-15", name: "Chai season",             tradition: "universal", isMajor: false, isObservance: true, sentence: "Winter chai is the perfect cozy drink. Spiced with cardamom, ginger, and warmth — every cup is love." },
];
