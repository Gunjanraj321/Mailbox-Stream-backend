const express = require("express");
const {
  sendMail,
  fetchMailsForUser,
  deleteMailById,
  fetchSentMailsForUser,
  mailRead
} = require("../controllers/mailController");
const router = express.Router();

// Send a new mail
router.post("/send", sendMail);
router.get("/fetch", fetchMailsForUser);
router.delete("/:mailId", deleteMailById);
router.get('/sent', fetchSentMailsForUser);
router.patch('/read/:mailId', mailRead);

module.exports = router;
