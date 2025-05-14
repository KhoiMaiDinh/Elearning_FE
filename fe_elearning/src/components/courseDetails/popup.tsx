import React from 'react';

interface PopupProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ onClose, children }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black dark:bg-AntiFlashWhite dark:bg-opacity-40 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-eerieBlack rounded-lg p-4 shadow-lg w-full max-w-4xl h-3/4 overflow-auto max-h-2/3"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-2">
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
