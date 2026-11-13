
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  changePassword
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected customer profile routes
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
