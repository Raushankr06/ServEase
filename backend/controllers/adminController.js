
const Booking = require("../models/Booking");
const User = require("../models/User");
const Notification = require("../models/Notification");

// GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalBookings: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE BOOKING STATUS + NOTIFICATION
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status"
      });
    }

    // Find booking first
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const oldStatus = booking.status;

    // Update status
    booking.status = status;
    await booking.save();

    // Create customer notification only if status changes
    if (oldStatus !== status) {
      try {
        await Notification.create({
          user: booking.user,
          title: "Booking Status Updated",
          message: `Your ${booking.serviceName} booking status has been changed from ${oldStatus} to ${status}.`,
          type: "Booking"
        });
      } catch (notificationError) {
        console.error(
          "Booking status notification error:",
          notificationError.message
        );
      }
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully!",
      booking: updatedBooking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ADMIN DASHBOARD STATISTICS
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "Pending" });
    const confirmedBookings = await Booking.countDocuments({ status: "Confirmed" });
    const completedBookings = await Booking.countDocuments({ status: "Completed" });
    const cancelledBookings = await Booking.countDocuments({ status: "Cancelled" });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL CUSTOMERS + SEARCH
const getAllCustomers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const customers = await User.find({
      role: "user",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalCustomers: customers.length,
      customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE CUSTOMER
const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findOneAndDelete({
      _id: req.params.id,
      role: "user"
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully!"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllBookings,
  updateBookingStatus,
  getDashboardStats,
  getAllCustomers,
  deleteCustomer
};
