const express = require('express')
const chatRouter = express.Router();

const Chat = require('../models/chat')
const Message = require('../models/message');
const { protect } = require('../middleware/protect');


chatRouter.get('/:userId', protect, async(req, res) => {
    const {userId} = req.params;
    const chats = await Chat.find({
        $or: [
          { firstUser: userId },
          { secondUser: userId },
        ],
      }).populate("firstUser").populate("secondUser");
  
    res.json(chats);
})

chatRouter.post("/:firstUser/:secondUser", protect, async(req, res) => {
    
    
    const {firstUser, secondUser} = req.params;
    const newChat = new Chat({
        firstUser, 
        secondUser
    })
    await newChat.save();
    res.json(newChat);
})

chatRouter.post("/message/:chat/:sender/:receiver", protect, async(req, res) => {
    const {chat, sender, receiver} = req.params;  console.log("dsad")
    const {value} = req.body;
    const deleted = await Message.deleteMany({});
    console.log(deleted);
    const newMessage = Message({
        chat, sender, receiver,value
    });
  
    await newMessage.save();

    res.json(newMessage);

})

chatRouter.get("/message/:chat",protect, async(req, res) => {
    console.log("dsadsa")
    const {chat} = req.params;
    const chat1 = await Chat.findById(chat)
    console.log("---", chat1);
    const messages = await Message.find({chat: chat}).populate({
        path: 'chat',
        populate: {
          path: 'firstUser',
        },
      }).populate({
        path: 'chat',
        populate: {
          path: 'secondUser',
        },
      })
    
    res.json(messages);

})

 module.exports = chatRouter;