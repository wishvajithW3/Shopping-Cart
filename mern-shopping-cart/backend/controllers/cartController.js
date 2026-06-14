import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({ path: "items.product", populate: { path: "category" } });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const formatCart = (cart) => {
  const validItems = cart.items.filter((item) => item.product);
  const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = validItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  return { _id: cart._id, user: cart.user, items: validItems, totalItems, totalPrice };
};

export const getCart = async (req, res) => {
  const cart = await getUserCart(req.user._id);
  res.json(formatCart(cart));
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      const newQty = existingItem.quantity + Number(quantity);
      if (newQty > product.stock) return res.status(400).json({ message: "Quantity exceeds available stock" });
      existingItem.quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    cart = await getUserCart(req.user._id);
    res.status(201).json(formatCart(cart));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (quantity > product.stock) return res.status(400).json({ message: "Quantity exceeds available stock" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = Number(quantity);
    await cart.save();

    const updatedCart = await getUserCart(req.user._id);
    res.json(formatCart(updatedCart));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  await cart.save();

  const updatedCart = await getUserCart(req.user._id);
  res.json(formatCart(updatedCart));
};

export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [], totalItems: 0, totalPrice: 0 });

  cart.items = [];
  await cart.save();
  res.json(formatCart(cart));
};
