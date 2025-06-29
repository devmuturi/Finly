const Customer = require('../libs/models/customer.model');
const Invoice = require('../libs/models/invoice.model');
const { KenyanShillings } = require('../libs/formatter');
const { body, validationResult } = require('express-validator');

// Validation rules for invoices
const validateInvoice = [
  body('customer', 'Select the Customer').notEmpty(),
  body('amount', 'Amount must not be empty').isNumeric(),
  body('date', 'Due Date must not be empty').notEmpty(),
  body('status', 'Select the Status').notEmpty(),
];

// Enhanced populateInvoices function with search capability
const populateInvoices = (query, search) => {
  const populateOptions = {
    path: 'customer',
    model: Customer,
    select: '_id name',
  };

  if (search) {
    populateOptions.match = { 
      name: { $regex: search, $options: 'i' } 
    };
  }

  return query.populate(populateOptions)
    .then(invoices => invoices.filter(invoice => invoice.customer != null));
};

// Show all invoices with search functionality
const showInvoices = async (req, res) => {
  try {
    const query = { owner: req.session.userId };
    const { search } = req.query;

    const invoices = await populateInvoices(Invoice.find(query), search);

    res.render('pages/invoices', {
      title: 'Invoices',
      type: 'data',
      invoices,
      search: search || '', // Pass search term to view
      KenyanShillings,
      info: req.flash('info')[0],
      error: req.flash('error')[0]
    });

  } catch (error) {
    console.error('Invoice search error:', error);
    req.flash('error', 'Failed to load invoices');
    res.redirect('/dashboard');
  }
};

// Middleware to get customers for dropdowns
const getCustomers = async (req, res, next) => {
  try {
    const customersQuery = { owner: req.session.userId };
    req.customers = await Customer.find(customersQuery);
    next();
  } catch (error) {
    console.error('Get customers error:', error);
    req.flash('error', 'Failed to load customers');
    res.redirect('/dashboard');
  }
};

// Edit invoice form
const editInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const invoice = await populateInvoices(Invoice.findById(invoiceId));

    if (!invoice) {
      req.flash('error', 'Invoice not found');
      return res.redirect('/dashboard/invoices');
    }

    res.render('pages/invoices', {
      title: 'Edit Invoice',
      type: 'form',
      formAction: `/dashboard/invoices/${invoiceId}/edit`,
      customers: req.customers,
      invoice: req.flash('data')[0] || invoice,
      errors: req.flash('errors'),
    });

  } catch (error) {
    console.error('Edit invoice error:', error);
    req.flash('error', 'Failed to load invoice');
    res.redirect('/dashboard/invoices');
  }
};

// Create new invoice
const createInvoice = async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array();
      req.flash('errors', errors);
      req.flash('data', req.body);
      return res.redirect('/dashboard/invoices/create');
    }

    const newInvoice = {
      ...req.body,
      owner: req.session.userId
    };

    await Invoice.create(newInvoice);
    req.flash('info', {
      message: 'Invoice created successfully',
      type: 'success',
    });
    res.redirect('/dashboard/invoices');

  } catch (error) {
    console.error('Create invoice error:', error);
    req.flash('error', 'Failed to create invoice');
    res.redirect('/dashboard/invoices/create');
  }
};

// Update existing invoice
const updateInvoice = async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array();
      req.flash('errors', errors);
      req.flash('data', req.body);
      return res.redirect(`/dashboard/invoices/${req.params.id}/edit`);
    }

    const invoiceId = req.params.id;
    await Invoice.findByIdAndUpdate(invoiceId, req.body);
    
    req.flash('info', {
      message: 'Invoice updated successfully',
      type: 'success',
    });
    res.redirect('/dashboard/invoices');

  } catch (error) {
    console.error('Update invoice error:', error);
    req.flash('error', 'Failed to update invoice');
    res.redirect(`/dashboard/invoices/${req.params.id}/edit`);
  }
};

// Delete invoice
const deleteInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    await Invoice.findByIdAndDelete(invoiceId);
    
    req.flash('info', {
      message: 'Invoice deleted successfully',
      type: 'success',
    });
    res.redirect('/dashboard/invoices');

  } catch (error) {
    console.error('Delete invoice error:', error);
    req.flash('error', 'Failed to delete invoice');
    res.redirect('/dashboard/invoices');
  }
};

module.exports = {
  showInvoices,
  editInvoice,
  deleteInvoice,
  updateInvoice,
  createInvoice,
  getCustomers,
  validateInvoice,
};