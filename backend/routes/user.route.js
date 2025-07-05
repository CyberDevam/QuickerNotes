const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
// const jwt = require("jsonwebtoken");
//identify me
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ isMe: false });
    }
    res.status(200).json({ isMe: true, email: user.email, name: user.name });
  } catch (error) {
    res.status(500).json(error);
  }
});
//profile update
router.put("/profile/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email, currentPassword, newPassword, confirmPassword } = req.body;
  if (!name || !email || !currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "fields are empty" });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.name = name;
    user.email = email;
    user.password = hashPassword;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(400).json({ message: "fields are empty" })
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // const token = jwt.sign(newUser._id, process.env.JWT_SECRET_KEY, { expiresIn: "9h" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error })
  }
});
// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name && !email && !password) {
    return res.status(400).json({ message: "fields are empty" })
  }
  const isExisted = await User.findOne({ email });
  if (isExisted) {
    return res.status(400).json({ message: "User already exist" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });
  if(!newUser){
    return res.status(400).json({message:"user created failed"});
  }
  // const token = jwt.sign(newUser._id, process.env.JWT_SECRET_KEY, { expiresIn: "9h" });
  res.status(200).json(newUser);
})
// Logout
router.get("/logout", async (req, res) => {
  try {
    res.status(200).json({ message: "Logout Successfull" })
  } catch (error) {
    res.status(400).json({ message: "Logout Unsuccessfull" })
  }
})

module.exports = router;