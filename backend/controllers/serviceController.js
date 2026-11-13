const Service = require("../models/Service");

exports.getServices = async (req, res) => {
  try {
    const filter = req.user?.role === "admin"
      ? {}
      : { active: true };

    const services = await Service.find(filter).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      total: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const { name, category, description, price, image } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Service name and category are required"
      });
    }

    const service = await Service.create({
      name,
      category,
      description: description || "",
      price: Number(price) || 0,
      image: image || ""
    });

    res.status(201).json({
      success: true,
      message: "Service created",
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.json({
      success: true,
      message: "Service updated",
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.json({
      success: true,
      message: "Service deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};