const express = require('express')
const router = express.Router()
const controller = require('../controller/activity.controller')
const authenticateToken = require('../middlewares/authenticate')
const { storage } = require('../lib/cloudinary')
const multer = require('multer')
const upload = multer({ storage }) 

router.post('/activity/add', upload.any(), authenticateToken, controller.add)
router.get('/activity/get', authenticateToken, controller.get)
router.get('/activity/get-todo', authenticateToken, controller.getTodo)
router.get('/activity/get/:id', authenticateToken, controller.getSpecific)
router.post('/activity/add-answer', authenticateToken, controller.addAnswer)
router.get('/activity/count-dashboard', authenticateToken, controller.CountDashboard)
router.delete('/activity/delete/:id', authenticateToken, controller.delete)
router.get('/activity/get-answers/:id', authenticateToken, controller.getAnswers)

module.exports = router