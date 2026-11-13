const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  getServices,
  createService,
  updateService,
  deleteService
} = require("../controllers/serviceController");

router.get("/", getServices);

router.post("/", protect, adminOnly, createService);
router.put("/:id", protect, adminOnly, updateService);
router.delete("/:id", protect, adminOnly, deleteService);

module.exports = router;