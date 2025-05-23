const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  ToggleJobStatus,
} = require("../controllers/adminController");
const { getAllJobs, deleteJob } = require("../controllers/jobController");
const router = express.Router();

router.get("/allUsers", getAllUsers);
router.get("/user/:id", getUserById);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.patch("/toggle-job-status", ToggleJobStatus)
router.delete("/delete-job/:id", deleteJob)

module.exports = router;

// GET     /api/users/                  ➝ Get all users (admin only)
// GET     /api/users/:id               ➝ Get user by ID (admin only)
// PATCH   /api/users/:id               ➝ Update user role/details (admin only)
// DELETE  /api/users/:id               ➝ Delete user (admin only)
