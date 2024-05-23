const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const User = sequelize.define("User", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = User;
