const express = require('express');
const router = express.Router();
const Note = require('../models/note.model');
//all notes
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const currentUserId = req.query.currentUserId;

    if (!userId) return res.status(400).json({ error: "User ID is required" });

    // Get all notes for the requested user
    const notes = await Note.find({ user: userId });
    if (!notes || notes.length === 0) {
      return res.status(200).send("No notes found.");
    }

    // If it's the same user or no currentUserId provided, return all notes
    if (!currentUserId || userId === currentUserId) {
      return res.json(notes);
    }

    // Check if users are following each other
    const User = require('../models/user.model');
    const requestedUser = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!requestedUser || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if users are following each other
    // Convert ObjectIds to strings for proper comparison
    const mutualFollow =
      requestedUser.followers.some(id => id.toString() === currentUserId) &&
      currentUser.followers.some(id => id.toString() === userId);

    // If they follow each other (mutual follow), return all notes including private ones
    // This implements the feature where users who follow each other can see all notes
    // Otherwise, filter out private notes for privacy
    const filteredNotes = mutualFollow
      ? notes
      : notes.filter(note => note.category !== "private");

    // Log the mutual follow status for debugging
    console.log(`Mutual follow between ${userId} and ${currentUserId}: ${mutualFollow}`);

    res.json(filteredNotes);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});
// global note
// In your note route (server-side)
// In your backend router for notes (e.g., notes.js)
router.get("/global/public", async (req, res) => {
  try {
    const notes = await Note.find({ category: "public" })
      .populate({
        path: 'user',
        // Select all user fields you need on the frontend (e.g., username, name, profilePicture)
        select: 'username name profilePicture', // Add 'name' here if your User model has it
        model: 'User'
      })
      .lean();

    res.status(200).json(notes);
  } catch (err) {
    console.error("Population error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// Get a single note by ID
router.get("/:id", async (req, res) => {
  try {
    const noteId = req.params.id;

    if (!noteId) {
      return res.status(400).json({ error: "Note ID is required" });
    }

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});
//create notes
router.post("/create", async (req, res) => {
  const { title, content, user, category } = req.body;

  try {
    const note = await Note.create({
      user, // directly use user
      title,
      content,
      category
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json(error);
  }
});

//delete a note
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await Note.findByIdAndDelete(id);
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(400).json(error)
  }
});
//edit or update a note
router.post("/edit", async (req, res) => {
  const { id, title, content, category } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(id, { title, content, category }, { new: true });
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json(error)
  }
});

// Like a note
router.post("/like", async (req, res) => {
  const { noteId, userId } = req.body;

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if user already liked the note
    if (note.likes.includes(userId)) {
      return res.status(400).json({ error: "Note already liked by this user" });
    }

    // Add user to likes array
    note.likes.push(userId);
    await note.save();

    res.status(200).json({ message: "Note liked successfully", likes: note.likes });
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

// Unlike a note
router.post("/unlike", async (req, res) => {
  const { noteId, userId } = req.body;

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if user has liked the note
    if (!note.likes.includes(userId)) {
      return res.status(400).json({ error: "Note not liked by this user" });
    }

    // Remove user from likes array
    note.likes = note.likes.filter(id => id.toString() !== userId);
    await note.save();

    res.status(200).json({ message: "Note unliked successfully", likes: note.likes });
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

module.exports = router;