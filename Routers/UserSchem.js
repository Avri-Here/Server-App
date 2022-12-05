const express = require("express");
const router = express.Router();
const UserSchem = require("../Schems/UserSchem");
const jwt = require("jsonwebtoken");
const checkAuth = require("../Auth/checkAuth");
const sendMsgToUser = require("../Schems/sendMsgToUser");
const sendEmailToAdmin = require("../Util/SandEmail");

const obj = {
  getAllUsers: (req, res) => {
    UserSchem.find({}).then((response) => {
      return res.status(200).json({ GetIt: response });
    });
  },
  Login: (req, res) => {
    const { Name1, Name2, pass } = req.body;
    UserSchem.find({ Name: Name1 + " " + Name2, password: pass }).then(
      (response) => {
        console.log(response);
        if (response.length === 0) {
          return res.status(401).send("לא מזוהה, נסה שוב !");
        } else {
          console.log(response);
          const token = jwt.sign(
            { UserName: response[0].Name },
            process.env.JWT_KEY,
            {
              expiresIn: "10H",
            }
          );
          return res.status(200).json({
            message: response[0].Name,
            isAdmin: response[0].admin,
            token: token,
            id: response[0]._id,
          });
        }
      }
    );
  },
  signUp: (req, res) => {
    const { Name1, Name2, pass, photoUser } = req.body;
    UserSchem.find({ Name: Name1 + " " + Name2 }).then((response) => {
      console.log(response);
      if (response.length === 0) {
        const Account = new UserSchem({
          Name: Name1 + " " + Name2,
          password: pass,
          photoUser: photoUser,
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
  alarmUser: (req, res) => {
    const { id } = req.body;
    sendMsgToUser.find({ idUser: id, read: false }, function (err, docs) {
      if (err) {
        res.status(401).json({ err });
      } else {
        res.status(200).json({ docs });
      }
    });
  },
  UpdateAlarmUser: (req, res) => {
    const { id } = req.body;
    sendMsgToUser.findOneAndUpdate(
      { idUser: id, read: false },
      { read: true },
      function (err, docs) {
        if (err) {
          res.status(401).json({ err });
        } else {
          res.status(200).json({ docs });
        }
      }
    );
  },
  forgetpass: (req, res) => {
    const { name, fum } = req.body;
    UserSchem.findOne({ Name: name + " " + fum }).then((response) => {
      if (response) {
        sendEmailToAdmin(name + " " + fum, response.password)
          .then(() => {
            res.status(200).json("הודעה נשלחה למנהל מערכת ..");
          })
          .catch((e) => {
            res.status(304).json(e);
          });
      } else {
        res.status(401).send("שם לא מזוהה ..");
      }
    });
  },
};
router.post("/getAllUsers", checkAuth, obj.getAllUsers);
router.post("/Login", obj.Login);
router.post("/signUp", obj.signUp);
router.post("/alarmUser", obj.alarmUser);
router.post("/UpdateAlarmUser", obj.UpdateAlarmUser);
router.post("/forgetpass", obj.forgetpass);
module.exports = router;
