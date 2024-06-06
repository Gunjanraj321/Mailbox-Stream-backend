const Message = require('../models/Message');

const getMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.findAll({ where: { roomId } });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
};

module.exports = { getMessages };
