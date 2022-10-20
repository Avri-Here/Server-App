const mongoose = require("mongoose");
const UserSchem = mongoose.Schema({
    Name: { type: String, required: true },
    password: { type: String, required: true },
    photoUser: { type: String }
})

module.exports = mongoose.model('Users', UserSchem);