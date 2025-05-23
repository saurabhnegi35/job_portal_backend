const express = require("express");
const {editUser} = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.patch("/edit", authenticate, editUser);

module.exports = router;
