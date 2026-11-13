// LEETCODE PATTERNS (MEDIUM level) — JavaScript
// Run with: node 03-LeetCode-Medium.js → it prints "✅ Medium OK".
// Check every "// result ==>": node check-results.js 03-LeetCode-Medium.js
// Before this one: 02-LeetCode-Easy.js (Map, Set, sort with (a, b) => a - b).
// "// uses:" lists the basic JS pieces a solution needs and where 01-JS-Fundamentals.js (01) or 02-LeetCode-Easy.js (02) explains them.

/*
  INDEX (Ctrl+F "§N ──")
    §1  How to tackle a medium in an interview
    §2  Advanced hash map (prefix sum, grouping, sequences, top K)
    §3  Two pointers (3Sum, Container With Most Water)
    §4  Variable sliding window with Map
    §5  Monotonic stack + stack
    §6  Advanced binary search (rotated array, binary search on the answer)
    §7  Intervals
    §8  Matrix / grid (DFS, multi-source BFS)
    §9  Graphs (adjacency list, topological sort)
    §10 Backtracking
    §11 Heap (hand-written MinHeap)
    §12 Dynamic programming
    §13 Linked lists (medium)
    §14 Trees (medium)
    §15 Final table: signal → pattern + what Big-O n allows
    §16 7-day plan
*/

// =====================================================================================
// §1 ── HOW TO TACKLE A MEDIUM IN AN INTERVIEW ──────────
// =====================================================================================
// They grade how you think, not only the answer. Talk the whole time.
//   1. Ask: empty? 1 element? duplicates? negatives? sorted? indices or values? how big is n?
//   2. Solve the example by hand, out loud.
//   3. Say the slow solution first ("two for loops, O(n²)"). No need to write it.
//   4. Make it faster: "what am I repeating?" → a Map/Set. Or: "does sorting make it easy?"
//   5. Write it with clear names (left, right, freq).
//   6. Walk the code with the example, then with one edge case.
//   7. Say time AND space at the end, before they ask.
// Edge cases to test: [] · [5] · [2,2,2] · [-3,0,3] · sorted / reversed · no answer · "A" vs "a"

//--------------------------------------------------------------------
// Numbers in JS - // Used to remember that decimals are not exact. Trick: compare decimals with a tiny tolerance, never with ===.

0.1 + 0.2 === 0.3; // result ==> false  (floats lie)
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // result ==> true
Number.MAX_SAFE_INTEGER; // result ==> 9007199254740991
"Ab".toLowerCase() === "ab"; // result ==> true
// uses: Math.abs / Number.EPSILON / MAX_SAFE_INTEGER → 01 §8 · toLowerCase → 01 §7
// note: integers are safe up to 2^53. Divisions → Math.floor / Math.trunc.

// =====================================================================================
// §2 ── ADVANCED HASH MAP ──────────
// =====================================================================================
// Use it when the problem says: "subarray with sum k", "group", "anagrams", "consecutive sequence", "k most frequent", "count how many"

//--------------------------------------------------------------------
// Subarray Sum Equals K (LC 560) - // Used to count how many pieces of the array add up to k. Trick: keep a running sum and a Map of the sums you've seen.

function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]); // prefix 0 already "exists" once: subarray starting at index 0
  let prefix = 0, total = 0;
  for (const n of nums) {
    prefix += n;
    total += seen.get(prefix - k) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }
  return total;
}

subarraySum([1, 1, 1], 2); // result ==> 2  ([1,1] twice)
subarraySum([1, 2, 3], 3); // result ==> 2  ([1,2] and [3])
subarraySum([1, -1, 0], 0); // result ==> 3  (negatives and zero)
subarraySum([], 0); // result ==> 0
subarraySum([5], 5); // result ==> 1
// uses: Map get/set → 01 §14 · ?? → 01 §3 · for...of → 01 §6 · pattern: prefix sum → 02 §5
// note: a sliding window doesn't work here because numbers can be negative.
// note: O(n) time, O(n) space

//--------------------------------------------------------------------
// Group Anagrams (LC 49) - // Used to put words with the same letters in the same group. Trick: the word with its letters sorted is the key of a Map.

function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = [...s].sort().join(""); // sort() without a function is OK here: they are letters
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}

groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]).map((g) => g.toSorted()).toSorted(); // result ==> [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]
groupAnagrams([""]); // result ==> [[""]]
groupAnagrams([]); // result ==> []
// uses: [...s] → 01 §13 · sort() without a function → 01 §11 · join → 01 §7 · Map has/get/set/values → 01 §14 · pattern: hash map → 02 §2
// note: LeetCode accepts these answers in any order, so the examples sort them first with toSorted() (a sorted COPY). On arrays of arrays it compares them as text: ["bat"] → "bat".
// note: O(n · L log L) time, L = word length

//--------------------------------------------------------------------
// Longest Consecutive Sequence (LC 128) - // Used to find the longest run like 1,2,3,4 without sorting. Trick: only start counting where n-1 is missing.

function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (set.has(n - 1)) continue; // not a start, someone earlier will count this sequence
    let len = 1;
    while (set.has(n + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}

longestConsecutive([100, 4, 200, 1, 3, 2]); // result ==> 4  (1,2,3,4)
longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]); // result ==> 9
longestConsecutive([]); // result ==> 0
longestConsecutive([1, 2, 0, 1]); // result ==> 3  (duplicates)
longestConsecutive([-1, -2, 5]); // result ==> 2  (negatives)
// uses: Set has → 01 §14 · continue / while → 01 §6 · Math.max → 01 §8
// note: O(n) time, O(n) space. Sorting first (O(n log n)) is also accepted.

//--------------------------------------------------------------------
// Top K Frequent Elements (LC 347) - // Used to get the k numbers that appear most. Trick: bucket[f] holds the numbers that appear f times; read from the end.

function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, f] of freq) buckets[f].push(num);
  const result = [];
  for (let f = buckets.length - 1; f >= 0 && result.length < k; f--) {
    for (const num of buckets[f]) {
      if (result.length < k) result.push(num);
    }
  }
  return result;
}

