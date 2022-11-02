const express = require("express");
const router = express.Router();
const UserSchem = require("../Schems/UserSchem");
const jwt = require("jsonwebtoken");
const checkAuth = require("../Auth/checkAuth");



const obj = {
    getAllUsers: ((req, res) => {
        UserSchem.find({}).then((response) => {
            return res.status(200).json({ response })
        })

    }), signIn: ((req, res) => {
        const { Name1, Name2, pass } = req.body;
        UserSchem.find({ Name: Name1 + " " + Name2, password: pass }).then((response) => {
            if (response.length === 0) {
                return res.status(401).send("לא מזוהה, נסה שוב !")
            } else {
                const token = jwt.sign({ UserName: response[0].Name }, process.env.JWT_KEY,
                    {
                        expiresIn: "10H"
                    });
                return res.status(200).json({ message: response[0].Name + " ברוך הבא !", token: token })
            }

        })

    }), signUp: ((req, res) => {
        const { Name1, Name2, pass } = req.body;
        UserSchem.find({ Name: Name1 + " " + Name2 }).then((response) => {
            // console.log(response);
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
router.post('/getAllUsers', checkAuth, obj.getAllUsers);
router.post('/signIn', obj.signIn);
router.post('/signUp', obj.signUp);
router.post('/delete', obj.deleteUser);
router.post('/Update', obj.Updateusers);
router.get('/getAllUsers', obj.getAllUsers);
module.exports = router;