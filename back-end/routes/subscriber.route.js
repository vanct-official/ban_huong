import express from "express";
import {
  createSubscriber,
  getSubscribers,
  deleteSubscriber,
} from "../controllers/subscriber.controller.js";

const router = express.Router();

router.post("/", createSubscriber);
router.get("/", getSubscribers);
router.delete("/:id", deleteSubscriber);

export default router;
