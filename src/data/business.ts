const address = ["1605 S Sgt Macario Garcia Dr", "Houston, TX 77011"] as const;

export const business = {
  name: "Tamez & Sons Auto Repair Services",
  shortName: "Tamez & Sons",
  category: "Automotive repair and maintenance",
  location: "Houston, Texas",
  address,
  addressStatus: "Reference details — confirm before visiting.",
  phone: "(713) 926-2778",
  phoneHref: "tel:+17139262778",
  phoneStatus: "Reference number — please confirm with the shop.",
  directionsHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Tamez & Sons Auto Repair Services ${address.join(" ")}`,
  )}`,
  reviewSearchHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Tamez & Sons Auto Repair Services ${address.join(" ")}`,
  )}`,
  hours: [
    { days: "Monday – Friday", value: "9:00 AM – 6:00 PM" },
    { days: "Saturday – Sunday", value: "Closed" },
  ],
  hoursStatus:
    "Hours reported in third-party listings; confirm before visiting.",
  reportedFoundingYear: 1982,
  foundingYearVerified: false,
  websiteConceptNotice:
    "Independent website concept. This design is not affiliated with or approved by the business.",
} as const;
