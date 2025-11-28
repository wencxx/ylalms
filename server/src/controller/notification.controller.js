const Notification = require('../models/notification')
const Activity = require('../models/activities')
const User = require('../models/user')

exports.checkDeadlines = async () => {
    try {
        const now = new Date()

        // Let's define "1 day before" as: dueDate is between 20 and 26 hours from now.
        // This gives us a 6-hour window to catch the deadline notification

        const startWindow = new Date()
        startWindow.setHours(startWindow.getHours() + 20)

        const endWindow = new Date()
        endWindow.setHours(endWindow.getHours() + 26)

        console.log('Checking deadlines...')
        console.log('Current time:', now.toISOString())
        console.log('Start window:', startWindow.toISOString())
        console.log('End window:', endWindow.toISOString())

        const upcomingActivities = await Activity.find({
            dueDate: {
                $gte: startWindow,
                $lte: endWindow
            }
        })

        console.log(`Found ${upcomingActivities.length} upcoming activities`)
        upcomingActivities.forEach(act => {
            console.log(`- ${act.activityName} (${act.type}) due at ${act.dueDate.toISOString()}`)
        })

        for (const activity of upcomingActivities) {
            // Find all students
            const students = await User.find({ role: 'student' })

            for (const student of students) {
                // Check if student has already submitted
                const hasSubmitted = activity.submittedUser.some(sub => sub.id.toString() === student._id.toString())

                if (!hasSubmitted) {
                    // Check if notification already exists to avoid duplicates
                    const existingNotification = await Notification.findOne({
                        userId: student._id,
                        activityId: activity._id,
                        type: 'deadline'
                    })

                    if (!existingNotification) {
                        await Notification.create({
                            userId: student._id,
                            message: `Reminder: The activity "${activity.activityName}" is due tomorrow.`,
                            type: 'deadline',
                            activityId: activity._id
                        })
                        console.log(`Created notification for student ${student._id} for activity ${activity.activityName}`)
                    }
                }
            }
        }
        console.log(`Deadline check complete. Found ${upcomingActivities.length} upcoming activities.`)
    } catch (error) {
        console.error('Error checking deadlines:', error)
    }
}

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.id })
            .sort({ createdAt: -1 })
        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error })
    }
}

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params
        await Notification.findByIdAndUpdate(id, { isRead: true })
        res.status(200).json({ message: 'Notification marked as read' })
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification', error })
    }
}
