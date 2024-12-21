const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
