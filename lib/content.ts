import type {
  ContactPriority,
  Credential,
  EducationEntry,
  ExperienceEntry,
  MethodStep,
  Place,
  PlaceId,
  Project,
  SkillGroup,
} from "./types";

export const contact = {
  location: "Toronto, ON",
  email: "richuthankachan96@gmail.com",
  phone: "+1 (249) 876-5856",
  linkedin: "https://www.linkedin.com/in/richu-thankachan",
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

// The structured troubleshooting method named in the résumé summary
// (intake, reproduce, isolate, escalate), each step described from the
// résumé's own bullets. The "How I work" pipeline animates these.
export const methodology: MethodStep[] = [
  {
    title: "Intake",
    text: "Log who is affected, what they saw and when, then set the priority against the SLA.",
  },
  {
    title: "Reproduce",
    text: "Recreate the problem from the user's steps, the logs, and diagnostics before changing anything.",
  },
  {
    title: "Isolate",
    text: "Narrow it to one layer: the network (DNS, DHCP, VPN, Wi-Fi), the application, or access and configuration.",
  },
  {
    title: "Escalate or resolve",
    text: "Fix it and write it up in the knowledge base, or hand a confirmed defect to engineering with full technical context.",
  },
];

// Map positions for the Experience globe.
export const places: Record<PlaceId, Place> = {
  kerala: { label: "Kerala", lat: 10.0, lon: 76.3 },
  toronto: { label: "Toronto", lat: 43.65, lon: -79.38 },
};

// Shown as the rows of a service status page in About. `service` is the
// row name; the figures are the résumé's own.
export const metrics = [
  { service: "End-user support", value: 1000, suffix: "+", label: "end-users supported" },
  { service: "SLA compliance", value: 95, suffix: "%+", label: "of tickets within SLA" },
  { service: "Backend performance", value: 40, suffix: "%", label: "gained from MongoDB tuning" },
];

export const skillGroups: SkillGroup[] = [
  {
    key: "itsm",
    label: "Technical Support & ITSM",
    items: [
      { name: "Tier 1/2/3 Support" },
      { name: "SaaS & Application Support", short: "SaaS support" },
      { name: "Incident Management" },
      { name: "Root Cause Analysis" },
      { name: "SLA Compliance" },
      { name: "UAT" },
      { name: "Release Validation" },
      { name: "Structured Troubleshooting", short: "Troubleshooting" },
    ],
  },
  {
    key: "docs",
    label: "Documentation & Escalation",
    items: [
      { name: "Bug Reporting" },
      { name: "Log Analysis" },
      { name: "Reproduction Steps", short: "Repro steps" },
      { name: "Knowledge Base Authoring", short: "Knowledge base" },
      { name: "Cross-Team Escalation", short: "Escalation" },
    ],
  },
  {
    key: "net",
    label: "Networking",
    items: [
      { name: "TCP/IP" },
      { name: "DNS" },
      { name: "DHCP" },
      { name: "VPN" },
      { name: "Wi-Fi" },
      { name: "Firewalls" },
      { name: "Router Configuration", short: "Routers" },
    ],
  },
  {
    key: "tools",
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
    key: "code",
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
    key: "os",
    label: "Operating Systems",
    items: [
      { name: "Windows" },
      { name: "macOS" },
      { name: "Linux" },
    ],
  },
];

// How skills relate, for the Skills network map: a ping from one skill
// travels along these links. Grouped by the area each link crosses.
export const skillLinks: [string, string][] = [
  // support practice
  ["Tier 1/2/3 Support", "Incident Management"],
  ["Tier 1/2/3 Support", "SaaS & Application Support"],
  ["Incident Management", "SLA Compliance"],
  ["Incident Management", "Root Cause Analysis"],
  ["Root Cause Analysis", "Structured Troubleshooting"],
  ["Structured Troubleshooting", "Reproduction Steps"],
  ["Structured Troubleshooting", "Log Analysis"],
  ["Log Analysis", "Root Cause Analysis"],
  ["UAT", "Release Validation"],
  ["Bug Reporting", "Reproduction Steps"],
  ["Cross-Team Escalation", "Bug Reporting"],
  ["Cross-Team Escalation", "Incident Management"],
  ["Knowledge Base Authoring", "Tier 1/2/3 Support"],
  // support ↔ tools
  ["Incident Management", "ServiceNow"],
  ["SLA Compliance", "ServiceNow"],
  ["SLA Compliance", "Zendesk"],
  ["Zendesk", "Tier 1/2/3 Support"],
  ["Salesforce", "Zendesk"],
  ["SaaS & Application Support", "Salesforce"],
  ["Bug Reporting", "Jira"],
  ["UAT", "Jira"],
  ["UAT", "Postman"],
  ["Release Validation", "Git"],
  ["Knowledge Base Authoring", "Notion"],
  ["Jira", "Git"],
  ["Git", "Docker"],
  // networking
  ["TCP/IP", "DNS"],
  ["TCP/IP", "DHCP"],
  ["TCP/IP", "VPN"],
  ["TCP/IP", "Firewalls"],
  ["TCP/IP", "Router Configuration"],
  ["DNS", "DHCP"],
  ["Wi-Fi", "Router Configuration"],
  ["Wi-Fi", "DHCP"],
  ["VPN", "Firewalls"],
  ["Router Configuration", "Firewalls"],
  ["Structured Troubleshooting", "TCP/IP"],
  // code and data
  ["JavaScript", "TypeScript"],
  ["TypeScript", "React"],
  ["JavaScript", "React"],
  ["JavaScript", "Node.js"],
  ["Postman", "Node.js"],
  ["Node.js", "MongoDB"],
  ["PHP", "MySQL"],
  ["SQL", "MySQL"],
  ["SQL", "PostgreSQL"],
  ["SQL", "Oracle"],
  ["Python", "SQL"],
  ["Java", "Oracle"],
  ["Java", "C"],
  [".NET", "C"],
  ["SaaS & Application Support", "SQL"],
  ["Docker", "PostgreSQL"],
  // operating systems
  ["Linux", "Windows"],
  ["Windows", "macOS"],
  ["Linux", "macOS"],
  ["Log Analysis", "Linux"],
  ["Log Analysis", "Windows"],
  ["Docker", "Linux"],
  ["Python", "Linux"],
  [".NET", "Windows"],
  ["Windows", "VPN"],
  ["macOS", "Wi-Fi"],
  ["Linux", "Firewalls"],
];

export const experience: ExperienceEntry[] = [
  {
    company: "Concentrix",
    place: "toronto",
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
    place: "toronto",
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
    place: "kerala",
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

// Role/outcome/stack for both pulled from the actual repos and their
// READMEs (github.com/coderaticebear/school_erp and .../leaf-php), not
// invented. Neither project is deployed publicly, so "outcome" describes
// what's actually built and working rather than a fabricated metric.
export const projects: Project[] = [
  {
    name: "School ERP",
    problem:
      "A containerized ERP system for schools — academic years, classes, students, and the relationships between them.",
    role: "Sole developer — planned the schema and architecture, then built the full Laravel backend end to end.",
    stack: ["Laravel", "PostgreSQL", "Docker"],
    outcome:
      "Fully working locally — migrations, seeders, and a Dockerized environment via Laravel Sail. Not yet deployed publicly.",
    link: "https://github.com/coderaticebear/school_erp",
    diagram: "relational",
  },
  {
    name: "Leaf PHP",
    problem:
      "A framework-free PHP microservices toolkit, built to understand how routing, requests, and service separation actually work without a framework doing it for you.",
    role: "Sole developer — designed and built the framework from scratch, including the router, request/response layer, and CLI tooling.",
    stack: ["PHP"],
    outcome:
      "A working custom router, request/response handling, and a CLI to scaffold and serve independent services.",
    link: "https://github.com/coderaticebear/leaf-php",
    diagram: "router",
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

// Priority on the contact "ticket". The code and label go into the email
// subject line so the most time-sensitive messages stand out.
export const contactPriorities: ContactPriority[] = [
  { code: "P1", label: "Urgent hire" },
  { code: "P2", label: "Open role" },
  { code: "P3", label: "Networking" },
  { code: "P4", label: "Just saying hi" },
];

export const navLinks = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#skills", label: "Skills" },
  { href: "#credentials", label: "Credentials" },
  { href: "#contact", label: "Contact" },
];
