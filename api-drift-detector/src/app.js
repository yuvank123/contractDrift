import express from "express";

import { connectDB } from "./config/db.js";

import contractRoutes from "./modules/contractModule/contract.routes.js";
import runnerRoutes from "./modules/runnerModule/runner.routes.js";
import validationRoutes from "./modules/validationModule/validation.routes.js";
import driftRoutes from "./modules/driftModule/drift.routes.js";
import reportRoutes from "./modules/reportsModule/report.routes.js";
import checkRoutes from "./modules/checkModule/check.routes.js";
import projectRoutes from "./modules/projectModule/project.routes.js";

const app = express();

app.use(express.json());
app.use("/drift", driftRoutes);

app.use("/contracts", contractRoutes);
app.use("/runner", runnerRoutes);
app.use("/validation", validationRoutes);
app.use("/reports", reportRoutes);
app.use("/checks", checkRoutes);
app.use("/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("API Drift Detector Running");
});

await connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});