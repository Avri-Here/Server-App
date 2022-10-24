const mongoose = require("mongoose");
const Event = mongoose.Schema({
    NameEvent: { type: String, required: true },
    Date: { type: String, required: true },
    photoUser: {type: String}
})

module.exports = mongoose.model('Events', Event);
