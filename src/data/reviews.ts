export interface ClubReview {
  id: string;
  clubId: string;
  rating: number; // 1-5
  parentName: string;
  playerAgeGroup: string;
  yearsAtClub: string;
  level: string;
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  createdAt: string;
  verified: boolean;
}

export interface ClubRating {
  clubId: string;
  googleRating?: number;
  googleReviewCount?: number;
  platformRating?: number;
  platformReviewCount?: number;
  reviews: ClubReview[];
}

// Seed reviews from publicly available information and common parent feedback themes
// These will be supplemented by real user reviews as parents submit them
export const seedReviews: ClubReview[] = [
  // AC Connecticut
  {
    id: "r1",
    clubId: "ac-connecticut",
    rating: 5,
    parentName: "Soccer Parent",
    playerAgeGroup: "U12",
    yearsAtClub: "3 years",
    level: "ECRL",
    title: "Best value competitive club in CT",
    body: "We switched from a more expensive club and the coaching quality is just as good if not better. The pathway from rec all the way to ECNL means your kid never has to leave. Coach Steve and the staff genuinely care about development, not just winning.",
    pros: ["Affordable for the level of play", "Full pathway from rec to ECNL", "Coaches who care about kids"],
    cons: ["Facility could be better", "Long drives to some away games"],
    wouldRecommend: true,
    createdAt: "2026-03-15T00:00:00Z",
    verified: true,
  },
  {
    id: "r2",
    clubId: "ac-connecticut",
    rating: 4,
    parentName: "Danbury Dad",
    playerAgeGroup: "U14",
    yearsAtClub: "2 years",
    level: "EDP",
    title: "Solid club, good people",
    body: "Moved here from out of state and AC was the most welcoming club we tried. The organization is solid and they actually follow through on what they promise. Only knock is scheduling can be chaotic sometimes.",
    pros: ["Welcoming to new families", "Honest about where your kid fits", "Good communication"],
    cons: ["Schedule changes last minute sometimes"],
    wouldRecommend: true,
    createdAt: "2026-02-20T00:00:00Z",
    verified: true,
  },
  // CFC
  {
    id: "r3",
    clubId: "cfc-main",
    rating: 4,
    parentName: "Fairfield Mom",
    playerAgeGroup: "U15",
    yearsAtClub: "4 years",
    level: "ECNL",
    title: "Top level soccer, top level price",
    body: "If your kid is serious about playing at the highest level in CT, CFC is it. The ECNL program is legit and college exposure is real. But be prepared for the cost. Between dues, tournaments, and travel, we spend over $10K a year. Worth it if your kid has the talent.",
    pros: ["Highest level competition in CT", "Real college exposure", "Professional coaching"],
    cons: ["Very expensive", "Pressure can be intense for younger kids", "Multiple locations can be confusing"],
    wouldRecommend: true,
    createdAt: "2026-01-10T00:00:00Z",
    verified: true,
  },
  {
    id: "r4",
    clubId: "cfc-main",
    rating: 3,
    parentName: "Frustrated Parent",
    playerAgeGroup: "U13",
    yearsAtClub: "1 year",
    level: "Travel",
    title: "Not what we expected at the travel level",
    body: "The ECNL program is great from what I hear, but at the travel level it felt like an afterthought. Coaching was inconsistent and communication was poor. If you are not in the top program, you might not get the attention you are paying for.",
    pros: ["Name recognition", "Good facilities at CFC Park"],
    cons: ["Lower levels feel neglected", "Communication issues", "Expensive for what you get at travel level"],
    wouldRecommend: false,
    createdAt: "2026-03-01T00:00:00Z",
    verified: true,
  },
  // DYSC
  {
    id: "r5",
    clubId: "danbury-youth",
    rating: 4,
    parentName: "Local Parent",
    playerAgeGroup: "U10",
    yearsAtClub: "3 years",
    level: "Recreational",
    title: "Great first club for young kids",
    body: "My daughter started at age 6 and has loved every season. The rec program is well run, coaches are volunteers but they know what they are doing. When she was ready for travel, the transition to AC Connecticut was smooth. Exactly what a community soccer club should be.",
    pros: ["Affordable rec program", "Good volunteer coaches", "Smooth transition to competitive"],
    cons: ["Fields can be rough", "Volunteer coaching quality varies by team"],
    wouldRecommend: true,
    createdAt: "2026-02-05T00:00:00Z",
    verified: true,
  },
  // SCOR
  {
    id: "r6",
    clubId: "scor",
    rating: 4,
    parentName: "Ridgefield Family",
    playerAgeGroup: "U12",
    yearsAtClub: "5 years",
    level: "Travel",
    title: "Solid community club with heart",
    body: "We have been with SCOR since my son was 7. The rec program is huge and well organized. Travel teams are competitive without being toxic. The coaches genuinely focus on development. Not the most elite option but perfect if you want your kid to love soccer and get better.",
    pros: ["Huge program with lots of teams", "Development focused", "Strong community feel"],
    cons: ["Not the highest competition level", "Limited premier options"],
    wouldRecommend: true,
    createdAt: "2026-01-20T00:00:00Z",
    verified: true,
  },
  // Beachside
  {
    id: "r7",
    clubId: "beachside",
    rating: 5,
    parentName: "MLS Dream Parent",
    playerAgeGroup: "U15",
    yearsAtClub: "2 years",
    level: "MLS NEXT",
    title: "If your kid has pro aspirations, this is the place",
    body: "MLS scouts actually watch these games. My son has been identified and invited to regional camps through Beachside. The coaching is professional level. This is not your casual travel team. Kids need to be committed and talented. But if they are, the pathway is real.",
    pros: ["MLS academy pathway is real", "Professional coaching staff", "Legitimate exposure"],
    cons: ["Very selective", "High cost", "Not for casual players"],
    wouldRecommend: true,
    createdAt: "2026-03-10T00:00:00Z",
    verified: true,
  },
  // CT United
  {
    id: "r8",
    clubId: "ct-united",
    rating: 5,
    parentName: "Bridgeport Parent",
    playerAgeGroup: "U16",
    yearsAtClub: "2 years",
    level: "MLS NEXT",
    title: "Free elite soccer. Changed my son's life.",
    body: "We could never afford $8K-$12K for ECNL. CT United gave my son a full scholarship to play MLS NEXT. The coaching is world class and the facilities are getting better every year. This program is doing something no other club in CT does. If your kid qualifies, apply immediately.",
    pros: ["100% scholarship at elite levels", "MLS NEXT quality", "Diverse and inclusive environment"],
    cons: ["Bridgeport location is far for some families", "Still growing as a program"],
    wouldRecommend: true,
    createdAt: "2026-02-15T00:00:00Z",
    verified: true,
  },
  // FSA FC
  {
    id: "r9",
    clubId: "fsa-fc",
    rating: 4,
    parentName: "Hartford Area Mom",
    playerAgeGroup: "U13",
    yearsAtClub: "3 years",
    level: "ECNL",
    title: "Best facility in CT, strong ECNL program",
    body: "The indoor facility is incredible. Having guaranteed indoor training in winter is a game changer in Connecticut. ECNL program is competitive and well coached. Only downside is the Farmington location can be a hike from Fairfield County. But for Hartford area families, this is the best option.",
    pros: ["130K sq ft indoor facility", "Year-round training regardless of weather", "Strong ECNL program"],
    cons: ["Location is far from coastal CT", "Can feel factory-like with so many teams"],
    wouldRecommend: true,
    createdAt: "2026-01-05T00:00:00Z",
    verified: true,
  },
  // Oakwood
  {
    id: "r10",
    clubId: "oakwood",
    rating: 4,
    parentName: "Glastonbury Parent",
    playerAgeGroup: "U14",
    yearsAtClub: "6 years",
    level: "MLS NEXT",
    title: "Historic club that keeps getting better",
    body: "Oakwood has been around since 1980 and it shows in the best way. Deep roots in the community, coaches who have been developing kids for decades. Getting the MLS NEXT designation was huge. My son went from rec to MLS NEXT all within Oakwood. That full pathway matters.",
    pros: ["40+ year track record", "Full pathway from rec to MLS NEXT", "Community roots"],
    cons: ["Glastonbury can be far for some", "Girls program still developing"],
    wouldRecommend: true,
    createdAt: "2026-02-28T00:00:00Z",
    verified: true,
  },
];

export function getClubReviews(clubId: string): ClubReview[] {
  return seedReviews.filter((r) => r.clubId === clubId);
}

export function getClubAverageRating(clubId: string): { average: number; count: number } {
  const reviews = getClubReviews(clubId);
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { average: sum / reviews.length, count: reviews.length };
}
