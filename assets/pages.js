// Add or update entries here when the site's page structure changes.
// Paths are relative to the root index.html; also update its noscript links.
window.mockupPages = [
  { title: "Home", path: "home.html", displayPath: "/", landingPage: true },
];

window.mockupSections = [
  {
    title: "Candidates",
    pages: [
      { title: "Moving to the EU", path: "candidates/moving-to-the-eu.html", displayPath: "/candidates", landingPage: true },
      { title: "EU Blue Card", path: "candidates/eu-blue-card.html", displayPath: "/candidates/eu-blue-card" },
      { title: "How Indian Degrees Are Recognised in EU Member States", path: "candidates/recognition-of-qualifications.html", displayPath: "/candidates/recognition-of-qualifications" },
      { title: "How legal mobility works", path: "candidates/how-legal-mobility-works.html", displayPath: "/candidates/how-legal-mobility-works", badge: "AI generated" },
      { title: "Know Your Rights", path: "candidates/know-your-rights.html", displayPath: "/candidates/know-your-rights" },
      { title: "Labour Market Test Guide", path: "candidates/labour-market-test.html", displayPath: "/candidates/labour-market-test" },
      { title: "Prepare for your study in Europe: checklist for students", path: "candidates/students-checklist.html", displayPath: "/candidates/students-checklist" },
      { title: "Recruitment red flags checklist", path: "candidates/recruitment-red-flags-checklist.html", displayPath: "/candidates/recruitment-red-flags-checklist" },
      { title: "Visa and Permit Readiness Checklist for Candidates", path: "candidates/visa-readiness-checklist.html", displayPath: "/candidates/visa-readiness-checklist" },
    ],
  },
  {
    title: "Employers and HEI",
    id: "employers-heading",
    pages: [
      { title: "For Employers and Higher Education Institutions", path: "employers-and-higher-education/recruiter.html", displayPath: "/employers-and-higher-education", landingPage: true },
      { title: "India's ICT  Pool: A Guide for EU Employers", path: "employers-and-higher-education/indias-ict-pool-a-guide-for-eu-employers.html", displayPath: "/employers-and-higher-education/indias-ict-pool-a-guide-for-eu-employers" },
      { title: "Employer & Agent Obligations", available: false, badge: "Not available" },
      { title: "Onboarding process for Employers", available: false, badge: "Not available" },
    ],
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
      { title: "Glossary", path: "glossary.html", displayPath: "/glossary" },
      { title: "How information is verified", available: false, badge: "Not available" },
      { title: "Accessibility statement", displayPath: "/accessibility-statement", available: false, badge: "Not available" },
      { title: "Privacy and cookies", displayPath: "/privacy-and-cookies", available: false, badge: "Not available" },
      { title: "Legal notice and terms of use", displayPath: "/legal-notice-and-terms-of-use", available: false, badge: "Not available" },
    ],
  },
];
