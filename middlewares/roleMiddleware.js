const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};

// Then use like:
exports.isAdmin = authorizeRoles("admin");
exports.isHR = authorizeRoles("hr");
exports.isJobSeeker = authorizeRoles("jobseeker");
exports.isAdminOrHR = authorizeRoles("admin", "hr");
