import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: String,
  baseUrl: String,
  contractPath: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Project", projectSchema);