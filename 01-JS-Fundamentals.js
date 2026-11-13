// =============================================================================
// 01 — JAVASCRIPT FUNDAMENTALS (a cheat sheet that runs and checks itself)
// Run:  node 01-JS-Fundamentals.js   → must end with "✅ Fundamentals OK"
// Tested on Node 26. Check every "// result ==>": node check-results.js 01-JS-Fundamentals.js
// Search: Ctrl+F "§7" jumps to section 7.
// =============================================================================
//
// INDEX (Ctrl+F "§N")
//   §1  Variables (let/const/var, hoisting, TDZ)
//   §2  Types and conversions
//   §3  Operators (== vs ===, ??, ?., logical, assignment)
//   §4  Truthy / Falsy
//   §5  Conditionals (if, switch, ternary, lookup)
//   §6  Loops (for, while, for...of, for...in, break/continue)
//   §7  Strings
//   §8  Numbers and Math
//   §9  Arrays — basics and methods that CHANGE the original
//   §10 Arrays — methods that do NOT change it (map, filter, reduce…)
//   §11 Sorting (sort / toSorted)
//   §12 Objects (+ JSON)
//   §13 Destructuring, spread, rest
//   §14 Map, Set, WeakMap
//   §15 Copies: shallow vs deep
//   §16 Functions (declaration, expression, arrow, callbacks)
//   §17 Closures
//   §18 this, call/apply/bind
//   §19 Classes and prototypes
//   §20 Errors (try/catch/finally, throw)
//   §21 Dates
//   §22 Regex
//   §23 Promises and async/await
//   §24 Event loop (microtask vs macrotask)
//   §25 Timers (setTimeout, setInterval)
//   §26 Modules (import/export vs require)
//   §27 Data structures → see 02-LeetCode-Easy.js
// =============================================================================

"use strict"; // same behaviour as classes and ES modules (see §18)
const assert = require("node:assert/strict"); // only for the examples that throw an error

// §1 ── VARIABLES ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// const - // Used to store a value you will not give a new one to. Use it by default.

const list = [1, 2];
list.push(3); // allowed: you change what is inside, not the variable
list; // result ==> [1, 2, 3]
assert.throws(() => {
  const x = 1;
  x = 2; // giving a const a new value
}, TypeError); // note: throws TypeError
// note: const does not freeze the value, it only stops you reassigning the variable.

//--------------------------------------------------------------------
// let - // Used to store a value you will change later. It only lives inside its { }.

{
  var escapes = "var";
  let trapped = "let";
}
typeof trapped; // result ==> "undefined"  (it does not exist out here)

//--------------------------------------------------------------------
// var - // The old way. Avoid it: it escapes the { } and lives in the whole function.

escapes; // result ==> "var"

//--------------------------------------------------------------------
// Hoisting - // Shows that a declaration "moves up" to the top of its function.

function hoistingVar() {
  const before = v; // v already exists, but has no value yet
  var v = 10;
  return before;
}
hoistingVar(); // result ==> undefined

//--------------------------------------------------------------------
// TDZ - // Shows that let/const exist before their line but crash if you touch them.

assert.throws(() => {
  y; // ReferenceError
  let y = 1;
}, ReferenceError); // note: throws ReferenceError
// note: TDZ = "Temporal Dead Zone", the lines before the let/const.

//--------------------------------------------------------------------
// Declare vs assign - // Declare creates the box, assign puts a value in it.

let name; // declare → it is undefined
name = "Tiago"; // assign
name; // result ==> "Tiago"

// §2 ── TYPES ──────────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// typeof value - // Used to get the type of a value as text.

typeof "hello"; // result ==> "string"
typeof 42; // result ==> "number"
typeof 42n; // result ==> "bigint"
typeof true; // result ==> "boolean"
typeof undefined; // result ==> "undefined"
typeof Symbol("id"); // result ==> "symbol"
typeof function () {}; // result ==> "function"
typeof null; // result ==> "object"  (an old bug: null is NOT an object)
typeof []; // result ==> "object"  (arrays too)
// note: 7 primitives (string, number, bigint, boolean, undefined, null, symbol), the rest are objects.
// note: undefined = "no value yet"; null = "empty on purpose".

//--------------------------------------------------------------------
// Array.isArray(value) - // Checks if a value is an array (typeof can't tell you).

Array.isArray([]); // result ==> true

//--------------------------------------------------------------------
// Value vs reference - // Shows that primitives are copied, but objects are shared.

let p1 = 5;
let p2 = p1;
p2++;
p1; // result ==> 5  (independent copy)
const o1 = { n: 5 };
const o2 = o1; // same object, two names
o2.n++;
o1.n; // result ==> 6

//--------------------------------------------------------------------
// Number(value) / String(value) / Boolean(value) - // Used to turn a value into another type on purpose.

Number("17031987"); // result ==> 17031987
String(17031987); // result ==> "17031987"
(255).toString(16); // result ==> "ff"  (number → text in base 16)
Boolean("text"); // result ==> true  (see §4)

//--------------------------------------------------------------------
// Automatic conversion - // Shows the traps when JS converts types for you.

"5" + 1; // result ==> "51"  (+ with text glues)
"5" - 1; // result ==> 4  (- * / turn it into a number)
+"3"; // result ==> 3  (+ in front turns it into a number)
[] + []; // result ==> ""
// note: prefer Number()/String() over these surprises.

// §3 ── OPERATORS ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// % - // Used to get the REMAINDER of a division (12 = 5*2 + 2).

12 % 5; // result ==> 2
5 % 12; // result ==> 5  (12 fits 0 times in 5)
10 % 2 === 0; // result ==> true  (even number test)
-7 % 3; // result ==> -1
((-7 % 3) + 3) % 3; // result ==> 2  (always positive)
// note: the remainder keeps the sign of the left number.
// note: 7 / 2 gives 3.5 — no integer division, use Math.trunc. 2 ** 10 gives 1024.

//--------------------------------------------------------------------
// ++ / -- - // Used to add or remove 1. x++ gives the old value, ++x the new one.

let c = 1;
c++; // result ==> 1  (and now c = 2)
++c; // result ==> 3

//--------------------------------------------------------------------
// ||= / ??= - // Used to give a variable a value only if it is "empty".

let hits = 0;
hits ||= 10; // 0 is falsy → it assigns
let hits2 = 0;
hits2 ??= 10; // 0 is not null/undefined → it keeps 0
hits; // result ==> 10
hits2; // result ==> 0
// note: x += y is x = x + y (same for -= *= /= %= **=); x &&= y assigns only if x is truthy.

//--------------------------------------------------------------------
// === vs == - // Used to compare. Always use === (and !==): it checks value AND type.

0 === "0"; // result ==> false
0 == "0"; // result ==> true  (== converts the types first)
null == undefined; // result ==> true  (the only useful case for ==)
null === undefined; // result ==> false
[1] === [1]; // result ==> false  (objects compare by reference)

//--------------------------------------------------------------------
// Object.is(a, b) - // Checks if two values are the same, even NaN.

NaN === NaN; // result ==> false  (NaN never equals anything)
Object.is(NaN, NaN); // result ==> true

//--------------------------------------------------------------------
// < > <= >= - // Used to compare. Text is compared letter by letter by its code.

"a" < "b"; // result ==> true
"Z" < "a"; // result ==> true  (uppercase comes first)
"10" < "9"; // result ==> true  (two texts: "1" < "9")

//--------------------------------------------------------------------
// && || ! - // Used to combine conditions. They give back one of the values, not always true/false.

"a" || "b"; // result ==> "a"  (first truthy one)
"" || "default"; // result ==> "default"
"a" && "b"; // result ==> "b"  (if a is truthy, gives b)
!!"x"; // result ==> true  (!! turns anything into a boolean)
false || 4 > 2; // result ==> true
true && 4 > 2; // result ==> true

//--------------------------------------------------------------------
// ?? - // Used to give a default value ONLY when the left side is null or undefined.

null ?? 5; // result ==> 5
0 ?? 5; // result ==> 0
0 || 5; // result ==> 5
// note: || also replaces 0, "" and false; ?? does not.

//--------------------------------------------------------------------
// ?. - // Used to read something that may not exist, without crashing.

const user = { profile: { name: "Ana" }, speak: () => "hello" };
user.profile?.name; // result ==> "Ana"
user.address?.street; // result ==> undefined  (no TypeError)
user.fly?.(); // result ==> undefined  (a method that may not exist)
user.address?.street ?? "no street"; // result ==> "no street"  (classic combo)

