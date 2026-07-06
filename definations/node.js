/*
========================================
NODE JS INTERVIEW QUESTIONS (1–20)
WITH SIMPLE EXPLANATIONS + CODE
========================================
*/

/*
1. WHAT IS NODE.JS?
Node.js is a runtime environment that allows JavaScript to run on server.
It is built on Chrome's V8 engine.
Used for building APIs, servers, and real-time apps.
*/
console.log("Node.js running");


/*
2. NODE.JS FEATURES
Node is single-threaded
 but handles multiple requests using 
 event loop.
It is non-blocking and asynchronous.
Good for scalable applications.
*/


/*
3. MODULES
Modules help split code into reusable files.
We use require (CommonJS) or import (ES modules).
*/
const fs = require("fs"); // built-in module


/*
4. FILE SYSTEM (fs)
Used to read/write files.
Async methods are preferred for performance.
*/
fs.readFile("test.txt", "utf8", (err, data) => {
    if (err) console.log(err);
    else console.log(data);
});


/*
5. HTTP MODULE
Used to create server without frameworks.
*/
const http = require("http");
const server = http.createServer((req, res) => {
    res.end("Hello Server");
});
server.listen(3000);


/*
6. EXPRESS JS
Express is a framework built on Node.js.
It simplifies routing and middleware handling.
*/
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello Express");
});

app.listen(3001);


/*
7. ROUTING
Routing means handling different URLs.
Each route handles specific request.
*/
app.get("/about", (req, res) => {
    res.send("About Page");
});


/*
8. MIDDLEWARE
Middleware functions run before request reaches route.
Used for logging, auth, parsing data.
*/
app.use((req, res, next) => {
    console.log("Middleware running");
    next();
});


/*
9. REQUEST & RESPONSE
req → incoming data from client.
res → response sent back to client.
*/
app.get("/user", (req, res) => {
    res.json({ name: "Harsha" });
});


/*
10. JSON HANDLING
Express can parse JSON using middleware.
*/
app.use(express.json());

app.post("/data", (req, res) => {
    console.log(req.body);
    res.send("Data received");
});


/*
11. EVENT LOOP
Node uses event loop to handle async operations.
It allows non-blocking execution.
Helps handle many users efficiently.
*/


/*
12. CALLBACKS
Functions passed as arguments.
Used in async operations.
*/
function fetchData(callback) {
    setTimeout(() => {
        callback("Data received");
    }, 1000);
}


/*
13. PROMISES
Better way to handle async operations.
Avoids callback hell.
*/
const promise = new Promise((res) => res("Done"));
promise.then(console.log);


/*
14. ASYNC / AWAIT
Cleaner syntax for promises.
Makes async code look synchronous.
*/
async function getData() {
    return "Hello";
}


/*
15. ERROR HANDLING
Errors should be handled properly.
Use try-catch or middleware.
*/
app.get("/error", (req, res) => {
    try {
        throw new Error("Something went wrong");
    } catch (err) {
        res.send(err.message);
    }
});


/*
16. STATUS CODES
Used to indicate response status.
200 → success
404 → not found
500 → server error
*/

// 2X => success
// 200 => ok success
// 201 => created success

// 3x => redirection
// 301 => moved permanently


// 4X => client side issues
// 404 => not found
// 401 => unauth
// 403 => Forbidden
// 400 => bad request


// 5X => server side issues

// 500 Internal Server Error
// Server crashed / code error

// 9️⃣ 502 Bad Gateway
// Invalid response from upstream server

// 🔟 503 Service Unavailable
// Server down or overloaded


app.get("/status", (req, res) => {
    res.status(200).send("OK");
});


/*
17. ENV VARIABLES
Used to store sensitive data like API keys.
Access using process.env.
*/
console.log(process.env.PORT);


/*
18. NPM
Node Package Manager is used to install libraries.
Example: npm install express
Helps reuse existing packages.
*/


/*
19. CORS
Cross-Origin Resource Sharing allows APIs to be accessed from different domains.
Needed when frontend and backend are on different ports.
*/
const cors = require("cors");
app.use(cors());


/*
20. STREAMS
Streams handle large data in chunks.
Useful for reading big files.
Improves performance.
*/
const stream = fs.createReadStream("bigfile.txt");
stream.on("data", chunk => {
    console.log(chunk);
});


/*
========================================
END OF FILE
========================================
*/