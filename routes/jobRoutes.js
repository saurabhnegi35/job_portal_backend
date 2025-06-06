const express = require("express");
const { isHR, isAdminOrHR } = require("../middlewares/roleMiddleware");
const {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getAllJobsByHR,
} = require("../controllers/jobController");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getAllJobs);
router.get("/my-jobs", authenticate, isAdminOrHR, getAllJobsByHR);
router.post("/", authenticate, isAdminOrHR, createJob);
router.patch("/:id", authenticate, isHR, updateJob);
router.delete("/:id", authenticate, isHR, deleteJob);

module.exports = router;

// GET     /api/jobs/                   ➝ Get all active jobs (public)  ✅
// GET     /api/jobs/:id                ➝ Get job by ID (public)   ❌
// GET     /api/jobs/my-jobs           ➝ Get all jobs created by HR (HR only)  ✅
// POST    /api/jobs/                   ➝ Create job (HR only)  ✅
// PUT     /api/jobs/:id                ➝ Update job (HR only)  ✅
// DELETE  /api/jobs/:id                ➝ Delete job (HR only)  ✅
