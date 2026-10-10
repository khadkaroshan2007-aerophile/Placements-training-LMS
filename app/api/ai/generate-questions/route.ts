import { NextResponse } from "next/server";

const geminiModels = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-flash",
  "gemini-1.5-pro",
];

type GeneratedQuestion = {
  label: string;
  prompt: string;
  type: string;
  tip: string;
};

const fallbackQuestionBank: Record<string, GeneratedQuestion[]> = {
  swe: [
    {
      label: "1. Core Foundations & Passion",
      prompt: "Walk me through how you approach breaking down a complex, ambiguous software problem before writing any code.",
      type: "Problem Solving",
      tip: "Mention requirement gathering, edge cases, trade-offs, and pseudo-coding.",
    },
    {
      label: "2. Data Structures & Algorithms",
      prompt: "Can you describe a scenario where choosing the right data structure (e.g., Hash Map, Trie, Tree, or Heap) significantly improved performance in your project?",
      type: "Technical Deep-Dive",
      tip: "Discuss time and space complexity (Big-O) improvements.",
    },
    {
      label: "3. Concurrency & Performance",
      prompt: "How do you handle race conditions or asynchronous operations when multiple processes access shared state?",
      type: "System Engineering",
      tip: "Discuss locks, immutability, async/await, or message queues.",
    },
    {
      label: "4. Debugging in Production",
      prompt: "Tell me about the hardest bug you ever encountered. What was your investigation process and what preventive measures did you put in place?",
      type: "Debugging (STAR)",
      tip: "Use the STAR method: Situation, Task, Action taken, and the final Result/Lesson.",
    },
    {
      label: "5. Code Quality & Reviews",
      prompt: "What criteria do you look for when reviewing a pull request submitted by a peer?",
      type: "Engineering Culture",
      tip: "Mention readability, test coverage, edge cases, security, and scalability.",
    },
    {
      label: "6. System Scaling & Bottlenecks",
      prompt: "If an API endpoint suddenly experiences a 10x traffic spike and response times degrade, what steps would you take to diagnose and mitigate the bottleneck?",
      type: "Architecture & Scale",
      tip: "Talk about caching, database indexing, rate limiting, and profiling.",
    },
  ],
  frontend: [
    {
      label: "1. Modern Frontend Architecture",
      prompt: "How do you decide between Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR) for different pages?",
      type: "Architecture",
      tip: "Compare SEO needs, data freshness, latency, and caching strategies.",
    },
    {
      label: "2. React Performance Tuning",
      prompt: "What strategies and tools do you use to detect and resolve unnecessary re-renders in a complex React tree?",
      type: "Performance",
      tip: "Mention React DevTools Profiler, useMemo, useCallback, and state collocation.",
    },
    {
      label: "3. Responsive & Accessible UX",
      prompt: "Walk me through how you ensure a component is fully accessible via keyboard and screen readers, following WCAG standards.",
      type: "Accessibility (a11y)",
      tip: "Mention semantic HTML, focus management, ARIA attributes, and color contrast.",
    },
    {
      label: "4. State & Network Caching",
      prompt: "How do you manage server state synchronization, optimistic UI updates, and stale cache invalidation in modern web applications?",
      type: "State Management",
      tip: "Discuss query caching, optimistic UI, mutation rollbacks, and error boundaries.",
    },
    {
      label: "5. Cross-Browser & CSS Layouts",
      prompt: "Describe an interesting CSS layout challenge you solved using modern Flexbox, Grid, or Container Queries.",
      type: "CSS & Design Systems",
      tip: "Focus on maintainability, responsive fluid design, and clean token usage.",
    },
  ],
  backend: [
    {
      label: "1. Relational vs Non-Relational DBs",
      prompt: "How do you evaluate whether to use PostgreSQL vs MongoDB/Redis for a new microservice? What are the key trade-offs?",
      type: "Data Architecture",
      tip: "Discuss ACID transactions, schema flexibility, read/write patterns, and join complexity.",
    },
    {
      label: "2. API Security & Authentication",
      prompt: "How would you design a secure token-based authentication and authorization system that protects against CSRF, XSS, and token theft?",
      type: "Security",
      tip: "Mention httpOnly cookies, refresh token rotation, JWT signing, and RBAC.",
    },
    {
      label: "3. Distributed Caching & Invalidation",
      prompt: "How do you implement caching with Redis or Memcached without running into the cache-aside thundering herd problem or stale data issues?",
      type: "System Design",
      tip: "Discuss cache eviction policies, TTLs, write-through vs cache-aside, and mutexes.",
    },
    {
      label: "4. Resilient Message Queues",
      prompt: "When designing an asynchronous job processing system with RabbitMQ or Kafka, how do you ensure idempotent message processing and handle dead-letter queues?",
      type: "Distributed Systems",
      tip: "Talk about deduplication keys, retry backoff strategies, and worker fault tolerance.",
    },
  ],
  hr: [
    {
      label: "1. Personal Elevator Pitch",
      prompt: "Tell me about yourself, highlighting key accomplishments and what unique qualities you would bring to our team.",
      type: "Introduction",
      tip: "Structure as: Present skills -> Past accomplishments -> Future enthusiasm for this specific role.",
    },
    {
      label: "2. Overcoming Failure & Resilience",
      prompt: "Tell me about a project or initiative that did not go as planned. What mistakes were made, and how did you navigate the outcome?",
      type: "Behavioral (STAR)",
      tip: "Take accountability, show humility, and emphasize key lessons learned.",
    },
    {
      label: "3. Handling Workplace Disagreements",
      prompt: "Describe a situation where you had a conflicting opinion with a coworker or lead. How did you advocate for your point of view while maintaining team cohesion?",
      type: "Collaboration (STAR)",
      tip: "Focus on data-driven discussion, active listening, and committing to the final team decision.",
    },
    {
      label: "4. Prioritization Under Tight Deadlines",
      prompt: "How do you handle situations where requirements change abruptly right before a critical deadline?",
      type: "Adaptability",
      tip: "Describe triage frameworks (P0 vs P1), clear stakeholder communication, and maintaining composure.",
    },
    {
      label: "5. Long-Term Career Vision",
      prompt: "Where do you envision your career trajectory heading over the next 3 to 5 years, and how does this role fit into that vision?",
      type: "Culture & Growth",
      tip: "Demonstrate eagerness to master craft, mentor others, and drive business impact.",
    },
  ],
};

