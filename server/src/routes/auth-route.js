const express = require('express')
const router = express.Router()
const controller = require('../controller/auth.controller')
const authenticateToken = require('../middlewares/authenticate')

router.post('/auth/register', authenticateToken, controller.add)
router.post('/auth/login', controller.login)
router.get('/auth/get-user', authenticateToken, controller.getUser)
router.get('/auth/get-specific-user/:id', authenticateToken, controller.getSpecificUser)
router.get('/auth/get-all-users', authenticateToken, controller.getAllUsers)
router.delete('/auth/delete/:id', authenticateToken, controller.deleteUser)
router.post('/auth/archive-all', authenticateToken, controller.archiveAllStudents)
router.get('/auth/get-archived-users', authenticateToken, controller.getArchivedUsers)
router.get('/auth/total-grades', controller.usersGrades)

module.exports = router