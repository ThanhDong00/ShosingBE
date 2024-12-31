const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      variation: {
        color: String,
        size: String,
        price: Number,
      },
      quantity: Number,
    },
  ],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
