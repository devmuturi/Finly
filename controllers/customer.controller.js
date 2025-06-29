const Customer = require('../libs/models/customer.model');
const { body, validationResult } = require('express-validator');
const Invoice = require('../libs/models/invoice.model');

// Validation rules for customer data
const validateCustomer = [
  body('name', 'Name must not be empty').trim().notEmpty().escape(),
  body('email', 'Please enter a valid email').trim().isEmail().normalizeEmail(),
  body('phone', 'Phone must not be empty').trim().notEmpty().escape(),
  body('address', 'Address must not be empty').trim().notEmpty().escape(),
];

// Display all customers with search functionality
const showCustomers = async (req, res) => {
  try {
    const query = { owner: req.session.userId };
    const { search } = req.query;

    // Apply search filter if search query exists
    if (search) {
      query['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Get customers with pagination
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCustomers = await Customer.countDocuments(query);
    const totalPages = Math.ceil(totalCustomers / limit);

    res.render('pages/customers', {
      title: 'Customers',
      type: 'data',
      customers,
      search: search || '',
      currentPage: page,
      totalPages,
      info: req.flash('info')[0],
      error: req.flash('error')[0],
    });

  } catch (error) {
    console.error('Customer controller error:', error);
    req.flash('error', 'Failed to load customers');
    res.redirect('/dashboard');
  }
};

// Create new customer
const createCustomer = async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array();
      req.flash('errors', errors);
      req.flash('data', req.body);
      return res.redirect('/dashboard/customers/create');
    }

    const newCustomer = {
      ...req.body,
      owner: req.session.userId
    };

    await Customer.create(newCustomer);
    req.flash('info', {
      message: 'Customer created successfully',
      type: 'success',
    });

    res.redirect('/dashboard/customers');

  } catch (error) {
    console.error('Create customer error:', error);
    req.flash('error', 'Failed to create customer');
    res.redirect('/dashboard/customers/create');
  }
};

// Show edit customer form
const editCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      req.flash('error', 'Customer not found');
      return res.redirect('/dashboard/customers');
    }

    res.render('pages/customers', {
      title: 'Edit Customer',
      type: 'form',
      formAction: `/dashboard/customers/${customerId}/edit`,
      customer: req.flash('data')[0] || customer,
      errors: req.flash('errors'),
    });

  } catch (error) {
    console.error('Edit customer error:', error);
    req.flash('error', 'Failed to load customer');
    res.redirect('/dashboard/customers');
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array();
      req.flash('errors', errors);
      req.flash('data', req.body);
      return res.redirect(`/dashboard/customers/${req.params.id}/edit`);
    }

    const customerId = req.params.id;
    const customerData = req.body;

    await Customer.findByIdAndUpdate(customerId, customerData);
    req.flash('info', {
      message: 'Customer updated successfully',
      type: 'success',
    });

    res.redirect('/dashboard/customers');

  } catch (error) {
    console.error('Update customer error:', error);
    req.flash('error', 'Failed to update customer');
    res.redirect(`/dashboard/customers/${req.params.id}/edit`);
  }
};

// Delete customer and related invoices
const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    // Delete related invoices first
    await Invoice.deleteMany({ customer: customerId });
    
    // Then delete the customer
    await Customer.findByIdAndDelete(customerId);
    
    req.flash('info', {
      message: 'Customer and related invoices deleted successfully',
      type: 'success',
    });

    res.redirect('/dashboard/customers');

  } catch (error) {
    console.error('Delete customer error:', error);
    req.flash('error', 'Failed to delete customer');
    res.redirect('/dashboard/customers');
  }
};

module.exports = {
  showCustomers,
  createCustomer,
  editCustomer,
  updateCustomer,
  deleteCustomer,
  validateCustomer,
};