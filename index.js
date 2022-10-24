// dependencies
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const { response } = require('express')

const app = express()

// middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.static('public'))
app.use(express.urlencoded( { extended: true }))
app.use(bodyParser.json())

// Database
mongoose.connect(process.env.ATLAS_URI, {useNewUrlParser: true, useUnifiedTopology: true},
    // run a function when you connect - type to console
    () => {
        console.log("connected to mongo: ", process.env.ATLAS_URI)
        // after connecting to database, use the API controller
        app.use('/api', require("./controllers/api"))
        // routing for frontend 
        app.use(express.static(path.resolve(__dirname, "./build")))
        // if application hits a route that doesn't start with /api, send it to the index.html
        app.get('*', function (req, res) {
            res.sendFile(path.resolve(__dirname, "./build", "index.html"))
        })
        console.log(__dirname)
        // listen on port
        app.listen(process.env.PORT, () => {
            console.log(`Listening on ${process.env.PORT}`)
        })
    }
)



