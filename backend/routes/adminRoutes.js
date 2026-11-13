
const express = require("express");
const router = express.Router();

const {
  getAllBookings,
  updateBookingStatus,
  getDashboardStats,
  getAllCustomers,
  deleteCustomer
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Admin Authentication
router.use(protect, adminOnly);

// Dashboard
router.get("/stats", getDashboardStats);

// Booking Management
router.get("/bookings", getAllBookings);
router.put("/bookings/:id/status", updateBookingStatus);

// Customer Management
router.get("/customers", getAllCustomers);
router.delete("/customers/:id", deleteCustomer);

module.exports = router;
