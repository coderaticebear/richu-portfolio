export type SkillGroupKey = "itsm" | "docs" | "net" | "tools" | "code" | "os";

export interface SkillGroup {
  key: SkillGroupKey;
  label: string;
  /** `short` is the label on the Skills network map, where space is tight. */
  items: { name: string; short?: string }[];
}

export type PlaceId = "toronto" | "kerala";

export interface Place {
  label: string;
  lat: number;
  lon: number;
}

export interface ExperienceEntry {
  company: string;
  location: string;
  /** Where on the Experience globe this role sits. */
  place: PlaceId;
  role: string;
  period: string;
  current: boolean;
  bullets: { text: string }[];
}

export interface MethodStep {
  title: string;
  text: string;
}

export interface BuildStep {
  title: string;
  text: string;
  /** Public proof for the step, when one exists. */
  artifact?: { label: string; href: string };
}

export interface Project {
  name: string;
  problem: string;
  role: string;
  stack: string[];
  outcome: string;
  link: string | null;
  /** Plain note on how AI was used, shown on the card when set. */
  aiNote?: string;
  /** Which generated diagram the project's case-file header draws. */
  diagram: "relational" | "router";
}

export interface ContactPriority {
  code: string;
  label: string;
}

export interface Credential {
  name: string;
  issuer: string;
  status: "in-progress" | "complete";
  target?: string;
  progress?: number; // 0-100
}

export interface EducationEntry {
  school: string;
  location: string;
  credential: string;
  period: string;
}
