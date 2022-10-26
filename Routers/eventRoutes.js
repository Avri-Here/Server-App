const express = require("express");
const router = express.Router();
const Event = require("../Schems/CreateEvent");
const EventChat = require("../Schems/EventChat");



const obj = {
    CreateEvent: (async (req, res) => {
        const newEvent = new Event({
            NameEvent: req.body.NameEvent,
            Date: req.body.Date,
            photoUser: req.body.photoUser
        })
        console.log(newEvent);
        try {
            let response = await newEvent.save();
            res.status(200).json({ data: response })


        } catch (error) {
            res.status(400).json({ data: error })
        }



    }), allEvents: (async (req, res) => {
        try {
            const response = await Event.find({});
            const filterArr = [];
            console.log(response);
            response.forEach((element, index) => {
                response[index].Date = element.Date.slice(0, 10);
            });
            res.status(200).json({ GetIt: response })
        } catch (error) {
            res.status(410).json({ GetIt: error })
        }

    }), EventChat: ((req, res) => {
        const { IdEvent, from, messages } = req.body;
        EventChat.find({ IdEvent: IdEvent }).then((response) => {
            console.log(response);
            if (response.length === 0 && messages) {

                const newEventChat = new EventChat({
                    IdEvent: IdEvent,
                    EventMessages: [{ from: from, messages: messages }]
                })
                newEventChat.save().then(() => {
                    res.status(200).json({ Success: "Comment added !" })
                }).catch((erorr) => {
                    res.status(500).json({ erorr })
                })
            }
            else if (!messages) {
                const returnRes = response.length === 0 ? [{ EventMessages: [{ messages: "אין תגובות עדיין" }] }] : response;
                res.status(200).json({ TakeIt: returnRes })
            }
            else {
                EventChat.updateOne(
                    { IdEvent: IdEvent },
                    { $push: { EventMessages: { from: from, messages: messages } } },
                    function (err, result) {
                        if (err) {
                            res.status(500).json({ err })
                        } else {
                            res.status(200).json({ Success: "Comment added !" })
                        }
                    }
                )
            }

        })


    }), Updateusers: () => {

    }, deleteUser: () => {

    }
};
router.get('/allEvents', obj.allEvents);
router.post('/CreateEvent', obj.CreateEvent);
router.post('/EventChat', obj.EventChat);
// router.post('/delete', obj.deleteUser);
// router.post('/Update', obj.Updateusers);
module.exports = router;