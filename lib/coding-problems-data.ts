export type SupportedLanguage = "python" | "javascript" | "java" | "cpp";

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface CodingProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Arrays & Hashing" | "Two Pointers" | "Sliding Window" | "Stack & Queue" | "Linked List" | "Binary Search" | "Trees & Graphs" | "Dynamic Programming";
  acceptanceRate: string;
  companies: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python: string;
    javascript: string;
    java: string;
    cpp: string;
  };
  solutionCode?: {
    python: string;
    javascript: string;
    java: string;
    cpp: string;
  };
  testCases: TestCase[];
  hints: string[];
}

export const codingProblems: CodingProblem[] = [
  {
    id: "two-sum",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    acceptanceRate: "52.8%",
    companies: ["Google", "Amazon", "Microsoft", "TCS", "Infosys"],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}
`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: "[2,7,11,15], 9",
        expectedOutput: "[0,1]",
        explanation: "2 + 7 = 9",
      },
      {
        id: "tc-2",
        input: "[3,2,4], 6",
        expectedOutput: "[1,2]",
        explanation: "2 + 4 = 6",
      },
      {
        id: "tc-3",
        input: "[3,3], 6",
        expectedOutput: "[0,1]",
      },
      {
        id: "tc-4",
        input: "[1,5,8,11,14], 19",
        expectedOutput: "[2,3]",
        isHidden: true,
      },
    ],
    hints: [
      "A brute force approach checks every pair, which takes O(n²) time. Can you do it in O(n) using a hash map?",
      "While iterating through nums, check if (target - nums[i]) already exists in your hash map.",
    ],
  },
  {
    id: "valid-parentheses",
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack & Queue",
    acceptanceRate: "41.5%",
    companies: ["Amazon", "Meta", "Bloomberg", "Wipro", "Accenture"],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    starterCode: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}
`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        return false;
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: '"()"',
        expectedOutput: "true",
      },
      {
        id: "tc-2",
        input: '"()[]{}"',
        expectedOutput: "true",
      },
      {
        id: "tc-3",
        input: '"(]"',
        expectedOutput: "false",
      },
      {
        id: "tc-4",
        input: '"{[()]}"',
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    hints: [
      "Use a Stack data structure (LIFO). Push open brackets onto the stack.",
      "When encountering a closing bracket, verify if the top of the stack matches its opening pair.",
    ],
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Two Pointers",
    acceptanceRate: "54.1%",
    companies: ["Amazon", "Goldman Sachs", "Oracle", "Cognizant"],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0.",
      },
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4",
    ],
    starterCode: {
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your code here
        return 0;
    }
}
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: "[7,1,5,3,6,4]",
        expectedOutput: "5",
      },
      {
        id: "tc-2",
        input: "[7,6,4,3,1]",
        expectedOutput: "0",
      },
      {
        id: "tc-3",
        input: "[2,4,1]",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    hints: [
      "Track the minimum buying price seen so far as you iterate through the days.",
      "Calculate current profit = price[i] - minPrice, and maintain maxProfit = max(maxProfit, current profit).",
    ],
  },
  {
    id: "longest-substring-without-repeating-characters",
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    acceptanceRate: "34.8%",
    companies: ["Google", "Meta", "Amazon", "Adobe", "Uber"],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    starterCode: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}
`,
      cpp: `#include <string>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: '"abcabcbb"',
        expectedOutput: "3",
      },
      {
        id: "tc-2",
        input: '"bbbbb"',
        expectedOutput: "1",
      },
      {
        id: "tc-3",
        input: '"pwwkew"',
        expectedOutput: "3",
      },
      {
        id: "tc-4",
        input: '""',
        expectedOutput: "0",
        isHidden: true,
      },
    ],
    hints: [
      "Use the Sliding Window technique with two pointers: left and right.",
      "Keep a set or map of characters inside the current window [left...right]. If a duplicate character appears, advance left pointer until the duplicate is removed.",
    ],
  },
  {
    id: "reverse-linked-list",
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    acceptanceRate: "75.2%",
    companies: ["Microsoft", "Amazon", "Apple", "Paytm"],
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
      },
      {
        input: "head = []",
        output: "[]",
      },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    starterCode: {
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head):
        # Write your code here
        pass
