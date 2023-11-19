const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const itemRouter = require('./routes/itemRouter')
const asyncHandler = require("express-async-handler");
const cors = require("cors");
const app = express();

const { Server } = require("socket.io");
const dbUrI =
  "mongodb+srv://moodghoz:cGocmiQKmguaoP4q@cluster0.uojnwjd.mongodb.net/";

mongoose.connect(dbUrI).then(() => {
  console.log("successfully connected");
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get(
  "/dod",
  asyncHandler(async (req, res) => {
    res.status(400).json({ m: "haha" });
  })
);
app.use("/", userRouter);
app.use("/chat", chatRouter);
app.use('/item', itemRouter)

const http = app.listen(5000, () => {
  console.log("app is listening");
});

const io = new Server(http, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on('connection', (socket) => {
    console.log("socket is connectting", socket.id);
    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joiend room ${room}`)
    })

    socket.on("send_message", (data) => {
        console.log('user send this', data.message)
        socket.to(data.room).emit("receive_message", data.message);
    })

    io.on('disconnect', () => {
        console.log("socket is disconnect", socket.id);
    })
})