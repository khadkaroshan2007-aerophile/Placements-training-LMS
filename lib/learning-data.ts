export type CurriculumLesson = {
  title: string;
  content: string;
  codeSnippet?: string;
  formula?: string;
  gfgUrl?: string;
  keyTakeaway: string;
  interviewTip: string;
  cheatSheet: string[];
  commonPitfalls?: string[];
};

export type LearningCourse = {
  id: string;
  title: string;
  category: string;
  description: string;
  lessons: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tone: "purple" | "green" | "orange";
  curriculum: CurriculumLesson[];
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type AssessmentLevel = "Foundation" | "Intermediate" | "Advanced" | "Expert";

export type LearningAssessment = {
  id: string;
  title: string;
  topic: string;
  category: "Technical" | "Aptitude" | "Core CS" | "Logical Reasoning" | "Career & HR";
  level: AssessmentLevel;
  levelBadge?: string;
  description: string;
  durationMinutes: number;
  questions: QuizQuestion[];
};

export const learningCourses: LearningCourse[] = [
  {
    id: "dsa-foundations",
    title: "Data Structures & Algorithms",
    category: "Technical",
    description: "Build confidence with arrays, strings, hashing, trees, dynamic programming, and the patterns used in top tech coding interviews.",
    lessons: 8,
    duration: "4h 20m",
    level: "Beginner",
    tone: "purple",
    curriculum: [
      {
        title: "Arrays and Index Access",
        content: "Arrays store elements contiguously in memory, enabling lightning-fast O(1) random access via arithmetic index calculation baseAddress + index * elementSize. While reads and end-appends (amortized) are O(1), inserting or deleting elements from the beginning or middle is O(n) because all subsequent elements must be shifted.",
        gfgUrl: "https://www.geeksforgeeks.org/array-data-structure-guide/",
        codeSnippet: `// 1. Dynamic Array Insertion & In-Place Modification
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let writePtr = 1;
  for (let readPtr = 1; readPtr < nums.length; readPtr++) {
    if (nums[readPtr] !== nums[readPtr - 1]) {
      nums[writePtr] = nums[readPtr];
      writePtr++;
    }
  }
  return writePtr; // Length of unique prefix
}`,
        keyTakeaway: "Direct index access is O(1). Inserting or removing elements anywhere before the end forces an O(n) memory shift.",
        interviewTip: "Always clarify if in-place array modification is permitted and consider prefix-sum or two-pointer patterns before allocating auxiliary arrays.",
        cheatSheet: [
          "Access by Index: O(1) time",
          "Search (Unsorted): O(n) time | Search (Sorted): O(log n) with Binary Search",
          "Insert / Delete at End: O(1) amortized",
          "Insert / Delete at Index 0: O(n) due to shifting elements",
        ],
        commonPitfalls: [
          "Forgetting off-by-one errors on boundary indices 0 and length - 1",
          "Allocating unnecessary O(n) arrays when in-place two-pointer swapping is feasible",
        ],
      },
      {
        title: "Strings and Two Pointers",
        content: "Two pointers allow you to process sequences from opposite ends inwards or in a fast/slow chasing setup, eliminating nested loops and reducing O(n²) comparisons to linear O(n) time with O(1) extra space.",
        gfgUrl: "https://www.geeksforgeeks.org/two-pointers-technique/",
        codeSnippet: `// Two-Pointer Palindrome Check (skipping non-alphanumeric)
function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
        keyTakeaway: "Two pointers inward scan checks symmetry and matches complements in O(n) time with zero extra space.",
        interviewTip: "Remember that in JavaScript and Python, strings are immutable. Repeated string concatenation in loops creates O(n²) overhead; use arrays and join.",
        cheatSheet: [
          "Opposite Ends: Palindromes, Reverse array, 2Sum sorted",
          "Fast & Slow: Cycle detection (Floyd's), Middle of Linked List, Remove duplicates",
          "Time Complexity: O(n) single pass | Space: O(1) auxiliary",
        ],
        commonPitfalls: [
          "Not handling upper vs lower case or punctuation normalization",
          "Loop termination: using left <= right when left < right is required to avoid infinite loops",
        ],
      },
      {
        title: "Hash Maps for Fast Lookup",
        content: "Hash maps map keys to values using a hashing function, achieving average O(1) time complexity for insertions, deletions, and searches. They are the premier data structure for frequency counting, complement lookups, and caching/memoization.",
        gfgUrl: "https://www.geeksforgeeks.org/hashing-data-structure/",
        codeSnippet: `// Two-Sum using Hash Map: O(n) Time, O(n) Space
function twoSum(nums: number[], target: number): [number, number] | [] {
  const seen = new Map<number, number>(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
        keyTakeaway: "Trade O(n) space to drop time complexity from O(n²) to O(n) by checking complements in O(1) time.",
        interviewTip: "When asked to optimize an O(n²) nested loop, your immediate first instinct should be asking if a Hash Map or Set can store seen elements.",
        cheatSheet: [
          "Lookup / Insert / Delete: O(1) average, O(n) worst-case (hash collision)",
          "Frequency Map: map.set(key, (map.get(key) || 0) + 1)",
          "Lookup Complement: target - currentVal in single pass",
        ],
        commonPitfalls: [
          "Assuming hash maps preserve sorted order (use TreeMap or sort keys if order is required)",
          "Not accounting for memory usage when input size is massive (millions of keys)",
        ],
      },
      {
        title: "The Sliding Window Pattern",
        content: "The sliding window pattern optimizes sub-array and substring problems where the goal is finding minimum, maximum, or target contiguous segments. Instead of recalculating the window from scratch in O(k * n), you add the new right element and subtract the left element in O(n) total time.",
        gfgUrl: "https://www.geeksforgeeks.org/window-sliding-technique/",
        codeSnippet: `// Maximum Sum Subarray of Size K: O(n) Time
function maxSubArraySum(arr: number[], k: number): number {
  if (arr.length < k) return 0;
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  
  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]; // Slide window: add new, drop old
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
        keyTakeaway: "Maintain a running window state by adding incoming elements and ejecting departing elements in constant time.",
        interviewTip: "Distinguish between Fixed-size windows (size K) and Dynamic-size windows (expand right until condition breaks, shrink left to restore validity).",
        cheatSheet: [
          "Fixed Window: windowSum += arr[r] - arr[r - k]",
          "Dynamic Window: while (conditionBroken) { remove(arr[l]); l++; }",
          "Common Prompts: 'Longest substring without repeating characters', 'Min size subarray sum'",
        ],
      },
      {
        title: "Sorting and Search Strategies",
        content: "Sorting reorganizes unsorted collections into monotonic sequence (ascending/descending), allowing binary search, two-pointer convergence, and greedy intervals. Comparison-based sorting (MergeSort, QuickSort, TimSort) operates in O(n log n).",
        gfgUrl: "https://www.geeksforgeeks.org/sorting-algorithms/",
        codeSnippet: `// Merge Intervals Pattern: O(n log n)
function mergeIntervals(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]); // Sort by start time
  
  const merged: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const lastMerged = merged[merged.length - 1];
    
    if (current[0] <= lastMerged[1]) {
      lastMerged[1] = Math.max(lastMerged[1], current[1]); // Overlap: extend end
    } else {
      merged.push(current); // No overlap
    }
  }
  return merged;
}`,
        keyTakeaway: "Sorting transforms chaotic relationships into predictable order. Factor in the O(n log n) sorting cost when analyzing overall complexity.",
        interviewTip: "Whenever an interval, scheduling, or pairing problem feels intractable, sorting by start or end time is frequently the breakthrough step.",
        cheatSheet: [
          "QuickSort: O(n log n) avg, O(n²) worst, O(log n) space (in-place)",
          "MergeSort: O(n log n) guaranteed, O(n) auxiliary space (stable)",
          "Custom Comparator: (a, b) => a.val - b.val for ascending, b.val - a.val for descending",
        ],
      },
      {
        title: "Binary Search Foundations",
        content: "Binary search cuts a monotonic search space in half with every comparison, reducing linear O(n) search to logarithmic O(log n). It applies not just to sorted arrays, but to any problem where a condition function f(x) is monotonic (False, False, ..., True, True).",
        gfgUrl: "https://www.geeksforgeeks.org/binary-search/",
        codeSnippet: `// Universal Binary Search Template (Avoids Integer Overflow)
function binarySearch(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2); // Prevents (low + high) overflow
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1; // Target not found
}`,
        keyTakeaway: "Binary search eliminates half the remaining candidate solutions each iteration in O(log n) time.",
        interviewTip: "Watch out for Binary Search on Answer Space (e.g. 'Koko Eating Bananas', 'Capacity to Ship Packages within D Days').",
        cheatSheet: [
          "Mid calculation: low + Math.floor((high - low) / 2)",
          "Loop condition: low <= high with low = mid + 1 and high = mid - 1",
          "Search Space Halving: 1,000 items in 10 steps, 1,000,000 items in 20 steps!",
        ],
      },
      {
        title: "Time and Space Complexity (Big-O)",
        content: "Big-O notation quantifies how algorithm runtime and memory scale as input size n grows to infinity. Mastery of asymptotic analysis allows you to evaluate trade-offs and communicate engineering decisions with rigor.",
        gfgUrl: "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/",
        codeSnippet: `/* Big-O Complexity Ranking (Fastest to Slowest):
   O(1)        < O(log n)   < O(n)       < O(n log n) < O(n²)      < O(2ⁿ)      < O(n!)
   Constant    Logarithmic  Linear       Linearithmic Quadratic    Exponential  Factorial
   Hash Lookup BinarySearch Loop Scan    MergeSort    Nested Loops RecursiveFib Permutations
*/`,
        keyTakeaway: "Optimize bottlenecks: a nested loop O(n²) will always bottleneck an earlier O(n log n) sort.",
        interviewTip: "Always state both Time and Space complexity proactively before and after writing your code in technical interviews.",
        cheatSheet: [
          "O(1): Direct map access, math calculation, stack push/pop",
          "O(log n): Binary search, heap operations, balanced BST lookup",
          "O(n): Array traversal, string scan, linear search",
          "O(n log n): Efficient sorting (MergeSort, QuickSort)",
          "O(n²): Nested loops, brute-force pair comparisons",
        ],
      },
      {
        title: "Structuring Coding Interview Solutions",
        content: "Top tech interviewers evaluate your problem-solving process as much as your code syntax. Follow the 5-step engineering framework: Understand & Clarify -> Edge Cases -> Approach & Complexity -> Clean Modular Implementation -> Dry-run Walkthrough.",
        gfgUrl: "https://www.geeksforgeeks.org/how-to-prepare-for-coding-interviews/",
        codeSnippet: `// 5-Step Interview Checklist:
// 1. Clarify constraints: "Can numbers be negative? Is array sorted? Empty input?"
// 2. Propose Brute Force (O(n²)) -> Optimize with Map / Two-Pointer (O(n))
// 3. Agree on approach with interviewer BEFORE typing code
// 4. Write clean, readable code with descriptive variable names
// 5. Trace a test case step-by-step through your logic to catch off-by-ones`,
        keyTakeaway: "Never start coding immediately. Clarify constraints, explain the trade-offs of multiple approaches, and verify the plan with your interviewer.",
        interviewTip: "If you get stuck, state your assumptions out loud. Interviewers often give constructive hints when they see your thought trajectory.",
        cheatSheet: [
          "Step 1: Clarify input types, edge cases (null, empty, negative, duplicates)",
          "Step 2: State brute-force complexity -> Explain optimization path",
          "Step 3: Code cleanly with modular helpers",
          "Step 4: Dry-run with an example input and edge cases before saying 'I'm done'",
        ],
      },
    ],
  },
  {
    id: "quantitative-aptitude",
    title: "Quantitative Aptitude",
    category: "Aptitude",
    description: "Master fast calculations, percentages, ratios, work-rate formulas, time-speed-distance, and timed recruiter reasoning tests.",
    lessons: 6,
    duration: "3h 10m",
    level: "Beginner",
    tone: "green",
    curriculum: [
      {
        title: "Percentages and Multipliers",
        content: "Mastering decimal multipliers transforms complex percentage word problems into single-line arithmetic. An x% increase corresponds to multiplying by (1 + x/100); an x% decrease multiplies by (1 - x/100). Successive changes are computed by chained multiplication.",
        gfgUrl: "https://www.geeksforgeeks.org/aptitude-percentages-concepts-and-tricks/",
        formula: "Final Value = Initial Value × (1 ± r₁/100) × (1 ± r₂/100)\nNet Successive % Change = (a + b + ab/100)%",
        keyTakeaway: "Always use decimal multipliers (e.g., +25% is ×1.25, -15% is ×0.85) instead of multi-step percentage calculations.",
        interviewTip: "For successive discounts of 20% and 10%, do NOT add them to 30%. Use Net Change formula: -20 - 10 + (-20)(-10)/100 = -28%.",
        cheatSheet: [
          "Fraction to %: 1/2=50%, 1/3=33.3%, 1/4=25%, 1/5=20%, 1/6=16.67%, 1/8=12.5%",
          "Profit % = (Profit / Cost Price) × 100",
          "Discount % = (Discount / Marked Price) × 100",
          "Selling Price = Cost Price × (100 + Profit%) / 100",
        ],
      },
      {
        title: "Ratios, Proportions & Alligations",
        content: "A ratio a:b expresses relative magnitude. When distributing a total quantity T in ratio a:b:c, the value of one part is T / (a + b + c), and each share is computed by multiplying by its ratio component.",
        gfgUrl: "https://www.geeksforgeeks.org/aptitude-ratios-and-proportions-concepts-and-tricks/",
        formula: "Share of A = Total × [ a / (a + b + c) ]\nRule of Alligation: (Cheaper Qty / Dearer Qty) = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price)",
        keyTakeaway: "Find the value of '1 unit' by dividing total quantity by sum of ratio parts, then scale to any required component.",
        interviewTip: "When mixtures are diluted or replaced, use the remaining liquid formula: Final = Initial × (1 - Replacement/Total)ⁿ.",
        cheatSheet: [
          "Compound Ratio of a:b and c:d is (a×c) : (b×d)",
          "Mean Proportional between x and y is √(x × y)",
          "If a:b = 2:3 and b:c = 4:5, then a:b:c = (2×4) : (3×4) : (3×5) = 8:12:15",
        ],
      },
      {
        title: "Time, Work and Pipes & Cisterns",
        content: "Work problems are simplified by analyzing the rate of work done per unit time (work/day = 1 / Total Days). Alternatively, the LCM method assigns total work as the Least Common Multiple of days to work exclusively with whole integer units.",
        gfgUrl: "https://www.geeksforgeeks.org/time-and-work-aptitude-questions-and-answers/",
        formula: "Work Done = Rate × Time\nCombined Rate (A + B) = (1/A + 1/B) = (A + B)/(A × B)\nTotal Time for (A + B) = (A × B) / (A + B) days",
        keyTakeaway: "Use the LCM method: assign total work = LCM of individual times to convert fractions into clean integer work units.",
        interviewTip: "In Pipes & Cisterns, treat inlet pipes as positive work (+rate) and drainage/leak pipes as negative work (-rate).",
        cheatSheet: [
          "If A takes 10 days and B takes 15 days, LCM(10, 15) = 30 units total.",
          "A does 3 units/day, B does 2 units/day. Combined = 5 units/day.",
          "Time together = 30 units / (5 units/day) = 6 days!",
        ],
      },
      {
        title: "Time, Speed, Distance & Relative Motion",
        content: "Speed measures distance traversed per unit time. When two objects move relative to each other, their relative speed is the sum of speeds if moving in opposite directions, and the difference of speeds if moving in the same direction.",
        gfgUrl: "https://www.geeksforgeeks.org/speed-time-and-distance-aptitude-questions-and-answers/",
        formula: "Distance = Speed × Time\nConversion: 1 km/h = (5/18) m/s | 1 m/s = (18/5) km/h\nAverage Speed for equal distances = (2 × S₁ × S₂) / (S₁ + S₂)",
        keyTakeaway: "Average speed is NOT the arithmetic mean of speeds; it is Total Distance divided by Total Time.",
        interviewTip: "For trains crossing a platform or bridge, Total Distance = Length of Train + Length of Platform.",
        cheatSheet: [
          "Same Direction: Relative Speed = |S₁ - S₂|",
          "Opposite Direction: Relative Speed = S₁ + S₂",
          "Boats & Streams: Downstream = Speed + Current, Upstream = Speed - Current",
        ],
      },
      {
        title: "Number Systems and Modular Arithmetic",
        content: "Mastery of divisibility rules, unit digit cyclicity, remainders, and prime factorization unlocks rapid mental math in high-speed aptitude assessments without long division.",
        gfgUrl: "https://www.geeksforgeeks.org/number-system-in-quantitative-aptitude/",
        formula: "Dividend = (Divisor × Quotient) + Remainder\nUnit Digit Cyclicity of powers of 2, 3, 7, 8 is 4; for 4 and 9 is 2; for 0, 1, 5, 6 is 1.",
        keyTakeaway: "Unit digit patterns repeat in cycles of 4. Find the remainder of power mod 4 to get the exact unit digit instantly.",
        interviewTip: "Divisibility by 3 and 9 checks sum of digits; divisibility by 11 checks alternating sum difference.",
        cheatSheet: [
          "Divisible by 4: Last 2 digits divisible by 4",
          "Divisible by 8: Last 3 digits divisible by 8",
          "Divisible by 11: (Sum of odd-position digits - Sum of even-position digits) is 0 or multiple of 11",
          "To find Unit Digit of 7¹⁰⁵: 105 mod 4 = 1, so 7¹ = 7.",
        ],
      },
      {
        title: "Timed Aptitude Strategy & Elimination",
        content: "Campus placement aptitude tests penalize time sinks. Top test-takers scan questions, prioritize high-speed items, use option substitution, and estimate ranges rather than calculating to 5 decimal places.",
        gfgUrl: "https://www.geeksforgeeks.org/quantitative-aptitude/",
        keyTakeaway: "Never spend more than 90 seconds on a single question in a 60-minute test. Mark and move forward.",
        interviewTip: "Look for extreme options to eliminate: if three choices are around 40-50 and one choice is 450, 450 is almost always a distractor.",
        cheatSheet: [
          "Pass 1: Answer all 30-second low-hanging fruit questions first",
          "Pass 2: Tackle multi-step calculations",
          "Pass 3: Review flagged difficult questions if time remains",
        ],
      },
    ],
  },
  {
    id: "interview-communication",
    title: "Interview Communication & HR Skills",
    category: "Career skills",
    description: "Craft compelling introductions, master the STAR storytelling method, handle technical setbacks gracefully, and ask high-impact questions.",
    lessons: 5,
    duration: "2h 45m",
    level: "Intermediate",
    tone: "orange",
    curriculum: [
      {
        title: "Crafting a High-Impact Elevator Pitch",
        content: "Your introduction sets the tone for the entire interview. Structure your answer using the Present -> Past -> Future trajectory in 60 to 90 seconds: what you are working on currently, your most relevant project win, and why this specific role excites you.",
        gfgUrl: "https://www.geeksforgeeks.org/tell-me-about-yourself-in-interview/",
        codeSnippet: `// 60-Second Introduction Blueprint:
1. PRESENT: "I'm a final-year CS student passionate about distributed backend systems..."
2. PAST WIN: "Recently, I built a real-time collaborative code editor that handled 500+ concurrent WebSocket connections..."
3. FUTURE ALIGNMENT: "I'm eager to join your engineering team because of your high-scale architecture and collaborative culture."`,
        keyTakeaway: "Keep your self-introduction under 90 seconds. Focus on quantifiable technical impact and genuine excitement for the role.",
        interviewTip: "Do not recount your resume chronologically from high school. Lead with your strongest recent projects and technical strengths.",
        cheatSheet: [
          "Duration: 60 - 90 seconds max",
          "Structure: Present (Current focus) -> Past (Top project/skill) -> Future (Company value)",
          "Tone: Enthusiastic, clear, and focused on value creation",
        ],
      },
      {
        title: "Mastering the STAR Storytelling Framework",
        content: "The STAR framework (Situation, Task, Action, Result) brings structure, clarity, and quantitative credibility to behavioral and situational interview questions.",
        gfgUrl: "https://www.geeksforgeeks.org/star-method-for-interviews/",
        codeSnippet: `// STAR Response Breakdown:
• Situation (15%): Set the brief context, team size, and core constraint.
• Task (15%): Define your specific objective and personal responsibility.
• Action (50%): Detail YOUR technical steps, trade-offs evaluated, and leadership.
• Result (20%): Share quantifiable outcomes ("reduced latency by 35%") and lasting learnings.`,
        keyTakeaway: "Spend 50% of your time on Action (what YOU did) and 20% on Result (concrete metrics).",
        interviewTip: "Avoid practical overuse of 'we'—use 'I spearheaded the database migration while collaborating with two backend peers'.",
        cheatSheet: [
          "S: Context & Challenge",
          "T: Goal & My Responsibility",
          "A: Concrete technical actions taken",
          "R: Measurable metrics & key takeaway",
        ],
      },
      {
        title: "Explaining Complex Projects to Any Audience",
        content: "Great engineers communicate complex architecture with simplicity. Start with the high-level business problem, describe the architecture at a 10,000-foot view, and then dive deep into trade-offs (e.g. SQL vs NoSQL, caching strategies).",
        gfgUrl: "https://www.geeksforgeeks.org/how-to-explain-your-project-in-an-interview/",
        keyTakeaway: "State the problem and user impact first before naming the technology stack.",
        interviewTip: "If asked 'Why did you choose PostgreSQL?', explain what you rejected (e.g. MongoDB) and the specific reasons (ACID compliance, relational queries).",
        cheatSheet: [
          "Hook: What problem does this solve?",
          "Architecture: Client -> API Gateway -> Service -> DB",
          "Trade-off: Why technology X over Y?",
          "Metric: What was the measurable improvement?",
        ],
      },
      {
        title: "Discussing Technical Failures and Setbacks",
        content: "Questions like 'Tell me about a time you failed' test your humility, resilience, and growth mindset. Pick a genuine technical or deadline setback, explain how you owned the mistake, and detail the preventive measures you instituted.",
        gfgUrl: "https://www.geeksforgeeks.org/how-to-answer-what-is-your-greatest-failure-in-an-interview/",
        keyTakeaway: "Never blame teammates or external factors. Own the breakdown, explain the root cause, and highlight the lasting process improvement.",
        interviewTip: "Avoid fake weaknesses like 'I work too hard'. Share a real challenge: 'I initially underestimated cache invalidation complexity, which taught me to design write-through protocols.'",
        cheatSheet: [
          "Step 1: Transparently state the situation",
          "Step 2: Own your part without excuses",
          "Step 3: What did you do to fix it immediately?",
          "Step 4: What systematic guardrail did you build to ensure it never happens again?",
        ],
      },
      {
        title: "Asking High-Impact Questions at the End",
        content: "When the interviewer asks 'Do you have any questions for us?', asking insightful questions demonstrates curiosity, technical depth, and cultural alignment.",
        gfgUrl: "https://www.geeksforgeeks.org/questions-to-ask-the-interviewer/",
        codeSnippet: `// High-Impact Questions to Ask:
1. "What is the most technically challenging problem your team is tackling this quarter?"
2. "How does the engineering team handle technical debt versus delivering new product features?"
3. "What does an exceptional engineer in this role achieve within their first 90 days?"`,
        keyTakeaway: "Treat the interview as a two-way technical conversation. Thoughtful questions leave a strong, memorable impression.",
        interviewTip: "Never say 'No, you covered everything'. Always ask at least 2 questions about engineering culture and team challenges.",
        cheatSheet: [
          "Ask about: Architecture challenges, Code review culture, CI/CD deployment cycle, 90-day expectations",
          "Avoid in Round 1: Salary negotiations, vacation policies (save for HR offer stage)",
        ],
      },
    ],
  },
];

