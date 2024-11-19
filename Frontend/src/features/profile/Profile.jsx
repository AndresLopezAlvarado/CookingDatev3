import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdAddAPhoto } from "react-icons/md";
import { FaFileImage } from "react-icons/fa";
import { differenceInYears, parseISO } from "date-fns";
import { selectCurrentUser } from "../auth/authSlice";
import ProfileModal from "./ProfileModal";
import UploadPhotosModal from "./UploadPhotosModal";
import { useProfilePictureMutation } from "./profileApiSlice";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const [profilePicture, { isLoading }] = useProfilePictureMutation();
  const inputFileRef = useRef(null);
  const params = useParams();
  const [age, setAge] = useState(null);
  const [isOpen, setIsOpen] = useState({
    editProfile: false,
    uploadPhotos: false,
  });
  const { t } = useTranslation(["profile"]);

  const photoProfile = () => {
    inputFileRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        await profilePicture({
          userId: params.id,
          profilePicture: file,
        }).unwrap();
      } catch (error) {
        throw new Error(error);
      }
    }
  };

  const toggleModal = (t) => {
    if (t) {
      switch (t.target.id) {
        case "editProfile":
          setIsOpen({ editProfile: true, uploadPhotos: false });
          break;

        case "uploadPhotos":
          setIsOpen({ editProfile: false, uploadPhotos: true });
          break;

        default:
          setIsOpen({ editProfile: false, uploadPhotos: false });
          break;
      }
    } else {
      setIsOpen({ editProfile: false, uploadPhotos: false });
    }
  };

  async function loadAge() {
    var agePerson = null;

    if (user) {
      if (user.birthdate) {
        agePerson = differenceInYears(new Date(), parseISO(user.birthdate));

        setAge(agePerson);
      } else {
        setAge(0);
      }
    }
  }

  useEffect(() => {
    loadAge();
  }, [user]);

  return (
    <div className="h-[calc(100vh-4rem)] w-full p-1 gap-y-6 flex flex-col overflow-y-auto">
      {/* Profile */}
      <div className="gap-y-3 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">{user.username}</h1>

        {/* Photo profile */}
        <div className="relative w-5/6 flex flex-col items-center justify-center">
          <img
            src={
              user.profilePicture
                ? user.profilePicture.url
                : "/noProfilePhoto.png"
            }
            onClick={photoProfile}
            className="w-auto mx-auto h-[25vh] rounded-full cursor-pointer object-cover"
          />

          <MdAddAPhoto
            onClick={photoProfile}
            className="absolute top-1/2 right-0 h-1/4 w-1/4 p-2 bg-[#FF9500] hover:bg-[#FFCC00] rounded-full cursor-pointer"
          />

          <input
            type="file"
            name="image"
            ref={inputFileRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Info */}
        <div className="text-center text-xl">
          {age !== 0 && (
            <h2>
              <span className="font-bold">{age}</span> {t("title.t1")}
            </h2>
          )}

          {user.country && (
            <h3>
              <span className="font-bold">{t("title.t2")}:</span> {user.country}
            </h3>
          )}

          {user.gender && (
            <h4>
              <span className="font-bold">{t("title.t3")}:</span> {user.gender}
            </h4>
          )}

          {user.dietaryPreferences && (
            <h5>
              <span className="font-bold">{t("title.t4")}:</span>{" "}
              {user.dietaryPreferences}
            </h5>
          )}
        </div>

        {/* Edit profile button */}
        <button
          id="editProfile"
          className="bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md"
          onClick={toggleModal}
        >
          {t("button.b1")}
        </button>
      </div>

      {/* Upload photos */}
      <div className="gap-y-3 flex flex-col items-center justify-center">
        {user.photos ? (
          <div className="grid grid-cols-3 gap-2">
            {Object.values(user.photos).map((photo, index) => (
              <img
                src={photo.url}
                alt={`Photo ${index}`}
                className="w-full h-full rounded-md"
                key={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center space-y-2">
            <FaFileImage className="w-48 h-48" />

            <h1>{t("title.t5")}</h1>
          </div>
        )}

        <button
          id="uploadPhotos"
          className="bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md"
          onClick={toggleModal}
        >
          {t("button.b2")}
        </button>
      </div>

      <ProfileModal
        isOpen={isOpen.editProfile}
        toggleModal={toggleModal}
        user={user}
      />

      <UploadPhotosModal
        isOpen={isOpen.uploadPhotos}
        toggleModal={toggleModal}
      />
    </div>
  );
};

export default Profile;
