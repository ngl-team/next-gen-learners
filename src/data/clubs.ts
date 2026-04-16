export type ClubLevel = "ECNL" | "ECRL" | "EDP" | "MLS NEXT" | "Premier" | "Travel" | "Recreational" | "Academy" | "Girls Academy" | "USL2";

export interface Club {
  id: string;
  name: string;
  city: string;
  county: string;
  lat: number;
  lng: number;
  levels: ClubLevel[];
  ageGroups: string;
  costRange: string;
  costMin: number;
  costMax: number;
  website: string;
  phone?: string;
  email?: string;
  description: string;
  notable: string[];
  playerCount?: string;
  founded?: string;
  googleRating?: number;
  googleReviewCount?: number;
  nationalRank?: string;
}

export const clubs: Club[] = [
  {
    id: "ac-connecticut",
    name: "AC Connecticut",
    city: "Newtown",
    county: "Fairfield",
    lat: 41.4140,
    lng: -73.3032,
    levels: ["ECNL", "ECRL", "Travel", "Recreational", "Academy", "USL2"],
    ageGroups: "U4-U19",
    costRange: "$1,500 - $5,500",
    costMin: 1500,
    costMax: 5500,
    website: "https://acconnecticut.com",
    description: "Full pathway club from recreational to ECNL and USL League Two. Partners with Danbury Youth Soccer Club. Known as Connecticut's most affordable comprehensive player pathway.",
    notable: [
      "Only USL League Two franchise in CT",
      "State's most affordable comprehensive pathway",
      "5 State Championships at premier level",
      "National Title in 2019 (U-13 US Club Soccer)",
      "70+ youth teams across all levels"
    ],
    playerCount: "1,500+",
    founded: "2014",
    nationalRank: "ECNL Member"
  },
  {
    id: "cfc-main",
    name: "Connecticut Football Club (CFC)",
    city: "Bethany",
    county: "New Haven",
    lat: 41.4248,
    lng: -72.9918,
    levels: ["ECNL", "ECRL", "EDP", "Premier", "Travel"],
    ageGroups: "U8-U19",
    costRange: "$5,500 - $12,000+",
    costMin: 5500,
    costMax: 12000,
    website: "https://connecticutfootballclub.org",
    description: "Connecticut's largest competitive club network with 10+ branches across the state. Operates CFC Park in Bethany. Multiple regional branches including CFC West (Newtown/Danbury), CFC Arsenal (Northern Fairfield), CFC Chelsea (Stamford), CFC Ole (Trumbull).",
    notable: [
      "State's largest competitive club network",
      "10+ branches across Connecticut",
      "Owns CFC Park training facility in Bethany",
      "Top-tier ECNL programming"
    ],
    playerCount: "3,000+",
    googleRating: 3.4,
    googleReviewCount: 64,
    nationalRank: "#1 Girls Club in CT, #61 nationally (SoccerWire)"
  },
  {
    id: "danbury-youth",
    name: "Danbury Youth Soccer Club (DYSC)",
    city: "Danbury",
    county: "Fairfield",
    lat: 41.4015,
    lng: -73.4540,
    levels: ["Recreational", "Travel", "Premier", "Academy"],
    ageGroups: "U6-U19",
    costRange: "$200 - $3,000",
    costMin: 200,
    costMax: 3000,
    website: "https://clubs.bluesombrero.com/danburyyouthsoccer",
    description: "Danbury's home club. Full pathway from rec through academy level. Partners with AC Connecticut for premier/ECNL pathway. Professional USSF-licensed coaching.",
    notable: [
      "Danbury's primary youth soccer organization",
      "AC Connecticut partnership for upper pathway",
      "USSF-licensed coaching staff"
    ],
    playerCount: "800+"
  },
  {
    id: "scor",
    name: "Soccer Club of Ridgefield (SCOR)",
    city: "Ridgefield",
    county: "Fairfield",
    lat: 41.2812,
    lng: -73.4984,
    levels: ["Recreational", "Travel", "Premier"],
    ageGroups: "U9-U19",
    costRange: "$300 - $3,500",
    costMin: 300,
    costMax: 3500,
    website: "https://scor.org",
    description: "One of Connecticut's largest clubs with over 1,600 players. 103 recreational teams, 22 travel teams, 5 premier teams. Strong community-based program.",
    notable: [
      "1,600+ players",
      "103 recreational teams",
      "22 travel teams, 5 premier teams"
    ],
    playerCount: "1,600+"
  },
  {
    id: "stamford-youth",
    name: "Stamford Youth Soccer League",
    city: "Stamford",
    county: "Fairfield",
    lat: 41.0534,
    lng: -73.5387,
    levels: ["Recreational", "Travel", "Premier"],
    ageGroups: "U4-U19",
    costRange: "$200 - $4,000",
    costMin: 200,
    costMax: 4000,
    website: "https://stamford.soccer",
    description: "Year-round soccer with three seasons: fall, indoor, and spring. Over 2,000 players from house league through premier competitive.",
    notable: [
      "2,000+ players",
      "Year-round programming (fall, indoor, spring)",
      "Multiple competitive levels"
    ],
    playerCount: "2,000+"
  },
  {
    id: "beachside",
    name: "Beachside Soccer Club",
    city: "Norwalk",
    county: "Fairfield",
    lat: 41.1176,
    lng: -73.4082,
    levels: ["MLS NEXT", "Premier", "Academy"],
    ageGroups: "U12-U19",
    costRange: "$5,500 - $12,000+",
    costMin: 5500,
    costMax: 12000,
    website: "https://beachsidesoccer.org",
    description: "Elite development club with MLS NEXT designation. One of only three CT clubs in MLS NEXT. Players are monitored by MLS professional academies for potential signing.",
    notable: [
      "One of 3 CT clubs with MLS NEXT",
      "Direct MLS academy monitoring",
      "Elite player development focus"
    ]
  },
  {
    id: "fusa",
    name: "Fairfield United Soccer Association (FUSA)",
    city: "Fairfield",
    county: "Fairfield",
    lat: 41.1411,
    lng: -73.2637,
    levels: ["Travel", "Premier"],
    ageGroups: "U8-U18",
    costRange: "$1,500 - $4,000",
    costMin: 1500,
    costMax: 4000,
    website: "https://fairfieldunited.com",
    description: "Community-based competitive club. Forms new teams annually through May tryouts. Travel and premier level competition.",
    notable: [
      "Annual tryouts in May",
      "Community-focused development",
      "Travel and premier competition"
    ]
  },
  {
    id: "trumbull-united",
    name: "Soccer Club of Trumbull (Trumbull United)",
    city: "Trumbull",
    county: "Fairfield",
    lat: 41.2429,
    lng: -73.2007,
    levels: ["EDP", "Premier", "Travel"],
    ageGroups: "U8-U19",
    costRange: "$2,000 - $5,000",
    costMin: 2000,
    costMax: 5000,
    website: "https://trumbullunited.com",
    description: "Competitive club with A-teams playing in EDP Premier. Regional tournament play across NJ, MA, NY, and RI.",
    notable: [
      "EDP Premier League competition",
      "Regional tournament play (NJ, MA, NY, RI)",
      "Strong competitive track record"
    ]
  },
  {
    id: "inter-ct",
    name: "Inter Connecticut FC",
    city: "Multiple locations",
    county: "Fairfield",
    lat: 41.2000,
    lng: -73.2000,
    levels: ["Travel", "Premier", "Academy", "Recreational"],
    ageGroups: "U3-U19",
    costRange: "$200 - $5,000",
    costMin: 200,
    costMax: 5000,
    website: "https://interctfc.com",
    description: "Comprehensive pathway club serving multiple towns. Structured progression from Adventure Soccer (youngest) through Pre-Team Academy, Travel, Competitive, and Premier levels.",
    notable: [
      "Full pathway from age 3 through U19",
      "Structured development progression",
      "Multiple location access"
    ]
  },
  {
    id: "ct-united",
    name: "Connecticut United FC (CT United)",
    city: "Bridgeport",
    county: "Fairfield",
    lat: 41.1865,
    lng: -73.1952,
    levels: ["ECNL", "MLS NEXT", "Academy"],
    ageGroups: "U12-U19",
    costRange: "$0 - $5,000",
    costMin: 0,
    costMax: 5000,
    website: "https://ctunited.com",
    description: "The only free youth soccer academy run by a professional team in CT. MLS NEXT Pro partnership. U15-U19 elite levels are 100% scholarship funded.",
    notable: [
      "Only free professional youth academy in CT",
      "100% scholarships at U15-U19 elite level",
      "MLS NEXT Pro partnership",
      "Need-based aid at younger levels"
    ],
    playerCount: "500+"
  },
  {
    id: "norwalk-jsa",
    name: "Norwalk Junior Soccer Association (NJSA)",
    city: "Norwalk",
    county: "Fairfield",
    lat: 41.1176,
    lng: -73.4082,
    levels: ["Recreational", "Travel"],
    ageGroups: "U2-U18",
    costRange: "$200 - $3,500",
    costMin: 200,
    costMax: 3500,
    website: "https://njsa.org",
    description: "Non-profit volunteer-run organization. 2 practices per week plus weekend games. Recreational through travel competition.",
    notable: [
      "Non-profit, volunteer-run",
      "Accessible entry point for young players"
    ]
  },
  {
    id: "greenwich-united",
    name: "Greenwich United Soccer Club",
    city: "Greenwich",
    county: "Fairfield",
    lat: 41.0262,
    lng: -73.6282,
    levels: ["Travel", "Premier"],
    ageGroups: "U12-U19",
    costRange: "$2,000 - $5,000",
    costMin: 2000,
    costMax: 5000,
    website: "https://greenwichunitedsoccer.org",
    description: "Merger of Greenwich Soccer Association and OGRCC Thunder. Travel and premier level competition in lower Fairfield County.",
    notable: [
      "Merger of two established Greenwich programs",
      "Strong lower Fairfield County presence"
    ]
  },
  {
    id: "new-canaan-fc",
    name: "New Canaan FC",
    city: "New Canaan",
    county: "Fairfield",
    lat: 41.1468,
    lng: -73.4950,
    levels: ["EDP", "Travel", "Recreational"],
    ageGroups: "Pre-K - 12th grade",
    costRange: "$300 - $5,000",
    costMin: 300,
    costMax: 5000,
    website: "https://clubs.bluesombrero.com/newcanaan",
    description: "Over 1,000 players from introductory through EDP elite competition. EDP teams play broader Northeast territory with extra practices and games beyond standard travel.",
    notable: [
      "1,000+ players",
      "EDP elite competition",
      "Broad Northeast tournament schedule"
    ],
    playerCount: "1,000+"
  },
  {
    id: "darien-soccer",
    name: "Darien Soccer Association",
    city: "Darien",
    county: "Fairfield",
    lat: 41.0787,
    lng: -73.4693,
    levels: ["Recreational", "Travel"],
    ageGroups: "U6-U18",
    costRange: "$200 - $3,500",
    costMin: 200,
    costMax: 3500,
    website: "https://dariensoccer.org",
    description: "Community soccer program in Darien. CJSA Southwest District member. Recreation through travel level competition.",
    notable: [
      "CJSA Southwest District",
      "Community-focused program"
    ]
  },
  {
    id: "shelton-youth",
    name: "Shelton Youth Soccer Organization (SYSO)",
    city: "Shelton",
    county: "Fairfield",
    lat: 41.2165,
    lng: -73.0932,
    levels: ["Recreational", "Travel", "Academy"],
    ageGroups: "U4-U18",
    costRange: "$200 - $3,500",
    costMin: 200,
    costMax: 3500,
    website: "https://sysonet.org",
    description: "Fall-spring travel seasons with academy development program. Community-based club in the Shelton area.",
    notable: [
      "Academy development program",
      "Fall-spring travel seasons"
    ]
  },
  {
    id: "milford-united",
    name: "Milford United Soccer Club (MUSC)",
    city: "Milford",
    county: "New Haven",
    lat: 41.2224,
    lng: -73.0568,
    levels: ["Recreational", "Travel", "Premier"],
    ageGroups: "U3-U19",
    costRange: "$200 - $4,000",
    costMin: 200,
    costMax: 4000,
    website: "https://musc.org",
    phone: "(203) 722-7425",
    description: "Partnership with Inter CT for premier soccer access. Recreational through premier competition at 167 Cherry St, Milford.",
    notable: [
      "Inter CT partnership for premier access",
      "Full pathway from U3"
    ]
  },
  {
    id: "fsa-fc",
    name: "FSA FC (Farmington Sports Arena)",
    city: "Farmington",
    county: "Hartford",
    lat: 41.7198,
    lng: -72.8320,
    levels: ["ECNL", "ECRL", "Premier", "Travel"],
    ageGroups: "U9-U19",
    costRange: "$3,000 - $12,000+",
    costMin: 3000,
    costMax: 12000,
    website: "https://fsafc.com",
    description: "Elite club with ECNL boys and girls plus ECNL RL. Operates out of 130,000 sq ft indoor facility plus 9 outdoor fields. Strong college placement focus.",
    notable: [
      "130,000 sq ft indoor facility",
      "9 outdoor fields",
      "ECNL Boys and Girls",
      "College pathway focus",
      "Established 2009"
    ],
    googleRating: 4.5,
    googleReviewCount: 310
  },
  {
    id: "oakwood",
    name: "Oakwood Soccer Club",
    city: "Glastonbury",
    county: "Hartford",
    lat: 41.7123,
    lng: -72.6079,
    levels: ["MLS NEXT", "Girls Academy", "EDP", "Academy"],
    ageGroups: "U6-U19",
    costRange: "$3,000 - $8,000+",
    costMin: 3000,
    costMax: 8000,
    website: "https://oakwoodsoccer.com",
    description: "Founded 1980. One of three CT clubs with MLS NEXT designation. Also runs Girls Academy program. Received MLS NEXT Development Grant.",
    notable: [
      "One of 3 CT clubs with MLS NEXT",
      "Girls Academy program",
      "MLS NEXT Development Grant recipient",
      "Founded 1980"
    ],
    playerCount: "500+",
    nationalRank: "#81 nationally (SoccerWire)"
  },
  {
    id: "sporting-ct",
    name: "Sporting CT",
    city: "Middletown",
    county: "Middlesex",
    lat: 41.5623,
    lng: -72.6507,
    levels: ["Premier", "Travel", "Recreational"],
    ageGroups: "U4-U19",
    costRange: "$200 - $5,000",
    costMin: 200,
    costMax: 5000,
    website: "https://sportingct.com",
    phone: "(201) 532-3778",
    email: "Goran@sportingct.com",
    description: "Based at the 395 Country Club Road complex in Middletown. Offers Premier, Competitive, Recreational, and Summer Select programs.",
    notable: [
      "Summer Select program",
      "Full pathway from recreational to premier"
    ]
  },
  {
    id: "cheshire",
    name: "Cheshire Soccer Club",
    city: "Cheshire",
    county: "New Haven",
    lat: 41.4990,
    lng: -72.9008,
    levels: ["Recreational", "Travel", "Premier"],
    ageGroups: "U9-U19",
    costRange: "$300 - $3,500",
    costMin: 300,
    costMax: 3500,
    website: "https://cheshiresoccerclub.org",
    description: "CJSA South Central District club. Professional coaching with recreational through premier competition.",
    notable: [
      "CJSA South Central District",
      "Professional coaching staff"
    ]
  },
  {
    id: "madison-youth",
    name: "Madison Youth Soccer Club (MYSC)",
    city: "Madison",
    county: "New Haven",
    lat: 41.2794,
    lng: -72.5985,
    levels: ["Recreational", "Travel"],
    ageGroups: "U4-U19",
    costRange: "$200 - $3,000",
    costMin: 200,
    costMax: 3000,
    website: "https://madisonyouthsoccerassociation.org",
    description: "600+ players per season. Hosts the annual MIST tournament attracting 5,000 attendees. Community-focused recreational and travel programs.",
    notable: [
      "600+ players per season",
      "Hosts MIST tournament (5,000 attendees)",
      "Strong community presence"
    ],
    playerCount: "600+"
  },
  {
    id: "hamden-soccer",
    name: "Hamden Soccer Association",
    city: "Hamden",
    county: "New Haven",
    lat: 41.3960,
    lng: -72.8968,
    levels: ["Recreational", "Travel"],
    ageGroups: "U6-U15+",
    costRange: "$200 - $3,000",
    costMin: 200,
    costMax: 3000,
    website: "https://hamdensoccer.org",
    description: "CJSA Southern Connecticut District member. Certified coaches. Recreation through travel with local competitive options.",
    notable: [
      "CJSA Southern Connecticut District",
      "Certified coaching staff"
    ]
  },
  {
    id: "guilford",
    name: "Soccer Club of Guilford",
    city: "Guilford",
    county: "New Haven",
    lat: 41.2890,
    lng: -72.6817,
    levels: ["Recreational", "Travel"],
    ageGroups: "U5-U19",
    costRange: "$150 - $3,000",
    costMin: 150,
    costMax: 3000,
    website: "https://guilfordsoccer.org",
    phone: "(203) 996-6568",
    description: "Community club with programs for differently-abled youth. Recent 12U Boys Championship. Recreational through travel competition.",
    notable: [
      "Programs for differently-abled youth",
      "Recent 12U Boys Championship",
      "Inclusive community focus"
    ]
  },
  {
    id: "glastonbury",
    name: "Glastonbury Hartwell Soccer Club (GHSC)",
    city: "Glastonbury",
    county: "Hartford",
    lat: 41.7123,
    lng: -72.6079,
    levels: ["Recreational", "Travel"],
    ageGroups: "U5-U19",
    costRange: "$200 - $3,000",
    costMin: 200,
    costMax: 3000,
    website: "https://glastonburysoccer.org",
    description: "Established 1971. One of CT's longest-running clubs. Technical and tactical development focus.",
    notable: [
      "Established 1971",
      "One of CT's longest-running clubs",
      "Technical/tactical focus"
    ]
  },
  {
    id: "avon",
    name: "Avon Soccer Club",
    city: "Avon",
    county: "Hartford",
    lat: 41.8098,
    lng: -72.8298,
    levels: ["Recreational", "Travel"],
    ageGroups: "U6-U19",
    costRange: "$150 - $3,000",
    costMin: 150,
    costMax: 3000,
    website: "https://avonsoccerclub.org",
    phone: "(860) 673-8782",
    description: "Celebrating 45 years of youth soccer. Approximately 300 players per season. Soccer Heroes program for youngest players.",
    notable: [
      "45+ years serving Avon",
      "~300 players per season",
      "Soccer Heroes introductory program"
    ],
    playerCount: "300+"
  },
  {
    id: "new-milford",
    name: "New Milford Soccer Club",
    city: "New Milford",
    county: "Litchfield",
    lat: 41.5770,
    lng: -73.4085,
    levels: ["Travel", "Premier"],
    ageGroups: "U9-U18",
    costRange: "$1,000 - $3,500",
    costMin: 1000,
    costMax: 3500,
    website: "https://newmilfordsoccer.com",
    description: "Travel and premier competition with pathway to AC Connecticut for higher-level play.",
    notable: [
      "AC Connecticut pathway partnership",
      "Serves greater New Milford area"
    ]
  },
  {
    id: "ridgefield-fc",
    name: "Ridgefield FC",
    city: "Ridgefield",
    county: "Fairfield",
    lat: 41.2812,
    lng: -73.4984,
    levels: ["Travel", "Premier"],
    ageGroups: "U9-U19",
    costRange: "$1,500 - $4,000",
    costMin: 1500,
    costMax: 4000,
    website: "https://ridgefieldfc.com",
    description: "Competitive travel and premier club in Ridgefield. Separate from SCOR, focused on higher-level competitive play.",
    notable: [
      "Competitive-focused program",
      "Premier level competition"
    ]
  },
  {
    id: "hartford-sc",
    name: "Hartford Soccer Club",
    city: "Hartford",
    county: "Hartford",
    lat: 41.7658,
    lng: -72.6734,
    levels: ["Recreational", "Travel"],
    ageGroups: "U3-U16",
    costRange: "$100 - $2,000",
    costMin: 100,
    costMax: 2000,
    website: "https://hartfordsoccerclub.org",
    description: "Non-profit serving Hartford youth. Soccer Basics through travel level. Accessible entry point for city kids.",
    notable: [
      "Non-profit serving Hartford community",
      "Accessible and affordable",
      "City-based youth development"
    ]
  },
  {
    id: "southington",
    name: "Southington Soccer Club",
    city: "Southington",
    county: "Hartford",
    lat: 41.5960,
    lng: -72.8782,
    levels: ["Recreational", "Travel"],
    ageGroups: "U5-U19",
    costRange: "$150 - $3,000",
    costMin: 150,
    costMax: 3000,
    website: "https://southingtonsoccer.org",
    phone: "(860) 637-7803",
    description: "Community club in central CT. Recreational through travel competition.",
    notable: [
      "Central CT location",
      "Community-based program"
    ]
  },
  {
    id: "enfield",
    name: "Enfield Soccer Club",
    city: "Enfield",
    county: "Hartford",
    lat: 41.9762,
    lng: -72.5917,
    levels: ["Recreational", "Academy", "Travel"],
    ageGroups: "U4-U18",
    costRange: "$200 - $3,000",
    costMin: 200,
    costMax: 3000,
    website: "https://enfieldsoccer.net",
    phone: "(860) 676-1161",
    description: "CJSA and US Club Soccer approved. Academy transition programs to bridge recreational players into competitive.",
    notable: [
      "CJSA & US Club Soccer approved",
      "Academy transition programs",
      "Bridges rec to competitive"
    ]
  }
];

