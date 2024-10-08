import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, API_KEY, API_SECRET } from "../config/config.js";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export const uploadImage = async (filePath, fileName) => {
  return await cloudinary.uploader.upload(filePath, {
    public_id: fileName,
    folder: "profile",
  });
};

export const deleteImage = async (id) => {
  return await cloudinary.uploader.destroy(id);
};

export const findImage = async (fileName) => {
  return await cloudinary.search
    .expression(`folder:profile AND filename="${fileName}"`)
    .execute();
};
