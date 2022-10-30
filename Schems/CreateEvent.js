const mongoose = require("mongoose");
const Event = mongoose.Schema({
    NameEvent: { type: String, required: true },
    Date: { type: String, required: true },
    photoUser: { type: String },
    Active: { type: Boolean, default: true }
})

module.exports = mongoose.model('Events', Event);
