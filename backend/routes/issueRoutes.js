"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

const { reportIssue, rewriteDescription, listComplaintHistory } = require("../controllers/issueController");
const { optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();

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
  optionalAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  reportIssue
);

module.exports = router;
