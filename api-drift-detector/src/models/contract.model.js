import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  filePath: {
    type: String,
    required: true
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Contract", contractSchema);