const { Router } = require('express')
const router = Router()

const {
  getUser,
  createUser,
  deleteUser,
} = require('../controllers/user.controller')

router.get('/', getUser)
router.get('/create', createUser)
router.get('/delete', deleteUser)

module.exports = router
