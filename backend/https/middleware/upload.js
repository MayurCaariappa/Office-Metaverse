const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const safeFileName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9._-]/g, "");
    cb(null, `${Date.now()}-${safeFileName}`);
  },
});
const upload = multer({ storage: storage });

module.exports = { upload };
