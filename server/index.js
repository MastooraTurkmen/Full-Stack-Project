require("dotenv").config()
const express = require("express")
const cookieSession = require("cookie-session")
const passport = require("passport")
const bodyParser = require("body-parser")

const app = express()
require("./services/passport")

const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI)
require("./models/User")

app.use(bodyParser.json())
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
require("./routes/billingRoutes")(app)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Server is running on port 3000")
})