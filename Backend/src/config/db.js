import mongoose from "mongoose";
import { MONGODB_URL } from "./config.js";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_URL);

    if (connection)
      console.log(`Connected to (${connection.connection.name}) database`);
  } catch (error) {
    console.error({
      message:
        "Something went wrong on the connection (connectDB) to the database.",
      error: error,
    });

    throw new Error({
      message:
        "Something went wrong on the connection (connectDB) to the database.",
      error: error,
    });
  }
};
