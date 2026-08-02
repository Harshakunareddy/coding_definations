const User = require("./User");
const Profile = require("./Profile");

// Associations
User.hasOne(Profile, {
  foreignKey: "userId",
});

Profile.belongsTo(User, {
  foreignKey: "userId",
});



Student.belongsToMany(Course, {
    through: "StudentCourses"
});

User.hasMany(Task, {
  foreignKey: "userId",
});

Task.belongsTo(User, {
  foreignKey: "userId",
});

// Get User with Tasks
const users = await User.findAll({
    include: [Task]
});

// Get Task with User
const tasks = await Task.findAll({
    include: [User]
});

module.exports = {
  User,
  Profile,
};