// JAVASCRIPT CHEAT SHEET

// DATA TYPES
// Primitives: number, string, boolean, undefined, null;
// Non-primitives: objects (arrays, objects, functions);

// let => para designar uma variavel;
// let name; declarar uma variavel;
// name = "Tiago"; atribuir um valor à variavel nome.

// const => para designar uma constante;

// DATAS DO JAVASCRIPT =================================================================================================================================================
/*
new Date().getDate()          // Get the day as a number (1-31)
new Date().getDay()           // Get the weekday as a number (0-6)
new Date().getFullYear()      // Get the four digit year (yyyy)
new Date().getHours()         // Get the hour (0-23)
new Date().getMilliseconds()  // Get the milliseconds (0-999)
new Date().getMinutes()       // Get the minutes (0-59)
new Date().getMonth()         // Get the month (0-11)
new Date().getSeconds()       // Get the seconds (0-59)
new Date().getTime()          // Get the time (milliseconds since January 1, 1970)
*/

// STRINGS ==============================================================================================================================================================

// charAt() // Serve para mostrar a letra afeta ao index do numero entre parentisis.

let word = "Tiago";

console.log("charAt(2) of Tiago =>", word.charAt(2));
// ==> result: a

//--------------------------------------------------------------------
// toFixed() // Serve para reduzir um numero com muitas casas décimais ao numero de casas decimais entre (), no nosso caso, 1.

let number = 1987.8534;

console.log("toFixed of the number 1987.8534 is =>", number.toFixed(1));
// ==> result: 1987.9

//--------------------------------------------------------------------
// indexOf() // Mostra o index do conjunto de letras colocadas entre (). A = 0, d = 1, e = 2, "lia" = 3 da pralavra Adélia.

let word2 = "Adelia";

console.log("indexOf of lia from Adelia is =>", word2.indexOf("lia"));
// ==> result: 3
// nota: se não existir a letra o index será -1
// nota2: o indexOf() retorna sempre o index da primeira letra encontrada, ou seja, o a em Adelia, sera sempre index 0.

//--------------------------------------------------------------------
// substring(0, 2) // O 2 não conta, ou seja, conta de 0 a 1, para contar o 2 teria que ser (0, 3) e por aí adiante. Ex: "Eu sou fixe." só apareceria a palavra Eu.

let sentence = "Eu sou fixe";

console.log('substring of "Eu sou fixe" is =>', sentence.substring(0, 2));
// ==> result: Eu
// Nota: Se nao se difinir um limite, por exemplo sentence.substring(1) o resultado será => u sou fixe
// começa no index definido e acaba no final.

let myName = "tiago";

console.log(myName.charAt(0).toUpperCase() + myName.substring(1));
// ==> result: Tiago

//--------------------------------------------------------------------
// toUpperCase() - // Para por a string toda em maiusculas.

let word3 = "Tiago Pereira";

console.log("toUpperCase() =>", word3.toUpperCase());
// ==> TIAGO PEREIRA

//--------------------------------------------------------------------
// toLowerCase() - // Para por a string toda em minusculas.

let word4 = "TiAgO PeReIrA";

console.log("toLowerCase() =>", word4.toLowerCase());
// ==> tiago pereira

//--------------------------------------------------------------------
// includes("string", starting index) - //para encontra a uma letra numa palavra, ou uma palavra numa frase, por exemplo: adelia.includes(ia) = true / let frase = "sou o tiago". frase.includes(tiago) = true

let str = "Otorrinolaringologista";

console.log('includes("ari", 3) =>', str.includes("ari", 3));
// ==> true

//--------------------------------------------------------------------
// length - // Mostra o numero de caracteres de uma string. Ex: Tiago.length = 5.

let str2 = "Tenho fome";

console.log("o comprimento da frase é =>", str2.length);
// ==> 10

//--------------------------------------------------------------------
//Math.floor(variavel numero) - // tira as casas décimais.

let number2 = 17031987.321654;

console.log("Math.floor do number: 17031987.321654 =>", Math.floor(number2));
// ==> 17031987

