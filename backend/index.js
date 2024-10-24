const express = require("express");
const cors = require("cors");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});