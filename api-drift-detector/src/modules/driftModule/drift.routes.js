import express from "express";
import { driftController } from "./drift.controller.js";

const router = express.Router();

router.post("/detect", driftController);

export default router;