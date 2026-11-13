// LEETCODE PATTERNS (easy level) — JavaScript
// Run with: node 02-LeetCode-Easy.js → if nothing breaks, every example is right.

// INDEX (Ctrl+F "§N")
//   §0 HOW TO ATTACK A PROBLEM
//   §1 JS TRAPS THAT FAIL TESTS
//   §2 HASH MAP / SET
//   §3 TWO POINTERS
//   §4 SLIDING WINDOW
//   §5 PREFIX SUM / KADANE
//   §6 BINARY SEARCH
//   §7 STACK
//   §8 LINKED LIST
//   §9 BINARY TREES
//   §10 MATH / BITS
//   §11 PRACTICE LIST

const assert = require("node:assert/strict");
const check = (actual, expected) => assert.deepEqual(actual, expected); // stops the file if an example is wrong

// §0 ── HOW TO ATTACK A PROBLEM ──────────
// 1. Read the examples, then make up 1 small case and 1 weird case (empty, 1 element, negatives, repeats).
// 2. Solve it by hand on paper. What your eyes did is the algorithm.
// 3. Write the brute force first (two for loops). Then ask:
//      searching for the same thing again and again? → Map/Set (§2)
//      array is sorted?                              → two pointers (§3) or binary search (§6)
//      a piece of the array/string in a row?         → sliding window (§4) or prefix sum (§5)
//      brackets, undo, "the most recent one"?        → stack (§7)
//      tree or linked list?                          → recursion (§8, §9)
// 4. Test your own cases before you submit.
// 5. Speed (Big O): O(1) arr[i], map.get · O(log n) binary search · O(n) one loop · O(n log n) sort · O(n²) loop in a loop.
// note: includes(), indexOf(), shift(), splice() are O(n) — inside a loop they make it O(n²).

// §1 ── JS TRAPS THAT FAIL TESTS ──────────

//--------------------------------------------------------------------
// sort() - // Used to order an array. Trick: always give it (a, b) => a - b, without it numbers are sorted like words.

check([10, 1, 2].sort(), [1, 10, 2]); // result ==> [1, 10, 2]  (wrong! compared as text)
check([10, 1, 2].sort((a, b) => a - b), [1, 2, 10]); // result ==> [1, 2, 10]  (small to big)
check([10, 1, 2].sort((a, b) => b - a), [10, 2, 1]); // result ==> [10, 2, 1]  (big to small)
const orig = [3, 1, 2];
const copy = orig.toSorted((a, b) => a - b);
check(orig, [3, 1, 2]); // result ==> [3, 1, 2]  (toSorted left the original alone)
check(copy, [1, 2, 3]); // result ==> [1, 2, 3]
// note: sort() changes the original array; toSorted() gives you a new one.

//--------------------------------------------------------------------
// Math.floor() - // Used to cut the decimals off a division. Trick: JS has no integer division, so 7 / 2 is 3.5.

check(7 / 2, 3.5); // result ==> 3.5
check(Math.floor(7 / 2), 3); // result ==> 3
check(Math.trunc(-7 / 2), -3); // result ==> -3  (Math.floor would give -4)

//--------------------------------------------------------------------
// split("") - // Used to change letters inside a string. Trick: strings can't be changed, so turn it into an array first.

const s = "abc";
const arr = s.split(""); // or [...s]
arr[0] = "x";
check(arr.join(""), "xbc"); // result ==> "xbc"
// note: s[0] = "x" does nothing and gives no error.

//--------------------------------------------------------------------
// === on arrays - // Compares if it is the SAME array, not the same contents. Trick: join() both and compare the text.

check([1, 2] === [1, 2], false); // result ==> false
check([1, 2].join() === [1, 2].join(), true); // result ==> true

//--------------------------------------------------------------------
// Infinity - // Used as the starting value when looking for the smallest. Trick: -Infinity when looking for the biggest.

let min = Infinity;
for (const n of [5, 3, 8]) min = Math.min(min, n);
check(min, 3); // result ==> 3

