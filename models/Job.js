const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  salaryRange: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);