const Mail = require("../models/mail");
const User = require("../models/user");

const sendMail = async (data) => {
  // console.log(`line 5 controller`,data);
  const { from, to, subject, content } = data;

  try {
    const sender = await User.findOne({ where: { email: from } });
    const recipient = await User.findOne({ where: { email: to } });
    if (!sender || !recipient) {
      console.log('error as sender or receiver mail not found')
      return;
      }
    const newMail = await Mail.create({
      senderId: sender.id,
      recipientId: recipient.id,
      subject: subject,
      message: content,
    });
    // const data = JSON.stringify(newMail)
    console.log(`from send mail`,newMail.dataValues);
    return newMail.dataValues;
    // res.status(201).json({ message: "Mail sent successfully", mail: data });
  } catch (error) {
    // res.status(500).json({message:"internal server error"});
    console.error('error',error);
  }
};

const fetchMailsForUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    const receivedMails = await Mail.findAll({
      where: { recipientId: userId },
    });
    const mails = await Promise.all(
      receivedMails.map(async (mail) => {
        const sender = await User.findByPk(mail.senderId);
        return {
          id: mail.id,
          sender: sender.email,
          subject: mail.subject,
          message: mail.message,
          createdAt: mail.createdAt,
          read:mail.read
        };
      })
    );
    res.status(200).json({ mails });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mails", error });
  }
};

const deleteMailById = async (req, res) => {
  const { mailId } = req.params;
  try {
    await Mail.destroy({ where: { id: mailId } });
    res.json({ message: "Mail deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete mail", error });
  }
};

const fetchSentMailsForUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const sentMails = await Mail.findAll({ where: { senderId: userId } });

    const mails = await Promise.all(
      sentMails.map(async (mail) => {
        const recipient = await User.findByPk(mail.recipientId);
        return {
          id: mail.id,
          recipient: recipient.email,
          subject: mail.subject,
          message: mail.message,
          createdAt: mail.createdAt,
        };
      })
    );

    res.status(200).json({ mails });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sent mails", error });
  }
};

const mailRead = async (req, res) => {
  
  const { mailId } = req.params;

  try {
    const mail = await Mail.findByPk(mailId);
    if (!mail) {
      return res.status(404).json({ message: "Mail not found" });
    }
    mail.read = true;
    await mail.save();
    res.status(200).json({ message: "Mail marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update mail status", error });
  }
};

module.exports = {
  fetchMailsForUser,
  sendMail,
  deleteMailById,
  fetchSentMailsForUser,
  mailRead,
};