//--------------------------------------------------------------------
//Math.ceil(variavel numero) - // arredonda sempre para o próximo numero mais alto.

let number3 = 17031987.321654;

console.log("Math.ceil do number: 17031987.321654 =>", Math.ceil(number3));
// ==> 17031988

//--------------------------------------------------------------------
//Math.round(variavel numero) - // arrenda o numero tendo em consideração as casas decimais. ex: 14,2 = 14 ou 14.6 = 15.

let number4 = 17031987.321654;

console.log("Math.round do number: 17031987.321654 =>", Math.round(number4));
// ==> 17031987

//--------------------------------------------------------------------
//Math.random() * (max -min) + min - // Para tirar um numero aleatório entre de min ao max - 1. Se o minimo for 1 e o maximo 10, o numero aleatório será de 1 a 9, daí adicionar-se + o min que é 1.

console.log("Math.random() =>", Math.random() * (10 - 1) + 1);
// ==> 8.877566173131461

let randomNumber = Math.random() * (10 - 1) + 1;

console.log(randomNumber.toFixed(2));
// ==> 8.88


//--------------------------------------------------------------------
//Math.max()
var arrMAthMax = [1, 2, 3];
var max = arrMAthMax.reduce(function(a, b) {
  return Math.max(a, b);
});


//--------------------------------------------------------------------
//Math.min()
var arrMAthMin = [1, 2, 3];
var max = arrMAthMin.reduce(function(a, b) {
  return Math.max(a, b);
}); 



//--------------------------------------------------------------------
//typeof - // Para se saber de que tipo é a variavel. Ex: console.log(typeof variavel).

let typeOfelement = "check this shit out!";
let typeOfelement2 = 1987;

console.log(
  `O typeOfelement é uma => ${typeof typeOfelement} e o typeOfelement2 é um => ${typeof typeOfelement2}`
);
// result ==> O typeOfelement é uma => string e o typeOfelement2 é um => number

//--------------------------------------------------------------------
//repeat(n) - // Para repetir a string n vezes.

let repetição = "Awesome!";

console.log(
  `Vou repetirar a variavel repetição 5 vezes => ${repetição.repeat(5)}`
);
// result ==> Vou repetirar a variavel repetição 5 vezes => Awesome!Awesome!Awesome!Awesome!Awesome!

//--------------------------------------------------------------------
//slice(start, end) - // tira parte da string começada em start e que acabar em end, por exemplo: let frase = "sou um bacano"   frase.slice(7, 13) = bacano

let sliceExample = "Não sei que frase inventar já...";

//apenas quero a parte "que frase inventar"
console.log(
  `O slice da frase: ${sliceExample} é, segundo o que digo acima => ${sliceExample.slice(
    8,
    26
  )}`
);
// result ==> O slice da frase: Não sei que frase inventar já... é, segundo o que digo acima => que frase inventar

// usar o slice para a partir do final da frase.
let anotherSliceExample = sliceExample.slice(-5, -1);
console.log(anotherSliceExample);
// result ==> "já.." ou seja, começa a partir do final em 5 para o penultimo index.

//--------------------------------------------------------------------
//Number() - // Serve para converter uma string num número.

let strToNumber = "17031987";

console.log(`a string '17031987' agora é um => ${Number(strToNumber)}`);
// result ==> a string '17031987' agora é um => 17031987

//--------------------------------------------------------------------
//toString() // Para coverter um numero numa string

let dob = 17031987;

console.log(dob.toString());
// result ==> '17031987'

//--------------------------------------------------------------------
//replace('elemento a substituir', 'elemnto nova') - serve para substituir um elemento por outro.
let frase = "Vou usar o metodo replace(), vais gostar.";
let novaFrase = frase.replace("metodo", "string prototype");

console.log(novaFrase);
// resultado ==> Vou usar o string prototype replace(), vais gostar.

// ARRAYS ===========================================================================================================================================================

// Array Defenition: let myArray = [element1, element2, element3];

// Multi-dimensional array: let myMultiArray = [[1,2,3], [4,5,6], [7,8,9]]

