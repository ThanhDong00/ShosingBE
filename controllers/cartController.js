const Cart = require("../models/cart");
const Product = require("../models/product");
const Variation = require("../models/variation");

const getAllCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate({
      path: "items.product",
      select: "name description",
    });

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const addCartItem = async (req, res) => {
  try {
    const { productId, color, size, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variation = await Variation.findOne({
      product: productId,
      color,
      "sizes.size": size,
    });

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: "Variation not found",
      });
    }

    const sizeData = variation.sizes.find((s) => s.size === size);
    if (!sizeData || sizeData.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variation.color === color &&
        item.variation.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.variation.price = sizeData.price;
    } else {
      cart.items.push({
        product: productId,
        variation: {
          color,
          size,
          price: sizeData.price,
        },
        quantity,
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateCartItemQuantity = async (req, res) => {
  // try {
  //   const { itemId } = req.params;
  //   const { quantity } = req.body;

  //   const cart = await Cart.findOne({ user: req.user.userId });
  //   if (!cart) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "Cart not found",
  //     });
  //   }

  //   const item = cart.items.id(itemId);
  //   if (!item) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "Item not found",
  //     });
  //   }

  //   const variation = await Variation.findOne({
  //     product: item.product,
  //     color: item.variation.color,
  //   });

  //   const sizeData = variation?.sizes.find(
  //     (s) => s.size === item.variation.size
  //   );
  //   if (!sizeData || sizeData.stock < quantity) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Insufficient stock",
  //     });
  //   }

  //   item.quantity = quantity;
  //   await cart.save();

  //   res.json({
  //     success: true,
  //     message: "Cart updated successfully",
  //     cart,
  //   });
  // } catch (error) {
  //   res.status(500).json({
  //     success: false,
  //     message: "Server error",
  //   });
  // }
  try {
    const { productId, color, size, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variation.color === color &&
        item.variation.size === size
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    const variation = await Variation.findOne({
      product: productId,
      color,
      "sizes.size": size,
    });

    const sizeData = variation?.sizes.find((s) => s.size === size);
    if (!sizeData || sizeData.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const removeCartItem = async (req, res) => {
  // try {
  //   const { itemId } = req.params;

  //   const cart = await Cart.findOne({ user: req.user.userId });
  //   if (!cart) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "Cart not found",
  //     });
  //   }

  //   cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  //   await cart.save();

  //   res.json({
  //     success: true,
  //     message: "Item removed from cart successfully",
  //     cart,
  //   });
  // } catch (error) {
  //   res.status(500).json({
  //     success: false,
  //     message: "Server error",
  //   });
  // }
  try {
    const { productId, color, size } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variation.color === color &&
        item.variation.size === size
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    cart.items = cart.items.filter((item) => item !== cart.items[itemIndex]);
    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getTotal = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.variation.price * item.quantity,
      0
    );

    res.json({
      success: true,
      message: "Total calculated successfully",
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAllCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  getTotal,
};
