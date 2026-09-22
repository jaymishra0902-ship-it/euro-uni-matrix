export type UniversityTier = "safe" | "target" | "reach";

export type University = {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  region: string;
  type: string;
  rank: number;
  tuition: number;
  livingCost: number;
  acceptanceRate: number;
  fitScore: number;
  tier: UniversityTier;
  fields: string[];
  languages: string[];
  applicationUrl: string;
  logo: string;
  image: string;
  highlights: string[];
};

const campusImages = [
  "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=85",
];

type UniversityOverride = Omit<Partial<University>, "id"> & {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  region: string;
};

function createUniversity(
  override: UniversityOverride,
  index: number,
): University {
  const { id, name, city, country, countryCode, region, ...rest } = override;
  const initials = name
    .split(" ")
    .filter((part) => part.length > 2)
    .slice(0, 3)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return {
    id,
    name,
    city,
    country,
    countryCode,
    region,
    type: "Public research university",
    rank: 90 + index * 18,
    tuition: 9000,
    livingCost: 13200,
    acceptanceRate: 58,
    fitScore: 82,
    tier: "target",
    fields: ["Computer Science", "Business", "Engineering"],
    languages: ["English", "Local language"],
    applicationUrl: "https://www.google.com/search?q=university+application",
    logo: initials,
    image: campusImages[index % campusImages.length],
    highlights: ["Strong international community", "Research-led teaching"],
    ...rest,
  };
}

