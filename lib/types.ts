export type Persona = "support" | "developer" | "both";

export interface SkillGroup {
  label: string;
  items: { name: string; persona: Persona }[];
}

export interface ExperienceEntry {
  company: string;
  location: string;
  role: string;
  period: string;
  current: boolean;
  bullets: { text: string; persona: Persona }[];
}

export interface Project {
  name: string;
  problem: string;
  role: string | null;
  stack: string[];
  outcome: string | null;
  link: string | null;
  persona: Persona;
  lead?: boolean;
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
