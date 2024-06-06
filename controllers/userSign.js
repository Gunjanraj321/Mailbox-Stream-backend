const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.jwtSecret;

const processSignUp = async (req, res) => {
  const { userId, deviceId, name, phone, password } = req.body;
  console.log(req.body);
  try {
    let user = await User.findOne({ where: { userId } });
    console.log(user);
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({ userId, deviceId, name, phone, password: hashedPassword, availCoins: 1000 });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const processLogin = async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT
    const token = await jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = {
  processSignUp,
  processLogin
};
