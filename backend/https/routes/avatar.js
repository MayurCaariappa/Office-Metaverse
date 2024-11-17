const { Router } = require("express");
const { Avatar } = require('../db/db');
const router = Router();

const app = express();
app.use(express.json());

router.post("/avatars", (req, res) => {
    const { avatarId, avatarName, imageBase64 } = req.body;

    try {
        Avatar.create({ avatarId, avatarName, imageBase64 })
        res.status(200).send({
            msg: "Avatar created successfully"
        });
    } catch (error) {
        res.status(400).status({
            msg: "Couldn't add the avatar"
        });
    }
});