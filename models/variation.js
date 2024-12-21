const mongoose = require("mongoose");

const variationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  color: { type: String, required: true },
  sizes: [
    {
      size: { type: String, required: true },
      stock: { type: Number, default: 0 },
      price: { type: Number, required: true },
    },
  ],
  image: { type: String },
});

module.exports = mongoose.model("Variation", variationSchema);
