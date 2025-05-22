const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/user", authenticate, authController.getCurrentUser);

module.exports = router;


// POST    /api/auth/register           ➝ Register (Jobseeker or HR)               ✅
// POST    /api/auth/login              ➝ Login                                    ✅
// GET     /api/auth/logout             ➝ Logout                                   ✅
// GET     /api/auth/user               ➝ Get current user profile (protected)     ✅
