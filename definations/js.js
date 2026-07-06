/*
========================================
JAVASCRIPT INTERVIEW QUESTIONS (1–20)
WITH PROPER EXPLANATIONS (SPEAKABLE)
========================================
*/

/*
1. WHAT IS JAVASCRIPT?
JavaScript is a programming language used to make web pages interactive.
It runs in the browser and also on servers using Node.js.
It helps handle events, API calls, and dynamic UI updates.
*/
console.log("Hello JS");


/*
2. var vs let vs const
var is function scoped and can be redeclared, which can cause bugs.
let is block scoped and can be updated but not redeclared in same scope.
const is block scoped and cannot be reassigned, used for fixed values.
*/
var a = 10;
let b = 20;
const c = 30;


/*
3. HOISTING
Hoisting means variables and functions are moved to the top before execution.
With var, it is hoisted but initialized as undefined.
let and const are hoisted but not initialized (temporal dead zone).
*/
console.log(x); // undefined
var x = 5;


/*
4. CLOSURE
Closure means a function can remember variables from its outer function.
Even after outer function is executed, inner function still has access.
This is useful for data privacy and maintaining state.
*/
function outer() {
    let count = 0;
    return function inner() {
        count++;
        console.log(count);
    };
}
const fn = outer();
fn();


/*
5. CALLBACK
A callback is a function passed as an argument to another function.
It is executed after some operation is completed.
Used a lot in async operations like API calls.
*/
function greet(name, callback) {
    callback(name);
}
greet("Harsha", (n) => console.log("Hi " + n));


/*
6. PROMISE
A Promise represents a value that may be available now or later.
It has three states: pending, resolved, rejected.
We use .then() for success and .catch() for errors.
*/
const promise = new Promise((resolve, reject) => {
    resolve("Done");
});
promise.then(console.log);


/*
7. ASYNC / AWAIT
Async/await is a cleaner way to write promises.
async makes a function return a promise.
await pauses execution until promise is resolved.
*/
async function getData() {
    return "Hello";
}
getData().then(console.log);


/*
8. == vs ===
== checks value only (loose comparison).
=== checks both value and type (strict comparison).
Always prefer === to avoid unexpected bugs.
*/
console.log("5" == 5);
console.log("5" === 5);


/*
9. EVENT LOOP
JavaScript is single-threaded but handles async using event loop.
It moves async tasks (like setTimeout, API calls) to a queue.
Event loop executes them when call stack is empty.
*/


/*
10. THIS KEYWORD
this refers to the current object calling the function.
In normal functions, it depends on how function is called.
In arrow functions, it uses parent scope this.
*/
const obj = {
    name: "Harsha",
    show() {
        console.log(this.name);
    }
};
obj.show();


/*
11. ARROW FUNCTION
Arrow functions are shorter syntax for writing functions.
They do not have their own 'this', they inherit from parent.
Used for cleaner and concise code.
*/
const add = (a, b) => a + b;


/*
12. MAP FILTER REDUCE
map transforms each element of array.
filter returns elements based on condition.
reduce converts array into single value.
*/
const arr = [1, 2, 3];
arr.map(x => x * 2);
arr.filter(x => x > 1);
arr.reduce((a, b) => a + b, 0);


/*
13. DEBOUNCE
Debounce delays function execution until user stops triggering it.
Used in search inputs to reduce API calls.
Improves performance and avoids unnecessary calls.
*/
let timer;
function debounce(fn, delay) {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
}


/*
14. THROTTLE
Throttle limits how often a function can run.
It ensures function runs at fixed intervals.
Used in scroll or resize events.
*/
function throttle(fn, delay) {
    let last = 0;
    return function () {
        let now = Date.now();
        if (now - last >= delay) {
            fn();
            last = now;
        }
    };
}


/*
15. PROTOTYPE
JavaScript uses prototype for inheritance.
Objects can access properties from their prototype.
This helps reuse code and save memory.
*/
function Person(name) {
    this.name = name;
}
Person.prototype.say = function () {
    console.log("Hi " + this.name);
};


/*
16. CALL APPLY BIND
These are used to control 'this' keyword.
call() calls function immediately with arguments.
bind() returns a new function with bound context.
*/
function say() {
    console.log(this.name);
}
say.call({ name: "Harsha" });


/*
17. JSON
JSON is a format to store and transfer data.
JSON.stringify converts object to string.
JSON.parse converts string back to object.
*/
const user = { name: "Harsha" };
const str = JSON.stringify(user);
const obj2 = JSON.parse(str);


/*
18. DESTRUCTURING
Destructuring allows extracting values from objects/arrays.
It makes code shorter and readable.
Commonly used in React and APIs.
*/
const { name } = { name: "Harsha" };


/*
19. SPREAD
Spread operator (...) copies or expands values.
Used to clone arrays or objects.
Helps maintain immutability.
*/
const arr2 = [...[1, 2, 3]];


/*
20. REST
Rest operator collects multiple values into array.
Used in function parameters.
Helps handle dynamic number of arguments.
*/
function sum(...nums) {
    return nums.reduce((a, b) => a + b, 0);
}


/*
========================================
END OF FILE
========================================
*/