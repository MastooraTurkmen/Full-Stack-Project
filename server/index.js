const express = require("express")
const app = express()
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy

app.get("/", (req, res) => {
    res.send("Hello World")
})

passport.use(new GoogleStrategy())

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})