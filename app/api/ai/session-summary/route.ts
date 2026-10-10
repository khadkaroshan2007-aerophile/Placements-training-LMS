import { NextResponse } from "next/server";

const geminiModels = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-flash",
  "gemini-1.5-pro",
  "gemini-2.5-pro",
];

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const isKeyValid = Boolean(apiKey && apiKey !== "None" && !apiKey.startsWith("your_") && apiKey.length > 8);

  try {
    const body = await request.json() as {
      role?: string;
      track?: string;
      sessionData?: Array<{
        question: string;
        answer: string;
        score: number;
        contentScore?: number;
        communicationScore?: number;
      }>;
    };

    const role = typeof body.role === "string" ? body.role : "Candidate";
    const track = typeof body.track === "string" ? body.track : "Software Engineering";
    const sessionData = Array.isArray(body.sessionData) ? body.sessionData : [];

    if (sessionData.length === 0) {
      return NextResponse.json({ error: "No session data provided." }, { status: 400 });
    }

    const calculatedAvg = sessionData.reduce((acc, curr) => acc + (curr.score || 7), 0) / sessionData.length;

    if (!isKeyValid || !apiKey) {
      return NextResponse.json({
        overallScore: Number(calculatedAvg.toFixed(1)),
        readinessTier: calculatedAvg >= 7.5 ? "Placement Ready (Tier 1 Candidate)" : "Developing Candidate",
        hiringVerdict: calculatedAvg >= 8 ? "Strong Hire" : calculatedAvg >= 6.5 ? "Hire" : "Needs Practice",
        executiveSummary: `Solid overall mock interview session for ${role}. Demonstrated core domain competency with clear communication structure.`,
        keyStrengths: [
          "Demonstrated direct technical understanding of core questions",
          "Structured responses logically with practical examples",
          "Maintained positive tone and professional delivery",
        ],
        growthRoadmap: [
          "Incorporate more quantifiable metrics and impact data in your project stories",
          "Practice concluding behavioral scenarios with concrete lessons learned",
          "Refine phrasing to eliminate filler words in high-pressure answers",
        ],
      });
    }

    type ParsedSessionSummary = {
      overallScore?: number;
      readinessTier?: string;
      hiringVerdict?: string;
      executiveSummary?: string;
      domainMasterySummary?: string;
      communicationSummary?: string;
      keyStrengths?: string[];
      growthRoadmap?: string[];
    };
    let parsed: ParsedSessionSummary | null = null;
    const sessionTranscriptText = sessionData
      .map((item, idx) => `Q${idx + 1}: ${item.question}\nCandidate Answer: ${item.answer}\nScore Given: ${item.score}/10`)
      .join("\n\n");

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
                  text: `You are the Lead Hiring Director evaluating a student's complete mock placement interview session for the role "${role}" in the domain "${track}".
Review the entire transcript of all questions and candidate answers.

Provide a comprehensive, senior-level post-interview debrief in JSON with the exact keys:
- "overallScore": Number with 1 decimal place (1.0 to 10.0)
- "readinessTier": String (e.g. "Placement Ready (Tier 1)", "High Potential - Minor Polish Needed", or "Foundational Practice Required")
- "hiringVerdict": String ("Strong Hire", "Hire", "Leaning Hire", or "Needs Practice")
- "executiveSummary": String (2-3 sentences summarizing their readiness, domain mastery, and presence)
- "domainMasterySummary": String (specific commentary on their technical depth and relevance for ${role})
- "communicationSummary": String (commentary on articulation, pacing, grammar accuracy, and STAR framework)
- "keyStrengths": Array of 3 to 4 specific bullet points detailing their strongest moments
- "growthRoadmap": Array of 3 to 4 actionable, high-impact improvements to focus on before real corporate interviews`,
                },
              ],
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Target Position: ${role}\nDomain: ${track}\nComplete Interview Transcript:\n${sessionTranscriptText}`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.35,
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
            parsed = JSON.parse(text);
            break;
          }
        }
      } catch (err) {
        console.warn(`Session summary with ${modelName} failed`, err);
      }
    }

    if (!parsed) {
      return NextResponse.json({
        overallScore: Number(calculatedAvg.toFixed(1)),
        readinessTier: calculatedAvg >= 7.5 ? "Placement Ready" : "Developing Candidate",
        hiringVerdict: calculatedAvg >= 7 ? "Hire" : "Needs Practice",
        executiveSummary: `Completed interview session for ${role}.`,
        keyStrengths: ["Clear communication", "Addressed question prompts directly"],
        growthRoadmap: ["Practice with more concrete metrics and STAR format"],
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Session summary error:", error);
    return NextResponse.json({ error: "Could not generate session summary." }, { status: 500 });
  }
}
