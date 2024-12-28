const Product = require("../models/product");
const Category = require("../models/category");
const Variation = require("../models/variation");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, basePrice, category, variations } = req.body;

    if (!name || !basePrice || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    const product = new Product({
      name,
      description,
      basePrice,
      category,
    });

    await product.save();

    if (variations && Array.isArray(variations)) {
      const savedVariations = await Promise.all(
        variations.map(async (variation) => {
          if (!variation.color || !variation.sizes) {
            throw new Error("Color and sizes are required for variations");
          }

          const newVariation = new Variation({
            product: product._id,
            color: variation.color,
            sizes: variation.sizes,
            image: variation.image || "",
          });

          return newVariation.save();
        })
      );

      product.variations = savedVariations.map((v) => v._id);
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("variations");
    res.status(200).json({
      success: true,
      message: "Get all products successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("variations");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get product by id successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("category")
      .populate("variations");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Variation.deleteMany({ product: id });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const addProductVariation = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, sizes, image } = req.body;

    const variation = new Variation({
      product: id,
      color,
      sizes,
      image,
    });

    await variation.save();

    await Product.findByIdAndUpdate(id, {
      $push: {
        variations: variation._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Variation added successfully",
      variation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateProductVariation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const variation = await Variation.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: "Variation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Variation updated successfully",
      variation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteProductVariation = async (req, res) => {
  try {
    const { id } = req.params;

    const variation = await Variation.findByIdAndDelete(id);

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: "Variation not found",
      });
    }

    await Product.findByIdAndUpdate(variation.product, {
      $pull: {
        variations: variation._id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Variation deleted successfully",
      variation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  addProductVariation,
  updateProductVariation,
  deleteProductVariation,
  deleteProduct,
};
