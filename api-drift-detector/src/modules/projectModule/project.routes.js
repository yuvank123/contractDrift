import express from "express";
import {
  createProjectController,
  getProjectsController,
  getProjectController
} from "./project.controller.js";

const router = express.Router();

router.post("/", createProjectController);
router.get("/", getProjectsController);
router.get("/:id", getProjectController);

export default router;