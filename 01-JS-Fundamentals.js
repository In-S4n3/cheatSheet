// =============================================================================
// 01 — JAVASCRIPT FUNDAMENTALS (a cheat sheet that runs and checks itself)
// Run:  node 01-JS-Fundamentals.js   → must end with "✅ Fundamentals OK"
// Tested on Node 26. Every check() is the answer: if one is wrong, the file stops.
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
const assert = require("node:assert/strict");
const check = (actual, expected) => assert.deepEqual(actual, expected); // stops the file if an example is wrong

// §1 ── VARIABLES ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// const - // Used to store a value you will not give a new one to. Use it by default.

const list = [1, 2];
list.push(3); // allowed: you change what is inside, not the variable
check(list, [1, 2, 3]); // result ==> [1, 2, 3]
assert.throws(() => {
  const x = 1;
  x = 2; // giving a const a new value
}, TypeError); // result ==> TypeError
// note: const does not freeze the value, it only stops you reassigning the variable.

//--------------------------------------------------------------------
// let - // Used to store a value you will change later. It only lives inside its { }.

{
  var escapes = "var";
  let trapped = "let";
}
check(typeof trapped, "undefined"); // result ==> "undefined" (it does not exist out here)

//--------------------------------------------------------------------
// var - // The old way. Avoid it: it escapes the { } and lives in the whole function.

check(escapes, "var"); // result ==> "var"

//--------------------------------------------------------------------
// Hoisting - // Shows that a declaration "moves up" to the top of its function.

function hoistingVar() {
  const before = v; // v already exists, but has no value yet
  var v = 10;
  return before;
}
check(hoistingVar(), undefined); // result ==> undefined

//--------------------------------------------------------------------
// TDZ - // Shows that let/const exist before their line but crash if you touch them.

assert.throws(() => {
  y; // ReferenceError
  let y = 1;
}, ReferenceError); // result ==> ReferenceError
// note: TDZ = "Temporal Dead Zone", the lines before the let/const.

//--------------------------------------------------------------------
// Declare vs assign - // Declare creates the box, assign puts a value in it.

let name; // declare → it is undefined
name = "Tiago"; // assign
check(name, "Tiago"); // result ==> "Tiago"

// §2 ── TYPES ──────────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// typeof - // Used to get the type of a value as text.

check(typeof "hello", "string"); // result ==> "string"
check(typeof 42, "number");
check(typeof 42n, "bigint");
check(typeof true, "boolean");
check(typeof undefined, "undefined");
check(typeof Symbol("id"), "symbol");
check(typeof function () {}, "function");
check(typeof null, "object"); // result ==> "object" (an old bug: null is NOT an object)
check(typeof [], "object"); // result ==> "object" (arrays too)
// note: 7 primitives (string, number, bigint, boolean, undefined, null, symbol), the rest are objects.
// note: undefined = "no value yet"; null = "empty on purpose".

//--------------------------------------------------------------------
// Array.isArray() - // Checks if a value is an array (typeof can't tell you).

check(Array.isArray([]), true); // result ==> true

//--------------------------------------------------------------------
// Value vs reference - // Shows that primitives are copied, but objects are shared.

let p1 = 5;
let p2 = p1;
p2++;
check(p1, 5); // result ==> 5 (independent copy)
const o1 = { n: 5 };
const o2 = o1; // same object, two names
o2.n++;
check(o1.n, 6); // result ==> 6

//--------------------------------------------------------------------
// Number() / String() / Boolean() - // Used to turn a value into another type on purpose.

check(Number("17031987"), 17031987); // result ==> 17031987
check(String(17031987), "17031987"); // result ==> "17031987"
check((255).toString(16), "ff"); // result ==> "ff" (number → text in base 16)
check(Boolean("text"), true); // result ==> true (see §4)

//--------------------------------------------------------------------
// Automatic conversion - // Shows the traps when JS converts types for you.

check("5" + 1, "51"); // result ==> "51" (+ with text glues)
check("5" - 1, 4); // result ==> 4 (- * / turn it into a number)
check(+"3", 3); // result ==> 3 (+ in front turns it into a number)
check([] + [], ""); // result ==> ""
// note: prefer Number()/String() over these surprises.

// §3 ── OPERATORS ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// % - // Used to get the REMAINDER of a division (12 = 5*2 + 2).

check(12 % 5, 2); // result ==> 2
check(5 % 12, 5); // result ==> 5 (12 fits 0 times in 5)
check(10 % 2 === 0, true); // result ==> true (even number test)
check(-7 % 3, -1); // result ==> -1
check(((-7 % 3) + 3) % 3, 2); // result ==> 2 (always positive)
// note: the remainder keeps the sign of the left number.
// note: 7 / 2 gives 3.5 — no integer division, use Math.trunc. 2 ** 10 gives 1024.

//--------------------------------------------------------------------
// ++ / -- - // Used to add or remove 1. x++ gives the old value, ++x the new one.

let c = 1;
check(c++, 1); // result ==> 1, and now c = 2
check(++c, 3); // result ==> 3

//--------------------------------------------------------------------
// ||= / ??= - // Used to give a variable a value only if it is "empty".

let hits = 0;
hits ||= 10; // 0 is falsy → it assigns
let hits2 = 0;
hits2 ??= 10; // 0 is not null/undefined → it keeps 0
check(hits, 10); // result ==> 10
check(hits2, 0); // result ==> 0
// note: x += y is x = x + y (same for -= *= /= %= **=); x &&= y assigns only if x is truthy.

//--------------------------------------------------------------------
// === vs == - // Used to compare. Always use === (and !==): it checks value AND type.

check(0 === "0", false); // result ==> false
check(0 == "0", true); // result ==> true (== converts the types first)
check(null == undefined, true); // the only useful case for ==
check(null === undefined, false);
check([1] === [1], false); // result ==> false (objects compare by reference)

//--------------------------------------------------------------------
// Object.is() - // Checks if two values are the same, even NaN.

check(NaN === NaN, false); // result ==> false (NaN never equals anything)
check(Object.is(NaN, NaN), true); // result ==> true

//--------------------------------------------------------------------
// < > <= >= - // Used to compare. Text is compared letter by letter by its code.

check("a" < "b", true); // result ==> true
check("Z" < "a", true); // result ==> true (uppercase comes first)
check("10" < "9", true); // result ==> true (two texts: "1" < "9")

//--------------------------------------------------------------------
// && || ! - // Used to combine conditions. They give back one of the values, not always true/false.

check("a" || "b", "a"); // result ==> "a" (first truthy one)
check("" || "default", "default"); // result ==> "default"
check("a" && "b", "b"); // result ==> "b" (if a is truthy, gives b)
check(!!"x", true); // result ==> true (!! turns anything into a boolean)
check(false || 4 > 2, true);
check(true && 4 > 2, true);

//--------------------------------------------------------------------
// ?? - // Used to give a default value ONLY when the left side is null or undefined.

check(null ?? 5, 5); // result ==> 5
check(0 ?? 5, 0); // result ==> 0
check(0 || 5, 5); // result ==> 5
// note: || also replaces 0, "" and false; ?? does not.

//--------------------------------------------------------------------
// ?. - // Used to read something that may not exist, without crashing.

const user = { profile: { name: "Ana" }, speak: () => "hello" };
check(user.profile?.name, "Ana"); // result ==> "Ana"
check(user.address?.street, undefined); // result ==> undefined (no TypeError)
check(user.fly?.(), undefined); // a method that may not exist
check(user.address?.street ?? "no street", "no street"); // classic combo

//--------------------------------------------------------------------
// condition ? a : b - // Used as a short if/else that gives back a value.

const age = 20;
check(age >= 18 ? "adult" : "minor", "adult"); // result ==> "adult"

// §4 ── TRUTHY / FALSY ────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Falsy - // Shows the ONLY 8 values that count as false inside an if.

