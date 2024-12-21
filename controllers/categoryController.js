const Category = require("../models/category");
const Product = require("../models/product");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const category = new Category({
      name,
      description,
      image,
    });

    await category.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;
    let updateData = { name, description, image };

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all categories
const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      message: "Get all categories successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get a category by id
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Get category by id successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all products by category
const getCategoryProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.id });
    res.json({
      success: true,
      message: "Get all products by category successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  getCategoryProducts,
};
