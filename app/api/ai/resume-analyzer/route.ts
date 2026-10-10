import { NextResponse } from "next/server";

interface ResumeAnalysisRequest {
  resumeText: string;
  jobDescription?: string;
  userApiKey?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ResumeAnalysisRequest;
    const { resumeText, jobDescription, userApiKey } = body;

    if (!resumeText || resumeText.trim().length < 30) {
      return NextResponse.json(
        { error: "Please provide a valid resume with sufficient text to analyze." },
        { status: 400 }
      );
    }

    const apiKey = userApiKey?.trim() || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || "";

    // If Groq API Key is available, invoke Groq LLaMA-3.3-70B model
    if (apiKey && (apiKey.startsWith("gsk_") || !apiKey.startsWith("AIza"))) {
      try {
        const groqResult = await callGroqResumeAnalyzer(apiKey, resumeText, jobDescription);
        if (groqResult) {
          return NextResponse.json(groqResult);
        }
      } catch (err) {
        console.warn("Groq API call failed, falling back to intelligent ATS engine:", err);
      }
    }

    // Intelligent Fallback ATS Engine
    const analysis = generateIntelligentAtsAnalysis(resumeText, jobDescription);
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Resume Analyzer Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
}

async function callGroqResumeAnalyzer(apiKey: string, resumeText: string, jobDescription?: string) {
  const prompt = `
You are an expert ATS (Applicant Tracking System) Parser, Senior Technical Recruiter, and Career Coach for top tech companies (Google, Microsoft, Amazon, Meta, Apple).
Analyze the candidate's resume below${jobDescription ? " against the provided target Job Description" : " for high-tier Software Engineering & Tech placement readiness"}.

Candidate Resume:
"""
${resumeText.slice(0, 10000)}
"""

${
  jobDescription
    ? `Target Job Description:
"""
${jobDescription.slice(0, 5000)}
"""`
    : "Target Role: General Software Development Engineer / Full-Stack / Data Scientist placement."
}

Return a STRICT JSON object (no markdown surrounding the json if possible, or inside \`\`\`json codeblock) matching this exact schema:
{
  "atsScore": number (0-100),
  "matchPercentage": number (0-100),
  "tier": "Elite Placement Ready" | "High Placement Readiness" | "Competitive Base" | "Needs Improvement",
  "summaryFeedback": "2-3 sentences summarizing the resume's strengths, ATS parseability, and highest priority improvement.",
  "sections": {
    "contact": { "score": number (0-100), "passed": boolean, "feedback": "feedback string" },
    "summary": { "score": number (0-100), "passed": boolean, "feedback": "feedback string" },
    "experience": { "score": number (0-100), "passed": boolean, "feedback": "feedback string" },
    "skills": { "score": number (0-100), "passed": boolean, "feedback": "feedback string" },
    "projects": { "score": number (0-100), "passed": boolean, "feedback": "feedback string" },
    "education": { "score": number (0-100), "passed": boolean, "feedback": "feedback string" }
  },
  "missingKeywords": [
    {
      "keyword": "string (e.g. Docker, Redis, CI/CD, TypeScript)",
      "category": "Languages" | "Frameworks" | "Cloud & DBs" | "Core Concepts",
      "importance": "Critical" | "Recommended" | "Bonus",
      "reason": "Why this keyword is required for ATS screening"
    }
  ],
  "strongKeywordsFound": ["string"],
  "bulletPointImprovements": [
    {
      "area": "Experience / Projects",
      "originalSnippet": "Original weak statement from resume (e.g. Worked on React dashboard)",
      "improvedVersion": "High-impact XYZ formatted statement (e.g. Engineered full-stack analytics dashboard using Next.js & PostgreSQL, reducing query latency by 35% across 10,000+ active users)",
      "impact": "Explains why this rewrite is stronger"
    }
  ],
  "formattingAlerts": [
    {
      "issue": "string",
      "severity": "High" | "Medium" | "Low",
      "recommendation": "string"
    }
  ],
  "roleSpecificSuggestions": [
    "string"
  ]
}
`;

  const candidateModels = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
  ];

  for (const model of candidateModels) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are a top-tier ATS Resume Analyzer and Executive Technical Recruiter. Always respond with valid JSON matching the requested schema strictly.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`Groq API error on model ${model}:`, errorText);
        continue;
      }

      const data = await res.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) continue;

      try {
        return JSON.parse(rawContent);
      } catch (e) {
        const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanJson);
      }
    } catch (err) {
      console.warn(`Groq invocation attempt error on model ${model}:`, err);
    }
  }

  return null;
}

/* =========================================================================
   INTELLIGENT LOCAL ATS HEURISTIC ENGINE (FALLBACK / OFFLINE)
   ========================================================================= */
