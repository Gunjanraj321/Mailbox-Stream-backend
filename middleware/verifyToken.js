require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const key = process.env.jwtSecret;
    const user = jwt.verify(token, key);
    const foundUser = await User.findOne({ where: { id: user.userId } });
  
    if (!foundUser) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: "Token verification failed" });
  }
};

module.exports = { verify };
