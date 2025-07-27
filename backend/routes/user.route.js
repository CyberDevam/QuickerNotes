const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
// const jwt = require("jsonwebtoken");
//identify me
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const user = await User.findById(id).populate('followers following', 'name email avatar');
    ;
    if (!user) {
      return res.status(400).json({ isMe: false });
    }
    res.status(200).json({ isMe: true, email: user.email, name: user.name, _id: user._id, avatarImg: user.avatarImg, gender: user.gender, user });
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/search/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const users = await userModel
      .find(
        name
          ? { name: { $regex: name, $options: "i" } }
          : {} // if no query, return all
      )
      .select("-password");

    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Internal server error" });
  }
});

// Pallete
router.post("/palette/:id", async (req, res) => {
  const id = req.params.id;
  const { category, palette } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { palette: { category, palette } },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(400).json({ palette: {} });
    }
    res.status(200).json({ palette: user.palette, name: user.name });
  } catch (error) {
    res.status(500).json(error);
  }
});
// Set mode
router.post("/mode/:id", async (req, res) => {
  const id = req.params.id;
  const { mode } = req.body;
  if (!mode) {
    return res.status(400).json({ message: "Mode is required" });
  }
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { mode },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ mode: user.mode });
  } catch (error) {
    res.status(500).json({ message: "Error setting mode", error });
  }
});
// Get mode
router.get("/mode/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user || typeof user.mode === "undefined") {
      return res.status(404).json({ message: "Mode not found" });
    }
    res.status(200).json({ mode: user.mode });
  } catch (error) {
    res.status(500).json({ message: "Error fetching mode", error });
  }
});
// get palette color and category
router.get("/palette/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user || !user.palette) {
      return res.status(404).json({ message: "Palette not found" });
    }
    res.status(200).json({
      category: user.palette.category,
      palette: user.palette.palette
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching palette", error });
  }
});
// set profile avatar
router.get("/avatar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { avatarImg } = req.body;
    if (!id || !avatarImg) return res.status(400).json({ message: "id or avatarImg is empty" });
    const user = await userModel.findByIdAndUpdate(id, { avatarImg }, { new: true }).select("-password -email -mode -palette");
    if (!user) return res.status(400).json({ message: "user not found" });
    return res.status(200).json({ user })
  } catch (error) {
    return res.status(400).json(error);
  }
});
//profile update
router.put("/profile/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email, currentPassword, newPassword, confirmPassword } = req.body;
  console.log(name, email, currentPassword, newPassword, confirmPassword);
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
// edit name and email
router.put("/profile/:name/:email", async (req, res) => {
  const { name, email } = req.params;
  const { id } = req.body;
  if (!name || !email || !id) return res.status(400).json({ message: "all fields are required" });
  try {
    const user = await userModel.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(400).json({ message: "user not found" });
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
    // const token = jwt.sign(newUser._id, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error })
  }
});
// Register
router.post("/register", async (req, res) => {
  const { name, email, password, gender } = req.body;
  if (!name && !email && !password && !gender) {
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
    gender
  });
  if (!newUser) {
    return res.status(400).json({ message: "user created failed" });
  }
  // const token = jwt.sign(newUser._id, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
  res.status(200).json(newUser);
});
// Logout
router.get("/logout", async (req, res) => {
  try {
    res.status(200).json({ message: "Logout Successfull" })
  } catch (error) {
    res.status(400).json({ message: "Logout Unsuccessfull" })
  }
});
// follow user
router.post('/:userId/follow', async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.body.currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await currentUser.follow(userToFollow._id);
    await userToFollow.updateOne({ $push: { followers: currentUser._id } });
    const user = await User.findById(req.body.currentUserId);
    res.json({ message: 'Successfully followed user' }, user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Unfollow a user
router.post('/:userId/unfollow', async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.body.currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    await currentUser.unfollow(userToUnfollow._id);
    await userToUnfollow.updateOne({ $pull: { followers: currentUser._id } });
    const user = await User.findById(req.body.currentUserId);
    res.json({ message: 'Successfully unfollowed user' }, user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;