import mongoose from "mongoose";

const driftIssueSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },

  type: String,
  field: String,
  severity: String,
  message: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("DriftIssue", driftIssueSchema);