// const { Router } = require("express");
// const { User, Avatar } = require("../db/db.js");
// const adminMiddleware = require("../middleware/admin.js");
// const router = Router();
// const jwt = require("jsonwebtoken");
// const { JWT_PASSWORD } = require("../config/config.js");

// router.post("/signup", async (req, res) => {
//     const { username, password, role } = req.body;

//     try {
//         const isUser = await User.findOne({ username });
//         if (isUser) {
//             res.send(400).status({
//                 msg: "User already exists."
//             })
//         }

//         await User.create({ username, password, role });
//         res.status(200).status({
//             msg: "User created successfully!"
//         });

//     } catch (error) {
//         res.status(500).send({
//             msg: "User not created."
//         });
//     }
// });


// router.post("/signin", async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username });

//         if (user && user.password === password) {
//             const token = jwt.sign({ username }, JWT_PASSWORD);

//             // Update the avatar's status to online
//             let avatar = await Avatar.findOne({ username });
//             if (avatar) {
//                 avatar.status = true;  // Set to online
//                 await avatar.save();
//             } else {
//                 // Create an avatar if it doesn't exist (for extra safety)
//                 avatar = new Avatar({
//                     username,
//                     status: true,
//                     position: { x: 0, y: 0 }
//                 });
//                 await avatar.save();
//             }

//             res.status(200).send({
//                 msg: "User successfully signed in",
//                 token
//             });
//         } else {
//             res.status(401).json({
//                 msg: "Incorrect credentials."
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             msg: "An error occurred during sign in"
//         });
//     }
// });

// module.exports = router;
