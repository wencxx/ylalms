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
        } else {
            enrichedItems = items
        }

        // Simulate saving to a database
        const newActivity = {
            activityName,
            activityDescription,
            activityDescription,
            type: type || 'activity',
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

        // Add userContainer to each answer object
        const droppedItems = req.body.droppedItems || {};
        const addUserContainer = (answersArr) =>
            (answersArr || []).map(ans => ({
                ...ans,
                userContainer: droppedItems[ans.id] || null
            }));

        data.correctAnswers = addUserContainer(req.body.correctAnswers);
        data.wrongAnswers = addUserContainer(req.body.wrongAnswers);

        const activity = await Activity.findById(req.body.quizId);
        if (!activity) return res.status(404).send("Activity not found");

        const userSubmission = activity.submittedUser.find(u => u.id.toString() === id);

        if (userSubmission && userSubmission.attempt >= 3) {
            return res.status(403).send('Maximum attempts reached');
        }

        const existingAnswer = await Answer.findOne({ quizId: req.body.quizId, userId: id })

        if (existingAnswer) {
            existingAnswer.score = req.body.score
            existingAnswer.correctAnswers = data.correctAnswers
            existingAnswer.wrongAnswers = data.wrongAnswers
            existingAnswer.droppedItems = droppedItems
            existingAnswer.save()
        } else {
            const newAnswer = await Answer.create({
                ...data,
                droppedItems
            });

            if (!newAnswer) return res.status(400).send('Failed saving answer');
        }

        if (userSubmission) {
            // Increment attempt
            await Activity.updateOne(
                { _id: req.body.quizId, "submittedUser.id": id },
                { $inc: { "submittedUser.$.attempt": 1 } }
            );
        } else {
            // Add new user with attempt 1
            await Activity.findByIdAndUpdate(
                req.body.quizId,
                { $addToSet: { submittedUser: { id, attempt: 1 } } },
                { new: true }
            );
        }

        res.status(200).send('Answer saved successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
};

exports.CountDashboard = async (req, res) => {
    try {
        const totalUser = await User.countDocuments({ role: "student" })
        const totalMale = await User.countDocuments({ gender: "Male", role: "student" })
        const totalFemale = await User.countDocuments({ gender: "Female", role: "student" })
        const totalActivities = await Activity.countDocuments({ type: "activity" })
        const totalTodo = await Activity.countDocuments({ type: "todo" })

        // Get quiz performance
        const answers = await Answer.find().populate("quizId")

        const performance = {
            activity: {},
            todo: {},
        }

        answers.forEach((ans) => {
            const quizName = ans.quizId?.activityName || "Untitled Quiz"
            const type = ans.quizId?.type || "activity" // fallback
            const score = Number(ans.score)
            const items = Number(ans.items)

            if (!performance[type][quizName]) {
                performance[type][quizName] = { totalScore: 0, totalItems: 0, count: 0 }
            }

            performance[type][quizName].totalScore += score
            performance[type][quizName].totalItems += items
            performance[type][quizName].count += 1
        })

        // Convert to chart-ready arrays
        const activityChart = Object.entries(performance.activity).map(([quiz, data]) => ({
            quiz,
            averageScore: (data.totalScore / data.count).toFixed(2),
            averagePercentage: ((data.totalScore / data.totalItems) * 100).toFixed(1),
        }))

        const todoChart = Object.entries(performance.todo).map(([quiz, data]) => ({
            quiz,
            averageScore: (data.totalScore / data.count).toFixed(2),
            averagePercentage: ((data.totalScore / data.totalItems) * 100).toFixed(1),
        }))

        const data = {
            totalUser,
            totalMale,
            totalFemale,
            totalActivities,
            totalTodo,
            chartData: {
                activity: activityChart,
                todo: todoChart,
            },
        }

        res.status(200).send(data)
    } catch (error) {
        console.error(error)
        res.status(500).send("Server error")
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

exports.getAnswersById = async (req, res) => {
    const { id } = req.params


    try {
        const answers = await Answer.findById(id).populate('quizId').lean()

        if (!answers) return res.status(404).send('No answers found')

        res.status(200).send(answers)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}
