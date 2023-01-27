import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    client: {
      type: String,
      required: [true, "Please provide client"],
      maxlength: 50,
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["completed", "rejected", "pending"],
      default: "pending",
    },
    taskType: {
      type: String,
      enum: [
        "undefined",
        "billing",
        "electrical",
        "hardware",
        "groundskeeping",
      ],
      default: "undefined",
    },
    taskLocation: {
      type: String,
      default: "my city",
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