topKFrequent([1, 1, 1, 2, 2, 3], 2).toSorted((a, b) => a - b); // result ==> [1, 2]
topKFrequent([1], 1); // result ==> [1]
topKFrequent([-1, -1, 4, 4, 4, 7], 2).toSorted((a, b) => a - b); // result ==> [-1, 4]
// uses: counting with a Map → 01 §14 · Array.from({ length }) → 01 §9 · for...of with [num, f] → 01 §6, §13 · toSorted → 01 §10
// note: O(n) time. Also fine in an interview: [...freq].sort((a, b) => b[1] - a[1]).slice(0, k) → O(n log n)

// =====================================================================================
// §3 ── TWO POINTERS ──────────
// =====================================================================================
// Use it when the problem says: "sorted array", "pair/triplet that sums to X", "no duplicates in the result", "biggest area between two"

//--------------------------------------------------------------------
// Template: two pointers - // Used to search pairs in a sorted array. Trick: start at both ends and walk towards the middle.

//   let left = 0, right = arr.length - 1;
//   while (left < right) {
//     if (condition met) { save; left++; right--; }
//     else if (need more) left++;   // in a sorted array, moving left up makes the value bigger
//     else right--;
//   }

//--------------------------------------------------------------------
// 3Sum (LC 15) - // Used to find every unique triplet that adds up to 0. Trick: sort, fix one number, then two pointers for the other two.

function threeSum(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // same 1st number → same triplets. Skip.
    let left = i + 1, right = sorted.length - 1;
    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];
      if (sum === 0) {
        res.push([sorted[i], sorted[left], sorted[right]]);
        left++;
        right--;
        while (left < right && sorted[left] === sorted[left - 1]) left++; // skip duplicates of the 2nd number
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return res;
}

threeSum([-1, 0, 1, 2, -1, -4]); // result ==> [[-1, -1, 2], [-1, 0, 1]]
threeSum([0, 0, 0, 0]); // result ==> [[0,0,0]]  (duplicates → one triplet)
threeSum([0, 1, 1]); // result ==> []
threeSum([]); // result ==> []
// uses: [...nums].sort((a, b) => a - b) → 01 §11, §13 · continue / while → 01 §6 · pattern: two pointers → 02 §3
// note: any order is accepted; this version sorts first, so its answer always comes out in the same order.
// note: O(n²) time, O(1) extra space

//--------------------------------------------------------------------
// Container With Most Water (LC 11) - // Used to find the two walls that hold the most water. Trick: always move the shorter wall inwards.

function maxArea(height) {
  let left = 0, right = height.length - 1, best = 0;
  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    best = Math.max(best, area);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}

maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]); // result ==> 49
maxArea([1, 1]); // result ==> 1
maxArea([5]); // result ==> 0
// uses: Math.min / Math.max → 01 §8 · while → 01 §6 · pattern: two pointers → 02 §3
// note: moving the taller wall never helps: the width shrinks and the shorter wall still caps the height.
// note: O(n) time, O(1) space

// =====================================================================================
// §4 ── VARIABLE SLIDING WINDOW WITH MAP ──────────
// =====================================================================================
// Use it when the problem says: "contiguous substring/subarray", "longest/shortest", "without repeating", "at most k", "every anagram position"

//--------------------------------------------------------------------
// Template: sliding window - // Used for the best piece of a string/array that is all together. Trick: grow on the right, shrink on the left while it is broken.

//   const freq = new Map(); let left = 0, best = 0;
//   for (let right = 0; right < s.length; right++) {
//     add s[right] to freq;
//     while (window invalid) { remove s[left] from freq; left++; }
//     best = Math.max(best, right - left + 1);   // window size
//   }

//--------------------------------------------------------------------
// Longest Substring Without Repeating Characters (LC 3) - // Used to find the longest piece with no repeated letter. Trick: when a letter repeats, shrink from the left until it leaves.

function lengthOfLongestSubstring(s) {
  const freq = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) ?? 0) + 1);
    while (freq.get(s[right]) > 1) {
      // repeated: shrink until the duplicate leaves
      freq.set(s[left], freq.get(s[left]) - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

lengthOfLongestSubstring("abcabcbb"); // result ==> 3  ("abc")
lengthOfLongestSubstring("bbbbb"); // result ==> 1
lengthOfLongestSubstring("pwwkew"); // result ==> 3  ("wke")
lengthOfLongestSubstring(""); // result ==> 0
lengthOfLongestSubstring(" "); // result ==> 1  (a space is a character too)
lengthOfLongestSubstring("aA"); // result ==> 2  (uppercase ≠ lowercase)
// uses: Map get/set → 01 §14 · ?? → 01 §3 · s[i] → 01 §7 · Math.max → 01 §8 · pattern: sliding window → 02 §4
// note: O(n) time, O(alphabet) space

//--------------------------------------------------------------------
// Longest Repeating Character Replacement (LC 424) - // Used to find the longest piece of one letter if you may change k letters. Trick: window is fine while size - most common letter <= k.

function characterReplacement(s, k) {
  const freq = new Map();
  let left = 0, maxFreq = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) ?? 0) + 1);
    maxFreq = Math.max(maxFreq, freq.get(s[right]));
    // maxFreq does not need to drop when you shrink: only a BIGGER maxFreq improves the answer
    while (right - left + 1 - maxFreq > k) {
      freq.set(s[left], freq.get(s[left]) - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

characterReplacement("ABAB", 2); // result ==> 4
characterReplacement("AABABBA", 1); // result ==> 4
characterReplacement("A", 0); // result ==> 1
characterReplacement("", 2); // result ==> 0
// uses: Map get/set → 01 §14 · ?? → 01 §3 · Math.max → 01 §8 · pattern: sliding window → 02 §4
// note: O(n) time, O(26) space

//--------------------------------------------------------------------
// Find All Anagrams in a String (LC 438) - // Used to list every position where an anagram of p starts. Trick: a window of fixed size p.length and two 26-slot letter counts.

function findAnagrams(s, p) {
  if (p.length > s.length) return [];
  const idx = (ch) => ch.charCodeAt(0) - 97; // 'a' = 97
  const targetCount = new Array(26).fill(0), windowCount = new Array(26).fill(0);
  for (const ch of p) targetCount[idx(ch)]++;
  const res = [];
  for (let right = 0; right < s.length; right++) {
    windowCount[idx(s[right])]++;
    if (right >= p.length) windowCount[idx(s[right - p.length])]--; // the letter that left on the left
    if (right >= p.length - 1 && windowCount.join() === targetCount.join()) res.push(right - p.length + 1);
  }
  return res;
}

findAnagrams("cbaebabacd", "abc"); // result ==> [0, 6]  ("cba" and "bac")
findAnagrams("abab", "ab"); // result ==> [0, 1, 2]
findAnagrams("a", "ab"); // result ==> []
findAnagrams("", "a"); // result ==> []
// uses: charCodeAt → 01 §7 · new Array(26).fill(0) → 01 §9 · join to compare two arrays → 01 §7 · pattern: fixed window → 02 §4
// note: O(26 · n) = O(n) time, O(1) space

// =====================================================================================
// §5 ── MONOTONIC STACK + STACK ──────────
// =====================================================================================
// Use it when the problem says: "next greater/smaller", "how many days until", "first one to the right that...", "evaluate expression", "minimum in O(1)"

//--------------------------------------------------------------------
// Template: monotonic stack - // Used to find, for each item, the next bigger one. Trick: the stack keeps indices still waiting for their answer.

//   const stack = [];
//   for (let i = 0; i < arr.length; i++) {
//     while (stack.length && arr[i] > arr[stack.at(-1)]) {   // i is the answer for the top
//       const j = stack.pop(); answer[j] = ...i...;
//     }
//     stack.push(i);
//   }
// note: each index goes in and out once → O(n), even with the while inside the for.

//--------------------------------------------------------------------
// Daily Temperatures (LC 739) - // Used to say how many days until a warmer day. Trick: monotonic stack of days still waiting.

function dailyTemperatures(temps) {
  const res = new Array(temps.length).fill(0); // 0 = never gets warmer
  const stack = []; // indices of days still waiting for a warmer day
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack.at(-1)]) {
      const day = stack.pop();
      res[day] = i - day;
    }
    stack.push(i);
  }
  return res;
}

dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]); // result ==> [1,1,4,2,1,1,0,0]
dailyTemperatures([30, 30, 30]); // result ==> [0,0,0]  (equal is not "warmer")
dailyTemperatures([]); // result ==> []
// uses: new Array(n).fill(0) / push / pop → 01 §9 · at(-1) → 01 §10 · pattern: stack → 02 §7
// note: O(n) time, O(n) space

//--------------------------------------------------------------------
// Evaluate Reverse Polish Notation (LC 150) - // Used to compute ["2","1","+","3","*"] = (2+1)*3. Trick: number → push; operator → pop two, compute, push.

function evalRPN(tokens) {
  const stack = [];
  const ops = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => Math.trunc(a / b), // problem statement: division truncates toward zero
  };
  for (const t of tokens) {
    if (t in ops) {
      const b = stack.pop(), a = stack.pop(); // ORDER: the second one popped is the left operand
      stack.push(ops[t](a, b));
    } else stack.push(Number(t));
  }
  return stack[0];
}

evalRPN(["2", "1", "+", "3", "*"]); // result ==> 9
evalRPN(["4", "13", "5", "/", "+"]); // result ==> 6
evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]); // result ==> 22
evalRPN(["-7", "2", "/"]); // result ==> -3  (trunc, floor would give -4)
// uses: object lookup → 01 §5 · arrow functions → 01 §16 · "key" in obj → 01 §12 · Math.trunc / Number(text) → 01 §8 · pattern: stack → 02 §7
// note: O(n) time, O(n) space

//--------------------------------------------------------------------
// Min Stack (LC 155) - // Used for a stack that tells its minimum instantly. Trick: a 2nd stack keeps "the minimum so far" next to each value.

class MinStack {
  constructor() {
    this.values = [];
    this.mins = [];
  }
  push(x) {
    this.values.push(x);
    this.mins.push(Math.min(x, this.mins.at(-1) ?? Infinity));
  }
  pop() {
    this.values.pop();
    this.mins.pop();
  }
  top() {
    return this.values.at(-1);
  }
  getMin() {
    return this.mins.at(-1);
  }
}

const ms = new MinStack();
ms.push(-2); ms.push(0); ms.push(-3);
ms.getMin(); // result ==> -3
ms.pop();
ms.top(); // result ==> 0
ms.getMin(); // result ==> -2
// uses: class + constructor → 01 §19 · at(-1) → 01 §10 · ?? → 01 §3 · Infinity → 01 §8
// note: every operation O(1)

// =====================================================================================
// §6 ── ADVANCED BINARY SEARCH ──────────
// =====================================================================================
// Use it when the problem says: "sorted (but rotated)", "in O(log n)", "the smallest speed/capacity that can...", n up to 10^9

//--------------------------------------------------------------------
// Template: binary search on the answer - // Used to find the smallest x that works. Trick: if mid works, look lower; if not, look higher.

//   let lo = minPossible, hi = maxPossible;
//   while (lo < hi) {
//     const mid = Math.floor((lo + hi) / 2);
//     if (works(mid)) hi = mid;   // mid works; maybe there is a smaller one
//     else lo = mid + 1;          // mid fails; the answer is above
//   }
//   return lo;
// note: only works if "x works" means "x+1 also works".

//--------------------------------------------------------------------
// Search in Rotated Sorted Array (LC 33) - // Used to find a number in [4,5,6,7,0,1,2] fast. Trick: at each mid one half is sorted; check if the target is in that half.

function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      // left half [lo..mid] is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // right half [mid..hi] is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

searchRotated([4, 5, 6, 7, 0, 1, 2], 0); // result ==> 4
searchRotated([4, 5, 6, 7, 0, 1, 2], 3); // result ==> -1
searchRotated([1], 0); // result ==> -1
searchRotated([1], 1); // result ==> 0
searchRotated([3, 1], 1); // result ==> 1
searchRotated([1, 2, 3], 3); // result ==> 2  (not rotated)
searchRotated([], 5); // result ==> -1
// uses: Math.floor → 01 §8 · while → 01 §6 · pattern: binary search → 02 §6
// note: O(log n) time, O(1) space

//--------------------------------------------------------------------
// Koko Eating Bananas (LC 875) - // Used to find the slowest speed that eats every pile in h hours. Trick: binary search on the speed, from 1 to the biggest pile.

