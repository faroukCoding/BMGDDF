const db = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
// @access  Private (for now, can be opened to other roles)
exports.getProducts = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Private
exports.getProductById = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin only)
exports.createProduct = async (req, res) => {
  const { name, description, price, commission, image_url } = req.body;
  if (!name || !price || !commission) {
    return res.status(400).json({ msg: 'Please provide name, price, and commission.' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO products (name, description, price, commission, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, commission, image_url]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
exports.updateProduct = async (req, res) => {
  const { name, description, price, commission, image_url } = req.body;
  if (!name || !price || !commission) {
    return res.status(400).json({ msg: 'Please provide name, price, and commission.' });
  }

  try {
    const { rows } = await db.query(
      'UPDATE products SET name = $1, description = $2, price = $3, commission = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [name, description, price, commission, image_url, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
