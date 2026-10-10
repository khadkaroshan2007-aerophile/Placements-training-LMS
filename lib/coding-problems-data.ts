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
  // 1. Two Sum
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
      { id: "tc-1", input: "[2,7,11,15], 9", expectedOutput: "[0,1]", explanation: "2 + 7 = 9" },
      { id: "tc-2", input: "[3,2,4], 6", expectedOutput: "[1,2]", explanation: "2 + 4 = 6" },
      { id: "tc-3", input: "[3,3], 6", expectedOutput: "[0,1]" },
      { id: "tc-4", input: "[1,5,8,11,14], 19", expectedOutput: "[2,3]", isHidden: true },
    ],
    hints: [
      "A brute force approach checks every pair, which takes O(n²) time. Can you do it in O(n) using a hash map?",
      "While iterating through nums, check if (target - nums[i]) already exists in your hash map.",
    ],
  },

  // 2. Valid Parentheses
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
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
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
      { id: "tc-1", input: '"()"', expectedOutput: "true" },
      { id: "tc-2", input: '"()[]{}"', expectedOutput: "true" },
      { id: "tc-3", input: '"(]"', expectedOutput: "false" },
      { id: "tc-4", input: '"{[()]}"', expectedOutput: "true", isHidden: true },
    ],
    hints: [
      "Use a Stack data structure (LIFO). Push open brackets onto the stack.",
      "When encountering a closing bracket, verify if the top of the stack matches its opening pair.",
    ],
  },

  // 3. Best Time to Buy and Sell Stock
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
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
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
      { id: "tc-1", input: "[7,1,5,3,6,4]", expectedOutput: "5" },
      { id: "tc-2", input: "[7,6,4,3,1]", expectedOutput: "0" },
      { id: "tc-3", input: "[2,4,1]", expectedOutput: "2", isHidden: true },
    ],
    hints: [
      "Track the minimum buying price seen so far as you iterate through the days.",
      "Calculate current profit = price[i] - minPrice, and maintain maxProfit = max(maxProfit, current profit).",
    ],
  },

  // 4. Longest Substring Without Repeating Characters
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
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with the length of 3.' },
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
      { id: "tc-1", input: '"abcabcbb"', expectedOutput: "3" },
      { id: "tc-2", input: '"bbbbb"', expectedOutput: "1" },
      { id: "tc-3", input: '"pwwkew"', expectedOutput: "3" },
      { id: "tc-4", input: '""', expectedOutput: "0", isHidden: true },
    ],
    hints: [
      "Use the Sliding Window technique with two pointers: left and right.",
      "Keep a set or map of characters inside the current window [left...right]. If a duplicate character appears, advance left pointer until the duplicate is removed.",
    ],
  },

  // 5. Reverse Linked List
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
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
      { input: "head = []", output: "[]" },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    starterCode: {
      python: `class Solution:
    def reverseList(self, head):
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        return null;
    }
}
`,
      cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your code here
        return nullptr;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]" },
      { id: "tc-2", input: "[1,2]", expectedOutput: "[2,1]" },
      { id: "tc-3", input: "[]", expectedOutput: "[]" },
    ],
    hints: [
      "Maintain three pointers: prev (initially null), curr (initially head), and nextTemp.",
      "Iterate through the list and change curr.next to point to prev.",
    ],
  },

  // 6. Merge Intervals
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
      { id: "tc-1", input: "[[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]" },
      { id: "tc-2", input: "[[1,4],[4,5]]", expectedOutput: "[[1,5]]" },
      { id: "tc-3", input: "[[1,4],[0,4]]", expectedOutput: "[[0,4]]", isHidden: true },
    ],
    hints: [
      "First sort the intervals based on their start time (intervals[0]).",
      "Iterate through the sorted intervals. If current interval overlaps with prev, merge them.",
    ],
  },

  // 7. Binary Search
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
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1" },
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
      { id: "tc-1", input: "[-1,0,3,5,9,12], 9", expectedOutput: "4" },
      { id: "tc-2", input: "[-1,0,3,5,9,12], 2", expectedOutput: "-1" },
      { id: "tc-3", input: "[5], 5", expectedOutput: "0", isHidden: true },
    ],
    hints: [
      "Set left = 0, right = nums.length - 1.",
      "While left <= right, calculate mid = left + (right - left) // 2.",
    ],
  },

  // 8. Coin Change
  {
    id: "coin-change",
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    acceptanceRate: "43.9%",
    companies: ["Amazon", "Microsoft", "Paypal", "Atlassian"],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.`,
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
      { input: "coins = [2], amount = 3", output: "-1" },
      { input: "coins = [1], amount = 0", output: "0" },
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
      { id: "tc-1", input: "[1,2,5], 11", expectedOutput: "3" },
      { id: "tc-2", input: "[2], 3", expectedOutput: "-1" },
      { id: "tc-3", input: "[1], 0", expectedOutput: "0" },
      { id: "tc-4", input: "[186,419,83,408], 6249", expectedOutput: "20", isHidden: true },
    ],
    hints: [
      "Use dynamic programming: dp array where dp[i] represents min coins to make amount i.",
      "dp[i] = min(dp[i], dp[i - coin] + 1).",
    ],
  },

  // 9. Valid Anagram
  {
    id: "valid-anagram",
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    acceptanceRate: "63.7%",
    companies: ["Uber", "Google", "Amazon", "Snapchat"],
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" },
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters.",
    ],
    starterCode: {
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        // Write your code here
        return false;
    }
}
`,
      cpp: `#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        // Write your code here
        return false;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: '"anagram", "nagaram"', expectedOutput: "true" },
      { id: "tc-2", input: '"rat", "car"', expectedOutput: "false" },
      { id: "tc-3", input: '"a", "ab"', expectedOutput: "false", isHidden: true },
    ],
    hints: [
      "Check if lengths are equal. If not, return false.",
      "Count character frequencies with an array of size 26 or a hash map.",
    ],
  },

  // 10. Group Anagrams
  {
    id: "group-anagrams",
    slug: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    acceptanceRate: "67.4%",
    companies: ["Amazon", "Apple", "Salesforce", "Intuit"],
    description: `Given an array of strings \`strs\`, group **the anagrams** together. You can return the answer in **any order**.`,
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' },
    ],
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters.",
    ],
    starterCode: {
      python: `class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Write your code here
        return new ArrayList<>();
    }
}
`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        // Write your code here
        return {};
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: '["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      { id: "tc-2", input: '[""]', expectedOutput: '[[""]]' },
      { id: "tc-3", input: '["a"]', expectedOutput: '[["a"]]' },
    ],
    hints: [
      "Use sorted strings as keys in a hash map: key -> list of words.",
    ],
  },

  // 11. Top K Frequent Elements
  {
    id: "top-k-frequent-elements",
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    acceptanceRate: "63.2%",
    companies: ["Meta", "Amazon", "Netflix", "Adobe"],
    description: `Given an integer array \`nums\` and an integer \`k\`, return *the* \`k\` *most frequent elements*. You may return the answer in **any order**.`,
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "k is in the range [1, the number of unique elements in the array].",
    ],
    starterCode: {
      python: `class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function topKFrequent(nums, k) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Write your code here
        return new int[]{};
    }
}
`,
      cpp: `#include <vector>
#include <unordered_map>
#include <queue>
using namespace std;

class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        // Write your code here
        return {};
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[1,1,1,2,2,3], 2", expectedOutput: "[1,2]" },
      { id: "tc-2", input: "[1], 1", expectedOutput: "[1]" },
      { id: "tc-3", input: "[4,1,-1,2,-1,2,3], 2", expectedOutput: "[-1,2]", isHidden: true },
    ],
    hints: [
      "Count frequencies in O(n) time with a hash map.",
      "Use bucket sort or a min-heap of size k to extract top k frequent elements in O(n) or O(n log k) time.",
    ],
  },

  // 12. Container With Most Water
  {
    id: "container-with-most-water",
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    acceptanceRate: "54.8%",
    companies: ["Google", "Amazon", "Goldman Sachs", "ByteDance"],
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.`,
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Max area = min(8, 7) * 7 = 49." },
      { input: "height = [1,1]", output: "1" },
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4",
    ],
    starterCode: {
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int maxArea(int[] height) {
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
    int maxArea(vector<int>& height) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
      { id: "tc-2", input: "[1,1]", expectedOutput: "1" },
      { id: "tc-3", input: "[4,3,2,1,4]", expectedOutput: "16", isHidden: true },
    ],
    hints: [
      "Use two pointers: left at start (0) and right at end (n-1).",
      "Area = (right - left) * min(height[left], height[right]). Move the pointer with the smaller height inward.",
    ],
  },

  // 13. 3Sum
  {
    id: "3sum",
    slug: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    category: "Two Pointers",
    acceptanceRate: "33.6%",
    companies: ["Meta", "Amazon", "Microsoft", "Cisco"],
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
      },
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
    ],
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5",
    ],
    starterCode: {
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your code here
        return new ArrayList<>();
    }
}
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Write your code here
        return {};
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]" },
      { id: "tc-2", input: "[0,1,1]", expectedOutput: "[]" },
      { id: "tc-3", input: "[0,0,0]", expectedOutput: "[[0,0,0]]" },
    ],
    hints: [
      "Sort the array first.",
      "Iterate through nums with pointer i. For each i, use two pointers left and right on the remaining subarray to find pairs summing to -nums[i].",
      "Skip duplicate values for i, left, and right.",
    ],
  },

  // 14. Trapping Rain Water
  {
    id: "trapping-rain-water",
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Two Pointers",
    acceptanceRate: "60.4%",
    companies: ["Google", "Amazon", "Goldman Sachs", "Apple"],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "The elevation map traps 6 units of rain water." },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5",
    ],
    starterCode: {
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int trap(int[] height) {
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
    int trap(vector<int>& height) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6" },
      { id: "tc-2", input: "[4,2,0,3,2,5]", expectedOutput: "9" },
      { id: "tc-3", input: "[3,0,2,0,4]", expectedOutput: "7", isHidden: true },
    ],
    hints: [
      "Water above index i is determined by min(maxLeft, maxRight) - height[i].",
      "Two pointers approach lets you solve it in O(n) time and O(1) space.",
    ],
  },

  // 15. Maximum Subarray (Kadane's Algorithm)
  {
    id: "maximum-subarray",
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    acceptanceRate: "50.9%",
    companies: ["Microsoft", "Amazon", "LinkedIn", "TCS"],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.`,
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1" },
      { input: "nums = [5,4,-1,7,8]", output: "23" },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    starterCode: {
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
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
    int maxSubArray(vector<int>& nums) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { id: "tc-2", input: "[1]", expectedOutput: "1" },
      { id: "tc-3", input: "[5,4,-1,7,8]", expectedOutput: "23" },
    ],
    hints: [
      "Kadane's algorithm: currentSum = max(nums[i], currentSum + nums[i]).",
      "maxSum = max(maxSum, currentSum).",
    ],
  },

  // 16. Product of Array Except Self
  {
    id: "product-of-array-except-self",
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    acceptanceRate: "65.5%",
    companies: ["Amazon", "Apple", "Uber", "Qualcomm"],
    description: `Given an integer array \`nums\`, return *an array* \`answer\` *such that* \`answer[i]\` *is equal to the product of all the elements of* \`nums\` *except* \`nums[i]\`.

You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
    ],
    starterCode: {
      python: `class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Write your code here
        return new int[]{};
    }
}
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        // Write your code here
        return {};
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[1,2,3,4]", expectedOutput: "[24,12,8,6]" },
      { id: "tc-2", input: "[-1,1,0,-3,3]", expectedOutput: "[0,0,9,0,0]" },
    ],
    hints: [
      "Calculate prefix products in one pass from left to right.",
      "Calculate suffix products in a second pass from right to left.",
    ],
  },

  // 17. Search in Rotated Sorted Array
  {
    id: "search-in-rotated-sorted-array",
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    acceptanceRate: "40.1%",
    companies: ["Microsoft", "Amazon", "Meta", "Oracle"],
    description: `Given the array \`nums\` after the possible rotation and an integer \`target\`, return *the index of* \`target\` *if it is in* \`nums\`, *or* \`-1\` *if it is not in* \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
      { input: "nums = [1], target = 0", output: "-1" },
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
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
      { id: "tc-1", input: "[4,5,6,7,0,1,2], 0", expectedOutput: "4" },
      { id: "tc-2", input: "[4,5,6,7,0,1,2], 3", expectedOutput: "-1" },
      { id: "tc-3", input: "[1], 0", expectedOutput: "-1" },
    ],
    hints: [
      "Notice that at least one half of the rotated array is always normally sorted.",
      "Check whether target falls in the sorted half; if so, search there, else search the other half.",
    ],
  },

  // 18. Find Minimum in Rotated Sorted Array
  {
    id: "find-minimum-in-rotated-sorted-array",
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    acceptanceRate: "50.1%",
    companies: ["Amazon", "Microsoft", "Goldman Sachs"],
    description: `Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times.

Given the sorted rotated array \`nums\` of **unique** elements, return *the minimum element of this array*.

You must write an algorithm that runs in \`O(log n)\` time.`,
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
      { input: "nums = [11,13,15,17]", output: "11" },
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All the integers of nums are unique.",
    ],
    starterCode: {
      python: `class Solution:
    def findMin(self, nums: list[int]) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function findMin(nums) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int findMin(int[] nums) {
        // Write your code here
        return 0;
    }
}
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int findMin(vector<int>& nums) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[3,4,5,1,2]", expectedOutput: "1" },
      { id: "tc-2", input: "[4,5,6,7,0,1,2]", expectedOutput: "0" },
      { id: "tc-3", input: "[11,13,15,17]", expectedOutput: "11" },
    ],
    hints: [
      "Compare nums[mid] with nums[right]. If nums[mid] > nums[right], the minimum is in the right half.",
    ],
  },

  // 19. Longest Consecutive Sequence
  {
    id: "longest-consecutive-sequence",
    slug: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    acceptanceRate: "47.9%",
    companies: ["Google", "Amazon", "Spotify"],
    description: `Given an unsorted array of integers \`nums\`, return *the length of the longest consecutive elements sequence.*

You must write an algorithm that runs in \`O(n)\` time.`,
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4." },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
    ],
    constraints: [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
    ],
    starterCode: {
      python: `class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function longestConsecutive(nums) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int longestConsecutive(int[] nums) {
        // Write your code here
        return 0;
    }
}
`,
      cpp: `#include <vector>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[100,4,200,1,3,2]", expectedOutput: "4" },
      { id: "tc-2", input: "[0,3,7,2,5,8,4,6,0,1]", expectedOutput: "9" },
    ],
    hints: [
      "Store all numbers in a HashSet.",
      "Only start counting sequence when (num - 1) is NOT in the set.",
    ],
  },

  // 20. Climbing Stairs
  {
    id: "climbing-stairs",
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    acceptanceRate: "52.4%",
    companies: ["Amazon", "Adobe", "Apple", "Uber"],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step\n2. 2 steps" },
      { input: "n = 3", output: "3", explanation: "1. 1 + 1 + 1\n2. 1 + 2\n3. 2 + 1" },
    ],
    constraints: ["1 <= n <= 45"],
    starterCode: {
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }
}
`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "2", expectedOutput: "2" },
      { id: "tc-2", input: "3", expectedOutput: "3" },
      { id: "tc-3", input: "5", expectedOutput: "8", isHidden: true },
    ],
    hints: [
      "This is equivalent to the Fibonacci sequence: ways(n) = ways(n-1) + ways(n-2).",
    ],
  },

  // 21. House Robber
  {
    id: "house-robber",
    slug: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    acceptanceRate: "50.1%",
    companies: ["Google", "Amazon", "Microsoft", "Cisco"],
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected and **will automatically contact the police if two adjacent houses were broken into on the same night**.

Given an integer array \`nums\` representing the amount of money of each house, return *the maximum amount of money you can rob tonight without alerting the police*.`,
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 4." },
      { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1 (2), house 3 (9) and house 5 (1). Total = 12." },
    ],
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400",
    ],
    starterCode: {
      python: `class Solution:
    def rob(self, nums: list[int]) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function rob(nums) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int rob(int[] nums) {
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
    int rob(vector<int>& nums) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[1,2,3,1]", expectedOutput: "4" },
      { id: "tc-2", input: "[2,7,9,3,1]", expectedOutput: "12" },
      { id: "tc-3", input: "[2,1,1,2]", expectedOutput: "4", isHidden: true },
    ],
    hints: [
      "dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
      "You only need two variables to keep track of previous maximums.",
    ],
  },

  // 22. Longest Increasing Subsequence
  {
    id: "longest-increasing-subsequence",
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    acceptanceRate: "54.2%",
    companies: ["Google", "Meta", "Amazon", "Microsoft"],
    description: `Given an integer array \`nums\`, return *the length of the longest strictly increasing subsequence*.`,
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The longest increasing subsequence is [2,5,7,101], therefore the length is 4." },
      { input: "nums = [0,1,0,3,2,3]", output: "4" },
      { input: "nums = [7,7,7,7,7,7,7]", output: "1" },
    ],
    constraints: [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4",
    ],
    starterCode: {
      python: `class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function lengthOfLIS(nums) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int lengthOfLIS(int[] nums) {
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
    int lengthOfLIS(vector<int>& nums) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[10,9,2,5,3,7,101,18]", expectedOutput: "4" },
      { id: "tc-2", input: "[0,1,0,3,2,3]", expectedOutput: "4" },
      { id: "tc-3", input: "[7,7,7,7,7,7,7]", expectedOutput: "1" },
    ],
    hints: [
      "DP approach: dp[i] is length of LIS ending at index i.",
      "Binary search approach (Patience sorting) achieves O(n log n) time.",
    ],
  },

  // 23. Invert Binary Tree
  {
    id: "invert-binary-tree",
    slug: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Trees & Graphs",
    acceptanceRate: "76.4%",
    companies: ["Google", "Homebrew", "Amazon", "Twitter"],
    description: `Given the \`root\` of a binary tree, invert the tree, and return *its root*.`,
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
      { input: "root = [2,1,3]", output: "[2,3,1]" },
      { input: "root = []", output: "[]" },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100",
    ],
    starterCode: {
      python: `class Solution:
    def invertTree(self, root):
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
function invertTree(root) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Write your code here
        return null;
    }
}
`,
      cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Write your code here
        return nullptr;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[4,2,7,1,3,6,9]", expectedOutput: "[4,7,2,9,6,3,1]" },
      { id: "tc-2", input: "[2,1,3]", expectedOutput: "[2,3,1]" },
      { id: "tc-3", input: "[]", expectedOutput: "[]" },
    ],
    hints: [
      "Recursive DFS: swap root.left and root.right, then recurse on both subtrees.",
    ],
  },

  // 24. Maximum Depth of Binary Tree
  {
    id: "maximum-depth-of-binary-tree",
    slug: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Trees & Graphs",
    acceptanceRate: "75.1%",
    companies: ["Amazon", "Microsoft", "LinkedIn", "Spotify"],
    description: `Given the \`root\` of a binary tree, return *its maximum depth*.

A binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" },
      { input: "root = [1,null,2]", output: "2" },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100",
    ],
    starterCode: {
      python: `class Solution:
    def maxDepth(self, root) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {TreeNode} root
 * @return {number}
 */
function maxDepth(root) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int maxDepth(TreeNode root) {
        // Write your code here
        return 0;
    }
}
`,
      cpp: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[3,9,20,null,null,15,7]", expectedOutput: "3" },
      { id: "tc-2", input: "[1,null,2]", expectedOutput: "2" },
    ],
    hints: [
      "Base case: if root is null, return 0.",
      "Recursive case: 1 + max(maxDepth(root.left), maxDepth(root.right)).",
    ],
  },

  // 25. Number of Islands
  {
    id: "number-of-islands",
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Trees & Graphs",
    acceptanceRate: "58.6%",
    companies: ["Amazon", "Google", "Bloomberg", "DoorDash"],
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1",
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'.",
    ],
    starterCode: {
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your code here
        return 0;
    }
}
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Write your code here
        return 0;
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        expectedOutput: "1",
      },
      {
        id: "tc-2",
        input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        expectedOutput: "3",
      },
    ],
    hints: [
      "Iterate through every cell in the grid. If grid[r][c] == '1', increment island count and trigger a BFS/DFS to sink the island (mark visited cells as '0').",
    ],
  },

  // 26. Min Stack
  {
    id: "min-stack",
    slug: "min-stack",
    title: "Min Stack",
    difficulty: "Medium",
    category: "Stack & Queue",
    acceptanceRate: "53.2%",
    companies: ["Amazon", "Microsoft", "Bloomberg", "Salesforce"],
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the \`MinStack\` class:
- \`MinStack()\` initializes the stack object.
- \`void push(int val)\` pushes the element val onto the stack.
- \`void pop()\` removes the element on the top of the stack.
- \`int top()\` gets the top element of the stack.
- \`int getMin()\` retrieves the minimum element in the stack.

You must implement a solution with \`O(1)\` time complexity for each function.`,
    examples: [
      {
        input: '["MinStack","push","push","push","getMin","pop","top","getMin"], [[],[-2],[0],[-3],[],[],[],[]]',
        output: "[null,null,null,null,-3,null,0,-2]",
      },
    ],
    constraints: [
      "-2^31 <= val <= 2^31 - 1",
      "Methods pop, top and getMin operations will always be called on non-empty stacks.",
      "At most 3 * 10^4 calls will be made to push, pop, top, and getMin.",
    ],
    starterCode: {
      python: `class MinStack:
    def __init__(self):
        # Initialize your data structures here
        pass

    def push(self, val: int) -> None:
        pass

    def pop(self) -> None:
        pass

    def top(self) -> int:
        pass

    def getMin(self) -> int:
        pass
`,
      javascript: `var MinStack = function() {
    
};

/** 
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {
    
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    
};
`,
      java: `class MinStack {
    public MinStack() {
        
    }
    
    public void push(int val) {
        
    }
    
    public void pop() {
        
    }
    
    public int top() {
        return 0;
    }
    
    public int getMin() {
        return 0;
    }
}
`,
      cpp: `#include <stack>
using namespace std;

class MinStack {
public:
    MinStack() {
        
    }
    
    void push(int val) {
        
    }
    
    void pop() {
        
    }
    
    int top() {
        return 0;
    }
    
    int getMin() {
        return 0;
    }
};
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: '["push(-2)", "push(0)", "push(-3)", "getMin()", "pop()", "top()", "getMin()"]',
        expectedOutput: "[-3, 0, -2]",
      },
    ],
    hints: [
      "Maintain a secondary minStack that records the minimum value encountered at each stack depth.",
    ],
  },

  // 27. Daily Temperatures
  {
    id: "daily-temperatures",
    slug: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "Medium",
    category: "Stack & Queue",
    acceptanceRate: "66.3%",
    companies: ["Amazon", "Google", "Meta"],
    description: `Given an array of integers \`temperatures\` represents the daily temperatures, return *an array* \`answer\` *such that* \`answer[i]\` *is the number of days you have to wait after the* \`i\`th *day to get a warmer temperature*. If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.`,
    examples: [
      { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" },
      { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" },
      { input: "temperatures = [30,60,90]", output: "[1,1,0]" },
    ],
    constraints: [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100",
    ],
    starterCode: {
      python: `class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        // Write your code here
        return new int[]{};
    }
}
`,
      cpp: `#include <vector>
#include <stack>
using namespace std;

class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        // Write your code here
        return {};
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: "[73,74,75,71,69,72,76,73]", expectedOutput: "[1,1,4,2,1,1,0,0]" },
      { id: "tc-2", input: "[30,40,50,60]", expectedOutput: "[1,1,1,0]" },
      { id: "tc-3", input: "[30,60,90]", expectedOutput: "[1,1,0]" },
    ],
    hints: [
      "Use a monotonic decreasing stack storing indices.",
      "When current temperature is greater than temperature at stack top index, pop and calculate days difference.",
    ],
  },

  // 28. Word Break
  {
    id: "word-break",
    slug: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    category: "Dynamic Programming",
    acceptanceRate: "46.2%",
    companies: ["Amazon", "Bloomberg", "Google", "Facebook"],
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: "true", explanation: 'Return true because "leetcode" can be segmented as "leet code".' },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: "true", explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple".' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: "false" },
    ],
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "s and wordDict[i] consist of only lowercase English letters.",
      "All the strings of wordDict are unique.",
    ],
    starterCode: {
      python: `class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
function wordBreak(s, wordDict) {
    // Write your code here
    
}
`,
      java: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        // Write your code here
        return false;
    }
}
`,
      cpp: `#include <string>
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        // Write your code here
        return false;
    }
};
`,
    },
    testCases: [
      { id: "tc-1", input: '"leetcode", ["leet","code"]', expectedOutput: "true" },
      { id: "tc-2", input: '"applepenapple", ["apple","pen"]', expectedOutput: "true" },
      { id: "tc-3", input: '"catsandog", ["cats","dog","sand","and","cat"]', expectedOutput: "false" },
    ],
    hints: [
      "Use dynamic programming: dp[i] = true if s[0...i] can be segmented.",
      "For each i from 1 to s.length and for each j from 0 to i, if dp[j] is true and s[j...i] is in wordDict, set dp[i] = true.",
    ],
  },
];