const falsy = [false, 0, -0, 0n, "", null, undefined, NaN];
check(falsy.every((v) => !v), true); // result ==> true

//--------------------------------------------------------------------
// Truthy - // Shows that everything else counts as true, even "0", [] and {}.

const truthy = ["0", "false", " ", [], {}, () => {}, -1, Infinity];
check(truthy.every((v) => !!v), true); // result ==> true
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
check(weatherIf("dark"), "It might rain"); // result ==> "It might rain"

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
check(weatherSwitch("grey"), "It might rain"); // result ==> "It might rain"
// note: without break (or return) it falls into the next case.

//--------------------------------------------------------------------
// Object lookup - // Used instead of switch when you only turn a value into a result.

const weathers = { blue: "Nice weather", dark: "It might rain" };
check(weathers["blue"] ?? "I did not check the forecast", "Nice weather"); // result ==> "Nice weather"

//--------------------------------------------------------------------
// Early return - // Used to handle special cases first, so you avoid ifs inside ifs.

function divide(a, b) {
  if (b === 0) return null;
  return a / b;
}
check(divide(1, 0), null); // result ==> null

// §6 ── LOOPS ─────────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// for - // Used to repeat when you need the index (start; stop; step).

const out = [];
for (let i = 1; i <= 3; i++) out.push(i);
check(out, [1, 2, 3]); // result ==> [1, 2, 3]

//--------------------------------------------------------------------
// while - // Used to repeat when you don't know how many times.

let counter = 1;
const outWhile = [];
while (counter <= 3) {
  outWhile.push(counter);
  counter += 1; // forget this = infinite loop
}
check(outWhile, [1, 2, 3]); // result ==> [1, 2, 3]

//--------------------------------------------------------------------
// do...while - // Used to repeat, but it always runs at least once.

let k = 10;
do {
  k++;
} while (k < 5); // false from the start, but it ran once
check(k, 11); // result ==> 11

//--------------------------------------------------------------------
// for...of - // Used to walk the VALUES of an array, string, Map or Set. The most used.

const chars = [];
for (const ch of "abc") chars.push(ch);
check(chars, ["a", "b", "c"]); // result ==> ["a", "b", "c"]
// note: for...in gives the KEYS of an object (see §12), never use it on arrays.

//--------------------------------------------------------------------
// for...of + entries() - // Used to get the index AND the value in a for...of.

const pairs = [];
for (const [i, v] of ["x", "y"].entries()) pairs.push(`${i}:${v}`);
check(pairs, ["0:x", "1:y"]); // result ==> ["0:x", "1:y"]

//--------------------------------------------------------------------
// break / continue - // break leaves the loop; continue jumps to the next round.

const odds = [];
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  if (i > 5) break;
  odds.push(i);
}
check(odds, [1, 3, 5]); // result ==> [1, 3, 5]
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
check(positions[3], "[1,1]=4"); // result ==> "[1,1]=4"

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
check(found, [1, 1]); // result ==> [1, 1]

// §7 ── STRINGS ───────────────────────────────────────────────────────────────
// note: no string method changes the original; they all give back a NEW string.

//--------------------------------------------------------------------
// length - // Used to count the letters. It is a property, so no ().

const word = "Tiago";
check(word.length, 5); // result ==> 5

//--------------------------------------------------------------------
// s[i] / at() - // Used to get the letter at an index. at() also takes negatives.

check(word[2], "a"); // result ==> "a"
check(word.at(-1), "o"); // result ==> "o" (last letter)
check(word[99], undefined); // result ==> undefined

//--------------------------------------------------------------------
// charAt() - // Used to get the letter at the index you put inside ().

check(word.charAt(2), "a"); // result ==> "a"
// note: if the index doesn't exist you get "" (empty string).

//--------------------------------------------------------------------
// indexOf() / lastIndexOf() - // Used to find where a piece of text starts.

check("Adelia".indexOf("lia"), 3); // result ==> 3
check("Adelia".indexOf("z"), -1); // result ==> -1 (not found)
check("banana".lastIndexOf("a"), 5); // result ==> 5 (searches from the end)

//--------------------------------------------------------------------
// includes() - // Checks if a text is inside the string (optional: index to start from).

check("Otorhinolaryngologist".includes("ary", 3), true); // result ==> true

//--------------------------------------------------------------------
// startsWith() / endsWith() - // Checks if the string starts or ends with a text.

check("file.js".startsWith("file"), true); // result ==> true
check("file.js".endsWith(".js"), true); // result ==> true

//--------------------------------------------------------------------
// slice(start, end) - // Used to cut a piece of the string. The end is NOT included.

const sentence = "I really cannot think of a sentence now...";
check(sentence.slice(16, 35), "think of a sentence"); // result ==> "think of a sentence"
check("We are cool".slice(0, 2), "We"); // result ==> "We" (indexes 0 and 1)
check("We are cool".slice(1), "e are cool"); // no end → to the end
check(sentence.slice(-5, -1), "ow.."); // result ==> "ow.." (negatives count from the end)

//--------------------------------------------------------------------
// substring(start, end) - // Same as slice, but negative numbers become 0.

check("Tiago".substring(0, 2), "Ti"); // result ==> "Ti"
check("Tiago".substring(-3), "Tiago"); // result ==> "Tiago"
// note: prefer slice().

//--------------------------------------------------------------------
// Capitalise - // Turns the first letter into uppercase.

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
check(cap("tiago"), "Tiago"); // result ==> "Tiago"

//--------------------------------------------------------------------
// toUpperCase() / toLowerCase() - // Turns the whole string into uppercase or lowercase.

check("Lisbon".toUpperCase(), "LISBON"); // result ==> "LISBON"
check("Lisbon".toLowerCase(), "lisbon"); // result ==> "lisbon"

//--------------------------------------------------------------------
// trim() - // Used to remove the spaces at both ends.

check("  hello  ".trim(), "hello"); // result ==> "hello"
// note: trimStart() / trimEnd() remove only one side.

//--------------------------------------------------------------------
// padStart(n, "0") - // Used to fill the left side until the string has n letters.

check("7".padStart(3, "0"), "007"); // result ==> "007"

//--------------------------------------------------------------------
// repeat(n) - // Used to repeat the string n times.

check("Awesome!".repeat(2), "Awesome!Awesome!"); // result ==> "Awesome!Awesome!"

//--------------------------------------------------------------------
// replace() / replaceAll() - // Used to swap text. replace only does the first one.

check("a-b-c".replace("-", "+"), "a+b-c"); // result ==> "a+b-c"
check("a-b-c".replaceAll("-", "+"), "a+b+c"); // result ==> "a+b+c"
check("a-b-c".replace(/-/g, "+"), "a+b+c"); // same with a regex /g

//--------------------------------------------------------------------
// split(separator) - // Turns a string into an array.

check("I love JS".split(" "), ["I", "love", "JS"]); // result ==> ["I", "love", "JS"]
check("abc".split(""), ["a", "b", "c"]); // result ==> ["a", "b", "c"]

//--------------------------------------------------------------------
// join(separator) - // Turns an array into a string.

check(["I", "will", "join"].join(" "), "I will join"); // result ==> "I will join"
check(["a", "b"].join(), "a,b"); // result ==> "a,b"
// note: with no separator it uses ",".

//--------------------------------------------------------------------
// Reverse a string - // Used in the classic interview question (and palindromes).

check([..."abc"].reverse().join(""), "cba"); // result ==> "cba"
const isPal = (s) => s === [...s].reverse().join("");
check(isPal("racecar"), true); // result ==> true

//--------------------------------------------------------------------
// charCodeAt() / String.fromCharCode() - // Used to turn a letter into its number code and back.

check("c".charCodeAt(0) - "a".charCodeAt(0), 2); // result ==> 2 (letter position 0..25, good for LeetCode)
check(String.fromCharCode(97), "a"); // result ==> "a"
// note: to sort text use localeCompare (see §11).

