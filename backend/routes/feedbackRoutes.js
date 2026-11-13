const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  createFeedback,
  getMyFeedback,
  getAllFeedback
} = require("../controllers/feedbackController");

router.use(protect);

router.post("/", createFeedback);
router.get("/my", getMyFeedback);
router.get("/admin/all", adminOnly, getAllFeedback);

module.exports = router;