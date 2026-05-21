import { HolidayList } from '../../types';

// Jewish holidays — 2026 Gregorian dates (Hebrew calendar shifts each year)
// Hebrew calendar holidays start at sundown the evening before — the date
// here is the daytime observance day for kids.

export const jewishHolidays: HolidayList = [
  { date: "02-02", name: "Tu B'Shevat",       tradition: "jewish", isMajor: false, sentence: "Happy Tu B'Shevat! Today we celebrate trees and the food they give us." },
  { date: "03-03", name: "Purim",             tradition: "jewish", isMajor: true,  sentence: "Happy Purim! Today we wear costumes, make noise with groggers, and eat sweet hamantaschen cookies." },
  { date: "03-04", name: "Shushan Purim",     tradition: "jewish", isMajor: false, sentence: "It's the second day of Purim — Shushan Purim. We eat more hamantaschen and share food with friends!" },
  { date: "04-01", name: "Passover (first day)", tradition: "jewish", isMajor: true,  sentence: "Happy Passover! Tonight families gather for the seder and remember the story of leaving Egypt." },
  { date: "04-02", name: "Passover",          tradition: "jewish", isMajor: false, sentence: "It's the second day of Passover. We eat matzah and remember our story." },
  { date: "04-09", name: "Last day of Passover", tradition: "jewish", isMajor: false, sentence: "Today is the last day of Passover. Tomorrow we can eat bread again!" },
  { date: "05-05", name: "Lag BaOmer",        tradition: "jewish", isMajor: false, sentence: "Happy Lag BaOmer! Today families have picnics and light bonfires." },
  { date: "05-22", name: "Shavuot",           tradition: "jewish", isMajor: true,  sentence: "Happy Shavuot! Today we celebrate receiving the Torah at Mount Sinai." },
  { date: "05-23", name: "Shavuot (day 2)",   tradition: "jewish", isMajor: false, sentence: "It's the second day of Shavuot. Today we celebrate the seven species — the foods of the land of Israel." },
  { date: "07-23", name: "Tisha B'Av",        tradition: "jewish", isMajor: false, sentence: "Today is Tisha B'Av, a day of remembering the Temples and praying for peace." },
  { date: "09-12", name: "Rosh Hashanah",     tradition: "jewish", isMajor: true,  sentence: "L'shanah tovah! Happy Jewish New Year! Today we blow the shofar and eat apples dipped in honey for a sweet year." },
  { date: "09-13", name: "Rosh Hashanah (day 2)", tradition: "jewish", isMajor: false, sentence: "It's the second day of Rosh Hashanah. May this be a sweet new year for everyone!" },
  { date: "09-21", name: "Yom Kippur",        tradition: "jewish", isMajor: true,  sentence: "Today is Yom Kippur, the Day of Atonement. We think about how to be a better person this year." },
  { date: "09-26", name: "Sukkot (first day)", tradition: "jewish", isMajor: true,  sentence: "Happy Sukkot! Today we build a sukkah and eat meals inside it. Wave the lulav!" },
  { date: "09-27", name: "Sukkot (day 2)",    tradition: "jewish", isMajor: false, sentence: "It's the second day of Sukkot. Wave the lulav and etrog and celebrate the harvest!" },
  { date: "10-03", name: "Hoshana Rabbah",    tradition: "jewish", isMajor: false, sentence: "Today is the last day of Sukkot. We wave the lulav one final time." },
  { date: "10-04", name: "Simchat Torah",     tradition: "jewish", isMajor: true,  sentence: "Happy Simchat Torah! Today we dance with the Torah scrolls and celebrate finishing and starting again." },
  { date: "12-04", name: "Hanukkah (first night)", tradition: "jewish", isMajor: true,  sentence: "Happy Hanukkah! Tonight we light the first candle of the menorah. The miracle of light begins!" },
  { date: "12-05", name: "Hanukkah (day 2)",  tradition: "jewish", isMajor: false, sentence: "Tonight we light two candles for Hanukkah!" },
  { date: "12-06", name: "Hanukkah (day 3)",  tradition: "jewish", isMajor: false, sentence: "Three candles tonight! Spin the dreidel and eat latkes!" },
  { date: "12-07", name: "Hanukkah (day 4)",  tradition: "jewish", isMajor: false, sentence: "Four candles glow tonight. The Hanukkah lights grow brighter each night." },
  { date: "12-08", name: "Hanukkah (day 5)",  tradition: "jewish", isMajor: false, sentence: "Five Hanukkah candles tonight! Maybe time for sufganiyot (jelly donuts)?" },
  { date: "12-09", name: "Hanukkah (day 6)",  tradition: "jewish", isMajor: false, sentence: "Six candles light up the night for Hanukkah!" },
  { date: "12-10", name: "Hanukkah (day 7)",  tradition: "jewish", isMajor: false, sentence: "Seven candles tonight! One more night to go for the full menorah." },
  { date: "12-11", name: "Hanukkah (day 8)",  tradition: "jewish", isMajor: false, sentence: "The last night of Hanukkah! All eight candles plus the shamash — the menorah is fully lit!" },
  { date: "12-12", name: "Hanukkah ends",     tradition: "jewish", isMajor: false, sentence: "Today the menorah candles burn one last time and Hanukkah ends. The miracle of light lives on in our hearts." },
];
