const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)

        console.log('Connected to database')
    } catch (error) {
        console.log('Failed connection to database', error)
    }
}

module.exports = connectDb