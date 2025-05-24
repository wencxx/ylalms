const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
    activityName: {
        type: String,
        required: true
    },
    activityDescription: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
    },
    type: {
        type: String,
        default: 'activity'
    },
    activityType: {
        type: String,
        required: true
    },
    submittedUser: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
}, {
    timestamps: true,
    strict: false
})

module.exports = mongoose.model('Activity', activitySchema)