function minEatingSpeed(piles, h) {
  const hoursAt = (k) => piles.reduce((total, p) => total + Math.ceil(p / k), 0);
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hoursAt(mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

minEatingSpeed([3, 6, 7, 11], 8); // result ==> 4
minEatingSpeed([30, 11, 23, 4, 20], 5); // result ==> 30  (h = number of piles → biggest pile)
minEatingSpeed([30, 11, 23, 4, 20], 6); // result ==> 23
minEatingSpeed([1], 1); // result ==> 1
// uses: reduce → 01 §10 · Math.ceil / Math.max → 01 §8 · ...piles → 01 §13 · pattern: binary search → 02 §6
// note: O(n · log(maxPile)) time, O(1) space
// note: Math.max(...arr) blows up on huge arrays (>~100k). Use a for loop or reduce there.

// =====================================================================================
// §7 ── INTERVALS ──────────
// =====================================================================================
// Use it when the problem says: pairs [start, end], "overlapping", "merge", "meetings", "insert"

//--------------------------------------------------------------------
// Template: intervals - // Used to join intervals that touch. Trick: sort by start; they overlap if current.start <= last.end.

//   sort by start
//   overlap if: current.start <= last.end
//   merge:      last.end = Math.max(last.end, current.end)

//--------------------------------------------------------------------
// Merge Intervals (LC 56) - // Used to join every overlapping interval into one. Trick: sort by start, then grow the last one or add a new one.

function merge(intervals) {
  const sorted = intervals.map((x) => [...x]).sort((a, b) => a[0] - b[0]); // copy: does not mutate the input
  const res = [];
  for (const current of sorted) {
    const last = res.at(-1);
    if (last && current[0] <= last[1]) last[1] = Math.max(last[1], current[1]);
    else res.push(current);
  }
  return res;
}

merge([[1, 3], [2, 6], [8, 10], [15, 18]]); // result ==> [[1,6], [8,10], [15,18]]
merge([[1, 4], [4, 5]]); // result ==> [[1,5]]  (touching counts)
merge([[1, 4], [2, 3]]); // result ==> [[1,4]]  (one inside the other → Math.max matters)
merge([[4, 7], [1, 4]]); // result ==> [[1,7]]  (unsorted input)
merge([]); // result ==> []
// uses: map + [...x] copy → 01 §10, §13 · sort((a, b) => a[0] - b[0]) → 01 §11 · at(-1) → 01 §10
// note: O(n log n) time because of the sort, O(n) space

//--------------------------------------------------------------------
// Insert Interval (LC 57) - // Used to add one interval to a sorted list and keep it merged. Trick: 3 steps: copy the ones before, merge the overlapping, copy the rest.

function insert(intervals, newInterval) {
  const res = [];
  let i = 0;
  let [start, end] = newInterval;
  while (i < intervals.length && intervals[i][1] < start) res.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  res.push([start, end]);
  while (i < intervals.length) res.push(intervals[i++]);
  return res;
}

insert([[1, 3], [6, 9]], [2, 5]); // result ==> [[1,5], [6,9]]
insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]); // result ==> [[1,2], [3,10], [12,16]]
insert([], [5, 7]); // result ==> [[5,7]]
insert([[1, 5]], [6, 8]); // result ==> [[1,5], [6,8]]  (goes at the end)
insert([[3, 5]], [1, 2]); // result ==> [[1,2], [3,5]]  (goes at the start)
// uses: let [start, end] = … → 01 §13 · intervals[i++] → 01 §3 · while → 01 §6 · Math.min / Math.max → 01 §8
// note: O(n) time, O(n) space

// =====================================================================================
// §8 ── MATRIX / GRID (DFS and BFS) ──────────
// =====================================================================================
// Use it when the problem says: grid[][], "islands", "connected regions", "neighbours up/down/left/right", "fewest steps", "minutes until it spreads"

//--------------------------------------------------------------------
// Template: grid directions - // Used to visit the 4 neighbours of a cell. Trick: one DIRS list and a bounds check. DFS = everything connected; BFS = fewest steps.

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // down, up, right, left
//   for (const [dr, dc] of DIRS) {
//     const nr = r + dr, nc = c + dc;
//     if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;  // outside the grid
//     ...
//   }

//--------------------------------------------------------------------
// Number of Islands (LC 200) - // Used to count groups of "1" that touch. Trick: each new "1" is an island; sink all of it with DFS so you don't count it again.

function numIslands(grid) {
  const g = grid.map((row) => [...row]); // copy: we mark visited cells by writing "0"
  const rows = g.length, cols = g[0]?.length ?? 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || g[r][c] !== "1") return;
    g[r][c] = "0"; // mark BEFORE recursing, otherwise it bounces back forever
    for (const [dr, dc] of DIRS) sink(r + dr, c + dc);
  };
  let islands = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c] === "1") {
        islands++;
        sink(r, c);
      }
    }
  }
  return islands;
}

const islandGrid = [
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
];
numIslands(islandGrid); // result ==> 3
islandGrid[0][0]; // result ==> "1"  (the input was not changed)
numIslands([["0"]]); // result ==> 0
numIslands([["1"]]); // result ==> 1
numIslands([]); // result ==> 0
// uses: map + [...row] copy → 01 §10, §13 · ?. and ?? → 01 §3 · recursion → 01 §16 · loop in a matrix → 01 §6
// note: O(rows · cols) time and space (recursion in the worst case)

//--------------------------------------------------------------------
// Rotting Oranges (LC 994) - // Used to count the minutes until every orange is rotten (2 = rotten, 1 = fresh, 0 = empty). Trick: all rotten ones start in the queue; each queue level = 1 minute.

function orangesRotting(grid) {
  const g = grid.map((row) => [...row]);
  const rows = g.length, cols = g[0]?.length ?? 0;
  let queue = [], fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c] === 2) queue.push([r, c]);
      if (g[r][c] === 1) fresh++;
    }
  }
  let minutes = 0;
  while (queue.length && fresh > 0) {
    const next = []; // next level (avoids O(n) shift())
    for (const [r, c] of queue) {
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || g[nr][nc] !== 1) continue;
        g[nr][nc] = 2;
        fresh--;
        next.push([nr, nc]);
      }
    }
    queue = next;
    minutes++;
  }
  return fresh === 0 ? minutes : -1; // an unreachable fresh one is left → impossible
}

orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]); // result ==> 4
orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]); // result ==> -1
orangesRotting([[0, 2]]); // result ==> 0  (no fresh ones)
orangesRotting([[1]]); // result ==> -1  (fresh but nothing rotten)
// uses: loop in a matrix → 01 §6 · for...of with [r, c] → 01 §13 · continue → 01 §6 · ternary → 01 §3
// note: O(rows · cols) time and space

