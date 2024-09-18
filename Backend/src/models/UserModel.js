import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    url: String,
    public_id: String,
    name: String,
    data: "Buffer",
    type: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    birthdate: { type: Date, trim: true },
    gender: { type: String },
    country: { type: String },
    dietaryPreferences: { type: String },
    profilePicture: { url: String, public_id: String },
    photos: { type: Map, of: photoSchema },
    refreshToken: [String],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
