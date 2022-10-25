const mongoose = require("mongoose");
const EventChat = mongoose.Schema({
    IdEvent: String,
    EventMessages: [{ from: String, messages: String, timeMass: { type: Date, default: Date.now } }]
})

module.exports = mongoose.model('EventChat', EventChat);