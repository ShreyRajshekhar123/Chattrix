const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  displayName: String,
  email: String,
  phoneNumber: String,
});

module.exports = mongoose.model("User", userSchema);
