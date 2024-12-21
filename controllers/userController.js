const { Request, Response } = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const Address = require("../models/address");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;

    // Check if the email is already in use
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      role,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Logout a user
const logout = async (req, res) => {
  try {
    // const token = req.header("Authorization")?.replace("Bearer ", "");

    // // Add token to blacklist with expiry
    // await redisClient.setEx(
    //   `blacklist_${token}`,
    //   24 * 60 * 60, // 24 hours
    //   "true"
    // );

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("addresses");
    res.json({
      success: true,
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    await User.findByIdAndUpdate(req.user.userId, { name, phone });
    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update user password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Add user address
const addAddress = async (req, res) => {
  try {
    const address = new Address({
      user: req.user.userId,
      ...req.body,
    });

    const savedAddress = await address.save();

    if (savedAddress._id) {
      await User.findByIdAndUpdate(req.user.userId, {
        $push: { addresses: savedAddress._id },
      });
    }

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: savedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get user addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.userId });
    res.json({
      success: true,
      message: "Addresses retrieved successfully",
      addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findOne({ _id: id, user: req.user.userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    Object.assign(address, req.body);
    await address.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete user address
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Set default user address
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Remove default from all addresses
    await Address.updateMany({ user: req.user.userId }, { isDefault: false });

    // Set new default address
    const address = await Address.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Default address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
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
};