//push() - // Adicionar um item ao final do array.

let arrayOfMyName = ["tiago", "david", "da", "costa", "prudente"];

arrayOfMyName.push("pereira");

console.log(arrayOfMyName);
// result ==> [ 'tiago', 'david', 'da', 'costa', 'prudente', 'pereira' ]

//--------------------------------------------------------------------
//unshift() - // Adiciona um item ao principio do array.

let arrayOfMyName2 = ["david", "da", "costa", "prudente", "pereira"];

arrayOfMyName2.unshift("tiago");

console.log(arrayOfMyName);
// result ==> [ 'tiago', 'david', 'da', 'costa', 'prudente', 'pereira' ]

//--------------------------------------------------------------------
//length - // Mostra o numero de itens do array.

let myArrayOfWords = ["word1", "word2", "word3", "word4", "word5"];

console.log(`O numero de items no meu array é: ${myArrayOfWords.length}`);
// result ==> O numero de items no meu array é: 5

//--------------------------------------------------------------------
//pop() - // Retira um item ao final do array.

let myArray = ["item1", "item2", "item3"];

myArray.pop();

console.log(myArray);
// result ==> [ 'item1', 'item2' ]

//--------------------------------------------------------------------
//shift() - // Retira um item ao inicio do array.

let myArray2 = ["item1", "item2", "item3"];

myArray2.shift();

console.log(myArray2);
// result ==> [ 'item2', 'item3' ]

//--------------------------------------------------------------------
//splice(index, nº de items a eliminar a partir do index definido, item que queremos substituir pelo que eliminamos) - // Retira um item à escolha no array

let myArray3 = ["item1", "item2", "item3", "item4", "item5"];
let myArray4 = ["item1", "item2", "item3", "item4", "item5"];

let mySplice = myArray3.splice(2, 1);

// substituir o item5 pelo item10
let newItem = myArray4.splice(4, 1, "item10");

console.log(mySplice);
// result ==> [ 'item3' ]

console.log(myArray3);
// result ==> [ 'item1', 'item2', 'item4', 'item5' ]

console.log(myArray4);
// result ==> [ 'item1', 'item2', 'item4', 'item10' ]

//--------------------------------------------------------------------
//split(" ") - // Transforma as palavras da string num array.

let stringToArray = "Curto imenso programar javascript";

let myNewArray = stringToArray.split(" ");

console.log(myNewArray);
// result ==> [ 'Curto', 'imenso', 'programar', 'javascript' ]

//--------------------------------------------------------------------
//split("") - // Transforma as letras da string num array.

let stringToArray2 = "Curto imenso programar javascript";

let myNewArray2 = stringToArray.split("");

console.log(myNewArray2);
/* result ==> [
  'C', 'u', 'r', 't', 'o', ' ',
  'i', 'm', 'e', 'n', 's', 'o',
  ' ', 'p', 'r', 'o', 'g', 'r',
  'a', 'm', 'a', 'r', ' ', 'j',
  'a', 'v', 'a', 's', 'c', 'r',
  'i', 'p', 't'
]*/

//--------------------------------------------------------------------
//join(" ") - // Transforma um array numa string.

let arrayToString = [
  "Eu",
  "vou",
  "tranformar",
  "este",
  "array",
  "numa",
  "string",
];

let newArrayToString = arrayToString.join(" ");

console.log(newArrayToString);
// result ==> Eu vou tranformar este array numa string

//--------------------------------------------------------------------
//concat() - // Serve para unir 2 array independentes.

let arrayOne = ["Sou", "um", "array", "independente"];
let arrayTwo = [
  "-",
  "Agora",
  "ja",
  "não",
  "sou",
  "um",
  "array",
  "independente",
];

let joinArrays = arrayOne.concat(arrayTwo);

console.log(joinArrays);
// result ==> ['Sou','um','array','independente','-','Agora','ja','não','sou','um','array','independente']

//--------------------------------------------------------------------
//includes() - // Serve para encontrar uma palavra dentro do array.

let arrayIncludes = ["Será", "que", "esta", "aqui", "o", "Tiago"];

