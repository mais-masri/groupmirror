import { Schema, model, Types } from "mongoose";

const MoodSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    value: { type: Number, min: 1, max: 5, required: true },
    note: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

MoodSchema.index({ userId: 1, createdAt: -1 });
export default model("Mood", MoodSchema);