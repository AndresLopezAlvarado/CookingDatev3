const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 transition-opacity" onClick={onClose}>
              <div className="absolute inset-0 bg-[#FF3B30] opacity-45"></div>
            </div>

            <div className="relative mt-20 mb-8 bg-[#FF3B30] rounded-md w-5/6 p-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
