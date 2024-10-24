const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/demo", (req, res) => {
    res.send("This is a demo api")
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});