//--------------------------------------------------------------------
// condition ? a : b - // Used as a short if/else that gives back a value.

const age = 20;
age >= 18 ? "adult" : "minor"; // result ==> "adult"

// §4 ── TRUTHY / FALSY ────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Falsy - // Shows the ONLY 8 values that count as false inside an if.

const falsy = [false, 0, -0, 0n, "", null, undefined, NaN];
falsy.every((v) => !v); // result ==> true

//--------------------------------------------------------------------
// Truthy - // Shows that everything else counts as true, even "0", [] and {}.

const truthy = ["0", "false", " ", [], {}, () => {}, -1, Infinity];
truthy.every((v) => !!v); // result ==> true
// note: an empty array is truthy, test it with arr.length === 0.
// note: if (n) fails for n = 0; if 0 is valid use n !== undefined or n ?? x.

// §5 ── CONDITIONALS ──────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// if / else - // Used to pick a path depending on a condition.

function weatherIf(sky) {
  if (sky === "blue") {
    return "Nice weather";
  } else if (sky === "dark") {
    return "It might rain";
  } else {
    return "I did not check the forecast";
  }
}
weatherIf("dark"); // result ==> "It might rain"

//--------------------------------------------------------------------
// switch - // Used to compare ONE value against many cases (with ===).

function weatherSwitch(sky) {
  switch (sky) {
    case "blue":
      return "Nice weather";
    case "dark":
    case "grey": // two cases, same result
      return "It might rain";
    default:
      return "I did not check the forecast";
  }
}
weatherSwitch("grey"); // result ==> "It might rain"
// note: without break (or return) it falls into the next case.

//--------------------------------------------------------------------
// Object lookup - // Used instead of switch when you only turn a value into a result.

const weathers = { blue: "Nice weather", dark: "It might rain" };
weathers["blue"] ?? "I did not check the forecast"; // result ==> "Nice weather"

//--------------------------------------------------------------------
// Early return - // Used to handle special cases first, so you avoid ifs inside ifs.

function divide(a, b) {
  if (b === 0) return null;
  return a / b;
}
divide(1, 0); // result ==> null

// §6 ── LOOPS ─────────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// for - // Used to repeat when you need the index (start; stop; step).

const out = [];
for (let i = 1; i <= 3; i++) out.push(i);
out; // result ==> [1, 2, 3]

//--------------------------------------------------------------------
// while - // Used to repeat when you don't know how many times.

let counter = 1;
const outWhile = [];
while (counter <= 3) {
  outWhile.push(counter);
  counter += 1; // forget this = infinite loop
}
outWhile; // result ==> [1, 2, 3]

//--------------------------------------------------------------------
// do...while - // Used to repeat, but it always runs at least once.

let k = 10;
do {
  k++;
} while (k < 5); // false from the start, but it ran once
k; // result ==> 11

//--------------------------------------------------------------------
// for...of - // Used to walk the VALUES of an array, string, Map or Set. The most used.

const chars = [];
for (const ch of "abc") chars.push(ch);
chars; // result ==> ["a", "b", "c"]
// note: for...in gives the KEYS of an object (see §12), never use it on arrays.

//--------------------------------------------------------------------
// for...of + entries() - // Used to get the index AND the value in a for...of.

const pairs = [];
for (const [i, v] of ["x", "y"].entries()) pairs.push(`${i}:${v}`);
pairs; // result ==> ["0:x", "1:y"]

//--------------------------------------------------------------------
// break / continue - // break leaves the loop; continue jumps to the next round.

const odds = [];
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  if (i > 5) break;
  odds.push(i);
}
odds; // result ==> [1, 3, 5]
// note: arr.forEach cannot break (see §10).

//--------------------------------------------------------------------
// Loop in a matrix - // Used to walk a 2D array: i = row, j = column → m[i][j].

const matrix = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const positions = [];
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    positions.push(`[${i},${j}]=${matrix[i][j]}`);
  }
}
positions[3]; // result ==> "[1,1]=4"

//--------------------------------------------------------------------
// Label - // Used to break the OUTER loop from inside the inner one.

let found = null;
outer: for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    if (matrix[i][j] === 4) {
      found = [i, j];
      break outer;
    }
  }
}
found; // result ==> [1, 1]

// §7 ── STRINGS ───────────────────────────────────────────────────────────────
// note: no string method changes the original; they all give back a NEW string.

//--------------------------------------------------------------------
// length - // Used to count the letters. It is a property, so no ().

const word = "Tiago";
word.length; // result ==> 5

//--------------------------------------------------------------------
// s[index] / at(index) - // Used to get the letter at an index. at() also takes negatives.

word[2]; // result ==> "a"
word.at(-1); // result ==> "o"  (last letter)
word[99]; // result ==> undefined

//--------------------------------------------------------------------
// charAt(index) - // Used to get the letter at the index you put inside ().

word.charAt(2); // result ==> "a"
// note: if the index doesn't exist you get "" (empty string).

//--------------------------------------------------------------------
// indexOf("text") / lastIndexOf("text") - // Used to find where a piece of text starts.

"Adelia".indexOf("lia"); // result ==> 3
"Adelia".indexOf("z"); // result ==> -1  (not found)
"banana".lastIndexOf("a"); // result ==> 5  (searches from the end)

//--------------------------------------------------------------------
// includes("text", startIndex) - // Checks if a text is inside the string (optional: index to start from).

"Otorhinolaryngologist".includes("ary", 3); // result ==> true

//--------------------------------------------------------------------
// startsWith("text") / endsWith("text") - // Checks if the string starts or ends with a text.

"file.js".startsWith("file"); // result ==> true
"file.js".endsWith(".js"); // result ==> true

//--------------------------------------------------------------------
// slice(start, end) - // Used to cut a piece of the string. The end is NOT included.

const sentence = "I really cannot think of a sentence now...";
sentence.slice(16, 35); // result ==> "think of a sentence"
"We are cool".slice(0, 2); // result ==> "We"  (indexes 0 and 1)
"We are cool".slice(1); // result ==> "e are cool"  (no end → to the end)
sentence.slice(-5, -1); // result ==> "ow.."  (negatives count from the end)

//--------------------------------------------------------------------
// substring(start, end) - // Same as slice, but negative numbers become 0.

"Tiago".substring(0, 2); // result ==> "Ti"
"Tiago".substring(-3); // result ==> "Tiago"
// note: prefer slice().

//--------------------------------------------------------------------
// Capitalise - // Turns the first letter into uppercase.

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
cap("tiago"); // result ==> "Tiago"

//--------------------------------------------------------------------
// toUpperCase() / toLowerCase() - // Turns the whole string into uppercase or lowercase.

"Lisbon".toUpperCase(); // result ==> "LISBON"
"Lisbon".toLowerCase(); // result ==> "lisbon"

//--------------------------------------------------------------------
// trim() - // Used to remove the spaces at both ends.

"  hello  ".trim(); // result ==> "hello"
// note: trimStart() / trimEnd() remove only one side.

//--------------------------------------------------------------------
// padStart(length, "fill") - // Used to fill the left side until the string has n letters.

"7".padStart(3, "0"); // result ==> "007"

//--------------------------------------------------------------------
// repeat(n) - // Used to repeat the string n times.

"Awesome!".repeat(2); // result ==> "Awesome!Awesome!"

//--------------------------------------------------------------------
// replace("what goes out", "what comes in") - // Used to swap ONLY THE FIRST match of a text for another.

"a-b-c".replace("-", "+"); // result ==> "a+b-c"
"a-b-c".replace(/-/g, "+"); // result ==> "a+b+c"  (with a regex /g it swaps them all)

//--------------------------------------------------------------------
// replaceAll("what goes out", "what comes in") - // Used to swap EVERY match of a text for another.

"dirty room".replaceAll(" ", ""); // result ==> "dirtyroom"
// note: replace() (without All) only swaps the first one.

//--------------------------------------------------------------------
// split("separator") - // Turns a string into an array.

"I love JS".split(" "); // result ==> ["I", "love", "JS"]
"abc".split(""); // result ==> ["a", "b", "c"]

//--------------------------------------------------------------------
// join("separator") - // Turns an array into a string.

["I", "will", "join"].join(" "); // result ==> "I will join"
["a", "b"].join(); // result ==> "a,b"
// note: with no separator it uses ",".

//--------------------------------------------------------------------
// Reverse a string - // Used in the classic interview question (and palindromes).

