export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string;
  link: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface ResumeData {
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
    summary: string;
  };
  skills: {
    languages: string;
    frameworks: string;
    toolsAndDatabases: string;
    coreConcepts: string;
  };
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}

export type ResumeTemplateId = "modern" | "classic" | "compact";
export type ResumeAccentColor = "purple" | "blue" | "emerald" | "slate";

export const sampleResumeData: ResumeData = {
  personal: {
    fullName: "Alex Rivera",
    jobTitle: "Software Development Engineer (Full Stack)",
    email: "alex.rivera@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    linkedin: "linkedin.com/in/alex-rivera-dev",
    github: "github.com/alexrivera",
    portfolio: "alexrivera.dev",
    summary:
      "Results-driven Computer Science graduate with hands-on experience in full-stack web development, scalable microservices, and distributed systems. Proficient in Next.js, Python, TypeScript, and AWS. Proven track record of architecting performant apps with 99.9% uptime and optimizing database queries for high-traffic platforms.",
  },
  skills: {
    languages: "Java, Python, TypeScript, JavaScript, C++, SQL",
    frameworks: "React, Next.js, Node.js, Express, Tailwind CSS, Spring Boot",
    toolsAndDatabases: "PostgreSQL, MongoDB, Redis, Docker, Git, AWS (S3, EC2), Supabase",
    coreConcepts: "Data Structures & Algorithms, System Design, REST APIs, Microservices, CI/CD",
  },
  experience: [
    {
      id: "exp-1",
      company: "InnovateTech Solutions",
      role: "Software Engineering Intern",
      location: "Bangalore, India",
      startDate: "Jan 2024",
      endDate: "Jun 2024",
      current: false,
      bullets: [
        "Engineered full-stack analytics dashboards using Next.js 14 and PostgreSQL, reducing query latency by 35% through Redis caching.",
        "Implemented secure JWT authentication and role-based access control (RBAC) handling over 10,000+ daily active user sessions.",
        "Collaborated in Agile sprints with cross-functional engineering teams, writing 85%+ unit test coverage with Jest and Cypress.",
      ],
    },
    {
      id: "exp-2",
      company: "CloudCore Labs",
      role: "Backend Developer Intern",
      location: "Remote",
      startDate: "Jul 2023",
      endDate: "Nov 2023",
      current: false,
      bullets: [
        "Designed and deployed asynchronous REST APIs in Node.js and Express to process high-throughput batch transaction payloads.",
        "Optimized database indexing on PostgreSQL tables with 2M+ records, decreasing average API response times from 420ms to 95ms.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "PlacePrep AI — Placement Training & LMS Platform",
      techStack: "Next.js 15, TypeScript, Tailwind CSS, Supabase, LLM APIs",
      link: "https://placeprep-ai.vercel.app",
      bullets: [
        "Architected an end-to-end LMS platform with real-time AI interview simulator, DSA coding sandbox, and placement readiness tracking.",
        "Constructed custom multi-language code evaluation runner supporting Python, Java, C++, and JavaScript with sub-second execution.",
        "Integrated Web Speech API and Canvas face-mesh proctoring for mock interview assessment simulation.",
      ],
    },
    {
      id: "proj-2",
      title: "Distributed Task Queue & Job Scheduler",
      techStack: "Go, Redis, Docker, PostgreSQL, Prometheus",
      link: "https://github.com/alexrivera/distributed-queue",
      bullets: [
        "Built a fault-tolerant distributed worker queue in Go leveraging Redis Pub/Sub capable of processing 5,000+ jobs/sec.",
        "Implemented exponential backoff retry mechanisms and dead-letter queues to ensure zero payload loss during server disruptions.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "National Institute of Technology (NIT)",
      degree: "Bachelor of Technology",
      field: "Computer Science and Engineering",
      location: "India",
      startDate: "2020",
      endDate: "2024",
      grade: "CGPA: 8.85 / 10.0",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      date: "2024",
    },
    {
      id: "cert-2",
      name: "Meta Certified Front-End Developer",
      issuer: "Meta / Coursera",
      date: "2023",
    },
  ],
};

