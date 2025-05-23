const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { isHR } = require("../middlewares/roleMiddleware");
const sourcingController = require("../controllers/sourcingController");

router.get("/jobseekers", isHR, sourcingController.searchJobSeekers);
router.post("/source/:jobId/:userId", isHR, sourcingController.sourceCandidate);
router.get(
  "/sourced/:jobId",
  isHR,
  sourcingController.getSourcedCandidatesForJob
);

module.exports = router;
