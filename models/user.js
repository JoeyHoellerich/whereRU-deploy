const mongoose = require('mongoose')
const { Schema } = mongoose

// create a new object, from the class Schema, with the correct attributes
const userSchema = new Schema({
    username: {type: String, required: true},
    passwordDigest: {type: String, required: true}
})

// create a table in MongoDB
const User = mongoose.model("User", userSchema)

module.exports = User