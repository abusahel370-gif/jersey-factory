const express = require("express");
const router = express.Router();
const { getJerseys } = require("../controllers/jerseyController");

router.get("/", getJerseys);

module.exports = router;