//--------------------------------------------------------------------
// Template literals - // Used to put values inside text with backticks ` ` and ${ }.

const n = 3;
check(`I have ${n * 2} apples`, "I have 6 apples"); // result ==> "I have 6 apples"
// note: backticks also allow text over several lines.

//--------------------------------------------------------------------
// Strings can't change - // Shows that writing to an index fails.

assert.throws(() => {
  const s = "abc";
  s[0] = "X";
}, TypeError); // result ==> TypeError (in strict mode)

// §8 ── NUMBERS AND MATH ──────────────────────────────────────────────────────

//--------------------------------------------------------------------
// toFixed() - // Used to round a number to the number of decimals inside ().

const x1 = 1987.8534;
check(x1.toFixed(1), "1987.9"); // result ==> "1987.9"
check((45).toFixed(2), "45.00"); // result ==> "45.00"
check(Number(x1.toFixed(1)), 1987.9); // back to a number
// note: it gives back TEXT, not a number.

//--------------------------------------------------------------------
// Number.isInteger() - // Checks if a number has no decimals.

check(Number.isInteger(x1), false); // result ==> false
check(Number.isInteger(5.0), true); // result ==> true

//--------------------------------------------------------------------
// Math.floor() / Math.ceil() - // Used to round down / up.

check(Math.floor(1.7), 1); // result ==> 1
check(Math.ceil(1.2), 2); // result ==> 2
check(Math.floor(-1.2), -2); // result ==> -2
// note: floor is NOT "drop the decimals" for negatives, use trunc.

//--------------------------------------------------------------------
// Math.trunc() - // Used to cut the decimals off.

check(Math.trunc(-1.2), -1); // result ==> -1
check(Math.trunc(7 / 2), 3); // result ==> 3 (integer division)

//--------------------------------------------------------------------
// Math.round() - // Used to round to the nearest number (.5 goes up).

check(Math.round(14.5), 15); // result ==> 15
check(Math.round(-14.5), -14); // result ==> -14 (.5 always goes towards +∞)

//--------------------------------------------------------------------
// parseInt(text, base) - // Used to read a whole number from the start of a text.

check(parseInt("12px", 10), 12); // result ==> 12 (stops at the junk)
check(parseInt("101", 2), 5); // result ==> 5 (binary → decimal)
check(parseInt("ff", 16), 255); // result ==> 255
check(["1", "2", "3"].map(parseInt), [1, NaN, NaN]); // result ==> [1, NaN, NaN]
check(["1", "2", "3"].map(Number), [1, 2, 3]); // ✔
// note: always pass the base; map(parseInt) passes the INDEX as the base.

//--------------------------------------------------------------------
// Number(text) - // Used to turn ALL the text into a number, or NaN.

check(Number("12px"), NaN); // result ==> NaN (all or nothing)
check(Number(""), 0); // result ==> 0
// note: an empty string becomes 0, watch out.

//--------------------------------------------------------------------
// parseFloat() - // Used to read a decimal number from the start of a text.

check(parseFloat("3.14abc"), 3.14); // result ==> 3.14

//--------------------------------------------------------------------
// toString(base) - // Turns a number into text in another base (2 binary, 16 hex).

check((5).toString(2), "101"); // result ==> "101"
check((10).toString(16).padStart(2, "0"), "0a"); // result ==> "0a"
const rgb = (r, g, b) =>
  [r, g, b]
    .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
check(rgb(300, 255, 0), "FFFF00"); // result ==> "FFFF00" (rgb → hex)

//--------------------------------------------------------------------
// Number.isNaN() - // Checks if a value is really NaN ("Not a Number").

check(typeof NaN, "number"); // result ==> "number" (yes, really)
check(Number.isNaN(0 / 0), true); // result ==> true
check(Number.isNaN("abc"), false); // result ==> false ✔
check(isNaN("abc"), true); // result ==> true (the global isNaN converts first)
check(1 / 0, Infinity); // result ==> Infinity

//--------------------------------------------------------------------
// Decimals are not exact - // Shows that 0.1 + 0.2 is not 0.3.

check(0.1 + 0.2 === 0.3, false); // result ==> false
check(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON, true); // compare like this
check((1.005).toFixed(2), "1.00"); // result ==> "1.00" (1.005 is stored as 1.00499…)
// note: for money, work in cents (whole numbers).

//--------------------------------------------------------------------
// BigInt - // Used for whole numbers bigger than 2^53 - 1. Add n at the end.

check(Number.MAX_SAFE_INTEGER, 2 ** 53 - 1);
check(2 ** 53 + 1 === 2 ** 53, true); // result ==> true (lost precision)
check(2n ** 64n, 18446744073709551616n); // result ==> 18446744073709551616n
check(BigInt(10) + 1n, 11n); // result ==> 11n
check(7n / 2n, 3n); // result ==> 3n (drops the decimals)
assert.throws(() => 1n + 1, TypeError); // you can't mix bigint and number

//--------------------------------------------------------------------
// Math.max() / Math.min() - // Used to get the biggest / smallest number.

const nums = [3, 9, 1];
check(Math.max(...nums), 9); // result ==> 9
check(Math.min(...nums), 1); // result ==> 1
check(Math.max(), -Infinity); // result ==> -Infinity (no numbers)
check(nums.reduce((a, b) => Math.min(a, b)), 1); // for huge arrays (spread has a limit)

//--------------------------------------------------------------------
// Math.random() - // Gives a random number from 0 up to 1 (1 never comes out).

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
for (let i = 0; i < 100; i++) {
  const r = randInt(1, 10);
  check(Number.isInteger(r) && r >= 1 && r <= 10, true); // result ==> 1..10, both included
}
// note: random decimal from min to max: Math.random() * (max - min) + min.

//--------------------------------------------------------------------
// Math.sqrt() / abs() / hypot() / sign() / cbrt() - // Used for everyday maths.

check(Math.sqrt(16), 4); // result ==> 4
check(Math.abs(-3), 3); // result ==> 3
check(Math.hypot(3, 4), 5); // result ==> 5
check(Math.sign(-5), -1); // result ==> -1
check(Math.cbrt(27), 3); // result ==> 3

// §9 ── ARRAYS: BASICS + METHODS THAT CHANGE IT ───────────────────────────────
// note: everything here changes the ORIGINAL array.

//--------------------------------------------------------------------
// push() / unshift() - // Used to add items at the end / at the start. Gives the new length.

const names = ["david", "costa"];
check(names.push("pereira"), 3); // result ==> 3
names.unshift("tiago");
check(names, ["tiago", "david", "costa", "pereira"]); // result ==> ["tiago", "david", "costa", "pereira"]
// note: push is fast; unshift is slow on big arrays (it moves every item).

//--------------------------------------------------------------------
// pop() / shift() - // Used to remove the last / first item. Gives the removed item.

check(names.pop(), "pereira"); // result ==> "pereira"
check(names.shift(), "tiago"); // result ==> "tiago"
check(names, ["david", "costa"]); // result ==> ["david", "costa"]

//--------------------------------------------------------------------
// splice(index, howMany, ...add) - // Used to remove, replace or insert items at an index.

const items = ["i1", "i2", "i3", "i4", "i5"];
check(items.splice(2, 1), ["i3"]); // result ==> ["i3"] (gives the removed ones)
check(items, ["i1", "i2", "i4", "i5"]);
items.splice(3, 1, "i10"); // replaces index 3
check(items, ["i1", "i2", "i4", "i10"]);
items.splice(3, 0, "i20"); // howMany = 0 → only inserts
check(items, ["i1", "i2", "i4", "i20", "i10"]); // result ==> ["i1", "i2", "i4", "i20", "i10"]

//--------------------------------------------------------------------
// fill(value, start, end) - // Used to fill positions with the same value (end not included).

const colors = ["red", "blue", "green"];
colors.fill("green", 1, 2);
check(colors, ["red", "green", "green"]); // result ==> ["red", "green", "green"]

