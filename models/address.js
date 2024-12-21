const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  city: { type: String, required: true },
  district: { type: String, required: true },
  ward: { type: String, required: true },
  street: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

module.exports = mongoose.model("Address", addressSchema);
