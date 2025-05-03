const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-2">
        <div
          className="fixed inset-0 bg-primary opacity-45"
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="relative w-full sm:w-2/3 lg:w-1/2 xl:w-1/3 p-4 bg-primary rounded-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
