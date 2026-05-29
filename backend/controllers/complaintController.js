"use strict";

const {
  listComplaints,
  getComplaintById,
  listComplaintsByUser,
  buildTimeline,
  deriveProgressPercent,
} = require("../services/complaintStore");

const addDays = (dateValue, days) => {
  const base = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
};

const hydrateComplaint = (complaint) => {
  const submittedAt = complaint.submittedAt || complaint.createdAt || new Date().toISOString();
  const status = complaint.status || "Submitted";
  const assignedAuthority = complaint.assignedAuthority || complaint.authority || "District PWD";
  const engineerAssigned = complaint.engineerAssigned || "Executive Engineer (Roads)";
  const estimatedCompletion =
    complaint.estimatedCompletion || addDays(submittedAt, 14).toISOString().slice(0, 10);
  const timeline =
    Array.isArray(complaint.timeline) && complaint.timeline.length
      ? complaint.timeline
      : buildTimeline(status, submittedAt, assignedAuthority);
  const progressPercent =
    typeof complaint.progressPercent === "number" ? complaint.progressPercent : deriveProgressPercent(status);

  return {
    ...complaint,
    submittedAt,
    status,
    assignedAuthority,
    engineerAssigned,
    estimatedCompletion,
    timeline,
    progressPercent,
  };
};

const listAllComplaints = async (req, res, next) => {
  try {
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null;

    const allData = await listComplaints();
    const all = allData
      .map(hydrateComplaint)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const complaints = limit ? all.slice(0, limit) : all;

    return res.json({
      success: true,
      total: all.length,
      complaints,
    });
  } catch (error) {
    return next(error);
  }
};

const getComplaint = async (req, res, next) => {
  try {
    const complaint = await getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.json({
      success: true,
      complaint: hydrateComplaint(complaint),
    });
  } catch (error) {
    return next(error);
  }
};

const listComplaintHistoryByUser = async (req, res, next) => {
  try {
    const userId = String(req.params.userId || "").trim();
    const allData = await listComplaintsByUser(userId);
    const all = allData
      .map(hydrateComplaint)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return res.json({
      success: true,
      total: all.length,
      userId,
      complaints: all,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listAllComplaints, getComplaint, listComplaintHistoryByUser };
