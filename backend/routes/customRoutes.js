const express = require("express");

const router = express.Router();

const {
  createCustomRequest,
  getCustomRequests,
} = require("../controllers/customController");

router.get("/", getCustomRequests);

router.post("/", createCustomRequest);

module.exports = router;