`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    // Write your code here
    
}
`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        return null;
    }
}
`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your code here
        return nullptr;
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: "[1,2,3,4,5]",
        expectedOutput: "[5,4,3,2,1]",
      },
      {
        id: "tc-2",
        input: "[1,2]",
        expectedOutput: "[2,1]",
      },
      {
        id: "tc-3",
        input: "[]",
        expectedOutput: "[]",
      },
    ],
    hints: [
      "Maintain three pointers: prev (initially null), curr (initially head), and nextTemp.",
      "Iterate through the list and change curr.next to point to prev.",
    ],
  },
  {
    id: "merge-intervals",
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    acceptanceRate: "47.3%",
    companies: ["Google", "Meta", "Uber", "Cisco", "Walmart"],
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4",
    ],
    starterCode: {
      python: `class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your code here
        return new int[][]{};
    }
}
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Write your code here
        return {};
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: "[[1,3],[2,6],[8,10],[15,18]]",
        expectedOutput: "[[1,6],[8,10],[15,18]]",
      },
      {
        id: "tc-2",
        input: "[[1,4],[4,5]]",
        expectedOutput: "[[1,5]]",
      },
      {
        id: "tc-3",
        input: "[[1,4],[0,4]]",
        expectedOutput: "[[0,4]]",
        isHidden: true,
      },
    ],
    hints: [
      "First sort the intervals based on their start time (intervals[0]).",
      "Iterate through the sorted intervals. If the current interval overlaps with the previous one (i.e. current.start <= prev.end), merge them by updating prev.end = max(prev.end, current.end).",
    ],
  },
  {
    id: "binary-search",
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    acceptanceRate: "57.8%",
    companies: ["Apple", "Microsoft", "Google", "Capgemini"],
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    starterCode: {
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
        return -1;
    }
}
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your code here
        return -1;
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: "[-1,0,3,5,9,12], 9",
        expectedOutput: "4",
      },
      {
        id: "tc-2",
        input: "[-1,0,3,5,9,12], 2",
        expectedOutput: "-1",
      },
      {
        id: "tc-3",
        input: "[5], 5",
        expectedOutput: "0",
        isHidden: true,
      },
    ],
    hints: [
      "Set left = 0, right = nums.length - 1.",
      "While left <= right, calculate mid = left + (right - left) // 2.",
      "If nums[mid] == target return mid; if nums[mid] < target set left = mid + 1; else set right = mid - 1.",
    ],
  },
  {
    id: "coin-change",
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    acceptanceRate: "43.9%",
    companies: ["Amazon", "Microsoft", "Paypal", "Atlassian"],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1",
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
      },
      {
        input: "coins = [1], amount = 0",
        output: "0",
      },
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    starterCode: {
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your code here
        return -1;
    }
}
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Write your code here
        return -1;
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: "[1,2,5], 11",
        expectedOutput: "3",
      },
      {
        id: "tc-2",
        input: "[2], 3",
        expectedOutput: "-1",
      },
      {
        id: "tc-3",
        input: "[1], 0",
        expectedOutput: "0",
      },
      {
        id: "tc-4",
        input: "[186,419,83,408], 6249",
        expectedOutput: "20",
        isHidden: true,
      },
    ],
    hints: [
      "Use dynamic programming: create a dp array of size (amount + 1) filled with Infinity / (amount + 1). Set dp[0] = 0.",
      "For each coin in coins and for each i from coin to amount, dp[i] = min(dp[i], dp[i - coin] + 1).",
    ],
  },
];
