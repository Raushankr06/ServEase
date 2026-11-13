
const adminOnly = (req, res, next) => {
  try {
    // Check whether user is logged in
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login first."
      });
    }

    // Check whether user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    // Allow admin to continue
    next();

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin authorization failed."
    });
  }
};

module.exports = { adminOnly };
