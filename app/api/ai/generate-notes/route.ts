import { NextResponse } from "next/server";

const geminiModels = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-flash",
  "gemini-1.5-pro",
];

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const isKeyValid = Boolean(apiKey && apiKey !== "None" && !apiKey.startsWith("your_") && apiKey.length > 8);

  try {
    const body = (await request.json()) as {
      courseTitle?: string;
      topicTitle?: string;
      existingContent?: string;
      customPrompt?: string;
    };

    const courseTitle = typeof body.courseTitle === "string" ? body.courseTitle : "Technical Interview Prep";
    const topicTitle = typeof body.topicTitle === "string" ? body.topicTitle : "Core Concepts";
    const existingContent = typeof body.existingContent === "string" ? body.existingContent : "";

    if (!isKeyValid || !apiKey) {
      // High-quality local fallback note
      return NextResponse.json({
        notes: `## 📌 Comprehensive Study Notes: ${topicTitle}\n\n` +
          `### 🎯 1. Core Summary\n` +
          `- **Key Concept**: ${topicTitle} is a foundational pillar in ${courseTitle}.\n` +
          `- **Primary Objective**: Understand the theoretical foundations, implementation patterns, and runtime trade-offs.\n\n` +
          `### 💡 2. Important Rules & Key Takeaways\n` +
          `- Analyze time and space complexity before jumping into coding.\n` +
          `- Test boundary edge cases: empty inputs, single elements, and extreme scales.\n` +
          `- Use structured frameworks to communicate trade-offs clearly to interviewers.\n\n` +
          `### 🛠️ 3. Quick Revision Cheat Sheet\n` +
          `- **Best Case**: O(1) or O(log n) when conditions allow\n` +
          `- **Average Case**: O(n) or O(n log n)\n` +
          `- **Common Trap**: Overlooking off-by-one errors and auxiliary memory allocations\n\n` +
          `### 💼 4. Interview Tip\n` +
          `*Proactively explain what approaches you evaluated and why you selected this particular pattern.*`,
        isAiGenerated: false,
      });
    }

    let generatedNotes = "";

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
                  text: `You are a Principal Engineering Lead and Academic Tutor crafting pristine, high-yield study notes and cheat sheets for placement candidates.
Format the output cleanly in readable Markdown with:
1. High-Level Summary (2-3 crisp bullet points)
2. Core Architecture & Theory (with code snippets or formulas where applicable)
3. Essential Cheat Sheet (Time/Space complexities, key formulas)
4. High-Yield Placement Interview Tips & Common Traps
Keep it structured, insightful, and practical.`,
                },
              ],
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Course: "${courseTitle}"\nTopic: "${topicTitle}"\nContext: "${existingContent}"\nGenerate a complete, high-yield study note and cheat sheet for this specific topic.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: 2000,
            },
          }),
          cache: "no-store",
        });

        if (response.ok) {
          const payload = (await response.json()) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const text = payload.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
          if (text && text.length > 50) {
            generatedNotes = text;
            break;
          }
        }
      } catch (err) {
        console.warn(`Generate notes with ${modelName} failed`, err);
      }
    }

    if (generatedNotes) {
      return NextResponse.json({ notes: generatedNotes, isAiGenerated: true });
    }

    return NextResponse.json({
      notes: `## 📌 Study Notes: ${topicTitle}\n\n- **Summary**: Essential concepts and trade-offs for ${topicTitle}.\n- **Key Takeaway**: Practice applying this pattern with real interview questions.\n- **Interview Tip**: Always discuss time and space complexity with the interviewer.`,
      isAiGenerated: false,
    });
  } catch (error) {
    console.error("Notes generation error:", error);
    return NextResponse.json({ error: "Failed to generate notes" }, { status: 500 });
  }
}