//--------------------------------------------------------------------
// reverse() - // Turns the array backwards, in the original.

const rev = ["one", "two", "three"];
const revResult = rev.reverse();
check(rev, ["three", "two", "one"]); // result ==> ["three", "two", "one"]
check(revResult === rev, true); // result ==> true (the SAME array)
// note: sort() also changes the original (see §11).

//--------------------------------------------------------------------
// copyWithin(target, start) - // Used to copy part of the array over another part.

check([1, 2, 3, 4, 5].copyWithin(0, 3), [4, 5, 3, 4, 5]); // result ==> [4, 5, 3, 4, 5]

//--------------------------------------------------------------------
// length = 0 - // Used to empty an array.

const trash = [1, 2, 3];
trash.length = 0;
check(trash, []); // result ==> []

//--------------------------------------------------------------------
// Array.from() / Array.of() - // Used to create arrays.

check(new Array(3).fill(0), [0, 0, 0]); // result ==> [0, 0, 0]
check(Array.from({ length: 4 }, (_, i) => i * i), [0, 1, 4, 9]); // result ==> [0, 1, 4, 9]
check(Array.from("abc"), ["a", "b", "c"]); // result ==> ["a", "b", "c"]
check(Array.from(new Set([1, 1, 2])), [1, 2]); // result ==> [1, 2]
check(Array.of(7), [7]); // result ==> [7]
// note: new Array(7) would create 7 empty slots, not [7].

//--------------------------------------------------------------------
// Matrix with fill([]) - // Shows the trap: every row is the SAME array.

const bad = new Array(2).fill([]);
bad[0].push("x");
check(bad, [["x"], ["x"]]); // result ==> [["x"], ["x"]] ⚠
const good = Array.from({ length: 2 }, () => []); // ✔ a new row each time
good[0].push("x");
check(good, [["x"], []]); // result ==> [["x"], []]

// §10 ── ARRAYS: METHODS THAT DO NOT CHANGE IT ────────────────────────────────
// note: these give back a value or a NEW array; the callback gets (element, index, array).

const arr = [1, 2, 3, 4, 5, 6];

//--------------------------------------------------------------------
// at() - // Used to get the item at an index. Takes negatives too.

check(arr.at(-1), 6); // result ==> 6

//--------------------------------------------------------------------
// slice(start, end) - // Used to copy a piece of the array (end not included).

check(arr.slice(1, 3), [2, 3]); // result ==> [2, 3]
check(arr.slice(), arr); // no arguments = a copy

//--------------------------------------------------------------------
// concat() - // Used to join arrays into a new one.

check([1, 2].concat([3], [4]), [1, 2, 3, 4]); // result ==> [1, 2, 3, 4]

//--------------------------------------------------------------------
// includes() / indexOf() - // Checks if an item is there / gives its index or -1.

check(arr.includes(3), true); // result ==> true
check([NaN].includes(NaN), true); // result ==> true
check([NaN].indexOf(NaN), -1); // result ==> -1 (indexOf can't find NaN)

//--------------------------------------------------------------------
// map(element, index, array) - // Used to change every item and get a new array of the same size.

check([1, 2, 3].map((x) => x * 2), [2, 4, 6]); // result ==> [2, 4, 6]
const cities = ["miami", "lisbon", "paris"];
check(cities.map(cap), ["Miami", "Lisbon", "Paris"]); // result ==> ["Miami", "Lisbon", "Paris"]
check([1, 2, 3].map((x) => x > 1), [false, true, true]); // a condition gives true/false for EACH item
check([1, 2].map((x) => { x * 2; }), [undefined, undefined]); // ⚠ { } without return
// note: with { } you must write return, or you get undefined.

//--------------------------------------------------------------------
// filter() - // Used to keep only the items that pass the test.

check(arr.filter((x) => x % 2 === 0), [2, 4, 6]); // result ==> [2, 4, 6]
const people = [
  { name: "Candice", age: 25 },
  { name: "Tammy", age: 30 },
  { name: "Allen", age: 49 },
  { name: "Nettie", age: 21 },
  { name: "Stuart", age: 17 },
];
check(
  people.filter((p) => p.age >= 21).map((p) => p.name),
  ["Candice", "Tammy", "Allen", "Nettie"]
); // result ==> ["Candice", "Tammy", "Allen", "Nettie"]

//--------------------------------------------------------------------
// reduce((acc, cur) => …, start) - // Turns a list of values into one single value.

check([2, 4, 6, 8].reduce((acc, cur) => acc + cur), 20); // result ==> 20
check([12, 9, 1, 8].reduce((acc, cur) => acc + cur, 23), 53); // result ==> 53 (starts at 23)
check(people.reduce((sum, p) => sum + p.age, 0), 142); // result ==> 142
check(["This", "is", "one"].reduce((s, w) => s + " " + w), "This is one");
assert.throws(() => [].reduce((a, b) => a + b), TypeError); // empty + no start → TypeError
const freq = [..."banana"].reduce((acc, ch) => {
  acc[ch] = (acc[ch] ?? 0) + 1;
  return acc;
}, {});
check(freq, { b: 1, a: 3, n: 2 }); // result ==> { b: 1, a: 3, n: 2 } (counting, see §14)
// note: always give a start value; without it, it starts at the first item.

//--------------------------------------------------------------------
// find() / findIndex() - // Used to get the first item that passes / its index (-1 if none).

check(people.find((p) => p.age > 26), { name: "Tammy", age: 30 }); // result ==> { name: "Tammy", age: 30 }
check(people.findIndex((p) => p.age > 100), -1); // result ==> -1
// note: find gives undefined when nothing passes.

//--------------------------------------------------------------------
// findLast() / findLastIndex() - // Same as find, but starts from the end.

check(arr.findLast((x) => x % 2 === 1), 5); // result ==> 5
check(arr.findLastIndex((x) => x < 3), 1); // result ==> 1

//--------------------------------------------------------------------
// some() - // Checks if at least ONE item passes the test.

check([1, 2, -3, 5].some((x) => x < 0), true); // result ==> true

//--------------------------------------------------------------------
// every() - // Checks if ALL items pass the test.

check([17, 28, 45, 11, 5].every((x) => x > 10), false); // result ==> false
check([17, 28, 45, 11, 5].every((x) => x > 3), true); // result ==> true
check([].every((x) => x > 100), true); // result ==> true ⚠ (empty array)

//--------------------------------------------------------------------
// flat(levels) / flatMap() - // Used to flatten arrays inside arrays.

check([1, [2, [3, [4]]]].flat(), [1, 2, [3, [4]]]); // result ==> [1, 2, [3, [4]]]
check([1, [2, [3, [4]]]].flat(Infinity), [1, 2, 3, 4]); // result ==> [1, 2, 3, 4]
check(["a b", "c"].flatMap((s) => s.split(" ")), ["a", "b", "c"]); // map + flat(1)

//--------------------------------------------------------------------
// toSorted() / toReversed() / toSpliced() / with() - // Same as sort/reverse/splice, but keep the original.

const orig = [3, 1, 2];
check(orig.toSorted(), [1, 2, 3]); // result ==> [1, 2, 3]
check(orig.toReversed(), [2, 1, 3]); // result ==> [2, 1, 3]
check(orig.toSpliced(0, 1), [1, 2]); // result ==> [1, 2]
check(orig.with(0, 9), [9, 1, 2]); // result ==> [9, 1, 2] (index 0 replaced)
check(orig, [3, 1, 2]); // result ==> [3, 1, 2] (untouched)

//--------------------------------------------------------------------
// forEach() - // Used to run something for each item. Gives back undefined.

const seen = [];
const ret = ["snake", "tiger"].forEach((a) => {
  if (a === "snake") return; // only leaves THIS round, like continue
  seen.push(a);
});
check(ret, undefined); // result ==> undefined
check(seen, ["tiger"]); // result ==> ["tiger"]
// note: no break; keys()/values()/entries() give iterators for for...of (see §6).

