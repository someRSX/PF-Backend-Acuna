import express from 'express';
import { Cart } from '../models/cart.js';
import {
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteAllProductsFromCart,
  createCart
} from '../controllers/carts.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {

    let cart = await Cart.findOne({});

    if (!cart) {
      cart = new Cart({ products: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/', createCart);

router.post('/:cid/products/:pid', addProductToCart);

router.delete('/:cid/products/:pid', deleteProductFromCart);

router.put('/:cid', updateCart);

router.put('/:cid/products/:pid', updateProductQuantity);

router.delete('/:cid', deleteAllProductsFromCart);

export default router;