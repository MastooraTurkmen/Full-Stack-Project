require("dotenv").config()
const express = require("express")
const app = express()
require("./routes/authRoutes")(app)
require("./services/passport")

const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI)
require("./models/User")

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})