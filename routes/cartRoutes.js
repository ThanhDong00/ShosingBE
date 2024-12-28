const express = require("express");

const {
  getAllCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  getTotal,
} = require("../controllers/cartController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getAllCart);
router.post("/items", auth, addCartItem);
router.put("/items/", auth, updateCartItemQuantity);
router.delete("/items/:itemId", auth, removeCartItem);
router.delete("/", auth, clearCart);
router.get("/total", auth, getTotal);

export default router;
