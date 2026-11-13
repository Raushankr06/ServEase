const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicket
} = require("../controllers/supportController");

router.use(protect);

router.post("/", createTicket);
router.get("/my", getMyTickets);
router.get("/admin/all", adminOnly, getAllTickets);
router.put("/admin/:id", adminOnly, updateTicket);

module.exports = router;