[..."abc"].reverse().join(""); // result ==> "cba"
const isPal = (s) => s === [...s].reverse().join("");
isPal("racecar"); // result ==> true

//--------------------------------------------------------------------
// charCodeAt(index) / String.fromCharCode(code) - // Used to turn a letter into its number code and back.

"c".charCodeAt(0) - "a".charCodeAt(0); // result ==> 2  (letter position 0..25, good for LeetCode)
String.fromCharCode(97); // result ==> "a"
// note: to sort text use localeCompare (see §11).

//--------------------------------------------------------------------
// Template literals - // Used to put values inside text with backticks ` ` and ${ }.

const n = 3;
`I have ${n * 2} apples`; // result ==> "I have 6 apples"
// note: backticks also allow text over several lines.

//--------------------------------------------------------------------
// Strings can't change - // Shows that writing to an index fails.

assert.throws(() => {
  "use strict"; // repeated here so check-results.js (which adds a line on top) keeps strict mode
  const s = "abc";
  s[0] = "X";
}, TypeError); // note: throws TypeError (in strict mode)

// §8 ── NUMBERS AND MATH ──────────────────────────────────────────────────────

//--------------------------------------------------------------------
// toFixed(decimals) - // Used to round a number to the number of decimals inside ().

const x1 = 1987.8534;
x1.toFixed(1); // result ==> "1987.9"
(45).toFixed(2); // result ==> "45.00"
Number(x1.toFixed(1)); // result ==> 1987.9  (back to a number)
// note: it gives back TEXT, not a number.

//--------------------------------------------------------------------
// Number.isInteger(value) - // Checks if a number has no decimals.

Number.isInteger(x1); // result ==> false
Number.isInteger(5.0); // result ==> true

//--------------------------------------------------------------------
// Math.floor(n) / Math.ceil(n) - // Used to round down / up.

Math.floor(1.7); // result ==> 1
Math.ceil(1.2); // result ==> 2
Math.floor(-1.2); // result ==> -2
// note: floor is NOT "drop the decimals" for negatives, use trunc.

//--------------------------------------------------------------------
// Math.trunc(n) - // Used to cut the decimals off.

Math.trunc(-1.2); // result ==> -1
Math.trunc(7 / 2); // result ==> 3  (integer division)

//--------------------------------------------------------------------
// Math.round(n) - // Used to round to the nearest number (.5 goes up).

Math.round(14.5); // result ==> 15
Math.round(-14.5); // result ==> -14  (.5 always goes towards +∞)

//--------------------------------------------------------------------
// parseInt(text, base) - // Used to read a whole number from the start of a text.

parseInt("12px", 10); // result ==> 12  (stops at the junk)
parseInt("101", 2); // result ==> 5  (binary → decimal)
parseInt("ff", 16); // result ==> 255
["1", "2", "3"].map(parseInt); // result ==> [1, NaN, NaN]
["1", "2", "3"].map(Number); // result ==> [1, 2, 3]  (✔)
// note: always pass the base; map(parseInt) passes the INDEX as the base.

//--------------------------------------------------------------------
// Number(text) - // Used to turn ALL the text into a number, or NaN.

Number("12px"); // result ==> NaN  (all or nothing)
Number(""); // result ==> 0
// note: an empty string becomes 0, watch out.

//--------------------------------------------------------------------
// parseFloat(text) - // Used to read a decimal number from the start of a text.

parseFloat("3.14abc"); // result ==> 3.14

//--------------------------------------------------------------------
// toString(base) - // Turns a number into text in another base (2 binary, 16 hex).

(5).toString(2); // result ==> "101"
(10).toString(16).padStart(2, "0"); // result ==> "0a"
const rgb = (r, g, b) =>
  [r, g, b]
    .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
rgb(300, 255, 0); // result ==> "FFFF00"  (rgb → hex)

//--------------------------------------------------------------------
// Number.isNaN(value) - // Checks if a value is really NaN ("Not a Number").

typeof NaN; // result ==> "number"  (yes, really)
Number.isNaN(0 / 0); // result ==> true
Number.isNaN("abc"); // result ==> false  (✔)
isNaN("abc"); // result ==> true  (the global isNaN converts first)
1 / 0; // result ==> Infinity

//--------------------------------------------------------------------
// Decimals are not exact - // Shows that 0.1 + 0.2 is not 0.3.

0.1 + 0.2 === 0.3; // result ==> false
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // result ==> true  (compare like this)
(1.005).toFixed(2); // result ==> "1.00"  (1.005 is stored as 1.00499…)
// note: for money, work in cents (whole numbers).

//--------------------------------------------------------------------
// BigInt(n) / 10n - // Used for whole numbers bigger than 2^53 - 1. Add n at the end.

Number.MAX_SAFE_INTEGER; // result ==> 9007199254740991  (2 ** 53 - 1)
2 ** 53 + 1 === 2 ** 53; // result ==> true  (lost precision)
2n ** 64n; // result ==> 18446744073709551616n
BigInt(10) + 1n; // result ==> 11n
7n / 2n; // result ==> 3n  (drops the decimals)
assert.throws(() => 1n + 1, TypeError); // you can't mix bigint and number

//--------------------------------------------------------------------
// Math.max(...numbers) / Math.min(...numbers) - // Used to get the biggest / smallest number.

const nums = [3, 9, 1];
Math.max(...nums); // result ==> 9
Math.min(...nums); // result ==> 1
Math.max(); // result ==> -Infinity  (no numbers)
nums.reduce((a, b) => Math.min(a, b)); // result ==> 1  (for huge arrays: spread has a limit)

//--------------------------------------------------------------------
// Math.random() - // Gives a random number from 0 up to 1 (1 never comes out).

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const rolls = Array.from({ length: 100 }, () => randInt(1, 10));
rolls.every((r) => Number.isInteger(r) && r >= 1 && r <= 10); // result ==> true  (1..10, both included)
// note: random decimal from min to max: Math.random() * (max - min) + min.

//--------------------------------------------------------------------
// Math.sqrt(n) / abs(n) / hypot(a, b) / sign(n) / cbrt(n) - // Used for everyday maths.

Math.sqrt(16); // result ==> 4
Math.abs(-3); // result ==> 3
Math.hypot(3, 4); // result ==> 5
Math.sign(-5); // result ==> -1
Math.cbrt(27); // result ==> 3

// §9 ── ARRAYS: BASICS + METHODS THAT CHANGE IT ───────────────────────────────
// note: everything here changes the ORIGINAL array.

//--------------------------------------------------------------------
// push(item) / unshift(item) - // Used to add items at the end / at the start. Gives the new length.

const names = ["david", "costa"];
names.push("pereira"); // result ==> 3
names.unshift("tiago");
names; // result ==> ["tiago", "david", "costa", "pereira"]
// note: push is fast; unshift is slow on big arrays (it moves every item).

//--------------------------------------------------------------------
// pop() / shift() - // Used to remove the last / first item. Gives the removed item.

names.pop(); // result ==> "pereira"
names.shift(); // result ==> "tiago"
names; // result ==> ["david", "costa"]

//--------------------------------------------------------------------
// splice(index, howMany, ...add) - // Used to remove, replace or insert items at an index.

const items = ["i1", "i2", "i3", "i4", "i5"];
items.splice(2, 1); // result ==> ["i3"]  (gives the removed ones)
items; // result ==> ["i1", "i2", "i4", "i5"]
items.splice(3, 1, "i10"); // replaces index 3
items; // result ==> ["i1", "i2", "i4", "i10"]
items.splice(3, 0, "i20"); // howMany = 0 → only inserts
items; // result ==> ["i1", "i2", "i4", "i20", "i10"]

//--------------------------------------------------------------------
// fill(value, start, end) - // Used to fill positions with the same value (end not included).

const colors = ["red", "blue", "green"];
colors.fill("green", 1, 2);
colors; // result ==> ["red", "green", "green"]

//--------------------------------------------------------------------
// reverse() - // Turns the array backwards, in the original.

const rev = ["one", "two", "three"];
const revResult = rev.reverse();
rev; // result ==> ["three", "two", "one"]
revResult === rev; // result ==> true  (the SAME array)
// note: sort() also changes the original (see §11).

//--------------------------------------------------------------------
// copyWithin(target, start) - // Used to copy part of the array over another part.

[1, 2, 3, 4, 5].copyWithin(0, 3); // result ==> [4, 5, 3, 4, 5]

//--------------------------------------------------------------------
// length = 0 - // Used to empty an array.

const trash = [1, 2, 3];
trash.length = 0;
trash; // result ==> []

