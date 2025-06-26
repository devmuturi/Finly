const {
  validateSignUp,
  signup,
  validateLogin,
  login,
  logout,
} = require('../controllers/user.controller')
const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'Finly',
    info: req.flash('info')[0],
  })
})

router.get('/signup', (req, res) => {
  res.render('pages/signup', {
    title: 'Sign up',
    user: req.flash('data')[0],
    info: req.flash('info')[0],
    errors: req.flash('errors'),
  })
})

router.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Sign in',
    user: req.flash('data')[0],
    info: req.flash('info')[0],
    errors: req.flash('errors'),
  })
})

router.post('/login', validateLogin, login)

router.get('/logout', logout)

router.post('/signup', validateSignUp, signup)

module.exports = router
