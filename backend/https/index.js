const express = require("express");
const { router } = require("./routes/index.js");
const cors = require("cors");

// const adminRouter = require("./routes/admin");
// const userRouter = require("./routes/user");
// const avatarRouter = require("./routes/avatar");
// const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors()); 
app.use(express.json());
app.use("/api/v1", router);
   

// app.use(bodyParser.json());

// app.use("/admin", adminRouter);
// app.use("/user", userRouter);
// app.use("/avatar", avatarRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});