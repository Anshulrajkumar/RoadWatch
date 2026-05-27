"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

const { reportIssue, rewriteDescription, listComplaintHistory } = require("../controllers/issueController");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads", "issues");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, name);
  },
});

const allowedTypes = new Set(["image/jpeg", "image/png", "image/jpg", "video/mp4"]);

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.has(file.mimetype)) {
    return cb(new Error("Unsupported file type. Please upload jpg, jpeg, png, or mp4."));
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.post(
  "/rewrite",
  rewriteDescription
);

router.get("/history", listComplaintHistory);

router.post(
  "/report",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  reportIssue
);

module.exports = router;
