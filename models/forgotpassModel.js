const Sequelize = require("sequelize");
const sequelize = require("../utils/db");
const uuid = require("uuid");

const forgotPasswordRequest = sequelize.define("forgotPasswordRequest", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  isactive: { 
    type: Sequelize.BOOLEAN, 
    defaultValue: true 
  },
});

module.exports = forgotPasswordRequest;
