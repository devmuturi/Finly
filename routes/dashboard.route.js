const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('pages/dashboard', { title: 'Dashboard' })
})

module.exports = router
