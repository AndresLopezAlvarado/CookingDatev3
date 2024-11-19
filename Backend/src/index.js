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
import path from "path";

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./upload",
    createParentPath: true,
  })
);

// app.use(express.static(path.resolve("../Frontend")));
app.use(express.static(path.resolve("../Frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/recipe", recipeRoutes);

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve("../Frontend/index.html"));
// });
app.get("*", (req, res) => {
  res.sendFile(
    path.join(path.resolve("../Frontend/dist"), "index.html"),
    (err) => {
      if (err) {
        console.error("Error al servir index.html:", err);
        res.status(500).send("Error al servir la aplicación.");
      }
    }
  );
});

try {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Something is wrong waiting to connectDB", error);
}
