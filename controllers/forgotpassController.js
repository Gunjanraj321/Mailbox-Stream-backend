require("dotenv").config({ path: "nodemon.json" });
const nodemailer = require("nodemailer");
const forgotPasswordRequest = require("../models/forgotpassModel");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const sequelize = require("../utils/db");

const forgotpasswordData = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const forpasswordrequest = await forgotPasswordRequest.create({
        userId: user.id,
        isactive: true,
      });
      sendMail(email, forpasswordrequest.id)
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error sending recovery email:", err);
    res.status(500).json({ message: "Error sending recovery email" });
  }
};

const resetpassword = async (req, res) => {
  try {
    const forPasswordRequest = await forgotPasswordRequest.findOne({
      where: { id: req.params.uuid },
    });
    if (!forPasswordRequest || !forPasswordRequest.isactive) {
      return res.status(401).json({ message: "Invalid reset link" });
    }

    res.redirect(`http://localhost:3000/resetForm?uuid=${req.params.uuid}`);
  } catch (err) {
    console.error("Error in resetpassword route:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const newpassword = async (req, res, next) => {
  let t;
  try {
    const password = req.body.password;
    const uuid = req.body.uuid;

    const forpasswordrequest = await forgotPasswordRequest.findOne({
      where: { id: uuid, isactive: true },
    });

    if (!forpasswordrequest) {
      return res.status(401).json({ message: "Invalid reset link" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = forpasswordrequest.userId;
    t = await sequelize.transaction();
    const updatedUser = await User.update(
      { password: hashedPassword },
      { where: { id: userId } },
      { transaction: t }
    );

    await forpasswordrequest.update({ isactive: false }, { transaction: t });

    t.commit();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    if (t) {
      t.rollback();
    }
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendMail = async (email , uuid) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Password Recovery",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Password Recovery</h2>
        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
          You've requested to reset your password. Please click the link below to reset your password:
        </p>
        <a href="http://localhost:3000/resetForm/${uuid}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          If you didn't request this, please ignore this email. Your password won't be changed.
        </p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending recovery email:", error);
      res.status(500).json({ message: "Error sending recovery email" });
    } else {
      console.log("Recovery email sent successfully");
      res.status(200).json({ message: "Recovery email sent successfully" });
    }
  });
};

module.exports = { forgotpasswordData, resetpassword, newpassword };
