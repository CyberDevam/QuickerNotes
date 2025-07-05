const express = require('express');
const router = express.Router();
const Note = require('../models/note.model');
//all notes
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const notes = await Note.find({ user: userId });
    if (!notes || notes.length === 0) {
      return res.status(200).send("No notes found.");
    }
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
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
  const { title, content, user } = req.body;

  try {
    const note = await Note.create({
      user, // directly use user
      title,
      content
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
  const { id, title, content } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json(error)
  }
})

module.exports = router;