const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "test_db"
});

// Connect to DB
db.connect(err => {
  if (err) {
    console.log("DB Connection Failed");
    return;
  }
  console.log("MySQL Connected");
});


// ✅ CREATE
app.post("/users", (req, res) => {
  const { name } = req.body;
  const sql = "INSERT INTO users (name) VALUES (?)";

  db.query(sql, [name], (err, result) => {
    if (err) return res.send(err);
    res.send("User created");
  });
});


// ✅ READ
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";

  db.query(sql, (err, results) => {
    if (err) return res.send(err);
    res.json(results);
  });
});


// ✅ UPDATE
app.put("/users/:id", (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const sql = "UPDATE users SET name = ? WHERE id = ?";

  db.query(sql, [name, id], (err) => {
    if (err) return res.send(err);
    res.send("User updated");
  });
});


// ✅ DELETE
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) return res.send(err);
    res.send("User deleted");
  });
});


// Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
