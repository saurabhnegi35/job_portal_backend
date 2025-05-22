const Application = require("../models/Application");
const Job = require("../models/Job");

// Apply to a job (Jobseeker)
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Prevent duplicate applications
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      status: "applied",
    });

    await application.save();

    await Job.findByIdAndUpdate(
      jobId,
      { $addToSet: { applicants: req.user._id } }, // $addToSet avoids duplicates
      { new: true }
    );

    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    res.status(500).json({ message: "Failed to apply", error: err.message });
  }
};

// Get all applications for a job (HR/Admin)
exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate("createdBy", "name email"); // Optional: include creator info
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Only creator (HR) or Admin can see applications
    if (
      req.user.role !== "admin" &&
      job.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({ job: jobId }).populate(
      "applicant",
      "-password"
    );

    res.status(200).json({
      job: {
        id: job._id,
        title: job.title,
        description: job.description,
        location: job.location,
        salaryRange: job.salaryRange,
        isActive: job.isActive,
        createdAt: job.createdAt,
        createdBy: job.createdBy,
      },
      applications,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: err.message,
    });
  }
};

// Get all applications by a user (Jobseeker)
exports.getApplicationsByUser = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    }).populate({ path: "job", select: "-applicants" });

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user applications",
      error: err.message,
    });
  }
};

// Update application status (HR/Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId).populate(
      "job"
    );
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    // Only Admin or HR who posted the job can update
    if (
      req.user.role !== "admin" &&
      application.job.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized to update status" });
    }

    application.status = status;
    await application.save();

    res
      .status(200)
      .json({ message: "Application status updated", application });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
};
