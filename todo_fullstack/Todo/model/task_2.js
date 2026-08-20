const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define("Task", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed'),
        allowNull: false,
        defaultValue: "pending",
    }
},
{
    indexes: [{ fields: [status] }]
}
);

User.hasMany("Task", {
    foreignKey: "user_id"
});

Task.belongsTo("User",{
    foreignKey: "task_id"
});

User.findAll({
    include: [Task]
});

Task.findAll({
    include: [User]
});


module.exports = Task;