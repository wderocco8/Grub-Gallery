const express = require("express")
const cors = require('cors')
const mongoose = require('mongoose')

// vercel : automatically injects environment variables at runtime
const mongoUri = process.env.MONGODB_URI
const port = process.env.PORT

// initialize express application
const app = express()

app.use(express.json())

// Cors is needed to connect APIs to the frontend
app.use(cors())

// Connects to the MongoDB (URI)
mongoose.connect(mongoUri)

// use express Router to specific endpoints
const userRoute = require("./routes/user.js")
const spoonacularRoute = require("./routes/spoonacular.js")

// NOTE: access all users e.g. http://localhost:${port}/users/getUsers
app.use("/users", userRoute)
app.use("/search", spoonacularRoute)


// vercel : app.listen(...) is not necessary, but must export the app for serverless usage
module.exports = app