//--------------------------------------------------------------------
// Chaining - // Used to join filter, map and reduce in one go.

const total = people
  .filter((p) => p.age >= 21)
  .map((p) => p.age)
  .reduce((a, b) => a + b, 0);
check(total, 125); // result ==> 125

// §11 ── SORTING ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// sort() - // Used to sort the array. It changes the ORIGINAL and sorts as text.

const scores = [1, 10, 2, 21];
check([...scores].sort(), [1, 10, 2, 21]); // result ==> [1, 10, 2, 21] ⚠ ("10" < "2" as text)
// note: toSorted(fn) does the same but gives a copy. Ties keep their order.

//--------------------------------------------------------------------
// sort((a, b) => a - b) - // Used to sort numbers. a - b goes up, b - a goes down.

check([...scores].sort((a, b) => a - b), [1, 2, 10, 21]); // result ==> [1, 2, 10, 21]
check([4, 2, 5, 10, 3].sort((a, b) => b - a), [10, 5, 4, 3, 2]); // result ==> [10, 5, 4, 3, 2]
// note: negative → a first; positive → b first; 0 → keep the order.

//--------------------------------------------------------------------
// Sorting text - // Shows that plain sort puts numbers, then UPPERCASE, then lowercase.

check(["word", "Word", "1 Word"].sort(), ["1 Word", "Word", "word"]); // result ==> ["1 Word", "Word", "word"]

//--------------------------------------------------------------------
// localeCompare() - // Used to sort text in "human" order, with accents and case.

const words = ["b", "A", "á", "a", "B"];
check(words.toSorted((a, b) => a.localeCompare(b, "pt")), ["a", "A", "á", "b", "B"]); // result ==> ["a", "A", "á", "b", "B"]
// note: the Portuguese locale and the "á" are on purpose.

//--------------------------------------------------------------------
// Sort by 2 fields - // Used to sort objects by one field and break ties with another (||).

const ps = [
  { n: "Rui", age: 30 },
  { n: "Ana", age: 25 },
  { n: "Bia", age: 30 },
];
check(
  ps.toSorted((a, b) => b.age - a.age || a.n.localeCompare(b.n)).map((p) => p.n),
  ["Bia", "Rui", "Ana"]
); // result ==> ["Bia", "Rui", "Ana"]

// §12 ── OBJECTS ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Create / update / delete - // Used to change an object's keys. It changes the original.

const car = { brand: "VW", year: 2010 };
car.color = "blue"; // create
car.year = 2012; // update
delete car.color; // delete
check(car, { brand: "VW", year: 2012 }); // result ==> { brand: "VW", year: 2012 }
check(car["brand"], "VW"); // result ==> "VW" ([ ] for a key in a variable)
check(car.missing, undefined); // result ==> undefined (no error)

//--------------------------------------------------------------------
// [key] in the literal - // Used to name a key with the value of a variable.

const field = "job";
const person = { name: "Tiago", [field]: "web dev" };
check(person.job, "web dev"); // result ==> "web dev"
check(person[field], "web dev");

//--------------------------------------------------------------------
// Shortcuts - // Used to write { ageX } instead of { ageX: ageX }, and short methods.

const ageX = 35;
const short = { ageX, hi() { return "hello"; } };
check(short.ageX, 35); // result ==> 35
check(short.hi(), "hello"); // result ==> "hello"

//--------------------------------------------------------------------
// "key" in obj / Object.hasOwn() - // Checks if a key exists. hasOwn ignores inherited ones.

check("brand" in car, true); // result ==> true
check("toString" in car, true); // result ==> true ⚠ (inherited)
check(Object.hasOwn(car, "toString"), false); // result ==> false ✔

//--------------------------------------------------------------------
// Object.keys() / values() / entries() - // Used to get the keys, the values, or [key, value] pairs.

const someObj = { key1: "value1", key2: "value2" };
check(Object.keys(someObj), ["key1", "key2"]); // result ==> ["key1", "key2"]
check(Object.values(someObj), ["value1", "value2"]); // result ==> ["value1", "value2"]
check(Object.entries({ foo: "bar", baz: 42 }), [["foo", "bar"], ["baz", 42]]); // result ==> [["foo", "bar"], ["baz", 42]]

//--------------------------------------------------------------------
// Object.fromEntries() - // Turns [key, value] pairs back into an object.

const prices = { bread: 1, milk: 2 };
const doubled = Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, v * 2]));
check(doubled, { bread: 2, milk: 4 }); // result ==> { bread: 2, milk: 4 }
// note: entries + map + fromEntries = a "map" over an object.

//--------------------------------------------------------------------
// for...in - // Used to walk the KEYS of an object.

const keyList = [];
for (const key in someObj) keyList.push(`${key}=${someObj[key]}`);
check(keyList, ["key1=value1", "key2=value2"]); // result ==> ["key1=value1", "key2=value2"]
for (const [key, value] of Object.entries(someObj)) check(someObj[key], value);
// note: for...in also gives inherited keys; prefer Object.entries.

//--------------------------------------------------------------------
// Key order - // Shows that number keys come first (in order), then text keys as created.

check(Object.keys({ b: 1, 2: 1, a: 1, 1: 1 }), ["1", "2", "b", "a"]); // result ==> ["1", "2", "b", "a"]

//--------------------------------------------------------------------
// Object.assign() - // Used to copy keys from one object into another. It changes the target.

check(Object.assign({ a: 1 }, { b: 2 }), { a: 1, b: 2 }); // result ==> { a: 1, b: 2 }

//--------------------------------------------------------------------
// Object.freeze() - // Used to block changes, but only on the first level.

const frozen = Object.freeze({ a: 1, inner: { b: 1 } });
assert.throws(() => { frozen.a = 2; }, TypeError); // result ==> TypeError (strict mode)
frozen.inner.b = 2; // ⚠ this works
check(frozen.inner.b, 2); // result ==> 2

//--------------------------------------------------------------------
// Object.groupBy() - // Used to split an array into groups by a key.

const groups = Object.groupBy(people, (p) => (p.age >= 21 ? "adult" : "minor"));
check({ ...groups }, {
  adult: people.slice(0, 4),
  minor: [people[4]],
}); // result ==> { adult: [4 people], minor: [Stuart] }
// note: it has no prototype, hence the { ... }. Map.groupBy does the same but gives a Map.

//--------------------------------------------------------------------
// JSON.stringify() / JSON.parse() - // Turns an object into text and back.

const json = JSON.stringify({ a: 1, b: [true, null] });
check(json, '{"a":1,"b":[true,null]}'); // result ==> '{"a":1,"b":[true,null]}'
check(JSON.parse(json), { a: 1, b: [true, null] }); // result ==> { a: 1, b: [true, null] }
check(JSON.stringify({ f() {}, u: undefined }), "{}"); // result ==> "{}" (functions and undefined vanish)
assert.throws(() => JSON.parse("{a:1}"), SyntaxError); // keys need quotes
// note: a Date becomes a string.

// §13 ── DESTRUCTURING, SPREAD, REST ──────────────────────────────────────────
// note: "..." on the RIGHT of = or in a call is spread; on the LEFT or in parameters is rest.

//--------------------------------------------------------------------
// const [a, b] = array - // Used to pull values out of an array by POSITION.

const [tomato, mushroom, ...rest] = ["🍅", "🍄", "🥦", "🥒"];
check(tomato, "🍅"); // result ==> "🍅"
check(mushroom, "🍄"); // result ==> "🍄"
check(rest, ["🥦", "🥒"]); // result ==> ["🥦", "🥒"]
const [, second] = [1, 2, 3]; // a comma skips a position
check(second, 2); // result ==> 2
const [d1 = "default"] = []; // default value
check(d1, "default"); // result ==> "default"

//--------------------------------------------------------------------
// Swap - // Used to swap two variables without a temporary one.

