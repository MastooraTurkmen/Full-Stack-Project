const mongoose = require("mongoose")
const { Schema } = mongoose

const userSchema = new Schema({
    googleId: String
})

module.exports = mongoose.models.users || mongoose.model("users", userSchema)