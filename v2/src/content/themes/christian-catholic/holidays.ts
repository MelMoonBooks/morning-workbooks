import { HolidayList } from '../../types';

// Catholic holidays
// Fixed-date holidays have no year field (apply every year)
// Movable holidays (Easter, Advent) have year-specific entries

const holyThursday = {
  name: "Holy Thursday",
  tradition: "christian-catholic" as const,
  isMajor: false,
  sentence: "Tonight is Holy Thursday. Jesus had a special dinner with his friends and showed them how to serve.",
};

const goodFriday = {
  name: "Good Friday",
  tradition: "christian-catholic" as const,
  isMajor: true,
  sentence: "Today is Good Friday. We remember how much Jesus loved us.",
};

const easter = {
  name: "Easter Sunday",
  tradition: "christian-catholic" as const,
  isMajor: true,
  sentence: "He is risen! Today is Easter — the most joyful day of the year. Jesus is alive!",
  theme: { word: "Easter", subject: "the empty tomb", instruction: "Color the Easter scene!", colorWord: "gold", tags: ["easter", "resurrection", "jesus"] },
};

const advent = {
  name: "First Sunday of Advent",
  tradition: "christian-catholic" as const,
  isMajor: false,
  sentence: "Advent begins today! We light the first candle and wait with joy for Jesus to come.",
};

