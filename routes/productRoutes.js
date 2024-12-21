const express = require("express");

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  addProductVariation,
  updateProductVariation,
  deleteProductVariation,
} = require("../controllers/productController");
const { auth, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Admin routes
router.post("/", auth, isAdmin, createProduct);
// router.put("/:id", auth, isAdmin, updateProduct);
// router.delete("/:id", auth, isAdmin, deleteProduct);
// router.post("/:id/variations", auth, isAdmin, addProductVariation);
// router.put("/variations/:id", auth, isAdmin, updateProductVariation);
// router.delete("/variations/:id", auth, isAdmin, deleteProductVariation);

// Public routes
// router.get("/", getAllProducts);
// router.get("/:id", getProductById);
// router.get("/category/:categoryId", getProductsByCategory);

module.exports = router;
