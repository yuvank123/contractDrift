import express from "express";
import { runEndpointsController } from "./runner.controller.js";

const router = express.Router();

router.post("/run", runEndpointsController);

export default router;