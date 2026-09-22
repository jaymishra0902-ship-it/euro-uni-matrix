export const scholarshipOptions = [
  {
    name: "DAAD Study Scholarships",
    region: "Germany",
    amount: "€850–€1,200 / month",
    fit: "Strong for master's and research-led profiles",
    url: "https://www.daad.de/en/studying-in-germany/scholarships/",
  },
  {
    name: "Erasmus Mundus Joint Masters",
    region: "Europe-wide",
    amount: "Tuition + stipend + travel",
    fit: "Best for multi-country consortium degrees",
    url: "https://erasmus-plus.ec.europa.eu/erasmus-mundus-catalogue",
  },
  {
    name: "Holland Scholarship",
    region: "Netherlands",
    amount: "€5,000 first year",
    fit: "Non-EEA students with strong academic results",
    url: "https://www.studyinnl.org/finances/holland-scholarship",
  },
  {
    name: "Swiss Government Excellence",
    region: "Switzerland",
    amount: "Monthly grant + tuition support",
    fit: "Research and doctoral applicants",
    url: "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html",
  },
];

export const visaPhases = [
  {
    id: "documents",
    phase: "Phase 1",
    title: "Verify documents",
    detail: "Passport, academic records, translations, apostille, and insurance.",
    tasks: ["Passport valid for 12+ months", "Degree certificate translated", "Apostille or legalization checked"],
  },
  {
    id: "funds",
    phase: "Phase 2",
    title: "Prepare proof of funds",
    detail: "Build the financial evidence required for your destination.",
    tasks: ["Tuition plan confirmed", "Living-cost proof identified", "Blocked account or sponsor evidence prepared"],
  },
  {
    id: "appointment",
    phase: "Phase 3",
    title: "Book appointment",
    detail: "Use the official embassy or VFS route for your country of residence.",
    tasks: ["Embassy or VFS jurisdiction confirmed", "Appointment portal bookmarked", "Application packet reviewed"],
  },
  {
    id: "departure",
    phase: "Phase 4",
    title: "Stamp and depart",
    detail: "Track the decision and complete the pre-departure checklist.",
    tasks: ["Decision tracker updated", "Accommodation confirmed", "Arrival and registration plan ready"],
  },
];

export const housingProviders = [
  {
    name: "Studentenwerk",
    coverage: "Germany",
    detail: "Official student residence network with city-by-city availability.",
    url: "https://www.studierendenwerke.de/en/topics/accommodation",
  },
  {
    name: "WG-Gesucht",
    coverage: "Germany and Austria",
    detail: "Room and flat-share listings; never transfer before a verified viewing or contract.",
    url: "https://www.wg-gesucht.de/en/",
  },
  {
    name: "HousingAnywhere",
    coverage: "Europe-wide",
    detail: "Student-oriented rooms and apartments in major university cities.",
    url: "https://housinganywhere.com/",
  },
];

export const applicationRoutes = [
  { region: "Germany", portal: "Uni-Assist", detail: "Central document evaluation for participating universities.", url: "https://www.uni-assist.de/en/" },
  { region: "Netherlands", portal: "Studielink", detail: "National registration route for Dutch higher education.", url: "https://www.studielink.nl/" },
  { region: "Switzerland", portal: "ETH eApply / EPFL Portal", detail: "Apply through the university's own graduate portal.", url: "https://ethz.ch/en/studies/master.html" },
  { region: "Italy", portal: "Universitaly", detail: "Pre-enrolment and visa-support route for Italy.", url: "https://www.universitaly.it/" },
  { region: "Nordics", portal: "UniversityAdmissions.se / Studyinfo.fi", detail: "National application systems for Sweden and Finland.", url: "https://www.universityadmissions.se/intl/start" },
  { region: "UK & Ireland", portal: "UCAS / direct portals", detail: "Central undergraduate route plus direct postgraduate portals.", url: "https://www.ucas.com/" },
];