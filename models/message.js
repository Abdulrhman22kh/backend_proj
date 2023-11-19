const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
      },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now(),
    },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema, "messages");
module.exports = Message;
