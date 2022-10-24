const users = require('express').Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// route to add a new user to database (sign up form)
users.post('/', async (req, res) => {
    // check to see if username already exists in the database
    let doesExist = await User.exists({username: req.body.username})

    // if the username is valid, add the user
    if (!doesExist){
        let password = req.body.password
        let user = await User.create({
            username: req.body.username,
            passwordDigest: await bcrypt.hash(password, 10)
        })
        res.status(201).json(user)
        // if the username already exists send an error
    } else {
        res.status(404).json({
            message: "user already exists"
        })
    }
})


// verfies a user when they log in (login form)
users.post('/authentication', async (req, res) => {
    // finds user with specified username
    let user = await User.findOne({username: req.body.username})

    // if the user does not exist of the password is incorrect, send error
    if (!user.passwordDigest || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({
            message: "incorrect username or password"
        })
    }

    // if the username/password is valid, send back signed token
    else {
        const token = jwt.sign({username: user.username}, process.env.JWT_SECRET)
        res.status(200).json({user: user, token: token})
    }
})

// used by context to verify if the user is signed in via JWT
users.get("/authentication/profile", async (req, res) => {
    try {
        //Split authorization header into ["Bearer", "Token"]
        const [authenticationMethod, token] = req.headers.authorization.split(' ')

        if (authenticationMethod == "Bearer"){
            const result = jwt.verify(token, process.env.JWT_SECRET)

            const { username } = result
            
            let user = await User.findOne({ username: username })
            res.json(user)
        }
    } catch {
        res.json(null)
    }
})

// testing route to get information on a particular user
users.get('/:username', async (req, res) => {
    let username = req.params.username

    const user = await User.findOne({username: username})

    if (!user) {
        res.json(null)
    } else {
        res.json(user)
    }
})

module.exports = users