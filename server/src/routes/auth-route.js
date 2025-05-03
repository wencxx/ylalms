const express = require('express')
const router = express.Router()
const controller = require('../controller/auth.controller')
const authenticateToken = require('../middlewares/authenticate')

router.post('/auth/register', controller.add)
router.post('/auth/login', controller.login)
router.get('/auth/get-user', authenticateToken, controller.getUser)

module.exports = router