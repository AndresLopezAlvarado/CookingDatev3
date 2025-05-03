import { useEffect, useState } from "react";
import { FaFileImage } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCurrentUser } from "../auth/authSlice";
import {
  useDeletePhotoMutation,
  useUploadPhotosMutation,
} from "./profileApiSlice";
import { useTranslation } from "react-i18next";

const PhotoGallery = ({ toggleModal }) => {
  const user = useSelector(selectCurrentUser);
  const [uploadPhotos, { isLoading }] = useUploadPhotosMutation();
  const [deletePhoto] = useDeletePhotoMutation();
  const params = useParams();
  const [dataUser, setDataUser] = useState(null);
  const [savedPhotos, setSavedPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const { t } = useTranslation(["profile"]);

  const handleDragStart = (event, index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, targetIndex) => {
    event.preventDefault();

    const updatedPhotos = [...savedPhotos];
    const draggedPhoto = updatedPhotos[draggedIndex];
    updatedPhotos.splice(draggedIndex, 1);
    updatedPhotos.splice(targetIndex, 0, draggedPhoto);

    setSavedPhotos(updatedPhotos);
    setDraggedIndex(null);
  };

  const handleDelete = async (index, photoToDelete) => {
    const updatedPhotos = [...savedPhotos];
    const name = updatedPhotos[index].public_id.match(/profile\/(.+)/);
    updatedPhotos.splice(index, 1);
    setSavedPhotos(updatedPhotos);

    var updatedPhotoFiles = [...photoFiles];
    updatedPhotoFiles = updatedPhotoFiles.filter(
      (file) => file.name !== name[1]
    );
    setPhotoFiles(updatedPhotoFiles);

    try {
      await deletePhoto({ userId: dataUser._id, photo: photoToDelete });
    } catch (error) {
      throw new Error(error);
    }

    setDataUser(user);
  };

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    const newPhotoFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newPhotoFiles.push(file);

      setSavedPhotos((prevPhotos) => [
        ...prevPhotos,
        { url: url, public_id: `profile/${file.name}` },
      ]);
    }

    setPhotoFiles((prevPhotoFiles) => [...prevPhotoFiles, ...newPhotoFiles]);
  };

  const uploadPhotoFiles = async () => {
    var photosUser = {};
    if (dataUser.photos) photosUser = dataUser.photos;
    const filePhotosUser = Object.values(photosUser).map(imageToBlob);
    const allPhotoFiles = photoFiles.concat(filePhotosUser);

    const sortedFiles = savedPhotos.map(({ public_id }) => {
      const file = allPhotoFiles.find((file) =>
        file.name.includes(public_id.split("/").pop())
      );
      return file;
    });

    try {
      await uploadPhotos({ userId: params.id, photos: sortedFiles }).unwrap();
    } catch (error) {
      throw new Error(error);
    }

    setDataUser(user);

    if (user.photos) {
      setSavedPhotos(
        Object.values(user.photos).map((image) => ({
          url: image.url,
          public_id: image.public_id,
        }))
      );
    }
  };

  const imageToBlob = (image) => {
    const blob = new Blob([image.data], { type: image.type });
    return new File([blob], image.name, { type: image.type });
  };

  useEffect(() => {
    async function loadUser() {
      setDataUser(user);
      if (user.photos) {
        setSavedPhotos(
          Object.values(user.photos).map((photo) => ({
            url: photo.url,
            public_id: photo.public_id,
          }))
        );
      }
    }

    loadUser();
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-3xl font-bold">{t("form.f8")}</h1>

      <div className="flex flex-col gap-2 items-center">
        {savedPhotos.length === 0 ? (
          <div className="flex flex-col justify-center items-center space-y-2">
            <FaFileImage className="w-48 h-48" />

            <h1>{t("form.f9")}</h1>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
            {savedPhotos.map((photo, index) => (
              <div
                key={index}
                draggable
                onDragStart={(event) => handleDragStart(event, index)}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, index)}
                className="relative"
              >
                <img
                  src={photo.url}
                  alt={`Photo ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />

                <button
                  onClick={() => {
                    handleDelete(index, photo);
                  }}
                  className="absolute top-1 right-1 h-6 w-6 bg-secondary hover:bg-tertiary text-sm font-bold rounded-full"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-tertiary flex gap-2 p-1 rounded-md items-center">
          <input
            id="fileInput"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />

          <label
            htmlFor="fileInput"
            className="bg-secondary hover:bg-tertiary hover:ring-secondary hover:ring-2 font-bold p-1 rounded-md"
          >
            {t("button.b4")}
          </label>

          <p className="text-primary">
            {photoFiles?.length === 0
              ? t("title.t6")
              : photoFiles?.length === 1
              ? `${photoFiles[0].name}`
              : `${photoFiles.length} ${t("title.t7")}`}
          </p>
        </div>
      </div>

      <button
        id="closeUploadPhotos"
        className="bg-secondary hover:bg-tertiary font-bold p-2 rounded-md"
        disabled={isLoading}
        onClick={() => {
          toggleModal();
          uploadPhotoFiles();
        }}
      >
        {isLoading ? (
          <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
        ) : (
          t("button.b3")
        )}
      </button>
    </div>
  );
};

export default PhotoGallery;