export const levels: { value: ClubLevel; label: string; description: string; costRange: string }[] = [
  { value: "MLS NEXT", label: "MLS NEXT", description: "Highest level. Direct pathway to MLS professional academies.", costRange: "$5,500 - $12,000+/yr" },
  { value: "ECNL", label: "ECNL", description: "Elite Clubs National League. Top competitive platform with national exposure.", costRange: "$5,500 - $12,000+/yr" },
  { value: "ECRL", label: "ECNL Regional League", description: "High-level competitive play one step below ECNL.", costRange: "$3,000 - $6,000/yr" },
  { value: "Girls Academy", label: "Girls Academy", description: "Elite development platform for girls.", costRange: "$5,000 - $10,000+/yr" },
  { value: "EDP", label: "EDP", description: "Eastern Development Program. Strong regional competition across the Northeast.", costRange: "$3,000 - $5,500/yr" },
  { value: "Premier", label: "Premier", description: "High-level club competition. More competitive than travel, below ECNL/EDP.", costRange: "$2,500 - $5,000/yr" },
  { value: "Travel", label: "Travel", description: "Competitive team play with regional games and tournaments.", costRange: "$1,500 - $3,500/yr" },
  { value: "Academy", label: "Academy", description: "Development-focused training. Bridge between recreational and competitive.", costRange: "$500 - $2,000/yr" },
  { value: "Recreational", label: "Recreational", description: "Community-based play. Fun, inclusive, low commitment.", costRange: "$150 - $300/yr" },
];

export const counties = ["Fairfield", "New Haven", "Hartford", "Middlesex", "Litchfield"];
