const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db'); 

const FriendRequest = sequelize.define('FriendRequest', {
  id: {
    type: DataTypes.INTEGER,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  friendId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = FriendRequest;
