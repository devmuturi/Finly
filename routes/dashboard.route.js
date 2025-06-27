const { Router } = require('express')
const router = Router()

const customersRouter = require('./customer.route')
const invoiceRouter = require('./invoice.route')

router.get('/', (req, res) => {
  res.render('pages/dashboard', {
    title: 'Dashboard',
    info: req.flash('info')[0],
  })
})

router.use('/customers', customersRouter)

router.use('invoices', invoiceRouter)

module.exports = router
