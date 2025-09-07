const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.resolve(__dirname, "../uploads/maps");

// Create directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created directory: ${uploadsDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use absolute path
  },
  filename: (req, file, cb) => {
    const safeFileName = file.originalname.toLowerCase();
    cb(null, `${safeFileName}`);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