let sa = 1, sb = 2;
[sa, sb] = [sb, sa];
check([sa, sb], [2, 1]); // result ==> [2, 1]

//--------------------------------------------------------------------
// const { a, b } = object - // Used to pull values out of an object by NAME.

const { name: personName, job, city = "Lisbon" } = person;
check(personName, "Tiago"); // result ==> "Tiago" (renamed with :)
check(job, "web dev"); // result ==> "web dev"
check(city, "Lisbon"); // result ==> "Lisbon" (default with =)
const { profile: { name: profileName } } = user; // inside another object
check(profileName, "Ana"); // result ==> "Ana"

//--------------------------------------------------------------------
// const { a, ...rest } = object - // Used to take one key out and keep the rest.

const { year, ...withoutYear } = car;
check(year, 2012); // result ==> 2012
check(withoutYear, { brand: "VW" }); // result ==> { brand: "VW" }

//--------------------------------------------------------------------
// Destructuring parameters - // Used to read an object's keys right in the function header.

const introduce = ({ name, age = 0 }) => `${name} (${age})`;
check(introduce({ name: "Rui" }), "Rui (0)"); // result ==> "Rui (0)"

//--------------------------------------------------------------------
// Spread [...array] - // Used to copy and join arrays.

const alumni = ["Tiago", "John"];
const students = [...alumni, "Xico"];
check(alumni, ["Tiago", "John"]); // result ==> ["Tiago", "John"] (untouched)
check(students, ["Tiago", "John", "Xico"]); // result ==> ["Tiago", "John", "Xico"]
check(Math.max(...[1, 5, 3]), 5); // spread into a function call
// note: it is a shallow copy (see §15).

//--------------------------------------------------------------------
// Spread {...object} - // Used to copy and join objects. The last key wins.

const base = { a: 1, b: 2 };
check({ ...base, b: 3 }, { a: 1, b: 3 }); // result ==> { a: 1, b: 3 }

//--------------------------------------------------------------------
// Rest (...args) - // Used to gather all the arguments into a real array.

const sumAll = (...ns) => ns.reduce((a, b) => a + b, 0);
check(sumAll(1, 2, 3), 6); // result ==> 6

// §14 ── MAP, SET, WEAKMAP ───────────────────────────────────────────────────

//--------------------------------------------------------------------
// Map - // Used to store key → value pairs; keys can be ANY type and keep their order.

const m = new Map();
m.set("a", 1).set("b", 2); // set gives back the Map → you can chain
check(m.get("a"), 1); // result ==> 1
check(m.get("z"), undefined); // result ==> undefined
check(m.has("b"), true); // result ==> true
check(m.size, 2); // result ==> 2
const objKey = { id: 1 };
m.set(objKey, "object as key");
check(m.get(objKey), "object as key"); // result ==> "object as key"
m.delete(objKey);
for (const [key, value] of m) check(m.get(key), value);
// note: in a plain {} that key would become "[object Object]". Also: clear(), keys(), values(), entries().

//--------------------------------------------------------------------
// Counting with a Map - // Used to count how many times each thing appears (LeetCode!).

const counts = new Map();
for (const ch of "hello") counts.set(ch, (counts.get(ch) ?? 0) + 1);
check(counts.get("l"), 2); // result ==> 2
check([...counts.keys()], ["h", "e", "l", "o"]); // result ==> ["h", "e", "l", "o"] (insertion order)

//--------------------------------------------------------------------
// Map ↔ object - // Used to turn a Map into an object and back.

check(Object.fromEntries(new Map([["x", 1]])), { x: 1 }); // result ==> { x: 1 }
check([...new Map(Object.entries({ y: 2 }))], [["y", 2]]); // result ==> [["y", 2]]

//--------------------------------------------------------------------
// Set - // Used to store UNIQUE values; has() is very fast. Good for "seen it?".

const s = new Set([1, 2, 2, 3]);
check(s.size, 3); // result ==> 3
s.add(3); // already there → ignored
check(s.has(2), true); // result ==> true
check([...new Set([3, 1, 3, 2, 1])], [3, 1, 2]); // result ==> [3, 1, 2] (remove duplicates)
check(new Set([[1], [1]]).size, 2); // result ==> 2 ⚠ (objects compare by reference)

//--------------------------------------------------------------------
// union() / intersection() / difference() - // Used to combine two Sets.

const A = new Set([1, 2, 3]);
const B = new Set([2, 3, 4]);
check([...A.union(B)], [1, 2, 3, 4]); // result ==> [1, 2, 3, 4]
check([...A.intersection(B)], [2, 3]); // result ==> [2, 3]
check([...A.difference(B)], [1]); // result ==> [1]

//--------------------------------------------------------------------
// WeakMap - // Used to attach data to an object without keeping it in memory forever.

const cache = new WeakMap();
const element = {};
cache.set(element, { clicks: 1 });
check(cache.get(element).clicks, 1); // result ==> 1
assert.throws(() => cache.set("string", 1), TypeError); // keys must be objects
// note: you can't loop over a WeakMap.

// §15 ── COPIES: SHALLOW VS DEEP ──────────────────────────────────────────────
// note: b = a copies nothing, it is the same object with two names.

//--------------------------------------------------------------------
// Shallow copy {...o} / [...a] - // Copies only the first level; objects inside stay SHARED.

const book1 = { author: "Charlotte Bronte", tags: ["romance"] };
const shallow = { ...book1 };
check(shallow === book1, false); // result ==> false (different objects…)
shallow.tags.push("classic");
check(book1.tags, ["romance", "classic"]); // result ==> ["romance", "classic"] ⚠ (…but the array is shared)
// note: a.slice() and Object.assign({}, o) are shallow too.

//--------------------------------------------------------------------
// structuredClone() - // Used to make a full DEEP copy (Date, Map and Set work).

const original = { d: new Date(0), tags: ["a"], m: new Map([[1, 2]]) };
const deep = structuredClone(original);
deep.tags.push("b");
check(original.tags, ["a"]); // result ==> ["a"] ✔ (independent)
check(deep.d instanceof Date, true); // result ==> true
check(deep.m.get(1), 2); // result ==> 2
assert.throws(() => structuredClone({ f() {} })); // functions can't be copied

//--------------------------------------------------------------------
// JSON.parse(JSON.stringify(x)) - // The old deep copy. It breaks Dates, Maps and functions.

check(typeof JSON.parse(JSON.stringify(original)).d, "string"); // result ==> "string" ⚠

// §16 ── FUNCTIONS ────────────────────────────────────────────────────────────
// note: functions are values: store them, pass them, return them.

//--------------------------------------------------------------------
// function name() {} - // A declaration. You can call it before the line it is on.

check(declared(2), 4); // result ==> 4 (hoisting)
function declared(a) {
  return a * 2;
}

//--------------------------------------------------------------------
// const f = function () {} - // An expression. You can't use it before its line.

const expression = function (a) {
  return a * 2;
};
check(expression(2), 4); // result ==> 4

//--------------------------------------------------------------------
// Arrow (a) => a * 2 - // A short function. One line gives back its value on its own.

const arrow = (a) => a * 2;
const arrowBlock = (a) => {
  return a * 2; // with { } you need return
};
const arrowObject = () => ({ ok: true }); // to return an object, wrap it in ( )
check(arrow(2) + arrowBlock(2), 8); // result ==> 8
check(arrowObject(), { ok: true }); // result ==> { ok: true }
// note: an arrow has no "this" of its own (see §18).

//--------------------------------------------------------------------
// Default parameters - // Used to give a parameter a value when none is passed.

const greet = (name = "anonymous") => `hello ${name}`;
check(greet(), "hello anonymous"); // result ==> "hello anonymous"
check(greet(undefined), "hello anonymous"); // undefined uses the default…
check(greet(null), "hello null"); // …null does not
check((() => {})(), undefined); // no return → undefined

//--------------------------------------------------------------------
// Objects passed in - // Shows that a function can change an object you give it.

