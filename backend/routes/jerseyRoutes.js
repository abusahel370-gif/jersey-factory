const express = require("express");
const router = express.Router();

const {
  getJerseys,
  createJersey,
  getTeams,
} = require("../controllers/jerseyController");

router.get("/", getJerseys);

router.post("/", createJersey);

router.get("/teams", getTeams);

module.exports = router;