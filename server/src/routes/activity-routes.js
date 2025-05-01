const express = require('express')
const router = express.Router()
const controller = require('../controller/activity.controller')

router.post('/activity/add', controller.add)
router.get('/activity/get', controller.get)
router.get('/activity/get/:id', controller.getSpecific)

module.exports = router