const mutate = (o) => { o.x = 1; };
const target = {};
mutate(target);
check(target.x, 1); // result ==> 1
// note: numbers and strings are copied, so the function can't change yours.

//--------------------------------------------------------------------
// Callback - // A function passed as an ARGUMENT, for another function to call later.

const applyFn = (value, callback) => callback(value);
check(applyFn(5, (v) => v + 1), 6); // result ==> 6

//--------------------------------------------------------------------
// Higher-order function - // A function that takes or gives back another function.

const multiplier = (factor) => (n) => n * factor;
const triple = multiplier(3);
check(triple(4), 12); // result ==> 12
// note: map, filter and reduce are higher-order functions.

//--------------------------------------------------------------------
// Recursion - // A function that calls itself. It ALWAYS needs a stop case.

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
check(factorial(5), 120); // result ==> 120

//--------------------------------------------------------------------
// IIFE - // A function called right where it is written (common in old code).

const iife = (() => 42)();
check(iife, 42); // result ==> 42

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
check(counterA.get(), 2); // result ==> 2
check(counterB.get(), 1); // result ==> 1 (each call has its own count)

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
check(fib(50), 12586269025); // result ==> 12586269025

//--------------------------------------------------------------------
// var vs let in a loop - // Shows the classic question: var shares ONE variable, let makes a new one.

const fnsVar = [];
for (var iv = 0; iv < 3; iv++) fnsVar.push(() => iv);
const fnsLet = [];
for (let il = 0; il < 3; il++) fnsLet.push(() => il);
check(fnsVar.map((fn) => fn()), [3, 3, 3]); // result ==> [3, 3, 3]
check(fnsLet.map((fn) => fn()), [0, 1, 2]); // result ==> [0, 1, 2]

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

check(account.normal(), "Tiago"); // result ==> "Tiago"
const loose = account.normal; // ⚠ taken off the object
check(loose(), undefined); // result ==> undefined (strict mode)
// note: with new F(), this is the new object.

//--------------------------------------------------------------------
// Arrow and this - // Shows that an arrow uses the "this" of the place around it.

check(account.withArrow(), "Tiago"); // result ==> "Tiago"
// note: a method written as an arrow { f: () => this } does NOT see the object.

//--------------------------------------------------------------------
// call() / apply() - // Used to call a function with the "this" you choose.

check(account.normal.call({ owner: "Ana" }), "Ana"); // result ==> "Ana" (arguments one by one)
check(account.normal.apply({ owner: "Rui" }, []), "Rui"); // result ==> "Rui" (arguments in an array)

//--------------------------------------------------------------------
// bind() - // Used to make a NEW function with "this" fixed forever.

const bound = account.normal.bind({ owner: "Bia" });
check(bound(), "Bia"); // result ==> "Bia"

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
check(def.name, "Adelia"); // result ==> "Adelia" (default value)
check(tiago.birthYear(2020), 1987); // result ==> 1987

//--------------------------------------------------------------------
// get / set - // Used to make a property that is computed or checked. No () to use it.

check(tiago.intro, "Tiago, 33"); // result ==> "Tiago, 33"
assert.throws(() => { tiago.safeAge = -1; }, RangeError); // result ==> RangeError

//--------------------------------------------------------------------
// #private - // Used for fields that only the class itself can see.

check(tiago.checkSecret("1234"), true); // result ==> true
check(tiago.secret, undefined); // result ==> undefined (hidden from outside)

//--------------------------------------------------------------------
// static - // Used for things that belong to the class, not to each object.

check(Person.species, "human"); // result ==> "human"
check(Person.makeBaby("Bia").age, 0); // result ==> 0
check(tiago.species, undefined); // result ==> undefined

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
check(rui.intro, "Rui, 33 — 175cm"); // result ==> "Rui, 33 — 175cm"
check(rui instanceof Athlete, true); // result ==> true
check(rui instanceof Person, true); // result ==> true
check(rui.birthYear(2020), 1987); // result ==> 1987 (inherited method)

//--------------------------------------------------------------------
// Prototypes - // Shows what a class does underneath: objects share methods through a chain.

check(Object.getPrototypeOf(tiago), Person.prototype);
check(Object.getPrototypeOf(Athlete.prototype), Person.prototype);
check(Object.hasOwn(tiago, "birthYear"), false); // result ==> false (shared, not copied)
check(typeof Person, "function"); // result ==> "function"

//--------------------------------------------------------------------
// Object.create() - // Used to make an object that inherits from another object.

const protoBase = { speak() { return "hello from " + this.n; } };
const child = Object.create(protoBase);
child.n = "child";
check(child.speak(), "hello from child"); // result ==> "hello from child"

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
check(steps, ["try", "catch TypeError", "finally"]); // result ==> ["try", "catch TypeError", "finally"]
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
  check(e instanceof ValidationError, true); // result ==> true
  check(e instanceof Error, true); // result ==> true
  check(e.cause instanceof SyntaxError, true); // result ==> true
}

//--------------------------------------------------------------------
// catch { } - // Used when you don't need the error itself.

let failed = false;
try { null.x; } catch { failed = true; }
check(failed, true); // result ==> true

//--------------------------------------------------------------------
// finally after return - // Shows that finally runs even when try returns.

const withFinally = () => { try { return "try"; } finally { steps.push("finally runs"); } };
check(withFinally(), "try"); // result ==> "try"
check(steps.at(-1), "finally runs"); // result ==> "finally runs"

// §21 ── DATES ────────────────────────────────────────────────────────────────
// note: months start at 0 (January = 0) and getDay() 0 = Sunday.

//--------------------------------------------------------------------
// new Date(y, m, d) - // Used to create a date in local time.

const date = new Date(2024, 0, 31); // 31 Jan 2024
check(date.getFullYear(), 2024); // result ==> 2024
check(date.getMonth(), 0); // result ==> 0 (January)
check(date.getDate(), 31); // result ==> 31 (day of the month)
check(date.getDay(), 3); // result ==> 3 (Wednesday)
// note: also getHours(), getMinutes(), getSeconds(), getMilliseconds().

//--------------------------------------------------------------------
// setDate() - // Used to change the day. It rolls over to the next month on its own.

date.setDate(date.getDate() + 1); // add 1 day
check(date.getMonth(), 1); // result ==> 1 (February)
check(date.getDate(), 1); // result ==> 1

//--------------------------------------------------------------------
// Date.UTC() - // Used to do date maths without time zone surprises.

const days = (Date.UTC(2024, 2, 1) - Date.UTC(2024, 1, 1)) / 86_400_000;
check(days, 29); // result ==> 29 (2024 is a leap year)

//--------------------------------------------------------------------
// toISOString() - // Turns a date into "YYYY-MM-DDTHH:mm:ss.sssZ", always in UTC.

check(new Date(Date.UTC(2024, 0, 15)).toISOString(), "2024-01-15T00:00:00.000Z"); // result ==> "2024-01-15T00:00:00.000Z"

//--------------------------------------------------------------------
// new Date("text") - // Used to read a date from text.

check(new Date("2024-01-15").getTime(), Date.UTC(2024, 0, 15)); // getTime() = ms since 1970
// note: "2024-01-15" is read as UTC, but "2024-01-15T10:00" as local time.

//--------------------------------------------------------------------
// Date.now() - // Gives the ms for right now (good to measure time).

check(typeof Date.now(), "number"); // result ==> a number like 1731500000000

//--------------------------------------------------------------------
// Intl.DateTimeFormat() - // Used to show a date the way a country writes it.

check(new Intl.DateTimeFormat("pt-PT").format(new Date(2024, 0, 5)), "05/01/2024"); // result ==> "05/01/2024"

//--------------------------------------------------------------------
// Comparing dates - // Used with < > or getTime(), NEVER with ===.

