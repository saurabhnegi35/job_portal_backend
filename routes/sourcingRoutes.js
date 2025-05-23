const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { isHR, isAdminOrHR } = require("../middlewares/roleMiddleware");
const sourcingController = require("../controllers/sourcingController");

router.get("/jobseekers", isAdminOrHR, sourcingController.searchJobSeekers);
router.post(
  "/source/:jobId/:userId",
  isAdminOrHR,
  sourcingController.sourceCandidate
);
router.get(
  "/sourced/:jobId",
  isHR,
  sourcingController.getSourcedCandidatesForJob
);

module.exports = router;
