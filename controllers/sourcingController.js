const User = require("../models/User");
const Job = require("../models/Job");

exports.searchJobSeekers = async (req, res) => {
  try {
    const filters = req.query;

    const query = { role: "jobseeker" };

    if (filters.name) query.name = { $regex: filters.name, $options: "i" };
    if (filters.location) query.location = { $regex: filters.location, $options: "i" };
    if (filters.skills) query.skills = { $in: filters.skills.split(",") };

    // console.log("filters>>>>", filters)
    const jobseekers = await User.find(query).select("-password");
    res.status(200).json(jobseekers);
  } catch (err) {
    res.status(500).json({ message: "Failed to search jobseekers", error: err.message });
  }
};

exports.sourceCandidate = async (req, res) => {
  try {
    const { jobId, userId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Only the HR who created the job can source candidates
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to source for this job" });
    }

    // Add applicant if not already sourced
    if (!job.applicants.includes(userId)) {
      job.applicants.push(userId);
      await job.save();
    }

    res.status(200).json({ message: "Candidate sourced successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to source candidate", error: err.message });
  }
};

exports.getSourcedCandidatesForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate("applicants", "-password");

    if (!job) return res.status(404).json({ message: "Job not found" });

    // HR access control
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(job.applicants);
  } catch (err) {
    res.status(500).json({ message: "Failed to get sourced candidates", error: err.message });
  }
};
