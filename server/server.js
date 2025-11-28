const app = require('./app')
const connectDb = require('./src/config/db')
const cron = require('node-cron')
const notificationController = require('./src/controller/notification.controller')
require('dotenv').config()

connectDb()

// Schedule task to run every hour
cron.schedule('0 * * * *', () => {
    notificationController.checkDeadlines()
})

app.listen(3000, () => {
    console.log('Connected')
})