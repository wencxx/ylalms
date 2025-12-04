const User = require('../models/user')
const Answer = require('../models/answers')
const Activity = require('../models/activities')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.add = async (req, res) => {
    const { username, password, ...rest } = req.body
    try {
        if (!username || !password) return res.status(404).send('Credentials not found')

        const isExisting = await User.findOne({ username })

        if (isExisting) return res.status(400).send('Username already exist')

        const hashedPass = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))

        const userData = {
            ...rest,
            username,
            password: hashedPass
        }

        const newUser = await User.create(userData)

        if (newUser) {
            res.status(200).send(newUser)
        } else {
            res.status(400).send('Failed to add student')
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


exports.login = async (req, res) => {
    const { username, password } = req.body

    try {
        const existingUser = await User.findOne({ username }).lean()

        if (!existingUser) return res.status(404).send('Student not found')

        const isMatch = await bcrypt.compare(password, existingUser.password)

        if (!isMatch) return res.status(401).send('Invalid password')

        const token = jwt.sign({ id: existingUser._id, usename: existingUser.username }, process.env.SECRET_KEY)

        const userData = {
            ...existingUser,
            token
        }

        res.status(200).send(userData)
    } catch (error) {
        res.status(200).send('Server error')
        console.log(error)
    }
}

exports.getUser = async (req, res) => {
    const id = req.id
    try {
        const userData = await User.findById(id)

        if (!userData) return res.status(404).send('User not found')

        res.status(200).send(userData)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: 'student',
            status: { $ne: 'archived' }
        }).lean()

        if (!users.length) return res.status(404).send('Users not found')

        const totalActivities = await Activity.countDocuments()

        const usersWithPercentage = []

        for (const user of users) {
            const userAnswer = await Answer.find({ userId: user._id })

            const quizIds = userAnswer.map(a => a.quizId.toString())

            const uniqueIds = new Set(quizIds)

            const percentage = (uniqueIds.size / totalActivities) * 100

            usersWithPercentage.push({ ...user, percentage })
        }


        res.status(200).send(usersWithPercentage)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

exports.getSpecificUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)

        if (!user) return res.status(404).send('User not found')

        const answers = await Answer.find({ userId: id })
            .sort({ createdAt: -1 })
            .populate('quizId')
            .lean()

        let totalPercentage = 0;
        let validAnswerCount = 0;

        answers.forEach(answer => {
            const score = Number(answer.score);
            const items = Number(answer.items);
            if (items > 0) {
                const percentage = (score / items) * 100;
                totalPercentage += percentage;
                validAnswerCount++;
            }
        });

        const averageScore = validAnswerCount > 0
            ? (totalPercentage / validAnswerCount).toFixed(2)
            : 0;

        const activities = answers.filter((a) => String(a.quizId?.type) == 'activity')
        const todos = answers.filter((a) => String(a.quizId?.type) == 'todo')

        res.status(200).send({ user, activities, todos, averageScore })
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        const deletedUser = await User.findByIdAndDelete(id)

        if (deletedUser) {
            await Answer.deleteMany({ userId: deletedUser._id })

            res.status(200).send("Deleted user successfully")
        } else {
            res.status(400).send('Failed to delete user')
        }
    } catch (error) {
        res.status(500).send('Server error')
    }
}

exports.usersGrades = async (req, res) => {
    try {
        const users = await User.find({
            role: 'student'
        }).lean()

        if (!users.length) return res.status(404).send('Users not found')

        const usersWithGrades = []

        for (const user of users) {
            const answers = await Answer.find({ userId: user._id }).populate('quizId')

            if (!answers.length) continue

            let totalAnswersTodo = 0
            let totalItemsTodo = 0
            let totalAnswersActivities = 0
            let totalItemsActivities = 0

            for (const answer of answers) {
                if (answer.quizId?.type === 'todo') {
                    totalAnswersTodo += answer.score
                    totalItemsTodo += answer.items
                } else {
                    totalAnswersActivities += answer.score
                    totalItemsActivities += answer.items
                }
            }

            const totalGradeTodo = totalItemsTodo ? (totalAnswersTodo / totalItemsTodo) * 100 : 0
            const totalGradeActivities = totalItemsActivities ? (totalAnswersActivities / totalItemsActivities) * 100 : 0

            const userDataWithGrades = {
                ...user,
                totalGradeTodo,
                totalGradeActivities
            }

            usersWithGrades.push(userDataWithGrades)
        }

        if (!usersWithGrades.length) return res.status(404).send('No grades found')


        res.status(200).send(usersWithGrades)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

exports.archiveAllStudents = async (req, res) => {
    const { schoolYear } = req.body
    try {
        await User.updateMany({ role: 'student' }, { status: 'archived', schoolYear })
        res.status(200).send('All students archived successfully')
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

exports.getArchivedUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: 'student',
            status: 'archived'
        }).lean()

        if (!users.length) return res.status(404).send('No archived students found')

        const totalActivities = await Activity.countDocuments()

        const usersWithPercentage = []

        for (const user of users) {
            const userAnswer = await Answer.find({ userId: user._id })

            const quizIds = userAnswer.map(a => a.quizId.toString())

            const uniqueIds = new Set(quizIds)

            const percentage = (uniqueIds.size / totalActivities) * 100

            usersWithPercentage.push({ ...user, percentage })
        }

        res.status(200).send(usersWithPercentage)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

exports.unarchiveUser = async (req, res) => {
    const { id } = req.params
    try {
        await User.findByIdAndUpdate(id, { status: 'active', schoolYear: null })
        res.status(200).send('User unarchived successfully')
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

exports.unarchiveBySchoolYear = async (req, res) => {
    const { schoolYear } = req.body
    try {
        await User.updateMany({ role: 'student', status: 'archived', schoolYear }, { status: 'active', schoolYear: null })
        res.status(200).send('Students unarchived successfully')
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}