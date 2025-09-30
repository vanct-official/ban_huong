import express from "express";
import {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  applyPromotion,
  getAvailablePromotions,
} from "../controllers/promotion.controller.js";

const router = express.Router();

router.get("/", getAllPromotions);
router.get("/available", getAvailablePromotions);
router.get("/:id", getPromotionById);
router.post("/", createPromotion);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);
router.post("/apply", applyPromotion);

export default router;
