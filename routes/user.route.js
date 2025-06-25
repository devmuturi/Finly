const { validateSignUp, signup } = require('../controllers/user.controller')
const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('pages/index', { title: 'Finly' })
})
router.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Sign in',
  })
})
router.get('/signup', (req, res) => {
  res.render('pages/signup', {
    title: 'Sign up',
  })
})

router.post('/signup', validateSignUp, signup)

module.exports = router
