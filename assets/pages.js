// Add or update entries here when the site's page structure changes.
// Paths are relative to the root index.html; also update its noscript links.
window.mockupPages = [
  { title: "Home", path: "home.html", displayPath: "/" },
];

window.mockupSections = [
  {
    title: "Candidates",
    pages: [
      { title: "Moving to the EU", path: "candidates/moving-to-the-eu.html", displayPath: "/candidates" },
      { title: "How legal mobility works", path: "candidates/how-legal-mobility-works.html", displayPath: "/candidates/how-legal-mobility-works" },
      { title: "Visa readiness checklist", path: "candidates/visa-readiness-checklist.html", displayPath: "/candidates/visa-readiness-checklist" },
      { title: "Recruitment red flags checklist", path: "candidates/recruitment-red-flags-checklist.html", displayPath: "/candidates/recruitment-red-flags-checklist" },
      { title: "Recognition of qualifications", path: "candidates/recognition-of-qualifications.html", displayPath: "/candidates/recognition-of-qualifications" },
    ],
  },
  {
    title: "Employers and HEI",
    pages: [],
  },
  {
    title: "Countries",
    pages: [
      {
        title: "Country profiles",
        path: "countries/countries.html",
        displayPath: "/countries",
        children: [
          { title: "Austria", path: "countries/austria.html", displayPath: "/countries/austria" },
          { title: "Estonia", path: "countries/estonia.html", displayPath: "/countries/estonia" },
          { title: "Finland", path: "countries/finland.html", displayPath: "/countries/finland" },
          { title: "France", path: "countries/france.html", displayPath: "/countries/france" },
          { title: "Germany", path: "countries/germany.html", displayPath: "/countries/germany" },
          { title: "Italy", path: "countries/italy.html", displayPath: "/countries/italy" },
          { title: "Latvia", path: "countries/latvia.html", displayPath: "/countries/latvia" },
          { title: "Lithuania", path: "countries/lithuania.html", displayPath: "/countries/lithuania" },
          { title: "The Netherlands", path: "countries/netherlands.html", displayPath: "/countries/netherlands" },
          { title: "Spain", path: "countries/spain.html", displayPath: "/countries/spain" },
        ],
      },
    ],
  },
  {
    title: "About",
    pages: [
      {
        title: "About the European Legal Gateway Office in India",
        path: "about.html",
        displayPath: "/about",
      },
      {
        title: "Frequently asked questions",
        path: "faq.html",
        displayPath: "/faq",
      },
    ],
  },
];