export const christianCatholicHolidays: HolidayList = [
  // ── Fixed-date holidays (every year) ──
  { date: "01-06", name: "Epiphany",          tradition: "christian-catholic", isMajor: false, sentence: "Today is Epiphany! We remember the three wise men who followed the star to find Jesus." },
  { date: "11-01", name: "All Saints' Day",    tradition: "christian-catholic", isMajor: false, sentence: "Today is All Saints' Day! We remember all the holy people who showed us how to love God." },
  { date: "11-02", name: "All Souls' Day",     tradition: "christian-catholic", isMajor: false, sentence: "Today is All Souls' Day. We pray for all our loved ones who are with God in heaven." },
  { date: "12-24", name: "Christmas Eve",      tradition: "christian-catholic", isMajor: false, sentence: "Tonight is Christmas Eve! Tomorrow we celebrate the birth of Jesus." },
  {
    date: "12-25",
    name: "Christmas Day",
    tradition: "christian-catholic",
    isMajor: true,
    sentence: "Today is Christmas Day! This is the day that Jesus was born. Glory to God in the highest!",
    theme: { word: "nativity", subject: "the nativity", instruction: "Color the nativity scene!", colorWord: "gold", tags: ["christmas", "nativity", "jesus", "bethlehem"] },
  },
  { date: "12-26", name: "St. Stephen's Day",  tradition: "christian-catholic", isMajor: false, sentence: "Today is the Feast of St. Stephen, the first person to give his life for following Jesus." },

  // ── Saint feast days & observances (every year, minor — show in header but don't override theme) ──
  { date: "01-01", name: "Solemnity of Mary",        tradition: "christian-catholic", isMajor: false, sentence: "Today is the Solemnity of Mary, Mother of God — the very first feast day of the year! We honor Mary who said yes to God." },
  { date: "01-28", name: "St. Thomas Aquinas",       tradition: "christian-catholic", isMajor: false, sentence: "Today we remember St. Thomas Aquinas, a great teacher who showed us that faith and reason go together." },
  { date: "02-01", name: "St. Brigid of Kildare",    tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Brigid, who shared everything she had with the poor and filled Ireland with kindness." },
  { date: "02-14", name: "St. Valentine",             tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Valentine, a priest who showed great love and courage. He reminds us that love is the greatest gift from God." },
  { date: "02-11", name: "Our Lady of Lourdes",      tradition: "christian-catholic", isMajor: false, sentence: "Today we remember Our Lady of Lourdes. Mary appeared to a girl named Bernadette and asked her to pray." },
  { date: "03-17", name: "St. Patrick",              tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Patrick, who brought the light of faith to Ireland and taught about the Holy Trinity." },
  { date: "03-19", name: "St. Joseph",               tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Joseph, the foster father of Jesus — a quiet, faithful man who protected his family." },
  { date: "03-25", name: "The Annunciation",         tradition: "christian-catholic", isMajor: false, sentence: "Today we celebrate the Annunciation — the day the angel Gabriel told Mary she would be the mother of Jesus, and she said yes!" },
  { date: "04-29", name: "St. Catherine of Siena",   tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Catherine of Siena, a brave woman who spoke the truth and helped the whole Church." },
  { date: "05-01", name: "St. Joseph the Worker",    tradition: "christian-catholic", isMajor: false, sentence: "Today we honor St. Joseph the Worker, who teaches us that all honest work is holy in God's eyes." },
  { date: "05-13", name: "Our Lady of Fatima",       tradition: "christian-catholic", isMajor: false, sentence: "Today we remember Our Lady of Fatima. Mary appeared to three children and asked the world to pray for peace." },
  { date: "05-30", name: "St. Joan of Arc",          tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Joan of Arc, a courageous young girl who listened to God's voice and was not afraid." },
  { date: "06-13", name: "St. Anthony of Padua",     tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Anthony, the patron saint of lost things. If you lose something, ask St. Anthony to help you find it!" },
  { date: "06-22", name: "St. Thomas More",          tradition: "christian-catholic", isMajor: false, sentence: "Today we remember St. Thomas More, who was brave and chose to follow God even when it was very hard." },
  { date: "06-24", name: "Nativity of St. John the Baptist", tradition: "christian-catholic", isMajor: false, sentence: "Today we celebrate the birth of St. John the Baptist, who prepared the way for Jesus and baptized Him in the river Jordan." },
  { date: "06-29", name: "Sts. Peter and Paul",     tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Peter and St. Paul, two of the greatest apostles who helped build the Church and spread the Good News everywhere." },
  { date: "07-11", name: "St. Benedict",             tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Benedict, who taught that prayer and work together make a beautiful life." },
  { date: "07-22", name: "St. Mary Magdalene",       tradition: "christian-catholic", isMajor: false, sentence: "Today we remember St. Mary Magdalene, who loved Jesus so much that she was the first to see Him risen on Easter morning." },
  { date: "07-25", name: "St. James the Apostle",    tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. James, one of the first apostles to follow Jesus. He reminds us to be bold in our faith." },
  { date: "07-31", name: "St. Ignatius of Loyola",   tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Ignatius, who said we should do everything for the greater glory of God." },
  { date: "08-08", name: "St. Dominic",              tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Dominic, who loved to pray the rosary and shared God's word with everyone he met." },
  { date: "08-11", name: "St. Clare of Assisi",      tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Clare, a friend of St. Francis who gave up everything to follow Jesus in joy and simplicity." },
  { date: "08-15", name: "Assumption of Mary",       tradition: "christian-catholic", isMajor: false, sentence: "Today we celebrate the Assumption — when Mary, the mother of Jesus, was taken up to heaven body and soul." },
  { date: "08-28", name: "St. Augustine",            tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Augustine, who searched for God for a long time and finally found that God was waiting in his heart all along." },
  { date: "09-05", name: "St. Teresa of Calcutta",   tradition: "christian-catholic", isMajor: false, sentence: "Today we remember Mother Teresa, who showed the whole world that small acts of love can change everything." },
  { date: "09-23", name: "St. Padre Pio",            tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Padre Pio, a holy priest who told us to pray, hope, and don't worry." },
  { date: "09-29", name: "Feast of the Archangels",  tradition: "christian-catholic", isMajor: false, sentence: "Today we celebrate the archangels Michael, Gabriel, and Raphael — God's special messengers who protect and guide us." },
  { date: "10-01", name: "St. Thérèse of Lisieux",   tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of the Little Flower! St. Thérèse showed us that doing small things with great love is the way to heaven." },
  { date: "10-02", name: "Feast of Guardian Angels",  tradition: "christian-catholic", isMajor: false, sentence: "Today we celebrate our guardian angels — each of us has an angel watching over us every moment!" },
  { date: "10-04", name: "St. Francis of Assisi",    tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Francis, who loved all of God's creatures — the birds, the animals, and even Brother Sun and Sister Moon." },
  { date: "10-07", name: "Our Lady of the Rosary",   tradition: "christian-catholic", isMajor: false, sentence: "Today we honor Our Lady of the Rosary. The rosary is like a beautiful garden of prayers to Mary." },
  { date: "10-15", name: "St. Teresa of Ávila",      tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Teresa of Ávila, who taught us that God alone is enough and that prayer is like talking to a friend." },
  { date: "10-22", name: "St. John Paul II",         tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. John Paul II, a pope who traveled the world telling everyone: Be not afraid! God loves you!" },
  { date: "11-03", name: "St. Martin de Porres",     tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Martin de Porres, who was humble and kind and took care of the poor, the sick, and even the animals." },
  { date: "11-22", name: "St. Cecilia",              tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Cecilia, the patron saint of music. She sang to God in her heart always!" },
  { date: "12-06", name: "St. Nicholas",             tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Nicholas, a generous bishop who secretly gave gifts to children and families in need." },
  { date: "12-08", name: "Immaculate Conception",    tradition: "christian-catholic", isMajor: false, sentence: "Today we celebrate the Immaculate Conception — God made Mary full of grace from the very first moment of her life." },
  { date: "12-12", name: "Our Lady of Guadalupe",    tradition: "christian-catholic", isMajor: false, sentence: "Today we honor Our Lady of Guadalupe, who appeared to Juan Diego and showed her love for all of God's children." },
  { date: "12-13", name: "St. Lucy",                 tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. Lucy, whose name means light. She brought hope and light to people in the darkest places." },
  { date: "12-14", name: "St. John of the Cross",    tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. John of the Cross, who taught us that even in dark times, God's love shines brightest." },
  { date: "12-27", name: "St. John the Apostle",    tradition: "christian-catholic", isMajor: false, sentence: "Today is the feast of St. John, the beloved apostle who leaned close to Jesus and taught us that God is love." },
  { date: "12-28", name: "The Holy Innocents",      tradition: "christian-catholic", isMajor: false, sentence: "Today we remember the Holy Innocents, the little children of Bethlehem. We pray for all children everywhere to be safe and loved." },

  // ── 2026 — movable dates ──
  { date: "04-02", year: 2026, ...holyThursday },
  { date: "04-03", year: 2026, ...goodFriday },
  { date: "04-05", year: 2026, ...easter },
  { date: "11-29", year: 2026, ...advent },

  // ── 2027 ──
  { date: "03-25", year: 2027, ...holyThursday },
  { date: "03-26", year: 2027, ...goodFriday },
  { date: "03-28", year: 2027, ...easter },
  { date: "11-28", year: 2027, ...advent },

  // ── 2028 ──
  { date: "04-13", year: 2028, ...holyThursday },
  { date: "04-14", year: 2028, ...goodFriday },
  { date: "04-16", year: 2028, ...easter },
  { date: "12-03", year: 2028, ...advent },

  // ── 2029 ──
  { date: "03-29", year: 2029, ...holyThursday },
  { date: "03-30", year: 2029, ...goodFriday },
  { date: "04-01", year: 2029, ...easter },
  { date: "12-02", year: 2029, ...advent },

  // ── 2030 ──
  { date: "04-18", year: 2030, ...holyThursday },
  { date: "04-19", year: 2030, ...goodFriday },
  { date: "04-21", year: 2030, ...easter },
  { date: "12-01", year: 2030, ...advent },
];