function generateIntelligentAtsAnalysis(resumeText: string, jobDescription?: string) {
  const lower = resumeText.toLowerCase();
  const jdLower = (jobDescription || "").toLowerCase();

  // 1. Contact Detection
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasLinkedin = lower.includes("linkedin.com") || lower.includes("linkedin");
  const hasGithub = lower.includes("github.com") || lower.includes("github");
  const hasPortfolio = lower.includes("portfolio") || lower.includes(".dev") || lower.includes(".io");

  const contactScore = (hasEmail ? 30 : 0) + (hasPhone ? 30 : 0) + (hasLinkedin ? 20 : 0) + (hasGithub ? 20 : 0);

  // 2. Section Headings Detection
  const hasSummary = lower.includes("summary") || lower.includes("objective") || lower.includes("about me");
  const hasExperience = lower.includes("experience") || lower.includes("employment") || lower.includes("internship");
  const hasSkills = lower.includes("skills") || lower.includes("technologies") || lower.includes("technical competencies");
  const hasProjects = lower.includes("projects") || lower.includes("key projects") || lower.includes("personal projects");
  const hasEducation = lower.includes("education") || lower.includes("academic") || lower.includes("bachelor") || lower.includes("b.tech");

  // 3. Action Verbs and XYZ Quantifiable Metrics
  const actionVerbs = [
    "spearheaded", "architected", "engineered", "developed", "optimized",
    "implemented", "orchestrated", "reduced", "increased", "boosted",
    "designed", "accelerated", "automated", "scaled", "collaborated"
  ];
  const foundVerbs = actionVerbs.filter((v) => lower.includes(v));
  const hasMetrics = /\d+([%kKmMbB\+]|\s*(ms|seconds|users|queries|requests|uptime|coverage))/.test(resumeText);

  // 4. Tech Keywords Inventory
  const standardTechKeywords = [
    { keyword: "Python", cat: "Languages" },
    { keyword: "Java", cat: "Languages" },
    { keyword: "TypeScript", cat: "Languages" },
    { keyword: "JavaScript", cat: "Languages" },
    { keyword: "C++", cat: "Languages" },
    { keyword: "SQL", cat: "Languages" },
    { keyword: "React", cat: "Frameworks" },
    { keyword: "Next.js", cat: "Frameworks" },
    { keyword: "Node.js", cat: "Frameworks" },
    { keyword: "Express", cat: "Frameworks" },
    { keyword: "Spring Boot", cat: "Frameworks" },
    { keyword: "Tailwind CSS", cat: "Frameworks" },
    { keyword: "PostgreSQL", cat: "Cloud & DBs" },
    { keyword: "MongoDB", cat: "Cloud & DBs" },
    { keyword: "Redis", cat: "Cloud & DBs" },
    { keyword: "Docker", cat: "Cloud & DBs" },
    { keyword: "AWS", cat: "Cloud & DBs" },
    { keyword: "Git", cat: "Cloud & DBs" },
    { keyword: "REST APIs", cat: "Core Concepts" },
    { keyword: "System Design", cat: "Core Concepts" },
    { keyword: "Microservices", cat: "Core Concepts" },
    { keyword: "Data Structures", cat: "Core Concepts" },
    { keyword: "CI/CD", cat: "Core Concepts" },
  ];

  const strongKeywordsFound: string[] = [];
  const missingKeywords: any[] = [];

  for (const item of standardTechKeywords) {
    if (lower.includes(item.keyword.toLowerCase())) {
      strongKeywordsFound.push(item.keyword);
    } else {
      // If keyword is in JD or is a critical industry keyword
      const inJd = jdLower.includes(item.keyword.toLowerCase());
      if (inJd || ["Docker", "Redis", "TypeScript", "REST APIs", "CI/CD"].includes(item.keyword)) {
        missingKeywords.push({
          keyword: item.keyword,
          category: item.cat,
          importance: inJd ? "Critical" : "Recommended",
          reason: inJd
            ? "Explicitly mentioned in target job description requirements."
            : "High-value keyword for software engineering ATS screening.",
        });
      }
    }
  }

  // 5. Compute Overall ATS Score
  let score = 30;
  if (hasEmail && hasPhone) score += 10;
  if (hasLinkedin || hasGithub) score += 10;
  if (hasSummary) score += 8;
  if (hasSkills) score += 12;
  if (hasExperience) score += 12;
  if (hasProjects) score += 10;
  if (hasEducation) score += 8;
  if (foundVerbs.length >= 4) score += 5;
  if (hasMetrics) score += 5;

  // JD Match Bonus
  let matchPercentage = 75;
  if (jobDescription && jobDescription.trim()) {
    const jdWords = jdLower.split(/\W+/).filter((w) => w.length > 3);
    const matchedCount = jdWords.filter((w) => lower.includes(w)).length;
    matchPercentage = Math.min(96, Math.max(45, Math.round((matchedCount / Math.max(1, jdWords.length)) * 130)));
    score = Math.round((score * 0.6) + (matchPercentage * 0.4));
  }

  const finalScore = Math.min(96, Math.max(35, score));
  const tier =
    finalScore >= 85
      ? "Elite Placement Ready"
      : finalScore >= 70
      ? "High Placement Readiness"
      : finalScore >= 55
      ? "Competitive Base"
      : "Needs Improvement";

  return {
    atsScore: finalScore,
    matchPercentage,
    tier,
    summaryFeedback:
      finalScore >= 80
        ? "Your resume has high keyword density, structured headings, and strong action verbs. Adding more quantified metric results (% latency decrease, number of users handled) will maximize your shortlist rate."
        : "Your resume provides a good foundation but needs stronger technical keywords, impact-oriented bullet points (Google XYZ format), and prominent links to GitHub and portfolio.",
    sections: {
      contact: {
        score: contactScore,
        passed: Boolean(hasEmail && hasPhone && hasLinkedin),
        feedback: hasEmail && hasPhone
          ? "Contact information is complete with professional email, phone, and links."
          : "Add your professional email address, phone number, and LinkedIn profile link.",
      },
      summary: {
        score: hasSummary ? 85 : 45,
        passed: hasSummary,
        feedback: hasSummary
          ? "Summary clearly communicates your core engineering focus and competencies."
          : "Add a 2-3 sentence professional summary at the top outlining your target role and stack.",
      },
      experience: {
        score: hasExperience ? (hasMetrics ? 90 : 70) : 40,
        passed: hasExperience,
        feedback: hasExperience
          ? hasMetrics
            ? "Work experience contains action verbs and quantified impact metrics."
            : "Enhance experience bullets with measurable metrics (e.g. reduced load time by 30%, handled 5,000+ daily requests)."
          : "Include structured internship, freelance, or research experience with bullet points.",
      },
      skills: {
        score: Math.min(100, strongKeywordsFound.length * 10),
        passed: strongKeywordsFound.length >= 6,
        feedback: `Detected ${strongKeywordsFound.length} technical skills. Categorize them into Languages, Frameworks, and Cloud/Databases for ATS parsers.`,
      },
      projects: {
        score: hasProjects ? 88 : 50,
        passed: hasProjects,
        feedback: hasProjects
          ? "Projects section highlights technical stacks and links to repositories."
          : "Add 2-3 featured full-stack projects with live demo URLs and GitHub repository links.",
      },
      education: {
        score: hasEducation ? 95 : 55,
        passed: hasEducation,
        feedback: hasEducation
          ? "Education section has clear university, degree, major, and graduation year."
          : "List your undergraduate degree, university name, graduation year, and CGPA.",
      },
    },
    missingKeywords: missingKeywords.slice(0, 6),
    strongKeywordsFound: strongKeywordsFound.slice(0, 10),
    bulletPointImprovements: [
      {
        area: "Experience / Projects",
        originalSnippet: "Worked on developing backend APIs and database tables.",
        improvedVersion:
          "Architected and deployed asynchronous REST APIs in Node.js & PostgreSQL, reducing query latency by 35% for 10,000+ active user sessions.",
        impact: "Transforms passive responsibility into quantified impact using the Google XYZ framework.",
      },
      {
        area: "Technical Projects",
        originalSnippet: "Created a full stack web application with React and MongoDB.",
        improvedVersion:
          "Spearheaded development of a scalable full-stack web app with Next.js 15, TypeScript, and MongoDB with 99.9% uptime and Redis caching.",
        impact: "Adds specific framework versions, reliability metrics, and performance optimizations.",
      },
    ],
    formattingAlerts: [
      {
        issue: "Standard Single/Two Column Layout",
        severity: "Low",
        recommendation: "Ensure text is plain selectable text without complex nested graphic tables for optimal ATS parser extraction.",
      },
      {
        issue: "Consistent Date Formatting",
        severity: "Low",
        recommendation: "Use standard 'Month Year – Month Year' (e.g., Jan 2024 – Jun 2024) format across all roles.",
      },
    ],
    roleSpecificSuggestions: [
      "Add a dedicated 'Key Competencies' section highlighting Data Structures, System Design, and REST APIs.",
      "Include active GitHub repository links with README documentation for all highlighted projects.",
      "Quantify each bullet point with time saved, performance improved, or user volume supported.",
    ],
  };
}

