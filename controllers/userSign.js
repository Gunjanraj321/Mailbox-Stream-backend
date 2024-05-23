const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const processSignUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "missing required fields",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.jwtSecret);
    const subject = "Registration Successful";
    const text = "Thank you for registering. Your registration was successful.";
    
    // await sendSuccessEmail(email, subject, text);

    res.status(201).json({
      message: "registration successful.",
      token: token,
      email: email,
    });
  } catch (err) {
    console.log("error during sign-up");
    res.status(500).json({
      error: "an error occurred while registering the user",
    });
  }
};

const processLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ userId: user.id }, process.env.jwtSecret);

    if (passwordMatch) {

      const subject = "Login Successful";
      const text = "Thank you for logging in. Your login was successful.";
      // await sendSuccessEmail(email, subject, text);
      res
        .status(200)
        .json({ message: "login successfully", token: token, email: email });
    } else {
      console.log("password not match");
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the login" });
  }
};


async function sendSuccessEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to,
    subject,
    text,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending success email:", error);
  }
}

module.exports = {
  processSignUp,
  processLogin,
};
