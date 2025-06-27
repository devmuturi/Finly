const Customer = require('../libs/models/customer.model')
const Invoice = require('../libs/models/invoice.model')

const { KenyanShilling } = require('../libs/formatter')

const showDashboard = async (req, res) => {
  const query = { owner: req.session.userId }

  const invoiceCount = await Invoice.countDocuments(query)
  const customerCount = await Customer.countDocuments(query)

  const allInvoices = await Invoice.find(query).populate({
    path: 'customer',
    model: Customer,
    select: '_id name',
  })

  const totalPaid = allInvoices.reduce((sum, invoice) => {
    return invoice.status === 'paid' ? sum + invoice.amount : sum
  }, 0)

  res.render('pages/dashboard', {
    title: 'Dashboard',
    invoiceCount,
    customerCount,
    totalPaid,
    totalPending,
    KenyanShilling,
    info: req.flash('info')[0],
  })
}

module.exports = { showDashboard }
