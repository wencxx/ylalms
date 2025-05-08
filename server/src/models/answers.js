const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: String,
        required: true
    },
    items: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Answer', answerSchema)