console.log(arrayIncludes.includes("Tiago"));
// result ==> true

// FUNCTION FOR ARRAYS =================================================================================================================================================================

//forEach(item, index) loop - Serve essencialmente para arrays, contudo, não retorna valores. Ou seja, o retun não funciona.

let animalsArray = ["cobra", "tigre", "leão", "macaco"];

animalsArray.forEach((animal) => {
  console.log("my animal forEach array =>", animal);
});
// result ==> my animal forEach array =>, cobra
//            my animal forEach array =>, tigre
//            my animal forEach array =>, leão
//            my animal forEach array =>, macaco

//--------------------------------------------------------------------
// sort(a, b) - Serve para ordenar por ordem crescente ou descrescente números e/ou letras/palavras.

let fruit = ["cherries", "apples", "bananas"];

fruit.sort();

// result ==> ['apples', 'bananas', 'cherries']

let scores = [1, 10, 2, 21];
scores.sort(); // [1, 10, 2, 21]
// Observe que 10 vem antes do 2,
// porque '10' vem antes de '2' em ponto de código Unicode.

// para ordenar numero do maior para o mais pequeno, temos que usar os argumentos (a, b) e compara-los.
//Se o resultado de a-b for negativo o a vem antes do b, se for positivo, o b vem antes do a, se for igual, ficam na mesma posição.

// a - b para ordem crescente e b - a para ordem decrescente.
let numbersSort = [4, 2, 5, 10, 3];
numbersSort.sort((a, b) => b - a);

console.log("Os numeros ordenados por sort() são:", numbersSort);
// result ==> 5, 4, 3, 2, 10

let things = ["word", "Word", "1 Word", "2 Words"];
things.sort();

console.log(things);
// result ==> ['1 Word', '2 Words', 'Word', 'word']
// Em Unicode, números vêem antes de letras maiúsculas,
// as quais vêem antes das minúsculas.

// ordernar um array de strings por ordem alfabética
const wordsSort = ["Hello", "Goodbye", "First", "A", "a", "Second", "Third"];

wordsSort.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
});

console.log(wordsSort);
// result ==> ["A", "First", "Goodbye", "Hello", "Second", "Third", "a"]
// novamente as maisculas vêm antes da minuscula.
// para tal não acontecer, temos que por tudo em minusculas da seguinte forma.
wordsSort.sort((a, b) => {
  if (a.toLocaleLowerCase() > b.toLocaleLowerCase()) {
    return 1;
  }
  if (a.toLocaleLowerCase() < b.toLocaleLowerCase()) {
    return -1;
  }
  return 0;
});

//------------------------------------------------------------------
// Spread Operator [...array] - Serve para copiar arrays

let alumnis = ["Tiago", "João", "Joana"];

let alunos = [...alumnis];
alunos.push("Xico");

console.log("O resultado do Spread operator é:", alunos);
// result ==> O resultado do Spread operator é: [ 'Tiago', 'João', 'Joana', 'Xico' ]

//--------------------------------------------------------------------
// every(element, index, array) - // O every() serve para verificar se todos os elementos dentro do array satisfazem uma determinado condição se sim, devolve true, se não devolve false

let num = [17, 28, 45, 11, 5, 69];

let numGreaterThen10 = num.every((number) => {
  return number > 10;
});

console.log("Every => greater then 10 ==>", numGreaterThen10);
// result ==> false

let numGreaterThen3 = num.every((number) => {
  return number > 3;
});

console.log("Every => greater then 3 ==>", numGreaterThen3);
// result ==> true

//--------------------------------------------------------------------
// map(element, index, array) - // O map() percorre todos os elementos do array e retorna um novo array com o mesmo tamanho
// O map() é ideal para array de objectos, de forma a extrair apenas a informação que desejamos de cada objectos.

const arrayMap = [1, 2, 3];

const newMapArray = arrayMap.map((number) => number * 2);

console.log("map result =>", newMapArray);
// result ==> [ 2, 4, 6 ]
// NOTA com o forEach o exemplo acima não funcionaria.

