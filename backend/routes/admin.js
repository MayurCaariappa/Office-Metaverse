const { Router } = require("express");
const { Admin } = require("../db/db.js");
const adminMiddleware = require("../middleware/admin.js");
const { JWT_PASSWORD } = require("../config/config.js");  
const jwt = require("jsonwebtoken");
const router = Router();

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        await Admin.create({
            username: username,
            password: password
        });

        res.status(200).send({
            msg: "Admin created successfully"
        });
    } catch (error) {
        res.status(500).send({
            msg: "Admin not created"
        });
    }
});

router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Admin.findOne({ username });

        if (user && user.password === password) {
            const token = jwt.sign({ username }, JWT_PASSWORD);
            res.status(200).send({
                msg: "Admin successfully signed in",
                token
            });
        } else {
            res.status(411).json({
                msg: "Incorrect credentials."
            });
        }
    } catch (error) {
        res.status(500).send({
            msg: "An error occurred during sign in"
        });
    }
});

module.exports = router;