// =====================================================================================
// §9 ── GRAPHS ──────────
// =====================================================================================
// Use it when the problem says: "prerequisites", "dependencies", "edges" / pairs [a, b], "is it possible to finish?", "valid order", "cycle"

//--------------------------------------------------------------------
// Template: adjacency list - // Used to turn pairs [a, b] into "who are my neighbours". Trick: graph[node] = list of neighbours; walk it like the grid with a visited Set.

function buildGraph(n, edges) {
  const graph = Array.from({ length: n }, () => []); // graph[node] = neighbours
  for (const [a, b] of edges) graph[a].push(b); // directed. Undirected: also graph[b].push(a)
  return graph;
}

buildGraph(3, [[0, 1], [0, 2]]); // result ==> [[1,2], [], []]
// uses: Array.from({ length }, () => []) → 01 §9 · for...of with [a, b] → 01 §6, §13

//--------------------------------------------------------------------
// Course Schedule (LC 207) - // Used to know if you can take every course given the prerequisites. Trick: Kahn: start with courses that need nothing; if you take them all, there is no cycle.

function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    inDegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);
  let done = 0;
  for (let i = 0; i < queue.length; i++) {
    // queue[i] instead of shift(): O(1)
    done++;
    for (const nxt of graph[queue[i]]) {
      inDegree[nxt]--;
      if (inDegree[nxt] === 0) queue.push(nxt);
    }
  }
  return done === numCourses; // the final `queue` is a valid order (LC 210 Course Schedule II)
}

canFinish(2, [[1, 0]]); // result ==> true
canFinish(2, [[1, 0], [0, 1]]); // result ==> false  (cycle)
canFinish(1, []); // result ==> true
canFinish(4, [[1, 0], [2, 1], [3, 2], [1, 3]]); // result ==> false  (cycle 1→2→3→1)
canFinish(3, [[1, 0], [2, 0]]); // result ==> true
// uses: Array.from / fill(0) → 01 §9 · for → 01 §6 · ++ / -- → 01 §3 · pattern: queue read with an index instead of shift() → 01 §9
// note: inDegree[x] = how many prerequisites x still needs.
// note: O(V + E) time and space (nodes + edges)

// =====================================================================================
// §10 ── BACKTRACKING ──────────
// =====================================================================================
// Use it when the problem says: "all combinations / subsets / permutations", "generate all", "all the ways to...", small n (≤ 20)

//--------------------------------------------------------------------
// Template: backtracking - // Used to generate every possible choice. Trick: choose → explore → undo. Draw the decision tree on paper.

//   const res = [], current = [];
//   function bt(start) {
//     if (reached the end) { res.push([...current]); return; }   // COPY: [...current]
//     for (let i = start; i < n; i++) {
//       current.push(nums[i]);   // choose
//       bt(i + 1);               // explore
//       current.pop();           // undo (back to the previous state)
//     }
//   }

//--------------------------------------------------------------------
// Subsets (LC 78) - // Used to list every subset of the array. Trick: every node of the tree is a valid subset, so save it right on entry.

function subsets(nums) {
  const res = [], current = [];
  function bt(start) {
    res.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      bt(i + 1); // i + 1: no reuse and no going back (avoids [2,1] after [1,2])
      current.pop();
    }
  }
  bt(0);
  return res;
}

subsets([1, 2, 3]).map((s) => s.join()).toSorted(); // result ==> ["", "1", "1,2", "1,2,3", "1,3", "2", "2,3", "3"]  (8 subsets)
subsets([]); // result ==> [[]]
subsets([1, 2, 3, 4]).length; // result ==> 16  (2^4)
// uses: function inside a function → 01 §17 · recursion → 01 §16 · push / pop → 01 §9 · [...current] copy → 01 §13 · join / toSorted → 01 §7, §10
// note: any order is accepted, so the examples turn each answer into text with join() and sort the list with toSorted(): same answers → same result.
// note: O(n · 2^n) time, O(n) recursion

//--------------------------------------------------------------------
// Permutations (LC 46) - // Used to list every order of the numbers. Trick: try every index at each level and mark it in `used`.

function permute(nums) {
  const res = [], current = [], used = new Array(nums.length).fill(false);
  function bt() {
    if (current.length === nums.length) {
      res.push([...current]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(nums[i]);
      bt();
      current.pop();
      used[i] = false;
    }
  }
  bt();
  return res;
}

permute([1, 2, 3]).map((p) => p.join()).toSorted(); // result ==> ["1,2,3", "1,3,2", "2,1,3", "2,3,1", "3,1,2", "3,2,1"]  (6 permutations)
permute([1]); // result ==> [[1]]
// uses: recursion → 01 §16 · fill(false) / push / pop → 01 §9 · continue → 01 §6 · [...current] copy → 01 §13
// note: O(n · n!) time, O(n) space

//--------------------------------------------------------------------
// Combination Sum (LC 39) - // Used to find every combo that adds up to target, reusing numbers. Trick: call bt(i), not bt(i + 1), so the same number can repeat.

function combinationSum(candidates, target) {
  const res = [], current = [];
  function bt(start, remaining) {
    if (remaining === 0) {
      res.push([...current]);
      return;
    }
    if (remaining < 0) return; // overshot the target: prune this branch
    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      bt(i, remaining - candidates[i]); // i (not i+1): the same number can repeat
      current.pop();
    }
  }
  bt(0, target);
  return res;
}

combinationSum([2, 3, 6, 7], 7).map((c) => c.join()).toSorted(); // result ==> ["2,2,3", "7"]
combinationSum([2, 3, 5], 8).map((c) => c.join()).toSorted(); // result ==> ["2,2,2,2", "2,3,3", "3,5"]
combinationSum([2], 1); // result ==> []
// uses: recursion → 01 §16 · push / pop → 01 §9 · [...current] copy → 01 §13
// note: exponential time ~O(2^target), O(target) recursion

// =====================================================================================
// §11 ── HEAP (priority queue) ──────────
// =====================================================================================
// Use it when the problem says: "k-th largest/smallest", "the k most...", "always the current minimum", "merge k sorted lists", streaming data

//--------------------------------------------------------------------
// MinHeap - // Used to always get the smallest value fast. Trick: an array where the parent of i is at (i-1)/2 and the smallest sits at [0].