export const learningAssessments: LearningAssessment[] = [
  // ==========================================
  // TOPIC 1: DATA STRUCTURES & ALGORITHMS (DSA)
  // ==========================================
  {
    id: "arrays-strings",
    title: "DSA Level 1: Arrays, Strings & Hash Tables",
    topic: "Data Structures & Algorithms",
    category: "Technical",
    level: "Foundation",
    levelBadge: "Level 1: Foundation",
    description: "Master direct index arithmetic, string immutability, memory layouts, and O(1) hash table lookups.",
    durationMinutes: 10,
    questions: [
      { id: "dsa1_1", prompt: "What is the theoretical time complexity of accessing an element in an array by its index?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 0, explanation: "Arrays occupy contiguous blocks in physical RAM, allowing direct memory address calculation via baseAddress + index * elementSize in O(1) time." },
      { id: "dsa1_2", prompt: "Which technique optimal for finding two numbers summing to a target in an unsorted array in O(n) time?", options: ["Nested double for-loop", "Hash Map complement lookup", "Linear search on all pairs", "Bubble sorting the array first"], answer: 1, explanation: "By storing traversed elements in a Hash Map, we check for (target - num) in O(1) average time, solving the problem in O(n) total time." },
      { id: "dsa1_3", prompt: "Why is inserting an element at index 0 of a dynamic array an O(n) operation?", options: ["It requires re-hashing all keys", "All existing n elements must be shifted one slot to the right", "The memory allocator crashes", "Memory fragmentation prevents writes"], answer: 1, explanation: "To make room at index 0 in contiguous memory, every element from index 0 to n-1 must be copied/shifted one index forward." },
      { id: "dsa1_4", prompt: "What is the worst-case lookup complexity in a standard Hash Table when all keys collide into the same bucket?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2, explanation: "When collisions degrade the internal bucket into a linked list without treeification, search degrades to linear traversal O(n)." },
      { id: "dsa1_5", prompt: "In languages like JavaScript, Java, and Python, why does repeated string concatenation in a loop cause O(n²) overhead?", options: ["Strings are immutable and each concatenation allocates a new full copy", "The garbage collector pauses indefinitely", "String length is restricted to 256 bytes", "Unicode conversion requires logarithmic overhead"], answer: 0, explanation: "Because strings are immutable, `s += char` copies the entire accumulated string each time, resulting in 1 + 2 + ... + n = O(n²) operations." },
    ],
  },
  {
    id: "dsa-intermediate",
    title: "DSA Level 2: Two Pointers, Binary Search & Sliding Window",
    topic: "Data Structures & Algorithms",
    category: "Technical",
    level: "Intermediate",
    levelBadge: "Level 2: Intermediate",
    description: "Standard corporate interview patterns: window contraction, fast/slow runners, and logarithmic halving.",
    durationMinutes: 12,
    questions: [
      { id: "dsa2_1", prompt: "How does the Sliding Window technique reduce the complexity of finding the maximum sum subarray of size K from O(N·K) to O(N)?", options: ["By sorting elements in each window", "By adding the incoming element and subtracting the outgoing element in O(1)", "By allocating auxiliary hash tables", "By utilizing recursion"], answer: 1, explanation: "Instead of recalculating the sum of K elements from scratch, we slide the window by adding array[i] and subtracting array[i - K] in O(1) time." },
      { id: "dsa2_2", prompt: "In Binary Search, why is `mid = low + Math.floor((high - low) / 2)` preferred over `mid = Math.floor((low + high) / 2)`?", options: ["It runs twice as fast on modern CPUs", "It prevents 32-bit integer overflow when (low + high) exceeds 2³¹ - 1", "It works on unsorted inputs", "It handles floating point precision errors"], answer: 1, explanation: "In languages with fixed-width integer sizes, `(low + high)` can exceed the maximum integer boundary, causing negative integer overflow." },
      { id: "dsa2_3", prompt: "Which two-pointer approach is used to detect a cycle in a singly linked list with O(1) auxiliary memory?", options: ["Inward converging pointers", "Floyd's Tortoise and Hare (Slow & Fast pointers)", "Prefix sum pointer", "Sliding window of width 2"], answer: 1, explanation: "Floyd's cycle-finding algorithm moves slow by 1 step and fast by 2 steps. If a cycle exists, they must eventually meet in O(N) time and O(1) space." },
      { id: "dsa2_4", prompt: "Given a sorted array of distinct integers, how can you find a pair with sum equal to X in O(n) time and O(1) extra space?", options: ["Hash set lookup", "Two pointers initialized at index 0 and index n - 1 moving inward", "Merge sort", "Bitwise XOR mask"], answer: 1, explanation: "If sum < X, increment left; if sum > X, decrement right. This converges in at most n steps with zero auxiliary allocations." },
      { id: "dsa2_5", prompt: "When is Binary Search applicable to a problem where the input is NOT a sorted array?", options: ["When the problem search space exhibits a monotonic Boolean predicate f(x)", "When the array length is a power of 2", "When all values are positive", "Only if elements are stored in a hash map"], answer: 0, explanation: "Binary search applies to any answer space where a condition function f(x) monotonically transitions from False to True (or vice-versa)." },
    ],
  },
  {
    id: "dsa-advanced",
    title: "DSA Level 3: Trees, Graphs, BFS/DFS & Heaps",
    topic: "Data Structures & Algorithms",
    category: "Technical",
    level: "Advanced",
    levelBadge: "Level 3: Advanced",
    description: "Hierarchical structures, shortest-path traversals, topological sorting, and priority queue invariants.",
    durationMinutes: 15,
    questions: [
      { id: "dsa3_1", prompt: "What is the time complexity of Breadth-First Search (BFS) and Depth-First Search (DFS) on a graph represented as an Adjacency List with V vertices and E edges?", options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"], answer: 2, explanation: "Both BFS and DFS visit every vertex once and inspect each incident edge once, yielding O(V + E) time." },
      { id: "dsa3_2", prompt: "In a Binary Search Tree (BST), which tree traversal order produces node values in strictly sorted ascending order?", options: ["Pre-order (Root, Left, Right)", "In-order (Left, Root, Right)", "Post-order (Left, Right, Root)", "Level-order (BFS)"], answer: 1, explanation: "In-order traversal visits the left subtree, then the root, then the right subtree, which naturally extracts keys in non-decreasing order." },
      { id: "dsa3_3", prompt: "What is the time complexity of inserting an element into a Binary Min-Heap of N elements and extracting the minimum?", options: ["Insert O(1), Extract O(1)", "Insert O(log N), Extract O(log N)", "Insert O(N), Extract O(1)", "Insert O(log N), Extract O(N)"], answer: 1, explanation: "Insertion places the key at the bottom and bubbles up in O(log N). Extract-min swaps with the last leaf and bubbles down in O(log N)." },
      { id: "dsa3_4", prompt: "Which algorithm finds the single-source shortest path in a weighted graph with non-negative edge weights?", options: ["Kruskal's Algorithm", "Dijkstra's Algorithm with a Priority Queue", "Tarjan's SCC Algorithm", "Kosaraju's Algorithm"], answer: 1, explanation: "Dijkstra's algorithm greedily expands the shortest distance vertex using a min-priority queue in O((V + E) log V) time." },
      { id: "dsa3_5", prompt: "What data structure is utilized to detect cycles and manage disjoint components in Kruskal's Minimum Spanning Tree algorithm?", options: ["Trie with Radix branching", "Disjoint Set Union (Union-Find) with Path Compression", "Monotonic Deque", "Suffix Automaton"], answer: 1, explanation: "Union-Find with path compression and union by rank provides nearly constant O(α(N)) amortized time for connectivity queries." },
    ],
  },
  {
    id: "dsa-expert",
    title: "DSA Level 4: Dynamic Programming & Recruiter Challenge Traps",
    topic: "Data Structures & Algorithms",
    category: "Technical",
    level: "Expert",
    levelBadge: "Level 4: Expert",
    description: "Optimal substructure proofs, state compression, monotonic stacks, and hard placement interview edge cases.",
    durationMinutes: 18,
    questions: [
      { id: "dsa4_1", prompt: "What two essential properties must a problem satisfy to be solvable via Dynamic Programming?", options: ["Greedy choice property and monotonic ordering", "Overlapping Subproblems and Optimal Substructure", "Divide and conquer with independent subproblems", "Linear recursion and deterministic randomness"], answer: 1, explanation: "Dynamic programming requires that optimal solutions to subproblems combine to solve the main problem, and that subproblems recur repeatedly." },
      { id: "dsa4_2", prompt: "In the 0/1 Knapsack problem with N items and capacity W, why can space complexity be compressed from O(N·W) to O(W)?", options: ["Because the DP transition only depends on the previous row, traversed backwards", "Because the items can be sorted by density", "Because memoization is omitted", "Because Bit manipulation computes sums in O(1)"], answer: 0, explanation: "Since dp[i][w] only needs dp[i-1][w] and dp[i-1][w - weight], iterating backwards over capacity in a single 1D array avoids overwriting needed values." },
      { id: "dsa4_3", prompt: "Which data structure solves the 'Next Greater Element' and 'Largest Rectangle in Histogram' problems in linear O(N) time?", options: ["Segment Tree with Lazy Propagation", "Monotonic Stack", "Fenwick (Binary Indexed) Tree", "Doubly Linked Skip List"], answer: 1, explanation: "A Monotonic Stack maintains elements in strict increasing or decreasing order, guaranteeing each index is pushed and popped at most once." },
      { id: "dsa4_4", prompt: "What is the amortized time complexity of inserting into a Dynamic Array (e.g. vector/ArrayList) that doubles capacity when full?", options: ["O(1) amortized", "O(log N) amortized", "O(N) amortized", "O(N²) amortized"], answer: 0, explanation: "Doubling capacity requires copying N elements once every N insertions. Aggregate analysis shows total cost for N insertions is ≤ 3N, giving O(1) amortized cost." },
      { id: "dsa4_5", prompt: "In the Longest Increasing Subsequence (LIS) problem, how is the time complexity reduced from O(N²) DP to O(N log N)?", options: ["By using Patience Sorting with Binary Search (std::lower_bound)", "By hashing all permutations", "By building a Min-Cut Graph", "By computing Fast Fourier Transforms"], answer: 0, explanation: "Maintaining a tails array of minimal end-elements and replacing items via binary search allows updating active subsequences in O(N log N)." },
    ],
  },

  // ==========================================
  // TOPIC 2: QUANTITATIVE APTITUDE & MATH
  // ==========================================
  {
    id: "aptitude-foundation",
    title: "Aptitude Level 1: Percentages, Ratios & Multipliers",
    topic: "Quantitative Aptitude",
    category: "Aptitude",
    level: "Foundation",
    levelBadge: "Level 1: Foundation",
    description: "Decimal multipliers, fraction-to-percentage conversions, profit-loss margins, and direct ratios.",
    durationMinutes: 8,
    questions: [
      { id: "apt1_1", prompt: "A price is increased by 25% and then discounted by 20%. What is the net percentage change in price?", options: ["+5% increase", "0% (No change)", "-5% decrease", "+1% increase"], answer: 1, explanation: "Net multiplier = 1.25 × 0.80 = 1.00. Therefore, the final price is exactly equal to the initial price (0% change)." },
      { id: "apt1_2", prompt: "An article bought for ₹400 is sold for ₹500. What is the profit percentage calculated on cost price?", options: ["20%", "25%", "30%", "15%"], answer: 1, explanation: "Profit = ₹500 - ₹400 = ₹100. Profit % = (100 / 400) × 100 = 25%." },
      { id: "apt1_3", prompt: "If the ratio of A:B is 2:3 and B:C is 4:5, what is the combined ratio A:B:C?", options: ["8:12:15", "6:8:10", "2:4:5", "8:10:15"], answer: 0, explanation: "Multiply A:B by 4 -> 8:12; multiply B:C by 3 -> 12:15. Combined ratio is 8:12:15." },
      { id: "apt1_4", prompt: "What is the fractional equivalent of 16.67%?", options: ["1/5", "1/6", "1/7", "1/8"], answer: 1, explanation: "16 2/3% = 50/3% = 50/300 = 1/6." },
      { id: "apt1_5", prompt: "A laptop is sold at ₹36,000 after offering a 10% discount on marked price. What was the marked price?", options: ["₹39,000", "₹40,000", "₹42,000", "₹45,000"], answer: 1, explanation: "Selling Price = 90% of Marked Price. Marked Price = 36,000 ÷ 0.90 = ₹40,000." },
    ],
  },
  {
    id: "logical-reasoning",
    title: "Aptitude Level 2: Time, Work & Relative Motion",
    topic: "Quantitative Aptitude",
    category: "Aptitude",
    level: "Intermediate",
    levelBadge: "Level 2: Intermediate",
    description: "LCM work-rate formulas, inlet/outlet cisterns, relative speed, and train platform crossings.",
    durationMinutes: 10,
    questions: [
      { id: "apt2_1", prompt: "Pipe A can fill a tank in 12 hours and Pipe B can empty it in 20 hours. If both pipes are opened together, how long will it take to fill the tank?", options: ["25 hours", "30 hours", "32 hours", "40 hours"], answer: 1, explanation: "LCM(12, 20) = 60 units. Pipe A fills 5 units/hr, Pipe B empties 3 units/hr. Net rate = +2 units/hr. Time = 60 / 2 = 30 hours." },
      { id: "apt2_2", prompt: "A train 150 meters long traveling at 54 km/h passes a stationary pole. How many seconds does it take to cross the pole?", options: ["8 seconds", "10 seconds", "12 seconds", "15 seconds"], answer: 1, explanation: "Speed in m/s = 54 × (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds." },
      { id: "apt2_3", prompt: "If A works twice as fast as B, and together they complete a project in 14 days, how many days will A take alone?", options: ["21 days", "28 days", "35 days", "42 days"], answer: 0, explanation: "Let B's rate = 1 unit/day, A's rate = 2 units/day. Combined = 3 units/day. Total work = 3 × 14 = 42 units. A alone = 42 / 2 = 21 days." },
      { id: "apt2_4", prompt: "A car travels from City X to City Y at 60 km/h and returns at 40 km/h. What is the average speed for the entire round trip?", options: ["50 km/h", "48 km/h", "45 km/h", "52 km/h"], answer: 1, explanation: "For equal distances, Average Speed = (2 × S₁ × S₂) / (S₁ + S₂) = (2 × 60 × 40) / (60 + 40) = 4800 / 100 = 48 km/h." },
      { id: "apt2_5", prompt: "Two trains traveling in opposite directions at 70 km/h and 50 km/h have a relative speed of:", options: ["20 km/h", "60 km/h", "120 km/h", "140 km/h"], answer: 2, explanation: "When traveling in opposite directions, relative speed is the sum of both individual speeds: 70 + 50 = 120 km/h." },
    ],
  },
  {
    id: "aptitude-advanced",
    title: "Aptitude Level 3: Alligations, Mixtures & Combinatorics",
    topic: "Quantitative Aptitude",
    category: "Aptitude",
    level: "Advanced",
    levelBadge: "Level 3: Advanced",
    description: "The Rule of Alligation, successive liquid dilutions, permutation constraints, and probability models.",
    durationMinutes: 12,
    questions: [
      { id: "apt3_1", prompt: "In what ratio must rice at ₹40/kg be mixed with rice at ₹60/kg so that the resulting mixture is worth ₹48/kg?", options: ["2:3", "3:2", "4:5", "1:2"], answer: 1, explanation: "Rule of Alligation: (Dearer - Mean) / (Mean - Cheaper) = (60 - 48) / (48 - 40) = 12 / 8 = 3:2." },
      { id: "apt3_2", prompt: "A container contains 80 liters of pure milk. 8 liters are drawn out and replaced with water. This process is repeated one more time. How much pure milk remains?", options: ["64.8 liters", "65.2 liters", "68.4 liters", "72.0 liters"], answer: 0, explanation: "Remaining Milk = Initial × (1 - x/Total)ⁿ = 80 × (1 - 8/80)² = 80 × (0.9)² = 80 × 0.81 = 64.8 liters." },
      { id: "apt3_3", prompt: "How many distinct 4-letter words can be formed from the letters of 'ALGORITHM' without repeating any letters?", options: ["504", "1512", "3024", "4032"], answer: 2, explanation: "Total letters = 9 (all distinct). Number of permutations P(9, 4) = 9 × 8 × 7 × 6 = 3024." },
      { id: "apt3_4", prompt: "Two fair six-sided dice are rolled simultaneously. What is the probability that the sum of the numbers is 8?", options: ["5/36", "1/6", "7/36", "1/9"], answer: 0, explanation: "Total outcomes = 36. Pairs summing to 8 are: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 favorable outcomes. Probability = 5/36." },
      { id: "apt3_5", prompt: "In a group of 6 men and 4 women, a committee of 4 people is to be formed containing at least 2 women. How many combinations exist?", options: ["115", "185", "195", "210"], answer: 0, explanation: "Cases: (2W, 2M) + (3W, 1M) + (4W, 0M) = (4C2 × 6C2) + (4C3 × 6C1) + (4C4 × 6C0) = (6 × 15) + (4 × 6) + (1 × 1) = 90 + 24 + 1 = 115." },
    ],
  },
  {
    id: "aptitude-expert",
    title: "Aptitude Level 4: Modular Arithmetic, Cyclicity & Number Theory",
    topic: "Quantitative Aptitude",
    category: "Aptitude",
    level: "Expert",
    levelBadge: "Level 4: Expert",
    description: "Chinese Remainder shortcuts, Fermat's Little Theorem, unit digit cyclicity, and high-speed mental math.",
    durationMinutes: 15,
    questions: [
      { id: "apt4_1", prompt: "What is the unit digit of 7²⁰²⁶?", options: ["1", "3", "7", "9"], answer: 3, explanation: "The cyclicity of powers of 7 is 4 (7¹=7, 7²=9, 7³=3, 7⁴=1). 2026 mod 4 = 2. Therefore, unit digit is equal to 7² mod 10 = 9." },
      { id: "apt4_2", prompt: "What is the remainder when (2¹⁰⁰) is divided by 13?", options: ["1", "3", "9", "12"], answer: 2, explanation: "By Fermat's Little Theorem, 2¹² ≡ 1 (mod 13). 100 = 12 × 8 + 4. So 2¹⁰⁰ ≡ (2¹²)⁸ × 2⁴ ≡ 1 × 16 ≡ 3 (mod 13)." },
      { id: "apt4_3", prompt: "How many trailing zeros are in the decimal expansion of 100! (100 factorial)?", options: ["20", "24", "25", "28"], answer: 1, explanation: "Trailing zeros count factors of 5: floor(100/5) + floor(100/25) = 20 + 4 = 24 trailing zeros." },
      { id: "apt4_4", prompt: "A number when divided by 5 leaves remainder 3, and when divided by 7 leaves remainder 2. What is the smallest positive such integer?", options: ["18", "23", "33", "38"], answer: 1, explanation: "Numbers of form 7k + 2: 2, 9, 16, 23... Testing with mod 5: 23 mod 5 = 3. Smallest integer is 23." },
      { id: "apt4_5", prompt: "If log₁₀(2) = 0.30103, how many digits are in the integer expansion of 2⁶⁴?", options: ["19", "20", "21", "22"], answer: 1, explanation: "Number of digits = floor(64 × log₁₀(2)) + 1 = floor(64 × 0.30103) + 1 = floor(19.266) + 1 = 20 digits." },
    ],
  },

  // ==========================================
  // TOPIC 3: LOGICAL REASONING & DATA INTERPRETATION
  // ==========================================
  {
    id: "logical-foundation",
    title: "Logical Level 1: Sequences, Coding & Direction Sense",
    topic: "Logical Reasoning",
    category: "Logical Reasoning",
    level: "Foundation",
    levelBadge: "Level 1: Foundation",
    description: "Pattern recognition in alphanumeric series, displacement vectors, and family tree relations.",
    durationMinutes: 8,
    questions: [
      { id: "log1_1", prompt: "What number logically completes the series: 4, 9, 19, 39, 79, …?", options: ["119", "149", "159", "169"], answer: 2, explanation: "Pattern: Multiply by 2 and add 1. (79 × 2) + 1 = 158 + 1 = 159." },
      { id: "log1_2", prompt: "If 'SYSTEM' is coded as 'SYSMET' in a certain cipher, how is 'FRACTION' coded?", options: ["ARFCNOIT", "CARFNOIT", "ARFCTION", "FRAITNOC"], answer: 0, explanation: "Split into two halves: 'SYS' and 'TEM'. First half reversed = 'SYS'; second half reversed = 'MET'. For 'FRACTION', 'FRAC' reversed = 'CARF' or first 4 reversed 'ARFC' + second 4 reversed 'NOIT' = 'ARFCNOIT'." },
      { id: "log1_3", prompt: "A person walks 10 meters North, turns right and walks 6 meters, then turns right again and walks 10 meters. How far and in what direction is the person from the starting point?", options: ["6 meters East", "6 meters West", "10 meters North", "16 meters South"], answer: 0, explanation: "North 10m and South 10m cancel out completely, leaving a net displacement of 6 meters due East." },
      { id: "log1_4", prompt: "Pointing to a photograph, Rahul says: 'She is the daughter of the only son of my grandfather.' How is the girl in the photo related to Rahul?", options: ["Rahul's Mother", "Rahul's Sister", "Rahul's Aunt", "Rahul's Daughter"], answer: 1, explanation: "'My grandfather's only son' is Rahul's father. The daughter of Rahul's father is Rahul's sister." },
      { id: "log1_5", prompt: "In a row of 35 students, Aryan is 12th from the left end. What is his position from the right end?", options: ["23rd", "24th", "25th", "22nd"], answer: 1, explanation: "Position from right = Total - Position from left + 1 = 35 - 12 + 1 = 24th." },
    ],
  },
  {
    id: "logical-intermediate",
    title: "Logical Level 2: Syllogisms & Seating Arrangements",
    topic: "Logical Reasoning",
    category: "Logical Reasoning",
    level: "Intermediate",
    levelBadge: "Level 2: Intermediate",
    description: "Venn diagram deductive logic, circular arrangements, and condition satisfiability.",
    durationMinutes: 10,
    questions: [
      { id: "log2_1", prompt: "Statements:\n1. All engineers are innovators.\n2. Some innovators are leaders.\nConclusion I: Some engineers are leaders.\nConclusion II: Some innovators are engineers.\nWhich conclusion(s) logically follow?", options: ["Only Conclusion I follows", "Only Conclusion II follows", "Both I and II follow", "Neither follows"], answer: 1, explanation: "'All engineers are innovators' immediately implies its converse 'Some innovators are engineers' (Conclusion II). There is no guaranteed overlap between engineers and leaders." },
      { id: "log2_2", prompt: "Six people (A, B, C, D, E, F) sit in a circle facing the center. A is opposite D. B is to the immediate right of A. F is opposite B. Who is sitting to the immediate left of D?", options: ["E", "F", "B", "C"], answer: 1, explanation: "Since D is opposite A, facing the center, D's left is opposite A's right (which is B). The person opposite B is F, so F is to the immediate left of D." },
      { id: "log2_3", prompt: "Statements:\n1. No plastic is metal.\n2. All spoons are plastic.\nConclusion: No spoon is metal.", options: ["Definitely True", "Definitely False", "Cannot be determined", "Partially True"], answer: 0, explanation: "Since all spoons reside completely inside the plastic set, and the plastic set shares zero intersection with metal, no spoon can ever be metal." },
      { id: "log2_4", prompt: "Five friends P, Q, R, S, T run a race. P finished before Q but after T. R finished before S but after Q. Who finished first?", options: ["P", "T", "R", "S"], answer: 1, explanation: "Ordering constraints: T > P > Q and Q > R > S. Combined sequence: T > P > Q > R > S. T finished in 1st place." },
      { id: "log2_5", prompt: "If A + B means A is the father of B; A - B means A is the wife of B; A × B means A is the brother of B. Which expression represents 'P is the paternal uncle of S'?", options: ["P × Q + S", "P + Q × S", "P - Q + S", "P × Q - S"], answer: 0, explanation: "P × Q means P is the brother of Q. Q + S means Q is the father of S. The brother of S's father is S's paternal uncle." },
    ],
  },
  {
    id: "logical-advanced",
    title: "Logical Level 3: Critical Reasoning & Truth-Teller Deductions",
    topic: "Logical Reasoning",
    category: "Logical Reasoning",
    level: "Advanced",
    levelBadge: "Level 3: Advanced",
    description: "Assumption validation, argument strengthening/weakening, and knight-knave logical dilemmas.",
    durationMinutes: 12,
    questions: [
      { id: "log3_1", prompt: "On an island, Knights always tell the truth and Knaves always lie. Person A says: 'At least one of us is a Knave.' Person B says nothing. What are Person A and Person B?", options: ["A is a Knight, B is a Knave", "Both are Knaves", "Both are Knights", "A is a Knave, B is a Knight"], answer: 0, explanation: "If A were a Knave, his statement would be false (implying both are Knights), a contradiction. Thus A is a Knight (truthful). For his statement to be true, B must be a Knave." },
      { id: "log3_2", prompt: "Statement: 'The company should invest heavily in automated CI/CD testing pipelines to reduce software defects in production.' Which underlying assumption is implicit?", options: ["Automated CI/CD pipelines can catch defects before code is deployed to production", "Manual QA testing has 0% defect detection capability", "All developers will refuse to write unit tests", "Defects in production have no financial cost"], answer: 0, explanation: "The recommendation assumes that CI/CD pipelines have the efficacy to identify and stop defects prior to production release." },
      { id: "log3_3", prompt: "Which of the following, if true, would most WEAKEN the argument: 'Switching all company databases to NoSQL will improve system response times across all services'?", options: ["NoSQL databases scale horizontally easily", "80% of current services require complex multi-table ACID transactions which NoSQL handles with significant overhead", "Storage hardware is inexpensive", "Developers know JSON syntax well"], answer: 1, explanation: "If existing workloads heavily require relational ACID transactions, forcing NoSQL introduces latency penalties and application-level lock overhead." },
      { id: "log3_4", prompt: "If 'Only if the API returns 200 OK does the UI render the dashboard' is TRUE, which situation is logically IMPOSSIBLE?", options: ["The API returns 500 Error and the UI renders the dashboard", "The API returns 200 OK and the UI does not render the dashboard", "The API returns 500 Error and the UI does not render the dashboard", "The API returns 200 OK and the UI renders the dashboard"], answer: 0, explanation: "'Only if P then Q' means Q -> P. If Q occurs (UI renders), P must have occurred (API returned 200). Rendering the dashboard on a 500 error is impossible." },
      { id: "log3_5", prompt: "Three switches outside a closed room control three lightbulbs inside. You can only enter the room once. What is the optimal strategy to identify which switch controls which bulb?", options: ["Turn Switch 1 on for 10 min, turn it off, turn Switch 2 on, and enter immediately (check on, off-warm, off-cold)", "Turn all three on and enter", "Randomly flip switches twice", "Leave all switches off"], answer: 0, explanation: "The bulb currently ON is Switch 2. The bulb OFF but WARM to touch is Switch 1. The bulb OFF and COLD is Switch 3." },
    ],
  },
  {
    id: "logical-expert",
    title: "Logical Level 4: Matrix Logic Puzzles & Data Interpretation",
    topic: "Logical Reasoning",
    category: "Logical Reasoning",
    level: "Expert",
    levelBadge: "Level 4: Expert",
    description: "Complex multi-variable constraint grids, statistical sufficiency, and placement reasoning rounds.",
    durationMinutes: 15,
    questions: [
      { id: "log4_1", prompt: "Four engineers (Alex, Ben, Clara, Dan) use 4 languages (Go, Rust, Python, Java) at 4 companies (Google, Meta, Apple, Netflix). Alex does not work at Meta or use Go. Clara works at Netflix and uses Rust. The Apple engineer uses Python. Which language and company belongs to Alex?", options: ["Java at Google", "Go at Apple", "Python at Netflix", "Rust at Meta"], answer: 0, explanation: "Clara = Netflix (Rust). Apple engineer = Python. Dan or Ben must be Apple. Alex cannot use Go or work at Meta, so Alex must work at Google and use Java." },
      { id: "log4_2", prompt: "Is the integer X divisible by 6?\nStatement (1): X is divisible by 2.\nStatement (2): X is divisible by 3.\nDetermine if the data is sufficient to answer.", options: ["Statement (1) ALONE is sufficient", "Statement (2) ALONE is sufficient", "BOTH statements TOGETHER are sufficient", "Statements (1) and (2) TOGETHER are NOT sufficient"], answer: 2, explanation: "A number is divisible by 6 if and only if it is divisible by both coprime factors 2 and 3. Both statements together provide sufficient information." },
      { id: "log4_3", prompt: "In a statistical distribution of candidate interview scores, if Mean = 72 and Median = 75, what is the skewness of the distribution?", options: ["Negatively Skewed (Left-skewed)", "Positively Skewed (Right-skewed)", "Symmetrical (Zero skew)", "Bimodal"], answer: 0, explanation: "When Mean < Median < Mode, the distribution has a tail on the left side, which is classified as Negatively (Left) Skewed." },
      { id: "log4_4", prompt: "Five boxes of coins are labeled 10g, but one box contains counterfeit 9g coins. Using a digital scale only ONCE, how do you identify the counterfeit box?", options: ["Take 1 coin from Box 1, 2 from Box 2, 3 from Box 3, 4 from Box 4, 5 from Box 5 and weigh total", "Weigh Box 1 vs Box 2", "Weigh all boxes together", "Take 2 coins from each box"], answer: 0, explanation: "Expected weight of 15 coins is 150g. If the measured weight is (150 - k) grams, then Box k contains the 9g counterfeit coins." },
      { id: "log4_5", prompt: "A bar chart shows Company revenue grew from $10M in Year 1 to $40M in Year 3. What was the Compound Annual Growth Rate (CAGR)?", options: ["100%", "73.2%", "50%", "200%"], answer: 0, explanation: "CAGR = (End / Start)^(1/n) - 1 = (40 / 10)^(1/2) - 1 = √4 - 1 = 2 - 1 = 1.00 = 100% per year." },
    ],
  },

  // ==========================================
  // TOPIC 4: CORE CS (OS, DBMS, NETWORKS)
  // ==========================================
  {
    id: "corecs-foundation",
    title: "Core CS Level 1: Processes, SQL Basics & OSI Layers",
    topic: "Core Computer Science",
    category: "Core CS",
    level: "Foundation",
    levelBadge: "Level 1: Foundation",
    description: "Threads vs processes, standard relational SQL queries, and the 7-layer networking architecture.",
    durationMinutes: 10,
    questions: [
      { id: "cs1_1", prompt: "What is the primary difference between a Process and a Thread in modern operating systems?", options: ["Processes share memory space; threads have isolated memory", "Processes have isolated address spaces; threads within a process share the same memory heap", "Threads cannot execute code concurrently", "Processes do not require CPU scheduling"], answer: 1, explanation: "Each process has an isolated virtual address space. Threads within the same process share code, data, and heap, but retain private stacks and program counters." },
      { id: "cs1_2", prompt: "Which SQL clause is used to filter records AFTER an aggregation operation using GROUP BY?", options: ["WHERE", "HAVING", "ORDER BY", "DISTINCT"], answer: 1, explanation: "The `WHERE` clause filters individual rows before grouping, while `HAVING` filters aggregated groups after `GROUP BY` is evaluated." },
      { id: "cs1_3", prompt: "Which layer of the OSI model is responsible for end-to-end reliable segment transmission, flow control, and port addressing?", options: ["Network Layer (Layer 3)", "Transport Layer (Layer 4)", "Data Link Layer (Layer 2)", "Session Layer (Layer 5)"], answer: 1, explanation: "Layer 4 (Transport Layer, e.g. TCP/UDP) handles process-to-process port multiplexing, segmentation, acknowledgments, and flow control." },
      { id: "cs1_4", prompt: "What does the SQL command `DELETE FROM Users` do compared to `TRUNCATE TABLE Users`?", options: ["DELETE is DDL while TRUNCATE is DML", "DELETE removes rows log-by-log and can be rolled back; TRUNCATE deallocates data pages rapidly", "Both operate identically", "TRUNCATE deletes the table schema definition"], answer: 1, explanation: "`DELETE` evaluates row-by-row and logs each deletion for rollback. `TRUNCATE` is a DDL command that deallocates entire data pages directly." },
      { id: "cs1_5", prompt: "In Linux / Unix systems, what state does a child process enter if it terminates before its parent calls `wait()`?", options: ["Orphan process", "Zombie process (defunct)", "Daemon process", "Sleeping process"], answer: 1, explanation: "A Zombie process has finished execution but remains in the process table to hold its exit status until read by its parent via `wait()`." },
    ],
  },
  {
    id: "corecs-intermediate",
    title: "Core CS Level 2: Indexing, Normalization & TCP Handshake",
    topic: "Core Computer Science",
    category: "Core CS",
    level: "Intermediate",
    levelBadge: "Level 2: Intermediate",
    description: "B-Tree vs Hash indexes, 3NF schema design, deadlock conditions, and TCP 3-way handshake.",
    durationMinutes: 12,
    questions: [
      { id: "cs2_1", prompt: "Why are B+ Trees predominantly preferred over Hash Indexes in relational database storage engines?", options: ["B+ Trees support fast range scans (BETWEEN, <, >) via linked leaf nodes", "B+ Trees require zero disk I/O", "Hash indexes do not support integer keys", "B+ Trees have O(1) worst-case lookup"], answer: 0, explanation: "B+ Tree leaf nodes form a sorted doubly linked list, enabling efficient range queries and sequential disk scans, which Hash indexes cannot perform." },
      { id: "cs2_2", prompt: "What are the four Coffman conditions required for a Deadlock to occur in an operating system?", options: ["Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait", "Paging, Fragmentation, Thrashing, Swapping", "Race Condition, Critical Section, Mutex, Semaphore", "Cache Miss, TLB Hit, Context Switch, Interrupt"], answer: 0, explanation: "All four conditions (Mutual exclusion, Hold & wait, No preemption of resources, and Circular wait) must hold simultaneously for a deadlock to exist." },
      { id: "cs2_3", prompt: "What packets are exchanged during a standard TCP Three-Way Handshake connection establishment?", options: ["SYN -> SYN-ACK -> ACK", "ACK -> SYN -> ACK-SYN", "FIN -> ACK -> FIN-ACK", "PING -> PONG -> OK"], answer: 0, explanation: "Client sends SYN (with seq=x), Server replies with SYN-ACK (seq=y, ack=x+1), Client confirms with ACK (seq=x+1, ack=y+1)." },
      { id: "cs2_4", prompt: "A relational database table is in Third Normal Form (3NF) if it is in 2NF and has NO:", options: ["Primary Keys", "Foreign Keys", "Transitive Functional Dependencies (non-key attribute depending on another non-key attribute)", "Null values"], answer: 2, explanation: "3NF eliminates transitive dependencies: every non-prime attribute must depend directly on the primary key, the whole key, and nothing but the key." },
      { id: "cs2_5", prompt: "What is the purpose of the Translation Lookaside Buffer (TLB) in virtual memory management?", options: ["A fast hardware cache to store recent Virtual-to-Physical page address translations", "To store disk swap files", "To encrypt memory packets", "To prevent stack overflow"], answer: 0, explanation: "The TLB is an on-chip associative cache in the MMU that accelerates page translation, avoiding slow multi-level page table walks in RAM." },
    ],
  },
  {
    id: "corecs-advanced",
    title: "Core CS Level 3: ACID Isolation, Virtual Memory & HTTP/2",
    topic: "Core Computer Science",
    category: "Core CS",
    level: "Advanced",
    levelBadge: "Level 3: Advanced",
    description: "Read Committed vs Repeatable Read, dirty reads, page fault handling, and multiplexed protocols.",
    durationMinutes: 15,
    questions: [
      { id: "cs3_1", prompt: "In database transaction isolation levels, what is a 'Phantom Read'?", options: ["Reading uncommitted data from another active transaction", "A query re-reading the same range of rows and discovering new rows inserted by another committed transaction", "Reading corrupted disk sectors", "A transaction locking itself in deadlock"], answer: 1, explanation: "A Phantom Read occurs when transaction T1 executes a range query twice, and transaction T2 inserts new rows satisfying the range in between." },
      { id: "cs3_2", prompt: "What is Thrashing in an Operating System's virtual memory subsystem?", options: ["A state where the CPU spends more time swapping pages in/out of disk than executing user instructions", "An attacker flooding the network interface", "CPU overheating during floating point loops", "Multiple threads writing to stdout"], answer: 0, explanation: "Thrashing occurs when the total working set of active processes exceeds physical RAM, causing continuous page faults and disk I/O saturation." },
      { id: "cs3_3", prompt: "How does HTTP/2 solve the Head-of-Line (HoL) blocking problem present at the application layer in HTTP/1.1?", options: ["By using binary framing and request/response stream multiplexing over a single TCP connection", "By replacing TCP with UDP completely", "By removing TLS encryption", "By disabling browser caching"], answer: 0, explanation: "HTTP/2 splits requests into independent binary frames and interleaves them over one connection, preventing one slow request from blocking others." },
      { id: "cs3_4", prompt: "What is the key mechanism of Optimistic Concurrency Control (OCC) in high-throughput databases?", options: ["Locking every row on read", "Allowing transactions to read and modify data without locks, checking for version conflicts during the commit phase", "Disabling concurrent writes completely", "Using serial execution on a single thread"], answer: 1, explanation: "OCC assumes conflicts are rare: transactions proceed without acquiring heavy locks and validate version timestamps at commit time, aborting on conflict." },
      { id: "cs3_5", prompt: "What happens during a Context Switch between two user threads belonging to DIFFERENT processes?", options: ["Only general-purpose CPU registers are saved", "CPU registers, program counter, and the Memory Management Unit (MMU) Page Directory/TLB are flushed and reloaded", "The kernel restarts the machine", "Disk cache is deleted"], answer: 1, explanation: "Inter-process context switches require invalidating virtual address mapping (CR3 register in x86) and flushing the TLB, which is more expensive than thread switches." },
    ],
  },
  {
    id: "corecs-expert",
    title: "Core CS Level 4: Distributed Systems & Low-Latency Architecture",
    topic: "Core Computer Science",
    category: "Core CS",
    level: "Expert",
    levelBadge: "Level 4: Expert",
    description: "CAP theorem trade-offs, Raft consensus, write-ahead logging, and lock-free concurrency primitives.",
    durationMinutes: 18,
    questions: [
      { id: "cs4_1", prompt: "According to the CAP Theorem, in the inevitable presence of a Network Partition (P), a distributed system MUST choose between:", options: ["Consistency (CP) or Availability (AP)", "Performance or Security", "Throughput or Storage", "ACID or BASE"], answer: 0, explanation: "When a network partition occurs between nodes, the system must either refuse writes to guarantee consistency (CP) or accept writes risking inconsistency (AP)." },
      { id: "cs4_2", prompt: "What role does the Write-Ahead Log (WAL) serve in storage engines like PostgreSQL, MySQL InnoDB, and RocksDB?", options: ["Compresses JSON responses for clients", "Guarantees durability (ACID 'D') by persisting mutations sequentially to disk before flushing dirty pages from buffer memory", "Generates API documentation", "Acts as an in-memory cache"], answer: 1, explanation: "WAL appends modifications to disk sequentially before in-memory buffer pool pages are written, enabling crash recovery via replay." },
      { id: "cs4_3", prompt: "What is the ABA Problem in lock-free concurrency algorithms using Compare-And-Swap (CAS)?", options: ["A thread reads value A, is suspended, value changes to B and back to A, and CAS erroneously succeeds assuming nothing changed", "Two threads deadlocking on alternating mutexes", "A buffer overflow in string concatenation", "TCP sequence number desynchronization"], answer: 0, explanation: "CAS checks if value == A, which passes even if memory was freed and reallocated in between. Tagged pointers / version counters solve this." },
      { id: "cs4_4", prompt: "How does the Raft consensus algorithm guarantee safety and prevent split-brain leader elections?", options: ["By requiring a candidate to obtain votes from a strict majority (N/2 + 1) of cluster nodes before becoming leader", "By electing the node with the lowest IP address", "By running clock synchronization using GPS", "By routing all traffic to a single physical master switch"], answer: 0, explanation: "Any two majorities must overlap by at least one node. Because nodes vote only once per term, at most one candidate can achieve a strict majority." },
      { id: "cs4_5", prompt: "What is the difference between Write-Through and Write-Back caching strategies?", options: ["Write-Through writes synchronously to cache and database; Write-Back updates cache immediately and writes to DB asynchronously", "Write-Through bypasses cache completely", "Write-Back never saves to disk", "Write-Through is only for NoSQL"], answer: 0, explanation: "Write-Through ensures strong consistency at the cost of write latency; Write-Back yields ultra-fast writes but risks data loss on cache node crash before flush." },
    ],
  },

  // ==========================================
  // TOPIC 5: CAREER, BEHAVIORAL & HR INTERVIEW SKILLS
  // ==========================================
  {
    id: "hr-foundation",
    title: "HR Skills Level 1: Elevator Pitch & STAR Framework",
    topic: "Career & HR Skills",
    category: "Career & HR",
    level: "Foundation",
    levelBadge: "Level 1: Foundation",
    description: "Structuring 60-second introductions, defining Situation-Task-Action-Result components, and recruiter impact.",
    durationMinutes: 8,
    questions: [
      { id: "hr1_1", prompt: "What is the recommended duration and structure for answering 'Tell me about yourself' in an engineering interview?", options: ["5 to 10 minutes covering childhood and schooling", "60 to 90 seconds structured as: Present (current skills/projects) -> Past (key technical achievements) -> Future (role alignment)", "Reading every line on your resume word-for-word", "Asking the interviewer to read your LinkedIn profile"], answer: 1, explanation: "A crisp 60-90 second introduction keeps the interviewer engaged and highlights your value proposition without rambling." },
      { id: "hr1_2", prompt: "In the STAR behavioral interviewing framework, which letter represents the specific engineering steps YOU took to solve the problem?", options: ["S (Situation)", "T (Task)", "A (Action)", "R (Result)"], answer: 2, explanation: "'Action' should occupy ~50% of your response time, detailing your personal technical contributions, trade-offs, and execution." },
      { id: "hr1_3", prompt: "When describing a project result in an HR/Behavioral round, what elevates an answer from average to outstanding?", options: ["Including quantifiable business or performance metrics (e.g. 'reduced latency by 35%', 'saved 10 hours/week')", "Using buzzwords without context", "Taking credit for the entire team's work", "Speaking as fast as possible"], answer: 0, explanation: "Concrete quantitative metrics provide objective proof of engineering impact and credibility." },
      { id: "hr1_4", prompt: "What should you do when an interviewer asks: 'Do you have any questions for us?' at the end of the round?", options: ["Say 'No, you covered everything' and end the call immediately", "Ask about compensation and vacation days in Round 1", "Ask thoughtful questions about engineering culture, architecture challenges, and 90-day team expectations", "Ask the interviewer their personal salary"], answer: 2, explanation: "Asking insightful technical and culture questions demonstrates proactive engagement, genuine interest, and professional maturity." },
      { id: "hr1_5", prompt: "What is the best way to answer: 'What is your greatest weakness?'", options: ["Say 'I work too hard and care too much'", "State a genuine non-fatal developmental area and detail the concrete steps/guardrails you built to improve it", "Say 'I have no weaknesses'", "Criticize past professors or managers"], answer: 1, explanation: "Authentic self-awareness paired with tangible mitigation strategies demonstrates a growth mindset and Coachability." },
    ],
  },
  {
    id: "hr-intermediate",
    title: "HR Skills Level 2: Workplace Disagreements & Team Deadlines",
    topic: "Career & HR Skills",
    category: "Career & HR",
    level: "Intermediate",
    levelBadge: "Level 2: Intermediate",
    description: "Data-driven advocacy, handling sudden scope changes, active listening, and team commitment.",
    durationMinutes: 10,
    questions: [
      { id: "hr2_1", prompt: "When you have a strong technical disagreement with a teammate regarding system architecture, what is the best engineering practice?", options: ["Argue aggressively until they surrender", "Use objective benchmark data, write a brief trade-off document (RFC), and discuss collaboratively with the team", "Complain to the hiring manager behind their back", "Silently ignore their pull requests"], answer: 1, explanation: "Data-driven RFCs decouple decisions from egos and focus discussion on measurable trade-offs like latency, scalability, and maintainability." },
      { id: "hr2_2", prompt: "Requirements change 2 days before a major release milestone. What is the most effective triage action?", options: ["Panic and work 48 hours without sleep", "Categorize deliverables into P0 (must-have) vs P1/P2 (deferrable), communicate options transparently with stakeholders, and adjust scope", "Refuse to make any changes", "Deploy broken code to meet the original deadline"], answer: 1, explanation: "Mature engineering requires proactive scope triage (P0 vs deferral) and clear stakeholder communication rather than shipping broken code." },
      { id: "hr2_3", prompt: "What does the leadership principle 'Disagree and Commit' mean in practice?", options: ["Continue resisting a decision even after the team has finalized it", "Voice your perspective with evidence during debate, but once a decision is made, execute it with 100% commitment", "Agree with everything without thinking", "Sabotage projects you disagreed with"], answer: 1, explanation: "'Disagree and Commit' enables rapid decision-making while ensuring unified team execution after thorough debate." },
      { id: "hr2_4", prompt: "When paired with a difficult or non-communicative team partner on a group project, what is the best initial step?", options: ["Escalate immediately to the department head", "Initiate a 1-on-1 check-in to align on goals, clarify responsibilities, and establish comfortable communication channels", "Complete their work without telling them", "Remove their name from the submission"], answer: 1, explanation: "Empathetic 1-on-1 alignment clarifies unspoken obstacles and establishes clear accountability before requiring formal escalation." },
      { id: "hr2_5", prompt: "How should you structure your explanation of a time you received constructive criticism from a mentor?", options: ["Defend why your original way was superior", "Acknowledge the feedback with gratitude, explain what adjustments you implemented, and share the resulting improvement", "Blame the tooling", "Deny receiving criticism"], answer: 1, explanation: "Demonstrating how you absorbed feedback and converted it into personal performance growth is a primary indicator of placement readiness." },
    ],
  },
  {
    id: "hr-advanced",
    title: "HR Skills Level 3: Incident Ownership & Post-Mortem Leadership",
    topic: "Career & HR Skills",
    category: "Career & HR",
    level: "Advanced",
    levelBadge: "Level 3: Advanced",
    description: "Blameless post-mortems, root cause analysis (5 Whys), and engineering integrity under pressure.",
    durationMinutes: 12,
    questions: [
      { id: "hr3_1", prompt: "You deployed a bug that caused downtime in production. What is the correct sequence of actions?", options: ["Rollback/mitigate immediate user impact -> Notify stakeholders -> Conduct a blameless root cause analysis (RCA) -> Implement automated guardrails", "Hide the commit and delete log files", "Blame the code reviewer", "Wait until users submit support tickets"], answer: 0, explanation: "Production emergencies require rapid mitigation first, transparent communication, followed by blameless systemic remediation." },
      { id: "hr3_2", prompt: "What is the core purpose of a 'Blameless Post-Mortem' in high-performing tech organizations?", options: ["To find who is responsible and penalize their performance review", "To assume human error is a symptom of flawed systems/processes, and design technical guardrails to make that class of failure impossible", "To write a legal defense document", "To avoid discussing mistakes"], answer: 1, explanation: "Blameless culture focuses on eliminating structural vulnerabilities (e.g. adding automated canary deployments, linters) rather than assigning personal blame." },
      { id: "hr3_3", prompt: "How should you answer: 'Describe a project that failed or missed its deadline'?", options: ["Frame it as someone else's fault", "Own the planning or technical estimate failure, articulate the root causes discovered, and demonstrate how you refined future project estimations", "Claim you never missed a deadline", "Explain that deadlines don't matter in software"], answer: 1, explanation: "Senior interviewers evaluate how candidly you diagnose mistakes and adapt estimation or architecture frameworks for subsequent projects." },
      { id: "hr3_4", prompt: "When asked to explain why you selected PostgreSQL over MongoDB for a project, what demonstrates top-tier technical communication?", options: ["Stating 'Postgres is better than Mongo'", "Articulating the specific constraints (e.g., strict ACID transactional requirements, relational joins) and explaining the trade-offs evaluated", "Saying it was the only database you knew", "Claiming NoSQL is obsolete"], answer: 1, explanation: "Explaining rejected alternatives and the criteria used for selection showcases disciplined engineering decision-making." },
      { id: "hr3_5", prompt: "How do you convey engineering integrity when asked a technical question you genuinely do not know the answer to?", options: ["Confidently invent a fake answer", "Acknowledge that you haven't encountered that specific tool, state your related foundational knowledge, and walk through how you would reason through it", "Remain completely silent", "Change the subject abruptly"], answer: 1, explanation: "Honesty combined with structured first-principles reasoning shows intellectual integrity and problem-solving capability." },
    ],
  },
  {
    id: "hr-expert",
    title: "HR Skills Level 4: Senior Leadership & Executive Alignment",
    topic: "Career & HR Skills",
    category: "Career & HR",
    level: "Expert",
    levelBadge: "Level 4: Expert",
    description: "Mentoring junior engineers, technical debt balance, cross-functional collaboration, and cultural leadership.",
    durationMinutes: 15,
    questions: [
      { id: "hr4_1", prompt: "How do you balance paying down Technical Debt versus delivering new Product Features under tight business pressure?", options: ["Ignore tech debt completely until the system crashes", "Dedicate 100% of engineering time to refactoring", "Quantify the cost of tech debt in terms of developer velocity/reliability risk, and allocate a consistent percentage (e.g., 20%) of each sprint", "Refactor in secret without telling product managers"], answer: 2, explanation: "Framing technical debt in terms of business velocity and reliability allows engineering and product management to agree on a predictable allocation." },
      { id: "hr4_2", prompt: "What is the most effective approach to mentoring an intern or junior engineer struggling with a complex task?", options: ["Write the code for them to save time", "Tell them to figure it out independently", "Break the problem down collaboratively, use the Socratic method with guiding questions, and review their progress iteratively", "Reassign the task to a senior engineer immediately"], answer: 2, explanation: "Guiding juniors through structured mental models builds long-term capability while ensuring project momentum." },
      { id: "hr4_3", prompt: "When working with non-technical cross-functional partners (Product, Sales, Legal), how should an engineering lead communicate technical blockers?", options: ["Use dense acronyms and compiler error traces", "Translate technical bottlenecks into user-facing impacts, business risks, and actionable alternative paths with clear timelines", "Refuse to communicate with non-engineers", "Send the git diff"], answer: 1, explanation: "Translating engineering trade-offs into business impact fosters cross-functional trust and enables informed organizational decisions." },
      { id: "hr4_4", prompt: "In top tech companies, what distinguishes a Staff/Principal engineer candidate from a Mid-Level engineer in behavioral interviews?", options: ["Typing speed", "System-wide impact, technical leadership through influence rather than authority, and raising the engineering standards of the entire team", "Number of programming languages known", "Working longer hours"], answer: 1, explanation: "Senior leadership is defined by organizational leverage: mentoring others, driving architectural vision, and influencing cross-team engineering standards." },
      { id: "hr4_5", prompt: "What is your philosophy on code reviews within a high-velocity engineering team?", options: ["Nitpick minor stylistic preferences that linters can handle", "Block pull requests for days without explanation", "Focus on correctness, edge cases, security, maintainability, and treat PR reviews as an empathetic teaching and learning opportunity", "Approve everything without reading"], answer: 2, explanation: "Automate style formatting with linters and dedicate human review time to architectural correctness, edge cases, security, and knowledge sharing." },
    ],
  },
];
