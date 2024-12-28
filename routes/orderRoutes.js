const express = require("express");

const { auth, isAdmin } = require("../middleware/auth");

const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/orderController");

const router = express.Router();

// User routes
router.post("/", auth, createOrder);
router.get("/my-orders", auth, getUserOrders);
router.get("/:id", auth, getOrderById);

// Admin routes
router.get("/", auth, isAdmin, getAllOrders);
router.put("/:id/status", auth, isAdmin, updateOrderStatus);
router.put("/:id/payment", auth, isAdmin, updatePaymentStatus);

module.exports = router;
