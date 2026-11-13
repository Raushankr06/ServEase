
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  cancelBooking
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

// Create new booking
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/my-bookings", protect, getMyBookings);

// Cancel own pending booking
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
