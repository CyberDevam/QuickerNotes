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
  mode: {
    type: String,
    default: "dark"
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
  },
  avatarImg: {
    type: String,
    default: "https://avatar.iran.liara.run/public"
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male"
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
});

userSchema.methods = {
  follow: function (userId) {
    if (!this.following.includes(userId)) {
      this.following.push(userId);
      return this.save();
    }
    throw new Error('Already following this user');
  },
  unfollow: function (userId) {
    this.following = this.following.filter(id => id.toString() !== userId.toString());
    return this.save();
  },
  isFollowing: function (userId) {
    return this.following.some(id => id.toString() === userId.toString());
  }
};
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;