//--------------------------------------------------------------------
// Array.from(iterable, mapFn) / Array.of(...items) - // Used to create arrays.

new Array(3).fill(0); // result ==> [0, 0, 0]
Array.from({ length: 4 }, (_, i) => i * i); // result ==> [0, 1, 4, 9]
Array.from("abc"); // result ==> ["a", "b", "c"]
Array.from(new Set([1, 1, 2])); // result ==> [1, 2]
Array.of(7); // result ==> [7]
// note: new Array(7) would create 7 empty slots, not [7].

//--------------------------------------------------------------------
// Matrix with fill([]) - // Shows the trap: every row is the SAME array.

const bad = new Array(2).fill([]);
bad[0].push("x");
bad; // result ==> [["x"], ["x"]]  (⚠)
const good = Array.from({ length: 2 }, () => []); // ✔ a new row each time
good[0].push("x");
good; // result ==> [["x"], []]

// §10 ── ARRAYS: METHODS THAT DO NOT CHANGE IT ────────────────────────────────
// note: these give back a value or a NEW array; the callback gets (element, index, array).

const arr = [1, 2, 3, 4, 5, 6];

//--------------------------------------------------------------------
// at(index) - // Used to get the item at an index. Takes negatives too.

arr.at(-1); // result ==> 6

//--------------------------------------------------------------------
// slice(start, end) - // Used to copy a piece of the array (end not included).

arr.slice(1, 3); // result ==> [2, 3]
arr.slice(); // result ==> [1, 2, 3, 4, 5, 6]  (no arguments = a copy)

//--------------------------------------------------------------------
// concat(otherArray) - // Used to join arrays into a new one.

[1, 2].concat([3], [4]); // result ==> [1, 2, 3, 4]

//--------------------------------------------------------------------
// includes(item) / indexOf(item) - // Checks if an item is there / gives its index or -1.

arr.includes(3); // result ==> true
[NaN].includes(NaN); // result ==> true
[NaN].indexOf(NaN); // result ==> -1  (indexOf can't find NaN)

//--------------------------------------------------------------------
// map((element, index, array) => …) - // Used to change every item and get a new array of the same size.

[1, 2, 3].map((x) => x * 2); // result ==> [2, 4, 6]
const cities = ["miami", "lisbon", "paris"];
cities.map(cap); // result ==> ["Miami", "Lisbon", "Paris"]
[1, 2, 3].map((x) => x > 1); // result ==> [false, true, true]  (a condition gives true/false for EACH item)
[1, 2].map((x) => { x * 2; }); // result ==> [undefined, undefined]  (⚠ { } without return)
// note: with { } you must write return, or you get undefined.

//--------------------------------------------------------------------
// filter((element) => test) - // Used to keep only the items that pass the test.

arr.filter((x) => x % 2 === 0); // result ==> [2, 4, 6]
const people = [
  { name: "Candice", age: 25 },
  { name: "Tammy", age: 30 },
  { name: "Allen", age: 49 },
  { name: "Nettie", age: 21 },
  { name: "Stuart", age: 17 },
];
people.filter((p) => p.age >= 21).map((p) => p.name); // result ==> ["Candice", "Tammy", "Allen", "Nettie"]

//--------------------------------------------------------------------
// reduce((acc, cur) => …, start) - // Turns a list of values into one single value.

[2, 4, 6, 8].reduce((acc, cur) => acc + cur); // result ==> 20
[12, 9, 1, 8].reduce((acc, cur) => acc + cur, 23); // result ==> 53  (starts at 23)
people.reduce((sum, p) => sum + p.age, 0); // result ==> 142
["This", "is", "one"].reduce((s, w) => s + " " + w); // result ==> "This is one"
assert.throws(() => [].reduce((a, b) => a + b), TypeError); // empty + no start → TypeError
const freq = [..."banana"].reduce((acc, ch) => {
  acc[ch] = (acc[ch] ?? 0) + 1;
  return acc;
}, {});
freq; // result ==> { b: 1, a: 3, n: 2 }  (counting, see §14)
// note: always give a start value; without it, it starts at the first item.

//--------------------------------------------------------------------
// find((element) => test) / findIndex((element) => test) - // Used to get the first item that passes / its index (-1 if none).

people.find((p) => p.age > 26); // result ==> { name: "Tammy", age: 30 }
people.findIndex((p) => p.age > 100); // result ==> -1
// note: find gives undefined when nothing passes.

//--------------------------------------------------------------------
// findLast((element) => test) / findLastIndex((element) => test) - // Same as find, but starts from the end.

arr.findLast((x) => x % 2 === 1); // result ==> 5
arr.findLastIndex((x) => x < 3); // result ==> 1

//--------------------------------------------------------------------
// some((element) => test) - // Checks if at least ONE item passes the test.

[1, 2, -3, 5].some((x) => x < 0); // result ==> true

//--------------------------------------------------------------------
// every((element) => test) - // Checks if ALL items pass the test.

[17, 28, 45, 11, 5].every((x) => x > 10); // result ==> false
[17, 28, 45, 11, 5].every((x) => x > 3); // result ==> true
[].every((x) => x > 100); // result ==> true  (⚠ empty array)

//--------------------------------------------------------------------
// flat(levels) / flatMap() - // Used to flatten arrays inside arrays.

[1, [2, [3, [4]]]].flat(); // result ==> [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(Infinity); // result ==> [1, 2, 3, 4]
["a b", "c"].flatMap((s) => s.split(" ")); // result ==> ["a", "b", "c"]  (map + flat(1))

//--------------------------------------------------------------------
// toSorted() / toReversed() / toSpliced(index, howMany) / with(index, value) - // Same as sort/reverse/splice, but keep the original.

const orig = [3, 1, 2];
orig.toSorted(); // result ==> [1, 2, 3]
orig.toReversed(); // result ==> [2, 1, 3]
orig.toSpliced(0, 1); // result ==> [1, 2]
orig.with(0, 9); // result ==> [9, 1, 2]  (index 0 replaced)
orig; // result ==> [3, 1, 2]  (untouched)

//--------------------------------------------------------------------
// forEach((element) => …) - // Used to run something for each item. Gives back undefined.

const seen = [];
const ret = ["snake", "tiger"].forEach((a) => {
  if (a === "snake") return; // only leaves THIS round, like continue
  seen.push(a);
});
ret; // result ==> undefined
seen; // result ==> ["tiger"]
// note: no break; keys()/values()/entries() give iterators for for...of (see §6).

//--------------------------------------------------------------------
// Chaining - // Used to join filter, map and reduce in one go.

const total = people
  .filter((p) => p.age >= 21)
  .map((p) => p.age)
  .reduce((a, b) => a + b, 0);
total; // result ==> 125

// §11 ── SORTING ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// sort() - // Used to sort the array. It changes the ORIGINAL and sorts as text.

const scores = [1, 10, 2, 21];
[...scores].sort(); // result ==> [1, 10, 2, 21]  (⚠ "10" < "2" as text)
// note: toSorted(fn) does the same but gives a copy. Ties keep their order.

//--------------------------------------------------------------------
// sort((a, b) => a - b) - // Used to sort numbers. a - b goes up, b - a goes down.

[...scores].sort((a, b) => a - b); // result ==> [1, 2, 10, 21]
[4, 2, 5, 10, 3].sort((a, b) => b - a); // result ==> [10, 5, 4, 3, 2]
// note: negative → a first; positive → b first; 0 → keep the order.

//--------------------------------------------------------------------
// Sorting text - // Shows that plain sort puts numbers, then UPPERCASE, then lowercase.

["word", "Word", "1 Word"].sort(); // result ==> ["1 Word", "Word", "word"]

//--------------------------------------------------------------------
// a.localeCompare(b, "pt") - // Used to sort text in "human" order, with accents and case.

const words = ["b", "A", "á", "a", "B"];
words.toSorted((a, b) => a.localeCompare(b, "pt")); // result ==> ["a", "A", "á", "b", "B"]
// note: the Portuguese locale and the "á" are on purpose.

//--------------------------------------------------------------------
// Sort by 2 fields - // Used to sort objects by one field and break ties with another (||).

const ps = [
  { n: "Rui", age: 30 },
  { n: "Ana", age: 25 },
  { n: "Bia", age: 30 },
];
ps.toSorted((a, b) => b.age - a.age || a.n.localeCompare(b.n)).map((p) => p.n); // result ==> ["Bia", "Rui", "Ana"]

