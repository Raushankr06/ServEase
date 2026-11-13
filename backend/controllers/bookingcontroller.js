
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

// CREATE NEW BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      serviceName,
      appointmentDate,
      appointmentTime,
      phone,
      address
    } = req.body;

    if (
      !serviceName ||
      !appointmentDate ||
      !appointmentTime ||
      !phone ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all booking details"
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      serviceName,
      appointmentDate,
      appointmentTime,
      phone,
      address
    });

    // CREATE BOOKING NOTIFICATION
    try {
      await Notification.create({
        user: req.user.id,
        title: "Booking Successful",
        message: `Your ${booking.serviceName} booking has been submitted successfully.`,
        type: "Booking"
      });
    } catch (notificationError) {
      console.error(
        "Booking notification error:",
        notificationError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Booking created successfully!",
      booking
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET LOGGED-IN USER BOOKINGS
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// CANCEL CUSTOMER'S OWN PENDING BOOKING
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID"
      });
    }

    // Find booking belonging to logged-in customer
    const booking = await Booking.findOne({
      _id: id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Only Pending bookings can be cancelled
    if (booking.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Only Pending bookings can be cancelled. Current status: ${booking.status}`
      });
    }

    booking.status = "Cancelled";
    await booking.save();

    // CREATE CANCELLATION NOTIFICATION
    try {
      await Notification.create({
        user: req.user.id,
        title: "Booking Cancelled",
        message: `Your ${booking.serviceName} booking has been cancelled.`,
        type: "Booking"
      });
    } catch (notificationError) {
      console.error(
        "Cancellation notification error:",
        notificationError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully!",
      booking
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking
};
