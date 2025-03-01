require("dotenv").config(); // Ensure environment variables are loaded
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/User")

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user)
    })
})

const callbackURL = "https://morning-river-33301-a63d34fe2530.herokuapp.com/auth/google/callback"
    || "http://localhost:3000/auth/google/callback"; // Change port if needed


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://morning-river-33301-a63d34fe2530.herokuapp.com/auth/google/callback"
        || "http://localhost:3000/auth/google/callback",
    proxy: true,
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
            // we already have a record with the given profile ID
            done(null, existingUser)
        } else {
            // we don't have a user record with this ID, make a new record
            new User({ googleId: profile.id }).save().then(user => done(null, user))
        }
    })
}))
