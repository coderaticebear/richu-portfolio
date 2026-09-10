import type {
  Credential,
  EducationEntry,
  ExperienceEntry,
  Project,
  SkillGroup,
} from "./types";

export const contact = {
  location: "Toronto, ON",
  email: "richuthankachan96@gmail.com",
  phone: "+1 (249) 876-5856",
  linkedin: "https://www.linkedin.com/in/richu-thankachan",
  resumeHref: "/resume.pdf",
};

export const roles = [
  "Technical Support Engineer",
  "Full-Stack Developer",
  "SaaS Troubleshooter",
];

export const summaryShort =
  "Technical Support Engineer with 3+ years resolving complex SaaS, network, and application issues for 1,000+ end-users — backed by a hands-on software development background in React, Node.js, and SQL. Currently expanding ITIL and Azure credentials to move deeper into Tier 2/3 SaaS environments.";

export const summaryFull =
  "Technical Support Engineer with 3+ years resolving complex SaaS, network, and application issues for 1,000+ end-users, applying a structured troubleshooting methodology (intake, reproduce, isolate, escalate) backed by a hands-on software development background in React, Node.js, and SQL databases. Proven track record improving SLA compliance, first-call resolution, and release quality — currently expanding ITIL and Azure cloud credentials to support Tier 2/3 SaaS environments.";

export const metrics = [
  { value: 1000, suffix: "+", label: "end-users supported" },
  { value: 95, suffix: "%+", label: "SLA compliance" },
  { value: 40, suffix: "%", label: "backend performance improvement" },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Technical Support & ITSM",
    items: [
      { name: "Tier 1/2/3 Support" },
      { name: "SaaS & Application Support" },
      { name: "Incident Management" },
      { name: "Root Cause Analysis" },
      { name: "SLA Compliance" },
      { name: "UAT" },
      { name: "Release Validation" },
      { name: "Structured Troubleshooting" },
    ],
  },
  {
    label: "Documentation & Escalation",
    items: [
      { name: "Bug Reporting" },
      { name: "Log Analysis" },
      { name: "Reproduction Steps" },
      { name: "Knowledge Base Authoring" },
      { name: "Cross-Team Escalation" },
    ],
  },
  {
    label: "Networking",
    items: [
      { name: "TCP/IP" },
      { name: "DNS" },
      { name: "DHCP" },
      { name: "VPN" },
      { name: "Wi-Fi" },
      { name: "Firewalls" },
      { name: "Router Configuration" },
    ],
  },
  {
    label: "Tools & Platforms",
    items: [
      { name: "ServiceNow" },
      { name: "Jira" },
      { name: "Salesforce" },
      { name: "Zendesk" },
      { name: "Notion" },
      { name: "Postman" },
      { name: "Git" },
      { name: "Docker" },
    ],
  },
  {
    label: "Programming & Databases",
    items: [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "React" },
      { name: "Node.js" },
      { name: "PHP" },
      { name: "Python" },
      { name: "Java" },
      { name: "C" },
      { name: ".NET" },
      { name: "SQL" },
      { name: "MySQL" },
      { name: "PostgreSQL" },
      { name: "Oracle" },
      { name: "MongoDB" },
    ],
  },
  {
    label: "Operating Systems",
    items: [
      { name: "Windows" },
      { name: "macOS" },
      { name: "Linux" },
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    company: "Concentrix",
    location: "Toronto, CA",
    role: "Advisor II, Technical Support Engineer",
    period: "Oct 2024 – Present",
    current: true,
    bullets: [
      {
        text: "Provide Tier 1 & Tier 2 technical support for SaaS and enterprise applications, resolving 40–50 tickets per week for 1,000+ end-users while maintaining 95%+ SLA compliance.",
      },
      {
        text: "Diagnose and resolve network-related issues — Wi-Fi, DNS, TCP/IP, DHCP, VPN, and router configuration — impacting device and cloud service connectivity.",
      },
      {
        text: "Analyze system behavior using logs, diagnostics, and reproduction steps; escalate confirmed defects with complete technical context to engineering and senior support teams.",
      },
      {
        text: "Conduct UAT, release validation, and documentation of fixes, identifying 15+ critical issues before production deployment.",
      },
      {
        text: "Create 15+ knowledge base guides and maintain workflow across ServiceNow, Jira, Salesforce, and Notion, improving first-call resolution by 20%.",
      },
    ],
  },
  {
    company: "BuyerFolio",
    location: "Toronto, CA",
    role: "Application Support Analyst (Intern)",
    period: "May 2023 – Aug 2023",
    current: false,
    bullets: [
      {
        text: "Supported SaaS applications for 200+ end-users, resolving login, configuration, and workflow issues while maintaining timely ticket updates.",
      },
      {
        text: "Assisted with API testing and endpoint validation using Postman, and performed SQL queries (MySQL/PostgreSQL) to verify data integrity and troubleshoot backend issues.",
      },
      {
        text: "Conducted log-level troubleshooting and error analysis, contributing to a 20% reduction in repeat incidents.",
      },
      {
        text: "Collaborated with developers and QA teams to reproduce bugs, validate fixes, and ensure smooth application releases.",
      },
    ],
  },
  {
    company: "D'Katia Software Solutions",
    location: "Kerala, IN",
    role: "Software Engineer",
    period: "Aug 2018 – Mar 2021",
    current: false,
    bullets: [
      {
        text: "Designed and optimized MongoDB collections, indexes, and aggregation pipelines, improving backend performance by 40%.",
      },
      {
        text: "Designed secure database schemas, eliminating SQL injection vulnerabilities.",
      },
      {
        text: "Implemented Git workflows, reducing release rollbacks by 40% and increasing release frequency by 25%.",
      },
      {
        text: "Set up Dockerized development environments, cutting onboarding and testing time by 35%.",
      },
    ],
  },
];

// NOTE: only one project was supplied, and it's missing role/outcome/link.
// Those fields are left `null` on purpose — do not invent metrics or a role.
// Replace before shipping: see TODO rendered on the card itself.
export const projects: Project[] = [
  {
    name: "School ERP",
    problem: "An ERP solution for a school.",
    role: null,
    stack: ["Laravel", "PostgreSQL"],
    outcome: null,
    link: null,
    lead: true,
  },
];

export const credentials: Credential[] = [
  {
    name: "ITIL 4 Foundation",
    issuer: "AXELOS / PeopleCert",
    status: "in-progress",
    target: "Oct 2026",
    progress: 55,
  },
  {
    name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    status: "in-progress",
    target: "Nov 2026",
    progress: 35,
  },
];

export const education: EducationEntry[] = [
  {
    school: "Humber College",
    location: "Toronto, ON",
    credential: "Post-Graduate Diploma, Information Technology Solutions",
    period: "Jan 2022 – Aug 2023",
  },
  {
    school: "Mahatma Gandhi University",
    location: "Kerala, IN",
    credential: "B.Tech, Computer Science and Engineering",
    period: "Apr 2014 – Apr 2018",
  },
];

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#credentials", label: "Credentials" },
  { href: "#contact", label: "Contact" },
];
