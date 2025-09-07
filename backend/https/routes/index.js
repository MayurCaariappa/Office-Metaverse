const { Router } = require("express");
const { User } = require("../db/db.js");
const { SignupSchema, SigninSchema } = require("../types/index.js");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_PASSWORD } = require("../../config/config.js");
const cors = require("cors");
const express = require("express");
const path = require("path");
const mapRouter = require("./map.js");

const app = express();
app.use(cors());

const uploadsPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("Image path: " + uploadsPath);

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const validatedBody = SignupSchema.parse(req.body);
    const { username, password, role = "user" } = validatedBody;
    const isUser = await User.findOne({ username });

    if (!isUser) {
      await User.create({ username, password, role });
      return res.status(200).send({
        msg: `User ${username} created successfully!`,
      });
    }

    res.status(400).send({
      msg: `User ${username} already exists. Proceed to signin.`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({
        msg: "Invalid input data.",
        errors: error.errors,
      });
    }

    res.status(500).send({
      msg: "Something went wrong. User not created.",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const validatedBody = SigninSchema.parse(req.body);
    const { username, password } = validatedBody;
    const user = await User.findOne({ username });

    if (user && user.password === password) {
      const token = jwt.sign({ username, role: user.role }, JWT_PASSWORD);

      res.status(200).send({
        msg: `User ${username} signed-in successfully`,
        token,
      });
    } else {
      res.status(404).json({
        msg: `User ${username} not found. Kindly signup.`,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({
        msg: "Invalid input data.",
        errors: error.errors,
      });
    }

    res.status(500).json({
      msg: "An error occurred during sign in",
    });
  }
});

router.use("/", mapRouter);

module.exports = { router };