// §12 ── OBJECTS ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Create / update / delete - // Used to change an object's keys. It changes the original.

const car = { brand: "VW", year: 2010 };
car.color = "blue"; // create
car.year = 2012; // update
delete car.color; // delete
car; // result ==> { brand: "VW", year: 2012 }
car["brand"]; // result ==> "VW"  ([ ] for a key in a variable)
car.missing; // result ==> undefined  (no error)

//--------------------------------------------------------------------
// [key] in the literal - // Used to name a key with the value of a variable.

const field = "job";
const person = { name: "Tiago", [field]: "web dev" };
person.job; // result ==> "web dev"
person[field]; // result ==> "web dev"

//--------------------------------------------------------------------
// Shortcuts - // Used to write { ageX } instead of { ageX: ageX }, and short methods.

const ageX = 35;
const short = { ageX, hi() { return "hello"; } };
short.ageX; // result ==> 35
short.hi(); // result ==> "hello"

//--------------------------------------------------------------------
// "key" in obj / Object.hasOwn() - // Checks if a key exists. hasOwn ignores inherited ones.

"brand" in car; // result ==> true
"toString" in car; // result ==> true  (⚠ inherited)
Object.hasOwn(car, "toString"); // result ==> false  (✔)

//--------------------------------------------------------------------
// Object.keys(obj) / values(obj) / entries(obj) - // Used to get the keys, the values, or [key, value] pairs.

const someObj = { key1: "value1", key2: "value2" };
Object.keys(someObj); // result ==> ["key1", "key2"]
Object.values(someObj); // result ==> ["value1", "value2"]
Object.entries({ foo: "bar", baz: 42 }); // result ==> [["foo", "bar"], ["baz", 42]]

//--------------------------------------------------------------------
// Object.fromEntries(pairs) - // Turns [key, value] pairs back into an object.

const prices = { bread: 1, milk: 2 };
const doubled = Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, v * 2]));
doubled; // result ==> { bread: 2, milk: 4 }
// note: entries + map + fromEntries = a "map" over an object.

//--------------------------------------------------------------------
// for...in - // Used to walk the KEYS of an object.

const keyList = [];
for (const key in someObj) keyList.push(`${key}=${someObj[key]}`);
keyList; // result ==> ["key1=value1", "key2=value2"]
const entryList = [];
for (const [key, value] of Object.entries(someObj)) entryList.push(`${key}=${value}`);
entryList; // result ==> ["key1=value1", "key2=value2"]  (same, with Object.entries)
// note: for...in also gives inherited keys; prefer Object.entries.

//--------------------------------------------------------------------
// Key order - // Shows that number keys come first (in order), then text keys as created.

Object.keys({ b: 1, 2: 1, a: 1, 1: 1 }); // result ==> ["1", "2", "b", "a"]

//--------------------------------------------------------------------
// Object.assign(target, source) - // Used to copy keys from one object into another. It changes the target.

Object.assign({ a: 1 }, { b: 2 }); // result ==> { a: 1, b: 2 }

//--------------------------------------------------------------------
// Object.freeze(obj) - // Used to block changes, but only on the first level.

const frozen = Object.freeze({ a: 1, inner: { b: 1 } });
assert.throws(() => { "use strict"; frozen.a = 2; }, TypeError); // note: throws TypeError (strict mode)
frozen.inner.b = 2; // ⚠ this works
frozen.inner.b; // result ==> 2

//--------------------------------------------------------------------
// Object.groupBy(array, (element) => key) - // Used to split an array into groups by a key.

const groups = Object.groupBy(people, (p) => (p.age >= 21 ? "adult" : "minor"));
groups.adult.map((p) => p.name); // result ==> ["Candice", "Tammy", "Allen", "Nettie"]
groups.minor.map((p) => p.name); // result ==> ["Stuart"]
// note: it has no prototype, hence the { ... }. Map.groupBy does the same but gives a Map.

//--------------------------------------------------------------------
// JSON.stringify(value) / JSON.parse(text) - // Turns an object into text and back.

const json = JSON.stringify({ a: 1, b: [true, null] });
json; // result ==> '{"a":1,"b":[true,null]}'
JSON.parse(json); // result ==> { a: 1, b: [true, null] }
JSON.stringify({ f() {}, u: undefined }); // result ==> "{}"  (functions and undefined vanish)
assert.throws(() => JSON.parse("{a:1}"), SyntaxError); // keys need quotes
// note: a Date becomes a string.

// §13 ── DESTRUCTURING, SPREAD, REST ──────────────────────────────────────────
// note: "..." on the RIGHT of = or in a call is spread; on the LEFT or in parameters is rest.

//--------------------------------------------------------------------
// const [a, b] = array - // Used to pull values out of an array by POSITION.

const [tomato, mushroom, ...rest] = ["🍅", "🍄", "🥦", "🥒"];
tomato; // result ==> "🍅"
mushroom; // result ==> "🍄"
rest; // result ==> ["🥦", "🥒"]
const [, second] = [1, 2, 3]; // a comma skips a position
second; // result ==> 2
const [d1 = "default"] = []; // default value
d1; // result ==> "default"

//--------------------------------------------------------------------
// Swap - // Used to swap two variables without a temporary one.

let sa = 1, sb = 2;
[sa, sb] = [sb, sa];
[sa, sb]; // result ==> [2, 1]

//--------------------------------------------------------------------
// const { a, b } = object - // Used to pull values out of an object by NAME.

const { name: personName, job, city = "Lisbon" } = person;
personName; // result ==> "Tiago"  (renamed with :)
job; // result ==> "web dev"
city; // result ==> "Lisbon"  (default with =)
const { profile: { name: profileName } } = user; // inside another object
profileName; // result ==> "Ana"

//--------------------------------------------------------------------
// const { a, ...rest } = object - // Used to take one key out and keep the rest.

const { year, ...withoutYear } = car;
year; // result ==> 2012
withoutYear; // result ==> { brand: "VW" }

//--------------------------------------------------------------------
// Destructuring parameters - // Used to read an object's keys right in the function header.

const introduce = ({ name, age = 0 }) => `${name} (${age})`;
introduce({ name: "Rui" }); // result ==> "Rui (0)"

//--------------------------------------------------------------------
// Spread [...array] - // Used to copy and join arrays.

const alumni = ["Tiago", "John"];
const students = [...alumni, "Xico"];
alumni; // result ==> ["Tiago", "John"]  (untouched)
students; // result ==> ["Tiago", "John", "Xico"]
Math.max(...[1, 5, 3]); // result ==> 5  (spread into a function call)
// note: it is a shallow copy (see §15).

//--------------------------------------------------------------------
// Spread {...object} - // Used to copy and join objects. The last key wins.

const base = { a: 1, b: 2 };
({ ...base, b: 3 }); // result ==> { a: 1, b: 3 }

//--------------------------------------------------------------------
// Rest (...args) - // Used to gather all the arguments into a real array.

const sumAll = (...ns) => ns.reduce((a, b) => a + b, 0);
sumAll(1, 2, 3); // result ==> 6

// §14 ── MAP, SET, WEAKMAP ───────────────────────────────────────────────────

//--------------------------------------------------------------------
// new Map() / set() / get() - // Used to store key → value pairs (e.g. letter → how many times).

const count = new Map();
count.set("a", 1);
count.get("a"); // result ==> 1
count.get("z"); // result ==> undefined  (the key doesn't exist)
// note: keys can be ANY type and keep their insertion order.

//--------------------------------------------------------------------
// has(key) / size / delete(key) - // Used to ask if a key is there, how many keys, and to remove one.

count.set("b", 2).set("c", 3); // set gives back the Map → you can chain
count.has("b"); // result ==> true
count.size; // result ==> 3
count.delete("c"); // result ==> true  (false if the key wasn't there)
count; // result ==> new Map([["a", 1], ["b", 2]])
// note: also clear(), keys(), values(), entries(); for (const [key, value] of count) walks it.

//--------------------------------------------------------------------
// Object as a key - // Shows that a Map takes an object as key; a plain {} would turn it into "[object Object]".

const objKey = { id: 1 };
count.set(objKey, "object as key");
count.get(objKey); // result ==> "object as key"

//--------------------------------------------------------------------
// Counting with a Map - // Used to count how many times each thing appears (LeetCode!).

const counts = new Map();
for (const ch of "hello") counts.set(ch, (counts.get(ch) ?? 0) + 1);
counts.get("l"); // result ==> 2
[...counts.keys()]; // result ==> ["h", "e", "l", "o"]  (insertion order)

