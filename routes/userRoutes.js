const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  changePassword,
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");

const router = express.Router();
// Test route
router.get("/", (req, res) => {
  res.send("Hello World");
});

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);

// Profile routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/password", auth, changePassword);

// Address routes
router.post("/addresses", auth, addAddress);
router.get("/addresses", auth, getAddresses);
router.put("/addresses/:id", auth, updateAddress);
router.delete("/addresses/:id", auth, deleteAddress);
router.put("/addresses/:id/default", auth, setDefaultAddress);

module.exports = router;
