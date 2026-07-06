/*
========================================
MONGODB INTERVIEW QUESTIONS (1–20)
WITH SIMPLE EXPLANATIONS + QUERIES
========================================
*/

/*
1. WHAT IS MONGODB?
MongoDB is a NoSQL database that stores data in JSON-like documents.
It is schema-less, meaning structure can change easily.
Used for flexible and scalable applications.
*/


/*
2. COLLECTION vs DOCUMENT
Collection is like a table in SQL.
Document is a record (row) stored in JSON format.
Each document can have different structure.
*/


/*
3. INSERT DOCUMENT
Used to add data into collection.
*/
db.users.insertOne({
    name: "Harsha",
    age: 22
});


/*
4. FIND (READ)
Used to fetch data from collection.
*/
db.users.find();
db.users.find({ name: "Harsha" });


/*
5. UPDATE
Modify existing documents.
*/
db.users.updateOne(
    { name: "Harsha" },
    { $set: { age: 25 } }
);


/*
6. DELETE
Remove documents from collection.
*/
db.users.deleteOne({ name: "Harsha" });


/*
7. PRIMARY KEY (_id)
MongoDB automatically creates _id field.
It uniquely identifies each document.
Works like primary key.
*/


/*
8. SCHEMA-LESS
MongoDB does not enforce fixed schema.
Different documents can have different fields.
Gives flexibility but needs careful design.
*/


/*
9. QUERY OPERATORS
Used to filter data.
*/
db.users.find({ age: { $gt: 20 } }); // greater than
db.users.find({ age: { $lt: 30 } }); // less than


/*
10. PROJECTION
Used to select specific fields.
*/
db.users.find({}, { name: 1, _id: 0 });


/*
11. SORT
Sort documents.
*/
db.users.find().sort({ age: 1 }); // ascending


/*
12. LIMIT & SKIP
Used for pagination.
*/
db.users.find().limit(5).skip(5);


/*
13. INDEX
Improves query performance.
*/
db.users.createIndex({ name: 1 });


/*
14. AGGREGATION
Used for complex queries like grouping.
*/
db.users.aggregate([
    { $group: { _id: "$age", count: { $sum: 1 } } }
]);


/*
15. EMBEDDING vs REFERENCING
Embedding → store related data inside document.
Referencing → store reference (like foreign key).
Embedding is faster, referencing is flexible.
*/


/*
16. MONGOOSE
Mongoose is ODM for MongoDB in Node.js.
It helps define schema and models.
*/
const mongoose = require("mongoose");


/*
17. SCHEMA IN MONGOOSE
Defines structure of document.
*/
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});


/*
18. MODEL
Model is used to interact with collection.
*/
const User = mongoose.model("User", userSchema);


/*
19. SAVE DATA (MONGOOSE)
*/
const user = new User({ name: "Harsha", age: 22 });
user.save();


/*
20. DIFFERENCE SQL vs MONGODB
SQL → tables, rows, fixed schema.
MongoDB → documents, flexible schema.
MongoDB is better for unstructured data.
*/


/*
========================================
END OF FILE
========================================
*/