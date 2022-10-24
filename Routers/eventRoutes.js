const express = require("express");
const router = express.Router();
const Event = require("../Schems/CreateEvent");



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

    }), signUp: ((req, res) => {
        const { Name1, Name2, pass } = req.body;
        UserSchem.find({ Name: Name1 + " " + Name2 }).then((response) => {
            console.log(response);
            if (response.length === 0) {

                const Account = new UserSchem({
                    Name: Name1 + " " + Name2,
                    password: pass,
                    photoUser: "photoUser"
                })
                Account.save().then(() => {
                    res.status(200).json({ message: "Created !  " })
                }).catch((erorr) => {
                    res.status(500).json({ erorr })
                })
            }
            else {
                res.status(209).json({ message: "Conflit !  " + response[0].Name + " Is exsist !" })
            }

        })


    }), Updateusers: () => {

    }, deleteUser: () => {

    }
};
router.get('/allEvents', obj.allEvents);
router.post('/CreateEvent', obj.CreateEvent);
// router.post('/signUp', obj.signUp);
// router.post('/delete', obj.deleteUser);
// router.post('/Update', obj.Updateusers);
module.exports = router;