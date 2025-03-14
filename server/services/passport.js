require("dotenv").config(); // Ensure environment variables are loaded
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

// Dynamically set the callback URL
// const callbackURL =
//     process.env.NODE_ENV === "production"
//         ? "https://morning-river-33301-a63d34fe2530.herokuapp.com/auth/google/callback"
//         : "http://localhost:3000/auth/google/callback"; // Change if your local server runs on a different port

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://morning-river-33301-a63d34fe2530.herokuapp.com/auth/google/callback",
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id })
            if (existingUser) {
                return done(null, existingUser);
            }
            const user = await new User({ googleId: profile.id }).save()
            done(null, user)
        }
    )
);