var cities = [
  "miami",
  "barcelona",
  "madrid",
  "amsterdam",
  "berlin",
  "sao paulo",
  "lisbon",
  "mexico city",
  "paris",
];

let capCities = cities.map((city) => {
  return city.charAt(0).toUpperCase() + city.substring(1);
});

console.log("Tranformar a 1ª letra das cidades em maiuscula =>", capCities);

//--------------------------------------------------------------------
// reduce((acc, cur, index, array), valor inicial) - // O reduce() é um metodo que transforma uma lista de valores num só.

const reduceNumbers = [2, 4, 6, 8];

const reduceTotal = reduceNumbers.reduce((accumulator, currentValue) => {
  console.log(
    "accumulator is: ",
    accumulator,
    "and current value is: ",
    currentValue
  );
  return accumulator + currentValue;
});

console.log("total is: ", reduceTotal);
// accumulator is:  2 and current value is:  4
// accumulator is:  6 and current value is:  6
// accumulator is:  12 and current value is:  8
// total is:  20

const reduceNumbers2 = [12, 9, 1, 8];

const reduceTotal2 = reduceNumbers2.reduce((accumulator, currentValue) => {
  console.log(
    "accumulator is: ",
    accumulator,
    "and current value is: ",
    currentValue
  );
  return accumulator + currentValue;
}, 23); // <= notice the 23!!!

console.log("total is: ", reduceTotal2);

// accumulator is:  23 and current value is:  12
// accumulator is:  35 and current value is:  9
// accumulator is:  44 and current value is:  1
// accumulator is:  45 and current value is:  8
// total is:  53

const words = ["This", "is", "one", "big", "string"];

const bigString = words.reduce((sum, word) => sum + " " + word);

console.log(bigString);
// result ==> This is one big string

// Para aplicar o reduce num array de objectos precisamos iniciar a soma em 0 como o exemplo abaixo. Caso contrário nao funciona.
const people = [
  { name: "Candice", age: 25 },
  { name: "Tammy", age: 30 },
  { name: "Allen", age: 49 },
  { name: "Nettie", age: 21 },
  { name: "Stuart", age: 17 },
];

const ages = people.reduce((sum, person) => {
  return sum + person.age;
}, 0);

console.log("reduce:", ages);
// result ==> reduce: 142

//--------------------------------------------------------------------
// filter(element, index, array) - // O filter() é um metodo que transforma um array num novo array apenas com os valores que passarem a/as condições que definirmos.

var numbers = [1, 2, 3, 4, 5, 6];

var evenNumbers = numbers.filter((number) => {
  return number % 2 === 0;
});

console.log("filter:", evenNumbers);
// result ==> [ 2, 4, 6 ]

var peopleFilter = [
  { name: "Candice", age: 25 },
  { name: "Tammy", age: 30 },
  { name: "Allen", age: 20 },
  { name: "Nettie", age: 21 },
  { name: "Stuart", age: 17 },
  { name: "Bill", age: 19 },
];

const ofDrinkingAge = peopleFilter.filter((person) => person.age >= 21);

console.log(ofDrinkingAge);
// result ==>
// [
//   { name: 'Candice', age: 25 },
//   { name: 'Tammy', age: 30 },
//   { name: 'Nettie', age: 21 }
// ]

//--------------------------------------------------------------------
// reverse(element, index, array) - O metodo reverse() altera a ordem do array para o seu oposto.

const theReverse = ["one", "two", "three"];
const reversed = theReverse.reverse();

console.log(reversed);
// result ==> ['three', 'two', 'one']

//--------------------------------------------------------------------
// some(element, index, array) - Se apenas um elemento do array satisfazer a condição que estabelecermos, então o este retorna true.

let someArray = [1, 2, -3, 5];

let mySome = someArray.some((numLessThan0) => {
  return numLessThan0 < 0;
});

console.log(mySome);
// result ==> true
// O resultado é true, porque um elemento do array (-3) é menor que zero.

//CONDITIONAL STATEMENTS ===========================================================================================================================================================

