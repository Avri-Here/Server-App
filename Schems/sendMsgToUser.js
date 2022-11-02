const mongoose = require("mongoose");
const sendMsgToUser = mongoose.Schema({
    idUser: { type: String, required: true },
    msg: { type: String, required: true },
    read: { type: Boolean, default: false }
})

module.exports = mongoose.model('sendMsgToUser', sendMsgToUser);