//--------------------------------------------------------------------
// Map ↔ object - // Used to turn a Map into an object and back.

Object.fromEntries(new Map([["x", 1]])); // result ==> { x: 1 }
[...new Map(Object.entries({ y: 2 }))]; // result ==> [["y", 2]]

//--------------------------------------------------------------------
// new Set(array) / add() / has() - // Used to store UNIQUE values; has() is very fast. Good for "seen it?".

const s = new Set([1, 2, 2, 3]);
s.size; // result ==> 3
s.add(3); // already there → ignored
s.has(2); // result ==> true
[...new Set([3, 1, 3, 2, 1])]; // result ==> [3, 1, 2]  (remove duplicates)
new Set([[1], [1]]).size; // result ==> 2  (⚠ objects compare by reference)

//--------------------------------------------------------------------
// a.union(b) / a.intersection(b) / a.difference(b) - // Used to combine two Sets.

const A = new Set([1, 2, 3]);
const B = new Set([2, 3, 4]);
[...A.union(B)]; // result ==> [1, 2, 3, 4]
[...A.intersection(B)]; // result ==> [2, 3]
[...A.difference(B)]; // result ==> [1]

//--------------------------------------------------------------------
// new WeakMap() / set(obj, value) / get(obj) - // Used to attach data to an object without keeping it in memory forever.

const cache = new WeakMap();
const element = {};
cache.set(element, { clicks: 1 });
cache.get(element).clicks; // result ==> 1
assert.throws(() => cache.set("string", 1), TypeError); // keys must be objects
// note: you can't loop over a WeakMap.

// §15 ── COPIES: SHALLOW VS DEEP ──────────────────────────────────────────────
// note: b = a copies nothing, it is the same object with two names.

//--------------------------------------------------------------------
// Shallow copy {...o} / [...a] - // Copies only the first level; objects inside stay SHARED.

const book1 = { author: "Charlotte Bronte", tags: ["romance"] };
const shallow = { ...book1 };
shallow === book1; // result ==> false  (different objects…)
shallow.tags.push("classic");
book1.tags; // result ==> ["romance", "classic"]  (⚠ …but the array is shared)
// note: a.slice() and Object.assign({}, o) are shallow too.

//--------------------------------------------------------------------
// structuredClone(value) - // Used to make a full DEEP copy (Date, Map and Set work).

const original = { d: new Date(0), tags: ["a"], m: new Map([[1, 2]]) };
const deep = structuredClone(original);
deep.tags.push("b");
original.tags; // result ==> ["a"]  (✔ independent)
deep.d instanceof Date; // result ==> true
deep.m.get(1); // result ==> 2
assert.throws(() => structuredClone({ f() {} })); // functions can't be copied

//--------------------------------------------------------------------
// JSON.parse(JSON.stringify(x)) - // The old deep copy. It breaks Dates, Maps and functions.

typeof JSON.parse(JSON.stringify(original)).d; // result ==> "string"  (⚠)

// §16 ── FUNCTIONS ────────────────────────────────────────────────────────────
// note: functions are values: store them, pass them, return them.

//--------------------------------------------------------------------
// function name() {} - // A declaration. You can call it before the line it is on.

declared(2); // result ==> 4  (hoisting)
function declared(a) {
  return a * 2;
}

//--------------------------------------------------------------------
// const f = function () {} - // An expression. You can't use it before its line.

const expression = function (a) {
  return a * 2;
};
expression(2); // result ==> 4

//--------------------------------------------------------------------
// Arrow (a) => a * 2 - // A short function. One line gives back its value on its own.

const arrow = (a) => a * 2;
const arrowBlock = (a) => {
  return a * 2; // with { } you need return
};
const arrowObject = () => ({ ok: true }); // to return an object, wrap it in ( )
arrow(2) + arrowBlock(2); // result ==> 8
arrowObject(); // result ==> { ok: true }
// note: an arrow has no "this" of its own (see §18).

//--------------------------------------------------------------------
// Default parameters - // Used to give a parameter a value when none is passed.

const greet = (name = "anonymous") => `hello ${name}`;
greet(); // result ==> "hello anonymous"
greet(undefined); // result ==> "hello anonymous"  (undefined uses the default…)
greet(null); // result ==> "hello null"  (…null does not)
(() => {})(); // result ==> undefined  (no return → undefined)

//--------------------------------------------------------------------
// Objects passed in - // Shows that a function can change an object you give it.

const mutate = (o) => { o.x = 1; };
const target = {};
mutate(target);
target.x; // result ==> 1
// note: numbers and strings are copied, so the function can't change yours.

//--------------------------------------------------------------------
// Callback - // A function passed as an ARGUMENT, for another function to call later.

const applyFn = (value, callback) => callback(value);
applyFn(5, (v) => v + 1); // result ==> 6

//--------------------------------------------------------------------
// Higher-order function - // A function that takes or gives back another function.

const multiplier = (factor) => (n) => n * factor;
const triple = multiplier(3);
triple(4); // result ==> 12
// note: map, filter and reduce are higher-order functions.

//--------------------------------------------------------------------
// Recursion - // A function that calls itself. It ALWAYS needs a stop case.

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
factorial(5); // result ==> 120

//--------------------------------------------------------------------
// IIFE - // A function called right where it is written (common in old code).

const iife = (() => 42)();
iife; // result ==> 42

// §17 ── CLOSURES ─────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Closure - // Shows that a function remembers the variables of the place it was created.

function makeCounter() {
  let count = 0; // private: only the functions below can touch it
  return {
    inc: () => ++count,
    get: () => count,
  };
}
const counterA = makeCounter();
const counterB = makeCounter();
counterA.inc();
counterA.inc();
counterB.inc();
counterA.get(); // result ==> 2
counterB.get(); // result ==> 1  (each call has its own count)

//--------------------------------------------------------------------
// Memoization - // Used to save results so a slow function never does the same work twice.

