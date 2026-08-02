const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("todo_db", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
});
// mysql2
module.exports = sequelize;


// host: "localhost", pg pg-hstore
// port: 5432,
// dialect: "postgres",

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/todo_db");
// }
// module.exports = connectDB and import it on the server.js and connectDB line 

