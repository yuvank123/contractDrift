import express from "express";

import contractRoutes from "./modules/contractModule/contract.routes.js";
import runnerRoutes from "./modules/runnerModule/runner.routes.js";
import validationRoutes from "./modules/validationModule/validation.routes.js";
import driftRoutes from "./modules/driftModule/drift.routes.js";

const app = express();

app.use(express.json());
app.use("/drift", driftRoutes);

app.use("/contracts", contractRoutes);
app.use("/runner", runnerRoutes);
app.use("/validation", validationRoutes);

app.get("/", (req, res) => {
  res.send("API Drift Detector Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});