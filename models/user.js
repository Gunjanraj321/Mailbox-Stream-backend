const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const User = sequelize.define("User", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  deviceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availCoins: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPrimeMember: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
module.exports = User;
