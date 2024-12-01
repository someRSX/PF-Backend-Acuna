import Product from '../models/product.js';

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'price', category, available } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.available = available === 'true';

    const products = await Product.find(filter)
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      payload: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, available } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      available,
    });

    await newProduct.save();

    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};