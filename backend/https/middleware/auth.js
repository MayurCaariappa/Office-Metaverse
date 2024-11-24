const jwt = require("jsonwebtoken");
const { JWT_PASSWORD } = require("../../config/config.js");

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ 
            msg: "Authorization token is missing." 
        });
    }

    try {
        const jwtToken = token.split(" ")[1];
        const decoded = jwt.verify(jwtToken, JWT_PASSWORD);
        const { username, role } = decoded;

        if (username && role === "admin") {
            req.username = username;
            req.role = role;
            next();
        } else {
            res.status(403).json({
                msg: "Access denied. Admin privileges required."
            })
        }
    } catch (error) {
        res.status(401).send({
            msg: "Invalid or expired token. Please provide a valid token."
        });
    }
}

module.exports = authMiddleware;