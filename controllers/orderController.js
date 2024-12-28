const Cart = require("../models/cart");
const Order = require("../models/order");
const Variation = require("../models/variation");

const createOrder = async (req, res) => {
  try {
    const { addressId } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    for (const item of cart.items) {
      const variation = await Variation.findOne({
        product: item.product,
        color: item.variation.color,
        "sizes.size": item.variation.size,
      });

      const sizeData = variation?.sizes.find(
        (s) => s.size === item.variation.size
      );
      if (!sizeData || sizeData.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${item.product}`,
        });
      }
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.variation.price * item.quantity,
      0
    );

    // Create order
    const order = new Order({
      user: req.user.userId,
      items: cart.items,
      shippingAddress: addressId,
      totalAmount: total,
      status: "pending",
      paymentStatus: "pending",
    });

    await order.save();

    // Update stock
    for (const item of cart.items) {
      await Variation.findOneAndUpdate(
        {
          product: item.product,
          color: item.variation.color,
          "sizes.size": item.variation.size,
        },
        {
          $inc: {
            "sizes.$.stock": -item.quantity,
          },
        }
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Create order successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error" + error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate("items.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Get user orders successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error" + error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product")
      .populate("shippingAddress");

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Get order successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error" + error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Get all orders successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error" + error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = req.body.status;
    await order.save();

    res.json({
      success: true,
      message: "Update order status successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error" + error.message,
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = req.body.paymentStatus;
    await order.save();

    res.json({
      success: true,
      message: "Update payment status successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error" + error.message,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
};
