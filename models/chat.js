const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    firstUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    secondUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now(),
    }
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema, 'chats');
module.exports = Chat