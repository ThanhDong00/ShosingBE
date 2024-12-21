const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  getCategoryProducts,
} = require("../controllers/categoryController");
const { auth, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Admin routes
// router.post("/", auth, isAdmin, createCategory);
// router.put("/:id", auth, isAdmin, updateCategory);
// router.delete("/:id", auth, isAdmin, deleteCategory);
router.post("/", auth, isAdmin, createCategory);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

// Public routes
router.get("/", getAllCategory);
router.get("/:id", getCategoryById);
router.get("/:id/products", getCategoryProducts);

module.exports = router;
