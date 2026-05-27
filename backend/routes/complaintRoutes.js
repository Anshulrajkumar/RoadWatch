"use strict";

const express = require("express");
const {
  listAllComplaints,
  getComplaint,
  listComplaintHistoryByUser,
} = require("../controllers/complaintController");

const router = express.Router();

router.get("/history/:userId", listComplaintHistoryByUser);
router.get("/", listAllComplaints);
router.get("/:id", getComplaint);

module.exports = router;
