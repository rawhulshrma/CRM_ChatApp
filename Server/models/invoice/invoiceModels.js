const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Helper function to validate input data
const validateInvoiceData = (data) => {
  if (!data.client || typeof data.client !== 'string' || data.client.length > 100) {
    throw new Error('Invalid client');
  }
  if (!Number.isInteger(data.number)) {
    throw new Error('Invalid invoice number');
  }
  if (!Number.isInteger(data.year) || data.year < 2000 || data.year > new Date().getFullYear()) {
    throw new Error('Invalid year');
  }
  if (!data.currencies || typeof data.currencies !== 'string' || data.currencies.length > 50) {
    throw new Error('Invalid currency');
  }
  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('Items should be a non-empty array');
  }
  if (!['paid', 'unpaid'].includes(data.payment)) {
    throw new Error('Invalid payment status');
  }
};

const createInvoiceTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS invoice (
      id UUID PRIMARY KEY,
      client VARCHAR(100) NOT NULL,
      number INTEGER NOT NULL,
      year INTEGER NOT NULL,
      currencies VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      payment VARCHAR(10) NOT NULL,
      date DATE NOT NULL,
      expire_date DATE NOT NULL,
      note TEXT,
      sub_total DECIMAL(10, 2) NOT NULL,
      tax_total DECIMAL(10, 2) NOT NULL,
      full_total DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      user_id UUID NOT NULL REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS invoice_item (
      id UUID PRIMARY KEY,
      invoice_id UUID REFERENCES invoice(id) ON DELETE CASCADE,
      item VARCHAR(255) NOT NULL,
      description TEXT,
      quantity INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      total DECIMAL(10, 2) NOT NULL
    );
  `;
  try {
    await pool.query(query);
    console.log('Invoice and Invoice Item tables created successfully');
  } catch (error) {
    console.error('Error creating Invoice tables:', error);
    throw error;
  }
};

const createInvoice = async (invoiceData, userId) => {
  const client = await pool.connect();
  try {
    validateInvoiceData(invoiceData);

    await client.query('BEGIN');

    const invoiceId = uuidv4();
    const invoiceQuery = `
      INSERT INTO invoice (id, client, number, year, currencies, status, payment, date, expire_date, note, sub_total, tax_total, full_total, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id
    `;
    await client.query(invoiceQuery, [
      invoiceId,
      invoiceData.client,
      invoiceData.number,
      invoiceData.year,
      invoiceData.currencies,
      invoiceData.status,
      invoiceData.payment,
      invoiceData.date,
      invoiceData.expire_date,
      invoiceData.note,
      invoiceData.sub_total,
      invoiceData.tax_total,
      invoiceData.full_total,
      userId
    ]);

    for (const item of invoiceData.items) {
      const itemQuery = `
        INSERT INTO invoice_item (id, invoice_id, item, description, quantity, price, total)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      await client.query(itemQuery, [uuidv4(), invoiceId, item.item, item.description, item.quantity, item.price, item.total]);
    }

    await client.query('COMMIT');
    return invoiceId;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating Invoice:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

const getInvoice = async (invoiceId, userId) => {
  const client = await pool.connect();
  try {
    const invoiceQuery = 'SELECT * FROM invoice WHERE id = $1 AND user_id = $2';
    const invoiceResult = await client.query(invoiceQuery, [invoiceId, userId]);
    const invoice = invoiceResult.rows[0];

    if (!invoice) {
      return null;
    }

    const itemsQuery = 'SELECT * FROM invoice_item WHERE invoice_id = $1';
    const itemsResult = await client.query(itemsQuery, [invoiceId]);
    invoice.items = itemsResult.rows;

    return invoice;
  } catch (error) {
    console.error('Error fetching Invoice:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

const updateInvoice = async (invoiceId, invoiceData, userId) => {
  const client = await pool.connect();
  try {
    validateInvoiceData(invoiceData);

    await client.query('BEGIN');

    const updateInvoiceQuery = `
      UPDATE invoice
      SET client = $1, number = $2, year = $3, currencies = $4, status = $5, payment = $6, date = $7, expire_date = $8,
          note = $9, sub_total = $10, tax_total = $11, full_total = $12
      WHERE id = $13 AND user_id = $14
      RETURNING id
    `;
    const result = await client.query(updateInvoiceQuery, [
      invoiceData.client,
      invoiceData.number,
      invoiceData.year,
      invoiceData.currencies,
      invoiceData.status,
      invoiceData.payment,
      invoiceData.date,
      invoiceData.expire_date,
      invoiceData.note,
      invoiceData.sub_total,
      invoiceData.tax_total,
      invoiceData.full_total,
      invoiceId,
      userId
    ]);

    if (result.rows.length === 0) {
      throw new Error('Invoice not found or user not authorized');
    }

    await client.query('DELETE FROM invoice_item WHERE invoice_id = $1', [invoiceId]);

    for (const item of invoiceData.items) {
      const itemQuery = `
        INSERT INTO invoice_item (id, invoice_id, item, description, quantity, price, total)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      await client.query(itemQuery, [uuidv4(), invoiceId, item.item, item.description, item.quantity, item.price, item.total]);
    }

    await client.query('COMMIT');
    return invoiceId;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating Invoice:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

const deleteInvoice = async (invoiceId, userId) => {
  try {
    const result = await pool.query('DELETE FROM invoice WHERE id = $1 AND user_id = $2 RETURNING id', [invoiceId, userId]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting Invoice:', error.message);
    throw error;
  }
};

const getAllInvoices = async (userId) => {
  try {
    const result = await pool.query('SELECT * FROM invoice WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all Invoices:', error.message);
    throw error;
  }
};

module.exports = {
  createInvoiceTable,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  getAllInvoices,
};