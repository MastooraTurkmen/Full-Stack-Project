require("dotenv").config()
const express = require("express")
const cookieSession = require("cookie-session")
const passport = require("passport")

const app = express()
require("./services/passport")

const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI)
require("./models/User")


app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}))
app.use(passport.initialize())
app.use(passport.session())


app.get("/", (req, res) => {
    res.send("Hello World")
})

require("./routes/authRoutes")(app)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})