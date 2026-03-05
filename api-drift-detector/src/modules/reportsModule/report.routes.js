import express from "express";
import {
  createReportController,
  getReportsController,
  getReportController
} from "./report.controller.js";

const router = express.Router();

router.post("/", createReportController);
router.get("/", getReportsController);
router.get("/:id", getReportController);

export default router;