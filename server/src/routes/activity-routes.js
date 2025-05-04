const express = require('express')
const router = express.Router()
const controller = require('../controller/activity.controller')
const authenticateToken = require('../middlewares/authenticate')

router.post('/activity/add', authenticateToken, controller.add)
router.get('/activity/get', authenticateToken, controller.get)
router.get('/activity/get/:id', authenticateToken, controller.getSpecific)
router.post('/activity/add-answer', authenticateToken, controller.addAnswer)

module.exports = router