const Activity = require('../models/activities')

exports.add = async (req, res) => {
    if (!req.body) return res.send('No data found')

    try {
        const newData = await Activity.create(req.body)

        if (!newData) return res.status(400).send('Failed to add data')

        res.status(200).send('Added activity')
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

exports.get = async (req, res) => {
    try {
        const activities = await Activity.find()

        if (!activities.length) return res.status(404).send('No activities found')

        res.status(200).send(activities)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

exports.getSpecific = async (req, res) => {
    const { id } = req.params
    try {
        const activity = await Activity.findById(id)

        if (!activity) return res.status(404).send('Activity not found')

        res.status(200).send(activity)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}