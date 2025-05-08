const express = require('express')
const router = express.Router()
const controller = require('../controller/activity.controller')
const authenticateToken = require('../middlewares/authenticate')

router.post('/activity/add', authenticateToken, controller.add)
router.get('/activity/get', authenticateToken, controller.get)
router.get('/activity/get/:id', authenticateToken, controller.getSpecific)
router.post('/activity/add-answer', authenticateToken, controller.addAnswer)
router.get('/activity/count-dashboard', authenticateToken, controller.CountDashboard)
router.delete('/activity/delete/:id', authenticateToken, controller.delete)
router.get('/activity/get-answers/:id', authenticateToken, controller.getAnswers)

module.exports = router