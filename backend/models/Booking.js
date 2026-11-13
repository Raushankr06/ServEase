
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    serviceName: {
      type: String,
      required: true
    },

    appointmentDate: {
      type: String,
      required: true
    },

    appointmentTime: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
