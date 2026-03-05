import mongoose from "mongoose";

const checkRunSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },

  startedAt: {
    type: Date,
    default: Date.now
  },

  finishedAt: {
    type: Date
  },

  driftDetected: {
    type: Boolean,
    default: false
  }

});

export default mongoose.model("CheckRun", checkRunSchema);