function memo(fn) {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}
const fib = memo((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
fib(50); // result ==> 12586269025

//--------------------------------------------------------------------
// var vs let in a loop - // Shows the classic question: var shares ONE variable, let makes a new one.

const fnsVar = [];
for (var iv = 0; iv < 3; iv++) fnsVar.push(() => iv);
const fnsLet = [];
for (let il = 0; il < 3; il++) fnsLet.push(() => il);
fnsVar.map((fn) => fn()); // result ==> [3, 3, 3]
fnsLet.map((fn) => fn()); // result ==> [0, 1, 2]

// §18 ── THIS, CALL/APPLY/BIND ────────────────────────────────────────────────
// note: "this" depends on HOW the function is called, not where it was written.

const account = {
  owner: "Tiago",
  normal() {
    return this?.owner;
  },
  withArrow() {
    return [1].map(() => this.owner)[0]; // the arrow uses the method's this
  },
};

//--------------------------------------------------------------------
// obj.method() - // Shows that inside a method, "this" is the object before the dot.

account.normal(); // result ==> "Tiago"
const loose = account.normal; // ⚠ taken off the object
loose(); // result ==> undefined  (strict mode)
// note: with new F(), this is the new object.

//--------------------------------------------------------------------
// Arrow and this - // Shows that an arrow uses the "this" of the place around it.

account.withArrow(); // result ==> "Tiago"
// note: a method written as an arrow { f: () => this } does NOT see the object.

//--------------------------------------------------------------------
// fn.call(thisValue, a, b) / fn.apply(thisValue, [a, b]) - // Used to call a function with the "this" you choose.

account.normal.call({ owner: "Ana" }); // result ==> "Ana"  (arguments one by one)
account.normal.apply({ owner: "Rui" }, []); // result ==> "Rui"  (arguments in an array)

//--------------------------------------------------------------------
// fn.bind(thisValue) - // Used to make a NEW function with "this" fixed forever.

const bound = account.normal.bind({ owner: "Bia" });
bound(); // result ==> "Bia"

// §19 ── CLASSES AND PROTOTYPES ───────────────────────────────────────────────

class Person {
  static species = "human"; // belongs to the class
  #secret; // private
  type = "person"; // public field

  constructor(name = "Adelia", age = 34) { // runs on "new"
    this.name = name;
    this.age = age;
    this.#secret = "1234";
  }
  birthYear(currentYear) { // method
    return currentYear - this.age;
  }
  get intro() {
    return `${this.name}, ${this.age}`;
  }
  set safeAge(v) {
    if (v < 0) throw new RangeError("negative age");
    this.age = v;
  }
  checkSecret(guess) {
    return guess === this.#secret;
  }
  static makeBaby(name) {
    return new Person(name, 0);
  }
}
const tiago = new Person("Tiago", 33);

//--------------------------------------------------------------------
// class + constructor - // Used as a template to create objects with the same fields and methods.

const def = new Person();
def.name; // result ==> "Adelia"  (default value)
tiago.birthYear(2020); // result ==> 1987

//--------------------------------------------------------------------
// get / set - // Used to make a property that is computed or checked. No () to use it.

tiago.intro; // result ==> "Tiago, 33"
assert.throws(() => { tiago.safeAge = -1; }, RangeError); // note: throws RangeError

//--------------------------------------------------------------------
// #private - // Used for fields that only the class itself can see.

tiago.checkSecret("1234"); // result ==> true
tiago.secret; // result ==> undefined  (hidden from outside)

//--------------------------------------------------------------------
// static - // Used for things that belong to the class, not to each object.

Person.species; // result ==> "human"
Person.makeBaby("Bia").age; // result ==> 0
tiago.species; // result ==> undefined

//--------------------------------------------------------------------
// extends + super - // Used to make a class that inherits from another one.

class Athlete extends Person {
  constructor(name, age, height) {
    super(name, age); // calls the parent's constructor, before using this
    this.height = height;
  }
  get intro() { // replaces the parent's, but reuses it
    return `${super.intro} — ${this.height}cm`;
  }
}
const rui = new Athlete("Rui", 33, 175);
rui.intro; // result ==> "Rui, 33 — 175cm"
rui instanceof Athlete; // result ==> true
rui instanceof Person; // result ==> true
rui.birthYear(2020); // result ==> 1987  (inherited method)

//--------------------------------------------------------------------
// Prototypes - // Shows what a class does underneath: objects share methods through a chain.

Object.getPrototypeOf(tiago) === Person.prototype; // result ==> true
Object.getPrototypeOf(Athlete.prototype) === Person.prototype; // result ==> true  (the chain: Athlete → Person)
Object.hasOwn(tiago, "birthYear"); // result ==> false  (shared, not copied)
typeof Person; // result ==> "function"

//--------------------------------------------------------------------
// Object.create(proto) - // Used to make an object that inherits from another object.

const protoBase = { speak() { return "hello from " + this.n; } };
const child = Object.create(protoBase);
child.n = "child";
child.speak(); // result ==> "hello from child"

// §20 ── ERRORS ───────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// try / catch / finally - // Used to catch an error. finally ALWAYS runs.

function parseAge(txt) {
  const num = Number(txt);
  if (Number.isNaN(num)) throw new TypeError(`not a number: ${txt}`);
  return num;
}
const steps = [];
try {
  steps.push("try");
  parseAge("abc");
  steps.push("never gets here");
} catch (err) {
  steps.push(`catch ${err.name}`); // err.name, err.message, err.stack
} finally {
  steps.push("finally");
}
steps; // result ==> ["try", "catch TypeError", "finally"]
// note: always throw an Error (TypeError, RangeError…), never a string.

//--------------------------------------------------------------------
// Custom error + cause - // Used to make your own error type and keep the original error.

class ValidationError extends Error {
  constructor(msg, options) {
    super(msg, options);
    this.name = "ValidationError";
  }
}
try {
  try {
    JSON.parse("{bad");
  } catch (e) {
    throw new ValidationError("invalid config", { cause: e });
  }
} catch (e) {
  e instanceof ValidationError; // result ==> true
  e instanceof Error; // result ==> true
  e.cause instanceof SyntaxError; // result ==> true
}

//--------------------------------------------------------------------
// catch { } - // Used when you don't need the error itself.

let failed = false;
try { null.x; } catch { failed = true; }
failed; // result ==> true

//--------------------------------------------------------------------
// finally after return - // Shows that finally runs even when try returns.

const withFinally = () => { try { return "try"; } finally { steps.push("finally runs"); } };
withFinally(); // result ==> "try"
steps.at(-1); // result ==> "finally runs"

// §21 ── DATES ────────────────────────────────────────────────────────────────
// note: months start at 0 (January = 0) and getDay() 0 = Sunday.

//--------------------------------------------------------------------
// new Date(y, m, d) - // Used to create a date in local time.

const date = new Date(2024, 0, 31); // 31 Jan 2024
date.getFullYear(); // result ==> 2024
date.getMonth(); // result ==> 0  (January)
date.getDate(); // result ==> 31  (day of the month)
date.getDay(); // result ==> 3  (Wednesday)
// note: also getHours(), getMinutes(), getSeconds(), getMilliseconds().

//--------------------------------------------------------------------
// setDate(day) - // Used to change the day. It rolls over to the next month on its own.

date.setDate(date.getDate() + 1); // add 1 day
date.getMonth(); // result ==> 1  (February)
date.getDate(); // result ==> 1

//--------------------------------------------------------------------
// Date.UTC(y, m, d) - // Used to do date maths without time zone surprises.

const days = (Date.UTC(2024, 2, 1) - Date.UTC(2024, 1, 1)) / 86_400_000;
days; // result ==> 29  (2024 is a leap year)

//--------------------------------------------------------------------
// date.toISOString() - // Turns a date into "YYYY-MM-DDTHH:mm:ss.sssZ", always in UTC.

new Date(Date.UTC(2024, 0, 15)).toISOString(); // result ==> "2024-01-15T00:00:00.000Z"

//--------------------------------------------------------------------
// new Date("text") - // Used to read a date from text.

new Date("2024-01-15").getTime(); // result ==> 1705276800000  (getTime() = ms since 1970 = Date.UTC(2024, 0, 15))
// note: "2024-01-15" is read as UTC, but "2024-01-15T10:00" as local time.

//--------------------------------------------------------------------
// Date.now() - // Gives the ms for right now (good to measure time).

typeof Date.now(); // result ==> "number"  (a number like 1731500000000)

//--------------------------------------------------------------------
// new Intl.DateTimeFormat("pt-PT").format(date) - // Used to show a date the way a country writes it.

new Intl.DateTimeFormat("pt-PT").format(new Date(2024, 0, 5)); // result ==> "05/01/2024"

//--------------------------------------------------------------------
// Comparing dates - // Used with < > or getTime(), NEVER with ===.

new Date(0) < new Date(1); // result ==> true
new Date(0) === new Date(0); // result ==> false  (two objects)
new Date(0).getTime() === new Date(0).getTime(); // result ==> true

// §22 ── REGEX ────────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Regex pieces - // Shows the symbols you use most in a /pattern/.

/^\d{4}-\d{3}$/.test("1000-123"); // result ==> true  (Portuguese postal code)
/^\w+@\w+\.[a-z]{2,4}$/.test("tiago@mail.com"); // result ==> true
/^[^0-9]+\s?!?$/.test("Lisbon !"); // result ==> true
// note: . any · \d digit · \w letter/digit/_ · \s space · [^abc] none of these · ^ $ start/end.
// note: * 0+ · + 1+ · ? 0 or 1 · {2,4} 2 to 4 · a|b · (…) group · (?<n>…) named group.

//--------------------------------------------------------------------
// /pattern/.test(text) - // Checks if the text matches the pattern.

/hello/i.test("HELLO world"); // result ==> true
// note: flags: g all · i ignore case · m multiline · s "." matches \n · u unicode.

//--------------------------------------------------------------------
// text.match(/pattern/g) - // Used to get the matches. With g you get all of them.

"a1b22c333".match(/\d+/g); // result ==> ["1", "22", "333"]
"no numbers".match(/\d/); // result ==> null  (not [])
const iso = "2024-01-15".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
iso.groups.month; // result ==> "01"

//--------------------------------------------------------------------
// replace(/pattern/g, "new") - // Used to swap text; $1 / $<name> is what the group caught.

"2024-01-15".replace(/(\d+)-(\d+)-(\d+)/, "$3/$2/$1"); // result ==> "15/01/2024"
"A man, a plan!".toLowerCase().replace(/[^a-z0-9]/g, ""); // result ==> "amanaplan"

//--------------------------------------------------------------------
// text.matchAll(/pattern/g) - // Used to loop over every match with its groups (needs g).

[..."k1=v1;k2=v2".matchAll(/(\w+)=(\w+)/g)].map((mm) => mm[2]); // result ==> ["v1", "v2"]

//--------------------------------------------------------------------
// split(/pattern/) - // Used to cut text by a pattern.

"a, b ,c".split(/\s*,\s*/); // result ==> ["a", "b", "c"]

//--------------------------------------------------------------------
// lastIndex trap - // Shows that a regex with g remembers where it stopped.

const reG = /a/g;
reG.test("a"); // result ==> true
reG.test("a"); // result ==> false  (it went on from index 1)

// =============================================================================
// §23–§25 are asynchronous: they run inside main() so the file waits for them.
// =============================================================================
const sleep = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function main() {
  // §23 ── PROMISES AND ASYNC/AWAIT ───────────────────────────────────────────

  //--------------------------------------------------------------------
  // new Promise() + await - // Used for a value that arrives LATER. await waits for it.

  const p = new Promise((resolve, reject) => {
    const ok = true;
    ok ? resolve("done") : reject(new Error("failed"));
  });
  await p; // result ==> "done"
  // note: an async function always gives back a Promise; await only works inside async (or ESM top level).

  //--------------------------------------------------------------------
  // then() / catch() / finally() - // The older way to wait, step by step.

  const viaThen = await Promise.resolve(2)
    .then((v) => v * 10) // gives a value → the next then gets it
    .then((v) => sleep(1, v + 1)) // gives a Promise → it waits for it
    .catch(() => -1) // catches errors from any step above
    .finally(() => {}); // always runs, does not change the value
  viaThen; // result ==> 21

  //--------------------------------------------------------------------
  // try / catch with await - // Used to catch an error from an async function.

  async function fails() {
    throw new Error("blew up"); // = a rejected Promise
  }
  try {
    await fails();
    assert.fail("should not get here");
  } catch (e) {
    e.message; // result ==> "blew up"
  }
  await assert.rejects(fails(), /blew up/);

  //--------------------------------------------------------------------
  // One after another vs Promise.all - // Shows that Promise.all waits for everything AT THE SAME TIME.

  let t0 = Date.now();
  const seq1 = await sleep(30, "a"); // waits 30ms…
  const seq2 = await sleep(30, "b"); // …and 30ms more ≈ 60ms
  const tSeq = Date.now() - t0;
  t0 = Date.now();
  const [par1, par2] = await Promise.all([sleep(30, "a"), sleep(30, "b")]); // ≈ 30ms
  const tPar = Date.now() - t0;
  [seq1, seq2]; // result ==> ["a", "b"]
  [par1, par2]; // result ==> ["a", "b"]  (same values, half the time)
  tSeq >= 55; // result ==> true  (the waits add up; timers never fire early)
  void tPar; // ≈ 30ms, not checked: a busy machine could make it fail at random

  //--------------------------------------------------------------------
  // Promise.all([p1, p2]) - // Used to wait for ALL. Keeps the array order; fails on the first error.

  await Promise.all([sleep(20, "slow"), sleep(1, "fast")]); // result ==> ["slow", "fast"]
  await assert.rejects(Promise.all([sleep(1, 1), Promise.reject(new Error("x"))]), /x/);

  //--------------------------------------------------------------------
  // Promise.allSettled([p1, p2]) - // Used to wait for all to finish, good or bad. Never fails.

  const settled = await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("no"))]);
  settled.map((r) => r.status); // result ==> ["fulfilled", "rejected"]
  settled[0].value; // result ==> 1
  settled[1].reason.message; // result ==> "no"

  //--------------------------------------------------------------------
  // Promise.race([p1, p2]) - // Gives the first one to FINISH (good or bad).

  await Promise.race([sleep(20, "slow"), sleep(1, "fast")]); // result ==> "fast"

  //--------------------------------------------------------------------
  // Promise.any([p1, p2]) - // Gives the first one that WORKS; fails only if all fail.

  await Promise.any([Promise.reject(new Error()), sleep(1, "ok")]); // result ==> "ok"
  // note: when all fail you get an AggregateError.

  //--------------------------------------------------------------------
  // Timeout with race - // Used to give up when something takes too long.

  const withTimeout = (promise, ms) =>
    Promise.race([promise, sleep(ms).then(() => { throw new Error("timeout"); })]);
  await assert.rejects(withTimeout(sleep(50), 5), /timeout/); // note: rejects with Error "timeout"

  //--------------------------------------------------------------------
  // await in a loop - // Shows that for...of waits one by one.

  const order = [];
  for (const ms of [10, 1]) order.push(await sleep(ms, ms));
  order; // result ==> [10, 1]
  // note: forEach does NOT wait, don't use it with async.

  // §24 ── EVENT LOOP ────────────────────────────────────────────────────────

  //--------------------------------------------------------------------
  // Event loop order - // Shows the order: normal code, then ALL microtasks, then ONE macrotask.

  const log = [];
  log.push("sync 1");
  setTimeout(() => log.push("setTimeout"), 0); // macrotask
  Promise.resolve().then(() => log.push("then")); // microtask
  queueMicrotask(() => log.push("queueMicrotask")); // microtask
  log.push("sync 2");
  await sleep(5); // gives the setTimeout time to run
  log; // result ==> ["sync 1", "sync 2", "then", "queueMicrotask", "setTimeout"]
  // note: microtasks = then/await/queueMicrotask; macrotasks = setTimeout/setInterval/I/O.
  // note: in Node, process.nextTick runs even before Promises.

  //--------------------------------------------------------------------
  // Interview question - // Shows that an async function runs normally until its first await.

  const q = [];
  const task = async () => {
    q.push("B"); // before the await → runs right away
    await null;
    q.push("D"); // after the await → microtask
  };
  q.push("A");
  setTimeout(() => q.push("F"), 0);
  task();
  Promise.resolve().then(() => q.push("E"));
  q.push("C");
  await sleep(5);
  q.join(""); // result ==> "ABCDEF"

  // §25 ── TIMERS ────────────────────────────────────────────────────────────

  //--------------------------------------------------------------------
  // setTimeout(fn, ms) / clearTimeout(id) - // Used to run code ONCE after ms / to cancel it.

  const fired = [];
  const cancelledId = setTimeout(() => fired.push("never"), 5);
  clearTimeout(cancelledId);
  await sleep(10);
  fired; // result ==> []  (cancelled, it never ran)
  // note: ms is a minimum wait, not an exact one.

  //--------------------------------------------------------------------
  // setInterval(fn, ms) / clearInterval(id) - // Used to run code every ms until you stop it.

  let tick = 0;
  await new Promise((resolve) => {
    const intervalId = setInterval(() => {
      tick++;
      if (tick === 3) {
        clearInterval(intervalId); // without this it runs forever
        resolve();
      }
    }, 5);
  });
  tick; // result ==> 3

  //--------------------------------------------------------------------
  // timers/promises - // Used to get a setTimeout you can await (a ready-made sleep).

  const { setTimeout: wait } = require("node:timers/promises");
  await wait(1, "value"); // result ==> "value"

  //--------------------------------------------------------------------
  // Debounce - // Used to run a function only once the calls stop for ms.

  const debounce = (fn, ms) => {
    let id;
    return (...args) => {
      clearTimeout(id);
      id = setTimeout(() => fn(...args), ms);
    };
  };
  const calls = [];
  const search = debounce((txt) => calls.push(txt), 10);
  search("t");
  search("ti");
  search("tia");
  await sleep(30);
  calls; // result ==> ["tia"]  (only the last one)
}

