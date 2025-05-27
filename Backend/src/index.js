import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { app, server } from "./socket/index.js";
import { FRONTEND_URL, PORT } from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import peopleRoutes from "./routes/peopleRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import { connectDB } from "./config/db.js";
import "./libs/cronJobs.js";

app.use(cors({
  origin: [FRONTEND_URL, "http://192.168.11.15:5173"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./upload",
    createParentPath: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/recipe", recipeRoutes);

try {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Something is wrong waiting to connectDB", error);
}
