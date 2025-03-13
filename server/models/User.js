const mongoose = require("mongoose")
const { Schema } = mongoose

const userSchema = new Schema({
    googleId: String,
    credits: { type: Number, default: 0 }
})

module.exports = mongoose.models.users || mongoose.model("users", userSchema)