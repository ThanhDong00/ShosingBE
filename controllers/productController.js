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

module.exports = { createProduct };