// §26 ── MODULES ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// CommonJS (require) - // Used in classic Node (.js by default, .cjs) to share code between files.

//   // math.js
//   module.exports = { sum };
//   // app.js
//   const { sum } = require("./math");
typeof module.exports; // result ==> "object"  (this file is CommonJS)
typeof require; // result ==> "function"
// note: require is a normal function: it runs when called, and the extension is optional.

//--------------------------------------------------------------------
// ES Modules (import/export) - // Used in browsers, and in Node with .mjs or "type": "module".

//   // math.js
//   export const PI = 3.14;
//   export default function sum(a, b) { return a + b; }
//   // app.js
//   import sum, { PI } from "./math.js";   // default without { }, named with { }
//   import * as math from "./math.js";      // everything in one object
// note: imports go at the top, need the ".js", allow top-level await and are always strict.

//--------------------------------------------------------------------
// import("./file.js") - // Used to load a module only when you need it (works in both).

//   const mod = await import("./math.js");

// §27 ── DATA STRUCTURES ─────────────────────────────────────────────────────
// Linked lists, trees, BST and binary search are in 02-LeetCode-Easy.js.

// =============================================================================
main().then(
  () => console.log("✅ Fundamentals OK"),
  (err) => {
    console.error(err);
    process.exitCode = 1;
  }
);