class MinHeap {
  constructor() {
    this.a = [];
  }
  get size() {
    return this.a.length;
  }
  peek() {
    return this.a[0];
  }
  push(x) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (a[parent] <= a[i]) break; // parent is already smaller: it is in place
      [a[parent], a[i]] = [a[i], a[parent]]; // move up
      i = parent;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last; // put the last one at the top and let it "sink"
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < a.length && a[l] < a[smallest]) smallest = l;
        if (r < a.length && a[r] < a[smallest]) smallest = r;
        if (smallest === i) break;
        [a[smallest], a[i]] = [a[i], a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

const testHeap = new MinHeap();
for (const x of [5, 3, 8, 1, 9, 1, -2]) testHeap.push(x);
testHeap.peek(); // result ==> -2
const out = [];
while (testHeap.size) out.push(testHeap.pop());
out; // result ==> [-2,1,1,3,5,8,9]  (always comes out sorted)
new MinHeap().pop(); // result ==> undefined
// uses: class + get → 01 §19 · swap with [a, b] = [b, a] → 01 §13 · Math.floor → 01 §8 · while (true) + break → 01 §6
// note: JS has no native heap. In an interview ask "can I assume a MinHeap?"; if not, this takes ~5 min.
// note: push/pop O(log n), peek O(1)

//--------------------------------------------------------------------
// Kth Largest Element in an Array (LC 215) - // Used to get the k-th biggest number. Trick: a MinHeap of at most k items; its top is the answer.

function findKthLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size > k) heap.pop(); // drop the smallest: it will never be the k-th largest
  }
  return heap.peek();
}
// also fine in an interview (say the complexity!): sort → O(n log n)
const kthLargestSort = (nums, k) => [...nums].sort((a, b) => b - a)[k - 1];

findKthLargest([3, 2, 1, 5, 6, 4], 2); // result ==> 5
findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4); // result ==> 4  (duplicates count)
findKthLargest([1], 1); // result ==> 1
findKthLargest([-1, -5, -3], 1); // result ==> -1
kthLargestSort([3, 2, 1, 5, 6, 4], 2); // result ==> 5
// uses: the MinHeap class above · for...of → 01 §6 · [...nums].sort((a, b) => b - a) → 01 §11, §13 · arrow → 01 §16
// note: O(n log k) time, O(k) space

// =====================================================================================
// §12 ── DYNAMIC PROGRAMMING ──────────
// =====================================================================================
// Use it when the problem says: "number of ways", "minimum/maximum of...", "is it possible...?", "no adjacent ones", "longest subsequence"

//--------------------------------------------------------------------
// Template: dynamic programming - // Used when each answer is built from smaller answers. Trick: answer 3 questions on the whiteboard, in words.

//   1. STATE:      what does dp[i] mean? e.g. "the most I can rob from houses 0..i"
//   2. TRANSITION: how do I get dp[i] from smaller ones? Think about the LAST decision.
//   3. BASE:       the small cases that need nothing. e.g. dp[0] = house[0]
// note: MEMO = recursion + Map (easier to think). TABLE = for loop filling dp (no recursion). Same result.

//--------------------------------------------------------------------
// House Robber (LC 198) - // Used to rob the most money without robbing two neighbours. Trick: at each house, either skip it (prev) or rob it (prevPrev + house).

// MEMO version
function robMemo(nums) {
  const memo = new Map();
  function bestUpTo(i) {
    if (i < 0) return 0; // base: no houses
    if (memo.has(i)) return memo.get(i);
    const r = Math.max(bestUpTo(i - 1), bestUpTo(i - 2) + nums[i]); // skip house i, or rob house i
    memo.set(i, r);
    return r;
  }
  return bestUpTo(nums.length - 1);
}
// TABLE version (you only need the last 2 → O(1) space)
function rob(nums) {
  let prevPrev = 0, prev = 0;
  for (const house of nums) {
    const current = Math.max(prev, prevPrev + house);
    prevPrev = prev;
    prev = current;
  }
  return prev;
}

for (const f of [rob, robMemo]) {
  f([1, 2, 3, 1]); // result ==> 4  (1 + 3)
  f([2, 7, 9, 3, 1]); // result ==> 12  (2 + 9 + 1)
  f([]); // result ==> 0
  f([5]); // result ==> 5
  f([2, 1, 1, 2]); // result ==> 4  (skips 2 houses in a row)
}
// uses: recursion → 01 §16 · Map as a memo → 01 §14, §17 · Math.max → 01 §8 · for...of → 01 §6
// note: O(n) time, O(1) space (memo: O(n))

//--------------------------------------------------------------------
// Coin Change (LC 322) - // Used to find the fewest coins that make `amount`. Trick: dp[v] = 1 + the smallest dp[v - coin]; dp[0] = 0.

function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let v = 1; v <= amount; v++) {
    for (const coin of coins) {
      if (coin <= v) dp[v] = Math.min(dp[v], dp[v - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

coinChange([1, 2, 5], 11); // result ==> 3  (5+5+1)
coinChange([2], 3); // result ==> -1
coinChange([1], 0); // result ==> 0
coinChange([1, 3, 4], 6); // result ==> 2  (3+3; greedy would give 4+1+1)
// uses: new Array(n).fill(Infinity) → 01 §9, §8 · nested for → 01 §6 · Math.min → 01 §8 · ternary → 01 §3
// note: greedy (biggest coin first) FAILS here.
// note: O(amount · coins) time, O(amount) space

//--------------------------------------------------------------------
// Longest Increasing Subsequence (LC 300) - // Used to find the longest rising sequence, gaps allowed. Trick: dp[i] = the longest one that ENDS at nums[i].

function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return Math.max(...dp); // the answer can end at any i
}

lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]); // result ==> 4  (2,3,7,101)
lengthOfLIS([0, 1, 0, 3, 2, 3]); // result ==> 4
lengthOfLIS([7, 7, 7, 7]); // result ==> 1  (equal values don't count)
lengthOfLIS([]); // result ==> 0
// uses: fill(1) → 01 §9 · nested for → 01 §6 · Math.max(...dp) → 01 §8, §13
// note: O(n²) time, O(n) space. An O(n log n) version exists; O(n²) is accepted.

//--------------------------------------------------------------------
// Longest Common Subsequence (LC 1143) - // Used to find the longest sequence two strings share. Trick: 2D table; same letter → diagonal + 1, else the best of up and left.

function longestCommonSubsequence(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1; // i-1 because dp is 1 larger
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

longestCommonSubsequence("abcde", "ace"); // result ==> 3  ("ace")
longestCommonSubsequence("abc", "abc"); // result ==> 3
longestCommonSubsequence("abc", "def"); // result ==> 0
longestCommonSubsequence("", "abc"); // result ==> 0
// uses: Array.from to build a matrix → 01 §9 · loop in a matrix → 01 §6 · s[i] → 01 §7 · Math.max → 01 §8
// note: the extra row/column of zeros = the "empty string" base case.
// note: O(n · m) time and space

//--------------------------------------------------------------------
// Unique Paths (LC 62) - // Used to count the paths of a robot that only moves right or down. Trick: paths to a cell = from above + from the left; 1st row and column = 1.

function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
  }
  return dp[m - 1][n - 1];
}

