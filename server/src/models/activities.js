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
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            attempt: {
                type: Number,
                default: 0
            }
        }
    ]
}, {
    timestamps: true,
    strict: false
})

module.exports = mongoose.model('Activity', activitySchema)