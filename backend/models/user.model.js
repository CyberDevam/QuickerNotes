const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  mode:{
    type: String,
    default:"dark"
  },
  palette: {
    type: Object,
    default: {
      category: "professional",
      palette: {
        view: 'bg-blue-600 hover:bg-blue-700',
        edit: 'bg-emerald-600 hover:bg-emerald-700',
        delete: 'bg-rose-600 hover:bg-rose-700'
      }
    },
  }
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;