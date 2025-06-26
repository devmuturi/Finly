const express = require('express')
const router = express.Router()

const {
  showCustomers,
  createCustomer,
  validateCustomer,
} = require('../controllers/customer.controller')

router.get('/', showCustomers)

router.get('/create', function (req, res) {
  res.render('pages/customers', {
    title: 'Create Customer',
    formAction: 'create',
    type: 'form',
    customer: req.flash('data')[0],
    errors: req.flash('errors'),
  })
})

router.post('/create', validateCustomer, createCustomer)

module.exports = router
