const Feedback = require("../models/Feedback");

exports.createFeedback = async (req, res) => {
  try {
    const { serviceName, rating, comment, booking } = req.body;

    if (!serviceName || !comment || !rating) {
      return res.status(400).json({
        success: false,
        message: "Service, rating and comment are required"
      });
    }

    if (!Number.isInteger(Number(rating)) ||
        Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      serviceName,
      rating: Number(rating),
      comment,
      booking: booking || null
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("user", "name email")
      .populate("booking", "serviceName status")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: feedback.length,
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};