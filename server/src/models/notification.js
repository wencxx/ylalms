const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: {
        type: String, // e.g., 'deadline', 'system'
        default: 'system'
    },
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Notification', notificationSchema)
