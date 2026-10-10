import { NextResponse } from "next/server";

const geminiModels = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-flash",
  "gemini-1.5-pro",
  "gemini-2.5-pro",
];

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const configured = Boolean(apiKey && apiKey !== "None" && !apiKey.startsWith("your_") && apiKey.length > 8);
  return NextResponse.json({ configured });
}

type PronunciationWord = {
  word: string;
  status: "clear" | "lessClear" | "mispronounced";
  tip?: string;
  phonetics?: string;
};

type PronunciationAnalysis = {
  clarityScore: number;
  wordBreakdown: PronunciationWord[];
  mispronouncedCount: number;
  lessClearCount: number;
  clearCount: number;
};

function generateLocalHeuristicFeedback(question: string, answer: string, role: string) {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lowerAnswer = answer.toLowerCase();

  const hasSituation = /situation|context|background|when i was|during my|at my|project|problem/i.test(lowerAnswer);
  const hasTask = /task|goal|responsible|objective|target|need to|had to|assigned/i.test(lowerAnswer);
  const hasAction = /i created|i built|i designed|i implemented|i led|i developed|i resolved|i analyzed|i decided|i used/i.test(lowerAnswer);
  const hasResult = /result|outcome|improved|achieved|reduced|increased|learned|impact|successfully|delivered/i.test(lowerAnswer);

  const starCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  
  let baseScore = 5;
  if (wordCount >= 80) baseScore += 2;
  else if (wordCount >= 40) baseScore += 1;
  else if (wordCount < 20) baseScore -= 1;

  if (starCount >= 3) baseScore += 2;
  else if (starCount >= 2) baseScore += 1;

  const score = Math.max(3, Math.min(9, baseScore));
  const contentScore = Math.max(3, Math.min(10, Math.round((wordCount / 120) * 8 + (starCount >= 2 ? 2 : 0))));
  const communicationScore = Math.max(4, Math.min(10, Math.round((starCount / 4) * 5 + (wordCount >= 50 ? 4 : 2))));

  const strengths: string[] = [];
  const improvements: string[] = [];

  const wordBreakdown: PronunciationWord[] = words.map((w) => {
    const clean = w.replace(/[^a-zA-Z]/g, "").toLowerCase();
    // Flag common slurred speech or colloquial phonetic contractions
    if (["gonna", "wanna", "dunno", "lemme", "gotta"].includes(clean)) {
      return { word: w, status: "mispronounced", tip: `Slurred speech: pronounce clearly as "${clean === "gonna" ? "going to" : "want to"}"` };
    }
    if (["um", "uh", "like", "kinda", "sorta", "basically"].includes(clean)) {
      return { word: w, status: "lessClear", tip: "Muffled / filler articulation. Enunciate deliberately." };
    }
    return { word: w, status: "clear" };
  });

  const mispronouncedCount = wordBreakdown.filter((w) => w.status === "mispronounced").length;
  const lessClearCount = wordBreakdown.filter((w) => w.status === "lessClear").length;
  const clearCount = wordBreakdown.filter((w) => w.status === "clear").length;

  if (wordCount >= 50) strengths.push("Good depth and explanation of your experience.");
  else improvements.push("Elaborate further with specific examples to demonstrate depth.");

  if (hasAction) strengths.push("Clear emphasis on individual contribution and actions taken.");
  else improvements.push("Emphasize the specific technical actions YOU personally performed.");

  if (hasResult) strengths.push("Included measurable outcomes and lessons learned.");
  else improvements.push("Conclude with the concrete result, metrics, or impact of your solution.");

  if (strengths.length < 2) strengths.push("Directly answered the core premise of the question.");
  if (improvements.length < 2) improvements.push("Use the STAR framework (Situation, Task, Action, Result) to structure your response.");

  const improvedAnswer = `In my role as a ${role || "Candidate"}, when faced with this scenario, I first identified the core requirement: "${question.slice(0, 60)}...". I broke down the problem into key milestones, developed an optimal solution using best practices, and verified the outcome. As a result, we delivered the project on time with positive feedback and enhanced reliability.`;

  return {
    score,
    contentScore,
    communicationScore,
    summary: `Solid practice response demonstrating good foundational communication for ${role || "this role"}.`,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    improvedAnswer,
    pronunciationAnalysis: {
      clarityScore: Math.max(5, Math.min(10, 10 - mispronouncedCount * 2 - lessClearCount)),
      wordBreakdown,
      mispronouncedCount,
      lessClearCount,
      clearCount,
    },
    isSimulated: true,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const isKeyValid = Boolean(apiKey && apiKey !== "None" && !apiKey.startsWith("your_") && apiKey.length > 8);

  try {
    const body = await request.json() as { question?: unknown; answer?: unknown; role?: unknown; interviewType?: unknown };
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const answer = typeof body.answer === "string" ? body.answer.trim() : "";
    const role = typeof body.role === "string" ? body.role.trim().slice(0, 80) : "Software Engineer Candidate";
    const interviewType = typeof body.interviewType === "string" ? body.interviewType.trim() : "Technical / Behavioral";

    if (question.length < 5 || question.length > 500) {
      return NextResponse.json({ error: "Choose a valid interview question." }, { status: 400 });
    }
    if (answer.length < 15 || answer.length > 4000) {
      return NextResponse.json({ error: "Please speak or write an answer between 15 and 4,000 characters for useful evaluation." }, { status: 400 });
    }

    if (!isKeyValid || !apiKey) {
      const heuristicFeedback = generateLocalHeuristicFeedback(question, answer, role);
      return NextResponse.json(heuristicFeedback);
    }

    type ParsedFeedbackResponse = {
      score?: number;
      contentScore?: number;
      communicationScore?: number;
      summary?: string;
      strengths?: string[];
      improvements?: string[];
      improvedAnswer?: string;
      pronunciationAnalysis?: {
        clarityScore?: number;
        wordBreakdown?: Array<{
          word: string;
          status: "clear" | "lessClear" | "mispronounced";
          tip?: string;
        }>;
      };
      followUpQuestion?: string;
    };
    let parsed: ParsedFeedbackResponse | null = null;

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
                  text: `You are an expert voice & placement interview coach.
Evaluate the candidate's spoken response strictly for the role "${role}" and domain "${interviewType}".

IMPORTANT PRONUNCIATION & ARTICULATION RULES:
- DO NOT count or penalize standard grammar mistakes in the word coloring. Grammar should only be assessed in general communication notes.
- Instead, perform an exact WORD-BY-WORD PRONUNCIATION & SPEECH CLARITY AUDIT on the candidate's exact spoken words:
  1. "mispronounced" (RED): ONLY words that are unmistakably mispronounced, corrupted speech-to-text phonetic slips, or severely mangled technical terms.
  2. "lessClear" (YELLOW): Words that are mumbled, slurred together, or spoken with hesitant/unclear articulation.
  3. "clear" (GREEN): Every correctly and clearly spoken word.

Return a valid JSON object with the exact keys:
- "score": Integer 1-10 (overall score)
- "contentScore": Integer 1-10 (technical accuracy and depth)
- "communicationScore": Integer 1-10 (clarity, confidence, and STAR structure)
- "summary": String (1-2 clear summary sentences of how the candidate performed)
- "strengths": Array of 2 to 3 concise bullet points
- "improvements": Array of 2 to 3 concise bullet points
- "improvedAnswer": String (a high-scoring, realistic rewrite of their answer retaining their true experience)
- "pronunciationAnalysis": {
    "clarityScore": Integer 1-10,
    "wordBreakdown": Array of objects for each word in the candidate's answer in exact sequence:
      [
        {
          "word": "ExactWord",
          "status": "clear" | "lessClear" | "mispronounced",
          "tip": "Short phonetic guide or pronunciation tip if status is lessClear or mispronounced"
        }
      ]
  }
- "followUpQuestion": String (a logical follow-up question based on their answer)`,
                },
              ],
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Target Role: ${role}\nInterview Domain: ${interviewType}\nInterview Question: ${question}\nCandidate Spoken Answer: ${answer}`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.25,
              maxOutputTokens: 2500,
            },
          }),
          cache: "no-store",
        });

        if (response.ok) {
          const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
          let text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
          if (text) {
            if (text.startsWith("```json")) {
              text = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
            } else if (text.startsWith("```")) {
              text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
            }
            parsed = JSON.parse(text) as ParsedFeedbackResponse;
            break;
          }
        }
      } catch (err) {
        console.warn(`Error calling ${modelName}`, err);
      }
    }

    if (!parsed) {
      const fallback = generateLocalHeuristicFeedback(question, answer, role);
      return NextResponse.json(fallback);
    }

    const strings = (items: unknown) =>
      Array.isArray(items) ? items.filter((item): item is string => typeof item === "string").slice(0, 4) : [];

    const normalizeScore = (val: unknown, defaultVal = 7) => {
      if (typeof val !== "number" || isNaN(val)) return defaultVal;
      if (val > 10) return Math.max(1, Math.min(10, Math.round(val / 10)));
      return Math.max(1, Math.min(10, Math.round(val)));
    };

    const parsedScore = normalizeScore(parsed.score, 7);
    const contentScore = normalizeScore(parsed.contentScore, parsedScore);
    const communicationScore = normalizeScore(parsed.communicationScore, parsedScore);

    // Build or sanitize pronunciation word breakdown
    const rawWords = answer.trim().split(/\s+/).filter(Boolean);
    let wordBreakdown: PronunciationWord[] = [];

    if (parsed.pronunciationAnalysis && Array.isArray(parsed.pronunciationAnalysis.wordBreakdown)) {
      wordBreakdown = parsed.pronunciationAnalysis.wordBreakdown
        .filter((item) => typeof item === "object" && item !== null && typeof item.word === "string")
        .map((item) => ({
          word: item.word,
          status: item.status === "mispronounced" || item.status === "lessClear" ? item.status : "clear",
          tip: typeof item.tip === "string" ? item.tip : undefined,
        }));
    }

    if (wordBreakdown.length === 0) {
      wordBreakdown = rawWords.map((w) => ({ word: w, status: "clear" }));
    }

    const mispronouncedCount = wordBreakdown.filter((w) => w.status === "mispronounced").length;
    const lessClearCount = wordBreakdown.filter((w) => w.status === "lessClear").length;
    const clearCount = wordBreakdown.filter((w) => w.status === "clear").length;

    const pronunciationAnalysis: PronunciationAnalysis = {
      clarityScore: normalizeScore(parsed.pronunciationAnalysis?.clarityScore, Math.max(5, 10 - mispronouncedCount * 2 - lessClearCount)),
      wordBreakdown,
      mispronouncedCount,
      lessClearCount,
      clearCount,
    };

    return NextResponse.json({
      score: parsedScore,
      contentScore,
      communicationScore,
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 500) : "Good interview practice response.",
      strengths: strings(parsed.strengths).length > 0 ? strings(parsed.strengths) : ["Addressed the core interview question."],
      improvements: strings(parsed.improvements).length > 0 ? strings(parsed.improvements) : ["Provide additional concrete metrics."],
      improvedAnswer: typeof parsed.improvedAnswer === "string" ? parsed.improvedAnswer.slice(0, 2500) : answer,
      pronunciationAnalysis,
      followUpQuestion: typeof parsed.followUpQuestion === "string" ? parsed.followUpQuestion.slice(0, 300) : undefined,
      isSimulated: false,
    });
  } catch (error) {
    console.error("Interview feedback failed", error);
    return NextResponse.json({ error: "Could not evaluate your answer. Please try again." }, { status: 500 });
  }
}
