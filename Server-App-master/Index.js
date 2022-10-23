
const morgan = require("morgan");
const mongoose = require("mongoose");
const express = require("express");
const socket = require("socket.io");



const usersRoutes = require("./Routers/UserSchem");
const checkAuth = require("./Auth/checkAuth");

const app = express();

mongoose.connect("mongodb+srv://Chaim24:" + process.env.MongoPasword + "@binders.uazlu3v.mongodb.net/binders", { useNewUrlParser: true, useUnifiedTopology: true });


mongoose.connection.on('connected', () => {
    console.log("Mongo db Connected !");
})











app.use((morgan('dev')));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH ");
        return res.status(200).json({});
    }
    next();
})

app.use(express.static('public'));

app.post("/checkAuth", checkAuth, (req, res) => { return res.status(200).send("Good ! " +  req.tokenData) })
app.use('/users', usersRoutes);


app.use((req, res, next) => {
    const error = new Error('Soory, Not Found !');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            error: error.status
        }
    })
})





const PORT = process.env.PORT || 3010;

const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
});
const io = socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});





io.on('connection', (socket) => {
    socket.on('chat message from clinet', (msg, comper) => {
        console.log(msg, comper);
        io.sockets.emit('chat message', msg, comper);
    });
});

