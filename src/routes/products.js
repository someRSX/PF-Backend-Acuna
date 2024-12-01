import express from 'express';
import Product from '../models/product.js';
import { getProducts, createProduct } from '../controllers/products.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;

  const filters = {};
  if (query) {
    filters.category = query;
  }

  try {
    const products = await Product.find(filters)
      .sort({ price: sort === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const totalCount = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalCount / limit);
    const prevPage = page > 1 ? Number(page) - 1 : null;
    const nextPage = page < totalPages ? Number(page) + 1 : null;

    return res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: Number(page),
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
      nextLink: nextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/', createProduct);

export default router;