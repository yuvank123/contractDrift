import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ["low","medium","high","critical"]
  },
  issues: [String]
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);