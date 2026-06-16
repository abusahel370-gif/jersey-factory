const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
  getJerseys,
  createJersey,
  updateJersey,
  deleteJersey,
  getTeams,
} = require("../controllers/jerseyController");

router.get("/", getJerseys);
router.get("/teams", getTeams);

router.post("/", adminAuth, createJersey);
router.put("/:id", adminAuth, updateJersey);
router.delete("/:id", adminAuth, deleteJersey);

module.exports = router;
