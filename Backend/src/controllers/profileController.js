import fs from "fs-extra";
import User from "../models/UserModel.js";
import { deleteImage, uploadImage, findImage } from "../libs/cloudinary.js";

export const updateProfile = async (req, res) => {
  try {
    const { username, birthdate, gender, country, dietaryPreferences } =
      req.body;

    const userUpdated = await User.findByIdAndUpdate(
      req.params.id,
      { username, birthdate, gender, country, dietaryPreferences },
      { new: true }
    );

    res.json(userUpdated);
  } catch (error) {
    console.error({
      message: "Something went wrong on update profile (updateProfile)",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on update profile (updateProfile)",
      error: error,
    });

    throw new Error({
      message: "Something went wrong on update profile (updateProfile)",
      error: error,
    });
  }
};

export const profilePicture = async (req, res) => {
  try {
    let photo = null;
    const user = await User.findById(req.params.id);

    if (user.profilePicture?.public_id) {
      await deleteImage(user.profilePicture.public_id);
    }

    if (req.files.profilePicture) {
      const result = await uploadImage(req.files.profilePicture.tempFilePath);

      photo = { url: result.secure_url, public_id: result.public_id };

      await fs.remove(req.files.profilePicture.tempFilePath);
    }

    const userUpdated = await User.findByIdAndUpdate(
      req.params.id,
      { profilePicture: photo },
      { new: true }
    );

    res.json(userUpdated);
  } catch (error) {
    console.error({
      message: "Something went wrong on profile picture (profilePicture)",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on profile picture (profilePicture)",
      error: error,
    });

    throw new Error({
      message: "Something went wrong on profile picture (profilePicture)",
      error: error,
    });
  }
};

export const uploadPhotos = async (req, res) => {
  try {
    const photos = {};

    const user = await User.findById(req.params.id);

    if (req.files) {
      for (const key in req.files) {
        const file = req.files[key];
        const nameFile = req.files[key].name.split(".");

        const findFile = await findImage(file.name);

        if (findFile.total_count === 0) {
          const result = await uploadImage(
            req.files[key].tempFilePath,
            req.files[key].name
          );

          photos[nameFile[0]] = {
            url: result.secure_url,
            public_id: result.public_id,
            name: req.files[key].name,
            data: req.files[key].data,
            type: req.files[key].mimetype,
          };
        } else {
          if (user.photos) {
            user.photos.forEach((value, key) => {
              if (value.name === findFile.resources[0].filename) {
                photos[nameFile[0]] = {
                  url: value.url,
                  public_id: value.public_id,
                  name: value.name,
                  data: value.data,
                  type: value.type,
                };
              }
            });
          }
        }

        await fs.remove(req.files[key].tempFilePath);
      }
    }

    const userUpdated = await User.findByIdAndUpdate(
      req.params.id,
      { photos: photos },
      { new: true }
    );

    res.json(userUpdated);
  } catch (error) {
    console.error({
      message: "Something went wrong on upload photos (uploadPhotos)",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on upload photos (uploadPhotos)",
      error: error,
    });

    throw new Error({
      message: "Something went wrong on upload photos (uploadPhotos)",
      error: error,
    });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const delImage = await deleteImage(req.body.public_id);

    if (user.photos) {
      user.photos.forEach((value, key) => {
        if (value.public_id === req.body.public_id) {
          user.photos.delete(key);
        }
      });
    }

    const userUpdated = await User.findByIdAndUpdate(req.params.id, user, {
      new: true,
    });

    res.json(userUpdated);
  } catch (error) {
    console.error({
      message: "Something went wrong on delete photo (deletePhoto)",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on delete photo (deletePhoto)",
      error: error,
    });

    throw new Error({
      message: "Something went wrong on delete photo (deletePhoto)",
      error: error,
    });
  }
};
