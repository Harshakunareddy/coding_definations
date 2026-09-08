========================================================
             JAVASCRIPT vs TYPESCRIPT
             QUICK INTERVIEW REVISION
========================================================


1. VARIABLE TYPES
--------------------------------------------------------

JavaScript:

let age = 25;

age = "25";       // Allowed


TypeScript:

let age: number = 25;

age = "25";       // Error


Main change:
→ TypeScript allows us to specify types.


========================================================
2. FUNCTION
--------------------------------------------------------

JavaScript:

function add(a, b) {
    return a + b;
}


TypeScript:

function add(a: number, b: number): number {
    return a + b;
}


Main change:

a: number
b: number
: number → return type


========================================================
3. OBJECT
--------------------------------------------------------

JavaScript:

const user = {
    name: "Harsha",
    age: 25
};


TypeScript:

const user: {
    name: string;
    age: number;
} = {
    name: "Harsha",
    age: 25
};


Usually we use an interface/type instead:

interface User {
    name: string;
    age: number;
}

const user: User = {
    name: "Harsha",
    age: 25
};


========================================================
4. ARRAY
--------------------------------------------------------

JavaScript:

const numbers = [1, 2, 3];


TypeScript:

const numbers: number[] = [1, 2, 3];


String array:

const names: string[] = [
    "Harsha",
    "Ravi"
];


========================================================
5. UNION TYPE
--------------------------------------------------------

JavaScript:

let id = 10;

id = "10";


TypeScript:

let id: number | string = 10;

id = "10";        // Allowed


Meaning:

number OR string


========================================================
6. OPTIONAL PROPERTY
--------------------------------------------------------

JavaScript:

const user = {
    name: "Harsha"
};


TypeScript:

interface User {
    name: string;
    age?: number;
}


? means the property is optional.


========================================================
7. INTERFACE
--------------------------------------------------------

JavaScript:

// No interface


TypeScript:

interface User {
    name: string;
    age: number;
    email: string;
}


const user: User = {
    name: "Harsha",
    age: 25,
    email: "test@gmail.com"
};


Main purpose:

→ Define the structure/type of an object.


========================================================
8. TYPE
--------------------------------------------------------

TypeScript:

type User = {
    name: string;
    age: number;
};


const user: User = {
    name: "Harsha",
    age: 25
};


JavaScript does not have this type-system feature.


========================================================
9. ANY
--------------------------------------------------------

TypeScript:

let value: any = 10;

value = "hello";

value = true;


any basically tells TypeScript:

"Don't perform type checking for this value."


Try to avoid unnecessary `any`.


========================================================
10. UNKNOWN
--------------------------------------------------------

TypeScript:

let value: unknown = "hello";


Before using it:

if (typeof value === "string") {
    console.log(value.toUpperCase());
}


unknown is safer than any.


========================================================
11. ENUM
--------------------------------------------------------

TypeScript:

enum Status {
    Pending,
    Success,
    Failed
}


let status: Status = Status.Success;


Used when we have a fixed set of values.


========================================================
12. GENERICS
--------------------------------------------------------

JavaScript:

function getValue(value) {
    return value;
}


TypeScript:

function getValue<T>(value: T): T {
    return value;
}


const result = getValue<number>(10);


<T> allows the function to work with different types
while maintaining type safety.


========================================================
13. TYPE INFERENCE
--------------------------------------------------------

TypeScript can automatically understand the type.


const name = "Harsha";


TypeScript knows:

name → string


So this is usually NOT necessary:

const name: string = "Harsha";


TypeScript already infers it.


========================================================
14. CLASS
--------------------------------------------------------

JavaScript:

class User {

    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}


TypeScript:

class User {

    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}


Main change:

→ Properties and parameters can have types.


========================================================
15. JAVASCRIPT FILE vs TYPESCRIPT FILE
--------------------------------------------------------

JavaScript:

app.js


TypeScript:

app.ts


TypeScript:

.ts
 ↓
Compile
 ↓
.js
 ↓
Browser / Node.js


========================================================
16. MOST IMPORTANT DIFFERENCES
========================================================

JavaScript:

Dynamic typing
    ↓
Types checked mainly at runtime


TypeScript:

Static typing
    ↓
Types checked during development/compile time


JavaScript:

let value = 10;
value = "hello";       // Allowed


TypeScript:

let value: number = 10;
value = "hello";       // Error


========================================================
17. INTERVIEW ANSWER
========================================================

Q: "You know JavaScript. What does TypeScript add?"

Answer:

"TypeScript is basically JavaScript with a static type
system. It allows us to define types for variables,
function parameters, return values and objects. It also
provides features like interfaces, generics and union
types. TypeScript catches many errors during development
and is compiled to JavaScript before execution."


========================================================
              JUST REMEMBER THESE
========================================================

JS                  TS
----------------------------------
let age = 10        let age: number = 10

function add(a,b)   function add(a:number,b:number):number

[1,2,3]             number[]

Object              interface / type

No union types      number | string

No static typing    Static typing

.js                 .ts

Runtime checking    Compile-time checking

========================================================