import express from "express";
import { parseContractController } from "./contract.controller.js";

const router = express.Router();

router.post("/parse", parseContractController);

export default router;