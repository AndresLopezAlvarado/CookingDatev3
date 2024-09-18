import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import ProfileForm from "./ProfileForm";
import { useUpdateProfileMutation } from "./profileApiSlice";

const ProfileModal = ({ isOpen, toggleModal, user }) => {
  const navigate = useNavigate();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSubmit = async (data, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await updateProfile({ userId: user._id, formData: data });

      toggleModal();

      navigate(`/profile/${user._id}`);
    } catch (error) {
      throw new Error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={toggleModal}>
      <ProfileForm
        onSubmit={handleSubmit}
        toggleModal={toggleModal}
        user={user}
      />
    </Modal>
  );
};

export default ProfileModal;
