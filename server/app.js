const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api', require('./src/routes/activity-routes'))
app.use('/api', require('./src/routes/auth-route'))

module.exports = app