export const universities: University[] = [
  createUniversity({ id: "uva", name: "University of Amsterdam", city: "Amsterdam", country: "Netherlands", countryCode: "NL", region: "Western Europe", rank: 55, tuition: 14500, livingCost: 16800, acceptanceRate: 42, fitScore: 86, tier: "target", applicationUrl: "https://www.uva.nl/en/education/masters", logo: "UvA", fields: ["Computer Science", "Data Science", "Economics"], highlights: ["Top 100 global university", "English-taught master's portfolio"] }, 0),
  createUniversity({ id: "tudelft", name: "Delft University of Technology", city: "Delft", country: "Netherlands", countryCode: "NL", region: "Western Europe", rank: 47, tuition: 18500, livingCost: 15000, acceptanceRate: 28, fitScore: 80, tier: "reach", applicationUrl: "https://www.tudelft.nl/en/education/programmes/masters", logo: "TU", fields: ["Computer Science", "Engineering", "Architecture"], highlights: ["Europe's strongest technical ecosystem", "Industry-connected labs"] }, 1),
  createUniversity({ id: "lmu", name: "LMU Munich", city: "Munich", country: "Germany", countryCode: "DE", region: "Western Europe", rank: 32, tuition: 3000, livingCost: 16800, acceptanceRate: 54, fitScore: 91, tier: "safe", applicationUrl: "https://www.lmu.de/en/study/all-degrees-and-programs/", logo: "LMU", fields: ["Computer Science", "AI", "Business"], highlights: ["Low public-university tuition", "Munich tech corridor"] }, 2),
  createUniversity({ id: "tum", name: "Technical University of Munich", city: "Munich", country: "Germany", countryCode: "DE", region: "Western Europe", rank: 37, tuition: 6000, livingCost: 16800, acceptanceRate: 34, fitScore: 88, tier: "target", applicationUrl: "https://www.tum.de/en/studies/degree-programs", logo: "TUM", fields: ["Computer Science", "AI", "Engineering"], highlights: ["Entrepreneurship powerhouse", "High-impact applied research"] }, 3),
  createUniversity({ id: "heidelberg", name: "Heidelberg University", city: "Heidelberg", country: "Germany", countryCode: "DE", region: "Western Europe", rank: 47, tuition: 3000, livingCost: 13200, acceptanceRate: 58, fitScore: 84, tier: "safe", applicationUrl: "https://www.uni-heidelberg.de/en/study", logo: "HU", fields: ["Data Science", "Life Sciences", "Economics"], highlights: ["Oldest university in Germany", "Excellent student support"] }, 4),
  createUniversity({ id: "eth-zurich", name: "ETH Zürich", city: "Zürich", country: "Switzerland", countryCode: "CH", region: "Central Europe", rank: 8, tuition: 1600, livingCost: 26400, acceptanceRate: 27, fitScore: 79, tier: "reach", applicationUrl: "https://ethz.ch/en/studies/master.html", logo: "ETH", fields: ["Computer Science", "AI", "Engineering"], highlights: ["Global STEM leader", "Research at the frontier"] }, 5),
  createUniversity({ id: "epfl", name: "EPFL", city: "Lausanne", country: "Switzerland", countryCode: "CH", region: "Central Europe", rank: 36, tuition: 1700, livingCost: 22800, acceptanceRate: 32, fitScore: 83, tier: "target", applicationUrl: "https://www.epfl.ch/education/master/", logo: "EPFL", fields: ["Computer Science", "Data Science", "Engineering"], highlights: ["Lake Geneva campus", "Deep-tech startup network"] }, 6),
  createUniversity({ id: "oxford", name: "University of Oxford", city: "Oxford", country: "United Kingdom", countryCode: "GB", region: "UK & Ireland", rank: 3, tuition: 36500, livingCost: 18000, acceptanceRate: 17, fitScore: 72, tier: "reach", applicationUrl: "https://www.ox.ac.uk/admissions/graduate", logo: "OX", fields: ["Computer Science", "Economics", "Public Policy"], highlights: ["World-leading tutorial system", "Historic collegiate experience"] }, 7),
  createUniversity({ id: "imperial", name: "Imperial College London", city: "London", country: "United Kingdom", countryCode: "GB", region: "UK & Ireland", rank: 6, tuition: 42500, livingCost: 22800, acceptanceRate: 25, fitScore: 75, tier: "reach", applicationUrl: "https://www.imperial.ac.uk/study/apply/postgraduate/", logo: "ICL", fields: ["Computer Science", "AI", "Engineering"], highlights: ["London innovation hub", "Exceptional STEM outcomes"] }, 8),
  createUniversity({ id: "sorbonne", name: "Sorbonne University", city: "Paris", country: "France", countryCode: "FR", region: "Western Europe", rank: 46, tuition: 3900, livingCost: 15600, acceptanceRate: 49, fitScore: 87, tier: "target", applicationUrl: "https://sciences.sorbonne-universite.fr/en/education", logo: "SU", fields: ["Computer Science", "Mathematics", "Languages"], highlights: ["Central Paris location", "Strong research institutes"] }, 9),
  createUniversity({ id: "saclay", name: "Université Paris-Saclay", city: "Paris", country: "France", countryCode: "FR", region: "Western Europe", rank: 60, tuition: 3800, livingCost: 14400, acceptanceRate: 43, fitScore: 88, tier: "target", applicationUrl: "https://www.universite-paris-saclay.fr/en/admission", logo: "UPS", fields: ["Computer Science", "Physics", "Engineering"], highlights: ["Major research cluster", "Affordable public tuition"] }, 10),
  createUniversity({ id: "bologna", name: "University of Bologna", city: "Bologna", country: "Italy", countryCode: "IT", region: "Southern Europe", rank: 154, tuition: 5200, livingCost: 10800, acceptanceRate: 61, fitScore: 90, tier: "safe", applicationUrl: "https://corsi.unibo.it/2cycle", logo: "UNIBO", fields: ["Computer Science", "Business", "Economics"], highlights: ["World's oldest university", "Flexible fee reductions"] }, 11),
  createUniversity({ id: "polimi", name: "Politecnico di Milano", city: "Milan", country: "Italy", countryCode: "IT", region: "Southern Europe", rank: 123, tuition: 4300, livingCost: 14400, acceptanceRate: 39, fitScore: 86, tier: "target", applicationUrl: "https://www.polimi.it/en/prospective-students", logo: "POLI", fields: ["Engineering", "Architecture", "Design"], highlights: ["Design capital location", "Strong employer network"] }, 12),
  createUniversity({ id: "barcelona", name: "University of Barcelona", city: "Barcelona", country: "Spain", countryCode: "ES", region: "Southern Europe", rank: 165, tuition: 4400, livingCost: 12600, acceptanceRate: 64, fitScore: 88, tier: "safe", applicationUrl: "https://www.ub.edu/web/ub/en/estudis/oferta_formativa/", logo: "UB", fields: ["Computer Science", "Business", "Health Sciences"], highlights: ["Mediterranean student life", "Wide course catalog"] }, 13),
  createUniversity({ id: "ucm", name: "Complutense University of Madrid", city: "Madrid", country: "Spain", countryCode: "ES", region: "Southern Europe", rank: 190, tuition: 4100, livingCost: 12000, acceptanceRate: 67, fitScore: 89, tier: "safe", applicationUrl: "https://www.ucm.es/estudios/master", logo: "UCM", fields: ["Computer Science", "Economics", "Social Sciences"], highlights: ["Large global alumni network", "Accessible capital city"] }, 14),
  createUniversity({ id: "trinity", name: "Trinity College Dublin", city: "Dublin", country: "Ireland", countryCode: "IE", region: "UK & Ireland", rank: 87, tuition: 22000, livingCost: 18000, acceptanceRate: 41, fitScore: 84, tier: "target", applicationUrl: "https://www.tcd.ie/courses/postgraduate/", logo: "TCD", fields: ["Computer Science", "Business", "Engineering"], highlights: ["English-speaking EU base", "Strong tech employers"] }, 15),
  createUniversity({ id: "ucd", name: "University College Dublin", city: "Dublin", country: "Ireland", countryCode: "IE", region: "UK & Ireland", rank: 126, tuition: 19500, livingCost: 18000, acceptanceRate: 55, fitScore: 86, tier: "safe", applicationUrl: "https://www.ucd.ie/courses/masters/", logo: "UCD", fields: ["Computer Science", "Business", "Data Science"], highlights: ["Modern suburban campus", "Large international intake"] }, 16),
  createUniversity({ id: "copenhagen", name: "University of Copenhagen", city: "Copenhagen", country: "Denmark", countryCode: "DK", region: "Nordics", rank: 107, tuition: 0, livingCost: 17400, acceptanceRate: 46, fitScore: 86, tier: "target", applicationUrl: "https://studies.ku.dk/masters/", logo: "UCPH", fields: ["Computer Science", "Life Sciences", "Economics"], highlights: ["Tuition-free for EU students", "Sustainable city living"] }, 17),
  createUniversity({ id: "aarhus", name: "Aarhus University", city: "Aarhus", country: "Denmark", countryCode: "DK", region: "Nordics", rank: 143, tuition: 0, livingCost: 14400, acceptanceRate: 59, fitScore: 88, tier: "safe", applicationUrl: "https://masters.au.dk/", logo: "AU", fields: ["Computer Science", "Business", "Engineering"], highlights: ["Research-rich student city", "Tuition-free for EU students"] }, 18),
  createUniversity({ id: "oslo", name: "University of Oslo", city: "Oslo", country: "Norway", countryCode: "NO", region: "Nordics", rank: 117, tuition: 0, livingCost: 19200, acceptanceRate: 52, fitScore: 87, tier: "target", applicationUrl: "https://www.uio.no/english/studies/programmes/", logo: "UiO", fields: ["Computer Science", "Data Science", "Social Sciences"], highlights: ["No tuition at public university", "Nature at the doorstep"] }, 19),
  createUniversity({ id: "kth", name: "KTH Royal Institute of Technology", city: "Stockholm", country: "Sweden", countryCode: "SE", region: "Nordics", rank: 73, tuition: 15500, livingCost: 16800, acceptanceRate: 38, fitScore: 85, tier: "target", applicationUrl: "https://www.kth.se/en/studies/master", logo: "KTH", fields: ["Computer Science", "Engineering", "AI"], highlights: ["Nordic innovation network", "Strong English-taught offer"] }, 20),
  createUniversity({ id: "lund", name: "Lund University", city: "Lund", country: "Sweden", countryCode: "SE", region: "Nordics", rank: 75, tuition: 14500, livingCost: 13200, acceptanceRate: 47, fitScore: 89, tier: "target", applicationUrl: "https://www.lunduniversity.lu.se/admissions", logo: "LU", fields: ["Computer Science", "Business", "Engineering"], highlights: ["Compact student city", "Global exchange community"] }, 21),
  createUniversity({ id: "helsinki", name: "University of Helsinki", city: "Helsinki", country: "Finland", countryCode: "FI", region: "Nordics", rank: 117, tuition: 13000, livingCost: 15600, acceptanceRate: 44, fitScore: 87, tier: "target", applicationUrl: "https://www.helsinki.fi/en/admissions-and-education", logo: "UH", fields: ["Computer Science", "Data Science", "Life Sciences"], highlights: ["AI and digital society research", "Safe, highly livable capital"] }, 22),
  createUniversity({ id: "vienna", name: "University of Vienna", city: "Vienna", country: "Austria", countryCode: "AT", region: "Central Europe", rank: 137, tuition: 1500, livingCost: 13200, acceptanceRate: 62, fitScore: 91, tier: "safe", applicationUrl: "https://studieren.univie.ac.at/en/", logo: "UV", fields: ["Computer Science", "Economics", "Humanities"], highlights: ["Affordable European capital", "Broad interdisciplinary offer"] }, 23),
  createUniversity({ id: "kuleuven", name: "KU Leuven", city: "Leuven", country: "Belgium", countryCode: "BE", region: "Western Europe", rank: 61, tuition: 7000, livingCost: 13200, acceptanceRate: 49, fitScore: 88, tier: "target", applicationUrl: "https://www.kuleuven.be/english/education", logo: "KU", fields: ["Computer Science", "Engineering", "Business"], highlights: ["Europe-wide research partnerships", "Classic university town"] }, 24),
  createUniversity({ id: "charles", name: "Charles University", city: "Prague", country: "Czechia", countryCode: "CZ", region: "Central Europe", rank: 246, tuition: 6000, livingCost: 10800, acceptanceRate: 68, fitScore: 90, tier: "safe", applicationUrl: "https://cuni.cz/UKEN-1.html", logo: "CU", fields: ["Computer Science", "Medicine", "Economics"], highlights: ["Historic Prague setting", "Competitive cost of living"] }, 25),
  createUniversity({ id: "warsaw", name: "University of Warsaw", city: "Warsaw", country: "Poland", countryCode: "PL", region: "Central Europe", rank: 258, tuition: 4000, livingCost: 8400, acceptanceRate: 73, fitScore: 92, tier: "safe", applicationUrl: "https://rekrutacja.uw.edu.pl/en/", logo: "UW", fields: ["Computer Science", "Business", "Economics"], highlights: ["Strong value for money", "Fast-growing tech scene"] }, 26),
  createUniversity({ id: "el-te", name: "Eötvös Loránd University", city: "Budapest", country: "Hungary", countryCode: "HU", region: "Central Europe", rank: 320, tuition: 6500, livingCost: 9000, acceptanceRate: 71, fitScore: 89, tier: "safe", applicationUrl: "https://www.elte.hu/en/degree-programmes", logo: "ELTE", fields: ["Computer Science", "Data Science", "Psychology"], highlights: ["Affordable capital lifestyle", "Established international programs"] }, 27),
  createUniversity({ id: "ljubljana", name: "University of Ljubljana", city: "Ljubljana", country: "Slovenia", countryCode: "SI", region: "Southern Europe", rank: 530, tuition: 4500, livingCost: 9600, acceptanceRate: 70, fitScore: 90, tier: "safe", applicationUrl: "https://www.uni-lj.si/study", logo: "UL", fields: ["Computer Science", "Engineering", "Business"], highlights: ["Green, walkable capital", "Strong regional mobility"] }, 28),
  createUniversity({ id: "zagreb", name: "University of Zagreb", city: "Zagreb", country: "Croatia", countryCode: "HR", region: "Southern Europe", rank: 500, tuition: 3500, livingCost: 8400, acceptanceRate: 74, fitScore: 91, tier: "safe", applicationUrl: "https://www.unizg.hr/homepage/", logo: "UNIZG", fields: ["Computer Science", "Engineering", "Economics"], highlights: ["Low total cost", "Central European access"] }, 29),
  createUniversity({ id: "belgrade", name: "University of Belgrade", city: "Belgrade", country: "Serbia", countryCode: "RS", region: "Eastern Europe", rank: 410, tuition: 4200, livingCost: 7800, acceptanceRate: 76, fitScore: 90, tier: "safe", applicationUrl: "https://www.bg.ac.rs/en/students/", logo: "UB", fields: ["Computer Science", "Engineering", "Architecture"], highlights: ["Growing regional startup scene", "Budget-friendly city"] }, 30),
  createUniversity({ id: "bucharest", name: "University of Bucharest", city: "Bucharest", country: "Romania", countryCode: "RO", region: "Eastern Europe", rank: 601, tuition: 3800, livingCost: 7200, acceptanceRate: 78, fitScore: 92, tier: "safe", applicationUrl: "https://unibuc.ro/e/n/admission/", logo: "UB", fields: ["Computer Science", "Mathematics", "Business"], highlights: ["Excellent affordability", "Large international student base"] }, 31),
  createUniversity({ id: "sofia", name: "Sofia University", city: "Sofia", country: "Bulgaria", countryCode: "BG", region: "Eastern Europe", rank: 680, tuition: 3600, livingCost: 7200, acceptanceRate: 79, fitScore: 91, tier: "safe", applicationUrl: "https://www.uni-sofia.bg/eng", logo: "SU", fields: ["Computer Science", "Business", "Physics"], highlights: ["Low cost EU option", "Mountain access from campus"] }, 32),
  createUniversity({ id: "athens", name: "National and Kapodistrian University of Athens", city: "Athens", country: "Greece", countryCode: "GR", region: "Southern Europe", rank: 450, tuition: 4200, livingCost: 9000, acceptanceRate: 72, fitScore: 88, tier: "safe", applicationUrl: "https://en.uoa.gr/education/", logo: "NKUA", fields: ["Computer Science", "Economics", "Humanities"], highlights: ["Mediterranean student life", "Broad public-university offer"] }, 33),
  createUniversity({ id: "porto", name: "University of Porto", city: "Porto", country: "Portugal", countryCode: "PT", region: "Southern Europe", rank: 278, tuition: 5000, livingCost: 9600, acceptanceRate: 63, fitScore: 89, tier: "safe", applicationUrl: "https://www.up.pt/portal/en/study/", logo: "UP", fields: ["Computer Science", "Engineering", "Architecture"], highlights: ["Strong public university value", "Creative coastal city"] }, 34),
  createUniversity({ id: "tartu", name: "University of Tartu", city: "Tartu", country: "Estonia", countryCode: "EE", region: "Northern Europe", rank: 358, tuition: 7200, livingCost: 8400, acceptanceRate: 65, fitScore: 90, tier: "safe", applicationUrl: "https://ut.ee/en/study", logo: "UT", fields: ["Computer Science", "Data Science", "Robotics"], highlights: ["Digital society leader", "Student-centered tech scene"] }, 35),
  createUniversity({ id: "latvia", name: "University of Latvia", city: "Riga", country: "Latvia", countryCode: "LV", region: "Northern Europe", rank: 600, tuition: 5500, livingCost: 7800, acceptanceRate: 74, fitScore: 88, tier: "safe", applicationUrl: "https://www.lu.lv/en/admission/", logo: "LU", fields: ["Computer Science", "Business", "Physics"], highlights: ["Baltic capital access", "Practical English-taught options"] }, 36),
  createUniversity({ id: "vilnius", name: "Vilnius University", city: "Vilnius", country: "Lithuania", countryCode: "LT", region: "Northern Europe", rank: 473, tuition: 5200, livingCost: 7800, acceptanceRate: 75, fitScore: 90, tier: "safe", applicationUrl: "https://www.vu.lt/en/studies", logo: "VU", fields: ["Computer Science", "Life Sciences", "Business"], highlights: ["Historic old-town campus", "Strong value and mobility"] }, 37),
  createUniversity({ id: "reykjavik", name: "University of Iceland", city: "Reykjavík", country: "Iceland", countryCode: "IS", region: "Nordics", rank: 450, tuition: 600, livingCost: 18000, acceptanceRate: 67, fitScore: 86, tier: "target", applicationUrl: "https://english.hi.is/study", logo: "HI", fields: ["Computer Science", "Engineering", "Earth Sciences"], highlights: ["Small, research-focused environment", "Distinctive Nordic setting"] }, 38),
  createUniversity({ id: "luxembourg", name: "University of Luxembourg", city: "Luxembourg", country: "Luxembourg", countryCode: "LU", region: "Western Europe", rank: 381, tuition: 800, livingCost: 18000, acceptanceRate: 57, fitScore: 88, tier: "target", applicationUrl: "https://www.uni.lu/en/studies/", logo: "UL", fields: ["Computer Science", "Finance", "Data Science"], highlights: ["Trilingual and international", "Direct European institutions access"] }, 39),
  createUniversity({ id: "cyprus", name: "University of Cyprus", city: "Nicosia", country: "Cyprus", countryCode: "CY", region: "Southern Europe", rank: 401, tuition: 7200, livingCost: 9000, acceptanceRate: 64, fitScore: 88, tier: "safe", applicationUrl: "https://www.ucy.ac.cy/students/en/", logo: "UCY", fields: ["Computer Science", "Engineering", "Business"], highlights: ["English-taught graduate options", "Warm Mediterranean climate"] }, 40),
  createUniversity({ id: "malta", name: "University of Malta", city: "Msida", country: "Malta", countryCode: "MT", region: "Southern Europe", rank: 601, tuition: 8500, livingCost: 11400, acceptanceRate: 70, fitScore: 87, tier: "safe", applicationUrl: "https://www.um.edu.mt/courses", logo: "UM", fields: ["Computer Science", "Business", "Media"], highlights: ["English-speaking EU option", "Compact island campus"] }, 41),
  createUniversity({ id: "tbili", name: "Ivane Javakhishvili Tbilisi State University", city: "Tbilisi", country: "Georgia", countryCode: "GE", region: "Eastern Europe", rank: 700, tuition: 3000, livingCost: 7200, acceptanceRate: 78, fitScore: 86, tier: "safe", applicationUrl: "https://www.tsu.ge/en", logo: "TSU", fields: ["Computer Science", "Business", "Social Sciences"], highlights: ["Low living costs", "Bridge between Europe and Asia"] }, 42),
  createUniversity({ id: "sarajevo", name: "University of Sarajevo", city: "Sarajevo", country: "Bosnia and Herzegovina", countryCode: "BA", region: "Eastern Europe", rank: 800, tuition: 2800, livingCost: 6600, acceptanceRate: 81, fitScore: 88, tier: "safe", applicationUrl: "https://www.unsa.ba/en", logo: "UNSA", fields: ["Computer Science", "Engineering", "Economics"], highlights: ["Very low total cost", "Crossroads of regional cultures"] }, 43),
  createUniversity({ id: "tirana", name: "University of Tirana", city: "Tirana", country: "Albania", countryCode: "AL", region: "Southern Europe", rank: 900, tuition: 2600, livingCost: 6600, acceptanceRate: 82, fitScore: 87, tier: "safe", applicationUrl: "https://unitir.edu.al/en/", logo: "UT", fields: ["Computer Science", "Economics", "Social Sciences"], highlights: ["Accessible admissions", "Fast-growing capital"] }, 44),
  createUniversity({ id: "pristina", name: "University of Prishtina", city: "Prishtina", country: "Kosovo", countryCode: "XK", region: "Eastern Europe", rank: 950, tuition: 2200, livingCost: 6000, acceptanceRate: 84, fitScore: 86, tier: "safe", applicationUrl: "https://www.uni-pr.edu/", logo: "UP", fields: ["Computer Science", "Engineering", "Business"], highlights: ["Lowest-cost options in the region", "Young, ambitious tech community"] }, 45),
  createUniversity({ id: "skopje", name: "Ss. Cyril and Methodius University in Skopje", city: "Skopje", country: "North Macedonia", countryCode: "MK", region: "Eastern Europe", rank: 850, tuition: 2600, livingCost: 6000, acceptanceRate: 83, fitScore: 87, tier: "safe", applicationUrl: "https://ukim.edu.mk/en_index.php", logo: "UKIM", fields: ["Computer Science", "Engineering", "Economics"], highlights: ["Affordable capital city", "Regional exchange pathways"] }, 46),
  createUniversity({ id: "moldova", name: "State University of Moldova", city: "Chișinău", country: "Moldova", countryCode: "MD", region: "Eastern Europe", rank: 1000, tuition: 2400, livingCost: 6000, acceptanceRate: 85, fitScore: 85, tier: "safe", applicationUrl: "https://usm.md/?lang=en", logo: "USM", fields: ["Computer Science", "Business", "Languages"], highlights: ["Highly accessible budget", "Central regional location"] }, 47),
  createUniversity({ id: "bratislava", name: "Comenius University Bratislava", city: "Bratislava", country: "Slovakia", countryCode: "SK", region: "Central Europe", rank: 700, tuition: 3900, livingCost: 9000, acceptanceRate: 76, fitScore: 89, tier: "safe", applicationUrl: "https://uniba.sk/en/study/", logo: "CU", fields: ["Computer Science", "Medicine", "Economics"], highlights: ["Central European mobility", "Strong public-university value"] }, 48),
  createUniversity({ id: "istanbul", name: "Istanbul Technical University", city: "Istanbul", country: "Türkiye", countryCode: "TR", region: "Eastern Europe", rank: 470, tuition: 4200, livingCost: 7800, acceptanceRate: 69, fitScore: 86, tier: "target", applicationUrl: "https://www.itu.edu.tr/en", logo: "ITU", fields: ["Computer Science", "Engineering", "Architecture"], highlights: ["Historic technical institution", "International city experience"] }, 49),
];