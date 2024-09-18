import Modal from "../../components/Modal";
import PhotoGallery from "./PhotoGallery";

const UploadPhotosModal = ({ isOpen, toggleModal }) => {
  return (
    <Modal isOpen={isOpen} onClose={toggleModal}>
      <PhotoGallery toggleModal={toggleModal} />
    </Modal>
  );
};

export default UploadPhotosModal;
