const { Router } = require("express");
const { User, Avatar, Map } = require("../db/db.js");
const { SignupSchema, SigninSchema, AvatarSchema, MapSchema, DeleteMapSchema, DeleteAvatarSchema } = require("../types/index.js");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.js");
const { JWT_PASSWORD } = require("../config/config.js");
const { upload } = require("../middleware/upload.js");

const router = Router();

router.post("/signup", async (req, res) => {
    try {
        const validatedBody = SignupSchema.parse(req.body);
        const { username, password, role = "user" } = validatedBody;

        const isUser = await User.findOne({ username });
        if (!isUser) {
            await User.create({ username, password, role });
            return res.status(200).send({
                msg: `User ${username} created successfully!`
            });
        }

        res.status(400).send({
            msg: `User ${username} already exists. Proceed to signin.`
        });

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
            const token = jwt.sign({ username, role: user.role }, JWT_PASSWORD);

            res.status(200).send({
                msg: `User ${username} signed-in successfully`,
                token
            });
        } else {
            res.status(404).json({
                msg: `User ${username} not found. Kindly signup.`
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

router.post("/createAvatar", authMiddleware, upload.single('avatarImage'), async (req, res) => {
    try {
        req.body.avatarId = parseInt(req.body.avatarId, 10);

        const validatedBody = AvatarSchema.parse(req.body);
        const { avatarId, avatarName } = validatedBody;

        if (!req.file) {
            return res.status(400).send({ msg: "No avatar uploaded." });
        }

        const avatarImagePath = req.file.path;

        const isAvatar = await Avatar.findOne({ avatarId });
        if (!isAvatar) {
            await Avatar.create({ avatarId, avatarName, imagePath: avatarImagePath });
            return res.status(200).send({
                msg: `Avatar ${avatarName} created successfully.`
            });
        }

        res.status(400).send({
            msg: `Avatar already exists.`
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({
                msg: "Invalid input data.",
                errors: error.errors
            });
        }

        res.status(500).json({
            msg: "Something went wrong. Avatar not created."
        });
    }
});

router.get("/fetchAvatar", async (req, res) => {
    const avatars = await Avatar.find();

    if (!avatars) {
        res.status(404).send({
            msg: "No Avatars found."
        })
    }

    res.status(200).send({
        msg: "Avatars fetched successfully.",
        avatars
    })
});

router.delete("/avatars/:avatarId", authMiddleware, async (req, res) => {
    try {
        const { avatarId } = req.params;
        const deleteAvatar = await Avatar.findOneAndDelete({ avatarId });

        if (deleteAvatar) {
            res.status(200).send({
                msg: `Avatar ${avatarId} deleted successfully.`
            })
        } else {
            res.status(404).send({
                msg: `Avatar ${avatarId} not found.`
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: "Something went wrong. Couldn't delete the avatar."
        });
    }
});

router.post("/createMap", authMiddleware, upload.single('mapImage'), async (req, res) => {
    try {
        req.body.mapId = parseInt(req.body.mapId, 10);

        const validatedBody = MapSchema.parse(req.body);
        const { mapId, mapName } = validatedBody;

        if (!req.file) {
            return res.status(400).send({ msg: "No map uploaded." });
        }

        const mapImagePath = req.file.path;

        const isMap = await Map.findOne({ mapId });
        if (!isMap) {
            await Map.create({ mapId, mapName, imagePath: mapImagePath });
            return res.status(200).send({
                msg: `Map ${mapName} created successfully.`,
                mapImagePath
            });
        }

        res.status(400).send({
            msg: `Map already exists.`
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({
                msg: "Invalid input data.",
                errors: error.errors
            });
        }

        res.status(500).json({
            msg: "Something went wrong. Map not created."
        });
    }
});

router.get("/fetchMap", async (req, res) => {
    const maps = await Map.find();

    if (!maps) {
        res.status(404).send({
            msg: "No Maps found."
        })
    }

    res.status(200).send({
        msg: "Maps fetched successfully.",
        maps
    })
});

router.delete("/maps/:mapId", authMiddleware, async (req, res) => {
    try {
        const { mapId } = req.params;
        const deleteMap = await Map.findOneAndDelete({ mapId });

        if (deleteMap) {
            res.status(200).send({
                msg: `Map ${mapId} deleted successfully.`
            })
        } else {
            res.status(404).send({
                msg: `Map ${mapId} not found.`
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: "Something went wrong. Couldn't delete the map."
        });
    }
});

module.exports = { router };