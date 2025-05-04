const Message = require("../models/Message");

const getMessages = async (req, res) => {
  const { sender, receiver } = req.query;
  const messages = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  }).sort("timestamp");
  res.json(messages);
};

module.exports = { getMessages };
