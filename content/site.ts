export const SITE = {
  name: "Victorian Casino",
  tagline: "Montana Style Gambling at Its Best.",
  subtagline: "Whitefish, Montana — Open 7 Days a Week",
  address: "6550 Hwy 93 S Suite 104, Whitefish MT 59937",
  addressNote: "In the same building as Dairy Queen",
  phone: "(406) 862-6692",
  email: "info@victoriancasinowhitefish.com",
  hours: {
    weekdays: "Sun–Thu: 8am – 1am",
    weekends: "Fri–Sat: 8am – 2am",
  },
  googleMapsEmbed:
    "https://maps.google.com/maps?q=6550+Hwy+93+S+Suite+104,+Whitefish,+MT+59937&output=embed",
} as const;

export const MENU = {
  drinks: {
    title: "Beer & Wine",
    items: [
      "Domestic Bottles",
      "Import Bottles",
      "Local Craft Cans",
      "House Red & White Wine",
      "Rosé",
    ],
  },
  food: {
    title: "Food & Snacks",
    items: [
      { name: "Hot Dogs", available: "Daily" },
      { name: "Nachos", available: "Daily" },
      { name: "Soup", available: "Monday & Friday" },
      { name: "Assorted Packaged Snacks", available: "Daily" },
      { name: "Candy & Nuts", available: "Daily" },
    ],
  },
} as const;

export const GAMING = {
  headline: "20 Gaming Machines",
  description:
    "Victorian Casino features 20 Montana-licensed gaming machines — video poker, keno, and slots. Montana-style gaming is legal, regulated, and straightforward: you play, you win, you cash out. No live poker tables, no high-pressure environment. Just a relaxed, welcoming lounge where locals and visitors alike can enjoy a drink and try their luck.",
  firstTimerNote:
    "First time? Our staff will walk you through everything. Montana gaming is easy to pick up and genuinely fun.",
} as const;

export const CATERING = {
  headline: "Victorian Catering",
  subheadline: "Serving the Flathead Valley",
  description:
    "Licensed event catering for corporate events, private parties, weddings, and outdoor gatherings across the Flathead Valley. We bring the Victorian experience to your event — quality food, professional service, and a touch of Montana hospitality.",
  eventTypes: [
    "Corporate Event",
    "Private Party",
    "Wedding",
    "Outdoor Gathering",
    "Birthday Party",
    "Holiday Party",
    "Other",
  ],
} as const;

export const TAXI = {
  headline: "Arrive in Style",
  subheadline: "Complimentary Pickup for VIP Guests",
  description:
    "Planning a night out at Victorian Casino? We're building a premium pickup and drop-off service for our VIP guests. Arrive in comfort, skip the parking. Reservation and deposit required. Express interest below and we'll be in touch.",
} as const;
