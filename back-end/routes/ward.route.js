import express from "express";
import {
  getWards,
  getWardsByProvinceCode,
} from "../controllers/ward.controller.js";

const router = express.Router();

router.get("/", getWards);
router.get("/province/:provinceCode", getWardsByProvinceCode);

export default router;
