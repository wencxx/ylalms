const User = require('../models/user')
const Answer = require('../models/answers')
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
        const user = await User.find({
            role: 'student'
        })

        if (!user.length) return res.status(404).send('Users not found')

        res.status(200).send(user)
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

        const answers = await Answer.find({ userId: id }).sort({ createdAt: -1 }).populate('quizId').lean()

        let totalPercentage = 0;
        let validAnswerCount = 0;

        answers.forEach(answer => {
            if (answer.items > 0) {
                const percentage = (answer.score / answer.items) * 100;
                totalPercentage += percentage;
                validAnswerCount++;
            }
        });

        const averageScore = validAnswerCount > 0
            ? (totalPercentage / validAnswerCount).toFixed(2)
            : 0;


        res.status(200).send({ user, answers, averageScore })
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