const { Router } = require("express");
const { User } = require("../db/db.js");
const { SignupSchema, SigninSchema } = require("../types");
const { z } = require("zod");
const jwt = require("jsonwebtoken");

const router = Router();
// const adminMiddleware = require("../middleware/admin.js");


const { JWT_PASSWORD } = require("../config/config.js");

router.post("/signup", async (req, res) => {
    try {
        const validatedBody = SignupSchema.parse(req.body);
        const { username, password, role = "user" } = validatedBody;

        const isUser = await User.findOne({ username });
        if (!isUser) {
            await User.create({ username, password, role });
            return res.status(200).send({
                msg: "User created successfully!"
            });
        }

        res.status(400).send({
            msg: "User already exists. Proceed to signin."
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({
                msg: "Invalid input data.",
                errors: error.errors
            });
        }

        res.status(500).send({
            msg: "Something went wrong. User not created."
        });
    }
});

router.post("/signin", async (req, res) => {
    try {
        const validatedBody = SigninSchema.parse(req.body);
        const { username, password } = validatedBody;
        const user = await User.findOne({ username });

        if (user && user.password === password) {
            const token = jwt.sign({ username }, JWT_PASSWORD);

            res.status(200).send({
                msg: "User signed-in successfully",
                token
            });
        } else {
            res.status(404).json({
                msg: "User not found. Kindly signup."
            });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({
                msg: "Invalid input data.",
                errors: error.errors
            });
        }

        res.status(500).json({
            msg: "An error occurred during sign in"
        });
    }
});

module.exports = { router };