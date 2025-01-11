const { Router } = require("express");
const { Avatar } = require('../db/db');
const { z } = require("zod");
const { AvatarSchema } = require("../types/index.js");
const authMiddleware = require("../middleware/auth.js");
const router = Router();

const app = express();
app.use(express.json());

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