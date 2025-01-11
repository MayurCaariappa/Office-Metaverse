const { Router } = require("express");
const cors = require("cors");
const { Map } = require("../db/db.js");
const { MapSchema } = require("../types/index.js");
const { upload } = require("../middleware/upload.js");
const authMiddleware = require("../middleware/auth.js");

const router = Router();

app.use(cors());

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
    try {
        const maps = await Map.find();

        if (!maps || maps.length === 0) {
            res.status(404).send({
                msg: "No Maps found."
            })
        }

        //sending only the image URLs in the fetchMap response
        const mapsWithUrls = maps.map((map) => ({
            ...map.toObject(),
            imageUrl: `http://localhost:3000/uploads/${map.imagePath.replace(/\\/g, '/')}`,
        }));

        res.status(200).send({
            msg: "Maps fetched successfully.",
            maps: mapsWithUrls,
        });
    } catch (error) {
        console.error("Error fetching maps:", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
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

module.exports = router;