/*
if (condition1) {
  // statements
} else if (condition2) {
  // statements
} else if (condition3) {
  // statements
} else {
  // if all above turn to be false, 
  // this block of code will be executed
}
*/

let sky = "blue";

if (sky === "blue") {
  console.log("Está bom tempo");
} else if (sky === "dark") {
  console.log("Se calhar vai chover");
} else if (sky === "com nuvens") {
  console.log("Está nevoeiro");
} else {
  console.log("Não vi a meteorologia");
}

/*switch (expression) {
  case value1:
    // statements executed when the result of expression matches value1
    break;
  case value2:
    // statements executed when the result of expression matches value2
    break;
  ...
  case valueN:
    // statements executed when the result of expression matches valueN
    break;
  default:
    // statements executed when none of the values match the value of the expression
    break;
}
*/

let tempo = "dark";

switch (tempo) {
  case "blue":
    console.log("Está bom tempo");
    break;
  case "dark":
    console.log("Se calhar vai chover");
    break;
  //...
  case "com nuvens":
    console.log("Está nevoeiro");
    break;
  default:
    console.log("Não vi a meteorologia");
    break;
}

// ==========================================================================================================

// Ternary Operator

// condition ? if true : if false

// ==========================================================================================================

// BASIC ASSIGNMENT OPERATORS TABLE ===========================================================================================================================================================

/*
Name	                      Operator	         Equivalent
Assignment	                 x = y	             N / A
Addition assignment	         x += y	           x = x + y
Subtraction assignment	     x -= y	           x = x - y
Multiplication assignment	   x *= y	           x = x * y
Division assignment	         x /= y	           x = x / y
Remainder assignment	       x %= y	           x = x % y
Exponentiation assignment	   x **= y	         x = x ** y
*/

// BOOLEANS =================================================================================
/*
Operator	      Usage	      Description
AND (&&)	 expr1 && expr2	  The logical AND (&&) returns true if both operands are true; otherwise, returns false.
OR  (||)	 expr1 || expr2	  The logical OR (||) returns true if at least one of the operands is true; if both are false, returns false.
NOT (!)	        !expr	      The logical NOT (!) returns the opposite boolean state. If the operand is true, returns false. If the operand is false, returns true.


Expression           Description
true	               Literal expression with value true.
false	               Literal expression with value false.
exp1 == exp2	       Compares two expressions. Returns true if the expressions have the same value.
exp1 === exp2	       Compares two expressions. Returns true if the expressions have the same value and the same type of value.
exp1 < exp2	         Compares two expressions. Returns true if the value of exp1 is smaller than the exp2.
    >	               Compares two values. Return true if the first value is bigger than the second value.
exp1 <= exp2	       Compares two expressions. Returns true if the value of exp1 is smaller or equal than the exp2 value.
exp1 >= exp2	       Compares two expressions. Returns true if the value of exp1 is bigger or equal than the exp2 value


==> If expr1 or expr2 is true, the result will be true. If they both are false, the result of the expression will be false.
true || true; // => true
true || false; // => true
false || true; // => true
false || false; // => false
false || 4 > 2; // true


==> The AND operator, represented by &&, returns true just if all the evaluated expressions are true.
true && true; // => true
true && false; // => false
false && true; // => false
false && false; // => false
true && 4 > 2; // => true

*/

// LOOPS =====================================================================================================================================================================================
//While loop:

// let i = 0
// while ( i < number or "variable.array".lenght ) {
// 	console.log(i ou "variable.array".lenght[i]);
// 	i++;
// }

let counter = 1;

while (counter <= 10) {
  console.log(counter);
  counter += 1;
}
// result ==> 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

//--------------------------------------------------------------------
//For loop:
//      PARTIDA   CHEGADA                             INCREMENTO
// for ( let i = 0; i < number or "variable.array".lenght; i ++) {
// 	console.log(i ou "variable.array".lenght[i]);
// }

for (let i = 1; i <= 10; i++) {
  console.log(i);
}
// result ==> 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

