const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  content: String,
  category: {
    type: String,
    enum: ["public", "private"],
    default: "private"
  }
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);
