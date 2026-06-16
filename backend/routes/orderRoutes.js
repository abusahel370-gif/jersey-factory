const express = require("express");

const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", createOrder);

router.get("/", adminAuth, getOrders);
router.patch("/:id/status", adminAuth, updateOrderStatus);

module.exports = router;
