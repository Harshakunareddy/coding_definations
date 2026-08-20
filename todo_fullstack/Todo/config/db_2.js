const {Sequelize} = require('sequelize');

const sequelize = new Sequelize("todo_db", "root", "", {
    host: "127.0.0.1",
    dialect: "mysql",
    pool: {max:20, min: 5, idle: 10000}
});

exports.default = sequelize;