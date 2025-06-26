const express = require('express')
const router = express.Router()

const { showCustomers } = require('../controllers/customer.controller')

router.get('/', showCustomers)

module.exports = router
