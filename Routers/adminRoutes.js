const express = require("express");
const router = express.Router();
const UserSchem = require("../Schems/UserSchem");
const jwt = require("jsonwebtoken");
const checkAuth = require("../Auth/checkAuth");
const Event = require("../Schems/CreateEvent");
const EventChat = require("../Schems/EventChat");

const obj = {
  changeEvent: ((req, res) => {
    const { Name, IdEvent, boolStatus } = req.body;
    console.log(Name, IdEvent);
    UserSchem.find({ Name: Name, admin: "true" }).then((re) => {
      if (re.length > 0)
        Event.findByIdAndUpdate(IdEvent, { Active: boolStatus }).then((response) => {
          return res.status(200).json({ "Update!": re })
        })
      else {
        return res.status(401).send("No Admin !")
      }
    }).catch((err) => {
      return res.status(500).json(err)
    })
  }),
  allEventsAdmin: (req, res) => {
    Event.find({}).then((response) => {
      const arr = [];
      response.forEach((element, index) => {
        let temp = response[index].Active ? "פעיל" : "לא פעיל";
        arr.push(temp)
        response[index].Date = element.Date.slice(0, 10);
        console.log(response[index].Date);
        response[index].reactActiv = temp;
      });
      res.status(200).json({ GetIt: response, arr: arr })
    }).catch((error) => {
      res.status(410).json({ GetIt: error })
    })
  },
  Login: (req, res) => {
    const { Name1, Name2, pass } = req.body;
    UserSchem.find({ Name: Name1 + " " + Name2, password: pass }).then(
      (response) => {
        if (response.length === 0) {
          return res.status(401).send("לא מזוהה, נסה שוב !");
        } else {
          const token = jwt.sign(
            { UserName: response[0].Name },
            process.env.JWT_KEY,
            {
              expiresIn: "10H",
            }
          );
          return res
            .status(200)
            .json({ message: response[0].Name, token: token });
        }
      }
    );
  },
  signUp: (req, res) => {
    const { Name1, Name2, pass } = req.body;
    UserSchem.find({ Name: Name1 + " " + Name2 }).then((response) => {
      console.log(response);
      if (response.length === 0) {
        const Account = new UserSchem({
          Name: Name1 + " " + Name2,
          password: pass,
          photoUser: "photoUser",
        });
        Account.save()
          .then(() => {
            res.status(200).json({ message: "Created !  " });
          })
          .catch((erorr) => {
            res.status(500).json({ erorr });
          });
      } else {
        res
          .status(209)
          .json({ message: "Conflit !  " + response[0].Name + " Is exsist !" });
      }
    });
  },
  CreateEvent: (async (req, res) => {
    const newEvent = new Event({
      NameEvent: req.body.NameEvent,
      Date: req.body.Date,
      photoUser: req.body.photoUser,
      Active: true
    })
    console.log(newEvent);
    try {
      let response = await newEvent.save();
      res.status(200).json({ status: "Good!", data: response })


    } catch (error) {
      res.status(400).json({ data: error })
    }



  }), allEvents: (async (req, res) => {
    try {
      const response = await Event.find({ Active: true });
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
  }), EventByName: ((req, res) => {
    const { IdEvent } = req.body;
    Event.find({ NameEvent: IdEvent }).then((response) => {

      return res.status(200).json(response)

    })
  }),
  idEvent: ((req, res) => {
    const { IdEvent } = req.body;
    Event.find({ IdEvent: IdEvent }).then((response) => {
      if (response.idEvent === true) {
        const change = new Event({
          IdEvent: IdEvent,
          Active: false
        })
        change.updateOne().then(() => {
          res.status(200).json({ Success: "change added !" })
        }).catch((erorr) => {
          res.status(500).json({ erorr })
        })
      }

    })
  }),
  Updateusers: () => { },
  deleteUser: () => { },
};
router.post("/changeEvent", obj.changeEvent);
router.get('/allEventsAdmin', obj.allEventsAdmin);


// router.post("/", checkAuth, obj.getAllUsers);
// router.get("/showAllUsers", obj.getAllUsers);
// router.post("/Login", obj.Login);
// router.post("/signUp", obj.signUp);
// router.post("/delete", obj.deleteUser);
// router.post("/Update", obj.Updateusers);
// router.get('/allEvents', obj.allEvents);
// router.post('/idEvent', obj.idEvent);
// router.post('/CreateEvent', obj.CreateEvent);
// router.post('/EventChat', obj.EventChat);
module.exports = router;
