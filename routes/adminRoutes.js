const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");
const router = express.Router();

router.get("/allUsers", getAllUsers);
router.get("/user/:id", getUserById);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports = router;

// GET     /api/users/                  ➝ Get all users (admin only)
// GET     /api/users/:id               ➝ Get user by ID (admin only)
// PATCH   /api/users/:id               ➝ Update user role/details (admin only)
// DELETE  /api/users/:id               ➝ Delete user (admin only)
