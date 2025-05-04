const express = require('express')
const router = express.Router()
const controller = require('../controller/auth.controller')
const authenticateToken = require('../middlewares/authenticate')

router.post('/auth/register', authenticateToken, controller.add)
router.post('/auth/login', controller.login)
router.get('/auth/get-user', authenticateToken, controller.getUser)
router.get('/auth/get-all-users', authenticateToken, controller.getAllUsers)

module.exports = router