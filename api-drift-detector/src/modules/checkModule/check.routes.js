import express from "express";
import { runCheckController } from "./check.controller.js";

const router = express.Router();

router.post("/run", runCheckController);

export default router;