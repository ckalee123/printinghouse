import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { AppError } from "./error.middleware";

const ALLOWED_IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/gif"]);
const ALLOWED_IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif"]);

const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${crypto.randomUUID()}${ext}`);
    }
});

function imageFileFilter(req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_IMAGE_MIME.has(file.mimetype) && ALLOWED_IMAGE_EXT.has(ext)) {
        cb(null, true);
    } else {
        cb(new AppError("Dozvoljeni formati slike su JPG, PNG i GIF"));
    }
}

export const uploadImage = multer({
    storage: imageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const jsonStorage = multer.memoryStorage();

function jsonFileFilter(req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".json" && (file.mimetype === "application/json" || file.mimetype === "text/plain" || file.mimetype === "application/octet-stream")) {
        cb(null, true);
    } else {
        cb(new AppError("Dozvoljen je samo JSON fajl"));
    }
}

export const uploadJson = multer({
    storage: jsonStorage,
    fileFilter: jsonFileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});