uniquePaths(3, 7); // result ==> 28
uniquePaths(3, 2); // result ==> 3
uniquePaths(1, 1); // result ==> 1
// uses: Array.from + fill(1) → 01 §9 · loop in a matrix → 01 §6
// note: O(m · n) time and space

// =====================================================================================
// §13 ── LINKED LISTS (medium) ──────────
// =====================================================================================
// Use it when the problem says: `head`, "remove the n-th node from the end", "in one pass", "digits in reverse order", "return the new head"

//--------------------------------------------------------------------
// Template: dummy node - // Used so you never need a special case for changing the head. Trick: start from a fake node before head and return dummy.next.

//   const dummy = new ListNode(0, head); ...work from dummy...; return dummy.next;
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
const toList = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = (head) => {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
};

//--------------------------------------------------------------------
// Remove Nth Node From End of List (LC 19) - // Used to delete the n-th node counting from the end, in one pass. Trick: two pointers n apart; when fast ends, slow is just before the target.

function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head); // if the target is the head, slow stays on dummy
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next; // n + 1 steps ahead
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next; // skip the target
  return dummy.next;
}

toArray(removeNthFromEnd(toList([1, 2, 3, 4, 5]), 2)); // result ==> [1,2,3,5]
toArray(removeNthFromEnd(toList([1]), 1)); // result ==> []
toArray(removeNthFromEnd(toList([1, 2]), 2)); // result ==> [2]  (removes the head)
toArray(removeNthFromEnd(toList([1, 2]), 1)); // result ==> [1]
// uses: class ListNode above → 01 §19 · for / while → 01 §6 · pattern: dummy node + two pointers → 02 §8
// note: O(n) time, O(1) space

//--------------------------------------------------------------------
// Add Two Numbers (LC 2) - // Used to add two numbers stored backwards in lists (342 → 2→4→3). Trick: add like at school, digit by digit, with a carry.

function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy, carry = 0;
  while (l1 || l2 || carry) {
    // `|| carry`: 5+5 = 10 needs an extra node at the end
    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
    carry = Math.floor(sum / 10);
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    l1 = l1?.next;
    l2 = l2?.next;
  }
  return dummy.next;
}

toArray(addTwoNumbers(toList([2, 4, 3]), toList([5, 6, 4]))); // result ==> [7,0,8]  (342 + 465 = 807)
toArray(addTwoNumbers(toList([0]), toList([0]))); // result ==> [0]
toArray(addTwoNumbers(toList([9, 9, 9, 9]), toList([9, 9]))); // result ==> [8,9,0,0,1]  (different lengths)
toArray(addTwoNumbers(toList([5]), toList([5]))); // result ==> [0,1]  (carry at the end)
// uses: ?. and ?? → 01 §3 · Math.floor → 01 §8 · % → 01 §3 · while → 01 §6 · pattern: dummy node → 02 §8
// note: O(max(n, m)) time and space

// =====================================================================================
// §14 ── TREES (medium) ──────────
// =====================================================================================
// Use it when the problem says: `root`, "valid BST", "common ancestor", "level by level", "right side view", "minimum depth"

//--------------------------------------------------------------------
// Template: tree DFS - // Used to compute something over the whole tree. Trick: info goes down as parameters and comes back up as the return value.

//   function dfs(node, infoFromAbove) {
//     if (!node) return baseValue;
//     const left = dfs(node.left, ...), right = dfs(node.right, ...);
//     return combine(node, left, right);
//   }
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
// helper: LeetCode-style array [3,9,20,null,null,15,7] → tree (filled level by level)
function toTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]), queue = [root];
  let i = 1;
  for (let f = 0; f < queue.length && i < arr.length; f++) {
    const node = queue[f];
    if (i < arr.length && arr[i] !== null) queue.push((node.left = new TreeNode(arr[i])));
    i++;
    if (i < arr.length && arr[i] !== null) queue.push((node.right = new TreeNode(arr[i])));
    i++;
  }
  return root;
}

//--------------------------------------------------------------------
// Validate Binary Search Tree (LC 98) - // Used to check every left value is smaller and every right value bigger. Trick: pass the allowed (min, max) down, not just compare with the children.

function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true;
  if (node.val <= min || node.val >= max) return false; // LeetCode BST: no equal values
  return isValidBST(node.left, min, node.val) && isValidBST(node.right, node.val, max);
}

isValidBST(toTree([2, 1, 3])); // result ==> true
isValidBST(toTree([5, 1, 4, null, null, 3, 6])); // result ==> false
isValidBST(toTree([5, 4, 6, null, null, 3, 7])); // result ==> false  (the 3 sits right of 5)
isValidBST(toTree([2, 2, 2])); // result ==> false  (equal values)
isValidBST(null); // result ==> true
isValidBST(toTree([-2147483648])); // result ==> true  (that's why -Infinity, not a number)
// uses: default parameters / recursion → 01 §16 · -Infinity / Infinity → 01 §8 · && → 01 §3 · pattern: tree recursion → 02 §9
// note: checking only the direct children is the classic trap.
// note: O(n) time, O(height) space

//--------------------------------------------------------------------
// Lowest Common Ancestor of a Binary Tree (LC 236) - // Used to find the lowest node that has both p and q below it. Trick: if left AND right both found something, this node is the answer.

function lowestCommonAncestor(node, p, q) {
  if (!node || node === p || node === q) return node;
  const left = lowestCommonAncestor(node.left, p, q);
  const right = lowestCommonAncestor(node.right, p, q);
  if (left && right) return node;
  return left ?? right;
}

