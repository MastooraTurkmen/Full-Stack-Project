const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/User")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
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
