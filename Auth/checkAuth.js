const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    try {
        const token = req.body.token;
        let inU = jwt.verify(token, process.env.JWT_KEY);
        console.log(inU);
        req.tokenData = inU.UserName;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed !'
        })
    }
}

module.exports = checkAuth;