import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { AppError } from "../utils/http";

function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function createStorage(directory: string) {
  ensureDirectoryExists(directory);

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, directory),
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const baseName = path
        .basename(file.originalname, extension)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      cb(null, `${Date.now()}-${baseName}${extension}`);
    },
  });
}

function imageFileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (!file.mimetype.startsWith("image/")) {
    cb(new AppError(400, "INVALID_FILE_TYPE", "Only image uploads are allowed."));
    return;
  }

  cb(null, true);
}

export function createImageUpload(directory: string) {
  return multer({
    storage: createStorage(directory),
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
}
