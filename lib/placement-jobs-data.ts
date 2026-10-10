export interface PlacementJob {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: "Full-Time" | "6-Month Internship" | "Summer Internship" | "Remote";
  salary: string;
  experience: string;
  batch: string[];
  skills: string[];
  postedTime: string;
  deadline: string;
  applyUrl: string;
  description: string;
  isHot?: boolean;
}

export const placementJobsList: PlacementJob[] = [
  {
    id: "job-1",
    title: "Software Development Engineer (SDE-1)",
    company: "Google",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80",
    location: "Bangalore, India",
    type: "Full-Time",
    salary: "₹24 LPA – ₹32 LPA",
    experience: "Fresher / 0-1 Year",
    batch: ["2024", "2025"],
    skills: ["Data Structures", "Algorithms", "C++", "Java", "Python", "System Design"],
    postedTime: "2 hours ago",
    deadline: "30 Oct 2024",
    applyUrl: "https://careers.google.com/jobs",
    description: "Google is hiring SDE-1s to design and develop scalable distributed software systems and modern web infrastructure.",
    isHot: true,
  },
  {
    id: "job-2",
    title: "Graduate Software Engineer (Full Stack)",
    company: "Microsoft",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    location: "Hyderabad, India",
    type: "Full-Time",
    salary: "₹22 LPA – ₹28 LPA",
    experience: "Fresher / 0-1 Year",
    batch: ["2024", "2025"],
    skills: ["TypeScript", "React", "C# / .NET", "Azure", "Distributed Systems"],
    postedTime: "4 hours ago",
    deadline: "28 Oct 2024",
    applyUrl: "https://careers.microsoft.com",
    description: "Join Microsoft Azure and Developer Division to architect world-class cloud developer platforms.",
    isHot: true,
  },
  {
    id: "job-3",
    title: "Software Engineering Intern (Summer 2025)",
    company: "Amazon",
    logo: "https://images.unsplash.com/photo-1523474253246-73be603297a0?w=100&auto=format&fit=crop&q=80",
    location: "Bangalore / Hyderabad",
    type: "Summer Internship",
    salary: "₹80,000 / month + Relocation",
    experience: "Pre-Final Year Students",
    batch: ["2025", "2026"],
    skills: ["Java", "Python", "Object-Oriented Design", "AWS", "Problem Solving"],
    postedTime: "Today",
    deadline: "15 Nov 2024",
    applyUrl: "https://amazon.jobs",
    description: "6-month & summer software internships across AWS, Retail, and Prime Video engineering organizations.",
    isHot: true,
  },
  {
    id: "job-4",
    title: "Associate Software Engineer",
    company: "Atlassian",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80",
    location: "Remote / Bangalore",
    type: "Full-Time",
    salary: "₹26 LPA – ₹34 LPA",
    experience: "Fresher / 0-2 Years",
    batch: ["2024", "2025"],
    skills: ["React", "Node.js", "Java", "GraphQL", "Microservices"],
    postedTime: "1 day ago",
    deadline: "05 Nov 2024",
    applyUrl: "https://www.atlassian.com/company/careers",
    description: "Work on Jira, Confluence, and Loom collaboration engines powering millions of teams globally.",
    isHot: true,
  },
  {
    id: "job-5",
    title: "Frontend Developer (Next.js / React)",
    company: "Uber",
    logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80",
    location: "Hyderabad, India",
    type: "Full-Time",
    salary: "₹20 LPA – ₹27 LPA",
    experience: "0-2 Years",
    batch: ["2023", "2024", "2025"],
    skills: ["React", "Next.js", "TypeScript", "Redux", "Web Performance", "CSS3"],
    postedTime: "1 day ago",
    deadline: "10 Nov 2024",
    applyUrl: "https://www.uber.com/us/en/careers/",
    description: "Build high-performance passenger and driver mobility web interfaces handling 20M+ concurrent daily requests.",
  },
  {
    id: "job-6",
    title: "Backend Engineer (Go / Distributed Systems)",
    company: "Flipkart",
    logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80",
    location: "Bangalore, India",
    type: "Full-Time",
    salary: "₹18 LPA – ₹24 LPA",
    experience: "Fresher / 0-2 Years",
    batch: ["2024", "2025"],
    skills: ["Go", "Java", "Kafka", "PostgreSQL", "Redis", "Microservices"],
    postedTime: "2 days ago",
    deadline: "12 Nov 2024",
    applyUrl: "https://www.flipkartcareers.com/",
    description: "Architect high-throughput inventory, checkout, and payments pipelines for India's largest e-commerce platform.",
  },
  {
    id: "job-7",
    title: "AI / ML Engineer Intern",
    company: "Adobe",
    logo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=80",
    location: "Noida / Bangalore",
    type: "6-Month Internship",
    salary: "₹75,000 / month",
    experience: "Pre-Final / Final Year",
    batch: ["2025", "2026"],
    skills: ["Python", "PyTorch", "Generative AI", "LLMs", "Computer Vision"],
    postedTime: "2 days ago",
    deadline: "20 Nov 2024",
    applyUrl: "https://www.adobe.com/careers.html",
    description: "Conduct applied AI research and build generative models integrated into Adobe Firefly and Creative Cloud.",
    isHot: true,
  },
  {
    id: "job-8",
    title: "Software Engineer (Fintech Platforms)",
    company: "Razorpay",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80",
    location: "Bangalore, India",
    type: "Full-Time",
    salary: "₹19 LPA – ₹25 LPA",
    experience: "Fresher / 0-2 Years",
    batch: ["2024", "2025"],
    skills: ["Go", "Node.js", "MySQL", "AWS", "High Availability", "REST APIs"],
    postedTime: "3 days ago",
    deadline: "18 Nov 2024",
    applyUrl: "https://razorpay.com/jobs/",
    description: "Build robust payment gateways and banking APIs processing billions in transactions with 99.999% uptime.",
  },
  {
    id: "job-9",
    title: "Cloud & DevOps Engineer Intern",
    company: "Cisco Systems",
    logo: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80",
    location: "Bangalore, India",
    type: "6-Month Internship",
    salary: "₹65,000 / month",
    experience: "2025 / 2026 Batch",
    batch: ["2025", "2026"],
    skills: ["Docker", "Kubernetes", "Linux", "Python", "CI/CD", "AWS"],
    postedTime: "3 days ago",
    deadline: "25 Nov 2024",
    applyUrl: "https://jobs.cisco.com",
    description: "Design automated continuous integration pipelines, cloud containerization, and networking infrastructure.",
  },
  {
    id: "job-10",
    title: "Data Analyst / Product Analyst",
    company: "Zomato",
    logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&auto=format&fit=crop&q=80",
    location: "Gurgaon, India",
    type: "Full-Time",
    salary: "₹14 LPA – ₹18 LPA",
    experience: "0-1 Year",
    batch: ["2024", "2025"],
    skills: ["SQL", "Python", "Tableau", "Product Metrics", "A/B Testing", "Excel"],
    postedTime: "4 days ago",
    deadline: "22 Nov 2024",
    applyUrl: "https://www.zomato.com/careers",
    description: "Derive key data-driven product insights on delivery routing, user churn, and quick-commerce logistics.",
  },
];

export function filterPlacementJobs(
  jobs: PlacementJob[],
  query: string,
  typeFilter: string,
  locationFilter: string,
  batchFilter: string
): PlacementJob[] {
  const q = query.trim().toLowerCase();

  return jobs.filter((job) => {
    // Search query match
    if (q) {
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q));
      const matchLoc = job.location.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchSkills && !matchLoc) {
        return false;
      }
    }

    // Type filter
    if (typeFilter !== "All" && job.type !== typeFilter) {
      return false;
    }

    // Location filter
    if (locationFilter !== "All" && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }

    // Batch filter
    if (batchFilter !== "All" && !job.batch.includes(batchFilter)) {
      return false;
    }

    return true;
  });
}
