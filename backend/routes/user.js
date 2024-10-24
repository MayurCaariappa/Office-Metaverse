const { Router } = require("express");
const { Admin, User, Avatar } = require("../db/db.js");
const adminMiddleware = require("../middleware/admin.js");
const router = Router();
const jwt = require("jsonwebtoken");
const { JWT_PASSWORD } = require("../config/config.js");

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        await User.create({
            username: username,
            password: password
        });

        res.status(200).send({
            msg: "User created successfully"
        });
    } catch (error) {
        res.status(500).send({
            msg: "User not created"
        });
    }
});

router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && user.password === password) {
            const token = jwt.sign({ username }, JWT_PASSWORD);
            res.status(200).send({
                msg: "User successfully signed in",
                token
            });
        } else {
            res.status(401).json({
                msg: "Incorrect credentials."
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: "An error occurred during sign in"
        });
    }
});

module.exports = router;
