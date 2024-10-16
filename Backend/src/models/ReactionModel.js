import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    receiver: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["cookAtHome", "eatOutside"],
      default: "cookAtHome",
    },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Reaction", reactionSchema);
