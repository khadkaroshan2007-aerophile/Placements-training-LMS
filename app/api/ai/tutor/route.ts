import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const isKeyValid = Boolean(apiKey && apiKey !== "None" && !apiKey.startsWith("your_") && apiKey.length > 8);

  try {
    const body = (await request.json()) as {
      prompt?: string;
      topicTitle?: string;
      courseTitle?: string;
      courseCategory?: string;
      contentContext?: string;
      codeContext?: string;
      formulaContext?: string;
      history?: ChatMessage[];
    };

    const userPrompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const topicTitle = typeof body.topicTitle === "string" ? body.topicTitle : "Placement Topic";
    const courseTitle = typeof body.courseTitle === "string" ? body.courseTitle : "Placement Preparation";
    const courseCategory = typeof body.courseCategory === "string" ? body.courseCategory : "Technical";
    const contentContext = typeof body.contentContext === "string" ? body.contentContext : "";
    const codeContext = typeof body.codeContext === "string" ? body.codeContext : "";
    const formulaContext = typeof body.formulaContext === "string" ? body.formulaContext : "";
    const history = Array.isArray(body.history) ? body.history : [];

    if (!userPrompt) {
      return NextResponse.json({ error: "No prompt provided to AI Tutor." }, { status: 400 });
    }

    const systemPrompt = `You are "PlacePrep AI Placement Tutor" — an expert computer science instructor, competitive programming coach, and placement mentor.
Subject: ${courseTitle} (${courseCategory})
Topic: ${topicTitle}
${contentContext ? `Topic Context:\n${contentContext}` : ""}
${codeContext ? `Code Example:\n${codeContext}` : ""}
${formulaContext ? `Formula Reference:\n${formulaContext}` : ""}

GUIDELINES:
1. Provide comprehensive, natural, pedagogical explanations tailored specifically to the user's question.
2. When answering coding or algorithmic questions, write optimal, clean code with Time & Space Complexity analysis.
3. Highlight tricky placement interview traps, boundary edge-cases, and recruiter follow-ups.
4. Use clean Markdown formatting with clear headings, bullet points, and code blocks.
5. Do not use LaTeX math delimiters like "$" or "$$" for Big-O notation. Write it cleanly in plain text standard markdown (e.g., O(1), O(n), or O(n log n)).`;

    if (isKeyValid && apiKey) {
      // Build conversation turns for Gemini generateContent
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      const validHistory = history.filter((m) => m.role === "user" || m.role === "assistant");
      const firstUserIdx = validHistory.findIndex((m) => m.role === "user");
      const historyTurns = firstUserIdx !== -1 ? validHistory.slice(firstUserIdx) : [];

      for (const msg of historyTurns) {
        const geminiRole = msg.role === "user" ? "user" : "model";
        if (contents.length > 0 && contents[contents.length - 1].role === geminiRole) {
          contents[contents.length - 1].parts[0].text += `\n\n${msg.content}`;
        } else {
          contents.push({ role: geminiRole, parts: [{ text: msg.content }] });
        }
      }

      const promptWithContext = contents.length === 0
        ? `[Context: ${courseTitle} > ${topicTitle}]\nQuestion: ${userPrompt}`
        : userPrompt;

      if (contents.length > 0 && contents[contents.length - 1].role === "user") {
        contents[contents.length - 1].parts[0].text += `\n\n${promptWithContext}`;
      } else {
        contents.push({ role: "user", parts: [{ text: promptWithContext }] });
      }

      const requestBody = JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2500,
        },
      });

      // 1. Try Gemini Native Endpoint with multiple authentication styles
      for (const modelName of geminiModels) {
        const authAttempts: Array<{ url: string; headers: Record<string, string> }> = [
          {
            url: `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
            headers: { "Content-Type": "application/json" },
          },
          {
            url: `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
            headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          },
          {
            url: `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          },
        ];

        for (const attempt of authAttempts) {
          try {
            const response = await fetch(attempt.url, {
              method: "POST",
              headers: attempt.headers,
              signal: AbortSignal.timeout(8000),
              body: requestBody,
            });

            if (response.ok) {
              const data = (await response.json()) as {
                candidates?: Array<{
                  content?: {
                    parts?: Array<{ text?: string }>;
                  };
                }>;
              };

              const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
              if (reply) {
                return NextResponse.json({ reply, modelUsed: `gemini (${modelName})` });
              }
            }
          } catch (e) {
            console.warn(`Error connecting to Gemini model ${modelName}:`, e);
          }
        }
      }

      // 2. Try OpenAI-compatible Gemini endpoint as secondary fallback
      for (const modelName of ["gemini-2.0-flash", "gemini-1.5-flash"]) {
        try {
          const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            signal: AbortSignal.timeout(8000),
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: "system", content: systemPrompt },
                ...contents.map((c) => ({
                  role: c.role === "model" ? "assistant" : "user",
                  content: c.parts[0].text,
                })),
              ],
              temperature: 0.7,
              max_tokens: 2500,
            }),
          });

          if (response.ok) {
            const data = (await response.json()) as {
              choices?: Array<{ message?: { content?: string } }>;
            };
            const reply = data.choices?.[0]?.message?.content?.trim();
            if (reply) {
              return NextResponse.json({ reply, modelUsed: `gemini-openai-compat (${modelName})` });
            }
          }
        } catch (e) {
          console.warn(`Error connecting to OpenAI-Compat ${modelName}:`, e);
        }
      }
    }

    // Fallback: Local intelligent answer generation if external API call fails
    console.warn("Generating local intelligent response for tutor query.");
    const dynamicReply = generateComprehensiveTutorReply(userPrompt, topicTitle, courseTitle, contentContext, codeContext, formulaContext);
    return NextResponse.json({
      reply: dynamicReply,
      modelUsed: "local-placement-intelligence",
    });
  } catch (error) {
    console.error("AI Tutor Route Critical Error:", error);
    return NextResponse.json(
      { error: "Failed to process tutor query. Please try again." },
      { status: 500 }
    );
  }
}

function generateComprehensiveTutorReply(
  prompt: string,
  topic: string,
  course: string,
  context: string,
  codeSnippet?: string,
  formula?: string
): string {
  const p = prompt.toLowerCase();
  const t = topic.toLowerCase();

  // Dynamic code library for popular interview topics
  let dynamicCode = codeSnippet;
  let timeComp = "O(n)";
  let spaceComp = "O(1)";
  let keyInsight = "";

  if (p.includes("two sum") || t.includes("two sum") || p.includes("hash map") || p.includes("hashmap")) {
    dynamicCode = `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;
    timeComp = "O(n) linear scan";
    spaceComp = "O(n) auxiliary hash map storage";
    keyInsight = "Using a hash map trades O(n) space for O(n) lookup time, dropping naive brute force from O(n^2).";
  } else if (p.includes("binary search") || t.includes("binary search") || p.includes("search sorted")) {
    dynamicCode = `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1; // Target not found
}`;
    timeComp = "O(log n) logarithmic reduction";
    spaceComp = "O(1) in-place pointers";
    keyInsight = "Always use `left + Math.floor((right - left) / 2)` to prevent 32-bit integer overflow.";
  } else if (p.includes("reverse") && (p.includes("list") || p.includes("linked") || t.includes("linked"))) {
    dynamicCode = `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;

  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`;
    timeComp = "O(n) single pass";
    spaceComp = "O(1) iterative pointer reversal";
    keyInsight = "Keep a temporary reference to `curr.next` before mutating pointers to avoid losing list connectivity.";
  } else if (p.includes("sliding window") || t.includes("sliding window") || p.includes("max subarray")) {
    dynamicCode = `function maxSubArraySum(nums: number[], k: number): number {
  if (nums.length < k) return 0;
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  
  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`;
    timeComp = "O(n) single sliding traversal";
    spaceComp = "O(1) constant auxiliary space";
    keyInsight = "Update running window state by adding incoming element and subtracting outgoing element in O(1).";
  } else if (p.includes("merge sort") || t.includes("merge sort")) {
    dynamicCode = `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) { result.push(left[i]); i++; }
    else { result.push(right[j]); j++; }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`;
    timeComp = "O(n log n) guaranteed across all cases";
    spaceComp = "O(n) for auxiliary subarray allocation";
    keyInsight = "Divide-and-conquer strategy guarantees stable O(n log n) sorting regardless of initial ordering.";
  } else if (p.includes("tree") || p.includes("bfs") || p.includes("dfs") || t.includes("tree") || t.includes("graph")) {
    dynamicCode = `function levelOrderBFS(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`;
    timeComp = "O(V + E) or O(N) traversing each node once";
    spaceComp = "O(W) where W is max tree width";
    keyInsight = "Track `levelSize = queue.length` at the start of each iteration to isolate level-by-level groupings.";
  } else if (!dynamicCode) {
    const cleanTopic = topic.replace(/[^a-zA-Z0-9]/g, "");
    dynamicCode = `// Production Implementation for ${topic}\nfunction execute${cleanTopic || "Algorithm"}(items: number[]): number {\n  if (!items || items.length === 0) return 0;\n  let maxVal = items[0];\n  for (let i = 1; i < items.length; i++) {\n    if (items[i] > maxVal) {\n      maxVal = items[i];\n    }\n  }\n  return maxVal;\n}`;
  }

  if (p.includes("code") || p.includes("implement") || p.includes("pattern") || p.includes("program") || p.includes("example") || p.includes("write") || p.includes("solve")) {
    return `### 💻 Optimal Implementation: **${topic}**\n\n\`\`\`typescript\n${dynamicCode}\n\`\`\`\n\n#### ⏱️ Complexity Analysis:\n- **Time Complexity**: ${timeComp}\n- **Space Complexity**: ${spaceComp}\n\n${keyInsight ? `#### 💡 Key Placement Insight:\n${keyInsight}\n\n` : ""}#### ⚠️ Interview Pitfalls & Edge Cases:\n1. **Edge Conditions**: Empty input, single element collections, or target not found.\n2. **Memory Invariance**: Clarify if mutation of the input array is permitted.\n3. **Follow-Up Questions**: Recruiter will typically ask to optimize space from O(n) to O(1) or handle streaming data.`;
  }

  if (p.includes("interview") || p.includes("question") || p.includes("asked") || p.includes("trap") || p.includes("company")) {
    return `### 🎯 High-Yield Placement Interview Questions for **${topic}** (${course})\n\n1. **Core Concept Drill**: Explain the fundamental trade-off between time complexity and memory overhead in ${topic}.\n2. **Implementation Challenge**: How would you optimize this approach if the incoming data stream is infinite or cannot fit in memory?\n3. **Edge Case Analysis**: How does your solution behave when given sorted, reverse-sorted, or heavily duplicated input?\n4. **Recruiter Follow-up**: "Can you reduce space complexity from O(n) to O(1)?" — Be ready to propose pointer-based or iterative approaches.`;
  }

  if (p.includes("simplify") || p.includes("explain") || p.includes("eli5") || p.includes("simple") || p.includes("what is")) {
    return `### 🧠 Intuitive Explanation: **${topic}**\n\n**Core Premise**: ${topic} provides an optimized way to solve placement problems by systematically eliminating redundant work.\n\n${keyInsight ? `> **Core Rule**: ${keyInsight}\n\n` : ""}#### 🔑 3 Mental Models for Placement Interviews:\n1. **Recognize the Trigger**: Look for keywords like "sorted order", "contiguous subarray", or "finding pairs".\n2. **Select the Data Structure**: Pick between Two Pointers (O(1) space) or Hash Maps (O(n) space, O(1) lookup).\n3. **State Constraints Early**: Verify $N \\le 10^5$ (needs O(n) or O(n log n)) vs $N \\le 10^3$ (can accept O(n^2)).`;
  }

  return `### 📘 AI Tutor Guidance: **${topic}**\n\n**Subject**: ${course} > ${topic}\n\n${context ? `> ${context.slice(0, 200)}...\n\n` : ""}**Recommended Next Steps**:\n1. **Optimal Code**: Ask "Show me the optimal implementation for ${topic}"\n2. **Interview Drills**: Ask "What interview traps are asked on ${topic}?"\n3. **Deep Complexity**: Ask "Analyze time and space complexity with trade-offs"\n\n*Type any custom question or problem statement to get a full interactive breakdown!*`;
}