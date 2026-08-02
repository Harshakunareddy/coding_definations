const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "in_progress", "completed"),
    allowNull: false,
    defaultValue: "pending",
  },
});

module.exports = Task;


// User.hasMany(Task, {
//   foreignKey: "userId",
// });

// Task.belongsTo(User, {
//   foreignKey: "userId",
// });


// Student.belongsToMany(Course, {
//     through: "StudentCourses"
// });


// Get User with Tasks
// const users = await User.findAll({
//     include: [Task]
// });

// Get Task with User
// const tasks = await Task.findAll({
//     include: [User]
// });





| Sequelize             | Mongoose                        |
| --------------------- | ------------------------------- |
| `DataTypes.STRING`    | `String`                        |
| `DataTypes.TEXT`      | `String`                        |
| `DataTypes.INTEGER`   | `Number`                        |
| `DataTypes.FLOAT`     | `Number`                        |
| `DataTypes.DOUBLE`    | `Number`                        |
| `DataTypes.DECIMAL`   | `Number`                        |
| `DataTypes.BOOLEAN`   | `Boolean`                       |
| `DataTypes.DATE`      | `Date`                          |
| `DataTypes.JSON`      | `Object` / `Schema.Types.Mixed` |
| `DataTypes.UUID`      | `String`                        |
| `DataTypes.ENUM(...)` | `String` with `enum: [...]`     |
