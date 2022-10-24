// get data from MongoDB
const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose

// create a new object, from the class Schema, with the correct attributes
const placeSchema = new Schema({
    placeId: {type: String, required: true},
    name: {type: String, required: true},
    lat: {type: Decimal128, required: true},
    long: {type: Decimal128, required: true},
    photos: {type: Array, required: true}
})

// create a table in MongoDB
const Place = mongoose.model("Place", placeSchema)

module.exports = Place