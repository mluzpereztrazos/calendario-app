const express = require("express");
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/events.controller.js");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

router.use(authenticate);

router.post("/", createEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;