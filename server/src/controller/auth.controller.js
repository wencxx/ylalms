const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.add = async (req, res) => {
    const { username, password, ...rest } = req.body
    try {
        if(!username || !password) return res.status(404).send('Credentials not found')

        const isExisting = await User.findOne({ username })

        if(isExisting) return res.status(400).send('Username already exist')

        const hashedPass = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))

        const userData = {
            ...rest,
            username,
            password: hashedPass
        }

        const newUser = await User.create(userData)

        if(newUser){
            res.status(200).send('Added student successfully')
        }else{
            res.status(400).send('Failed to add student')
        }
    } catch (error) {
        console.log(error)
        res.sent(error)
    }
}


exports.login = async (req, res) => {
    const { username, password } = req.body

    try {
        const existingUser = await User.findOne({ username }).lean()

        if(!existingUser) return res.status(404).send('Student not found')

        const isMatch = await bcrypt.compare(password, existingUser.password)

        if(!isMatch) return res.status(400).send('Invalid password')

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

        if(!userData) return res.status(404).send('User not found')

        res.status(200).send(userData) 
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}