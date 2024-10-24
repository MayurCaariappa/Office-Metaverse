const jwt = require("jsonwebtoken");
const { JWT_PASSWORD } = require("../config/config.js");

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;
    try {
        const words = token.split(" ");
        const jwtToken = words[1];

        const decoded = jwt.verify(jwtToken, JWT_PASSWORD);
        const username = decoded.username;

        if (username) {
            req.username = username;
            next();
        } else {
            res.status(403).json({
                msg: "You are not authenticated."
            })
        }
    } catch {
        res.json({
            msg: "Pass correct JWT"
        });
    }
}

module.exports = adminMiddleware;