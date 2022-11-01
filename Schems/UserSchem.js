const mongoose = require("mongoose");
const UserSchem = mongoose.Schema({
    Name: { type: String, required: true },
    password: { type: String, required: true },
    photoUser: { type: String },
    admin: { type: String, default: "standard" }
})

module.exports = mongoose.model('Users', UserSchem);