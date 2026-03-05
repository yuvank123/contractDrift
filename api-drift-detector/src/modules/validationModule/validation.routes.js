import express from "express";
import { validateResponseController } from "./validation.controller.js";

const router = express.Router();

router.post("/validate", validateResponseController);

export default router;