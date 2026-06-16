const express = require("express");

const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  createCustomRequest,
  getCustomRequests,
} = require("../controllers/customController");

router.post("/", createCustomRequest);
router.get("/", adminAuth, getCustomRequests);

module.exports = router;
