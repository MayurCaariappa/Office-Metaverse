const express = require("express");
const { router } = require("./routes/index.js");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
const uploadsPath = require("path").resolve(__dirname, "./uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("Serving static files from: " + uploadsPath);

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
