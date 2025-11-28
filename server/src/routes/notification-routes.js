const express = require('express')
const router = express.Router()
const controller = require('../controller/notification.controller')
const authenticateToken = require('../middlewares/authenticate')

router.get('/notifications', authenticateToken, controller.getNotifications)
router.put('/notifications/:id/read', authenticateToken, controller.markAsRead)
router.post('/notifications/check-deadlines', async (req, res) => {
    await controller.checkDeadlines()
    res.json({ message: 'Deadline check completed' })
})

module.exports = router
