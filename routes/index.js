const express = require("express");
const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const applicationRoutes = require("./applicationRoutes");
const adminRoutes = require("./adminRoutes");
const sourcingRoutes = require("./sourcingRoutes");
const userRoutes = require("./userRoutes");
const { authenticate } = require("../middlewares/authMiddleware");
const { isAdmin, isHR, isAdminOrHR } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/user", userRoutes);
router.use("/application", authenticate, applicationRoutes);
router.use("/admin", authenticate, isAdmin, adminRoutes);
router.use("/sourcing", authenticate, sourcingRoutes);
// router.get("/admin/dashboard", authenticate, (req, res) => {
//   res.status(200).json({ message: "Welcome Admin!" });
// });

module.exports = router;
