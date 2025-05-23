const Job = require("../models/Job");

// Create a new job (Admin or HR)
exports.createJob = async (req, res) => {
  try {
    let { skillsRequired, ...rest } = req.body;

    if (typeof skillsRequired === "string") {
      skillsRequired = skillsRequired
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // Ensure it's an array of trimmed strings
    if (Array.isArray(skillsRequired)) {
      skillsRequired = skillsRequired
        .map((skill) => skill.trim())
        .filter((skill) => !!skill);
    } else {
      skillsRequired = [];
    }
    // console.log("skillsRequired", skillsRequired);
    const job = new Job({
      ...rest,
      skillsRequired,
      createdBy: req.user._id,
    });

    await job.save();

    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create job", error: err.message });
  }
};

// Get all active jobs (for Jobseekers or public)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job
      .find
      // { isActive: true }
      ()
      .populate("createdBy", "name role");
    res.status(200).json(jobs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch jobs", error: err.message });
  }
};

// Get a job by its ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name role"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch job", error: err.message });
  }
};

// Update a job (Only if created by the same HR/Admin)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!job)
      return res.status(404).json({ message: "Job not found or unauthorized" });
    res.status(200).json({ message: "Job updated", job });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update job", error: err.message });
  }
};

// Delete a job (Only if created by the same HR/Admin)
exports.deleteJob = async (req, res) => {
  try {
    // console.log("req.params.id", req.params.id);

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Allow if user is creator or an admin
    const isCreator = job.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    return res
      .status(500)
      .json({ message: "Failed to delete job", error: err.message });
  }
};

// Get all jobs created by a specific HR
exports.getJobsByHR = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id });
    res.status(200).json(jobs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch jobs", error: err.message });
  }
};

exports.getAllJobsByHR = async (req, res) => {
  try {
    const hrId = req.user._id;
    // console.log("hrId", hrId)
    const jobs = await Job.find({ createdBy: hrId }).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching HR jobs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
