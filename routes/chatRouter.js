const express = require("express");
const chatRouter = express.Router();

const Chat = require("../models/chat");
const Message = require("../models/message");
const { protect } = require("../middleware/protect");
// get chats by user id
chatRouter.get("/:userId", protect, async (req, res) => {
  const { userId } = req.params;
  const chats = await Chat.find({
    $or: [{ firstUser: userId }, { secondUser: userId }],
  })
    .populate("firstUser")
    .populate("secondUser");
    console.log(chats);
  res.json(chats);
});

// create new chat between tow users
chatRouter.post("/:firstUser/:secondUser", protect, async (req, res) => {
  const { firstUser, secondUser } = req.params;
  console.log(firstUser, secondUser);
  const newChat1 = new Chat({
    firstUser,
    secondUser,
  });

  await newChat1.save();
  const newChat = await Chat.findById(newChat1._id)
    .populate("firstUser")
    .populate("secondUser");
  res.json(newChat);
});
// send message in chats
chatRouter.post(
  "/message/:chat/:sender/:receiver",
  protect,
  async (req, res) => {
    const { chat, sender, receiver } = req.params;
    console.log("dsad");
    const { value } = req.body;
    const newMessage = new Message({
      chat,
      sender,
      receiver,
      value,
    });

    await newMessage.save();

    res.json(newMessage);
  }
);

// get all meesages by chat id
chatRouter.get("/message/:chat", protect, async (req, res) => {
  const { chat } = req.params;
  const messages = await Message.find({ chat: chat })
    .populate({
      path: "chat",
      populate: {
        path: "firstUser",
      },
    })
    .populate({
      path: "chat",
      populate: {
        path: "secondUser",
      },
    });

  res.json(messages);
});

module.exports = chatRouter;
