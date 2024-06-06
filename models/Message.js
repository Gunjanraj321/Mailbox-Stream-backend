const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Message = sequelize.define('Message', {
  messageId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Message;