function getRandomFallbackQuestions(trackKey: string, count = 4): GeneratedQuestion[] {
  const bank = fallbackQuestionBank[trackKey] || fallbackQuestionBank.swe;
  const shuffled = [...bank].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((q, idx) => ({
    ...q,
    label: `Question ${idx + 1}: ${q.type}`,
  }));
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const isKeyValid = Boolean(apiKey && apiKey !== "None" && !apiKey.startsWith("your_") && apiKey.length > 8);

  try {
    const body = await request.json() as { track?: string; role?: string; count?: number };
    const track = typeof body.track === "string" ? body.track.toLowerCase() : "swe";
    const role = typeof body.role === "string" && body.role.trim() ? body.role.trim() : "Software Engineer";
    const count = typeof body.count === "number" && body.count >= 2 && body.count <= 6 ? body.count : 4;

    if (!isKeyValid || !apiKey) {
      const questions = getRandomFallbackQuestions(track, count);
      return NextResponse.json({ questions, isDynamicGemini: false });
    }

    let parsedQuestions: GeneratedQuestion[] | null = null;

    for (const modelName of geminiModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
        const response = await fetch(`${endpoint}?key=${encodeURIComponent(apiKey)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(6000),
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: `You are an expert technical interviewer at a top technology company.
Generate ${count} realistic, challenging, and unique interview questions specifically for the target role "${role}" and domain "${track}".
Do NOT use overly generic or cliché questions. Ensure each question tests a distinct competency (e.g. Introduction & Projects, Technical Problem-Solving, Architecture / Trade-offs, Incident Handling, and Behavioral/Teamwork).
Make the questions varied and fresh each time.
Return a valid JSON array of objects with the exact structure:
[
  {
    "label": "Question 1: [Competency Name]",
    "prompt": "The exact interview question prompt spoken by interviewer",
    "type": "Competency Category",
    "tip": "Short actionable advice for candidate on how to structure answer"
  }
]`,
                },
              ],
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Generate ${count} dynamic mock interview questions for role: "${role}", domain track: "${track}", randomized seed: ${Date.now()}-${Math.random().toString(36).substring(7)}.`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.85,
              maxOutputTokens: 3000,
            },
          }),
          cache: "no-store",
        });

        if (response.ok) {
          const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
          let text = payload.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
          if (text) {
            if (text.startsWith("```json")) {
              text = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
            } else if (text.startsWith("```")) {
              text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
            }
            const parsed = JSON.parse(text) as GeneratedQuestion[];
            if (Array.isArray(parsed) && parsed.length >= 2) {
              parsedQuestions = parsed;
              break;
            }
          }
        }
      } catch (err) {
        console.warn(`Generate questions attempt on ${modelName} failed`, err);
      }
    }

    if (parsedQuestions && parsedQuestions.length >= 2) {
      const validQuestions = parsedQuestions.slice(0, count).map((item, idx) => ({
        label: typeof item.label === "string" ? item.label : `Question ${idx + 1}: ${item.type || "Technical"}`,
        prompt: typeof item.prompt === "string" ? item.prompt : "Tell me about your technical experience.",
        type: typeof item.type === "string" ? item.type : "General",
        tip: typeof item.tip === "string" ? item.tip : "Structure your answer with clear examples.",
      }));
      return NextResponse.json({ questions: validQuestions, isDynamicGemini: true });
    }

    const fallback = getRandomFallbackQuestions(track, count);
    return NextResponse.json({ questions: fallback, isDynamicGemini: false });
  } catch (error) {
    console.error("Generate questions error:", error);
    const fallback = getRandomFallbackQuestions("swe", 4);
    return NextResponse.json({ questions: fallback, isDynamicGemini: false });
  }
}
