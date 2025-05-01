const app = require('./app')
const connectDb = require('./src/config/db')
require('dotenv').config()

connectDb()

app.listen(3000, () => {
    console.log('Connected')
})