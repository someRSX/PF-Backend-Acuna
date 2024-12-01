import mongoose from 'mongoose';
import { Cart } from '../models/cart.js';
import Product from '../models/product.js';

export const createCart = async (req, res) => {
    try {
      const newCart = new Cart({
        products: []
      });
      
      await newCart.save();
      
      res.status(201).json({
        status: 'success',
        message: 'Carrito creado exitosamente',
        cart: newCart
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Error al crear el carrito',
        error: err.message
      });
    }
  };

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }

    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito o producto inválido' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const productIndex = cart.products.findIndex((p) => p.product.toString() === pid.toString());

    if (productIndex > -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito o producto inválido' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = cart.products.filter((p) => p.product.toString() !== pid.toString());

    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    for (const item of products) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ status: 'error', message: `Producto con ID ${item.product} no válido` });
      }
    }

    cart.products = products;

    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito o producto inválido' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex((p) => p.product.toString() === pid.toString());

    if (productIndex > -1) {
      if (quantity < 1) {
        return res.status(400).json({ status: 'error', message: 'La cantidad debe ser al menos 1' });
      }
      cart.products[productIndex].quantity = quantity;
    } else {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteAllProductsFromCart = async (req, res) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];

    await cart.save();
    res.json({ status: 'success', message: 'Carrito vacío' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};