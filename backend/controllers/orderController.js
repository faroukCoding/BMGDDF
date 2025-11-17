const db = require('../config/db');

// @desc    Get all orders (for Admin/Assistant)
// @route   GET /api/orders
// @access  Private (Admin, Assistant Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT o.*, p.name as product_name, u.full_name as affiliate_name FROM orders o JOIN products p ON o.product_id = p.id JOIN users u ON o.affiliate_id = u.id';
    const queryParams = [];

    if (status) {
      queryParams.push(status);
      query += ' WHERE o.status = $1';
    }

    query += ' ORDER BY o.created_at DESC';

    const { rows } = await db.query(query, queryParams);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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

// @desc    Get orders assigned to the logged-in driver
// @route   GET /api/orders/driver
// @access  Private (Driver)
exports.getDriverOrders = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT o.*, p.name as product_name FROM orders o JOIN products p ON o.product_id = p.id WHERE o.driver_id = $1 ORDER BY o.created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Assistant Admin, Driver, Call Center)
exports.updateOrderStatus = async (req, res) => {
  const { status, notes } = req.body;
  if (!status) {
    return res.status(400).json({ msg: 'Status is required.' });
  }

  try {
    const { rows } = await db.query(
      'UPDATE orders SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [status, notes || '', req.params.id]
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

// @desc    Assign a driver to an order
// @route   PUT /api/orders/:id/assign
// @access  Private (Admin, Assistant Admin)
exports.assignDriver = async (req, res) => {
  const { driver_id } = req.body;
  if (!driver_id) {
    return res.status(400).json({ msg: 'Driver ID is required.' });
  }

  try {
    // Check if the user is a driver
    const driver = await db.query('SELECT role FROM users WHERE id = $1', [driver_id]);
    if (driver.rows.length === 0 || driver.rows[0].role !== 'driver') {
      return res.status(400).json({ msg: 'Invalid driver ID.' });
    }

    const { rows } = await db.query(
      "UPDATE orders SET driver_id = $1, status = 'out_for_delivery' WHERE id = $2 RETURNING *",
      [driver_id, req.params.id]
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