//------------------------------------------------------------------
// For loop for multi-dimensional arrays:
let multiDimArr = [
  [1, 2],
  [3, 4],
  [5, 6],
];
//i = linhas;
//j = colunas
for (let i = 0; i < multiDimArr.length; i++) {
  for (let j = 0; j < multiDimArr[i].length; j++) {
    console.log(`na posição [${j}, ${i}], temos o item: ${multiDimArr[i][j]}`);
  }
}

// result ==> na posição: 0 0 temos o item: 1
/*na posição: 1 0 temos o item: 2
  na posição: 0 1 temos o item: 3
  na posição: 1 1 temos o item: 4
  na posição: 0 2 temos o item: 5
  na posição: 1 2 temos o item: 6
*/


//------------------------------------------------------------------
// Nested Loops:
for (let i = 0; i < 3; i++) {
  console.log("------- 1º loop ------");
  for (let j = 0; j < 5; j++) {
    console.log("------ 2º loop ------");
  }
}

// result ==>
/*
------- 1º loop ------
------ 2º loop ------
------ 2º loop ------
------ 2º loop ------
------ 2º loop ------
------ 2º loop ------
------- 1º loop ------
------ 2º loop ------
------ 2º loop ------
------ 2º loop ------
------ 2º loop ------
------ 2º loop ------
------- 1º loop ------
------ 2º loop ------
------ 2º loop ------
------ 2º loop ------
------ 2º loop ------
------ 2º loop ------
*/

// OBJECTS =====================================================================================================================================================================================================

let someCoolName = {
  key1: "value1",
  key2: "value2",
  key3: "value3",
};

// keys are always Strings, but values can be any type: strings, numbers, arrays, booleans, functions, or even other objects!

//--------------------------------------------------------------------
// Adicionar values a um object ==> someCoolName.key4 = value4
// return ==> let someCoolName = {
//               key1: value1,
//               key2: value2,
//               key3: value3,
//               key4: value4
//             };

//--------------------------------------------------------------------
// Actualizar values de um objecto ==> someCoolName.key1 = valueActulizado.
// return ==> let someCoolName = {
//               key1: valueActulizado,
//               key2: value2,
//               key3: value3,
//               key4: value4
//             };

//--------------------------------------------------------------------
// Para eliminar basta escrever delete antes:   delete someCoolName.key1 = valueActulizado.
// return ==> let someCoolName = {
//               key2: value2,
//               key3: value3,
//               key4: value4
//             };

//--------------------------------------------------------------------

// Object.keys(nome do objecto) - Para saber todas as keys de um objecto usamos este medoto que nos devolve um array com todas as keys, sendo possivel fazer um loop.
let objKeys = Object.keys(someCoolName);
console.log("As keys deste objecto são:", objKeys);
// return ==> [key1, key2, key3];

//--------------------------------------------------------------------
// Object.values(nome do objecto) - Para saber todos os values o mesmo aplica-se mas na seguinte forma, e devolve um array com todos os values.
let objValues = Object.values(someCoolName);
console.log("Os values deste objecto são:", objValues);
// return ==> [value1, value2, value3]

//--------------------------------------------------------------------
// Object.frozen(nome do objecto) - Serve para evitar que se modifique o objecto.

//--------------------------------------------------------------------
// Contudo, existe um loop criado especialmente para objectos
//    placeholder - can be any word (key, record, blah, pizza, mas escolhe nomes com significado)
//

for (let key in someCoolName) {
  console.log(key);
}

// return:
// key1
// key2
// key3

//--------------------------------------------------------------------
// Para ver os values

for (let key in someCoolName) {
  console.log(someCoolName[key]);
}
// return:
// value1
// value2
// value3

//--------------------------------------------------------------------
// Para sabermos se determinada key existe no objecto usamos o seguinte:

console.log("key10" in someCoolName); // result ==> false;
console.log("key2" in someCoolName); // result ==> true;

// Object.assign() - Server para copiar um objecto, contudo, são objectos diferentes se comparados.

const book1 = {
  author: "Charlotte Bronte",
};

const book2 = Object.assign({}, book1);

