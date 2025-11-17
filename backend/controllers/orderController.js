const db = require('../config/db');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Affiliate)
exports.createOrder = async (req, res) => {
  const { customer_name, customer_phone, customer_address, product_id } = req.body;
  const affiliate_id = req.user.id;

  if (!customer_name || !customer_phone || !customer_address || !product_id) {
    return res.status(400).json({ msg: 'Please provide all required order details.' });
  }

  try {
    // Get product commission to store with the order
    const productRes = await db.query('SELECT commission FROM products WHERE id = $1', [product_id]);
    if (productRes.rows.length === 0) {
      return res.status(404).json({ msg: 'Product not found.' });
    }
    const commission = productRes.rows[0].commission;

    const { rows } = await db.query(
      'INSERT INTO orders (customer_name, customer_phone, customer_address, product_id, affiliate_id, commission, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [customer_name, customer_phone, customer_address, product_id, affiliate_id, commission, 'pending_review']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get orders for the logged-in affiliate
// @route   GET /api/orders/my
// @access  Private (Affiliate)
exports.getMyOrders = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT o.*, p.name as product_name FROM orders o JOIN products p ON o.product_id = p.id WHERE o.affiliate_id = $1 ORDER BY o.created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all orders pending review
// @route   GET /api/orders/pending
// @access  Private (Assistant Admin)
exports.getPendingOrders = async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT o.*, p.name as product_name, u.full_name as affiliate_name FROM orders o JOIN products p ON o.product_id = p.id JOIN users u ON o.affiliate_id = u.id WHERE o.status = 'pending_review' ORDER BY o.created_at ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Assistant Admin, Driver)
exports.updateOrderStatus = async (req, res) => {
  const { status, notes } = req.body;
  if (!status) {
    return res.status(400).json({ msg: 'Status is required.' });
  }

  // Add validation for allowed statuses based on user role if needed

  try {
    const { rows } = await db.query(
      'UPDATE orders SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [status, notes, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