//--------------------------------------------------------------------
// Array.from() - // Used to build a matrix full of zeros. Trick: never fill([]), every row would be the same array.

const matrix = Array.from({ length: 2 }, () => new Array(3).fill(0));
matrix[0][0] = 1;
check(matrix, [[1, 0, 0], [0, 0, 0]]); // result ==> only the first row changed

//--------------------------------------------------------------------
// at(-1) - // Used to get the last element. Trick: negative numbers count from the end.

check([1, 2, 3].at(-1), 3); // result ==> 3

//--------------------------------------------------------------------
// charCodeAt() - // Used to turn a letter into a number and back. Trick: letter minus "a" gives its place in the alphabet.

check("a".charCodeAt(0), 97); // result ==> 97
check(String.fromCharCode(98), "b"); // result ==> "b"
check("c".charCodeAt(0) - "a".charCodeAt(0), 2); // result ==> 2  (a = 0, b = 1, c = 2)

//--------------------------------------------------------------------
// Digits of a number - // Used to get each digit. Trick: % 10 gives the last digit, Math.floor(/ 10) drops it.

check(String(1234).split("").map(Number), [1, 2, 3, 4]); // result ==> [1, 2, 3, 4]
let num = 1234, digitSum = 0;
while (num > 0) {
  digitSum += num % 10; // last digit
  num = Math.floor(num / 10); // drop the last digit
}
check(digitSum, 10); // result ==> 10  (1 + 2 + 3 + 4)

// §2 ── HASH MAP / SET ──────────

//--------------------------------------------------------------------
// Hash map / Set - // Used when you ask "have I seen this before?" or "how many times?". Trick: a Map answers in O(1).

function count(items) {
  const freq = new Map();
  for (const x of items) freq.set(x, (freq.get(x) ?? 0) + 1);
  return freq;
}

check(count("banana").get("a"), 3); // result ==> 3
// note: Map beats a plain object for counting: any key type and it has .size.

//--------------------------------------------------------------------
// Two Sum (LC 1) - // Used to find the 2 numbers that add up to target. Trick: remember each number you've seen in a Map.

function twoSum(nums, target) {
  const seen = new Map(); // value → index
  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i];
    if (seen.has(needed)) return [seen.get(needed), i];
    seen.set(nums[i], i);
  }
  return [];
}

check(twoSum([2, 7, 11, 15], 9), [0, 1]); // result ==> [0, 1]  (2 + 7 = 9)
check(twoSum([3, 3], 6), [0, 1]); // result ==> [0, 1]
// note: brute force is two for loops = O(n²); the Map makes it O(n).

//--------------------------------------------------------------------
// Contains Duplicate (LC 217) - // Used to know if any number repeats. Trick: a Set drops repeats, so it gets smaller.

const containsDuplicate = (nums) => new Set(nums).size !== nums.length;

check(containsDuplicate([1, 2, 3, 1]), true); // result ==> true
check(containsDuplicate([1, 2, 3]), false); // result ==> false

//--------------------------------------------------------------------
// Valid Anagram (LC 242) - // Used to know if two words have the same letters. Trick: count the first word, subtract the second.

function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const freq = count(a);
  for (const ch of b) {
    if (!freq.get(ch)) return false; // undefined or 0
    freq.set(ch, freq.get(ch) - 1);
  }
  return true;
}

check(isAnagram("anagram", "nagaram"), true); // result ==> true
check(isAnagram("rat", "car"), false); // result ==> false

//--------------------------------------------------------------------
// First Unique Character (LC 387) - // Used to find the first letter that shows up only once. Trick: count first, then walk again.

function firstUniqChar(s) {
  const freq = count(s);
  for (let i = 0; i < s.length; i++) if (freq.get(s[i]) === 1) return i;
  return -1;
}

check(firstUniqChar("leetcode"), 0); // result ==> 0  (the "l")
check(firstUniqChar("aabb"), -1); // result ==> -1  (none)

