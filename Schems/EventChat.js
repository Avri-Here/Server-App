const mongoose = require("mongoose");



const EventChat = mongoose.Schema({
  IdEvent: String,
  EventMessages: [
    {
      from: String,
      messages: String,
      timeMass: {
        type: Date,
        default: (() => {
          return new Date(Date.UTC(new Date().getFullYear(),
            new Date().getMonth(), new Date().getDate(), new Date().getHours(),
            new Date().getMinutes(), new Date().getSeconds(), new Date().getMilliseconds()))
        })

      },
    },
  ],
});

module.exports = mongoose.model("EventChat", EventChat);