console.log(book2);
// <== { author: "Charlotte Bronte" }
console.log(book1 === book2);
// <== false

// OOP ===============================================================================================================================================
// class - Serve como modelo para construir novos objectos
class MyObj {
  // The constructor is the method triggered with the `new` keyword e onde colocamos os argumentos que queremos usar, podemos também definir argumentos "default", ou seja,
  // se não usarmos nenhum argumento o programa usa o default ex: constructor(name='Adélia', age=34), se quando iniciarmos um novo obj não defenirmos argumentos os que
  // serão usados são os default.
  constructor(name = "Adelia", age = 34) {
    this.name = name;
    this.age = age;
  }
  //methods
  myBirthdayYear() {
    return new Date().getFullYear() - this.age;
  }
}

// criação do  novo objecto
let tiago = new MyObj("Tiago", 33);
let def = new MyObj();

console.log(tiago);
// result ==> {name: Tiago, age: 33}
console.log(def);
// result ==> { name: 'Adelia', age: 34 }

console.log(tiago.myBirthdayYear());
// result ==> 1987

//extends e super - Servem para aplicar uma class existente a um novo objecto que irá herdar os argumentos do contructor através do super.
class Person extends MyObj {
  constructor(name, age, heigth, weigth) {
    // o super irá fazer o objecto Person herdar o name e age da class MyObj
    super(name, age);
    this.heigth = heigth;
    this.weigth = weigth;
  }
  //methods
  otherfunctions() {
    console.log("Love JavaScript");
  }
}

let myNewObjInh = new Person("Rui", 33, 175, 70);
console.log(myNewObjInh);
// result ==> { name: 'Rui', age: 33, height: 175, weigth: 70 }

// FUNCTIONS ===========================================================================================================================================

// Declarar uma função expression:

let myFunction = function (parameter) {
  //alguma coisa
};
//NOTA: é considerada first-class-object porque pode ser colocada numa variavel, dentro de outra função como parametro, e pode retornar uma função.

//----------------------------------------------------------------
// Declarar uma função declaration:

function estaFunção(parameter) {
  //alguma coisa
}
//NOTA: Esta função pode ser chamada antes de ser declarada (hoist).

//----------------------------------------------------------------
// Declarar uma arrow function expression:

let myArrowFunction = (parameter) => {
  return; //qq coisa.
};

// CALLBACK FUNCTIONS ============================================================================================================

// setTimeout(callbackFunction , delay) - Aciona um temporizador (em milisegundos) que assim que acaba, executa a um função callback.

const timeoutId = setTimeout(() => {
  console.log("Olá");
}, 3000);

console.log(timeoutId);
// result (após 3 segundos) ==> Olá

// outra forma:
function someCallbackFunction() {
  console.log("Hey there, Ironhackers!");
}
const timeoutIH = setTimeout(someCallbackFunction, 1000);

console.log(timeoutIH);
// result (após 1 segundos) ==> Hey there, Ironhackers!

// ================================================================================================================================
// setTimeInterveal(callbackFunction , delay) - Executa uma função repetidamente até acionarmos o clearInterval("nome da variavel com a função")

let i = 1;

const intervalId = setInterval(function () {
  console.log(i);
  i++;

  if (i > 10) {
    clearInterval(intervalId);
  }
}, 3000);
// a função só será executada 3 segundos depois ou, 3000 milisegundos e terá um intervalo de 3 segundo entre cada chamada.
// result ==> (passados 3 segundos) 1, (passados 3 segundos) 2, (passados 3 segundos) 3,... e assim sucessivamente até 10, onde limpamos o intervalo (clearInterval('...'))

// outra forma
let contador = 0;

const otherIntervalId = setInterval(estaFunc, 2000);

function estaFunc() {
  contador++;
  console.log(contador);
  if (contador === 10) {
    clearInterval(otherIntervalId);
  }
}

// result ==> (passados 2 segundos) 1, (passados 2 segundos) 2, (passados 2 segundos) 3,... e assim sucessivamente até 15, onde limpamos o intervalo (clearInterval('...'))
