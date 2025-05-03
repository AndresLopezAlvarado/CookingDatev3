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
    <div className="min-h-screen pt-4 pb-4 flex flex-col gap-2">
      {/* Profile */}
      <div className="flex flex-col gap-3 items-center justify-center">
        <h1 className="text-3xl font-bold">{user.username}</h1>

        {/* Photo profile */}
        <div className="relative flex flex-col items-center justify-center">
          <img
            src={user.profilePicture?.url || "/noProfilePhoto.png"}
            onClick={photoProfile}
            className="h-64 object-cover rounded-full cursor-pointer"
          />

          <div
            className="absolute right-0 bottom-0 bg-secondary hover:bg-tertiary h-8 w-8 flex items-center justify-center rounded-full cursor-pointer"
            onClick={photoProfile}
          >
            <MdAddAPhoto />
          </div>

          <input
            type="file"
            name="image"
            ref={inputFileRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Info */}
        <div className="text-center text-xl flex flex-col gap-1">
          {age !== 0 && (
            <h2>
              <span className="font-bold">{age}</span> {t("title.t1")}
            </h2>
          )}

          {[
            { value: user.country, label: t("title.t2") },
            { value: user.gender, label: t("title.t3") },
            { value: user.dietaryPreferences, label: t("title.t4") },
          ]
            .filter((item) => item.value)
            .map(({ value, label }, idx) => (
              <div key={idx}>
                <span className="font-bold">{label}:</span> {value}
              </div>
            ))}
        </div>

        {/* Edit profile button */}
        <button
          id="editProfile"
          className="bg-secondary hover:bg-tertiary font-bold p-2 rounded-md"
          onClick={toggleModal}
        >
          {t("button.b1")}
        </button>
      </div>

      {/* Upload photos */}
      <div className="p-1 sm:p-2 md:p-4 flex flex-col gap-3 items-center justify-center">
        {user.photos && Object.keys(user.photos).length > 0 ? (
          <div className="grid grid-cols-3 gap-1 md:grid-cols-4">
            {Object.values(user.photos).map((photo, index) => (
              <img
                src={photo.url}
                alt={`Photo ${index}`}
                className="w-full h-full object-cover rounded-md"
                key={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center">
            <FaFileImage className="w-48 h-48" />

            <h1>{t("title.t5")}</h1>
          </div>
        )}

        <button
          id="uploadPhotos"
          className="bg-secondary hover:bg-tertiary font-bold p-2 rounded-md"
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
