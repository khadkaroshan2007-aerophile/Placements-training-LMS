import type { QuizQuestion } from "./learning-data";

export type MockTest = {
  id: string;
  title: string;
  topic: string;
  category: string;
  description: string;
  durationMinutes: number; // 25 minutes
  totalQuestions: number; // 20 questions
  questions: QuizQuestion[];
};

export type MockTestResult = {
  id: string;
  mockId: string;
  title: string;
  topic: string;
  score: number; // Number of correct answers
  total: number; // 20
  percentage: number;
  timeSpentSeconds: number;
  date: string;
  answers: number[];
};

export const mockTests: MockTest[] = [
  // ========================================================
  // 1. DATA STRUCTURES & ALGORITHMS (20 QUESTIONS · 25 MINS)
  // ========================================================
  {
    id: "dsa-mock-test",
    title: "Data Structures & Algorithms Mock Test",
    topic: "Data Structures & Algorithms",
    category: "Technical",
    description: "Timed 20-question placement simulation covering Arrays, Two Pointers, Trees, Graphs, Binary Search, and Dynamic Programming.",
    durationMinutes: 25,
    totalQuestions: 20,
    questions: [
      { id: "dm_1", prompt: "What is the time complexity to retrieve an element by index in a contiguous dynamic array?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 0, explanation: "Arrays allow immediate O(1) random memory access via pointer arithmetic baseAddress + index * size." },
      { id: "dm_2", prompt: "Which technique finds if a sorted array contains two numbers summing to target X in O(1) auxiliary space?", options: ["Two pointers from opposite ends converging inward", "Hash set insertion", "Depth-first search", "Sliding window of dynamic width"], answer: 0, explanation: "Two pointers inward scan checks sums in O(n) time and O(1) auxiliary space without extra allocations." },
      { id: "dm_3", prompt: "What is the worst-case time complexity of inserting into a standard Singly Linked List with head pointer only?", options: ["O(1) at head, O(n) at tail", "O(n) at head, O(1) at tail", "O(1) at both head and tail", "O(log n)"], answer: 0, explanation: "Inserting at the head is O(1) by updating the head pointer. Without a tail pointer, inserting at the end requires traversing all n nodes in O(n)." },
      { id: "dm_4", prompt: "Which data structure follows the Last-In, First-Out (LIFO) operational order?", options: ["Queue", "Stack", "Priority Queue", "Deque"], answer: 1, explanation: "A Stack operates on LIFO order; elements pushed last are popped first." },
      { id: "dm_5", prompt: "What is the average time complexity of searching, inserting, and deleting in a Hash Map?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0, explanation: "With a uniform hash function and low load factor, hash table operations execute in average constant O(1) time." },
      { id: "dm_6", prompt: "In Binary Search on an array of size 1,048,576 (2²⁰), at most how many comparisons are required?", options: ["20", "100", "1024", "2048"], answer: 0, explanation: "Binary search cuts search space in half each step: log₂(2²⁰) = 20 comparisons maximum." },
      { id: "dm_7", prompt: "Which traversal of a Binary Search Tree (BST) yields nodes in strictly sorted ascending order?", options: ["Pre-order (Root, Left, Right)", "In-order (Left, Root, Right)", "Post-order (Left, Right, Root)", "Level-order (BFS)"], answer: 1, explanation: "In-order traversal visits left subtree, root, then right subtree, naturally printing keys in non-decreasing order." },
      { id: "dm_8", prompt: "What is the height of a balanced Binary Search Tree containing N nodes?", options: ["O(log N)", "O(N)", "O(N log N)", "O(1)"], answer: 0, explanation: "Balanced binary trees (AVL, Red-Black) maintain height bounded strictly by O(log N)." },
      { id: "dm_9", prompt: "Which sorting algorithm is guaranteed to run in O(n log n) time in worst-case and is stable?", options: ["QuickSort", "MergeSort", "HeapSort", "SelectionSort"], answer: 1, explanation: "MergeSort always executes in O(n log n) across best, average, and worst cases, and preserves relative ordering of equal keys (stable)." },
      { id: "dm_10", prompt: "What is the time complexity of Breadth-First Search (BFS) on an adjacency list graph with V vertices and E edges?", options: ["O(V + E)", "O(V × E)", "O(V log E)", "O(E²)"], answer: 0, explanation: "BFS visits every vertex once and explores each incident edge once, giving O(V + E) runtime." },
      { id: "dm_11", prompt: "Which algorithm finds the single-source shortest path in a weighted graph with non-negative edge weights?", options: ["Dijkstra's Algorithm", "Kruskal's Algorithm", "Prim's Algorithm", "Kosaraju's Algorithm"], answer: 0, explanation: "Dijkstra's algorithm uses a min-priority queue to find shortest paths in O((V + E) log V) time." },
      { id: "dm_12", prompt: "What data structure is used to implement a non-recursive Depth-First Search (DFS)?", options: ["Queue", "Stack", "Priority Queue", "Circular Buffer"], answer: 1, explanation: "DFS simulates call-stack execution using an explicit Stack." },
      { id: "dm_13", prompt: "In a Binary Min-Heap, where is the minimum element located?", options: ["At the root node (index 0)", "At the last leaf node", "In the left-most leaf", "At the median index"], answer: 0, explanation: "By the min-heap property, the parent is always less than or equal to its children, placing the global minimum at the root." },
      { id: "dm_14", prompt: "What is the space complexity of Floyd's Tortoise and Hare cycle detection algorithm on a linked list?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0, explanation: "Floyd's algorithm uses only two pointer references (slow and fast), requiring strictly O(1) auxiliary memory." },
      { id: "dm_15", prompt: "Which technique is optimal for solving the 'Longest Substring Without Repeating Characters' problem?", options: ["Dynamic sliding window with a character hash set / map", "Sorting characters alphabetically", "Breadth-first search", "Binary search on length"], answer: 0, explanation: "A sliding window expands right and contracts left when duplicates occur, solving the problem in linear O(N) time." },
      { id: "dm_16", prompt: "What are the two core prerequisites for a problem to be solved using Dynamic Programming?", options: ["Optimal Substructure and Overlapping Subproblems", "Greedy Choice and Monotonic Ordering", "Divide & Conquer with Independent subproblems", "Linearity and Associativity"], answer: 0, explanation: "Dynamic Programming requires subproblems to recur multiple times (overlapping) and optimal subproblem solutions to compose the global optimum (optimal substructure)." },
      { id: "dm_17", prompt: "Which data structure solves the 'Next Greater Element' problem in linear O(N) time?", options: ["Monotonic Stack", "Segment Tree", "Trie", "Disjoint Set Union"], answer: 0, explanation: "A Monotonic Stack maintains elements in monotonic order, ensuring every index is pushed and popped at most once." },
      { id: "dm_18", prompt: "What is the time complexity of searching for a word of length L in a Trie containing N total words?", options: ["O(L)", "O(N)", "O(N × L)", "O(log N)"], answer: 0, explanation: "Trie lookup traverses L edge pointers corresponding to the characters of the query word, taking O(L) time regardless of N." },
      { id: "dm_19", prompt: "What is the topological sort of a graph only possible on?", options: ["Directed Acyclic Graphs (DAGs)", "Undirected Graphs with cycles", "Complete Bipartite Graphs", "Disconnected Trees only"], answer: 0, explanation: "Topological ordering requires directed dependencies without cycles (DAG); a cycle creates a circular dependency contradiction." },
      { id: "dm_20", prompt: "What is the amortized time complexity of inserting into a Dynamic Array that doubles capacity when full?", options: ["O(1) amortized", "O(log n) amortized", "O(n) amortized", "O(n²) amortized"], answer: 0, explanation: "Capacity doubling spreads the O(N) copy cost over N insertions, yielding O(1) amortized cost per append." },
    ],
  },

  // ========================================================
  // 2. QUANTITATIVE APTITUDE (20 QUESTIONS · 25 MINS)
  // ========================================================
  {
    id: "aptitude-mock-test",
    title: "Quantitative Aptitude Mock Test",
    topic: "Quantitative Aptitude",
    category: "Aptitude",
    description: "Timed 20-question recruiter aptitude exam covering Percentages, Work-Rate LCM, Speed & Distance, Alligations, and Number Theory.",
    durationMinutes: 25,
    totalQuestions: 20,
    questions: [
      { id: "qm_1", prompt: "If a value is increased by 20% and then decreased by 20%, what is the net percentage change?", options: ["4% decrease", "0% (No change)", "2% decrease", "4% increase"], answer: 0, explanation: "Multiplier = 1.20 × 0.80 = 0.96. Net change = 0.96 - 1 = -0.04 = 4% decrease." },
      { id: "qm_2", prompt: "An item bought for ₹600 is sold at ₹750. What is the profit percentage on cost price?", options: ["20%", "25%", "30%", "15%"], answer: 1, explanation: "Profit = ₹750 - ₹600 = ₹150. Profit % = (150 / 600) × 100 = 25%." },
      { id: "qm_3", prompt: "If A:B = 3:4 and B:C = 8:9, what is the ratio A:C?", options: ["2:3", "3:4", "1:2", "5:6"], answer: 0, explanation: "A/C = (A/B) × (B/C) = (3/4) × (8/9) = 24/36 = 2/3." },
      { id: "qm_4", prompt: "What is the decimal multiplier for an item sold at a 15% discount?", options: ["0.85", "1.15", "0.15", "0.75"], answer: 0, explanation: "A 15% discount leaves 85% of marked price, corresponding to a multiplier of 1 - 0.15 = 0.85." },
      { id: "qm_5", prompt: "A can complete a task in 12 days and B in 24 days. Working together, how many days will they take?", options: ["6 days", "8 days", "10 days", "16 days"], answer: 1, explanation: "Total work = LCM(12, 24) = 24 units. A does 2 units/day, B does 1 unit/day. Combined = 3 units/day. Days = 24 / 3 = 8 days." },
      { id: "qm_6", prompt: "Pipe X fills a tank in 10 hours and Pipe Y empties it in 15 hours. If both run together, in how many hours is the tank filled?", options: ["25 hours", "30 hours", "35 hours", "20 hours"], answer: 1, explanation: "Total capacity = LCM(10, 15) = 30 units. X adds +3 units/hr, Y drains -2 units/hr. Net rate = +1 unit/hr. Time = 30 / 1 = 30 hours." },
      { id: "qm_7", prompt: "A train 200m long traveling at 72 km/h crosses a platform 300m long. How many seconds does it take?", options: ["20 seconds", "25 seconds", "30 seconds", "15 seconds"], answer: 1, explanation: "Speed in m/s = 72 × (5/18) = 20 m/s. Total distance = 200 + 300 = 500m. Time = 500 / 20 = 25 seconds." },
      { id: "qm_8", prompt: "Two cars travel towards each other at 45 km/h and 55 km/h from points 200 km apart. In how many hours will they meet?", options: ["2 hours", "2.5 hours", "3 hours", "1.5 hours"], answer: 0, explanation: "Relative speed in opposite directions = 45 + 55 = 100 km/h. Time = Distance / Speed = 200 / 100 = 2 hours." },
      { id: "qm_9", prompt: "What is the average speed of a car that travels to a city at 40 km/h and returns at 60 km/h?", options: ["48 km/h", "50 km/h", "52 km/h", "45 km/h"], answer: 0, explanation: "Harmonic average for equal distance = (2 × S₁ × S₂) / (S₁ + S₂) = (2 × 40 × 60) / 100 = 4800 / 100 = 48 km/h." },
      { id: "qm_10", prompt: "In what ratio must coffee at ₹120/kg be mixed with coffee at ₹180/kg to produce a blend worth ₹140/kg?", options: ["2:1", "1:2", "3:2", "4:3"], answer: 0, explanation: "Rule of Alligation: (180 - 140) / (140 - 120) = 40 / 20 = 2:1." },
      { id: "qm_11", prompt: "From a tank of 50 liters of pure milk, 5 liters are drawn and replaced with water twice. How much pure milk remains?", options: ["40.5 liters", "41.5 liters", "42.0 liters", "45.0 liters"], answer: 0, explanation: "Remaining = 50 × (1 - 5/50)² = 50 × (0.9)² = 50 × 0.81 = 40.5 liters." },
      { id: "qm_12", prompt: "How many distinct ways can 5 people be seated in a row of 5 chairs?", options: ["120", "24", "60", "720"], answer: 0, explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120." },
      { id: "qm_13", prompt: "A card is drawn from a standard deck of 52 cards. What is the probability of drawing a Queen or a Heart?", options: ["4/13", "17/52", "1/4", "16/52"], answer: 0, explanation: "P(Queen or Heart) = P(Q) + P(H) - P(Q of H) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13." },
      { id: "qm_14", prompt: "What is the unit digit of 3¹⁰⁵?", options: ["3", "9", "7", "1"], answer: 0, explanation: "The cyclicity of powers of 3 is 4 (3, 9, 7, 1). 105 mod 4 = 1. Therefore, unit digit is 3¹ = 3." },
      { id: "qm_15", prompt: "What is the remainder when 2⁵⁰ is divided by 7?", options: ["4", "2", "1", "6"], answer: 0, explanation: "2³ = 8 ≡ 1 (mod 7). 50 = 3 × 16 + 2. So 2⁵⁰ = (2³)¹⁶ × 2² ≡ 1¹⁶ × 4 ≡ 4 (mod 7)." },
      { id: "qm_16", prompt: "How many prime numbers exist between 1 and 30?", options: ["10", "9", "11", "8"], answer: 0, explanation: "Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 = exactly 10 prime numbers." },
      { id: "qm_17", prompt: "The simple interest on a principal of ₹8000 at 5% per annum for 3 years is:", options: ["₹1200", "₹1000", "₹1400", "₹1600"], answer: 0, explanation: "SI = (P × R × T) / 100 = (8000 × 5 × 3) / 100 = ₹1200." },
      { id: "qm_18", prompt: "What is the compound interest on ₹10,000 for 2 years at 10% per annum compounded annually?", options: ["₹2100", "₹2000", "₹2200", "₹2400"], answer: 0, explanation: "Amount = 10000 × (1.10)² = 10000 × 1.21 = ₹12,100. CI = ₹12,100 - ₹10,000 = ₹2,100." },
      { id: "qm_19", prompt: "How many trailing zeros are in 50!?", options: ["12", "10", "14", "15"], answer: 0, explanation: "floor(50/5) + floor(50/25) = 10 + 2 = 12 trailing zeros." },
      { id: "qm_20", prompt: "If a number is divisible by both 8 and 9, it must necessarily be divisible by:", options: ["72", "36", "18", "24"], answer: 0, explanation: "Since 8 and 9 are coprime (GCD = 1), any multiple must be divisible by LCM(8, 9) = 72." },
    ],
  },

  // ========================================================
  // 3. LOGICAL REASONING & DI (20 QUESTIONS · 25 MINS)
  // ========================================================
  {
    id: "logical-mock-test",
    title: "Logical Reasoning & DI Mock Test",
    topic: "Logical Reasoning",
    category: "Logical Reasoning",
    description: "Timed 20-question placement reasoning test covering Syllogisms, Seating Arrangements, Coding, Direction, and Data Sufficiency.",
    durationMinutes: 25,
    totalQuestions: 20,
    questions: [
      { id: "lm_1", prompt: "What is the next number in the sequence: 5, 11, 23, 47, 95, …?", options: ["191", "189", "190", "195"], answer: 0, explanation: "Pattern: (x × 2) + 1. (95 × 2) + 1 = 190 + 1 = 191." },
      { id: "lm_2", prompt: "If 'CLOUD' is coded as 'DMPVE', how is 'RAIN' coded?", options: ["SBJO", "SZJM", "TBKP", "RCJO"], answer: 0, explanation: "Each letter is shifted forward by +1: R->S, A->B, I->J, N->O = 'SBJO'." },
      { id: "lm_3", prompt: "A walks 8km South, turns West and walks 6km. How far is A from the start point?", options: ["10 km", "12 km", "14 km", "8 km"], answer: 0, explanation: "By Pythagorean theorem: √(8² + 6²) = √(64 + 36) = √100 = 10 km." },
      { id: "lm_4", prompt: "Introducing a man, a woman says: 'His wife is the only daughter of my father.' How is the man related to the woman?", options: ["Husband", "Brother", "Father", "Uncle"], answer: 0, explanation: "'Only daughter of my father' is the woman herself. The man's wife is the woman, so he is her Husband." },
      { id: "lm_5", prompt: "In a class of 40 students, Priya ranks 9th from the top. What is her rank from the bottom?", options: ["32nd", "31st", "33rd", "30th"], answer: 0, explanation: "Rank from bottom = Total - Rank from top + 1 = 40 - 9 + 1 = 32nd." },
      { id: "lm_6", prompt: "Statements:\n1. All cats are animals.\n2. All animals are creatures.\nConclusion: All cats are creatures.", options: ["Definitely True", "Definitely False", "Cannot be determined", "Partially True"], answer: 0, explanation: "Transitive property of universal sets: Cats ⊂ Animals ⊂ Creatures, so all cats are creatures." },
      { id: "lm_7", prompt: "Four friends A, B, C, D sit at a square table. A sits opposite C. B sits to the right of A. Who sits to the right of B?", options: ["C", "D", "A", "None"], answer: 0, explanation: "Sitting around table: A is facing North, B is East, C is North-opposite (South), D is West. To the right of East (facing center) is South (C)." },
      { id: "lm_8", prompt: "Which word does NOT belong with the others: Python, Java, C++, HTML?", options: ["HTML", "Python", "Java", "C++"], answer: 0, explanation: "HTML is a markup language; Python, Java, and C++ are Turing-complete programming languages." },
      { id: "lm_9", prompt: "If Sunday was yesterday, what day will it be 3 days after tomorrow?", options: ["Friday", "Thursday", "Saturday", "Wednesday"], answer: 0, explanation: "Yesterday was Sunday -> Today is Monday. Tomorrow is Tuesday. 3 days after Tuesday is Friday." },
      { id: "lm_10", prompt: "Find the odd number out: 27, 64, 125, 144, 216.", options: ["144", "27", "64", "125"], answer: 0, explanation: "27=3³, 64=4³, 125=5³, 216=6³ are perfect cubes; 144 is 12² (a square, not a cube of an integer)." },
      { id: "lm_11", prompt: "Statements:\n1. Some birds are fish.\n2. Some fish are whales.\nConclusion: Some birds are whales.", options: ["Does not logically follow", "Definitely follows", "Definitely false", "Always true"], answer: 0, explanation: "Two existential 'some' statements do not guarantee transitivity between birds and whales." },
      { id: "lm_12", prompt: "If A > B, B ≥ C, and C = D, which statement MUST be true?", options: ["A > D", "A = D", "B < D", "A < C"], answer: 0, explanation: "A > B ≥ C = D implies A is strictly greater than D." },
      { id: "lm_13", prompt: "A clock shows 3:15. What is the angle between the hour hand and minute hand?", options: ["7.5°", "0°", "15°", "5°"], answer: 0, explanation: "At 3:15, the minute hand is at 90°. The hour hand moved 15 × 0.5° = 7.5° past 90°. Angle = 7.5°." },
      { id: "lm_14", prompt: "In a code language, 123 means 'hot filtered coffee', 356 means 'very hot day', 589 means 'day and night'. Which digit stands for 'very'?", options: ["6", "3", "5", "8"], answer: 0, explanation: "'hot' is in 1st & 2nd -> digit 3. 'day' is in 2nd & 3rd -> digit 5. In 'very hot day' (356), remaining word 'very' = 6." },
      { id: "lm_15", prompt: "A dice has faces labeled 1 to 6. If 1 is adjacent to 2, 3, 4, and 5, what face is opposite to 1?", options: ["6", "2", "3", "4"], answer: 0, explanation: "Since 1 touches four faces (2, 3, 4, 5), the remaining sixth face (6) must be opposite." },
      { id: "lm_16", prompt: "If 'NORTH' is called 'SOUTH', 'SOUTH' is called 'EAST', 'EAST' is called 'WEST', in which direction does the Sun rise?", options: ["WEST", "EAST", "NORTH", "SOUTH"], answer: 0, explanation: "The sun rises in the East, which is called 'WEST' in this code." },
      { id: "lm_17", prompt: "Is integer N odd?\nStatement 1: N + 1 is even.\nStatement 2: N² is odd.\nWhich statement(s) are sufficient?", options: ["EACH statement ALONE is sufficient", "Statement 1 alone is sufficient", "Statement 2 alone is sufficient", "Neither is sufficient"], answer: 0, explanation: "N + 1 even implies N is odd. N² odd implies N is odd. Both statements independently answer the question." },
      { id: "lm_18", prompt: "A liar always lies, a truth-teller always tells the truth. One says: 'I am a liar.' What is this person?", options: ["A logical paradox (cannot exist)", "A liar", "A truth-teller", "A normal person"], answer: 0, explanation: "If truth-teller, they lie. If liar, their statement is true. This is the Epimenides liar paradox." },
      { id: "lm_19", prompt: "How many total squares are there in an 8x8 chessboard?", options: ["204", "64", "128", "256"], answer: 0, explanation: "Sum of squares from 1² to 8² = (8 × 9 × 17) / 6 = 204 squares." },
      { id: "lm_20", prompt: "If a pie chart has 5 sectors, and Sector A represents 25%, what is its central angle?", options: ["90°", "72°", "100°", "45°"], answer: 0, explanation: "Central angle = 25% of 360° = 0.25 × 360° = 90°." },
    ],
  },

  // ========================================================
  // 4. CORE COMPUTER SCIENCE (20 QUESTIONS · 25 MINS)
  // ========================================================
  {
    id: "corecs-mock-test",
    title: "Core Computer Science Mock Test",
    topic: "Core Computer Science",
    category: "Core CS",
    description: "Timed 20-question technical exam testing Operating Systems, Database Management Systems (DBMS), and Computer Networks.",
    durationMinutes: 25,
    totalQuestions: 20,
    questions: [
      { id: "csm_1", prompt: "What is the primary architectural difference between a Process and a Thread?", options: ["Processes have private virtual address spaces; threads share memory within the same process", "Threads cannot run on multiple CPU cores", "Processes share a single stack", "Threads require separate disk partitions"], answer: 0, explanation: "Processes possess isolated virtual address spaces. Threads in a process share code, data, and heap but retain private stacks." },
      { id: "csm_2", prompt: "Which SQL clause filters grouped rows AFTER aggregation by GROUP BY?", options: ["HAVING", "WHERE", "ORDER BY", "DISTINCT"], answer: 0, explanation: "`WHERE` filters input rows prior to grouping; `HAVING` filters aggregated buckets." },
      { id: "csm_3", prompt: "What layer of the OSI model handles TCP and UDP segment transport?", options: ["Transport Layer (Layer 4)", "Network Layer (Layer 3)", "Application Layer (Layer 7)", "Data Link Layer (Layer 2)"], answer: 0, explanation: "Layer 4 (Transport) manages port multiplexing, segmentation, flow control, and reliability." },
      { id: "csm_4", prompt: "What are the four Coffman conditions necessary for a Deadlock to occur?", options: ["Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait", "Race Condition, Critical Section, Mutex, Semaphore", "Paging, Fragmentation, Segmentation, Thrashing", "Cache Miss, Context Switch, TLB Invalidation, Interrupt"], answer: 0, explanation: "Deadlock requires all four conditions to hold simultaneously." },
      { id: "csm_5", prompt: "Why do relational databases index data with B+ Trees rather than Hash Indexes?", options: ["B+ Trees support fast range scans (e.g. BETWEEN, >, <) through linked leaves", "Hash indexes cannot store integers", "B+ Trees consume zero memory", "Hash indexes have O(n log n) lookup"], answer: 0, explanation: "B+ Tree leaf nodes form a sorted doubly linked list, enabling sequential range traversal that hash tables cannot perform." },
      { id: "csm_6", prompt: "What packets are exchanged in a standard TCP Three-Way Handshake?", options: ["SYN -> SYN-ACK -> ACK", "ACK -> SYN -> ACK-SYN", "FIN -> ACK -> FIN-ACK", "REQ -> RES -> OK"], answer: 0, explanation: "Client initiates SYN, Server responds with SYN-ACK, Client confirms with ACK." },
      { id: "csm_7", prompt: "What does the 'A' in ACID database transaction properties stand for?", options: ["Atomicity (All-or-Nothing)", "Availability", "Authentication", "Asynchronous"], answer: 0, explanation: "Atomicity ensures that all operations in a transaction succeed completely or none take effect." },
      { id: "csm_8", prompt: "What is Virtual Memory Thrashing in an Operating System?", options: ["The CPU spends more time swapping pages to/from disk than executing instructions", "A memory leak that crashes the kernel", "Overclocking physical RAM", "Concurrent writes to a single variable"], answer: 0, explanation: "Thrashing occurs when active process memory demands exceed physical RAM, causing continuous page faults." },
      { id: "csm_9", prompt: "Which HTTP status code signifies that a client is Unauthorized (unauthenticated)?", options: ["401 Unauthorized", "403 Forbidden", "404 Not Found", "500 Internal Error"], answer: 0, explanation: "401 indicates missing or invalid authentication credentials; 403 indicates authenticated but lacking permission." },
      { id: "csm_10", prompt: "What is the purpose of the Translation Lookaside Buffer (TLB)?", options: ["A fast hardware cache for virtual-to-physical page address translations", "A disk cache for swap space", "An encryption buffer for TLS", "A stack frame pointer"], answer: 0, explanation: "The TLB caches recent virtual-to-physical address mappings in the MMU to avoid slow page table lookups in RAM." },
      { id: "csm_11", prompt: "In a relational schema, what does Third Normal Form (3NF) eliminate?", options: ["Transitive Functional Dependencies", "Primary keys", "Foreign keys", "Composite attributes"], answer: 0, explanation: "3NF requires 2NF plus no transitive dependencies (no non-key column depending on another non-key column)." },
      { id: "csm_12", prompt: "What protocol maps an IP address to a physical MAC address on a local network?", options: ["ARP (Address Resolution Protocol)", "DNS", "DHCP", "ICMP"], answer: 0, explanation: "ARP resolves Layer 3 IP addresses into Layer 2 physical MAC addresses." },
      { id: "csm_13", prompt: "What state does a child process enter if it terminates before its parent invokes `wait()`?", options: ["Zombie process", "Orphan process", "Daemon process", "Interrupted process"], answer: 0, explanation: "A Zombie process has exited but its process table entry remains until the parent reads its exit code." },
      { id: "csm_14", prompt: "What does the CAP theorem state regarding distributed data systems?", options: ["Under network partitions, a system must choose between Consistency and Availability", "A system can achieve Consistency, Availability, and Partition tolerance all at once", "Performance is inversely proportional to cost", "Relational databases cannot scale"], answer: 0, explanation: "When network partitions (P) occur, a distributed system can either guarantee Consistency (CP) or Availability (AP)." },
      { id: "csm_15", prompt: "What is the primary role of a Database Write-Ahead Log (WAL)?", options: ["Ensures Durability by appending mutations to disk before flushing dirty pages", "Compresses JSON responses", "Provides autocomplete for queries", "Acts as an in-memory cache"], answer: 0, explanation: "WAL guarantees durability (ACID 'D') by persisting transactions sequentially to disk before buffer pool flushes." },
      { id: "csm_16", prompt: "Which DNS record type maps a domain name directly to an IPv4 address?", options: ["A Record", "AAAA Record", "CNAME Record", "MX Record"], answer: 0, explanation: "An 'A' record points a domain name to a 32-bit IPv4 address (AAAA is for IPv6)." },
      { id: "csm_17", prompt: "What mechanism allows multiple processes to communicate using shared file descriptors in Unix?", options: ["Pipes (IPC)", "Virtual Registers", "Page faults", "TLB misses"], answer: 0, explanation: "Unix pipes provide unidirectional IPC channels accessed via file descriptors." },
      { id: "csm_18", prompt: "What is a 'Dirty Read' in database concurrency?", options: ["Transaction T1 reads data modified by transaction T2 that has NOT yet committed", "Reading corrupted data from disk", "A query with missing syntax", "Reading deleted primary keys"], answer: 0, explanation: "A dirty read occurs when uncommitted modifications from an in-flight transaction are observed by another transaction." },
      { id: "csm_19", prompt: "Which Transport Layer protocol provides connectionless, low-latency, packet transmission without delivery guarantees?", options: ["UDP (User Datagram Protocol)", "TCP", "SCTP", "TLS"], answer: 0, explanation: "UDP sends datagrams without handshake, sequence verification, or retransmissions, minimizing latency." },
      { id: "csm_20", prompt: "What is an Inverted Index primarily used for?", options: ["Full-Text Search engines (e.g. Elasticsearch/Lucene)", "B-Tree primary keys", "Hash map buckets", "CPU register caching"], answer: 0, explanation: "An Inverted Index maps words/tokens to the documents that contain them, enabling fast full-text search." },
    ],
  },

  // ========================================================
  // 5. CAREER & HR SKILLS (20 QUESTIONS · 25 MINS)
  // ========================================================
  {
    id: "hr-mock-test",
    title: "Placement HR & Behavioral Mock Test",
    topic: "Career & HR Skills",
    category: "Career & HR",
    description: "Timed 20-question behavioral and corporate communication exam covering STAR storytelling, incident leadership, and recruiter assessments.",
    durationMinutes: 25,
    totalQuestions: 20,
    questions: [
      { id: "hrm_1", prompt: "What is the ideal duration and trajectory for answering 'Tell me about yourself'?", options: ["60-90 seconds: Present -> Past Achievements -> Future Role Alignment", "5 minutes of chronological schooling history", "Reading your resume aloud", "Asking the interviewer what they want to know"], answer: 0, explanation: "A 60-90 second introduction keeps attention focused on your core technical strengths and value proposition." },
      { id: "hrm_2", prompt: "In the STAR framework, which section should command approximately 50% of your talking time?", options: ["Action (What YOU specifically engineered and executed)", "Situation (Context)", "Task (Goal)", "Result (Metrics)"], answer: 0, explanation: "The Action section proves your personal competence, trade-offs evaluated, and engineering decision-making." },
      { id: "hrm_3", prompt: "What makes a project Result most convincing to technical interviewers?", options: ["Quantifiable metrics and business/performance impact", "Using complex jargon", "Claiming total individual credit for a group project", "Speaking without pauses"], answer: 0, explanation: "Concrete quantitative metrics (e.g., 'reduced API response time by 40%') provide verifiable evidence of impact." },
      { id: "hrm_4", prompt: "When asked 'What is your greatest weakness?', what is the most strategic approach?", options: ["Share a real developmental area with the proactive mitigation system you created", "Say you are a perfectionist who works too hard", "Claim you have no flaws", "Blame past teammates"], answer: 0, explanation: "Self-awareness coupled with active growth demonstrates coachability and emotional intelligence." },
      { id: "hrm_5", prompt: "What should you ask when the interviewer asks: 'Do you have any questions for us?'", options: ["Thoughtful questions on team architecture challenges and engineering culture", "Ask about salary and vacation days in Round 1", "Say 'No, everything is clear' and leave", "Ask the interviewer their personal age"], answer: 0, explanation: "Asking insightful engineering questions demonstrates curiosity, technical depth, and cultural alignment." },
      { id: "hrm_6", prompt: "When in a technical architectural disagreement with a peer, what is the best practice?", options: ["Write an RFC document outlining benchmarks and trade-offs for collaborative review", "Argue loudly until they agree", "Complain to leadership", "Secretly rewrite their code"], answer: 0, explanation: "Data-driven RFCs remove ego and anchor decisions on objective trade-offs like latency and maintainability." },
      { id: "hrm_7", prompt: "What does the principle 'Disagree and Commit' signify?", options: ["Vigorously debate before a decision, but support it with 100% effort once agreed upon", "Always refuse decisions you disliked", "Agree with everything without thinking", "Sabotage the project"], answer: 0, explanation: "It empowers candid debate while ensuring unified execution once the team aligns on direction." },
      { id: "hrm_8", prompt: "What is the first priority during a severe production outage caused by your code commit?", options: ["Mitigate/rollback user impact immediately and inform stakeholders", "Hide the commit", "Blame the QA team", "Wait until someone files a bug"], answer: 0, explanation: "Immediate user mitigation and transparent communication must always precede root-cause diagnosis." },
      { id: "hrm_9", prompt: "What is the primary philosophy of a 'Blameless Post-Mortem'?", options: ["Assume human error is a symptom of system vulnerability and build structural guardrails", "Penalize the engineer who made the mistake", "Conceal mistakes from clients", "Avoid discussing technical incidents"], answer: 0, explanation: "Focusing on systemic improvements (automated canary tests, linters) prevents repeat failures." },
      { id: "hrm_10", prompt: "How should you answer when asked why you chose technology X over Y for your final project?", options: ["Articulate the concrete requirements and trade-offs that made X optimal for your use case", "Say you only knew technology X", "Claim technology Y is terrible", "Say your professor forced you"], answer: 0, explanation: "Discussing rejected alternatives demonstrates principled engineering discernment." },
      { id: "hrm_11", prompt: "When an interviewer asks a question you do not know the answer to, what should you do?", options: ["Acknowledge you haven't worked with it, state related principles, and reason out loud", "Confidently guess a fake fact", "Remain completely silent", "Deflect to another topic"], answer: 0, explanation: "Honesty paired with structured first-principles thinking highlights intellectual integrity." },
      { id: "hrm_12", prompt: "How should an engineering lead balance Technical Debt against new Product Features?", options: ["Quantify reliability/velocity risks and allocate a predictable fraction (e.g. 20%) of each sprint", "Refuse to ever fix tech debt", "Stop all feature work for 6 months", "Refactor in secret"], answer: 0, explanation: "Framing technical debt in business terms enables healthy engineering and product collaboration." },
      { id: "hrm_13", prompt: "What is the best way to coach a junior engineer struggling with an ambiguous feature?", options: ["Use the Socratic method with guiding questions and break the problem down into milestones", "Write their code for them", "Tell them to figure it out alone", "Reassign the task"], answer: 0, explanation: "Collaborative milestone breakdown develops capability while maintaining progress." },
      { id: "hrm_14", prompt: "When communicating technical blockers to non-technical stakeholders (Product/Legal), what should you do?", options: ["Translate technical roadblocks into user impact, business risks, and actionable alternative timelines", "Send raw stack traces", "Use obscure acronyms", "Refuse to talk"], answer: 0, explanation: "Translating engineering trade-offs into business impact builds cross-functional alignment." },
      { id: "hrm_15", prompt: "What is the primary goal of code review in high-performing engineering teams?", options: ["Ensure correctness, security, maintainability, and share knowledge across the team", "Nitpick stylistic spacing", "Block peers from shipping", "Approve everything without reading"], answer: 0, explanation: "Code reviews ensure architectural quality, security, and knowledge dissemination." },
      { id: "hrm_16", prompt: "How should you answer: 'Why do you want to join our company?'", options: ["Connect your career aspirations to specific technical projects and values of the company", "Say you need a high salary", "Say your friends work there", "Read their homepage mission statement word-for-word"], answer: 0, explanation: "Demonstrating alignment with their engineering challenges shows genuine dedication." },
      { id: "hrm_17", prompt: "What body language and vocal delivery conveys confidence in virtual/in-person interviews?", options: ["Upright posture, steady eye contact, measured vocal pacing, and active listening", "Speaking at maximum speed", "Looking down at notes continuously", "Interrupting the interviewer"], answer: 0, explanation: "Composed pacing, clear enunciation, and active engagement signal executive presence." },
      { id: "hrm_18", prompt: "When discussing a failed deadline in your past, what shows true maturity?", options: ["Taking personal accountability, diagnosing estimation blindspots, and showing how you improved future planning", "Blaming external dependencies", "Claiming you have never missed a deadline", "Saying deadlines are arbitrary"], answer: 0, explanation: "Ownership and improved forecasting frameworks showcase authentic professional growth." },
      { id: "hrm_19", prompt: "How should you respond if an interviewer asks: 'Where do you see yourself in 3-5 years?'", options: ["Express enthusiasm to master engineering depth, take on system ownership, and mentor teammates", "Say you want the interviewer's job", "Say you plan to start an unrelated company next year", "Say you have no plans"], answer: 0, explanation: "Highlighting growth toward technical leadership and mentoring shows long-term value." },
      { id: "hrm_20", prompt: "What distinguishes top candidates in HR rounds from average applicants?", options: ["Clear communication, humility, structured storytelling, and genuine passion for solving engineering problems", "Arrogance", "Memorized generic script answers", "Speaking without emotion"], answer: 0, explanation: "Authenticity, structured storytelling, and passion build lasting rapport with hiring committees." },
    ],
  },
];