//--------------------------------------------------------------------
// Group Anagrams (LC 49) - // Used to put words with the same letters together. Trick: the sorted word is the Map key.

function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}

check(groupAnagrams(["eat", "tea", "tan", "nat"]), [["eat", "tea"], ["tan", "nat"]]); // result ==> [["eat", "tea"], ["tan", "nat"]]

// §3 ── TWO POINTERS ──────────

//--------------------------------------------------------------------
// Two pointers - // Used on sorted arrays, palindromes and in-place changes. Start one at each end and walk them inwards.

//   let l = 0, r = arr.length - 1;
//   while (l < r) { ...; l++ or r-- }

//--------------------------------------------------------------------
// Valid Palindrome (LC 125) - // Used to know if a sentence reads the same both ways. Trick: clean it, then compare the two ends.

function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let l = 0, r = clean.length - 1;
  while (l < r) {
    if (clean[l] !== clean[r]) return false;
    l++;
    r--;
  }
  return true;
}

check(isPalindrome("A man, a plan, a canal: Panama"), true); // result ==> true
check(isPalindrome("race a car"), false); // result ==> false

//--------------------------------------------------------------------
// Reverse String (LC 344) - // Used to flip an array of letters in place. Trick: swap the two ends with [a, b] = [b, a].

function reverseString(chars) {
  let l = 0, r = chars.length - 1;
  while (l < r) {
    [chars[l], chars[r]] = [chars[r], chars[l]];
    l++;
    r--;
  }
  return chars;
}

check(reverseString(["h", "e", "y"]), ["y", "e", "h"]); // result ==> ["y", "e", "h"]

//--------------------------------------------------------------------
// Remove Duplicates from Sorted Array (LC 26) - // Used to keep each number once, at the front. Trick: one "reader" and one "writer" walk the same way.

function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[write - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}

const dups = [0, 0, 1, 1, 1, 2, 2, 3];
check(removeDuplicates(dups), 4); // result ==> 4  (how many unique)
check(dups.slice(0, 4), [0, 1, 2, 3]); // result ==> [0, 1, 2, 3]

//--------------------------------------------------------------------
// Move Zeroes (LC 283) - // Used to push every 0 to the end. Trick: same reader/writer, then fill the rest with 0.

function moveZeroes(nums) {
  let write = 0;
  for (const n of nums) if (n !== 0) nums[write++] = n;
  while (write < nums.length) nums[write++] = 0;
  return nums;
}

check(moveZeroes([0, 1, 0, 3, 12]), [1, 3, 12, 0, 0]); // result ==> [1, 3, 12, 0, 0]

//--------------------------------------------------------------------
// Merge Sorted Array (LC 88) - // Used to merge two sorted arrays into the first one. Trick: fill from the BACK, so nothing gets overwritten.

function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
  return nums1;
}

check(merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3), [1, 2, 2, 3, 5, 6]); // result ==> [1, 2, 2, 3, 5, 6]

// §4 ── SLIDING WINDOW ──────────

//--------------------------------------------------------------------
// Sliding window - // Used for "the longest/shortest piece in a row that ...". Grow it on the right, shrink it on the left.

//--------------------------------------------------------------------
// Best Time to Buy and Sell Stock (LC 121) - // Used to find the best buy-then-sell profit. Trick: remember the cheapest day so far.

function maxProfit(prices) {
  let lowest = Infinity, best = 0;
  for (const p of prices) {
    lowest = Math.min(lowest, p);
    best = Math.max(best, p - lowest);
  }
  return best;
}

check(maxProfit([7, 1, 5, 3, 6, 4]), 5); // result ==> 5  (buy at 1, sell at 6)
check(maxProfit([7, 6, 4, 3, 1]), 0); // result ==> 0  (only goes down)

//--------------------------------------------------------------------
// Fixed window of size k - // Used for the best sum of k numbers in a row. Trick: add the one coming in, subtract the one going out.

function maxSumK(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
  }
  return best;
}

