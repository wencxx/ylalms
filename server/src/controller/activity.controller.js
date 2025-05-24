const Activity = require('../models/activities')
const Answer = require('../models/answers')
const User = require('../models/user')

exports.add = async (req, res) => {
    try {
        const { activityName, activityDescription, activityType, type, dueDate, items } = req.body;

        if (!activityName || !activityDescription || !items) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        let enrichedItems;

        if (req.files) {
            enrichedItems = items.map((item, idx) => {
                // Find a matching image file for this item, if any
                const file = req.files?.find((f) => f.fieldname === `items[${idx}][image]`);

                return {
                    question: item.question,
                    choices: item.choices,
                    correctAnswer: item.correctAnswer,
                    imageOriginalName: file?.originalname || null,
                    imageUrl: file?.path || null, // or use `file.path` if using disk storage
                };
            });
        }else{
            enrichedItems = items
        }

        // Simulate saving to a database
        const newActivity = {
            activityName,
            activityDescription,
            activityDescription,
            type: type || 'activity ',
            dueDate,
            activityType,
            items: enrichedItems,
        };

        const savedActivity = await Activity.create(newActivity)

        return res.status(200).json({ message: "Activity saved successfully!", data: savedActivity });
    } catch (error) {
        console.error("Error saving activity:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


exports.get = async (req, res) => {
    try {
        const activities = await Activity.find({ type: 'activity' })

        if (!activities.length) return res.status(404).send('No activities found')

        res.status(200).send(activities)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

exports.getTodo = async (req, res) => {
    try {
        const activities = await Activity.find({ type: 'todo' })

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

        if (deletedActivity) {
            await Answer.deleteMany({ quizId: deletedActivity._id });

            res.status(200).send('Deleted activity successfully')
        } else {
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
        const totalUser = await User.countDocuments({ role: 'student' })
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

        if (!answers.length) return res.status(404).send('No answers found')

        res.status(200).send(answers)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}