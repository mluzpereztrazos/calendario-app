import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} from "../controllers/events.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();


router.use(authenticate);

router.post("/", createEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;