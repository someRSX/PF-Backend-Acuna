import express from 'express';
import Product from '../models/product.js';
import { Cart } from '../models/cart.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    const cart = await Cart.findOne({});

    res.render('home', { 
      title: 'Inicio', 
      message: '¡Bienvenido a la tienda virtual!',
      products,
      cart: cart || { products: [] }
    });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) return res.status(404).send('Carrito no encontrado');
    
    res.render('cart', { payload: cart.products });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
    };

    const filter = query
      ? {
          $or: [
            { category: { $regex: query, $options: 'i' } },
            { stock: query === 'available' ? { $gt: 0 } : undefined },
          ].filter(Boolean),
        }
      : {};

    const result = await Product.paginate(filter, options);
    const {
      docs: payload,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
    } = result;

    res.render('products', {
      payload,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
    });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

export default router;