check(maxSumK([1, 12, -5, -6, 50, 3], 4), 51); // result ==> 51  (12 - 5 - 6 + 50)

//--------------------------------------------------------------------
// Longest Substring Without Repeating Characters (LC 3) - // Used to find the longest piece with no repeated letter. Trick: a Set holds the window; shrink while it repeats.

function lengthOfLongestSubstring(s) {
  const inWindow = new Set();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (inWindow.has(s[r])) inWindow.delete(s[l++]); // shrink until valid
    inWindow.add(s[r]);
    best = Math.max(best, r - l + 1);
  }
  return best;
}

check(lengthOfLongestSubstring("abcabcbb"), 3); // result ==> 3  ("abc")
check(lengthOfLongestSubstring(""), 0); // result ==> 0
// note: it's a medium, but it is THE variable-window template.

// §5 ── PREFIX SUM / KADANE ──────────

//--------------------------------------------------------------------
// Prefix sum - // Used to get the sum of any range in O(1). Trick: sum(l..r) = prefix[r + 1] - prefix[l].

function prefixSums(nums) {
  const p = [0];
  for (const n of nums) p.push(p.at(-1) + n);
  return p;
}

const P = prefixSums([1, 2, 3, 4]);
check(P[3] - P[1], 2 + 3); // result ==> 5  (sum of index 1 to 2)

//--------------------------------------------------------------------
// Running Sum (LC 1480) - // Used to add each number to all the ones before it. Trick: it's the prefix sum without the 0.

const runningSum = (nums) => prefixSums(nums).slice(1);

check(runningSum([1, 2, 3, 4]), [1, 3, 6, 10]); // result ==> [1, 3, 6, 10]

//--------------------------------------------------------------------
// Maximum Subarray (LC 53) - // Used to find the biggest sum of numbers in a row. Trick: at each number ask "keep going, or start again here?" (Kadane).

function maxSubArray(nums) {
  let current = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}

check(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6); // result ==> 6  (4 - 1 + 2 + 1)
check(maxSubArray([-3, -1]), -1); // result ==> -1
// note: start with nums[0], not 0, or an all-negative array gives 0.

// §6 ── BINARY SEARCH ──────────

//--------------------------------------------------------------------
// Binary Search (LC 704) - // Used to find a number in a SORTED array. Trick: look at the middle and throw away half each time.

function binarySearch(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}

check(binarySearch([-1, 0, 3, 5, 9, 12], 9), 4); // result ==> 4
check(binarySearch([-1, 0, 3, 5, 9, 12], 2), -1); // result ==> -1  (not there)
// note: O(log n). Keep `l <= r` and `mid ± 1` — that's the safest version to memorize.

//--------------------------------------------------------------------
// Search Insert Position (LC 35) - // Used to find where target fits in a sorted array. Trick: same search, but return l at the end.

function searchInsert(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return l;
}

check(searchInsert([1, 3, 5, 6], 2), 1); // result ==> 1  (between 1 and 3)
check(searchInsert([1, 3, 5, 6], 7), 4); // result ==> 4  (at the end)

// §7 ── STACK ──────────

//--------------------------------------------------------------------
// Stack - // Used for brackets, undo and "the last one wins". Trick: a plain array with push() and pop(), top is stack.at(-1).

//--------------------------------------------------------------------
// Valid Parentheses (LC 20) - // Used to check every bracket closes in the right order. Trick: push openers, and each closer must pop its partner.

function isValid(s) {
  const pair = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch in pair) {
      if (stack.pop() !== pair[ch]) return false;
    } else stack.push(ch);
  }
  return stack.length === 0;
}

check(isValid("()[]{}"), true); // result ==> true
check(isValid("([)]"), false); // result ==> false  (wrong order)
check(isValid("(("), false); // result ==> false  (never closed)
// note: a queue is push() + shift(), but shift() is O(n); if you hit Time Limit, walk it with an index instead.

// §8 ── LINKED LIST ──────────

