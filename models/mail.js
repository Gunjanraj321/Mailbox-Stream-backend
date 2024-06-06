const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const User = require('./user');

const Mail = sequelize.define('Mail', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    senderId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    recipientId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Mail;