const lcaRoot = toTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
const findNode = (node, val) => (!node ? null : node.val === val ? node : findNode(node.left, val) ?? findNode(node.right, val));
lowestCommonAncestor(lcaRoot, findNode(lcaRoot, 5), findNode(lcaRoot, 1)).val; // result ==> 3
lowestCommonAncestor(lcaRoot, findNode(lcaRoot, 5), findNode(lcaRoot, 4)).val; // result ==> 5  (one is above the other)
lowestCommonAncestor(lcaRoot, findNode(lcaRoot, 7), findNode(lcaRoot, 8)).val; // result ==> 3
// uses: recursion → 01 §16 · && and ?? → 01 §3 · === → 01 §3 · pattern: tree recursion → 02 §9
// note: O(n) time, O(height) space

//--------------------------------------------------------------------
// Binary Tree Level Order Traversal (LC 102) - // Used to read the tree one level at a time. Trick: BFS where each round of the queue is one level.

function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  let queue = [root];
  while (queue.length) {
    levels.push(queue.map((n) => n.val));
    const next = [];
    for (const n of queue) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    queue = next;
  }
  return levels;
}

levelOrder(toTree([3, 9, 20, null, null, 15, 7])); // result ==> [[3], [9,20], [15,7]]
levelOrder(toTree([1])); // result ==> [[1]]
levelOrder(null); // result ==> []
levelOrder(toTree([1, 2, null, 3])); // result ==> [[1], [2], [3]]  (lopsided tree)
// uses: map → 01 §10 · for...of / while → 01 §6 · pattern: level order (BFS) → 02 §9
// note: same code solves LC 199 Right Side View (last of each level) and LC 103 Zigzag (reverse odd levels).
// note: O(n) time, O(n) space

// =====================================================================================
// §15 ── FINAL TABLE: SIGNAL IN THE PROBLEM → PATTERN ──────────
// =====================================================================================
/*
  SIGNAL IN THE PROBLEM                                → PATTERN                         §
  ---------------------------------------------------------------------------------------------
  "subarray with sum K" (with negatives)               → prefix sum + Map                 §2
  "group", "anagrams", "count", "seen it before?"      → Map / Set                        §2
  "k most frequent"                                    → Map + bucket sort (or sort)      §2
  "sorted", "pair/triplet with sum X"                  → two pointers                     §3
  "longest/shortest contiguous substring/subarray"     → sliding window                   §4
  "all positions of an anagram/permutation"            → FIXED window + counting          §4
  "next greater/smaller", "how many days until"        → monotonic stack                  §5
  "parentheses", "expression", "undo"                  → stack                            §5
  "O(log n)", "sorted but rotated"                     → binary search                    §6
  "smallest speed/capacity that can"                   → binary search on the answer      §6
  "intervals", "meetings", "overlapping"               → sort by start + merge            §7
  "grid", "islands", "regions"                         → DFS on the grid                  §8
  "fewest steps", "minutes until it spreads"           → BFS (multi-source)               §8
  "prerequisites", "dependencies", "valid order"       → graph + Kahn (topological)       §9
  "all combinations/subsets/permutations"              → backtracking                     §10
  "k-th largest", "top k", "always the minimum"        → heap (or sort)                   §11
  "number of ways", "min/max of...", "is it possible?" → dynamic programming              §12
  "remove from the end", "in one pass" (list)          → dummy + two pointers             §13
  "valid BST", "common ancestor", "by levels"          → DFS with bounds / BFS            §14

  What n allows (≈ 10^8 simple steps per second):
    n ≤ 12         → O(n!)       permutations
    n ≤ 20         → O(2^n)      subsets / backtracking
    n ≤ 500        → O(n³)
    n ≤ 10^4       → O(n²)       two for loops, 2D DP
    n ≤ 10^6       → O(n log n)  sort, heap, binary search in a loop
    n ≤ 10^8       → O(n)        one loop, Map, two pointers, window
    bigger         → O(log n) or O(1)
  e.g. "nums.length <= 10^5" → they want O(n) or O(n log n); two for loops will time out.

  Hidden O(n) costs in JS: shift, unshift, includes, indexOf, splice, slice, [...arr], join, str + str in a loop.
  sort → O(n log n). Map/Set get/has/set/add/delete → O(1).
*/

// =====================================================================================
// §16 ── 7-DAY PLAN ──────────
// =====================================================================================
/*
  How to practise:
    - 25 min alone per problem. Stuck? Read only the "Use it when" line and the template. 10 more min.
    - Still stuck → read the solution, close it, rewrite it from memory. That counts.
    - Talk out loud while you write.
    - After each problem: say the complexity and write 2 edge cases.
    - "Review" = rewrite from scratch, without looking, a problem from an earlier day.

  DAY 1 — Hash map (the most important one for strings/arrays)
    49 Group Anagrams · 347 Top K Frequent · 128 Longest Consecutive Sequence
    + easy warm-up: 1 Two Sum, 242 Valid Anagram
  DAY 2 — Prefix sum + two pointers
    560 Subarray Sum Equals K · 15 3Sum · 11 Container With Most Water
    + review: 49
  DAY 3 — Sliding window (strings!)
    3 Longest Substring Without Repeating · 424 Longest Repeating Char Replacement · 438 Find All Anagrams
    + review: 560, 15
  DAY 4 — Stack + binary search + intervals
    739 Daily Temperatures · 155 Min Stack · 33 Search in Rotated Sorted Array · 56 Merge Intervals
    + review: 3
  DAY 5 — Grid, graphs, lists and trees
    200 Number of Islands · 207 Course Schedule · 19 Remove Nth From End · 102 Level Order
    + review: 438, 56
  DAY 6 — DP + backtracking + heap
    198 House Robber · 322 Coin Change · 78 Subsets · 215 Kth Largest (with sort first, then heap)
    + review: 347, 739
  DAY 7 — Mock interview (without looking at this file)
    Pick 2 you haven't done yet: 238 Product of Array Except Self, 5 Longest Palindromic Substring
    (or 875 Koko, 57 Insert Interval, 994 Rotting Oranges, 98 Validate BST).
    45 min each, out loud, with the §1 checklist. Then redo the ones you failed on days 1–6.
    The night before: reread only §1 and §15. Sleep.

  Only time for 10: 49, 347, 560, 15, 3, 438, 56, 739, 200, 322.
*/

console.log("✅ Medium OK");