//--------------------------------------------------------------------
// Linked list - // LeetCode gives you `head` and you change the .next arrows. Trick: draw the arrows on paper first.

class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
// helpers for testing: array ↔ list
const toList = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = (head) => {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
};

//--------------------------------------------------------------------
// Reverse Linked List (LC 206) - // Used to flip the list. Trick: save next, flip the arrow, move both forward.

function reverseList(head) {
  let prev = null, current = head;
  while (current) {
    const next = current.next; // 1. save the rest
    current.next = prev; //        2. flip the arrow
    prev = current; //             3. move both forward
    current = next;
  }
  return prev;
}

check(toArray(reverseList(toList([1, 2, 3]))), [3, 2, 1]); // result ==> [3, 2, 1]

//--------------------------------------------------------------------
// Merge Two Sorted Lists (LC 21) - // Used to join two sorted lists into one. Trick: a fake "dummy" first node saves you the special cases.

function mergeTwoLists(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a ?? b;
  return dummy.next;
}

check(toArray(mergeTwoLists(toList([1, 2, 4]), toList([1, 3, 4]))), [1, 1, 2, 3, 4, 4]); // result ==> [1, 1, 2, 3, 4, 4]

//--------------------------------------------------------------------
// Middle of the Linked List (LC 876) - // Used to find the middle node. Trick: slow moves 1, fast moves 2; when fast ends, slow is in the middle.

function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

check(middleNode(toList([1, 2, 3, 4, 5])).val, 3); // result ==> 3

//--------------------------------------------------------------------
// Linked List Cycle (LC 141) - // Used to know if the list loops forever. Trick: same slow/fast — if they meet, there's a loop.

function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

const cycle = toList([1, 2, 3]);
cycle.next.next.next = cycle; // 3 → 1
check(hasCycle(cycle), true); // result ==> true
check(hasCycle(toList([1, 2])), false); // result ==> false

// §9 ── BINARY TREES ──────────

//--------------------------------------------------------------------
// Binary tree - // Almost everything is recursion. Trick: 1. if (!node) return the empty answer; 2. trust left and right already work; 3. combine.

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
//        3
//       / \
//      9   20
//         /  \
//        15   7
const tree = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));

//--------------------------------------------------------------------
// Maximum Depth (LC 104) - // Used to count the levels of the tree. Trick: 1 + the deeper of the two sides.

const maxDepth = (node) => (node ? 1 + Math.max(maxDepth(node.left), maxDepth(node.right)) : 0);

check(maxDepth(tree), 3); // result ==> 3

//--------------------------------------------------------------------
// Invert Binary Tree (LC 226) - // Used to mirror the tree. Trick: swap left and right, after inverting each one.

function invertTree(node) {
  if (!node) return null;
  [node.left, node.right] = [invertTree(node.right), invertTree(node.left)];
  return node;
}

//--------------------------------------------------------------------
// Same Tree (LC 100) - // Used to know if two trees are equal. Trick: same value here, and same on both sides.

function isSameTree(p, q) {
  if (!p || !q) return p === q; // both null → true; only one null → false
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

check(isSameTree(invertTree(invertTree(tree)), tree), true); // result ==> true  (inverting twice gives it back)

//--------------------------------------------------------------------
// Path Sum (LC 112) - // Used to know if a top-to-leaf path adds up to target. Trick: subtract each node from target on the way down.

function hasPathSum(node, target) {
  if (!node) return false;
  if (!node.left && !node.right) return node.val === target; // leaf
  const rest = target - node.val;
  return hasPathSum(node.left, rest) || hasPathSum(node.right, rest);
}

check(hasPathSum(tree, 30), true); // result ==> true  (3 + 20 + 7)
check(hasPathSum(tree, 5), false); // result ==> false

//--------------------------------------------------------------------
// Inorder Traversal (LC 94) - // Used to visit every node (DFS). Trick: only WHERE you push changes: pre = push-left-right, in = left-push-right, post = left-right-push.

function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
  return out;
}

