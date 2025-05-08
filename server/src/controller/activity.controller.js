const Activity = require('../models/activities')
const Answer = require('../models/answers')
const User = require('../models/user')

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

exports.delete = async (req, res) => {
    const { id } = req.params
    
    try {
        const deletedActivity = await Activity.findByIdAndDelete(id) 

        if(deletedActivity){
            await Answer.deleteMany({ quizId: deletedActivity._id });

            res.status(200).send('Deleted activity successfully')
        }else{
            res.status(400).send('Failed to delete activity')
        }
    } catch (error) {
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

exports.addAnswer = async (req, res) => {
    const id = req.id;
    try {
        const data = {
            userId: id,
            ...req.body
        };

        const activity = await Activity.findById(req.body.quizId);
        if (!activity) return res.status(404).send("Activity not found");

        const newAnswer = await Answer.create(data);
        if (!newAnswer) return res.status(400).send('Failed saving answer');

        await Activity.findByIdAndUpdate(
            req.body.quizId,
            { $addToSet: { submittedUser: id } }, 
            { new: true }
        );

        res.status(200).send('Answer saved successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
};

exports.CountDashboard = async (req, res) => {
    try {
        const totalUser = await User.countDocuments({role: 'student'})
        const totalMale = await User.countDocuments({ gender: 'Male', role: 'student' })
        const totalFemale = await User.countDocuments({ gender: 'Female', role: 'student' })
        const totalActivities = await Activity.countDocuments()

        const data = {
            totalUser,
            totalMale,
            totalFemale,
            totalActivities
        }

        res.status(200).send(data)
    } catch (error) {
        res.status(500).send('Server error')
    }
}

exports.getAnswers = async (req, res) => {
    const { id } = req.params

    try {
        const answers = await Answer.find({ userId: id }).populate('quizId').lean()

        if(!answers.length) return res.status(404).send('No answers found')

        res.status(200).send(answers)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}