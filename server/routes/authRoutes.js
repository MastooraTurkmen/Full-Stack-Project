const passport = require('passport')

module.exports = (app) => {
    app.get("/auth/google", passport.authenticate("google", {
        scope: ["profile", "email"]
    }))

    app.get("/auth/google/callback", passport.authenticate("google"), (req, res) => {
        res.redirect("https://morning-river-33301-a63d34fe2530.herokuapp.com/surveys")
    })

    app.get("/api/logout", (req, res) => {
        req.logout()
        res.send(req.user)
    })

    app.get('/api/current_user', (req, res) => {
        res.send(req.user)
    })
}