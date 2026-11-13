const SupportTicket = require("../models/SupportTicket");
const Notification = require("../models/Notification");

exports.createTicket = async (req, res) => {
  try {
    const { subject, category, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required"
      });
    }

    const ticket = await SupportTicket.create({
      user: req.user.id,
      subject,
      category: category || "Other",
      message
    });

    res.status(201).json({
      success: true,
      message: "Support ticket created",
      ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: tickets.length,
      tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { status, adminReply } = req.body;

    const allowed = ["Open", "In Progress", "Resolved"];

    if (status && !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket status"
      });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    if (status) ticket.status = status;
    if (typeof adminReply === "string") {
      ticket.adminReply = adminReply.trim();
    }

    await ticket.save();

    await Notification.create({
      user: ticket.user,
      title: "Support ticket updated",
      message: `Your support ticket "${ticket.subject}" is now ${ticket.status}.`,
      type: "Support"
    });

    res.json({
      success: true,
      message: "Ticket updated successfully",
      ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};