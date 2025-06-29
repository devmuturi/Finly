const Customer = require('../libs/models/customer.model')
const Invoice = require('../libs/models/invoice.model')
const { KenyanShillings } = require('../libs/formatter')

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

  const totalPending = allInvoices.reduce((sum, invoice) => {
    return invoice.status === 'pending' ? sum + invoice.amount : sum
  }, 0)

  allInvoices.sort((a, b) => new Date(b.date) - new Date(a.date))
  const latestInvoices = allInvoices.slice(0, 5)

  const revenueData = []
  const currentDate = new Date()
  currentDate.setDate(1) // Set to first day of current month to avoid month-length issues

  for (let i = 5; i >= 0; i--) {
    // Changed to count backwards
    const targetDate = new Date(currentDate)
    targetDate.setMonth(targetDate.getMonth() - i)

    const firstDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1,
    )
    const lastDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0,
    )
    const month = targetDate.toLocaleString('default', { month: 'short' })

    const revenueForMonth = allInvoices
      .filter((invoice) => {
        const invoiceDate = new Date(invoice.date)
        return invoiceDate >= firstDay && invoiceDate <= lastDay
      })
      .reduce((total, invoice) => total + invoice.amount, 0)

    revenueData.push({ month, revenue: revenueForMonth }) // Changed from unshift to push
  }

  res.render('pages/dashboard', {
    title: 'Dashboard',
    latestInvoices,
    revenueData: JSON.stringify(revenueData),
    invoiceCount,
    customerCount,
    totalPaid,
    totalPending,
    KenyanShillings,
    info: req.flash('info')[0],
  })
}

module.exports = {
  showDashboard,
}
