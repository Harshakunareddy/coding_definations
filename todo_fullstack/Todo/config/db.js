const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("todo_db", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
});

module.exports = sequelize;




// const { Sequelize } = require("sequelize");

// const sequelize = new Sequezile.define("todo_db",
//   "root", "", {
//   "host": "127.0.0.1",
//   "dialect": "mysql",
// }
// );
// module.export = sequelize;