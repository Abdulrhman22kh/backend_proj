const express = require("express");

const userRouter = express.Router();

const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { secretKey } = require("../serverConstant");
const jwt = require("jsonwebtoken");

userRouter.post("/signup", async (req, res) => {
  console.log("----", req.body);
  let { firstName, lastName, email, city, password, confirmPassword, imagePublicId, phoneNumber } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !city ||
    !password ||
    !confirmPassword ||
    !imagePublicId
  ) {
    res.status(400).json({ message: "please fill all fields" });
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: "please check password confirmation" });
  }

  const userChecked = await User.findOne({ email: email });
  console.log("++++", userChecked);
  if (userChecked) {
    res.status(400).json({ message: "email already used" });
  }

  let hashedPassword = await bcrypt.hashSync(password, 10);

  password = hashedPassword;

  const newUser = new User({
    firstName,
    lastName,
    email,
    city,
    password,
    imagePublicId,
    phoneNumber
  });

  await newUser.save();

  const token = jwt.sign({ email: newUser.email }, secretKey, {
    expiresIn: "5h",
  });
  newUser.token = token;
  console.log("---", { ...newUser._doc, token });
  res.json({ user: { ...newUser._doc, token } });
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  let user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Generate a JWT
  const token = jwt.sign({ email: user.email }, secretKey, {
    expiresIn: "5h",
  });
  res.json({ user: { ...user._doc, token } });
});

userRouter.get("/user", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

userRouter.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.json(user);
});

userRouter.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  res.json(user);
});

module.exports = userRouter;