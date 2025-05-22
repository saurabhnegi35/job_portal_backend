const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getApplicationsByUser,
  getApplicationsByJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const {
  isJobSeeker,
  isHR,
  isAdminOrHR,
} = require("../middlewares/roleMiddleware");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/apply/:jobId", isJobSeeker, applyToJob);
router.get("/my-applications", isJobSeeker, getApplicationsByUser);
router.patch("/:applicationId", isAdminOrHR, updateApplicationStatus);
router.get("/job/:jobId", isAdminOrHR, getApplicationsByJob);

module.exports = router;

// POST    /api/applications/apply/:jobId       ➝ Apply to a job (Jobseeker only)      ✅
// GET     /api/applications/my-applications    ➝ View my applications (Jobseeker only)    ✅
// GET     /api/applications/job/:jobId         ➝ View applications for a job (HR only)    ⚠️
// PUT     /api/applications/:appId             ➝ Update application status (HR only)      ✅