check(new Date(0) < new Date(1), true); // result ==> true
check(new Date(0) === new Date(0), false); // result ==> false (two objects)
check(new Date(0).getTime() === new Date(0).getTime(), true); // result ==> true

// §22 ── REGEX ────────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Regex pieces - // Shows the symbols you use most in a /pattern/.

check(/^\d{4}-\d{3}$/.test("1000-123"), true); // result ==> true (Portuguese postal code)
check(/^\w+@\w+\.[a-z]{2,4}$/.test("tiago@mail.com"), true); // result ==> true
check(/^[^0-9]+\s?!?$/.test("Lisbon !"), true); // result ==> true
// note: . any · \d digit · \w letter/digit/_ · \s space · [^abc] none of these · ^ $ start/end.
// note: * 0+ · + 1+ · ? 0 or 1 · {2,4} 2 to 4 · a|b · (…) group · (?<n>…) named group.

//--------------------------------------------------------------------
// test() - // Checks if the text matches the pattern.

check(/hello/i.test("HELLO world"), true); // result ==> true
// note: flags: g all · i ignore case · m multiline · s "." matches \n · u unicode.

//--------------------------------------------------------------------
// match() - // Used to get the matches. With g you get all of them.

check("a1b22c333".match(/\d+/g), ["1", "22", "333"]); // result ==> ["1", "22", "333"]
check("no numbers".match(/\d/), null); // result ==> null (not [])
const iso = "2024-01-15".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
check(iso.groups.month, "01"); // result ==> "01"

//--------------------------------------------------------------------
// replace() with a regex - // Used to swap text; $1 / $<name> is what the group caught.

check("2024-01-15".replace(/(\d+)-(\d+)-(\d+)/, "$3/$2/$1"), "15/01/2024"); // result ==> "15/01/2024"
check("A man, a plan!".toLowerCase().replace(/[^a-z0-9]/g, ""), "amanaplan"); // result ==> "amanaplan"

//--------------------------------------------------------------------
// matchAll() - // Used to loop over every match with its groups (needs g).

check([..."k1=v1;k2=v2".matchAll(/(\w+)=(\w+)/g)].map((mm) => mm[2]), ["v1", "v2"]); // result ==> ["v1", "v2"]

//--------------------------------------------------------------------
// split() with a regex - // Used to cut text by a pattern.

check("a, b ,c".split(/\s*,\s*/), ["a", "b", "c"]); // result ==> ["a", "b", "c"]

//--------------------------------------------------------------------
// lastIndex trap - // Shows that a regex with g remembers where it stopped.

const reG = /a/g;
check(reG.test("a"), true); // result ==> true
check(reG.test("a"), false); // result ==> false (it went on from index 1)

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
  check(await p, "done"); // result ==> "done"
  // note: an async function always gives back a Promise; await only works inside async (or ESM top level).

  //--------------------------------------------------------------------
  // then() / catch() / finally() - // The older way to wait, step by step.

  const viaThen = await Promise.resolve(2)
    .then((v) => v * 10) // gives a value → the next then gets it
    .then((v) => sleep(1, v + 1)) // gives a Promise → it waits for it
    .catch(() => -1) // catches errors from any step above
    .finally(() => {}); // always runs, does not change the value
  check(viaThen, 21); // result ==> 21

  //--------------------------------------------------------------------
  // try / catch with await - // Used to catch an error from an async function.

  async function fails() {
    throw new Error("blew up"); // = a rejected Promise
  }
  try {
    await fails();
    assert.fail("should not get here");
  } catch (e) {
    check(e.message, "blew up"); // result ==> "blew up"
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
  check([seq1, seq2], [par1, par2]); // result ==> ["a", "b"]
  check(tSeq >= 55, true); // result ==> true (the waits add up; timers never fire early)
  void tPar; // ≈ 30ms, not checked: a busy machine could make it fail at random

  //--------------------------------------------------------------------
  // Promise.all() - // Used to wait for ALL. Keeps the array order; fails on the first error.

  check(await Promise.all([sleep(20, "slow"), sleep(1, "fast")]), ["slow", "fast"]); // result ==> ["slow", "fast"]
  await assert.rejects(Promise.all([sleep(1, 1), Promise.reject(new Error("x"))]), /x/);

  //--------------------------------------------------------------------
  // Promise.allSettled() - // Used to wait for all to finish, good or bad. Never fails.

  const settled = await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("no"))]);
  check(settled.map((r) => r.status), ["fulfilled", "rejected"]); // result ==> ["fulfilled", "rejected"]
  check(settled[0].value, 1); // result ==> 1
  check(settled[1].reason.message, "no"); // result ==> "no"

  //--------------------------------------------------------------------
  // Promise.race() - // Gives the first one to FINISH (good or bad).

  check(await Promise.race([sleep(20, "slow"), sleep(1, "fast")]), "fast"); // result ==> "fast"

  //--------------------------------------------------------------------
  // Promise.any() - // Gives the first one that WORKS; fails only if all fail.

  check(await Promise.any([Promise.reject(new Error()), sleep(1, "ok")]), "ok"); // result ==> "ok"
  // note: when all fail you get an AggregateError.

  //--------------------------------------------------------------------
  // Timeout with race - // Used to give up when something takes too long.

  const withTimeout = (promise, ms) =>
    Promise.race([promise, sleep(ms).then(() => { throw new Error("timeout"); })]);
  await assert.rejects(withTimeout(sleep(50), 5), /timeout/); // result ==> Error "timeout"

  //--------------------------------------------------------------------
  // await in a loop - // Shows that for...of waits one by one.

  const order = [];
  for (const ms of [10, 1]) order.push(await sleep(ms, ms));
  check(order, [10, 1]); // result ==> [10, 1]
  // note: forEach does NOT wait, don't use it with async.

  // §24 ── EVENT LOOP ────────────────────────────────────────────────────────

  //--------------------------------------------------------------------
  // Event loop order - // Shows the order: normal code, then ALL microtasks, then ONE macrotask.

  const log = [];
  log.push("1 sync");
  setTimeout(() => log.push("5 macrotask: setTimeout 0"), 0);
  Promise.resolve().then(() => log.push("3 microtask: then"));
  queueMicrotask(() => log.push("4 microtask: queueMicrotask"));
  log.push("2 sync");
  await sleep(5); // gives the setTimeout time to run
  check(log, [
    "1 sync",
    "2 sync",
    "3 microtask: then",
    "4 microtask: queueMicrotask",
    "5 macrotask: setTimeout 0",
  ]); // result ==> 1, 2, 3, 4, 5
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
  check(q.join(""), "ABCDEF"); // result ==> "ABCDEF"

  // §25 ── TIMERS ────────────────────────────────────────────────────────────

  //--------------------------------------------------------------------
  // setTimeout() / clearTimeout() - // Used to run code ONCE after ms / to cancel it.

  const fired = [];
  const cancelledId = setTimeout(() => fired.push("never"), 5);
  clearTimeout(cancelledId);
  await sleep(10);
  check(fired, []); // result ==> [] (cancelled, it never ran)
  // note: ms is a minimum wait, not an exact one.

  //--------------------------------------------------------------------
  // setInterval() / clearInterval() - // Used to run code every ms until you stop it.

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
  check(tick, 3); // result ==> 3

  //--------------------------------------------------------------------
  // timers/promises - // Used to get a setTimeout you can await (a ready-made sleep).

  const { setTimeout: wait } = require("node:timers/promises");
  check(await wait(1, "value"), "value"); // result ==> "value"

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
  check(calls, ["tia"]); // result ==> ["tia"] (only the last one)
}

// §26 ── MODULES ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// CommonJS (require) - // Used in classic Node (.js by default, .cjs) to share code between files.

//   // math.js
//   module.exports = { sum };
//   // app.js
//   const { sum } = require("./math");
check(typeof module.exports, "object"); // result ==> "object" (this file is CommonJS)
check(typeof require, "function"); // result ==> "function"
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
// import() - // Used to load a module only when you need it (works in both).

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
