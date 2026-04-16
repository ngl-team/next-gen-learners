export interface PlayerProfile {
  id: string;
  createdAt: string;
  // Player info
  playerFirstName: string;
  playerLastName: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  position: string;
  secondaryPosition?: string;
  currentClub: string;
  currentLevel: string;
  heightFeet: number;
  heightInches: number;
  weight: number;
  playsHighSchool: boolean;
  highSchoolName?: string;
  graduationYear?: string;
  // Media
  highlightVideoUrl?: string;
  // What they want
  lookingFor: "exploring" | "switching" | "relocating" | "first-club";
  willingToTravel: "10" | "20" | "30" | "45" | "60+";
  targetLevel: string;
  additionalNotes?: string;
  // Parent info
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  city: string;
  state: string;
}

export const positions = [
  "Goalkeeper",
  "Center Back",
  "Left Back",
  "Right Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Left Winger",
  "Right Winger",
  "Striker",
  "Forward",
];

export const currentLevels = [
  "MLS NEXT",
  "ECNL",
  "ECNL Regional League",
  "Girls Academy",
  "EDP",
  "Premier",
  "Travel",
  "Academy",
  "Recreational",
  "High School Only",
  "No Club Currently",
];

export const targetLevels = [
  "MLS NEXT / Highest Possible",
  "ECNL",
  "ECNL Regional League / EDP",
  "Premier / Travel",
  "Recreational",
  "Not Sure - Need Guidance",
];

export const lookingForLabels: Record<string, string> = {
  "exploring": "Exploring options - seeing what else is out there",
  "switching": "Ready to switch - looking for a new club",
  "relocating": "Relocating - moving to a new area",
  "first-club": "First club - looking for the right fit to start",
};