check(inorder(tree), [9, 3, 15, 20, 7]); // result ==> [9, 3, 15, 20, 7]
// note: in-order on a BST gives the values sorted.

//--------------------------------------------------------------------
// Level Order (LC 102) - // Used to read the tree level by level (BFS). Trick: whatever is in the queue right now is one level.

function levelOrder(root) {
  if (!root) return [];
  const levels = [], queue = [root];
  while (queue.length) {
    const size = queue.length, level = []; // everything in the queue right now = 1 level
    for (let i = 0; i < size; i++) {
      const n = queue.shift();
      level.push(n.val);
      if (n.left) queue.push(n.left);
      if (n.right) queue.push(n.right);
    }
    levels.push(level);
  }
  return levels;
}

check(levelOrder(tree), [[3], [9, 20], [15, 7]]); // result ==> [[3], [9, 20], [15, 7]]
// note: it's a medium, but many easy ones are built on it.

// §10 ── MATH / BITS ──────────

//--------------------------------------------------------------------
// Single Number (LC 136) - // Used to find the one number without a pair. Trick: x ^ x = 0, so XOR of everything leaves the single one.

const singleNumber = (nums) => nums.reduce((acc, n) => acc ^ n, 0);

check(singleNumber([4, 1, 2, 1, 2]), 4); // result ==> 4

//--------------------------------------------------------------------
// Missing Number (LC 268) - // Used to find the number missing from 0..n. Trick: the sum it should be minus the sum it is.

const missingNumber = (nums) => (nums.length * (nums.length + 1)) / 2 - nums.reduce((a, b) => a + b, 0);

check(missingNumber([3, 0, 1]), 2); // result ==> 2  (6 - 4)

//--------------------------------------------------------------------
// Palindrome Number (LC 9) - // Used to know if a number reads the same both ways. Trick: build it backwards with % 10, no strings.

function isPalindromeNumber(x) {
  if (x < 0) return false;
  let original = x, reversed = 0;
  while (x > 0) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return reversed === original;
}

check(isPalindromeNumber(121), true); // result ==> true
check(isPalindromeNumber(10), false); // result ==> false  (01 isn't 10)

//--------------------------------------------------------------------
// Power of Two (LC 231) - // Used to know if n is 1, 2, 4, 8... Trick: n & (n - 1) is 0 only for powers of 2.

check(7 % 2 === 1, true); // result ==> true  (odd: % 2 gives 1)
const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0; // 8 = 1000, 7 = 0111 → & gives 0

check(isPowerOfTwo(16), true); // result ==> true
check(isPowerOfTwo(12), false); // result ==> false

//--------------------------------------------------------------------
// Climbing Stairs (LC 70) - // Used to count the ways up n steps, 1 or 2 at a time. Trick: each step = the two before it added (Fibonacci).

function climbStairs(n) {
  let a = 1, b = 1; // ways to reach step 0 and step 1
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}

check(climbStairs(2), 2); // result ==> 2
check(climbStairs(5), 8); // result ==> 8
// note: your first dynamic programming — keep only the last two answers.

// §11 ── PRACTICE LIST ──────────
// In this order. Try each one alone for 20 min before looking above.
//   Hash map:       1 Two Sum · 217 · 242 · 387 · 383 Ransom Note · 349 Intersection of Two Arrays
//   Two pointers:   125 · 344 · 26 · 283 · 88 · 977 Squares of a Sorted Array
//   Window/prefix:  121 · 1480 · 643 Maximum Average Subarray I · 53
//   Binary search:  704 · 35 · 278 First Bad Version
//   Stack:          20 · 232 Implement Queue using Stacks · 1047 Remove All Adjacent Duplicates
//   Linked list:    206 · 21 · 876 · 141 · 83 Remove Duplicates from Sorted List
//   Trees:          104 · 226 · 100 · 112 · 101 Symmetric Tree · 94 Inorder Traversal
//   Math/bits:      136 · 268 · 9 · 70 · 191 Number of 1 Bits

console.log("✅ Easy OK");
