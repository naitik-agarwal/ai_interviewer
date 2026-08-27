export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
}

export const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume exactly one solution, and you may not use the same element twice.",
    starterCode: "#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your optimal solution here\n    \n    return {};\n}\n",
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3\n3 2 4\n6", expectedOutput: "1 2" },
      { input: "2\n3 3\n6", expectedOutput: "0 1" }
    ]
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(int key) and put(int key, int value) methods in O(1) average time complexity.",
    starterCode: "#include <iostream>\n#include <unordered_map>\n\nusing namespace std;\n\nclass LRUCache {\npublic:\n    LRUCache(int capacity) {\n        // Initialize your cache here\n    }\n    \n    int get(int key) {\n        return -1;\n    }\n    \n    void put(int key, int value) {\n        \n    }\n};\n",
    testCases: [
      // For testing LRU cache, input could be a sequence of commands
      { input: "LRUCache 2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4", expectedOutput: "null\nnull\n1\nnull\n-1\nnull\n-1\n3\n4" }
    ]
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
    starterCode: "#include <iostream>\n#include <string>\n#include <stack>\n\nusing namespace std;\n\nbool isValid(string s) {\n    // Write your optimal solution here\n    \n    return false;\n}\n",
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" }
    ]
  }
];